import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useCases } from '../context/useCases';
import { 
  Lock, Mail, Phone, User, Eye, EyeOff, 
  ArrowRight, Stethoscope, UserCheck, ShieldCheck,
  Building2, CheckCircle2, AlertOctagon, FileCheck
} from 'lucide-react';

export default function AuthPage({ onAuthSuccess }) {
  const { login, loginAsDoctor, loginAsPatient, register } = useAuth();
  const { setActiveCaseId } = useCases();
  
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    phone: '9876543210',
    password: 'Password@123',
    role: 'PATIENT',
    age: 34,
    gender: 'Male'
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleDoctorDirectLogin = () => {
    const res = loginAsDoctor();
    if (onAuthSuccess) {
      onAuthSuccess(res.user);
    }
  };

  const handlePatientDirectLogin = () => {
    const res = loginAsPatient();
    if (onAuthSuccess) {
      onAuthSuccess(res.user);
    }
  };

  const handleDemoScenarioClick = (caseId) => {
    setActiveCaseId(caseId);
    const res = loginAsDoctor();
    if (onAuthSuccess) {
      onAuthSuccess(res.user);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isRegister) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill all required fields.');
        setLoading(false);
        return;
      }
      const res = register(formData);
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(res.user);
      } else {
        setError(res.error);
      }
      setLoading(false);
    } else {
      if (!formData.email || !formData.password) {
        setError('Please enter email and password.');
        setLoading(false);
        return;
      }
      const res = login(formData.email, formData.password);
      if (res.success) {
        if (onAuthSuccess) onAuthSuccess(res.user);
      } else {
        setError(res.error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 px-2 space-y-6 max-w-6xl mx-auto font-sans">
      
      {/* 1. Official Government Department Banner */}
      <div className="w-full gov-card p-5 bg-gradient-to-r from-blue-900 via-[#002244] to-slate-900 text-white shadow-md border-t-4 border-amber-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex flex-col items-center justify-center text-amber-400 flex-shrink-0">
              <Building2 className="w-6 h-6" />
              <span className="text-[7px] font-mono text-amber-300 font-bold uppercase mt-0.5">NHA • ABDM</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300 font-bold block">
                Ministry of Health & Family Welfare • Government of India
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                National Digital Health Kiosk Portal (MediKiosk Official Gateway)
              </h2>
              <p className="text-xs text-slate-200 mt-0.5 font-medium">
                Ayushman Bharat Digital Mission (ABDM) • Unified Clinical Pre-Intake & Triage Interface
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto font-mono">
            {/* Quick Citizen Button */}
            <button
              type="button"
              onClick={handlePatientDirectLogin}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95 border border-amber-400/40"
            >
              <UserCheck className="w-4 h-4 text-slate-950" />
              <span>Patient Kiosk (Rahul Kumar)</span>
            </button>

            {/* Quick Doctor Button */}
            <button
              type="button"
              onClick={handleDoctorDirectLogin}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer active:scale-95 border border-emerald-400/40"
            >
              <Stethoscope className="w-4 h-4 text-white" />
              <span>Doctor Portal (Dr. Priya Nair)</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Portal Authentication Container */}
      <div className="w-full gov-card overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        
        {/* Left Column: Directives & Demonstration Case Scenarios */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-blue-50/60 dark:bg-slate-900/90 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between text-slate-900 dark:text-slate-100">
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-blue-700 dark:text-cyan-400 uppercase">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              <span>Digital Health Triage Directives</span>
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Autonomous Clinical Pre-Intake & ABHA Integration
              <span className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 font-sans">
                ABHA Verification & AI Clinical Decision Support Engine
              </span>
            </h3>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              This official portal automates symptom telemetry recording, OCR medical record extraction, and clinical summary generation under ABDM directives, dispatching findings directly to attending physician workstations.
            </p>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 font-mono">
              <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold text-blue-700 dark:text-cyan-400 block">01. ABHA M1</span>
                <span className="font-bold text-slate-900 dark:text-white block">14-Digit ABHA</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Instant OTP & QR Verification</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">02. DPDP ACT</span>
                <span className="font-bold text-slate-900 dark:text-white block">Statutory Consent</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">2023 Digital Privacy Protocol</p>
              </div>

              <div className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold text-indigo-700 dark:text-amber-400 block">03. HL7 FHIR R4</span>
                <span className="font-bold text-slate-900 dark:text-white block">Interoperable JSON</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Hospital EMR Ready</p>
              </div>
            </div>
          </div>

          {/* Prepared Government Demo Scenarios */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <span className="text-[11px] font-mono uppercase font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Demonstration Test Cases:</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleDemoScenarioClick('PAT-901')}
                className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-rose-200 dark:border-rose-900/60 text-left hover:border-rose-400 transition cursor-pointer group shadow-2xs"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-rose-800 dark:text-rose-300 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> 1. Chest Pain (STAT Red Flag)
                  </span>
                  <span className="px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-500/40 rounded text-[10px]">EMERG-001</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Ramesh Sharma (52 Yrs) • ACS / NSTEMI Protocol</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoScenarioClick('PAT-903')}
                className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-blue-200 dark:border-cyan-500/50 text-left hover:border-blue-400 transition cursor-pointer group shadow-2xs"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-blue-900 dark:text-cyan-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> 2. Migraine (Routine OPD)
                  </span>
                  <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-cyan-950 text-blue-900 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/40 rounded text-[10px]">OPD-305</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">Ananya Sengupta (28 Yrs) • Visual Aura</p>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Official Form */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-white dark:bg-slate-950 flex flex-col justify-between text-slate-900 dark:text-white">
          
          <div>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight font-mono">
                  {isRegister ? 'Registration' : 'Official Portal Login'}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isRegister ? 'Create Citizen or Practitioner Profile' : 'Enter Credentials to Access Portal'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950 border border-rose-300 dark:border-rose-500/50 rounded-lg text-xs text-rose-900 dark:text-rose-200 font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 font-sans">
              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Kumar"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email / ABHA ID / HPR ID *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@hospital.gov.in"
                    required
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-cyan-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-cyan-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    User Category
                  </label>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: 'PATIENT' }))}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        formData.role === 'PATIENT'
                          ? 'bg-[#002244] dark:bg-cyan-600 text-white border-blue-400'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Patient</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role: 'DOCTOR' }))}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${
                        formData.role === 'DOCTOR'
                          ? 'bg-[#002244] dark:bg-cyan-600 text-white border-blue-400'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800'
                      }`}
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Doctor</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer active:scale-98 disabled:opacity-75 border border-blue-400/40"
                >
                  <span>{loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Portal Login'}</span>
                  {!loading && <ArrowRight className="w-4 h-4 text-white" />}
                </button>
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center font-sans">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isRegister ? 'Already have an account?' : 'New User?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
                className="font-bold text-blue-700 dark:text-cyan-400 underline hover:text-blue-900 dark:hover:text-cyan-300 cursor-pointer ml-1"
              >
                {isRegister ? 'Login' : 'Register Now'}
              </button>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
