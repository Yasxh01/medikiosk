import React, { useState } from 'react';
import IdentifyStep from '../components/patient/IdentifyStep';
import ConsentStep from '../components/patient/ConsentStep';
import ChatInterview from '../components/patient/ChatInterview';
import DocumentUpload from '../components/patient/DocumentUpload';
import RedFlagBanner from '../components/patient/RedFlagBanner';
import { useCases } from '../context/useCases';
import { useAuth } from '../context/useAuth';
import { 
  CheckCircle2, Stethoscope, RefreshCw, 
  ShieldCheck, QrCode, ArrowRight, AlertOctagon,
  Building2, Printer
} from 'lucide-react';

export default function PatientFlow({ onGoToDoctorQueue }) {
  const { submitNewCase } = useCases();
  const { loginAsDoctor } = useAuth();
  
  const [step, setStep] = useState(1);
  const [redFlags, setRedFlags] = useState([]);
  const [session, setSession] = useState({
    identity: null,
    consent: null,
    socrates: null,
    documents: []
  });
  const [createdCase, setCreatedCase] = useState(null);

  const handleIdentityDone = (identityData) => {
    setSession((prev) => ({ ...prev, identity: identityData }));
    setStep(2);
  };

  const handleConsentDone = (consentData) => {
    setSession((prev) => ({ ...prev, consent: consentData }));
    setStep(3);
  };

  const handleChatDone = (socratesData) => {
    setSession((prev) => ({ ...prev, socrates: socratesData }));
    setStep(4);
  };

  const handleDocsDone = (docs) => {
    const updatedSession = { ...session, documents: docs };
    setSession(updatedSession);
    
    // Submit case to dynamic CaseContext
    const newCase = submitNewCase({
      identity: updatedSession.identity,
      consent: updatedSession.consent,
      socrates: updatedSession.socrates,
      documents: docs,
      redFlags
    });

    setCreatedCase(newCase);
    setStep(5);
  };

  const stepsList = [
    { num: 1, label: 'Identity' },
    { num: 2, label: 'Consent' },
    { num: 3, label: 'Interview' },
    { num: 4, label: 'Upload' },
    { num: 5, label: 'Token Slip' },
  ];

  const isRed = redFlags.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Official Government Wizard Progress Bar */}
      <div className="gov-card p-4 shadow-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center relative">
          {/* Progress Track */}
          <div className="absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />
          <div
            className="absolute top-1/2 left-4 h-1 bg-[#002244] dark:bg-cyan-500 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 4) * 100}%` }}
          />

          {stepsList.map((s) => {
            const isCompleted = s.num < step;
            const isCurrent = s.num === step;

            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent
                      ? 'bg-[#002244] dark:bg-cyan-600 text-white shadow-md scale-105 border-2 border-blue-400 dark:border-cyan-400'
                      : isCompleted
                      ? 'bg-emerald-600 border border-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span
                  className={`text-[11px] font-bold mt-1.5 transition-colors ${
                    isCurrent
                      ? 'text-blue-900 dark:text-cyan-400'
                      : isCompleted
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <RedFlagBanner flags={redFlags} />

      {/* Main Step Workspace Container */}
      <div className="gov-card p-6 sm:p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        {step === 1 && <IdentifyStep onComplete={handleIdentityDone} />}

        {step === 2 && (
          <ConsentStep
            identity={session.identity}
            onComplete={handleConsentDone}
          />
        )}

        {step === 3 && (
          <ChatInterview
            onComplete={handleChatDone}
            onRedFlagDetected={(flags) => setRedFlags(flags)}
          />
        )}

        {step === 4 && <DocumentUpload onComplete={handleDocsDone} />}

        {step === 5 && createdCase && (
          <div className="space-y-6 text-center font-sans">
            {/* Government OPD E-Pass Token Slip Header */}
            <div className="p-6 bg-blue-50/70 dark:bg-slate-950 border-2 border-blue-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-sm text-slate-900 dark:text-white">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-400/30 text-blue-700 dark:text-cyan-400 flex flex-col items-center justify-center mx-auto shadow-xs">
                <Building2 className="w-6 h-6" />
                <span className="text-[7px] font-black uppercase text-blue-800 dark:text-cyan-300 font-mono">GOVT</span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-blue-800 dark:text-cyan-400 block">
                  Ministry of Health & Family Welfare • Government of India
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  OPD Consultation Digital Token Pass
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Ayushman Bharat Digital Mission (ABDM) • Triage Encrypted Slip
                </p>
              </div>

              {/* Dynamic Assigned Token Badge */}
              <div className="py-4 px-6 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-cyan-500/40 inline-block shadow-xs">
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 block font-bold">
                  {createdCase.urgency === 'RED_FLAG' ? 'STAT Priority Triaged' : 'Allocated Token Number'}
                </span>
                <span className={`text-4xl font-black font-mono tracking-wider ${
                  createdCase.urgency === 'RED_FLAG' ? 'text-rose-600 dark:text-rose-400' : 'text-blue-900 dark:text-cyan-300'
                }`}>
                  {createdCase.tokenNumber}
                </span>
                <span className="block text-[11px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">
                  ✓ Dispatch Status: Active in Doctor Workstation
                </span>
              </div>

              {/* Patient Details Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-left text-xs font-mono">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold">Patient Name</span>
                  <strong className="text-slate-900 dark:text-white font-bold">{createdCase.name}</strong>
                </div>

                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold">ABHA Number</span>
                  <strong className="text-blue-700 dark:text-cyan-400 font-bold">{createdCase.abhaId}</strong>
                </div>

                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold">Assigned Department</span>
                  <strong className="text-slate-900 dark:text-white font-bold">Internal Medicine (Room 102)</strong>
                </div>

                <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-bold">Attending Physician</span>
                  <strong className="text-slate-900 dark:text-white font-bold">Dr. Priya Nair, MD</strong>
                </div>
              </div>
            </div>

            {/* Next Action Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono">
              <button
                type="button"
                onClick={() => {
                  loginAsDoctor();
                  if (onGoToDoctorQueue) onGoToDoctorQueue();
                }}
                className="px-5 py-3 rounded-xl bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 text-white font-bold text-xs transition shadow-md flex items-center space-x-2 cursor-pointer active:scale-95 border border-blue-400/40"
              >
                <Stethoscope className="w-4 h-4 text-amber-300 dark:text-cyan-200" />
                <span>Open Doctor Workstation Queue</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition border border-slate-300 dark:border-slate-700 flex items-center space-x-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <span>Print Slip</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setRedFlags([]);
                  setCreatedCase(null);
                  setSession({ identity: null, consent: null, socrates: null, documents: [] });
                }}
                className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition border border-slate-300 dark:border-slate-700 flex items-center space-x-2 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-slate-500" />
                <span>Next Patient Intake</span>
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}