import React, { useState } from 'react';
import { Check, Copy, X, Building2, ShieldCheck } from 'lucide-react';

export default function FHIR_Preview({ fhirPayload, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const entryCount = fhirPayload?.entry?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 font-mono">
      <div className="w-full max-w-3xl bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950 text-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-400/30">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white">
                  ABDM FHIR R4 Electronic Health Record (HL7 FHIR Bundle)
                </h3>
                <span className="px-2 py-0.2 rounded bg-amber-950 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40">
                  {entryCount} Resources
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                Interoperable Electronic Health Record Payload • NHA Validated
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCopy}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition flex items-center space-x-1.5 border cursor-pointer active:scale-95 ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy FHIR JSON'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950">
          <pre className="text-xs font-mono text-emerald-400 leading-relaxed overflow-x-auto selection:bg-emerald-500/30">
            {JSON.stringify(fhirPayload, null, 2)}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 border-t border-slate-800 bg-slate-950 flex justify-between items-center text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Standard: Ayushman Bharat Digital Mission (M1/M2/M3)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}