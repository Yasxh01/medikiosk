import React from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceInputButton({ isListening, onClick, onStart, onStop, label }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (isListening) {
      if (onStop) onStop();
    } else {
      if (onStart) onStart();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`relative px-4 py-3 rounded-xl font-bold text-xs flex items-center space-x-2.5 transition-all duration-200 cursor-pointer active:scale-95 border ${
        isListening
          ? 'bg-rose-100 text-rose-900 border-rose-400 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-500/60 shadow-md animate-pulse'
          : 'bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-slate-700 text-blue-900 dark:text-cyan-300 border-blue-200 dark:border-slate-700 shadow-xs'
      }`}
    >
      {isListening ? (
        <>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
          </span>
          <MicOff className="w-4 h-4 text-rose-600 dark:text-rose-400 animate-bounce" />
          <span className="font-mono text-rose-900 dark:text-rose-200 font-bold">Listening...</span>
          <div className="flex items-center space-x-0.5 ml-1">
            <span className="w-1 h-3 bg-rose-600 dark:bg-rose-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]"></span>
            <span className="w-1 h-5 bg-rose-600 dark:bg-rose-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s]"></span>
            <span className="w-1 h-2 bg-rose-600 dark:bg-rose-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s]"></span>
          </div>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>{label || 'Tap to Speak'}</span>
        </>
      )}
    </button>
  );
}