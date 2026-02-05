import { ethers, network } from "hardhat";
import { config } from "./config";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Network:", network.name);

  const networkConfig =
    network.name === "base" ? config.networks.base : config.networks.baseSepolia;

  // Store deployed addresses
  const deployed: Record<string, string> = {};

  // 1. Deploy TreasuryTimelock
  console.log("\n1. Deploying TreasuryTimelock...");
  const TreasuryTimelock = await ethers.getContractFactory("TreasuryTimelock");
  const treasuryTimelock = await TreasuryTimelock.deploy(
    config.timelock.minDelay,
    [deployer.address], // proposers
    [deployer.address], // executors
    deployer.address // admin
  );
  await treasuryTimelock.waitForDeployment();
  deployed.treasuryTimelock = await treasuryTimelock.getAddress();
  console.log("TreasuryTimelock deployed to:", deployed.treasuryTimelock);

  // 2. Deploy FeeCollector (placeholder address for token initially)
  console.log("\n2. Deploying FeeCollector...");
  const FeeCollector = await ethers.getContractFactory("FeeCollector");
  const feeCollector = await FeeCollector.deploy(
    ethers.ZeroAddress, // token - will update after token deployment
    networkConfig.usdc,
    networkConfig.aerodromeRouter,
    ethers.ZeroAddress, // lpPool - will update after pool creation
    deployer.address
  );
  await feeCollector.waitForDeployment();
  deployed.feeCollector = await feeCollector.getAddress();
  console.log("FeeCollector deployed to:", deployed.feeCollector);

  // 3. Deploy OmniGraphToken
  console.log("\n3. Deploying OmniGraphToken...");
  const OmniGraphToken = await ethers.getContractFactory("OmniGraphToken");
  const token = await OmniGraphToken.deploy(
    config.token.name,
    config.token.symbol,
    deployed.feeCollector,
    ethers.parseEther(config.token.maxBurnable),
    deployer.address
  );
  await token.waitForDeployment();
  deployed.token = await token.getAddress();
  console.log("OmniGraphToken deployed to:", deployed.token);

  // 4. Deploy LPTimelock
  console.log("\n4. Deploying LPTimelock...");
  const releaseTime = Math.floor(Date.now() / 1000) + config.liquidity.lpLockDuration;
  const LPTimelock = await ethers.getContractFactory("LPTimelock");
  const lpTimelock = await LPTimelock.deploy(
    ethers.ZeroAddress, // LP token address - will update after pool creation
    deployed.treasuryTimelock, // beneficiary is treasury timelock
    releaseTime,
    deployer.address
  );
  await lpTimelock.waitForDeployment();
  deployed.lpTimelock = await lpTimelock.getAddress();
  console.log("LPTimelock deployed to:", deployed.lpTimelock);

  // 5. Deploy POLManager
  console.log("\n5. Deploying POLManager...");
  const POLManager = await ethers.getContractFactory("POLManager");
  const polManager = await POLManager.deploy(
    deployed.token,
    networkConfig.usdc,
    networkConfig.aerodromeRouter,
    ethers.ZeroAddress, // LP token - will update
    deployed.lpTimelock,
    deployer.address
  );
  await polManager.waitForDeployment();
  deployed.polManager = await polManager.getAddress();
  console.log("POLManager deployed to:", deployed.polManager);

  // 6. Deploy LotteryManager
  console.log("\n6. Deploying LotteryManager...");
  const LotteryManager = await ethers.getContractFactory("LotteryManager");
  const lotteryManager = await LotteryManager.deploy(
    networkConfig.usdc,
    deployer.address
  );
  await lotteryManager.waitForDeployment();
  deployed.lotteryManager = await lotteryManager.getAddress();
  console.log("LotteryManager deployed to:", deployed.lotteryManager);

  // 7. Deploy Vesting Contracts
  console.log("\n7. Deploying Vesting Contracts...");

  const LinearVesting = await ethers.getContractFactory("LinearVesting");

  // R1 Vesting
  const r1Vesting = await LinearVesting.deploy(
    deployed.token,
    config.vesting.r1.name,
    deployer.address
  );
  await r1Vesting.waitForDeployment();
  deployed.r1Vesting = await r1Vesting.getAddress();
  console.log("R1 Vesting deployed to:", deployed.r1Vesting);

  // R2 Vesting
  const r2Vesting = await LinearVesting.deploy(
    deployed.token,
    config.vesting.r2.name,
    deployer.address
  );
  await r2Vesting.waitForDeployment();
  deployed.r2Vesting = await r2Vesting.getAddress();
  console.log("R2 Vesting deployed to:", deployed.r2Vesting);

  // R3 Vesting
  const r3Vesting = await LinearVesting.deploy(
    deployed.token,
    config.vesting.r3.name,
    deployer.address
  );
  await r3Vesting.waitForDeployment();
  deployed.r3Vesting = await r3Vesting.getAddress();
  console.log("R3 Vesting deployed to:", deployed.r3Vesting);

  // Team Vesting
  const teamVesting = await LinearVesting.deploy(
    deployed.token,
    config.vesting.team.name,
    deployer.address
  );
  await teamVesting.waitForDeployment();
  deployed.teamVesting = await teamVesting.getAddress();
  console.log("Team Vesting deployed to:", deployed.teamVesting);

  // 8. Deploy VestingAggregator
  console.log("\n8. Deploying VestingAggregator...");
  const VestingAggregator = await ethers.getContractFactory("VestingAggregator");
  const vestingAggregator = await VestingAggregator.deploy(deployer.address);
  await vestingAggregator.waitForDeployment();
  deployed.vestingAggregator = await vestingAggregator.getAddress();
  console.log("VestingAggregator deployed to:", deployed.vestingAggregator);

  // 9. Deploy Staking Contracts
  console.log("\n9. Deploying Staking Contracts...");

  const StakingSingle = await ethers.getContractFactory("StakingSingle");
  const stakingSingle = await StakingSingle.deploy(
    deployed.token,
    deployed.token,
    deployer.address
  );
  await stakingSingle.waitForDeployment();
  deployed.stakingSingle = await stakingSingle.getAddress();
  console.log("StakingSingle deployed to:", deployed.stakingSingle);

  const StakingLP = await ethers.getContractFactory("StakingLP");
  const stakingLP = await StakingLP.deploy(
    ethers.ZeroAddress, // LP token - will update after pool creation
    deployed.token,
    deployer.address
  );
  await stakingLP.waitForDeployment();
  deployed.stakingLP = await stakingLP.getAddress();
  console.log("StakingLP deployed to:", deployed.stakingLP);

  // 10. Configure contracts
  console.log("\n10. Configuring contracts...");

  // Configure FeeCollector
  console.log("Configuring FeeCollector addresses...");
  await feeCollector.setAddresses(
    deployed.polManager,
    deployed.treasuryTimelock,
    deployed.lotteryManager
  );

  // Configure VestingAggregator
  console.log("Configuring VestingAggregator...");
  await vestingAggregator.addVestingContractsBatch([
    deployed.r1Vesting,
    deployed.r2Vesting,
    deployed.r3Vesting,
    deployed.teamVesting,
  ]);

  // Exclude vesting contracts from fees
  console.log("Setting fee exclusions...");
  await token.setExcludedFromFees(deployed.r1Vesting, true);
  await token.setExcludedFromFees(deployed.r2Vesting, true);
  await token.setExcludedFromFees(deployed.r3Vesting, true);
  await token.setExcludedFromFees(deployed.teamVesting, true);
  await token.setExcludedFromFees(deployed.polManager, true);
  await token.setExcludedFromFees(deployed.stakingSingle, true);
  await token.setExcludedFromFees(deployed.stakingLP, true);

  // Exclude from limits
  await token.setExcludedFromLimits(deployed.r1Vesting, true);
  await token.setExcludedFromLimits(deployed.r2Vesting, true);
  await token.setExcludedFromLimits(deployed.r3Vesting, true);
  await token.setExcludedFromLimits(deployed.teamVesting, true);
  await token.setExcludedFromLimits(deployed.polManager, true);

  console.log("\n========================================");
  console.log("DEPLOYMENT COMPLETE");
  console.log("========================================\n");
  console.log("Deployed Addresses:");
  console.log(JSON.stringify(deployed, null, 2));

  console.log("\n========================================");
  console.log("NEXT STEPS");
  console.log("========================================");
  console.log("1. Create LP pool on Aerodrome");
  console.log("2. Update lpPair address on token contract");
  console.log("3. Update LP token addresses on POLManager and StakingLP");
  console.log("4. Update LP token address on LPTimelock");
  console.log("5. Distribute tokens to vesting contracts");
  console.log("6. Create vesting schedules for investors");
  console.log("7. Add initial liquidity");
  console.log("8. Enable trading");
  console.log("9. Transfer ownership to treasury timelock");

  // Save deployment addresses to file
  const fs = await import("fs");
  const deploymentPath = `./deployments/${network.name}-${Date.now()}.json`;
  fs.writeFileSync(deploymentPath, JSON.stringify(deployed, null, 2));
  console.log(`\nDeployment addresses saved to: ${deploymentPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
