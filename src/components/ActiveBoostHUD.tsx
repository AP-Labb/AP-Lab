"use client";

import React, { useState, useEffect } from "react";
import { useProgress } from "@/context/ProgressContext";
import { cn } from "@/lib/utils";

export function ActiveBoostHUD() {
  const { progress } = useProgress();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeBoosts = progress?.activeBoosts || {};
  const activeList = Object.entries(activeBoosts).filter(([_, expiry]) => typeof expiry === "number" && expiry > now);

  if (activeList.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 select-none">
      {activeList.map(([id, expiry]) => {
        const diffMs = Math.max(0, (expiry as number) - now);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

        const formattedTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        const isXp = id === "boost-xp-2x" || id === "boost-2x-xp" || id.includes("xp");

        return (
          <div
            key={id}
            className={cn(
              "px-3 py-1 rounded-full border shadow-lg flex items-center space-x-2 font-mono font-bold text-xs backdrop-blur-md transition-all animate-pulse",
              isXp
                ? "bg-purple-950/90 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                : "bg-amber-950/90 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            )}
          >
            <span className="text-sm">{isXp ? "⚡" : "🪙"}</span>
            <span className="font-manrope font-extrabold uppercase text-[10px] sm:text-[11px] whitespace-nowrap">
              {isXp ? "2x XP Boost:" : "2x Coin Boost:"}
            </span>
            <span className="font-mono text-white tracking-widest text-[11px] sm:text-xs">
              {formattedTime}
            </span>
          </div>
        );
      })}
    </div>
  );
}
