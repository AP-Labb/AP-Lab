"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, RotateCw, Zap, Flame, Coins, ShieldCheck, Star } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { triggerRewardAnimation } from "@/components/RewardNotificationOverlay";
import { playXpGainTick, playXpGainEnd, playMockSubmitSound, playCoinSpendTick } from "@/lib/soundEffects";
import "./SlotMachine.css";

const SYMBOLS = ["🧬", "🧪", "⚛️", "🧠", "🏆", "💎", "⭐", "⚡", "🔥"];

export function SlotMachine() {
  const { progress, addCredits, spendCredits } = useProgress();
  const credits = progress?.credits || 0;
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [stoppedRings, setStoppedRings] = useState<number[]>([]); // Array of ring indices stopped [0, 1, 2]
  const [ringAngles, setRingAngles] = useState([0, 0, 0]);
  const [winMessage, setWinMessage] = useState<string | null>(null);
  
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const ringAnglesRef = useRef([0, 0, 0]);
  const stoppedRingsRef = useRef<number[]>([]);

  const SPIN_COST = 50;

  // Spin tick loop
  useEffect(() => {
    if (!isSpinning) return;

    const speeds = [0.45, -0.65, 0.85]; // Ring rotation speeds & directions

    const tick = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const newAngles = [...ringAnglesRef.current];
      for (let i = 0; i < 3; i++) {
        if (!stoppedRingsRef.current.includes(i)) {
          newAngles[i] = (newAngles[i] + speeds[i] * dt) % 360;
        }
      }
      ringAnglesRef.current = newAngles;
      setRingAngles([...newAngles]);

      if (stoppedRingsRef.current.length < 3) {
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
      // Start spin
      if (credits < SPIN_COST) {
        setWinMessage("Not enough coins! You need 50 coins to spin.");
        setTimeout(() => setWinMessage(null), 3000);
        return;
      }

      if (spendCredits) spendCredits(SPIN_COST);
      playCoinSpendTick(0.3);
      setIsSpinning(true);
      setStoppedRings([]);
      stoppedRingsRef.current = [];
      setWinMessage(null);
      lastTimeRef.current = performance.now();
    } else {
      // Stop next ring sequentially
      const currentStopped = [...stoppedRingsRef.current];
      if (currentStopped.length < 3) {
        const nextRingToStop = currentStopped.length;
        currentStopped.push(nextRingToStop);
        stoppedRingsRef.current = currentStopped;
        setStoppedRings([...currentStopped]);
        playXpGainTick(0.2 + nextRingToStop * 0.3);

        if (currentStopped.length === 3) {
          // All rings stopped - Calculate Result!
          setTimeout(() => {
            calculatePrize();
            setIsSpinning(false);
          }, 350);
        }
      }
    }
  };

  const calculatePrize = () => {
    const finalAngles = ringAnglesRef.current;
    
    // Determine top symbol for each ring (at 0 degrees top position)
    const getSymbolForAngle = (angle: number) => {
      const normalized = (360 - (angle % 360)) % 360;
      const index = Math.floor((normalized / 360) * SYMBOLS.length) % SYMBOLS.length;
      return SYMBOLS[index];
    };

    const s1 = getSymbolForAngle(finalAngles[0]);
    const s2 = getSymbolForAngle(finalAngles[1]);
    const s3 = getSymbolForAngle(finalAngles[2]);

    if (s1 === s2 && s2 === s3) {
      // JACKPOT TRIPLE MATCH!
      playMockSubmitSound();
      if (addCredits) addCredits(500, "Slot Jackpot");
      triggerRewardAnimation({ type: "reward", xp: 250, coins: 500 });
      setWinMessage(`🎉 JACKPOT! 3x ${s1}! You won +500 Coins & +250 XP!`);
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      // DOUBLE MATCH
      playXpGainEnd();
      if (addCredits) addCredits(100, "Slot Double Match");
      triggerRewardAnimation({ type: "reward", xp: 50, coins: 100 });
      const matched = s1 === s2 ? s1 : s3;
      setWinMessage(`⭐ NICE! Double ${matched}! You won +100 Coins & +50 XP!`);
    } else if (s1 === "💎" || s2 === "💎" || s3 === "💎") {
      // LUCKY DIAMOND
      playXpGainEnd();
      if (addCredits) addCredits(60, "Slot Diamond Match");
      triggerRewardAnimation({ type: "reward", coins: 60 });
      setWinMessage(`💎 LUCKY DIAMOND! You won +60 Coins!`);
    } else {
      setWinMessage("Better luck next time! Give it another spin!");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-14 px-4 border-t border-white/10 mt-16 font-manrope">
      {/* Title Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AP LAB CASINO SLOT</span>
        </div>
        <h2 className="font-instrument text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Circular AP Slot Machine
        </h2>
        <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed font-manrope">
          Spin the concentric rings and test your luck to win +500 Coins & +250 XP rewards!
        </p>
      </div>

      {/* Main Slot Machine Interactive Container */}
      <div className="slot-machine-wrapper">
        {/* Top Pointer Indicator */}
        <div className="slot-pointer-needle" />

        <div className="slot-machine-outer">
          {/* Ring 1 (Outer) */}
          <div 
            className="slot-ring slot-ring-1"
            style={{ transform: `rotate(${ringAngles[0]}deg)` }}
          >
            {SYMBOLS.map((sym, idx) => {
              const angle = (360 / SYMBOLS.length) * idx;
              const rad = (angle * Math.PI) / 180;
              const radiusPercent = 42; // Position from center
              const x = Math.sin(rad) * radiusPercent;
              const y = -Math.cos(rad) * radiusPercent;
              return (
                <div
                  key={idx}
                  className="slot-symbol-node"
                  style={{
                    transform: `translate(${x * 4.2}px, ${y * 4.2}px) rotate(${-ringAngles[0]}deg)`
                  }}
                >
                  {sym}
                </div>
              );
            })}
          </div>

          {/* Ring 2 (Middle) */}
          <div 
            className="slot-ring slot-ring-2"
            style={{ transform: `rotate(${ringAngles[1]}deg)` }}
          >
            {SYMBOLS.map((sym, idx) => {
              const angle = (360 / SYMBOLS.length) * idx;
              const rad = (angle * Math.PI) / 180;
              const radiusPercent = 30;
              const x = Math.sin(rad) * radiusPercent;
              const y = -Math.cos(rad) * radiusPercent;
              return (
                <div
                  key={idx}
                  className="slot-symbol-node"
                  style={{
                    transform: `translate(${x * 3.4}px, ${y * 3.4}px) rotate(${-ringAngles[1]}deg)`
                  }}
                >
                  {sym}
                </div>
              );
            })}
          </div>

          {/* Ring 3 (Inner) */}
          <div 
            className="slot-ring slot-ring-3"
            style={{ transform: `rotate(${ringAngles[2]}deg)` }}
          >
            {SYMBOLS.map((sym, idx) => {
              const angle = (360 / SYMBOLS.length) * idx;
              const rad = (angle * Math.PI) / 180;
              const radiusPercent = 18;
              const x = Math.sin(rad) * radiusPercent;
              const y = -Math.cos(rad) * radiusPercent;
              return (
                <div
                  key={idx}
                  className="slot-symbol-node"
                  style={{
                    transform: `translate(${x * 2.5}px, ${y * 2.5}px) rotate(${-ringAngles[2]}deg)`
                  }}
                >
                  {sym}
                </div>
              );
            })}
          </div>

          {/* Center Spin Action Button */}
          <button
            onClick={handleButtonClick}
            className="slot-center-button"
          >
            {!isSpinning ? (
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider font-extrabold">SPIN</span>
                <span className="text-[10px] opacity-80 font-mono">50 🪙</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider font-extrabold">STOP</span>
                <span className="text-[10px] opacity-90 font-mono">{3 - stoppedRings.length} LEFT</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Win Banner Message */}
      <AnimatePresence>
        {winMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mt-6 px-6 py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 font-manrope font-bold text-sm text-center shadow-lg max-w-md"
          >
            {winMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
