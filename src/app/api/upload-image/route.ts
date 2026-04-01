import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

export async function POST(req: NextRequest) {
  try {
    // If demo mode OR missing Pinata credentials → return mock
    if (DEMO_MODE || (!PINATA_API_KEY && !PINATA_JWT)) {
      const mockHash = `Qm${crypto.randomBytes(22).toString('hex')}`;
      return NextResponse.json({
        ipfsHash: mockHash,
        ipfsUrl: `ipfs://${mockHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
        demo: true,
      });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Build multipart body for Pinata
    const pinataForm = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    pinataForm.append('file', blob, file.name);

    const metadata = JSON.stringify({
      name: file.name,
      keyvalues: {
        type: 'satellite-image',
        timestamp: Date.now().toString(),
      },
    });
    pinataForm.append('pinataMetadata', metadata);
    pinataForm.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

    const headers: HeadersInit = PINATA_JWT
      ? { Authorization: `Bearer ${PINATA_JWT}` }
      : {
          pinata_api_key: PINATA_API_KEY!,
          pinata_secret_api_key: PINATA_SECRET_KEY!,
        };

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers,
      body: pinataForm,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Pinata upload failed: ${errorText}`);
    }

    const data = await response.json();
    const hash = data.IpfsHash as string;

    return NextResponse.json({
      ipfsHash: hash,
      ipfsUrl: `ipfs://${hash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${hash}`,
    });
  } catch (error: any) {
    console.error('[upload-image] Error:', error);
    return NextResponse.json({ error: error.message ?? 'Upload failed' }, { status: 500 });
  }
}
