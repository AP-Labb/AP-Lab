"use client";

import React from "react";
import { PixelCourseBackground } from "@/components/PixelCourseBackground";

interface CourseThemeBackgroundProps {
  themeId?: string;
  accentColor?: string;
}

export const PHOTO_THEME_URLS: Record<string, { name: string; url: string; desc: string }> = {
  "toronto-skyline": {
    name: "Toronto Night Skyline 4K",
    desc: "Vibrant CN Tower & waterfront reflections",
    url: "/images/toronto-skyline-night.png"
  },
  "nyc-skyline": {
    name: "New York City Skyline 4K",
    desc: "One World Trade Center & Manhattan night harbor",
    url: "/images/nyc-skyline-night.png"
  },
  "shanghai-night": {
    name: "Shanghai Waterfront 4K",
    desc: "Illuminated 4K Shanghai Pudong towers & river view",
    url: "https://images.unsplash.com/photo-1506158669146-619067262a00?q=80&w=2560&auto=format&fit=crop"
  },
  "tokyo-neon": {
    name: "Tokyo Tower & Neon City 4K",
    desc: "High-resolution Tokyo skyline illuminated at night",
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2560&auto=format&fit=crop"
  },
  "venice-sunset": {
    name: "Venice Grand Canal 4K",
    desc: "Serene sunset over historic Venice waterways",
    url: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=2560&auto=format&fit=crop"
  },
  "amalfi-coast": {
    name: "Amalfi Coast Nightline 4K",
    desc: "Clifftop Italian coastal village with warm evening glows",
    url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2560&auto=format&fit=crop"
  }
};

export function CourseThemeBackground({ themeId = "dark-matrix" }: CourseThemeBackgroundProps) {
  // 1. Default Dot Grid Matrix
  if (themeId === "dark-matrix" || !PHOTO_THEME_URLS[themeId]) {
    return <PixelCourseBackground />;
  }

  // 2. Crisp 4K Photography Backgrounds
  const photo = PHOTO_THEME_URLS[themeId];

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#03040a]">
      <img
        src={photo.url}
        alt={photo.name}
        className="w-full h-full object-cover opacity-40 filter contrast-105 brightness-90 transition-opacity duration-700"
      />
      {/* Dark Gradient Overlay for Crisp Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
    </div>
  );
}
