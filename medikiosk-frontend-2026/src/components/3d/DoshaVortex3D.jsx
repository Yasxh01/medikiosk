import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function DoshaVortex3D({
  scores = { VATA: 45, PITTA: 35, KAPHA: 20 },
  dominant = 'Vata-Pitta'
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 300);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 240);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener('resize', handleResize);

    let angle = 0;
    const fov = 300;

    const project3D = (x, y, z, rotX, rotY, cx, cy) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const scale = fov / (fov + z2 + 200);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        scale,
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      angle += 0.02;

      // 1. Draw Vata Ring (Sky Blue - Air/Space)
      const vataRadius = 68;
      ctx.beginPath();
      for (let i = 0; i <= 36; i++) {
        const theta = (i / 36) * Math.PI * 2;
        const vx = Math.cos(theta) * vataRadius;
        const vy = Math.sin(theta) * vataRadius * 0.7;
        const vz = Math.sin(theta) * vataRadius * 0.7;
        const p = project3D(vx, vy, vz, 0.4, angle * 1.3, cx, cy);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#0ea5e9';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. Draw Pitta Ring (Amber Gold - Fire/Metabolism)
      const pittaRadius = 52;
      ctx.beginPath();
      for (let i = 0; i <= 36; i++) {
        const theta = (i / 36) * Math.PI * 2;
        const px = Math.cos(theta) * pittaRadius * 0.7;
        const py = Math.sin(theta) * pittaRadius;
        const pz = Math.cos(theta) * pittaRadius * 0.7;
        const p = project3D(px, py, pz, -0.5, -angle * 1.1, cx, cy);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#d97706';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 3. Draw Kapha Ring (Emerald - Water/Earth)
      const kaphaRadius = 36;
      ctx.beginPath();
      for (let i = 0; i <= 36; i++) {
        const theta = (i / 36) * Math.PI * 2;
        const kx = Math.cos(theta) * kaphaRadius;
        const ky = Math.sin(theta) * kaphaRadius;
        const kz = 0;
        const p = project3D(kx, ky, kz, angle * 0.8, 0.6, cx, cy);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#059669';
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Central Core Prana Node
      const corePulse = (Math.sin(angle * 3) + 1) * 0.5;
      const coreP = project3D(0, 0, 0, 0.4, angle, cx, cy);
      ctx.beginPath();
      ctx.arc(coreP.x, coreP.y, 6 + corePulse * 3, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#10b981';
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
  }, [scores]);

  return (
    <div className="glass-card rounded-2xl border border-emerald-300 dark:border-emerald-500/30 p-3 relative overflow-hidden flex flex-col justify-between">
      <div className="flex justify-between items-center z-10">
        <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          3D Tri-Dosha Bio-Gyroscope
        </span>
        <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-500/40">
          {dominant}
        </span>
      </div>

      <div className="w-full h-36 relative flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full relative z-10" />
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-[9px] font-mono text-center pt-1 border-t border-emerald-200 dark:border-slate-800 z-10">
        <div className="bg-sky-50 dark:bg-slate-900/80 p-1 rounded border border-sky-200 dark:border-sky-500/30 text-sky-800 dark:text-sky-300">
          VATA {scores.VATA}%
        </div>
        <div className="bg-amber-50 dark:bg-slate-900/80 p-1 rounded border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300">
          PITTA {scores.PITTA}%
        </div>
        <div className="bg-emerald-50 dark:bg-slate-900/80 p-1 rounded border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
          KAPHA {scores.KAPHA}%
        </div>
      </div>
    </div>
  );
}
