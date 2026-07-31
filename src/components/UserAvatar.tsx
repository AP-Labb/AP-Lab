"use client";

import React from "react";
import { Glasses, Crown, HardHat, Shield, Sparkles } from "lucide-react";
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
  const hasHelmet = activeFrame === "gear-football" || activeFrame === "helmet";
  const isGoldFrame = activeFrame === "frame-gold";
  const isNeonFrame = activeFrame === "frame-neon" || activeFrame === "frame-cyber";
  const isEmeraldFrame = activeFrame === "frame-emerald";

  const initial = (name || "S").charAt(0).toUpperCase();

  return (
    <div className={cn("relative shrink-0 flex items-center justify-center select-none", sizeClasses, className)}>
      {/* Outer Border Frame if equipped */}
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
          <img src={photoURL} alt={name || "User"} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-black font-manrope font-extrabold flex items-center justify-center shadow-inner">
            {initial}
          </div>
        )}

        {/* Sunglasses SVG Overlay */}
        {hasSunglasses && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[0.5px]">
            <Glasses className="w-5 h-5 sm:w-6 sm:h-6 text-black fill-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>
        )}
      </div>

      {/* Crown Accessory SVG Overlay */}
      {hasCrown && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 drop-shadow-[0_2px_6px_rgba(245,158,11,0.9)]" />
        </div>
      )}

      {/* Helmet Accessory SVG Overlay */}
      {hasHelmet && (
        <div className="absolute -top-2 right-0 z-10">
          <HardHat className="w-4 h-4 text-red-500 fill-red-500 drop-shadow" />
        </div>
      )}
    </div>
  );
}
