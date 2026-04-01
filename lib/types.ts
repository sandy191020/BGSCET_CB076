export interface Farm {
  id: number;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
    polygon?: [number, number][];
  };
  sizeAcres: number;
  ownerId: string;
  verified: boolean;
  ndviScore?: number;
  imageHash?: string;
}

export interface CarbonCredit {
  tokenId: number;
  farmId: number;
  amount: number;
  satelliteHash: string;
  creditScore: number;
  mintedAt: number;
  farmer: string;
}

export interface Listing {
  listingId: number;
  tokenId: number;
  farmId: number;
  seller: string;
  amount: number;
  pricePerToken: string;
  active: boolean;
}

export interface AgentResult {
  approved: boolean;
  creditAmount: number;
  fraudRisk: 'low' | 'medium' | 'high';
  reasoning: string[];
  ndviScore: number;
  imageHash: string;
}

export interface VerificationStep {
  step: string;
  status: 'pending' | 'running' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: number;
}

export interface VerifyFarmRequest {
  farmCoordinates: {
    lat: number;
    lng: number;
  };
  farmSizeAcres: number;
  farmerId: string;
  imageBase64?: string;
}

export interface MintTokenRequest {
  farmerId: string;
  farmId: number;
  creditAmount: number;
  satelliteHash: string;
  agentVerdict: AgentResult;
  farmCoordinates: {
    lat: number;
    lng: number;
  };
}
