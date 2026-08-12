"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { triggerRewardAnimation } from "@/components/RewardNotificationOverlay";
import "./SlotMachine.css";

interface WheelSegment {
  id: string;
  label: string;
  sublabel?: string;
  color: string;
  textColor: string;
  angle: number; // Arc angle in degrees
  rewardType: "coins" | "xp" | "boost" | "jackpot" | "none";
  rewardValue: number;
}

// Wheel Segments (Matching uploaded reference image palette + 10,000 Coin Thin Sliver)
const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: "s1", label: "100 COINS", color: "#f472b6", textColor: "#000000", angle: 37, rewardType: "coins", rewardValue: 100 },
  { id: "s2", label: "+100 XP", color: "#34d399", textColor: "#000000", angle: 37, rewardType: "xp", rewardValue: 100 },
  { id: "s3", label: "50 COINS", color: "#fb923c", textColor: "#000000", angle: 37, rewardType: "coins", rewardValue: 50 },
  { id: "s4", label: "250 COINS", color: "#facc15", textColor: "#000000", angle: 37, rewardType: "coins", rewardValue: 250 },
  { id: "s5", label: "+250 XP", color: "#a78bfa", textColor: "#000000", angle: 37, rewardType: "xp", rewardValue: 250 },
  { id: "s6", label: "500 COINS", color: "#10b981", textColor: "#ffffff", angle: 37, rewardType: "coins", rewardValue: 500 },
  { id: "s7", label: "2X XP BOOST", color: "#fef3c7", textColor: "#000000", angle: 37, rewardType: "boost", rewardValue: 2 },
  { id: "s8", label: "TRY AGAIN", color: "#18181b", textColor: "#ffffff", angle: 37, rewardType: "none", rewardValue: 0 },
  { id: "s9", label: "200 COINS", color: "#2dd4bf", textColor: "#000000", angle: 34, rewardType: "coins", rewardValue: 200 },
  { id: "jackpot", label: "10,000 COINS", sublabel: "JACKPOT", color: "#ffd700", textColor: "#000000", angle: 8, rewardType: "jackpot", rewardValue: 10000 }, // Ultra-thin 8° Golden Sliver!
];

export function SlotMachine() {
  const { progress, addCredits, spendCredits } = useProgress();
  const credits = progress?.credits || 0;

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [stopperFlick, setStopperFlick] = useState(false);
  const [winMessage, setWinMessage] = useState<string | null>(null);
  const [displayStatus, setDisplayStatus] = useState<"idle" | "win" | "fail">("idle");

  const blipAudioRef = useRef<HTMLAudioElement | null>(null);
  const coinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const unluckyAudioRef = useRef<HTMLAudioElement | null>(null);

  const SPIN_COST = 50;

  useEffect(() => {
    if (typeof window !== "undefined") {
      blipAudioRef.current = new Audio("/sounds/slotjs/blip.mp3");
      coinAudioRef.current = new Audio("/sounds/slotjs/coin.mp3");
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

  const handleSpin = () => {
    if (isSpinning) return;

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
    setWinMessage(null);
    setDisplayStatus("idle");

    // Random spin math: 5 full turns (1800°) + random segment landing
    const randomTurns = 5 * 360;
    const randomOffset = Math.floor(Math.random() * 360);
    const newTotalRotation = rotationAngle + randomTurns + randomOffset;

    setRotationAngle(newTotalRotation);

    // Stopper tick flick interval during spin
    const tickInterval = setInterval(() => {
      setStopperFlick(true);
      playSound(blipAudioRef.current);
      setTimeout(() => setStopperFlick(false), 80);
    }, 220);

    // Resolve landing slice after 4.5s transition
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      calculateReward(newTotalRotation);
    }, 4500);
  };

  const calculateReward = (totalRotation: number) => {
    // 12 o'clock pointer position (270° in SVG coords)
    const normalizedAngle = (360 - (totalRotation % 360) + 270) % 360;

    let currentAngleSum = 0;
    let landedSegment = WHEEL_SEGMENTS[0];

    for (const seg of WHEEL_SEGMENTS) {
      if (normalizedAngle >= currentAngleSum && normalizedAngle < currentAngleSum + seg.angle) {
        landedSegment = seg;
        break;
      }
      currentAngleSum += seg.angle;
    }

    if (landedSegment.rewardType === "jackpot") {
      playSound(winAudioRef.current);
      if (addCredits) addCredits(10000, "10,000 Coin Wheel Jackpot");
      triggerRewardAnimation({ type: "reward", xp: 2500, coins: 10000 });
      setWinMessage(`🎉 ULTRA JACKPOT! YOU WON +10,000 COINS & +2,500 XP!`);
      setDisplayStatus("win");
    } else if (landedSegment.rewardType === "coins") {
      playSound(winAudioRef.current);
      if (addCredits) addCredits(landedSegment.rewardValue, `Wheel Win: ${landedSegment.label}`);
      triggerRewardAnimation({ type: "reward", coins: landedSegment.rewardValue });
      setWinMessage(`✨ YOU WON +${landedSegment.rewardValue} COINS!`);
      setDisplayStatus("win");
    } else if (landedSegment.rewardType === "xp") {
      playSound(winAudioRef.current);
      triggerRewardAnimation({ type: "reward", xp: landedSegment.rewardValue });
      setWinMessage(`⭐ YOU WON +${landedSegment.rewardValue} XP!`);
      setDisplayStatus("win");
    } else if (landedSegment.rewardType === "boost") {
      playSound(winAudioRef.current);
      triggerRewardAnimation({ type: "reward", xp: 300 });
      setWinMessage(`🚀 2X XP BOOST ACTIVATED! (+300 XP Bonus)`);
      setDisplayStatus("win");
    } else {
      playSound(unluckyAudioRef.current);
      setWinMessage("Unlucky! Give it another spin!");
      setDisplayStatus("fail");
    }
  };

  // SVG Arc Math Helper
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-6 pb-14 px-4 border-t border-white/10 mt-16 font-manrope bg-transparent">
      {/* Banner Above Spinner Wheel */}
      <div className="w-full max-w-xl mx-auto mb-6 px-2">
        <img
          src="/images/SPINNERBANNER.png"
          alt="AP Lab Wheel Spinner"
          className="w-full h-auto object-contain rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-white/10"
        />
      </div>

      {/* Wheel Spinner Container with Top Stopper Arrow */}
      <div className="clean-wheel-container">
        {/* Animated Stopper Arrow (12 o'clock) */}
        <motion.div
          animate={stopperFlick ? { rotate: -22 } : { rotate: 0 }}
          transition={{ duration: 0.08 }}
          className="clean-wheel-stopper"
        >
          <svg className="w-7 h-9 text-white fill-current" viewBox="0 0 24 32">
            <path d="M12 32 L3 8 C3 3.5 7 0 12 0 C17 0 21 3.5 21 8 Z" fill="#ffffff" stroke="#000000" strokeWidth="2" />
          </svg>
        </motion.div>

        {/* Rotating SVG Wheel Canvas */}
        <div
          className="clean-wheel-canvas"
          style={{
            transform: `rotate(${rotationAngle}deg)`,
            transition: isSpinning ? "transform 4.5s cubic-bezier(0.15, 0.99, 0.25, 1)" : "none"
          }}
        >
          <svg className="w-full h-full" viewBox="-1 -1 2 2" style={{ transform: "rotate(0deg)" }}>
            {(() => {
              let cumulativeAngle = 0;
              return WHEEL_SEGMENTS.map((seg, idx) => {
                const startPercent = cumulativeAngle / 360;
                cumulativeAngle += seg.angle;
                const endPercent = cumulativeAngle / 360;

                const [startX, startY] = getCoordinatesForPercent(startPercent);
                const [endX, endY] = getCoordinatesForPercent(endPercent);
                const largeArcFlag = seg.angle > 180 ? 1 : 0;

                const pathData = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

                // Outer perimeter dot position
                const midPercent = (startPercent + endPercent) / 2;
                const dotRadius = 0.88;
                const dotX = Math.cos(2 * Math.PI * midPercent) * dotRadius;
                const dotY = Math.sin(2 * Math.PI * midPercent) * dotRadius;

                // Text radial rotation math
                const midAngleDeg = midPercent * 360;
                const textRadius = 0.58;
                const textX = Math.cos(2 * Math.PI * midPercent) * textRadius;
                const textY = Math.sin(2 * Math.PI * midPercent) * textRadius;

                return (
                  <g key={idx}>
                    {/* Slice Path */}
                    <path d={pathData} fill={seg.color} stroke="#000000" strokeWidth="0.012" />

                    {/* Outer Rim Perimeter Dot (Matching reference screenshot) */}
                    <circle cx={dotX} cy={dotY} r="0.032" fill="#000000" />

                    {/* Radial Label */}
                    <text
                      x={textX}
                      y={textY}
                      fill={seg.textColor}
                      fontSize={seg.rewardType === "jackpot" ? "0.048" : "0.056"}
                      fontWeight="900"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${midAngleDeg + 90}, ${textX}, ${textY})`}
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              });
            })()}
          </svg>
        </div>

        {/* Center Interactive Spin Button Hub */}
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className="clean-wheel-center-btn"
        >
          {!isSpinning ? (
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-wider font-black text-white">SPIN</span>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="text-[11px] font-mono font-bold text-amber-400">50</span>
                <img 
                  src="/images/coin-zoomed.png" 
                  alt="Coin" 
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain inline-block" 
                />
              </div>
            </div>
          ) : (
            <span className="text-xs uppercase tracking-wider font-black text-amber-400 animate-pulse">SPINNING</span>
          )}
        </button>
      </div>

      {/* Live Win Banner */}
      <AnimatePresence>
        {winMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`mt-6 px-6 py-3.5 rounded-2xl font-manrope font-extrabold text-sm text-center shadow-lg max-w-md border ${
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
