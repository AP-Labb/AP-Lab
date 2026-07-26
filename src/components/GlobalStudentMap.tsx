"use client";

import React from "react";
import { DottedMap, type Marker } from "@/components/ui/dotted-map";
import { motion } from "framer-motion";

type CountryMarker = Marker & {
  country: string;
  code: string;
  flag: string;
  students: string;
  labelYOffset?: number;
};

const countryMarkers: CountryMarker[] = [
  { lat: 37.0902, lng: -95.7129, country: "USA", code: "US", flag: "🇺🇸", students: "4,500+", size: 0.7, pulse: false, labelYOffset: -2.2 },
  { lat: 56.1304, lng: -106.3468, country: "Canada", code: "CA", flag: "🇨🇦", students: "1,200+", size: 0.6, pulse: false, labelYOffset: -2.0 },
  { lat: 23.6345, lng: -102.5528, country: "Mexico", code: "MX", flag: "🇲🇽", students: "800+", size: 0.55, pulse: false, labelYOffset: 2.2 },
  { lat: 20.5937, lng: 78.9629, country: "India", code: "IN", flag: "🇮🇳", students: "3,800+", size: 0.7, pulse: false, labelYOffset: -2.2 },
  { lat: 35.8617, lng: 104.1954, country: "China", code: "CN", flag: "🇨🇳", students: "2,900+", size: 0.65, pulse: false, labelYOffset: -2.2 },
  { lat: 55.3781, lng: -3.4360, country: "UK", code: "GB", flag: "🇬🇧", students: "1,400+", size: 0.55, pulse: false, labelYOffset: -2.0 },
  { lat: 51.1657, lng: 10.4515, country: "Germany", code: "DE", flag: "🇩🇪", students: "900+", size: 0.5, pulse: false, labelYOffset: -2.0 },
  { lat: 36.2048, lng: 138.2529, country: "Japan", code: "JP", flag: "🇯🇵", students: "1,100+", size: 0.55, pulse: false, labelYOffset: -2.0 },
  { lat: -25.2744, lng: 133.7751, country: "Australia", code: "AU", flag: "🇦🇺", students: "750+", size: 0.55, pulse: false, labelYOffset: 2.2 },
  { lat: -14.2350, lng: -51.9253, country: "Brazil", code: "BR", flag: "🇧🇷", students: "650+", size: 0.55, pulse: false, labelYOffset: 2.2 },
  { lat: 9.0820, lng: 8.6753, country: "Nigeria", code: "NG", flag: "🇳🇬", students: "500+", size: 0.5, pulse: false, labelYOffset: 2.2 },
  { lat: 36.5665, lng: 126.9780, country: "S. Korea", code: "KR", flag: "🇰🇷", students: "850+", size: 0.5, pulse: false, labelYOffset: 2.2 },
];

export function GlobalStudentMap() {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 md:px-12 bg-[#030408] overflow-hidden text-center z-20 border-t border-white/10">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center">
        {/* Heading */}
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="font-inter font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-3"
        >
          Empowering AP Students Worldwide.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-inter text-neutral-400 text-sm sm:text-base max-w-2xl mb-10"
        >
          Over <span className="text-white font-bold">10,000+</span> students across USA, Canada, Mexico, India, China, UK, Japan, and 40+ countries use AP Lab to master their courses.
        </motion.p>

        {/* World Dotted Map Container */}
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
              dotColor="rgba(255, 255, 255, 0.2)"
              markerColor="rgba(255, 255, 255, 0.9)"
              dotRadius={0.25}
              pulse={false}
              markers={countryMarkers}
              className="w-full h-full text-white"
              renderMarkerOverlay={({ marker, x, y }) => {
                const yPos = y + (marker.labelYOffset ?? -2);
                return (
                  <g key={marker.code} className="select-none pointer-events-none">
                    {/* Static Liquid Glass Tag */}
                    <rect
                      x={x - 4.5}
                      y={yPos - 1.2}
                      width={9}
                      height={2.2}
                      rx={0.7}
                      fill="rgba(15, 20, 32, 0.85)"
                      stroke="rgba(255, 255, 255, 0.35)"
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
        </motion.div>
      </div>
    </section>
  );
}
