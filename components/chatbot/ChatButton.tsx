"use client";

import { motion, AnimatePresence } from "framer-motion";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasUnread?: boolean;
}

export function ChatButton({ isOpen, onClick, hasUnread = false }: ChatButtonProps) {
  return (
    <button
      id="chat-open-button"
      onClick={onClick}
      aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#080E1C]"
      style={{
        background: isOpen
          ? "#1E2A36"
          : "linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)",
        boxShadow: isOpen
          ? "0 0 0 1px rgba(196,168,130,0.3)"
          : "0 0 0 0 rgba(255,184,0,0), 0 0 24px rgba(255,184,0,0.5), 0 4px 16px rgba(0,0,0,0.4)",
        animation: isOpen ? "none" : "chatPulse 2.5s ease-in-out infinite",
      }}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.svg
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            width="22" height="22" viewBox="0 0 22 22" fill="none"
            stroke="rgba(196,168,130,0.8)" strokeWidth="1.8" strokeLinecap="round"
          >
            <path d="M5 5l12 12M17 5L5 17" />
          </motion.svg>
        ) : (
          <motion.svg
            key="chat"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.2 }}
            width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#080E1C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="#080E1C" />
            <circle cx="12" cy="10" r="1" fill="#080E1C" />
            <circle cx="15" cy="10" r="1" fill="#080E1C" />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Unread badge */}
      {hasUnread && !isOpen && (
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 border-2 border-[#080E1C]" />
      )}
    </button>
  );
}
