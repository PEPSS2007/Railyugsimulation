'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export function RiskMeter() {
  const { state } = useRailyug();

  // On time: margin is 16 min (range 11 to 19 min).
  // Delayed: missed by 15 min (margin -15 min).
  const isDelayed = state.delay.active;
  const statusLabel = isDelayed
    ? 'Infeasible, missed by 15 min'
    : 'Feasible, margin 16 min (11 to 19)';

  // Calculate gauge position percent (0% = heavily missed, 45% = tight, 80% = comfortable)
  // Scale from -30m (0%) to +30m (100%)
  const markerPercent = isDelayed ? 15 : 78;

  return (
    <section aria-labelledby="risk-meter-heading" className="railyug-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isDelayed ? (
            <AlertTriangle className="w-5 h-5 text-[#B3261E]" aria-hidden="true" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-[#1F7A4D]" aria-hidden="true" />
          )}
          <h2 id="risk-meter-heading" className="font-heading text-base font-bold text-[#1B0F4A]">
            Connection-Risk Feasibility Meter
          </h2>
        </div>

        <span
          className={`text-xs font-bold px-3 py-1 rounded-full border ${
            isDelayed
              ? 'bg-[#FDECEA] text-[#B3261E] border-[#B3261E]'
              : 'bg-[#E8F5E9] text-[#1F7A4D] border-[#1F7A4D]/30'
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Meter Bar with 3 labeled zones */}
      <div className="space-y-1.5">
        <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
          {/* Missed Zone (< 0 min) */}
          <div
            className="h-full bg-[#FDECEA] border-r border-[#B3261E]/40 flex items-center justify-center text-[10px] font-bold text-[#B3261E]"
            style={{ width: '35%' }}
            title="Missed connection zone (< 0 min)"
          >
            Missed (&lt;0 min)
          </div>

          {/* Tight Zone (0 to 10 min) */}
          <div
            className="h-full bg-[#FEF3C7] border-r border-[#B45309]/40 flex items-center justify-center text-[10px] font-bold text-[#B45309]"
            style={{ width: '25%' }}
            title="Tight connection zone (0 to 10 min)"
          >
            Tight (0–10 min)
          </div>

          {/* Comfortable Zone (> 10 min) */}
          <div
            className="h-full bg-[#E8F5E9] flex items-center justify-center text-[10px] font-bold text-[#1F7A4D]"
            style={{ width: '40%' }}
            title="Comfortable buffer zone (> 10 min)"
          >
            Comfortable (&gt;10 min)
          </div>

          {/* Marker needle */}
          <div
            className="absolute top-0 bottom-0 w-3 bg-[#1B0F4A] border-2 border-white rounded-full shadow-md transition-all duration-300 transform -translate-x-1/2"
            style={{ left: `${markerPercent}%` }}
            aria-hidden="true"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[11px] text-[#534E62]">
          <span>−15m (Disrupted)</span>
          <span>0m (Transfer Threshold)</span>
          <span>+16m (On-time Margin)</span>
          <span>+40m (Scheduled)</span>
        </div>
      </div>

      <p className="text-xs text-[#534E62]">
        Transfer formula: <code>group = max(walk × 1.1 + liftWait + childCare) + regroupBuffer (5 min)</code>.
        P1 walking speed: 0.5 m/s across 420m platform bridge = 24 min required.
      </p>
    </section>
  );
}
