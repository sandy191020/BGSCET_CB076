import { NextRequest } from 'next/server';
import type { VerifyFarmRequest } from '../../../../lib/types';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Helper to create a streaming response line by line
function createStreamEncoder() {
  const encoder = new TextEncoder();
  return (obj: object) => encoder.encode(JSON.stringify(obj) + '\n');
}

// Mock streaming agent for pure demo mode (no file system access needed)
async function* mockVerificationStream(input: VerifyFarmRequest) {
  const steps = [
    { step: 'NDVI Analysis', message: '🛰️  Connecting to Sentinel-2 satellite data feed...' },
    { step: 'NDVI Analysis', message: '📡  Downloading near-infrared band imagery...' },
    { step: 'NDVI Analysis', message: '🔬  Calculating Normalized Difference Vegetation Index...' },
    { step: 'NDVI Analysis', message: `✅  Vegetation density index 0.82 detected — Dense Healthy Vegetation`, data: { ndviScore: 0.82 } },
    { step: 'Historical Check', message: '🔍  Scanning submission history database...' },
    { step: 'Historical Check', message: '✅  No duplicate farm coordinates found within 0.01° radius' },
    { step: 'Historical Check', message: '✅  Submission frequency within acceptable limits (1/24h)' },
    { step: 'Credit Calculation', message: '🧮  Computing carbon credit allocation...' },
    { step: 'Credit Calculation', message: `✅  Farm size: ${input.farmSizeAcres} acres × NDVI 0.82 × 5 = ${Math.floor(0.82 * input.farmSizeAcres * 5)} credits`, data: { creditAmount: Math.floor(0.82 * input.farmSizeAcres * 5) } },
    { step: 'Final Verdict', message: '⚖️   Generating cryptographic proof and final verdict...' },
    { step: 'Final Verdict', message: `✅  APPROVED — ${Math.floor(0.82 * input.farmSizeAcres * 5)} carbon credits authorized for minting`, data: { approved: true, fraudRisk: 'low', ndviScore: 0.82, creditAmount: Math.floor(0.82 * input.farmSizeAcres * 5) } },
  ];

  for (const step of steps) {
    await new Promise((r) => setTimeout(r, 600));
    yield step;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: VerifyFarmRequest = await req.json();
    const { farmCoordinates, farmSizeAcres, farmerId, imageBase64 } = body;

    if (!farmCoordinates || !farmSizeAcres || !farmerId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const encode = createStreamEncoder();

    // Create a streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          let imageHash = `Qm${'0'.repeat(44)}`;

          // Step 0: Upload image to IPFS if provided
          if (imageBase64 && !DEMO_MODE) {
            controller.enqueue(
              encode({ step: 'IPFS Upload', message: '📤  Uploading satellite image to IPFS...' })
            );

            try {
              const { uploadToIPFS } = await import('../../../../lib/ipfs');
              const buffer = Buffer.from(imageBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
              const result = await uploadToIPFS(buffer, `farm-${farmerId}-${Date.now()}.jpg`);
              imageHash = result.hash;
              controller.enqueue(
                encode({ step: 'IPFS Upload', message: `✅  Image pinned to IPFS: ${imageHash.slice(0, 12)}...` })
              );
            } catch (err) {
              controller.enqueue(
                encode({ step: 'IPFS Upload', message: '⚠️   IPFS upload failed — using fallback hash' })
              );
            }
          } else {
            // Generate a deterministic mock hash based on coords for demo
            const mockHash = `QmDemo${farmerId}${Math.abs(Math.floor(farmCoordinates.lat * 1000))}`;
            imageHash = mockHash;
          }

          // Run the agent (or mock in pure demo mode)
          const generator = DEMO_MODE
            ? mockVerificationStream(body)
            : (async function* () {
                const { runVerification } = await import('../../../../agent/farmAgent');
                yield* runVerification({ farmCoordinates, imageHash, farmSizeAcres, farmerId });
              })();

          let finalResult: any = null;

          for await (const step of generator) {
            controller.enqueue(encode(step));
             // Store the last step's data as the final result candidate
            if (step.step === 'Final Verdict' && step.data) {
              finalResult = {
                ...step.data,
                imageHash,
                reasoning: [], // will be collected client side from stream
              };
            }
          }

          // Emit the final structured result
          if (DEMO_MODE) {
            const creditAmount = Math.floor(0.82 * farmSizeAcres * 5);
            controller.enqueue(
              encode({
                step: '__RESULT__',
                result: {
                  approved: true,
                  creditAmount,
                  fraudRisk: 'low',
                  ndviScore: 0.82,
                  imageHash,
                  reasoning: [
                    'Vegetation density index 0.82 detected — Dense Healthy Vegetation',
                    'No duplicate farm coordinates found',
                    'Submission frequency within limits',
                    `Farm size: ${farmSizeAcres} acres × NDVI 0.82 × 5 = ${creditAmount} credits`,
                    `APPROVED — ${creditAmount} carbon credits authorized for minting`,
                  ],
                },
              })
            );
          } else if (finalResult) {
            controller.enqueue(encode({ step: '__RESULT__', result: finalResult }));
          }

          controller.close();
        } catch (error: any) {
          console.error('[verify-farm stream] Error:', error);
          controller.enqueue(
            encode({ step: '__ERROR__', message: error.message ?? 'Verification failed' })
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: any) {
    console.error('[verify-farm] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message ?? 'Verification failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
