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
  const [isFlashActive, setIsFlashActive] = useState(false);

  useEffect(() => {
    const handleRewardEvent = (e: CustomEvent<RewardEventData>) => {
      const data = e.detail;
      setActiveEvent(data);
      setDisplayXp(0);
      setDisplayCoins(0);
      setIsFlashActive(false);

      const targetXp = data.xp || 0;
      const targetCoins = data.coins || 0;

      // Ultra-smooth Live Counting Animation over 650ms
      const duration = 650;
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        // Smooth cubic ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        
        setDisplayXp(Math.round(eased * targetXp));
        setDisplayCoins(Math.round(eased * targetCoins));

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          // Trigger brief 0.4s flash upon completion
          setIsFlashActive(true);
        }
      };

      requestAnimationFrame(updateCounter);

      // Auto dismiss after 2.4 seconds
      const closeTimer = setTimeout(() => {
        setActiveEvent(null);
        setIsFlashActive(false);
      }, 2400);

      return () => {
        clearTimeout(closeTimer);
      };
    };

    window.addEventListener("ap-lab-reward-event" as any, handleRewardEvent as any);
    return () => {
      window.removeEventListener("ap-lab-reward-event" as any, handleRewardEvent as any);
    };
  }, []);

  return (
    <AnimatePresence>
      {activeEvent && (
        <div className="fixed inset-0 z-[999999999] pointer-events-none flex items-center justify-center p-4">
          {/* Darkened Screen Overlay (JUST DARKENED, NO BLUR, NO CARD RECTANGLE) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
          />

          {/* Clean Center Content Container (No Glow, No Rectangle Box!) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 flex items-center space-x-6 font-manrope select-none"
          >
            {/* Left Side Clean Arrow (NO Circle Background, NO Glow!) */}
            {activeEvent.type === "reward" ? (
              <motion.div
                initial={{ y: 35, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center justify-center shrink-0"
              >
                <ArrowUp className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400 stroke-[3.5]" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: -35, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center justify-center shrink-0"
              >
                <ArrowDown className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 stroke-[3.5]" />
              </motion.div>
            )}

            {/* Right Side Quantities with EVEN BIGGER Images on the RIGHT of numbers (NO "coins"/"xp" text, NO Glow!) */}
            <div className="flex items-center space-x-6">
              {activeEvent.type === "reward" ? (
                <>
                  {/* XP Item: +100 [XP Image on Right] */}
                  {(activeEvent.xp || 0) > 0 && (
                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-manrope font-black text-5xl sm:text-7xl tracking-tight transition-colors duration-300 ${
                          isFlashActive ? "text-emerald-400" : "text-purple-300"
                        }`}
                      >
                        +{displayXp}
                      </span>
                      <img
                        src="/images/xp-shield-zoomed.png"
                        alt="XP Shield"
                        className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
                      />
                    </div>
                  )}

                  {/* Coins Earned Item: +50 [Coin Image on Right] */}
                  {(activeEvent.coins || 0) > 0 && (
                    <div className="flex items-center space-x-3">
                      <span
                        className={`font-manrope font-black text-5xl sm:text-7xl tracking-tight transition-colors duration-300 ${
                          isFlashActive ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        +{displayCoins}
                      </span>
                      <img
                        src="/images/coin-zoomed.png"
                        alt="Coins"
                        className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
                      />
                    </div>
                  )}
                </>
              ) : (
                /* Coins Lost Deduction Item: -250 [Coin Image on Right] (Flashes Red for a second on completion) */
                <div className="flex items-center space-x-3">
                  <span
                    className={`font-manrope font-black text-5xl sm:text-7xl tracking-tight transition-colors duration-300 ${
                      isFlashActive ? "text-red-500" : "text-amber-400"
                    }`}
                  >
                    -{displayCoins}
                  </span>
                  <img
                    src="/images/coin-zoomed.png"
                    alt="Coins"
                    className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
