'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { PlanOption } from '@/types';
import {
  Trophy,
  Clock,
  AlertTriangle,
  Ban,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  Accessibility,
} from 'lucide-react';

interface PlanCardProps {
  plan: PlanOption;
}

export function PlanCard({ plan }: PlanCardProps) {
  const { state, dispatch } = useRailyug();

  const isSelected = state.selectedPlanId === plan.id;
  const isBlocked = plan.blocked || plan.id === 'D';
  const isInfeasible = plan.infeasible || (plan.id === 'A' && state.delay.active);

  return (
    <div
      className={`railyug-card p-5 space-y-4 transition-all relative flex flex-col justify-between ${
        isSelected
          ? 'border-2 border-[#1F7A4D] bg-[#E8F5E9]/20 shadow-md ring-2 ring-[#1F7A4D]/30'
          : isBlocked
          ? 'border-2 border-[#B3261E] bg-[#FDECEA]/40 opacity-90'
          : isInfeasible
          ? 'border-2 border-[#B3261E] bg-white opacity-80'
          : 'border border-[#E7E1EA] bg-white hover:border-[#1B0F4A]/40'
      }`}
    >
      <div className="space-y-3">
        {/* Card Header: Rank, Badge & Plan Name */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Rank Badge */}
              {plan.rank !== undefined ? (
                <span className="inline-flex items-center gap-1 font-heading font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-[#1B0F4A] text-white">
                  <Trophy className="w-3.5 h-3.5 text-[#FDBA4A]" />
                  <span>RANK #{plan.rank}</span>
                </span>
              ) : isBlocked ? (
                <span className="inline-flex items-center gap-1 font-heading font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-[#B3261E] text-white">
                  <Ban className="w-3.5 h-3.5" />
                  <span>BLOCKED (RULE R1)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 font-heading font-extrabold text-xs px-2.5 py-0.5 rounded-full bg-[#B3261E] text-white">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>INFEASIBLE</span>
                </span>
              )}

              {/* Status Indicators */}
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  plan.familySafetyStatus === 'Safe' && !isInfeasible
                    ? 'bg-[#E8F5E9] text-[#1F7A4D]'
                    : plan.familySafetyStatus === 'Flagged'
                    ? 'bg-[#FEF3C7] text-[#B45309]'
                    : 'bg-[#FDECEA] text-[#B3261E]'
                }`}
              >
                {isInfeasible ? 'Connection Missed' : `Safety: ${plan.familySafetyStatus}`}
              </span>

              {plan.score > 0 && !isInfeasible && !isBlocked && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-[#1B0F4A]">
                  Score: {plan.score.toFixed(2)}
                </span>
              )}
            </div>

            <h3 className="font-heading font-extrabold text-base text-[#1B0F4A]">
              {plan.name}
            </h3>
            <p className="text-xs text-[#534E62]">{plan.subtitle}</p>
          </div>

          {/* Pricing Tag */}
          <div className="text-right shrink-0">
            <span className="text-[10px] text-[#534E62] block">Extra Re-route Fare:</span>
            <div className="text-sm font-heading font-extrabold text-[#1B0F4A] flex items-center justify-end">
              <span>{plan.extraCost === 0 ? '₹0 (Booked)' : `+₹${plan.extraCost.toLocaleString()}`}</span>
            </div>
            <span className="text-[10px] text-[#534E62]">Simulated fare</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E7E1EA] text-xs">
          {/* Arrival Range */}
          <div className="p-2 rounded-lg bg-[#FBF8F4] space-y-0.5">
            <span className="text-[10px] text-[#534E62] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#7A2455]" />
              <span>Arrival Time</span>
            </span>
            <strong className="text-xs font-mono text-[#1B0F4A] block">
              {plan.expectedArrival}
            </strong>
            <span className="text-[10px] text-[#534E62]">
              Range: {plan.arrivalRange.min}–{plan.arrivalRange.max}
            </span>
          </div>

          {/* Availability / Confirmation */}
          <div className="p-2 rounded-lg bg-[#FBF8F4] space-y-0.5">
            <span className="text-[10px] text-[#534E62]">Seat Availability</span>
            <strong className="text-xs text-[#1B0F4A] block truncate" title={plan.availabilityText}>
              {plan.id === 'A' ? 'WL #14-18 (38–55%)' : 'Confirmed Seats'}
            </strong>
            <span className="text-[10px] text-[#534E62]">
              {plan.waitlistEstimate ? `n = ${plan.waitlistEstimate.n} cases` : 'Simulated official'}
            </span>
          </div>

          {/* Accessibility */}
          <div className="p-2 rounded-lg bg-[#FBF8F4] space-y-0.5">
            <span className="text-[10px] text-[#534E62] flex items-center gap-1">
              <Accessibility className="w-3 h-3 text-[#1B0F4A]" />
              <span>Step-Free Access</span>
            </span>
            <strong
              className={`text-xs block ${
                plan.accessibilityStatus === 'Known feasible'
                  ? 'text-[#1F7A4D]'
                  : plan.accessibilityStatus === 'Unknown'
                  ? 'text-[#B45309]'
                  : 'text-[#B3261E]'
              }`}
            >
              {plan.accessibilityStatus}
            </strong>
            <span className="text-[10px] text-[#534E62]">
              {plan.accessibilityMultiplier < 1 ? '0.85 Multiplier' : '1.00 Normal'}
            </span>
          </div>

          {/* Connection Risk */}
          <div className="p-2 rounded-lg bg-[#FBF8F4] space-y-0.5">
            <span className="text-[10px] text-[#534E62]">Connection Margin</span>
            <strong
              className={`text-xs block ${
                isInfeasible ? 'text-[#B3261E] font-black' : 'text-[#1B0F4A]'
              }`}
            >
              {isInfeasible ? '−15m (Missed)' : plan.id === 'A' ? '+16m (Feasible)' : '55m+ Buffer'}
            </strong>
            <span className="text-[10px] text-[#534E62]">Junction Platform Change</span>
          </div>
        </div>

        {/* One-line Reason */}
        <p className="text-xs text-[#534E62] italic pt-1">
          <strong>Decision factor: </strong> {plan.reason}
        </p>

        {/* Violations notice for blocked or flagged plans */}
        {plan.violations.length > 0 && (
          <div className="p-2.5 rounded-lg bg-[#FDECEA] border border-[#B3261E]/40 text-xs text-[#B3261E] space-y-1">
            {plan.violations.map((v, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div>
                  <strong className="uppercase">Rule {v.rule}: </strong>
                  <span>{v.reason}</span>
                  <div className="text-[11px] text-[#1B0F4A] mt-0.5">
                    <strong>Suggested Fix: </strong> {v.fix}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons: Why this plan? and Select plan */}
      <div className="pt-3 border-t border-[#E7E1EA] flex items-center justify-between gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => dispatch({ type: 'OPEN_WHY_PANEL', planId: plan.id })}
          className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#7A2455]" />
          <span>Why this plan?</span>
        </button>

        {!isBlocked && !isInfeasible ? (
          <button
            type="button"
            onClick={() => dispatch({ type: 'OPEN_PREVIEW', planId: plan.id })}
            className={`text-xs py-2 px-4 rounded-lg font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isSelected
                ? 'bg-[#1F7A4D] text-white'
                : 'btn-cta'
            }`}
          >
            {isSelected ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Selected Plan</span>
              </>
            ) : (
              <>
                <span>Select Plan</span>
                <ArrowRight className="w-4 h-4 text-[#1B0F4A]" />
              </>
            )}
          </button>
        ) : (
          <span className="text-xs font-bold text-[#B3261E] uppercase tracking-wide">
            {isBlocked ? 'Selection Blocked (Rule R1)' : 'Infeasible (Connection Missed)'}
          </span>
        )}
      </div>
    </div>
  );
}
