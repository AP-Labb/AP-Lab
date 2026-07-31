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

  const hasTopHat = activeFrame === "gear-top-hat";
  const hasPurpleBeanie = activeFrame === "gear-purple-beanie";
  const hasFaceMask = activeFrame === "gear-face-mask";
  const hasHeartNecklace = activeFrame === "gear-heart-necklace";
  const hasGoldChain = activeFrame === "gear-gold-chain";

  const initial = (name || "S").charAt(0).toUpperCase();

  return (
    <div className={cn("relative shrink-0 flex items-center justify-center select-none", sizeClasses, className)}>
      {/* Top Hat Wearable (Positioned above avatar head) */}
      {hasTopHat && (
        <img 
          src="/images/avatar-gear/top-hat.png" 
          alt="Top Hat" 
          className="absolute -top-[52%] left-1/2 -translate-x-1/2 w-[115%] h-[95%] object-contain z-20 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" 
        />
      )}

      {/* Purple Beanie Wearable (Positioned over avatar head) */}
      {hasPurpleBeanie && (
        <img 
          src="/images/avatar-gear/purple-beanie.png" 
          alt="Purple Beanie" 
          className="absolute -top-[42%] left-1/2 -translate-x-1/2 w-[110%] h-[90%] object-contain z-20 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" 
        />
      )}

      {/* Base Avatar Circle Container */}
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative border border-white/20 z-0">
        {photoURL ? (
          <img src={photoURL} alt={name || "User"} className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-black font-manrope font-extrabold flex items-center justify-center shadow-inner">
            {initial}
          </div>
        )}

        {/* Face Mask Wearable (Positioned over lower face/mouth) */}
        {hasFaceMask && (
          <img 
            src="/images/avatar-gear/face-mask.png" 
            alt="Face Mask" 
            className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[85%] h-[60%] object-contain z-10 pointer-events-none drop-shadow-md" 
          />
        )}
      </div>

      {/* Heart Necklace (Hanging below avatar) */}
      {hasHeartNecklace && (
        <img 
          src="/images/avatar-gear/heart-necklace.png" 
          alt="Heart Necklace" 
          className="absolute -bottom-[40%] left-1/2 -translate-x-1/2 w-[95%] h-[85%] object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* Gold Chain (Hanging below avatar) */}
      {hasGoldChain && (
        <img 
          src="/images/avatar-gear/gold-chain.png" 
          alt="Gold Chain" 
          className="absolute -bottom-[32%] left-1/2 -translate-x-1/2 w-[95%] h-[75%] object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}
    </div>
  );
}
