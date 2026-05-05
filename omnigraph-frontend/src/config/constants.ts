// Global constants for the Graphene Token project
// Update these values as needed

export const PROJECT_CONFIG = {
  // Project Identity
  PROJECT_NAME: "Graphene Token",
  TOKEN_SYMBOL: "TBD",
  PARENT_COMPANY: "ResolutX (formerly NorCalBio)",

  // Network
  NETWORK: "Solana",
  SOLANA_CLUSTER: "mainnet-beta",
  // Default public RPC — override with NEXT_PUBLIC_SOLANA_RPC for a private endpoint (Helius, Triton, etc.)
  SOLANA_RPC: process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com",
  // Mainnet USDC mint
  USDC_MINT: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",

  // Token Economics
  TOTAL_SUPPLY: "1,000,000,000",
  TGE_PRICE: "$0.004500",
  TGE_PRICE_NUMERIC: 0.0045,
  PRESALE_PRICE: "$0.001539",
  PRESALE_PRICE_NUMERIC: 0.001539,
  PRESALE_DISCOUNT: "65.8%",
  LAUNCH_FDV: "$4.5M",
  PEAK_FDV: "$9.7M",
  SOFT_CAP: "$120,000",
  HARD_CAP: "$360,000",
  CIRCULATING_AT_TGE: "160,400,000",
  CIRCULATING_PCT: "16%",
  DEX: "Jupiter",

  // Accepted Tokens
  ACCEPTED_TOKENS: ["USDC", "SOL"],

  // Sale Dates (UTC timestamps - update these)
  SALE_START_DATETIME: new Date("2024-03-15T00:00:00Z"),
  SALE_END_DATETIME: new Date("2024-04-15T00:00:00Z"),

  // Phase Dates
  PRIVATE_START: new Date("2024-03-15T00:00:00Z"),
  PRIVATE_END: new Date("2024-03-22T00:00:00Z"),
  WL_START: new Date("2024-03-22T00:00:00Z"),
  WL_END: new Date("2024-03-29T00:00:00Z"),
  PUBLIC_START: new Date("2024-03-29T00:00:00Z"),
  PUBLIC_END: new Date("2024-04-15T00:00:00Z"),

  // Phase Limits
  PRIVATE_MIN: "100",
  PRIVATE_MAX: "10,000",
  PRIVATE_CAP: "50,000,000",

  WL_MIN: "50",
  WL_MAX: "5,000",
  WL_CAP: "100,000,000",

  PUBLIC_MIN: "100",
  PUBLIC_MAX: "2,000",
  PUBLIC_CAP: "150,000,000",

  // Geo Restrictions
  GEO_RESTRICTIONS_TEXT: "Participation may be restricted in certain jurisdictions including the United States. Please verify your eligibility before participating.",

  // Links & Addresses (placeholders)
  TOKEN_CONTRACT_ADDRESS: "TBD", // Update after deployment (Solana mint address)
  SALE_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_PRESALE_WALLET || "663atiZucS388vR1i1p7vQAt5EHtLLMxf885FVLJmkgf",
  DOCS_URL: "/docs",
  SUPPORT_LINK: "mailto:support@resolutx.com",
  KYC_LINK: "/kyc",
  BASE_EXPLORER_URL: "https://solscan.io",

  // Social Links
  TWITTER_URL: "https://x.com/OmnigrafOGX",
  DISCORD_URL: "",
  TELEGRAM_URL: "https://t.me/graphenetoken",

  // Tax Caps
  MAX_BUY_TAX: "3%",
  MAX_SELL_TAX: "7%",

  // Vesting Info
  R1_TGE: "35%",
  R1_VESTING: "65% over 18 months",
  R2_TGE: "35%",
  R2_VESTING: "65% over 15 months",
  R3_TGE: "40%",
  R3_VESTING: "60% over 12 months",
};

// Feature flags
export const FEATURES = {
  WHITELIST_ENABLED: true,
  KYC_REQUIRED: false,
  MANUAL_ADDRESS_PURCHASE: true, // Key feature: buy without connecting wallet
};

// Placeholders for future features
export const PLACEHOLDERS = {
  ALLOCATIONS_TABLE: "Detailed allocation breakdown coming soon",
  UTILITY_FEATURES: "ecosystem access programs, research collaboration tools",
  FUTURE_MECHANICS: "staking, governance participation, ecosystem rewards",
  GOVERNANCE: "community governance framework (timeline TBD)",
  REWARDS: "designed to incentivize long-term participation",
  PARTNERS: "research institutions and graphene producers",
  RWA_PLAN: "exploring pathways toward regulated real-world asset framework",
  TREASURY_TRANSPARENCY: "ecosystem actions will be documented on-chain",
  SUSTAINABILITY_VERIFICATION: "LCA verification in progress",
};

// Compliance text
export const COMPLIANCE = {
  RISK_DISCLOSURE: "Crypto assets are high-risk and volatile. This token does not guarantee profit, returns, or price appreciation. Please review eligibility and risks before participating.",

  FOOTER_DISCLOSURE: "This website is for informational purposes only and does not constitute financial advice, legal advice, or an offer where prohibited. Crypto assets are volatile and high-risk. Participation may be restricted by jurisdiction and may require verification.",

  LIQUIDITY_SUPPORT: "Ecosystem participants may choose to contribute liquidity over time to support a healthy token economy. Contributions are discretionary and not guaranteed.",

  NO_INVESTMENT: "This token is not a guarantee of profit or returns. Crypto assets are volatile and high-risk. No returns are promised.",
};
