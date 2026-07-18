/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "framer-motion";
import { stops } from "@/lib/stops";
import type { Stop } from "@/lib/stops";

// ── Theme tokens (strictly reusing existing CSS variables) ────────────────────
const RAIL  = "#C4A882";
const CARD  = "#161C22";
const AMBER = "#FFB800";
// Signal colors — functionally required exceptions:
const SIG_R = "#ef4444";
const SIG_G = "#22c55e";

const N = stops.length; // 11

// ── Vertical Serpentine Geometry Constants ─────────────────────────────────────
const startX = 280;
const endX = 520;
const startY = 100;
const dy = 160;

const SVG_W = 800;
const SVG_H = startY + (N - 1) * dy + 100; // 100 + 10 * 160 + 100 = 1800px

// Generate S-curve track path programmatically (smooth cubic Bezier bends)
function buildSerpentinePath(): string {
  let d = `M ${startX},50 L ${startX},${startY}`;
  for (let i = 0; i < N - 1; i++) {
    const fromY = startY + i * dy;
    const toY = fromY + dy;
    const fromX = i % 2 === 0 ? startX : endX;
    const toX = i % 2 === 0 ? endX : startX;
    // Larger control point offset (220px) creates a wider, circular S-bend
    const cp1X = i % 2 === 0 ? fromX + 220 : fromX - 220;
    const cp2X = i % 2 === 0 ? toX - 220 : toX + 220;
    d += ` C ${cp1X.toFixed(1)},${fromY.toFixed(1)} ${cp2X.toFixed(1)},${toY.toFixed(1)} ${toX.toFixed(1)},${toY.toFixed(1)}`;
  }
  // Extend slightly past the last station
  const lastX = (N - 1) % 2 === 0 ? startX : endX;
  d += ` L ${lastX},${startY + (N - 1) * dy + 50}`;
  return d;
}

const SMOOTH_D = buildSerpentinePath();

// Station coordinates mapping
function getStationCoords(i: number) {
  const y = startY + i * dy;
  const x = i % 2 === 0 ? startX : endX;
  return { x, y };
}

// ── Signal State Calculation ──────────────────────────────────────────────────
type Sig = "green" | "yellow" | "dim";

function sigOf(stopIdx: number, trainIdx: number): Sig {
  const f = Math.floor(trainIdx);
  const diff = trainIdx - f;
  // Turn green early (at 85% of progress to the next station) so the light
  // matches the train's visual arrival rather than waiting for departure.
  const reachedIndex = diff > 0.85 ? f + 1 : f;

  if (stopIdx <= reachedIndex) return "green";
  if (stopIdx === reachedIndex + 1) return "yellow";
  return "dim";
}

// ── Robust Arc-Length Positioning ─────────────────────────────────────────────
type Pt = { x: number; y: number };

function posOnPath(pathEl: SVGPathElement, progress: number, defaultPt: Pt) {
  try {
    const total = pathEl.getTotalLength();
    if (total <= 0) return { ...defaultPt, angle: 90 };
    const dist = Math.max(0, Math.min(progress * total, total));
    const pt = pathEl.getPointAtLength(dist);
    const LOOK = 6; // px window for angle calculation
    const aheadDist = Math.min(dist + LOOK, total);
    const backDist  = Math.max(0, aheadDist - LOOK);
    const pt1 = pathEl.getPointAtLength(backDist);
    const pt2 = pathEl.getPointAtLength(aheadDist);
    const angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x) * (180 / Math.PI);
    return { x: pt.x, y: pt.y, angle };
  } catch (e) {
    return { ...defaultPt, angle: 90 };
  }
}

// ── Signal Post Icon ──────────────────────────────────────────────────────────
function SignalPost({ s }: { s: Sig }) {
  const lit = s !== "dim";
  return (
    <g>
      <line x1="0" y1="4" x2="0" y2="-24" stroke={RAIL} strokeWidth="1.2" opacity={lit ? 0.7 : 0.25} />
      <rect x="-5" y="-42" width="10" height="24" rx="2"
        fill={CARD} stroke={lit ? RAIL : "rgba(196,168,130,0.2)"} strokeWidth="0.8" />
      {/* Red lamp */}
      <circle cx="0" cy="-38" r="2.8" fill={lit && s !== "green" ? SIG_R : "rgba(80,30,30,0.5)"} />
      {s === "yellow" && <circle cx="0" cy="-38" r="4.5" fill="rgba(239,68,68,0.25)" />}
      {/* Yellow lamp */}
      <circle cx="0" cy="-31" r="2.8" fill={s === "yellow" ? AMBER : "rgba(80,65,20,0.4)"} />
      {s === "yellow" && <circle cx="0" cy="-31" r="4.5" fill="rgba(255,184,0,0.28)" />}
      {/* Green lamp */}
      <circle cx="0" cy="-24" r="2.8" fill={s === "green" ? SIG_G : "rgba(20,55,20,0.4)"} />
      {s === "green" && <circle cx="0" cy="-24" r="5.5" fill="rgba(34,197,94,0.28)" />}
    </g>
  );
}

// ── Station Dot — Anchored on track ────────────────────────────────────────────
function StationDot({ s }: { s: Sig }) {
  const col = s === "green" ? SIG_G : s === "yellow" ? AMBER : "rgba(196,168,130,0.25)";
  const glow = s === "green" ? "rgba(34,197,94,0.25)" : s === "yellow" ? "rgba(255,184,0,0.25)" : "none";
  return (
    <g>
      {s !== "dim" && <circle r="14" fill={glow} />}
      <circle r="9" fill={CARD} stroke={col} strokeWidth="2.2" />
      <circle r="4" fill={col} />
    </g>
  );
}

// ── Train Icon ────────────────────────────────────────────────────────────────
function IsoTrain({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g
      transform={`translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${(angle - 90).toFixed(1)})`}
      style={{ filter: "drop-shadow(0 0 16px rgba(255,184,80,0.7))" }}
    >
      <rect x="-6" y="-18" width="12" height="36" rx="2" fill="#2E3A46" />
      <rect x="-4" y="-15" width="8" height="7" rx="0.6" fill="#FCEBB6" />
      <rect x="-4" y="-6"  width="8" height="7" rx="0.6" fill="#FCEBB6" />
      <rect x="-4" y="3"   width="8" height="7" rx="0.6" fill="#FCEBB6" />
      <circle cx="-7" cy="-10" r="2.6" fill={CARD} stroke={RAIL} strokeWidth="0.8" />
      <circle cx="7"  cy="-10" r="2.6" fill={CARD} stroke={RAIL} strokeWidth="0.8" />
      <circle cx="-7" cy="10"  r="2.6" fill={CARD} stroke={RAIL} strokeWidth="0.8" />
      <circle cx="7"  cy="10"  r="2.6" fill={CARD} stroke={RAIL} strokeWidth="0.8" />
      {/* Front cowl + headlight */}
      <rect x="-4" y="17" width="8" height="3" rx="1" fill="#1A2530" />
      <circle cx="0" cy="19" r="1.6" fill={AMBER} opacity="0.95" />
    </g>
  );
}

// ── Detail Card (original, unchanged) ─────────────────────────────────────────
function DetailCard({ stop, onClose }: { stop: Stop; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative max-w-md w-full rounded-2xl border border-amber-500/30 p-6 z-10"
        style={{ background: "#0F161E" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <span className={`inline-block text-xs font-mono px-2.5 py-1 rounded-md border mb-3 ${
          stop.subtype === "milestone"
            ? "border-green-500/40 text-green-400 bg-green-500/10"
            : "border-amber-500/40 text-amber-400 bg-amber-500/10"
        }`}>
          {stop.subtype === "milestone" ? "Milestone" : "Project"} · {stop.years}
        </span>
        <h3 className="text-white font-bold text-lg mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
          {stop.title}
        </h3>
        {stop.org && <p className="text-slate-400 text-sm mb-3">{stop.org}</p>}
        <p className="text-slate-300 text-sm leading-relaxed mb-4">{stop.description}</p>
        <div className="flex items-center gap-2 text-amber-400 text-sm font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
          {stop.metric}
        </div>
        {stop.tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {stop.tech.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-400 font-mono">{t}</span>
            ))}
          </div>
        )}
        {stop.link && (
          <a href={stop.link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-medium transition-colors">
            View project
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 9.5L9.5 2.5M6 2.5h3.5v3.5"
                stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

// ── Serpentine View Component ─────────────────────────────────────────────────
function SerpentineDiorama({
  trainIdx,
  scrollProgress,
  setActiveStop,
}: {
  trainIdx: number;
  scrollProgress: number;
  setActiveStop: (s: Stop | null) => void;
}) {
  const measureRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [trainPos, setTrainPos] = useState({ x: startX, y: startY, angle: 90 });
  const [ties, setTies] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  // Measure path length & calculate programmatic railway ties on mount
  useEffect(() => {
    if (!measureRef.current) return;
    const pathEl = measureRef.current;
    const len = pathEl.getTotalLength();
    if (len > 0) {
      setPathLength(len);
      setTrainPos(posOnPath(pathEl, scrollProgress, { x: startX, y: startY }));

      // Generate ties perpendicular to the path direction at 16px intervals
      const spacing = 16;
      const halfWidth = 7; // tie length extends slightly past the rails
      const list = [];
      for (let d = 0; d <= len; d += spacing) {
        const pt = pathEl.getPointAtLength(d);
        const look = 2;
        const ahead = pathEl.getPointAtLength(Math.min(d + look, len));
        const dx = ahead.x - pt.x;
        const dy = ahead.y - pt.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const px = dist > 0 ? -dy / dist : 0;
        const py = dist > 0 ? dx / dist : 1;
        list.push({
          x1: pt.x - px * halfWidth,
          y1: pt.y - py * halfWidth,
          x2: pt.x + px * halfWidth,
          y2: pt.y + py * halfWidth,
        });
      }
      setTies(list);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update train position when scroll progress or path length changes
  useEffect(() => {
    if (!measureRef.current) return;
    const len = measureRef.current.getTotalLength();
    if (len > 0 && pathLength !== len) {
      setPathLength(len);
    }
    setTrainPos(posOnPath(measureRef.current, scrollProgress, { x: startX, y: startY }));
  }, [scrollProgress, pathLength]);

  const traveled = pathLength > 0
    ? `${(pathLength * scrollProgress).toFixed(2)} ${pathLength.toFixed(2)}`
    : "0 9999";

  const traveledDist = pathLength * scrollProgress;

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      className="max-w-full w-full h-auto mx-auto block"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Serpentine Signal Line career diorama"
    >
      {/* Hidden measurement path */}
      <path ref={measureRef} d={SMOOTH_D} fill="none" stroke="none" />

      {/* Skyline background decoration */}
      <g opacity="0.03" aria-hidden="true">
        {[65, 95, 55, 80, 105, 70, 90, 75, 100, 60, 85, 70, 95].map((h, i) => (
          <rect key={i} x={30 + i * 58} y={SVG_H - 20 - h} width={34} height={h} fill={RAIL} rx={2} />
        ))}
      </g>

      {/* ── Programmatic sleepers/ties (drawn first so they sit below rails) ── */}
      {ties.map((tie, idx) => {
        const isTraveled = (idx * 16) <= traveledDist;
        return (
          <line
            key={idx}
            x1={tie.x1} y1={tie.y1}
            x2={tie.x2} y2={tie.y2}
            stroke={RAIL}
            strokeWidth="2.2"
            opacity={isTraveled ? 0.72 : 0.22}
            strokeLinecap="round"
          />
        );
      })}

      {/* ── Twin parallel rails (layered sandwich stroke trick) ── */}
      {/* 1. ballast glow */}
      <path d={SMOOTH_D} fill="none" stroke={RAIL} strokeWidth="12" opacity="0.08" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* 2. dim full rails (un-traveled) */}
      <path d={SMOOTH_D} fill="none" stroke={RAIL} strokeWidth="8" opacity="0.22" strokeLinecap="round" strokeLinejoin="round" />
      <path d={SMOOTH_D} fill="none" stroke="#080E1C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />

      {/* 3. bright traveled rails (trailing fade) */}
      {pathLength > 0 && (
        <g opacity="0.85">
          <path d={SMOOTH_D} fill="none" stroke={RAIL} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={traveled} />
          <path d={SMOOTH_D} fill="none" stroke="#080E1C" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={traveled} />
        </g>
      )}

      {/* Stations */}
      {stops.map((stop, i) => {
        const { x, y } = getStationCoords(i);
        const s = sigOf(i, trainIdx);
        const active = s !== "dim";
        // Alternate label placement left and right
        const onLeft = i % 2 === 1;
        const lx = onLeft ? 20 : 470;
        const ly = y - 50;

        return (
          <g
            key={stop.id}
            onClick={() => setActiveStop(stop)}
            onKeyDown={(e) => e.key === "Enter" && setActiveStop(stop)}
            role="button"
            tabIndex={0}
            aria-label={`Station: ${stop.title}`}
            className="cursor-pointer"
          >
            {/* Station dot directly on the track line */}
            <g transform={`translate(${x},${y})`}>
              <StationDot s={s} />
            </g>

            {/* Signal post */}
            <g transform={`translate(${x - 24},${y - 8})`}>
              <SignalPost s={s} />
            </g>

            {/* Dash line connector */}
            <line
              x1={onLeft ? x - 10 : x + 10} y1={y}
              x2={onLeft ? lx + 310 : lx} y2={y}
              stroke={RAIL} strokeWidth="0.6" strokeDasharray="3 5"
              opacity={active ? 0.35 : 0.1}
            />

            {/* Label card (width 310px) */}
            <foreignObject x={lx} y={ly} width="310" height="114">
              <div
                className={`px-4 py-3 rounded-xl border transition-all duration-300 ${
                  s === "green"
                    ? "border-green-500/25 bg-green-950/25"
                    : s === "yellow"
                    ? "border-amber-500/35 bg-amber-950/22"
                    : "border-slate-800/20 bg-transparent"
                }`}
              >
                <div className={`text-[10px] font-mono tracking-widest uppercase mb-1 ${
                  s === "green" ? "text-green-400" : s === "yellow" ? "text-amber-400" : "text-slate-650"
                }`}>
                  {stop.years}
                </div>
                <div
                  className={`text-sm font-semibold leading-snug mb-1 break-words ${
                    active ? "text-white" : "text-slate-650"
                  }`}
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {stop.title}
                </div>
                {stop.org && (
                  <div className={`text-xs mb-1 ${active ? "text-slate-400" : "text-slate-700"}`}>
                    {stop.org}
                  </div>
                )}
                <div className={`text-[11px] font-mono leading-snug break-words mt-1.5 ${
                  active ? "text-amber-400/80" : "text-slate-800"
                }`}>
                  {stop.metric}
                </div>
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Train */}
      <IsoTrain x={trainPos.x} y={trainPos.y} angle={trainPos.angle} />
    </svg>
  );
}

// ── Shared Section Header ─────────────────────────────────────────────────────
function SectionHeader() {
  return (
    <div className="text-center flex-shrink-0 mb-8 px-4">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-400 text-xs font-mono tracking-widest uppercase mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Departure Board
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1"
        style={{ fontFamily: "'Outfit', sans-serif" }}>
        The Signal Line
      </h2>
      <p className="text-slate-400 mt-2 text-sm">
        Scroll to move the train through every station · Tap a station to view details
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function SignalLineMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStop,     setActiveStop]     = useState<Stop | null>(null);
  const [mounted,        setMounted]        = useState(false);
  const [reducedMo,      setReducedMo]      = useState(false);
  const [trainIdx,       setTrainIdx]       = useState(0);
  const [scrollFraction, setScrollFraction] = useState(0);

  const { scrollY } = useScroll();

  // client-only initialization
  useEffect(() => {
    setMounted(true);
    const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMo(motionMQ.matches);
  }, []);

  // robust scroll progress calculation (runs top to bottom)
  useMotionValueEvent(scrollY, "change", () => {
    if (!mounted || reducedMo || !sectionRef.current) return;

    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const viewH = window.innerHeight;

    // Start train progress when section top reaches 80% viewport height
    // End when section bottom reaches 20% viewport height
    const startY = viewH * 0.8;
    const endY = viewH * 0.2;
    const totalDist = rect.height + startY - endY;
    const currentDist = startY - rect.top;

    const raw = currentDist / totalDist;
    const clamped = Math.max(0, Math.min(raw, 1));

    setScrollFraction(clamped);
    setTrainIdx(clamped * (N - 1));

    // Visual regression log at key intervals (25%, 50%, 75%)
    const roundedPercent = Math.round(clamped * 100);
    if (roundedPercent === 25 || roundedPercent === 50 || roundedPercent === 75) {
      console.log(`[SignalLineMap Check] Scroll progress: ${roundedPercent}%, Active Train Index: ${clamped * (N - 1)}`);
      stops.forEach((stop, idx) => {
        console.log(`  Station ${idx} (${stop.title.substring(0, 15)}): ${sigOf(idx, clamped * (N - 1))}`);
      });
    }
  });

  const effectiveIdx = reducedMo ? N - 1 : trainIdx;
  const effectiveFraction = reducedMo ? 1 : scrollFraction;

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative px-4 py-20 w-full"
      style={{ background: "linear-gradient(180deg, #0B1420 0%, #161C22 100%)" }}
    >
      {/* Ballast line texture background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, #C4A882 0px, #C4A882 1px, transparent 1px, transparent 32px)" }}
      />

      <div className="relative max-w-4xl mx-auto w-full z-10">
        <SectionHeader />
        
        {/* Serpentine diorama centered horizontally */}
        <div className="w-full overflow-hidden flex items-center justify-center">
          <SerpentineDiorama
            trainIdx={effectiveIdx}
            scrollProgress={effectiveFraction}
            setActiveStop={setActiveStop}
          />
        </div>
      </div>

      {/* Modal Detail Card */}
      <AnimatePresence>
        {activeStop && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <DetailCard stop={activeStop} onClose={() => setActiveStop(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
