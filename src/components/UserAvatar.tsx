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
    "2xl": "w-32 h-32 text-5xl",
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
          className="absolute -top-[48%] left-1/2 -translate-x-1/2 w-[110%] h-[70%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 2. Devil Horns */}
      {hasDevilHorns && (
        <img 
          src="/images/avatar-gear/devil-horns.png" 
          alt="Devil Horns" 
          className="absolute -top-[45%] left-1/2 -translate-x-1/2 w-[115%] h-[80%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 3. Top Hat */}
      {hasTopHat && (
        <img 
          src="/images/avatar-gear/top-hat.png" 
          alt="Top Hat" 
          className="absolute -top-[52%] left-1/2 -translate-x-1/2 w-[115%] h-[95%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 4. Purple Beanie (Larger & Better Positioned) */}
      {hasPurpleBeanie && (
        <img 
          src="/images/avatar-gear/purple-beanie.png" 
          alt="Purple Beanie" 
          className="absolute -top-[48%] left-1/2 -translate-x-1/2 w-[125%] h-[105%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 5. Purple Party Hat */}
      {hasPartyHat && (
        <img 
          src="/images/avatar-gear/purple-party-hat.png" 
          alt="Party Hat" 
          className="absolute -top-[55%] left-1/2 -translate-x-1/2 w-[105%] h-[95%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 6. Golden Crown */}
      {hasCrown && (
        <img 
          src="/images/avatar-gear/golden-crown.png" 
          alt="Golden Crown" 
          className="absolute -top-[36%] left-1/2 -translate-x-1/2 w-[105%] h-[75%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* Base Avatar Circle Container (No Glowing Border, Clean Subtle Border) */}
      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative border border-white/20 z-0 bg-neutral-900">
        {photoURL ? (
          <img src={photoURL} alt={name || "User"} className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-black font-manrope font-extrabold flex items-center justify-center shadow-inner">
            {initial}
          </div>
        )}

        {/* 7. Neon Pink Cyber Visor (Larger & Fits Eyes Perfectly) */}
        {hasNeonVisor && (
          <img 
            src="/images/avatar-gear/neon-pink-visor.png" 
            alt="Neon Pink Visor" 
            className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[105%] h-[60%] object-contain z-10 pointer-events-none drop-shadow-sm" 
          />
        )}

        {/* 8. Dark Cyber Visor (Larger & Fits Eyes Perfectly) */}
        {hasDarkVisor && (
          <img 
            src="/images/avatar-gear/dark-cyber-visor.png" 
            alt="Dark Cyber Visor" 
            className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[105%] h-[60%] object-contain z-10 pointer-events-none drop-shadow-sm" 
          />
        )}

        {/* 9. Face Mask (Bigger & Positioned Over Lower Face) */}
        {hasFaceMask && (
          <img 
            src="/images/avatar-gear/face-mask.png" 
            alt="Face Mask" 
            className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[95%] h-[65%] object-contain z-10 pointer-events-none drop-shadow-sm" 
          />
        )}
      </div>

      {/* 10. Astronaut Helmet (Fits Over Whole Head) */}
      {hasAstronautHelmet && (
        <img 
          src="/images/avatar-gear/astronaut-helmet.png" 
          alt="Astronaut Helmet" 
          className="absolute -top-[18%] left-1/2 -translate-x-1/2 w-[135%] h-[135%] object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* 11. Red Bowtie */}
      {hasRedBowtie && (
        <img 
          src="/images/avatar-gear/red-bowtie.png" 
          alt="Red Bowtie" 
          className="absolute -bottom-[22%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 12. Heart Necklace (Connects to both sides of neck) */}
      {hasHeartNecklace && (
        <img 
          src="/images/avatar-gear/heart-necklace.png" 
          alt="Heart Necklace" 
          className="absolute -bottom-[32%] left-1/2 -translate-x-1/2 w-[110%] h-[90%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 13. Gold Chain (Connects to both sides of neck) */}
      {hasGoldChain && (
        <img 
          src="/images/avatar-gear/gold-chain.png" 
          alt="Gold Chain" 
          className="absolute -bottom-[26%] left-1/2 -translate-x-1/2 w-[110%] h-[80%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}
    </div>
  );
}
