import { PassengerId, PlanViolation, PlanStatus } from '@/types';

export interface SplitCheckResult {
  allowed: boolean;
  ruleViolated?: string;
  reason?: string;
  fix?: string;
  tradeoffs?: string;
  group1Passengers: PassengerId[];
  group2Passengers: PassengerId[];
}

/**
 * Checks family split assignments against R1 and R2 hard constraints.
 */
export function checkFamilySplit(
  assignment: Record<PassengerId, 'Group 1' | 'Group 2'>
): SplitCheckResult {
  const g1: PassengerId[] = [];
  const g2: PassengerId[] = [];

  (Object.keys(assignment) as PassengerId[]).forEach((pid) => {
    if (assignment[pid] === 'Group 1') g1.push(pid);
    else g2.push(pid);
  });

  // Rule R1: P1 and P2 must never be separated
  if (assignment['P1'] !== assignment['P2']) {
    return {
      allowed: false,
      ruleViolated: 'R1',
      reason: 'Rule R1 violation: P1 (older adult with limited mobility) is separated from P2 (designated caregiver). P1 requires caregiver assistance for boarding, transfers, and safety.',
      fix: `Move P2 to ${assignment['P1']} or move P1 to ${assignment['P2']}.`,
      tradeoffs: 'Unsafe: Vulnerable passenger would travel alone without mobility assistance.',
      group1Passengers: g1,
      group2Passengers: g2,
    };
  }

  // Rule R2: P3 (child under five) must always travel with at least one guardian (P2, P4, or P5)
  const p3Group = assignment['P3'];
  const p3HasGuardian = (p3Group === assignment['P2']) || (p3Group === assignment['P4']) || (p3Group === assignment['P5']);
  if (!p3HasGuardian) {
    return {
      allowed: false,
      ruleViolated: 'R2',
      reason: 'Rule R2 violation: P3 (child under five) is not accompanied by any adult guardian (P2, P4, or P5).',
      fix: `Assign at least one of P2, P4, or P5 to ${p3Group}.`,
      tradeoffs: 'Unsafe: Minor travelling unescorted violates railway passenger safety regulations.',
      group1Passengers: g1,
      group2Passengers: g2,
    };
  }

  // If split is valid (e.g. P5 alone in Group 2, or group 2 has adults)
  const isSplit = g1.length > 0 && g2.length > 0;
  let tradeoffs = 'All family members travelling together as a unified group.';
  if (isSplit) {
    if (g2.length === 1 && g2[0] === 'P5') {
      tradeoffs = 'Allowed: P5 travels in Group 2, remaining family in Group 1. Trade-off: P5 faces waitlist/re-route risk alone; family coordinates via offline Journey Pack and regroups at destination (Sample City B).';
    } else {
      tradeoffs = `Allowed split: Group 1 (${g1.join(', ')}) and Group 2 (${g2.join(', ')}). Trade-off: Separate ticketing requires staggered platform coordination; both groups satisfy caregiver and guardian constraints.`;
    }
  }

  return {
    allowed: true,
    tradeoffs,
    group1Passengers: g1,
    group2Passengers: g2,
  };
}

export interface PlanConstraintEvaluation {
  status: PlanStatus;
  blocked: boolean;
  infeasible: boolean;
  violations: PlanViolation[];
  accessibilityMultiplier: number;
  reason: string;
}

/**
 * Evaluates plan constraints (R1, R2, R3, Connection feasibility).
 */
export function evaluatePlanConstraints(
  planId: string,
  connectionStatus: 'Feasible' | 'Tight' | 'Infeasible' | 'Unknown',
  accessibilityStatus: 'Known feasible' | 'Unknown' | 'Infeasible',
  splitViolations: PlanViolation[] = []
): PlanConstraintEvaluation {
  const violations: PlanViolation[] = [...splitViolations];
  let blocked = false;
  let infeasible = false;
  let multiplier = 1.0;
  let reason = 'All group safety constraints and accessibility checks satisfied.';

  // Hard Rule: Infeasible connection rejects a plan
  if (connectionStatus === 'Infeasible') {
    infeasible = true;
    blocked = true;
    violations.push({
      rule: 'R4',
      reason: 'Scheduled connection missed by 15 minutes due to SIM-101 delay.',
      fix: 'Re-route on alternative departure from Central Junction (Plan B or Plan C).',
    });
    reason = 'Connection missed by 15 minutes. Plan cannot be fulfilled.';
  }

  // Hard Rule: Known step-free failure rejects a plan
  if (accessibilityStatus === 'Infeasible') {
    blocked = true;
    violations.push({
      rule: 'R3',
      reason: 'Known barrier: Arrival platform lacks ramp or lift access for P1.',
      fix: 'Select alternative train arriving at platform with verified step-free infrastructure.',
    });
    reason = 'Step-free route not possible for P1. Plan rejected.';
  }

  // Unknown accessibility applies 0.85 multiplier and flags as not safe
  if (accessibilityStatus === 'Unknown') {
    multiplier = 0.85;
    violations.push({
      rule: 'R3',
      reason: 'Arrival platform ramp status is Unknown. Accessibility cannot be guaranteed.',
      fix: 'Exercise caution or select Plan B where ramp and lift status is confirmed.',
    });
    reason = 'Accessibility data unconfirmed for arrival platform. Flagged with 0.85 multiplier.';
  }

  // Check split violations
  if (splitViolations.length > 0) {
    blocked = true;
    reason = splitViolations[0].reason;
  }

  let status: PlanStatus = 'Safe';
  if (blocked) {
    status = 'Blocked';
  } else if (multiplier < 1.0 || violations.length > 0) {
    status = 'Flagged';
  }

  return {
    status,
    blocked,
    infeasible,
    violations,
    accessibilityMultiplier: multiplier,
    reason,
  };
}
