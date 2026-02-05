# OmnigrafOXG Frontend

Community-driven web interface for the OmnigrafOXG token - powering decentralized graphene research and development on Base Network.

## About OmnigrafOXG

OmnigrafOXG is a deflationary ERC20 token with dynamic tokenomics designed to fund graphene R&D initiatives. The protocol uses transaction fees to build protocol-owned liquidity, support a research treasury, implement token burns, and fund community lottery prizes.

### Mission
Democratize access to graphene research funding and accelerate the transition from laboratory innovation to industrial-scale production through community-driven tokenomics.

## Features

- **Dashboard**: Token statistics, protocol health metrics, and graphene research information
- **Staking**: Stake OGX or LP tokens to earn rewards and support research funding
- **Vesting**: Linear vesting with claim-on-demand for early supporters
- **Lottery**: Community lottery system with automatic entries for stakers
- **Web3 Integration**: RainbowKit wallet connection with Base network support

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS with custom design system
- **Web3**: wagmi v2 + viem for Ethereum interactions
- **Wallet**: RainbowKit for multi-wallet support
- **Network**: Base (Ethereum L2)

## Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node 20+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your contract addresses after deployment
```

### Environment Variables

Update `.env.local` with deployed contract addresses:

```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_FEE_COLLECTOR_ADDRESS=0x...
NEXT_PUBLIC_POL_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_LP_TIMELOCK_ADDRESS=0x...
NEXT_PUBLIC_STAKING_SINGLE_ADDRESS=0x...
NEXT_PUBLIC_STAKING_LP_ADDRESS=0x...
NEXT_PUBLIC_LOTTERY_ADDRESS=0x...
NEXT_PUBLIC_VESTING_AGGREGATOR_ADDRESS=0x...
NEXT_PUBLIC_LP_PAIR_ADDRESS=0x...
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
# Build
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── components/        # React components
│   ├── Dashboard/    # Dashboard-specific components
│   ├── Staking/      # Staking interface
│   ├── Vesting/      # Vesting interface
│   ├── Lottery/      # Lottery interface
│   ├── Layout/       # Header, Footer
│   └── ui/           # Reusable UI components
├── contracts/        # Contract ABIs and addresses
├── context/          # React context providers
├── hooks/            # Custom React hooks for contract interactions
├── pages/            # Next.js pages
├── styles/           # Global styles
└── utils/            # Utility functions
```

## Key Components

### Contract Hooks

- `useToken()` - Token balance, supply, tax rates
- `useStakingSingle()` - Single-token staking data
- `useStakingLP()` - LP staking with bonus system
- `useVesting()` - Vesting schedule information
- `useLottery()` - Lottery entries and prizes
- `useProtocolStats()` - Protocol health metrics

### Pages

- `/` - Dashboard with research focus and tokenomics
- `/staking` - Stake OGX or LP tokens
- `/vesting` - View and claim vested tokens
- `/lottery` - Community lottery with automatic entries

## Branding

**Colors:**
- Primary: Blue (#0ea5e9) - Represents research and technology
- Accent: Cyan (#06b6d4) - Scientific innovation
- Supporting: Purple, Orange, Green for data visualization

**Typography:**
- Display: Inter (bold, gradient text for headers)
- Body: Inter (regular)
- Code: JetBrains Mono

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build the static site and deploy the `.next` directory:

```bash
npm run build
# Deploy .next folder to your hosting provider
```

## Contributing

This is a community-driven project. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Links

- Website: [https://omnigrafx.com](https://omnigrafx.com) (update with actual URL)
- Discord: [https://discord.gg/omnigrafoxg](https://discord.gg/omnigrafoxg)
- Twitter: [@omnigrafoxg](https://twitter.com/omnigrafoxg)
- Docs: [https://docs.omnigrafoxg.io](https://docs.omnigrafoxg.io)

## Support

For support, join our Discord community or reach out to the team.

---

**Advancing graphene technology through community-driven tokenomics** 🔬⚗️
