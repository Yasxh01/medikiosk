import React, { useRef, useEffect, useState } from 'react';
import { Rotate3d, Crosshair } from 'lucide-react';

// Wireframe Skeleton Connectors
const SKELETON_BONES = [
  // Head & Neck
  { from: [0, -105, 0], to: [0, -78, 0] },
  { from: [0, -78, 0], to: [0, -60, 0] },
  // Shoulders
  { from: [-38, -60, 0], to: [38, -60, 0] },
  // Spine
  { from: [0, -60, 0], to: [0, 0, 0] },
  // Ribcage Rings
  { from: [-20, -52, 6], to: [20, -52, 6] },
  { from: [20, -52, 6], to: [14, -52, -6] },
  { from: [14, -52, -6], to: [-14, -52, -6] },
  { from: [-14, -52, -6], to: [-20, -52, 6] },
  
  { from: [-24, -40, 8], to: [24, -40, 8] },
  { from: [24, -40, 8], to: [16, -40, -8] },
  { from: [16, -40, -8], to: [-16, -40, -8] },
  { from: [-16, -40, -8], to: [-24, -40, 8] },

  { from: [-22, -28, 7], to: [22, -28, 7] },
  { from: [22, -28, 7], to: [15, -28, -7] },
  { from: [15, -28, -7], to: [-15, -28, -7] },
  { from: [-15, -28, -7], to: [-22, -28, 7] },

  // Left Arm
  { from: [-38, -60, 0], to: [-50, -25, 0] },
  { from: [-50, -25, 0], to: [-58, 8, 2] },
  // Right Arm
  { from: [38, -60, 0], to: [50, -25, 0] },
  { from: [50, -25, 0], to: [58, 8, 2] },
  // Pelvis
  { from: [-22, 0, 0], to: [22, 0, 0] },
  { from: [22, 0, 0], to: [14, 15, 0] },
  { from: [14, 15, 0], to: [-14, 15, 0] },
  { from: [-14, 15, 0], to: [-22, 0, 0] },
  // Left Leg
  { from: [-16, 15, 0], to: [-18, 55, 2] },
  { from: [-18, 55, 2], to: [-16, 100, -2] },
  // Right Leg
  { from: [16, 15, 0], to: [18, 55, 2] },
  { from: [18, 55, 2], to: [16, 100, -2] },
];

// Head Geometric Wireframe Circles
const HEAD_RINGS = [
  { y: -90, r: 14 },
  { y: -82, r: 16 },
  { y: -98, r: 11 },
];

const getAnatomicalNodes = (mode, isRedFlag) => [
  { id: 'cranial', label: 'Cranial / Neurological', x: 0, y: -90, z: 0, organ: 'Brain / CNS', status: 'Optimal (Alpha 10Hz)' },
  { id: 'cardio', label: 'Thorax / Cardiovascular', x: -4, y: -45, z: 10, organ: 'Heart / Coronary Tree', status: isRedFlag ? 'CRITICAL ISCHEMIA RISK' : '72 BPM Sinus Rhythm', isAlert: isRedFlag },
  { id: 'pulmonary', label: 'Pulmonary / Lungs', x: 8, y: -48, z: 6, organ: 'Bilateral Bronchi', status: 'SpO2 99% Clear' },
  { id: 'gastric', label: 'Gastrointestinal / Agni', x: 0, y: -15, z: 8, organ: 'Metabolic Matrix', status: mode === 'AYURVEDA' ? 'Visham Agni State' : 'Normoactive' },
  { id: 'arm_left', label: 'Left Arm / Brachial', x: -48, y: -25, z: -2, organ: 'Brachial Plexus', status: isRedFlag ? 'Referred Anginal Vector' : 'Normal Motility', isAlert: isRedFlag },
  { id: 'arm_right', label: 'Right Arm / Radial', x: 48, y: -25, z: -2, organ: 'Radial Pulse', status: 'Normal' },
  { id: 'spine', label: 'Vertebral Axis / Merudanda', x: 0, y: -30, z: -10, organ: 'Spinal Column', status: 'Aligned' },
  { id: 'knees', label: 'Bilateral Patella / Sandhi', x: 0, y: 55, z: 4, organ: 'Synovial Articulations', status: 'Minor Crepitus (Vata)' },
];

export default function HolographicBody3D({
  activeRegion = null,
  onSelectRegion = null,
  mode = 'ALLOPATHY',
  isRedFlag = false,
  height = 360,
  interactive = true,
  title = '3D Digital Anatomical Twin',
  subtitle = 'Interactive 3D Physiological HUD'
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0.1, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);

  const anatomicalNodes = getAnatomicalNodes(mode, isRedFlag);



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

    const fov = 380;
    const project3D = (x, y, z, rotX, rotY, cx, cy, scaleMul = 1) => {
      // Rotate Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = x * cosY - z * sinY;
      const z1 = z * cosY + x * sinY;

      // Rotate X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = z1 * cosX + y * sinX;

      const scale = (fov / (fov + z2 + 200)) * scaleMul;
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        scale,
        z: z2,
      };
    };

    let localRotY = rotation.y;
    let scanLaserY = -120;
    let scanDirection = 1;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      if (autoRotate && !isDragging) {
        localRotY += 0.009;
      } else {
        localRotY = rotation.y;
      }

      // Laser Scanner Wave Animation
      scanLaserY += scanDirection * 1.2;
      if (scanLaserY > 110) scanDirection = -1;
      if (scanLaserY < -115) scanDirection = 1;

      // 3D Laser Plane projection
      const laserLeft = project3D(-65, scanLaserY, 0, rotation.x, localRotY, cx, cy, 1.4);
      const laserRight = project3D(65, scanLaserY, 0, rotation.x, localRotY, cx, cy, 1.4);

      // Color Theme Settings
      const isAyush = mode === 'AYURVEDA';
      const themePrimary = isRedFlag
        ? 'rgba(244, 63, 94, 0.9)'
        : isAyush
        ? 'rgba(16, 185, 129, 0.9)'
        : 'rgba(6, 182, 212, 0.9)';

      const themeGlow = isRedFlag ? '#f43f5e' : isAyush ? '#10b981' : '#06b6d4';

      // --- 1. Draw 3D Base Holographic Grid Floor ---
      const gridRadius = 70;
      ctx.beginPath();
      for (let gAngle = 0; gAngle < Math.PI * 2; gAngle += Math.PI / 6) {
        const gx = Math.cos(gAngle) * gridRadius;
        const gz = Math.sin(gAngle) * gridRadius;
        const p1 = project3D(gx, 115, gz, rotation.x, localRotY, cx, cy, 1.4);
        const p2 = project3D(0, 115, 0, rotation.x, localRotY, cx, cy, 1.4);
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p1.x, p1.y);
      }
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer Base Ring
      ctx.beginPath();
      for (let i = 0; i <= 36; i++) {
        const theta = (i / 36) * Math.PI * 2;
        const gx = Math.cos(theta) * gridRadius;
        const gz = Math.sin(theta) * gridRadius;
        const p = project3D(gx, 115, gz, rotation.x, localRotY, cx, cy, 1.4);
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = themePrimary;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // --- 2. Draw 3D Skeletal Wireframe ---
      SKELETON_BONES.forEach((bone) => {
        const p1 = project3D(bone.from[0], bone.from[1], bone.from[2], rotation.x, localRotY, cx, cy, 1.4);
        const p2 = project3D(bone.to[0], bone.to[1], bone.to[2], rotation.x, localRotY, cx, cy, 1.4);

        const depthFade = Math.max(0.2, Math.min(1, (p1.z + 150) / 300));
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(148, 163, 184, ${0.45 * depthFade})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Draw Head Geometry
      HEAD_RINGS.forEach((hr) => {
        ctx.beginPath();
        for (let i = 0; i <= 24; i++) {
          const theta = (i / 24) * Math.PI * 2;
          const hx = Math.cos(theta) * hr.r;
          const hz = Math.sin(theta) * hr.r;
          const p = project3D(hx, hr.y, hz, rotation.x, localRotY, cx, cy, 1.4);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = themePrimary;
        ctx.lineWidth = 1;
        ctx.stroke();
      });


      // --- 3. Draw Laser Scanner Horizon Line ---
      const laserGrad = ctx.createLinearGradient(laserLeft.x, laserLeft.y, laserRight.x, laserRight.y);
      laserGrad.addColorStop(0, 'transparent');
      laserGrad.addColorStop(0.5, isRedFlag ? 'rgba(244, 63, 94, 0.85)' : 'rgba(34, 211, 238, 0.85)');
      laserGrad.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.moveTo(laserLeft.x, laserLeft.y);
      ctx.lineTo(laserRight.x, laserRight.y);
      ctx.strokeStyle = laserGrad;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // --- 4. Draw Interactive Organ Target Nodes ---
      anatomicalNodes.forEach((node) => {
        const p = project3D(node.x, node.y, node.z, rotation.x, localRotY, cx, cy, 1.4);
        const isSelected = activeRegion === node.id;
        const isAlert = node.isAlert || (isRedFlag && (node.id === 'cardio' || node.id === 'arm_left'));
        const nodeRadius = isSelected || isAlert ? 6 * p.scale : 4 * p.scale;

        // Radiating pulse wave
        if (isAlert || isSelected) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, (nodeRadius + 4) * (1 + Math.sin(Date.now() * 0.006) * 0.4), 0, Math.PI * 2);
          ctx.strokeStyle = isAlert ? 'rgba(244, 63, 94, 0.7)' : themePrimary;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Inner Solid Node
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(2, nodeRadius), 0, Math.PI * 2);
        ctx.fillStyle = isAlert ? '#f43f5e' : isSelected ? '#ffffff' : themePrimary;
        ctx.shadowColor = isAlert ? '#f43f5e' : themeGlow;
        ctx.shadowBlur = isAlert ? 14 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Tag label if Alert or Selected
        if (isAlert || isSelected) {
          ctx.font = 'bold 9px monospace';
          ctx.fillStyle = isAlert ? '#fda4af' : '#67e8f9';
          ctx.fillText(node.organ, p.x + 10, p.y - 4);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [rotation, autoRotate, isDragging, activeRegion, isRedFlag, mode, anatomicalNodes]);


  // Pointer Drag Handlers
  const handleMouseDown = (e) => {
    if (!interactive) return;
    setIsDragging(true);
    setAutoRotate(false);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !interactive) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setRotation((prev) => ({
      x: Math.max(-0.6, Math.min(0.6, prev.x + deltaY * 0.008)),
      y: prev.y + deltaX * 0.012,
    }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="glass-card rounded-3xl border border-slate-200 dark:border-cyan-500/30 p-4 relative overflow-hidden flex flex-col justify-between shadow-lg dark:shadow-[0_0_30px_rgba(6,182,212,0.15)] group select-none"
      style={{ minHeight: `${height}px` }}
    >
      {/* HUD Header Bar */}
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2.5 z-20">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-lg bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
            <Crosshair className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
              {title}
              <span className={`w-2 h-2 rounded-full animate-ping ${isRedFlag ? 'bg-rose-500' : 'bg-emerald-400'}`}></span>
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              {subtitle}
            </p>
          </div>
        </div>

        {/* 3D Telemetry Coordinates */}
        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/70 border border-cyan-200 dark:border-cyan-500/30 px-2 py-0.5 rounded-md">
          <Rotate3d className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
          <span>Y: {Math.round((rotation.y * (180 / Math.PI)) % 360)}°</span>
        </div>
      </div>

      {/* 3D Canvas Body Viewport */}
      <div className="relative w-full flex-1 my-1 flex items-center justify-center cursor-grab active:cursor-grabbing">
        {/* Atmospheric Glow */}
        <div className={`absolute inset-x-8 inset-y-8 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
          isRedFlag ? 'bg-rose-500/20 opacity-80' : mode === 'AYURVEDA' ? 'bg-emerald-500/15 opacity-70' : 'bg-cyan-500/15 opacity-70'
        }`} />

        <canvas ref={canvasRef} className="w-full h-full relative z-10" />

        {/* 3D Interactive Target HUD Quick Selectors */}
        <div className="absolute right-2 top-3 z-30 flex flex-col gap-1.5 pointer-events-auto">
          {anatomicalNodes.slice(0, 4).map((node) => {
            const isAlert = node.isAlert || (isRedFlag && (node.id === 'cardio' || node.id === 'arm_left'));
            const isSelected = activeRegion === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectRegion && onSelectRegion(node.id)}
                className={`text-[9px] font-mono px-2 py-1 rounded-lg border transition-all duration-200 text-left flex items-center justify-between gap-2 shadow-sm ${
                  isAlert
                    ? 'bg-rose-100 dark:bg-rose-950/90 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/70 font-bold animate-pulse'
                    : isSelected
                    ? 'bg-cyan-100 dark:bg-cyan-950/90 text-cyan-900 dark:text-cyan-200 border-cyan-400 font-bold'
                    : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-cyan-500'
                }`}
              >
                <span>{node.organ}</span>
                {isAlert && <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls & Active Organ Telemetry Footer */}
      <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono z-20">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 rounded-md border transition ${
              autoRotate
                ? 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
            }`}
          >
            {autoRotate ? 'Auto-Orbit: ON' : 'Auto-Orbit: OFF'}
          </button>
          
          <span className="text-slate-400 hidden sm:inline">• Drag to rotate 360°</span>
        </div>

        <div className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
          <span>ABDM M1 3D HUD</span>
        </div>
      </div>
    </div>
  );
}
