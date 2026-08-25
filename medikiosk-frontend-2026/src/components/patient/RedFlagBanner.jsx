import React from 'react';
import { AlertOctagon, Flame } from 'lucide-react';

export default function RedFlagBanner({ redFlags = [] }) {
  if (!redFlags || redFlags.length === 0) return null;

  return (
    <div className="rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/50 p-4 mb-6 text-rose-900 dark:text-rose-200 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-rose-100 dark:bg-rose-900/80 rounded-xl text-rose-600 dark:text-rose-300 flex-shrink-0">
            <AlertOctagon className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-mono font-bold text-[10px] uppercase tracking-wider border border-rose-300 dark:border-rose-500/40">
                Priority Red Flag
              </span>
              <span className="text-xs font-bold">Immediate Triage Recommended</span>
            </div>
            <p className="text-xs mt-1 font-medium leading-relaxed">
              Detected emergency clinical pattern: <strong className="underline decoration-rose-400">{redFlags.join(', ')}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-900/50 text-xs font-bold text-rose-800 dark:text-rose-200 flex-shrink-0">
          <Flame className="w-3.5 h-3.5 text-rose-600" />
          <span>Priority Queue Assigned</span>
        </div>
      </div>
    </div>
  );
}