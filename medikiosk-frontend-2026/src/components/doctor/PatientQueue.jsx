import React, { useState } from 'react';
import { Clock, AlertOctagon, Users, Search, ChevronRight } from 'lucide-react';

export default function PatientQueue({ queue = [], selectedId, onSelect }) {
  const [filterMode, setFilterMode] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQueue = queue.filter((pat) => {
    const matchesSearch = pat.name.toLowerCase().includes(searchQuery.toLowerCase()) || pat.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterMode === 'RED_FLAG') return matchesSearch && pat.urgency === 'RED_FLAG';
    if (filterMode === 'ROUTINE') return matchesSearch && pat.urgency !== 'RED_FLAG';
    return matchesSearch;
  });

  return (
    <div className="p-4 flex flex-col h-full space-y-3.5 bg-white dark:bg-slate-900 font-mono transition-colors">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-400/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <Users className="w-4 h-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight">
              OPD Consultation Queue
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Live Hospital Outpatient Triage</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 text-[11px] font-bold rounded border border-cyan-300 dark:border-cyan-500/40">
          {queue.length} Active
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search token or patient name..."
          className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-md text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 focus:outline-none transition font-mono"
        />
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 text-[10px]">
        <button
          type="button"
          onClick={() => setFilterMode('ALL')}
          className={`flex-1 py-1 rounded transition cursor-pointer font-bold text-center border ${
            filterMode === 'ALL'
              ? 'bg-cyan-600 text-white border-cyan-400/40 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          All ({queue.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('RED_FLAG')}
          className={`flex-1 py-1 rounded transition cursor-pointer font-bold text-center border ${
            filterMode === 'RED_FLAG'
              ? 'bg-rose-600 text-white border-rose-400/40 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-rose-600 dark:hover:text-rose-400'
          }`}
        >
          STAT Red-Flag
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('ROUTINE')}
          className={`flex-1 py-1 rounded transition cursor-pointer font-bold text-center border ${
            filterMode === 'ROUTINE'
              ? 'bg-emerald-600 text-white border-emerald-400/40 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400'
          }`}
        >
          Routine OPD
        </button>
      </div>

      {/* Queue List */}
      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        {filteredQueue.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400">
            No matching patient records found
          </div>
        ) : (
          filteredQueue.map((pat) => {
            const isSelected = selectedId === pat.id;
            const isRed = pat.urgency === 'RED_FLAG';
            return (
              <button
                key={pat.id}
                onClick={() => onSelect(pat)}
                className={`w-full text-left p-3 rounded-lg border transition-all relative group cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 shadow-sm'
                    : isRed
                    ? 'border-rose-300 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 hover:border-rose-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Selected Bar */}
                {isSelected && (
                  <div className="absolute left-0 inset-y-2 w-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-r" />
                )}

                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-black px-1.5 py-0.2 rounded ${
                    isRed 
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700'
                  }`}>
                    {pat.tokenNumber}
                  </span>
                  
                  {isRed ? (
                    <span className="px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-bold text-[10px] rounded flex items-center">
                      <AlertOctagon className="w-3 h-3 mr-1 text-rose-600 dark:text-rose-400" /> STAT
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" /> {pat.arrivalTime}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      {pat.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {pat.age} Yrs • {pat.gender} • <span className="text-cyan-600 dark:text-cyan-400 font-semibold">{pat.abhaId}</span>
                    </p>
                  </div>
                  
                  <ChevronRight className={`w-4 h-4 transition text-slate-400 ${isSelected ? 'text-cyan-600 dark:text-cyan-400' : 'opacity-0 group-hover:opacity-100'}`} />
                </div>
              </button>
            );
          })
        )}
      </div>

    </div>
  );
}