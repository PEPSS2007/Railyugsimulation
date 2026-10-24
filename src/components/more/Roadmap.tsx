'use client';

import React from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';

export function Roadmap() {
  const roadmapItems = [
    {
      feature: 'Seat Sharing Marketplace',
      status: 'Roadmap (Tier 3)',
      reasonDeferred: 'Carries statutory railway tariff regulations. Unofficial monetization of booked berths is prohibited.',
    },
    {
      feature: 'Partial Seat-Sharing Requests',
      status: 'Roadmap (Tier 3)',
      reasonDeferred: 'Requires formal conductor (TTE) chart integration to prevent overlapping claims during night hours.',
    },
    {
      feature: 'Optional Passenger Compensation Offers',
      status: 'Roadmap (Tier 3)',
      reasonDeferred: 'Financial exchange between passengers for berth reallocation requires official railway tariff approval.',
    },
    {
      feature: 'Verified Passenger Identity Profiles',
      status: 'Roadmap (Tier 3)',
      reasonDeferred: 'Requires DigiLocker / Aadhaar identity authentication bridge to prevent ticket scalping and impersonation.',
    },
    {
      feature: 'RailCircle Passenger Community',
      status: 'Roadmap (Tier 3)',
      reasonDeferred: 'Public social networks on trains require moderation, privacy safeguards, and emergency distress escalation protocols.',
    },
    {
      feature: 'In-App Journey Chat & Social Feed',
      status: 'Roadmap (Tier 3)',
      reasonDeferred: 'Deferred to protect passenger privacy and prevent harassment during transit.',
    },
    {
      feature: 'Shared Cab / Last-Mile Carpooling',
      status: 'Roadmap (Tier 3)',
      reasonDeferred: 'Requires integration with local municipal transport unions and ride-hailing APIs at destination.',
    },
    {
      feature: 'Passenger Ratings & Reporting System',
      status: 'Roadmap (Tier 3)',
      reasonDeferred: 'Potential abuse vector for retaliatory reviews without verified on-board conduct monitoring.',
    },
    {
      feature: 'Privacy-Protected Contact Sharing',
      status: 'Roadmap (Tier 3)',
      reasonDeferred: 'Masked VoIP calling infrastructure required to shield passenger mobile numbers.',
    },
    {
      feature: 'Comprehensive Anti-Scalping Protection Suite',
      status: 'Roadmap (Tier 3 / Lite Active in Tatkal Hold)',
      reasonDeferred: 'Full bot-mitigation, CAPTCHA, and biometric verification belong to central ticketing infrastructure.',
    },
  ];

  return (
    <section aria-labelledby="roadmap-heading" className="railyug-card p-5 space-y-5 bg-white border border-[#E7E1EA]">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#7A2455]" aria-hidden="true" />
          <h2 id="roadmap-heading" className="font-heading text-lg font-bold text-[#1B0F4A]">
            Product Roadmap &amp; Statutory Compliance Framework
          </h2>
        </div>
        <p className="text-xs text-[#534E62]">
          Transparent declaration of deferred features, safety governance, and railway policy adherence.
        </p>
      </div>

      {/* Mandatory Statutory Compliance Notice */}
      <div className="p-4 rounded-xl bg-[#FEF3C7] border-2 border-[#FDBA4A] space-y-2">
        <div className="flex items-center gap-2 text-[#B45309] font-bold text-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>Statutory Railway Travel Compliance Notice</span>
        </div>
        <p className="text-xs text-[#1B0F4A] font-medium leading-relaxed">
          &ldquo;Seat swaps, paid exchanges, berth-sharing arrangements and ticket transfers must comply with applicable railway rules. Railyug can facilitate discovery and consent, but does not change a passenger&apos;s valid ticket or authorised berth assignment.&rdquo;
        </p>
        <p className="text-[11px] text-[#B45309]">
          Railyug is an advisory journey companion. All official ticketing transactions, berth assignments, and fare cancellations remain the exclusive domain of authorised railway administration channels.
        </p>
      </div>

      {/* Rationale for Deferrals */}
      <div className="p-4 rounded-xl bg-[#FBF8F4] border border-[#E7E1EA] space-y-2 text-xs">
        <h3 className="font-heading font-bold text-sm text-[#1B0F4A]">
          Why Marketplace &amp; Community Features Are Deliberately Deferred
        </h3>
        <p className="text-[#534E62] leading-relaxed">
          In hackathon projects, teams often build peer-to-peer berth exchanges or unmonitored passenger chat rooms without considering legal, physical safety, and fraud consequences. Railyug deliberately relegates financial compensation and unverified contact sharing to the roadmap. Our prototype focuses deeply on resilient living itineraries, deterministic accessibility guarantees, and algorithmic transparency.
        </p>
      </div>

      {/* Deferred Items Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E7E1EA]">
        <table className="w-full text-left text-xs border-collapse">
          <caption className="sr-only">Deferred product roadmap items and rationale</caption>
          <thead className="bg-[#FBF8F4] text-[#1B0F4A] border-b border-[#E7E1EA]">
            <tr>
              <th scope="col" className="p-3 font-heading font-bold">Roadmap Feature</th>
              <th scope="col" className="p-3 font-heading font-bold">Classification</th>
              <th scope="col" className="p-3 font-heading font-bold">Policy &amp; Trust Rationale for Deferral</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E1EA]">
            {roadmapItems.map((item, idx) => (
              <tr key={idx} className="hover:bg-[#FBF8F4]">
                <th scope="row" className="p-3 font-medium text-[#1B0F4A] whitespace-nowrap">
                  {item.feature}
                </th>
                <td className="p-3 whitespace-nowrap font-mono text-[11px] text-[#7A2455] font-semibold">
                  {item.status}
                </td>
                <td className="p-3 text-[#534E62]">{item.reasonDeferred}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
