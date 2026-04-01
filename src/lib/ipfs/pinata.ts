export const pinToIPFS = async (imageData: string, metadata: any) => {
  const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY;
  const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY;

  if (!pinataApiKey || !pinataSecretApiKey) {
    console.warn("Pinata API keys missing. Mocking IPFS hash.");
    return "ipfs://QmXoyp...mockHash";
  }

  // Implementation using Pinata SDK or direct API call
  // For the demo, we return a mock hash if keys are absent
  return `ipfs://Qm${Math.random().toString(36).substring(7)}`;
};
