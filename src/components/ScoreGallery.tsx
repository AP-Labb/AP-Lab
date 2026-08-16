"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";

const scores = [
  {
    subject: "AP Chemistry",
    image: "/images/media__1779045527637.png",
    student: "Alex R.",
    date: "May 2025",
    panda: "/images/pandas/panda-paw-chin.png",
    pandaHeight: "h-24 sm:h-28 md:h-32"
  },
  {
    subject: "AP Biology",
    image: "/images/media__1779045527619.png",
    student: "Sarah M.",
    date: "May 2025",
    panda: "/images/pandas/panda-neutral.png",
    pandaHeight: "h-18 sm:h-20 md:h-24" // Smaller center panda so it doesn't cover text
  },
  {
    subject: "AP Calculus AB",
    image: "/images/media__1779046231399.png",
    student: "David K.",
    date: "May 2025",
    panda: "/images/pandas/panda-leaning.png",
    pandaHeight: "h-24 sm:h-28 md:h-32"
  }
];

export function ScoreGallery() {
  return (
    <div className="w-full mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-7xl mx-auto px-6">
        {scores.map((score, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: idx * 0.1 }}
            className="group relative pt-20 md:pt-24"
          >
            {/* Card Container */}
            <div className="relative aspect-[4/5] rounded-[32px] border border-white/5 bg-white/[0.02] transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.04]">
              
              {/* Panda Mascot sitting perfectly on the top center border of the card */}
              <div className="absolute -top-12 sm:-top-14 md:-top-16 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex items-end justify-center transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.7)]">
                <Image 
                  src={score.panda}
                  alt={`${score.subject} Panda Mascot`}
                  width={180}
                  height={180}
                  className={cn("w-auto object-contain", score.pandaHeight)}
                  priority
                  unoptimized
                />
              </div>

              {/* Glass Overlay */}
              <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none z-10">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-purple/10 to-medical-teal/10 opacity-40 group-hover:opacity-60 transition-opacity" />
              </div>
              
              {/* Image Container with Liquid-like feel */}
              <div className="absolute inset-4 rounded-[20px] overflow-hidden shadow-2xl z-20 bg-black flex items-center justify-center">
                <div className="w-full h-full relative transform transition-transform duration-700 opacity-90 group-hover:opacity-100 group-hover:scale-[1.02]">
                  <Image 
                    src={score.image}
                    alt={`${score.subject} Score Report`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute top-8 right-8 z-30 pointer-events-none">
                <motion.div 
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="drop-shadow-[0_4px_12px_rgba(29,155,240,0.5)] relative"
                >
                  <BadgeCheck className="w-10 h-10 text-[#1D9BF0]" fill="currentColor" stroke="white" strokeWidth={1.5} />
                </motion.div>
              </div>
            </div>

            {/* Label */}
            <div className="mt-6 space-y-1 text-center md:text-left">
              <h4 className="font-instrument text-2xl text-white drop-shadow-sm">{score.subject}</h4>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{score.student}</span>
                <div className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{score.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


