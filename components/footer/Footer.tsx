"use client";

import { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setStatus("sending");
    
    // Simulate API request to backend/email API
    setTimeout(() => {
      setStatus("success");
      setFormState({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    }, 1500);
  };

  return (
    <footer id="contact" className="relative pt-16 pb-10 px-4" style={{ background: "#070C14" }}>
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

          {/* ── Contact Form Card ────────────────────────────────────────── */}
          <div className="max-w-xl mx-auto mb-16 text-left bg-[#111B27]/80 backdrop-blur-md border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-xl">
            <h3 className="text-white text-base font-bold mb-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Send a Transmission
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="form-name" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
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
                    className="w-full bg-[#080E1C] border border-slate-700/60 focus:border-amber-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none transition-all focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label htmlFor="form-email" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
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
                    className="w-full bg-[#080E1C] border border-slate-700/60 focus:border-amber-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none transition-all focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="form-subject" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
                  Subject
                </label>
                <input
                  id="form-subject"
                  type="text"
                  value={formState.subject}
                  onChange={(e) => setFormState((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Collaboration, Job Role, etc."
                  disabled={status === "sending"}
                  className="w-full bg-[#080E1C] border border-slate-700/60 focus:border-amber-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none transition-all focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="form-message" className="block text-xs font-mono text-slate-400 mb-1.5 uppercase tracking-wider">
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
                  className="w-full bg-[#080E1C] border border-slate-700/60 focus:border-amber-500 rounded-lg px-4 py-2.5 text-sm text-slate-200 outline-none transition-all focus:ring-1 focus:ring-amber-500 resize-none animate-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer ${
                  status === "success"
                    ? "bg-green-500/10 border-green-500/30 text-green-400"
                    : "bg-amber-500 border-amber-500 hover:bg-amber-400 text-[#080E1C] shadow-[0_0_12px_rgba(255,184,0,0.2)] hover:shadow-[0_0_20px_rgba(255,184,0,0.4)]"
                }`}
              >
                {status === "idle" && (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14.5 1.5l-13 6.5 5 1.5 1.5 5 6.5-13z M6.5 9.5l3.5-3.5" />
                    </svg>
                    Send Signal
                  </>
                )}
                {status === "sending" && (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Transmitting...
                  </>
                )}
                {status === "success" && (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2.5 8l3.5 3.5 7.5-7.5" />
                    </svg>
                    Signal Deployed!
                  </>
                )}
              </button>

              {status === "success" && (
                <p className="text-xs text-green-400 font-mono text-center mt-2">
                  ✓ Transmission logged at Indian Railways interface. I will reply soon.
                </p>
              )}
            </form>
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
