"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const CONTACT_INFO = {
  email: "shruti.vermabtech23@gsv.ac.in",
  linkedin: "https://linkedin.com/in/shruti-verma-437643291",
  github: "https://github.com/ShrutiVerma3008",
  resume: "/resume.pdf",
};

export default function Footer() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [submittedName, setSubmittedName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setStatus("sending");
    setError(null);

    const isDev = process.env.NODE_ENV === "development";
    const simulateError = isDev && (
      process.env.NEXT_PUBLIC_SIMULATE_CONTACT_ERROR === "true" ||
      (typeof window !== "undefined" && window.location.search.includes("simulate_error=true"))
    );

    if (simulateError) {
      setTimeout(() => {
        setError("TRANSMISSION ERROR: Simulated telemetry failure (dev-only check).");
        setStatus("idle");
      }, 1500);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      const data = await res.json();

      if (res.ok && (data.success || res.status === 200)) {
        setStatus("success");
        setSubmittedName(formState.name);
        setFormState({ name: "", email: "", subject: "", message: "" });
      } else {
        setError(data.error || "Failed to deliver transmission over the line.");
        setStatus("idle");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network failure on telemetry connection.");
      setStatus("idle");
    }
  };

  return (
    <footer id="contact" className="relative pt-16 pb-10 px-4" style={{ background: "#070C14", "--amber": "#FFB800", "--rail": "#C4A882", "--navy-mid": "#161C22" } as React.CSSProperties}>
      {/* Self-contained CSS keyframe animation for the Morse code indicator light */}
      <style>{`
        @keyframes MorseFlicker {
          0%, 100% { opacity: 0.25; filter: drop-shadow(0 0 0 transparent); }
          12%, 35%, 65% { opacity: 1; filter: drop-shadow(0 0 6px var(--amber)); }
          22%, 48%, 78% { opacity: 0.45; filter: drop-shadow(0 0 2px var(--amber)); }
        }
        .animate-morse {
          animation: MorseFlicker 0.6s infinite alternate;
        }
      `}</style>

      {/* Signal-lamp divider */}
      <div className="max-w-3xl mx-auto mb-12 flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(196,168,130,0.3))" }} />
        <div className="flex items-center gap-2">
          {/* Amber lamp */}
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "rgba(255,184,0,0.9)", boxShadow: "0 0 8px rgba(255,184,0,0.6)" }} />
          {/* Green lamp */}
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "rgba(0,220,100,0.9)", boxShadow: "0 0 8px rgba(0,220,100,0.6)", animationDelay: "0.5s" }} />
        </div>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(196,168,130,0.3), transparent)" }} />
      </div>

      <ScrollReveal>
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            All aboard?
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Let&apos;s build something that actually ships.
          </p>

          {/* Screen Reader Announcement Region */}
          <div className="sr-only" aria-live="polite">
            {status === "success" && `Transmission sent. Signal successfully logged for Shruti Verma.`}
            {error && `Submission failed: ${error}`}
          </div>

          {/* ── Telegraph Console Card ─────────────────────────────────────── */}
          <div className="max-w-xl mx-auto mb-16 text-left relative z-10">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                /* Success Message (Telegraph layout) */
                <motion.div
                  key="success-confirmation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 border border-dashed border-emerald-500/35 bg-emerald-500/5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs text-emerald-400"
                >
                  <div className="flex items-center gap-3">
                    {/* Settled green signal-light LED */}
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] shadow-[0_0_8px_#22c55e] animate-pulse flex-shrink-0" />
                    <span>
                      <span className="font-bold block uppercase tracking-wider mb-0.5">TRANSMISSION DEPLOYED</span>
                      Transmission logged. I will reply soon. Thank you, {submittedName}!
                    </span>
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-3 py-1.5 border border-emerald-500/30 rounded text-[10px] text-emerald-400 hover:bg-emerald-500/10 transition-all uppercase cursor-pointer select-none font-bold"
                  >
                    Reset Console
                  </button>
                </motion.div>
              ) : (
                /* Telegraph Console Form */
                <motion.div
                  key="telegraph-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-[var(--rail)]/30 p-6 md:p-8 rounded-2xl shadow-2xl relative outline outline-1 outline-[var(--navy-mid)]"
                  style={{ background: "#161C22" }}
                >
                  {/* Console Header Plaque */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-[var(--navy-mid)] border border-[var(--rail)]/30 rounded px-4 py-1.5 text-[10px] sm:text-xs font-mono text-[var(--amber)] uppercase tracking-wider inline-flex items-center gap-2 shadow-inner select-none font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)] animate-pulse" />
                      Send a Transmission
                    </div>
                  </div>

                  {/* Warning Inline Console Error Alert */}
                  {error && (
                    <div className="bg-red-950/20 border border-dashed border-red-500/30 rounded-lg p-4 mb-5 font-mono text-xs text-red-400 flex items-start gap-2.5">
                      <span className="text-red-500 text-sm">⚠</span>
                      <div>
                        <span className="font-bold block uppercase tracking-wider mb-1">TELEMETRY ERROR</span>
                        {error}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="form-name" className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-widest font-bold">
                          Name
                        </label>
                        <input
                          id="form-name"
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="Your Name"
                          disabled={status === "sending"}
                          className="w-full bg-transparent border-b border-dashed border-slate-700/60 focus:border-b-2 focus:border-solid focus:border-[var(--amber)] px-2 py-2 text-sm text-slate-200 outline-none transition-all placeholder-slate-700/60 focus:ring-0 rounded-none font-mono"
                        />
                      </div>
                      <div>
                        <label htmlFor="form-email" className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-widest font-bold">
                          Email Address
                        </label>
                        <input
                          id="form-email"
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="your.email@example.com"
                          disabled={status === "sending"}
                          className="w-full bg-transparent border-b border-dashed border-slate-700/60 focus:border-b-2 focus:border-solid focus:border-[var(--amber)] px-2 py-2 text-sm text-slate-200 outline-none transition-all placeholder-slate-700/60 focus:ring-0 rounded-none font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="form-subject" className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-widest font-bold">
                        Subject
                      </label>
                      <input
                        id="form-subject"
                        type="text"
                        value={formState.subject}
                        onChange={(e) => setFormState((prev) => ({ ...prev, subject: e.target.value }))}
                        placeholder="Collaboration, Job Role, etc."
                        disabled={status === "sending"}
                        className="w-full bg-transparent border-b border-dashed border-slate-700/60 focus:border-b-2 focus:border-solid focus:border-[var(--amber)] px-2 py-2 text-sm text-slate-200 outline-none transition-all placeholder-slate-700/60 focus:ring-0 rounded-none font-mono"
                      />
                    </div>
                    <div>
                      <label htmlFor="form-message" className="block text-[10px] font-mono text-slate-400 mb-1 uppercase tracking-widest font-bold">
                        Message
                      </label>
                      <textarea
                        id="form-message"
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Tell me about your project, team, or opportunity..."
                        disabled={status === "sending"}
                        className="w-full bg-transparent border-b border-dashed border-slate-700/60 focus:border-b-2 focus:border-solid focus:border-[var(--amber)] px-2 py-2 text-sm text-slate-200 outline-none transition-all placeholder-slate-700/60 focus:ring-0 rounded-none resize-none animate-none font-mono"
                      />
                    </div>

                    {/* SVG traveling pulse animation */}
                    {status === "sending" && !reducedMotion && mounted && (
                      <div className="w-full h-4 relative overflow-hidden my-4" aria-hidden="true">
                        <svg className="w-full h-full" viewBox="0 0 400 16" fill="none">
                          <path d="M 0 8 L 400 8" stroke="var(--rail)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
                          <motion.circle
                            cx="0"
                            cy="8"
                            r="4.5"
                            fill="var(--amber)"
                            animate={{ cx: ["0%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                            style={{ filter: "drop-shadow(0 0 4px var(--amber))" }}
                          />
                        </svg>
                      </div>
                    )}

                    {/* Physical Telegraph Key Action Assembly */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-800/40">
                      <div className="flex items-center gap-4">
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          aria-label="Send Signal Transmission"
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-150 border-2 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                            status === "sending"
                              ? "bg-slate-800 border-slate-700 text-slate-500 shadow-none pointer-events-none"
                              : "bg-[var(--amber)] border-[var(--navy)] text-[var(--navy)] shadow-[0_4px_0_var(--navy)] hover:bg-[#FFC420] active:translate-y-1 active:shadow-none hover:shadow-[0_4px_0_var(--navy)]"
                          }`}
                        >
                          {/* Telegraph key visual icon */}
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
                          </svg>
                        </button>
                        
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                            {status === "sending" ? "TRANSMITTING OVER WIRE..." : "TAP KEY TO TRANSMIT"}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                            {status === "sending" ? "Morse modulation active" : "Secure line Platform 01"}
                          </span>
                        </div>
                      </div>

                      {/* Morse indicator LED light */}
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-slate-500 uppercase">LINE STATUS</span>
                        <span
                          aria-hidden="true"
                          className={`w-3 h-3 rounded-full border border-slate-800 transition-all duration-300 ${
                            status === "sending"
                              ? "bg-[var(--amber)] shadow-[0_0_8px_var(--amber)] animate-morse"
                              : "bg-slate-900"
                          }`}
                        />
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Links row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {/* Email */}
            <a
              id="contact-email"
              href={`mailto:${CONTACT_INFO.email}`}
              className="flex items-center gap-2 text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200 group"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:text-amber-400">
                <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <path d="M1 5.5 L8 9.5 L15 5.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              {CONTACT_INFO.email}
            </a>

            {/* LinkedIn */}
            <a
              id="contact-linkedin"
              href={CONTACT_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200 group"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="4.5" cy="5.5" r="1" fill="currentColor" />
                <path d="M3.5 7.5v5M5.5 7.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M8 7.5v5M8 9.5a2 2 0 0 1 4 0v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              LinkedIn
            </a>

            {/* GitHub */}
            <a
              id="contact-github"
              href={CONTACT_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-400 hover:text-amber-400 text-sm transition-colors duration-200 group"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1.3A6.7 6.7 0 0 0 1.3 8c0 2.96 1.92 5.48 4.58 6.37.34.06.46-.15.46-.33v-1.15c-1.87.4-2.26-.9-2.26-.9-.3-.78-.74-1-.74-1-.6-.42.05-.41.05-.41.67.05 1.02.69 1.02.69.6 1.01 1.56.72 1.94.55.06-.43.23-.72.42-.89-1.5-.17-3.07-.75-3.07-3.33 0-.73.26-1.33.69-1.8-.07-.17-.3-.85.07-1.78 0 0 .56-.18 1.84.69A6.4 6.4 0 0 1 8 5.12c.57 0 1.14.08 1.67.23 1.28-.87 1.84-.69 1.84-.69.37.93.14 1.61.07 1.78.43.47.69 1.07.69 1.8 0 2.59-1.58 3.16-3.08 3.33.24.21.46.62.46 1.25v1.85c0 .18.12.39.46.33A6.7 6.7 0 0 0 14.7 8 6.7 6.7 0 0 0 8 1.3z" />
              </svg>
              GitHub
            </a>
          </div>

          {/* Download Resume button */}
          <a
            id="download-resume"
            href={CONTACT_INFO.resume}
            download
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-[#080E1C] font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(255,184,0,0.3)] hover:shadow-[0_0_32px_rgba(255,184,0,0.5)]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v8M5 7l3 3 3-3M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download Resume
          </a>

          {/* Footer caption */}
          <p className="mt-12 text-slate-700 text-xs font-mono">
            © {new Date().getFullYear()} Shruti Verma &nbsp;·&nbsp; The Signal Line
          </p>
        </div>
      </ScrollReveal>
    </footer>
  );
}
