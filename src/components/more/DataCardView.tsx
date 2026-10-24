'use client';

import React from 'react';
import { DATA_CARD_DATA } from '@/data/dataCard';
import { FileSpreadsheet } from 'lucide-react';

export function DataCardView() {
  return (
    <section aria-labelledby="datacard-heading" className="railyug-card p-5 space-y-5 bg-white border border-[#E7E1EA]">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#7A2455]" aria-hidden="true" />
          <h2 id="datacard-heading" className="font-heading text-lg font-bold text-[#1B0F4A]">
            Data Card &amp; Engineering Assumptions
          </h2>
        </div>
        <p className="text-xs text-[#534E62]">
          Full disclosure of dataset origin, statistical uncertainty formulations, and deterministic simulation boundaries.
        </p>
      </div>

      <div className="space-y-5">
        {DATA_CARD_DATA.map((section, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-[#E7E1EA] bg-[#FBF8F4] space-y-3 text-xs">
            <div className="border-b border-[#E7E1EA] pb-2">
              <h3 className="font-heading font-bold text-sm text-[#1B0F4A]">
                {section.title}
              </h3>
              <p className="text-[11px] text-[#534E62] mt-0.5">{section.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="p-3 bg-white rounded-lg border border-[#E7E1EA] space-y-1">
                  <span className="font-bold text-[#1B0F4A] block">{item.key}</span>
                  <div className="font-mono text-[11px] text-[#7A2455] font-medium">{item.value}</div>
                  <p className="text-[11px] text-[#534E62] pt-1 border-t border-gray-100">
                    <strong>Model Logic: </strong> {item.assumption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
