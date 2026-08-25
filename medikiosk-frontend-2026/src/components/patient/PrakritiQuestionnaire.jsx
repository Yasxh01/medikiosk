import React, { useState } from 'react';
import { mockPrakritiQuestions } from '../../api/mockData';
import { Check, Sparkles, Flame, Wind, Droplets, ArrowRight } from 'lucide-react';

export default function PrakritiQuestionnaire({ onComplete }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleSelect = (questionId, dosha) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: dosha });
  };

  const isAllAnswered = Object.keys(selectedAnswers).length === mockPrakritiQuestions.length;

  const calculatePrakriti = () => {
    const counts = { VATA: 0, PITTA: 0, KAPHA: 0 };
    Object.values(selectedAnswers).forEach((dosha) => {
      counts[dosha] = (counts[dosha] || 0) + 1;
    });

    const total = Object.values(selectedAnswers).length || 1;
    const scores = {
      VATA: Math.round((counts.VATA / total) * 100),
      PITTA: Math.round((counts.PITTA / total) * 100),
      KAPHA: Math.round((counts.KAPHA / total) * 100),
    };

    let dominant = 'Tridosha';
    if (scores.VATA >= 45) dominant = 'Vata Dominant';
    if (scores.PITTA >= 45) dominant = 'Pitta Dominant';
    if (scores.KAPHA >= 45) dominant = 'Kapha Dominant';
    if (scores.VATA >= 35 && scores.PITTA >= 35) dominant = 'Vata-Pitta';

    onComplete({
      dominant,
      scores,
      agni: 'Visham Agni',
      koshtha: 'Krura Koshtha',
    });
  };

  const getDoshaIcon = (dosha) => {
    if (dosha === 'VATA') return <Wind className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />;
    if (dosha === 'PITTA') return <Flame className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />;
    return <Droplets className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />;
  };

  const getDoshaSelectedClasses = (dosha) => {
    if (dosha === 'VATA') return 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-950 dark:text-sky-100 shadow-sm dark:shadow-[0_0_15px_rgba(56,189,248,0.25)]';
    if (dosha === 'PITTA') return 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-950 dark:text-amber-100 shadow-sm dark:shadow-[0_0_15px_rgba(245,158,11,0.25)]';
    return 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.25)]';
  };

  return (
    <div className="space-y-6">
      {/* AYUSH Protocol Header */}
      <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Ministry of AYUSH • Dashavidha Pariksha
          </span>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            {Object.keys(selectedAnswers).length} of {mockPrakritiQuestions.length} Answered
          </span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">Prakriti & Dosha Phenotyping Engine</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Algorithmic assessment of baseline bio-energetic constitution, Agni metabolic capacity, and Koshtha motility.
        </p>
      </div>

      {/* Questions Stack */}
      <div className="space-y-4">
        {mockPrakritiQuestions.map((q, index) => (
          <div
            key={q.id}
            className="p-5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm dark:shadow-inner"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-500/30 px-2 py-0.5 rounded-md">
                Parameter 0{index + 1}: {q.category}
              </span>
              {selectedAnswers[q.id] && (
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                  <Check className="w-3 h-3" /> Selected
                </span>
              )}
            </div>
            
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{q.question}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
              {q.options.map((opt) => {
                const isSelected = selectedAnswers[q.id] === opt.dosha;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(q.id, opt.dosha)}
                    className={`p-3.5 rounded-xl border text-left text-xs transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? `${getDoshaSelectedClasses(opt.dosha)} font-semibold scale-[1.01]`
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                        {getDoshaIcon(opt.dosha)}
                        <span>{opt.dosha}</span>
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white dark:text-[#090d16] flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] leading-relaxed opacity-90">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Compute Button */}
      <button
        type="button"
        disabled={!isAllAnswered}
        onClick={calculatePrakriti}
        className={`w-full py-4 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all duration-200 border ${
          isAllAnswered
            ? 'bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white shadow-md dark:shadow-[0_0_25px_rgba(16,185,129,0.35)] border-emerald-400/40 cursor-pointer active:scale-[0.99]'
            : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
        }`}
      >
        <span>Compute Prakriti Scoring Matrix & Proceed</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}