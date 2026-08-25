import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, AlertOctagon, Users, ShieldCheck, 
  Activity, Sparkles, CheckCircle2, Database, HeartPulse
} from 'lucide-react';

export default function DoctorAnalyticsView() {
  const [timeRange, setTimeRange] = useState('TODAY');

  const stats = [
    { label: 'Total Ingested Intakes', value: '142', change: '+18%', icon: Users, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' },
    { label: 'Emergency Red Flags', value: '7', change: 'STAT Priority', icon: AlertOctagon, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60' },
    { label: 'ABDM FHIR Dispatches', value: '138', change: '97.2% Sync', icon: Database, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60' },
    { label: 'Avg Triage Duration', value: '3.4 min', change: '-42% vs Manual', icon: Activity, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
  ];

  const diagnosticTrends = [
    { condition: 'Acute Coronary Syndrome / Chest Pain', count: 18, pct: 28, trend: '+4 today', urgency: 'CRITICAL' },
    { condition: 'Sandhivata / Chronic Joint Osteoarthritis', count: 24, pct: 36, trend: '+7 today', urgency: 'ROUTINE' },
    { condition: 'Dyslipidemia / Metabolic Syndrome', count: 15, pct: 22, trend: '+2 today', urgency: 'MODERATE' },
    { condition: 'Upper Respiratory Viral Syndrome', count: 9, pct: 14, trend: '-3 today', urgency: 'ROUTINE' },
  ];

  const auditEvents = [
    { time: '10:14 AM', event: 'ABDM Bundle Token Generated (OPD-304)', abha: '91-8472-1029-4412', status: 'SYNCHRONIZED' },
    { time: '09:58 AM', event: 'STAT Red-Flag Escalation (EMERG-001)', abha: '91-9921-4820-1102', status: 'DISPATCHED' },
    { time: '09:45 AM', event: 'AYUSH Dashavidha Assessment Verified', abha: '91-3310-7712-9014', status: 'VERIFIED' },
    { time: '09:20 AM', event: 'DPDP 2023 Statutory Consent Logged', abha: '91-5582-9011-3421', status: 'AUDITED' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-xs">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Clinical Intelligence & Triage Analytics
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Real-Time Outpatient Telemetry • ABDM Gateway Synchronizer
              </p>
            </div>
          </div>
        </div>

        {/* Time Range Filter Pills */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-mono">
          {['TODAY', 'THIS WEEK', 'MONTHLY'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                timeRange === r
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <div className={`p-2.5 rounded-2xl ${st.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {st.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {st.value}
                </p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {st.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center 2-Column Split: Clinical Streams Breakdown & Top Diagnostic Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Stream Breakdown (Allopathy vs AYUSH) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Multi-Stream Clinical Triage Distribution
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">142 Cases</span>
          </div>

          <div className="space-y-4">
            {/* General Allopathy Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <HeartPulse className="w-3.5 h-3.5 text-blue-600" /> General Allopathy OPD
                </span>
                <span className="font-mono text-blue-600 dark:text-blue-400">92 Cases (64.8%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '65%' }} />
              </div>
            </div>

            {/* AYUSH Ayurveda Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AYUSH / Ayurveda Dashavidha
                </span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400">50 Cases (35.2%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: '35%' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <span className="font-bold text-slate-900 dark:text-white block font-mono text-[11px] uppercase">
              Triage AI Accuracy & Confidence
            </span>
            <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-base font-extrabold text-emerald-600">98.4%</p>
                <p className="text-[10px] text-slate-400">SOCRATES Extr.</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-base font-extrabold text-blue-600">99.1%</p>
                <p className="text-[10px] text-slate-400">OCR Parsing</p>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <p className="text-base font-extrabold text-indigo-600">100%</p>
                <p className="text-[10px] text-slate-400">FHIR R4 Format</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Presenting Conditions */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Prevalent Clinical Syndromes (Today)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Live Heatmap</span>
          </div>

          <div className="space-y-3">
            {diagnosticTrends.map((d, i) => (
              <div key={i} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {d.condition}
                  </p>
                  <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                    {d.count} patients ({d.pct}%) • <span className="text-indigo-600 font-semibold">{d.trend}</span>
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold ${
                  d.urgency === 'CRITICAL'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    : d.urgency === 'MODERATE'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    : 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}>
                  {d.urgency}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ABDM M1 Gateway Sync Log */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              ABDM M1 Milestone & FHIR R4 Ingestion Stream
            </h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Gateway Connected
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-400">
                <th className="pb-2 font-bold">TIMESTAMP</th>
                <th className="pb-2 font-bold">AUDIT EVENT</th>
                <th className="pb-2 font-bold">PATIENT ABHA ID</th>
                <th className="pb-2 font-bold text-right">GATEWAY STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
              {auditEvents.map((evt, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 text-slate-500">{evt.time}</td>
                  <td className="py-3 font-semibold text-slate-900 dark:text-slate-200">{evt.event}</td>
                  <td className="py-3 text-indigo-600 dark:text-indigo-400">{evt.abha}</td>
                  <td className="py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50 text-[10px] font-bold">
                      {evt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
