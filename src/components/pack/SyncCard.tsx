'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { RefreshCw, CheckCircle2, Clock } from 'lucide-react';

export function SyncCard() {
  const { state, dispatch } = useRailyug();
  const { pack } = state;

  return (
    <div className="railyug-card p-4 space-y-3 bg-[#FBF8F4] border border-[#E7E1EA]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#7A2455]" aria-hidden="true" />
            <h3 className="font-heading font-bold text-sm text-[#1B0F4A]">
              Offline Pack Synchronization Status
            </h3>
          </div>
          <p className="text-[11px] text-[#534E62]">
            Authoritative sync protocol: Newest official feed always wins. Local offline passenger notes are preserved as &ldquo;Pending review&rdquo;.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
              pack.syncStatus === 'synced'
                ? 'bg-[#E8F5E9] text-[#1F7A4D] border border-[#1F7A4D]/30'
                : 'bg-[#FEF3C7] text-[#B45309] border border-[#FDBA4A]'
            }`}
          >
            {pack.syncStatus === 'synced' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Synchronized ({pack.officialVersion})</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Review</span>
              </>
            )}
          </span>

          <button
            type="button"
            onClick={() => dispatch({ type: 'SYNC_PACK' })}
            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
            <span>Simulate Sync</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-2 border-t border-[#E7E1EA] text-[#534E62]">
        <span>Last Synced: <strong className="font-mono text-[#1B0F4A]">{pack.lastSyncTime}</strong></span>
        <span>Current Active Plan: <strong className="text-[#1B0F4A]">{pack.currentPlan}</strong></span>
        <span>Fallback: <strong className="text-[#7A2455]">{pack.fallbackPlan}</strong></span>
      </div>
    </div>
  );
}
