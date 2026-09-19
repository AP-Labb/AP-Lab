"use client";

import { motion } from "framer-motion";
import { ScoreGallery } from "./ScoreGallery";

export function HowItWorks() {
  return (
    <section className="relative w-full py-[160px] px-6 md:px-[120px] bg-[#020202] border-t border-white/5">
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-deep-navy to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-deep-navy to-transparent pointer-events-none z-10" />
      <div className="max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-inter font-extrabold text-white text-3xl md:text-5xl tracking-tight mb-4"
          >
            Our Positive Results
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-inter text-white/50 text-sm md:text-base max-w-lg mx-auto leading-relaxed"
          >
            Tangible proof of the AP Lab methodology. Our students don&apos;t just study; they achieve absolute mastery through elite diagnostic protocols.
          </motion.p>
        </div>

        <ScoreGallery />

      </div>
    </section>
  );
}
