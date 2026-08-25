import React, { useState } from 'react';
import { 
  User, QrCode, CheckCircle, Fingerprint, 
  Calendar, Sparkles, KeyRound, Check, RefreshCw, X, Phone,
  Building2, Send, ShieldAlert, AlertTriangle
} from 'lucide-react';
import { sendAbhaOtpApi, verifyAbhaOtpApi } from '../../api/client';

export default function IdentifyStep({ onComplete }) {
  const [abhaId, setAbhaId] = useState('ABHA-9921-4820-1102');
  const [name, setName] = useState('Rahul Kumar');
  const [age, setAge] = useState('34');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('9876543210');

  // ABHA Verification Modal & Error State
  const [showAbhaModal, setShowAbhaModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState('123456');
  const [otpError, setOtpError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [abhaVerified, setAbhaVerified] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!abhaVerified) {
      setFormError('ABHA Verification Required! Please verify your ABHA ID via OTP before proceeding.');
      return;
    }

    setFormError('');
    onComplete({
      abhaId,
      name,
      age: Number(age),
      gender,
      phone,
      abhaVerified: true
    });
  };

  const handleQuickMockScan = () => {
    setAbhaId('ABHA-9921-4820-1102');
    setName('Rahul Kumar');
    setAge('34');
    setGender('Male');
    setPhone('9876543210');
    setAbhaVerified(true);
    setFormError('');
  };

  const handleOpenOtpModal = async () => {
    setShowAbhaModal(true);
    setIsSendingOtp(true);
    setOtpError('');
    setOtpValue('');
    try {
      const res = await sendAbhaOtpApi(phone);
      const code = res.data?.demoOtp || '123456';
      setDemoOtpCode(code);
    } catch (err) {
      console.warn('OTP Send Error:', err.message);
      setDemoOtpCode('123456');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAbhaOtp = async () => {
    setOtpError('');
    const inputOtp = otpValue.trim();

    if (!inputOtp) {
      setOtpError('Please enter the 6-digit OTP code sent to your mobile.');
      return;
    }

    if (inputOtp !== demoOtpCode && inputOtp !== '123456') {
      setOtpError(`Invalid OTP code entered. Please check your mobile phone SMS and try again.`);
      return;
    }

    setIsVerifying(true);
    try {
      await verifyAbhaOtpApi(phone, inputOtp);
      setAbhaVerified(true);
      setShowAbhaModal(false);
      setFormError('');
    } catch (err) {
      setOtpError('OTP Verification Failed. Please check your SMS and try again.');
      setAbhaVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans relative text-slate-900 dark:text-slate-100">

      {/* Form Submission Error Banner if Unverified */}
      {formError && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/80 border-2 border-rose-300 dark:border-rose-500 text-rose-900 dark:text-rose-200 text-xs font-bold rounded-xl flex items-center space-x-2 animate-shake">
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Official Step Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1">
              <Fingerprint className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              STEP 01 / 05 • ABDM LEVEL M1 CERTIFIED
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Patient Identification & ABHA Account Verification
            <span className="block text-xs font-semibold text-blue-700 dark:text-cyan-400 mt-1 font-sans">
              Ayushman Bharat Digital Mission (ABDM) Healthcare Identification System
            </span>
          </h2>
        </div>

        <button
          type="button"
          onClick={handleQuickMockScan}
          className="px-3.5 py-1.5 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer active:scale-95 shadow-xs hover:bg-amber-200"
        >
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Auto-Fill Demo ABHA</span>
        </button>
      </div>

      {/* Official ABHA Card Verification Badge */}
      <div className="p-4 bg-blue-50/60 dark:bg-slate-900 border-2 border-blue-200 dark:border-cyan-500/40 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 flex flex-col items-center justify-center flex-shrink-0 border border-blue-200 dark:border-cyan-400/30">
            <Building2 className="w-5 h-5" />
            <span className="text-[7px] font-black uppercase text-blue-800 dark:text-cyan-300 font-mono">NHA</span>
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block text-sm tracking-tight">
              National Health Authority (NHA) Sandbox Adapter
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
              ABDM 14-Digit ABHA Number Verification Protocol
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {abhaVerified ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-300 dark:border-emerald-500/50 flex items-center gap-1.5 font-mono">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> ABHA VERIFIED
              </span>
              <button
                type="button"
                onClick={handleOpenOtpModal}
                className="px-2.5 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-blue-700 dark:text-cyan-300 rounded-lg font-bold text-xs border border-slate-300 dark:border-slate-700 transition cursor-pointer"
              >
                Re-Verify OTP
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOpenOtpModal}
              className="px-4 py-2.5 bg-blue-600 dark:bg-cyan-600 hover:bg-blue-700 dark:hover:bg-cyan-500 text-white rounded-lg font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4 text-blue-100 dark:text-cyan-200" />
              <span>Verify via OTP</span>
            </button>
          )}
        </div>
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ABHA ID */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            ABHA Health ID (14-digit) *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={abhaId}
              onChange={(e) => setAbhaId(e.target.value)}
              placeholder="ABHA-XXXX-XXXX-XXXX"
              className="w-full pl-3 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-500 focus:outline-none font-mono"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Full Patient Name *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Kumar"
              className="w-full pl-3 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-500 focus:outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Mobile Number (Aadhaar / ABHA Linked) *
          </label>
          <div className="relative">
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full pl-3 pr-9 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-500 focus:outline-none font-mono"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Age & Gender Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Age (Years) *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="34"
                className="w-full pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-500 focus:outline-none"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Gender *
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white focus:border-blue-600 dark:focus:border-cyan-500 focus:outline-none cursor-pointer"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-3.5 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer border ${
          abhaVerified
            ? 'bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 border-blue-400/40 active:scale-98'
            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-300'
        }`}
      >
        <span>VERIFY & PROCEED TO DIGITAL CONSENT</span>
        <CheckCircle className={`w-4 h-4 ${abhaVerified ? 'text-blue-200 dark:text-cyan-200' : 'text-slate-400'}`} />
      </button>

      {/* Interactive ABHA Verification Modal */}
      {showAbhaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 font-sans">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-cyan-500/50 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  ABHA OTP Authentication
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAbhaModal(false)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Standard NHA SMS Alert Notice */}
            <div className="p-3.5 bg-blue-50 dark:bg-cyan-950/80 rounded-lg text-xs text-blue-900 dark:text-cyan-200 border border-blue-200 dark:border-cyan-500/40 space-y-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-cyan-300">
                  <ShieldAlert className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  SMS Sent to Linked Mobile
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-500/40 font-mono">
                  SENT
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                An authentication OTP has been sent via SMS to mobile number ending in <strong>****{phone.slice(-4)}</strong>. Please enter the 6-digit code below.
              </p>
            </div>

            {/* Red Invalid OTP Error Alert */}
            {otpError && (
              <div className="p-2.5 bg-rose-50 dark:bg-rose-950/90 border border-rose-300 dark:border-rose-500 text-rose-900 dark:text-rose-200 text-xs font-bold rounded-lg flex items-center space-x-2 animate-shake">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Enter 6-Digit Verification OTP *
              </label>
              <input
                type="text"
                value={otpValue}
                onChange={(e) => {
                  setOtpValue(e.target.value);
                  setOtpError('');
                }}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="w-full text-center tracking-widest text-xl font-black py-2.5 bg-slate-50 dark:bg-slate-950 border border-blue-300 dark:border-cyan-500/50 rounded-lg text-blue-900 dark:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAbhaModal(false)}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifyAbhaOtp}
                disabled={isVerifying || isSendingOtp}
                className="px-4 py-2 bg-blue-600 dark:bg-cyan-600 hover:bg-blue-700 dark:hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {(isVerifying || isSendingOtp) && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isVerifying ? 'Authenticating...' : 'Authenticate'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}