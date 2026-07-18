"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const DataSky = dynamic(() => import("./DataSky"), { ssr: false });

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(180deg, #080E1C 0%, #0B1420 55%, #0E1A16 100%)" }}
    >
      {/* WebGL sky */}
      <DataSky />

      {/* Moon / floodlight */}
      <div
        aria-hidden="true"
        className="absolute top-12 right-16 w-20 h-20 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, #FFF8E7 0%, #FFE8A3 40%, transparent 75%)",
          boxShadow: "0 0 60px 30px rgba(255,232,163,0.18), 0 0 120px 60px rgba(255,232,163,0.08)",
        }}
      />

      {/* Signal lamp — bottom left (amber) */}
      <div
        aria-hidden="true"
        className="absolute bottom-28 left-8 signal-lamp"
        style={{ "--lamp-color": "rgba(255,184,0,0.85)", "--halo-color": "rgba(255,184,0,0.25)" } as React.CSSProperties}
      />
      {/* Signal lamp — bottom right (green) */}
      <div
        aria-hidden="true"
        className="absolute bottom-28 right-8 signal-lamp"
        style={{ "--lamp-color": "rgba(0,220,100,0.85)", "--halo-color": "rgba(0,220,100,0.2)" } as React.CSSProperties}
      />

      {/* ── Departure board headline ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        {/* Station name tag */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 text-xs font-mono tracking-widest uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Platform 01 · The Signal Line
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white"
          style={{ fontFamily: "'Outfit', sans-serif", textShadow: "0 0 40px rgba(255,184,80,0.15)" }}
        >
          Shruti Verma
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="mt-3 text-lg sm:text-xl text-slate-300 font-medium"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          AI / ML &amp; Data Science &nbsp;·&nbsp; GSV Vadodara
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-4 max-w-xl text-slate-400 text-base sm:text-lg leading-relaxed"
        >
          Building intelligence that moves — from Railway PDF pipelines at 2am to
          production RAG systems with sub-200ms latency.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8 flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#timeline"
            className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#080E1C] font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(255,184,0,0.35)] hover:shadow-[0_0_32px_rgba(255,184,0,0.5)]"
          >
            Board the Train →
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg border border-slate-600 hover:border-amber-500/60 text-slate-300 hover:text-amber-300 font-semibold text-sm transition-all duration-200"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Platform silhouette */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: "linear-gradient(0deg, #050A12 0%, #080E1C 60%, transparent 100%)",
          borderTop: "1px solid rgba(196,168,130,0.12)",
        }}
      >
        {/* Platform edge line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(196,168,130,0.5) 30%, rgba(196,168,130,0.5) 70%, transparent)" }}
        />
        {/* Platform stripes */}
        <div className="absolute top-1 left-0 right-0 flex justify-center gap-3 px-8">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-px h-4 bg-amber-500/20" />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
      >
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-amber-500">
          <path d="M8 2 L8 18 M3 13 L8 18 L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
    </section>
  );
}
