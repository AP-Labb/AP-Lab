"use client";

import React, { useState } from "react";
import { Sparkles, Maximize2, Minimize2, RotateCw } from "lucide-react";

export function SlotMachine() {
  const [iframeKey, setIframeKey] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-14 px-4 border-t border-white/10 mt-16 font-manrope">
      {/* Title Header */}
      <div className="text-center mb-6 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OFFICIAL GITHUB SLOTJS CASINO</span>
        </div>
        <h2 className="font-instrument text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          SlotJS Circular Slot Machine
        </h2>
        <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed font-manrope">
          Exact circular slot machine built with JavaScript, CSS variables & emojis by Danziger!
        </p>
      </div>

      {/* Frame Container */}
      <div 
        className={`relative w-full transition-all duration-300 rounded-3xl overflow-hidden border border-white/15 bg-[#070913] shadow-[0_0_60px_rgba(0,0,0,0.8)] ${
          isExpanded ? "max-w-4xl h-[700px]" : "max-w-xl h-[560px] sm:h-[620px]"
        }`}
      >
        {/* Top Control Bar */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-black/60 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between z-20">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            <span className="text-xs font-mono font-semibold text-white/60 ml-2 truncate">
              github.com/Danziger/slotjs
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleReset}
              title="Reset Machine"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse" : "Expand"}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Embedded Danziger SlotJS App */}
        <iframe
          key={iframeKey}
          src="https://danziger.github.io/slotjs/"
          title="SlotJS Circular Slot Machine"
          className="w-full h-full pt-12 border-none bg-black"
          allow="autoplay; vibration"
        />
      </div>
    </div>
  );
}
