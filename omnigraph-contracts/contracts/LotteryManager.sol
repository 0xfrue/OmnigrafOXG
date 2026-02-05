// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LotteryManager
 * @notice Periodic lottery using protocol-funded pool with Chainlink VRF
 * @dev Uses entries from staking/quests, funded by protocol fees (no user deposits)
 */
contract LotteryManager is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant ENTRY_GRANTER_ROLE = keccak256("ENTRY_GRANTER_ROLE"); // For staking/quest contracts

    // ============ Structs ============
    struct Epoch {
        uint256 startTime;
        uint256 endTime;
        uint256 prizePool;        // USDC prize pool
        uint256 totalEntries;
        bool fulfilled;           // VRF fulfilled
        bool claimed;             // Winner claimed
        address winner;
        uint256 randomWord;       // VRF result
    }

    // ============ State Variables ============

    // Tokens
    IERC20 public immutable prizeToken; // USDC for prizes

    // VRF (simplified - in production use Chainlink VRF V2)
    address public vrfCoordinator;
    bytes32 public vrfKeyHash;
    uint64 public vrfSubscriptionId;
    uint256 public vrfRequestId;
    uint32 public vrfCallbackGasLimit;

    // Epoch management
    uint256 public currentEpochId;
    mapping(uint256 => Epoch) public epochs;
    mapping(uint256 => mapping(address => uint256)) public epochEntries; // epoch => user => entries
    mapping(uint256 => address[]) public epochParticipants; // epoch => participant addresses

    // Prize configuration
    uint256 public minPrizePool;        // Minimum USDC to start epoch
    uint256 public maxPrizePayoutBps;   // Max % of pool to pay out (e.g., 9000 = 90%)
    uint16 public constant BPS_DENOMINATOR = 10000;

    // Pending VRF requests
    mapping(uint256 => uint256) public requestToEpoch; // requestId => epochId

    // ============ Events ============
    event EpochStarted(uint256 indexed epochId, uint256 startTime, uint256 endTime, uint256 initialPrize);
    event EpochEnded(uint256 indexed epochId, uint256 totalEntries, uint256 prizePool);
    event EntriesAdded(uint256 indexed epochId, address indexed user, uint256 entries);
    event RandomnessRequested(uint256 indexed epochId, uint256 requestId);
    event WinnerSelected(uint256 indexed epochId, address indexed winner, uint256 prize);
    event PrizeClaimed(uint256 indexed epochId, address indexed winner, uint256 amount);
    event PrizeFunded(uint256 amount);

    // ============ Errors ============
    error EpochNotActive();
    error EpochNotEnded();
    error EpochNotFulfilled();
    error AlreadyClaimed();
    error NotWinner();
    error InsufficientPrize();
    error NoEntries();
    error InvalidEpoch();

    // ============ Constructor ============
    constructor(
        address prizeToken_,
        address admin_
    ) {
        require(prizeToken_ != address(0), "Zero address");

        prizeToken = IERC20(prizeToken_);

        // Default config
        minPrizePool = 100 * 10**6;   // 100 USDC minimum
        maxPrizePayoutBps = 9000;      // 90% max payout
        vrfCallbackGasLimit = 100000;

        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(GOVERNANCE_ROLE, admin_);
        _grantRole(OPERATOR_ROLE, admin_);
    }

    // ============ Admin Functions ============

    /**
     * @notice Start a new lottery epoch
     * @param duration Duration in seconds
     */
    function startEpoch(uint256 duration) external onlyRole(OPERATOR_ROLE) {
        require(duration > 0, "Invalid duration");

        // Ensure previous epoch is resolved
        if (currentEpochId > 0) {
            Epoch storage prev = epochs[currentEpochId];
            require(prev.endTime < block.timestamp && prev.fulfilled, "Previous epoch not resolved");
        }

        currentEpochId++;

        uint256 prizeBalance = prizeToken.balanceOf(address(this));

        epochs[currentEpochId] = Epoch({
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            prizePool: prizeBalance,
            totalEntries: 0,
            fulfilled: false,
            claimed: false,
            winner: address(0),
            randomWord: 0
        });

        emit EpochStarted(currentEpochId, block.timestamp, block.timestamp + duration, prizeBalance);
    }

    /**
     * @notice End current epoch and request randomness
     */
    function endEpoch() external onlyRole(OPERATOR_ROLE) {
        Epoch storage epoch = epochs[currentEpochId];
        if (epoch.startTime == 0) revert InvalidEpoch();
        if (block.timestamp < epoch.endTime) revert EpochNotEnded();
        if (epoch.fulfilled) revert AlreadyClaimed();
        if (epoch.totalEntries == 0) revert NoEntries();

        // Update prize pool with any new funds
        epoch.prizePool = prizeToken.balanceOf(address(this));

        emit EpochEnded(currentEpochId, epoch.totalEntries, epoch.prizePool);

        // Request randomness (simplified - use Chainlink VRF V2 in production)
        _requestRandomness(currentEpochId);
    }

    /**
     * @notice Add entries for a user (called by staking/quest contracts)
     * @param user Address to add entries for
     * @param entries Number of entries to add
     */
    function addEntries(
        address user,
        uint256 entries
    ) external onlyRole(ENTRY_GRANTER_ROLE) {
        Epoch storage epoch = epochs[currentEpochId];
        if (epoch.startTime == 0 || block.timestamp >= epoch.endTime) revert EpochNotActive();

        // Track if new participant
        if (epochEntries[currentEpochId][user] == 0) {
            epochParticipants[currentEpochId].push(user);
        }

        epochEntries[currentEpochId][user] += entries;
        epoch.totalEntries += entries;

        emit EntriesAdded(currentEpochId, user, entries);
    }

    /**
     * @notice Fulfill randomness (called by VRF or admin for testing)
     * @param epochId Epoch to fulfill
     * @param randomWord Random value
     */
    function fulfillRandomness(
        uint256 epochId,
        uint256 randomWord
    ) external onlyRole(OPERATOR_ROLE) {
        Epoch storage epoch = epochs[epochId];
        if (epoch.startTime == 0) revert InvalidEpoch();
        if (epoch.fulfilled) revert AlreadyClaimed();
        if (epoch.totalEntries == 0) revert NoEntries();

        epoch.randomWord = randomWord;
        epoch.fulfilled = true;

        // Select winner
        address winner = _selectWinner(epochId, randomWord);
        epoch.winner = winner;

        // Calculate prize (capped)
        uint256 prize = (epoch.prizePool * maxPrizePayoutBps) / BPS_DENOMINATOR;

        emit WinnerSelected(epochId, winner, prize);
    }

    /**
     * @notice Winner claims their prize
     * @param epochId Epoch to claim from
     */
    function claimPrize(uint256 epochId) external nonReentrant {
        Epoch storage epoch = epochs[epochId];
        if (!epoch.fulfilled) revert EpochNotFulfilled();
        if (epoch.claimed) revert AlreadyClaimed();
        if (msg.sender != epoch.winner) revert NotWinner();

        epoch.claimed = true;

        uint256 prize = (epoch.prizePool * maxPrizePayoutBps) / BPS_DENOMINATOR;
        prizeToken.safeTransfer(msg.sender, prize);

        emit PrizeClaimed(epochId, msg.sender, prize);
    }

    // ============ Config Functions ============

    function setVRFConfig(
        address coordinator_,
        bytes32 keyHash_,
        uint64 subscriptionId_,
        uint32 callbackGasLimit_
    ) external onlyRole(GOVERNANCE_ROLE) {
        vrfCoordinator = coordinator_;
        vrfKeyHash = keyHash_;
        vrfSubscriptionId = subscriptionId_;
        vrfCallbackGasLimit = callbackGasLimit_;
    }

    function setPrizeConfig(
        uint256 minPrizePool_,
        uint256 maxPrizePayoutBps_
    ) external onlyRole(GOVERNANCE_ROLE) {
        require(maxPrizePayoutBps_ <= BPS_DENOMINATOR, "Invalid bps");
        minPrizePool = minPrizePool_;
        maxPrizePayoutBps = maxPrizePayoutBps_;
    }

    // ============ Internal Functions ============

    function _requestRandomness(uint256 epochId) internal {
        // Simplified - in production, use Chainlink VRF V2:
        // vrfRequestId = VRFCoordinatorV2Interface(vrfCoordinator).requestRandomWords(...)
        // requestToEpoch[vrfRequestId] = epochId;

        // For now, emit event for off-chain fulfillment
        vrfRequestId++;
        requestToEpoch[vrfRequestId] = epochId;
        emit RandomnessRequested(epochId, vrfRequestId);
    }

    function _selectWinner(uint256 epochId, uint256 randomWord) internal view returns (address) {
        Epoch storage epoch = epochs[epochId];
        address[] storage participants = epochParticipants[epochId];

        // Weighted random selection based on entries
        uint256 winningEntry = randomWord % epoch.totalEntries;
        uint256 cumulative = 0;

        for (uint256 i = 0; i < participants.length; i++) {
            cumulative += epochEntries[epochId][participants[i]];
            if (winningEntry < cumulative) {
                return participants[i];
            }
        }

        // Fallback (should never reach)
        return participants[participants.length - 1];
    }

    // ============ View Functions ============

    function getEpoch(uint256 epochId) external view returns (Epoch memory) {
        return epochs[epochId];
    }

    function getUserEntries(uint256 epochId, address user) external view returns (uint256) {
        return epochEntries[epochId][user];
    }

    function getParticipantCount(uint256 epochId) external view returns (uint256) {
        return epochParticipants[epochId].length;
    }

    function getCurrentPrizePool() external view returns (uint256) {
        return prizeToken.balanceOf(address(this));
    }

    function isEpochActive() external view returns (bool) {
        Epoch storage epoch = epochs[currentEpochId];
        return epoch.startTime > 0 &&
               block.timestamp >= epoch.startTime &&
               block.timestamp < epoch.endTime;
    }

    function getWinProbability(uint256 epochId, address user) external view returns (uint256) {
        Epoch storage epoch = epochs[epochId];
        if (epoch.totalEntries == 0) return 0;
        return (epochEntries[epochId][user] * 1e18) / epoch.totalEntries;
    }

    // ============ Emergency Functions ============

    function emergencyWithdraw(
        address token,
        uint256 amount,
        address to
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20(token).safeTransfer(to, amount);
    }

    /**
     * @notice Accept prize token deposits (from FeeCollector)
     */
    receive() external payable {}
}
