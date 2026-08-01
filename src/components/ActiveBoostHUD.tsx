"use client";

import React, { useState, useEffect } from "react";
import { useProgress } from "@/context/ProgressContext";

export function ActiveBoostHUD() {
  const { progress } = useProgress();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
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
      {xpExpiry > now && (() => {
        const diffMs = Math.max(0, xpExpiry - now);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        const formatted = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        return (
          <div className="px-3 py-1.5 rounded-full border shadow-lg flex items-center space-x-1.5 font-mono font-bold text-xs bg-purple-950/90 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)] animate-pulse">
            <span className="text-sm">⚡</span>
            <span className="font-manrope font-extrabold uppercase text-[10px] sm:text-[11px] whitespace-nowrap">2x XP:</span>
            <span className="font-mono text-white tracking-wider text-[11px] sm:text-xs">{formatted}</span>
          </div>
        );
      })()}

      {coinExpiry > now && (() => {
        const diffMs = Math.max(0, coinExpiry - now);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        const formatted = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        return (
          <div className="px-3 py-1.5 rounded-full border shadow-lg flex items-center space-x-1.5 font-mono font-bold text-xs bg-amber-950/90 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)] animate-pulse">
            <span className="text-sm">🪙</span>
            <span className="font-manrope font-extrabold uppercase text-[10px] sm:text-[11px] whitespace-nowrap">2x Coins:</span>
            <span className="font-mono text-white tracking-wider text-[11px] sm:text-xs">{formatted}</span>
          </div>
        );
      })()}
    </div>
  );
}
