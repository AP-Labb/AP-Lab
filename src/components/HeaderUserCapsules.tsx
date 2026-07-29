"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame, ChevronRight, Award, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { getLevelForXp, getXpThresholdForLevel } from "@/lib/xpProgression";
import { LevelBadge } from "@/components/LevelBadge";
import { cn } from "@/lib/utils";

export function HeaderUserCapsules() {
  const router = useRouter();
  const { progress } = useProgress();

  const [activeMenu, setActiveMenu] = useState<"none" | "xp" | "coins">("none");

  const xp = progress?.xp || 0;
  const level = progress?.level || 1;
  const credits = progress?.credits || 0;
  const streak = progress?.streakCount || 0;

  // XP Progress math matching Knowt design screenshot
  const currentLevelThreshold = getXpThresholdForLevel(level);
  const nextLevelThreshold = getXpThresholdForLevel(level + 1);
  const xpNeededForNextLevel = nextLevelThreshold - currentLevelThreshold;
  const xpInCurrentLevel = Math.max(0, xp - currentLevelThreshold);
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNextLevel) * 100));

  return (
    <div className="flex items-center space-x-2.5 font-manrope select-none relative z-50">
      
      {/* 1. STREAK CAPSULE */}
      <div 
        className="flex items-center space-x-2 bg-[#161822]/90 hover:bg-[#1c1f2e] border border-white/10 px-4 py-2 rounded-full transition-all cursor-pointer shadow-lg group"
        title={`${streak} Day Study Streak`}
      >
        <Flame className="w-4 h-4 text-orange-400 fill-orange-400 group-hover:scale-110 transition-transform" />
        <span className="font-manrope font-extrabold text-sm text-white/90">{streak}</span>
      </div>

      {/* 2. XP / LEVEL CAPSULE WITH HOVER POPUP */}
      <div 
        className="relative"
        onMouseEnter={() => setActiveMenu("xp")}
        onMouseLeave={() => setActiveMenu("none")}
      >
        <div 
          className="flex items-center space-x-2 bg-[#161822]/90 hover:bg-[#1c1f2e] border border-white/10 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-lg group"
        >
          <img 
            src="/images/xp-shield-clean.png" 
            alt="XP Shield" 
            className="w-5 h-5 object-contain group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
          />
          <span className="font-mono text-xs font-bold text-purple-300">LV</span>
          <span className="font-manrope font-extrabold text-sm text-purple-400">{level}</span>
        </div>

        {/* XP Hover Popup matching user screenshot */}
        <AnimatePresence>
          {activeMenu === "xp" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-0 top-full mt-3 w-80 bg-[#12141e]/98 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[9999] text-left text-white"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-manrope font-extrabold text-lg text-white">Level {level}</span>
                <div className="flex items-center space-x-1.5 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full text-purple-300 font-mono text-xs font-extrabold">
                  <LevelBadge level={level + 1} size="sm" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 mb-5">
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(168,85,247,0.6)]" 
                    style={{ width: `${progressPercent}%` }} 
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-white/50">
                  <span>{xpInCurrentLevel} / {xpNeededForNextLevel} XP</span>
                  <span className="text-purple-300 font-bold">{Math.round(progressPercent)}%</span>
                </div>
              </div>

              {/* Action Buttons matching screenshot */}
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/dashboard/progress"
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-manrope font-bold text-xs transition-all text-center"
                >
                  <Trophy className="w-3.5 h-3.5 text-purple-400" />
                  <span>View Badges</span>
                </Link>
                <Link
                  href="/dashboard/progress"
                  className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-manrope font-bold text-xs transition-all text-center"
                >
                  <span>View Profile</span>
                </Link>
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
          className="flex items-center space-x-2 bg-[#161822]/90 hover:bg-[#1c1f2e] border border-amber-500/20 px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-lg group"
        >
          <img 
            src="/images/coin-icon-clean.png" 
            alt="Coins" 
            className="w-5 h-5 object-contain group-hover:rotate-12 transition-transform drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" 
          />
          <span className="font-manrope font-black text-sm text-amber-400 tracking-tight">{credits.toLocaleString()}</span>
        </div>

        {/* Coins Hover Popup matching user screenshot */}
        <AnimatePresence>
          {activeMenu === "coins" && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-0 top-full mt-3 w-80 bg-[#12141e]/98 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[9999] text-left text-white"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-mono text-white/50 block font-semibold">Your Coins</span>
                  <span className="font-manrope font-extrabold text-3xl text-amber-400 tracking-tight block mt-0.5">
                    {credits.toLocaleString()}
                  </span>
                </div>
                <img 
                  src="/images/coin-icon-clean.png" 
                  alt="Coins" 
                  className="w-12 h-12 object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]" 
                />
              </div>

              {/* Action Buttons matching screenshot */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => router.push("/shop")}
                  className="py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-manrope font-bold text-xs transition-all text-center"
                >
                  My Items
                </button>
                <button
                  onClick={() => router.push("/shop")}
                  className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-black font-manrope font-black text-xs transition-all text-center shadow-lg"
                >
                  Go to Store
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
