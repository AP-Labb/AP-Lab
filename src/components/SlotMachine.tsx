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
      </div>

      {/* Cropped Container: Shows ONLY the circular SlotJS wheel, cropping out top header & bottom buttons, inverted onto dark shop background */}
      <div className="relative w-[360px] h-[360px] sm:w-[440px] sm:h-[440px] overflow-hidden rounded-full border-2 border-purple-500/30 bg-[#070812] shadow-[0_0_50px_rgba(168,85,247,0.25)] flex items-center justify-center">
        <iframe
          src="https://danziger.github.io/slotjs/"
          title="SlotJS Circular Slot Machine Wheel"
          className="w-[520px] h-[660px] max-w-none border-none -mt-[112px] sm:-mt-[118px] bg-transparent filter invert-[0.92] hue-rotate-180 contrast-125"
          allow="autoplay; vibration"
        />
      </div>
    </div>
  );
}
