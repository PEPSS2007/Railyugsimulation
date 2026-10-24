'use client';

import React, { useEffect, useRef } from 'react';
import { useRailyug } from '@/state/store';
import { Copy, Check, X, Train } from 'lucide-react';

export function HandoffModal() {
  const { state, dispatch } = useRailyug();
  const [copied, setCopied] = React.useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch({ type: 'TOGGLE_HANDOFF_MODAL', open: false });
      }
    };
    if (state.handoffModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      closeButtonRef.current?.focus();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.handoffModalOpen, dispatch]);

  if (!state.handoffModalOpen) return null;

  const summaryText = `RAILYUG JOURNEY RE-ROUTE HANDOFF SUMMARY:
Train: SIM-303 (Coach C1)
Origin: Central Junction (CJN) -> Destination: Sample City B (SCB)
Passengers: 5 travellers (P1 Lower Berth / Step-free priority, P2 Caregiver, P3 Child under 5, P4 Screen-reader user, P5 Adult)
Refund Tracking: Leg 2 cancellation of SIM-202 (₹5,560 refund initiated)
Generated for official IRCTC ticketing / Station PRS counter.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="handoff-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full border border-[#E7E1EA] shadow-2xl p-5 space-y-4 text-xs animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between border-b border-[#E7E1EA] pb-3">
          <div className="flex items-center gap-2">
            <Train className="w-5 h-5 text-[#1B0F4A]" />
            <div>
              <h2 id="handoff-title" className="font-heading font-bold text-base text-[#1B0F4A]">
                Authorised Railway Channel Handoff
              </h2>
              <p className="text-[11px] text-[#534E62]">
                Prepared booking &amp; quota request package for official ticketing portal.
              </p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_HANDOFF_MODAL', open: false })}
            className="p-1 rounded text-gray-500 hover:bg-gray-100"
            aria-label="Close handoff summary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-[#FBF8F4] rounded-xl border border-[#E7E1EA] space-y-2 font-mono text-[11px]">
          <pre className="whitespace-pre-wrap font-sans text-xs text-[#1B0F4A] leading-relaxed">
            {summaryText}
          </pre>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#1F7A4D]" />
                <span className="text-[#1F7A4D] font-bold">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#1B0F4A]" />
                <span>Copy Handoff Package</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => dispatch({ type: 'TOGGLE_HANDOFF_MODAL', open: false })}
            className="btn-primary text-xs py-2 px-4"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
