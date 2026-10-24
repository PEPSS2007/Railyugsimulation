'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import {
  Train,
  Clock,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Baby,
  Eye,
  Heart,
  UserCheck,
} from 'lucide-react';

export function OverviewSummary() {
  const { state, dispatch } = useRailyug();

  const topPlan = state.plans.find((p) => p.rank === 1) || state.plans[0];

  return (
    <div className="space-y-6">
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Journey Status */}
        <div className="railyug-card p-3.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#534E62] flex items-center justify-between">
            <span>Journey Status</span>
            <Train className="w-4 h-4 text-[#7A2455]" aria-hidden="true" />
          </span>
          <div className="text-base font-heading font-extrabold text-[#1B0F4A]">
            {state.delay.active ? (
              <span className="text-[#B3261E] flex items-center gap-1.5">
                <span>Disrupted</span>
                <span className="text-xs font-normal font-sans">(+55m Late)</span>
              </span>
            ) : (
              <span className="text-[#1F7A4D] flex items-center gap-1.5">
                <span>On Schedule</span>
                <span className="text-xs font-normal font-sans">(Leg 1 Confirmed)</span>
              </span>
            )}
          </div>
          <p className="text-xs text-[#534E62]">
            {state.delay.active
              ? 'SIM-101 late arrival breaks scheduled CJN transfer.'
              : 'SIM-101 en route; SIM-202 waitlisted #14.'}
          </p>
        </div>

        {/* 2. Next Decision */}
        <div className="railyug-card p-3.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#534E62] flex items-center justify-between">
            <span>Next Decision Cutoff</span>
            <Clock className="w-4 h-4 text-[#7A2455]" aria-hidden="true" />
          </span>
          <div className="text-base font-heading font-extrabold text-[#1B0F4A]">
            {state.delay.active ? '11:45 CJN Cutoff' : '08:00 Chart Cutoff'}
          </div>
          <p className="text-xs text-[#534E62]">
            {state.delay.active
              ? 'SIM-303 Tatkal hold booking cutoff before 13:10.'
              : 'Waitlist chart preparation for SIM-202 Leg 2.'}
          </p>
        </div>

        {/* 3. Connection Margin */}
        <div className="railyug-card p-3.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#534E62] flex items-center justify-between">
            <span>Connection Margin</span>
            <Compass className="w-4 h-4 text-[#7A2455]" aria-hidden="true" />
          </span>
          <div
            className={`text-base font-heading font-extrabold ${
              state.delay.active ? 'text-[#B3261E]' : 'text-[#1F7A4D]'
            }`}
          >
            {state.delay.active ? '−15 min (Missed)' : '+16 min (Feasible)'}
          </div>
          <p className="text-xs text-[#534E62]">
            {state.delay.active
              ? 'Arrives 12:15; Train 2 departs 12:00.'
              : '40 min gap covers 24 min group walking pace.'}
          </p>
        </div>

        {/* 4. Passengers */}
        <div className="railyug-card p-3.5 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#534E62] flex items-center justify-between">
            <span>Passengers &amp; Rules</span>
            <Users className="w-4 h-4 text-[#7A2455]" aria-hidden="true" />
          </span>
          <div className="text-base font-heading font-extrabold text-[#1B0F4A]">
            5 Travellers
          </div>
          <p className="text-xs text-[#1F7A4D] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Rules R1, R2, R3 Active</span>
          </p>
        </div>
      </div>

      {/* Passenger Strip */}
      <div className="railyug-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-[#534E62]">
            Travelling Party (Linked Constraints)
          </h3>
          <span className="text-xs text-[#7A2455] font-semibold">
            Zero P1/P2 Separation Permitted
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {/* P1 */}
          <div className="p-2.5 rounded-lg border border-[#E7E1EA] bg-[#FBF8F4] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1B0F4A]">P1: Older Adult</span>
              <Heart className="w-3.5 h-3.5 text-[#B3261E]" />
            </div>
            <p className="text-[11px] text-[#534E62]">Limited mobility (0.5 m/s)</p>
            <span className="inline-block text-[10px] font-semibold text-[#1F7A4D] bg-[#E8F5E9] px-1.5 py-0.5 rounded">
              Linked with P2
            </span>
          </div>

          {/* P2 */}
          <div className="p-2.5 rounded-lg border border-[#E7E1EA] bg-[#FBF8F4] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1B0F4A]">P2: Caregiver</span>
              <UserCheck className="w-3.5 h-3.5 text-[#1B0F4A]" />
            </div>
            <p className="text-[11px] text-[#534E62]">Designated caregiver (1.2 m/s)</p>
            <span className="inline-block text-[10px] font-semibold text-[#1F7A4D] bg-[#E8F5E9] px-1.5 py-0.5 rounded">
              Linked with P1
            </span>
          </div>

          {/* P3 */}
          <div className="p-2.5 rounded-lg border border-[#E7E1EA] bg-[#FBF8F4] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1B0F4A]">P3: Child (Age 4)</span>
              <Baby className="w-3.5 h-3.5 text-[#7A2455]" />
            </div>
            <p className="text-[11px] text-[#534E62]">Child-care buffer (0.7 m/s)</p>
            <span className="inline-block text-[10px] font-semibold text-[#7A2455] bg-[#7A2455]/10 px-1.5 py-0.5 rounded">
              Guardian Required
            </span>
          </div>

          {/* P4 */}
          <div className="p-2.5 rounded-lg border border-[#E7E1EA] bg-[#FBF8F4] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1B0F4A]">P4: Screen Reader</span>
              <Eye className="w-3.5 h-3.5 text-[#1B0F4A]" />
            </div>
            <p className="text-[11px] text-[#534E62]">Assistive tech navigation</p>
            <span className="inline-block text-[10px] font-semibold text-[#1B0F4A] bg-[#1B0F4A]/10 px-1.5 py-0.5 rounded">
              Audio Assistance
            </span>
          </div>

          {/* P5 */}
          <div className="p-2.5 rounded-lg border border-[#E7E1EA] bg-[#FBF8F4] text-xs space-y-1 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1B0F4A]">P5: Flexible Adult</span>
              <Users className="w-3.5 h-3.5 text-[#534E62]" />
            </div>
            <p className="text-[11px] text-[#534E62]">Independent pace (1.2 m/s)</p>
            <span className="inline-block text-[10px] font-semibold text-[#B45309] bg-[#FEF3C7] px-1.5 py-0.5 rounded">
              Split Candidate
            </span>
          </div>
        </div>
      </div>

      {/* Recommended Next Step Card */}
      <div className="railyug-card p-4 bg-gradient-to-r from-[#1B0F4A]/5 to-[#7A2455]/5 border-[#1B0F4A]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A2455]">
              Recommended Action
            </span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#1B0F4A] text-white">
              {topPlan.name.split('—')[0].trim()}
            </span>
          </div>
          <p className="text-sm font-bold text-[#1B0F4A]">
            {state.delay.active
              ? 'Re-route together on SIM-303 (Plan B) — Verified step-free with confirmed seats.'
              : 'Maintain current itinerary (Plan A) while monitoring SIM-202 waitlist likelihood.'}
          </p>
          <p className="text-xs text-[#534E62]">
            {topPlan.reason}
          </p>
        </div>

        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_ACTIVE_SECTION', section: 'plans' })}
          className="btn-cta text-xs py-2.5 px-4 shadow-sm shrink-0"
        >
          <span>Review Plan Options</span>
          <ArrowRight className="w-4 h-4 text-[#1B0F4A]" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
