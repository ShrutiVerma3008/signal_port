/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [showPreloader, setShowPreloader] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [announcement, setAnnouncement] = useState("Loading portfolio: 0%");
  
  const skipButtonRef = useRef<HTMLButtonElement>(null);

  const handleComplete = () => {
    setShowPreloader(false);

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

  // Initialize: show preloader on every load unless reduced-motion is preferred
  useEffect(() => {
    setIsMounted(true);
    
    const hasReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (!hasReducedMotion) {
      setShowPreloader(true);
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("preload-active");
    }
  }, []);

  // Drive progress with simulated steps and page readiness check
  useEffect(() => {
    if (!showPreloader) return;

    let currentProgress = 0;
    let isPageReady = false;
    let isFontsReady = false;

    // Detect page/font readiness
    if (typeof document !== "undefined") {
      if (document.readyState === "complete") {
        isPageReady = true;
      } else {
        const handleLoad = () => {
          isPageReady = true;
        };
        window.addEventListener("load", handleLoad);
      }

      if (document.fonts) {
        document.fonts.ready.then(() => {
          isFontsReady = true;
        }).catch(() => {
          isFontsReady = true; // Fallback
        });
      } else {
        isFontsReady = true;
      }
    }

    const interval = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(interval);
        return;
      }

      // Base increment rate: ~1.0% per 50ms step under typical conditions (total 5s)
      let increment = 0.7 + Math.random() * 0.6;

      // Slow crawl after 85% if assets/fonts aren't fully ready
      if (currentProgress >= 85 && (!isPageReady || !isFontsReady)) {
        increment = 0.1 + Math.random() * 0.15;
      }

      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(Math.floor(currentProgress));
    }, 50);

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
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showPreloader]);

  // Sync screen reader announcer at key increments
  useEffect(() => {
    if (progress === 0) {
      setAnnouncement("Loading portfolio: 0%");
    } else if (progress === 50) {
      setAnnouncement("Loading portfolio: 50% loaded");
    } else if (progress === 100) {
      setAnnouncement("Loading complete. Welcome to Shruti Verma's portfolio.");
    }
  }, [progress]);

  // Hold for a brief beat (250ms) at 100% before starting the exit animation
  useEffect(() => {
    if (progress === 100 && showPreloader) {
      const exitHoldTimeout = setTimeout(() => {
        handleComplete();
      }, 250);
      return () => clearTimeout(exitHoldTimeout);
    }
  }, [progress, showPreloader]);



  if (!isMounted) return null;

  // Signal lamp state determined directly from current progress
  const aspect = progress === 100 ? "green" : progress >= 50 ? "yellow" : "red";

  // Calculate shutter reveal ratio (runs from 0 at progress 50% to 1 at progress 100%)
  const ratio = Math.max(0, (progress - 50) / 50);

  // Pad progress to a fixed 3-digit departure board readout
  const paddedProgress = progress.toString().padStart(3, "0");
  const digits = paddedProgress.split("");

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080E1C] text-white overflow-hidden select-none"
        >
          {/* Accessible screen reader status announcements */}
          <div className="sr-only" role="status" aria-live="polite">
            {announcement}
          </div>

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

              {/* Shutter Panels - Driven directly by progress ratio */}
              <div className="absolute inset-0 z-10 flex flex-col pointer-events-none">
                {/* Top Panel: Sweeps up */}
                <motion.div
                  animate={{ y: `-${ratio * 105}%` }}
                  transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
                  className="w-full h-[34%] bg-[#0B1420] border-b border-[#C4A882]/20"
                />
                {/* Middle Panel: Sweeps center-out (horizontal scale) */}
                <motion.div
                  animate={{ scaleX: 1 - ratio }}
                  transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
                  className="w-full h-[33%] bg-[#0B1420] border-y border-[#C4A882]/20 origin-center"
                />
                {/* Bottom Panel: Sweeps down */}
                <motion.div
                  animate={{ y: `${ratio * 105}%` }}
                  transition={{ type: "tween", ease: "easeOut", duration: 0.1 }}
                  className="w-full h-[33%] bg-[#0B1420] border-t border-[#C4A882]/20"
                />
              </div>
            </div>
          </div>

          {/* Progress Track and Train Progress Bar */}
          <div className="mt-10 flex flex-col items-center w-full max-w-[260px] sm:max-w-[300px]">
            <div className="relative w-full h-8 flex items-end">
              {/* Train SVG Carriage moving left to right */}
              <div
                className="absolute bottom-1.5 transition-all duration-100 ease-out"
                style={{ left: `${progress}%`, transform: "translateX(-50%)" }}
              >
                <svg
                  width="26"
                  height="14"
                  viewBox="0 0 26 14"
                  className="text-[#FFB800] fill-current"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,184,0,0.6))" }}
                >
                  <rect x="2" y="1" width="22" height="9" rx="1.5" />
                  <rect x="5" y="3" width="4" height="3" rx="0.5" fill="#080E1C" />
                  <rect x="11" y="3" width="4" height="3" rx="0.5" fill="#080E1C" />
                  <rect x="17" y="3" width="4" height="3" rx="0.5" fill="#080E1C" />
                  <circle cx="7" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                  {/* Front cowcatcher detail */}
                  <path d="M24 10 L26 13 L22 13 Z" />
                </svg>
              </div>
              
              {/* The Railway Tracks */}
              <div className="relative w-full h-1.5 bg-[#C4A882]/20 rounded-full overflow-visible">
                {/* Rails (top/bottom paths) */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-[#C4A882]/30" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C4A882]/30" />
                {/* Sleepers / ties */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: "repeating-linear-gradient(90deg, #C4A882 0px, #C4A882 1px, transparent 1px, transparent 12px)",
                  }}
                />
                {/* Gold path behind the train carriage */}
                <div
                  className="absolute top-0 bottom-0 left-0 bg-[#FFB800]/30 transition-all duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {/* The Departure Board styled mechanical digit counter */}
            <div className="flex items-center gap-1.5 mt-5">
              {digits.map((digit, idx) => (
                <div
                  key={idx}
                  className="w-9 h-12 flex items-center justify-center bg-[#161C22] border border-[#C4A882]/35 text-[#FFB800] text-2xl font-bold font-mono rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_3px_6px_rgba(0,0,0,0.4)] relative overflow-hidden"
                >
                  {/* Mechanical split line */}
                  <div className="absolute left-0 right-0 top-[50%] h-[1px] bg-black/50 z-10" />
                  <span className="relative z-0 select-none">{digit}</span>
                </div>
              ))}
              
              {/* Percent Character flap */}
              <div className="w-9 h-12 flex items-center justify-center bg-[#161C22] border border-[#C4A882]/20 text-[#C4A882]/70 text-xl font-bold font-mono rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] relative">
                <div className="absolute left-0 right-0 top-[50%] h-[1px] bg-black/50 z-10" />
                <span className="select-none">%</span>
              </div>
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
