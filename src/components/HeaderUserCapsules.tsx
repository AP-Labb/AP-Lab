"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, X, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { getXpThresholdForLevel } from "@/lib/xpProgression";
import { LevelBadge } from "@/components/LevelBadge";
import { MinecraftInventoryModal } from "@/components/MinecraftInventoryModal";
import { cn } from "@/lib/utils";

import { ActiveBoostHUD } from "@/components/ActiveBoostHUD";
import { StreakFlameIcon } from "@/components/StreakFlameIcon";

interface HeaderUserCapsulesProps {
  onOpenProfile?: () => void;
}

import { playXpGainTick, playXpGainEnd, playCoinSpendTick, playCoinSpendEnd } from "@/lib/soundEffects";

function AnimatedCounter({ value, type = "xp", className }: { value: number; type?: "xp" | "coin"; className?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isPulsing, setIsPulsing] = useState(false);
  const prevValueRef = React.useRef(value);
  const lastSoundTickRef = React.useRef(0);

  useEffect(() => {
    if (prevValueRef.current === value) return;

    const startVal = prevValueRef.current;
    const endVal = value;
    prevValueRef.current = value;
    const isGain = endVal > startVal;

    setIsPulsing(true);
    const duration = 800;
    const startTime = performance.now();

    const animateNumber = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 2);

      const current = Math.round(startVal + (endVal - startVal) * eased);
      setDisplayValue(current);

      if (currentTime - lastSoundTickRef.current > 75) {
        lastSoundTickRef.current = currentTime;
        if (isGain) playXpGainTick(progress);
        else playCoinSpendTick(progress);
      }

      if (progress < 1) {
        requestAnimationFrame(animateNumber);
      } else {
        setIsPulsing(false);
        if (isGain) playXpGainEnd();
        else playCoinSpendEnd();
      }
    };

    requestAnimationFrame(animateNumber);
  }, [value]);

  return (
    <motion.span
      animate={isPulsing ? { scale: [1, 1.25, 1] } : { scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {displayValue.toLocaleString()}
    </motion.span>
  );
}

export function HeaderUserCapsules({ onOpenProfile }: HeaderUserCapsulesProps) {
  const router = useRouter();
  const { progress } = useProgress();

  const [activeMenu, setActiveMenu] = useState<"none" | "streak" | "xp" | "coins">("none");
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const xp = progress?.xp || 0;
  const level = progress?.level || 1;
  const credits = progress?.credits || 0;
  const streak = progress?.streakCount || 0;
  const hasStreak = streak >= 2;

  // XP Progress math matching uploaded Knowt screenshot
  const currentLevelThreshold = getXpThresholdForLevel(level);
  const nextLevelThreshold = getXpThresholdForLevel(level + 1);
  const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
  const xpInCurrentLevel = Math.max(0, xp - currentLevelThreshold);
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  const handleOpenProfile = () => {
    if (onOpenProfile) {
      onOpenProfile();
    } else {
      router.push("/dashboard/progress");
    }
  };

  // Day indicators for week streak popup (S M T W T F S)
  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDayIndex = new Date().getDay(); // 0 is Sunday

  // Streak last active calculation for realistic hours remaining
  const lastActiveStr = progress?.streakLastActive || "";
  let hoursRemaining = 17;
  let minsRemaining = 38;
  if (lastActiveStr) {
    const lastActiveDate = new Date(lastActiveStr);
    const now = new Date();
    const diffMs = now.getTime() - lastActiveDate.getTime();
    const hoursPassed = diffMs / (1000 * 60 * 60);
    if (hoursPassed < 24) {
      const remainingTotalMins = Math.max(0, Math.floor((24 - hoursPassed) * 60));
      hoursRemaining = Math.floor(remainingTotalMins / 60);
      minsRemaining = remainingTotalMins % 60;
    }
  }

  return (
    <>
      <div className="flex items-center space-x-2.5 font-manrope select-none relative z-50">
        
        {/* Active Boost HUD (10-Hour Countdown Timer) */}
        <ActiveBoostHUD />

        {/* 1. STREAK CAPSULE WITH WEEKLY HOVER MENU */}
        <div 
          className="relative"
          onMouseEnter={() => setActiveMenu("streak")}
          onMouseLeave={() => setActiveMenu("none")}
        >
          <div 
            className={cn(
              "h-12 flex items-center space-x-2.5 px-4 rounded-full transition-all cursor-pointer border shadow-md",
              streak >= 1 
                ? "bg-[#2b170e] hover:bg-[#381e11] border-orange-500/40 text-orange-400" 
                : "bg-[#14151f] hover:bg-[#1a1c2a] border-white/10 text-white/60"
            )}
            title={`${streak} Day Study Streak`}
          >
            <StreakFlameIcon streakCount={streak} sizeClassName="w-9 h-9" />
            <span className="font-manrope font-extrabold text-lg leading-none text-orange-400">
              {streak}
            </span>
          </div>

          {/* Streak Hover Menu */}
          <AnimatePresence>
            {activeMenu === "streak" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 sm:right-auto sm:-left-20 top-full mt-2.5 w-[310px] max-w-[calc(100vw-2rem)] bg-[#1a1b22] border-2 border-[#f97316]/70 rounded-[28px] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-[99999] text-center text-white flex flex-col items-center justify-center"
              >
                {/* Large Flame Icon + Streak Count Perfectly Centered */}
                <div className="flex items-center justify-center space-x-3 my-1">
                  <StreakFlameIcon streakCount={streak} sizeClassName="w-20 h-20 shrink-0" />
                  <span className="font-manrope font-black text-5xl text-[#f97316]">{streak}</span>
                </div>

                {/* Encouragement Subtitle */}
                <p className="text-xs font-manrope font-semibold text-white/90 leading-relaxed my-3 px-1 text-center">
                  Great job! Come back tomorrow to continue your streak!
                </p>

                {/* Weekday Flame/Circle Row Box with Dotted Circle for Today */}
                <div className="bg-[#0e0f15] border border-white/10 rounded-2xl p-3 sm:p-4 mb-4 w-full">
                  <div className="flex items-center justify-between gap-1">
                    {daysOfWeek.map((day, idx) => {
                      const isToday = idx === currentDayIndex;
                      const isCompleted = streak >= 1 && idx <= currentDayIndex && (currentDayIndex - idx) < streak;

                      return (
                        <div key={idx} className="flex flex-col items-center space-y-1.5 flex-1 min-w-0">
                          <div className={cn(
                            "w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0 rounded-full transition-all mx-auto",
                            isToday ? "border-2 border-dashed border-orange-400 bg-orange-500/10" : ""
                          )}>
                            {isCompleted ? (
                              <StreakFlameIcon streakCount={Math.max(1, streak)} sizeClassName="w-6 h-6 sm:w-7 sm:h-7" />
                            ) : (
                              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-800/80 border border-white/5" />
                            )}
                          </div>
                          <span className="text-[11px] font-manrope font-extrabold text-white text-center block">
                            {day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Single View Calendar Button */}
                <button
                  onClick={() => router.push("/dashboard/progress")}
                  className="w-full py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-manrope font-black text-xs transition-all text-center cursor-pointer shadow-lg active:scale-95"
                >
                  View Calendar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. XP / LEVEL CAPSULE WITH HOVER POPUP */}
        <div 
          className="relative"
          onMouseEnter={() => setActiveMenu("xp")}
          onMouseLeave={() => setActiveMenu("none")}
        >
          <div 
            className="h-12 flex items-center space-x-2.5 bg-[#1b172e] hover:bg-[#231e3d] border border-purple-500/40 px-4 rounded-full transition-all cursor-pointer shadow-md"
          >
            <div className="w-11 h-11 flex items-center justify-center shrink-0 -ml-1">
              <img 
                src="/images/xp-shield-zoomed.png" 
                alt="XP Shield" 
                className="w-full h-full object-contain transform scale-125" 
              />
            </div>
            <AnimatedCounter value={level} className="font-manrope font-extrabold text-lg text-purple-300 leading-none" />
          </div>

          {/* XP Hover Popup matching uploaded screenshot */}
          <AnimatePresence>
            {activeMenu === "xp" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 top-full mt-3 w-80 bg-[#161722] border-2 border-purple-500/50 rounded-[28px] p-6 shadow-2xl z-[9999] text-left text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-manrope font-bold text-xl text-white">Level {level}</span>
                </div>

                {/* Progress Bar with next level badge circle pinned at end */}
                <div className="relative mb-3">
                  <div className="h-4 w-full bg-[#0a0b12] rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 bg-[length:200%_200%] animate-gradient-x rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
                    />
                  </div>
                  {/* Next Level Badge Circle on Right */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#1b172e] border-2 border-purple-500 flex items-center justify-center font-manrope font-extrabold text-xs text-purple-300 shadow-md">
                    {level + 1}
                  </div>
                </div>

                <div className="text-xs font-mono font-medium text-white/50 mb-6">
                  {xpInCurrentLevel}/{xpNeededForNextLevel}XP
                </div>

                {/* Action Buttons matching screenshot */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowBadgesModal(true)}
                    className="py-3 px-4 rounded-full bg-[#222433] hover:bg-[#2b2d40] border border-white/10 text-white font-manrope font-bold text-xs transition-all text-center cursor-pointer"
                  >
                    View badges
                  </button>
                  <button
                    onClick={handleOpenProfile}
                    className="py-3 px-4 rounded-full bg-white hover:bg-neutral-200 text-black font-manrope font-bold text-xs transition-all text-center cursor-pointer shadow-md"
                  >
                    View Profile
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. COINS / CREDITS CAPSULE WITH HOVER POPUP */}
        <div 
          className="relative"
          onMouseEnter={() => setActiveMenu("coins")}
          onMouseLeave={() => setActiveMenu("none")}
        >
          <div 
            onClick={() => router.push("/shop")}
            className="h-12 flex items-center space-x-2.5 bg-[#2b2114] hover:bg-[#382b1a] border border-amber-500/40 px-4 rounded-full transition-all cursor-pointer shadow-md"
          >
            <div className="w-11 h-11 flex items-center justify-center shrink-0 -ml-1">
              <img 
                src="/images/coin-zoomed.png" 
                alt="Coins" 
                className="w-full h-full object-contain transform scale-125" 
              />
            </div>
            <AnimatedCounter value={credits} className="font-manrope font-extrabold text-lg text-amber-400 tracking-tight leading-none" />
          </div>

          {/* Coins Hover Popup matching exact uploaded screenshot */}
          <AnimatePresence>
            {activeMenu === "coins" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 top-full mt-3 w-80 bg-[#161722] border-2 border-amber-500/50 rounded-[28px] p-6 shadow-2xl z-[9999] text-left text-white"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-manrope font-bold text-white/50 block">Your Coins</span>
                    <span className="font-manrope font-extrabold text-4xl text-amber-400 tracking-tight block mt-1">
                      {credits.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-24 h-24 flex items-center justify-center shrink-0 -mr-2">
                    <img 
                      src="/images/coin-zoomed.png" 
                      alt="Coins" 
                      className="w-full h-full object-contain transform scale-125 drop-shadow-xl" 
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setActiveMenu("none");
                      setShowInventoryModal(true);
                    }}
                    className="py-3 px-4 rounded-full bg-[#222433] hover:bg-[#2b2d40] border border-white/10 text-white font-manrope font-bold text-xs transition-all text-center cursor-pointer"
                  >
                    My Inventory
                  </button>
                  <button
                    onClick={() => router.push("/shop")}
                    className="py-3 px-4 rounded-full bg-white hover:bg-neutral-200 text-black font-manrope font-bold text-xs transition-all text-center cursor-pointer shadow-md"
                  >
                    Go to store
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <MinecraftInventoryModal isOpen={showInventoryModal} onClose={() => setShowInventoryModal(false)} />

      {/* 100 LEVEL BADGES MODAL (PORTALIZED TO DOCUMENT.BODY FOR ZERO-CLIPPING CENTERED MODAL) */}
      {mounted && createPortal(
        <AnimatePresence>
          {showBadgesModal && (
            <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-4xl bg-[#0b0c14] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[85vh] text-left text-white"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div>
                    <h3 className="font-manrope text-2xl font-black text-white">
                      Level Badges (1 - 100)
                    </h3>
                    <p className="text-xs text-white/50 font-manrope mt-0.5">
                      Current Level: <span className="text-emerald-400 font-extrabold">Level {level}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowBadgesModal(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Spacious 100 Badges Grid (Zero Overlap, No Level Text Cutoffs) */}
                <div 
                  data-lenis-prevent="true"
                  className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5 p-3"
                >
                  {Array.from({ length: 100 }, (_, i) => i + 1).map((lvl) => {
                    const isCurrent = level === lvl;
                    const isUnlocked = level >= lvl;

                    return (
                      <div
                        key={lvl}
                        className={cn(
                          "p-2 rounded-2xl border flex items-center justify-center text-center transition-all min-h-[60px] w-full relative overflow-hidden group cursor-pointer hover:bg-white hover:border-white shadow-sm",
                          isCurrent 
                            ? "bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] font-bold scale-105 z-10" 
                            : (isUnlocked 
                                ? "bg-white/5 border-white/10 hover:border-white" 
                                : "bg-white/[0.02] border-white/5 opacity-40 grayscale")
                        )}
                      >
                        {/* Normal Badge Icon */}
                        <div className="group-hover:opacity-0 transition-opacity">
                          <LevelBadge level={lvl} size="sm" showLabel={false} />
                        </div>

                        {/* Hover Overlay: Pure White Background with Bold Black Level Number */}
                        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center font-manrope font-extrabold text-black opacity-0 group-hover:opacity-100 transition-all duration-150 z-20">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-black/60 font-bold leading-none mb-0.5">LVL</span>
                          <span className="text-base font-extrabold leading-none">{lvl}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
