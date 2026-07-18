"use client";

import { TiltCard } from "./TiltCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { projectStops } from "@/lib/stops";

export default function ProjectGrid() {
  return (
    <section id="projects" className="relative py-24 px-4" style={{ background: "#0D1219" }}>
      {/* Section header */}
      <ScrollReveal>
        <div className="max-w-6xl mx-auto mb-16 text-center">
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

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectStops.map((stop, i) => (
          <ScrollReveal key={stop.id} delay={i * 0.07}>
            <TiltCard className="h-full">
              <div
                className="h-full flex flex-col rounded-xl border border-slate-700/60 p-6 transition-all duration-300
                  hover:border-amber-500/50 hover:shadow-[0_0_28px_rgba(255,184,0,0.1)]"
                style={{ background: "#161C22" }}
              >
                {/* Metric badge */}
                <div className="mb-3">
                  <span
                    className="inline-block text-xs font-mono px-2.5 py-1 rounded-md border border-amber-500/40 text-amber-400 bg-amber-500/10 leading-tight"
                  >
                    {stop.metric}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="text-white font-semibold text-base leading-snug mb-2"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {stop.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed flex-1">
                  {stop.description}
                </p>

                {/* Tech tags */}
                {stop.tech.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {stop.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-400 font-mono"
                      >
                        {t}
                      </span>
                    ))}
                    {stop.tech.length > 4 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-700/40 text-slate-500 font-mono">
                        +{stop.tech.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Year + Link */}
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-mono">{stop.years}</span>
                  {stop.link ? (
                    <a
                      href={stop.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors duration-150 flex items-center gap-1"
                    >
                      View project
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="inline">
                        <path d="M2.5 9.5L9.5 2.5M6 2.5h3.5v3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-xs text-slate-700 italic">Private</span>
                  )}
                </div>
              </div>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
