import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import type { SpeedStatus } from '../speed-dashboard.types';

interface SpeedometerGaugeProps {
  currentSpeed: number;
  speedLimit: number;
  status: SpeedStatus;
  lastUpdated: string;
}

export function SpeedometerGauge({
  currentSpeed,
  speedLimit,
  status,
  lastUpdated,
}: SpeedometerGaugeProps) {
  const [styleMode, setStyleMode] = useState<'cockpit' | 'neon' | 'classic'>('cockpit');

  const statusColors = {
    safe: {
      border: 'border-success/40',
      bg: 'bg-success/10',
      text: 'text-success',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.18)]',
      badge: 'bg-success/20 text-success border-success/40',
      needle: '#06b6d4',
      arc: '#10b981',
    },
    'near-limit': {
      border: 'border-warning/40',
      bg: 'bg-warning/10',
      text: 'text-warning',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      badge: 'bg-warning/20 text-warning border-warning/40',
      needle: '#f59e0b',
      arc: '#f59e0b',
    },
    'over-limit': {
      border: 'border-danger/50',
      bg: 'bg-danger/10',
      text: 'text-danger',
      glow: 'shadow-[0_0_25px_rgba(239,68,68,0.35)] animate-pulse',
      badge: 'bg-danger/20 text-danger border-danger/50',
      needle: '#ef4444',
      arc: '#ef4444',
    },
  };

  const theme = statusColors[status];

  // Calculate 270-degree sweep (-135 to +135 deg) for scale 0 to 160 KM/H
  const maxScaleSpeed = 160;
  const clampedSpeed = Math.min(Math.max(currentSpeed, 0), maxScaleSpeed);
  const needleAngle = -135 + (clampedSpeed / maxScaleSpeed) * 270;

  // Generate ticks for scale 0, 20, 40, ... 160
  const scaleTicks = [0, 20, 40, 60, 80, 100, 120, 140, 160];

  return (
    <section
      aria-label="Current Speed Telemetry"
      className={`rounded-2xl border ${theme.border} bg-card p-6 flex flex-col items-center justify-between ${theme.glow} transition-all duration-300 relative overflow-hidden`}
    >
      {/* Top Header & Style Switcher */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
        <div>
          <h2 className="text-body-sm font-bold uppercase tracking-wider text-muted-foreground">
            Current Telemetry
          </h2>
          <p className="text-[11px] text-muted-foreground mt-0.5">Last active: {lastUpdated}</p>
        </div>

        {/* Live Style Switcher Tabs */}
        <div className="flex items-center rounded-lg border border-border bg-surface p-1 shadow-2xs text-xs font-semibold">
          <button
            onClick={() => setStyleMode('cockpit')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              styleMode === 'cockpit'
                ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🏎️ Cockpit
          </button>
          <button
            onClick={() => setStyleMode('neon')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              styleMode === 'neon'
                ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ⚡ Cyber Neon
          </button>
          <button
            onClick={() => setStyleMode('classic')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              styleMode === 'classic'
                ? 'bg-primary text-primary-foreground shadow-xs font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            ⭕ Classic
          </button>
        </div>
      </div>

      {/* Speed limit sign element & Overspeed Banner */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {status === 'over-limit' && (
          <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-danger px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-tight text-white shadow-sm animate-bounce">
            ⚠️ +{currentSpeed - speedLimit} KM/H
          </span>
        )}
        <div
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border-4 border-danger bg-white shadow-sm font-bold text-slate-900 text-lg ${
            status === 'over-limit' ? 'ring-4 ring-danger/40 animate-pulse' : ''
          }`}
        >
          <span className="text-[9px] leading-none uppercase tracking-tighter text-slate-500 font-bold">
            LIMIT
          </span>
          {speedLimit}
        </div>
      </div>

      {/* ======================================================== */}
      {/* STYLE 1: SUPERCAR / EV COCKPIT NEEDLE (CHOSEN OPTION 1) */}
      {/* ======================================================== */}
      {styleMode === 'cockpit' && (
        <div className="my-6 flex flex-col items-center justify-center relative w-full max-w-[260px] aspect-square">
          <svg className="w-full h-full" viewBox="0 0 240 240" aria-hidden="true">
            {/* Outer metallic ring */}
            <circle cx="120" cy="120" r="106" stroke="#334155" strokeWidth="2" fill="transparent" />
            <circle cx="120" cy="120" r="100" stroke="#1e293b" strokeWidth="6" fill="transparent" />

            {/* Radial scale tick marks & numbers */}
            {scaleTicks.map((tick) => {
              const tickAngle = -135 + (tick / maxScaleSpeed) * 270;
              const rad = (Math.PI * tickAngle) / 180;
              const xStart = 120 + 94 * Math.sin(rad);
              const yStart = 120 - 94 * Math.cos(rad);
              const xEnd = 120 + 82 * Math.sin(rad);
              const yEnd = 120 - 82 * Math.cos(rad);
              const xText = 120 + 68 * Math.sin(rad);
              const yText = 120 - 68 * Math.cos(rad);
              const isOverLimitTick = tick > speedLimit;

              return (
                <g key={tick}>
                  <line
                    x1={xStart}
                    y1={yStart}
                    x2={xEnd}
                    y2={yEnd}
                    stroke={isOverLimitTick ? '#ef4444' : '#64748b'}
                    strokeWidth={tick % 40 === 0 ? '3' : '1.5'}
                  />
                  <text
                    x={xText}
                    y={yText}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isOverLimitTick ? '#ef4444' : '#94a3b8'}
                    className="text-[10px] font-extrabold select-none"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* Inner Dark Dial Face */}
            <circle cx="120" cy="120" r="54" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

            {/* Glowing Pointer Needle */}
            <g
              style={{
                transformOrigin: '120px 120px',
                transform: `rotate(${needleAngle}deg)`,
                transition: 'transform 500ms cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              {/* Needle shadow / glow */}
              <polygon
                points="117,120 120,32 123,120"
                fill={theme.needle}
                opacity="0.35"
                filter="blur(3px)"
              />
              {/* Main Needle Blade */}
              <polygon points="118,120 120,35 122,120" fill={theme.needle} />
              {/* Center Cap */}
              <circle cx="120" cy="120" r="8" fill={theme.needle} />
              <circle cx="120" cy="120" r="3.5" fill="#0f172a" />
            </g>
          </svg>

          {/* Digital Readout Center */}
          <div className="absolute top-[52%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-black tracking-tight text-foreground leading-none">
              {currentSpeed}
            </span>
            <span className="text-[10px] font-extrabold tracking-widest text-muted-foreground uppercase mt-0.5">
              KM/H
            </span>
          </div>

          {/* Bottom Telemetry Ticker */}
          <div className="absolute bottom-2 flex items-center gap-3 text-[10px] font-semibold text-muted-foreground bg-surface/80 border border-border/60 rounded-full px-3 py-1 shadow-2xs">
            <span>RPM: <strong className="text-foreground">2,450</strong></span>
            <span>•</span>
            <span>ECO: <strong className="text-success">94%</strong></span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STYLE 2: 3D CYBER-NEON GLASSMORPHISM */}
      {/* ======================================================== */}
      {styleMode === 'neon' && (
        <div className="my-6 flex flex-col items-center justify-center relative w-56 h-56">
          <svg className="w-full h-full transform -rotate-90" aria-hidden="true">
            <defs>
              <linearGradient id="cyberNeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={status === 'over-limit' ? '#ef4444' : '#06b6d4'} />
                <stop offset="50%" stopColor={status === 'over-limit' ? '#f97316' : '#10b981'} />
                <stop offset="100%" stopColor={status === 'over-limit' ? '#ef4444' : '#3b82f6'} />
              </linearGradient>
            </defs>
            <circle cx="112" cy="112" r="90" stroke="#1e293b" strokeWidth="14" fill="transparent" opacity="0.6" />
            <circle
              cx="112"
              cy="112"
              r="90"
              stroke="url(#cyberNeonGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={565.48}
              strokeDashoffset={565.48 - (565.48 * Math.min(currentSpeed, 160)) / 160}
              className="transition-all duration-500 ease-out filter drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-5xl font-black tracking-tight text-foreground drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
              {currentSpeed}
            </span>
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-0.5">
              KM/H
            </span>
            <div className="mt-3 flex gap-2">
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                NE 45°
              </span>
              <span className="rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">
                ECO 94%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STYLE 3: CLASSIC DIGITAL RING (ORIGINAL) */}
      {/* ======================================================== */}
      {styleMode === 'classic' && (
        <div className="my-8 flex flex-col items-center justify-center relative">
          <svg className="w-48 h-48 transform -rotate-90" aria-hidden="true">
            <circle cx="96" cy="96" r="80" stroke="#1e293b" strokeWidth="12" fill="transparent" />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke={theme.arc}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={502.4}
              strokeDashoffset={502.4 - (502.4 * Math.min(currentSpeed, 120)) / 120}
              className="transition-all duration-500 ease-out"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl font-black tracking-tight text-foreground">{currentSpeed}</span>
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-0.5">
              KM/H
            </span>
          </div>
        </div>
      )}

      {/* Status Presentation Label */}
      <div className="w-full text-center space-y-2">
        <Badge
          variant="outline"
          className={`px-3 py-1 font-semibold uppercase text-xs border ${theme.badge}`}
        >
          {status === 'over-limit'
            ? 'Speed Limit Exceeded'
            : status === 'near-limit'
              ? 'Approaching Limit'
              : 'Speed Under Control'}
        </Badge>
        <p className="text-body-sm text-muted-foreground">
          Limit is set to <span className="font-semibold text-foreground">{speedLimit} km/h</span>.
        </p>
      </div>
    </section>
  );
}
