// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./interfaces/IAerodromeRouter.sol";

/**
 * @title POLManager
 * @notice Manages Protocol-Owned Liquidity - adds liquidity and performs buybacks
 * @dev Receives USDC from FeeCollector, buys TOKEN, and adds liquidity to Aerodrome
 */
contract POLManager is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // ============ State Variables ============

    // Core addresses
    IERC20 public immutable token;
    IERC20 public immutable usdc;
    IAerodromeRouter public router;
    IERC20 public lpToken;

    // Destinations
    address public lpTimelock; // Where LP tokens are sent
    address public burnAddress;

    // Thresholds
    uint256 public minBuybackUsdc;   // Min USDC to trigger buyback
    uint256 public minLpAddUsdc;     // Min USDC to trigger LP add
    uint256 public maxSlippageBps;   // Max slippage (e.g., 500 = 5%)

    // Buyback configuration
    uint16 public buybackBurnBps;    // % of bought tokens to burn (e.g., 5000 = 50%)
    uint16 public constant BPS_DENOMINATOR = 10000;

    // Tracking
    uint256 public totalUsdcReceived;
    uint256 public totalLiquidityAdded;
    uint256 public totalTokensBought;
    uint256 public totalTokensBurned;

    // ============ Events ============
    event LiquidityAdded(uint256 usdcAmount, uint256 tokenAmount, uint256 lpReceived);
    event BuybackExecuted(uint256 usdcSpent, uint256 tokensBought, uint256 tokensBurned);
    event LPTokensLocked(uint256 amount, address lpTimelock);
    event ThresholdsUpdated(uint256 minBuybackUsdc, uint256 minLpAddUsdc, uint256 maxSlippageBps);
    event AddressesUpdated(address lpTimelock, address burnAddress);
    event BuybackConfigUpdated(uint16 buybackBurnBps);

    // ============ Errors ============
    error ZeroAddress();
    error InsufficientBalance();
    error SlippageTooHigh();

    // ============ Constructor ============
    constructor(
        address token_,
        address usdc_,
        address router_,
        address lpToken_,
        address lpTimelock_,
        address admin_
    ) {
        if (token_ == address(0) || usdc_ == address(0) || router_ == address(0) || admin_ == address(0)) {
            revert ZeroAddress();
        }

        token = IERC20(token_);
        usdc = IERC20(usdc_);
        router = IAerodromeRouter(router_);
        lpToken = IERC20(lpToken_);
        lpTimelock = lpTimelock_;

        // Default burn address
        burnAddress = 0x000000000000000000000000000000000000dEaD;

        // Default thresholds
        minBuybackUsdc = 1000 * 10**6;  // 1000 USDC
        minLpAddUsdc = 5000 * 10**6;    // 5000 USDC
        maxSlippageBps = 500;           // 5%

        // Default buyback config - 50% burn, 50% to LP
        buybackBurnBps = 5000;

        // Setup roles
        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(GOVERNANCE_ROLE, admin_);
        _grantRole(OPERATOR_ROLE, admin_);
    }

    // ============ Admin Functions ============

    /**
     * @notice Set threshold amounts
     */
    function setThresholds(
        uint256 minBuybackUsdc_,
        uint256 minLpAddUsdc_,
        uint256 maxSlippageBps_
    ) external onlyRole(GOVERNANCE_ROLE) {
        if (maxSlippageBps_ > 1000) revert SlippageTooHigh(); // Max 10%
        minBuybackUsdc = minBuybackUsdc_;
        minLpAddUsdc = minLpAddUsdc_;
        maxSlippageBps = maxSlippageBps_;
        emit ThresholdsUpdated(minBuybackUsdc_, minLpAddUsdc_, maxSlippageBps_);
    }

    /**
     * @notice Set destination addresses
     */
    function setAddresses(
        address lpTimelock_,
        address burnAddress_
    ) external onlyRole(GOVERNANCE_ROLE) {
        if (lpTimelock_ == address(0)) revert ZeroAddress();
        lpTimelock = lpTimelock_;
        burnAddress = burnAddress_;
        emit AddressesUpdated(lpTimelock_, burnAddress_);
    }

    /**
     * @notice Set buyback burn percentage
     */
    function setBuybackBurnBps(uint16 bps_) external onlyRole(GOVERNANCE_ROLE) {
        require(bps_ <= BPS_DENOMINATOR, "Invalid bps");
        buybackBurnBps = bps_;
        emit BuybackConfigUpdated(bps_);
    }

    /**
     * @notice Update router address
     */
    function setRouter(address router_) external onlyRole(GOVERNANCE_ROLE) {
        if (router_ == address(0)) revert ZeroAddress();
        router = IAerodromeRouter(router_);
    }

    /**
     * @notice Update LP token address
     */
    function setLpToken(address lpToken_) external onlyRole(GOVERNANCE_ROLE) {
        if (lpToken_ == address(0)) revert ZeroAddress();
        lpToken = IERC20(lpToken_);
    }

    // ============ Core Functions ============

    /**
     * @notice Add liquidity using all available USDC
     * @param minTokensOut Minimum tokens to receive when buying
     * @param minLpOut Minimum LP tokens to receive
     */
    function addLiquidityAll(
        uint256 minTokensOut,
        uint256 minLpOut
    ) external nonReentrant onlyRole(OPERATOR_ROLE) {
        uint256 usdcBalance = usdc.balanceOf(address(this));
        if (usdcBalance < minLpAddUsdc) revert InsufficientBalance();

        // Use half to buy tokens, keep half for LP
        uint256 usdcForBuy = usdcBalance / 2;
        uint256 usdcForLp = usdcBalance - usdcForBuy;

        // Buy tokens
        uint256 tokensBought = _buyTokens(usdcForBuy, minTokensOut);

        // Add liquidity
        _addLiquidity(usdcForLp, tokensBought, minLpOut);

        totalUsdcReceived += usdcBalance;
    }

    /**
     * @notice Execute buyback - buy tokens and optionally burn portion
     * @param usdcAmount Amount of USDC to use
     * @param minTokensOut Minimum tokens to receive
     */
    function buyback(
        uint256 usdcAmount,
        uint256 minTokensOut
    ) external nonReentrant onlyRole(OPERATOR_ROLE) {
        uint256 usdcBalance = usdc.balanceOf(address(this));
        if (usdcAmount > usdcBalance) revert InsufficientBalance();
        if (usdcAmount < minBuybackUsdc) revert InsufficientBalance();

        // Buy tokens
        uint256 tokensBought = _buyTokens(usdcAmount, minTokensOut);

        // Calculate burn amount
        uint256 burnAmount = (tokensBought * buybackBurnBps) / BPS_DENOMINATOR;

        // Burn portion
        if (burnAmount > 0 && burnAddress != address(0)) {
            token.safeTransfer(burnAddress, burnAmount);
            totalTokensBurned += burnAmount;
        }

        totalTokensBought += tokensBought;

        emit BuybackExecuted(usdcAmount, tokensBought, burnAmount);
    }

    /**
     * @notice Buyback and add remaining to LP
     * @param usdcAmount Amount of USDC to use
     * @param minTokensOut Minimum tokens from buyback
     * @param minLpOut Minimum LP tokens to receive
     */
    function buybackAndAddLiquidity(
        uint256 usdcAmount,
        uint256 minTokensOut,
        uint256 minLpOut
    ) external nonReentrant onlyRole(OPERATOR_ROLE) {
        uint256 usdcBalance = usdc.balanceOf(address(this));
        if (usdcAmount > usdcBalance) revert InsufficientBalance();

        // Split USDC: half for buying, half for LP pairing
        uint256 usdcForBuy = usdcAmount / 2;
        uint256 usdcForLp = usdcAmount - usdcForBuy;

        // Buy tokens
        uint256 tokensBought = _buyTokens(usdcForBuy, minTokensOut);

        // Calculate burn and LP amounts
        uint256 burnAmount = (tokensBought * buybackBurnBps) / BPS_DENOMINATOR;
        uint256 tokensForLp = tokensBought - burnAmount;

        // Burn portion
        if (burnAmount > 0 && burnAddress != address(0)) {
            token.safeTransfer(burnAddress, burnAmount);
            totalTokensBurned += burnAmount;
        }

        // Add liquidity with remaining
        _addLiquidity(usdcForLp, tokensForLp, minLpOut);

        totalTokensBought += tokensBought;

        emit BuybackExecuted(usdcForBuy, tokensBought, burnAmount);
    }

    /**
     * @notice Lock any LP tokens held by this contract
     */
    function lockLpTokens() external nonReentrant onlyRole(OPERATOR_ROLE) {
        uint256 lpBalance = lpToken.balanceOf(address(this));
        if (lpBalance == 0) revert InsufficientBalance();
        if (lpTimelock == address(0)) revert ZeroAddress();

        lpToken.safeTransfer(lpTimelock, lpBalance);
        emit LPTokensLocked(lpBalance, lpTimelock);
    }

    // ============ Internal Functions ============

    function _buyTokens(uint256 usdcAmount, uint256 minTokensOut) internal returns (uint256) {
        // Approve router
        usdc.safeIncreaseAllowance(address(router), usdcAmount);

        // Build route
        IAerodromeRouter.Route[] memory routes = new IAerodromeRouter.Route[](1);
        routes[0] = IAerodromeRouter.Route({
            from: address(usdc),
            to: address(token),
            stable: false,
            factory: router.defaultFactory()
        });

        uint256 balanceBefore = token.balanceOf(address(this));

        // Execute swap
        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            usdcAmount,
            minTokensOut,
            routes,
            address(this),
            block.timestamp + 300
        );

        return token.balanceOf(address(this)) - balanceBefore;
    }

    function _addLiquidity(
        uint256 usdcAmount,
        uint256 tokenAmount,
        uint256 minLpOut
    ) internal {
        // Approve router
        usdc.safeIncreaseAllowance(address(router), usdcAmount);
        token.safeIncreaseAllowance(address(router), tokenAmount);

        uint256 lpBefore = lpToken.balanceOf(address(this));

        // Add liquidity
        router.addLiquidity(
            address(token),
            address(usdc),
            false, // volatile pool
            tokenAmount,
            usdcAmount,
            (tokenAmount * (BPS_DENOMINATOR - maxSlippageBps)) / BPS_DENOMINATOR,
            (usdcAmount * (BPS_DENOMINATOR - maxSlippageBps)) / BPS_DENOMINATOR,
            address(this),
            block.timestamp + 300
        );

        uint256 lpReceived = lpToken.balanceOf(address(this)) - lpBefore;
        require(lpReceived >= minLpOut, "Insufficient LP received");

        totalLiquidityAdded += lpReceived;

        emit LiquidityAdded(usdcAmount, tokenAmount, lpReceived);

        // Auto-lock LP tokens
        if (lpTimelock != address(0) && lpReceived > 0) {
            lpToken.safeTransfer(lpTimelock, lpReceived);
            emit LPTokensLocked(lpReceived, lpTimelock);
        }
    }

    // ============ View Functions ============

    /**
     * @notice Get current USDC balance
     */
    function usdcBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    /**
     * @notice Get current TOKEN balance
     */
    function tokenBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    /**
     * @notice Get current LP token balance
     */
    function lpBalance() external view returns (uint256) {
        return lpToken.balanceOf(address(this));
    }

    /**
     * @notice Check if can execute buyback
     */
    function canBuyback() external view returns (bool) {
        return usdc.balanceOf(address(this)) >= minBuybackUsdc;
    }

    /**
     * @notice Check if can add liquidity
     */
    function canAddLiquidity() external view returns (bool) {
        return usdc.balanceOf(address(this)) >= minLpAddUsdc;
    }

    // ============ Emergency Functions ============

    /**
     * @notice Emergency withdraw (admin only)
     */
    function emergencyWithdraw(
        address tokenAddress,
        uint256 amount,
        address to
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20(tokenAddress).safeTransfer(to, amount);
    }

    /**
     * @notice Receive function to accept native ETH if needed
     */
    receive() external payable {}
}
