import { AuditEvent } from '@/types';
import { RULE_VERSION } from '@/data/rules';

let eventCounter = 100;

export function createEvent(
  type: AuditEvent['type'],
  description: string,
  reason: string,
  at: string,
  ruleVersion: string = RULE_VERSION,
  planVersion: string = 'plan-v1.0'
): AuditEvent {
  eventCounter += 1;
  return {
    id: `EVT-${eventCounter}`,
    at,
    type,
    description,
    reason,
    ruleVersion,
    planVersion,
  };
}
