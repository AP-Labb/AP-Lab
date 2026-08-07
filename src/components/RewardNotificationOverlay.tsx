"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface RewardEventData {
  id: string;
  type: "reward" | "deduction";
  xp?: number;
  coins?: number;
  title?: string;
}

// Global Event Dispatcher
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
  const [displayXp, setDisplayXp] = useState(0);
  const [displayCoins, setDisplayCoins] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const [flyingItems, setFlyingItems] = useState<{ id: number; icon: string; delay: number }[]>([]);

  useEffect(() => {
    const handleRewardEvent = (e: CustomEvent<RewardEventData>) => {
      const data = e.detail;
      setActiveEvent(data);
      setDisplayXp(0);
      setDisplayCoins(0);
      setIsFlying(false);
      setFlyingItems([]);

      const targetXp = data.xp || 0;
      const targetCoins = data.coins || 0;

      // 1. Live Counting Up Animation over 600ms
      const duration = 600;
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        // Ease out quadratic
        const eased = 1 - Math.pow(1 - progress, 2);
        
        setDisplayXp(Math.round(eased * targetXp));
        setDisplayCoins(Math.round(eased * targetCoins));

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };

      requestAnimationFrame(updateCounter);

      // 2. After 1 second, trigger particles flow to top right header
      const flyTimer = setTimeout(() => {
        setIsFlying(true);
        if (data.type === "reward") {
          const items = Array.from({ length: 6 }).map((_, i) => ({
            id: i,
            icon: i % 2 === 0 ? "/images/coin-zoomed.png" : "/images/xp-shield-zoomed.png",
            delay: i * 0.08,
          }));
          setFlyingItems(items);
        }
      }, 1000);

      // 3. Clear center screen notification after 2 seconds
      const closeTimer = setTimeout(() => {
        setActiveEvent(null);
        setIsFlying(false);
        setFlyingItems([]);
      }, 2100);

      return () => {
        clearTimeout(flyTimer);
        clearTimeout(closeTimer);
      };
    };

    window.addEventListener("ap-lab-reward-event" as any, handleRewardEvent as any);
    return () => {
      window.removeEventListener("ap-lab-reward-event" as any, handleRewardEvent as any);
    };
  }, []);

  return (
    <>
      {/* Darkened Background (JUST DARKENED, NO BLUR, NO RECTANGLE CARD) */}
      <AnimatePresence>
        {activeEvent && (
          <div className="fixed inset-0 z-[9999999] pointer-events-none flex items-center justify-center p-4">
            {/* Slightly Darkened Screen Overlay (No blur) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40"
            />

            {/* Clean Center Element (No Rectangle Box!) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="relative z-10 flex items-center space-x-5 font-manrope select-none"
            >
              {/* Left Side Animated Arrow */}
              {activeEvent.type === "reward" ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: [10, -8, 0], opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.4)]"
                >
                  <ArrowUp className="w-10 h-10 stroke-[3.5] animate-bounce" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: [-10, 8, 0], opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-500 shadow-[0_0_35px_rgba(239,68,68,0.4)]"
                >
                  <ArrowDown className="w-10 h-10 stroke-[3.5] animate-bounce" />
                </motion.div>
              )}

              {/* Right Side Earned/Lost Quantities with Actual Images */}
              <div className="flex items-center space-x-6">
                {activeEvent.type === "reward" ? (
                  <>
                    {/* XP Item */}
                    {(activeEvent.xp || 0) > 0 && (
                      <div className="flex items-center space-x-3">
                        <img
                          src="/images/xp-shield-zoomed.png"
                          alt="XP"
                          className="w-12 h-12 object-contain drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                        />
                        <span className="font-manrope font-black text-4xl sm:text-5xl text-purple-300 tracking-tight drop-shadow-md">
                          +{displayXp} XP
                        </span>
                      </div>
                    )}

                    {/* Coins Item */}
                    {(activeEvent.coins || 0) > 0 && (
                      <div className="flex items-center space-x-3">
                        <img
                          src="/images/coin-zoomed.png"
                          alt="Coins"
                          className="w-12 h-12 object-contain drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]"
                        />
                        <span className="font-manrope font-black text-4xl sm:text-5xl text-amber-400 tracking-tight drop-shadow-md">
                          +{displayCoins} Coins
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  /* Coins Lost Item */
                  <div className="flex items-center space-x-3">
                    <img
                      src="/images/coin-zoomed.png"
                      alt="Coins"
                      className="w-12 h-12 object-contain drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
                    />
                    <span className="font-manrope font-black text-4xl sm:text-5xl text-red-400 tracking-tight drop-shadow-md">
                      -{displayCoins} Coins
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Smooth Flying Particles Flowing into Top Right Header */}
      <AnimatePresence>
        {isFlying && flyingItems.length > 0 && (
          <div className="fixed inset-0 z-[9999998] pointer-events-none overflow-hidden">
            {flyingItems.map((p) => (
              <motion.div
                key={p.id}
                initial={{
                  x: typeof window !== "undefined" ? window.innerWidth / 2 - 20 : 0,
                  y: typeof window !== "undefined" ? window.innerHeight / 2 - 20 : 0,
                  scale: 1.2,
                  opacity: 1,
                }}
                animate={{
                  x: typeof window !== "undefined" ? window.innerWidth - 120 : 800,
                  y: 28,
                  scale: 0.35,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.75,
                  delay: p.delay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="fixed top-0 left-0 w-12 h-12 z-[9999998] pointer-events-none flex items-center justify-center"
              >
                <img src={p.icon} alt="Particle" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
