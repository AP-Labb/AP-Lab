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
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const handleRewardEvent = (e: CustomEvent<RewardEventData>) => {
      const data = e.detail;
      setActiveEvent(data);
      setDisplayXp(0);
      setDisplayCoins(0);
      setIsComplete(false);

      const targetXp = data.xp || 0;
      const targetCoins = data.coins || 0;

      // Smooth Live Counting Animation over 650ms
      const duration = 650;
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        // Smooth quadratic ease-out
        const eased = 1 - Math.pow(1 - progress, 2);
        
        setDisplayXp(Math.round(eased * targetXp));
        setDisplayCoins(Math.round(eased * targetCoins));

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          setIsComplete(true);
        }
      };

      requestAnimationFrame(updateCounter);

      // Auto dismiss after 2.4 seconds
      const closeTimer = setTimeout(() => {
        setActiveEvent(null);
        setIsComplete(false);
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

          {/* Clean Center Content Container (No Rectangle Box!) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 flex items-center space-x-6 font-manrope select-none"
          >
            {/* Left Side Clean Arrow (NO Circle Background!) */}
            {activeEvent.type === "reward" ? (
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center shrink-0"
              >
                <ArrowUp className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400 stroke-[3.5] drop-shadow-[0_0_25px_rgba(52,211,153,0.9)]" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center shrink-0"
              >
                <ArrowDown className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 stroke-[3.5] drop-shadow-[0_0_25px_rgba(239,68,68,0.9)]" />
              </motion.div>
            )}

            {/* Right Side Quantities with MUCH LARGER Images */}
            <div className="flex items-center space-x-6">
              {activeEvent.type === "reward" ? (
                <>
                  {/* XP Item */}
                  {(activeEvent.xp || 0) > 0 && (
                    <div className="flex items-center space-x-3.5">
                      <img
                        src="/images/xp-shield-zoomed.png"
                        alt="XP Shield"
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.9)]"
                      />
                      <span className="font-manrope font-black text-4xl sm:text-6xl text-purple-300 tracking-tight drop-shadow-lg">
                        +{displayXp} XP
                      </span>
                    </div>
                  )}

                  {/* Coins Earned Item */}
                  {(activeEvent.coins || 0) > 0 && (
                    <div className="flex items-center space-x-3.5">
                      <img
                        src="/images/coin-zoomed.png"
                        alt="Coins"
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.9)]"
                      />
                      <span className="font-manrope font-black text-4xl sm:text-6xl text-amber-400 tracking-tight drop-shadow-lg">
                        +{displayCoins} Coins
                      </span>
                    </div>
                  )}
                </>
              ) : (
                /* Coins Lost Deduction Item (Flashes Red on completion) */
                <div className="flex items-center space-x-3.5">
                  <img
                    src="/images/coin-zoomed.png"
                    alt="Coins"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]"
                  />
                  <span
                    className={`font-manrope font-black text-4xl sm:text-6xl tracking-tight transition-all ${
                      isComplete
                        ? "text-red-500 animate-pulse drop-shadow-[0_0_35px_rgba(239,68,68,1)]"
                        : "text-red-400 drop-shadow-lg"
                    }`}
                  >
                    -{displayCoins} Coins
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
