"use client";

import { useState, useEffect } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { skills } from "@/lib/skills";

// Accent colors and styling variables matching established theme tokens
const ACCENTS = {
  languages: {
    text: "text-[#FFB800]",
    border: "border-l-[3px] border-l-[#FFB800] rounded-r-md",
    glow: "motion-safe:hover:shadow-[0_8px_16px_rgba(255,184,0,0.2)]",
  },
  mlAi: {
    text: "text-[#22c55e]",
    border: "rounded-full border border-slate-700/60",
    glow: "motion-safe:hover:shadow-[0_8px_16px_rgba(34,197,94,0.2)]",
  },
  tools: {
    text: "text-[#C4A882]", // --rail token
    border: "", // Hexagonal shape handled via inline clip-path styles
    glow: "motion-safe:hover:shadow-[0_8px_16px_rgba(196,168,130,0.2)]",
  },
};

// Octagonal/hexagonal clip-path helper for Tools & Platforms category
const octagonalClipStyle = {
  clipPath: "polygon(6px 0%, calc(100% - 6px) 0%, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0% calc(100% - 6px), 0% 6px)",
};

export default function SkillsGrid() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const motionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionMQ.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionMQ.addEventListener("change", handleMotionChange);
    return () => {
      motionMQ.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <section id="skills" className="relative py-24 px-4" style={{ background: "#0B1017" }}>
      {/* Subtle horizontal hatch texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #C4A882 0px, #C4A882 1px, transparent 1px, transparent 24px)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Existing Section Header */}
        <ScrollReveal>
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-400 text-xs font-mono tracking-widest uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Cargo Manifest
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mt-2"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Skills &amp; Tools
            </h2>
          </div>
        </ScrollReveal>

        {/* Pegboard Bench Framing */}
        <ScrollReveal delay={0.1}>
          <div
            className="w-full rounded-2xl border-4 border-[#C4A882]/20 outline outline-1 outline-slate-800 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
            style={{
              background: "#161C22",
              backgroundImage: "radial-gradient(circle, rgba(8, 14, 28, 0.95) 2.2px, transparent 2.2px)",
              backgroundSize: "20px 20px",
            }}
          >
            {/* Labeled zones list (Grid on desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative z-10">
              {(Object.entries(skills) as [string, readonly string[]][]).map(([category, items], ci) => {
                let categoryKey: "languages" | "mlAi" | "tools" = "languages";
                if (category === "ML / AI") categoryKey = "mlAi";
                if (category === "Tools & Platforms") categoryKey = "tools";

                return (
                  <div key={category} className="flex flex-col">
                    {/* Stenciled category tag */}
                    <div className="bg-[#0B1420] border border-slate-700/60 rounded px-3 py-1.5 text-[10px] sm:text-xs font-mono text-[#FFB800] uppercase tracking-wider mb-6 inline-flex items-center gap-2 shadow-inner w-fit select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-pulse" />
                      {category}
                    </div>

                    {/* Tools wrapping naturally within category zone */}
                    <ul className="flex flex-wrap gap-x-4 gap-y-7 pt-4">
                      {items.map((skill) => (
                        <li key={skill} className="relative inline-flex flex-col items-center">
                          {/* Pegboard peghead hook assembly */}
                          <span
                            aria-hidden="true"
                            className="absolute top-[-10px] left-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#080E1C] border border-slate-700/50 z-0"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute top-[-10px] bottom-[85%] left-1/2 -translate-x-1/2 w-[1px] bg-slate-600/50 z-0"
                          />

                          {/* Skill Tool Chip (Differentiated visuals per category) */}
                          {categoryKey === "languages" && (
                            <span
                              className={`relative text-xs px-3 py-1.5 border border-slate-700/60 bg-slate-800/40 text-slate-200 font-mono flex items-center gap-1.5 shadow-sm transition-all duration-200 cursor-default select-none ${
                                ACCENTS.languages.border
                              } ${
                                !reducedMotion && mounted
                                  ? `motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-105 ${ACCENTS.languages.glow} hover:text-white hover:border-amber-500/50`
                                  : ""
                              }`}
                            >
                              {/* Hanging hole notch */}
                              <span
                                aria-hidden="true"
                                className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#161C22] border border-slate-800"
                              />
                              {/* Bracket wrench accent */}
                              <span
                                aria-hidden="true"
                                className={`font-bold select-none text-[10px] ${ACCENTS.languages.text}`}
                              >
                                ⟨/⟩
                              </span>
                              {skill}
                            </span>
                          )}

                          {categoryKey === "mlAi" && (
                            <span
                              className={`relative text-xs px-3 py-1.5 border border-slate-700/60 bg-slate-800/40 text-slate-200 font-mono flex items-center gap-1.5 shadow-sm transition-all duration-200 cursor-default select-none ${
                                ACCENTS.mlAi.border
                              } ${
                                !reducedMotion && mounted
                                  ? `motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-105 ${ACCENTS.mlAi.glow} hover:text-white hover:border-emerald-500/50`
                                  : ""
                              }`}
                            >
                              {/* Hanging hole notch */}
                              <span
                                aria-hidden="true"
                                className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#161C22] border border-slate-800"
                              />
                              {/* Gauge dial accent SVG */}
                              <svg
                                aria-hidden="true"
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#22c55e"
                                strokeWidth="2.5"
                                className="flex-shrink-0"
                              >
                                <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.47M12 22a10 10 0 0 0 10-10c0-4.42-2.87-8.17-6.84-9.47" />
                                <path d="m12 12 4-4" />
                              </svg>
                              {skill}
                            </span>
                          )}

                          {categoryKey === "tools" && (
                            <span
                              className={`relative inline-flex items-center p-[1px] bg-slate-700/60 hover:bg-[#C4A882]/70 transition-colors duration-200 shadow-sm ${
                                !reducedMotion && mounted
                                  ? `motion-safe:hover:-translate-y-0.5 motion-safe:hover:scale-105 ${ACCENTS.tools.glow}`
                                  : ""
                              }`}
                              style={octagonalClipStyle}
                            >
                              <span
                                className="px-2.5 py-1.5 bg-[#161C22]/90 text-slate-200 hover:text-white font-mono flex items-center gap-1.5 select-none cursor-default"
                                style={octagonalClipStyle}
                              >
                                {/* Hanging hole notch */}
                                <span
                                  aria-hidden="true"
                                  className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#161C22] border border-slate-800"
                                />
                                {/* Plug accent SVG (using --rail theme token) */}
                                <svg
                                  aria-hidden="true"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#C4A882"
                                  strokeWidth="2.5"
                                  className="flex-shrink-0"
                                >
                                  <path d="M12 2v6M9 8h6M10 14h4M9 14v4a3 3 0 0 0 6 0v-4M12 18v4" />
                                </svg>
                                {skill}
                              </span>
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

