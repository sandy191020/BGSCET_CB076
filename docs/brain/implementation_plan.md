# GreenLedger Implementation Plan

GreenLedger is a blockchain-powered platform that incentivizes sustainable farming by minting carbon credit tokens (ERC-1155) based on AI-verified satellite imagery.

## User Review Required

> [!IMPORTANT]
> - **NPM Restriction**: Per user request, `pnpm` will be used exclusively for all package management.
> - **API Keys**: Implementation will require Mapbox (Satellite), Pinata (IPFS), and Supabase (Auth/DB) keys. I will set up the structure using environment variables.
> - **Blockchain**: We will target the Polygon Amoy Testnet for the demo.

## Proposed Changes

### [Initialization]
- [NEW] Initialize Next.js project using `pnpm` with Tailwind CSS.
- [NEW] Configure `tailwind.config.ts` for "Neural Obsidian" theme (Glassmorphism, Emerald accents).

### [Frontend - Dashboard & Map]
- [MODIFY] `src/components/map/MapContainer.tsx`: Leaflet + OSM integration.
- [NEW] `src/components/CinematicDemo.tsx`: High-end, Apple-level product animation for the "Watch Demo" button.
- [NEW] `src/components/GrowthAnimation.tsx`: SVG-based organic plant growth and tokenization animation.
- [NEW] Add `framer-motion` sequences for synced feature reveals.

### [AI Agent - Mastra]
- [NEW] `src/lib/mastra/agent.ts`: Configuration for the Mastra agent to process NDVI data.
- [NEW] `src/api/analyze/route.ts`: API endpoint to fetch satellite bands and calculate NDVI.

### [Blockchain - Polygon]
- [NEW] `src/lib/blockchain/provider.ts`: Wagmi/Viem configuration for Polygon.
- [NEW] `src/lib/blockchain/mint.ts`: Logic to interact with the ERC-1155 contract.

### [Database & Storage]
- [NEW] `src/lib/supabase/client.ts`: Supabase initialization for metadata storage.
- [NEW] `src/lib/ipfs/pinata.ts`: Pinata integration for uploading image hashes.

## Verification Plan

### Automated Tests
- `pnpm test`: Run Vitest (to be added) for NDVI calculation logic.
- `pnpm lint`: Ensure code quality.

### Manual Verification
- **Satellite Capture**: Verify that entering GPS coordinates correctly pulls a Sentinel-2 image.
- **AI Scoring**: Trigger the Mastra agent and verify the NDVI score matches farm health.
- **Blockchain Minting**: Confirm a transaction is initiated on the Polygon Amoy testnet after a high score.
- **Marketplace**: Verify the minted token appears in the "Available Offsets" list.
