"use client";

import React from "react";

interface FeaturesPreviewSVGProps {
  id: string;
}

export function FeaturesPreviewSVG({ id }: FeaturesPreviewSVGProps) {
  switch (id) {
    case "guides":
      return (
        <svg className="w-full h-full text-blue-500" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#090a10" />
          {/* Dot matrix grid */}
          <pattern id="dot_grid_1" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.08" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_1)" />
          
          {/* World dot-matrix map style graphic */}
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.9">
            <line x1="40" y1="60" x2="160" y2="60" strokeDasharray="6 6" />
            <line x1="40" y1="80" x2="220" y2="80" strokeWidth="4" />
            <line x1="40" y1="100" x2="180" y2="100" strokeWidth="3" />
            <line x1="40" y1="120" x2="260" y2="120" strokeWidth="4" />
            <line x1="40" y1="140" x2="200" y2="140" strokeWidth="3" />
            <line x1="40" y1="160" x2="240" y2="160" strokeWidth="4" opacity="0.7" />
            <line x1="40" y1="180" x2="140" y2="180" strokeWidth="2" opacity="0.5" />

            <line x1="280" y1="100" x2="360" y2="100" strokeWidth="4" />
            <line x1="260" y1="120" x2="360" y2="120" strokeWidth="3" />
            <line x1="300" y1="140" x2="360" y2="140" strokeWidth="4" />
            <line x1="320" y1="160" x2="360" y2="160" strokeWidth="2" opacity="0.6" />
          </g>

          <circle cx="220" cy="120" r="5" fill="#3b82f6" className="animate-ping" />
          <circle cx="220" cy="120" r="4" fill="#60a5fa" />
        </svg>
      );

    case "ai":
      return (
        <svg className="w-full h-full text-blue-500" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#090a10" />
          <pattern id="dot_grid_2" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.08" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_2)" />

          {/* Twenty Code Terminal Box style */}
          <rect x="60" y="40" width="280" height="170" rx="12" fill="#0d0f18" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1.5" />
          
          <path d="M140 100L100 125L140 150" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M260 100L300 125L260 150" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="215" y1="95" x2="185" y2="155" stroke="#3b82f6" strokeWidth="7" strokeLinecap="round" />
        </svg>
      );

    case "calculator":
      return (
        <svg className="w-full h-full text-blue-500" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#090a10" />
          <pattern id="dot_grid_3" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_3)" />

          {/* Coordinate Axes */}
          <line x1="40" y1="125" x2="360" y2="125" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.5" />
          <line x1="200" y1="30" x2="200" y2="220" stroke="#ffffff" strokeOpacity="0.2" strokeWidth="1.5" />

          {/* Sine Wave Curve */}
          <path 
            d="M 40 125 Q 90 35, 140 125 T 240 125 T 340 125" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="4.5" 
            strokeLinecap="round"
          />
          <path 
            d="M 40 125 Q 90 195, 140 125 T 240 125 T 340 125" 
            fill="none" 
            stroke="#60a5fa" 
            strokeWidth="2.5" 
            strokeDasharray="4 4"
            opacity="0.7"
          />
        </svg>
      );

    case "exam":
      return (
        <svg className="w-full h-full text-blue-500" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#090a10" />
          <pattern id="dot_grid_4" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.08" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_4)" />

          {/* Question Grid Status Box */}
          <g transform="translate(60, 45)">
            {Array.from({ length: 15 }).map((_, i) => {
              const row = Math.floor(i / 5);
              const col = i % 5;
              const isChecked = i < 11;
              return (
                <rect 
                  key={i}
                  x={col * 56} 
                  y={row * 52} 
                  width="44" 
                  height="40" 
                  rx="8"
                  fill={isChecked ? "rgba(59, 130, 246, 0.15)" : "#11131f"}
                  stroke={isChecked ? "#3b82f6" : "rgba(255, 255, 255, 0.1)"}
                  strokeWidth="1.5"
                />
              );
            })}
          </g>
        </svg>
      );

    case "leaderboard":
      return (
        <svg className="w-full h-full text-blue-500" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#090a10" />
          <pattern id="dot_grid_5" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.08" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_5)" />

          {/* Podium / Leaderboard Bars */}
          <rect x="70" y="130" width="75" height="85" rx="6" fill="#131728" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.4" />
          <rect x="162" y="70" width="75" height="145" rx="6" fill="#1c233e" stroke="#3b82f6" strokeWidth="2" />
          <rect x="255" y="150" width="75" height="65" rx="6" fill="#131728" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.4" />

          <text x="107" y="175" fill="#ffffff" fillOpacity="0.6" fontSize="20" fontWeight="bold" textAnchor="middle">2</text>
          <text x="200" y="120" fill="#60a5fa" fontSize="28" fontWeight="extrabold" textAnchor="middle">1</text>
          <text x="292" y="190" fill="#ffffff" fillOpacity="0.6" fontSize="20" fontWeight="bold" textAnchor="middle">3</text>
        </svg>
      );

    case "video":
      return (
        <svg className="w-full h-full text-blue-500" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#090a10" />
          <pattern id="dot_grid_6" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.08" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_6)" />

          {/* Video Player Box */}
          <rect x="50" y="45" width="300" height="160" rx="10" fill="#0d0f18" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1.5" />
          <circle cx="200" cy="125" r="30" fill="#1d2640" stroke="#3b82f6" strokeWidth="2" />
          <path d="M192 110L216 125L192 140V110Z" fill="#3b82f6" />
        </svg>
      );

    default:
      return null;
  }
}
