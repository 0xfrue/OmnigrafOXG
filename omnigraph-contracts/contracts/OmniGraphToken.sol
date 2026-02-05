// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title OmniGraphToken
 * @notice ERC20 token with dynamic buy/sell taxes, anti-bot protection, and burn mechanisms
 * @dev Implements bounded taxes, launch protection, and fee routing to FeeCollector
 */
contract OmniGraphToken is ERC20, ERC20Permit, ERC20Burnable, Ownable, Pausable, ReentrancyGuard {
    // ============ Constants ============
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint16 public constant MAX_BUY_TAX_BPS = 300;   // 3% max buy tax
    uint16 public constant MAX_SELL_TAX_BPS = 700;  // 7% max sell tax
    uint16 public constant BPS_DENOMINATOR = 10000;

    // ============ State Variables ============

    // Fee collection
    address public feeCollector;
    address public lpPair;

    // Tax settings (in basis points)
    uint16 public buyTaxBps;
    uint16 public sellTaxBps;

    // Launch protection
    bool public tradingEnabled;
    uint256 public launchBlock;
    uint256 public launchTimestamp;

    // Anti-whale limits
    uint256 public maxTxAmount;
    uint256 public maxWalletAmount;
    bool public limitsInEffect;

    // Sniper protection (elevated tax for first N blocks)
    uint256 public sniperProtectionBlocks;
    uint16 public sniperSellTaxBps; // Higher sell tax during sniper protection

    // Burn tracking
    uint256 public totalBurned;
    uint256 public immutable maxBurnable;

    // Exclusions
    mapping(address => bool) public isExcludedFromFees;
    mapping(address => bool) public isExcludedFromLimits;

    // ============ Events ============
    event TradingEnabled(uint256 blockNumber, uint256 timestamp);
    event TaxesUpdated(uint16 buyTaxBps, uint16 sellTaxBps);
    event LimitsUpdated(uint256 maxTxAmount, uint256 maxWalletAmount, bool limitsInEffect);
    event FeeCollectorUpdated(address indexed oldCollector, address indexed newCollector);
    event LpPairUpdated(address indexed oldPair, address indexed newPair);
    event ExcludedFromFees(address indexed account, bool excluded);
    event ExcludedFromLimits(address indexed account, bool excluded);
    event TokensBurned(address indexed burner, uint256 amount);
    event SniperProtectionUpdated(uint256 blocks, uint16 sellTaxBps);

    // ============ Errors ============
    error TradingNotEnabled();
    error BuyTaxTooHigh();
    error SellTaxTooHigh();
    error ZeroAddress();
    error ExceedsBurnCap();
    error TransferExceedsMaxTx();
    error TransferExceedsMaxWallet();
    error LimitsAlreadyDisabled();
    error TradingAlreadyEnabled();

    // ============ Constructor ============
    constructor(
        string memory name_,
        string memory symbol_,
        address feeCollector_,
        uint256 maxBurnable_,
        address initialOwner
    ) ERC20(name_, symbol_) ERC20Permit(name_) Ownable(initialOwner) {
        if (feeCollector_ == address(0)) revert ZeroAddress();
        if (maxBurnable_ > MAX_SUPPLY) maxBurnable_ = MAX_SUPPLY * 30 / 100; // Default 30%

        feeCollector = feeCollector_;
        maxBurnable = maxBurnable_;

        // Initial tax rates (Months 0-3 schedule)
        buyTaxBps = 300;  // 3%
        sellTaxBps = 700; // 7%

        // Launch limits: 1% max tx, 2% max wallet
        maxTxAmount = MAX_SUPPLY / 100;      // 1%
        maxWalletAmount = MAX_SUPPLY * 2 / 100; // 2%
        limitsInEffect = true;

        // Sniper protection: 10 blocks with max sell tax
        sniperProtectionBlocks = 10;
        sniperSellTaxBps = 700; // Max sell tax during sniper protection

        // Exclude system contracts from fees
        isExcludedFromFees[address(this)] = true;
        isExcludedFromFees[feeCollector_] = true;
        isExcludedFromFees[initialOwner] = true;

        // Exclude system contracts from limits
        isExcludedFromLimits[address(this)] = true;
        isExcludedFromLimits[feeCollector_] = true;
        isExcludedFromLimits[initialOwner] = true;

        // Mint entire supply to deployer for distribution
        _mint(initialOwner, MAX_SUPPLY);
    }

    // ============ Admin Functions ============

    /**
     * @notice Set the fee collector contract address
     * @param collector_ New fee collector address
     */
    function setFeeCollector(address collector_) external onlyOwner {
        if (collector_ == address(0)) revert ZeroAddress();
        address oldCollector = feeCollector;
        feeCollector = collector_;

        // Update exclusions
        isExcludedFromFees[oldCollector] = false;
        isExcludedFromFees[collector_] = true;
        isExcludedFromLimits[oldCollector] = false;
        isExcludedFromLimits[collector_] = true;

        emit FeeCollectorUpdated(oldCollector, collector_);
    }

    /**
     * @notice Set the LP pair address (DEX pool)
     * @param pair_ LP pair address
     */
    function setLpPair(address pair_) external onlyOwner {
        if (pair_ == address(0)) revert ZeroAddress();
        address oldPair = lpPair;
        lpPair = pair_;

        // LP pair excluded from limits but NOT from fees
        isExcludedFromLimits[pair_] = true;

        emit LpPairUpdated(oldPair, pair_);
    }

    /**
     * @notice Set buy tax rate (bounded by MAX_BUY_TAX_BPS)
     * @param bps_ New buy tax in basis points
     */
    function setBuyTaxBps(uint16 bps_) external onlyOwner {
        if (bps_ > MAX_BUY_TAX_BPS) revert BuyTaxTooHigh();
        buyTaxBps = bps_;
        emit TaxesUpdated(buyTaxBps, sellTaxBps);
    }

    /**
     * @notice Set sell tax rate (bounded by MAX_SELL_TAX_BPS)
     * @param bps_ New sell tax in basis points
     */
    function setSellTaxBps(uint16 bps_) external onlyOwner {
        if (bps_ > MAX_SELL_TAX_BPS) revert SellTaxTooHigh();
        sellTaxBps = bps_;
        emit TaxesUpdated(buyTaxBps, sellTaxBps);
    }

    /**
     * @notice Enable trading (can only be called once)
     */
    function enableTrading() external onlyOwner {
        if (tradingEnabled) revert TradingAlreadyEnabled();
        tradingEnabled = true;
        launchBlock = block.number;
        launchTimestamp = block.timestamp;
        emit TradingEnabled(block.number, block.timestamp);
    }

    /**
     * @notice Disable limits permanently (one-way)
     */
    function disableLimitsForever() external onlyOwner {
        if (!limitsInEffect) revert LimitsAlreadyDisabled();
        limitsInEffect = false;
        emit LimitsUpdated(maxTxAmount, maxWalletAmount, false);
    }

    /**
     * @notice Update max transaction amount (can only increase or turn off limits)
     * @param amount New max transaction amount
     */
    function setMaxTxAmount(uint256 amount) external onlyOwner {
        require(amount >= maxTxAmount, "Can only increase");
        maxTxAmount = amount;
        emit LimitsUpdated(maxTxAmount, maxWalletAmount, limitsInEffect);
    }

    /**
     * @notice Update max wallet amount (can only increase or turn off limits)
     * @param amount New max wallet amount
     */
    function setMaxWalletAmount(uint256 amount) external onlyOwner {
        require(amount >= maxWalletAmount, "Can only increase");
        maxWalletAmount = amount;
        emit LimitsUpdated(maxTxAmount, maxWalletAmount, limitsInEffect);
    }

    /**
     * @notice Set sniper protection parameters
     * @param blocks_ Number of blocks for elevated protection
     * @param sellTaxBps_ Elevated sell tax during protection (max 7%)
     */
    function setSniperProtection(uint256 blocks_, uint16 sellTaxBps_) external onlyOwner {
        require(!tradingEnabled, "Cannot change after launch");
        if (sellTaxBps_ > MAX_SELL_TAX_BPS) revert SellTaxTooHigh();
        sniperProtectionBlocks = blocks_;
        sniperSellTaxBps = sellTaxBps_;
        emit SniperProtectionUpdated(blocks_, sellTaxBps_);
    }

    /**
     * @notice Exclude/include address from fees
     * @param account Address to update
     * @param excluded Whether to exclude
     */
    function setExcludedFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
        emit ExcludedFromFees(account, excluded);
    }

    /**
     * @notice Exclude/include address from limits
     * @param account Address to update
     * @param excluded Whether to exclude
     */
    function setExcludedFromLimits(address account, bool excluded) external onlyOwner {
        isExcludedFromLimits[account] = excluded;
        emit ExcludedFromLimits(account, excluded);
    }

    /**
     * @notice Pause all transfers (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // ============ View Functions ============

    /**
     * @notice Check if sniper protection is currently active
     */
    function isSniperProtectionActive() public view returns (bool) {
        if (!tradingEnabled) return false;
        return block.number < launchBlock + sniperProtectionBlocks;
    }

    /**
     * @notice Get current effective sell tax (may be elevated during sniper protection)
     */
    function getEffectiveSellTax() public view returns (uint16) {
        if (isSniperProtectionActive()) {
            return sniperSellTaxBps;
        }
        return sellTaxBps;
    }

    /**
     * @notice Get remaining burnable amount
     */
    function remainingBurnable() external view returns (uint256) {
        return maxBurnable > totalBurned ? maxBurnable - totalBurned : 0;
    }

    // ============ Internal Functions ============

    /**
     * @notice Override transfer to implement taxes and limits
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        // Allow minting and burning without restrictions
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }

        // Check if trading is enabled (exempt addresses can always transfer)
        if (!tradingEnabled && !isExcludedFromFees[from] && !isExcludedFromFees[to]) {
            revert TradingNotEnabled();
        }

        // Apply limits if in effect
        if (limitsInEffect) {
            _checkLimits(from, to, amount);
        }

        // Determine if this is a buy, sell, or transfer
        bool isBuy = from == lpPair && !isExcludedFromFees[to];
        bool isSell = to == lpPair && !isExcludedFromFees[from];

        uint256 feeAmount = 0;

        if (isBuy) {
            feeAmount = (amount * buyTaxBps) / BPS_DENOMINATOR;
        } else if (isSell) {
            uint16 effectiveSellTax = getEffectiveSellTax();
            feeAmount = (amount * effectiveSellTax) / BPS_DENOMINATOR;
        }
        // Regular transfers between wallets have no tax

        if (feeAmount > 0) {
            super._update(from, feeCollector, feeAmount);
            amount -= feeAmount;
        }

        super._update(from, to, amount);
    }

    /**
     * @notice Check transaction and wallet limits
     */
    function _checkLimits(address from, address to, uint256 amount) internal view {
        // Skip if either party is excluded from limits
        if (isExcludedFromLimits[from] || isExcludedFromLimits[to]) {
            return;
        }

        // Check max transaction amount
        if (amount > maxTxAmount) {
            revert TransferExceedsMaxTx();
        }

        // Check max wallet amount (only for buys / receives)
        if (to != lpPair && balanceOf(to) + amount > maxWalletAmount) {
            revert TransferExceedsMaxWallet();
        }
    }

    /**
     * @notice Override burn to track total burned and enforce cap
     */
    function _burn(address account, uint256 amount) internal override {
        if (totalBurned + amount > maxBurnable) revert ExceedsBurnCap();
        totalBurned += amount;
        super._burn(account, amount);
        emit TokensBurned(account, amount);
    }
}
