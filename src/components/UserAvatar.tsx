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
  const hasTrafficCone = activeFrame === "gear-traffic-cone" || activeFrame === "traffic-cone";
  const hasEinsteinHair = activeFrame === "gear-einstein-hair" || activeFrame === "einstein-hair";
  const hasGoldenFrame = activeFrame === "gear-golden-frame" || activeFrame === "golden-frame";
  const hasGraduationCap = activeFrame === "gear-graduation-cap" || activeFrame === "graduation-cap";

  const initial = (name || "S").charAt(0).toUpperCase();

  return (
    <div className={cn("relative shrink-0 flex items-center justify-center select-none", sizeClasses, className)}>
      {/* 1. Golden Halo */}
      {hasGoldenHalo && (
        <img 
          src="/images/avatar-gear/golden-halo.png" 
          alt="Golden Halo" 
          className="absolute -top-[45%] left-1/2 -translate-x-1/2 w-[110%] h-[70%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 2. Devil Horns */}
      {hasDevilHorns && (
        <img 
          src="/images/avatar-gear/devil-horns.png" 
          alt="Devil Horns" 
          className="absolute -top-[42%] left-1/2 -translate-x-1/2 w-[115%] h-[80%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 3. Top Hat */}
      {hasTopHat && (
        <img 
          src="/images/avatar-gear/top-hat.png" 
          alt="Top Hat" 
          className="absolute -top-[50%] left-1/2 -translate-x-1/2 w-[115%] h-[95%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 4. Purple Beanie */}
      {hasPurpleBeanie && (
        <img 
          src="/images/avatar-gear/purple-beanie.png" 
          alt="Purple Beanie" 
          className="absolute -top-[46%] left-1/2 -translate-x-1/2 w-[125%] h-[105%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 5. Purple Party Hat */}
      {hasPartyHat && (
        <img 
          src="/images/avatar-gear/purple-party-hat.png" 
          alt="Party Hat" 
          className="absolute -top-[52%] left-1/2 -translate-x-1/2 w-[105%] h-[95%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 6. Golden Crown */}
      {hasCrown && (
        <img 
          src="/images/avatar-gear/golden-crown.png" 
          alt="Golden Crown" 
          className="absolute -top-[34%] left-1/2 -translate-x-1/2 w-[108%] h-[75%] object-contain z-20 pointer-events-none drop-shadow-sm" 
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
      </div>

      {/* 7. Neon Pink Cyber Visor */}
      {hasNeonVisor && (
        <img 
          src="/images/avatar-gear/neon-pink-visor.png" 
          alt="Neon Pink Visor" 
          className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[115%] h-[65%] object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* 8. Dark Cyber Visor */}
      {hasDarkVisor && (
        <img 
          src="/images/avatar-gear/dark-cyber-visor.png" 
          alt="Dark Cyber Visor" 
          className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[115%] h-[65%] object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* 9. Face Mask (Stretching completely from left edge to right edge across lower face) */}
      {hasFaceMask && (
        <img 
          src="/images/avatar-gear/face-mask.png" 
          alt="Face Mask" 
          className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[138%] h-[85%] max-w-none object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* 10. Astronaut Helmet (Moved up higher & enlarged so user avatar fits 100% inside visor window) */}
      {hasAstronautHelmet && (
        <img 
          src="/images/avatar-gear/astronaut-helmet.png" 
          alt="Astronaut Helmet" 
          className="absolute -top-[88%] left-1/2 -translate-x-1/2 w-[290%] h-[290%] max-w-none object-contain z-30 pointer-events-none drop-shadow-xl" 
        />
      )}

      {/* 11. Red Bowtie */}
      {hasRedBowtie && (
        <img 
          src="/images/avatar-gear/red-bowtie.png" 
          alt="Red Bowtie" 
          className="absolute -bottom-[22%] left-1/2 -translate-x-1/2 w-[90%] h-[55%] object-contain z-20 pointer-events-none drop-shadow-sm" 
        />
      )}

      {/* 12. Heart Necklace (Stretching from center left edge to center right edge) */}
      {hasHeartNecklace && (
        <img 
          src="/images/avatar-gear/heart-necklace.png" 
          alt="Heart Necklace" 
          className="absolute -bottom-[18%] left-1/2 -translate-x-1/2 w-[145%] h-[100%] max-w-none object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* 13. Gold Chain (Stretching from center left edge to center right edge) */}
      {hasGoldChain && (
        <img 
          src="/images/avatar-gear/gold-chain.png" 
          alt="Gold Chain" 
          className="absolute -bottom-[16%] left-1/2 -translate-x-1/2 w-[145%] h-[95%] max-w-none object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* 14. Traffic Cone Hat */}
      {hasTrafficCone && (
        <img 
          src="/images/avatar-gear/traffic-cone.png" 
          alt="Traffic Cone" 
          className="absolute -top-[55%] left-1/2 -translate-x-1/2 w-[115%] h-[110%] max-w-none object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* 15. Einstein Hair (Even bigger & positioned better over avatar head) */}
      {hasEinsteinHair && (
        <img 
          src="/images/avatar-gear/einstein-hair.png" 
          alt="Einstein Hair" 
          className="absolute -top-[60%] left-1/2 -translate-x-1/2 w-[180%] h-[140%] max-w-none object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* 16. Golden Frame (Larger 24k Gold Frame wrapping perfectly around avatar circle) */}
      {hasGoldenFrame && (
        <img 
          src="/images/avatar-gear/golden-frame.png" 
          alt="Golden Frame" 
          className="absolute -top-[48%] left-1/2 -translate-x-1/2 w-[196%] h-[196%] max-w-none object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}

      {/* 17. Graduation Cap */}
      {hasGraduationCap && (
        <img 
          src="/images/avatar-gear/graduation-cap.png" 
          alt="Graduation Cap" 
          className="absolute -top-[45%] left-1/2 -translate-x-1/2 w-[130%] h-[100%] max-w-none object-contain z-20 pointer-events-none drop-shadow-md" 
        />
      )}
    </div>
  );
}
