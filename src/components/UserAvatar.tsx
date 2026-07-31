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
  const hasWizardHat = activeFrame === "gear-wizardhat";
  const isGoldFrame = activeFrame === "frame-gold";
  const isNeonFrame = activeFrame === "frame-neon" || activeFrame === "frame-cyber";

  const initial = (name || "S").charAt(0).toUpperCase();

  return (
    <div className={cn("relative shrink-0 flex items-center justify-center select-none", sizeClasses, className)}>
      {/* Outer Border Frame if equipped */}
      <div 
        className={cn(
          "w-full h-full rounded-full overflow-hidden flex items-center justify-center relative",
          isGoldFrame ? "border-2 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.7)]" :
          isNeonFrame ? "border-2 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.7)]" :
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

        {/* Sunglasses Overlay */}
        {hasSunglasses && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[0.5px]">
            <span className="text-xs sm:text-sm drop-shadow-md">🕶️</span>
          </div>
        )}
      </div>

      {/* Wizard Hat Badge Overlay */}
      {hasWizardHat && (
        <div className="absolute -top-2.5 -right-2 text-xs sm:text-base drop-shadow-md z-10">
          🧙‍♂️
        </div>
      )}
    </div>
  );
}
