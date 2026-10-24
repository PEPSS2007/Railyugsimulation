'use client';

import React from 'react';
import { useRailyug } from '@/state/store';

export function LiveRegion() {
  const { state } = useRailyug();

  const isAlert =
    state.liveAnnouncement.includes('delayed') ||
    state.liveAnnouncement.includes('missed') ||
    state.liveAnnouncement.includes('BLOCKED') ||
    state.liveAnnouncement.includes('rejected') ||
    state.liveAnnouncement.includes('violation');

  return (
    <>
      {/* Polite live region for general updates and countdown milestones */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="railyug-live-announcer"
      >
        {!isAlert && state.liveAnnouncement}
      </div>

      {/* High-priority alert live region for disruptions and constraint blocks */}
      <div
        role="alert"
        aria-atomic="true"
        className="sr-only"
        id="railyug-critical-alert"
      >
        {isAlert && state.liveAnnouncement}
      </div>
    </>
  );
}
