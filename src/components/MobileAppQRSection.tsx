"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function MobileAppQRSection() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <section className="relative w-full py-16 px-6 bg-deep-navy z-20 font-manrope">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-[#0d0e15] border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-2xl text-center space-y-5 overflow-hidden group"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-teal-500/5 pointer-events-none" />

          {/* Info Icon with "Coming soon!" Hover Tooltip */}
          <div className="absolute top-5 right-5 z-30">
            <div
              className="relative cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors">
                <Info className="w-4 h-4" />
              </div>

              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 5 }}
                    className="absolute right-0 top-9 bg-[#1a1b26] border border-white/20 text-white font-manrope font-bold text-[11px] px-3 py-1.5 rounded-xl shadow-2xl whitespace-nowrap z-50 pointer-events-none"
                  >
                    Coming soon!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1.5 pt-1">
            <h3 className="font-manrope font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              For Mobile
            </h3>
            <p className="font-inter text-white/50 text-sm tracking-wide">
              Scan the QR code below
            </p>
          </div>

          {/* QR Code Container Box */}
          <div className="bg-[#151620] border border-white/10 rounded-2xl p-4 sm:p-5 flex items-center justify-center max-w-[240px] mx-auto shadow-inner relative">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 overflow-hidden rounded-xl">
              <Image
                src="/images/qr-code.png"
                alt="AP Lab Mobile App QR Code"
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
