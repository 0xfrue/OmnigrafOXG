// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LPTimelock
 * @notice Locks LP tokens for a defined period to prevent rug pulls
 * @dev Simple time-locked vault for LP tokens with extension capability
 */
contract LPTimelock is Ownable {
    using SafeERC20 for IERC20;

    // ============ State Variables ============
    IERC20 public immutable lpToken;
    address public beneficiary;
    uint256 public releaseTime;
    uint256 public immutable minLockDuration;

    // ============ Events ============
    event TokensLocked(uint256 amount, uint256 releaseTime);
    event TokensReleased(address indexed to, uint256 amount);
    event ReleaseTimeExtended(uint256 oldTime, uint256 newTime);
    event BeneficiaryUpdated(address indexed oldBeneficiary, address indexed newBeneficiary);

    // ============ Errors ============
    error TokensStillLocked();
    error NotBeneficiary();
    error InvalidReleaseTime();
    error CanOnlyExtend();
    error ZeroAddress();

    // ============ Constructor ============
    /**
     * @notice Create a new LP timelock
     * @param lpToken_ LP token to lock
     * @param beneficiary_ Address that can claim after release time
     * @param releaseTime_ Timestamp when tokens can be released
     * @param admin_ Contract owner/admin
     */
    constructor(
        address lpToken_,
        address beneficiary_,
        uint256 releaseTime_,
        address admin_
    ) Ownable(admin_) {
        if (lpToken_ == address(0) || beneficiary_ == address(0)) revert ZeroAddress();
        if (releaseTime_ <= block.timestamp) revert InvalidReleaseTime();

        lpToken = IERC20(lpToken_);
        beneficiary = beneficiary_;
        releaseTime = releaseTime_;
        minLockDuration = releaseTime_ - block.timestamp;
    }

    // ============ Core Functions ============

    /**
     * @notice Release locked tokens to beneficiary
     * @dev Can only be called after release time by beneficiary
     */
    function release() external {
        if (msg.sender != beneficiary) revert NotBeneficiary();
        if (block.timestamp < releaseTime) revert TokensStillLocked();

        uint256 amount = lpToken.balanceOf(address(this));
        require(amount > 0, "No tokens to release");

        lpToken.safeTransfer(beneficiary, amount);
        emit TokensReleased(beneficiary, amount);
    }

    /**
     * @notice Release a specific amount of tokens
     * @param amount Amount to release
     */
    function releaseAmount(uint256 amount) external {
        if (msg.sender != beneficiary) revert NotBeneficiary();
        if (block.timestamp < releaseTime) revert TokensStillLocked();

        uint256 balance = lpToken.balanceOf(address(this));
        require(amount <= balance, "Insufficient balance");

        lpToken.safeTransfer(beneficiary, amount);
        emit TokensReleased(beneficiary, amount);
    }

    // ============ Admin Functions ============

    /**
     * @notice Extend the lock period (can only increase, never decrease)
     * @param newReleaseTime New release timestamp
     */
    function extendLock(uint256 newReleaseTime) external onlyOwner {
        if (newReleaseTime <= releaseTime) revert CanOnlyExtend();

        uint256 oldTime = releaseTime;
        releaseTime = newReleaseTime;
        emit ReleaseTimeExtended(oldTime, newReleaseTime);
    }

    /**
     * @notice Update beneficiary address
     * @param newBeneficiary New beneficiary address
     */
    function setBeneficiary(address newBeneficiary) external onlyOwner {
        if (newBeneficiary == address(0)) revert ZeroAddress();
        address oldBeneficiary = beneficiary;
        beneficiary = newBeneficiary;
        emit BeneficiaryUpdated(oldBeneficiary, newBeneficiary);
    }

    // ============ View Functions ============

    /**
     * @notice Get locked token balance
     */
    function lockedBalance() external view returns (uint256) {
        return lpToken.balanceOf(address(this));
    }

    /**
     * @notice Check if tokens are releasable
     */
    function isReleasable() external view returns (bool) {
        return block.timestamp >= releaseTime;
    }

    /**
     * @notice Get time remaining until release
     */
    function timeUntilRelease() external view returns (uint256) {
        if (block.timestamp >= releaseTime) return 0;
        return releaseTime - block.timestamp;
    }

    /**
     * @notice Receive LP tokens and emit event
     * @dev Called when POLManager sends LP tokens
     */
    function onTokensReceived(uint256 amount) external {
        emit TokensLocked(amount, releaseTime);
    }
}
