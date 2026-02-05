// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title StakingLP
 * @notice LP staking: stake Aerodrome LP tokens, earn TOKEN
 * @dev Standard reward-per-token staking with finite emissions and bonus multipliers
 */
contract StakingLP is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ Roles ============
    bytes32 public constant REWARDS_ADMIN_ROLE = keccak256("REWARDS_ADMIN_ROLE");

    // ============ State Variables ============

    // Tokens
    IERC20 public immutable stakingToken; // LP token
    IERC20 public immutable rewardsToken; // OmniGraph TOKEN

    // Reward state
    uint256 public rewardRate;
    uint256 public rewardsDuration;
    uint256 public periodFinish;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;

    // User state
    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public stakingTimestamp; // For bonus calculation

    // Total staked
    uint256 public totalSupply;

    // Limits
    uint256 public maxStakePerUser;
    uint256 public minStakeAmount;

    // Bonus system (time-weighted)
    uint256 public bonusMultiplierBps;   // Extra reward % for long-term stakers (e.g., 1000 = 10%)
    uint256 public bonusMinDuration;     // Min duration to get bonus (e.g., 30 days)

    uint16 public constant BPS_DENOMINATOR = 10000;

    // ============ Events ============
    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward, uint256 bonus);
    event RewardAdded(uint256 reward, uint256 duration);
    event BonusUpdated(uint256 multiplierBps, uint256 minDuration);

    // ============ Errors ============
    error ZeroAmount();
    error InsufficientBalance();
    error ExceedsMaxStake();
    error BelowMinStake();

    // ============ Constructor ============
    constructor(
        address stakingToken_,  // LP token
        address rewardsToken_,  // OmniGraph TOKEN
        address admin_
    ) {
        require(stakingToken_ != address(0) && rewardsToken_ != address(0), "Zero address");

        stakingToken = IERC20(stakingToken_);
        rewardsToken = IERC20(rewardsToken_);

        // Default limits
        maxStakePerUser = type(uint256).max;
        minStakeAmount = 1e15; // Small minimum for LP tokens

        // Default bonus: 10% extra after 30 days
        bonusMultiplierBps = 1000;
        bonusMinDuration = 30 days;

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

    function lastTimeRewardApplicable() public view returns (uint256) {
        return block.timestamp < periodFinish ? block.timestamp : periodFinish;
    }

    function rewardPerToken() public view returns (uint256) {
        if (totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return rewardPerTokenStored + (
            (lastTimeRewardApplicable() - lastUpdateTime) * rewardRate * 1e18 / totalSupply
        );
    }

    /**
     * @notice Calculate base earned rewards (without bonus)
     */
    function earned(address account) public view returns (uint256) {
        return (
            balances[account] * (rewardPerToken() - userRewardPerTokenPaid[account]) / 1e18
        ) + rewards[account];
    }

    /**
     * @notice Calculate earned rewards with bonus
     */
    function earnedWithBonus(address account) public view returns (uint256 total, uint256 bonus) {
        uint256 base = earned(account);

        // Check if user qualifies for bonus
        if (bonusMultiplierBps > 0 &&
            stakingTimestamp[account] > 0 &&
            block.timestamp >= stakingTimestamp[account] + bonusMinDuration)
        {
            bonus = (base * bonusMultiplierBps) / BPS_DENOMINATOR;
        }

        total = base + bonus;
    }

    /**
     * @notice Check if user qualifies for bonus
     */
    function qualifiesForBonus(address account) external view returns (bool) {
        return stakingTimestamp[account] > 0 &&
            block.timestamp >= stakingTimestamp[account] + bonusMinDuration;
    }

    /**
     * @notice Time until user qualifies for bonus
     */
    function timeUntilBonus(address account) external view returns (uint256) {
        if (stakingTimestamp[account] == 0) return bonusMinDuration;
        uint256 qualifyTime = stakingTimestamp[account] + bonusMinDuration;
        if (block.timestamp >= qualifyTime) return 0;
        return qualifyTime - block.timestamp;
    }

    function remainingRewardDuration() external view returns (uint256) {
        if (block.timestamp >= periodFinish) return 0;
        return periodFinish - block.timestamp;
    }

    function estimatedAPR() external view returns (uint256) {
        if (totalSupply == 0 || rewardRate == 0) return 0;
        return (rewardRate * 365 days * 1e18) / totalSupply;
    }

    // ============ User Functions ============

    function stake(uint256 amount) external nonReentrant whenNotPaused updateReward(msg.sender) {
        if (amount == 0) revert ZeroAmount();
        if (amount < minStakeAmount) revert BelowMinStake();
        if (balances[msg.sender] + amount > maxStakePerUser) revert ExceedsMaxStake();

        // Set staking timestamp on first stake
        if (balances[msg.sender] == 0) {
            stakingTimestamp[msg.sender] = block.timestamp;
        }

        totalSupply += amount;
        balances[msg.sender] += amount;

        stakingToken.safeTransferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) public nonReentrant updateReward(msg.sender) {
        if (amount == 0) revert ZeroAmount();
        if (amount > balances[msg.sender]) revert InsufficientBalance();

        totalSupply -= amount;
        balances[msg.sender] -= amount;

        // Reset timestamp if fully withdrawn
        if (balances[msg.sender] == 0) {
            stakingTimestamp[msg.sender] = 0;
        }

        stakingToken.safeTransfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }

    function getReward() public nonReentrant updateReward(msg.sender) {
        (uint256 total, uint256 bonus) = earnedWithBonus(msg.sender);

        if (total > 0) {
            rewards[msg.sender] = 0;

            // Ensure contract has enough for bonus
            uint256 available = rewardsToken.balanceOf(address(this));
            if (total > available) {
                total = available;
                bonus = 0;
            }

            rewardsToken.safeTransfer(msg.sender, total);
            emit RewardPaid(msg.sender, total - bonus, bonus);
        }
    }

    function exit() external {
        withdraw(balances[msg.sender]);
        getReward();
    }

    // ============ Admin Functions ============

    function notifyRewardAmount(
        uint256 reward,
        uint256 duration
    ) external onlyRole(REWARDS_ADMIN_ROLE) updateReward(address(0)) {
        require(duration > 0, "Duration must be > 0");

        rewardsToken.safeTransferFrom(msg.sender, address(this), reward);

        if (block.timestamp >= periodFinish) {
            rewardRate = reward / duration;
        } else {
            uint256 remaining = periodFinish - block.timestamp;
            uint256 leftover = remaining * rewardRate;
            rewardRate = (reward + leftover) / duration;
        }

        uint256 balance = rewardsToken.balanceOf(address(this));
        require(rewardRate <= balance / duration, "Reward too high");

        lastUpdateTime = block.timestamp;
        periodFinish = block.timestamp + duration;
        rewardsDuration = duration;

        emit RewardAdded(reward, duration);
    }

    function setBonus(
        uint256 multiplierBps_,
        uint256 minDuration_
    ) external onlyRole(REWARDS_ADMIN_ROLE) {
        require(multiplierBps_ <= 5000, "Max 50% bonus");
        bonusMultiplierBps = multiplierBps_;
        bonusMinDuration = minDuration_;
        emit BonusUpdated(multiplierBps_, minDuration_);
    }

    function setLimits(
        uint256 maxStakePerUser_,
        uint256 minStakeAmount_
    ) external onlyRole(REWARDS_ADMIN_ROLE) {
        maxStakePerUser = maxStakePerUser_;
        minStakeAmount = minStakeAmount_;
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function recoverERC20(
        address tokenAddress,
        uint256 tokenAmount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(tokenAddress != address(stakingToken), "Cannot recover staking token");
        require(tokenAddress != address(rewardsToken), "Cannot recover rewards token");
        IERC20(tokenAddress).safeTransfer(msg.sender, tokenAmount);
    }
}
