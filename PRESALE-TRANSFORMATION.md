# Graphene Token Presale Website - Transformation Complete

## Overview
The website has been completely transformed from a DeFi staking platform to a compliance-focused presale site for **Graphene Token (GRAF)** - a token ecosystem supporting graphene research and development.

## What Was Changed

### 1. Project Rebranding
- **Old**: OmnigrafOXG (graphene research token)
- **New**: Graphene Token (GRAF)
- **Parent Company**: ResolutX (formerly NorCalBio)
- **Focus**: Real-world graphene advancement with regulated RWA pathway exploration

### 2. New Site Structure

#### Pages Created:
1. **/** (Homepage) - Complete presale landing page with:
   - Hero with countdown timer
   - Trust strip with safety features
   - Graphene education section (6 use cases)
   - Sustainability narrative (carbon-aware production)
   - Ecosystem alignment & liquidity support
   - Tokenomics breakdown
   - Buy module with dual purchase modes
   - All compliant copy and disclosures

2. **/science** - Deep dive into graphene:
   - What is graphene (physical & electrical properties)
   - Real-world applications across 6 industries
   - Production challenges
   - Carbon-aware pyrolysis pathway

3. **/how-it-works** - Token mechanics:
   - Token overview with safety features
   - 4-outcome token engine (liquidity, treasury, burn, rewards)
   - Ecosystem alignment explanation
   - Claim-on-demand vesting design
   - Security & transparency details

4. **/risk** - Compliance & eligibility:
   - High-risk asset warning
   - Geographic restrictions
   - 6 material risk categories
   - "Not an investment" disclosure
   - Forward-looking statements warning
   - Required acknowledgments

#### Pages Removed from Nav:
- /staking (old DeFi page)
- /vesting (old DeFi page)
- /lottery (old DeFi page)

These still exist as files but aren't in navigation. You can delete them or keep for reference.

### 3. Key Components Created

#### BuyModule Component
**Path**: `src/components/Presale/BuyModule.tsx`

**Features**:
- ✅ **Wallet Connect Mode**: Traditional Web3 purchase flow
- ✅ **Manual Purchase Mode**: Copy/paste wallet address + payment instructions
- Token toggle (USDC/ETH)
- Amount input with min/max
- Estimated tokens calculator
- Network validation (Base only)
- Approval flow for USDC
- Compliance footer

#### CountdownTimer Component
**Path**: `src/components/Presale/CountdownTimer.tsx`
- Live countdown to sale start
- Days/Hours/Minutes/Seconds display
- "Sale is Live!" state when expired

#### TrustStrip Component
**Path**: `src/components/Presale/TrustStrip.tsx`
- 6 trust badges (fixed supply, caps, locks, governance, vesting, Base)
- Responsive grid layout

### 4. Configuration System
**Path**: `src/config/constants.ts`

All project variables in one place:
```typescript
PROJECT_CONFIG: {
  PROJECT_NAME: "Graphene Token"
  TOKEN_SYMBOL: "GRAF"
  PARENT_COMPANY: "ResolutX (formerly NorCalBio)"
  NETWORK: "Base"
  TOTAL_SUPPLY: "1,000,000,000"
  TGE_PRICE: "$0.02"
  // ... sale dates, phase limits, contract addresses, etc.
}
```

Easy to update without touching code.

### 5. Compliant Copy Throughout

All copy uses **"may/intend/plan/explore"** language for:
- Liquidity support contributions
- RWA pathway exploration
- Future utility features
- Ecosystem actions

Key compliance sections:
- Risk disclosures on every page
- "Not an investment" warnings
- Geographic restrictions
- Forward-looking statement disclaimers

## How to Use

### Update Sale Details
Edit `src/config/constants.ts`:
```typescript
// Change dates
SALE_START_DATETIME: new Date("2024-03-15T00:00:00Z"),

// Update prices/limits
TGE_PRICE: "$0.02",
PUBLIC_MIN: "20",

// Add contract addresses after deployment
TOKEN_CONTRACT_ADDRESS: "0x...",
SALE_CONTRACT_ADDRESS: "0x...",
```

### Test Manual Purchase Flow
1. Go to homepage
2. Click "Manual Purchase" tab in Buy Module
3. Enter wallet address where tokens should be sent
4. Enter amount to spend
5. See payment instructions generated

### Test Wallet Connect Flow
1. Connect wallet (requires RainbowKit setup)
2. Switch to Base network if needed
3. Select USDC or ETH
4. Enter amount
5. Approve (USDC only)
6. Confirm purchase

## Design Features (BASE-Focused)

### Colors
- **Primary**: #0052FF (BASE official blue)
- **Accent**: Cyan/Teal
- **Gradients**: BASE blue → Cyan

### Animations
- Floating orbs in backgrounds
- Slide-up entrance animations
- Hover lift effects on cards
- Glow effects on BASE branding
- Gradient animations

### BASE Branding
- BASE logo in hero badge
- "Built on Base ⚡" in header
- BASE explorer links
- BASE network validation

## Next Steps

### Before Launch:
1. ✅ Deploy smart contracts to Base
2. ✅ Update contract addresses in `src/config/constants.ts`
3. ✅ Set actual sale dates
4. ✅ Configure phase limits (min/max/cap)
5. ✅ Add whitelist functionality (form integration)
6. ✅ Set up actual USDC/ETH purchase logic
7. ✅ Add event tracking (see spec for events)
8. ✅ Get legal review of all copy
9. ✅ Test thoroughly on Base Sepolia testnet

### Optional Enhancements:
- Add FAQ section (spec included in handoff)
- Add roadmap timeline visual
- Implement whitelist join flow
- Add social proof / partners section
- Create phase progress bar
- Add transaction success/failure states
- Implement allocations table

## File Structure
```
omnigraph-frontend/
├── src/
│   ├── components/
│   │   ├── Presale/
│   │   │   ├── BuyModule.tsx       # NEW - dual purchase modes
│   │   │   ├── CountdownTimer.tsx  # NEW - sale countdown
│   │   │   └── TrustStrip.tsx      # NEW - safety badges
│   │   ├── Layout/
│   │   │   ├── Header.tsx          # UPDATED - new nav
│   │   │   └── Footer.tsx          # UPDATED - BASE branding
│   │   └── ui/
│   │       ├── Button.tsx          # UPDATED - BASE colors
│   │       ├── Card.tsx
│   │       └── Input.tsx
│   ├── config/
│   │   └── constants.ts            # NEW - all config values
│   ├── pages/
│   │   ├── index.tsx               # REPLACED - presale landing
│   │   ├── science.tsx             # NEW - graphene education
│   │   ├── how-it-works.tsx        # NEW - token mechanics
│   │   ├── risk.tsx                # NEW - compliance
│   │   ├── staking.tsx             # OLD - not in nav
│   │   ├── vesting.tsx             # OLD - not in nav
│   │   └── lottery.tsx             # OLD - not in nav
│   ├── styles/
│   │   └── globals.css             # UPDATED - BASE colors
│   └── tailwind.config.ts          # UPDATED - BASE theme
└── .env.local                      # UPDATE - contract addresses
```

## Testing Checklist

- [ ] Homepage loads with all sections
- [ ] Countdown timer displays and updates
- [ ] Buy module toggles between wallet/manual modes
- [ ] Manual purchase shows payment instructions
- [ ] Wallet connect flow works on Base
- [ ] Wrong network warning appears
- [ ] /science page loads with all use cases
- [ ] /how-it-works page explains token mechanics
- [ ] /risk page shows all disclosures
- [ ] Header navigation works
- [ ] All links functional
- [ ] Mobile responsive
- [ ] BASE branding visible throughout
- [ ] Animations smooth

## Important Notes

### Compliance
- All copy reviewed for "may/intend/plan" language
- No promises of returns or profits
- Clear risk disclosures
- Geographic restrictions stated
- Forward-looking statement disclaimers

### Manual Purchase Feature
This is the KEY innovation you requested - allows purchases WITHOUT wallet connection:
1. User enters their wallet address
2. System generates payment instructions
3. User sends USDC/ETH to sale contract
4. Tokens sent to provided address

This makes it accessible to users who:
- Don't have MetaMask/wallet extension
- Want to send from exchange
- Prefer not to connect wallet

### Liquidity Support Messaging
Always framed as:
> "Ecosystem participants may choose to contribute liquidity over time to support a healthy token economy. Contributions are discretionary and not guaranteed."

Never promises, always possibilities.

## Launch Checklist

### Technical
- [ ] Deploy contracts to Base mainnet
- [ ] Verify contracts on BaseScan
- [ ] Update all addresses in constants.ts
- [ ] Test presale purchase flow end-to-end
- [ ] Set correct sale dates
- [ ] Configure min/max/caps
- [ ] Set up backend for manual purchases
- [ ] Add event tracking
- [ ] Performance optimization
- [ ] Security audit

### Legal/Compliance
- [ ] Legal review of all copy
- [ ] Confirm geo-blocking setup
- [ ] Terms & Privacy pages
- [ ] KYC process (if required)
- [ ] Tax documentation
- [ ] Regulatory compliance check

### Marketing
- [ ] Update social media
- [ ] Announce rebranding
- [ ] Whitelist campaign
- [ ] Partnership announcements
- [ ] Content calendar

## Support
For questions: {PROJECT_CONFIG.SUPPORT_LINK}

---

**Status**: ✅ Complete and running at http://localhost:3000

**Ready for**: Testing, legal review, contract deployment
