"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { triggerRewardAnimation } from "@/components/RewardNotificationOverlay";
import { playXpGainTick, playXpGainEnd, playMockSubmitSound, playCoinSpendTick } from "@/lib/soundEffects";
import "./SlotMachine.css";

const EMOJI_SYMBOLS = ["🧬", "🧪", "⚛️", "🧠", "🏆", "💎", "⭐", "⚡", "🔥"];

export function SlotMachine() {
  const { progress, addCredits, spendCredits } = useProgress();
  const credits = progress?.credits || 0;

  const [isSpinning, setIsSpinning] = useState(false);
  const [stoppedRings, setStoppedRings] = useState<number[]>([]);
  const [ringAngles, setRingAngles] = useState([0, 0, 0]);
  const [winMessage, setWinMessage] = useState<string | null>(null);
  const [displayStatus, setDisplayStatus] = useState<"idle" | "win" | "fail">("idle");

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const ringAnglesRef = useRef([0, 0, 0]);
  const stoppedRingsRef = useRef<number[]>([]);

  const SPIN_COST = 50;

  // Concentric ring rotation tick loop (Danziger speed math)
  useEffect(() => {
    if (!isSpinning) return;

    const speeds = [-0.55, 0.75, -0.95]; // Differential ring rotation speeds

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
      // Check live AP Lab coin balance
      if (credits < SPIN_COST) {
        setWinMessage("Not enough AP Lab coins! You need 50 coins to spin.");
        setDisplayStatus("fail");
        setTimeout(() => {
          setWinMessage(null);
          setDisplayStatus("idle");
        }, 3000);
        return;
      }

      // Deduct 50 AP Lab Coins
      if (spendCredits) spendCredits(SPIN_COST);
      playCoinSpendTick(0.3);

      setIsSpinning(true);
      setStoppedRings([]);
      stoppedRingsRef.current = [];
      setWinMessage(null);
      setDisplayStatus("idle");
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
          // All 3 rings stopped - calculate winning combination
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

    // Get symbol aligned at left payline (180 degrees offset)
    const getSymbolForAngle = (angle: number) => {
      const normalized = (360 + (angle % 360)) % 360;
      const index = Math.floor((normalized / 360) * EMOJI_SYMBOLS.length) % EMOJI_SYMBOLS.length;
      return EMOJI_SYMBOLS[index];
    };

    const s1 = getSymbolForAngle(finalAngles[0]);
    const s2 = getSymbolForAngle(finalAngles[1]);
    const s3 = getSymbolForAngle(finalAngles[2]);

    if (s1 === s2 && s2 === s3) {
      // TRIPLE MATCH JACKPOT
      playMockSubmitSound();
      if (addCredits) addCredits(500, "Slot Jackpot");
      triggerRewardAnimation({ type: "reward", xp: 250, coins: 500 });
      setWinMessage(`🎉 TRIPLE MATCH JACKPOT 3x ${s1}! You won +500 Coins & +250 XP!`);
      setDisplayStatus("win");
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
      // DOUBLE MATCH
      playXpGainEnd();
      if (addCredits) addCredits(100, "Slot Double Match");
      triggerRewardAnimation({ type: "reward", xp: 50, coins: 100 });
      const matched = s1 === s2 ? s1 : s3;
      setWinMessage(`⭐ DOUBLE MATCH ${matched}! You won +100 Coins & +50 XP!`);
      setDisplayStatus("win");
    } else if (s1 === "💎" || s2 === "💎" || s3 === "💎") {
      // LUCKY DIAMOND
      playXpGainEnd();
      if (addCredits) addCredits(60, "Slot Diamond Match");
      triggerRewardAnimation({ type: "reward", coins: 60 });
      setWinMessage(`💎 LUCKY DIAMOND! You won +60 Coins!`);
      setDisplayStatus("win");
    } else {
      playXpGainTick(0.1);
      setWinMessage("Unlucky! Give it another spin!");
      setDisplayStatus("fail");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-14 px-4 border-t border-white/10 mt-16 font-manrope">
      {/* Title Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AP LAB CASINO SLOT</span>
        </div>
        <h2 className="font-instrument text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Circular AP Slot Machine
        </h2>
        <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed font-manrope">
          Spin the circular emoji reels for 50 coins & win up to +500 Coins & +250 XP!
        </p>
      </div>

      {/* Main Danziger Circular Wheel Container (Seamless AP Lab Background Integration) */}
      <div className="danziger-slot-container">
        <div className="sm__reelsContainer">
          {/* Ring 1 (Outer) */}
          <div
            className="sm__reel"
            style={{
              // @ts-ignore
              "--index": 0,
              transform: `rotate(${ringAngles[0]}deg)`
            }}
          >
            {EMOJI_SYMBOLS.map((sym, idx) => {
              const cellAngle = (360 / EMOJI_SYMBOLS.length) * idx;
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

          {/* Ring 2 (Middle) */}
          <div
            className="sm__reel"
            style={{
              // @ts-ignore
              "--index": 1,
              transform: `rotate(${ringAngles[1]}deg)`
            }}
          >
            {EMOJI_SYMBOLS.map((sym, idx) => {
              const cellAngle = (360 / EMOJI_SYMBOLS.length) * idx;
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

          {/* Ring 3 (Inner) */}
          <div
            className="sm__reel"
            style={{
              // @ts-ignore
              "--index": 2,
              transform: `rotate(${ringAngles[2]}deg)`
            }}
          >
            {EMOJI_SYMBOLS.map((sym, idx) => {
              const cellAngle = (360 / EMOJI_SYMBOLS.length) * idx;
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

          {/* Left Payline Highlight Display */}
          <div className={`sm__display ${displayStatus === "win" ? "is-win" : displayStatus === "fail" ? "is-fail" : ""}`} />

          {/* Center Interactive Spin Button */}
          <button
            onClick={handleButtonClick}
            className="danziger-center-btn"
          >
            {!isSpinning ? (
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider font-extrabold">SPIN</span>
                <span className="text-[10px] opacity-90 font-mono font-bold mt-0.5">50 🪙</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-xs uppercase tracking-wider font-extrabold">STOP</span>
                <span className="text-[10px] opacity-90 font-mono font-bold mt-0.5">{3 - stoppedRings.length} LEFT</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Live Win/Result Banner */}
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
