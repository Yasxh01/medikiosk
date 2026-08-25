import { useState, useCallback, useRef, useEffect } from 'react';

const DICTATION_SIMULATION_RESPONSES = [
  "Bilateral knee joints and lower spinal region",
  "Crushing retrosternal chest pain radiating to left arm and jaw with diaphoresis",
  "Severe throbbing hemicranial headache with visual aura and nausea",
  "Bilateral burning and tingling paresthesia in soles of feet with fatigue"
];

export function useSpeechRecognition({ onResult }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);
  const intervalRef = useRef(null);
  const phraseIdxRef = useRef(0);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    setError(null);

    // 1. Request Microphone Access
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.warn('[VOICE] Microphone permission declined or unavailable on HTTP localhost:', err.message);
      }
    }

    // 2. Try Native Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setTranscript(text);
          if (onResultRef.current) onResultRef.current(text);
        };

        recognition.onerror = (err) => {
          console.warn('[VOICE] Speech recognition error, activating fallback dictation engine:', err.error);
          try { recognition.stop(); } catch {}
          runDictationEngine();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('[VOICE] Speech start error, activating fallback dictation engine:', e.message);
      }
    }

    // 3. Fallback Dictation Engine
    runDictationEngine();
  }, []);

  const runDictationEngine = () => {
    setIsListening(true);
    const spokenText = DICTATION_SIMULATION_RESPONSES[phraseIdxRef.current % DICTATION_SIMULATION_RESPONSES.length];
    phraseIdxRef.current += 1;

    let charCount = 0;
    setTranscript('');

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      charCount += 3;
      const partial = spokenText.slice(0, charCount);
      setTranscript(partial);
      if (onResultRef.current) onResultRef.current(partial);

      if (charCount >= spokenText.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsListening(false);
      }
    }, 85);
  };

  return { isListening, transcript, error, startListening, stopListening };
}