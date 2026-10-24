import {
  Passenger,
  Leg,
  ConnectionInfo,
  Seat,
  TatkalHold,
  RefundComponent,
  JourneyPack,
  AuditEvent,
} from '@/types';
import { RULE_VERSION } from './rules';

export const SCENARIO_VERSION = 'scenario-v1.0';

export const INITIAL_PASSENGERS: Passenger[] = [
  {
    id: 'P1',
    label: 'P1: Older Passenger',
    role: 'Older Adult (Limited Mobility)',
    needs: 'Needs step-free route (ramp/lift), lower berth, never separated from P2',
    linkedPassengerId: 'P2',
    accessibilityStatus: 'Known',
    walkingSpeed: 0.5, // 0.5 m/s
    luggageFactor: 0.10,
    childCareBuffer: 0,
    coachBerth: {
      leg1: 'Coach B2, Seat 12 (Lower Berth)',
      leg2: 'Coach S4, WL 14 (Pending)',
      leg2Status: 'WAITLISTED #14',
    },
  },
  {
    id: 'P2',
    label: 'P2: Designated Caregiver',
    role: 'Caregiver (Hard-linked to P1)',
    needs: 'Must remain with P1 at all times; assists with transfers and luggage',
    linkedPassengerId: 'P1',
    accessibilityStatus: 'Known',
    walkingSpeed: 1.2,
    luggageFactor: 0.10,
    childCareBuffer: 0,
    coachBerth: {
      leg1: 'Coach B2, Seat 11 (Middle Berth)',
      leg2: 'Coach S4, WL 15 (Pending)',
      leg2Status: 'WAITLISTED #15',
    },
  },
  {
    id: 'P3',
    label: 'P3: Child Under Five',
    role: 'Dependent Child (Age 4)',
    needs: 'Must travel with an adult guardian (P2, P4, or P5); child-care transfer buffer',
    accessibilityStatus: 'Known',
    walkingSpeed: 0.7, // Carried or escorted pace
    luggageFactor: 0.10,
    childCareBuffer: 2.0, // min
    coachBerth: {
      leg1: 'Coach B2, Seat 14 (Upper Berth)',
      leg2: 'Coach S4, WL 16 (Pending)',
      leg2Status: 'WAITLISTED #16',
    },
  },
  {
    id: 'P4',
    label: 'P4: Screen-Reader User',
    role: 'Adult (Assistive Tech User)',
    needs: 'Accessible keyboard navigation, audio/screen-reader announcements, reliable path',
    accessibilityStatus: 'Known',
    walkingSpeed: 1.2,
    luggageFactor: 0.10,
    childCareBuffer: 0,
    coachBerth: {
      leg1: 'Coach B2, Seat 15 (Side Lower)',
      leg2: 'Coach S4, WL 17 (Pending)',
      leg2Status: 'WAITLISTED #17',
    },
  },
  {
    id: 'P5',
    label: 'P5: Flexible Adult',
    role: 'Flexible Adult (Split Candidate)',
    needs: 'Able to travel independently or separate if required to secure alternatives',
    accessibilityStatus: 'Known',
    walkingSpeed: 1.2,
    luggageFactor: 0.10,
    childCareBuffer: 0,
    coachBerth: {
      leg1: 'Coach B2, Seat 16 (Side Upper)',
      leg2: 'Coach S4, WL 18 (Pending)',
      leg2Status: 'WAITLISTED #18',
    },
  },
];

export const INITIAL_LEGS: Leg[] = [
  {
    id: 'L1',
    trainNumber: 'SIM-101',
    trainName: 'Express 101',
    origin: 'Sample City A (SCA)',
    destination: 'Central Junction (CJN)',
    departureTime: '06:00',
    arrivalTime: '11:20',
    originalArrivalTime: '11:20',
    delayMinutes: 0,
    status: 'CONFIRMED',
    fare: 1100,
    childFare: 0,
  },
  {
    id: 'L2',
    trainNumber: 'SIM-202',
    trainName: 'Superfast 202',
    origin: 'Central Junction (CJN)',
    destination: 'Sample City B (SCB)',
    departureTime: '12:00',
    arrivalTime: '17:30',
    originalArrivalTime: '17:30',
    delayMinutes: 0,
    status: 'WAITLISTED',
    fare: 1450,
    childFare: 0,
    waitlistEstimate: {
      min: 38,
      max: 55,
      n: 214,
      note: 'Synthetic, not calibrated',
    },
  },
];

export const INITIAL_CONNECTION: ConnectionInfo = {
  junction: 'Central Junction (CJN)',
  scheduledMinutes: 40,
  arrivalPlatform: 2,
  departurePlatform: 9,
  distanceMeters: 420,
  liftWaitMinutes: 4.0,
  stairsPenaltyMinutes: 6.0,
  regroupBufferMinutes: 5.0,
  liftStatus: 'Operational',
  rampStatus: 'Known feasible',
};

export const INITIAL_SEATS: Seat[] = Array.from({ length: 20 }, (_, idx) => {
  const seatNum = idx + 1;
  const berthTypes: Array<'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper'> = [
    'Lower', 'Middle', 'Upper', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'
  ];
  return {
    id: `seat-${seatNum}`,
    seatNumber: seatNum,
    berthType: berthTypes[idx % berthTypes.length],
    state: 'Available',
    heldBy: null,
  };
});

export const INITIAL_TATKAL_HOLD: TatkalHold = {
  holdId: null,
  holderId: null,
  seatIds: [],
  startedAtSeconds: null,
  expiresAtSeconds: null,
  secondsRemaining: 180,
  status: 'Inactive',
  demoSpeed: false,
  announcementMilestonesReached: {},
};

export const INITIAL_REFUND_LEDGER: RefundComponent[] = [
  {
    id: 'RC-P1-L2-001',
    passengerId: 'P1',
    legId: 'L2 (SIM-202)',
    fare: 1450,
    clerkage: 60,
    refundAmount: 1390,
    cancellationState: 'Pending cancellation',
    refundState: 'Cancellation',
    lastUpdated: '07:00 Simulated',
  },
  {
    id: 'RC-P2-L2-001',
    passengerId: 'P2',
    legId: 'L2 (SIM-202)',
    fare: 1450,
    clerkage: 60,
    refundAmount: 1390,
    cancellationState: 'Pending cancellation',
    refundState: 'Cancellation',
    lastUpdated: '07:00 Simulated',
  },
  {
    id: 'RC-P3-L2-001',
    passengerId: 'P3',
    legId: 'L2 (SIM-202)',
    fare: 0,
    clerkage: 0,
    refundAmount: 0,
    cancellationState: 'Child (under five free)',
    refundState: 'Cancellation',
    lastUpdated: '07:00 Simulated',
  },
  {
    id: 'RC-P4-L2-001',
    passengerId: 'P4',
    legId: 'L2 (SIM-202)',
    fare: 1450,
    clerkage: 60,
    refundAmount: 1390,
    cancellationState: 'Pending cancellation',
    refundState: 'Cancellation',
    lastUpdated: '07:00 Simulated',
  },
  {
    id: 'RC-P5-L2-001',
    passengerId: 'P5',
    legId: 'L2 (SIM-202)',
    fare: 1450,
    clerkage: 60,
    refundAmount: 1390,
    cancellationState: 'Pending cancellation',
    refundState: 'Cancellation',
    lastUpdated: '07:00 Simulated',
  },
];

export const INITIAL_JOURNEY_PACK: JourneyPack = {
  officialVersion: 'pack-v1.0',
  lastSyncTime: '07:00 Simulated',
  currentPlan: 'Plan A (SIM-101 + SIM-202)',
  fallbackPlan: 'Plan B (SIM-303 via Central Junction)',
  meetingPoint: 'Central Junction (CJN) Platform 2 Waiting Lounge near Lift #1',
  expectedArrival: '17:30 (SIM-202)',
  contacts: [
    {
      name: 'Station Helpdesk CJN',
      role: 'Accessibility & Sahayak Assistant',
      phone: '+91-1800-111-CJN',
      note: 'Simulated fictional emergency assistance contact',
    },
    {
      name: 'Dr. A. Sharma',
      role: 'Station Medical Room CJN',
      phone: '+91-1800-MED-CJN',
      note: 'Step-free transit wheelchair sahayak pre-booked',
    },
  ],
  entitlements: [
    'Senior Citizen Lower Berth quota priority (P1)',
    'Companion escort privilege (P2)',
    'Child under 5 free travel berth-sharing (P3)',
    'Screen-reader audio assistance & tactile navigation (P4)',
  ],
  passengers: [
    { id: 'P1', label: 'P1 (Older Adult)', coach: 'B2', berth: '12', berthType: 'Lower', concession: 'Senior / Mobility', source: 'OFFICIAL', version: 'v1.0' },
    { id: 'P2', label: 'P2 (Caregiver)', coach: 'B2', berth: '11', berthType: 'Middle', concession: 'Escort', source: 'OFFICIAL', version: 'v1.0' },
    { id: 'P3', label: 'P3 (Child under 5)', coach: 'B2', berth: '14', berthType: 'Upper (Sharing)', concession: 'Child (Infant)', source: 'OFFICIAL', version: 'v1.0' },
    { id: 'P4', label: 'P4 (Screen-Reader User)', coach: 'B2', berth: '15', berthType: 'Side Lower', concession: 'Divyangjan / Audio', source: 'OFFICIAL', version: 'v1.0' },
    { id: 'P5', label: 'P5 (Flexible Adult)', coach: 'B2', berth: '16', berthType: 'Side Upper', concession: 'Standard Adult', source: 'OFFICIAL', version: 'v1.0' },
  ],
  localNotes: 'Need porter at Central Junction Platform 2 to transfer wheelchair & bags to Platform 9.',
  syncStatus: 'synced',
};

export const INITIAL_AUDIT_LOG: AuditEvent[] = [
  {
    id: 'EVT-001',
    at: '07:00',
    type: 'Scenario',
    description: 'Journey simulation initialized for 5 passengers across SIM-101 and SIM-202.',
    reason: 'Initial load with fixed scenario dataset (SCA -> CJN -> SCB).',
    ruleVersion: RULE_VERSION,
    planVersion: 'plan-v1.0',
  },
  {
    id: 'EVT-002',
    at: '07:00',
    type: 'Ranking',
    description: 'Initial itinerary evaluated under Balanced priority: Plan A ranks 1st (Score: 0.77).',
    reason: 'Connection feasible (+16 min margin); Leg 2 waitlist likelihood 38-55% (n=214).',
    ruleVersion: RULE_VERSION,
    planVersion: 'plan-v1.0',
  },
];
