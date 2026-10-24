'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { PriorityPreset } from '@/types';
import { Sliders, Sparkles, Scale, DollarSign, Zap, Shield } from 'lucide-react';

export function PriorityPicker() {
  const { state, dispatch } = useRailyug();

  const presets: Array<{
    id: PriorityPreset;
    label: string;
    description: string;
    icon: React.ElementType;
    weights: string;
  }> = [
    {
      id: 'balanced',
      label: 'Balanced',
      description: 'Default trade-off balancing step-free safety, timing and budget.',
      icon: Scale,
      weights: 'Arr 30% · Rel 10% · Trf 15% · Cnf 20% · Cost 25%',
    },
    {
      id: 'cost',
      label: 'Lowest Cost',
      description: 'Prioritizes minimal extra fare expenditure.',
      icon: DollarSign,
      weights: 'Cost 50% · Cnf 25% · Trf 10% · Arr 10% · Rel 5%',
    },
    {
      id: 'fastest',
      label: 'Fastest Arrival',
      description: 'Prioritizes earliest destination arrival time.',
      icon: Zap,
      weights: 'Arr 50% · Cnf 20% · Trf 15% · Rel 10% · Cost 5%',
    },
    {
      id: 'risk',
      label: 'Lowest Risk',
      description: 'Maximizes transfer margins and confirmed seating.',
      icon: Shield,
      weights: 'Trf 30% · Cnf 30% · Rel 25% · Arr 10% · Cost 5%',
    },
  ];

  return (
    <section aria-labelledby="priority-heading" className="railyug-card p-4 space-y-3 bg-[#FBF8F4] border-[#E7E1EA]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#7A2455]" aria-hidden="true" />
          <h2 id="priority-heading" className="font-heading text-base font-bold text-[#1B0F4A]">
            Itinerary Ranking Priorities
          </h2>
        </div>
        <span className="text-xs text-[#534E62]">
          Fixed tie-breakers guarantee deterministic output across repeated runs.
        </span>
      </div>

      {/* Preset Radio Buttons */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5"
        role="radiogroup"
        aria-label="Itinerary ranking priority preset"
      >
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isSelected = state.priority === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => dispatch({ type: 'SET_PRIORITY', priority: preset.id })}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#1B0F4A] ring-2 ring-[#1B0F4A] shadow-xs'
                  : 'bg-white/70 border-[#E7E1EA] hover:bg-white hover:border-[#CDC4D3]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs text-[#1B0F4A] flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F28C38]' : 'text-[#7A2455]'}`} />
                    <span>{preset.label}</span>
                  </span>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-[#1B0F4A] bg-[#1B0F4A]' : 'border-gray-400'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[11px] text-[#534E62] leading-tight">{preset.description}</p>
              </div>

              <div className="pt-2 text-[10px] font-mono text-[#7A2455] font-semibold border-t border-[#E7E1EA] mt-2">
                {preset.weights}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Rank Diff Explanation Banner */}
      {state.rankDiffExplanation && (
        <div
          role="status"
          className="p-2.5 rounded-lg bg-[#FEF3C7] border border-[#FDBA4A] text-xs text-[#B45309] font-medium flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 shrink-0 text-[#B45309]" />
          <span>
            <strong>Ranking Shift: </strong>
            {state.rankDiffExplanation}
          </span>
        </div>
      )}
    </section>
  );
}
