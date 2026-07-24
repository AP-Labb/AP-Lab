"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

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

function SpotlightCard({ 
  children, 
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.07)"
}: { 
  children: React.ReactNode; 
  className?: string;
  spotlightColor?: string;
}) {
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
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: -1000, y: -1000 });
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Reduced size & intensity subtle spotlight */}
      <div 
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(260px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 80%)`
        }}
      />
      {children}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-8 md:py-12 px-6 md:px-[120px] relative z-20">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Top Hero Banner Stat Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <SpotlightCard 
            spotlightColor="rgba(255, 255, 255, 0.15)"
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white border border-white/20 shadow-[0_20px_50px_rgba(79,70,229,0.3)] transition-all duration-300 hover:scale-[1.005]"
          >
            {/* Background subtle dot pattern */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
                backgroundSize: "16px 16px"
              }}
            />

            <div className="relative z-20 space-y-2">
              <div className="font-inter font-black text-5xl sm:text-6xl md:text-7xl tracking-tight text-white drop-shadow-md">
                <CountUpNumber endValue={1250} suffix="+" />
              </div>
              <div className="text-sm md:text-base font-medium text-white/85 tracking-wide">
                Active AP® Scholars
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Bottom Row - 3 Dark Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Card 1 */}
          <SpotlightCard className="bg-[#0b0c10] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 text-center text-white hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div className="relative z-20 space-y-2">
              <div className="font-inter font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white">
                <CountUpNumber endValue={4.96} decimals={2} suffix="/5 Stars" />
              </div>
              <div className="text-xs md:text-sm font-medium text-white/50 tracking-wide">
                Rated by Users
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2 */}
          <SpotlightCard className="bg-[#0b0c10] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 text-center text-white hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div className="relative z-20 space-y-2">
              <div className="font-inter font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white">
                <CountUpNumber endValue={15} suffix="k+" />
              </div>
              <div className="text-xs md:text-sm font-medium text-white/50 tracking-wide">
                Practice Questions
              </div>
            </div>
          </SpotlightCard>

          {/* Card 3 */}
          <SpotlightCard className="bg-[#0b0c10] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 text-center text-white hover:border-white/20 transition-all duration-300 shadow-xl group">
            <div className="relative z-20 space-y-2">
              <div className="font-inter font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white">
                <CountUpNumber endValue={100} suffix="%" />
              </div>
              <div className="text-xs md:text-sm font-medium text-white/50 tracking-wide">
                Free & Open Access
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </section>
  );
}
