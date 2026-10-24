'use client';

import React from 'react';
import { SourceBadgeType } from '@/types';
import { Shield, Users, TrendingUp } from 'lucide-react';

interface SourceBadgeProps {
  type: SourceBadgeType;
  text?: string;
  reportCount?: number;
  range?: string;
  className?: string;
}

export function SourceBadge({
  type,
  text,
  reportCount,
  range,
  className = '',
}: SourceBadgeProps) {
  if (type === 'OFFICIAL') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1B0F4A] text-white shadow-xs ${className}`}
        title="Simulated authoritative railway information"
      >
        <Shield className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>OFFICIAL</span>
        {text && <span className="opacity-90 font-normal">· {text}</span>}
      </span>
    );
  }

  if (type === 'CROWD') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-[#7A2455] text-[#7A2455] bg-white ${className}`}
        title="Passenger reports, advisory only"
      >
        <Users className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span>CROWD</span>
        {reportCount !== undefined && (
          <span className="font-normal opacity-90">({reportCount} reports)</span>
        )}
        {text && <span className="font-normal">· {text}</span>}
      </span>
    );
  }

  // PREDICTED
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border border-dashed border-[#1B0F4A] text-[#1B0F4A] bg-[#FBF8F4] ${className}`}
      title="Model estimate, always shows a range"
    >
      <TrendingUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>PREDICTED</span>
      {range && <span className="font-medium text-xs font-mono">[{range}]</span>}
      {text && <span className="font-normal">· {text}</span>}
    </span>
  );
}
