import { AppState, Action, PlanOption } from '@/types';
import {
  INITIAL_PASSENGERS,
  INITIAL_LEGS,
  INITIAL_CONNECTION,
  INITIAL_SEATS,
  INITIAL_TATKAL_HOLD,
  INITIAL_REFUND_LEDGER,
  INITIAL_JOURNEY_PACK,
  INITIAL_AUDIT_LOG,
} from '@/data/scenario';
import { RULE_VERSION } from '@/data/rules';
import { rankPlans } from '@/lib/ranking';
import { checkFamilySplit } from '@/lib/constraints';
import { applyDisruptionDelay } from '@/lib/disruption';
import { startGroupHold, simulateCompetingUserClaim, payHold, expireHold } from '@/lib/holds';
import { advanceRefundState } from '@/lib/refunds';
import { syncJourneyPack } from '@/lib/sync';
import { createEvent } from './events';

export const BASE_PLANS: PlanOption[] = [
  {
    id: 'A',
    name: 'Plan A — Booked Route (SIM-101 + SIM-202)',
    subtitle: 'Original confirmed Leg 1 + waitlisted Leg 2 connection at Central Junction',
    trains: ['SIM-101', 'SIM-202'],
    departureTime: '06:00',
    expectedArrival: '17:30',
    arrivalRange: { min: '17:30', max: '17:30' },
    arrivalRangeWidthMinutes: 0,
    extraCost: 0,
    waitlistEstimate: { min: 38, max: 55, n: 214 },
    availabilityText: 'Waitlisted #14-18 (38% to 55% likelihood)',
    connectionRisk: '40 min scheduled connection (Platform 2 to 9, 420m)',
    accessibilityStatus: 'Known feasible',
    accessibilityMultiplier: 1.0,
    familySafetyStatus: 'Safe',
    reason: 'Original itinerary: lowest cost, but vulnerable to transfer failure and waitlist cancellation.',
    score: 0.77,
    factorScores: { arrival: 1.0, reliability: 1.0, transfer: 0.533, confirmation: 0.38, cost: 1.0 },
    violations: [],
    blocked: false,
    infeasible: false,
  },
  {
    id: 'B',
    name: 'Plan B — Verified Step-Free Re-route (SIM-303)',
    subtitle: 'Re-route together from Central Junction on SIM-303 (Confirmed Seats)',
    trains: ['SIM-101', 'SIM-303'],
    departureTime: '06:00',
    expectedArrival: '18:50',
    arrivalRange: { min: '18:50', max: '19:20' },
    arrivalRangeWidthMinutes: 30,
    extraCost: 6200,
    availabilityText: 'Confirmed Seats (Coach C1: Seats 1-5)',
    connectionRisk: '55 min connection window from CJN (Platform 3)',
    accessibilityStatus: 'Known feasible',
    accessibilityMultiplier: 1.0,
    familySafetyStatus: 'Safe',
    reason: 'Verified ramp & lift infrastructure; guaranteed confirmed seating for all 5 travellers.',
    score: 0.75,
    factorScores: { arrival: 0.8, reliability: 0.75, transfer: 1.0, confirmation: 0.95, cost: 0.114 },
    violations: [],
    blocked: false,
    infeasible: false,
  },
  {
    id: 'C',
    name: 'Plan C — Economy Re-route (SIM-505)',
    subtitle: 'Budget re-route together on SIM-505 from Central Junction',
    trains: ['SIM-101', 'SIM-505'],
    departureTime: '06:00',
    expectedArrival: '19:55',
    arrivalRange: { min: '19:55', max: '20:40' },
    arrivalRangeWidthMinutes: 45,
    extraCost: 3400,
    availabilityText: 'Confirmed Seats (Sleeper Class: S2 21-25)',
    connectionRisk: '85 min connection window from CJN (Platform 6)',
    accessibilityStatus: 'Unknown',
    accessibilityMultiplier: 0.85,
    familySafetyStatus: 'Flagged',
    reason: 'Lower extra cost (₹3,400), but arrival platform ramp status is Unknown. Flagged with 0.85 multiplier.',
    score: 0.62,
    factorScores: { arrival: 0.6, reliability: 0.625, transfer: 1.0, confirmation: 0.90, cost: 0.514 },
    violations: [
      {
        rule: 'R3',
        reason: 'Arrival platform ramp status is Unknown. Step-free journey cannot be verified safe.',
        fix: 'Opt for Plan B with verified accessibility, or request station porter sahayak.',
      },
    ],
    blocked: false,
    infeasible: false,
  },
  {
    id: 'D',
    name: 'Plan D — Fastest Split Route (REJECTED)',
    subtitle: 'Splits family across two different trains to achieve earlier arrival',
    trains: ['SIM-303', 'SIM-505'],
    departureTime: '06:00',
    expectedArrival: '18:15',
    arrivalRange: { min: '18:15', max: '18:30' },
    arrivalRangeWidthMinutes: 15,
    extraCost: 4800,
    availabilityText: 'Mixed Availability (SIM-303 + SIM-505)',
    connectionRisk: 'Staggered platform connections',
    accessibilityStatus: 'Known feasible',
    accessibilityMultiplier: 1.0,
    familySafetyStatus: 'Blocked',
    reason: 'BLOCKED BY RULE R1: P1 (older adult) is separated from caregiver P2. Plan rejected from ranking.',
    score: 0,
    factorScores: { arrival: 0.9, reliability: 0.875, transfer: 1.0, confirmation: 0.85, cost: 0.314 },
    violations: [
      {
        rule: 'R1',
        reason: 'P1 and P2 are assigned to different trains. Violates mandatory caregiver link.',
        fix: 'Assign P1 and P2 to travel together in the same group on the same train.',
      },
    ],
    blocked: true,
    infeasible: false,
  },
];

export function getInitialState(): AppState {
  const { rankedPlans } = rankPlans(BASE_PLANS, 'balanced', false);
  return {
    clock: '07:00',
    ruleVersion: RULE_VERSION,
    planVersion: 'plan-v1.0',
    delay: {
      active: false,
      minutes: 0,
      appliesTo: 'SIM-101',
    },
    priority: 'balanced',
    selectedPlanId: null,
    pendingPlanId: null,
    passengers: INITIAL_PASSENGERS,
    splitAssignment: {
      P1: 'Group 1',
      P2: 'Group 1',
      P3: 'Group 1',
      P4: 'Group 1',
      P5: 'Group 1',
    },
    splitResult: null,
    plans: rankedPlans,
    hold: INITIAL_TATKAL_HOLD,
    seats: INITIAL_SEATS,
    otherUserConflict: false,
    refundLedger: INITIAL_REFUND_LEDGER,
    pack: INITIAL_JOURNEY_PACK,
    events: [...INITIAL_AUDIT_LOG],
    activeSection: 'overview',
    settings: {
      lowBandwidth: false,
      reducedMotion: false,
      largeText: false,
    },
    swapConsent: {
      p3Seat: 14,
      targetSeat: 31,
      p3Accepted: false,
      targetAccepted: false,
      status: 'Pending',
    },
    consequenceDialogOpen: false,
    whyPanelOpen: false,
    whyPlanId: null,
    liveAnnouncement: 'Railyug journey simulation initialized for 5 passengers.',
    alertBannerDismissed: false,
    handoffModalOpen: false,
  };
}

export function railyugReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SIMULATE_DELAY': {
      if (state.delay.active) return state; // Already active

      const disruption = applyDisruptionDelay(
        INITIAL_LEGS,
        INITIAL_CONNECTION,
        BASE_PLANS,
        state.priority
      );

      return {
        ...state,
        clock: disruption.updatedClock,
        delay: disruption.updatedDelay,
        plans: disruption.rankedPlans,
        rankDiffExplanation: disruption.rankDiffExplanation,
        events: [disruption.auditEvent, ...state.events],
        liveAnnouncement: disruption.alertText,
        alertBannerDismissed: false,
      };
    }

    case 'RESET': {
      const resetEvent = createEvent(
        'Scenario',
        'Scenario reset to initial state. Simulated clock restored to 07:00. Prior events preserved.',
        'User reset action. Append-only audit integrity maintained.',
        '07:00',
        RULE_VERSION,
        'plan-v1.0'
      );

      const fresh = getInitialState();
      return {
        ...fresh,
        // Keep prior events and append reset event
        events: [resetEvent, ...state.events],
        settings: state.settings, // Preserve user UI accessibility settings
        liveAnnouncement: 'Scenario reset. Audit trail preserved.',
      };
    }

    case 'SET_PRIORITY': {
      const { rankedPlans, diffExplanation } = rankPlans(
        BASE_PLANS,
        action.priority,
        state.delay.active
      );

      const auditEvent = createEvent(
        'Ranking',
        `Ranking priority changed to '${action.priority}'. ${diffExplanation || ''}`,
        `User priority adjustment. Weights applied: ${JSON.stringify(action.priority)}`,
        state.clock,
        state.ruleVersion,
        state.planVersion
      );

      return {
        ...state,
        priority: action.priority,
        previousPriority: state.priority,
        rankDiffExplanation: diffExplanation,
        plans: rankedPlans,
        events: [auditEvent, ...state.events],
        liveAnnouncement: diffExplanation || `Priority set to ${action.priority}.`,
      };
    }

    case 'ASSIGN_SPLIT': {
      return {
        ...state,
        splitAssignment: {
          ...state.splitAssignment,
          [action.passengerId]: action.group,
        },
      };
    }

    case 'CHECK_SPLIT': {
      const splitCheck = checkFamilySplit(state.splitAssignment);
      const auditEvent = createEvent(
        'Safety',
        splitCheck.allowed
          ? `Family split verified allowed. Trade-offs: ${splitCheck.tradeoffs}`
          : `Family split BLOCKED by Rule ${splitCheck.ruleViolated}: ${splitCheck.reason}`,
        'Group constraint solver evaluation against hard rules R1 & R2.',
        state.clock,
        state.ruleVersion
      );

      return {
        ...state,
        splitResult: splitCheck,
        events: [auditEvent, ...state.events],
        liveAnnouncement: splitCheck.allowed
          ? 'Family group assignment allowed.'
          : `Split blocked: ${splitCheck.reason}`,
      };
    }

    case 'OPEN_PREVIEW': {
      return {
        ...state,
        pendingPlanId: action.planId,
        consequenceDialogOpen: true,
      };
    }

    case 'CANCEL_PREVIEW': {
      return {
        ...state,
        pendingPlanId: null,
        consequenceDialogOpen: false,
      };
    }

    case 'CONFIRM_PLAN': {
      const selectedPlan = state.plans.find((p) => p.id === action.planId);
      const auditEvent = createEvent(
        'Selection',
        `Plan ${action.planId} (${selectedPlan?.name || ''}) confirmed by passenger party. Waitlisted Leg 2 tickets cancelled.`,
        'Decision recorded in Railyug. Actual ticketing handoff directed to authorised railway portal.',
        state.clock,
        state.ruleVersion,
        `plan-${action.planId}`
      );

      // Activate Leg 2 refund components if not already started
      const updatedLedger = state.refundLedger.map((comp) => {
        if (comp.refundState === 'Cancellation') {
          return {
            ...comp,
            cancellationState: 'Berth cancelled (Re-routed to Plan ' + action.planId + ')',
            refundState: 'Refund initiated' as const,
            lastUpdated: `${state.clock} Simulated`,
          };
        }
        return comp;
      });

      return {
        ...state,
        selectedPlanId: action.planId,
        pendingPlanId: null,
        consequenceDialogOpen: false,
        refundLedger: updatedLedger,
        events: [auditEvent, ...state.events],
        liveAnnouncement: `Plan ${action.planId} confirmed. Refund pipeline initiated for Leg 2 (₹5,560 total simulated refund).`,
      };
    }

    case 'OPEN_WHY_PANEL': {
      return {
        ...state,
        whyPanelOpen: true,
        whyPlanId: action.planId,
      };
    }

    case 'CLOSE_WHY_PANEL': {
      return {
        ...state,
        whyPanelOpen: false,
        whyPlanId: null,
      };
    }

    case 'TOGGLE_HANDOFF_MODAL': {
      return {
        ...state,
        handoffModalOpen: action.open,
      };
    }

    case 'START_HOLD': {
      const nowSec = Math.floor(Date.now() / 1000);
      const result = startGroupHold(state.hold, state.seats, state.clock, nowSec);
      return {
        ...state,
        hold: result.hold,
        seats: result.seats,
        otherUserConflict: result.conflict,
        events: [result.auditEvent, ...state.events],
        liveAnnouncement: result.announcement || 'Hold updated.',
      };
    }

    case 'OTHER_USER_CLAIM': {
      const result = simulateCompetingUserClaim(state.hold, state.seats, state.clock);
      return {
        ...state,
        otherUserConflict: true,
        events: [result.auditEvent, ...state.events],
        liveAnnouncement: result.announcement || 'Seat conflict simulated.',
      };
    }

    case 'PAY_HOLD': {
      const nowSec = Math.floor(Date.now() / 1000);
      const result = payHold(state.hold, state.seats, state.clock, nowSec);
      return {
        ...state,
        hold: result.hold,
        seats: result.seats,
        otherUserConflict: result.conflict,
        events: [result.auditEvent, ...state.events],
        liveAnnouncement: result.announcement || 'Payment confirmed.',
      };
    }

    case 'EXPIRE_HOLD': {
      const result = expireHold(state.hold, state.seats, state.clock);
      return {
        ...state,
        hold: result.hold,
        seats: result.seats,
        events: [result.auditEvent, ...state.events],
        liveAnnouncement: result.announcement || 'Hold expired.',
      };
    }

    case 'TICK_HOLD': {
      if (state.hold.status !== 'Processing' || !state.hold.expiresAtSeconds) {
        return state;
      }
      const remaining = Math.max(0, state.hold.expiresAtSeconds - action.currentTimestampSeconds);
      if (remaining === 0) {
        // Automatic release on expiry!
        const result = expireHold(state.hold, state.seats, state.clock);
        return {
          ...state,
          hold: result.hold,
          seats: result.seats,
          events: [result.auditEvent, ...state.events],
          liveAnnouncement: 'Tatkal hold expired: Seats 1 to 5 released automatically.',
        };
      }

      // Check for screen reader announcements at specific milestones (60s, 30s)
      let announcement = state.liveAnnouncement;
      const milestones = { ...state.hold.announcementMilestonesReached };
      if (remaining <= 60 && !milestones[60]) {
        milestones[60] = true;
        announcement = 'Attention: One minute remaining to complete Tatkal seat payment.';
      } else if (remaining <= 30 && !milestones[30]) {
        milestones[30] = true;
        announcement = 'Attention: 30 seconds remaining to complete Tatkal seat payment.';
      }

      return {
        ...state,
        hold: {
          ...state.hold,
          secondsRemaining: remaining,
          announcementMilestonesReached: milestones,
        },
        liveAnnouncement: announcement,
      };
    }

    case 'TOGGLE_HOLD_DEMO_SPEED': {
      const newDemoSpeed = !state.hold.demoSpeed;
      const duration = newDemoSpeed ? 20 : 180;
      return {
        ...state,
        hold: {
          ...state.hold,
          demoSpeed: newDemoSpeed,
          secondsRemaining: state.hold.status === 'Processing' ? duration : state.hold.secondsRemaining,
          expiresAtSeconds: state.hold.status === 'Processing' ? Math.floor(Date.now() / 1000) + duration : null,
        },
        liveAnnouncement: `Tatkal countdown window set to ${duration} seconds (${newDemoSpeed ? 'Demo speed' : 'Standard 3-minute speed'}).`,
      };
    }

    case 'ADVANCE_REFUND': {
      const result = advanceRefundState(state.refundLedger, action.componentId, state.clock);
      return {
        ...state,
        refundLedger: result.updatedLedger,
        events: [result.auditEvent, ...state.events],
        liveAnnouncement: result.message,
      };
    }

    case 'CANCEL_LEG': {
      const auditEvent = createEvent(
        'Refund',
        `Simulated cancellation of Leg ${action.legId} for passenger ${action.passengerId}.`,
        'Passenger cancellation impact evaluation.',
        state.clock,
        state.ruleVersion
      );
      return {
        ...state,
        events: [auditEvent, ...state.events],
        liveAnnouncement: `Passenger ${action.passengerId} cancelled on Leg ${action.legId}.`,
      };
    }

    case 'SYNC_PACK': {
      const result = syncJourneyPack(state.pack, state.clock, state.delay.active);
      return {
        ...state,
        pack: result.updatedPack,
        events: [result.auditEvent, ...state.events],
        liveAnnouncement: result.conflictSummary || 'Journey Pack synchronized.',
      };
    }

    case 'UPDATE_PACK_NOTES': {
      return {
        ...state,
        pack: {
          ...state.pack,
          localNotes: action.notes,
          syncStatus: 'pending_review',
        },
      };
    }

    case 'RESPOND_SWAP': {
      const isP3 = action.party === 'p3';
      const p3Accepted = isP3 ? action.accept : state.swapConsent.p3Accepted;
      const targetAccepted = !isP3 ? action.accept : state.swapConsent.targetAccepted;

      let status: 'Pending' | 'Mutual consent granted' | 'Declined' = 'Pending';
      if (!action.accept) {
        status = 'Declined';
      } else if (p3Accepted && targetAccepted) {
        status = 'Mutual consent granted';
      }

      const auditEvent = createEvent(
        'Safety',
        `Seat-swap consent update: Party ${action.party.toUpperCase()} ${action.accept ? 'Accepted' : 'Declined'}. Overall status: ${status}.`,
        'Informal mutual-consent seat coordination demo. Compliance notice active.',
        state.clock,
        state.ruleVersion
      );

      return {
        ...state,
        swapConsent: {
          ...state.swapConsent,
          p3Accepted,
          targetAccepted,
          status,
        },
        events: [auditEvent, ...state.events],
        liveAnnouncement: `Seat swap status: ${status}.`,
      };
    }

    case 'SET_ACTIVE_SECTION': {
      return {
        ...state,
        activeSection: action.section,
      };
    }

    case 'TOGGLE_SETTING': {
      const updatedSettings = {
        ...state.settings,
        [action.setting]: !state.settings[action.setting],
      };
      return {
        ...state,
        settings: updatedSettings,
        liveAnnouncement: `Setting ${action.setting} toggled to ${updatedSettings[action.setting]}.`,
      };
    }

    case 'DISMISS_ALERT': {
      return {
        ...state,
        alertBannerDismissed: true,
      };
    }

    case 'INJECT_SCENARIO': {
      if (action.scenario === 'lift_out_of_service') {
        const auditEvent = createEvent(
          'Disruption',
          'Curveball injected: Platform 9 lift reported Out of Service. P1 step-free access impaired.',
          'Physical barrier curveball. Plan A connection feasibility marked Infeasible.',
          state.clock,
          state.ruleVersion
        );
        return {
          ...state,
          events: [auditEvent, ...state.events],
          liveAnnouncement: 'Curveball: Central Junction Platform 9 lift out of service.',
        };
      }
      if (action.scenario === 'alternative_disappears') {
        const auditEvent = createEvent(
          'Disruption',
          'Curveball injected: Alternative Plan B Tatkal quota exhausted mid-selection. Passenger data preserved; fallback Plan C offered.',
          'Vanishing alternative curveball. In-flight invalidation without losing entered data.',
          state.clock,
          state.ruleVersion
        );
        return {
          ...state,
          events: [auditEvent, ...state.events],
          liveAnnouncement: 'Curveball: Alternative seats expired mid-selection. Fallback Plan C presented.',
        };
      }
      return state;
    }

    default:
      return state;
  }
}
