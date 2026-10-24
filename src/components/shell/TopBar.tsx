'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { RotateCcw, Wifi, WifiOff, Clock } from 'lucide-react';

interface TopBarProps {
  onOpenMobileMenu?: () => void;
}

export function TopBar({ onOpenMobileMenu }: TopBarProps) {
  const { state, dispatch } = useRailyug();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E7E1EA] px-4 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-[#1B0F4A] hover:bg-[#FBF8F4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B0F4A]"
            aria-label="Open navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading font-extrabold tracking-tight text-lg text-[#1B0F4A]">
              RAILYUG
            </span>
            <span className="text-xs uppercase tracking-wider text-[#7A2455] font-semibold px-2 py-0.5 rounded-sm bg-[#7A2455]/10">
              Tickets &amp; Comfort
            </span>
          </div>
          <p className="text-xs text-[#534E62] hidden sm:block">
            IMPACTX 2026 Railway Journey Simulation
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
        {/* Simulated Data Persistent Pill */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#B45309] border border-[#FDBA4A]"
          title="All schedules, berths, costs, and estimates in this prototype are synthetic simulation fixtures."
          role="status"
        >
          <span className="w-2 h-2 rounded-full bg-[#B45309] animate-pulse" aria-hidden="true" />
          <span>SIMULATED DATA</span>
        </div>

        {/* Clock indicator */}
        <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FBF8F4] border border-[#E7E1EA] text-xs font-mono font-medium text-[#1B0F4A]">
          <Clock className="w-3.5 h-3.5 text-[#7A2455]" aria-hidden="true" />
          <span>Clock: <strong>{state.clock}</strong></span>
          {state.delay.active && <span className="text-[#B3261E] font-bold text-[10px] ml-1">(Delayed)</span>}
        </div>

        {/* Rule Version Pill */}
        <span className="hidden md:inline-flex items-center text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#1B0F4A]/5 text-[#1B0F4A] border border-[#E7E1EA]">
          {state.ruleVersion}
        </span>

        {/* Low Bandwidth Toggle */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_SETTING', setting: 'lowBandwidth' })}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border ${
            state.settings.lowBandwidth
              ? 'bg-[#1B0F4A] text-white border-[#1B0F4A]'
              : 'bg-white text-[#1B0F4A] border-[#E7E1EA] hover:bg-[#FBF8F4]'
          }`}
          aria-pressed={state.settings.lowBandwidth}
          title="Toggle text-first low-bandwidth mode"
        >
          {state.settings.lowBandwidth ? (
            <>
              <WifiOff className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Low-BW: ON</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Low-BW Mode</span>
            </>
          )}
        </button>

        {/* Reset Scenario Button */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'RESET' })}
          className="btn-secondary text-xs py-1 px-2.5 border-[#E7E1EA] hover:border-[#1B0F4A] focus-visible:outline-none"
          title="Reset scenario to 07:00 on-time state (preserves audit log)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#1B0F4A]" aria-hidden="true" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}
