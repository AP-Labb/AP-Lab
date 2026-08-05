"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StreakFlameIconProps {
  streakCount?: number;
  className?: string;
  sizeClassName?: string;
}

export function getStreakFlameSrc(streakCount: number = 0): string {
  if (streakCount < 2) {
    return "/images/streak-zero.png"; // Dotted White (0 or 1 day: requires 2 consecutive days to start streak!)
  }
  if (streakCount < 7) {
    return "/images/streak-orange.png"; // Normal Orange (2-6 days)
  }
  if (streakCount < 14) {
    return "/images/streak-bronze.png"; // Bronze (7-13 days)
  }
  if (streakCount < 30) {
    return "/images/streak-silver.png"; // Silver (14-29 days)
  }
  if (streakCount < 100) {
    return "/images/streak-gold.png"; // Gold (30-99 days)
  }
  return "/images/streak-diamond.png"; // Diamond (100+ days)
}

export function getStreakTierName(streakCount: number = 0): string {
  if (streakCount < 2) return "No Streak (Log in 2 days in a row)";
  if (streakCount < 7) return "Active Streak";
  if (streakCount < 14) return "Bronze Streak";
  if (streakCount < 30) return "Silver Streak";
  if (streakCount < 100) return "Gold Streak";
  return "Diamond Streak";
}

export function StreakFlameIcon({
  streakCount = 0,
  className,
  sizeClassName = "w-7 h-7",
}: StreakFlameIconProps) {
  const imageSrc = getStreakFlameSrc(streakCount);

  return (
    <img
      src={imageSrc}
      alt={`${streakCount} Day Streak`}
      className={cn(
        "object-contain inline-block shrink-0 transition-transform duration-300 hover:scale-110",
        sizeClassName,
        className
      )}
    />
  );
}
