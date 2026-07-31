"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  photoURL?: string | null;
  name?: string | null;
  activeFrame?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export function UserAvatar({ photoURL, name = "Scholar", activeFrame, size = "md", className }: UserAvatarProps) {
  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-xl",
    xl: "w-20 h-20 text-3xl",
    "2xl": "w-28 h-28 text-4xl",
  }[size];

  const hasTopHat = activeFrame === "gear-top-hat";
  const hasPurpleBeanie = activeFrame === "gear-purple-beanie";
  const hasPartyHat = activeFrame === "gear-purple-party-hat" || activeFrame === "gear-party-hat" || activeFrame === "party-hat";
  const hasCrown = activeFrame === "gear-golden-crown" || activeFrame === "gear-crown" || activeFrame === "crown";
  const hasNeonVisor = activeFrame === "gear-neon-pink-visor";
  const hasDarkVisor = activeFrame === "gear-dark-cyber-visor" || activeFrame === "gear-sunglasses" || activeFrame === "sunglasses";
  const hasFaceMask = activeFrame === "gear-face-mask";
  const hasHeartNecklace = activeFrame === "gear-heart-necklace";
  const hasGoldChain = activeFrame === "gear-gold-chain";
  const hasDevilHorns = activeFrame === "gear-devil-horns";
  const hasRedBowtie = activeFrame === "gear-red-bowtie";
  const hasGoldenHalo = activeFrame === "gear-golden-halo";
  const hasAstronautHelmet = activeFrame === "gear-astronaut-helmet" || activeFrame === "gear-helmet" || activeFrame === "helmet";

  const initial = (name || "S").charAt(0).toUpperCase();

  return (
    <div className={cn("relative shrink-0 flex items-center justify-center select-none", sizeClasses, className)}>
      {/* 1. Golden Halo */}
      {hasGoldenHalo && (
        <img 
          src="/images/avatar-gear/golden-halo.png" 
          alt="Golden Halo" 
          className="absolute -top-[42%] left-1/2 -translate-x-1/2 w-[100%] h-[65%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 2. Devil Horns */}
      {hasDevilHorns && (
        <img 
          src="/images/avatar-gear/devil-horns.png" 
          alt="Devil Horns" 
          className="absolute -top-[40%] left-1/2 -translate-x-1/2 w-[105%] h-[75%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 3. Top Hat */}
      {hasTopHat && (
        <img 
          src="/images/avatar-gear/top-hat.png" 
          alt="Top Hat" 
          className="absolute -top-[48%] left-1/2 -translate-x-1/2 w-[105%] h-[90%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 4. Purple Beanie */}
      {hasPurpleBeanie && (
        <img 
          src="/images/avatar-gear/purple-beanie.png" 
          alt="Purple Beanie" 
          className="absolute -top-[44%] left-1/2 -translate-x-1/2 w-[115%] h-[98%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 5. Purple Party Hat */}
      {hasPartyHat && (
        <img 
          src="/images/avatar-gear/purple-party-hat.png" 
          alt="Party Hat" 
          className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[98%] h-[90%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 6. Golden Crown */}
      {hasCrown && (
        <img 
          src="/images/avatar-gear/golden-crown.png" 
          alt="Golden Crown" 
          className="absolute -top-[32%] left-1/2 -translate-x-1/2 w-[98%] h-[70%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* Base Avatar Circle Container */}
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative border border-white/20 z-0 bg-neutral-900">
        {photoURL ? (
          <img src={photoURL} alt={name || "User"} className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-black font-manrope font-extrabold flex items-center justify-center shadow-inner">
            {initial}
          </div>
        )}

        {/* 7. Neon Pink Cyber Visor */}
        {hasNeonVisor && (
          <img 
            src="/images/avatar-gear/neon-pink-visor.png" 
            alt="Neon Pink Visor" 
            className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[100%] h-[58%] object-contain z-10 pointer-events-none drop-shadow-sm" 
          />
        )}

        {/* 8. Dark Cyber Visor */}
        {hasDarkVisor && (
          <img 
            src="/images/avatar-gear/dark-cyber-visor.png" 
            alt="Dark Cyber Visor" 
            className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[100%] h-[58%] object-contain z-10 pointer-events-none drop-shadow-sm" 
          />
        )}

        {/* 9. Face Mask (Fits from left-center to right-center of avatar circle) */}
        {hasFaceMask && (
          <img 
            src="/images/avatar-gear/face-mask.png" 
            alt="Face Mask" 
            className="absolute top-[34%] left-1/2 -translate-x-1/2 w-[88%] h-[55%] object-contain z-10 pointer-events-none drop-shadow-sm" 
          />
        )}
      </div>

      {/* 10. Astronaut Helmet */}
      {hasAstronautHelmet && (
        <img 
          src="/images/avatar-gear/astronaut-helmet.png" 
          alt="Astronaut Helmet" 
          className="absolute -top-[24%] left-1/2 -translate-x-1/2 w-[148%] h-[148%] object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* 11. Red Bowtie */}
      {hasRedBowtie && (
        <img 
          src="/images/avatar-gear/red-bowtie.png" 
          alt="Red Bowtie" 
          className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[75%] h-[45%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 12. Heart Necklace (Fits from left-center to right-center of avatar circle) */}
      {hasHeartNecklace && (
        <img 
          src="/images/avatar-gear/heart-necklace.png" 
          alt="Heart Necklace" 
          className="absolute -bottom-[6%] left-1/2 -translate-x-1/2 w-[98%] h-[68%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 13. Gold Chain (Fits from left-center to right-center of avatar circle) */}
      {hasGoldChain && (
        <img 
          src="/images/avatar-gear/gold-chain.png" 
          alt="Gold Chain" 
          className="absolute -bottom-[4%] left-1/2 -translate-x-1/2 w-[98%] h-[60%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}
    </div>
  );
}
