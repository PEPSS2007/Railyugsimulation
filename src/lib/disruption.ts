import { RULE_VERSION } from '@/data/rules';
import { AuditEvent, Leg, ConnectionInfo, PlanOption, PriorityPreset } from '@/types';
import { computeTransferFeasibility } from './transfer';
import { rankPlans } from './ranking';
import { INITIAL_PASSENGERS } from '@/data/scenario';

export interface DisruptionResult {
  updatedLegs: Leg[];
  updatedClock: string;
  updatedDelay: { active: boolean; minutes: number; appliesTo: string };
  alertText: string;
  transferResult: ReturnType<typeof computeTransferFeasibility>;
  rankedPlans: PlanOption[];
  rankDiffExplanation?: string;
  auditEvent: AuditEvent;
}

/**
 * Pure disruption engine: processes official 55-minute delay on SIM-101.
 * SIM-202 is NOT delayed. Connection is missed by 15 minutes.
 */
export function applyDisruptionDelay(
  legs: Leg[],
  connection: ConnectionInfo,
  plans: PlanOption[],
  priority: PriorityPreset
): DisruptionResult {
  const updatedClock = '10:30';
  const delayMinutes = 55;

  const updatedLegs = legs.map((leg) => {
    if (leg.trainNumber === 'SIM-101') {
      return {
        ...leg,
        delayMinutes: 55,
        arrivalTime: '12:15', // 11:20 + 55 min = 12:15
      };
    }
    // SIM-202 is explicitly NOT delayed
    return {
      ...leg,
      delayMinutes: 0,
    };
  });

  const updatedDelay = {
    active: true,
    minutes: 55,
    appliesTo: 'SIM-101',
  };

  const transferResult = computeTransferFeasibility(INITIAL_PASSENGERS, connection, delayMinutes);

  const { rankedPlans, diffExplanation } = rankPlans(plans, priority, true);

  const alertText =
    'Train 1 (SIM-101) is running 55 minutes late, arriving Central Junction at 12:15. Your 40-minute connection is missed by 15 minutes (SIM-202 departs at 12:00 on time).';

  const auditEvent: AuditEvent = {
    id: `EVT-DLY-${Date.now().toString(36)}`,
    at: updatedClock,
    type: 'Disruption',
    description: 'Official alert received: SIM-101 delayed +55 min. Arrival CJN 12:15. Connection missed by 15 min.',
    reason: 'Authoritative railway delay announcement trigger. Instant re-plan activated.',
    ruleVersion: RULE_VERSION,
    planVersion: 'plan-v2.0',
  };

  return {
    updatedLegs,
    updatedClock,
    updatedDelay,
    alertText,
    transferResult,
    rankedPlans,
    rankDiffExplanation: diffExplanation,
    auditEvent,
  };
}
