'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { CheckCircle2, Clock, AlertTriangle, Footprints } from 'lucide-react';

export function JourneyTimeline() {
  const { state } = useRailyug();

  const leg1Arrival = state.delay.active ? '12:15' : '11:20';
  const connectionFeasible = !state.delay.active;

  return (
    <section aria-labelledby="timeline-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 id="timeline-heading" className="font-heading text-lg font-bold text-[#1B0F4A]">
          Journey Route &amp; Transfer Sequence
        </h2>
        <span className="text-xs text-[#534E62]">
          Sample City A (SCA) → Central Junction (CJN) → Sample City B (SCB)
        </span>
      </div>

      {/* Visual Timeline Diagram (Hidden in Low Bandwidth mode) */}
      {!state.settings.lowBandwidth && (
        <div className="grid grid-cols-1 lg:grid-cols-11 items-stretch gap-3 railyug-card p-4 bg-white">
          {/* Leg 1 Card */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-[#FBF8F4] border border-[#E7E1EA] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#1B0F4A]/10 text-[#1B0F4A]">
                  LEG 1 · SIM-101
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#1F7A4D] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                  CONFIRMED
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base text-[#1B0F4A]">
                  Express 101
                </h3>
                <p className="text-xs text-[#534E62]">Sample City A (SCA) → Central Junction (CJN)</p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E7E1EA]">
                <div>
                  <span className="text-[#534E62] block">Departure:</span>
                  <strong className="text-sm font-mono text-[#1B0F4A]">06:00</strong>
                </div>
                <div className="text-right">
                  <span className="text-[#534E62] block">Arrival (Platform 2):</span>
                  <div className="flex items-center gap-1.5 justify-end">
                    {state.delay.active && (
                      <span className="line-through text-xs text-[#534E62] font-mono">11:20</span>
                    )}
                    <strong
                      className={`text-sm font-mono ${
                        state.delay.active ? 'text-[#B3261E] font-black' : 'text-[#1B0F4A]'
                      }`}
                    >
                      {leg1Arrival}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {state.delay.active && (
              <div className="mt-3 p-2 rounded-lg bg-[#FDECEA] border border-[#B3261E] text-xs text-[#B3261E] font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Delayed +55 min (Arrival updated to 12:15)</span>
              </div>
            )}
          </div>

          {/* Connection Node */}
          <div className="lg:col-span-3 flex flex-col justify-center items-center text-center p-3 rounded-xl border border-dashed border-[#CDC4D3] bg-[#FBF8F4]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A2455] mb-1">
              Central Junction (CJN)
            </span>

            <div
              className={`p-2.5 rounded-lg w-full mb-2 ${
                connectionFeasible
                  ? 'bg-[#E8F5E9] text-[#1F7A4D] border border-[#1F7A4D]/30'
                  : 'bg-[#FDECEA] text-[#B3261E] border border-[#B3261E]'
              }`}
            >
              <div className="text-xs font-bold flex items-center justify-center gap-1">
                {connectionFeasible ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Feasible (Margin +16m)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    <span>Connection Missed by 15m</span>
                  </>
                )}
              </div>
              <div className="text-[11px] font-mono font-medium mt-0.5">
                {state.delay.active ? 'Available: -15 min' : 'Scheduled: 40 min buffer'}
              </div>
            </div>

            <div className="text-xs text-[#534E62] space-y-1">
              <div className="flex items-center justify-center gap-1 font-medium text-[#1B0F4A]">
                <Footprints className="w-3.5 h-3.5 text-[#7A2455]" />
                <span>Platform 2 → Platform 9 (420m)</span>
              </div>
              <p className="text-[11px]">Required walk: 24 min (Range 21–29m)</p>
            </div>
          </div>

          {/* Leg 2 Card */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-[#FBF8F4] border border-[#E7E1EA] flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-[#1B0F4A]/10 text-[#1B0F4A]">
                  LEG 2 · SIM-202
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#B45309] bg-[#FEF3C7] px-2.5 py-0.5 rounded-full border border-[#FDBA4A]">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  WAITLISTED #14
                </span>
              </div>

              <div>
                <h3 className="font-heading font-bold text-base text-[#1B0F4A]">
                  Superfast 202
                </h3>
                <p className="text-xs text-[#534E62]">Central Junction (CJN) → Sample City B (SCB)</p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-[#E7E1EA]">
                <div>
                  <span className="text-[#534E62] block">Departure (Plat 9):</span>
                  <strong className="text-sm font-mono text-[#1B0F4A]">12:00</strong>
                  <span className="text-[10px] text-[#1F7A4D] font-bold block">(Not delayed)</span>
                </div>
                <div className="text-right">
                  <span className="text-[#534E62] block">Destination Arrival:</span>
                  <strong className="text-sm font-mono text-[#1B0F4A]">17:30</strong>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2 rounded-lg bg-white border border-[#E7E1EA] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[#534E62]">Waitlist Estimate:</span>
                <strong className="text-[#1B0F4A]">38% to 55%</strong>
              </div>
              <div className="text-[11px] text-[#534E62] flex items-center justify-between">
                <span>Synthetic sample: n = 214</span>
                <span className="text-[10px] uppercase font-semibold text-[#7A2455]">Not calibrated</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Text-Equivalent List (always rendered for screen-readers, visible in Low-Bandwidth mode) */}
      <div
        className={`${
          state.settings.lowBandwidth ? 'block' : 'sr-only focus-within:not-sr-only'
        } p-4 rounded-xl border border-[#777] bg-white text-xs space-y-3`}
        aria-label="Text equivalent itinerary timeline"
      >
        <p className="font-bold text-sm text-[#1B0F4A]">Itinerary Text Summary:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>Leg 1 (SIM-101):</strong> From Sample City A departing 06:00 to Central Junction. Scheduled arrival 11:20 (Platform 2). Status: CONFIRMED.
            {state.delay.active && (
              <span className="text-[#B3261E] font-bold ml-1">
                [DELAYED: +55 min. Arrival now 12:15].
              </span>
            )}
          </li>
          <li>
            <strong>Transfer at Central Junction (CJN):</strong> Scheduled gap 40 minutes (11:20 to 12:00). Platform change 2 to 9, distance 420 meters. Required walking time for group: 24 minutes (range 21 to 29 min).
            {state.delay.active ? (
              <span className="text-[#B3261E] font-bold ml-1">
                [STATUS: INFEASIBLE. Train 1 arrives 12:15, after SIM-202 departs at 12:00. Connection missed by 15 minutes].
              </span>
            ) : (
              <span className="text-[#1F7A4D] font-bold ml-1">
                [STATUS: FEASIBLE. Connection margin: +16 minutes].
              </span>
            )}
          </li>
          <li>
            <strong>Leg 2 (SIM-202):</strong> From Central Junction departing 12:00 (Platform 9, on time) to Sample City B arriving 17:30. Status: WAITLISTED #14 (estimated confirmation 38% to 55%, n = 214 synthetic cases, synthetic not calibrated).
          </li>
        </ol>
      </div>
    </section>
  );
}
