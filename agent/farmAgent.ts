import { fetchTrueNDVI, calculateCredits, getNDVILabel, getRecommendedAction } from './scoring';
import {
  checkDuplicateSubmission,
  checkSubmissionFrequency,
  assessRisk,
  recordSubmission,
} from './fraudDetection';
import type { AgentResult } from '../lib/types';

interface VerificationInput {
  farmCoordinates: {
    lat: number;
    lng: number;
  };
  imageHash: string;
  farmSizeAcres: number;
  farmerId: string;
}

interface ReasoningStep {
  step: string;
  message: string;
  data?: any;
}

export async function* runVerification(
  input: VerificationInput
): AsyncGenerator<ReasoningStep, AgentResult> {
  const reasoning: string[] = [];

  // Step 1: NDVI Analysis
  yield {
    step: 'NDVI Analysis',
    message: '🛰️  Analyzing Sentinel-2 L2A satellite data (30-day aggregation)...',
  };

  await sleep(500);

  const ndviScore = await fetchTrueNDVI(input.farmCoordinates);
  const ndviLabel = getNDVILabel(ndviScore);

  const ndviMessage = `Vegetation density index ${ndviScore.toFixed(2)} detected — ${ndviLabel.toLowerCase()}`;
  reasoning.push(ndviMessage);

  yield {
    step: 'NDVI Analysis',
    message: `✅ ${ndviMessage}`,
    data: { ndviScore, ndviLabel },
  };

  await sleep(500);

  // Step 2: Historical Check
  yield {
    step: 'Historical Check',
    message: '🔍 Checking submission history...',
  };

  await sleep(500);

  const duplicateCheck = checkDuplicateSubmission(input.farmerId, input.farmCoordinates);
  const frequencyCheck = checkSubmissionFrequency(input.farmerId);

  const checks = [duplicateCheck, frequencyCheck];
  const riskAssessment = assessRisk(checks);

  if (duplicateCheck.passed) {
    reasoning.push(`✅ ${duplicateCheck.reason}`);
    yield {
      step: 'Historical Check',
      message: `✅ ${duplicateCheck.reason}`,
    };
  } else {
    reasoning.push(`⚠️  ${duplicateCheck.reason}`);
    yield {
      step: 'Historical Check',
      message: `⚠️  ${duplicateCheck.reason}`,
    };
  }

  await sleep(500);

  if (frequencyCheck.passed) {
    reasoning.push(`✅ ${frequencyCheck.reason}`);
    yield {
      step: 'Historical Check',
      message: `✅ ${frequencyCheck.reason}`,
    };
  } else {
    reasoning.push(`⚠️  ${frequencyCheck.reason}`);
    yield {
      step: 'Historical Check',
      message: `⚠️  ${frequencyCheck.reason}`,
    };
  }

  await sleep(500);

  // Step 3: Credit Calculation
  yield {
    step: 'Credit Calculation',
    message: '🧮 Calculating carbon credits...',
  };

  await sleep(500);

  const creditAmount = calculateCredits(ndviScore, input.farmSizeAcres);
  const calculationMessage = `Farm size: ${input.farmSizeAcres} acres × NDVI ${ndviScore.toFixed(2)} × 5 = ${creditAmount} credits`;
  reasoning.push(calculationMessage);

  yield {
    step: 'Credit Calculation',
    message: `✅ ${calculationMessage}`,
    data: { creditAmount },
  };

  await sleep(500);

  // Step 4: Final Verdict
  yield {
    step: 'Final Verdict',
    message: '⚖️  Generating final verdict...',
  };

  await sleep(500);

  const recommendedAction = getRecommendedAction(ndviScore);
  const approved = ndviScore >= 0.45 && riskAssessment.risk !== 'high';

  let verdictMessage: string;
  if (approved) {
    verdictMessage = `APPROVED — ${creditAmount} carbon credits authorized for minting`;
    reasoning.push(`✅ ${verdictMessage}`);
  } else if (riskAssessment.risk === 'high') {
    verdictMessage = `REJECTED — High fraud risk detected`;
    reasoning.push(`❌ ${verdictMessage}`);
  } else {
    verdictMessage = `REJECTED — ${recommendedAction}`;
    reasoning.push(`❌ ${verdictMessage}`);
  }

  yield {
    step: 'Final Verdict',
    message: verdictMessage,
    data: { approved, creditAmount, fraudRisk: riskAssessment.risk, ndviScore },
  };

  // Note: recordSubmission has been moved to the actual minting route to 
  // allow farmers to verify their metadata multiple times before committing.


  return {
    approved,
    creditAmount,
    fraudRisk: riskAssessment.risk,
    reasoning,
    ndviScore,
    imageHash: input.imageHash,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Export agent metadata
export const FarmVerificationAgent = {
  name: 'FarmVerificationAgent',
  description: 'Verifies farm eligibility for carbon credit tokenization using satellite imagery analysis',
  version: '1.0.0',
};
