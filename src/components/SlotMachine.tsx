"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function SlotMachine() {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-14 px-4 border-t border-white/10 mt-16 font-manrope">
      {/* Title Header */}
      <div className="text-center mb-4 space-y-1">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>CIRCULAR CASINO SLOT</span>
        </div>
        <h2 className="font-instrument text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          AP Lab Slot Machine
        </h2>
      </div>

      {/* Seamless SlotJS Wheel Container - No white background box, no frame header, blending directly with AP Lab background */}
      <div className="relative w-full max-w-lg h-[580px] sm:h-[640px] flex items-center justify-center overflow-hidden bg-transparent">
        <iframe
          src="https://danziger.github.io/slotjs/"
          title="SlotJS Circular Slot Machine"
          className="w-full h-full border-none bg-transparent mix-blend-multiply filter contrast-125"
          allow="autoplay; vibration"
        />
      </div>
    </div>
  );
}
