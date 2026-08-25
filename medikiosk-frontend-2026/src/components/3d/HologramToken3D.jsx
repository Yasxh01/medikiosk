import React, { useState } from 'react';
import { Ticket, ShieldCheck, QrCode } from 'lucide-react';
import TiltCard3D from './TiltCard3D';

export default function HologramToken3D({
  tokenNumber,
  mode = 'ALLOPATHY',
  isRedFlag = false,
  room = 'Room 12 • Priority Consult Desk',
  time
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center max-w-md mx-auto my-2">
      <TiltCard3D maxTilt={14} scale={1.03} className="w-full">
        <div
          onClick={() => setFlipped(!flipped)}
          className={`relative p-6 sm:p-7 rounded-3xl border-2 transition-all duration-300 backdrop-blur-2xl overflow-hidden cursor-pointer shadow-xl ${
            isRedFlag
              ? 'bg-gradient-to-b from-rose-950/90 via-[#190913] to-rose-950/90 border-rose-500/80 shadow-[0_0_40px_rgba(244,63,94,0.3)]'
              : mode === 'AYURVEDA'
              ? 'bg-gradient-to-b from-emerald-950/90 via-[#091b19] to-emerald-950/90 border-emerald-500/70 shadow-[0_0_40px_rgba(16,185,129,0.25)]'
              : 'bg-gradient-to-b from-slate-900/95 via-[#0b162c] to-slate-900/95 border-cyan-500/70 shadow-[0_0_40px_rgba(6,182,212,0.3)]'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Animated Holographic Laser Sweep */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-scan pointer-events-none opacity-70" />

          {/* Corner Hologram Security Markers */}
          <div className="flex justify-between items-center border-b border-slate-700/60 pb-3" style={{ transform: 'translateZ(20px)' }}>
            <span className="text-[10px] font-mono font-bold flex items-center gap-1.5 text-cyan-400">
              <Ticket className="w-3.5 h-3.5 animate-pulse" />
              <span>3D OPD DIGITAL QUEUE TOKEN</span>
            </span>
            <span className="text-[10px] font-mono text-slate-300 font-bold px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700">
              {time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Main Token Value */}
          <div className="py-4 text-center space-y-2" style={{ transform: 'translateZ(35px)' }}>
            <div className="inline-block relative">
              <p className={`text-4xl sm:text-5xl font-mono font-black tracking-tight text-transparent bg-clip-text ${
                isRedFlag
                  ? 'bg-gradient-to-r from-rose-400 via-red-300 to-amber-300 drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                  : mode === 'AYURVEDA'
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]'
                  : 'bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]'
              }`}>
                {tokenNumber}
              </p>
            </div>

            <div>
              <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold border ${
                isRedFlag
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-200'
                  : mode === 'AYURVEDA'
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                  : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200'
              }`}>
                <span>{room}</span>
              </span>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="pt-3 border-t border-slate-700/60 flex justify-between items-center text-[10px] text-slate-300 font-mono" style={{ transform: 'translateZ(20px)' }}>
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ABHA Token Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[9px] text-slate-400">Click to Tilt</span>
              <QrCode className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        </div>
      </TiltCard3D>
    </div>
  );
}
