'use client';

import React, { useState } from 'react';
import { RailyugProvider, useRailyug } from '@/state/store';
import { Sidebar } from '@/components/shell/Sidebar';
import { TopBar } from '@/components/shell/TopBar';
import { LiveRegion } from '@/components/shell/LiveRegion';

// Overview components
import { AlertBanner } from '@/components/overview/AlertBanner';
import { OverviewSummary } from '@/components/overview/OverviewSummary';
import { JourneyTimeline } from '@/components/overview/JourneyTimeline';
import { RiskMeter } from '@/components/overview/RiskMeter';
import { DelayControls } from '@/components/overview/DelayControls';

// Passengers components
import { PassengerCards } from '@/components/passengers/PassengerCards';
import { RulesPanel } from '@/components/passengers/RulesPanel';
import { SplitPlanner } from '@/components/passengers/SplitPlanner';
import { SwapConsent } from '@/components/passengers/SwapConsent';

// Plans components
import { PriorityPicker } from '@/components/plans/PriorityPicker';
import { PlanCard } from '@/components/plans/PlanCard';
import { DependencyTable } from '@/components/plans/DependencyTable';
import { WhyPanel } from '@/components/plans/WhyPanel';
import { ConsequenceDialog } from '@/components/plans/ConsequenceDialog';
import { HandoffModal } from '@/components/plans/HandoffModal';

// Tatkal components
import { HoldTimer } from '@/components/tatkal/HoldTimer';
import { SeatGrid } from '@/components/tatkal/SeatGrid';

// Refunds components
import { Ledger } from '@/components/refunds/Ledger';
import { Reconciliation } from '@/components/refunds/Reconciliation';

// Activity Log & Journey Pack components
import { ActivityLog } from '@/components/log/ActivityLog';
import { JourneyPackView } from '@/components/pack/JourneyPackView';

// More sections
import { Roadmap } from '@/components/more/Roadmap';
import { DataCardView } from '@/components/more/DataCardView';
import { SettingsView } from '@/components/more/SettingsView';

function MainApp() {
  const { state } = useRailyug();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getSectionTitle = () => {
    switch (state.activeSection) {
      case 'overview':
        return 'Journey Overview & Live Route Sequence';
      case 'passengers':
        return 'Passenger Profiles & Family Group Constraints';
      case 'plans':
        return 'Itinerary Plan Options & Strategic Ranking';
      case 'tatkal':
        return 'Tatkal Fair-Booking Hold (Anti-Scalping)';
      case 'refunds':
        return 'Four-Step Refund Ledger & Financial Reconciliation';
      case 'log':
        return 'Activity Trail & Append-Only Audit History';
      case 'pack':
        return 'Offline Journey Pack & Safe Data Synchronization';
      case 'roadmap':
        return 'Product Roadmap & Statutory Railway Compliance';
      case 'datacard':
        return 'Data Card & Simulation Model Assumptions';
      case 'settings':
        return 'Accessibility Settings & Legibility Options';
      default:
        return 'Your Railway Journey';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        state.settings.lowBandwidth ? 'low-bandwidth-mode' : ''
      } ${state.settings.reducedMotion ? 'reduced-motion-active' : ''} ${
        state.settings.largeText ? 'large-text-mode' : ''
      }`}
    >
      {/* Skip to Content link for keyboard accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Global ARIA live regions */}
      <LiveRegion />

      {/* Persistent Left Sidebar */}
      <Sidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top Bar */}
        <TopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        {/* Main Landmark Container */}
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Main Section Heading */}
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1B0F4A]">
              {getSectionTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-[#534E62]">
              Railyug — Tickets &amp; Comfort · IMPACTX 2026 Challenge 01 · All figures simulated
            </p>
          </div>

          {/* Section 1: Overview */}
          {state.activeSection === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <AlertBanner />
              <OverviewSummary />
              <JourneyTimeline />
              <RiskMeter />
              <DelayControls />
            </div>
          )}

          {/* Section 2: Passengers */}
          {state.activeSection === 'passengers' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <PassengerCards />
              <RulesPanel />
              <SplitPlanner />
              <SwapConsent />
            </div>
          )}

          {/* Section 3: Plan Options */}
          {state.activeSection === 'plans' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <PriorityPicker />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-lg font-bold text-[#1B0F4A]">
                    Candidate Living Itineraries
                  </h2>
                  <span className="text-xs text-[#534E62]">
                    Ranks updated dynamically under priority <strong>{state.priority.toUpperCase()}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {state.plans.map((plan) => (
                    <PlanCard key={plan.id} plan={plan} />
                  ))}
                </div>
              </div>

              <DependencyTable />
            </div>
          )}

          {/* Section 4: Tatkal Hold */}
          {state.activeSection === 'tatkal' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <HoldTimer />
              <SeatGrid />
            </div>
          )}

          {/* Section 5: Refunds */}
          {state.activeSection === 'refunds' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <Reconciliation />
              <Ledger />
            </div>
          )}

          {/* Section 6: Activity Log */}
          {state.activeSection === 'log' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <ActivityLog />
            </div>
          )}

          {/* Section 7: Journey Pack */}
          {state.activeSection === 'pack' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <JourneyPackView />
            </div>
          )}

          {/* More: Roadmap */}
          {state.activeSection === 'roadmap' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <Roadmap />
            </div>
          )}

          {/* More: Data Card */}
          {state.activeSection === 'datacard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <DataCardView />
            </div>
          )}

          {/* More: Settings */}
          {state.activeSection === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <SettingsView />
            </div>
          )}
        </main>

        {/* Global Modals */}
        <WhyPanel />
        <ConsequenceDialog />
        <HandoffModal />

        {/* Semantic Footer */}
        <footer className="mt-auto border-t border-[#E7E1EA] bg-white px-6 py-4 text-xs text-[#534E62]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-[#1B0F4A]">RAILYUG</span>
              <span className="text-[#7A2455] font-semibold">Tickets &amp; Comfort</span>
              <span>· IMPACTX 2026 Challenge 01 Prototype</span>
            </div>
            <p className="text-[11px] text-[#534E62] text-center sm:text-right">
              &ldquo;Simulated data only. Railyug does not book trains, cancel real tickets, or move money.&rdquo;
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <RailyugProvider>
      <MainApp />
    </RailyugProvider>
  );
}
