"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Beaker, 
  Dna, 
  Atom, 
  Calculator, 
  BarChart3, 
  Code, 
  Globe, 
  History, 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Leaf 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { useRouter } from "next/navigation";

const apClasses = [
  { name: "AP® Chemistry", icon: Beaker, hex: "#00f2ff", slug: "ap-chemistry" },
  { name: "AP® Biology", icon: Dna, hex: "#10b981", slug: "ap-biology" },
  { name: "AP® Physics 1", icon: Atom, hex: "#7b39fc", slug: "ap-physics-1", upcoming: true },
  { name: "AP® Calculus BC", icon: Calculator, hex: "#f59e0b", slug: "ap-calculus-bc" },
  { name: "AP® Statistics", icon: BarChart3, hex: "#ec4899", slug: "ap-statistics" },
  { name: "AP® Computer Science", icon: Code, hex: "#3b82f6", slug: "ap-computer-science-a" },
  { name: "AP® World History", icon: Globe, hex: "#f59e0b", slug: "ap-world-history", upcoming: true },
  { name: "AP® US History", icon: History, hex: "#ef4444", slug: "ap-us-history" },
  { name: "AP® Psychology", icon: Brain, hex: "#a855f7", slug: "ap-psychology" },
  { name: "AP® Lang", icon: BookOpen, hex: "#ec4899", slug: "ap-eng-lang" },
  { name: "AP® Macroeconomics", icon: TrendingUp, hex: "#10b981", slug: "ap-macroeconomics", upcoming: true },
  { name: "AP® Environmental", icon: Leaf, hex: "#10b981", slug: "ap-environmental-science", upcoming: true },
];

export function APClassesPills() {
  const { currentUser } = useAuth();
  const { openAuthModal } = useUI();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handlePillClick = (slug: string) => {
    router.push(`/dashboard/${slug}`);
  };

  return (
    <section className="py-12 md:py-20 px-6 md:px-[120px] relative z-10 overflow-visible bg-transparent">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[200px] bg-white/5 blur-[100px] rounded-full pointer-events-none z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-inter font-extrabold text-white text-3xl md:text-5xl tracking-tight mb-3"
          >
            Included Classes
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-inter text-white/50 text-sm md:text-base max-w-lg mx-auto leading-relaxed"
          >
            Specialized pre-med preparation tracks and accelerated AP courses.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 relative z-10">
          {apClasses.map((ap, index) => {
            const slug = ap.slug;
            const isHovered = hoveredIndex === index;
            return (
              <motion.button
                key={ap.name}
                onClick={() => handlePillClick(slug)}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.04,
                  ease: [0.23, 1, 0.32, 1]
                }}
                whileHover={{ 
                  scale: 1.04,
                  y: -3,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full cursor-pointer bg-[#181818]/90 border shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-all duration-150"
                style={{
                  borderColor: isHovered ? `${ap.hex}40` : "rgba(255, 255, 255, 0.06)",
                  boxShadow: isHovered 
                    ? `0 0 20px ${ap.hex}20, 0 4px 12px rgba(0, 0, 0, 0.35)` 
                    : "0 4px 12px rgba(0, 0, 0, 0.35)",
                  backgroundColor: isHovered ? "#222222" : "rgba(24, 24, 24, 0.9)"
                }}
              >
                {/* Icon Container */}
                <div 
                  className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/[0.04] transition-colors duration-300 z-10 relative shrink-0"
                  style={{
                    backgroundColor: isHovered ? `${ap.hex}15` : "rgba(255, 255, 255, 0.04)"
                  }}
                >
                  <ap.icon 
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-300" 
                    style={{
                      color: isHovered ? ap.hex : "rgba(255, 255, 255, 0.6)"
                    }}
                    strokeWidth={2.5} 
                  />
                </div>

                {/* Text */}
                <span className="font-inter font-bold text-[13px] sm:text-[14px] tracking-tight whitespace-nowrap text-white/80 group-hover:text-white transition-colors duration-300 z-10 relative">
                  {ap.name}
                </span>

                {/* Clean Modern Upcoming Timer Icon Tag matching uploaded image */}
                {ap.upcoming && (
                  <span className="flex items-center justify-center ml-0.5 shrink-0" title="Coming Soon">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-none stroke-white stroke-[2.2]" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="13" r="7.5" />
                      <path d="M12 9v4l2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 2h4" strokeLinecap="round" />
                      <path d="M18.5 5.5L20 4" strokeLinecap="round" />
                    </svg>
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
