"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

function Digit({ digit }: { digit: string }) {
  const isNumber = !isNaN(Number(digit));
  
  if (!isNumber) {
    return <span className="inline-block text-emerald-400 font-mono text-base md:text-lg">{digit}</span>;
  }

  const num = Number(digit);

  return (
    <div className="relative inline-block h-6 overflow-hidden w-[11px] text-base md:text-lg font-mono text-emerald-400">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -num * 24 }} // 24px per digit height
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="flex flex-col absolute left-0 top-0 w-full"
        style={{ height: 240 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div key={n} className="h-6 flex items-center justify-center select-none">
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function LiveUserCounter() {
  const [count, setCount] = useState(() => Math.floor(Math.random() * 63) + 24);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      setCount((prev) => {
        const sign = Math.random() > 0.45 ? 1 : -1;
        const amount = Math.floor(Math.random() * 9) + 1; // 1 to 9
        const change = sign * amount;
        return Math.max(10, Math.min(100, prev + change));
      });

      // Random delay between 5000ms (5s) and 15000ms (15s)
      const nextDelay = Math.floor(Math.random() * 10000) + 5000;
      timeoutId = setTimeout(tick, nextDelay);
    };

    const initialDelay = Math.floor(Math.random() * 10000) + 5000;
    timeoutId = setTimeout(tick, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  const digits = count.toLocaleString().split("");

  return (
    <div ref={containerRef} className="flex items-center space-x-2.5 bg-emerald-950/40 backdrop-blur-md border border-emerald-500/30 rounded-full px-4 py-1.5 shadow-[0_0_20px_rgba(16,185,129,0.1)] mb-8">
      <div className="relative flex items-center justify-center mr-1">
        {isInView && (
          <motion.div
            animate={{ scale: [1, 2.3], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-2 h-2 bg-emerald-400 rounded-full"
          />
        )}
        <div className="w-2 h-2 bg-emerald-400 rounded-full z-10 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </div>
      
      <div className="flex items-center">
        {digits.map((char, index) => (
          <Digit key={`${index}-${char}`} digit={char} />
        ))}
      </div>
      
      <span className="text-emerald-100/80 font-sans text-xs font-semibold tracking-wide">users active live</span>
    </div>
  );
}
