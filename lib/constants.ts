export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
export const CHAIN_ID = 80001; // Polygon Mumbai
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://rpc-mumbai.maticvigil.com";
export const IPFS_GATEWAY = "https://gateway.pinata.cloud/ipfs/";
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const DEMO_FARMS = [
  {
    id: 1,
    name: "Organic Rice Farm - Mandya",
    coordinates: {
      lat: 12.5266,
      lng: 76.8950,
      polygon: [
        [76.8940, 12.5276],
        [76.8960, 12.5276],
        [76.8960, 12.5256],
        [76.8940, 12.5256],
        [76.8940, 12.5276],
      ] as [number, number][],
    },
    sizeAcres: 15.5,
    ownerId: "farmer_001",
    verified: true,
    ndviScore: 0.78,
    imageHash: "QmYxivKF7f5xfJBvJqPnWKvqzJ8xKZxZxKZxZxKZxZxK1",
  },
  {
    id: 2,
    name: "Sustainable Millet Farm - Mysore",
    coordinates: {
      lat: 12.2958,
      lng: 76.6394,
      polygon: [
        [76.6384, 12.2968],
        [76.6404, 12.2968],
        [76.6404, 12.2948],
        [76.6384, 12.2948],
        [76.6384, 12.2968],
      ] as [number, number][],
    },
    sizeAcres: 22.3,
    ownerId: "farmer_002",
    verified: true,
    ndviScore: 0.82,
    imageHash: "QmYxivKF7f5xfJBvJqPnWKvqzJ8xKZxZxKZxZxKZxZxK2",
  },
  {
    id: 3,
    name: "Agroforestry Farm - Hassan",
    coordinates: {
      lat: 13.0050,
      lng: 76.0977,
      polygon: [
        [76.0967, 13.0060],
        [76.0987, 13.0060],
        [76.0987, 13.0040],
        [76.0967, 13.0040],
        [76.0967, 13.0060],
      ] as [number, number][],
    },
    sizeAcres: 18.7,
    ownerId: "farmer_003",
    verified: true,
    ndviScore: 0.85,
    imageHash: "QmYxivKF7f5xfJBvJqPnWKvqzJ8xKZxZxKZxZxKZxZxK3",
  },
];

export const EXPLORER_URL = "https://mumbai.polygonscan.com";
