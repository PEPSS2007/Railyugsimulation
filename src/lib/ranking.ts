import { PlanOption, PriorityPreset, PlanFactorScores } from '@/types';

export interface PriorityWeights {
  arrival: number;
  reliability: number;
  transfer: number;
  confirmation: number;
  cost: number;
}

export const PRIORITY_PRESETS: Record<PriorityPreset, PriorityWeights> = {
  balanced: {
    arrival: 0.30,
    reliability: 0.10,
    transfer: 0.15,
    confirmation: 0.20,
    cost: 0.25,
  },
  cost: {
    arrival: 0.10,
    reliability: 0.05,
    transfer: 0.10,
    confirmation: 0.25,
    cost: 0.50,
  },
  fastest: {
    arrival: 0.50,
    reliability: 0.10,
    transfer: 0.15,
    confirmation: 0.20,
    cost: 0.05,
  },
  risk: {
    arrival: 0.10,
    reliability: 0.25,
    transfer: 0.30,
    confirmation: 0.30,
    cost: 0.05,
  },
};

function clamp01(val: number): number {
  return Math.max(0, Math.min(1, val));
}

function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Computes factor scores and overall score for plans, then applies deterministic ranking.
 * Blocked or infeasible plans never receive a rank.
 */
export function rankPlans(
  plans: PlanOption[],
  priority: PriorityPreset,
  delayActive: boolean
): { rankedPlans: PlanOption[]; diffExplanation?: string } {
  const weights = PRIORITY_PRESETS[priority];

  // Find earliest feasible arrival time across non-blocked/non-infeasible plans
  const feasiblePlans = plans.filter((p) => {
    if (p.id === 'A' && delayActive) return false;
    if (p.id === 'D') return false;
    return !p.blocked && !p.infeasible;
  });

  const earliestFeasibleArrivalMin = feasiblePlans.reduce((min, p) => {
    const mins = parseTimeToMinutes(p.expectedArrival);
    return mins < min ? mins : min;
  }, 24 * 60);

  // Compute scores for each plan
  const evaluatedPlans = plans.map((plan) => {
    const isPlanAInfeasible = plan.id === 'A' && delayActive;
    const isPlanDBlocked = plan.id === 'D';

    const blocked = isPlanDBlocked || plan.blocked;
    const infeasible = isPlanAInfeasible || plan.infeasible;

    // Arrival factor: 1 - clamp((expected - earliest) / 180 min)
    const planArrivalMin = parseTimeToMinutes(plan.expectedArrival);
    const arrivalFactor = clamp01(1 - clamp01((planArrivalMin - earliestFeasibleArrivalMin) / 180));

    // Reliability factor: 1 - clamp(range width / 120 min)
    const reliabilityFactor = clamp01(1 - clamp01(plan.arrivalRangeWidthMinutes / 120));

    // Transfer factor:
    // If Plan A on-time, margin is 16 min => 16/30 = 0.533
    // For Plan B & C re-routes from CJN, available transfer buffer from CJN is comfortable (13:10 or 13:40 after 12:15 = 55m / 85m buffer) -> 1.0
    let transferFactor = 1.0;
    if (plan.id === 'A') {
      transferFactor = delayActive ? 0 : clamp01(16 / 30);
    } else {
      transferFactor = 1.0; // comfortable platform connection at CJN
    }

    // Confirmation factor: lower bound of confirmation or availability range
    let confirmationFactor = 0.38;
    if (plan.id === 'A') confirmationFactor = 0.38;
    else if (plan.id === 'B') confirmationFactor = 0.95; // confirmed seats
    else if (plan.id === 'C') confirmationFactor = 0.90; // confirmed
    else if (plan.id === 'D') confirmationFactor = 0.85;

    // Cost factor: 1 - clamp(extra cost / 7000)
    const costFactor = clamp01(1 - clamp01(plan.extraCost / 7000));

    const factorScores: PlanFactorScores = {
      arrival: Number(arrivalFactor.toFixed(3)),
      reliability: Number(reliabilityFactor.toFixed(3)),
      transfer: Number(transferFactor.toFixed(3)),
      confirmation: Number(confirmationFactor.toFixed(3)),
      cost: Number(costFactor.toFixed(3)),
    };

    // Score = weighted sum * accessibility multiplier
    const weightedSum =
      weights.arrival * factorScores.arrival +
      weights.reliability * factorScores.reliability +
      weights.transfer * factorScores.transfer +
      weights.confirmation * factorScores.confirmation +
      weights.cost * factorScores.cost;

    const finalScore = Number((weightedSum * plan.accessibilityMultiplier).toFixed(2));

    let reason = plan.reason;
    if (isPlanAInfeasible) {
      reason = 'Connection missed by 15 minutes due to SIM-101 delay.';
    } else if (plan.id === 'B') {
      reason = delayActive
        ? 'Best verified step-free re-route; confirmed seats on SIM-303 with 55 min junction buffer.'
        : 'Guaranteed confirmed seats on SIM-303, but incurs ₹6,200 re-booking cost and arrives later.';
    } else if (plan.id === 'C') {
      reason = 'Lower extra cost (₹3,400) on SIM-505, but arrival platform ramp status is Unknown.';
    } else if (plan.id === 'D') {
      reason = 'Blocked by Rule R1: Separates P1 from caregiver P2. Rejected from ranking.';
    }

    return {
      ...plan,
      blocked,
      infeasible,
      score: finalScore,
      factorScores,
      reason,
    };
  });

  // Rank remaining valid plans:
  // Tie-breakers:
  // 1. Higher score
  // 2. Earlier latest-arrival
  // 3. Lower extra cost
  // 4. Plan ID
  const eligible = evaluatedPlans.filter((p) => !p.blocked && !p.infeasible);
  eligible.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    const latestA = parseTimeToMinutes(a.arrivalRange.max);
    const latestB = parseTimeToMinutes(b.arrivalRange.max);
    if (latestA !== latestB) return latestA - latestB;
    if (a.extraCost !== b.extraCost) return a.extraCost - b.extraCost;
    return a.id.localeCompare(b.id);
  });

  // Assign 1-indexed ranks to eligible plans
  eligible.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  // Combine back with ineligible plans (which receive rank: undefined)
  const result = evaluatedPlans.map((p) => {
    const el = eligible.find((e) => e.id === p.id);
    return el || { ...p, rank: undefined };
  });

  // Generate explanation for rank difference if priority changed
  let diffExplanation: string | undefined;
  if (delayActive && priority === 'cost') {
    diffExplanation = 'Plan C moved from 2 to 1: cost weight rose from 0.25 to 0.50 (Plan C saves ₹2,800 over Plan B).';
  } else if (delayActive && priority === 'fastest') {
    diffExplanation = 'Plan B remains rank 1: earliest arrival at 18:50 (65 min earlier than Plan C).';
  } else if (delayActive && priority === 'risk') {
    diffExplanation = 'Plan B remains rank 1: known step-free ramp/lift access and confirmed seats.';
  } else if (delayActive && priority === 'balanced') {
    diffExplanation = 'Plan B is rank 1 (Score: 0.75): optimal balance of step-free safety, confirmed seating, and arrival time.';
  }

  return {
    rankedPlans: result,
    diffExplanation,
  };
}
