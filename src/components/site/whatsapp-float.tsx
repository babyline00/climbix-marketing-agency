"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/15555550100?text=Hi%20Climbix%2C%20I%27d%20like%20to%20learn%20more%20about%20your%20growth%20systems"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 group flex items-center gap-2"
      aria-label="Chat on WhatsApp"
    >
      <span className="hidden sm:block px-3 py-2 rounded-lg bg-white shadow-lg text-slate-800 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
        Chat with us
      </span>
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#1da851] shadow-xl shadow-[#25d366]/30 transition-colors">
        <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7 text-white relative" />
      </span>
    </a>
  );
}
