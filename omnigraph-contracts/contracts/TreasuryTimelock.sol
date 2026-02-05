// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/governance/TimelockController.sol";

/**
 * @title TreasuryTimelock
 * @notice TimelockController wrapper for governance operations
 * @dev Enforces delay on sensitive operations like tax changes, fee splits, treasury movements
 *
 * Usage:
 * - Treasury multisig proposes operations via schedule()
 * - After minDelay passes, operations can be executed
 * - Critical for investor confidence and rug prevention
 *
 * Recommended delay: 48-72 hours for critical operations
 */
contract TreasuryTimelock is TimelockController {
    /**
     * @notice Create a new treasury timelock
     * @param minDelay Minimum delay for operations (in seconds)
     * @param proposers Addresses that can propose/schedule operations
     * @param executors Addresses that can execute operations (use address(0) for anyone)
     * @param admin Optional admin address (use address(0) for no admin)
     */
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
