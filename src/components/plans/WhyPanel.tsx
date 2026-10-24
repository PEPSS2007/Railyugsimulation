'use client';

import React, { useEffect, useRef } from 'react';
import { useRailyug } from '@/state/store';
import { PRIORITY_PRESETS } from '@/lib/ranking';
import { X, HelpCircle, ShieldCheck, Scale, CheckCircle2, Ban } from 'lucide-react';

export function WhyPanel() {
  const { state, dispatch } = useRailyug();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const plan = state.plans.find((p) => p.id === state.whyPlanId);
  const weights = PRIORITY_PRESETS[state.priority];

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'CLOSE_WHY_PANEL' });
      }
    };
    if (state.whyPanelOpen) {
      window.addEventListener('keydown', handleKeyDown);
      closeButtonRef.current?.focus();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.whyPanelOpen, dispatch]);

  if (!state.whyPanelOpen || !plan) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="why-panel-title"
    >
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Panel Header */}
        <div className="p-5 border-b border-[#E7E1EA] flex items-start justify-between bg-[#FBF8F4]">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A2455] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" />
              <span>Algorithmic Explainability Card</span>
            </span>
            <h2 id="why-panel-title" className="font-heading font-extrabold text-lg text-[#1B0F4A]">
              Why {plan.name}?
            </h2>
            <p className="text-xs text-[#534E62]">
              Transparent evaluation breakdown under current priority: <strong>{state.priority.toUpperCase()}</strong>
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => dispatch({ type: 'CLOSE_WHY_PANEL' })}
            className="p-1.5 rounded-lg text-[#534E62] hover:bg-[#E7E1EA] hover:text-[#1B0F4A] focus-visible:outline-none"
            aria-label="Close explainability panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="p-5 space-y-6 flex-1 text-xs">
          {/* Summary Banner */}
          <div className="p-3 rounded-xl bg-[#FBF8F4] border border-[#E7E1EA] space-y-1.5">
            <div className="flex items-center justify-between font-bold">
              <span className="text-[#1B0F4A]">Overall Composite Score:</span>
              <span className="font-mono text-sm font-extrabold text-[#1B0F4A]">
                {plan.score.toFixed(2)} / 1.00
              </span>
            </div>
            <p className="text-[#534E62] leading-relaxed">{plan.reason}</p>
          </div>

          {/* Hard Constraints Verification */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#1B0F4A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#1F7A4D]" />
              <span>1. Hard Constraints (Evaluated Before Ranking)</span>
            </h3>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg border border-[#E7E1EA] bg-white flex items-center justify-between">
                <div>
                  <strong className="block text-[#1B0F4A]">Rule R1: Caregiver Protection</strong>
                  <span className="text-[11px] text-[#534E62]">P1 &amp; P2 never separated on any leg</span>
                </div>
                <span className="text-xs font-bold text-[#1F7A4D] flex items-center gap-1">
                  {plan.id === 'D' ? (
                    <span className="text-[#B3261E] flex items-center gap-1">
                      <Ban className="w-3.5 h-3.5" />
                      VIOLATED
                    </span>
                  ) : (
                    <span className="text-[#1F7A4D] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      SATISFIED
                    </span>
                  )}
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#E7E1EA] bg-white flex items-center justify-between">
                <div>
                  <strong className="block text-[#1B0F4A]">Rule R2: Child Guardian Guarantee</strong>
                  <span className="text-[11px] text-[#534E62]">P3 accompanied by guardian (P2, P4, P5)</span>
                </div>
                <span className="text-xs font-bold text-[#1F7A4D] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SATISFIED
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#E7E1EA] bg-white flex items-center justify-between">
                <div>
                  <strong className="block text-[#1B0F4A]">Rule R3: Accessibility Verification</strong>
                  <span className="text-[11px] text-[#534E62]">Step-free ramp/lift access for P1</span>
                </div>
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${
                    plan.accessibilityStatus === 'Known feasible'
                      ? 'text-[#1F7A4D]'
                      : plan.accessibilityStatus === 'Unknown'
                      ? 'text-[#B45309]'
                      : 'text-[#B3261E]'
                  }`}
                >
                  {plan.accessibilityStatus} ({plan.accessibilityMultiplier.toFixed(2)}×)
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#E7E1EA] bg-white flex items-center justify-between">
                <div>
                  <strong className="block text-[#1B0F4A]">Rule R4: Transfer Feasibility Gate</strong>
                  <span className="text-[11px] text-[#534E62]">Physical walking buffer exceeds group required</span>
                </div>
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${
                    plan.infeasible ? 'text-[#B3261E]' : 'text-[#1F7A4D]'
                  }`}
                >
                  {plan.infeasible ? 'INFEASIBLE (−15m)' : 'FEASIBLE'}
                </span>
              </div>
            </div>
          </div>

          {/* Factor Scores Table */}
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-sm text-[#1B0F4A] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#7A2455]" />
              <span>2. Multi-Factor Scoring (0.00 to 1.00)</span>
            </h3>

            <div className="rounded-xl border border-[#E7E1EA] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <caption className="sr-only">Factor weights and individual scores</caption>
                <thead className="bg-[#FBF8F4] text-[#534E62] border-b border-[#E7E1EA]">
                  <tr>
                    <th scope="col" className="p-2 font-bold">Factor</th>
                    <th scope="col" className="p-2 font-bold text-center">Score</th>
                    <th scope="col" className="p-2 font-bold text-center">Weight</th>
                    <th scope="col" className="p-2 font-bold text-right">Weighted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E1EA] font-mono">
                  <tr>
                    <th scope="row" className="p-2 font-sans font-medium text-[#1B0F4A]">Arrival Time</th>
                    <td className="p-2 text-center">{plan.factorScores.arrival.toFixed(3)}</td>
                    <td className="p-2 text-center text-[#7A2455]">{weights.arrival.toFixed(2)}</td>
                    <td className="p-2 text-right">{(plan.factorScores.arrival * weights.arrival).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-2 font-sans font-medium text-[#1B0F4A]">Reliability</th>
                    <td className="p-2 text-center">{plan.factorScores.reliability.toFixed(3)}</td>
                    <td className="p-2 text-center text-[#7A2455]">{weights.reliability.toFixed(2)}</td>
                    <td className="p-2 text-right">{(plan.factorScores.reliability * weights.reliability).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-2 font-sans font-medium text-[#1B0F4A]">Transfer Buffer</th>
                    <td className="p-2 text-center">{plan.factorScores.transfer.toFixed(3)}</td>
                    <td className="p-2 text-center text-[#7A2455]">{weights.transfer.toFixed(2)}</td>
                    <td className="p-2 text-right">{(plan.factorScores.transfer * weights.transfer).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-2 font-sans font-medium text-[#1B0F4A]">Confirmation / Berths</th>
                    <td className="p-2 text-center">{plan.factorScores.confirmation.toFixed(3)}</td>
                    <td className="p-2 text-center text-[#7A2455]">{weights.confirmation.toFixed(2)}</td>
                    <td className="p-2 text-right">{(plan.factorScores.confirmation * weights.confirmation).toFixed(3)}</td>
                  </tr>
                  <tr>
                    <th scope="row" className="p-2 font-sans font-medium text-[#1B0F4A]">Cost Efficiency</th>
                    <td className="p-2 text-center">{plan.factorScores.cost.toFixed(3)}</td>
                    <td className="p-2 text-center text-[#7A2455]">{weights.cost.toFixed(2)}</td>
                    <td className="p-2 text-right">{(plan.factorScores.cost * weights.cost).toFixed(3)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-[#FBF8F4] font-bold border-t border-[#E7E1EA]">
                  <tr>
                    <th scope="row" className="p-2 font-sans text-[#1B0F4A]">Accessibility Multiplier</th>
                    <td colSpan={2} className="p-2 text-center font-mono">{plan.accessibilityMultiplier.toFixed(2)}×</td>
                    <td className="p-2 text-right font-mono text-[#1B0F4A]">{plan.score.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Uncertainty & Provenance */}
          <div className="p-3 rounded-lg bg-[#FBF8F4] border border-[#E7E1EA] space-y-1 text-[#534E62]">
            <span className="font-bold text-[#1B0F4A] block">Uncertainty Bounds &amp; Provenance:</span>
            <p>
              Arrival uncertainty range: <strong>{plan.arrivalRange.min} to {plan.arrivalRange.max}</strong> ({plan.arrivalRangeWidthMinutes} min spread).
              Confirmation estimate: <strong>{plan.availabilityText}</strong>.
              All evaluations deterministic under rule set <code>{state.ruleVersion}</code>.
            </p>
          </div>
        </div>

        {/* Panel Footer */}
        <div className="p-4 border-t border-[#E7E1EA] bg-[#FBF8F4] flex justify-end">
          <button
            type="button"
            onClick={() => dispatch({ type: 'CLOSE_WHY_PANEL' })}
            className="btn-secondary text-xs py-2 px-4"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
