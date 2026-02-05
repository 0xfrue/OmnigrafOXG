import { ethers, network } from "hardhat";
import { config } from "./config";

interface VestingAllocation {
  beneficiary: string;
  totalAmount: string; // In tokens (will be parsed to wei)
  tgeLiquidBps: number;
}

/**
 * Script to set up vesting schedules after deployment
 * Modify the allocations array with actual investor addresses and amounts
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Setting up vesting with account:", deployer.address);

  // Load deployment addresses
  const deploymentFile = process.env.DEPLOYMENT_FILE;
  if (!deploymentFile) {
    throw new Error("Set DEPLOYMENT_FILE env var to the deployment JSON path");
  }

  const fs = await import("fs");
  const deployed = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));

  // Get contract instances
  const token = await ethers.getContractAt("OmniGraphToken", deployed.token);
  const r1Vesting = await ethers.getContractAt("LinearVesting", deployed.r1Vesting);
  const r2Vesting = await ethers.getContractAt("LinearVesting", deployed.r2Vesting);
  const r3Vesting = await ethers.getContractAt("LinearVesting", deployed.r3Vesting);
  const teamVesting = await ethers.getContractAt("LinearVesting", deployed.teamVesting);

  // Example allocations - REPLACE WITH ACTUAL DATA
  const r1Allocations: VestingAllocation[] = [
    // { beneficiary: "0x...", totalAmount: "1000000", tgeLiquidBps: 3500 },
  ];

  const r2Allocations: VestingAllocation[] = [
    // { beneficiary: "0x...", totalAmount: "500000", tgeLiquidBps: 3500 },
  ];

  const r3Allocations: VestingAllocation[] = [
    // { beneficiary: "0x...", totalAmount: "250000", tgeLiquidBps: 4000 },
  ];

  const teamAllocations: VestingAllocation[] = [
    // { beneficiary: "0x...", totalAmount: "50000000", tgeLiquidBps: 0 },
  ];

  const tgeTimestamp = Math.floor(Date.now() / 1000); // Use actual TGE timestamp

  async function setupVesting(
    vestingContract: any,
    vestingName: string,
    allocations: VestingAllocation[],
    vestingDuration: number,
    revocable: boolean = false
  ) {
    if (allocations.length === 0) {
      console.log(`\nNo allocations for ${vestingName}, skipping...`);
      return;
    }

    console.log(`\nSetting up ${vestingName}...`);

    // Calculate total tokens needed
    let totalTokens = BigInt(0);
    for (const alloc of allocations) {
      totalTokens += ethers.parseEther(alloc.totalAmount);
    }

    // Transfer tokens to vesting contract
    console.log(`Transferring ${ethers.formatEther(totalTokens)} tokens to ${vestingName}...`);
    await token.transfer(await vestingContract.getAddress(), totalTokens);

    // Create vesting schedules
    for (const alloc of allocations) {
      const totalAmount = ethers.parseEther(alloc.totalAmount);
      const liquidAmount = (totalAmount * BigInt(alloc.tgeLiquidBps)) / BigInt(10000);
      const vestingAmount = totalAmount - liquidAmount;

      // Send TGE liquid portion directly to beneficiary
      if (liquidAmount > 0) {
        console.log(
          `Sending ${ethers.formatEther(liquidAmount)} TGE tokens to ${alloc.beneficiary}...`
        );
        await token.transfer(alloc.beneficiary, liquidAmount);
      }

      // Create vesting schedule for remaining
      if (vestingAmount > 0) {
        console.log(
          `Creating vesting schedule for ${alloc.beneficiary}: ${ethers.formatEther(vestingAmount)} over ${vestingDuration / (30 * 24 * 60 * 60)} months...`
        );
        await vestingContract.createVesting(
          alloc.beneficiary,
          vestingAmount,
          tgeTimestamp,
          vestingDuration,
          revocable
        );
      }
    }

    console.log(`${vestingName} setup complete!`);
  }

  // Setup each vesting contract
  await setupVesting(
    r1Vesting,
    "R1 Vesting",
    r1Allocations,
    config.vesting.r1.vestingDuration
  );

  await setupVesting(
    r2Vesting,
    "R2 Vesting",
    r2Allocations,
    config.vesting.r2.vestingDuration
  );

  await setupVesting(
    r3Vesting,
    "R3 Vesting",
    r3Allocations,
    config.vesting.r3.vestingDuration
  );

  await setupVesting(
    teamVesting,
    "Team Vesting",
    teamAllocations,
    config.vesting.team.vestingDuration,
    true // Team vesting is revocable
  );

  console.log("\n========================================");
  console.log("VESTING SETUP COMPLETE");
  console.log("========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
