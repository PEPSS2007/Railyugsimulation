'use client';

import React from 'react';
import { RefundState } from '@/types';
import { ORDERED_REFUND_STATES } from '@/lib/refunds';
import { CheckCircle2, Clock } from 'lucide-react';

interface StateTrackerProps {
  currentState: RefundState;
}

export function StateTracker({ currentState }: StateTrackerProps) {
  const currentIndex = ORDERED_REFUND_STATES.indexOf(currentState);

  return (
    <div className="flex items-center gap-1 text-[11px] font-medium" role="group" aria-label={`Refund progress: currently at ${currentState}`}>
      {ORDERED_REFUND_STATES.map((step, idx) => {
        const isPassed = idx < currentIndex;
        const isCurrent = idx === currentIndex;

        return (
          <React.Fragment key={step}>
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap ${
                isCurrent
                  ? 'bg-[#1B0F4A] text-white font-bold'
                  : isPassed
                  ? 'bg-[#E8F5E9] text-[#1F7A4D]'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="w-3 h-3 text-[#1F7A4D]" />
              ) : isCurrent ? (
                <Clock className="w-3 h-3 text-[#FDBA4A] animate-pulse" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-gray-300" />
              )}
              <span>{step}</span>
            </div>

            {idx < ORDERED_REFUND_STATES.length - 1 && (
              <span className="text-gray-300 text-[10px]" aria-hidden="true">
                →
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
