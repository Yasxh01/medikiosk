import React, { useState } from 'react';
import PatientQueue from '../components/doctor/PatientQueue';
import SummaryView from '../components/doctor/SummaryView';
import LLMVerdictCard from '../components/doctor/LLMVerdictCard';
import FHIR_Preview from '../components/doctor/FHIR_Preview';
import { useCases } from '../context/useCases';
import { 
  ShieldCheck, Check, AlertOctagon, FileText, AlertCircle, 
  Database, UserCheck, RefreshCw, BadgeCheck, BrainCircuit, Sparkles, Activity
} from 'lucide-react';

export default function DoctorDashboard() {
  const { 
    cases, 
    activeCaseId, 
    setActiveCaseId, 
    activeCase, 
    generateAiVerdict,
    updateCaseSummary, 
    updateCaseVerdict,
    approveVerdict,
    signOffCase, 
    syncToEmr, 
    resetDemoCases 
  } = useCases();

  const [showFhirModal, setShowFhirModal] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const currentPatient = activeCase || cases.find(c => c.id === activeCaseId) || cases[0];
  
  // Dynamic Red Flag detection (true ONLY if current patient is marked RED_FLAG)
  const isRed = currentPatient?.urgency === 'RED_FLAG' || currentPatient?.llmVerdict?.priority === 'EMERGENCY';

  const handleTriggerAiVerdict = async () => {
    if (!currentPatient) return;
    setIsGeneratingAi(true);
    try {
      await generateAiVerdict(currentPatient.id);
    } catch (err) {
      console.warn('AI Generation Error:', err.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSyncToHospitalEmr = () => {
    if (!currentPatient) return;
    syncToEmr(currentPatient.id);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 2500);
  };

  const handleSaveSummary = (updatedSummary) => {
    if (!currentPatient) return;
    updateCaseSummary(currentPatient.id, updatedSummary);
  };

  const handleUpdateVerdict = (updatedVerdict) => {
    if (!currentPatient) return;
    updateCaseVerdict(currentPatient.id, updatedVerdict);
  };

  const handleApproveVerdict = (isApproved, extraData) => {
    if (!currentPatient) return;
    approveVerdict(currentPatient.id, isApproved, extraData);
  };

  const handleSignOff = () => {
    if (!currentPatient) return;
    signOffCase(currentPatient.id);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto font-mono">
      
      {/* Official Government Doctor HPR Credential Header */}
      <div className="gov-card p-4 sm:p-5 bg-white dark:bg-slate-900 border-l-4 border-l-blue-700 dark:border-l-cyan-500 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-400/30 text-blue-700 dark:text-cyan-400 flex items-center justify-center flex-shrink-0">
            <UserCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-sm text-slate-900 dark:text-white tracking-tight">
                Dr. Priya Nair, MD (Internal Medicine)
              </h3>
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                HPR VERIFIED
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
              <span>HPR ID: <strong className="text-blue-700 dark:text-cyan-400">HPR-DOC-9821-IND</strong></span>
              <span>•</span>
              <span>National Medical Commission • ABDM Level M1</span>
            </p>
          </div>
        </div>

        {/* Action Controls Header */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={resetDemoCases}
            className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 border border-slate-300 dark:border-slate-700 cursor-pointer active:scale-95 shadow-xs"
            title="Reset queue to default demonstration cases"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
            <span>Reset Queue</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Queue on Left, Case Review on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Patient Consultation Queue */}
        <div className="lg:col-span-4 gov-card overflow-hidden h-auto lg:h-[880px] flex flex-col bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <PatientQueue
            queue={cases}
            selectedId={currentPatient?.id}
            onSelect={(pat) => setActiveCaseId(pat.id)}
          />
        </div>

        {/* Main Review Command Center */}
        <div className="lg:col-span-8 space-y-5">
          {currentPatient ? (
            <>
              {/* Active Patient Vitals & Primary Actions Header */}
              <div className="gov-card p-5 shadow-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-12 h-12 rounded-xl text-white font-black text-base flex items-center justify-center flex-shrink-0 shadow-sm ${
                    isRed ? 'bg-rose-600' : 'bg-[#002244] dark:bg-cyan-600'
                  }`}>
                    {currentPatient.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                        {currentPatient.name}
                      </h2>
                      {isRed ? (
                        <span className="px-2.5 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-500/60 font-black text-[10px] rounded flex items-center gap-1 shadow-xs animate-pulse">
                          <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> STAT EMERGENCY RED FLAG
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 text-[10px] font-bold rounded flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> ROUTINE OPD CONSULTATION
                        </span>
                      )}
                      
                      {(currentPatient.llmVerdict?.approvedByDoctor || currentPatient.doctor_approved) && (
                        <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/50 text-[10px] font-bold rounded flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Verified by Doctor
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-blue-700 dark:text-cyan-400 font-bold">{currentPatient.abhaId || currentPatient.abha_number || '12-3456-7890-1234'}</span>
                      <span>•</span>
                      <span>{currentPatient.age || 45} Yrs</span>
                      <span>•</span>
                      <span>{currentPatient.gender || 'Male'}</span>
                      <span>•</span>
                      <span>Token: <strong className="text-slate-900 dark:text-white font-bold">{currentPatient.tokenNumber || 'TK-102'}</strong></span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons: Generate AI Verdict + EMR Sync + View FHIR JSON */}
                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                  {/* Dedicated AI Verdict Generation Trigger Button */}
                  <button
                    type="button"
                    onClick={handleTriggerAiVerdict}
                    disabled={isGeneratingAi}
                    className="px-3.5 py-2 bg-[#002244] dark:bg-gradient-to-r dark:from-cyan-600 dark:to-blue-600 hover:bg-blue-900 dark:hover:from-cyan-500 dark:hover:to-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer active:scale-95 shadow-xs border border-white/20 dark:border-cyan-400/40 disabled:opacity-50"
                  >
                    {isGeneratingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" /> : <BrainCircuit className="w-3.5 h-3.5 text-cyan-200" />}
                    <span>{isGeneratingAi ? 'Running Gemini AI...' : 'Generate AI Verdict'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowFhirModal(true)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-700 transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
                  >
                    <Database className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                    <span>FHIR JSON</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSyncToHospitalEmr}
                    className={`px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition flex items-center space-x-1.5 border cursor-pointer active:scale-95 ${
                      syncSuccess || currentPatient.emrSynced
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-[#002244] dark:bg-slate-800 text-white dark:text-slate-200 border-slate-700'
                    }`}
                  >
                    {syncSuccess || currentPatient.emrSynced ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-amber-300" />
                    )}
                    <span>
                      {syncSuccess || currentPatient.emrSynced
                        ? 'EMR Synced'
                        : 'Sync EMR'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Dynamic Emergency Red Flag Warning Banner (ONLY if patient is Emergency) */}
              {isRed && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-300 dark:border-rose-500/60 rounded-xl flex items-start space-x-3 text-rose-900 dark:text-rose-200 shadow-sm">
                  <div className="p-1.5 rounded bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-300 flex-shrink-0">
                    <AlertOctagon className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-xs uppercase tracking-wider text-rose-900 dark:text-rose-300">
                        Priority Emergency Attention Required
                      </span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed text-rose-900 dark:text-rose-200 font-bold">
                      {currentPatient.summary?.chiefComplaint?.text || 'Acute emergency symptoms detected during patient intake. Priority clinical evaluation recommended immediately.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Dedicated LLM Diagnostic Verdict & CDSS Component */}
              {currentPatient.llmVerdict ? (
                <LLMVerdictCard 
                  verdict={currentPatient.llmVerdict} 
                  patientName={currentPatient.name} 
                  onApproveVerdict={handleApproveVerdict}
                  onUpdateVerdict={handleUpdateVerdict}
                />
              ) : (
                <div className="p-6 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-cyan-500/40 rounded-xl text-center space-y-3 shadow-xs">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-cyan-400/30">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">AI Verdict Not Generated Yet</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click below to invoke Gemini LLM & Aditee AI Service for real-time triage verdict.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTriggerAiVerdict}
                    disabled={isGeneratingAi}
                    className="px-4 py-2 bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition inline-flex items-center space-x-2 cursor-pointer border border-white/20 dark:border-cyan-400/40 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300 dark:text-cyan-200" />
                    <span>Generate AI Verdict Now</span>
                  </button>
                </div>
              )}

              {/* SOCRATES Structured Clinical Summary with Physician Edit / Sign-Off */}
              <SummaryView
                summary={currentPatient.summary}
                isSignedOff={currentPatient.signedOff}
                onSaveSummary={handleSaveSummary}
                onSignOff={handleSignOff}
              />
            </>
          ) : (
            <div className="gov-card p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">No Patient Selected</h3>
              <p className="text-xs">Select a patient record from the left consultation queue.</p>
            </div>
          )}
        </div>

      </div>

      {/* ABDM Interoperable FHIR JSON Inspection Modal */}
      {currentPatient && (
        <FHIR_Preview
          fhirPayload={currentPatient.mockFhir}
          isOpen={showFhirModal}
          onClose={() => setShowFhirModal(false)}
        />
      )}

    </div>
  );
}