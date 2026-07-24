"use client";

import { useProgress } from "@/context/ProgressContext";

export function PixelCourseBackground() {
  const { progress } = useProgress();
  const isLightMode = progress?.theme === "light";

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* High-Contrast Dot Matrix Grid Overlay */}
      <div 
        className="absolute -top-10 -bottom-20 left-0 right-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: isLightMode 
            ? "radial-gradient(circle, rgba(15, 23, 42, 0.35) 1.5px, transparent 1.5px)" 
            : "radial-gradient(circle, rgba(255, 255, 255, 0.45) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          opacity: isLightMode ? 0.65 : 0.5
        }}
      />
    </div>
  );
}
