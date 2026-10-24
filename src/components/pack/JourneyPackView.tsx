'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { SyncCard } from './SyncCard';
import { SourceBadge } from '@/components/shell/SourceBadge';
import {
  Briefcase,
  MapPin,
  Clock,
  Phone,
  Edit3,
} from 'lucide-react';

export function JourneyPackView() {
  const { state, dispatch } = useRailyug();
  const { pack } = state;

  return (
    <section aria-labelledby="journey-pack-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#7A2455]" aria-hidden="true" />
            <h2 id="journey-pack-heading" className="font-heading text-lg font-bold text-[#1B0F4A]">
              Offline-First Journey Pack &amp; Safe Sync
            </h2>
          </div>
          <p className="text-xs text-[#534E62]">
            Local-first cache preserved in browser. Accessible even during festival congestion and zero cell coverage.
          </p>
        </div>
        <SourceBadge type="OFFICIAL" text={pack.officialVersion} />
      </div>

      {/* Sync Status Card */}
      <SyncCard />

      {/* Family Coordination Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Family Meeting Point */}
        <div className="railyug-card p-4 space-y-2 bg-white border border-[#E7E1EA]">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1B0F4A] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#7A2455]" />
              <span>Family Meeting Point</span>
            </span>
            <SourceBadge type="OFFICIAL" text="v1.0" />
          </div>
          <p className="text-[#1B0F4A] font-semibold">{pack.meetingPoint}</p>
          <p className="text-[11px] text-[#534E62]">
            Accessible waiting area equipped with tactile guide paths and priority seating for older travellers and caregivers.
          </p>
        </div>

        {/* Expected Arrival & Fallback */}
        <div className="railyug-card p-4 space-y-2 bg-white border border-[#E7E1EA]">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1B0F4A] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#7A2455]" />
              <span>Expected Arrival &amp; Fallback</span>
            </span>
            <SourceBadge type="PREDICTED" range="17:30 to 18:50" />
          </div>
          <p className="text-[#1B0F4A] font-semibold">{pack.expectedArrival}</p>
          <p className="text-[11px] text-[#534E62]">
            Active fallback plan: <strong>{pack.fallbackPlan}</strong>
          </p>
        </div>
      </div>

      {/* Passenger Coach & Berth Allocation Table */}
      <div className="railyug-card p-4 bg-white border border-[#E7E1EA] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-[#1B0F4A]">
            Passenger Berths &amp; Entitlements
          </h3>
          <span className="text-xs text-[#534E62]">Local copy stamped {pack.officialVersion}</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E7E1EA]">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="sr-only">Passenger coach and berth assignments</caption>
            <thead className="bg-[#FBF8F4] text-[#1B0F4A] border-b border-[#E7E1EA]">
              <tr>
                <th scope="col" className="p-2.5 font-bold">Passenger</th>
                <th scope="col" className="p-2.5 font-bold">Coach &amp; Berth</th>
                <th scope="col" className="p-2.5 font-bold">Berth Type</th>
                <th scope="col" className="p-2.5 font-bold">Quota / Entitlement</th>
                <th scope="col" className="p-2.5 font-bold text-right">Source Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E1EA]">
              {pack.passengers.map((p) => (
                <tr key={p.id} className="hover:bg-[#FBF8F4]">
                  <th scope="row" className="p-2.5 font-bold text-[#1B0F4A]">
                    {p.label}
                  </th>
                  <td className="p-2.5 font-mono">
                    Coach {p.coach}, Berth #{p.berth}
                  </td>
                  <td className="p-2.5 text-[#534E62]">{p.berthType}</td>
                  <td className="p-2.5 font-medium text-[#7A2455]">{p.concession}</td>
                  <td className="p-2.5 text-right">
                    <SourceBadge type={p.source} text={p.version} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Emergency Contacts & Entitlements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Emergency Contacts (Fictional) */}
        <div className="railyug-card p-4 space-y-2 bg-white border border-[#E7E1EA]">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#1B0F4A] flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#7A2455]" />
              <span>Simulated Emergency Contacts</span>
            </span>
            <SourceBadge type="OFFICIAL" text="CJN Division" />
          </div>

          <div className="space-y-2 pt-1">
            {pack.contacts.map((contact, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#FBF8F4] border border-[#E7E1EA] space-y-0.5">
                <div className="flex items-center justify-between font-bold text-[#1B0F4A]">
                  <span>{contact.name}</span>
                  <span className="font-mono text-[#7A2455]">{contact.phone}</span>
                </div>
                <p className="text-[11px] text-[#534E62]">{contact.role} · {contact.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Local Offline Notes */}
        <div className="railyug-card p-4 space-y-2 bg-white border border-[#E7E1EA] flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1B0F4A] flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-[#7A2455]" />
                <span>Custom Offline Local Notes</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  pack.syncStatus === 'pending_review'
                    ? 'bg-[#FEF3C7] text-[#B45309]'
                    : 'bg-[#E8F5E9] text-[#1F7A4D]'
                }`}
              >
                {pack.syncStatus === 'pending_review' ? 'Status: Pending Review' : 'Status: Synced'}
              </span>
            </div>

            <p className="text-[11px] text-[#534E62]">
              Edit notes offline. During network sync, official data never deletes your custom local notes.
            </p>

            <textarea
              aria-label="Custom local notes"
              value={pack.localNotes}
              onChange={(e) => dispatch({ type: 'UPDATE_PACK_NOTES', notes: e.target.value })}
              rows={3}
              className="w-full p-2.5 rounded-lg border border-[#CDC4D3] text-xs text-[#1B0F4A] focus-visible:outline-none bg-white font-sans"
              placeholder="Add local coordination notes, sahayak tokens, luggage tips..."
            />
          </div>

          <p className="text-[10px] text-[#534E62] pt-1">
            Safe sync algorithm preserves this text block across official timetable updates.
          </p>
        </div>
      </div>
    </section>
  );
}
