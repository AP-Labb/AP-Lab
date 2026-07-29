"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { getXpThresholdForLevel } from "@/lib/xpProgression";
import { cn } from "@/lib/utils";

interface HeaderUserCapsulesProps {
  onOpenProfile?: () => void;
}

export function HeaderUserCapsules({ onOpenProfile }: HeaderUserCapsulesProps) {
  const router = useRouter();
  const { progress } = useProgress();

  const [activeMenu, setActiveMenu] = useState<"none" | "xp" | "coins">("none");

  const xp = progress?.xp || 0;
  const level = progress?.level || 1;
  const credits = progress?.credits || 0;
  const streak = progress?.streakCount || 0;

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

  return (
    <div className="flex items-center space-x-2.5 font-manrope select-none relative z-50">
      
      {/* 1. STREAK CAPSULE */}
      <div 
        className="flex items-center space-x-2.5 bg-[#14151f] hover:bg-[#1a1c2a] border border-white/10 px-4 py-2 rounded-full transition-all cursor-pointer shadow-lg group"
        title={`${streak} Day Study Streak`}
      >
        <Flame className="w-5 h-5 text-neutral-300 fill-neutral-300 group-hover:scale-110 transition-transform" />
        <span className="font-manrope font-extrabold text-base text-white">{streak}</span>
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
          <img 
            src="/images/xp-shield-exact.png" 
            alt="XP Shield" 
            className="w-7 h-7 object-contain group-hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" 
          />
          <span className="font-manrope font-extrabold text-base text-purple-300">{level}</span>
        </div>

        {/* XP Hover Popup matching exact uploaded screenshot */}
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
                  onClick={() => router.push("/dashboard/progress")}
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
          <img 
            src="/images/coin-exact.png" 
            alt="Coins" 
            className="w-7 h-7 object-contain group-hover:rotate-12 transition-transform drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" 
          />
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
                <img 
                  src="/images/coin-exact.png" 
                  alt="Coins" 
                  className="w-14 h-14 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" 
                />
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
  );
}
