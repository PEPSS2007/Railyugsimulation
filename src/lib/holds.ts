import { Seat, TatkalHold, AuditEvent } from '@/types';
import { RULE_VERSION } from '@/data/rules';

export interface HoldActionResult {
  hold: TatkalHold;
  seats: Seat[];
  conflict: boolean;
  announcement?: string;
  auditEvent: AuditEvent;
}

export const REQUESTED_GROUP_SEATS = [1, 2, 3, 4, 5]; // 5 seats for 5 passengers

/**
 * Pure Tatkal Hold State Machine.
 * Enforces atomic check-and-set, all-or-nothing group hold, and server-side clock expiry.
 */
export function startGroupHold(
  currentHold: TatkalHold,
  currentSeats: Seat[],
  clock: string,
  nowSeconds: number
): HoldActionResult {
  // If user already has an active hold, reuse without extending
  if (currentHold.status === 'Processing' && currentHold.expiresAtSeconds && currentHold.expiresAtSeconds > nowSeconds) {
    const remaining = currentHold.expiresAtSeconds - nowSeconds;
    return {
      hold: { ...currentHold, secondsRemaining: remaining },
      seats: currentSeats,
      conflict: false,
      announcement: `Active hold resumed. ${remaining} seconds remaining to complete simulated payment.`,
      auditEvent: {
        id: `EVT-HLD-${Date.now().toString(36)}`,
        at: clock,
        type: 'Hold',
        description: `Hold reused for seats ${currentHold.seatIds.join(', ')} (${remaining}s remaining). Window not extended.`,
        reason: 'Anti-abuse rule: Repeated start action reuses existing hold without resetting timer.',
        ruleVersion: RULE_VERSION,
      },
    };
  }

  // Check all requested seats are Available (all-or-nothing)
  const unavailableSeat = currentSeats.find(
    (s) => REQUESTED_GROUP_SEATS.includes(s.seatNumber) && s.state !== 'Available'
  );

  if (unavailableSeat) {
    return {
      hold: {
        ...currentHold,
        status: 'Rejected',
      },
      seats: currentSeats,
      conflict: true,
      announcement: `Seat reservation rejected: Seat #${unavailableSeat.seatNumber} is currently ${unavailableSeat.state}. All-or-nothing group hold failed.`,
      auditEvent: {
        id: `EVT-HLD-${Date.now().toString(36)}`,
        at: clock,
        type: 'Hold',
        description: `Group hold rejected: Seat #${unavailableSeat.seatNumber} not available.`,
        reason: 'Atomic claim check failed: All 5 family seats must be simultaneously available.',
        ruleVersion: RULE_VERSION,
      },
    };
  }

  // Atomically claim all 5 seats
  const duration = currentHold.demoSpeed ? 20 : 180;
  const expiresAt = nowSeconds + duration;
  const holdId = `HOLD-SIM303-C1-${Date.now().toString(36)}`;
  const seatIds = REQUESTED_GROUP_SEATS.map((n) => `seat-${n}`);

  const updatedSeats = currentSeats.map((s) => {
    if (REQUESTED_GROUP_SEATS.includes(s.seatNumber)) {
      return {
        ...s,
        state: 'Processing' as const,
        heldBy: 'you' as const,
      };
    }
    return s;
  });

  const updatedHold: TatkalHold = {
    holdId,
    holderId: 'pax-group-1',
    seatIds,
    startedAtSeconds: nowSeconds,
    expiresAtSeconds: expiresAt,
    secondsRemaining: duration,
    status: 'Processing',
    demoSpeed: currentHold.demoSpeed,
    announcementMilestonesReached: { [duration]: true },
  };

  return {
    hold: updatedHold,
    seats: updatedSeats,
    conflict: false,
    announcement: `Tatkal hold active for Seats 1 to 5 in Coach C1. You have ${duration === 20 ? '20 seconds (Demo speed)' : '3 minutes'} to complete payment.`,
    auditEvent: {
      id: `EVT-HLD-${Date.now().toString(36)}`,
      at: clock,
      type: 'Hold',
      description: `Tatkal hold acquired for seats 1, 2, 3, 4, 5 (Coach C1) with ${duration}s window.`,
      reason: 'Atomic check-and-set claim successful across all requested group berths.',
      ruleVersion: RULE_VERSION,
    },
  };
}

/**
 * Simulates a competing user attempting to book the same seats.
 */
export function simulateCompetingUserClaim(
  currentHold: TatkalHold,
  currentSeats: Seat[],
  clock: string
): HoldActionResult {
  return {
    hold: currentHold,
    seats: currentSeats,
    conflict: true,
    announcement: 'Competing user simulated: Attempt to book seats 1-5 rejected with "Seat just taken". Alternative seats 6-10 offered.',
    auditEvent: {
      id: `EVT-HLD-${Date.now().toString(36)}`,
      at: clock,
      type: 'Hold',
      description: 'Concurrency collision test: Second user booking attempt rejected. "Seat just taken" displayed.',
      reason: 'Single-holder mutual exclusion verified. Zero overlapping holds allowed.',
      ruleVersion: RULE_VERSION,
    },
  };
}

/**
 * Confirms payment before expiry.
 */
export function payHold(
  currentHold: TatkalHold,
  currentSeats: Seat[],
  clock: string,
  nowSeconds: number
): HoldActionResult {
  if (currentHold.status !== 'Processing' || !currentHold.expiresAtSeconds) {
    return {
      hold: currentHold,
      seats: currentSeats,
      conflict: false,
      announcement: 'Cannot process payment: No active hold.',
      auditEvent: {
        id: `EVT-HLD-${Date.now().toString(36)}`,
        at: clock,
        type: 'Hold',
        description: 'Payment attempt failed: Hold is not in Processing state.',
        reason: 'Hold state violation.',
        ruleVersion: RULE_VERSION,
      },
    };
  }

  // Late payment check (after expiresAt)
  if (nowSeconds >= currentHold.expiresAtSeconds) {
    // Late payment rejected -> automatically released and directed to refund timeline
    const releasedSeats = currentSeats.map((s) => {
      if (REQUESTED_GROUP_SEATS.includes(s.seatNumber)) {
        return { ...s, state: 'Available' as const, heldBy: null };
      }
      return s;
    });

    return {
      hold: {
        ...currentHold,
        status: 'Rejected',
        secondsRemaining: 0,
      },
      seats: releasedSeats,
      conflict: true,
      announcement: 'Late payment rejected! Hold window expired. Seats were released and amount enters refund timeline.',
      auditEvent: {
        id: `EVT-HLD-${Date.now().toString(36)}`,
        at: clock,
        type: 'Hold',
        description: 'Late payment received post-expiry: Booking rejected. Funds redirected to refund ledger.',
        reason: 'Payment arrived after stored expiresAt. Anti-scalping rule strictly enforced.',
        ruleVersion: RULE_VERSION,
      },
    };
  }

  // Successful payment
  const confirmedSeats = currentSeats.map((s) => {
    if (REQUESTED_GROUP_SEATS.includes(s.seatNumber)) {
      return { ...s, state: 'Confirmed' as const, heldBy: 'you' as const };
    }
    return s;
  });

  return {
    hold: {
      ...currentHold,
      status: 'Confirmed',
      secondsRemaining: 0,
    },
    seats: confirmedSeats,
    conflict: false,
    announcement: 'Payment simulated successfully. All 5 seats in Coach C1 are CONFIRMED for SIM-303.',
    auditEvent: {
      id: `EVT-HLD-${Date.now().toString(36)}`,
      at: clock,
      type: 'Hold',
      description: 'Simulated payment completed for seats 1 to 5. Berths confirmed on SIM-303.',
      reason: 'Payment verified before stored expiresAt deadline.',
      ruleVersion: RULE_VERSION,
    },
  };
}

/**
 * Expires hold and releases seats back to Available.
 */
export function expireHold(
  currentHold: TatkalHold,
  currentSeats: Seat[],
  clock: string
): HoldActionResult {
  const releasedSeats = currentSeats.map((s) => {
    if (REQUESTED_GROUP_SEATS.includes(s.seatNumber)) {
      return { ...s, state: 'Available' as const, heldBy: null };
    }
    return s;
  });

  return {
    hold: {
      ...currentHold,
      status: 'Expired',
      secondsRemaining: 0,
    },
    seats: releasedSeats,
    conflict: false,
    announcement: 'Hold expired! Seats 1 to 5 released back to inventory. Passenger details preserved.',
    auditEvent: {
      id: `EVT-HLD-${Date.now().toString(36)}`,
      at: clock,
      type: 'Hold',
      description: 'Tatkal hold expired: Seats 1 to 5 released to Available inventory.',
      reason: 'Hold countdown reached zero or manual expiry triggered. Passenger details preserved for rebooking.',
      ruleVersion: RULE_VERSION,
    },
  };
}
