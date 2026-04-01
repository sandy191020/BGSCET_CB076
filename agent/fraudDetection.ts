interface Coordinates {
  lat: number;
  lng: number;
}

interface Submission {
  farmerId: string;
  coordinates: Coordinates;
  timestamp: number;
}

interface FraudCheck {
  passed: boolean;
  reason: string;
}

interface RiskAssessment {
  risk: 'low' | 'medium' | 'high';
  reasons: string[];
}

// In-memory store for demo (in production, use database)
const submissionHistory: Submission[] = [];

function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const latDiff = Math.abs(coord1.lat - coord2.lat);
  const lngDiff = Math.abs(coord1.lng - coord2.lng);
  return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
}

export function checkDuplicateSubmission(
  farmerId: string,
  coordinates: Coordinates
): FraudCheck {
  const duplicates = submissionHistory.filter((sub) => {
    const distance = calculateDistance(sub.coordinates, coordinates);
    return distance < 0.01; // Within ~1km radius
  });

  if (duplicates.length > 0) {
    return {
      passed: false,
      reason: `Duplicate location detected — ${duplicates.length} submission(s) within 1km radius`,
    };
  }

  return {
    passed: true,
    reason: "No duplicate locations found within 1km radius",
  };
}

export function checkSubmissionFrequency(farmerId: string): FraudCheck {
  const now = Date.now();
  const last24Hours = now - 24 * 60 * 60 * 1000;

  const recentSubmissions = submissionHistory.filter(
    (sub) => sub.farmerId === farmerId && sub.timestamp > last24Hours
  );

  if (recentSubmissions.length >= 3) {
    return {
      passed: false,
      reason: `Suspicious activity — ${recentSubmissions.length} submissions in 24 hours`,
    };
  }

  return {
    passed: true,
    reason: `Normal submission frequency — ${recentSubmissions.length} in last 24h`,
  };
}

export function assessRisk(checks: FraudCheck[]): RiskAssessment {
  const failedChecks = checks.filter((check) => !check.passed);

  if (failedChecks.length === 0) {
    return {
      risk: 'low',
      reasons: ['All fraud checks passed', 'No suspicious patterns detected'],
    };
  }

  if (failedChecks.length === 1) {
    return {
      risk: 'medium',
      reasons: failedChecks.map((check) => check.reason),
    };
  }

  return {
    risk: 'high',
    reasons: failedChecks.map((check) => check.reason),
  };
}

export function recordSubmission(farmerId: string, coordinates: Coordinates): void {
  submissionHistory.push({
    farmerId,
    coordinates,
    timestamp: Date.now(),
  });

  // Keep only last 1000 submissions to prevent memory issues
  if (submissionHistory.length > 1000) {
    submissionHistory.shift();
  }
}
