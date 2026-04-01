import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { hardhat } from 'viem/chains';

const ABI = parseAbi([
  'function mintCredits(address farmer, uint256 farmId, uint256 amount, string calldata satelliteHash, uint256 creditScore) external'
]);

export const mintCarbonCredit = async (farmerAddress: string, score: number, ipfsHash: string) => {
  const amount = Math.floor(score * 10); // Example: 0.8 score = 8 tokens
  const creditScore = Math.floor(score * 100);
  const farmId = BigInt(Math.floor(Math.random() * 1000) + 1); // Mock farm ID for this unused standalone function
  
  console.log(`Minting ${amount} tokens to ${farmerAddress} with IPFS proof: ${ipfsHash}`);
  
  // Local Hardhat Node Account #0 private key fallback
  const privateKey = (process.env.PRIVATE_KEY as `0x${string}`) || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
  const account = privateKeyToAccount(privateKey);
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

  const client = createWalletClient({
    account,
    chain: hardhat,
    transport: http('http://127.0.0.1:8545')
  });

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http('http://127.0.0.1:8545')
  });

  try {
    const { request } = await publicClient.simulateContract({
      address: contractAddress,
      abi: ABI,
      functionName: 'mintCredits',
      args: [farmerAddress as `0x${string}`, farmId, BigInt(amount), ipfsHash, BigInt(creditScore)],
      account
    });
    
    const hash = await client.writeContract(request);
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    
    return {
      success: receipt.status === 'success',
      transactionHash: hash,
      tokensMinted: amount
    };
  } catch (error) {
    console.error('Minting failed:', error);
    throw error;
  }
};
