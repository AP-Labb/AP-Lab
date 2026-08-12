"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { triggerRewardAnimation } from "@/components/RewardNotificationOverlay";
import "./SlotMachine.css";

interface WheelSegment {
  id: string;
  amountText: string;
  iconType: "coin" | "xp" | "none";
  color: string;
  textColor: string;
  angle: number; // Arc angle in degrees
  rewardType: "coins" | "xp" | "boost" | "jackpot" | "none";
  rewardValue: number;
}

// Wheel Segments with SVG Image Icons (Coins & XP Shields) instead of plain text!
const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: "s1", amountText: "100", iconType: "coin", color: "#f472b6", textColor: "#000000", angle: 37, rewardType: "coins", rewardValue: 100 },
  { id: "s2", amountText: "100", iconType: "xp", color: "#34d399", textColor: "#000000", angle: 37, rewardType: "xp", rewardValue: 100 },
  { id: "s3", amountText: "50", iconType: "coin", color: "#fb923c", textColor: "#000000", angle: 37, rewardType: "coins", rewardValue: 50 },
  { id: "s4", amountText: "250", iconType: "coin", color: "#facc15", textColor: "#000000", angle: 37, rewardType: "coins", rewardValue: 250 },
  { id: "s5", amountText: "250", iconType: "xp", color: "#a78bfa", textColor: "#000000", angle: 37, rewardType: "xp", rewardValue: 250 },
  { id: "s6", amountText: "500", iconType: "coin", color: "#10b981", textColor: "#ffffff", angle: 37, rewardType: "coins", rewardValue: 500 },
  { id: "s7", amountText: "2X", iconType: "xp", color: "#fef3c7", textColor: "#000000", angle: 37, rewardType: "boost", rewardValue: 2 },
  { id: "s8", amountText: "TRY AGAIN", iconType: "none", color: "#18181b", textColor: "#ffffff", angle: 37, rewardType: "none", rewardValue: 0 },
  { id: "s9", amountText: "200", iconType: "coin", color: "#2dd4bf", textColor: "#000000", angle: 34, rewardType: "coins", rewardValue: 200 },
  { id: "jackpot", amountText: "10,000", iconType: "coin", color: "url(#jackpotGoldGradient)", textColor: "#000000", angle: 8, rewardType: "jackpot", rewardValue: 10000 }, // Animated Shimmer 8° Jackpot Sliver!
];

export function SlotMachine() {
  const { progress, addCredits, spendCredits } = useProgress();
  const credits = progress?.credits || 0;

  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false); // Squiggle arrow disappears after first spin!
  const [rotationAngle, setRotationAngle] = useState(0);
  const [stopperFlick, setStopperFlick] = useState(false);

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

  // Realistic dynamic decelerating tick physics audio loop
  const playDeceleratingTicks = () => {
    const tickDelays = [40, 50, 60, 75, 95, 120, 150, 185, 230, 280, 340, 410, 490, 580, 680, 800, 930, 1070, 1220];
    let cumulativeTime = 0;

    tickDelays.forEach((delay) => {
      cumulativeTime += delay;
      if (cumulativeTime < 4400) {
        setTimeout(() => {
          setStopperFlick(true);
          playSound(blipAudioRef.current);
          setTimeout(() => setStopperFlick(false), 60);
        }, cumulativeTime);
      }
    });
  };

  const handleSpin = () => {
    if (isSpinning) return;

    if (credits < SPIN_COST) {
      playSound(unluckyAudioRef.current);
      return;
    }

    if (spendCredits) spendCredits(SPIN_COST);
    playSound(coinAudioRef.current);

    setIsSpinning(true);
    setHasSpun(true); // Fade out white squiggle arrow!

    // Realistic decelerating wheel spin: 5 full turns (1800°) + random offset
    const randomTurns = 5 * 360;
    const randomOffset = Math.floor(Math.random() * 360);
    const newTotalRotation = rotationAngle + randomTurns + randomOffset;

    setRotationAngle(newTotalRotation);
    playDeceleratingTicks();

    // Resolve landed segment when wheel stops (4.5s)
    setTimeout(() => {
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
    } else if (landedSegment.rewardType === "coins") {
      playSound(winAudioRef.current);
      if (addCredits) addCredits(landedSegment.rewardValue, `Wheel Win: ${landedSegment.amountText}`);
      triggerRewardAnimation({ type: "reward", coins: landedSegment.rewardValue });
    } else if (landedSegment.rewardType === "xp") {
      playSound(winAudioRef.current);
      triggerRewardAnimation({ type: "reward", xp: landedSegment.rewardValue });
    } else if (landedSegment.rewardType === "boost") {
      playSound(winAudioRef.current);
      triggerRewardAnimation({ type: "reward", xp: 300 });
    } else {
      playSound(unluckyAudioRef.current);
    }
  };

  // SVG Arc Math Helper
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-4 pb-16 px-4 border-t border-white/10 mt-16 font-manrope bg-transparent">
      {/* 1. Large Wide SPINNERBANNER.png Image spreading to both sides of the screen */}
      <div className="w-full max-w-4xl lg:max-w-5xl mx-auto mb-8 px-2">
        <img
          src="/images/SPINNERBANNER.png"
          alt="AP Lab Wheel Spinner"
          className="w-full h-44 sm:h-60 md:h-72 object-cover rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 block"
        />
      </div>

      {/* Wheel Spinner Outer Container */}
      <div className="clean-wheel-wrapper">
        <div className="clean-wheel-container">
          
          {/* 6. White Squiggle Arrow pointing to Jackpot Sliver (fades out when user spins!) */}
          <img
            src="/images/jackpot-arrow.png"
            alt="Jackpot Arrow"
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain absolute -top-12 -right-8 sm:-top-16 sm:-right-12 pointer-events-none z-50 transition-opacity duration-500 transform rotate-12"
            style={{ opacity: hasSpun ? 0 : 1 }}
          />

          {/* Animated Stopper Arrow (12 o'clock) */}
          <motion.div
            animate={stopperFlick ? { rotate: -22 } : { rotate: 0 }}
            transition={{ duration: 0.06 }}
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
            <svg className="w-full h-full" viewBox="-1 -1 2 2">
              <defs>
                {/* 5. Animated Shimmer Gradient for 10,000 Jackpot Sliver */}
                <linearGradient id="jackpotGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="jackpot-gradient-stop1" />
                  <stop offset="50%" className="jackpot-gradient-stop2" />
                  <stop offset="100%" className="jackpot-gradient-stop1" />
                </linearGradient>
              </defs>

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

                  // Label and Icon positions
                  const midAngleDeg = midPercent * 360;
                  const textRadius = 0.60;
                  const textX = Math.cos(2 * Math.PI * midPercent) * textRadius;
                  const textY = Math.sin(2 * Math.PI * midPercent) * textRadius;

                  const iconRadius = 0.40;
                  const iconX = Math.cos(2 * Math.PI * midPercent) * iconRadius;
                  const iconY = Math.sin(2 * Math.PI * midPercent) * iconRadius;

                  return (
                    <g key={idx}>
                      {/* Slice Path */}
                      <path d={pathData} fill={seg.color} stroke="#000000" strokeWidth="0.012" />

                      {/* Outer Rim Perimeter Dot */}
                      <circle cx={dotX} cy={dotY} r="0.03" fill="#000000" />

                      {/* Label Text */}
                      <text
                        x={textX}
                        y={textY}
                        fill={seg.textColor}
                        fontSize={seg.rewardType === "jackpot" ? "0.044" : "0.054"}
                        fontWeight="900"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${midAngleDeg + 90}, ${textX}, ${textY})`}
                      >
                        {seg.amountText}
                      </text>

                      {/* 7. Image Icons (Coins & XP Shields) instead of text! */}
                      {seg.iconType === "coin" && (
                        <image
                          href="/images/coin-zoomed.png"
                          x={iconX - 0.05}
                          y={iconY - 0.05}
                          width="0.10"
                          height="0.10"
                          transform={`rotate(${midAngleDeg + 90}, ${iconX}, ${iconY})`}
                        />
                      )}
                      {seg.iconType === "xp" && (
                        <image
                          href="/images/xp-shield-zoomed.png"
                          x={iconX - 0.05}
                          y={iconY - 0.05}
                          width="0.10"
                          height="0.10"
                          transform={`rotate(${midAngleDeg + 90}, ${iconX}, ${iconY})`}
                        />
                      )}
                    </g>
                  );
                });
              })()}
            </svg>
          </div>

          {/* 4. Center Interactive Spin Button Hub with MUCH LARGER Coin Image */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="clean-wheel-center-btn"
          >
            {!isSpinning ? (
              <div className="flex flex-col items-center">
                <span className="text-[11px] sm:text-xs uppercase tracking-wider font-black text-white">SPIN</span>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="text-xs font-mono font-black text-amber-400">50</span>
                  <img 
                    src="/images/coin-zoomed.png" 
                    alt="Coin" 
                    className="w-6 h-6 sm:w-8 sm:h-8 object-contain inline-block transform scale-150 drop-shadow-md" 
                  />
                </div>
              </div>
            ) : (
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-black text-amber-400 animate-pulse">SPINNING</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
