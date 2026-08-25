import React, { useState, useEffect, useRef } from 'react';
import VoiceInputButton from '../shared/VoiceInputButton';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { 
  Sparkles, ArrowRight, Bot, User, BrainCircuit, Check, 
  Volume2, AlertOctagon, ChevronRight 
} from 'lucide-react';

export default function ChatInterview({ onComplete, onTriggerRedFlag }) {
  const [coverageMap, setCoverageMap] = useState({
    chiefComplaint: '',
    site: '',
    onset: '',
    character: '',
    radiation: '',
    associations: '',
    timing: '',
    exacerbating: '',
    severity: ''
  });

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [userInputText, setUserInputText] = useState('');
  const [detectedRedFlags, setDetectedRedFlags] = useState([]);
  const chatScrollRef = useRef(null);

  const questionsSequence = [
    { 
      key: 'chiefComplaint', 
      label: 'Chief Complaint', 
      text: 'What primary health concern or symptom brings you to the hospital today?',
      options: [
        'Crushing retrosternal chest pain radiating to left arm & jaw',
        'Bilateral knee joint pain with severe morning stiffness',
        'Severe throbbing hemicranial headache with visual aura',
        'Bilateral burning tingling sensation in soles with fatigue'
      ]
    },
    { 
      key: 'site', 
      label: 'Site / Location', 
      text: 'Where exactly in your body is this pain or discomfort located?',
      options: [
        'Retrosternal chest behind breastbone radiating to left arm',
        'Bilateral knee joints and lower spinal region',
        'Right fronto-temporal cranial region and retro-orbital',
        'Bilateral feet, soles, and toes in stocking distribution'
      ]
    },
    { 
      key: 'onset', 
      label: 'Onset Timing', 
      text: 'When and how did this symptom begin? Was it sudden or gradual?',
      options: [
        'Sudden severe onset 2 hours ago with diaphoresis',
        'Gradual development over past 6 months',
        'Began 4 hours ago following visual aura',
        'Progressive numbness developing over 3 months'
      ]
    },
    { 
      key: 'character', 
      label: 'Pain Character', 
      text: 'How would you describe the feeling or sensation of this discomfort?',
      options: [
        'Heavy crushing pressure & squeezing tightness',
        'Dull persistent aching with joint stiffness',
        'Pulsatile, throbbing pounding ache',
        'Burning, prickling tingling paresthesia'
      ]
    },
    { 
      key: 'radiation', 
      label: 'Radiation Path', 
      text: 'Does this pain radiate or spread to any other part of your body?',
      options: [
        'Radiates to left arm, shoulder, neck, and jaw',
        'Localized to knees; no radiation',
        'Radiates into eye socket and neck',
        'Ascends up to mid-calf bilaterally'
      ]
    },
    { 
      key: 'associations', 
      label: 'Associated Signs', 
      text: 'Are you experiencing any associated symptoms like sweating, nausea, or breathlessness?',
      options: [
        'Shortness of breath & profuse diaphoresis',
        'Post-meal heaviness & irregular appetite',
        'Nausea, photophobia & phonophobia',
        'Frequent nighttime urination & blurred vision'
      ]
    },
    { 
      key: 'exacerbating', 
      label: 'Triggers / Relief', 
      text: 'What specific movements, weather, or rest factors make it better or worse?',
      options: [
        'Physical movement worsens; no rest relief',
        'Cold damp weather & early morning worsen',
        'Bright light & noise worsen; dark quiet room relieves',
        'Walking long distances worsens tingling'
      ]
    },
    { 
      key: 'severity', 
      label: 'Severity Scale', 
      text: 'On a scale from 1 to 10, how severe is your pain right now?',
      options: [
        '8 / 10 (Severe Acute Pain)',
        '4 / 10 (Moderate Chronic Aching)',
        '6 / 10 (Moderate Severe Pain)',
        '5 / 10 (Moderate Burning Discomfort)'
      ]
    }
  ];

  const currentQuestion = questionsSequence[currentPromptIndex];

  const [chatLog, setChatLog] = useState([
    {
      sender: 'ai',
      text: 'Welcome to MediKiosk AI Clinical Intake. Let us record your symptoms for the attending doctor.'
    },
    {
      sender: 'ai',
      text: questionsSequence[0].text
    }
  ]);

  const { isListening, transcript, startListening, stopListening } = useSpeechRecognition({
    onResult: (spokenText) => {
      setUserInputText(spokenText);
    }
  });

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatLog]);

  const processResponse = (answerText) => {
    if (!answerText.trim()) return;

    const newLog = [...chatLog, { sender: 'user', text: answerText }];

    // Check emergency red flags
    const lower = answerText.toLowerCase();
    const newFlags = [...detectedRedFlags];
    if (lower.includes('chest pain') || lower.includes('shortness of breath') || lower.includes('crushing') || lower.includes('radiating to left arm')) {
      if (!newFlags.includes('STAT Emergency: Severe crushing chest pain with dyspnea')) {
        newFlags.push('STAT Emergency: Severe crushing chest pain with dyspnea');
      }
    }
    setDetectedRedFlags(newFlags);
    if (newFlags.length > 0 && onTriggerRedFlag) {
      onTriggerRedFlag(newFlags);
    }

    const currentKey = currentQuestion.key;
    const updatedMap = { ...coverageMap, [currentKey]: answerText };
    setCoverageMap(updatedMap);

    const nextIndex = currentPromptIndex + 1;
    if (nextIndex < questionsSequence.length) {
      setCurrentPromptIndex(nextIndex);
      newLog.push({
        sender: 'ai',
        text: questionsSequence[nextIndex].text
      });
      setChatLog(newLog);
      setUserInputText('');
    } else {
      newLog.push({
        sender: 'ai',
        text: 'Thank you! Your symptoms have been recorded under ABDM HL7 FHIR standards. Proceed to attach medical records.'
      });
      setChatLog(newLog);
      setUserInputText('');

      if (onComplete) {
        onComplete(updatedMap);
      }
    }
  };

  const filledCount = Object.values(coverageMap).filter(Boolean).length;
  const coveragePercent = Math.round((filledCount / questionsSequence.length) * 100);

  return (
    <div className="space-y-4 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Official Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3.5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-100 dark:bg-cyan-950 text-blue-900 dark:text-cyan-300 font-mono text-[10px] font-black uppercase tracking-wider border border-blue-200 dark:border-cyan-500/40 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              STEP 03 / 05 • SOCRATES SYMPTOM TELEMETRY
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            Autonomous Voice & Touch Interactive Symptom Recording
          </h2>
        </div>

        <div className="flex items-center space-x-2 font-mono">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Coverage:</span>
          <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-cyan-950 text-blue-900 dark:text-cyan-300 font-bold text-xs rounded border border-blue-300 dark:border-cyan-500/40">
            {coveragePercent}%
          </span>
        </div>
      </div>

      {/* Structured Coverage Status Tracker */}
      <div className="p-3 bg-blue-50/60 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 rounded-xl space-y-2 font-mono text-xs">
        <div className="flex justify-between items-center text-[11px]">
          <span className="font-bold text-slate-700 dark:text-slate-300">SOCRATES 8-Fold Telemetry Matrix:</span>
          <span className="text-blue-700 dark:text-cyan-400 font-bold">{filledCount} of {questionsSequence.length} Completed</span>
        </div>

        {/* Minimal Progress Line */}
        <div className="w-full bg-slate-200 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-800">
          <div
            className="bg-blue-600 dark:bg-cyan-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${coveragePercent}%` }}
          />
        </div>

        {/* Parameter Status Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {questionsSequence.map((item, idx) => {
            const isFilled = Boolean(coverageMap[item.key]);
            const isCurrent = idx === currentPromptIndex;
            return (
              <span
                key={item.key}
                className={`px-2 py-0.5 rounded text-[10px] transition flex items-center gap-1 ${
                  isFilled
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-500/40'
                    : isCurrent
                    ? 'bg-[#002244] dark:bg-cyan-600 text-white font-bold border border-blue-400'
                    : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-500'
                }`}
              >
                {isFilled && <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />}
                {item.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Chat History Stream */}
      <div 
        ref={chatScrollRef}
        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 max-h-[280px] overflow-y-auto space-y-3 shadow-inner"
      >
        {chatLog.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-[#002244] dark:bg-cyan-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs border border-white/20 dark:border-cyan-400/30 font-mono">
                <Bot className="w-4 h-4 text-amber-300 dark:text-cyan-200" />
              </div>
            )}
            
            <div
              className={`p-3 rounded-xl text-xs max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#002244] dark:bg-cyan-600 text-white rounded-tr-none font-medium border border-blue-400'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-xs'
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center flex-shrink-0 border border-slate-300 dark:border-slate-700 font-mono">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Touch-Friendly Direct Answer Options */}
      {currentPromptIndex < questionsSequence.length && (
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              Quick Touch Options for "{currentQuestion.label}":
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentQuestion.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => processResponse(opt)}
                className="p-3 bg-white dark:bg-slate-950 hover:bg-blue-50 dark:hover:bg-cyan-950/60 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-cyan-400 text-left text-xs font-medium text-slate-800 dark:text-slate-200 transition cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <span>{opt}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 flex-shrink-0 ml-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Free Text & Voice Input Bar */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={userInputText}
          onChange={(e) => setUserInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              processResponse(userInputText);
            }
          }}
          placeholder="Type or speak custom symptom details..."
          className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-blue-600 dark:focus:border-cyan-500 focus:outline-none shadow-xs font-sans"
        />

        <VoiceInputButton
          isListening={isListening}
          onStart={startListening}
          onStop={stopListening}
        />

        <button
          type="button"
          onClick={() => processResponse(userInputText)}
          className="px-4 py-3 bg-[#002244] dark:bg-cyan-600 hover:bg-blue-900 dark:hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer active:scale-95 border border-blue-400/40"
        >
          <span>Send</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>

    </div>
  );
}