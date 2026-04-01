import { NextRequest, NextResponse } from 'next/server';
import type { MintTokenRequest } from '../../../../lib/types';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const EXPLORER_URL = 'https://amoy.polygonscan.com';

export async function POST(req: NextRequest) {
  try {
    const body: MintTokenRequest = await req.json();
    const { farmerId, farmId, creditAmount, satelliteHash, agentVerdict } = body;

    if (!farmerId || !farmId || !creditAmount || !satelliteHash) {
      return NextResponse.json(
        { error: 'Missing required fields: farmerId, farmId, creditAmount, satelliteHash' },
        { status: 400 }
      );
    }

    if (!agentVerdict.approved) {
      return NextResponse.json(
        { error: 'Farm not approved for minting', fraudRisk: agentVerdict.fraudRisk },
        { status: 403 }
      );
    }

    // Step 1: Pre-minting Fraud Check
    const { checkDuplicateSubmission, checkSubmissionFrequency, recordSubmission } = await import(
      '../../../../agent/fraudDetection'
    );
    const farmCoordinates = (body as any).farmCoordinates; // types are getting updated
    const duplicateCheck = checkDuplicateSubmission(farmerId, farmCoordinates);
    const frequencyCheck = checkSubmissionFrequency(farmerId);

    if (!duplicateCheck.passed || !frequencyCheck.passed) {
      return NextResponse.json(
        {
          error: 'Fraudulent activity detected',
          details: !duplicateCheck.passed ? duplicateCheck.reason : frequencyCheck.reason,
        },
        { status: 403 }
      );
    }

    // Demo mode: return a realistic mock transaction
    if (DEMO_MODE || !process.env.PRIVATE_KEY) {
      await new Promise((r) => setTimeout(r, 1500)); // simulate block confirmation
      const mockTxHash = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      // RECORD the submission in memory only if it actually "minted"
      recordSubmission(farmerId, farmCoordinates);

      return NextResponse.json({
        txHash: mockTxHash,
        tokenId: farmId,
        creditAmount,
        explorerUrl: `${EXPLORER_URL}/tx/${mockTxHash}`,
        demo: true,
      });
    }

    // Real blockchain minting
    const { mintCarbonCredit } = await import('@/lib/blockchain/mint');
    const { createServerClient } = await import('@supabase/ssr');
    const { cookies } = await import('next/headers');

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    );

    // Credit score: convert ndviScore (0-1) to (0-100)
    const creditScore = Math.round(agentVerdict.ndviScore * 100);

    // Use farmerId as a farmer address (in production this would be their wallet address)
    const farmerAddress = farmerId.startsWith('0x')
      ? farmerId
      : '0x0000000000000000000000000000000000000001';

    const result = await mintCarbonCredit(
      farmerAddress,
      agentVerdict.ndviScore,
      satelliteHash
    );

    // PERSIST TO SUPABASE
    const { data: profile } = await supabase
      .from('profiles')
      .select('carbon_credits, full_name')
      .eq('id', farmerId)
      .single();

    await supabase
      .from('profiles')
      .update({ 
        carbon_credits: (profile?.carbon_credits || 0) + creditAmount 
      })
      .eq('id', farmerId);

    // CREATE MARKETPLACE LISTING
    const { error: listingError } = await supabase
      .from('carbon_listings')
      .insert({
        farmer_id: farmerId,
        token_id: farmId,
        amount: creditAmount,
        price_per_credit: 850, // Default price in MATIC or INR
        status: 'available',
        farm_id: farmId,
        farm_name: (body as any).farmName || profile?.full_name || `Farm #${farmId}`,
        ndvi_score: creditScore / 100,
        image_hash: satelliteHash,
        seller_address: farmerAddress
      });

    if (listingError) {
      console.error('[mint-token] Listing Error:', listingError);
    }

    // RECORD the submission after the real blockchain transaction
    recordSubmission(farmerId, farmCoordinates);

    return NextResponse.json({
      txHash: result.transactionHash,
      tokenId: farmId,
      creditAmount,
      explorerUrl: `${EXPLORER_URL}/tx/${result.transactionHash}`,
    });
  } catch (error: any) {
    console.error('[mint-token] Error:', error);
    return NextResponse.json({ error: error.message ?? 'Minting failed' }, { status: 500 });
  }
}
