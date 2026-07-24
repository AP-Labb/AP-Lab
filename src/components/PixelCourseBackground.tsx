"use client";

import { useProgress } from "@/context/ProgressContext";

export function PixelCourseBackground() {
  const { progress } = useProgress();
  const isLightMode = progress?.theme === "light";

  return (
    <div className={`fixed inset-0 pointer-events-none z-[1] overflow-hidden select-none transition-colors duration-300 ${isLightMode ? "bg-white" : "bg-[#03040a]"}`}>
      {/* High-Contrast Dot Matrix Grid Overlay (Crisp Black Dots on Pure White Background in Light Mode, White Dots in Dark Mode) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: isLightMode 
            ? "radial-gradient(circle, rgba(0, 0, 0, 0.45) 1.5px, transparent 1.5px)" 
            : "radial-gradient(circle, rgba(255, 255, 255, 0.35) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          opacity: isLightMode ? 0.85 : 0.4
        }}
      />
    </div>
  );
}
