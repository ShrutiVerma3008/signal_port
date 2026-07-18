"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { projectStops } from "@/lib/stops";
import type { Stop } from "@/lib/stops";

// ── Wagon Card Component ──────────────────────────────────────────────────────
interface WagonCardProps {
  stop: Stop;
  isLastMatched: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  index: number;
}

function WagonCard({ stop, isLastMatched, isMobile, reducedMotion, index }: WagonCardProps) {
  // Coupler animation variants (swinging/dropping on decouple)
  const couplerVariants = {
    coupled: {
      rotate: 0,
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
    },
    decoupled: isMobile
      ? { rotate: -35, x: -8, y: 4, opacity: 0, scale: 0.7 }
      : { rotate: 45, x: 4, y: 12, opacity: 0, scale: 0.7 },
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{
        opacity: 1,
        scale: 1,
        width: isMobile ? "100%" : 350,
        marginRight: isMobile ? 0 : 64, // Space for desktop coupler
        height: "auto",
        marginBottom: isMobile ? 48 : 0, // Space for mobile coupler
      }}
      exit={{
        opacity: 0,
        scale: 0.85,
        width: isMobile ? "100%" : 0,
        marginRight: 0,
        height: isMobile ? 0 : "auto",
        marginBottom: 0,
      }}
      transition={{
        duration: reducedMotion ? 0 : 0.35,
        ease: "easeInOut",
      }}
      className="flex-shrink-0 relative flex flex-col"
    >
      {/* Wagon Body */}
      <div
        className="w-full flex-1 flex flex-col rounded-t-2xl rounded-b-md border border-slate-700/60 p-5 pt-6 transition-all duration-300
          hover:border-amber-500/50 hover:shadow-[0_0_24px_rgba(255,184,0,0.1)] relative z-10"
        style={{ background: "#161C22" }}
      >
        {/* Rivets in 4 corners of the wagon frame */}
        <span className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-900/60 shadow-inner" />
        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-900/60 shadow-inner" />
        <span className="absolute bottom-10 left-2.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-900/60 shadow-inner" />
        <span className="absolute bottom-10 right-2.5 w-1.5 h-1.5 rounded-full bg-slate-700 border border-slate-900/60 shadow-inner" />

        {/* Wagon Name Plate (Title) */}
        <div className="bg-[#0B1420] border border-slate-700/50 px-3 py-1.5 rounded font-mono text-[11px] uppercase tracking-wider text-[#FFB800] text-center max-w-[95%] mx-auto shadow-inner relative mb-4">
          <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-slate-600" />
          <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-slate-600" />
          <h3
            className="font-bold text-white text-xs sm:text-sm tracking-wide"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {stop.title}
          </h3>
        </div>

        {/* Cargo Capacity Stamp (Headline Metric) */}
        <div className="mb-4 transform -rotate-1 self-start max-w-full">
          <span className="inline-block text-[10px] sm:text-xs font-mono px-3 py-1.5 rounded border border-dashed border-[#FFB800]/30 text-[#FFB800] bg-[#FFB800]/5 leading-tight tracking-wider uppercase">
            LOAD SPEC // {stop.metric}
          </span>
        </div>

        {/* Cargo Manifest Block (Description) */}
        <div className="bg-[#0D1219]/60 border border-slate-800/80 p-4 rounded-md text-slate-300 text-xs sm:text-sm leading-relaxed flex-1 flex flex-col justify-between mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest block mb-2">
            MANIFEST NO: 00{index + 1}
          </span>
          <p className="flex-1">{stop.description}</p>
        </div>

        {/* Hanging Cargo Tags (Tech tags with wrap enabled and tie-hole) */}
        {stop.tech.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {stop.tech.map((t) => (
              <span
                key={t}
                className="relative pl-4 pr-2.5 py-1 text-[10px] font-mono border border-slate-700/60 bg-[#0B1420] text-slate-300 rounded-sm shadow-sm flex items-center"
              >
                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-700/60" />
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Steel Chassis Bar */}
        <div className="absolute left-0 right-0 bottom-0 h-2 bg-slate-800 rounded-b-md border-t border-slate-700/40" />

        {/* Year + Link / Private Stamp Plate */}
        <div className="mt-2 pt-2 border-t border-slate-800/40 flex items-center justify-between z-10">
          <span className="text-[10px] text-slate-500 font-mono tracking-wider">
            YEAR // {stop.years}
          </span>
          {stop.link ? (
            <a
              href={stop.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors duration-150 flex items-center gap-1"
            >
              [View project]
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className="inline">
                <path d="M2.5 9.5L9.5 2.5M6 2.5h3.5v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ) : (
            <span className="text-xs text-slate-600 italic tracking-wider uppercase font-mono text-[10px]">
              Private
            </span>
          )}
        </div>
      </div>

      {/* Wagon Wheels (Protruding below card bottom onto the rails) */}
      <div className="absolute bottom-[-16px] left-12 w-8 h-8 rounded-full bg-[#11161B] border-[3px] border-slate-500/80 flex items-center justify-center z-10 shadow-md">
        <div className="w-full h-full rounded-full border border-slate-700/60 flex items-center justify-center relative">
          <div className="absolute w-[2px] h-4 bg-slate-600/40" />
          <div className="absolute h-[2px] w-4 bg-slate-600/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#C4A882]" />
        </div>
      </div>
      <div className="absolute bottom-[-16px] right-12 w-8 h-8 rounded-full bg-[#11161B] border-[3px] border-slate-500/80 flex items-center justify-center z-10 shadow-md">
        <div className="w-full h-full rounded-full border border-slate-700/60 flex items-center justify-center relative">
          <div className="absolute w-[2px] h-4 bg-slate-600/40" />
          <div className="absolute h-[2px] w-4 bg-slate-600/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#C4A882]" />
        </div>
      </div>

      {/* Wagon Couplers */}
      {/* Desktop Coupler (Right) */}
      {!isMobile && (
        <div className="absolute top-[60%] -translate-y-1/2 right-[-64px] w-16 h-6 flex items-center justify-center pointer-events-none z-0">
          <motion.div
            variants={couplerVariants}
            initial="coupled"
            animate={isLastMatched ? "decoupled" : "coupled"}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="w-12 h-2 bg-slate-700 border border-slate-600 rounded-sm relative flex items-center justify-center origin-left"
          >
            <div className="w-4 h-6 rounded border-2 border-[#C4A882] bg-[#0D1219] shadow-sm flex-shrink-0" />
          </motion.div>
        </div>
      )}

      {/* Mobile Coupler (Bottom) */}
      {isMobile && (
        <div className="absolute bottom-[-48px] left-1/2 -translate-x-1/2 w-6 h-12 flex flex-col items-center justify-center pointer-events-none z-0">
          <motion.div
            variants={couplerVariants}
            initial="coupled"
            animate={isLastMatched ? "decoupled" : "coupled"}
            transition={{ duration: reducedMotion ? 0 : 0.3 }}
            className="w-2 h-8 bg-slate-700 border border-slate-600 rounded-sm relative flex items-center justify-center origin-top"
          >
            <div className="w-6 h-4 rounded border-2 border-[#C4A882] bg-[#0D1219] shadow-sm flex-shrink-0" />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProjectGrid() {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Extract unique tech tags dynamically from project dataset
  const allTechTags = Array.from(
    new Set(projectStops.flatMap((p) => p.tech))
  ).sort();

  useEffect(() => {
    setMounted(true);

    // Reduced motion configuration
    const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionMQ.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionMQ.addEventListener("change", handleMotionChange);

    // Responsive screen layout tracking
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      motionMQ.removeEventListener("change", handleMotionChange);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Filter click toggle
  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  // Reset/Clear action
  const clearFilters = () => setSelectedTechs([]);

  // Filter project dataset based on active route tags
  const filteredProjects = projectStops.filter((p) => {
    if (selectedTechs.length === 0) return true;
    return selectedTechs.some((t) => p.tech.includes(t));
  });

  return (
    <section id="projects" className="relative py-24 px-4 overflow-hidden" style={{ background: "#0D1219" }}>
      {/* Section header */}
      <ScrollReveal>
        <div className="max-w-6xl mx-auto mb-12 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Station Records
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mt-2"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Project Dossier
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            Eight production-grade builds, each solving a real problem with measurable impact.
          </p>
        </div>
      </ScrollReveal>

      {/* Tech Stack Filter Board (Control Panel) */}
      <ScrollReveal delay={0.05}>
        <div className="max-w-6xl mx-auto mb-16 p-5 sm:p-6 rounded-xl border border-slate-700/60 bg-[#161C22] shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_10px_35px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-700/50 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
              </span>
              <h3 className="font-mono text-xs sm:text-sm font-bold tracking-widest text-[#FFB800] uppercase">
                STATION ROUTE CONTROLLER
              </h3>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="text-[10px] sm:text-xs">
                CONSIST COUNT:{" "}
                <span className="text-[#FFB800] font-bold">
                  {filteredProjects.length} / {projectStops.length}
                </span>
              </span>
              {selectedTechs.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-2.5 py-1 rounded border border-red-500/40 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/60 transition-colors uppercase text-[9px] font-bold tracking-wider cursor-pointer"
                >
                  CLEAR FILTERS ⟲
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {allTechTags.map((tech) => {
              const isActive = selectedTechs.includes(tech);
              return (
                <button
                  key={tech}
                  onClick={() => toggleTech(tech)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] sm:text-xs font-mono tracking-wide uppercase transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none ${
                    isActive
                      ? "border-[#FFB800] text-[#FFB800] bg-[#FFB800]/10 shadow-[0_0_12px_rgba(255,184,0,0.15)]"
                      : "border-slate-800 bg-[#0D1219] text-slate-400 hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  {/* Status Indicator LED */}
                  <span 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      isActive 
                        ? "bg-[#22c55e] shadow-[0_0_4px_#22c55e,0_0_8px_#22c55e]" 
                        : "bg-slate-800 border border-slate-700/60"
                    }`}
                  />
                  {tech}
                </button>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Screen Reader Announcements for filter result counts */}
      <div className="sr-only" aria-live="polite">
        {mounted && `Showing ${filteredProjects.length} of ${projectStops.length} projects.`}
      </div>

      {/* Train Consist Track & Wagons Section */}
      <ScrollReveal delay={0.1}>
        <div className="max-w-6xl mx-auto relative px-4">
          <AnimatePresence mode="wait">
            {mounted && filteredProjects.length === 0 ? (
              /* Empty State (Departure Board theme) */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: reducedMotion ? 0 : 0.3 }}
                className="w-full max-w-xl mx-auto py-16 px-6 text-center rounded-xl border border-dashed border-amber-500/25 bg-[#161C22] shadow-[inset_0_1px_3px_rgba(255,255,255,0.05),0_10px_35px_rgba(0,0,0,0.5)] my-12"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-red-500/40 text-red-400 bg-red-500/10 font-mono text-xl mb-4">
                  ⚠
                </span>
                <h4 className="font-mono text-base font-bold tracking-widest text-[#FFB800] uppercase mb-3">
                  NO WAGONS ON THIS ROUTE
                </h4>
                <p className="text-slate-400 font-mono text-xs sm:text-sm tracking-wide mb-6">
                  No project carriages matched the active filter combination. Please clear selection or choose different tags.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800] hover:bg-[#FFB800]/20 hover:border-[#FFB800]/60 font-mono text-xs rounded transition-all uppercase tracking-wider cursor-pointer"
                >
                  Clear Active Filters
                </button>
              </motion.div>
            ) : (
              /* Coupled Carriages Consist */
              <motion.div
                key="consist-layout"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                {/* Scroll track container */}
                <div className="overflow-x-auto overflow-y-hidden pb-12 pt-6 px-1 md:px-8 relative scrollbar-thin">
                  <div className="flex flex-col md:flex-row items-stretch min-w-full md:min-w-max relative pb-10">
                    
                    {/* Track backdrop: Desktop Horizontal (Spans full scrolling content width) */}
                    <div className="hidden md:block absolute left-0 right-0 bottom-4 h-8 pointer-events-none z-0">
                      {/* Wooden sleepers/ties */}
                      <div 
                        className="absolute inset-0 opacity-25"
                        style={{
                          backgroundImage: "repeating-linear-gradient(90deg, #C4A882 0px, #C4A882 3px, transparent 3px, transparent 24px)",
                        }}
                      />
                      {/* Two parallel rails */}
                      <div className="absolute left-0 right-0 top-[12px] h-[2px] bg-[#C4A882]/40" />
                      <div className="absolute left-0 right-0 top-[20px] h-[2px] bg-[#C4A882]/40" />
                    </div>

                    {/* Track backdrop: Mobile Vertical (Spans vertical stack height) */}
                    <div className="block md:hidden absolute left-1/2 -translate-x-1/2 top-0 bottom-6 w-8 pointer-events-none z-0">
                      {/* Wooden sleepers/ties */}
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: "repeating-linear-gradient(0deg, #C4A882 0px, #C4A882 3px, transparent 3px, transparent 24px)",
                        }}
                      />
                      {/* Two parallel rails */}
                      <div className="absolute top-0 bottom-0 left-[12px] w-[2px] bg-[#C4A882]/30" />
                      <div className="absolute top-0 bottom-0 left-[20px] w-[2px] bg-[#C4A882]/30" />
                    </div>

                    {/* Coupled carriages content */}
                    {mounted && (
                      <AnimatePresence initial={false}>
                        {filteredProjects.map((stop, i) => (
                          <WagonCard
                            key={stop.id}
                            stop={stop}
                            index={i}
                            isLastMatched={i === filteredProjects.length - 1}
                            isMobile={isMobile}
                            reducedMotion={reducedMotion}
                          />
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollReveal>
    </section>
  );
}

