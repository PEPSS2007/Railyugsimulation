'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { PassengerId } from '@/types';
import { Users, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export function SplitPlanner() {
  const { state, dispatch } = useRailyug();

  const handleGroupChange = (passengerId: PassengerId, group: 'Group 1' | 'Group 2') => {
    dispatch({ type: 'ASSIGN_SPLIT', passengerId, group });
  };

  const handleTestUnsafeSplit = () => {
    // Put P1 in Group 1 and P2 in Group 2
    dispatch({ type: 'ASSIGN_SPLIT', passengerId: 'P1', group: 'Group 1' });
    dispatch({ type: 'ASSIGN_SPLIT', passengerId: 'P2', group: 'Group 2' });
    dispatch({ type: 'ASSIGN_SPLIT', passengerId: 'P3', group: 'Group 1' });
    dispatch({ type: 'ASSIGN_SPLIT', passengerId: 'P4', group: 'Group 1' });
    dispatch({ type: 'ASSIGN_SPLIT', passengerId: 'P5', group: 'Group 1' });
    dispatch({ type: 'CHECK_SPLIT' });
  };

  const handleTestAllowedSplit = () => {
    // Put P5 in Group 2, all others in Group 1
    dispatch({ type: 'ASSIGN_SPLIT', passengerId: 'P1', group: 'Group 1' });
    dispatch({ type: 'ASSIGN_SPLIT', passengerId: 'P2', group: 'Group 1' });
    dispatch({ type: 'ASSIGN_SPLIT', passengerId: 'P3', group: 'Group 1' });
    dispatch({ type: 'ASSIGN_SPLIT', passengerId: 'P4', group: 'Group 1' });
    dispatch({ type: 'ASSIGN_SPLIT', passengerId: 'P5', group: 'Group 2' });
    dispatch({ type: 'CHECK_SPLIT' });
  };

  return (
    <section aria-labelledby="split-planner-heading" className="railyug-card p-5 space-y-4 bg-white border border-[#E7E1EA]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#7A2455]" aria-hidden="true" />
            <h2 id="split-planner-heading" className="font-heading text-base font-bold text-[#1B0F4A]">
              Family Group Split Planner &amp; Constraint Solver
            </h2>
          </div>
          <p className="text-xs text-[#534E62]">
            Assign travellers using accessible buttons/menus (no drag-and-drop). Tests caregiver protection and child guardian constraints.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleTestUnsafeSplit}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#B3261E] text-[#B3261E] bg-[#FDECEA] hover:bg-[#B3261E] hover:text-white transition-colors"
            title="Pre-fill P1 in Group 1 and P2 in Group 2 to test R1 block"
          >
            Try Unsafe Split (P1/P2 Separated)
          </button>
          <button
            type="button"
            onClick={handleTestAllowedSplit}
            className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#1F7A4D] text-[#1F7A4D] bg-[#E8F5E9] hover:bg-[#1F7A4D] hover:text-white transition-colors"
            title="Pre-fill P5 alone in Group 2 to see allowed trade-offs"
          >
            Try Allowed Split (P5 Solo)
          </button>
        </div>
      </div>

      {/* Interactive Passenger Assignment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        {state.passengers.map((pax) => {
          const currentGroup = state.splitAssignment[pax.id];
          return (
            <div
              key={pax.id}
              className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                currentGroup === 'Group 1'
                  ? 'border-[#1B0F4A] bg-[#1B0F4A]/5'
                  : 'border-[#7A2455] bg-[#7A2455]/5'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className="text-[#1B0F4A]">{pax.id}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    currentGroup === 'Group 1' ? 'bg-[#1B0F4A] text-white' : 'bg-[#7A2455] text-white'
                  }`}
                >
                  {currentGroup}
                </span>
              </div>
              <p className="text-[11px] text-[#534E62] truncate">{pax.role}</p>

              {/* Accessible Group Selection Segmented Control */}
              <div
                className="grid grid-cols-2 gap-1 pt-1"
                role="radiogroup"
                aria-label={`Assign group for passenger ${pax.id}`}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={currentGroup === 'Group 1'}
                  onClick={() => handleGroupChange(pax.id, 'Group 1')}
                  className={`py-1 px-2 rounded-md font-semibold text-center text-xs transition-colors ${
                    currentGroup === 'Group 1'
                      ? 'bg-[#1B0F4A] text-white shadow-xs'
                      : 'bg-white text-[#534E62] border border-[#E7E1EA] hover:bg-gray-50'
                  }`}
                >
                  Group 1
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={currentGroup === 'Group 2'}
                  onClick={() => handleGroupChange(pax.id, 'Group 2')}
                  className={`py-1 px-2 rounded-md font-semibold text-center text-xs transition-colors ${
                    currentGroup === 'Group 2'
                      ? 'bg-[#7A2455] text-white shadow-xs'
                      : 'bg-white text-[#534E62] border border-[#E7E1EA] hover:bg-gray-50'
                  }`}
                >
                  Group 2
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={() => dispatch({ type: 'CHECK_SPLIT' })}
          className="btn-primary text-xs py-2 px-4 shadow-xs"
        >
          <span>Check Split with Constraint Solver</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <span className="text-xs text-[#534E62]">
          Audit log automatically records every constraint verification.
        </span>
      </div>

      {/* Constraint Solver Result Panel */}
      {state.splitResult && (
        <div
          role={state.splitResult.allowed ? 'status' : 'alert'}
          className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
            state.splitResult.allowed
              ? 'bg-[#E8F5E9] border-[#1F7A4D] text-[#1B0F4A]'
              : 'bg-[#FDECEA] border-[#B3261E] text-[#B3261E]'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {state.splitResult.allowed ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#1F7A4D]" />
                <span className="text-[#1F7A4D] font-heading">Split Allowed: Constraints Satisfied</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-[#B3261E]" />
                <span className="text-[#B3261E] font-heading">
                  Blocked by Rule {state.splitResult.ruleViolated}
                </span>
              </>
            )}
          </div>

          {!state.splitResult.allowed ? (
            <div className="space-y-1.5 text-xs">
              <p className="font-semibold text-[#1B0F4A]">{state.splitResult.reason}</p>
              <div className="p-2.5 rounded-lg bg-white border border-[#B3261E]/40 font-medium text-[#1B0F4A]">
                <strong className="text-[#B3261E]">Suggested Fix: </strong>
                <span>{state.splitResult.fix}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-xs text-[#1B0F4A]">
              <p className="font-medium">{state.splitResult.tradeoffs}</p>
              <div className="flex items-center gap-4 pt-1 font-mono text-[11px] text-[#534E62]">
                <span>Group 1: <strong>{state.splitResult.group1Passengers?.join(', ') || 'None'}</strong></span>
                <span>Group 2: <strong>{state.splitResult.group2Passengers?.join(', ') || 'None'}</strong></span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
