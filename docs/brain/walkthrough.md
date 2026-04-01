# GreenLedger Walkthrough

GreenLedger is a production-ready, blockchain-powered ecosystem that turns verified sustainable farming into tradeable carbon assets. This walkthrough covers the key components and the 60-second demo flow developed for the hackathon.

## Architecture Highlights

- **Frontend**: Next.js App Router with **Tailwind CSS 4** and **Framer Motion** for a premium, high-fidelity experience.
- **AI Agent**: Integrated **Mastra AI** to process satellite imagery and autonomously score farms.
- **Blockchain**: **Polygon Amoy Testnet** integration for minting ERC-1155 carbon credit tokens.
- **Database**: **Supabase** for storing farm metadata, verification history, and user data.
- **Storage**: **IPFS via Pinata** for decentralized, tamper-proof proof-of-work storage.
- **Satellite & Base**: **Leaflet.js & OpenStreetMap** with optional Esri World Imagery.

## Core Features

### 1. Neural Obsidian Dashboard
A dark-themed, glassmorphic interface designed for high-density information display. It features a satellite map for coordinate selection and a live AI reasoning panel.

### 2. Autonomous AI Scoring
The Mastra agent analyzes farm health (NDVI) and provides a logic-backed score. This ensures transparency and prevents fraud in the carbon offset market.

### 3. Automated Minting Chain
When a farm scores high (>0.6), the system automatically:
1. Generates a satellite proof image.
2. Uploads the hash to IPFS.
3. Mints ERC-1155 tokens directly into the farmer's wallet on Polygon.

### 3. AI-Powered Location Search
Users can now search for their land by typing an address or landmark. The map autonomously "detects" the area, flies to the location, and places a verified farm boundary marker instantly.

### 4. Pinpoint Geolocation
A dedicated "Locate Me" button allows farmers to jump directly to their current physical coordinates with high precision, ensuring the boundary is drawn exactly where they stand.

### 5. Hyper-Realistic Cinematic Ad
An ultra-premium, 7-scene product advertisement using hyper-realistic 8K 3D assets:
1. **Dark Hook**: Macro shot of moist soil inside a 3D smartphone.
2. **Seed Drop**: Detailed seed falling with cinematic slow-mo and dust particles.
3. **Fluid Water**: High-speed photography of water pouring and interacting with soil.
4. **Natural Growth**: Biological morphing from sprout to full-grown plant with visible leaf veins.
5. **Sun Bloom**: Warm golden light rays and lens flares as the plant reaches full health.
6. **Token Reveal**: Metallic, rotating digital carbon coin with holographic blockchain patterns.
7. **RBI-Style Cards**: Premium financial feature cards with glassmorphism, depth, and currency-style identifiers.

### 6. Automated Minting Chain
When a farm scores high (>0.6), the system automatically:
1. Generates a satellite proof image.
2. Uploads the hash to IPFS.
3. Mints ERC-1155 tokens directly into the farmer's wallet on Polygon.

- [x] Next.js Initialization with `pnpm`
- [x] Tailwind CSS "Neural Obsidian" Theme
- [x] Mapbox Satellite Integration
- [x] Mastra Agent Infrastructure
- [x] ERC-1155 Smart Contract (Solidity)
- [x] Dashboard Layout & Demo Animation
