import { RULE_VERSION } from '@/data/rules';

export interface LegDependencyRow {
  strategy: string;
  expectedCost: string;
  chanceFamilyArrives: string;
  worstCase: string;
  decisionDeadline: string;
  status: 'Available' | 'Active' | 'Not available' | 'Recommended';
  assumptionNote: string;
}

/**
 * Pure leg dependency evaluator comparing Keep Leg 1, Cancel Leg 1, and Re-route
 * under normal on-time vs delayed disruption states.
 */
export function evaluateLegDependencies(delayActive: boolean): {
  rows: LegDependencyRow[];
  ruleVersion: string;
  summary: string;
} {
  if (!delayActive) {
    return {
      ruleVersion: RULE_VERSION,
      summary: 'Before chart preparation (08:00 simulated): Keep Leg 1 carries moderate waitlist risk on Leg 2. Cancel Leg 1 incurs ₹60/pax clerkage. Re-route locks in alternative seats.',
      rows: [
        {
          strategy: 'Keep Leg 1 & Wait',
          expectedCost: '₹0 additional (₹10,200 already paid)',
          chanceFamilyArrives: '38% to 55% (WL #14-18 confirmation likelihood)',
          worstCase: 'Stranded at Central Junction if Leg 2 fails to confirm; emergency Tatkal needed.',
          decisionDeadline: '08:00 (Chart preparation cutoff for SIM-202)',
          status: 'Active',
          assumptionNote: 'Assumes SIM-101 runs on schedule with 40 min connection margin.',
        },
        {
          strategy: 'Cancel Leg 1 Now',
          expectedCost: '₹240 loss (Refund ₹4,160 after ₹60 clerkage/pax on Leg 1)',
          chanceFamilyArrives: '0% (Journey abandoned at origin SCA)',
          worstCase: 'Trip cancelled entirely; hotel bookings in SCB lost.',
          decisionDeadline: '04:00 (2 hrs prior to SIM-101 06:00 departure)',
          status: 'Available',
          assumptionNote: 'Demo refund rule: Fare minus ₹60 clerkage charge.',
        },
        {
          strategy: 'Re-route Now (Plan B)',
          expectedCost: '+₹6,200 extra fare for confirmed SIM-303 seats',
          chanceFamilyArrives: '95% to 99% (Confirmed berths on SIM-303)',
          worstCase: 'Arrive SCB 18:50 (75 min later than scheduled 17:30).',
          decisionDeadline: '10:00 (Tatkal quota closes on SIM-303)',
          status: 'Available',
          assumptionNote: 'Guarantees step-free access and keeps P1 and P2 together.',
        },
      ],
    };
  }

  // After delay is announced (10:30 simulated)
  return {
    ruleVersion: RULE_VERSION,
    summary: 'After delay announcement (10:30 simulated): Train 1 departed at 06:00 and is now 55 min late. Cancel Leg 1 is NOT available. Missed connection forces re-route from Central Junction.',
    rows: [
      {
        strategy: 'Keep Leg 1 & Re-route (Plan B)',
        expectedCost: '+₹6,200 extra (Leg 2 refunded ₹5,560, net extra ₹640)',
        chanceFamilyArrives: '95% to 99% (SIM-303 confirmed seats)',
        worstCase: 'Arrival 18:50 (range 18:50 to 19:20). Verified lift/ramp at CJN.',
        decisionDeadline: '11:45 (Before SIM-303 departure from CJN at 13:10)',
        status: 'Recommended',
        assumptionNote: 'Leg 2 waitlisted tickets automatically enter 4-state refund ledger.',
      },
      {
        strategy: 'Keep Leg 1 & Re-route (Plan C)',
        expectedCost: '+₹3,400 extra (Leg 2 refunded ₹5,560, net savings ₹2,160)',
        chanceFamilyArrives: '90% to 94% (SIM-505 confirmed seats)',
        worstCase: 'Arrival 19:55 (range 19:55 to 20:40). Arrival platform ramp Unknown.',
        decisionDeadline: '12:15 (Before SIM-505 departure from CJN at 13:40)',
        status: 'Available',
        assumptionNote: 'Budget option but flagged for unverified accessibility.',
      },
      {
        strategy: 'Cancel Leg 1',
        expectedCost: 'N/A — ₹0 refundable',
        chanceFamilyArrives: 'Infeasible (Train currently in transit)',
        worstCase: 'Cannot cancel ticket for a train that has already departed.',
        decisionDeadline: 'Expired at 06:00 (Departure time)',
        status: 'Not available',
        assumptionNote: 'Not available: SIM-101 already departed Sample City A at 06:00.',
      },
    ],
  };
}
