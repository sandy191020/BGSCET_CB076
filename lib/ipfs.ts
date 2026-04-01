import crypto from 'crypto';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;
const PINATA_JWT = process.env.PINATA_JWT;

export async function uploadToIPFS(
  buffer: Buffer,
  filename: string
): Promise<{ hash: string; url: string }> {
  if (!PINATA_API_KEY && !PINATA_JWT) {
    // Demo mode fallback
    const mockHash = `Qm${crypto.randomBytes(22).toString('hex')}`;
    return {
      hash: mockHash,
      url: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
    };
  }

  const formData = new FormData();
  const blob = new Blob([new Uint8Array(buffer)]);
  formData.append('file', blob, filename);


  const metadata = JSON.stringify({
    name: filename,
    keyvalues: {
      type: 'satellite-image',
      timestamp: Date.now().toString(),
    },
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', options);

  const headers: HeadersInit = PINATA_JWT
    ? { Authorization: `Bearer ${PINATA_JWT}` }
    : {
        pinata_api_key: PINATA_API_KEY!,
        pinata_secret_api_key: PINATA_SECRET_KEY!,
      };

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Pinata upload failed: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    hash: data.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
  };
}

export function getIPFSUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

export function hashFile(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export async function uploadJSONToIPFS(data: any): Promise<{ hash: string; url: string }> {
  if (!PINATA_API_KEY && !PINATA_JWT) {
    // Demo mode fallback
    const mockHash = `Qm${crypto.randomBytes(22).toString('hex')}`;
    return {
      hash: mockHash,
      url: `https://gateway.pinata.cloud/ipfs/${mockHash}`,
    };
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(PINATA_JWT
      ? { Authorization: `Bearer ${PINATA_JWT}` }
      : {
          pinata_api_key: PINATA_API_KEY!,
          pinata_secret_api_key: PINATA_SECRET_KEY!,
        }),
  };

  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      pinataContent: data,
      pinataMetadata: {
        name: 'metadata.json',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Pinata JSON upload failed: ${response.statusText}`);
  }

  const result = await response.json();

  return {
    hash: result.IpfsHash,
    url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
  };
}
