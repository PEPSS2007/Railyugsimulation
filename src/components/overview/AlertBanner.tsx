'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { SourceBadge } from '@/components/shell/SourceBadge';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

export function AlertBanner() {
  const { state, dispatch } = useRailyug();

  if (!state.delay.active || state.alertBannerDismissed) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-4 rounded-xl border-2 border-[#B3261E] bg-[#FDECEA] shadow-sm mb-6 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#B3261E] text-white rounded-lg shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold text-[#B3261E] uppercase tracking-wide">
                Critical Disruption Detected
              </span>
              <SourceBadge type="OFFICIAL" text="SIM-101 Train Controller" />
            </div>

            <p className="text-base font-bold text-[#1B0F4A]">
              Train 1 is running 55 minutes late. Your 40-minute connection is missed by 15 minutes.
            </p>
            <p className="text-xs text-[#534E62]">
              SIM-101 will now arrive Central Junction at <strong>12:15</strong>. Connecting train SIM-202 departs at <strong>12:00</strong> on schedule. Re-routing required immediately.
            </p>

            {/* Advisory Information Sources (CROWD & PREDICTED) */}
            <div className="pt-2 border-t border-[#B3261E]/20 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <SourceBadge type="CROWD" reportCount={3} />
                <span className="text-[#534E62]">3 passengers report Central Junction Platform 9 lift under maintenance (Advisory only).</span>
              </div>
              <div className="flex items-center gap-1.5">
                <SourceBadge type="PREDICTED" range="10 to 25 min" />
                <span className="text-[#534E62]">Historical model: Congestion delay may extend by 10 to 25 min (Low confidence).</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => dispatch({ type: 'SET_ACTIVE_SECTION', section: 'plans' })}
            className="btn-cta text-xs py-2 px-3 whitespace-nowrap shadow-xs"
          >
            <span>Review Re-plan Options</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: 'DISMISS_ALERT' })}
            className="p-1.5 text-[#534E62] hover:text-[#1B0F4A] rounded-md focus-visible:outline-none"
            aria-label="Dismiss alert banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
