'use client';

import React, { useState } from 'react';
import { useRailyug } from '@/state/store';
import { AlertTriangle, RotateCcw, ChevronDown, ChevronUp, Sparkles, Accessibility, Ban } from 'lucide-react';

export function DelayControls() {
  const { state, dispatch } = useRailyug();
  const [showMoreScenarios, setShowMoreScenarios] = useState(false);

  return (
    <section aria-labelledby="controls-heading" className="railyug-card p-4 space-y-3 bg-[#FBF8F4] border-[#E7E1EA]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 id="controls-heading" className="font-heading text-base font-bold text-[#1B0F4A]">
            Simulation Control Deck
          </h2>
          <p className="text-xs text-[#534E62]">
            Inject real-time disruption feed to test deterministic re-planning and constraint engines.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Primary Simulate 55-minute Delay Button */}
          <button
            type="button"
            disabled={state.delay.active}
            onClick={() => dispatch({ type: 'SIMULATE_DELAY' })}
            className={`btn-cta text-xs py-2 px-3.5 shadow-xs ${
              state.delay.active ? 'opacity-60 cursor-not-allowed bg-gray-300 text-gray-700' : ''
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-[#1B0F4A]" aria-hidden="true" />
            <span>
              {state.delay.active ? 'Delay Active (+55 min)' : 'Simulate 55-minute Delay'}
            </span>
          </button>

          {/* Reset Scenario Button */}
          {state.delay.active && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'RESET' })}
              className="btn-secondary text-xs py-2 px-3 bg-white"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#1B0F4A]" aria-hidden="true" />
              <span>Reset Scenario</span>
            </button>
          )}

          {/* More Scenarios Toggle */}
          <button
            type="button"
            onClick={() => setShowMoreScenarios(!showMoreScenarios)}
            className="btn-secondary text-xs py-2 px-2.5 bg-white text-[#534E62]"
            aria-expanded={showMoreScenarios}
          >
            <span>More Scenarios</span>
            {showMoreScenarios ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Secondary curveball controls */}
      {showMoreScenarios && (
        <div className="p-3 bg-white rounded-lg border border-[#E7E1EA] space-y-2 mt-2 text-xs">
          <p className="font-bold text-[#1B0F4A] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#7A2455]" />
            Optional Curveball Stress Tests (Section 11)
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => dispatch({ type: 'INJECT_SCENARIO', scenario: 'lift_out_of_service' })}
              className="btn-secondary text-xs py-1.5 px-2.5"
            >
              <Accessibility className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Lift Out of Service at Platform 9</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch({ type: 'INJECT_SCENARIO', scenario: 'alternative_disappears' })}
              className="btn-secondary text-xs py-1.5 px-2.5"
            >
              <Ban className="w-3.5 h-3.5 text-[#B3261E]" />
              <span>Alternative Disappears Mid-Selection</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
