'use client';

import React, { useEffect, useRef } from 'react';
import { useRailyug } from '@/state/store';
import {
  AlertTriangle,
  Receipt,
  Clock,
  CheckCircle,
  ExternalLink,
  X,
} from 'lucide-react';

export function ConsequenceDialog() {
  const { state, dispatch } = useRailyug();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const pendingPlan = state.plans.find((p) => p.id === state.pendingPlanId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'CANCEL_PREVIEW' });
      }
    };
    if (state.consequenceDialogOpen) {
      window.addEventListener('keydown', handleKeyDown);
      confirmButtonRef.current?.focus();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.consequenceDialogOpen, dispatch]);

  if (!state.consequenceDialogOpen || !pendingPlan) {
    return null;
  }

  const extraCost = pendingPlan.extraCost;
  const refundAmount = 5560; // Leg 2 refund
  const netFinancialImpact = extraCost - refundAmount;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consequence-dialog-title"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E7E1EA] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-[#FBF8F4] border-b border-[#E7E1EA] flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A2455] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#F28C38]" />
              <span>Consequence Preview &amp; Impact Analysis</span>
            </span>
            <h2 id="consequence-dialog-title" className="font-heading font-extrabold text-lg text-[#1B0F4A]">
              Switch to {pendingPlan.name}?
            </h2>
            <p className="text-xs text-[#534E62]">
              Carefully review what changes, what is lost, and the automatic refund pipeline before confirming.
            </p>
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: 'CANCEL_PREVIEW' })}
            className="p-1 rounded-lg text-[#534E62] hover:bg-gray-200 focus-visible:outline-none"
            aria-label="Cancel preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* 1. What Changes */}
          <div className="p-3 rounded-xl bg-white border border-[#E7E1EA] space-y-2">
            <strong className="text-xs font-heading font-bold text-[#1B0F4A] block">
              1. Journey Adjustments &amp; What Changes:
            </strong>
            <ul className="space-y-1.5 text-[#534E62] list-disc pl-4">
              <li>
                <strong>Connecting Leg:</strong> Switches from waitlisted SIM-202 (12:00) to confirmed {pendingPlan.trains[1] || 'alternative'} departing Central Junction.
              </li>
              <li>
                <strong>Arrival Time:</strong> Destination arrival moves to <strong>{pendingPlan.expectedArrival}</strong> (Range {pendingPlan.arrivalRange.min} to {pendingPlan.arrivalRange.max}).
              </li>
              <li>
                <strong>Passengers:</strong> All 5 family members travel together; caregiver and guardian rules preserved.
              </li>
            </ul>
          </div>

          {/* 2. What is Lost & Cancellation Impact */}
          <div className="p-3 rounded-xl bg-[#FDECEA] border border-[#B3261E]/30 space-y-2">
            <strong className="text-xs font-heading font-bold text-[#B3261E] block">
              2. What is Forfeited / Lost:
            </strong>
            <ul className="space-y-1.5 text-[#1B0F4A] list-disc pl-4">
              <li>
                Waitlist position (#14 to #18) on Superfast 202 is permanently cancelled.
              </li>
              <li>
                Simulated clerkage fee of ₹60 per paying passenger (₹240 total) deducted from Leg 2 fare.
              </li>
            </ul>
          </div>

          {/* 3. Financial & Refund Reconciliation */}
          <div className="p-3 rounded-xl bg-[#E8F5E9] border border-[#1F7A4D]/30 space-y-2">
            <strong className="text-xs font-heading font-bold text-[#1F7A4D] flex items-center gap-1.5">
              <Receipt className="w-4 h-4" />
              <span>3. Financial &amp; Refund Ledger Breakdown (Simulated):</span>
            </strong>
            <div className="grid grid-cols-3 gap-2 font-mono text-center pt-1">
              <div className="p-2 bg-white rounded-lg border border-[#E7E1EA]">
                <span className="text-[10px] text-[#534E62] block">New Fare</span>
                <strong className="text-xs text-[#1B0F4A]">+₹{extraCost.toLocaleString()}</strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-[#E7E1EA]">
                <span className="text-[10px] text-[#534E62] block">Leg 2 Refund</span>
                <strong className="text-xs text-[#1F7A4D] font-bold">−₹{refundAmount.toLocaleString()}</strong>
              </div>
              <div className="p-2 bg-white rounded-lg border border-[#E7E1EA]">
                <span className="text-[10px] text-[#534E62] block">Net Difference</span>
                <strong className="text-xs text-[#1B0F4A]">
                  {netFinancialImpact >= 0 ? `+₹${netFinancialImpact.toLocaleString()}` : `−₹${Math.abs(netFinancialImpact).toLocaleString()}`}
                </strong>
              </div>
            </div>
            <p className="text-[11px] text-[#1F7A4D] font-medium">
              Confirming automatically initiates 5 ledger refund components totaling exactly ₹5,560 in Section 5.
            </p>
          </div>

          {/* 4. Cutoff Deadline */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FEF3C7] border border-[#FDBA4A] text-[#B45309]">
            <Clock className="w-4 h-4 shrink-0" />
            <span>
              <strong>Decision Deadline: </strong> 11:45 at Central Junction (45 minutes prior to SIM-303 departure).
            </span>
          </div>

          {/* Official Handoff Disclaimer */}
          <div className="p-3 bg-[#FBF8F4] rounded-lg border border-[#CDC4D3] text-[11px] text-[#534E62] space-y-1.5">
            <p className="font-semibold text-[#1B0F4A]">
              Note on Authorised Railway Booking:
            </p>
            <p>
              &ldquo;Confirm in Railyug&rdquo; records the strategic decision in your simulation state. Actual ticketing transactions, seat reservations, and payments must be completed through the official IRCTC portal or counter.
            </p>
            <button
              type="button"
              onClick={() => dispatch({ type: 'TOGGLE_HANDOFF_MODAL', open: true })}
              className="text-[#7A2455] font-bold underline inline-flex items-center gap-1 hover:text-[#1B0F4A]"
            >
              <span>View Official Channel Handoff Summary</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#FBF8F4] border-t border-[#E7E1EA] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => dispatch({ type: 'CANCEL_PREVIEW' })}
            className="btn-secondary text-xs py-2 px-4 w-full sm:w-auto"
          >
            Cancel
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            onClick={() => dispatch({ type: 'CONFIRM_PLAN', planId: pendingPlan.id })}
            className="btn-cta text-xs py-2 px-5 w-full sm:w-auto shadow-sm"
          >
            <CheckCircle className="w-4 h-4 text-[#1B0F4A]" />
            <span>Confirm in Railyug (Record Decision)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
