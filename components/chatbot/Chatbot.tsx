"use client";

import { useState } from "react";
import { ChatButton } from "./ChatButton";
import { ChatModal } from "./ChatModal";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <ChatButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
      <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
