'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { Check, X, ShieldAlert, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

export function SwapConsent() {
  const { state, dispatch } = useRailyug();
  const { swapConsent } = state;

  return (
    <section aria-labelledby="swap-demo-heading" className="railyug-card p-5 space-y-4 bg-white border border-[#E7E1EA]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-[#7A2455]" aria-hidden="true" />
          <h2 id="swap-demo-heading" className="font-heading text-base font-bold text-[#1B0F4A]">
            Mutual-Consent Seat Swap Coordination (Lite Demo)
          </h2>
        </div>
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A2455] bg-[#7A2455]/10 px-2 py-0.5 rounded">
          Proximity Assistant
        </span>
      </div>

      <p className="text-xs text-[#534E62]">
        Demonstrates two-party digital handshake for informal seat proximity without altering official ticket records.
      </p>

      {/* Example Swap Request Card */}
      <div className="p-4 rounded-xl border border-[#E7E1EA] bg-[#FBF8F4] space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-[#E7E1EA]">
          <div className="text-xs">
            <span className="font-bold text-[#1B0F4A]">Request: </span>
            <span className="text-[#534E62]">Swap Seat 14 with Seat 31 so P3 (Child) sits near P2 (Caregiver) in Coach B2.</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#1B0F4A] border border-[#E7E1EA]">
              Coach B2
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#7A2455] border border-[#E7E1EA]">
              Proximity: Adjacent Bay
            </span>
          </div>
        </div>

        {/* Dual Consent Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Party 1: Family (P3 Guardian) */}
          <div className="p-3 bg-white rounded-lg border border-[#E7E1EA] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1B0F4A]">Family Party (Seat 14, Upper)</span>
              <span
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  swapConsent.p3Accepted ? 'text-[#1F7A4D]' : 'text-[#534E62]'
                }`}
              >
                {swapConsent.p3Accepted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accepted</span>
                  </>
                ) : (
                  <span>Pending</span>
                )}
              </span>
            </div>
            <p className="text-[11px] text-[#534E62]">Requests lower/closer seat to attend to child under five.</p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESPOND_SWAP', party: 'p3', accept: true })}
                disabled={swapConsent.p3Accepted}
                className={`text-xs py-1.5 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  swapConsent.p3Accepted
                    ? 'bg-[#E8F5E9] text-[#1F7A4D] cursor-default'
                    : 'bg-[#1B0F4A] text-white hover:opacity-90'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{swapConsent.p3Accepted ? 'Accepted' : 'Accept Request'}</span>
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESPOND_SWAP', party: 'p3', accept: false })}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-[#E7E1EA] text-[#534E62] hover:bg-gray-50"
              >
                <X className="w-3.5 h-3.5" />
                <span>Decline</span>
              </button>
            </div>
          </div>

          {/* Party 2: Fellow Passenger (Seat 31) */}
          <div className="p-3 bg-white rounded-lg border border-[#E7E1EA] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1B0F4A]">Fellow Traveller (Seat 31, Lower)</span>
              <span
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  swapConsent.targetAccepted ? 'text-[#1F7A4D]' : 'text-[#534E62]'
                }`}
              >
                {swapConsent.targetAccepted ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accepted</span>
                  </>
                ) : (
                  <span>Pending</span>
                )}
              </span>
            </div>
            <p className="text-[11px] text-[#534E62]">Simulated passenger profile: Comfortable with upper berth exchange.</p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESPOND_SWAP', party: 'target', accept: true })}
                disabled={swapConsent.targetAccepted}
                className={`text-xs py-1.5 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                  swapConsent.targetAccepted
                    ? 'bg-[#E8F5E9] text-[#1F7A4D] cursor-default'
                    : 'bg-[#7A2455] text-white hover:opacity-90'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{swapConsent.targetAccepted ? 'Accepted' : 'Simulate Consent'}</span>
              </button>
              <button
                type="button"
                onClick={() => dispatch({ type: 'RESPOND_SWAP', party: 'target', accept: false })}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-[#E7E1EA] text-[#534E62] hover:bg-gray-50"
              >
                <X className="w-3.5 h-3.5" />
                <span>Decline</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Mutual Status Line */}
        <div
          className={`p-2.5 rounded-lg text-xs font-bold flex items-center justify-between ${
            swapConsent.status === 'Mutual consent granted'
              ? 'bg-[#E8F5E9] text-[#1F7A4D] border border-[#1F7A4D]/30'
              : swapConsent.status === 'Declined'
              ? 'bg-[#FDECEA] text-[#B3261E] border border-[#B3261E]'
              : 'bg-[#FEF3C7] text-[#B45309] border border-[#FDBA4A]'
          }`}
        >
          <span>Mutual Swap Status: {swapConsent.status}</span>
          <span className="font-normal text-[11px]">
            {swapConsent.status === 'Mutual consent granted'
              ? 'Both travellers agreed. Swap coordinates upon boarding Coach B2.'
              : 'Awaiting affirmative mutual consent from both parties.'}
          </span>
        </div>
      </div>

      {/* Mandatory Official Railway Compliance Notice */}
      <div className="p-3 rounded-lg bg-[#FEF3C7] border border-[#FDBA4A] text-xs text-[#B45309] space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldAlert className="w-4 h-4 shrink-0 text-[#B45309]" />
          <span>Statutory Compliance Notice:</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          &ldquo;Seat swaps, paid exchanges, berth-sharing arrangements and ticket transfers must comply with applicable railway rules. Railyug can facilitate discovery and consent, but does not change a passenger&apos;s valid ticket or authorised berth assignment.&rdquo;
        </p>
      </div>
    </section>
  );
}
