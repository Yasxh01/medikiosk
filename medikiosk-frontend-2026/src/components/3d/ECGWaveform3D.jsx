import React, { useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';

export default function ECGWaveform3D({
  isRedFlag = false,
  bpm = 74,
  spo2 = 98
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 400);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 120);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener('resize', handleResize);

    // ECG Signal Buffer
    const bufferLength = 200;
    const ecgBuffer = new Array(bufferLength).fill(0);
    let sampleIndex = 0;

    // Normal ECG waveform template (P-Q-R-S-T)
    const getEcgSample = (t) => {
      const cycle = t % 1;
      if (cycle < 0.1) return 0;
      if (cycle < 0.2) return Math.sin(((cycle - 0.1) / 0.1) * Math.PI) * 0.18;
      if (cycle < 0.25) return 0;
      if (cycle < 0.28) return -0.15;
      if (cycle < 0.32) return 1.0;
      if (cycle < 0.36) return -0.3;
      if (cycle < 0.45) return isRedFlag ? 0.35 : 0;
      if (cycle < 0.65) return Math.sin(((cycle - 0.45) / 0.2) * Math.PI) * 0.35;
      return 0;
    };

    let time = 0;
    const speed = isRedFlag ? 0.024 : 0.016;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += speed;
      const newSample = getEcgSample(time);

      ecgBuffer[sampleIndex] = newSample;
      sampleIndex = (sampleIndex + 1) % bufferLength;

      const midY = height * 0.55;
      const amp = height * 0.4;
      const stepX = width / bufferLength;

      // Draw Grid Background Lines
      ctx.strokeStyle = isRedFlag ? 'rgba(244, 63, 94, 0.12)' : 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw 3D Depth Ribbon Shadow Layer
      ctx.beginPath();
      for (let i = 0; i < bufferLength; i++) {
        const idx = (sampleIndex + i) % bufferLength;
        const x = i * stepX;
        const y = midY - ecgBuffer[idx] * amp + 4;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isRedFlag ? 'rgba(244, 63, 94, 0.25)' : 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Main Glowing ECG Waveform
      ctx.beginPath();
      for (let i = 0; i < bufferLength; i++) {
        const idx = (sampleIndex + i) % bufferLength;
        const x = i * stepX;
        const y = midY - ecgBuffer[idx] * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isRedFlag ? '#f43f5e' : '#22d3ee';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = isRedFlag ? '#f43f5e' : '#06b6d4';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Leading Laser Point
      const leadIdx = (sampleIndex - 1 + bufferLength) % bufferLength;
      const leadX = (bufferLength - 1) * stepX;
      const leadY = midY - ecgBuffer[leadIdx] * amp;

      ctx.beginPath();
      ctx.arc(leadX, leadY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = isRedFlag ? '#f43f5e' : '#22d3ee';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isRedFlag]);

  return (
    <div className={`glass-card rounded-2xl border ${isRedFlag ? 'border-rose-500/40 bg-rose-950/20' : 'border-slate-200 dark:border-cyan-500/20 bg-slate-50/80 dark:bg-slate-900/80'} p-3 sm:p-4 relative overflow-hidden shadow-inner font-mono`}>
      {/* Telemetry Status Bar */}
      <div className="flex justify-between items-center mb-1.5 z-10 relative">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded-lg ${isRedFlag ? 'bg-rose-500/20 text-rose-400' : 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'}`}>
            <Heart className={`w-3.5 h-3.5 ${isRedFlag ? 'animate-ping text-rose-500' : 'animate-pulse'}`} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              Live Biometric ECG Telemetry
              {isRedFlag && (
                <span className="px-1.5 py-0.2 rounded bg-rose-500 text-white font-black text-[9px] animate-pulse">
                  ST-ELEVATION ALERT
                </span>
              )}
            </span>
            <span className="text-[9px] text-slate-400">Lead II • 25 mm/s • 10 mm/mV</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="text-right">
            <span className="text-[9px] text-slate-400 block">HEART RATE</span>
            <span className={`font-black text-sm ${isRedFlag ? 'text-rose-500' : 'text-cyan-600 dark:text-cyan-300'}`}>
              {isRedFlag ? '118' : bpm} <span className="text-[10px] font-normal text-slate-400">BPM</span>
            </span>
          </div>
          <div className="text-right border-l border-slate-200 dark:border-slate-800 pl-3">
            <span className="text-[9px] text-slate-400 block">SPO2</span>
            <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
              {spo2}%
            </span>
          </div>
        </div>
      </div>

      {/* 3D Waveform Canvas */}
      <div className="w-full h-20 sm:h-24 relative">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
}
