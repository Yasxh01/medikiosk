import React from 'react';
import { Sparkles, Wind, Flame, Droplets, BookOpen } from 'lucide-react';

export default function PrakritiCard({ prakriti }) {
  if (!prakriti) return null;

  const vata = prakriti.scores?.VATA ?? 0;
  const pitta = prakriti.scores?.PITTA ?? 0;
  const kapha = prakriti.scores?.KAPHA ?? 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              AYUSH Dashavidha Phenotype
            </h4>
            <p className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">Tri-Dosha Algorithmic Balance</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 font-bold text-xs rounded-full font-mono">
          {prakriti.dominant || 'Tri-Doshic'}
        </span>
      </div>

      {/* Dosha Progress Score Cards */}
      <div className="grid grid-cols-3 gap-3">
        {/* VATA */}
        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1">
              <Wind className="w-3 h-3" /> VATA
            </span>
            <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">{vata}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${vata}%` }}
            />
          </div>
        </div>

        {/* PITTA */}
        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Flame className="w-3 h-3" /> PITTA
            </span>
            <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">{pitta}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${pitta}%` }}
            />
          </div>
        </div>

        {/* KAPHA */}
        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Droplets className="w-3 h-3" /> KAPHA
            </span>
            <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white">{kapha}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${kapha}%` }}
            />
          </div>
        </div>
      </div>

      {/* Agni & Koshtha */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 rounded-xl">
          <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Agni (Digestive Capacity):</span>
          <p className="font-semibold text-indigo-700 dark:text-indigo-300">{prakriti.agni || 'Sama Agni'}</p>
        </div>
        <div className="p-3 bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/60 rounded-xl">
          <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Koshtha (Bowel Habit):</span>
          <p className="font-semibold text-indigo-700 dark:text-indigo-300">{prakriti.koshtha || 'Madhyama Koshtha'}</p>
        </div>
      </div>

      {/* Recommendation */}
      {prakriti.recommendation && (
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 rounded-xl flex items-start space-x-2.5 text-xs text-indigo-950 dark:text-indigo-200">
          <BookOpen className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-indigo-800 dark:text-indigo-300 font-mono text-[11px] block">Ayurvedic Intake Suggestion:</strong>
            <p className="mt-0.5 text-slate-700 dark:text-slate-300 leading-relaxed">{prakriti.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}