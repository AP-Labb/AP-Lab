"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, X, Trophy, Award, Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { getXpThresholdForLevel } from "@/lib/xpProgression";
import { LevelBadge } from "@/components/LevelBadge";
import { cn } from "@/lib/utils";

interface HeaderUserCapsulesProps {
  onOpenProfile?: () => void;
}

export function HeaderUserCapsules({ onOpenProfile }: HeaderUserCapsulesProps) {
  const router = useRouter();
  const { progress } = useProgress();

  const [activeMenu, setActiveMenu] = useState<"none" | "streak" | "xp" | "coins">("none");
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const xp = progress?.xp || 0;
  const level = progress?.level || 1;
  const credits = progress?.credits || 0;
  const streak = progress?.streakCount || 0;
  const hasStreak = streak > 0;

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

  return (
    <>
      <div className="flex items-center space-x-2.5 font-manrope select-none relative z-50">
        
        {/* 1. STREAK CAPSULE WITH WEEKLY HOVER MENU */}
        <div 
          className="relative"
          onMouseEnter={() => setActiveMenu("streak")}
          onMouseLeave={() => setActiveMenu("none")}
        >
          <div 
            className={cn(
              "flex items-center space-x-2.5 px-4 py-2 rounded-full transition-all cursor-pointer shadow-lg group border",
              hasStreak 
                ? "bg-[#2b170e] hover:bg-[#381e11] border-orange-500/50" 
                : "bg-[#14151f] hover:bg-[#1a1c2a] border-white/10"
            )}
            title={`${streak} Day Study Streak`}
          >
            <Flame className={cn(
              "w-6 h-6 group-hover:scale-110 transition-transform",
              hasStreak ? "text-orange-400 fill-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" : "text-white/40 fill-white/40"
            )} />
            <span className={cn("font-manrope font-extrabold text-base", hasStreak ? "text-orange-400" : "text-white/60")}>
              {streak}
            </span>
          </div>

          {/* Streak Hover Menu matching uploaded image */}
          <AnimatePresence>
            {activeMenu === "streak" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={cn(
                  "absolute right-0 top-full mt-3 w-80 bg-[#161722] border-2 rounded-[28px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-[9999] text-center text-white",
                  hasStreak ? "border-orange-500/50" : "border-white/15"
                )}
              >
                {/* Large Flame Icon + Streak Count */}
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Flame className={cn("w-9 h-9", hasStreak ? "text-orange-400 fill-orange-400" : "text-white/40 fill-white/40")} />
                  <span className="font-manrope font-extrabold text-4xl text-white">{streak}</span>
                </div>

                <p className="text-xs font-manrope font-medium text-white/60 mb-5">
                  {hasStreak ? "Great job! Keep up your daily study streak!" : "17h 58m remaining to start your streak!"}
                </p>

                {/* Weekday Circles Box */}
                <div className="bg-[#0b0c14] border border-white/10 rounded-2xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    {daysOfWeek.map((day, idx) => {
                      const isToday = idx === currentDayIndex;
                      const isCompleted = hasStreak && idx <= currentDayIndex;

                      return (
                        <div key={idx} className="flex flex-col items-center space-y-2">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                            isCompleted 
                              ? "bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.6)]" 
                              : (isToday ? "border-2 border-dashed border-orange-400 text-orange-400" : "bg-white/5 text-white/20")
                          )}>
                            {isCompleted ? "✓" : ""}
                          </div>
                          <span className={cn("text-xs font-bold font-mono", isToday ? "text-orange-400" : "text-white/50")}>
                            {day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* View Calendar Button */}
                <button
                  onClick={() => router.push("/dashboard/progress")}
                  className="w-full py-3.5 rounded-full bg-white hover:bg-neutral-200 text-black font-manrope font-extrabold text-sm transition-all text-center cursor-pointer shadow-md"
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
            className="flex items-center space-x-2.5 bg-[#1b172e] hover:bg-[#231e3d] border border-purple-500/30 px-4 py-2 rounded-full transition-all cursor-pointer shadow-lg group"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0 overflow-hidden">
              <img 
                src="/images/xp-shield-zoomed.png" 
                alt="XP Shield" 
                className="w-full h-full object-contain group-hover:scale-115 transition-transform drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" 
              />
            </div>
            <span className="font-manrope font-extrabold text-base text-purple-300">{level}</span>
          </div>

          {/* XP Hover Popup matching uploaded screenshot */}
          <AnimatePresence>
            {activeMenu === "xp" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 top-full mt-3 w-80 bg-[#161722] border-2 border-purple-500/50 rounded-[28px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-[9999] text-left text-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-manrope font-bold text-xl text-white">Level {level}</span>
                </div>

                {/* Progress Bar with next level badge circle pinned at end */}
                <div className="relative mb-3">
                  <div className="h-4 w-full bg-[#0a0b12] rounded-full overflow-hidden p-0.5 border border-white/10 relative">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" 
                      style={{ width: `${progressPercent}%` }} 
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
            className="flex items-center space-x-2.5 bg-[#2b2114] hover:bg-[#382b1a] border border-amber-500/30 px-4 py-2 rounded-full transition-all cursor-pointer shadow-lg group"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0 overflow-hidden">
              <img 
                src="/images/coin-zoomed.png" 
                alt="Coins" 
                className="w-full h-full object-contain group-hover:rotate-12 transition-transform drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" 
              />
            </div>
            <span className="font-manrope font-extrabold text-base text-amber-400 tracking-tight">{credits.toLocaleString()}</span>
          </div>

          {/* Coins Hover Popup matching exact uploaded screenshot */}
          <AnimatePresence>
            {activeMenu === "coins" && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute right-0 top-full mt-3 w-80 bg-[#161722] border-2 border-amber-500/50 rounded-[28px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-[9999] text-left text-white"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-xs font-manrope font-bold text-white/50 block">Your Coins</span>
                    <span className="font-manrope font-extrabold text-4xl text-amber-400 tracking-tight block mt-1">
                      {credits.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-16 h-16 flex items-center justify-center shrink-0">
                    <img 
                      src="/images/coin-zoomed.png" 
                      alt="Coins" 
                      className="w-full h-full object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.7)]" 
                    />
                  </div>
                </div>

                {/* Action Buttons matching screenshot */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push("/shop")}
                    className="py-3 px-4 rounded-full bg-[#222433] hover:bg-[#2b2d40] border border-white/10 text-white font-manrope font-bold text-xs transition-all text-center cursor-pointer"
                  >
                    My items
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

      {/* 100 LEVEL BADGES MODAL */}
      <AnimatePresence>
        {showBadgesModal && (
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-[#0f1019] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col max-h-[85vh] text-left text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
                <div>
                  <h3 className="font-instrument text-3xl font-bold text-white flex items-center gap-3">
                    <Trophy className="w-7 h-7 text-purple-400" />
                    <span>Academic Badges (Levels 1 - 100)</span>
                  </h3>
                  <p className="text-xs text-white/50 font-manrope mt-1">
                    Earn XP by mastering AP subjects and solving practice questions to unlock higher tier badges!
                  </p>
                </div>
                <button
                  onClick={() => setShowBadgesModal(false)}
                  className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Badges Grid */}
              <div 
                data-lenis-prevent="true"
                className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 pr-2"
              >
                {Array.from({ length: 100 }, (_, i) => i + 1).map((lvl) => {
                  const isUnlocked = level >= lvl;
                  return (
                    <div
                      key={lvl}
                      className={cn(
                        "p-4 rounded-2xl border flex flex-col items-center justify-center space-y-2 text-center transition-all",
                        isUnlocked 
                          ? "bg-purple-950/20 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                          : "bg-white/[0.02] border-white/5 opacity-40 grayscale"
                      )}
                    >
                      <LevelBadge level={lvl} size="md" />
                      <span className="font-manrope font-bold text-xs text-white block mt-1">Level {lvl}</span>
                      <span className="text-[10px] font-mono text-white/40">
                        {isUnlocked ? "Unlocked ✓" : `Locked`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
