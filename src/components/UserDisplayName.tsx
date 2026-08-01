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
  const colorStr = activeNameColor ? String(activeNameColor).trim() : "";
  const isRainbow = colorStr === "rainbow" || colorStr === "rainbow-shift" || colorStr === "grad-rainbow" || colorStr === "custom-name-color";

  if (isRainbow) {
    return (
      <span 
        className={cn("animate-rainbow-solid-shift font-extrabold inline-block", className)}
        style={style}
      >
        {name}
      </span>
    );
  }

  if (colorStr && (colorStr.startsWith("#") || colorStr.startsWith("rgb") || colorStr.startsWith("hsl"))) {
    return (
      <span 
        className={cn("font-extrabold inline-block", className)} 
        style={{ 
          ...style, 
          color: colorStr, 
          WebkitTextFillColor: colorStr, 
          backgroundImage: "none" 
        }}
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
