/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function AboutSection() {
  const [imgError, setImgError] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showAlternative, setShowAlternative] = useState(false);

  useEffect(() => {
    // Detect hover capability
    const hoverQuery = window.matchMedia("(hover: hover)");
    setIsHoverDevice(hoverQuery.matches);
    const handleHoverChange = (e: MediaQueryListEvent) => {
      setIsHoverDevice(e.matches);
    };
    hoverQuery.addEventListener("change", handleHoverChange);

    // Detect reduced motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      hoverQuery.removeEventListener("change", handleHoverChange);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Continuous auto-crossfade loop for mobile/touch devices (no hover capability)
  useEffect(() => {
    if (isHoverDevice || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setShowAlternative((prev) => !prev);
    }, 3500);

    return () => clearInterval(interval);
  }, [isHoverDevice, prefersReducedMotion]);

  const showAltImage = !prefersReducedMotion && (isHoverDevice ? isHovered : showAlternative);

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
            onMouseEnter={() => {
              if (isHoverDevice && !prefersReducedMotion) {
                setIsHovered(true);
              }
            }}
            onMouseLeave={() => {
              if (isHoverDevice && !prefersReducedMotion) {
                setIsHovered(false);
              }
            }}
          >
            {!imgError ? (
              <div className="relative w-full h-full">
                <AnimatePresence mode="wait" initial={false}>
                  {showAltImage ? (
                    /* Traditional attire — slides/scales in fully opaque */
                    <motion.div
                      key="alt"
                      initial={{ scale: 1.06, opacity: 1 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.06, opacity: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src="/traditional.jpg"
                        alt="Shruti Verma - traditional attire portrait"
                        fill
                        sizes="(max-width: 768px) 280px, 340px"
                        onError={() => setImgError(true)}
                        className="object-cover"
                      />
                      {/* Amber gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                  ) : (
                    /* Professional portrait — base image */
                    <motion.div
                      key="base"
                      initial={{ scale: 1.06, opacity: 1 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.06, opacity: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src="/photo.jpg"
                        alt="Shruti Verma - professional portrait"
                        fill
                        priority
                        sizes="(max-width: 768px) 280px, 340px"
                        onError={() => setImgError(true)}
                        className="object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
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
                    Drop <code className="text-amber-500">photo.jpg</code> and <code className="text-amber-500">traditional.jpg</code> into public/ to enable the hover-reveal effect.
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


        {/* ── Bio text (Train Driver's Logbook Redesign) ───────────────────── */}
        <ScrollReveal direction="right" className="flex-1 w-full">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/8 text-amber-400 text-xs font-mono tracking-widest uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              About
            </span>

            <h2
              className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-6"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              The Story Behind the Signal
            </h2>

            {/* Logbook Backing Page */}
            <div
              className="relative w-full rounded-2xl border border-slate-800/80 shadow-2xl p-6 md:p-8 md:pl-16 overflow-hidden"
              style={{
                background: "#161C22",
                // Ruled notebook lines matching typewriter font leading (28px height)
                backgroundImage: "repeating-linear-gradient(180deg, transparent 0px, transparent 27px, rgba(196,168,130,0.05) 27px, rgba(196,168,130,0.06) 28px)",
              }}
            >
              {/* Binder Cover Spine (Visible only on desktop md: to prevent text overlap on mobile) */}
              <div 
                className="hidden md:block absolute left-0 top-0 bottom-0 w-8 bg-[#0D1219] border-r border-[#C4A882]/25 shadow-[inset_-3px_0_6px_rgba(0,0,0,0.6)] z-20"
                aria-hidden="true"
              />

              {/* 6 Binder rings (Visible only on desktop md:) */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="hidden md:block absolute w-8 h-2 bg-gradient-to-r from-slate-600 via-[#C4A882]/80 to-slate-700 border border-slate-950/60 rounded-full shadow-md z-30"
                  style={{
                    left: "14px",
                    top: `${12 + i * 15}%`,
                  }}
                  aria-hidden="true"
                />
              ))}

              {/* Logbook entries */}
              <div className="space-y-6 relative z-10 font-mono text-xs sm:text-sm text-slate-300 leading-7">
                {/* Entry 01 */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                  viewport={{ once: true, margin: "-40px" }}
                  className="pb-2 border-b border-slate-800/40"
                >
                  <div className="bg-[#0B1420] border border-slate-800/80 px-2 py-0.5 rounded text-[10px] text-[#FFB800] uppercase tracking-wider mb-2 w-fit inline-block font-bold">
                    LOG ENTRY 01 // STATION: VADODARA
                  </div>
                  <p>
                    I&apos;m a final-year B.Tech student in AI &amp; Data Science at{" "}
                    <span className="text-slate-100 font-semibold">
                      Gati Shakti Vishwavidyalaya, Vadodara
                    </span>{" "}
                    (CGPA 9.58/10.0), specializing in Railway AI — the only university in India
                    with a dedicated Railway technology stream.
                  </p>
                </motion.div>

                {/* Entry 02 */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: 0.1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  className="pb-2 border-b border-slate-800/40"
                >
                  <div className="bg-[#0B1420] border border-slate-800/80 px-2 py-0.5 rounded text-[10px] text-[#FFB800] uppercase tracking-wider mb-2 w-fit inline-block font-bold">
                    LOG ENTRY 02 // TIME: 0200 HRS
                  </div>
                  <p>
                    It started at 2am with a 400-page Railway policy PDF and a question:
                    could a language model actually understand this?
                  </p>
                </motion.div>

                {/* Entry 03 */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: 0.2 }}
                  viewport={{ once: true, margin: "-40px" }}
                  className="pb-2 border-b border-slate-800/40"
                >
                  <div className="bg-[#0B1420] border border-slate-800/80 px-2 py-0.5 rounded text-[10px] text-[#FFB800] uppercase tracking-wider mb-2 w-fit inline-block font-bold">
                    LOG ENTRY 03 // RESEARCH DEPLOYMENT
                  </div>
                  <p>
                    That late-night experiment became a full{" "}
                    <span className="text-amber-400 font-semibold">GraphRAG system</span> with
                    knowledge graphs, multi-hop reasoning, and SHAP explainability — and
                    a research internship at the{" "}
                    <span className="text-slate-100 font-semibold">Ministry of Railways</span>.
                  </p>
                </motion.div>

                {/* Entry 04 */}
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: 0.3 }}
                  viewport={{ once: true, margin: "-40px" }}
                >
                  <div className="bg-[#0B1420] border border-slate-800/80 px-2 py-0.5 rounded text-[10px] text-[#FFB800] uppercase tracking-wider mb-2 w-fit inline-block font-bold">
                    LOG ENTRY 04 // OBJECTIVE: ACTIVE DEPLOYMENT
                  </div>
                  <p>
                    I&apos;m actively looking for{" "}
                    <span className="text-amber-400 font-semibold">AI/ML and Data Science roles</span>{" "}
                    where I can bring production-grade thinking to hard problems. Every project
                    here has a real metric, a real user, and a real lesson.
                  </p>
                </motion.div>
              </div>

              {/* SUMMARY REGISTRY Stats Stamp */}
              <div 
                className="mt-8 border border-dashed border-[#FFB800]/30 bg-amber-500/[0.03] p-4 rounded font-mono text-[10px] sm:text-xs text-[#FFB800] uppercase tracking-wider grid grid-cols-3 gap-4 text-center select-none transform -rotate-0.5 relative z-10"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {/* Header label inside stamp */}
                <div className="absolute top-[-7px] left-4 bg-[#161C22] px-2 text-[8px] tracking-widest text-[#FFB800]/60 font-mono">
                  SUMMARY REGISTRY // TOTALS
                </div>
                {[
                  { label: "CGPA", value: "9.58" },
                  { label: "Projects", value: "8+" },
                  { label: "Competition", value: "Top 8 of 15K" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-sm sm:text-base font-bold tracking-wide">{stat.value}</div>
                    <div className="text-[8px] sm:text-[9px] text-[#FFB800]/70 mt-0.5 font-mono">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
