"use client";

import { useProgress } from "@/context/ProgressContext";

export function PixelCourseBackground() {
  const { progress } = useProgress();
  const isLightMode = progress?.theme === "light";

  return (
    <div className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-colors duration-300 ${isLightMode ? "bg-slate-50" : "bg-[#03040a]"}`}>
      {/* High-Contrast Dot Matrix Grid Overlay (Crisp Dark Dots in Light Mode, Reduced Opacity White Dots in Dark Mode) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          backgroundImage: isLightMode 
            ? "radial-gradient(circle, rgba(15, 23, 42, 0.45) 1.5px, transparent 1.5px)" 
            : "radial-gradient(circle, rgba(255, 255, 255, 0.35) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
          opacity: isLightMode ? 0.75 : 0.4
        }}
      />
    </div>
  );
}
