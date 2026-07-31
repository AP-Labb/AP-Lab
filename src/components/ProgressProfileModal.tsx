"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { LevelBadge } from "./LevelBadge";
import { getXpThresholdForLevel } from "@/lib/xpProgression";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface ProgressProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProgressProfileModal({ isOpen, onClose }: ProgressProfileModalProps) {
  const { currentUser } = useAuth();
  const { progress } = useProgress();

  if (!isOpen) return null;

  const level = progress?.level || 1;
  const xp = progress?.xp || 0;
  const prevThreshold = getXpThresholdForLevel(level);
  const nextThreshold = getXpThresholdForLevel(level + 1);
  const xpInCurrentLevel = Math.max(0, xp - prevThreshold);
  const xpNeededForNext = nextThreshold - prevThreshold;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));

  const totalAnswered = progress?.totalQuestionsAnswered || 0;
  const totalCorrect = progress?.totalQuestionsCorrect || 0;
  const accuracyRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const displayName = progress?.displayName || currentUser?.displayName || "Scholar";
  const photoURL = currentUser?.photoURL || progress?.photoURL || "";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[9999999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#080914] border border-white/10 w-full max-w-md p-6 rounded-3xl shadow-2xl relative overflow-hidden text-white space-y-6"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-4 border-b border-white/10 pb-5">
          {photoURL ? (
            <img src={photoURL} alt={displayName} className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow" />
          ) : (
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-instrument text-2xl font-bold text-black bg-gradient-to-br from-neutral-200 to-white shadow">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-manrope text-white">{displayName}</h3>
              <LevelBadge level={level} />
            </div>
            <div className="flex flex-col gap-1 text-white/50 text-xs font-manrope">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-white/40" />
                <span>{currentUser?.email || "student@theaplab.org"}</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Class of {progress?.graduationYear || "2028"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 text-left">
          <div className="border-b border-white/5 pb-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/40 uppercase">Academic Portal Stats</span>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">LEVEL PROGRESS</span>
                <span className="text-white font-bold text-lg">Level {level}</span>
              </div>
              <div className="text-right">
                <span className="text-white/40 text-xs font-mono">{xpInCurrentLevel} / {xpNeededForNext} XP</span>
              </div>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-white/60 pt-3 border-t border-white/5">
              <span className="flex items-center gap-2">
                <img src="/images/xp-shield-zoomed.png" alt="XP" className="w-6 h-6 inline object-contain" />
                Total XP: <strong className="text-purple-300 text-sm">{xp.toLocaleString()} XP</strong>
              </span>
              <span className="flex items-center gap-2 text-amber-400 font-bold">
                <img src="/images/coin-zoomed.png" alt="Coins" className="w-6 h-6 inline object-contain" />
                Coins: <strong className="text-amber-400 text-sm">{(progress?.credits || 0).toLocaleString()}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-semibold leading-tight">Questions Answered</span>
              <div className="font-instrument text-3xl font-bold text-white mt-2">
                {totalAnswered}
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-semibold leading-tight">Correct Answers</span>
              <div className="font-instrument text-3xl font-bold text-white mt-2">
                {totalCorrect}
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-semibold leading-tight">Accuracy Rate</span>
              <div className="font-instrument text-3xl font-bold text-emerald-400 mt-2">
                {accuracyRate}%
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex justify-end">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-white font-semibold text-xs uppercase tracking-widest"
            >
              <LogOut className="w-3.5 h-3.5 text-white/70" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
