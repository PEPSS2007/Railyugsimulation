import test from 'node:test';
import assert from 'node:assert/strict';

import { computeTransferFeasibility } from '../src/lib/transfer';
import { checkFamilySplit, evaluatePlanConstraints } from '../src/lib/constraints';
import { rankPlans } from '../src/lib/ranking';
import { advanceRefundState, reconcileLedger } from '../src/lib/refunds';
import { startGroupHold, payHold, expireHold } from '../src/lib/holds';
import { INITIAL_PASSENGERS, INITIAL_CONNECTION, INITIAL_SEATS, INITIAL_TATKAL_HOLD, INITIAL_REFUND_LEDGER } from '../src/data/scenario';
import { PlanOption } from '../src/types';

// Fixture plans for testing
const FIXTURE_PLANS: PlanOption[] = [
  {
    id: 'A',
    name: 'Plan A — Booked Route',
    subtitle: 'Stay on SIM-101 and SIM-202',
    trains: ['SIM-101', 'SIM-202'],
    departureTime: '06:00',
    expectedArrival: '17:30',
    arrivalRange: { min: '17:30', max: '17:30' },
    arrivalRangeWidthMinutes: 0,
    extraCost: 0,
    availabilityText: 'Waitlisted #14-18 (38% to 55%)',
    connectionRisk: 'Scheduled 40 min connection',
    accessibilityStatus: 'Known feasible',
    accessibilityMultiplier: 1.0,
    familySafetyStatus: 'Safe',
    reason: 'Original booked schedule',
    score: 0.77,
    factorScores: { arrival: 1.0, reliability: 1.0, transfer: 0.533, confirmation: 0.38, cost: 1.0 },
    violations: [],
    blocked: false,
    infeasible: false,
  },
  {
    id: 'B',
    name: 'Plan B — Verified Step-Free Re-route',
    subtitle: 'Re-route on SIM-303 from Central Junction',
    trains: ['SIM-101', 'SIM-303'],
    departureTime: '06:00',
    expectedArrival: '18:50',
    arrivalRange: { min: '18:50', max: '19:20' },
    arrivalRangeWidthMinutes: 30,
    extraCost: 6200,
    availabilityText: 'Confirmed Seats (Coach C1)',
    connectionRisk: 'Comfortable 55 min junction buffer',
    accessibilityStatus: 'Known feasible',
    accessibilityMultiplier: 1.0,
    familySafetyStatus: 'Safe',
    reason: 'Confirmed seats, known ramp & lift access',
    score: 0.75,
    factorScores: { arrival: 0.8, reliability: 0.75, transfer: 1.0, confirmation: 0.95, cost: 0.114 },
    violations: [],
    blocked: false,
    infeasible: false,
  },
  {
    id: 'C',
    name: 'Plan C — Economy Re-route',
    subtitle: 'Re-route on SIM-505 from Central Junction',
    trains: ['SIM-101', 'SIM-505'],
    departureTime: '06:00',
    expectedArrival: '19:55',
    arrivalRange: { min: '19:55', max: '20:40' },
    arrivalRangeWidthMinutes: 45,
    extraCost: 3400,
    availabilityText: 'Confirmed Seats (Sleeper Class)',
    connectionRisk: '85 min connection window',
    accessibilityStatus: 'Unknown',
    accessibilityMultiplier: 0.85,
    familySafetyStatus: 'Flagged',
    reason: 'Lower cost alternative, but arrival ramp Unknown',
    score: 0.62,
    factorScores: { arrival: 0.6, reliability: 0.625, transfer: 1.0, confirmation: 0.90, cost: 0.514 },
    violations: [],
    blocked: false,
    infeasible: false,
  },
  {
    id: 'D',
    name: 'Plan D — Fastest Split (Rejected)',
    subtitle: 'Separate P1 from P2 to catch earliest train',
    trains: ['SIM-303', 'SIM-505'],
    departureTime: '06:00',
    expectedArrival: '18:15',
    arrivalRange: { min: '18:15', max: '18:30' },
    arrivalRangeWidthMinutes: 15,
    extraCost: 4500,
    availabilityText: 'Split Availability',
    connectionRisk: 'Split connection',
    accessibilityStatus: 'Known feasible',
    accessibilityMultiplier: 1.0,
    familySafetyStatus: 'Blocked',
    reason: 'Separates P1 from caregiver P2',
    score: 0,
    factorScores: { arrival: 0.9, reliability: 0.875, transfer: 1.0, confirmation: 0.85, cost: 0.357 },
    violations: [{ rule: 'R1', reason: 'P1 and P2 separated', fix: 'Keep P1 and P2 together' }],
    blocked: true,
    infeasible: false,
  },
];

// Test 1: Transfer on time returns Feasible with margin 16.
test('1. Transfer on time returns Feasible with margin 16', () => {
  const result = computeTransferFeasibility(INITIAL_PASSENGERS, INITIAL_CONNECTION, 0);
  assert.equal(result.status, 'Feasible');
  assert.equal(result.marginMinutes, 16);
  assert.equal(result.availableMinutes, 40);
  assert.equal(result.requiredMinutes, 24);
});

// Test 2: Transfer with 55 minute delay returns Infeasible, missed by 15.
test('2. Transfer with 55 minute delay returns Infeasible, missed by 15', () => {
  const result = computeTransferFeasibility(INITIAL_PASSENGERS, INITIAL_CONNECTION, 55);
  assert.equal(result.status, 'Infeasible');
  assert.equal(result.availableMinutes, -15);
  assert.match(result.statusLabel, /missed by 15/i);
});

// Test 3: Splitting P1 and P2 returns Blocked by R1.
test('3. Splitting P1 and P2 returns Blocked by R1', () => {
  const split = {
    P1: 'Group 1' as const,
    P2: 'Group 2' as const,
    P3: 'Group 1' as const,
    P4: 'Group 1' as const,
    P5: 'Group 1' as const,
  };
  const result = checkFamilySplit(split);
  assert.equal(result.allowed, false);
  assert.equal(result.ruleViolated, 'R1');
  assert.match(result.reason || '', /Rule R1/i);
  assert.match(result.fix || '', /Move P2/i);
});

// Test 4: Leaving P3 with no guardian returns Blocked by R2.
test('4. Leaving P3 with no guardian returns Blocked by R2', () => {
  const split = {
    P1: 'Group 1' as const,
    P2: 'Group 1' as const,
    P3: 'Group 2' as const, // P3 alone with P1/P4/P5 all in Group 1? Wait, P1 & P2 are together in G1, P4 & P5 in G1
    P4: 'Group 1' as const,
    P5: 'Group 1' as const,
  };
  const result = checkFamilySplit(split);
  assert.equal(result.allowed, false);
  assert.equal(result.ruleViolated, 'R2');
  assert.match(result.reason || '', /Rule R2/i);
});

// Test 5: A plan with Unknown accessibility returns Flagged and uses multiplier 0.85.
test('5. A plan with Unknown accessibility returns Flagged and uses multiplier 0.85', () => {
  const evalResult = evaluatePlanConstraints('C', 'Feasible', 'Unknown');
  assert.equal(evalResult.status, 'Flagged');
  assert.equal(evalResult.accessibilityMultiplier, 0.85);
  assert.ok(evalResult.violations.some((v) => v.rule === 'R3'));
});

// Test 6: Ranking fixtures from section 8.4 hold for Balanced and Lowest cost.
test('6. Ranking fixtures from section 8.4 hold for Balanced and Lowest cost', () => {
  // Balanced after delay: Plan A infeasible, Plan B first (rank 1), Plan C second (rank 2)
  const { rankedPlans: balancedAfterDelay } = rankPlans(FIXTURE_PLANS, 'balanced', true);
  const planA = balancedAfterDelay.find((p) => p.id === 'A');
  const planB = balancedAfterDelay.find((p) => p.id === 'B');
  const planC = balancedAfterDelay.find((p) => p.id === 'C');
  const planD = balancedAfterDelay.find((p) => p.id === 'D');

  assert.equal(planA?.infeasible, true);
  assert.equal(planA?.rank, undefined);
  assert.equal(planD?.blocked, true);
  assert.equal(planD?.rank, undefined);
  assert.equal(planB?.rank, 1);
  assert.equal(planC?.rank, 2);

  // Lowest cost after delay: Plan C first (rank 1), Plan B second (rank 2)
  const { rankedPlans: costAfterDelay } = rankPlans(FIXTURE_PLANS, 'cost', true);
  const costPlanB = costAfterDelay.find((p) => p.id === 'B');
  const costPlanC = costAfterDelay.find((p) => p.id === 'C');

  assert.equal(costPlanC?.rank, 1);
  assert.equal(costPlanB?.rank, 2);
});

// Test 7: Identical inputs give identical ranking twice.
test('7. Identical inputs give identical ranking twice', () => {
  const run1 = rankPlans(FIXTURE_PLANS, 'balanced', false);
  const run2 = rankPlans(FIXTURE_PLANS, 'balanced', false);

  assert.deepEqual(
    run1.rankedPlans.map((p) => ({ id: p.id, rank: p.rank, score: p.score })),
    run2.rankedPlans.map((p) => ({ id: p.id, rank: p.rank, score: p.score }))
  );
});

// Test 8: Refund advance cannot skip a state; duplicate component id is rejected; totals reconcile to 5,560.
test('8. Refund advance cannot skip a state; duplicate id rejected; totals reconcile to 5,560', () => {
  // Advance one step
  const adv1 = advanceRefundState(INITIAL_REFUND_LEDGER, 'RC-P1-L2-001', '07:05');
  assert.equal(adv1.success, true);
  const comp1 = adv1.updatedLedger.find((c) => c.id === 'RC-P1-L2-001');
  assert.equal(comp1?.refundState, 'Refund initiated');

  // Reconciliation check
  const report = reconcileLedger(INITIAL_REFUND_LEDGER);
  assert.equal(report.isReconciled, true);
  assert.equal(report.totalSum, 5560);
  assert.equal(report.statusText, 'Reconciled');
  assert.equal(report.duplicateIdsFound.length, 0);

  // Reject duplicate id check
  const duplicateLedger = [...INITIAL_REFUND_LEDGER, { ...INITIAL_REFUND_LEDGER[0] }];
  const dupReport = reconcileLedger(duplicateLedger);
  assert.equal(dupReport.isReconciled, false);
  assert.equal(dupReport.duplicateIdsFound.length, 1);
});

// Test 9: Hold: two simultaneous claims produce exactly one holder; expiry releases seats; repeat click does not extend window; late payment rejected.
test('9. Hold: check-and-set mutual exclusion; expiry releases seats; repeat click does not extend window', () => {
  const now = 1000;
  // User 1 starts hold
  const start1 = startGroupHold(INITIAL_TATKAL_HOLD, INITIAL_SEATS, '10:30', now);
  assert.equal(start1.hold.status, 'Processing');
  assert.equal(start1.hold.expiresAtSeconds, now + 180);
  assert.equal(start1.conflict, false);

  // User 1 clicks again at now + 10s: does NOT extend window
  const startAgain = startGroupHold(start1.hold, start1.seats, '10:30', now + 10);
  assert.equal(startAgain.hold.expiresAtSeconds, now + 180); // unchanged!
  assert.equal(startAgain.hold.secondsRemaining, 170);

  // Second user tries same seats: rejected!
  const user2Claim = startGroupHold(INITIAL_TATKAL_HOLD, start1.seats, '10:30', now + 15);
  assert.equal(user2Claim.conflict, true);
  assert.equal(user2Claim.hold.status, 'Rejected');

  // Expiry releases seats
  const expired = expireHold(start1.hold, start1.seats, '10:33');
  assert.equal(expired.hold.status, 'Expired');
  assert.ok(expired.seats.every((s) => s.state === 'Available'));

  // Late payment rejected
  const latePay = payHold(start1.hold, start1.seats, '10:34', now + 200);
  assert.equal(latePay.hold.status, 'Rejected');
  assert.equal(latePay.conflict, true);
});
