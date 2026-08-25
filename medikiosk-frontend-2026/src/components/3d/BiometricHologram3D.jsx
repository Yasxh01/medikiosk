import React, { useRef, useEffect, useState } from 'react';
import { Activity, Rotate3d } from 'lucide-react';

export default function BiometricHologram3D({
  mode = 'ALLOPATHY',
  isRedFlag = false,
  title = 'Neural Biometric Core',
  subtitle = 'Real-time 3D Telemetry HUD'
}) {

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio || 400);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio || 400);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener('resize', handleResize);

    const getColor = (alpha = 1) => {
      if (isRedFlag) {
        return {
          primary: `rgba(244, 63, 94, ${alpha})`,
          secondary: `rgba(239, 68, 68, ${alpha})`,
          core: `rgba(255, 200, 200, ${alpha})`,
          glow: '#f43f5e'
        };
      }
      if (mode === 'AYURVEDA') {
        return {
          primary: `rgba(16, 185, 129, ${alpha})`,
          secondary: `rgba(245, 158, 11, ${alpha})`,
          core: `rgba(200, 255, 220, ${alpha})`,
          glow: '#10b981'
        };
      }
      return {
        primary: `rgba(6, 182, 212, ${alpha})`,
        secondary: `rgba(99, 102, 241, ${alpha})`,
        core: `rgba(200, 240, 255, ${alpha})`,
        glow: '#06b6d4'
      };
    };

    const fov = 340;
    const project3D = (x, y, z, rotX, rotY, rotZ, cx, cy) => {
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);
      const x3 = x1 * cosZ - y2 * sinZ;
      const y3 = y2 * cosZ + x1 * sinZ;

      const scale = fov / (fov + z2 + 250);
      return {
        x: cx + x3 * scale,
        y: cy + y3 * scale,
        scale,
        z: z2,
      };
    };

    let angle = 0;
    const numPoints = 28;
    const radius = 55;
    const heightSpan = 140;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      angle += isHovered ? 0.028 : 0.018;
      setRotationAngle(Math.round((angle * (180 / Math.PI)) % 360));

      const rotX = 0.35;
      const rotY = angle;
      const rotZ = Math.sin(angle * 0.5) * 0.1;

      const colors = getColor(1);

      // --- 1. Draw 3D Orbiting Scanning Rings ---
      const ringRadii = [95, 115, 130];
      ringRadii.forEach((r, ringIdx) => {
        const ringSegments = 48;
        const ringAngleOffset = ringIdx === 0 ? 0.4 : ringIdx === 1 ? -0.5 : 0.8;
        const ringSpeed = ringIdx % 2 === 0 ? angle * 1.2 : -angle * 0.9;

        ctx.beginPath();

        for (let i = 0; i <= ringSegments; i++) {
          const theta = (i / ringSegments) * Math.PI * 2;
          const rx = Math.cos(theta) * r;
          const ry = Math.sin(theta) * r * Math.sin(ringAngleOffset);
          const rz = Math.sin(theta) * r * Math.cos(ringAngleOffset);

          const proj = project3D(rx, ry, rz, rotX * 0.7, ringSpeed, rotZ, cx, cy);

          if (i === 0) {
            ctx.moveTo(proj.x, proj.y);
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }

        ctx.strokeStyle = ringIdx === 0 ? colors.primary : ringIdx === 1 ? colors.secondary : 'rgba(148, 163, 184, 0.25)';
        ctx.lineWidth = ringIdx === 0 ? 1.5 : 1;
        ctx.setLineDash(ringIdx === 1 ? [4, 6] : ringIdx === 2 ? [2, 8] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbiting Satellite Node
        const satTheta = angle * (2 - ringIdx * 0.4);
        const satX = Math.cos(satTheta) * r;
        const satY = Math.sin(satTheta) * r * Math.sin(ringAngleOffset);
        const satZ = Math.sin(satTheta) * r * Math.cos(ringAngleOffset);
        const satProj = project3D(satX, satY, satZ, rotX * 0.7, ringSpeed, rotZ, cx, cy);

        ctx.beginPath();
        ctx.arc(satProj.x, satProj.y, 3 * satProj.scale, 0, Math.PI * 2);
        ctx.fillStyle = colors.core;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // --- 2. Draw 3D Rotating DNA / Neural Lattice ---
      const strand1 = [];
      const strand2 = [];

      for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1);
        const py = (t - 0.5) * heightSpan;
        const phase = t * Math.PI * 3.5;

        // Strand 1
        const px1 = Math.cos(phase) * radius;
        const pz1 = Math.sin(phase) * radius;
        const proj1 = project3D(px1, py, pz1, rotX, rotY, rotZ, cx, cy);
        strand1.push(proj1);

        // Strand 2
        const px2 = Math.cos(phase + Math.PI) * radius;
        const pz2 = Math.sin(phase + Math.PI) * radius;
        const proj2 = project3D(px2, py, pz2, rotX, rotY, rotZ, cx, cy);
        strand2.push(proj2);

        // Connecting Base Pairs
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(proj1.x, proj1.y);
          ctx.lineTo(proj2.x, proj2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * Math.min(proj1.scale, proj2.scale)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          const midX = (proj1.x + proj2.x) / 2;
          const midY = (proj1.y + proj2.y) / 2;
          const pulseSize = (1 + Math.sin(angle * 3 + i)) * 1.2;

          ctx.beginPath();
          ctx.arc(midX, midY, pulseSize, 0, Math.PI * 2);
          ctx.fillStyle = i % 4 === 0 ? colors.secondary : colors.primary;
          ctx.fill();
        }
      }

      const drawStrand = (points, color) => {
        ctx.beginPath();
        points.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();

        points.forEach((p) => {
          ctx.beginPath();
          const nodeRadius = Math.max(1.5, 3.2 * p.scale);
          ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
          ctx.fillStyle = colors.core;
          ctx.shadowColor = colors.glow;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      };

      drawStrand(strand1, colors.primary);
      drawStrand(strand2, colors.secondary);

      // --- 3. Draw Central Holographic Core Pulse ---
      const corePulse = (Math.sin(angle * 4) + 1) * 0.5;
      const coreProj = project3D(0, 0, 0, rotX, rotY, rotZ, cx, cy);

      const grad = ctx.createRadialGradient(
        coreProj.x, coreProj.y, 2,
        coreProj.x, coreProj.y, 24 + corePulse * 12
      );
      grad.addColorStop(0, colors.core);
      grad.addColorStop(0.4, colors.primary);
      grad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(coreProj.x, coreProj.y, 24 + corePulse * 12, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // --- 4. Crosshair Reticle & HUD Marks ---
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;

      const bSize = 14;
      const bPadding = 18;

      // Top Left
      ctx.beginPath();
      ctx.moveTo(bPadding, bPadding + bSize);
      ctx.lineTo(bPadding, bPadding);
      ctx.lineTo(bPadding + bSize, bPadding);
      ctx.stroke();

      // Top Right
      ctx.beginPath();
      ctx.moveTo(width - bPadding - bSize, bPadding);
      ctx.lineTo(width - bPadding, bPadding);
      ctx.lineTo(width - bPadding, bPadding + bSize);
      ctx.stroke();

      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(bPadding, height - bPadding - bSize);
      ctx.lineTo(bPadding, height - bPadding);
      ctx.lineTo(bPadding + bSize, height - bPadding);
      ctx.stroke();

      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(width - bPadding - bSize, height - bPadding);
      ctx.lineTo(width - bPadding, height - bPadding);
      ctx.lineTo(width - bPadding, height - bPadding - bSize);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mode, isRedFlag, isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="glass-card rounded-3xl border border-slate-200 dark:border-cyan-500/20 p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between shadow-sm dark:shadow-[0_0_30px_rgba(6,182,212,0.15)] group transition-all duration-300 hover:border-cyan-500/50"
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
              {title}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping"></span>
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/30 px-2 py-0.5 rounded-md shadow-inner">
          <Rotate3d className="w-3 h-3 text-cyan-600 dark:text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>{rotationAngle}° 3D</span>
        </div>
      </div>

      {/* 3D Holographic Canvas Frame */}
      <div className="relative w-full h-56 sm:h-64 my-1 flex items-center justify-center">
        <div className={`absolute inset-x-10 inset-y-10 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 ${
          isRedFlag
            ? 'bg-rose-500/20 opacity-70'
            : mode === 'AYURVEDA'
            ? 'bg-emerald-500/15 opacity-60'
            : 'bg-cyan-500/15 opacity-60'
        }`} />

        <canvas
          ref={canvasRef}
          className="w-full h-full relative z-10 cursor-grab active:cursor-grabbing select-none"
        />

        <div className="absolute top-2 left-2 z-20 pointer-events-none">
          <span className="text-[9px] font-mono text-cyan-700 dark:text-cyan-300/80 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded backdrop-blur-sm">
            NODES: 56 ACTIVE
          </span>
        </div>

        <div className="absolute bottom-2 right-2 z-20 pointer-events-none">
          <span className="text-[9px] font-mono text-emerald-700 dark:text-emerald-300/80 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded backdrop-blur-sm">
            PRECISION: 99.8%
          </span>
        </div>
      </div>

      {/* Bottom Live Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono z-10">
        <div className="text-center p-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-lg">
          <span className="text-slate-400 block text-[9px]">LATTICE</span>
          <strong className="text-slate-800 dark:text-slate-200 font-bold">DNA-X2</strong>
        </div>
        <div className="text-center p-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-lg">
          <span className="text-slate-400 block text-[9px]">ENGINE</span>
          <strong className="text-cyan-600 dark:text-cyan-300 font-bold">WEBGL-3D</strong>
        </div>
        <div className="text-center p-1 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-lg">
          <span className="text-slate-400 block text-[9px]">REFRESH</span>
          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">60 FPS</strong>
        </div>
      </div>
    </div>
  );
}
