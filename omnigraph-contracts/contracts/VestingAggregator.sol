// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LinearVesting.sol";

/**
 * @title VestingAggregator
 * @notice Quality-of-life contract for claiming from multiple vesting contracts at once
 * @dev Allows users to claim all their vested tokens in a single transaction
 */
contract VestingAggregator is Ownable {
    // ============ State Variables ============
    LinearVesting[] public vestingContracts;
    mapping(address => bool) public isRegistered;

    // ============ Events ============
    event VestingContractAdded(address indexed vestingContract);
    event VestingContractRemoved(address indexed vestingContract);
    event ClaimedAll(address indexed user, uint256 totalClaimed);

    // ============ Errors ============
    error AlreadyRegistered();
    error NotRegistered();
    error ZeroAddress();

    // ============ Constructor ============
    constructor(address admin_) Ownable(admin_) {}

    // ============ Admin Functions ============

    /**
     * @notice Add a vesting contract to the aggregator
     * @param vestingContract Address of the LinearVesting contract
     */
    function addVestingContract(address vestingContract) external onlyOwner {
        if (vestingContract == address(0)) revert ZeroAddress();
        if (isRegistered[vestingContract]) revert AlreadyRegistered();

        vestingContracts.push(LinearVesting(vestingContract));
        isRegistered[vestingContract] = true;

        emit VestingContractAdded(vestingContract);
    }

    /**
     * @notice Remove a vesting contract from the aggregator
     * @param vestingContract Address of the LinearVesting contract to remove
     */
    function removeVestingContract(address vestingContract) external onlyOwner {
        if (!isRegistered[vestingContract]) revert NotRegistered();

        // Find and remove from array
        for (uint256 i = 0; i < vestingContracts.length; i++) {
            if (address(vestingContracts[i]) == vestingContract) {
                // Move last element to current position and pop
                vestingContracts[i] = vestingContracts[vestingContracts.length - 1];
                vestingContracts.pop();
                break;
            }
        }

        isRegistered[vestingContract] = false;
        emit VestingContractRemoved(vestingContract);
    }

    /**
     * @notice Add multiple vesting contracts at once
     */
    function addVestingContractsBatch(address[] calldata contracts) external onlyOwner {
        for (uint256 i = 0; i < contracts.length; i++) {
            if (contracts[i] == address(0)) continue;
            if (isRegistered[contracts[i]]) continue;

            vestingContracts.push(LinearVesting(contracts[i]));
            isRegistered[contracts[i]] = true;

            emit VestingContractAdded(contracts[i]);
        }
    }

    // ============ User Functions ============

    /**
     * @notice Claim all vested tokens from all registered vesting contracts
     * @return totalClaimed Total amount of tokens claimed across all contracts
     */
    function claimAll() external returns (uint256 totalClaimed) {
        for (uint256 i = 0; i < vestingContracts.length; i++) {
            LinearVesting vesting = vestingContracts[i];

            // Check if user has releasable tokens
            uint256 releasable = vesting.releasableAmount(msg.sender);
            if (releasable > 0) {
                try vesting.releaseFor(msg.sender) {
                    totalClaimed += releasable;
                } catch {
                    // Skip if release fails (e.g., no schedule or revoked)
                }
            }
        }

        emit ClaimedAll(msg.sender, totalClaimed);
    }

    // ============ View Functions ============

    /**
     * @notice Get total releasable amount for a user across all contracts
     */
    function totalReleasable(address user) external view returns (uint256 total) {
        for (uint256 i = 0; i < vestingContracts.length; i++) {
            total += vestingContracts[i].releasableAmount(user);
        }
    }

    /**
     * @notice Get total vested amount for a user across all contracts
     */
    function totalVested(address user) external view returns (uint256 total) {
        for (uint256 i = 0; i < vestingContracts.length; i++) {
            total += vestingContracts[i].vestedAmount(user);
        }
    }

    /**
     * @notice Get total unvested amount for a user across all contracts
     */
    function totalUnvested(address user) external view returns (uint256 total) {
        for (uint256 i = 0; i < vestingContracts.length; i++) {
            total += vestingContracts[i].unvestedAmount(user);
        }
    }

    /**
     * @notice Get detailed vesting info for a user across all contracts
     */
    function getVestingInfo(address user) external view returns (
        address[] memory contracts,
        uint256[] memory releasable,
        uint256[] memory vested,
        uint256[] memory unvested
    ) {
        uint256 count = vestingContracts.length;

        contracts = new address[](count);
        releasable = new uint256[](count);
        vested = new uint256[](count);
        unvested = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            LinearVesting v = vestingContracts[i];
            contracts[i] = address(v);
            releasable[i] = v.releasableAmount(user);
            vested[i] = v.vestedAmount(user);
            unvested[i] = v.unvestedAmount(user);
        }
    }

    /**
     * @notice Get number of registered vesting contracts
     */
    function vestingContractCount() external view returns (uint256) {
        return vestingContracts.length;
    }

    /**
     * @notice Get all registered vesting contract addresses
     */
    function getAllVestingContracts() external view returns (address[] memory) {
        address[] memory addresses = new address[](vestingContracts.length);
        for (uint256 i = 0; i < vestingContracts.length; i++) {
            addresses[i] = address(vestingContracts[i]);
        }
        return addresses;
    }
}
