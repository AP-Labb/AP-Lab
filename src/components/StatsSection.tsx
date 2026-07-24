"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Trophy, Target, BookOpen, Sparkles } from "lucide-react";

interface StatItem {
  icon: any;
  endValue: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  description: string;
  glowColor: string;
}

const STATS_DATA: StatItem[] = [
  {
    icon: Users,
    endValue: 1250,
    suffix: "+",
    label: "Active Scholars",
    description: "Registered high-achieving high school students across North America",
    glowColor: "#00f2ff"
  },
  {
    icon: Trophy,
    endValue: 98.4,
    suffix: "%",
    decimals: 1,
    label: "5-Score Pass Rate",
    description: "Students using AP® Lab modules scoring 4 or 5 on official exams",
    glowColor: "#10b981"
  },
  {
    icon: Target,
    endValue: 15,
    suffix: "k+",
    label: "Practice Questions",
    description: "College Board standard multiple-choice & FRQ practice drills",
    glowColor: "#818cf8"
  },
  {
    icon: BookOpen,
    endValue: 100,
    suffix: "%",
    label: "Free & Open Access",
    description: "Zero paywalls for comprehensive AP® curriculum study guides",
    glowColor: "#f59e0b"
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

export function StatsSection() {
  return (
    <section className="py-10 md:py-16 px-6 md:px-[120px] relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_DATA.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="liquid-glass border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl shadow-2xl hover:border-white/20 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
              >
                {/* Accent glow corner */}
                <div 
                  className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none"
                  style={{ backgroundColor: stat.glowColor }}
                />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: stat.glowColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <Sparkles className="w-4 h-4 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div>
                    <div className="font-instrument text-4xl md:text-5xl font-bold tracking-tight text-white">
                      <CountUpNumber 
                        endValue={stat.endValue} 
                        decimals={stat.decimals || 0} 
                        prefix={stat.prefix || ""} 
                        suffix={stat.suffix} 
                      />
                    </div>
                    <div className="text-xs font-manrope font-extrabold uppercase tracking-widest text-white/90 mt-2">
                      {stat.label}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/50 leading-relaxed font-inter mt-4 pt-4 border-t border-white/5 relative z-10">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
