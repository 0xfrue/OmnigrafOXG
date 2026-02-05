// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LinearVesting
 * @notice Linear vesting contract with claim-on-demand functionality
 * @dev Supports multiple beneficiaries with independent vesting schedules
 *
 * Vesting Schedule Examples:
 * - R1: 35% liquid at TGE, 65% over 18 months
 * - R2: 35% liquid at TGE, 65% over 15 months
 * - R3: 40% liquid at TGE, 60% over 12 months
 */
contract LinearVesting is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant VESTING_ADMIN_ROLE = keccak256("VESTING_ADMIN_ROLE");

    // ============ Structs ============
    struct VestingSchedule {
        uint256 totalAmount;     // Total tokens allocated
        uint256 start;           // Vesting start timestamp
        uint256 duration;        // Vesting duration in seconds
        uint256 released;        // Amount already released
        bool initialized;        // Whether schedule exists
        bool revocable;          // Whether admin can revoke remaining
        bool revoked;            // Whether schedule was revoked
    }

    // ============ State Variables ============
    IERC20 public immutable token;
    string public name; // e.g., "R1 Vesting", "Team Vesting"

    mapping(address => VestingSchedule) public schedules;
    address[] public beneficiaries;

    uint256 public totalAllocated;
    uint256 public totalReleased;

    // ============ Events ============
    event VestingCreated(
        address indexed beneficiary,
        uint256 totalAmount,
        uint256 start,
        uint256 duration,
        bool revocable
    );
    event TokensReleased(address indexed beneficiary, uint256 amount);
    event VestingRevoked(address indexed beneficiary, uint256 amountRevoked);
    event BeneficiaryUpdated(address indexed oldBeneficiary, address indexed newBeneficiary);

    // ============ Errors ============
    error ZeroAddress();
    error ZeroAmount();
    error ScheduleExists();
    error ScheduleNotFound();
    error NothingToRelease();
    error NotRevocable();
    error AlreadyRevoked();
    error InsufficientBalance();

    // ============ Constructor ============
    constructor(
        address token_,
        string memory name_,
        address admin_
    ) {
        if (token_ == address(0) || admin_ == address(0)) revert ZeroAddress();

        token = IERC20(token_);
        name = name_;

        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(VESTING_ADMIN_ROLE, admin_);
    }

    // ============ Admin Functions ============

    /**
     * @notice Create a vesting schedule for a beneficiary
     * @param beneficiary Address of the beneficiary
     * @param totalAmount Total tokens to vest
     * @param start Start timestamp for vesting
     * @param duration Duration of vesting in seconds
     * @param revocable Whether the schedule can be revoked
     */
    function createVesting(
        address beneficiary,
        uint256 totalAmount,
        uint256 start,
        uint256 duration,
        bool revocable
    ) external onlyRole(VESTING_ADMIN_ROLE) {
        if (beneficiary == address(0)) revert ZeroAddress();
        if (totalAmount == 0) revert ZeroAmount();
        if (schedules[beneficiary].initialized) revert ScheduleExists();

        // Ensure contract has enough tokens
        uint256 available = token.balanceOf(address(this)) - (totalAllocated - totalReleased);
        if (totalAmount > available) revert InsufficientBalance();

        schedules[beneficiary] = VestingSchedule({
            totalAmount: totalAmount,
            start: start,
            duration: duration,
            released: 0,
            initialized: true,
            revocable: revocable,
            revoked: false
        });

        beneficiaries.push(beneficiary);
        totalAllocated += totalAmount;

        emit VestingCreated(beneficiary, totalAmount, start, duration, revocable);
    }

    /**
     * @notice Create multiple vesting schedules in batch
     */
    function createVestingBatch(
        address[] calldata beneficiaries_,
        uint256[] calldata amounts_,
        uint256 start,
        uint256 duration,
        bool revocable
    ) external onlyRole(VESTING_ADMIN_ROLE) {
        require(beneficiaries_.length == amounts_.length, "Length mismatch");

        for (uint256 i = 0; i < beneficiaries_.length; i++) {
            if (beneficiaries_[i] == address(0)) continue;
            if (amounts_[i] == 0) continue;
            if (schedules[beneficiaries_[i]].initialized) continue;

            uint256 available = token.balanceOf(address(this)) - (totalAllocated - totalReleased);
            if (amounts_[i] > available) revert InsufficientBalance();

            schedules[beneficiaries_[i]] = VestingSchedule({
                totalAmount: amounts_[i],
                start: start,
                duration: duration,
                released: 0,
                initialized: true,
                revocable: revocable,
                revoked: false
            });

            beneficiaries.push(beneficiaries_[i]);
            totalAllocated += amounts_[i];

            emit VestingCreated(beneficiaries_[i], amounts_[i], start, duration, revocable);
        }
    }

    /**
     * @notice Revoke a vesting schedule (returns unvested tokens to admin)
     * @param beneficiary Address of the beneficiary to revoke
     */
    function revoke(address beneficiary) external onlyRole(VESTING_ADMIN_ROLE) {
        VestingSchedule storage schedule = schedules[beneficiary];
        if (!schedule.initialized) revert ScheduleNotFound();
        if (!schedule.revocable) revert NotRevocable();
        if (schedule.revoked) revert AlreadyRevoked();

        uint256 vested = _vestedAmount(schedule);
        uint256 unreleased = vested - schedule.released;

        // First release any releasable amount to beneficiary
        if (unreleased > 0) {
            schedule.released += unreleased;
            totalReleased += unreleased;
            token.safeTransfer(beneficiary, unreleased);
            emit TokensReleased(beneficiary, unreleased);
        }

        // Return unvested to admin
        uint256 unvested = schedule.totalAmount - vested;
        if (unvested > 0) {
            totalAllocated -= unvested;
            token.safeTransfer(msg.sender, unvested);
        }

        schedule.revoked = true;
        emit VestingRevoked(beneficiary, unvested);
    }

    /**
     * @notice Transfer vesting to a new beneficiary (for team transfers)
     */
    function transferVesting(
        address oldBeneficiary,
        address newBeneficiary
    ) external onlyRole(VESTING_ADMIN_ROLE) {
        if (newBeneficiary == address(0)) revert ZeroAddress();
        if (schedules[newBeneficiary].initialized) revert ScheduleExists();

        VestingSchedule storage schedule = schedules[oldBeneficiary];
        if (!schedule.initialized) revert ScheduleNotFound();
        if (schedule.revoked) revert AlreadyRevoked();

        // Copy schedule to new beneficiary
        schedules[newBeneficiary] = schedule;
        delete schedules[oldBeneficiary];

        // Update beneficiaries array
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            if (beneficiaries[i] == oldBeneficiary) {
                beneficiaries[i] = newBeneficiary;
                break;
            }
        }

        emit BeneficiaryUpdated(oldBeneficiary, newBeneficiary);
    }

    // ============ User Functions ============

    /**
     * @notice Release all vested tokens to caller
     */
    function release() external nonReentrant {
        VestingSchedule storage schedule = schedules[msg.sender];
        if (!schedule.initialized) revert ScheduleNotFound();
        if (schedule.revoked) revert AlreadyRevoked();

        uint256 releasable = _releasableAmount(schedule);
        if (releasable == 0) revert NothingToRelease();

        schedule.released += releasable;
        totalReleased += releasable;

        token.safeTransfer(msg.sender, releasable);
        emit TokensReleased(msg.sender, releasable);
    }

    /**
     * @notice Release tokens on behalf of a beneficiary (for aggregators)
     */
    function releaseFor(address beneficiary) external nonReentrant {
        VestingSchedule storage schedule = schedules[beneficiary];
        if (!schedule.initialized) revert ScheduleNotFound();
        if (schedule.revoked) revert AlreadyRevoked();

        uint256 releasable = _releasableAmount(schedule);
        if (releasable == 0) revert NothingToRelease();

        schedule.released += releasable;
        totalReleased += releasable;

        token.safeTransfer(beneficiary, releasable);
        emit TokensReleased(beneficiary, releasable);
    }

    // ============ View Functions ============

    /**
     * @notice Get total vested amount for a beneficiary
     */
    function vestedAmount(address beneficiary) external view returns (uint256) {
        VestingSchedule storage schedule = schedules[beneficiary];
        if (!schedule.initialized) return 0;
        return _vestedAmount(schedule);
    }

    /**
     * @notice Get releasable (claimable) amount for a beneficiary
     */
    function releasableAmount(address beneficiary) external view returns (uint256) {
        VestingSchedule storage schedule = schedules[beneficiary];
        if (!schedule.initialized || schedule.revoked) return 0;
        return _releasableAmount(schedule);
    }

    /**
     * @notice Get remaining unvested amount for a beneficiary
     */
    function unvestedAmount(address beneficiary) external view returns (uint256) {
        VestingSchedule storage schedule = schedules[beneficiary];
        if (!schedule.initialized || schedule.revoked) return 0;
        return schedule.totalAmount - _vestedAmount(schedule);
    }

    /**
     * @notice Get number of beneficiaries
     */
    function beneficiaryCount() external view returns (uint256) {
        return beneficiaries.length;
    }

    /**
     * @notice Get all beneficiaries
     */
    function getAllBeneficiaries() external view returns (address[] memory) {
        return beneficiaries;
    }

    /**
     * @notice Get vesting progress percentage (0-100 scaled by 1e18)
     */
    function vestingProgress(address beneficiary) external view returns (uint256) {
        VestingSchedule storage schedule = schedules[beneficiary];
        if (!schedule.initialized || schedule.totalAmount == 0) return 0;
        return (_vestedAmount(schedule) * 1e18) / schedule.totalAmount;
    }

    // ============ Internal Functions ============

    function _vestedAmount(VestingSchedule storage schedule) internal view returns (uint256) {
        if (block.timestamp < schedule.start) {
            return 0;
        } else if (block.timestamp >= schedule.start + schedule.duration) {
            return schedule.totalAmount;
        } else {
            return (schedule.totalAmount * (block.timestamp - schedule.start)) / schedule.duration;
        }
    }

    function _releasableAmount(VestingSchedule storage schedule) internal view returns (uint256) {
        return _vestedAmount(schedule) - schedule.released;
    }

    // ============ Emergency Functions ============

    /**
     * @notice Withdraw unallocated tokens (admin only)
     */
    function withdrawUnallocated(address to) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 balance = token.balanceOf(address(this));
        uint256 allocated = totalAllocated - totalReleased;
        uint256 unallocated = balance > allocated ? balance - allocated : 0;

        if (unallocated > 0) {
            token.safeTransfer(to, unallocated);
        }
    }
}
