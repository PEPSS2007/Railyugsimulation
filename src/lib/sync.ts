import { JourneyPack, AuditEvent } from '@/types';
import { RULE_VERSION } from '@/data/rules';

export interface SyncResult {
  updatedPack: JourneyPack;
  conflictSummary?: string;
  auditEvent: AuditEvent;
}

/**
 * Pure safe-sync engine for offline journey pack.
 * Newer official data always takes precedence; local user notes are preserved
 * and marked "Pending review" if conflicting with updated official arrangements.
 */
export function syncJourneyPack(
  currentPack: JourneyPack,
  clock: string,
  delayActive: boolean
): SyncResult {
  const newOfficialVersion = delayActive ? 'pack-v2.0-disrupted' : 'pack-v1.1-synced';
  const newLastSyncTime = `${clock} Simulated`;

  // If delay is active, official sync updates current plan to Plan B
  const updatedCurrentPlan = delayActive
    ? 'Plan B (SIM-303 from Central Junction at 13:10)'
    : currentPack.currentPlan;

  const updatedFallbackPlan = delayActive
    ? 'Plan C (SIM-505 from Central Junction at 13:40)'
    : currentPack.fallbackPlan;

  const updatedArrival = delayActive ? '18:50 (SIM-303)' : currentPack.expectedArrival;

  // Check if local notes have custom unsynced instructions
  const hasLocalEdits = currentPack.localNotes.trim().length > 0;
  const syncStatus = hasLocalEdits ? 'pending_review' : 'synced';
  const conflictSummary = hasLocalEdits
    ? 'New official timings and train re-route synchronized (v2.0). Your custom porter note was retained locally and marked "Pending review" to verify platform 9 porter availability.'
    : 'All journey pack data verified and up to date with official railway feed.';

  const updatedPack: JourneyPack = {
    ...currentPack,
    officialVersion: newOfficialVersion,
    lastSyncTime: newLastSyncTime,
    currentPlan: updatedCurrentPlan,
    fallbackPlan: updatedFallbackPlan,
    expectedArrival: updatedArrival,
    syncStatus,
  };

  const auditEvent: AuditEvent = {
    id: `EVT-SNC-${Date.now().toString(36)}`,
    at: clock,
    type: 'Sync',
    description: `Journey pack synchronized with official feed (Version ${newOfficialVersion}). Local notes preserved as ${syncStatus}.`,
    reason: 'Offline cache sync: Newer official data applied; local offline draft kept safely.',
    ruleVersion: RULE_VERSION,
  };

  return {
    updatedPack,
    conflictSummary,
    auditEvent,
  };
}
