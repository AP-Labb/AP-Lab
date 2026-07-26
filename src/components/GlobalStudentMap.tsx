"use client";

import React from "react";
import { DottedMap, type Marker } from "@/components/ui/dotted-map";
import { motion } from "framer-motion";
import { Globe, Users, Flame } from "lucide-react";

type CountryMarker = Marker & {
  country: string;
  code: string;
  flag: string;
  students: string;
  labelXOffset?: number;
  labelYOffset?: number;
};

const countryMarkers: CountryMarker[] = [
  { lat: 37.0902, lng: -95.7129, country: "USA", code: "US", flag: "🇺🇸", students: "45,200+", size: 0.65, pulse: true, labelYOffset: -2.2 },
  { lat: 56.1304, lng: -106.3468, country: "Canada", code: "CA", flag: "🇨🇦", students: "12,800+", size: 0.55, pulse: true, labelYOffset: -2.0 },
  { lat: 23.6345, lng: -102.5528, country: "Mexico", code: "MX", flag: "🇲🇽", students: "8,400+", size: 0.5, pulse: true, labelYOffset: 2.2 },
  { lat: 20.5937, lng: 78.9629, country: "India", code: "IN", flag: "🇮🇳", students: "38,900+", size: 0.65, pulse: true, labelYOffset: -2.2 },
  { lat: 35.8617, lng: 104.1954, country: "China", code: "CN", flag: "🇨🇳", students: "29,100+", size: 0.6, pulse: true, labelYOffset: -2.2 },
  { lat: 55.3781, lng: -3.4360, country: "UK", code: "GB", flag: "🇬🇧", students: "14,300+", size: 0.5, pulse: true, labelYOffset: -2.0 },
  { lat: 51.1657, lng: 10.4515, country: "Germany", code: "DE", flag: "🇩🇪", students: "9,600+", size: 0.45, pulse: true, labelYOffset: -2.0 },
  { lat: 36.2048, lng: 138.2529, country: "Japan", code: "JP", flag: "🇯🇵", students: "11,500+", size: 0.5, pulse: true, labelYOffset: -2.0 },
  { lat: -25.2744, lng: 133.7751, country: "Australia", code: "AU", flag: "🇦🇺", students: "7,800+", size: 0.5, pulse: true, labelYOffset: 2.2 },
  { lat: -14.2350, lng: -51.9253, country: "Brazil", code: "BR", flag: "🇧🇷", students: "6,900+", size: 0.5, pulse: true, labelYOffset: 2.2 },
  { lat: 9.0820, lng: 8.6753, country: "Nigeria", code: "NG", flag: "🇳🇬", students: "5,400+", size: 0.45, pulse: true, labelYOffset: 2.2 },
  { lat: 36.5665, lng: 126.9780, country: "S. Korea", code: "KR", flag: "🇰🇷", students: "8,900+", size: 0.45, pulse: true, labelYOffset: 2.2 },
];

export function GlobalStudentMap() {
  return (
    <section className="relative w-full py-24 px-4 sm:px-6 md:px-12 bg-[#030408] overflow-hidden text-center z-20 border-t border-white/10">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        {/* Header Capsule */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono font-bold text-purple-300 uppercase tracking-widest mb-4 shadow-xl"
        >
          <Globe className="w-3.5 h-3.5 text-purple-400 animate-spin-slow" />
          <span>Global Learning Network</span>
        </motion.div>

        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-inter font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3"
        >
          Empowering AP Students Worldwide.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-inter text-neutral-400 text-sm sm:text-base max-w-2xl mb-12"
        >
          Over <span className="text-white font-bold">200,000+</span> students across USA, Canada, Mexico, India, China, UK, Japan, and 40+ countries use AP Lab to master their courses.
        </motion.p>

        {/* Interactive World Dotted Map Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full relative bg-[#070913]/90 border border-white/10 rounded-3xl p-4 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl overflow-hidden"
        >
          <div className="relative w-full aspect-[2/1] sm:aspect-[2.1/1] overflow-hidden flex items-center justify-center">
            <DottedMap<CountryMarker>
              width={160}
              height={80}
              dotColor="rgba(255, 255, 255, 0.22)"
              markerColor="#c084fc"
              dotRadius={0.25}
              pulse={true}
              markers={countryMarkers}
              className="w-full h-full text-white"
              renderMarkerOverlay={({ marker, x, y }) => {
                const yPos = y + (marker.labelYOffset ?? -2);
                return (
                  <g key={marker.code} className="select-none pointer-events-none">
                    {/* Glowing Flag Pill Label */}
                    <rect
                      x={x - 4.5}
                      y={yPos - 1.2}
                      width={9}
                      height={2.2}
                      rx={0.6}
                      fill="rgba(10, 12, 22, 0.85)"
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth={0.15}
                    />
                    <text
                      x={x}
                      y={yPos + 0.3}
                      fill="#ffffff"
                      fontSize={1.0}
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      {marker.flag} {marker.country}
                    </text>
                  </g>
                );
              }}
            />
          </div>

          {/* Quick Stats Footer Bar below map */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-white">45,000+</span>
              <span className="text-[11px] font-mono text-white/50 uppercase">🇺🇸 United States</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-white">38,900+</span>
              <span className="text-[11px] font-mono text-white/50 uppercase">🇮🇳 India</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-white">29,100+</span>
              <span className="text-[11px] font-mono text-white/50 uppercase">🇨🇳 China</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-white">20,000+</span>
              <span className="text-[11px] font-mono text-white/50 uppercase">🇨🇦 CA & 🇲🇽 MX</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
