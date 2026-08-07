"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, Sparkles, Coins } from "lucide-react";

export interface RewardEventData {
  id: string;
  type: "reward" | "deduction";
  xp?: number;
  coins?: number;
  title?: string;
}

// Global Event Dispatchers
export function triggerRewardAnimation(data: Omit<RewardEventData, "id">) {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("ap-lab-reward-event", {
      detail: { ...data, id: `reward-${Date.now()}` },
    });
    window.dispatchEvent(event);
  }
}

export function RewardNotificationOverlay() {
  const [activeEvent, setActiveEvent] = useState<RewardEventData | null>(null);
  const [flyingParticles, setFlyingParticles] = useState<{ id: number; icon: string; delay: number }[]>([]);

  useEffect(() => {
    const handleRewardEvent = (e: CustomEvent<RewardEventData>) => {
      const data = e.detail;
      setActiveEvent(data);

      if (data.type === "reward") {
        // Generate 6 flying particles for XP / Coins
        const particles = Array.from({ length: 6 }).map((_, i) => ({
          id: i,
          icon: i % 2 === 0 ? "/images/coin-gold.png" : "/images/star-icon.png",
          delay: i * 0.08,
        }));
        setFlyingParticles(particles);
      } else {
        setFlyingParticles([]);
      }

      // Auto dismiss after 2.6 seconds
      setTimeout(() => {
        setActiveEvent(null);
        setFlyingParticles([]);
      }, 2600);
    };

    window.addEventListener("ap-lab-reward-event" as any, handleRewardEvent as any);
    return () => {
      window.removeEventListener("ap-lab-reward-event" as any, handleRewardEvent as any);
    };
  }, []);

  return (
    <>
      {/* Center of Screen Animated Card */}
      <AnimatePresence>
        {activeEvent && (
          <div className="fixed inset-0 z-[9999999] pointer-events-none flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className={`relative bg-[#090a14]/95 backdrop-blur-2xl border-2 rounded-[32px] p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-3 shadow-2xl min-w-[280px] sm:min-w-[320px] ${
                activeEvent.type === "reward"
                  ? "border-emerald-500/60 shadow-[0_0_70px_rgba(16,185,129,0.35)]"
                  : "border-red-500/60 shadow-[0_0_70px_rgba(239,68,68,0.35)]"
              }`}
            >
              {/* Icon Circle */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                  activeEvent.type === "reward"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-red-500/20 text-red-400 border border-red-500/40"
                }`}
              >
                {activeEvent.type === "reward" ? (
                  <ArrowUp className="w-9 h-9 stroke-[3]" />
                ) : (
                  <ArrowDown className="w-9 h-9 stroke-[3]" />
                )}
              </div>

              {/* Title & Numbers */}
              <div className="space-y-1">
                <h3 className="font-manrope font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {activeEvent.type === "reward" ? (
                    <span className="text-emerald-400">
                      {activeEvent.xp ? `+${activeEvent.xp} XP` : ""}{" "}
                      {activeEvent.coins ? `+${activeEvent.coins} Coins` : ""}
                    </span>
                  ) : (
                    <span className="text-red-400">
                      -{activeEvent.coins || 0} Coins
                    </span>
                  )}
                </h3>
                <p className="text-xs font-manrope font-bold text-white/60">
                  {activeEvent.title ||
                    (activeEvent.type === "reward"
                      ? "Reward Claimed!"
                      : "Deduction from Shop Purchase")}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Smooth Flying Particles towards top right corner */}
      <AnimatePresence>
        {activeEvent && activeEvent.type === "reward" && flyingParticles.length > 0 && (
          <div className="fixed inset-0 z-[9999998] pointer-events-none overflow-hidden">
            {flyingParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  x: typeof window !== "undefined" ? window.innerWidth / 2 - 20 : 0,
                  y: typeof window !== "undefined" ? window.innerHeight / 2 - 20 : 0,
                  scale: 1,
                  opacity: 1,
                }}
                animate={{
                  x: typeof window !== "undefined" ? window.innerWidth - 120 : 800,
                  y: 28,
                  scale: 0.4,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.85,
                  delay: p.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="fixed top-0 left-0 w-10 h-10 z-[9999998] pointer-events-none flex items-center justify-center"
              >
                <img src={p.icon} alt="Particle" className="w-8 h-8 object-contain drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
