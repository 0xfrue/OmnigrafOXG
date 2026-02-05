// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IAerodromeRouter.sol";

/**
 * @title FeeCollector
 * @notice Receives taxes from OmniGraphToken and distributes to POL, Treasury, Burn, and Lottery
 * @dev Handles swapping TOKEN to USDC and distribution according to configurable splits
 */
contract FeeCollector is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // ============ Constants ============
    uint16 public constant BPS_DENOMINATOR = 10000;
    uint16 public constant MAX_BURN_BPS = 2000;    // Max 20% burn share
    uint16 public constant MAX_LOTTERY_BPS = 2000; // Max 20% lottery share

    // ============ State Variables ============

    // Core addresses
    IERC20 public immutable token;
    IERC20 public immutable usdc;
    IAerodromeRouter public router;
    address public lpPool;

    // Distribution targets
    address public polManager;
    address public treasury;
    address public lottery;
    address public burnAddress; // Usually 0xdead or address(0)

    // Fee splits (in basis points, must sum to 10000)
    uint16 public polShareBps;      // e.g., 4000 = 40%
    uint16 public treasuryShareBps; // e.g., 3000 = 30%
    uint16 public burnShareBps;     // e.g., 2000 = 20%
    uint16 public lotteryShareBps;  // e.g., 1000 = 10%

    // Thresholds
    uint256 public minProcessAmount; // Minimum TOKEN balance to process
    uint256 public maxSlippageBps;   // Max slippage for swaps (e.g., 300 = 3%)

    // Tracking
    uint256 public totalFeesCollected;
    uint256 public totalUsdcDistributed;
    uint256 public totalTokensBurned;

    // ============ Events ============
    event SplitsUpdated(uint16 polBps, uint16 treasuryBps, uint16 burnBps, uint16 lotteryBps);
    event FeesProcessed(
        uint256 tokenAmount,
        uint256 usdcAmount,
        uint256 polAmount,
        uint256 treasuryAmount,
        uint256 lotteryAmount,
        uint256 burnAmount
    );
    event AddressesUpdated(address polManager, address treasury, address lottery);
    event RouterUpdated(address newRouter, address newPool);
    event ThresholdsUpdated(uint256 minProcessAmount, uint256 maxSlippageBps);
    event EmergencyWithdraw(address token, uint256 amount);

    // ============ Errors ============
    error InvalidSplits();
    error BurnShareTooHigh();
    error LotteryShareTooHigh();
    error ZeroAddress();
    error InsufficientBalance();
    error SlippageTooHigh();

    // ============ Constructor ============
    constructor(
        address token_,
        address usdc_,
        address router_,
        address lpPool_,
        address admin_
    ) {
        if (token_ == address(0) || usdc_ == address(0) || router_ == address(0) || admin_ == address(0)) {
            revert ZeroAddress();
        }

        token = IERC20(token_);
        usdc = IERC20(usdc_);
        router = IAerodromeRouter(router_);
        lpPool = lpPool_;

        // Default splits (Months 0-3)
        polShareBps = 4000;      // 40%
        treasuryShareBps = 3000; // 30%
        burnShareBps = 2000;     // 20%
        lotteryShareBps = 1000;  // 10%

        // Default thresholds
        minProcessAmount = 1000 * 10**18; // 1000 tokens
        maxSlippageBps = 500; // 5% slippage

        // Burn address (dead address)
        burnAddress = 0x000000000000000000000000000000000000dEaD;

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(GOVERNANCE_ROLE, admin_);
        _grantRole(OPERATOR_ROLE, admin_);
    }

    // ============ Admin Functions ============

    /**
     * @notice Set fee split percentages
     * @param polBps POL share in basis points
     * @param treasuryBps Treasury share in basis points
     * @param burnBps Burn share in basis points
     * @param lotteryBps Lottery share in basis points
     */
    function setSplits(
        uint16 polBps,
        uint16 treasuryBps,
        uint16 burnBps,
        uint16 lotteryBps
    ) external onlyRole(GOVERNANCE_ROLE) {
        if (polBps + treasuryBps + burnBps + lotteryBps != BPS_DENOMINATOR) {
            revert InvalidSplits();
        }
        if (burnBps > MAX_BURN_BPS) revert BurnShareTooHigh();
        if (lotteryBps > MAX_LOTTERY_BPS) revert LotteryShareTooHigh();

        polShareBps = polBps;
        treasuryShareBps = treasuryBps;
        burnShareBps = burnBps;
        lotteryShareBps = lotteryBps;

        emit SplitsUpdated(polBps, treasuryBps, burnBps, lotteryBps);
    }

    /**
     * @notice Set distribution addresses
     */
    function setAddresses(
        address polManager_,
        address treasury_,
        address lottery_
    ) external onlyRole(GOVERNANCE_ROLE) {
        if (polManager_ == address(0) || treasury_ == address(0) || lottery_ == address(0)) {
            revert ZeroAddress();
        }
        polManager = polManager_;
        treasury = treasury_;
        lottery = lottery_;
        emit AddressesUpdated(polManager_, treasury_, lottery_);
    }

    /**
     * @notice Set router and pool addresses
     */
    function setRouter(address router_, address lpPool_) external onlyRole(GOVERNANCE_ROLE) {
        if (router_ == address(0)) revert ZeroAddress();
        router = IAerodromeRouter(router_);
        lpPool = lpPool_;
        emit RouterUpdated(router_, lpPool_);
    }

    /**
     * @notice Set processing thresholds
     */
    function setThresholds(
        uint256 minProcessAmount_,
        uint256 maxSlippageBps_
    ) external onlyRole(GOVERNANCE_ROLE) {
        if (maxSlippageBps_ > 1000) revert SlippageTooHigh(); // Max 10% slippage
        minProcessAmount = minProcessAmount_;
        maxSlippageBps = maxSlippageBps_;
        emit ThresholdsUpdated(minProcessAmount_, maxSlippageBps_);
    }

    // ============ Core Functions ============

    /**
     * @notice Process accumulated fees - swap to USDC and distribute
     * @param amountOutMin Minimum USDC to receive from swap
     */
    function processFees(uint256 amountOutMin) external nonReentrant onlyRole(OPERATOR_ROLE) {
        uint256 tokenBalance = token.balanceOf(address(this));
        if (tokenBalance < minProcessAmount) revert InsufficientBalance();

        // Calculate burn amount (keep as TOKEN)
        uint256 burnAmount = (tokenBalance * burnShareBps) / BPS_DENOMINATOR;
        uint256 swapAmount = tokenBalance - burnAmount;

        // Swap TOKEN to USDC
        uint256 usdcReceived = _swapTokenToUsdc(swapAmount, amountOutMin);

        // Calculate distributions
        uint256 remainingBps = BPS_DENOMINATOR - burnShareBps;
        uint256 polAmount = (usdcReceived * polShareBps) / remainingBps;
        uint256 treasuryAmount = (usdcReceived * treasuryShareBps) / remainingBps;
        uint256 lotteryAmount = usdcReceived - polAmount - treasuryAmount;

        // Distribute USDC
        if (polAmount > 0 && polManager != address(0)) {
            usdc.safeTransfer(polManager, polAmount);
        }
        if (treasuryAmount > 0 && treasury != address(0)) {
            usdc.safeTransfer(treasury, treasuryAmount);
        }
        if (lotteryAmount > 0 && lottery != address(0)) {
            usdc.safeTransfer(lottery, lotteryAmount);
        }

        // Burn TOKEN
        if (burnAmount > 0) {
            token.safeTransfer(burnAddress, burnAmount);
            totalTokensBurned += burnAmount;
        }

        // Update tracking
        totalFeesCollected += tokenBalance;
        totalUsdcDistributed += usdcReceived;

        emit FeesProcessed(tokenBalance, usdcReceived, polAmount, treasuryAmount, lotteryAmount, burnAmount);
    }

    /**
     * @notice Get expected USDC output for current token balance
     */
    function getExpectedOutput() external view returns (uint256 expectedUsdc) {
        uint256 tokenBalance = token.balanceOf(address(this));
        if (tokenBalance == 0) return 0;

        uint256 burnAmount = (tokenBalance * burnShareBps) / BPS_DENOMINATOR;
        uint256 swapAmount = tokenBalance - burnAmount;

        IAerodromeRouter.Route[] memory routes = new IAerodromeRouter.Route[](1);
        routes[0] = IAerodromeRouter.Route({
            from: address(token),
            to: address(usdc),
            stable: false,
            factory: router.defaultFactory()
        });

        try router.getAmountsOut(swapAmount, routes) returns (uint256[] memory amounts) {
            expectedUsdc = amounts[1];
        } catch {
            expectedUsdc = 0;
        }
    }

    // ============ Internal Functions ============

    function _swapTokenToUsdc(uint256 tokenAmount, uint256 amountOutMin) internal returns (uint256) {
        // Approve router
        token.safeIncreaseAllowance(address(router), tokenAmount);

        // Build route
        IAerodromeRouter.Route[] memory routes = new IAerodromeRouter.Route[](1);
        routes[0] = IAerodromeRouter.Route({
            from: address(token),
            to: address(usdc),
            stable: false,
            factory: router.defaultFactory()
        });

        uint256 balanceBefore = usdc.balanceOf(address(this));

        // Execute swap with fee-on-transfer support
        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            amountOutMin,
            routes,
            address(this),
            block.timestamp + 300 // 5 minute deadline
        );

        return usdc.balanceOf(address(this)) - balanceBefore;
    }

    // ============ Emergency Functions ============

    /**
     * @notice Emergency withdraw tokens (governance only)
     * @param tokenAddress Token to withdraw
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        address tokenAddress,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20(tokenAddress).safeTransfer(msg.sender, amount);
        emit EmergencyWithdraw(tokenAddress, amount);
    }

    // ============ View Functions ============

    /**
     * @notice Get current pending fees
     */
    function pendingFees() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /**
     * @notice Check if fees can be processed
     */
    function canProcess() external view returns (bool) {
        return token.balanceOf(address(this)) >= minProcessAmount;
    }
}
