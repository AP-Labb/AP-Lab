"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { triggerRewardAnimation } from "@/components/RewardNotificationOverlay";
import "./SlotMachine.css";

const CLASSIC_EMOJIS = ["🍋", "🍊", "🍉", "🍇", "🍓", "🍒", "🌟", "🍀", "💎", "🎰", "🔔", "🎁"];

export function SlotMachine() {
  const { progress, addCredits, spendCredits } = useProgress();
  const credits = progress?.credits || 0;

  const [isSpinning, setIsSpinning] = useState(false);
  const [stoppedRings, setStoppedRings] = useState<number[]>([]);
  const [ringAngles, setRingAngles] = useState([0, 0, 0, 0, 0]); // 5 Concentric Rings
  const [isZoomed, setIsZoomed] = useState(false); // Zoom-in animation state
  const [winMessage, setWinMessage] = useState<string | null>(null);
  const [displayStatus, setDisplayStatus] = useState<"idle" | "win" | "fail">("idle");

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const ringAnglesRef = useRef([0, 0, 0, 0, 0]);
  const stoppedRingsRef = useRef<number[]>([]);

  // Sound refs
  const blipAudioRef = useRef<HTMLAudioElement | null>(null);
  const coinAudioRef = useRef<HTMLAudioElement | null>(null);
  const stopAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const unluckyAudioRef = useRef<HTMLAudioElement | null>(null);

  const SPIN_COST = 50;
  const ALPHA = 360 / CLASSIC_EMOJIS.length; // 30 degrees per symbol slot

  useEffect(() => {
    if (typeof window !== "undefined") {
      blipAudioRef.current = new Audio("/sounds/slotjs/blip.mp3");
      coinAudioRef.current = new Audio("/sounds/slotjs/coin.mp3");
      stopAudioRef.current = new Audio("/sounds/slotjs/stop.mp3");
      winAudioRef.current = new Audio("/sounds/slotjs/win.mp3");
      unluckyAudioRef.current = new Audio("/sounds/slotjs/unlucky.mp3");
    }
  }, []);

  const playSound = (audio: HTMLAudioElement | null) => {
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // 5 Concentric Rings rotation tick loop
  useEffect(() => {
    if (!isSpinning) return;

    const speeds = [-0.45, 0.60, -0.75, 0.90, -1.05]; // Differential ring rotation speeds

    const tick = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const newAngles = [...ringAnglesRef.current];
      for (let i = 0; i < 5; i++) {
        if (!stoppedRingsRef.current.includes(i)) {
          newAngles[i] = (newAngles[i] + speeds[i] * dt) % 360;
        }
      }
      ringAnglesRef.current = newAngles;
      setRingAngles([...newAngles]);

      if (stoppedRingsRef.current.length < 5) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isSpinning]);

  const handleButtonClick = () => {
    if (!isSpinning) {
      if (credits < SPIN_COST) {
        setWinMessage("Not enough coins! You need 50 coins to spin.");
        setDisplayStatus("fail");
        playSound(unluckyAudioRef.current);
        setTimeout(() => {
          setWinMessage(null);
          setDisplayStatus("idle");
        }, 3000);
        return;
      }

      if (spendCredits) spendCredits(SPIN_COST);
      playSound(coinAudioRef.current);

      setIsSpinning(true);
      setIsZoomed(false); // Zoom out when starting spin
      setStoppedRings([]);
      stoppedRingsRef.current = [];
      setWinMessage(null);
      setDisplayStatus("idle");
      lastTimeRef.current = performance.now();
    } else {
      // Stop next ring sequentially and SNAP EXACTLY to straight payline
      const currentStopped = [...stoppedRingsRef.current];
      if (currentStopped.length < 5) {
        const nextRingToStop = currentStopped.length;
        
        // Exact angle alignment math so emojis line up 100% straight on payline
        const rawAngle = ringAnglesRef.current[nextRingToStop];
        const snappedAngle = Math.round(rawAngle / ALPHA) * ALPHA;
        ringAnglesRef.current[nextRingToStop] = snappedAngle;
        setRingAngles([...ringAnglesRef.current]);

        currentStopped.push(nextRingToStop);
        stoppedRingsRef.current = currentStopped;
        setStoppedRings([...currentStopped]);
        playSound(stopAudioRef.current);

        if (currentStopped.length === 5) {
          // All 5 rings stopped - Trigger Payline Zoom In Animation & Calculate Prize
          setTimeout(() => {
            setIsZoomed(true); // ZOOM IN ON SELECTED EMOJIS!
            calculatePrize();
            setIsSpinning(false);
          }, 300);
        }
      }
    }
  };

  const calculatePrize = () => {
    const finalAngles = ringAnglesRef.current;

    // Get exact symbol aligned at straight left payline
    const getSymbolForAngle = (angle: number) => {
      const normalized = (360 + (angle % 360)) % 360;
      const index = Math.floor((normalized / 360) * CLASSIC_EMOJIS.length) % CLASSIC_EMOJIS.length;
      return CLASSIC_EMOJIS[index];
    };

    const symbols = [
      getSymbolForAngle(finalAngles[0]),
      getSymbolForAngle(finalAngles[1]),
      getSymbolForAngle(finalAngles[2]),
      getSymbolForAngle(finalAngles[3]),
      getSymbolForAngle(finalAngles[4])
    ];

    // Count matching frequencies
    const counts: Record<string, number> = {};
    symbols.forEach((s) => { counts[s] = (counts[s] || 0) + 1; });
    const maxMatch = Math.max(...Object.values(counts));
    const matchedSymbol = Object.keys(counts).find((k) => counts[k] === maxMatch) || symbols[0];

    if (maxMatch >= 5) {
      // 5-RING MEGA JACKPOT!
      playSound(winAudioRef.current);
      if (addCredits) addCredits(1000, "5-Ring Mega Jackpot");
      triggerRewardAnimation({ type: "reward", xp: 500, coins: 1000 });
      setWinMessage(`🎉 5-RING MEGA JACKPOT 5x ${matchedSymbol}! You won +1000 Coins & +500 XP!`);
      setDisplayStatus("win");
    } else if (maxMatch === 4) {
      // 4-RING MATCH
      playSound(winAudioRef.current);
      if (addCredits) addCredits(400, "4-Ring Match");
      triggerRewardAnimation({ type: "reward", xp: 200, coins: 400 });
      setWinMessage(`🔥 4-RING MATCH 4x ${matchedSymbol}! You won +400 Coins & +200 XP!`);
      setDisplayStatus("win");
    } else if (maxMatch === 3) {
      // 3-RING MATCH
      playSound(winAudioRef.current);
      if (addCredits) addCredits(150, "3-Ring Match");
      triggerRewardAnimation({ type: "reward", xp: 75, coins: 150 });
      setWinMessage(`⭐ TRIPLE MATCH 3x ${matchedSymbol}! You won +150 Coins & +75 XP!`);
      setDisplayStatus("win");
    } else if (maxMatch === 2) {
      // DOUBLE MATCH
      playSound(winAudioRef.current);
      if (addCredits) addCredits(60, "Double Match");
      triggerRewardAnimation({ type: "reward", coins: 60 });
      setWinMessage(`✨ DOUBLE MATCH 2x ${matchedSymbol}! You won +60 Coins!`);
      setDisplayStatus("win");
    } else {
      playSound(unluckyAudioRef.current);
      setWinMessage("Unlucky! Give it another spin!");
      setDisplayStatus("fail");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-14 px-4 border-t border-white/10 mt-16 font-manrope bg-transparent">
      {/* Title Header (Badge Removed!) */}
      <div className="text-center mb-8 space-y-1.5">
        <h2 className="font-instrument text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Circular AP Slot Machine
        </h2>
        <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed font-manrope">
          Spin 5 concentric rings for 50 coins & win up to +1000 Coins & +500 XP!
        </p>
      </div>

      {/* Danziger SlotJS 5-Ring Wheel (Transparent Container, White Background on Wheel Rings ONLY) */}
      <div className="slotjs-wheel-container">
        <div className={`sm__reelsContainer ${isZoomed ? "has-zoom" : ""}`}>
          {/* 5 Concentric Rings */}
          {[0, 1, 2, 3, 4].map((ringIndex) => (
            <div
              key={ringIndex}
              className="sm__reel"
              style={{
                // @ts-ignore
                "--index": ringIndex,
                transform: `rotate(${ringAngles[ringIndex]}deg)`
              }}
            >
              {CLASSIC_EMOJIS.map((sym, idx) => {
                const cellAngle = ALPHA * idx;
                return (
                  <div
                    key={idx}
                    className="sm__cell"
                    style={{ transform: `rotate(${cellAngle}deg)` }}
                  >
                    <span className="sm__figure">{sym}</span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Left Payline Highlight Display */}
          <div className={`sm__display ${displayStatus === "win" ? "is-win" : displayStatus === "fail" ? "is-fail" : ""}`} />

          {/* Center Interactive Spin Button - Sleek Black Button with Real Coin Image (NO Glow) */}
          <button
            onClick={handleButtonClick}
            className="slotjs-center-btn"
          >
            {!isSpinning ? (
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider font-black text-white">SPIN</span>
                <div className="flex items-center space-x-1 mt-0.5">
                  <span className="text-[11px] font-mono font-bold text-white">50</span>
                  <img src="/images/coin-zoomed.png" alt="Coin" className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain inline-block transform scale-110" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider font-black text-white">STOP</span>
                <span className="text-[10px] font-mono font-bold text-white/90 mt-0.5">{5 - stoppedRings.length} LEFT</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Live Win Banner */}
      <AnimatePresence>
        {winMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`mt-6 px-6 py-3 rounded-2xl font-manrope font-bold text-sm text-center shadow-lg max-w-md border ${
              displayStatus === "win"
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200"
                : "bg-red-500/20 border-red-500/40 text-red-200"
            }`}
          >
            {winMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
