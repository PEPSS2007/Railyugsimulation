'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { REQUESTED_GROUP_SEATS } from '@/lib/holds';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertTriangle,
  Users,
  Play,
  CreditCard,
} from 'lucide-react';

export function SeatGrid() {
  const { state, dispatch } = useRailyug();
  const { seats, hold, otherUserConflict } = state;

  const isHolding = hold.status === 'Processing';

  return (
    <section aria-labelledby="tatkal-grid-heading" className="space-y-4">
      {/* Coach & Inventory Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-[#E7E1EA]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#1B0F4A] text-white">
              SIM-303 · Coach C1
            </span>
            <span className="text-xs font-bold text-[#7A2455] bg-[#7A2455]/10 px-2.5 py-0.5 rounded-full">
              Tatkal Quota: 20 Berths
            </span>
          </div>
          <h2 id="tatkal-grid-heading" className="font-heading font-extrabold text-base text-[#1B0F4A]">
            Fair-Booking Anti-Scalping Hold (All-or-Nothing Group Hold)
          </h2>
          <p className="text-xs text-[#534E62]">
            Requested family group berths: <strong>Seats 1, 2, 3, 4, 5</strong> (P1 Lower, P2 Middle, P3 Upper, P4 Side Lower, P5 Side Upper).
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs flex-wrap font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-white border-2 border-gray-400" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-[#F28C38] border-2 border-[#1B0F4A]" />
            <span className="font-bold text-[#1B0F4A]">Yours (Held)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-[#FEF3C7] border-2 border-[#B45309]" />
            <span className="text-[#B45309]">Processing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-[#E8F5E9] border-2 border-[#1F7A4D]" />
            <span className="text-[#1F7A4D]">Confirmed</span>
          </div>
        </div>
      </div>

      {/* Conflict simulation alert banner */}
      {otherUserConflict && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-[#FEF3C7] border border-[#FDBA4A] text-xs text-[#B45309] flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block font-bold">Concurrency Test Triggered (Zero Overlapping Holds):</strong>
            <p>
              Simulated second traveller attempted to book seats 1 to 5 simultaneously. Their attempt was rejected with <strong>&ldquo;Seat just taken&rdquo;</strong>, and alternative berths (Seats 6 to 10) were offered.
            </p>
          </div>
        </div>
      )}

      {/* Expiry / Status Notice */}
      {hold.status === 'Expired' && (
        <div
          role="status"
          className="p-3 rounded-xl bg-[#FBF8F4] border border-[#CDC4D3] text-xs text-[#534E62] flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#7A2455]" />
            <span>
              <strong>Hold expired, seats released: </strong> Seats 1 to 5 are back in Available inventory. Passenger details preserved.
            </span>
          </div>
        </div>
      )}

      {/* 20-Seat Coach Layout Grid */}
      <div className="railyug-card p-5 bg-white border border-[#E7E1EA] space-y-4">
        <div className="flex items-center justify-between text-xs text-[#534E62] border-b border-[#E7E1EA] pb-2">
          <span className="font-bold text-[#1B0F4A]">Coach C1 Seat Map</span>
          <span>Window / Corridor / Track Alignment</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2.5">
          {seats.map((seat) => {
            const isYours = seat.heldBy === 'you' && (seat.state === 'Processing' || seat.state === 'Yours');
            const isConfirmed = seat.state === 'Confirmed';
            const isOtherProcessing = seat.state === 'Processing' && seat.heldBy !== 'you';
            const isTargetGroup = REQUESTED_GROUP_SEATS.includes(seat.seatNumber);

            return (
              <div
                key={seat.id}
                className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1 min-h-[76px] ${
                  isYours
                    ? 'bg-[#F28C38] text-[#1B0F4A] border-2 border-[#1B0F4A] font-bold shadow-xs'
                    : isConfirmed
                    ? 'bg-[#E8F5E9] text-[#1F7A4D] border-2 border-[#1F7A4D] font-bold'
                    : isOtherProcessing
                    ? 'bg-[#FEF3C7] text-[#B45309] border-2 border-[#B45309]'
                    : isTargetGroup
                    ? 'bg-[#FBF8F4] text-[#1B0F4A] border-2 border-dashed border-[#1B0F4A]'
                    : 'bg-white text-[#534E62] border border-[#E7E1EA]'
                }`}
              >
                <div className="flex items-center justify-between w-full text-[10px]">
                  <span className="font-mono font-bold">#{seat.seatNumber}</span>
                  {isYours ? (
                    <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : isConfirmed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : isOtherProcessing ? (
                    <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  ) : (
                    <Unlock className="w-3 h-3 text-gray-400" aria-hidden="true" />
                  )}
                </div>

                <div className="text-[10px] uppercase font-bold tracking-tight">
                  {isYours ? 'Yours' : seat.state}
                </div>

                <span className="text-[9px] opacity-75 truncate max-w-full">
                  {seat.berthType}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Actions Deck */}
      <div className="railyug-card p-4 bg-[#FBF8F4] border border-[#E7E1EA] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Start booking */}
          <button
            type="button"
            disabled={isHolding || hold.status === 'Confirmed'}
            onClick={() => dispatch({ type: 'START_HOLD' })}
            className={`btn-cta text-xs py-2 px-3.5 shadow-xs ${
              isHolding || hold.status === 'Confirmed' ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-700' : ''
            }`}
          >
            <Play className="w-3.5 h-3.5 text-[#1B0F4A]" />
            <span>Start Booking (Hold 5 Seats)</span>
          </button>

          {/* Simulate another user */}
          <button
            type="button"
            onClick={() => dispatch({ type: 'OTHER_USER_CLAIM' })}
            className="btn-secondary text-xs py-2 px-3 bg-white"
            title="Simulate another passenger trying to hold the same seats simultaneously"
          >
            <Users className="w-3.5 h-3.5 text-[#7A2455]" />
            <span>Simulate Another User</span>
          </button>

          {/* Complete simulated payment */}
          {isHolding && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'PAY_HOLD' })}
              className="btn-primary text-xs py-2 px-3.5 shadow-xs bg-[#1F7A4D] hover:bg-[#165a38]"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Complete Simulated Payment</span>
            </button>
          )}

          {/* Let hold expire */}
          {isHolding && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'EXPIRE_HOLD' })}
              className="btn-secondary text-xs py-2 px-3 bg-white text-[#B3261E] border-[#B3261E]/40 hover:bg-[#FDECEA]"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Let Hold Expire</span>
            </button>
          )}
        </div>

        <span className="text-[11px] text-[#534E62]">
          All claims single check-and-set across seat set.
        </span>
      </div>
    </section>
  );
}
