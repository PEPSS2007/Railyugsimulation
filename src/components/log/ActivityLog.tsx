'use client';

import React, { useState } from 'react';
import { useRailyug } from '@/state/store';
import { AuditEvent } from '@/types';
import { FileText, Filter, Clock } from 'lucide-react';

export function ActivityLog() {
  const { state } = useRailyug();
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const filterCategories = [
    'ALL',
    'Scenario',
    'Disruption',
    'Ranking',
    'Safety',
    'Selection',
    'Hold',
    'Refund',
    'Sync',
  ];

  const filteredEvents = state.events.filter((evt) => {
    if (selectedFilter === 'ALL') return true;
    return evt.type === selectedFilter;
  });

  const getEventBadgeColor = (type: AuditEvent['type']) => {
    switch (type) {
      case 'Disruption':
        return 'bg-[#FDECEA] text-[#B3261E] border-[#B3261E]/30';
      case 'Safety':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#FDBA4A]';
      case 'Selection':
        return 'bg-[#E8F5E9] text-[#1F7A4D] border-[#1F7A4D]/30';
      case 'Ranking':
        return 'bg-[#1B0F4A]/10 text-[#1B0F4A] border-[#1B0F4A]/20';
      case 'Hold':
        return 'bg-[#7A2455]/10 text-[#7A2455] border-[#7A2455]/20';
      case 'Refund':
        return 'bg-[#E8F5E9] text-[#1F7A4D] border-[#1F7A4D]/30';
      default:
        return 'bg-gray-100 text-[#534E62] border-gray-300';
    }
  };

  return (
    <section aria-labelledby="activity-log-heading" className="railyug-card p-5 space-y-4 bg-white border border-[#E7E1EA]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E7E1EA] pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#7A2455]" aria-hidden="true" />
            <h2 id="activity-log-heading" className="font-heading text-lg font-bold text-[#1B0F4A]">
              Append-Only Audit Trail &amp; Decision History
            </h2>
          </div>
          <p className="text-xs text-[#534E62]">
            Immutable chronological event log. Every state transition, disruption, rule check and calculation is preserved.
          </p>
        </div>

        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#FBF8F4] text-[#1B0F4A] border border-[#E7E1EA]">
          Total Events: <strong>{state.events.length}</strong>
        </span>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filter audit events by category">
        <span className="text-xs font-semibold text-[#534E62] flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </span>
        {filterCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedFilter(cat)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedFilter === cat
                ? 'bg-[#1B0F4A] text-white'
                : 'bg-[#FBF8F4] text-[#534E62] border border-[#E7E1EA] hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Append-only Event List (Newest First) */}
      <div className="space-y-2.5 pt-1" aria-live="polite">
        {filteredEvents.length === 0 ? (
          <div className="p-4 text-center text-xs text-[#534E62] bg-[#FBF8F4] rounded-xl border border-[#E7E1EA]">
            No audit events found under &ldquo;{selectedFilter}&rdquo;.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-xl border border-[#E7E1EA] bg-[#FBF8F4] hover:bg-white transition-all space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${getEventBadgeColor(
                      evt.type
                    )}`}
                  >
                    {evt.type}
                  </span>
                  <span className="font-mono font-bold text-[#1B0F4A]">{evt.id}</span>
                </div>

                <div className="flex items-center gap-3 text-[#534E62] font-mono text-[11px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#7A2455]" />
                    <span>{evt.at} Simulated</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white border border-[#E7E1EA]">
                    {evt.ruleVersion}
                  </span>
                  {evt.planVersion && (
                    <span className="px-1.5 py-0.5 rounded bg-white border border-[#E7E1EA]">
                      {evt.planVersion}
                    </span>
                  )}
                </div>
              </div>

              <p className="font-bold text-[#1B0F4A] text-sm">{evt.description}</p>
              <p className="text-[#534E62] text-xs">
                <strong>Recorded Reason: </strong> {evt.reason}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
