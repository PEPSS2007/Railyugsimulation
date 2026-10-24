'use client';

import React, { useState } from 'react';
import { useRailyug } from '@/state/store';
import { StateTracker } from './StateTracker';
import { previewCancellationImpact } from '@/lib/refunds';
import { PassengerId } from '@/types';
import { Receipt, AlertTriangle, Info } from 'lucide-react';

export function Ledger() {
  const { state, dispatch } = useRailyug();
  const [selectedPaxToCancel, setSelectedPaxToCancel] = useState<PassengerId>('P2');
  const [showImpactPreview, setShowImpactPreview] = useState(false);

  const impact = previewCancellationImpact(selectedPaxToCancel, 'L2 (SIM-202)');

  return (
    <section aria-labelledby="refunds-ledger-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#7A2455]" aria-hidden="true" />
            <h2 id="refunds-ledger-heading" className="font-heading text-lg font-bold text-[#1B0F4A]">
              Passenger-Wise &amp; Leg-Wise Refund Ledger
            </h2>
          </div>
          <p className="text-xs text-[#534E62]">
            Deterministic four-stage pipeline tracking every cancelled berth component.
          </p>
        </div>

        {/* Cancellation impact preview button */}
        <button
          type="button"
          onClick={() => setShowImpactPreview(!showImpactPreview)}
          className="btn-secondary text-xs py-1.5 px-3 bg-white"
        >
          <Info className="w-3.5 h-3.5 text-[#7A2455]" />
          <span>{showImpactPreview ? 'Hide Cancellation Impact Tool' : 'Test Cancellation Impact'}</span>
        </button>
      </div>

      {/* Cancellation Impact Preview Box */}
      {showImpactPreview && (
        <div className="p-4 rounded-xl border border-[#E7E1EA] bg-[#FBF8F4] space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E7E1EA] pb-2">
            <span className="font-bold text-[#1B0F4A]">
              Interactive Cancellation Impact Calculator:
            </span>
            <div className="flex items-center gap-2">
              <label htmlFor="cancel-pax-select" className="text-[#534E62]">Select Passenger:</label>
              <select
                id="cancel-pax-select"
                value={selectedPaxToCancel}
                onChange={(e) => setSelectedPaxToCancel(e.target.value as PassengerId)}
                className="py-1 px-2 rounded-md border border-[#CDC4D3] bg-white font-bold text-[#1B0F4A]"
              >
                <option value="P1">P1 (Older Passenger)</option>
                <option value="P2">P2 (Caregiver)</option>
                <option value="P3">P3 (Child Under Five)</option>
                <option value="P4">P4 (Screen-Reader User)</option>
                <option value="P5">P5 (Flexible Adult)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-2.5 bg-white rounded-lg border border-[#E7E1EA]">
              <span className="text-[10px] text-[#534E62] block">Party Fare Before</span>
              <strong className="text-xs font-mono text-[#1B0F4A]">₹{impact.fareBefore.toLocaleString()}</strong>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E7E1EA]">
              <span className="text-[10px] text-[#534E62] block">Refund Generated</span>
              <strong className="text-xs font-mono text-[#1F7A4D]">
                +₹{impact.refundGenerated.toLocaleString()} (₹{impact.clerkageDeducted} clerkage deducted)
              </strong>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-[#E7E1EA]">
              <span className="text-[10px] text-[#534E62] block">Remaining Party Fare</span>
              <strong className="text-xs font-mono text-[#1B0F4A]">₹{impact.fareAfter.toLocaleString()}</strong>
            </div>
          </div>

          {impact.safetyWarning && (
            <div className="p-2.5 rounded-lg bg-[#FDECEA] border border-[#B3261E]/40 text-[#B3261E] font-medium flex items-start gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{impact.safetyWarning}</span>
            </div>
          )}
        </div>
      )}

      {/* Ledger Table */}
      <div className="railyug-card bg-white border border-[#E7E1EA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="p-3 text-left text-xs font-medium text-[#534E62] bg-[#FBF8F4] border-b border-[#E7E1EA]">
              Simulated amounts. No real money moves. All component transitions strictly ordered.
            </caption>
            <thead className="bg-[#FBF8F4] text-[#1B0F4A] border-b border-[#E7E1EA]">
              <tr>
                <th scope="col" className="p-3 font-heading font-bold">Component ID</th>
                <th scope="col" className="p-3 font-heading font-bold">Passenger</th>
                <th scope="col" className="p-3 font-heading font-bold">Leg</th>
                <th scope="col" className="p-3 font-heading font-bold">Simulated Amount</th>
                <th scope="col" className="p-3 font-heading font-bold">Four-Step Refund State</th>
                <th scope="col" className="p-3 font-heading font-bold">Last Updated</th>
                <th scope="col" className="p-3 font-heading font-bold text-right">Advance Step</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E1EA]">
              {state.refundLedger.map((row) => {
                const isFinal = row.refundState === 'Final credit';
                return (
                  <tr key={row.id} className="hover:bg-[#FBF8F4] transition-colors">
                    <th scope="row" className="p-3 font-mono font-bold text-[#1B0F4A] whitespace-nowrap">
                      {row.id}
                    </th>
                    <td className="p-3 whitespace-nowrap font-medium text-[#1B0F4A]">
                      {row.passengerId}
                    </td>
                    <td className="p-3 whitespace-nowrap text-[#534E62]">
                      {row.legId}
                    </td>
                    <td className="p-3 whitespace-nowrap font-mono">
                      <span className="font-bold text-[#1B0F4A]">₹{row.refundAmount.toLocaleString()}</span>
                      {row.clerkage > 0 && (
                        <span className="text-[10px] text-[#534E62] block">
                          (Fare ₹{row.fare} − ₹{row.clerkage} clerkage)
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <StateTracker currentState={row.refundState} />
                    </td>
                    <td className="p-3 font-mono text-[11px] text-[#534E62] whitespace-nowrap">
                      {row.lastUpdated}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        disabled={isFinal}
                        onClick={() => dispatch({ type: 'ADVANCE_REFUND', componentId: row.id })}
                        className={`text-xs py-1 px-2.5 rounded-md font-semibold transition-colors ${
                          isFinal
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'btn-secondary bg-white hover:bg-[#1B0F4A] hover:text-white'
                        }`}
                        title={isFinal ? 'Terminal state reached' : 'Advance exactly one state'}
                      >
                        {isFinal ? 'Completed' : 'Advance Step'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
