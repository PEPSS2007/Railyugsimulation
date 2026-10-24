export interface DataCardSection {
  title: string;
  summary: string;
  items: Array<{ key: string; value: string; assumption: string }>;
}

export const DATA_CARD_DATA: DataCardSection[] = [
  {
    title: 'Synthetic Journey & Timetable Data',
    summary: 'All train numbers, stations, schedules, and delays are fictional simulated constructs designed for reproducible hackathon evaluation.',
    items: [
      {
        key: 'Origin & Destination',
        value: 'Sample City A (SCA) to Sample City B (SCB) via Central Junction (CJN)',
        assumption: 'Fixed route to benchmark multi-leg transfer vulnerability under single-leg delay.',
      },
      {
        key: 'Leg 1 (SIM-101)',
        value: 'Departure 06:00, Scheduled Arrival 11:20 (Platform 2)',
        assumption: 'Authoritative confirmed reservation for all 5 passengers.',
      },
      {
        key: 'Leg 2 (SIM-202)',
        value: 'Departure 12:00, Scheduled Arrival 17:30 (Platform 9)',
        assumption: 'Waitlisted ticket (WL #14-18) illustrating lack of atomic guarantee across separate train legs.',
      },
      {
        key: 'Disruption Event',
        value: 'SIM-101 delayed by +55 minutes (Arrival 12:15). SIM-202 on-time.',
        assumption: 'Connection is missed by exactly 15 minutes (12:15 - 12:00). SIM-202 is never falsely assumed delayed.',
      },
    ],
  },
  {
    title: 'Transfer Feasibility Model',
    summary: 'Calculates physical transfer time required across platforms instead of a generic flat minimum connection time.',
    items: [
      {
        key: 'Walking Speeds',
        value: 'P1: 0.5 m/s, P3 (carried child): 0.7 m/s, P2/P4/P5: 1.2 m/s',
        assumption: 'Group moves at the pace of the slowest member (P1: 420m / 0.5 m/s = 14 min).',
      },
      {
        key: 'Luggage & Regrouping Overheads',
        value: '10% luggage overhead, 4 min lift wait, 5 min group regroup buffer',
        assumption: 'P1 total required time = 14 * 1.1 + 4 + 5 = 24.4 min (~24 min, range 21 to 29 min).',
      },
      {
        key: 'On-time vs Disrupted Margin',
        value: 'On-time margin: +16 min (Feasible). Disrupted: -15 min (Infeasible)',
        assumption: 'Available time decreases from 40 min to -15 min upon 55-min delay announcement.',
      },
    ],
  },
  {
    title: 'Synthetic Waitlist History & Wilson Estimator',
    summary: 'Generates confirmation confidence intervals without making unwarranted guarantees.',
    items: [
      {
        key: 'Historical Dataset',
        value: '214 synthetic records for 3A class, WL 10-20 position band',
        assumption: 'Point estimate ~46.7%, 95% Wilson Confidence Interval is 38% to 55%.',
      },
      {
        key: 'Low Data Warning Rule',
        value: 'Triggers when sample size n < 30',
        assumption: 'Never returns 0% or 100% confirmation certainty; explicitly labelled "Synthetic, not calibrated".',
      },
    ],
  },
  {
    title: 'Refund & Clerkage State Machine',
    summary: 'Deterministic four-state financial ledger tracking per-passenger ticket components.',
    items: [
      {
        key: 'States',
        value: 'Cancellation -> Refund initiated -> Refund processing -> Final credit',
        assumption: 'Strictly ordered sequential transition with no state skipping or duplication.',
      },
      {
        key: 'Reconciliation Fixture',
        value: '₹5,560 across 4 paying passengers (₹1,450 fare - ₹60 clerkage = ₹1,390 each; child ₹0)',
        assumption: 'Total refundable sum must strictly reconcile with component totals.',
      },
    ],
  },
];
