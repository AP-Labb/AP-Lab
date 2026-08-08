"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

import { playXpGainTick, playXpGainEnd, playCoinSpendTick, playCoinSpendEnd } from "@/lib/soundEffects";

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

// Rolling Digit Push-Up Component for Ultra-Smooth Number Increments
function RollingNumber({ value, className }: { value: number; className?: string }) {
  return (
    <div className="relative inline-flex overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          className={className}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function RewardNotificationOverlay() {
  const [activeEvent, setActiveEvent] = useState<RewardEventData | null>(null);
  const [displayXp, setDisplayXp] = useState(0);
  const [displayCoins, setDisplayCoins] = useState(0);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const lastSoundTickRef = React.useRef(0);

  useEffect(() => {
    const handleRewardEvent = (e: CustomEvent<RewardEventData>) => {
      const data = e.detail;
      setActiveEvent(data);
      setDisplayXp(0);
      setDisplayCoins(0);
      setIsFlashActive(false);

      const targetXp = data.xp || 0;
      const targetCoins = data.coins || 0;

      // Sound trigger
      if (data.type === "reward") playXpGainTick(0.2);
      else playCoinSpendTick(0.2);

      // Ultra-smooth Live Counting Animation over 450ms
      const duration = 450;
      const startTime = performance.now();

      const updateCounter = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        
        // Smooth cubic ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        
        setDisplayXp(Math.round(eased * targetXp));
        setDisplayCoins(Math.round(eased * targetCoins));

        if (currentTime - lastSoundTickRef.current > 75) {
          lastSoundTickRef.current = currentTime;
          if (data.type === "reward") playXpGainTick(progress);
          else playCoinSpendTick(progress);
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          // Brief 300ms flash on completion, then revert to original color
          setIsFlashActive(true);
          if (data.type === "reward") playXpGainEnd();
          else playCoinSpendEnd();

          setTimeout(() => {
            setIsFlashActive(false);
          }, 300);
        }
      };

      requestAnimationFrame(updateCounter);

      // Auto dismiss after 1.8 seconds total
      const closeTimer = setTimeout(() => {
        setActiveEvent(null);
        setIsFlashActive(false);
      }, 1800);

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
        <div className="fixed inset-0 z-[5000] pointer-events-none flex items-center justify-center p-4">
          {/* Darkened Screen Overlay (JUST DARKENED, NO BLUR, NO CARD RECTANGLE) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
          />

          {/* Clean Center Content Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 flex items-center space-x-5 font-manrope select-none"
          >
            {/* Left Side Clean Arrow */}
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

            {/* Right Side Quantities with EVEN BIGGER Images closer to numbers */}
            <div className="flex items-center space-x-5">
              {activeEvent.type === "reward" ? (
                <>
                  {/* XP Item: +100 [XP Image on Right, moved closer] */}
                  {(activeEvent.xp || 0) > 0 && (
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`font-manrope font-black text-5xl sm:text-7xl tracking-tight transition-colors duration-200 ${
                          isFlashActive ? "text-emerald-400" : "text-purple-300"
                        }`}
                      >
                        +<RollingNumber value={displayXp} />
                      </span>
                      <img
                        src="/images/xp-shield-zoomed.png"
                        alt="XP Shield"
                        className="w-28 h-28 sm:w-36 sm:h-36 object-contain -ml-1"
                      />
                    </div>
                  )}

                  {/* Coins Earned Item: +50 [Coin Image on Right, moved closer] */}
                  {(activeEvent.coins || 0) > 0 && (
                    <div className="flex items-center space-x-1.5">
                      <span
                        className={`font-manrope font-black text-5xl sm:text-7xl tracking-tight transition-colors duration-200 ${
                          isFlashActive ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        +<RollingNumber value={displayCoins} />
                      </span>
                      <img
                        src="/images/coin-zoomed.png"
                        alt="Coins"
                        className="w-28 h-28 sm:w-36 sm:h-36 object-contain -ml-1"
                      />
                    </div>
                  )}
                </>
              ) : (
                /* Coins Lost Deduction Item: -250 [Coin Image on Right] (Flashes Red for 300ms on completion, then reverts) */
                <div className="flex items-center space-x-1.5">
                  <span
                    className={`font-manrope font-black text-5xl sm:text-7xl tracking-tight transition-colors duration-200 ${
                      isFlashActive ? "text-red-500" : "text-amber-400"
                    }`}
                  >
                    -<RollingNumber value={displayCoins} />
                  </span>
                  <img
                    src="/images/coin-zoomed.png"
                    alt="Coins"
                    className="w-28 h-28 sm:w-36 sm:h-36 object-contain -ml-1"
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
