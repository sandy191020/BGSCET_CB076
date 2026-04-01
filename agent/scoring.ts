interface Coordinates {
  lat: number;
  lng: number;
}

// Seeded random number generator for consistent NDVI scores
function seededRandom(lat: number, lng: number): number {
  const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453);
  return seed - Math.floor(seed);
}

export function calculateNDVI(coordinates: Coordinates): number {
  // Generate consistent NDVI score based on coordinates
  const baseScore = seededRandom(coordinates.lat, coordinates.lng);
  
  // Bias towards healthy vegetation (0.6-0.9 range for organic farms)
  const ndvi = 0.5 + (baseScore * 0.45);
  
  return Math.round(ndvi * 100) / 100;
}

export function calculateCredits(ndvi: number, acres: number): number {
  // Formula: NDVI × acres × 5
  const credits = Math.floor(ndvi * acres * 5);
  return Math.max(1, credits); // Minimum 1 credit
}

export function getNDVILabel(score: number): string {
  if (score >= 0.75) return "Dense Healthy Vegetation";
  if (score >= 0.55) return "Moderate Vegetation";
  if (score >= 0.35) return "Sparse Vegetation";
  return "Sparse/Degraded Land";
}

export function getRecommendedAction(ndvi: number): string {
  if (ndvi >= 0.65) return "Mint Full Credits";
  if (ndvi >= 0.45) return "Mint Partial Credits";
  return "Reject — Insufficient Vegetation";
}

export function getNDVIColor(score: number): string {
  if (score >= 0.75) return "text-green-400";
  if (score >= 0.55) return "text-yellow-400";
  return "text-red-400";
}
