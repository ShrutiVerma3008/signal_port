"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [aspect, setAspect] = useState<"red" | "yellow" | "green">("red");
  const [showPreloader, setShowPreloader] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
    
    const hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasSeenPreloader = sessionStorage.getItem("portfolio-preloader-shown");
    
    if (!hasReducedMotion && !hasSeenPreloader) {
      setShowPreloader(true);
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("preload-active");
    }
  }, []);

  useEffect(() => {
    if (!showPreloader) return;

    // 1. Red -> Yellow at 0.4s. Shutters begin to split open.
    const yellowTimeout = setTimeout(() => {
      setAspect("yellow");
    }, 400);

    // 2. Yellow -> Green at 0.8s. Shutters complete their opening transition.
    const greenTimeout = setTimeout(() => {
      setAspect("green");
    }, 800);

    // 3. Preloader exit begins at 1.3s (duration 0.4s, unmounting at 1.7s).
    const exitTimeout = setTimeout(() => {
      handleComplete();
    }, 1300);

    // Focus skip button on mount for accessibility
    if (skipButtonRef.current) {
      skipButtonRef.current.focus();
    }

    // Support keyboard Esc key to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Hide main content from screen readers while loading
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.setAttribute("aria-hidden", "true");
    }

    return () => {
      clearTimeout(yellowTimeout);
      clearTimeout(greenTimeout);
      clearTimeout(exitTimeout);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPreloader]);

  const handleComplete = () => {
    setShowPreloader(false);
    sessionStorage.setItem("portfolio-preloader-shown", "true");

    // Restore scroll and remove html class
    document.documentElement.classList.remove("preload-active");
    document.body.style.overflow = "";

    // Unhide and programmatically focus main content
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.removeAttribute("aria-hidden");
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
    }
  };

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080E1C] text-white overflow-hidden select-none"
          role="status"
          aria-live="polite"
        >
          {/* Accessible announcement */}
          <div className="sr-only">Loading Shruti Verma's portfolio.</div>

          {/* Central Animation Grid */}
          <div className="flex flex-col sm:flex-row items-center gap-8 md:gap-10 px-6">
            
            {/* Railway 3-Aspect Signal Head */}
            <div className="relative w-12 h-32 flex flex-col items-center justify-between py-4 bg-[#161C22]/95 border border-[#C4A882]/20 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {/* Red Light */}
              <div
                className={`w-5 h-5 rounded-full transition-all duration-300 ${
                  aspect === "red"
                    ? "bg-red-500 shadow-[0_0_16px_6px_rgba(239,68,68,0.75)]"
                    : "bg-red-950/40 opacity-20"
                }`}
              />
              {/* Yellow Light */}
              <div
                className={`w-5 h-5 rounded-full transition-all duration-300 ${
                  aspect === "yellow"
                    ? "bg-[#FFB800] shadow-[0_0_16px_6px_rgba(255,184,0,0.75)]"
                    : "bg-amber-950/40 opacity-20"
                }`}
              />
              {/* Green Light */}
              <div
                className={`w-5 h-5 rounded-full transition-all duration-300 ${
                  aspect === "green"
                    ? "bg-emerald-500 shadow-[0_0_16px_6px_rgba(16,185,129,0.75)]"
                    : "bg-emerald-950/40 opacity-20"
                }`}
              />
            </div>

            {/* Masked Name Container */}
            <div className="relative overflow-hidden py-3 px-6 flex items-center justify-center min-h-[80px]">
              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold font-outfit tracking-tight text-white"
                style={{ textShadow: "0 0 30px rgba(255,255,255,0.08)" }}
              >
                Shruti Verma
              </h1>

              {/* Shutter Panels */}
              <AnimatePresence>
                {aspect === "red" && (
                  <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
                    {/* Top Panel: Sweeps up */}
                    <motion.div
                      initial={{ y: 0 }}
                      exit={{
                        y: "-105%",
                        transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
                      }}
                      className="w-full h-[34%] bg-[#0B1420] border-b border-[#C4A882]/20"
                    />
                    {/* Middle Panel: Sweeps center-out (horizontal scale) */}
                    <motion.div
                      initial={{ scaleX: 1 }}
                      exit={{
                        scaleX: 0,
                        transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
                      }}
                      className="w-full h-[33%] bg-[#0B1420] border-y border-[#C4A882]/20 origin-center"
                    />
                    {/* Bottom Panel: Sweeps down */}
                    <motion.div
                      initial={{ y: 0 }}
                      exit={{
                        y: "105%",
                        transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] },
                      }}
                      className="w-full h-[33%] bg-[#0B1420] border-t border-[#C4A882]/20"
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Accessible Skip Button */}
          <button
            ref={skipButtonRef}
            onClick={handleComplete}
            className="absolute bottom-8 right-8 px-4 py-2 text-xs font-mono tracking-widest text-slate-400 hover:text-[#FFB800] border border-[#C4A882]/20 hover:border-[#FFB800]/50 hover:bg-[#FFB800]/5 rounded transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB800]"
          >
            SKIP INTRO ⏭
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
