/**
 * seedDemo.ts — Pre-seed 3 demo farms for GreenLedger
 * Run: npx ts-node scripts/seedDemo.ts
 */

import { calculateNDVI, calculateCredits, getNDVILabel } from '../agent/scoring';
import { DEMO_FARMS } from '../lib/constants';
import type { Farm, AgentResult } from '../lib/types';

interface SeedResult {
  farm: (typeof DEMO_FARMS)[0];
  ndviScore: number;
  credits: number;
  label: string;
  agentResult: AgentResult;
  mockTxHash: string;
  mockIpfsHash: string;
}

function generateMockTxHash(): string {
  return '0x' + Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

function generateMockIpfsHash(seed: string): string {
  // Generate a deterministic-looking IPFS hash
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz0123456789';
  let hash = 'Qm';
  for (let i = 0; i < 44; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

async function seedDemoFarms(): Promise<void> {
  console.log('\n🌱 GreenLedger Demo Farm Seeder\n');
  console.log('=' .repeat(60));

  const results: SeedResult[] = [];

  for (const farm of DEMO_FARMS) {
    console.log(`\n📍 Processing: ${farm.name}`);
    console.log(`   Coordinates: ${farm.coordinates.lat}, ${farm.coordinates.lng}`);
    console.log(`   Size: ${farm.sizeAcres} acres`);

    // Simulate NDVI calculation
    const ndviScore = calculateNDVI(farm.coordinates);
    const credits = calculateCredits(ndviScore, farm.sizeAcres);
    const label = getNDVILabel(ndviScore);

    console.log(`   NDVI Score: ${ndviScore.toFixed(3)} — ${label}`);
    console.log(`   Carbon Credits: ${credits}`);

    // Generate mock blockchain data
    const mockIpfsHash = generateMockIpfsHash(farm.id.toString());
    const mockTxHash = generateMockTxHash();

    const agentResult: AgentResult = {
      approved: ndviScore >= 0.45,
      creditAmount: credits,
      fraudRisk: 'low',
      reasoning: [
        `Vegetation density index ${ndviScore.toFixed(2)} detected — ${label.toLowerCase()}`,
        'No duplicate farm coordinates found within 0.01° radius',
        'Submission frequency within acceptable limits',
        `Farm size: ${farm.sizeAcres} acres × NDVI ${ndviScore.toFixed(2)} × 5 = ${credits} credits`,
        `APPROVED — ${credits} carbon credits authorized for minting`,
      ],
      ndviScore,
      imageHash: mockIpfsHash,
    };

    results.push({
      farm,
      ndviScore,
      credits,
      label,
      agentResult,
      mockTxHash,
      mockIpfsHash,
    });

    console.log(`   ✅ Status: ${agentResult.approved ? 'APPROVED' : 'REJECTED'}`);
    console.log(`   🔗 Mock IPFS: ${mockIpfsHash.slice(0, 20)}...`);
    console.log(`   ⛓️  Mock Tx:   ${mockTxHash.slice(0, 20)}...`);

    // Simulate async delay for realism
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SEED SUMMARY\n');

  const totalCredits = results.reduce((acc, r) => acc + r.credits, 0);
  const avgNdvi = results.reduce((acc, r) => acc + r.ndviScore, 0) / results.length;

  console.log(`   Farms seeded:     ${results.length}`);
  console.log(`   Total credits:    ${totalCredits}`);
  console.log(`   Average NDVI:     ${avgNdvi.toFixed(3)}`);
  console.log(`   Est. CO₂ offset:  ${(totalCredits * 2.2).toFixed(1)} tonnes\n`);

  console.log('📋 Listings to create on marketplace:');
  results.forEach((r, i) => {
    const pricePerToken = (0.01 + i * 0.003).toFixed(3);
    console.log(
      `   Listing #${i + 1}: ${r.farm.name} — ${r.credits} credits @ ${pricePerToken} MATIC/credit`
    );
  });

  console.log('\n✅ Demo seed complete! Start the app with: npm run dev\n');
  console.log('🚀 Then visit: http://localhost:3000/verify\n');
}

// Run
seedDemoFarms().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
