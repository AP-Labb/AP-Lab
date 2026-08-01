"use client";

import React, { useState, useEffect } from "react";
import { useProgress } from "@/context/ProgressContext";

export function ActiveBoostHUD() {
  const { progress } = useProgress();
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeBoosts = progress?.activeBoosts || {};
  
  const xpEntries = Object.entries(activeBoosts).filter(([k, expiry]) => (k.includes("xp") || k === "boost-xp-2x") && typeof expiry === "number" && (expiry as number) > now);
  const xpExpiry = xpEntries.length > 0 ? Math.max(...xpEntries.map(([_, exp]) => exp as number)) : 0;

  const coinEntries = Object.entries(activeBoosts).filter(([k, expiry]) => (k.includes("coin") || k === "boost-coin-2x") && typeof expiry === "number" && (expiry as number) > now);
  const coinExpiry = coinEntries.length > 0 ? Math.max(...coinEntries.map(([_, exp]) => exp as number)) : 0;

  if (!xpExpiry && !coinExpiry) return null;

  return (
    <div className="flex items-center space-x-2 select-none z-50 shrink-0">
      {/* 2x XP Boost Minimalist Pill */}
      {xpExpiry > now && (() => {
        const diffMs = Math.max(0, xpExpiry - now);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        const formatted = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        return (
          <div className="px-3 py-1.5 rounded-full border border-purple-800/60 bg-[#241338] text-purple-200 flex items-center space-x-2 font-mono text-xs shadow-sm">
            <img src="/images/xp-shield-zoomed.png" alt="XP Shield" className="w-5 h-5 max-w-[20px] max-h-[20px] object-contain shrink-0" />
            <span className="font-manrope font-extrabold uppercase text-[10px] sm:text-[11px] text-purple-300 whitespace-nowrap">2x XP:</span>
            <span className="font-mono text-white tracking-wider text-[11px] sm:text-xs">{formatted}</span>
          </div>
        );
      })()}

      {/* 2x Coins Boost Minimalist Pill */}
      {coinExpiry > now && (() => {
        const diffMs = Math.max(0, coinExpiry - now);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        const formatted = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        return (
          <div className="px-3 py-1.5 rounded-full border border-amber-800/60 bg-[#332509] text-amber-200 flex items-center space-x-2 font-mono text-xs shadow-sm">
            <img src="/images/coin-zoomed.png" alt="Coin" className="w-5 h-5 max-w-[20px] max-h-[20px] object-contain shrink-0" />
            <span className="font-manrope font-extrabold uppercase text-[10px] sm:text-[11px] text-amber-300 whitespace-nowrap">2x Coins:</span>
            <span className="font-mono text-white tracking-wider text-[11px] sm:text-xs">{formatted}</span>
          </div>
        );
      })()}
    </div>
  );
}
