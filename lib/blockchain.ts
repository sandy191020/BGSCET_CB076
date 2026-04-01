import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, RPC_URL, DEMO_MODE } from './constants';

const CONTRACT_ABI = [
  'function mintCredits(address farmer, uint256 farmId, uint256 amount, string calldata satelliteHash, uint256 creditScore) external',
  'function listForSale(uint256 farmId, uint256 amount, uint256 pricePerToken) external',
  'function buyCredits(uint256 listingId, uint256 amount) external payable',
  'function getFarmData(uint256 farmId) external view returns (tuple(string satelliteHash, uint256 creditScore, address farmer, uint256 totalCredits, bool verified))',
  'function getActiveListing(uint256 listingId) external view returns (tuple(uint256 farmId, address seller, uint256 amount, uint256 pricePerToken, bool active))',
  'function balanceOf(address account, uint256 id) external view returns (uint256)',
  'function nextFarmId() external view returns (uint256)',
  'function nextListingId() external view returns (uint256)',
  'event CreditsMinted(address indexed farmer, uint256 indexed farmId, uint256 amount, string satelliteHash, uint256 creditScore)',
  'event CreditsListed(uint256 indexed listingId, uint256 indexed farmId, address indexed seller, uint256 amount, uint256 pricePerToken)',
  'event CreditsPurchased(uint256 indexed listingId, uint256 indexed farmId, address indexed buyer, address seller, uint256 amount, uint256 totalPrice)',
];

export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL);
}

export function getContract(signerOrProvider?: ethers.Signer | ethers.Provider): ethers.Contract {
  const provider = signerOrProvider || getProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

export function getSigner(): ethers.Wallet {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY not set in environment variables');
  }
  const provider = getProvider();
  return new ethers.Wallet(privateKey, provider);
}

export async function mintCredits(
  farmer: string,
  farmId: number,
  amount: number,
  satelliteHash: string,
  creditScore: number
): Promise<{ txHash: string; explorerUrl: string }> {
  if (DEMO_MODE) {
    // Demo mode: return mock transaction
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    return {
      txHash: mockTxHash,
      explorerUrl: `https://mumbai.polygonscan.com/tx/${mockTxHash}`,
    };
  }

  const signer = getSigner();
  const contract = getContract(signer);

  const tx = await contract.mintCredits(farmer, farmId, amount, satelliteHash, creditScore);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    explorerUrl: `https://mumbai.polygonscan.com/tx/${receipt.hash}`,
  };
}

export async function listForSale(
  farmId: number,
  amount: number,
  pricePerToken: string
): Promise<{ txHash: string; explorerUrl: string }> {
  if (DEMO_MODE) {
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    return {
      txHash: mockTxHash,
      explorerUrl: `https://mumbai.polygonscan.com/tx/${mockTxHash}`,
    };
  }

  const signer = getSigner();
  const contract = getContract(signer);

  const priceInWei = ethers.parseEther(pricePerToken);
  const tx = await contract.listForSale(farmId, amount, priceInWei);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    explorerUrl: `https://mumbai.polygonscan.com/tx/${receipt.hash}`,
  };
}

export async function buyCredits(
  listingId: number,
  amount: number,
  totalPrice: string
): Promise<{ txHash: string; explorerUrl: string }> {
  if (DEMO_MODE) {
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    return {
      txHash: mockTxHash,
      explorerUrl: `https://mumbai.polygonscan.com/tx/${mockTxHash}`,
    };
  }

  const signer = getSigner();
  const contract = getContract(signer);

  const valueInWei = ethers.parseEther(totalPrice);
  const tx = await contract.buyCredits(listingId, amount, { value: valueInWei });
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    explorerUrl: `https://mumbai.polygonscan.com/tx/${receipt.hash}`,
  };
}

export async function getFarmData(farmId: number): Promise<any> {
  if (DEMO_MODE) {
    return {
      satelliteHash: `QmDemo${farmId}`,
      creditScore: 75 + farmId * 5,
      farmer: '0x0000000000000000000000000000000000000000',
      totalCredits: 100 + farmId * 10,
      verified: true,
    };
  }

  const contract = getContract();
  return await contract.getFarmData(farmId);
}

export async function getListings(): Promise<any[]> {
  if (DEMO_MODE) {
    return [
      {
        listingId: 1,
        farmId: 1,
        seller: '0x1234567890123456789012345678901234567890',
        amount: 50,
        pricePerToken: ethers.parseEther('0.01'),
        active: true,
      },
      {
        listingId: 2,
        farmId: 2,
        seller: '0x2345678901234567890123456789012345678901',
        amount: 75,
        pricePerToken: ethers.parseEther('0.015'),
        active: true,
      },
    ];
  }

  const contract = getContract();
  const nextListingId = await contract.nextListingId();
  const listings = [];

  for (let i = 1; i < nextListingId; i++) {
    try {
      const listing = await contract.getActiveListing(i);
      if (listing.active) {
        listings.push({ listingId: i, ...listing });
      }
    } catch (error) {
      console.error(`Error fetching listing ${i}:`, error);
    }
  }

  return listings;
}
