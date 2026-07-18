"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function AboutSection() {
  const [imgError, setImgError] = useState(false);
  const [altError, setAltError] = useState(false);

  return (
    <section id="about" className="relative py-24 px-4" style={{ background: "#0B1420" }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* ── Profile Photo with Hover Reveal / Fallback ─────────────────── */}
        <ScrollReveal direction="left" className="flex-shrink-0">
          <div
            className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-2xl overflow-hidden group cursor-pointer"
            style={{
              border: "1px solid rgba(196,168,130,0.3)",
              boxShadow: "0 0 40px rgba(196,168,130,0.08), inset 0 0 40px rgba(0,0,0,0.4)",
            }}
          >
            {!imgError ? (
              <div className="relative w-full h-full">
                {/* Regular photo */}
                <img
                  src="/photo.jpg"
                  alt="Shruti Verma - Portrait"
                  onError={() => setImgError(true)}
                  className={`w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover:scale-105 ${!altError ? "group-hover:opacity-0" : "opacity-100"
                    }`}
                />

                {/* AI-themed photo (fades in on hover) */}
                {!altError && (
                  <img
                    src="C:\Users\hp\Desktop\portfolil\public\shrutiverma.jpg"
                    alt="C:\Users\hp\Desktop\portfolil\public\traditionl.jpeg"
                    onError={() => setAltError(true)}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out transform scale-100 group-hover:scale-105"
                  />
                )}

                {/* Cybernetic glowing lines overlay on hover */}
                {!altError && (
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                )}
              </div>
            ) : (
              /* Vector Silhouette Fallback if image files are missing */
              <div
                className="w-full h-full flex flex-col items-center justify-center gap-3"
                style={{ background: "linear-gradient(135deg, #161C22 0%, #1A2330 100%)" }}
              >
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
                  <circle cx="40" cy="30" r="18" fill="rgba(196,168,130,0.15)" stroke="rgba(196,168,130,0.3)" strokeWidth="1" />
                  <path d="M8 72 Q8 52 40 52 Q72 52 72 72" fill="rgba(196,168,130,0.1)" stroke="rgba(196,168,130,0.25)" strokeWidth="1" />
                </svg>
                <div className="text-center px-4">
                  <p className="text-xs font-mono text-slate-400">Profile Image Ready</p>
                  <p className="text-[10px] font-mono text-slate-600 mt-1 leading-normal">
                    Drop <code className="text-amber-500">photo.jpg</code> and <code className="text-amber-500">photo-ai.jpg</code> into public/ to enable the hover-reveal effect.
                  </p>
                </div>
              </div>
            )}

            {/* Amber corner accent */}
            <div
              className="absolute top-0 left-0 w-16 h-16 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 0% 0%, rgba(255,184,0,0.12) 0%, transparent 70%)",
              }}
            />
          </div>
        </ScrollReveal>

        {/* ── Bio text ──────────────────────────────────────────────────── */}
        <ScrollReveal direction="right" className="flex-1">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-400 text-xs font-mono tracking-widest uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              About
            </span>

            <h2
              className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-5"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              The Story Behind the Signal
            </h2>

            <div className="space-y-4 text-slate-400 leading-relaxed text-[15px]">
              <p>
                I&apos;m a final-year B.Tech student in AI &amp; Data Science at{" "}
                <span className="text-slate-200 font-medium">
                  Gati Shakti Vishwavidyalaya, Vadodara
                </span>{" "}
                (CGPA 9.58/10.0), specializing in Railway AI — the only university in India
                with a dedicated Railway technology stream.
              </p>
              <p>
                It started at 2am with a 400-page Railway policy PDF and a question:
                could a language model actually understand this? That late-night experiment
                became a full{" "}
                <span className="text-amber-400 font-medium">GraphRAG system</span> with
                knowledge graphs, multi-hop reasoning, and SHAP explainability — and
                a research internship at the{" "}
                <span className="text-slate-200 font-medium">Ministry of Railways</span>.
              </p>
              <p>
                I&apos;m actively looking for{" "}
                <span className="text-amber-400 font-medium">AI/ML and Data Science roles</span>{" "}
                where I can bring production-grade thinking to hard problems. Every project
                here has a real metric, a real user, and a real lesson.
              </p>
            </div>

            {/* Quick stats */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: "CGPA", value: "9.58" },
                { label: "Projects", value: "8+" },
                { label: "Competition rank", value: "Top 8 of 15K" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-slate-700/50 p-3 text-center"
                  style={{ background: "#161C22" }}
                >
                  <div
                    className="text-xl font-bold text-amber-400"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
