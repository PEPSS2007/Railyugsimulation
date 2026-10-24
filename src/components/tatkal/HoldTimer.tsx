'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { Clock, Zap } from 'lucide-react';

export function HoldTimer() {
  const { state, dispatch } = useRailyug();
  const { hold } = state;

  const totalDuration = hold.demoSpeed ? 20 : 180;
  const remaining = hold.status === 'Processing' ? hold.secondsRemaining : 0;
  const progressPercent = hold.status === 'Processing' ? (remaining / totalDuration) * 100 : 0;

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="p-4 rounded-xl border border-[#E7E1EA] bg-[#FBF8F4] space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#7A2455]" aria-hidden="true" />
          <div>
            <h3 className="font-heading font-bold text-sm text-[#1B0F4A]">
              Atomic Seat Hold Payment Window
            </h3>
            <p className="text-[11px] text-[#534E62]">
              Server-side expiry source of truth. Re-clicking or page refresh never extends the window.
            </p>
          </div>
        </div>

        {/* Demo Speed Toggle */}
        <button
          type="button"
          onClick={() => dispatch({ type: 'TOGGLE_HOLD_DEMO_SPEED' })}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 border transition-colors ${
            hold.demoSpeed
              ? 'bg-[#F28C38] text-[#1B0F4A] border-[#F28C38] shadow-xs'
              : 'bg-white text-[#534E62] border-[#E7E1EA] hover:bg-gray-50'
          }`}
          title="Toggle between standard 3:00 window and quick 20s test window"
        >
          <Zap className="w-3.5 h-3.5 text-[#1B0F4A]" />
          <span>{hold.demoSpeed ? 'Demo Speed: 20s (Active)' : 'Standard Speed: 3m'}</span>
        </button>
      </div>

      {/* Countdown Timer Display */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white rounded-lg border border-[#E7E1EA]">
        <div className="flex items-center gap-3">
          <div
            role="timer"
            aria-live="off"
            aria-label={`Time remaining to complete payment: ${timeFormatted}`}
            className="font-mono text-2xl font-black tracking-widest text-[#1B0F4A] px-3 py-1 rounded-md bg-[#FBF8F4] border border-[#CDC4D3]"
          >
            {timeFormatted}
          </div>

          <div className="text-xs">
            <span className="font-bold text-[#1B0F4A] block">
              {hold.status === 'Processing'
                ? 'Temporary Exclusive Hold Active'
                : hold.status === 'Confirmed'
                ? 'Booking Confirmed'
                : hold.status === 'Expired'
                ? 'Hold Expired (Seats Released)'
                : 'No Active Hold'}
            </span>
            <span className="text-[11px] text-[#534E62]">
              {hold.status === 'Processing'
                ? 'Other travellers see "Processing" and cannot select these 5 berths.'
                : 'Seats available for atomic check-and-set claim.'}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                remaining <= 30
                  ? 'bg-[#B3261E]'
                  : remaining <= 60
                  ? 'bg-[#F28C38]'
                  : 'bg-[#1F7A4D]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#534E62] font-mono">
            <span>0:00</span>
            <span>{hold.demoSpeed ? '0:20' : '3:00'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
