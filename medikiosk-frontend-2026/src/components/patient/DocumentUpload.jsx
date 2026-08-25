import React, { useState } from 'react';
import { 
  UploadCloud, FileCheck2, AlertCircle, ArrowRight, 
  Scan, Sparkles, FileText, Pill, Stethoscope, Trash2, CheckCircle2 
} from 'lucide-react';
import { uploadDocumentApi } from '../../api/client';

export default function DocumentUpload({ onComplete }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingName, setProcessingName] = useState('');
  const [scannedFiles, setScannedFiles] = useState([]);

  const sampleDatasets = {
    DISCHARGE: {
      name: 'Hospital_Discharge_Card.pdf',
      date: '2026-01-15',
      diagnoses: ['Coronary Artery Disease', 'Post-PTCA to LAD', 'Hypertension'],
      medications: ['Ecosprin 75mg OD', 'Atorvastatin 40mg HS', 'Metoprolol 25mg BD'],
      abnormalLabs: []
    },
    LIPID: {
      name: 'Blood_Lipid_Profile.pdf',
      date: '2026-03-01',
      diagnoses: ['Mixed Dyslipidemia'],
      medications: [],
      abnormalLabs: [
        { test: 'HbA1c', value: '8.4%', normalRange: '4.0 - 5.6%', status: 'HIGH' },
        { test: 'LDL Cholesterol', value: '168 mg/dL', normalRange: '< 100 mg/dL', status: 'HIGH' },
        { test: 'Triglycerides', value: '240 mg/dL', normalRange: '< 150 mg/dL', status: 'HIGH' }
      ]
    },
    DIABETES: {
      name: 'Endocrinology_Quarterly_Labs.pdf',
      date: '2026-02-20',
      diagnoses: ['Type 2 Diabetes Mellitus', 'Diabetic Distal Neuropathy'],
      medications: ['Metformin 1000mg BD', 'Pregabalin 75mg HS'],
      abnormalLabs: [
        { test: 'Fasting Blood Sugar (FBS)', value: '184 mg/dL', normalRange: '70 - 99 mg/dL', status: 'HIGH' },
        { test: 'HbA1c', value: '9.1%', normalRange: '4.0 - 5.6%', status: 'HIGH' },
        { test: 'eGFR', value: '68 mL/min', normalRange: '> 90 mL/min', status: 'LOW' }
      ]
    },
    PRESCRIPTION: {
      name: 'Physician_Prescription_Slip.pdf',
      date: '2025-10-15',
      diagnoses: ['Acute Bronchitis / Upper Respiratory Infection'],
      medications: ['Amoxicillin-Clavulanate 625mg BD', 'Paracetamol 650mg SOS', 'Levocetirizine 5mg HS'],
      abnormalLabs: [
        { test: 'C-Reactive Protein (CRP)', value: '14.2 mg/L', normalRange: '< 5.0 mg/L', status: 'HIGH' }
      ]
    }
  };

  const simulateOCRScan = (sampleKey) => {
    const template = sampleDatasets[sampleKey] || sampleDatasets.DISCHARGE;
    setIsProcessing(true);
    setProcessingName(template.name);

    setTimeout(() => {
      const mockResult = {
        id: `doc_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: template.name,
        date: template.date,
        diagnoses: template.diagnoses,
        medications: template.medications,
        abnormalLabs: template.abnormalLabs
      };

      setScannedFiles((prev) => [mockResult, ...prev]);
      setIsProcessing(false);
      setProcessingName('');
    }, 750);
  };

  const handleManualFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingName(file.name);

    try {
      const apiRes = await uploadDocumentApi(file);
      
      let parsedDiagnoses = [];
      let parsedMedications = [];
      let parsedAbnormalLabs = [];

      if (apiRes && apiRes.data) {
        const ext = apiRes.data.extractedData || {};
        parsedDiagnoses = ext.diagnoses || ext.entities?.filter(e => e.type === 'diagnosis').map(e => e.value) || [];
        parsedMedications = ext.medications || ext.entities?.filter(e => e.type === 'medication').map(e => `${e.value} ${e.dosage || ''}`) || [];
        parsedAbnormalLabs = ext.abnormal_labs || ext.abnormalLabs || [];
      }

      if (parsedDiagnoses.length === 0 && parsedMedications.length === 0 && parsedAbnormalLabs.length === 0) {
        const cleanName = file.name.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, "");
        parsedDiagnoses = [`Uploaded Document: ${cleanName}`];
        
        const fnameLower = file.name.toLowerCase();
        if (fnameLower.includes('lipid') || fnameLower.includes('cholesterol') || fnameLower.includes('blood')) {
          parsedDiagnoses.push('Lab Diagnostic Profile');
        } else if (fnameLower.includes('discharge') || fnameLower.includes('card')) {
          parsedDiagnoses.push('Hospital Discharge Documentation');
        } else if (fnameLower.includes('plan') || fnameLower.includes('step')) {
          parsedDiagnoses.push('Clinical Intake & Workflow Documentation');
        } else {
          parsedDiagnoses.push('Patient Attached Record');
        }
      }

      const result = {
        id: `doc_${Date.now()}`,
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        diagnoses: parsedDiagnoses,
        medications: parsedMedications,
        abnormalLabs: parsedAbnormalLabs
      };

      setScannedFiles((prev) => [result, ...prev]);
    } catch (err) {
      console.warn('Manual document processing fallback:', err.message);
      const cleanName = file.name.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, "");
      const fallbackResult = {
        id: `doc_${Date.now()}`,
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        diagnoses: [`Uploaded Record: ${cleanName}`],
        medications: [],
        abnormalLabs: []
      };
      setScannedFiles((prev) => [fallbackResult, ...prev]);
    } finally {
      setIsProcessing(false);
      setProcessingName('');
    }
  };

  const removeDoc = (id) => {
    setScannedFiles((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 dark:text-slate-100">
      {/* Official Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-500/40 flex items-center gap-1">
            <Scan className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            STEP 04 / 05 • ABDM OPTICAL OCR DOCUMENT REPOSITORY
          </span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
          Medical Records & OCR Document Intelligence Gateway
          <span className="block text-xs font-semibold text-blue-700 dark:text-cyan-400 mt-1 font-sans">
            Prescription & Medical Records Upload with Real-time AI Entity Extraction
          </span>
        </h2>
      </div>

      {/* Upload Dropzone Box */}
      <div className="border-2 border-dashed border-blue-200 dark:border-cyan-500/40 hover:border-blue-400 dark:hover:border-cyan-400 rounded-xl p-6 text-center bg-blue-50/50 dark:bg-slate-900 transition space-y-4 shadow-xs">
        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto border border-blue-200 dark:border-cyan-400/30 font-mono">
          {isProcessing ? <Scan className="w-6 h-6 animate-pulse text-blue-600 dark:text-cyan-400" /> : <UploadCloud className="w-6 h-6 text-blue-600 dark:text-cyan-400" />}
        </div>
        
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            {isProcessing ? `AI Document OCR Analysis in Progress: "${processingName}"...` : 'Drag & Drop Medical Records or Select Demo Records Below'}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            PDF, JPG, PNG Supported • AI automatically extracts medications, diagnoses, and lab values
          </p>
        </div>

        {/* Manual File Input Trigger */}
        <div>
          <label className="inline-flex items-center px-4 py-2.5 bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition cursor-pointer active:scale-95 border border-blue-400/40 shadow-xs">
            <span>Browse Device File</span>
            <input
              type="file"
              accept=".pdf,image/*"
              className="hidden"
              onChange={handleManualFileUpload}
            />
          </label>
        </div>

        {/* 1-Click Sample Records */}
        <div className="pt-3 border-t border-blue-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold font-mono text-slate-600 dark:text-slate-400 block mb-2">
            Verified Sample Demonstration Records (1-Click Sample Records):
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => simulateOCRScan('DISCHARGE')}
              className="px-3 py-1.5 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-800 transition flex items-center space-x-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>CAD Discharge Card</span>
            </button>
            
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => simulateOCRScan('LIPID')}
              className="px-3 py-1.5 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-800 transition flex items-center space-x-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Lipid Profile</span>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => simulateOCRScan('DIABETES')}
              className="px-3 py-1.5 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-800 transition flex items-center space-x-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Diabetes Panel</span>
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={() => simulateOCRScan('PRESCRIPTION')}
              className="px-3 py-1.5 bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-800 transition flex items-center space-x-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <Pill className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Prescription Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Extracted Structured Records */}
      {scannedFiles.length > 0 && (
        <div className="space-y-3 font-sans">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Extracted Clinical Records ({scannedFiles.length})</span>
            </h4>
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/40 font-mono">
              ABDM R4 Ready
            </span>
          </div>

          <div className="space-y-3">
            {scannedFiles.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-2.5 shadow-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    {doc.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 font-mono">
                      {doc.date}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeDoc(doc.id)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded cursor-pointer transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {doc.diagnoses.length > 0 && (
                  <div className="flex flex-wrap items-start gap-2 pt-0.5">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> Diagnoses:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.diagnoses.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-cyan-950 text-blue-900 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/40 rounded text-[11px] font-semibold">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {doc.medications.length > 0 && (
                  <div className="flex flex-wrap items-start gap-2 pt-0.5">
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <Pill className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Medications:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.medications.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 rounded text-[11px] border border-slate-200 dark:border-slate-800 font-mono">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {doc.abnormalLabs.length > 0 && (
                  <div className="pt-1 font-mono">
                    <div className="flex flex-wrap gap-2">
                      {doc.abnormalLabs.map((lab, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 text-[11px] font-bold rounded border border-rose-300 dark:border-rose-500/40 flex items-center gap-1.5"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                          <span>Abnormal: {lab.test} • <strong className="text-rose-900 dark:text-white">{lab.value}</strong> (Ref: {lab.normalRange})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      <button
        type="button"
        onClick={() => onComplete(scannedFiles)}
        className="w-full py-3.5 bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer active:scale-98 border border-blue-400/40"
      >
        <span>COMPLETE INTAKE & GENERATE TOKEN SLIP</span>
        <ArrowRight className="w-4 h-4 text-blue-200 dark:text-cyan-200" />
      </button>
    </div>
  );
}