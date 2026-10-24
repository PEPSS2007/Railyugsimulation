'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { reconcileLedger } from '@/lib/refunds';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Reconciliation() {
  const { state } = useRailyug();
  const report = reconcileLedger(state.refundLedger);

  return (
    <div className="railyug-card p-4 space-y-3 bg-[#FBF8F4] border border-[#E7E1EA]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#1F7A4D]" aria-hidden="true" />
          <h3 className="font-heading font-bold text-sm text-[#1B0F4A]">
            Financial Audit &amp; Ledger Reconciliation Card
          </h3>
        </div>

        <span
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
            report.isReconciled
              ? 'bg-[#E8F5E9] text-[#1F7A4D] border border-[#1F7A4D]/30'
              : 'bg-[#FDECEA] text-[#B3261E] border border-[#B3261E]'
          }`}
        >
          {report.isReconciled ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>{report.statusText}</span>
        </span>
      </div>

      <p className="text-xs text-[#534E62]">
        {report.summaryMessage}
      </p>

      {/* Numerical breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 bg-white rounded-lg border border-[#E7E1EA]">
          <span className="text-[10px] text-[#534E62] block">Total Refundable</span>
          <strong className="text-sm font-mono text-[#1B0F4A]">
            ₹{report.totalSum.toLocaleString()}
          </strong>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-[#E7E1EA]">
          <span className="text-[10px] text-[#534E62] block">Expected Fixture</span>
          <strong className="text-sm font-mono text-[#1B0F4A]">
            ₹{report.expectedSum.toLocaleString()}
          </strong>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-[#E7E1EA]">
          <span className="text-[10px] text-[#534E62] block">Variance / Mismatch</span>
          <strong
            className={`text-sm font-mono ${
              report.difference === 0 ? 'text-[#1F7A4D]' : 'text-[#B3261E]'
            }`}
          >
            ₹{report.difference}
          </strong>
        </div>

        <div className="p-2.5 bg-white rounded-lg border border-[#E7E1EA]">
          <span className="text-[10px] text-[#534E62] block">Duplicate Check</span>
          <strong
            className={`text-sm ${
              report.duplicateIdsFound.length === 0 ? 'text-[#1F7A4D]' : 'text-[#B3261E]'
            }`}
          >
            {report.duplicateIdsFound.length === 0 ? '0 Duplicates' : `${report.duplicateIdsFound.length} Found`}
          </strong>
        </div>
      </div>
    </div>
  );
}
