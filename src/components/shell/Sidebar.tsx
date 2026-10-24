'use client';

import React from 'react';
import Image from 'next/image';
import { useRailyug } from '@/state/store';
import {
  Compass,
  Users,
  Route,
  Lock,
  Receipt,
  FileText,
  Briefcase,
  HelpCircle,
  FileSpreadsheet,
  Settings as SettingsIcon,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const { state, dispatch } = useRailyug();

  const navItems = [
    { id: 'overview', label: '1. Overview', icon: Compass, badge: state.delay.active ? '1 Alert' : undefined, badgeColor: 'bg-[#B3261E]' },
    { id: 'passengers', label: '2. Passengers & Rules', icon: Users },
    { id: 'plans', label: '3. Plan Options', icon: Route },
    { id: 'tatkal', label: '4. Tatkal Hold', icon: Lock, badge: state.hold.status === 'Processing' ? 'Holding' : undefined, badgeColor: 'bg-[#B45309]' },
    { id: 'refunds', label: '5. Refunds Ledger', icon: Receipt },
    { id: 'log', label: '6. Activity Log', icon: FileText, badge: `${state.events.length}` },
    { id: 'pack', label: '7. Journey Pack', icon: Briefcase },
  ];

  const moreItems = [
    { id: 'roadmap', label: 'Roadmap & Compliance', icon: HelpCircle },
    { id: 'datacard', label: 'Data Card & Assumptions', icon: FileSpreadsheet },
    { id: 'settings', label: 'Accessibility & Settings', icon: SettingsIcon },
  ];

  const handleNavClick = (sectionId: string) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', section: sectionId });
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        id="main-sidebar"
        aria-label="Main Navigation"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#1B0F4A] text-white flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header with Brand Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!state.settings.lowBandwidth ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 p-1 flex items-center justify-center shrink-0 border border-white/20">
                <Image
                  src="/logo.png"
                  alt="Railyug Logo Mark"
                  width={36}
                  height={36}
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <span className="logo-text-fallback font-bold text-amber-300 font-mono text-xl">
                [RY]
              </span>
            )}

            <div>
              <div className="font-heading font-extrabold text-base tracking-wider text-white">
                RAILYUG
              </div>
              <div className="text-[11px] font-semibold text-[#FDBA4A] tracking-wider uppercase">
                Tickets &amp; Comfort
              </div>
            </div>
          </div>

          {/* Close mobile menu button */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-white/80 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Main">
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
              Demo Path Sections
            </div>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = state.activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#F28C38] text-[#1B0F4A] font-bold shadow-xs'
                          : 'text-white/85 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-[#1B0F4A]' : 'text-[#FDBA4A]'
                          }`}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.label}</span>
                      </span>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-[#1B0F4A] text-white'
                              : item.badgeColor
                              ? `${item.badgeColor} text-white`
                              : 'bg-white/20 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* More Sections */}
          <div>
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-white/50">
              Honesty &amp; Context
            </div>
            <ul className="space-y-1">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = state.activeSection === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#F28C38] text-[#1B0F4A] font-bold'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-white/60 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer Status */}
        <div className="p-3 border-t border-white/10 bg-[#140b37] text-xs space-y-1.5">
          <div className="flex items-center justify-between text-white/70">
            <span>Clock:</span>
            <span className="font-mono font-bold text-white">{state.clock}</span>
          </div>
          <div className="flex items-center justify-between text-white/70">
            <span>Disruption:</span>
            <span className={state.delay.active ? 'text-amber-400 font-bold' : 'text-emerald-400 font-medium'}>
              {state.delay.active ? '+55 min Delay' : 'On Schedule'}
            </span>
          </div>
          <div className="pt-1 text-[10px] text-white/40 border-t border-white/10">
            IMPACTX 2026 · Challenge 01
          </div>
        </div>
      </aside>
    </>
  );
}
