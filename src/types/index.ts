export type SourceBadgeType = 'OFFICIAL' | 'CROWD' | 'PREDICTED';

export interface SourceBadgeInfo {
  type: SourceBadgeType;
  text: string;
  reportCount?: number;
  range?: string;
}

export type PassengerId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

export interface Passenger {
  id: PassengerId;
  label: string;
  role: string;
  needs: string;
  linkedPassengerId?: PassengerId;
  accessibilityStatus: 'Known' | 'Partly known' | 'Unknown';
  walkingSpeed: number; // m/s
  luggageFactor: number;
  childCareBuffer: number; // min
  coachBerth: {
    leg1: string;
    leg2: string;
    leg2Status: string;
  };
}

export type LegStatus = 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';

export interface Leg {
  id: string;
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  originalArrivalTime: string;
  delayMinutes: number;
  status: LegStatus;
  fare: number;
  childFare: number;
  waitlistEstimate?: {
    min: number;
    max: number;
    n: number;
    note: string;
  };
}

export interface ConnectionInfo {
  junction: string;
  scheduledMinutes: number;
  arrivalPlatform: number;
  departurePlatform: number;
  distanceMeters: number;
  liftWaitMinutes: number;
  stairsPenaltyMinutes: number;
  regroupBufferMinutes: number;
  liftStatus: 'Operational' | 'Out of service' | 'Unknown';
  rampStatus: 'Known feasible' | 'Unknown' | 'Infeasible';
}

export type PlanId = 'A' | 'B' | 'C' | 'D';
export type PlanStatus = 'Safe' | 'Flagged' | 'Blocked';
export type PriorityPreset = 'balanced' | 'cost' | 'fastest' | 'risk';

export interface PlanFactorScores {
  arrival: number;
  reliability: number;
  transfer: number;
  confirmation: number;
  cost: number;
}

export interface PlanViolation {
  rule: string;
  reason: string;
  fix: string;
}

export interface PlanOption {
  id: PlanId;
  name: string;
  subtitle: string;
  trains: string[];
  departureTime: string;
  expectedArrival: string;
  arrivalRange: { min: string; max: string };
  arrivalRangeWidthMinutes: number;
  extraCost: number;
  waitlistEstimate?: { min: number; max: number; n: number };
  availabilityText: string;
  connectionRisk: string;
  accessibilityStatus: 'Known feasible' | 'Unknown' | 'Infeasible';
  accessibilityMultiplier: number;
  familySafetyStatus: PlanStatus;
  reason: string;
  score: number;
  factorScores: PlanFactorScores;
  violations: PlanViolation[];
  blocked: boolean;
  infeasible: boolean;
  rank?: number;
}

export type SeatState = 'Available' | 'Processing' | 'Yours' | 'Confirmed';

export interface Seat {
  id: string;
  seatNumber: number;
  berthType: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper';
  state: SeatState;
  heldBy?: 'you' | 'other_user' | null;
}

export interface TatkalHold {
  holdId: string | null;
  holderId: string | null;
  seatIds: string[];
  startedAtSeconds: number | null;
  expiresAtSeconds: number | null;
  secondsRemaining: number;
  status: 'Inactive' | 'Processing' | 'Confirmed' | 'Expired' | 'Rejected';
  demoSpeed: boolean; // 20s if true, 180s if false
  announcementMilestonesReached: { [sec: number]: boolean };
}

export type RefundState = 'Cancellation' | 'Refund initiated' | 'Refund processing' | 'Final credit';

export interface RefundComponent {
  id: string; // e.g. RC-P1-L2-001
  passengerId: PassengerId;
  legId: string;
  fare: number;
  clerkage: number;
  refundAmount: number;
  cancellationState: string;
  refundState: RefundState;
  lastUpdated: string;
}

export interface AuditEvent {
  id: string;
  at: string; // simulated clock e.g. "07:00", "10:30"
  type: 'Scenario' | 'Disruption' | 'Ranking' | 'Safety' | 'Selection' | 'Hold' | 'Refund' | 'Sync';
  description: string;
  reason: string;
  ruleVersion: string;
  planVersion?: string;
}

export interface JourneyPackContact {
  name: string;
  role: string;
  phone: string;
  note: string;
}

export interface JourneyPack {
  officialVersion: string;
  lastSyncTime: string;
  currentPlan: string;
  fallbackPlan: string;
  meetingPoint: string;
  expectedArrival: string;
  contacts: JourneyPackContact[];
  entitlements: string[];
  passengers: Array<{
    id: PassengerId;
    label: string;
    coach: string;
    berth: string;
    berthType: string;
    concession: string;
    source: SourceBadgeType;
    version: string;
  }>;
  localNotes: string;
  syncStatus: 'synced' | 'pending_review' | 'conflict_resolved';
}

export interface AppState {
  clock: string;
  ruleVersion: string;
  planVersion: string;
  delay: {
    active: boolean;
    minutes: number;
    appliesTo: string;
  };
  priority: PriorityPreset;
  previousPriority?: PriorityPreset;
  rankDiffExplanation?: string;
  selectedPlanId: PlanId | null;
  pendingPlanId: PlanId | null;
  passengers: Passenger[];
  splitAssignment: Record<PassengerId, 'Group 1' | 'Group 2'>;
  splitResult: {
    allowed: boolean;
    ruleViolated?: string;
    reason?: string;
    fix?: string;
    tradeoffs?: string;
    group1Passengers?: PassengerId[];
    group2Passengers?: PassengerId[];
  } | null;
  plans: PlanOption[];
  hold: TatkalHold;
  seats: Seat[];
  otherUserConflict: boolean;
  refundLedger: RefundComponent[];
  pack: JourneyPack;
  events: AuditEvent[];
  activeSection: string;
  settings: {
    lowBandwidth: boolean;
    reducedMotion: boolean;
    largeText: boolean;
  };
  swapConsent: {
    p3Seat: number;
    targetSeat: number;
    p3Accepted: boolean;
    targetAccepted: boolean;
    status: 'Pending' | 'Mutual consent granted' | 'Declined';
  };
  consequenceDialogOpen: boolean;
  whyPanelOpen: boolean;
  whyPlanId: PlanId | null;
  liveAnnouncement: string;
  alertBannerDismissed: boolean;
  handoffModalOpen: boolean;
}

export type Action =
  | { type: 'SIMULATE_DELAY' }
  | { type: 'RESET' }
  | { type: 'SET_PRIORITY'; priority: PriorityPreset }
  | { type: 'ASSIGN_SPLIT'; passengerId: PassengerId; group: 'Group 1' | 'Group 2' }
  | { type: 'CHECK_SPLIT' }
  | { type: 'OPEN_PREVIEW'; planId: PlanId }
  | { type: 'CANCEL_PREVIEW' }
  | { type: 'CONFIRM_PLAN'; planId: PlanId }
  | { type: 'OPEN_WHY_PANEL'; planId: PlanId }
  | { type: 'CLOSE_WHY_PANEL' }
  | { type: 'TOGGLE_HANDOFF_MODAL'; open: boolean }
  | { type: 'START_HOLD' }
  | { type: 'OTHER_USER_CLAIM' }
  | { type: 'PAY_HOLD' }
  | { type: 'EXPIRE_HOLD' }
  | { type: 'TICK_HOLD'; currentTimestampSeconds: number }
  | { type: 'TOGGLE_HOLD_DEMO_SPEED' }
  | { type: 'ADVANCE_REFUND'; componentId: string }
  | { type: 'CANCEL_LEG'; passengerId: PassengerId; legId: string }
  | { type: 'SYNC_PACK' }
  | { type: 'UPDATE_PACK_NOTES'; notes: string }
  | { type: 'RESPOND_SWAP'; party: 'p3' | 'target'; accept: boolean }
  | { type: 'SET_ACTIVE_SECTION'; section: string }
  | { type: 'TOGGLE_SETTING'; setting: 'lowBandwidth' | 'reducedMotion' | 'largeText' }
  | { type: 'DISMISS_ALERT' }
  | { type: 'INJECT_SCENARIO'; scenario: 'lift_out_of_service' | 'alternative_disappears' };
