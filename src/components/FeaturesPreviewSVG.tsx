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
          <rect width="400" height="250" fill="#040508" />
          {/* Dot matrix grid */}
          <pattern id="dot_grid_1" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.06" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_1)" />
          
          {/* World dot-matrix map style graphic */}
          <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
            <line x1="40" y1="60" x2="160" y2="60" strokeDasharray="6 6" />
            <line x1="40" y1="80" x2="220" y2="80" strokeWidth="4" />
            <line x1="40" y1="100" x2="180" y2="100" strokeWidth="3" />
            <line x1="40" y1="120" x2="260" y2="120" strokeWidth="4" />
            <line x1="40" y1="140" x2="200" y2="140" strokeWidth="3" />
            <line x1="40" y1="160" x2="240" y2="160" strokeWidth="4" opacity="0.6" />
            <line x1="40" y1="180" x2="140" y2="180" strokeWidth="2" opacity="0.4" />

            <line x1="280" y1="100" x2="360" y2="100" strokeWidth="4" />
            <line x1="260" y1="120" x2="360" y2="120" strokeWidth="3" />
            <line x1="300" y1="140" x2="360" y2="140" strokeWidth="4" />
            <line x1="320" y1="160" x2="360" y2="160" strokeWidth="2" opacity="0.5" />
          </g>
        </svg>
      );

    case "ai":
      return (
        <svg className="w-full h-full text-purple-400" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#040508" />
          <pattern id="dot_grid_2" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.06" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_2)" />

          {/* AI Tutor Chat Workspace Frame */}
          <rect x="35" y="25" width="330" height="200" rx="12" fill="#090a12" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.5" />
          
          {/* Header bar */}
          <rect x="35" y="25" width="330" height="32" rx="12" fill="#0f111d" />
          <circle cx="55" cy="41" r="4" fill="#a855f7" />
          <text x="67" y="45" fill="#ffffff" fillOpacity="0.9" fontSize="11" fontWeight="bold" fontFamily="sans-serif">AP Lab AI Assistant</text>
          <rect x="300" y="34" width="50" height="14" rx="4" fill="#a855f7" fillOpacity="0.2" />
          <text x="325" y="44" fill="#c084fc" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">ONLINE</text>

          {/* User Question Bubble */}
          <rect x="170" y="72" width="180" height="34" rx="10" fill="#1e1b4b" stroke="#6366f1" strokeOpacity="0.4" strokeWidth="1" />
          <text x="182" y="93" fill="#e0e7ff" fontSize="10" fontFamily="sans-serif">Explain Light Reactions in AP Bio...</text>

          {/* AI Response Bubble */}
          <rect x="50" y="118" width="220" height="58" rx="10" fill="#13112c" stroke="#a855f7" strokeOpacity="0.4" strokeWidth="1" />
          <text x="64" y="138" fill="#c084fc" fontSize="10" fontWeight="bold" fontFamily="sans-serif">AI Tutor:</text>
          <text x="64" y="154" fill="#e9d5ff" fontSize="10" fontFamily="sans-serif">H₂O + NADP⁺ + ADP → O₂ + NADPH + ATP</text>

          {/* Input Box */}
          <rect x="50" y="186" width="300" height="28" rx="8" fill="#0d0e18" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
          <text x="62" y="204" fill="#ffffff" fillOpacity="0.35" fontSize="10" fontFamily="sans-serif">Ask AI Tutor anything...</text>
          <rect x="320" y="191" width="24" height="18" rx="5" fill="#a855f7" />
          <path d="M330 196L336 200L330 204" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "calculator":
      return (
        <svg className="w-full h-full text-blue-500" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#040508" />
          <pattern id="dot_grid_3" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_3)" />

          {/* Coordinate Axes */}
          <line x1="40" y1="125" x2="360" y2="125" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1.5" />
          <line x1="200" y1="30" x2="200" y2="220" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1.5" />

          {/* Sine Wave Curve */}
          <path 
            d="M 40 125 Q 90 35, 140 125 T 240 125 T 340 125" 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          <path 
            d="M 40 125 Q 90 195, 140 125 T 240 125 T 340 125" 
            fill="none" 
            stroke="#60a5fa" 
            strokeWidth="2" 
            strokeDasharray="4 4"
            opacity="0.6"
          />
        </svg>
      );

    case "exam":
      return (
        <svg className="w-full h-full text-blue-500" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#040508" />
          <pattern id="dot_grid_4" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.06" />
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
                  fill={isChecked ? "rgba(59, 130, 246, 0.12)" : "#0b0c14"}
                  stroke={isChecked ? "#3b82f6" : "rgba(255, 255, 255, 0.08)"}
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
          <rect width="400" height="250" fill="#040508" />
          <pattern id="dot_grid_5" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.06" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_5)" />

          {/* Podium / Leaderboard Bars */}
          <rect x="70" y="130" width="75" height="85" rx="6" fill="#0f1220" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.3" />
          <rect x="162" y="70" width="75" height="145" rx="6" fill="#161c32" stroke="#3b82f6" strokeWidth="2" />
          <rect x="255" y="150" width="75" height="65" rx="6" fill="#0f1220" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.3" />

          <text x="107" y="175" fill="#ffffff" fillOpacity="0.5" fontSize="20" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">2</text>
          <text x="200" y="120" fill="#60a5fa" fontSize="28" fontWeight="extrabold" textAnchor="middle" fontFamily="sans-serif">1</text>
          <text x="292" y="190" fill="#ffffff" fillOpacity="0.5" fontSize="20" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">3</text>
        </svg>
      );

    case "video":
      return (
        <svg className="w-full h-full text-blue-500" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="250" fill="#040508" />
          <pattern id="dot_grid_6" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#ffffff" fillOpacity="0.06" />
          </pattern>
          <rect width="400" height="250" fill="url(#dot_grid_6)" />

          {/* Video Player Box */}
          <rect x="50" y="45" width="300" height="160" rx="10" fill="#080a12" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1.5" />
          <circle cx="200" cy="125" r="30" fill="#141a2e" stroke="#3b82f6" strokeWidth="2" />
          <path d="M192 110L216 125L192 140V110Z" fill="#3b82f6" />
        </svg>
      );

    default:
      return null;
  }
}
