import React, { useState } from 'react';
import PatientFlow from './pages/PatientFlow';
import DoctorDashboard from './pages/DoctorDashboard';
import AuthPage from './pages/AuthPage';
import { useTheme } from './context/useTheme';
import { useAuth } from './context/useAuth';
import { CaseProvider } from './context/CaseContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { 
  Stethoscope, ShieldCheck, 
  UserCheck, Monitor, KeyRound, LogOut, Sun, Moon,
  Building2, CheckCircle2, Lock, ExternalLink, Globe
} from 'lucide-react';

function AppContent() {
  const { user, isAuthenticated, logout, loginAsDoctor, loginAsPatient } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { lang, toggleLanguage, isHindi } = useLanguage();
  const [fontSizeLevel, setFontSizeLevel] = useState(0);

  const isDoctor = isAuthenticated && (user?.role?.toUpperCase() === 'DOCTOR');
  const isPatient = isAuthenticated && (user?.role?.toUpperCase() === 'PATIENT');

  const handleDirectDoctorClick = () => {
    loginAsDoctor();
  };

  const handleDirectPatientClick = () => {
    loginAsPatient();
  };

  const handleDirectAuthClick = () => {
    logout();
  };

  const handleJumpToDoctorQueue = () => {
    loginAsDoctor();
  };

  const fontScaleClass = fontSizeLevel === 1 ? 'text-[105%]' : fontSizeLevel === -1 ? 'text-[95%]' : '';

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-150 ${
      isDark ? 'bg-[#080e18] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
    } ${fontScaleClass}`}>
      
      {/* 1. Indian National Tricolor Ribbon */}
      <div className="gov-tricolor-bar" />

      {/* 2. Official Government of India Top Strip */}
      <div className="gov-top-bar px-4 sm:px-8 py-1.5 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          
          {/* Official Ministry Title */}
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="font-bold text-slate-200">Government of India</span>
            <span className="text-slate-400 opacity-60">|</span>
            <span className="text-slate-300 font-medium hidden md:inline">Ministry of Health & Family Welfare</span>
          </div>

          {/* Accessibility & Theme Controls */}
          <div className="flex items-center space-x-3 text-[11px]">
            {/* Screen Reader Font Controls */}
            <div className="flex items-center space-x-1 border border-white/20 px-1.5 py-0.5 rounded bg-black/20">
              <span className="text-slate-300 text-[10px] uppercase font-mono mr-1">Font:</span>
              <button 
                type="button"
                onClick={() => setFontSizeLevel(-1)} 
                className={`px-1 rounded hover:bg-white/20 cursor-pointer ${fontSizeLevel === -1 ? 'bg-white/30 font-bold' : ''}`}
              >
                A-
              </button>
              <button 
                type="button"
                onClick={() => setFontSizeLevel(0)} 
                className={`px-1 rounded hover:bg-white/20 cursor-pointer ${fontSizeLevel === 0 ? 'bg-white/30 font-bold' : ''}`}
              >
                A
              </button>
              <button 
                type="button"
                onClick={() => setFontSizeLevel(1)} 
                className={`px-1 rounded hover:bg-white/20 cursor-pointer ${fontSizeLevel === 1 ? 'bg-white/30 font-bold' : ''}`}
              >
                A+
              </button>
            </div>

            {/* Standard / Dark Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center space-x-1 border border-white/20 px-2 py-0.5 rounded bg-black/20 hover:bg-white/20 transition cursor-pointer text-[10px] font-mono"
            >
              {isDark ? <Sun className="w-3 h-3 text-amber-400" /> : <Moon className="w-3 h-3 text-slate-300" />}
              <span>{isDark ? 'Light' : 'Contrast'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 3. Main Government Portal Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1424] shadow-xs font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap justify-between items-center gap-4">
          
          {/* Official Emblem & Portal Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex flex-col items-center justify-center border-2 border-amber-500/40 shadow-xs flex-shrink-0">
              <Building2 className="w-6 h-6 text-amber-400" />
              <span className="text-[7px] font-mono text-amber-300 font-bold uppercase mt-0.5">GOVT OF INDIA</span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black tracking-tight text-[#002244] dark:text-white flex items-center gap-2">
                  <span>MediKiosk</span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 font-mono">| AI Health Portal</span>
                </h1>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/40">
                  ABDM Certified
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex flex-wrap items-center gap-1.5 mt-0.5">
                <span>National Digital Health Kiosk System</span>
                <span>•</span>
                <span className="text-blue-700 dark:text-cyan-400 font-semibold">Ayushman Bharat Digital Mission (NHA)</span>
              </p>
            </div>
          </div>

          {/* Official Government Portal Navigation Tabs */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={handleDirectPatientClick}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                isPatient
                  ? 'bg-[#002244] text-white shadow-sm dark:bg-cyan-600 dark:border dark:border-cyan-400/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Patient Kiosk</span>
            </button>

            <button
              type="button"
              onClick={handleDirectDoctorClick}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                isDoctor
                  ? 'bg-[#002244] text-white shadow-sm dark:bg-cyan-600 dark:border dark:border-cyan-400/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Portal</span>
            </button>

            <button
              type="button"
              onClick={handleDirectAuthClick}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
                !isAuthenticated
                  ? 'bg-[#002244] text-white shadow-sm dark:bg-cyan-600 dark:border dark:border-cyan-400/40'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Auth Portal</span>
            </button>
          </div>

          {/* Official Security / HPR Badge & User Info */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-3.5 py-2 rounded-xl text-xs">
              <div className="w-7 h-7 rounded-lg bg-[#002244] dark:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                {isDoctor ? <UserCheck className="w-4 h-4 text-amber-300 dark:text-cyan-200" /> : user.name?.charAt(0) || 'P'}
              </div>
              
              <div className="text-left leading-tight">
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  {user.name}
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {isDoctor ? 'HPR Verified RMP' : 'ABHA Verified Citizen'}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                title="Log Out of Government Portal"
                className="ml-2 p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-800">
              <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>ABDM Security Gateway v2.4.0</span>
            </div>
          )}

        </div>

        {/* Official Government Announcement Bar */}
        <div className="bg-amber-100/80 dark:bg-amber-950/40 border-t border-b border-amber-300 dark:border-amber-500/30 px-4 sm:px-6 py-1.5 text-xs text-amber-950 dark:text-amber-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 font-medium">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 font-mono font-bold text-[10px] uppercase flex-shrink-0">
                NHA Official Notice
              </span>
              <span className="truncate text-[11px]">
                National Health Authority (NHA) Directives: ABHA & DPDP Act 2023 Encrypted Telemetry Active.
              </span>
            </div>
            <span className="text-[10px] text-amber-800 dark:text-amber-400 flex-shrink-0 hidden md:inline">
              ISO 27001 • HL7 FHIR R4 Ready
            </span>
          </div>
        </div>
      </header>

      {/* 4. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {!isAuthenticated ? (
          <AuthPage onAuthSuccess={() => {}} />
        ) : isDoctor ? (
          <DoctorDashboard />
        ) : (
          <PatientFlow onGoToDoctorQueue={handleJumpToDoctorQueue} />
        )}
      </main>

      {/* 5. Official Government Footer */}
      <footer className="border-t-2 border-slate-300 dark:border-slate-800 bg-[#002244] dark:bg-slate-950 text-white py-6 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          
          {/* Top Footer Row: Partner Entities */}
          <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-white/10 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm tracking-wide text-white">National Health Authority (NHA)</span>
              </div>
              <p className="text-[11px] text-slate-300 dark:text-slate-400">
                Ministry of Health & Family Welfare, Govt. of India
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="px-2.5 py-1 bg-white/10 dark:bg-slate-900 rounded border border-white/20 dark:border-slate-800 flex items-center gap-1.5 text-slate-200 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Digital India Platform
              </span>
              <span className="px-2.5 py-1 bg-white/10 dark:bg-slate-900 rounded border border-white/20 dark:border-slate-800 flex items-center gap-1.5 text-slate-200 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 dark:text-cyan-400" />
                DPDP Act 2023 Compliant
              </span>
              <span className="px-2.5 py-1 bg-white/10 dark:bg-slate-900 rounded border border-white/20 dark:border-slate-800 flex items-center gap-1.5 text-slate-200 dark:text-slate-300">
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                ABDM Sandbox M1/M2
              </span>
            </div>
          </div>

          {/* Bottom Footer Row: Legal, NIC, & Compliance */}
          <div className="flex flex-wrap justify-between items-center gap-3 text-[11px] text-slate-300 dark:text-slate-400">
            <div>
              <p>© 2026 Government of India • All Rights Reserved</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                Designed & Hosted by National Informatics Centre (NIC) • MediKiosk Clinical Gateway v2.4.0
              </p>
            </div>

            <div className="flex items-center space-x-4 text-[10px]">
              <span className="hover:underline cursor-pointer">Terms of Use</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">RTI Portal</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Toll Free: 1800-11-4477</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CaseProvider>
        <AppContent />
      </CaseProvider>
    </LanguageProvider>
  );
}