"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function SlotMachine() {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-14 px-4 border-t border-white/10 mt-16 font-manrope">
      {/* Title Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CIRCULAR CASINO SLOT</span>
        </div>
        <h2 className="font-instrument text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          AP Lab Slot Machine
        </h2>
        <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
          Official SlotJS circular slot machine with full sound & vibration!
        </p>
      </div>

      {/* Vibrant High-Contrast SlotJS Machine Container */}
      <div className="relative w-full max-w-xl h-[600px] sm:h-[650px] flex items-center justify-center overflow-hidden rounded-3xl bg-[#090b16] border border-purple-500/20 shadow-[0_0_60px_rgba(168,85,247,0.2)] p-2">
        <iframe
          src="https://danziger.github.io/slotjs/"
          title="SlotJS Circular Slot Machine"
          className="w-full h-full border-none rounded-2xl bg-white"
          allow="autoplay; vibration"
        />
      </div>
    </div>
  );
}
