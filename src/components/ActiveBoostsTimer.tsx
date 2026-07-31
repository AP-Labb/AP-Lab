"use client";

import React, { useState, useEffect } from "react";
import { useProgress } from "@/context/ProgressContext";
import { Zap, Coins } from "lucide-react";

export function ActiveBoostsTimer() {
  const { progress } = useProgress();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const activeBoosts = progress?.activeBoosts || {};
  const xpExpiry = activeBoosts["boost-2x-xp"] || 0;
  const coinExpiry = activeBoosts["boost-2x-coin"] || 0;

  const isXpActive = xpExpiry > now;
  const isCoinActive = coinExpiry > now;

  if (!isXpActive && !isCoinActive) return null;

  const formatTime = (expiry: number) => {
    const totalSec = Math.max(0, Math.floor((expiry - now) / 1000));
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[99999] flex items-center space-x-3 select-none pointer-events-auto">
      {isXpActive && (
        <div className="px-3.5 py-1.5 rounded-full bg-[#1e0e2e]/90 border border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center space-x-2 backdrop-blur-md">
          <Zap className="w-4 h-4 text-purple-400 fill-purple-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-purple-200">
            2X XP: <span className="text-purple-300 font-extrabold">{formatTime(xpExpiry)}</span>
          </span>
        </div>
      )}

      {isCoinActive && (
        <div className="px-3.5 py-1.5 rounded-full bg-[#2b1f0b]/90 border border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center space-x-2 backdrop-blur-md">
          <Coins className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-amber-200">
            2X Coins: <span className="text-amber-300 font-extrabold">{formatTime(coinExpiry)}</span>
          </span>
        </div>
      )}
    </div>
  );
}
