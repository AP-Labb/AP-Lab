"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useProgress } from "@/context/ProgressContext";
import { triggerRewardAnimation } from "@/components/RewardNotificationOverlay";
import "./SlotMachine.css";

interface WheelSegment {
  id: string;
  amountText: string;
  iconSrc?: string;
  color: string;
  textColor: string;
  angle: number; // Arc angle in degrees
  probability: number; // Drop probability percentage
  rewardType: "coins" | "xp" | "boost" | "jackpot" | "none";
  rewardValue: number;
}

// Wheel Segments with Weighted Probabilities, Larger Slice Images, & White Sad Face Icon!
const WHEEL_SEGMENTS: WheelSegment[] = [
  { id: "s1", amountText: "100", iconSrc: "/images/coin-zoomed.png", color: "#f472b6", textColor: "#000000", angle: 37, probability: 14.0, rewardType: "coins", rewardValue: 100 },
  { id: "s2", amountText: "100", iconSrc: "/images/xp-shield-zoomed.png", color: "#34d399", textColor: "#000000", angle: 37, probability: 10.0, rewardType: "xp", rewardValue: 100 },
  { id: "s3", amountText: "50", iconSrc: "/images/coin-zoomed.png", color: "#fb923c", textColor: "#000000", angle: 37, probability: 22.0, rewardType: "coins", rewardValue: 50 },
  { id: "s4", amountText: "250", iconSrc: "/images/coin-zoomed.png", color: "#facc15", textColor: "#000000", angle: 37, probability: 3.0, rewardType: "coins", rewardValue: 250 },
  { id: "s5", amountText: "250", iconSrc: "/images/xp-shield-zoomed.png", color: "#a78bfa", textColor: "#000000", angle: 37, probability: 4.5, rewardType: "xp", rewardValue: 250 },
  { id: "s6", amountText: "500", iconSrc: "/images/coin-zoomed.png", color: "#10b981", textColor: "#ffffff", angle: 37, probability: 1.0, rewardType: "coins", rewardValue: 500 },
  { id: "s7", amountText: "2X", iconSrc: "/images/2x-xp-boost.png", color: "#fef3c7", textColor: "#000000", angle: 37, probability: 0.4, rewardType: "boost", rewardValue: 2 },
  { id: "s8", amountText: "TRY AGAIN", iconSrc: undefined, color: "#121216", textColor: "#ffffff", angle: 37, probability: 38.0, rewardType: "none", rewardValue: 0 },
  { id: "s9", amountText: "200", iconSrc: "/images/coin-zoomed.png", color: "#2dd4bf", textColor: "#000000", angle: 34, probability: 7.0, rewardType: "coins", rewardValue: 200 },
  { id: "jackpot", amountText: "10,000", iconSrc: "/images/coin-zoomed.png", color: "url(#jackpotGoldGradient)", textColor: "#000000", angle: 30, probability: 0.1, rewardType: "jackpot", rewardValue: 10000 },
];

export function SlotMachine() {
  const { progress, addCredits, spendCredits, claimSocialXp, useBoostItem } = useProgress();
  const credits = progress?.credits || 0;

  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false); // Squiggle arrow fades away on spin!
  const [rotationAngle, setRotationAngle] = useState(0);
  const [stopperFlick, setStopperFlick] = useState(false);
  const [showOddsModal, setShowOddsModal] = useState(false);

  const blipAudioRef = useRef<HTMLAudioElement | null>(null);
  const coinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const unluckyAudioRef = useRef<HTMLAudioElement | null>(null);

  const animFrameRef = useRef<number | null>(null);
  const lastSegmentIndexRef = useRef<number>(-1);

  const SPIN_COST = 50;

  useEffect(() => {
    if (typeof window !== "undefined") {
      blipAudioRef.current = new Audio("/sounds/slotjs/blip.mp3");
      coinAudioRef.current = new Audio("/sounds/slotjs/coin.mp3");
      winAudioRef.current = new Audio("/sounds/slotjs/win.mp3");
      unluckyAudioRef.current = new Audio("/sounds/slotjs/unlucky.mp3");
    }
  }, []);

  const playSound = (audio: HTMLAudioElement | null, volume = 1.0) => {
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  // Weighted random probability selection
  const selectWeightedSegment = (): { segment: WheelSegment; index: number } => {
    const random = Math.random() * 100;
    let cumulative = 0;
    for (let i = 0; i < WHEEL_SEGMENTS.length; i++) {
      cumulative += WHEEL_SEGMENTS[i].probability;
      if (random <= cumulative) {
        return { segment: WHEEL_SEGMENTS[i], index: i };
      }
    }
    return { segment: WHEEL_SEGMENTS[7], index: 7 }; // Fallback to TRY AGAIN
  };

  const handleSpin = () => {
    if (isSpinning) return;

    if (credits < SPIN_COST) {
      playSound(unluckyAudioRef.current, 1.0);
      return;
    }

    if (spendCredits) spendCredits(SPIN_COST);
    playSound(coinAudioRef.current, 1.0);

    setIsSpinning(true);
    setHasSpun(true);

    // Pick outcome based on actual drop probabilities
    const { segment: targetSeg, index: targetIdx } = selectWeightedSegment();

    // Calculate angle range for chosen segment
    let segStartAngle = 0;
    for (let i = 0; i < targetIdx; i++) {
      segStartAngle += WHEEL_SEGMENTS[i].angle;
    }
    const segCenterAngle = segStartAngle + targetSeg.angle / 2;

    // Angle needed so segCenterAngle lands at 270° (12 o'clock pointer)
    const targetOffset = (360 - segCenterAngle + 270) % 360;
    const fullTurns = 5 * 360; // 5 full rotations

    const currentRotationMod = rotationAngle % 360;
    const targetModOffset = (targetOffset - currentRotationMod + 360) % 360;
    const targetRotation = rotationAngle + fullTurns + targetModOffset;

    const startRotation = rotationAngle;
    const startTime = performance.now();
    const duration = 4500; // 4.5s spin

    const animateFrame = (now: number) => {
      const elapsed = now - startTime;
      const progressRatio = Math.min(1, elapsed / duration);

      // Smooth cubic ease-out deceleration physics
      const easedProgress = 1 - Math.pow(1 - progressRatio, 3);
      const currentAngle = startRotation + (targetRotation - startRotation) * easedProgress;

      setRotationAngle(currentAngle);

      // Frame-accurate slice crossing tick detection at 12 o'clock (270°)
      const pointerAngle = (360 - (currentAngle % 360) + 270) % 360;
      let angleAcc = 0;
      let activeSegmentIndex = 0;

      for (let i = 0; i < WHEEL_SEGMENTS.length; i++) {
        if (pointerAngle >= angleAcc && pointerAngle < angleAcc + WHEEL_SEGMENTS[i].angle) {
          activeSegmentIndex = i;
          break;
        }
        angleAcc += WHEEL_SEGMENTS[i].angle;
      }

      // Frame-accurate tick audio & stopper flick
      if (activeSegmentIndex !== lastSegmentIndexRef.current) {
        lastSegmentIndexRef.current = activeSegmentIndex;
        playSound(blipAudioRef.current, 1.0);
        setStopperFlick(true);
        setTimeout(() => setStopperFlick(false), 50);
      }

      if (progressRatio < 1) {
        animFrameRef.current = requestAnimationFrame(animateFrame);
      } else {
        setIsSpinning(false);
        calculateReward(targetSeg);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateFrame);
  };

  const calculateReward = (landedSegment: WheelSegment) => {
    if (landedSegment.rewardType === "jackpot") {
      playSound(winAudioRef.current, 1.0);

      // Screen-wide confetti burst cannons for 10,000 Coin Jackpot!
      confetti({
        particleCount: 180,
        spread: 120,
        origin: { y: 0.5 },
        zIndex: 99999,
      });
      setTimeout(() => {
        confetti({ particleCount: 120, angle: 60, spread: 80, origin: { x: 0 }, zIndex: 99999 });
        confetti({ particleCount: 120, angle: 120, spread: 80, origin: { x: 1 }, zIndex: 99999 });
      }, 350);

      if (addCredits) addCredits(10000, "10,000 Coin Wheel Jackpot");
      if (claimSocialXp) claimSocialXp("10,000 Coin Wheel Jackpot", 2500);
      triggerRewardAnimation({ type: "reward", xp: 2500, coins: 10000 });

    } else if (landedSegment.rewardType === "coins") {
      playSound(winAudioRef.current, 1.0);
      if (addCredits) addCredits(landedSegment.rewardValue, `Wheel Win: ${landedSegment.amountText} Coins`);
      triggerRewardAnimation({ type: "reward", coins: landedSegment.rewardValue });

    } else if (landedSegment.rewardType === "xp") {
      playSound(winAudioRef.current, 1.0);
      // Actually register & award XP into user profile & leveling system!
      if (claimSocialXp) claimSocialXp(`Wheel Win: ${landedSegment.amountText} XP`, landedSegment.rewardValue);
      triggerRewardAnimation({ type: "reward", xp: landedSegment.rewardValue });

    } else if (landedSegment.rewardType === "boost") {
      playSound(winAudioRef.current, 1.0);
      // Activate actual 2X XP boost on user account!
      if (useBoostItem) useBoostItem("2x_xp_boost");
      if (claimSocialXp) claimSocialXp("Wheel Win: 2X XP Boost Bonus", 300);
      triggerRewardAnimation({ type: "reward", xp: 300 });

    } else {
      playSound(unluckyAudioRef.current, 1.0);
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
      {/* 1. Large Wide SPINNERBANNER.png Image spreading to both sides of the screen (NO Outline) */}
      <div className="w-full max-w-[1100px] mx-auto mb-8 px-2">
        <img
          src="/images/SPINNERBANNER.png"
          alt="AP Lab Wheel Spinner"
          className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] border-none block"
        />
      </div>

      {/* Wheel Spinner Outer Container */}
      <div className="clean-wheel-wrapper">
        
        {/* Top-Right White Circle "?" Button for Drop Probabilities */}
        <div className="w-full max-w-[500px] flex justify-end mb-3 pr-2">
          <button
            onClick={() => setShowOddsModal(true)}
            className="w-8 h-8 rounded-full bg-white text-black font-black text-sm flex items-center justify-center hover:scale-110 shadow-md transition-transform cursor-pointer"
            title="Wheel Drop Probabilities"
          >
            ?
          </button>
        </div>

        <div className="clean-wheel-container">
          
          {/* White Squiggle Arrow pointing directly to 10,000 Jackpot Sliver at top-left (fades out on spin!) */}
          <img
            src="/images/jackpot-arrow.png"
            alt="Jackpot Arrow"
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain absolute -top-14 -left-12 sm:-top-16 sm:-left-16 pointer-events-none z-50 transition-opacity duration-500 transform -rotate-12"
            style={{ opacity: hasSpun ? 0 : 1 }}
          />

          {/* Top Animated Stopper Arrow (12 o'clock) */}
          <motion.div
            animate={stopperFlick ? { rotate: -24 } : { rotate: 0 }}
            transition={{ duration: 0.05 }}
            className="clean-wheel-stopper"
          >
            <svg className="w-8 h-10 text-white fill-current" viewBox="0 0 24 32">
              <path d="M12 32 L3 8 C3 3.5 7 0 12 0 C17 0 21 3.5 21 8 Z" fill="#ffffff" stroke="#000000" strokeWidth="2" />
            </svg>
          </motion.div>

          {/* Rotating SVG Wheel Canvas */}
          <div
            className="clean-wheel-canvas"
            style={{
              transform: `rotate(${rotationAngle}deg)`
            }}
          >
            <svg className="w-full h-full" viewBox="-1 -1 2 2">
              <defs>
                {/* Animated Shimmer Gradient for 10,000 Jackpot Sliver */}
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
                  const textRadius = 0.63;
                  const textX = Math.cos(2 * Math.PI * midPercent) * textRadius;
                  const textY = Math.sin(2 * Math.PI * midPercent) * textRadius;

                  const iconRadius = 0.36;
                  const iconX = Math.cos(2 * Math.PI * midPercent) * iconRadius;
                  const iconY = Math.sin(2 * Math.PI * midPercent) * iconRadius;

                  return (
                    <g key={idx}>
                      {/* Slice Path */}
                      <path d={pathData} fill={seg.color} stroke="#000000" strokeWidth="0.012" />

                      {/* Outer Rim Perimeter Dot */}
                      <circle cx={dotX} cy={dotY} r="0.028" fill="#000000" />

                      {/* Label Text */}
                      <text
                        x={textX}
                        y={textY}
                        fill={seg.textColor}
                        fontSize={seg.rewardType === "jackpot" ? "0.044" : "0.052"}
                        fontWeight="900"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                        dominantBaseline="central"
                        transform={`rotate(${midAngleDeg + 90}, ${textX}, ${textY})`}
                      >
                        {seg.amountText}
                      </text>

                      {/* Slice Image Icons (Coins, XP Shields, 2X Boost) - LARGER SIZE (0.18 x 0.18)! */}
                      {seg.iconSrc && (
                        <image
                          href={seg.iconSrc}
                          x={iconX - 0.09}
                          y={iconY - 0.09}
                          width="0.18"
                          height="0.18"
                          transform={`rotate(${midAngleDeg + 90}, ${iconX}, ${iconY})`}
                        />
                      )}

                      {/* Simple White Sad Face SVG Icon on Black TRY AGAIN Slice */}
                      {seg.id === "s8" && (
                        <g transform={`rotate(${midAngleDeg + 90}, ${iconX}, ${iconY})`}>
                          <circle cx={iconX} cy={iconY} r="0.065" fill="none" stroke="#ffffff" strokeWidth="0.012" />
                          <circle cx={iconX - 0.022} cy={iconY - 0.02} r="0.009" fill="#ffffff" />
                          <circle cx={iconX + 0.022} cy={iconY - 0.02} r="0.009" fill="#ffffff" />
                          <path
                            d={`M ${iconX - 0.025} ${iconY + 0.028} Q ${iconX} ${iconY + 0.005} ${iconX + 0.025} ${iconY + 0.028}`}
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="0.01"
                            strokeLinecap="round"
                          />
                        </g>
                      )}
                    </g>
                  );
                });
              })()}
            </svg>
          </div>

          {/* Center Interactive Spin Button Hub with MUCH LARGER Coin Image */}
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
                    className="w-7 h-7 sm:w-10 sm:h-10 object-contain inline-block transform scale-150 drop-shadow-md" 
                  />
                </div>
              </div>
            ) : (
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-black text-amber-400 animate-pulse">SPINNING</span>
            )}
          </button>
        </div>
      </div>

      {/* Sleek Minimalist Drop Odds Probability Modal */}
      <AnimatePresence>
        {showOddsModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-sm bg-[#121420] border border-white/15 rounded-3xl p-6 shadow-2xl text-white relative"
            >
              <button
                onClick={() => setShowOddsModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>

              <h3 className="font-manrope font-black text-xl text-white mb-1">
                Wheel Probabilities
              </h3>
              <p className="text-xs text-white/60 mb-5">
                Exact drop rates for each spinner reward:
              </p>

              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {WHEEL_SEGMENTS.map((seg) => (
                  <div
                    key={seg.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      {seg.color.startsWith("url") ? (
                        <div className="w-4 h-4 rounded-full bg-amber-400 shadow-[0_0_8px_#ffd700]" />
                      ) : (
                        <div
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: seg.color }}
                        />
                      )}
                      <span className="font-manrope font-extrabold text-sm text-white">
                        {seg.amountText} {seg.rewardType === "coins" || seg.rewardType === "jackpot" ? "Coins" : seg.rewardType === "xp" ? "XP" : seg.rewardType === "boost" ? "XP Boost" : ""}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-sm text-amber-400">
                      {seg.probability}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-center">
                <button
                  onClick={() => setShowOddsModal(false)}
                  className="w-full py-3 rounded-xl bg-white text-black font-manrope font-black text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
