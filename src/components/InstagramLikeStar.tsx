"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function InstagramLikeStar() {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className="flex-shrink-0 relative w-5 h-5 flex items-center justify-center">
      {/* Radiating burst lines */}
      {rays.map((angle, i) => (
        <motion.div
          key={angle}
          className="absolute rounded-full bg-amber-300 pointer-events-none"
          style={{
            width: "2px",
            height: "6px",
            top: "50%",
            left: "50%",
            transformOrigin: "center bottom",
          }}
          variants={{
            rest: {
              opacity: 0,
              scaleY: 0,
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-6px)`,
            },
            hover: {
              opacity: [0, 1, 0],
              scaleY: [0.2, 1.2, 0.4],
              transform: [
                `translate(-50%, -50%) rotate(${angle}deg) translateY(-6px)`,
                `translate(-50%, -50%) rotate(${angle}deg) translateY(-14px)`,
                `translate(-50%, -50%) rotate(${angle}deg) translateY(-18px)`,
              ],
            },
          }}
          transition={{
            duration: 0.5,
            delay: i * 0.02,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Main Star Icon with Instagram Press Down & Pop effect */}
      <motion.div
        className="flex items-center justify-center w-full h-full"
        variants={{
          rest: { scale: 1 },
          hover: {
            scale: [1, 0.75, 1.25, 1],
          },
        }}
        transition={{
          duration: 0.45,
          times: [0, 0.25, 0.65, 1],
          ease: "easeInOut",
        }}
      >
        <Star className="w-4 h-4 text-current transition-colors duration-200" />
      </motion.div>
    </div>
  );
}
