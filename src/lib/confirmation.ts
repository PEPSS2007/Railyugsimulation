import { computeWilsonInterval, SYNTHETIC_WAITLIST_DATA } from '@/data/waitlistHistory';

export interface ConfirmationEstimate {
  trainNumber: string;
  travelClass: string;
  waitlistBand: string;
  pointEstimate: number; // 0 to 1
  minPercentage: number; // 0 to 100
  maxPercentage: number; // 0 to 100
  sampleSize: number;
  lowDataWarning: boolean;
  label: string;
  displayText: string;
}

/**
 * Pure waitlist confirmation estimator.
 * Uses synthetic historical outcomes and Wilson 95% confidence intervals.
 */
export function estimateWaitlistConfirmation(
  trainNumber: string,
  travelClass: string = '3A',
  waitlistBand: string = 'WL 10-20'
): ConfirmationEstimate {
  const lookupKey = `${trainNumber}-${travelClass}-${waitlistBand.replace(/\s+/g, '')}`;
  const record = SYNTHETIC_WAITLIST_DATA[lookupKey] || SYNTHETIC_WAITLIST_DATA['SIM-202-3A-WL14'];

  const wilson = computeWilsonInterval(record.confirmedCount, record.sampleSize);
  const minPct = Math.round(wilson.lower * 100);
  const maxPct = Math.round(wilson.upper * 100);
  const lowData = record.sampleSize < 30;

  return {
    trainNumber,
    travelClass,
    waitlistBand,
    pointEstimate: wilson.point,
    minPercentage: minPct,
    maxPercentage: maxPct,
    sampleSize: record.sampleSize,
    lowDataWarning: lowData,
    label: lowData ? 'Synthetic, low data warning' : 'Synthetic, not calibrated',
    displayText: `${minPct}% to ${maxPct}% likelihood (${record.sampleSize} synthetic records)`,
  };
}
