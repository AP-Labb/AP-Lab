"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface StatItem {
  endValue: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  glowColor: string;
}

const STATS_DATA: StatItem[] = [
  {
    endValue: 1250,
    suffix: "+",
    label: "Active Scholars",
    glowColor: "rgba(0, 242, 255, 0.15)"
  },
  {
    endValue: 4.96,
    suffix: "/5 Stars",
    decimals: 2,
    label: "Rated by Users",
    glowColor: "rgba(16, 185, 129, 0.15)"
  },
  {
    endValue: 15,
    suffix: "k+",
    label: "Practice Questions",
    glowColor: "rgba(129, 140, 248, 0.15)"
  },
  {
    endValue: 100,
    suffix: "%",
    label: "Free & Open Access",
    glowColor: "rgba(245, 158, 11, 0.15)"
  }
];

function CountUpNumber({ endValue, duration = 2, decimals = 0, prefix = "", suffix = "" }: { endValue: number; duration?: number; decimals?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = easeProgress * endValue;
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, endValue, duration]);

  const formattedNumber = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return (
    <span ref={ref}>
      {prefix}{formattedNumber}{suffix}
    </span>
  );
}

function StatCard({ stat, idx }: { stat: StatItem; idx: number }) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
      }}
      className="relative liquid-glass border border-white/10 rounded-2xl py-5 px-6 backdrop-blur-xl shadow-xl hover:border-white/25 transition-all duration-300 group overflow-hidden flex flex-col justify-center items-center text-center"
    >
      {/* Diffused Large Flashlight Cursor Spotlight Effect */}
      <div 
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.14), transparent 75%)`
        }}
      />

      <div className="relative z-10 space-y-1">
        <div className="font-instrument text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          <CountUpNumber 
            endValue={stat.endValue} 
            decimals={stat.decimals || 0} 
            prefix={stat.prefix || ""} 
            suffix={stat.suffix} 
          />
        </div>
        <div className="text-[11px] font-manrope font-extrabold uppercase tracking-widest text-white/60">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  return (
    <section className="py-6 md:py-8 px-6 md:px-[120px] relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS_DATA.map((stat, idx) => (
            <StatCard key={idx} stat={stat} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
