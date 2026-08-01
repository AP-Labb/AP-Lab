"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface UserDisplayNameProps {
  name: string;
  activeNameColor?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export function UserDisplayName({ name, activeNameColor, className, style }: UserDisplayNameProps) {
  const isRainbow = activeNameColor === "rainbow" || activeNameColor === "rainbow-shift" || activeNameColor === "grad-rainbow";

  if (isRainbow) {
    return (
      <span 
        className={cn("animate-rainbow-gradient font-extrabold inline-block", className)}
        style={style}
      >
        {name}
      </span>
    );
  }

  if (activeNameColor && (activeNameColor.startsWith("#") || activeNameColor.startsWith("rgb") || activeNameColor.startsWith("hsl"))) {
    return (
      <span 
        className={cn("font-extrabold inline-block", className)} 
        style={{ ...style, color: activeNameColor, backgroundImage: "none", WebkitTextFillColor: activeNameColor }}
      >
        {name}
      </span>
    );
  }

  return (
    <span className={className} style={style}>
      {name}
    </span>
  );
}
