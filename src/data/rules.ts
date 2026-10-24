export const RULE_VERSION = 'rules-v1.0';

export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  category: 'Safety' | 'Accessibility' | 'Transfer' | 'Finance';
  officialComplianceNote: string;
}

export const SYSTEM_RULES: RuleDefinition[] = [
  {
    id: 'R1',
    name: 'Caregiver Protection Rule',
    description: 'P1 (older passenger with limited mobility) and P2 (designated caregiver) must never be separated on any travel leg.',
    category: 'Safety',
    officialComplianceNote: 'Railyug safety constraint prevents booking arrangements that leave vulnerable travellers unattended.',
  },
  {
    id: 'R2',
    name: 'Dependent Child Guardian Rule',
    description: 'P3 (child under five) must always share a coach/group with at least one designated guardian (P2, P4, or P5).',
    category: 'Safety',
    officialComplianceNote: 'Ensures minors are accompanied by an adult travelling party at all times.',
  },
  {
    id: 'R3',
    name: 'Accessibility Awareness Rule',
    description: 'Plans failing P1 step-free access requirements are rejected. Platforms with Unknown ramp/lift accessibility receive a 0.85 multiplier and are flagged as not verified safe.',
    category: 'Accessibility',
    officialComplianceNote: 'Never assumes accessibility when platform lift/ramp inspection data is unconfirmed.',
  },
  {
    id: 'R4',
    name: 'Transfer Feasibility Gate',
    description: 'Connection feasibility is computed using per-passenger walking speeds, luggage overhead (10%), lift wait (4 min), and regrouping buffer (5 min). Any plan resulting in a negative connection margin is classified as Infeasible and rejected.',
    category: 'Transfer',
    officialComplianceNote: 'Honest transfer model: Train 1 running 55 min late produces -15 min margin (missed connection).',
  },
  {
    id: 'R5',
    name: 'Refund & Clerkage Rule (Demo Only)',
    description: 'Cancelled berths are refunded as ticket fare minus 60 clerkage fee per passenger. Child fare is 0. All 4 paying passengers cancel Leg 2 producing exactly 5,560 total simulated refund.',
    category: 'Finance',
    officialComplianceNote: 'Simulated demonstration rule set. Not official railway policy. Real refunds follow official IRCTC cancellation rules.',
  },
];

export const TRANSFER_CONSTANTS = {
  distanceMeters: 420,
  luggageFactor: 0.10,
  liftWaitMinutes: 4.0,
  stairsPenaltyMinutes: 6.0,
  regroupBufferMinutes: 5.0,
  p1SpeedMps: 0.5,
  childSpeedMps: 0.7,
  normalSpeedMps: 1.2,
};

export const REFUND_CONSTANTS = {
  leg1FareAdult: 1100,
  leg2FareAdult: 1450,
  childFare: 0,
  clerkageFeePerPax: 60,
  reconciledLeg2Total: 5560,
};
