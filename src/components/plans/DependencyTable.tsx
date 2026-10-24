'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { evaluateLegDependencies } from '@/lib/dependency';
import { Table, CheckCircle2, Clock } from 'lucide-react';

export function DependencyTable() {
  const { state } = useRailyug();
  const evaluation = evaluateLegDependencies(state.delay.active);

  return (
    <section aria-labelledby="dependency-table-heading" className="railyug-card p-5 space-y-4 bg-white border border-[#E7E1EA]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Table className="w-5 h-5 text-[#7A2455]" aria-hidden="true" />
          <h2 id="dependency-table-heading" className="font-heading text-base font-bold text-[#1B0F4A]">
            Leg Coupling &amp; Strategy Dependency Table
          </h2>
        </div>
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-[#FBF8F4] text-[#1B0F4A] border border-[#E7E1EA]">
          {evaluation.ruleVersion}
        </span>
      </div>

      <p className="text-xs text-[#534E62]">
        {evaluation.summary}
      </p>

      {/* Table with proper semantic HTML, caption, th scope */}
      <div className="overflow-x-auto rounded-xl border border-[#E7E1EA]">
        <table className="w-full text-left text-xs border-collapse">
          <caption className="sr-only">
            Strategic decision matrix comparing Keep Leg 1, Cancel Leg 1, and Re-route
          </caption>
          <thead className="bg-[#FBF8F4] text-[#1B0F4A] border-b border-[#E7E1EA]">
            <tr>
              <th scope="col" className="p-3 font-heading font-bold">Strategy Option</th>
              <th scope="col" className="p-3 font-heading font-bold">Expected Cost</th>
              <th scope="col" className="p-3 font-heading font-bold">Chance Family Arrives</th>
              <th scope="col" className="p-3 font-heading font-bold">Worst Case Outcome</th>
              <th scope="col" className="p-3 font-heading font-bold">Decision Deadline</th>
              <th scope="col" className="p-3 font-heading font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E1EA]">
            {evaluation.rows.map((row, idx) => (
              <tr
                key={idx}
                className={
                  row.status === 'Recommended'
                    ? 'bg-[#E8F5E9]/30 font-medium'
                    : row.status === 'Not available'
                    ? 'bg-gray-50 opacity-60'
                    : 'hover:bg-[#FBF8F4]'
                }
              >
                <th scope="row" className="p-3 font-heading font-bold text-[#1B0F4A] whitespace-nowrap">
                  <div>{row.strategy}</div>
                  <div className="text-[10px] font-sans font-normal text-[#534E62] max-w-[200px]">
                    {row.assumptionNote}
                  </div>
                </th>
                <td className="p-3 font-mono text-[#1B0F4A]">{row.expectedCost}</td>
                <td className="p-3 font-mono font-medium text-[#7A2455]">{row.chanceFamilyArrives}</td>
                <td className="p-3 text-[#534E62] max-w-[220px]">{row.worstCase}</td>
                <td className="p-3 font-mono text-[#B45309] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{row.decisionDeadline}</span>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      row.status === 'Recommended'
                        ? 'bg-[#E8F5E9] text-[#1F7A4D] border border-[#1F7A4D]/30'
                        : row.status === 'Not available'
                        ? 'bg-[#FDECEA] text-[#B3261E] border border-[#B3261E]/30'
                        : 'bg-[#FEF3C7] text-[#B45309] border border-[#FDBA4A]'
                    }`}
                  >
                    {row.status === 'Recommended' && <CheckCircle2 className="w-3 h-3" />}
                    <span>{row.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
