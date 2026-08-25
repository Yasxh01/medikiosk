import React, { useState } from 'react';
import { ShieldCheck, Globe, Volume2, ArrowRight, Building2 } from 'lucide-react';

export default function ConsentStep({ onComplete, initialLanguage = 'en' }) {
  const [language, setLanguage] = useState(initialLanguage);
  const [consentTelemetry, setConsentTelemetry] = useState(true);
  const [consentSharing, setConsentSharing] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const languages = [
    { code: 'en', label: 'English', voiceText: 'Please review and accept statutory consent for AI clinical intake under DPDP Act 2023.' },
    { code: 'hi', label: 'Hindi (EN Mode)', voiceText: 'Please accept digital personal data protection consent for clinical intake.' },
    { code: 'bn', label: 'Bengali (EN Mode)', voiceText: 'Please grant consent for health record sharing.' },
    { code: 'ta', label: 'Tamil (EN Mode)', voiceText: 'Please confirm consent for clinical record sharing.' },
    { code: 'te', label: 'Telugu (EN Mode)', voiceText: 'Please confirm health information sharing consent.' },
  ];

  const handleSpeakGuidance = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const currentLang = languages.find((l) => l.code === language) || languages[0];
      const utterance = new SpeechSynthesisUtterance(currentLang.voiceText);
      utterance.rate = 0.95;
      utterance.lang = 'en-IN';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (!consentTelemetry || !consentSharing) {
      alert('Statutory consent is required before clinical records can be shared under DPDP Act 2023.');
      return;
    }

    onComplete({
      language,
      consentLog: {
        granted: true,
        timestamp: new Date().toISOString(),
        act: 'DPDP_2023_SECTION_6_ABDM',
        telemetryConsent: consentTelemetry,
        recordSharingConsent: consentSharing
      }
    });
  };

  return (
    <form onSubmit={handleProceed} className="space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Official Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-100 dark:bg-cyan-950 text-blue-900 dark:text-cyan-300 font-mono text-[10px] font-black uppercase tracking-wider border border-blue-200 dark:border-cyan-500/40 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              STEP 02 / 05 • DPDP ACT 2023 STATUTORY CONSENT
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Language Selection & Statutory Data Protection Consent
            <span className="block text-xs font-semibold text-blue-700 dark:text-cyan-400 mt-1 font-sans">
              Digital Personal Data Protection Act 2023 (Section 6) Compliance
            </span>
          </h2>
        </div>

        {/* Audio Voice Guidance */}
        <button
          type="button"
          onClick={handleSpeakGuidance}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1.5 border cursor-pointer active:scale-95 shadow-xs ${
            isSpeaking
              ? 'bg-blue-600 text-white border-blue-400 animate-pulse'
              : 'bg-blue-50 dark:bg-cyan-950/60 text-blue-900 dark:text-cyan-300 border-blue-200 dark:border-cyan-500/40 hover:bg-blue-100'
          }`}
          title="Audio consent narration"
        >
          <Volume2 className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>{isSpeaking ? 'Audio Playing...' : 'Voice Guidance'}</span>
        </button>
      </div>

      {/* Language Selection Grid */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span>Select Consultation Language Preference:</span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`p-3 rounded-xl border text-left text-xs font-bold transition cursor-pointer flex flex-col justify-between ${
                language === lang.code
                  ? 'bg-[#002244] dark:bg-cyan-600 text-white border-blue-400 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 hover:border-blue-300'
              }`}
            >
              <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-cyan-400 font-bold">{lang.code.toUpperCase()}</span>
              <span className="mt-1 font-bold">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DPDP 2023 Statutory Consent Terms Card */}
      <div className="bg-blue-50/60 dark:bg-slate-900 border-2 border-blue-200 dark:border-cyan-500/40 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center space-x-2 border-b border-blue-200 dark:border-slate-800 pb-3">
          <div className="w-6 h-6 rounded bg-blue-100 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 flex items-center justify-center border border-blue-200 dark:border-cyan-400/30">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Ministry of Law & Justice • DPDP Act 2023 (Section 6 Statutory Consent)
          </h4>
        </div>

        <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
          <label className="flex items-start space-x-3 cursor-pointer select-none p-2.5 rounded-lg bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 transition">
            <input
              type="checkbox"
              checked={consentTelemetry}
              onChange={(e) => setConsentTelemetry(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span>
              <strong className="text-blue-900 dark:text-cyan-400 font-bold">1. AI Symptom Telemetry Authorization:</strong> I voluntarily authorize MediKiosk AI to record and structure my reported symptoms via voice/touch interface for clinical intake.
            </span>
          </label>

          <label className="flex items-start space-x-3 cursor-pointer select-none p-2.5 rounded-lg bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 transition">
            <input
              type="checkbox"
              checked={consentSharing}
              onChange={(e) => setConsentSharing(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <span>
              <strong className="text-blue-900 dark:text-cyan-400 font-bold">2. Medical Records & OCR Analysis:</strong> I consent to sharing attached medical records/prescriptions under ABDM standards for physician review.
            </span>
          </label>
        </div>

        <div className="pt-2 border-t border-blue-200 dark:border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-600 dark:text-slate-400">
          <span>ABDM HL7 FHIR R4 Compliant • Encrypted Transmission</span>
          <span>Purpose: OPD Clinical Intake & Triage</span>
        </div>
      </div>

      {/* Continue Button */}
      <button
        type="submit"
        className="w-full py-3.5 bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer active:scale-98 border border-blue-400/40"
      >
        <span>GRANT STATUTORY CONSENT & START AI INTERVIEW</span>
        <ArrowRight className="w-4 h-4 text-blue-200 dark:text-cyan-200" />
      </button>
    </form>
  );
}
