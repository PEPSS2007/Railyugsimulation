import { RefundComponent, RefundState, AuditEvent, PassengerId } from '@/types';
import { RULE_VERSION, REFUND_CONSTANTS } from '@/data/rules';

export const ORDERED_REFUND_STATES: RefundState[] = [
  'Cancellation',
  'Refund initiated',
  'Refund processing',
  'Final credit',
];

export interface AdvanceRefundResult {
  updatedLedger: RefundComponent[];
  success: boolean;
  message: string;
  auditEvent: AuditEvent;
}

/**
 * Pure function: advances exactly one state forward in the four-state timeline.
 * Skipping states or jumping backward is strictly rejected.
 */
export function advanceRefundState(
  ledger: RefundComponent[],
  componentId: string,
  clock: string
): AdvanceRefundResult {
  const target = ledger.find((c) => c.id === componentId);
  if (!target) {
    return {
      updatedLedger: ledger,
      success: false,
      message: `Component ID ${componentId} not found in ledger.`,
      auditEvent: {
        id: `EVT-RFD-${Date.now().toString(36)}`,
        at: clock,
        type: 'Refund',
        description: `Advance failed: Component ${componentId} not found.`,
        reason: 'Invalid ledger component ID.',
        ruleVersion: RULE_VERSION,
      },
    };
  }

  const currentIndex = ORDERED_REFUND_STATES.indexOf(target.refundState);
  if (currentIndex === -1 || currentIndex >= ORDERED_REFUND_STATES.length - 1) {
    return {
      updatedLedger: ledger,
      success: false,
      message: `Component ${componentId} is already in the terminal state '${target.refundState}'.`,
      auditEvent: {
        id: `EVT-RFD-${Date.now().toString(36)}`,
        at: clock,
        type: 'Refund',
        description: `Advance rejected: ${componentId} already at Final credit.`,
        reason: 'Terminal state reached; further transitions not permitted.',
        ruleVersion: RULE_VERSION,
      },
    };
  }

  const nextState = ORDERED_REFUND_STATES[currentIndex + 1];

  const updatedLedger = ledger.map((comp) => {
    if (comp.id === componentId) {
      return {
        ...comp,
        refundState: nextState,
        lastUpdated: `${clock} Simulated`,
      };
    }
    return comp;
  });

  return {
    updatedLedger,
    success: true,
    message: `Advanced component ${componentId} from '${target.refundState}' to '${nextState}'.`,
    auditEvent: {
      id: `EVT-RFD-${Date.now().toString(36)}`,
      at: clock,
      type: 'Refund',
      description: `Refund component ${componentId} (${target.passengerId}) transitioned to '${nextState}'.`,
      reason: `Strict 4-state pipeline: Step ${currentIndex + 1} of 4 reached.`,
      ruleVersion: RULE_VERSION,
    },
  };
}

export interface ReconciliationReport {
  isReconciled: boolean;
  totalSum: number;
  expectedSum: number;
  difference: number;
  duplicateIdsFound: string[];
  componentsByState: Record<RefundState, number>;
  statusText: 'Reconciled' | 'Mismatch';
  summaryMessage: string;
}

/**
 * Pure function: performs reconciliation audit across all refund components.
 */
export function reconcileLedger(ledger: RefundComponent[]): ReconciliationReport {
  const expectedSum = REFUND_CONSTANTS.reconciledLeg2Total; // 5560
  let totalSum = 0;
  const seenIds = new Set<string>();
  const duplicateIdsFound: string[] = [];

  const componentsByState: Record<RefundState, number> = {
    'Cancellation': 0,
    'Refund initiated': 0,
    'Refund processing': 0,
    'Final credit': 0,
  };

  for (const comp of ledger) {
    totalSum += comp.refundAmount;

    if (seenIds.has(comp.id)) {
      duplicateIdsFound.push(comp.id);
    }
    seenIds.add(comp.id);

    if (componentsByState[comp.refundState] !== undefined) {
      componentsByState[comp.refundState] += 1;
    }
  }

  const difference = totalSum - expectedSum;
  const isReconciled = difference === 0 && duplicateIdsFound.length === 0;

  return {
    isReconciled,
    totalSum,
    expectedSum,
    difference,
    duplicateIdsFound,
    componentsByState,
    statusText: isReconciled ? 'Reconciled' : 'Mismatch',
    summaryMessage: isReconciled
      ? `Reconciled: Total components sum to ₹${totalSum.toLocaleString()} (Expected ₹${expectedSum.toLocaleString()}). Zero duplicates detected across ${ledger.length} items.`
      : `Mismatch: Total components sum to ₹${totalSum.toLocaleString()} (Difference: ₹${difference.toLocaleString()}). ${duplicateIdsFound.length} duplicates detected.`,
  };
}

export interface CancellationImpactReport {
  passengerId: PassengerId;
  legId: string;
  fareBefore: number;
  fareAfter: number;
  refundGenerated: number;
  clerkageDeducted: number;
  affectedRules: string[];
  safetyWarning?: string;
}

/**
 * Pure function: previews the cancellation impact of a specific passenger on a leg.
 */
export function previewCancellationImpact(
  passengerId: PassengerId,
  legId: string,
  allPassengersFare: number = 5800 // default full leg fare
): CancellationImpactReport {
  const fare = passengerId === 'P3' ? 0 : 1450;
  const clerkage = passengerId === 'P3' ? 0 : 60;
  const refundGenerated = fare - clerkage;
  const fareAfter = allPassengersFare - fare;

  const affectedRules: string[] = [];
  let safetyWarning: string | undefined;

  if (passengerId === 'P2') {
    affectedRules.push('R1: Caregiver Protection Rule', 'R2: Dependent Child Guardian Rule');
    safetyWarning = 'CRITICAL WARNING: Cancelling P2 (Caregiver) leaves P1 (mobility dependent) without an escort and leaves P3 (child) without a primary caregiver. Group safety validation will fail.';
  } else if (passengerId === 'P1') {
    affectedRules.push('R1: Caregiver Protection Rule');
    safetyWarning = 'Notice: Cancelling P1 separates caregiver P2 from their assigned charge. Review P2 travel purpose.';
  } else if (passengerId === 'P3') {
    affectedRules.push('R2: Dependent Child Guardian Rule');
    safetyWarning = 'Notice: Infant ticket cancellation carries ₹0 fee and ₹0 refund.';
  }

  return {
    passengerId,
    legId,
    fareBefore: allPassengersFare,
    fareAfter,
    refundGenerated,
    clerkageDeducted: clerkage,
    affectedRules,
    safetyWarning,
  };
}
