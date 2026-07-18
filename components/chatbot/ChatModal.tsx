"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGES = 10;

// ── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-amber-400/60"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-[10px] font-mono text-amber-400 border border-amber-500/40 bg-amber-500/10 self-end mb-0.5">
          SV
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm text-[#0B1420] font-medium"
            : "rounded-bl-sm text-slate-200"
        }`}
        style={{
          background: isUser
            ? "linear-gradient(135deg, #FFB800 0%, #FF8C00 100%)"
            : "#1A2330",
          border: isUser ? "none" : "1px solid rgba(196,168,130,0.15)",
        }}
      >
        {msg.content}
      </div>
    </div>
  );
}

// ── Main chat modal ───────────────────────────────────────────────────────────
interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm an AI trained on Shruti's background. Ask me about her projects, internships, or anything on her resume. 🚂",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  // ── TTS ────────────────────────────────────────────────────────────────────
  const speak = useCallback(async (text: string) => {
    if (!voiceEnabled) return;
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const arrayBuffer = await res.arrayBuffer();
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      const decoded = await ctx.decodeAudioData(arrayBuffer);
      const source = ctx.createBufferSource();
      source.buffer = decoded;
      source.connect(ctx.destination);
      source.start();
    } catch {
      // TTS not available — silently fail
    }
  }, [voiceEnabled]);

  // ── Send message ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || userMsgCount >= MAX_MESSAGES) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setUserMsgCount((c) => c + 1);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Network response was not ok");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // SSE: lines starting with "data: "
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.delta?.text ?? parsed.text ?? "";
              if (delta) {
                assistantText += delta;
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { role: "assistant", content: assistantText };
                  return copy;
                });
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }

      await speak(assistantText);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, userMsgCount, speak]);

  // ── Mic (SpeechRecognition) ────────────────────────────────────────────────
  const toggleMic = useCallback(() => {
    if (typeof window === "undefined") return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR = win.SpeechRecognition ?? win.webkitSpeechRecognition;
    if (!SR) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const rec = new SR();
    rec.lang = "en-IN";
    rec.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      sendMessage(transcript);
    };
    rec.onend = () => setIsListening(false);
    rec.onerror = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  }, [isListening, sendMessage]);

  const atLimit = userMsgCount >= MAX_MESSAGES;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="chat-modal"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[420px] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            maxHeight: "600px",
            border: "1px solid rgba(196,168,130,0.2)",
            background: "#0D1521",
          }}
        >
          {/* ── Header ────────────────────────────────────────────────── */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{ background: "#111B27", borderBottom: "1px solid rgba(196,168,130,0.12)" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-white font-semibold text-sm" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Ask Shruti&apos;s AI
              </span>
              <span className="text-slate-600 text-xs font-mono">· Signal Line</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Voice toggle */}
              <button
                id="voice-toggle"
                onClick={() => setVoiceEnabled((v) => !v)}
                title={voiceEnabled ? "Disable voice" : "Enable voice"}
                className={`p-1.5 rounded-lg transition-colors ${voiceEnabled ? "text-amber-400 bg-amber-400/15" : "text-slate-500 hover:text-slate-300"}`}
                aria-label="Toggle voice output"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                  <path d="M8 1v14M5 3v10M11 3v10M2 5v6M14 5v6" />
                </svg>
              </button>
              {/* Close */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Close chat"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Messages ──────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(196,168,130,0.2) transparent" }}>
            {messages.map((msg, i) => (
              <Bubble key={i} msg={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-3">
                <div className="w-7 h-7 rounded-full flex-shrink-0 mr-2 flex items-center justify-center text-[10px] font-mono text-amber-400 border border-amber-500/40 bg-amber-500/10 self-end">
                  SV
                </div>
                <div className="rounded-2xl rounded-bl-sm border border-amber-500/15 bg-[#1A2330]">
                  <TypingDots />
                </div>
              </div>
            )}
            {atLimit && (
              <div className="text-center text-xs text-slate-500 py-2 font-mono">
                Session limit reached — refresh to start a new conversation.
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* ── Input bar ─────────────────────────────────────────────── */}
          <div
            className="flex-shrink-0 px-3 py-3"
            style={{ borderTop: "1px solid rgba(196,168,130,0.1)", background: "#0D1521" }}
          >
            <div className="flex items-center gap-2 rounded-xl border border-slate-700/50 px-3 py-2 focus-within:border-amber-500/50 transition-colors bg-[#111B27]">
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder={atLimit ? "Session limit reached" : "Ask anything about Shruti…"}
                disabled={isLoading || atLimit}
                className="flex-1 bg-transparent text-slate-200 text-sm placeholder:text-slate-600 outline-none disabled:opacity-40"
              />

              {/* Mic button */}
              <button
                id="mic-button"
                onClick={toggleMic}
                disabled={atLimit}
                title={isListening ? "Stop listening" : "Speak"}
                className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                  isListening
                    ? "text-red-400 bg-red-400/15 animate-pulse"
                    : "text-slate-500 hover:text-amber-400 disabled:opacity-30"
                }`}
                aria-label={isListening ? "Stop listening" : "Start voice input"}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="1" width="6" height="9" rx="3" />
                  <path d="M2 8a6 6 0 0 0 12 0M8 14v2" />
                </svg>
              </button>

              {/* Send button */}
              <button
                id="chat-send"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading || atLimit}
                className="p-1.5 rounded-lg text-amber-400 hover:text-amber-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                aria-label="Send message"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 8H2M9 3l5 5-5 5" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-slate-700 mt-1.5 text-center font-mono">
              {MAX_MESSAGES - userMsgCount} messages remaining
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
