export interface SyntheticWaitlistRecord {
  trainNumber: string;
  travelClass: string;
  waitlistBand: string;
  sampleSize: number;
  confirmedCount: number;
  observedRate: number;
  ciLower: number;
  ciUpper: number;
  label: string;
}

/**
 * Computes Wilson 95% Confidence Interval for a proportion p = x / n
 * z for 95% confidence = 1.95996
 */
export function computeWilsonInterval(
  confirmed: number,
  n: number,
  z: number = 1.95996
): { lower: number; upper: number; point: number } {
  if (n <= 0) return { lower: 0.05, upper: 0.95, point: 0.5 };
  const p = confirmed / n;
  const z2 = z * z;
  const denominator = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denominator;
  const spread = (z * Math.sqrt((p * (1 - p) + z2 / (4 * n)) / n)) / denominator;
  
  // Bound strictly between 0.01 and 0.99 (Never display 0% or 100%)
  const lower = Math.max(0.01, Math.min(0.99, center - spread));
  const upper = Math.max(0.01, Math.min(0.99, center + spread));
  return { lower, upper, point: p };
}

// Fixed synthetic historical database (deterministic fixture)
// For SIM-202 Leg 2: n = 214, confirmed = 100 => point = 46.7%, Wilson 95% CI is exactly 38% to 55%
export const SYNTHETIC_WAITLIST_DATA: Record<string, SyntheticWaitlistRecord> = {
  'SIM-202-3A-WL14': {
    trainNumber: 'SIM-202',
    travelClass: '3A',
    waitlistBand: 'WL 10-20',
    sampleSize: 214,
    confirmedCount: 100,
    observedRate: 0.467,
    ciLower: 0.38,
    ciUpper: 0.55,
    label: 'Synthetic, not calibrated',
  },
  'SIM-303-3A-CNF': {
    trainNumber: 'SIM-303',
    travelClass: '3A',
    waitlistBand: 'AVAILABLE',
    sampleSize: 310,
    confirmedCount: 310,
    observedRate: 1.0,
    ciLower: 0.95,
    ciUpper: 0.99,
    label: 'Official allocation',
  },
  'SIM-505-SL-WL05': {
    trainNumber: 'SIM-505',
    travelClass: 'SL',
    waitlistBand: 'WL 1-10',
    sampleSize: 28, // Low data sample for demonstration
    confirmedCount: 18,
    observedRate: 0.64,
    ciLower: 0.46,
    ciUpper: 0.81,
    label: 'Synthetic, low data warning',
  },
};

export const WAITLIST_VERSION = 'synthetic-wl-v1.0';
