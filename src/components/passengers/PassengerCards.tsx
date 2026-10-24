'use client';

import React from 'react';
import { useRailyug } from '@/state/store';
import { ShieldCheck, Heart, UserCheck, Baby, Eye, User, Link as LinkIcon } from 'lucide-react';

export function PassengerCards() {
  const { state } = useRailyug();

  const getRoleIcon = (id: string) => {
    switch (id) {
      case 'P1':
        return Heart;
      case 'P2':
        return UserCheck;
      case 'P3':
        return Baby;
      case 'P4':
        return Eye;
      default:
        return User;
    }
  };

  return (
    <section aria-labelledby="passengers-list-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="passengers-list-heading" className="font-heading text-lg font-bold text-[#1B0F4A]">
            Passenger Profiles &amp; Needs
          </h2>
          <p className="text-xs text-[#534E62]">
            Fictional anonymous profiles. Zero medical detail, no names or sensitive demographics.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#E8F5E9] text-[#1F7A4D] border border-[#1F7A4D]/30 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active In-Flight Party</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {state.passengers.map((pax) => {
          const Icon = getRoleIcon(pax.id);
          return (
            <div
              key={pax.id}
              className="railyug-card p-4 space-y-3 bg-white border border-[#E7E1EA] flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-[#1B0F4A] text-white">
                    {pax.id}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      pax.accessibilityStatus === 'Known'
                        ? 'bg-[#E8F5E9] text-[#1F7A4D]'
                        : pax.accessibilityStatus === 'Partly known'
                        ? 'bg-[#FEF3C7] text-[#B45309]'
                        : 'bg-[#FDECEA] text-[#B3261E]'
                    }`}
                  >
                    Accessibility: {pax.accessibilityStatus}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-[#FBF8F4] border border-[#E7E1EA] text-[#7A2455] shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-[#1B0F4A]">
                      {pax.role}
                    </h3>
                    <p className="text-xs text-[#534E62] mt-0.5">{pax.needs}</p>
                  </div>
                </div>

                {pax.linkedPassengerId && (
                  <div className="p-2 rounded-lg bg-[#FBF8F4] border border-[#1F7A4D]/30 flex items-center gap-2 text-xs text-[#1F7A4D] font-semibold">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Hard Rule R1: Travels strictly linked with {pax.linkedPassengerId}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#E7E1EA] text-xs space-y-1 text-[#534E62]">
                <div className="flex justify-between">
                  <span>Walking Pace:</span>
                  <strong className="text-[#1B0F4A] font-mono">{pax.walkingSpeed} m/s</strong>
                </div>
                <div className="flex justify-between">
                  <span>Leg 1 Berth:</span>
                  <span className="text-[#1B0F4A] font-mono font-medium">{pax.coachBerth.leg1}</span>
                </div>
                <div className="flex justify-between">
                  <span>Leg 2 Status:</span>
                  <span className="font-mono font-bold text-[#B45309]">{pax.coachBerth.leg2Status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
