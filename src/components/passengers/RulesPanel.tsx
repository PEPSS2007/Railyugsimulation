'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function RulesPanel() {
  const { state } = useRailyug();

  // Evaluate live status of rules in current state
  const r1Satisfied = state.splitAssignment['P1'] === state.splitAssignment['P2'];
  const p3Group = state.splitAssignment['P3'];
  const r2Satisfied =
    p3Group === state.splitAssignment['P2'] ||
    p3Group === state.splitAssignment['P4'] ||
    p3Group === state.splitAssignment['P5'];

  return (
    <section aria-labelledby="rules-heading" className="railyug-card p-4 space-y-3 bg-[#FBF8F4] border-[#E7E1EA]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#1B0F4A]" aria-hidden="true" />
          <h2 id="rules-heading" className="font-heading text-base font-bold text-[#1B0F4A]">
            Active Group &amp; Safety Hard Constraints
          </h2>
        </div>
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white text-[#1B0F4A] border border-[#E7E1EA]">
          {state.ruleVersion}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* R1 */}
        <div className="p-3 bg-white rounded-xl border border-[#E7E1EA] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded bg-[#1B0F4A] text-white">
              R1
            </span>
            <span
              className={`text-xs font-bold flex items-center gap-1 ${
                r1Satisfied ? 'text-[#1F7A4D]' : 'text-[#B3261E]'
              }`}
            >
              {r1Satisfied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Live: Safe</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Live: VIOLATED</span>
                </>
              )}
            </span>
          </div>
          <h3 className="font-heading text-xs font-bold text-[#1B0F4A]">
            Caregiver Protection
          </h3>
          <p className="text-xs text-[#534E62]">
            P1 (older adult) and P2 (caregiver) must NEVER be separated on any travel leg or re-route.
          </p>
        </div>

        {/* R2 */}
        <div className="p-3 bg-white rounded-xl border border-[#E7E1EA] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded bg-[#1B0F4A] text-white">
              R2
            </span>
            <span
              className={`text-xs font-bold flex items-center gap-1 ${
                r2Satisfied ? 'text-[#1F7A4D]' : 'text-[#B3261E]'
              }`}
            >
              {r2Satisfied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Live: Safe</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Live: VIOLATED</span>
                </>
              )}
            </span>
          </div>
          <h3 className="font-heading text-xs font-bold text-[#1B0F4A]">
            Child Guardian Guarantee
          </h3>
          <p className="text-xs text-[#534E62]">
            P3 (child under five) must always travel with at least one adult guardian (P2, P4, or P5).
          </p>
        </div>

        {/* R3 */}
        <div className="p-3 bg-white rounded-xl border border-[#E7E1EA] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-black px-1.5 py-0.5 rounded bg-[#1B0F4A] text-white">
              R3
            </span>
            <span className="text-xs font-bold text-[#B45309] flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Live: Enforced</span>
            </span>
          </div>
          <h3 className="font-heading text-xs font-bold text-[#1B0F4A]">
            Accessibility Verification
          </h3>
          <p className="text-xs text-[#534E62]">
            Plans failing P1 mobility needs are rejected. Unknown ramp/lift access flags plan with a 0.85 score multiplier.
          </p>
        </div>
      </div>
    </section>
  );
}
