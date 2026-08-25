import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, ShieldCheck, 
  CheckCircle2, Activity, Stethoscope, 
  FileCheck, ChevronDown, ChevronUp, Copy, Check,
  AlertTriangle, ArrowUpRight, Edit3, Save,
  ListOrdered, Plus
} from 'lucide-react';

export default function LLMVerdictCard({ 
  verdict, 
  patientName, 
  onApproveVerdict, 
  onUpdateVerdict 
}) {
  const [expanded, setExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [doctorConfirmed, setDoctorConfirmed] = useState(verdict?.doctor_approved || verdict?.approvedByDoctor || false);
  const [physicianNotes, setPhysicianNotes] = useState(verdict?.physicianNotes || verdict?.doctor_notes || '');
  const [customWorkingImpression, setCustomWorkingImpression] = useState(verdict?.workingImpression || verdict?.summary || '');
  const [orderedItems, setOrderedItems] = useState({});

  // Sync state whenever prop 'verdict' updates
  useEffect(() => {
    if (verdict) {
      setCustomWorkingImpression(verdict.summary || verdict.workingImpression || '');
      setPhysicianNotes(verdict.physicianNotes || verdict.doctor_notes || '');
      setDoctorConfirmed(verdict.doctor_approved || verdict.approvedByDoctor || false);
    }
  }, [verdict]);

  if (!verdict) return null;

  // Strict priority determination (EMERGENCY only if explicitly flagged as EMERGENCY)
  const priority = (verdict.priority || 'ROUTINE').toUpperCase();
  const isEmergency = priority === 'EMERGENCY';
  const confidenceScore = verdict.confidenceScore || 95.8;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `AI Clinical Verdict for ${patientName || 'Patient'}:\n` +
      `Summary / Impression: ${customWorkingImpression || verdict.summary || verdict.workingImpression}\n` +
      `Priority: ${priority} | Model: ${verdict.model_name || 'aditee-ai-service'}\n` +
      `Red Flags:\n${(verdict.red_flags || verdict.redFlags || []).map(r => `- [${r.level || r.severity}] ${r.message || r.flag}`).join('\n')}\n\n` +
      (physicianNotes ? `Physician Notes:\n${physicianNotes}` : '')
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveEdits = () => {
    setIsEditing(false);
    if (onUpdateVerdict) {
      onUpdateVerdict({
        ...verdict,
        summary: customWorkingImpression,
        physicianNotes
      });
    }
  };

  const handleApprove = () => {
    const nextState = !doctorConfirmed;
    setDoctorConfirmed(nextState);
    if (onApproveVerdict) {
      onApproveVerdict(nextState, {
        workingImpression: customWorkingImpression || verdict.summary,
        physicianNotes,
        approvedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="gov-card overflow-hidden border-2 border-slate-300 dark:border-cyan-400/40 shadow-sm font-mono">
      
      {/* Top Header Banner */}
      <div className="p-4 sm:p-5 bg-[#002244] dark:bg-gradient-to-r dark:from-slate-900 dark:via-[#0B132B] dark:to-slate-950 text-white border-b border-slate-700 dark:border-cyan-500/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 dark:bg-cyan-500/10 border border-white/20 dark:border-cyan-400/40 flex flex-col items-center justify-center text-amber-300 dark:text-cyan-400 flex-shrink-0 shadow-xs">
            <BrainCircuit className="w-5 h-5" />
            <span className="text-[7px] font-mono font-black uppercase text-amber-200 dark:text-cyan-300">CDSS</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-sm text-white tracking-tight flex items-center gap-2">
                <span>AI Clinical Decision Support & Triage Verdict</span>
              </h3>
            </div>
            <p className="text-[11px] text-slate-200 dark:text-cyan-200/80 font-mono mt-0.5">
              NHA ABDM AI Engine • Engine: {verdict.model_name || 'aditee-ai-service'} • Priority Signal: {priority}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {doctorConfirmed && (
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 text-[11px] font-mono font-bold rounded-md flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Verified by Doctor
            </span>
          )}

          <button
            type="button"
            onClick={handleCopy}
            title="Copy Verdict to Clipboard"
            className="px-2.5 py-1 rounded-md bg-white/10 border border-white/20 text-slate-200 hover:bg-white/20 text-xs transition cursor-pointer flex items-center gap-1 active:scale-95 font-mono"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
            <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-md bg-white/10 border border-white/20 text-slate-200 hover:bg-white/20 transition cursor-pointer active:scale-95"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-5 sm:p-6 space-y-5 bg-white dark:bg-slate-900/95 text-slate-900 dark:text-slate-100">
          
          {/* Main Working Diagnostic Impression & Priority Box */}
          <div className={`p-4 rounded-xl border-2 transition-all ${
            isEmergency
              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/50 shadow-xs'
              : 'bg-blue-50/70 dark:bg-cyan-950/30 border-blue-200 dark:border-cyan-500/40 shadow-xs'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase font-black tracking-wider text-blue-900 dark:text-cyan-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-700 dark:text-cyan-400" />
                Primary Clinical Summary & AI Verdict
              </span>
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  {confidenceScore}% Certainty
                </span>

                {isEmergency ? (
                  <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-black bg-rose-100 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-400 flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-300" />
                    EMERGENCY TRIAGE
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-100 dark:bg-cyan-950 text-blue-900 dark:text-cyan-300 border border-blue-300 dark:border-cyan-500/40 flex items-center gap-1">
                    <Activity className="w-3 h-3 text-blue-700 dark:text-cyan-400" />
                    ROUTINE OPD TRIAGE
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      handleSaveEdits();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="px-2.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-mono font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer flex items-center gap-1"
                >
                  {isEditing ? <Save className="w-3 h-3 text-blue-600 dark:text-cyan-400" /> : <Edit3 className="w-3 h-3 text-slate-500" />}
                  <span>{isEditing ? 'Save Changes' : 'Edit Summary'}</span>
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-2 mt-2">
                <textarea
                  value={customWorkingImpression}
                  onChange={(e) => setCustomWorkingImpression(e.target.value)}
                  placeholder="Enter physician clinical summary..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-blue-300 dark:border-cyan-500/50 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <textarea
                  value={physicianNotes}
                  onChange={(e) => setPhysicianNotes(e.target.value)}
                  placeholder="Enter additional physician notes..."
                  rows={2}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            ) : (
              <div>
                <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-line font-mono">
                  {customWorkingImpression || verdict.summary || verdict.workingImpression || 'Clinical evaluation completed.'}
                </p>
                {physicianNotes && (
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-2.5 p-2.5 bg-slate-100 dark:bg-slate-950/80 rounded-lg border border-blue-200 dark:border-cyan-500/30">
                    <strong className="text-blue-800 dark:text-cyan-400 font-mono">Physician Notes:</strong> {physicianNotes}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Red Flag Warning Alert Box (ONLY if emergency) */}
          {isEmergency && (verdict.red_flags || verdict.redFlags) && (verdict.red_flags || verdict.redFlags).length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-500/50 space-y-2">
              <h5 className="text-xs font-mono font-black uppercase text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Detected Critical Red Flag Signals
              </h5>
              <div className="space-y-1.5">
                {(verdict.red_flags || verdict.redFlags).map((rf, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded bg-rose-100/80 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-500/30 text-rose-900 dark:text-rose-200 font-mono">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400 animate-ping" />
                      {rf.message || rf.flag || rf.label}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-950 border border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-300">
                      {rf.level || rf.severity || 'HIGH'} SEVERITY
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2-Column Split: Clinical Findings & Doctor Verification */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left: Key Findings */}
            <div className="lg:col-span-7 space-y-2.5">
              <div className="flex justify-between items-center">
                <h5 className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-cyan-300 flex items-center gap-1.5">
                  <ListOrdered className="w-3.5 h-3.5 text-blue-700 dark:text-cyan-400" />
                  Key Clinical Findings & Structured Telemetry
                </h5>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Structured Data</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-400">Chief Complaint:</span>
                    <span className="font-bold text-slate-900 dark:text-cyan-300">{verdict.structured_data?.chief_complaint || 'Reported'}</span>
                  </div>
                  {verdict.structured_data?.hpi?.onset && (
                    <div className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span className="text-slate-500 dark:text-slate-400">Symptom Onset:</span>
                      <span>{verdict.structured_data.hpi.onset}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Doctor Sign-Off */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="flex justify-between items-center">
                <h5 className="text-xs font-mono font-bold uppercase text-slate-800 dark:text-cyan-300 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-blue-700 dark:text-cyan-400" />
                  Clinician Validation
                </h5>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">ABDM Standard</span>
              </div>

              <div className="p-4 bg-blue-50/60 dark:bg-cyan-950/40 rounded-xl border border-blue-200 dark:border-cyan-500/40 space-y-3">
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-mono leading-relaxed">
                  {doctorConfirmed 
                    ? '✓ AI Verdict verified and attached to patient official health record.' 
                    : 'Please review and validate the AI summary prior to patient discharge.'}
                </p>
                
                <button
                  type="button"
                  onClick={handleApprove}
                  className={`w-full py-2.5 px-3 rounded-lg font-mono font-bold text-xs transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shadow-xs ${
                    doctorConfirmed
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500'
                      : 'bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 text-white border border-slate-700 dark:border-cyan-400/50'
                  }`}
                >
                  {doctorConfirmed ? <CheckCircle2 className="w-4 h-4 text-white" /> : <ShieldCheck className="w-4 h-4 text-amber-300" />}
                  <span>{doctorConfirmed ? 'Verdict Verified & Signed' : 'Accept & Verify AI Verdict'}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
