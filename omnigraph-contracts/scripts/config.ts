// Deployment configuration for OmniGraph Token
export const config = {
  // Token parameters
  token: {
    name: "OmniGraph",
    symbol: "OGX",
    maxSupply: "1000000000", // 1 billion
    maxBurnable: "300000000", // 30% = 300 million
  },

  // Initial tax rates (Months 0-3)
  taxes: {
    phase1: {
      // Months 0-3
      buyTaxBps: 300, // 3%
      sellTaxBps: 700, // 7%
    },
    phase2: {
      // Months 3-7
      buyTaxBps: 240, // 2.4%
      sellTaxBps: 560, // 5.6%
    },
    phase3: {
      // Months 7-12
      buyTaxBps: 200, // 2%
      sellTaxBps: 400, // 4%
    },
  },

  // Fee splits (in basis points, must sum to 10000)
  feeSplits: {
    phase1: {
      // Months 0-3
      polBps: 4000, // 40%
      treasuryBps: 3000, // 30%
      burnBps: 2000, // 20%
      lotteryBps: 1000, // 10%
    },
    phase2: {
      // Months 3-7
      polBps: 4800, // 48%
      treasuryBps: 3000, // 30%
      burnBps: 1200, // 12%
      lotteryBps: 1000, // 10%
    },
    phase3: {
      // Months 7-12
      polBps: 5500, // 55%
      treasuryBps: 3000, // 30%
      burnBps: 500, // 5%
      lotteryBps: 1000, // 10%
    },
  },

  // Launch protection
  launchProtection: {
    maxTxAmountBps: 100, // 1% of supply
    maxWalletAmountBps: 200, // 2% of supply
    sniperProtectionBlocks: 10,
    sniperSellTaxBps: 700, // Max sell tax during sniper protection
  },

  // Vesting schedules
  vesting: {
    r1: {
      name: "R1 Vesting",
      tgeLiquidBps: 3500, // 35% liquid at TGE
      vestingDuration: 18 * 30 * 24 * 60 * 60, // 18 months in seconds
    },
    r2: {
      name: "R2 Vesting",
      tgeLiquidBps: 3500, // 35% liquid at TGE
      vestingDuration: 15 * 30 * 24 * 60 * 60, // 15 months
    },
    r3: {
      name: "R3 Vesting",
      tgeLiquidBps: 4000, // 40% liquid at TGE
      vestingDuration: 12 * 30 * 24 * 60 * 60, // 12 months
    },
    team: {
      name: "Team Vesting",
      tgeLiquidBps: 0, // 0% liquid at TGE
      vestingDuration: 24 * 30 * 24 * 60 * 60, // 24 months
      cliffDuration: 6 * 30 * 24 * 60 * 60, // 6 month cliff
    },
  },

  // LP configuration
  liquidity: {
    initialUSDC: "50000", // $50k USDC
    initialTokens: "2500000", // 2.5M tokens
    lpLockDuration: 6 * 30 * 24 * 60 * 60, // 6 months
  },

  // Treasury timelock
  timelock: {
    minDelay: 48 * 60 * 60, // 48 hours
  },

  // Staking
  staking: {
    minStakeAmount: "1", // 1 token
    bonusMultiplierBps: 1000, // 10% bonus
    bonusMinDuration: 30 * 24 * 60 * 60, // 30 days
  },

  // Lottery
  lottery: {
    minPrizePool: "100", // 100 USDC
    maxPrizePayoutBps: 9000, // 90%
    defaultEpochDuration: 7 * 24 * 60 * 60, // 7 days
  },

  // Network-specific addresses
  networks: {
    base: {
      usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      aerodromeRouter: "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43",
      aerodromeFactory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
      vrfCoordinator: "0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634",
      vrfKeyHash:
        "0x00b81b5e9ba5de4edde84f0c27e8cb8b3c8b8f8a38f30f29a8eb34f65d4f8e8e",
    },
    baseSepolia: {
      usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Test USDC
      aerodromeRouter: "0x0000000000000000000000000000000000000000", // Update with testnet
      aerodromeFactory: "0x0000000000000000000000000000000000000000",
      vrfCoordinator: "0x0000000000000000000000000000000000000000",
      vrfKeyHash:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
  },
};

export default config;
