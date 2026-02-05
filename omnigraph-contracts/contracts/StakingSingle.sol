// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title StakingSingle
 * @notice Single-sided staking: stake TOKEN, earn TOKEN
 * @dev Standard reward-per-token staking pattern with finite emissions
 */
contract StakingSingle is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant REWARDS_ADMIN_ROLE = keccak256("REWARDS_ADMIN_ROLE");

    // ============ State Variables ============

    // Tokens
    IERC20 public immutable stakingToken;
    IERC20 public immutable rewardsToken;

    // Reward state
    uint256 public rewardRate;           // Rewards per second
    uint256 public rewardsDuration;      // Duration of rewards period
    uint256 public periodFinish;         // When current reward period ends
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    // User state
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public balances;

    // Total staked
    uint256 public totalSupply;

    // Limits
    uint256 public maxStakePerUser;      // Optional cap per user
    uint256 public minStakeAmount;       // Minimum stake amount

    // ============ Events ============
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);
    event RewardAdded(uint256 reward, uint256 duration);
    event RewardRateUpdated(uint256 oldRate, uint256 newRate);
    event LimitsUpdated(uint256 maxStakePerUser, uint256 minStakeAmount);

    // ============ Errors ============
    error ZeroAmount();
    error InsufficientBalance();
    error ExceedsMaxStake();
    error BelowMinStake();
    error RewardPeriodNotFinished();

    // ============ Constructor ============
    constructor(
        address stakingToken_,
        address rewardsToken_,
        address admin_
    ) {
        require(stakingToken_ != address(0) && rewardsToken_ != address(0), "Zero address");

        stakingToken = IERC20(stakingToken_);
        rewardsToken = IERC20(rewardsToken_);

        // Default limits
        maxStakePerUser = type(uint256).max; // No limit by default
        minStakeAmount = 1e18; // 1 token minimum

        _grantRole(DEFAULT_ADMIN_ROLE, admin_);
        _grantRole(REWARDS_ADMIN_ROLE, admin_);
    }

    // ============ Modifiers ============

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    // ============ View Functions ============

    /**
     * @notice Get the last time rewards are applicable
     */
    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    /**
     * @notice Calculate reward per token
     */
    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + (
            (lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18 / totalSupply
        );
    }

    /**
     * @notice Calculate earned rewards for an account
     */
    function earned(address account) public view returns (uint256) {
        return (
            balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18
        ) + rewards[account];
    }

    /**
     * @notice Get remaining reward duration
     */
    function remainingRewardDuration() external view returns (uint256) {
        if (block.timestamp >= periodFinish) return 0;
        return periodFinish - block.timestamp;
    }

    /**
     * @notice Get total rewards remaining to be distributed
     */
    function remainingRewards() external view returns (uint256) {
        if (block.timestamp >= periodFinish) return 0;
        return (periodFinish - block.timestamp) * rewardRate;
    }

    /**
     * @notice Get APR estimate (annualized, scaled by 1e18)
     */
    function estimatedAPR() external view returns (uint256) {
        if (totalSupply == 0 || rewardRate == 0) return 0;
        // (rewardRate * seconds_per_year * 1e18) / totalSupply
        return (rewardRate * 365 days * 1e18) / totalSupply;
    }

    // ============ User Functions ============

    /**
     * @notice Stake tokens
     * @param amount Amount to stake
     */
    function stake(uint256 amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        if (amount == 0) revert ZeroAmount();
        if (amount < minStakeAmount) revert BelowMinStake();
        if (balances[msg.sender] + amount > maxStakePerUser) revert ExceedsMaxStake();

        totalSupply += amount;
        balances[msg.sender] += amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Withdraw staked tokens
     * @param amount Amount to withdraw
     */
    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        if (amount == 0) revert ZeroAmount();
        if (amount > balances[msg.sender]) revert InsufficientBalance();

        totalSupply -= amount;
        balances[msg.sender] -= amount;

        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Claim earned rewards
     */
    function getReward() public nonReentrant updateReward(msg.sender) {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    /**
     * @notice Exit: withdraw all and claim rewards
     */
    function exit() external {
        withdraw(balances[msg.sender]);
        getReward();
    }

    // ============ Admin Functions ============

    /**
     * @notice Add rewards and start/extend reward period
     * @param reward Amount of reward tokens to distribute
     * @param duration Duration over which to distribute (in seconds)
     */
    function notifyRewardAmount(
        uint256 reward,
        uint256 duration
    ) external onlyRole(REWARDS_ADMIN_ROLE) updateReward(address(0)) {
        require(duration > 0, "Duration must be > 0");

        // Transfer reward tokens to contract
        rewardsToken.safeTransferFrom(msg.sender, address(this), reward);

        if (block.timestamp >= periodFinish) {
            // Start new period
            rewardRate = reward / duration;
        } else {
            // Extend existing period
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            rewardRate = (reward + leftover) / duration;
        }

        // Ensure reward rate is sustainable
        uint256 balance = rewardsToken.balanceOf(address(this));
        require(rewardRate <= balance / duration, "Reward too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + duration;
        rewardsDuration = duration;

        emit RewardAdded(reward, duration);
    }

    /**
     * @notice Update reward rate without adding tokens (use remaining balance)
     */
    function setRewardRate(uint256 rate) external onlyRole(REWARDS_ADMIN_ROLE) updateReward(address(0)) {
        uint256 oldRate = rewardRate;
        rewardRate = rate;
        lastUpdateTime = block.timestamp;
        emit RewardRateUpdated(oldRate, rate);
    }

    /**
     * @notice Set staking limits
     */
    function setLimits(
        uint256 maxStakePerUser_,
        uint256 minStakeAmount_
    ) external onlyRole(REWARDS_ADMIN_ROLE) {
        maxStakePerUser = maxStakePerUser_;
        minStakeAmount = minStakeAmount_;
        emit LimitsUpdated(maxStakePerUser_, minStakeAmount_);
    }

    /**
     * @notice Pause staking
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause staking
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    /**
     * @notice Recover accidentally sent tokens (not staking or reward token)
     */
    function recoverERC20(
        address tokenAddress,
        uint256 tokenAmount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokenAddress != address(stakingToken), "Cannot recover staking token");
        require(tokenAddress != address(rewardsToken), "Cannot recover rewards token");
        IERC20(tokenAddress).safeTransfer(msg.sender, tokenAmount);
    }
}
