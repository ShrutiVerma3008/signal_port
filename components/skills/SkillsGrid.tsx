"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { skills } from "@/lib/skills";

const categoryIcons: Record<string, string> = {
  "Languages & Frameworks": "⟨/⟩",
  "ML / AI": "◉",
  "Tools & Platforms": "⬡",
};

export default function SkillsGrid() {
  return (
    <section id="skills" className="relative py-20 px-4" style={{ background: "#0B1017" }}>
      {/* Subtle horizontal hatch texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #C4A882 0px, #C4A882 1px, transparent 1px, transparent 24px)",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.entries(skills) as [string, readonly string[]][]).map(([category, items], ci) => (
            <ScrollReveal key={category} delay={ci * 0.1}>
              <div
                className="rounded-xl border border-slate-700/50 p-6"
                style={{ background: "#161C22" }}
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-amber-400 text-lg font-mono select-none">
                    {categoryIcons[category] ?? "·"}
                  </span>
                  <h3
                    className="text-white font-semibold text-sm tracking-wide"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {category}
                  </h3>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-700/60 text-slate-300 bg-slate-800/50 font-mono hover:border-amber-500/40 hover:text-amber-300 transition-colors duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
