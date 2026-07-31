"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  photoURL?: string | null;
  name?: string | null;
  activeFrame?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function UserAvatar({ photoURL, name = "Scholar", activeFrame, size = "md", className }: UserAvatarProps) {
  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-xl",
    xl: "w-20 h-20 text-3xl",
  }[size];

  const hasSunglasses = activeFrame === "gear-sunglasses";
  const hasCrown = activeFrame === "gear-crown" || activeFrame === "crown";
  const hasHelmet = activeFrame === "gear-helmet" || activeFrame === "gear-football" || activeFrame === "helmet";
  const hasPartyHat = activeFrame === "gear-party-hat" || activeFrame === "party-hat";
  const isGoldFrame = activeFrame === "frame-gold";
  const isNeonFrame = activeFrame === "frame-neon" || activeFrame === "frame-cyber";
  const isEmeraldFrame = activeFrame === "frame-emerald";

  const initial = (name || "S").charAt(0).toUpperCase();

  return (
    <div className={cn("relative shrink-0 flex items-center justify-center select-none", sizeClasses, className)}>
      {/* Outer Border Frame */}
      <div 
        className={cn(
          "w-full h-full rounded-full overflow-hidden flex items-center justify-center relative transition-all",
          isGoldFrame ? "border-2 border-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.85)]" :
          isNeonFrame ? "border-2 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.85)]" :
          isEmeraldFrame ? "border-2 border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.85)]" :
          "border border-white/20"
        )}
      >
        {photoURL ? (
          <img src={photoURL} alt={name || "User"} className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-black font-manrope font-extrabold flex items-center justify-center shadow-inner">
            {initial}
          </div>
        )}

        {/* 1. Sunglasses Wearable (Exact matching Shop preview) */}
        {hasSunglasses && (
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-3/4 flex items-center justify-between z-10 pointer-events-none drop-shadow-md">
            <div className="w-[42%] h-3 bg-black rounded-sm border border-neutral-700" />
            <div className="w-[16%] h-0.5 bg-black" />
            <div className="w-[42%] h-3 bg-black rounded-sm border border-neutral-700" />
          </div>
        )}
      </div>

      {/* 2. Golden Crown (Exact matching Shop preview) */}
      {hasCrown && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-[85%] h-4 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 border border-yellow-600 rounded-t-md z-10 pointer-events-none drop-shadow-lg flex justify-between items-end px-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 border border-yellow-700 -mt-1" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 border border-yellow-700 -mt-1.5" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 border border-yellow-700 -mt-1" />
        </div>
      )}

      {/* 3. Football Helmet (Exact matching Shop preview) */}
      {hasHelmet && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[105%] h-7 bg-gradient-to-b from-red-500 to-red-700 rounded-t-full border border-red-900 z-10 pointer-events-none flex flex-col items-center justify-between p-0.5 drop-shadow-lg overflow-hidden">
          <div className="w-full h-0.5 bg-white rounded-full opacity-90" />
          <div className="w-full h-3 bg-neutral-950/90 rounded-b-md border-t border-red-900 flex justify-around items-center px-0.5">
            <div className="w-0.5 h-1.5 bg-neutral-300" />
            <div className="w-0.5 h-1.5 bg-neutral-300" />
            <div className="w-0.5 h-1.5 bg-neutral-300" />
          </div>
        </div>
      )}

      {/* 4. Party Cone Hat (Exact matching Shop preview) */}
      {hasPartyHat && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none drop-shadow-md flex flex-col items-center">
          <div className="w-2 h-2 rounded-full bg-rose-500 shadow-md" />
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[22px] border-b-amber-400" />
        </div>
      )}
    </div>
  );
}
