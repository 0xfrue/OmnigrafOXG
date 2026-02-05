import { ethers, network } from "hardhat";
import { config } from "./config";

/**
 * Script to set up initial liquidity after deployment
 * Run after deploy.ts and after obtaining LP pool address
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Setting up liquidity with account:", deployer.address);

  // Load deployment addresses (update path as needed)
  const deploymentFile = process.env.DEPLOYMENT_FILE;
  if (!deploymentFile) {
    throw new Error("Set DEPLOYMENT_FILE env var to the deployment JSON path");
  }

  const fs = await import("fs");
  const deployed = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));

  const networkConfig =
    network.name === "base" ? config.networks.base : config.networks.baseSepolia;

  // Get contract instances
  const token = await ethers.getContractAt("OmniGraphToken", deployed.token);
  const feeCollector = await ethers.getContractAt("FeeCollector", deployed.feeCollector);
  const polManager = await ethers.getContractAt("POLManager", deployed.polManager);
  const lpTimelock = await ethers.getContractAt("LPTimelock", deployed.lpTimelock);
  const stakingLP = await ethers.getContractAt("StakingLP", deployed.stakingLP);

  // LP Pool address (get this from Aerodrome after creating pool)
  const lpPoolAddress = process.env.LP_POOL_ADDRESS;
  if (!lpPoolAddress) {
    throw new Error("Set LP_POOL_ADDRESS env var");
  }

  console.log("\n1. Updating LP pair address on token...");
  await token.setLpPair(lpPoolAddress);
  console.log("LP pair set to:", lpPoolAddress);

  console.log("\n2. Updating FeeCollector router and pool...");
  await feeCollector.setRouter(networkConfig.aerodromeRouter, lpPoolAddress);
  console.log("FeeCollector updated");

  console.log("\n3. Updating POLManager LP token...");
  await polManager.setLpToken(lpPoolAddress);
  console.log("POLManager LP token updated");

  console.log("\n4. Updating StakingLP LP token...");
  // Note: StakingLP has immutable stakingToken, so you may need to redeploy
  // if LP token wasn't set correctly at deployment
  console.log("Note: StakingLP stakingToken is immutable - redeploy if needed");

  console.log("\n5. Approving tokens for liquidity...");
  const tokenAmount = ethers.parseEther(config.liquidity.initialTokens);
  const usdcAmount = ethers.parseUnits(config.liquidity.initialUSDC, 6);

  // Approve router
  await token.approve(networkConfig.aerodromeRouter, tokenAmount);
  console.log("Token approved for router");

  // Note: You'll need to approve USDC separately and add liquidity via Aerodrome router

  console.log("\n========================================");
  console.log("LIQUIDITY SETUP COMPLETE");
  console.log("========================================");
  console.log("\nNext steps:");
  console.log("1. Approve USDC for Aerodrome router");
  console.log("2. Add liquidity via Aerodrome UI or router contract");
  console.log("3. Send LP tokens to LPTimelock for locking");
  console.log("4. Enable trading: token.enableTrading()");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
