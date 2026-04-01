# GreenLedger 🌿

**Carbon credit tokenisation platform for farmers — verified by satellite, powered by AI & blockchain.**

> Built for hackathon demo. Farmers who practice organic/sustainable farming earn tokenised carbon credits verified by satellite imagery. Credits are tradeable on a built-in secondary marketplace. The AI agent scores the farm, detects fraud, and shows its reasoning **live on screen**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), Tailwind CSS v4, Framer Motion |
| Maps | Leaflet + ESRI satellite tiles |
| AI Agent | Mastra-style async generator agent (NDVI scoring + fraud detection) |
| Blockchain | ERC-1155, ethers.js v6, Polygon Mumbai testnet |
| Storage | Pinata IPFS |
| Auth | Supabase Auth |

---

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A Supabase project (free tier works)
- A Mapbox token (free tier works)
- MetaMask wallet for marketplace buying

---

## Setup

### 1. Install dependencies
```bash
pnpm install
```

### 2. Configure environment variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in at minimum:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_MAPBOX_TOKEN=...
NEXT_PUBLIC_DEMO_MODE=true    # ← enables full mock mode, no testnet needed
```

### 3. Run the development server
```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Smart Contract Deploy (optional — skip for demo mode)

### Prerequisites
- Install Hardhat: `npm install --save-dev hardhat @openzeppelin/contracts`
- Set `PRIVATE_KEY` in `.env.local`

### Deploy to Polygon Mumbai
```bash
cd contracts
npx hardhat run deploy.js --network mumbai
```

Copy the deployed address into `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`.

### Get Mumbai testnet MATIC
- [Polygon Faucet](https://faucet.polygon.technology/)
- [Alchemy Mumbai Faucet](https://mumbaifaucet.com/)

---

## Demo Seed Script

Pre-seed 3 Karnataka farms with NDVI scores and mock data:
```bash
npx ts-node scripts/seedDemo.ts
```

---

## 60-Second Judge Demo Flow

1. **Open** `/verify` — map shows 3 farms in Karnataka, India
2. **Click** "Organic Rice Farm - Mandya" tab
3. **Click** "Verify Farm" — watch AI agent stream reasoning lines live
4. **NDVI score** animates from 0 → 0.82
5. **"APPROVED — 63 Credits"** appears in green
6. **Click** "Mint Credits on Polygon" → mock tx hash appears
7. **Click** "View on Polygonscan" → opens explorer link
8. **Click** "View on Marketplace" → see all 3 farm listings
9. **Filter** by NDVI score, connect wallet, click Buy

**Total time: ~45 seconds. Zero broken states.**

> 💡 `NEXT_PUBLIC_DEMO_MODE=true` means **no real API calls** are made. Everything works instantly without IPFS, blockchain, or testnet.

---

## Project Structure

```
├── contracts/
│   ├── GreenLedger.sol          # ERC-1155 carbon credit contract
│   └── deploy.js                # Hardhat deploy → Mumbai
├── agent/
│   ├── farmAgent.ts             # Async generator agent (streams reasoning)
│   ├── scoring.ts               # NDVI calculation logic
│   └── fraudDetection.ts        # Duplicate/frequency fraud checks
├── lib/
│   ├── types.ts                 # Shared TypeScript interfaces
│   ├── constants.ts             # Contract address, demo farms, chain config
│   ├── blockchain.ts            # ethers.js v6 contract helpers
│   └── ipfs.ts                  # Pinata upload helpers
├── src/app/
│   ├── page.tsx                 # Landing page with live stats
│   ├── verify/page.tsx          # ★ Demo wow page — the main demo flow
│   ├── marketplace/page.tsx     # Buy/sell credit listings
│   ├── dashboard/page.tsx       # Farmer dashboard
│   ├── components/
│   │   ├── AgentReasoning.tsx   # Terminal-style live AI reasoning panel
│   │   ├── CreditCard.tsx       # Carbon credit token card
│   │   ├── FarmMap.tsx          # Satellite map with farm polygon
│   │   └── Marketplace.tsx      # Listings grid + buy flow
│   └── api/
│       ├── upload-image/        # Pinata IPFS upload
│       ├── mint-token/          # Contract mintCredits() call
│       └── verify-farm/         # Streaming agent response
└── scripts/
    └── seedDemo.ts              # Pre-seed demo farms
```

---

## Key Features

### 🛰️ Satellite Verification
NDVI (Normalized Difference Vegetation Index) is calculated from farm GPS coordinates using a seeded deterministic algorithm — same farm always gets the same score, ensuring demo repeatability.

### 🤖 Live AI Reasoning
The `AgentReasoning` terminal panel streams each step of the agent's decision process: satellite band analysis → historical fraud check → credit calculation → final verdict. Each line appears with a 100–600ms delay for dramatic effect.

### ⛓️ ERC-1155 Credits
Each farm gets its own token ID. `mintCredits()` is callable only by the backend owner wallet. Marketplace uses `listForSale()` and `buyCredits()` with ETH payments.

### 🛡️ Fraud Detection
- Duplicate GPS coordinates within 0.01° radius → flagged
- More than 3 submissions in 24 hours → flagged
- In-memory store (would be database in production)

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase publishable key |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox GL access token |
| `NEXT_PUBLIC_DEMO_MODE` | No | `true` = full mock mode |
| `PINATA_API_KEY` | No* | Pinata IPFS key |
| `PINATA_JWT` | No* | Pinata JWT (preferred) |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | No* | Deployed contract address |
| `PRIVATE_KEY` | No* | Backend wallet private key |
| `NEXT_PUBLIC_RPC_URL` | No* | Polygon Mumbai RPC |

*Not required when `NEXT_PUBLIC_DEMO_MODE=true`
