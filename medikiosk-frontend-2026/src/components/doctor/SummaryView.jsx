import React, { useState } from 'react';
import { 
  HeartPulse, History, Users, ShieldAlert, CheckCircle2, 
  Clock, MapPin, Zap, Activity, Flame, Edit3, Save, Sparkles, 
  BadgeCheck 
} from 'lucide-react';

export default function SummaryView({ summary, isSignedOff, onSaveSummary, onSignOff }) {
  const [isEditing, setIsEditing] = useState(false);
  const [customEdits, setCustomEdits] = useState({});
  const [justSignedOff, setJustSignedOff] = useState(false);

  if (!summary) return null;

  const currentSummary = {
    ...summary,
    ...customEdits,
    chiefComplaint: {
      ...summary.chiefComplaint,
      ...(customEdits.chiefComplaint || {})
    },
    socrates: summary.socrates ? {
      ...summary.socrates,
      ...(customEdits.socrates || {})
    } : null
  };

  const handleFieldChange = (section, key, value) => {
    setCustomEdits((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: {
          ...(prev[section]?.[key] || summary[section]?.[key] || {}),
          text: value
        }
      }
    }));
  };

  const handleTagToggle = (section, key) => {
    const currentTag = prevTag(section, key);
    const nextTag = currentTag === 'stated' ? 'inferred' : currentTag === 'inferred' ? 'missing' : 'stated';
    setCustomEdits((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: {
          ...(prev[section]?.[key] || summary[section]?.[key] || {}),
          tag: nextTag
        }
      }
    }));
  };

  const prevTag = (section, key) => {
    if (section === 'chiefComplaint') {
      return customEdits.chiefComplaint?.tag || summary.chiefComplaint?.tag || 'stated';
    }
    return customEdits[section]?.[key]?.tag || summary[section]?.[key]?.tag || 'stated';
  };

  const handleChiefChange = (value) => {
    setCustomEdits((prev) => ({
      ...prev,
      chiefComplaint: {
        ...(prev.chiefComplaint || summary.chiefComplaint || {}),
        text: value
      }
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onSaveSummary) {
      onSaveSummary(currentSummary);
    }
  };

  const handleTriggerSignOff = () => {
    setJustSignedOff(true);
    if (onSignOff) {
      onSignOff();
    }
    setTimeout(() => setJustSignedOff(false), 3000);
  };

  const renderTagBadge = (tag, onToggle) => {
    const t = tag?.toLowerCase();
    if (t === 'stated') {
      return (
        <button
          type="button"
          onClick={onToggle}
          disabled={!isEditing}
          className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 ${isEditing ? 'cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-900' : ''}`}
          title={isEditing ? 'Click to cycle tag (Stated -> Inferred -> Missing)' : 'Patient Stated'}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1"></span>
          Stated
        </button>
      );
    }
    if (t === 'inferred') {
      return (
        <button
          type="button"
          onClick={onToggle}
          disabled={!isEditing}
          className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 ${isEditing ? 'cursor-pointer hover:bg-amber-200 dark:hover:bg-amber-900' : ''}`}
          title={isEditing ? 'Click to cycle tag (Inferred -> Missing -> Stated)' : 'Model Inferred'}
        >
          <Sparkles className="w-2.5 h-2.5 mr-1 text-amber-600 dark:text-amber-400" />
          Inferred
        </button>
      );
    }
    return (
      <button
        type="button"
        onClick={onToggle}
        disabled={!isEditing}
        className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 ${isEditing ? 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900' : ''}`}
        title={isEditing ? 'Click to cycle tag (Missing -> Stated -> Inferred)' : 'Missing/Unspecified'}
      >
        Missing
      </button>
    );
  };

  const socratesMeta = {
    site: { label: 'Site', icon: <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> },
    onset: { label: 'Onset', icon: <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> },
    character: { label: 'Character', icon: <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> },
    radiation: { label: 'Radiation', icon: <Zap className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> },
    associations: { label: 'Signs / Symptoms', icon: <HeartPulse className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> },
    timing: { label: 'Timing', icon: <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> },
    exacerbating: { label: 'Triggers / Relief', icon: <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> },
    severity: { label: 'Severity', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> },
  };

  const signed = isSignedOff || justSignedOff;

  return (
    <div className="gov-card p-5 sm:p-6 space-y-5 shadow-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-sans">
      
      {/* Top Clinical Header & Actions */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-400/30 text-blue-600 dark:text-cyan-400 flex items-center justify-center shadow-xs font-mono">
            <HeartPulse className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">
                Physician-Verified Structured Clinical Summary
              </h3>
              {signed && (
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded flex items-center gap-1 border border-emerald-300 dark:border-emerald-500/40 font-mono">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Doctor Signed-Off
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Structured SOCRATES pre-consultation extraction • Confidence Classification Tagged
            </p>
          </div>
        </div>

        {/* Doctor Controls: Edit & Sign-off Buttons */}
        <div className="flex items-center space-x-2 font-mono">
          {isEditing ? (
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 text-white rounded text-xs font-bold transition flex items-center space-x-1 cursor-pointer active:scale-95 border border-blue-400/40"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-xs font-semibold border border-slate-300 dark:border-slate-700 transition flex items-center space-x-1 cursor-pointer active:scale-95"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Edit Summary</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleTriggerSignOff}
            className={`px-3.5 py-1.5 rounded text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer active:scale-95 border ${
              signed
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 text-white border-slate-700 dark:border-cyan-400/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{signed ? 'Verified & Signed Off' : 'Sign Off & Validate'}</span>
          </button>
        </div>
      </div>

      {/* Chief Complaint Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Flame className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Primary Chief Complaint
          </span>
          {renderTagBadge(prevTag('chiefComplaint'), () => handleTagToggle('chiefComplaint'))}
        </div>

        {isEditing ? (
          <textarea
            rows={2}
            value={currentSummary.chiefComplaint?.text || ''}
            onChange={(e) => handleChiefChange(e.target.value)}
            className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-sans"
          />
        ) : (
          <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentSummary.chiefComplaint?.text || 'Not provided'}
          </p>
        )}
      </div>

      {/* SOCRATES Structured 8-Fold Grid */}
      {currentSummary.socrates && (
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <History className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" /> SOCRATES Symptom Analysis Matrix
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(socratesMeta).map(([key, meta]) => {
              const item = currentSummary.socrates?.[key] || { text: 'Not elicited', tag: 'missing' };
              return (
                <div key={key} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      {meta.icon} {meta.label}
                    </span>
                    {renderTagBadge(item.tag, () => handleTagToggle('socrates', key))}
                  </div>

                  {isEditing ? (
                    <input
                      type="text"
                      value={item.text || ''}
                      onChange={(e) => handleFieldChange('socrates', key, e.target.value)}
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded text-xs font-bold text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-sans"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {item.text || 'Not elicited'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Auxiliary Medical History Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] block font-mono">Past Medical History</span>
          <p className="font-bold text-slate-900 dark:text-white">{currentSummary.pastMedical?.text || 'None reported'}</p>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-xs">
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] block font-mono">Allergies</span>
          <p className="font-bold text-slate-900 dark:text-white">{currentSummary.allergies?.text || 'NKDA (No Known Drug Allergies reported)'}</p>
        </div>
      </div>
    </div>
  );
}