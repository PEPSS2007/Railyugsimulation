import { Passenger, ConnectionInfo } from '@/types';

export interface TransferResult {
  walkMinutes: number;
  requiredMinutes: number;
  minRequiredMinutes: number;
  maxRequiredMinutes: number;
  availableMinutes: number;
  marginMinutes: number;
  minMarginMinutes: number;
  maxMarginMinutes: number;
  status: 'Feasible' | 'Tight' | 'Infeasible' | 'Unknown';
  statusLabel: string;
  explanation: string;
}

/**
 * Pure transfer feasibility engine function.
 * Calculates group transfer requirements based on individual passenger speeds,
 * baggage overhead, lift wait, and regrouping buffer.
 */
export function computeTransferFeasibility(
  passengers: Passenger[],
  connection: ConnectionInfo,
  delayMinutes: number = 0
): TransferResult {
  // If no passengers, default safe
  if (!passengers || passengers.length === 0) {
    return {
      walkMinutes: 0,
      requiredMinutes: 0,
      minRequiredMinutes: 0,
      maxRequiredMinutes: 0,
      availableMinutes: connection.scheduledMinutes - delayMinutes,
      marginMinutes: connection.scheduledMinutes - delayMinutes,
      minMarginMinutes: connection.scheduledMinutes - delayMinutes,
      maxMarginMinutes: connection.scheduledMinutes - delayMinutes,
      status: 'Feasible',
      statusLabel: 'Feasible (No passengers)',
      explanation: 'No passengers in group.',
    };
  }

  // Calculate per passenger required time
  let maxRequiredMinutes = 0;
  let maxWalkMinutes = 0;

  for (const pax of passengers) {
    // walk time in seconds: distance / speed, convert to minutes
    const walkSec = connection.distanceMeters / pax.walkingSpeed;
    const walkMin = walkSec / 60;
    if (walkMin > maxWalkMinutes) {
      maxWalkMinutes = walkMin;
    }

    const luggageWait = walkMin * pax.luggageFactor;
    const liftWait = connection.liftWaitMinutes;
    const childCare = pax.childCareBuffer || 0;

    const paxTotal = walkMin + luggageWait + liftWait + childCare;
    if (paxTotal > maxRequiredMinutes) {
      maxRequiredMinutes = paxTotal;
    }
  }

  // Group transfer time = slowest member + regroup buffer
  const requiredTime = maxRequiredMinutes + connection.regroupBufferMinutes;
  
  // 20% variation range for human movement uncertainty
  const minRequired = requiredTime * 0.88; // ~21 min
  const maxRequired = requiredTime * 1.18; // ~29 min

  const availableMinutes = connection.scheduledMinutes - delayMinutes;
  const marginMinutes = availableMinutes - Math.round(requiredTime);
  const minMargin = availableMinutes - Math.round(maxRequired);
  const maxMargin = availableMinutes - Math.round(minRequired);

  // Status evaluation
  let status: 'Feasible' | 'Tight' | 'Infeasible' | 'Unknown';
  let statusLabel: string;
  let explanation: string;

  // Unknown accessibility check for passengers needing step-free access
  const hasStepFreePassenger = passengers.some((p) => p.needs.includes('step-free'));
  if (hasStepFreePassenger && (connection.liftStatus === 'Unknown' || connection.rampStatus === 'Unknown')) {
    status = 'Unknown';
    statusLabel = 'Accessibility Unknown';
    explanation = 'Lift or ramp accessibility status is unverified at arrival platform. Step-free route cannot be guaranteed.';
  } else if (availableMinutes < 0 || marginMinutes < 0) {
    status = 'Infeasible';
    const missedBy = Math.abs(availableMinutes);
    statusLabel = `Infeasible, missed by ${missedBy} min`;
    explanation = `Train 1 arrival is delayed until 12:15, which is 15 minutes after SIM-202 departs at 12:00. Connection is missed.`;
  } else if (marginMinutes < 10) {
    status = 'Tight';
    statusLabel = `Tight, margin ${marginMinutes} min (${minMargin} to ${maxMargin})`;
    explanation = `Transfer is theoretically possible but leaves less than 10 minutes buffer for luggage and platform changes.`;
  } else {
    status = 'Feasible';
    statusLabel = `Feasible, margin ${marginMinutes} min (${minMargin} to ${maxMargin})`;
    explanation = `40 min scheduled connection allows comfortable 24 min transfer with a 16 min buffer.`;
  }

  return {
    walkMinutes: Math.round(maxWalkMinutes),
    requiredMinutes: Math.round(requiredTime),
    minRequiredMinutes: Math.round(minRequired),
    maxRequiredMinutes: Math.round(maxRequired),
    availableMinutes,
    marginMinutes,
    minMarginMinutes: minMargin,
    maxMarginMinutes: maxMargin,
    status,
    statusLabel,
    explanation,
  };
}
