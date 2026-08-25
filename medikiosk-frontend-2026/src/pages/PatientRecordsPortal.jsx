import React, { useState } from 'react';
import { 
  QrCode, ShieldCheck, FileText, 
  Pill, Calendar, Download, ExternalLink, CheckCircle2, Ticket
} from 'lucide-react';

import { useAuth } from '../context/useAuth';

export default function PatientRecordsPortal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('RECORDS');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const patientName = user?.name || 'Rahul Kumar';
  const abhaId = user?.abhaId || '91-8472-1029-4412';

  const healthRecords = [
    {
      id: 'REC-2026-01',
      title: 'OPD Clinical Intake Summary',
      facility: 'MediKiosk AI Smart Station #04',
      date: 'Today, 09:42 AM',
      type: 'FHIR Composition',
      doctor: 'Dr. Priya Nair, MD',
      details: 'SOCRATES 8-point symptom analysis completed with digitized lipid panel records.'
    },
    {
      id: 'REC-2026-02',
      title: 'Comprehensive Lipid & Glycemic Panel',
      facility: 'Central Diagnostic Laboratory',
      date: '15 Feb 2026',
      type: 'Diagnostic Report',
      doctor: 'Dr. A. Verma, Pathologist',
      details: 'HbA1c 8.4% (Elevated), Total Cholesterol 224 mg/dL.'
    },
    {
      id: 'REC-2021-03',
      title: 'Inpatient Cardiology Discharge Summary',
      facility: 'Fortis Escorts Heart Institute',
      date: '12 Nov 2021',
      type: 'Discharge Summary',
      doctor: 'Dr. S. K. Gupta, DM Cardio',
      details: 'Coronary Artery Disease, successful PTCA with drug-eluting stent to LAD.'
    }
  ];

  const activeMedications = [
    { name: 'Ecosprin (Aspirin)', dosage: '75 mg', freq: 'Once daily (OD)', timing: 'Post Breakfast', reason: 'Cardioprotective' },
    { name: 'Atorvastatin', dosage: '40 mg', freq: 'Once daily at night (HS)', timing: 'Post Dinner', reason: 'Lipid Regulation' },
    { name: 'Metoprolol Succinate', dosage: '25 mg', freq: 'Twice daily (BD)', timing: 'Morning & Evening', reason: 'Blood Pressure & Heart Rate' },
  ];

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner & ABHA Digital Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Profile Card */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
                {patientName.charAt(0)}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {patientName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold border border-blue-200 dark:border-blue-500/30">
                    ABHA Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ABHA ID: <strong className="text-blue-600 dark:text-blue-400">{abhaId}</strong> • Male, 34 yrs
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs shadow-xs transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              {downloadSuccess ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{downloadSuccess ? 'Downloaded!' : 'Export PHR Bundle'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Active Queue Pass</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-blue-600" /> OPD-304 (Desk 12)
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">DPDP 2023 Consent</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Enforced & Active
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Linked ABDM Health Records</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                3 Documents Linked
              </p>
            </div>
          </div>
        </div>

        {/* Digital ABHA Card Visual */}
        <div className="lg:col-span-4 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-6 rounded-3xl shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-200">
                Ayushman Bharat Digital Mission
              </span>
              <h3 className="text-base font-black tracking-tight mt-0.5">
                ABHA Health Locker
              </h3>
            </div>
            <QrCode className="w-8 h-8 text-blue-200" />
          </div>

          <div className="my-4 space-y-1">
            <p className="text-[10px] font-mono text-blue-200">ABHA ADDRESS NUMBER</p>
            <p className="text-lg font-mono font-extrabold tracking-wider">{abhaId}</p>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-blue-200 pt-2 border-t border-white/15">
            <span>GOVERNMENT OF INDIA</span>
            <span>HL7 FHIR R4 COMPLIANT</span>
          </div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('RECORDS')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'RECORDS'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Clinical Encounter Records ({healthRecords.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('MEDS')}
          className={`px-4 py-2 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center space-x-1.5 ${
            activeTab === 'MEDS'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Active Prescriptions ({activeMedications.length})</span>
        </button>
      </div>

      {/* Tab 1: Clinical Records Timeline */}
      {activeTab === 'RECORDS' && (
        <div className="space-y-3.5">
          {healthRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 rounded-2xl flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {rec.title}
                    </h4>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold rounded-md">
                      {rec.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-mono mt-1">
                    {rec.facility} • {rec.doctor}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {rec.details}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 flex-shrink-0">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {rec.date}
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-mono font-semibold rounded-xl transition flex items-center gap-1 cursor-pointer"
                >
                  <span>View Record</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Active Prescriptions */}
      {activeTab === 'MEDS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeMedications.map((med, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 rounded-2xl">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {med.name}
                  </h4>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {med.dosage}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                <p><strong className="text-slate-400 font-mono text-[11px]">Frequency:</strong> {med.freq}</p>
                <p><strong className="text-slate-400 font-mono text-[11px]">Timing:</strong> {med.timing}</p>
                <p><strong className="text-slate-400 font-mono text-[11px]">Indication:</strong> {med.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
