"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { stops } from "@/lib/stops";
import type { Stop } from "@/lib/stops";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

// ── Train SVG ───────────────────────────────────────────────────────────────
function Train({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${angle})`}
      style={{ filter: "drop-shadow(0 0 14px rgba(255,184,80,0.45))" }}
    >
      {/* Carriage body */}
      <rect x="-12" y="-7" width="24" height="12" rx="2" fill="#2E3A46" />
      {/* Windows */}
      <rect x="-10" y="-5" width="6" height="5" rx="0.6" fill="#FCEBB6" />
      <rect x="-2" y="-5" width="6" height="5" rx="0.6" fill="#FCEBB6" />
      {/* Wheels */}
      <circle cx="-7" cy="7" r="2.4" fill="#161C22" stroke="#C4A882" strokeWidth="0.6" />
      <circle cx="7" cy="7" r="2.4" fill="#161C22" stroke="#C4A882" strokeWidth="0.6" />
      {/* Red flag */}
      <rect x="-14" y="-11" width="4" height="4" rx="1" fill="#C0392B" />
    </g>
  );
}

// ── Station marker icons ────────────────────────────────────────────────────
function MilestoneMarker({ active }: { active: boolean }) {
  return (
    <g>
      <circle r="10" fill={active ? "#1E2A1A" : "#161C22"} stroke="#C4A882" strokeWidth="1.5" />
      {/* Lamp-post silhouette */}
      <line x1="0" y1="-6" x2="0" y2="4" stroke="#C4A882" strokeWidth="1.2" />
      <circle r="3" cy={-7} fill={active ? "#FFB800" : "#C4A882"} opacity={active ? 1 : 0.6} />
      {active && <circle r="6" cy={-7} fill="rgba(255,184,0,0.15)" />}
    </g>
  );
}

function ProjectMarker({ active }: { active: boolean }) {
  return (
    <g>
      <circle r="10" fill={active ? "#1A1E2A" : "#161C22"} stroke="#C4A882" strokeWidth="1.5" />
      {/* Signal disc */}
      <circle r="4" fill={active ? "#FFB800" : "#C4A882"} opacity={active ? 1 : 0.5} />
      {active && <circle r="7" fill="rgba(255,184,0,0.15)" />}
    </g>
  );
}

// ── SVG path through all stops ──────────────────────────────────────────────
// We'll lay out stops in a zig-zag pattern: odd stops on left, even on right
// viewBox: 0 0 600 (dynamic height based on stop count)
const SVG_W = 600;
const STOP_SPACING = 140;
const SVG_PADDING_TOP = 60;
const CENTER_X = 300;

function getStopPos(index: number): { x: number; y: number } {
  const y = SVG_PADDING_TOP + index * STOP_SPACING;
  // Zig-zag: even indices go left-center, odd go right-center
  const x = index % 2 === 0 ? CENTER_X - 80 : CENTER_X + 80;
  return { x, y };
}

function buildPathD(count: number): string {
  if (count === 0) return "";
  const pts = Array.from({ length: count }, (_, i) => getStopPos(i));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = (prev.x + curr.x) / 2;
    const cpy = (prev.y + curr.y) / 2;
    d += ` Q ${cpx} ${cpy - 20} ${curr.x} ${curr.y}`;
  }
  return d;
}

// ── Detail card ─────────────────────────────────────────────────────────────
function DetailCard({ stop, onClose }: { stop: Stop; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative max-w-md w-full rounded-2xl border border-amber-500/30 p-6 z-10"
        style={{ background: "#0F161E" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Badge */}
        <span
          className={`inline-block text-xs font-mono px-2.5 py-1 rounded-md border mb-3
            ${stop.subtype === "milestone"
              ? "border-green-500/40 text-green-400 bg-green-500/10"
              : "border-amber-500/40 text-amber-400 bg-amber-500/10"
            }`}
        >
          {stop.subtype === "milestone" ? "Milestone" : "Project"} · {stop.years}
        </span>

        <h3
          className="text-white font-bold text-lg mb-1"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          {stop.title}
        </h3>
        {stop.org && <p className="text-slate-400 text-sm mb-3">{stop.org}</p>}

        <p className="text-slate-300 text-sm leading-relaxed mb-4">{stop.description}</p>

        {/* Metric */}
        <div className="flex items-center gap-2 text-amber-400 text-sm font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
          {stop.metric}
        </div>

        {/* Tech tags */}
        {stop.tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {stop.tech.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-400 font-mono">
                {t}
              </span>
            ))}
          </div>
        )}

        {stop.link && (
          <a
            href={stop.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            View project
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 9.5L9.5 2.5M6 2.5h3.5v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function SignalLineMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [trainPos, setTrainPos] = useState({ x: 0, y: 0, angle: 0 });
  const [activeStop, setActiveStop] = useState<Stop | null>(null);
  const [pathReady, setPathReady] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef });

  useEffect(() => {
    // Give the SVG time to mount so pathRef is available
    const timeout = setTimeout(() => setPathReady(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!pathReady || !pathRef.current) return;
    const path = pathRef.current;
    const total = path.getTotalLength();
    const pt = path.getPointAtLength(0);
    const ahead = path.getPointAtLength(Math.min(0.01 * total, total));
    setTrainPos({
      x: pt.x,
      y: pt.y,
      angle: Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * (180 / Math.PI),
    });
  }, [pathReady]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    const total = path.getTotalLength();
    const progress = Math.min(Math.max(latest, 0), 1);
    const pt = path.getPointAtLength(progress * total);
    const ahead = path.getPointAtLength(Math.min((progress + 0.01) * total, total));
    setTrainPos({
      x: pt.x,
      y: pt.y,
      angle: Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * (180 / Math.PI),
    });
  });

  const svgHeight = SVG_PADDING_TOP + stops.length * STOP_SPACING + 60;
  const pathD = buildPathD(stops.length);

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative py-16 px-4"
      style={{ background: "linear-gradient(180deg, #0B1420 0%, #161C22 100%)" }}
    >
      {/* Subtle rail-line hatch texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #C4A882 0px, #C4A882 1px, transparent 1px, transparent 32px)",
        }}
      />

      {/* Section header */}
      <ScrollReveal>
        <div className="text-center mb-8 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Departure Board
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mt-2"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            The Signal Line
          </h2>
          <p className="text-slate-400 mt-2 text-sm">Scroll to move the train through every station</p>
        </div>
      </ScrollReveal>

      {/* SVG map — centered with overflow for labels */}
      <div className="relative max-w-3xl mx-auto" style={{ height: svgHeight }}>
        <svg
          viewBox={`0 0 ${SVG_W} ${svgHeight}`}
          className="absolute inset-0 w-full h-full"
          aria-hidden="false"
          role="img"
          aria-label="Signal Line career map"
        >
          <defs>
            <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFB800" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFB800" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* ── Rail path ─────────────────────────────────────────────── */}
          {/* Shadow line */}
          <path
            d={pathD}
            fill="none"
            stroke="rgba(196,168,130,0.08)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Main dashed track */}
          <path
            ref={pathRef}
            id="rail-path"
            d={pathD}
            fill="none"
            stroke="#C4A882"
            strokeWidth="2"
            strokeDasharray="6 12"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* ── Distant signal lamps decoration ───────────────────────── */}
          <circle cx="520" cy="80" r="3" fill="rgba(255,184,0,0.4)" />
          <circle cx="520" cy="80" r="12" fill="url(#lampGlow)" />
          <line x1="520" y1="83" x2="520" y2="110" stroke="rgba(196,168,130,0.3)" strokeWidth="1" />

          <circle cx="80" cy="200" r="3" fill="rgba(0,200,80,0.4)" />
          <circle cx="80" cy="200" r="10" fill="rgba(0,200,80,0.1)" />
          <line x1="80" y1="203" x2="80" y2="230" stroke="rgba(196,168,130,0.2)" strokeWidth="1" />

          {/* ── City skyline silhouette at bottom ─────────────────────── */}
          <g transform={`translate(0, ${svgHeight - 40})`} opacity="0.12">
            {[60, 90, 70, 110, 80, 95, 65, 85, 75, 100, 60, 90].map((h, i) => (
              <rect
                key={i}
                x={20 + i * 48}
                y={-h}
                width={30}
                height={h}
                fill="#C4A882"
                rx={1}
              />
            ))}
          </g>

          {/* ── Stop markers ──────────────────────────────────────────── */}
          {stops.map((stop, i) => {
            const { x, y } = getStopPos(i);
            const isLeft = i % 2 === 0;
            return (
              <g
                key={stop.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer"
                onClick={() => setActiveStop(stop)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${stop.title}`}
                onKeyDown={(e) => e.key === "Enter" && setActiveStop(stop)}
              >
                {stop.subtype === "milestone" ? (
                  <MilestoneMarker active={false} />
                ) : (
                  <ProjectMarker active={false} />
                )}

                {/* Connector line to label */}
                <line
                  x1={isLeft ? -10 : 10}
                  y1="0"
                  x2={isLeft ? -40 : 40}
                  y2="0"
                  stroke="rgba(196,168,130,0.3)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />

                {/* Year badge */}
                <text
                  x={isLeft ? -48 : 48}
                  y="-14"
                  textAnchor={isLeft ? "end" : "start"}
                  className="text-[9px] fill-slate-500 font-mono"
                  fontSize="9"
                  fill="rgba(100,116,139,0.8)"
                >
                  {stop.years}
                </text>

                {/* Title */}
                <foreignObject
                  x={isLeft ? -(CENTER_X - 80) + 12 : 56}
                  y="-10"
                  width={isLeft ? CENTER_X - 120 : CENTER_X - 120}
                  height="60"
                >
                  <div
                    className={`text-xs leading-snug font-medium ${stop.subtype === "milestone" ? "text-green-300" : "text-slate-300"}`}
                    style={{ fontFamily: "'Inter', sans-serif", wordBreak: "break-word" }}
                  >
                    {stop.title}
                  </div>
                  <div
                    className="text-[9px] text-amber-400/70 font-mono mt-0.5 leading-tight"
                    style={{ wordBreak: "break-word" }}
                  >
                    {stop.metric.length > 42 ? stop.metric.slice(0, 42) + "…" : stop.metric}
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* ── Animated train ────────────────────────────────────────── */}
          {pathReady && (
            <Train x={trainPos.x} y={trainPos.y} angle={trainPos.angle} />
          )}
        </svg>
      </div>

      {/* Detail card modal */}
      {activeStop && (
        <DetailCard stop={activeStop} onClose={() => setActiveStop(null)} />
      )}
    </section>
  );
}
