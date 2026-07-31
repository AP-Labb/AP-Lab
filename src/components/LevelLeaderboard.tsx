"use client";

import React, { useEffect, useState } from "react";
import { LevelBadge } from "@/components/LevelBadge";
import { Trophy, Crown, Award, User, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";

interface LeaderboardUser {
  uid: string;
  displayName?: string;
  photoURL?: string;
  xp?: number;
  level?: number;
}

export function LevelLeaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { progress } = useProgress();
  const { currentUser } = useAuth();

  const fetchLeaderboard = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const activeUid = progress?.uid || currentUser?.uid || "";
      const res = await fetch(`/api/leaderboard?uid=${activeUid}&t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with status ${res.status}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (e) {
      console.error("Error fetching leaderboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(users.length === 0);
    // Poll every 10 seconds to keep it fresh
    const interval = setInterval(() => fetchLeaderboard(false), 10000);
    return () => clearInterval(interval);
  }, [progress?.uid, progress?.xp, progress?.photoURL, progress?.displayName, currentUser?.uid]);

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return {
          rowClass: "bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-transparent border-amber-500/30",
          medalColor: "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]",
          glowClass: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
          icon: <Crown className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />,
        };
      case 1:
        return {
          rowClass: "bg-gradient-to-r from-slate-300/10 via-slate-400/5 to-transparent border-slate-300/30",
          medalColor: "text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]",
          glowClass: "shadow-[0_0_15px_rgba(203,213,225,0.1)]",
          icon: <Trophy className="w-5 h-5 text-slate-300 fill-slate-300" />,
        };
      case 2:
        return {
          rowClass: "bg-gradient-to-r from-amber-750/10 via-amber-800/5 to-transparent border-amber-800/30",
          medalColor: "text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.4)]",
          glowClass: "shadow-[0_0_15px_rgba(180,83,9,0.1)]",
          icon: <Award className="w-5 h-5 text-amber-700 fill-amber-700" />,
        };
      default:
        return {
          rowClass: "bg-white/[0.01] border-white/5 hover:bg-white/[0.02]",
          medalColor: "text-white/40",
          glowClass: "",
          icon: null,
        };
    }
  };

  const top10 = users.slice(0, 10);
  const activeUid = progress?.uid || currentUser?.uid || "current-user";
  
  let currentUserIndex = users.findIndex((u) => u.uid === activeUid);
  let currentUserObj: LeaderboardUser;

  if (currentUserIndex !== -1) {
    currentUserObj = users[currentUserIndex];
  } else {
    // Calculate user position based on XP
    const userXp = progress?.xp || 0;
    const rankAbove = users.filter((u) => (u.xp || 0) > userXp).length;
    currentUserIndex = rankAbove;
    currentUserObj = {
      uid: activeUid,
      displayName: currentUser?.displayName || progress?.displayName || "Yash Patil",
      photoURL: currentUser?.photoURL || progress?.photoURL || "/images/yash-patil.png",
      xp: userXp,
      level: progress?.level || 1,
    };
  }

  const isUserInTop10 = currentUserIndex < 10;

  const renderRow = (user: LeaderboardUser, actualRankIndex: number, forceCurrentUser: boolean = false) => {
    const rankInfo = getRankStyle(actualRankIndex);
    const initials = user.displayName
      ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
      : "AP";
    const isCurrentUser = forceCurrentUser || user.uid === activeUid;

    return (
      <motion.div
        key={`${user.uid}-${actualRankIndex}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(actualRankIndex * 0.04, 0.4) }}
        className={cn(
          "flex items-center justify-between p-4 md:px-6 rounded-2xl border transition-all duration-300",
          isCurrentUser 
            ? "border-emerald-500/40 bg-emerald-950/25 shadow-[0_0_25px_rgba(16,185,129,0.18)]"
            : rankInfo.rowClass,
          !isCurrentUser && rankInfo.glowClass
        )}
      >
        <div className="flex items-center space-x-4">
          {/* Rank Indicator */}
          <div className="w-8 flex items-center justify-center shrink-0">
            {rankInfo.icon ? (
              rankInfo.icon
            ) : (
              <span className="font-mono text-xs sm:text-sm font-bold text-white/50">
                #{actualRankIndex + 1}
              </span>
            )}
          </div>

          {/* Avatar with equipped active frame & accessories */}
          <UserAvatar 
            photoURL={user.photoURL} 
            name={user.displayName} 
            activeFrame={isCurrentUser ? progress?.activeAvatarFrame : null} 
            size="md" 
          />

          {/* User Name & Level Badge */}
          <div className="flex flex-col md:flex-row md:items-center space-y-1.5 md:space-y-0 md:space-x-3">
            <span className="font-manrope font-bold text-white text-sm md:text-base leading-tight flex items-center gap-2">
              <span className={cn(
                isCurrentUser && progress?.activeNameGradient === "grad-fire" && "bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent font-extrabold",
                isCurrentUser && progress?.activeNameGradient === "grad-ocean" && "bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent font-extrabold",
                isCurrentUser && progress?.activeNameGradient === "grad-gold" && "bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent font-extrabold",
                isCurrentUser && progress?.activeNameGradient === "grad-holographic" && "bg-gradient-to-r from-pink-500 via-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent font-extrabold animate-pulse"
              )}>
                {user.displayName || "AP Scholar"}
              </span>
              {isCurrentUser && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 text-[9px] font-manrope font-black tracking-widest uppercase">
                  YOU
                </span>
              )}
            </span>
            <LevelBadge level={user.level || 1} />
          </div>
        </div>

        {/* XP display */}
        <div className="text-right">
          <span className="font-instrument italic font-bold text-base md:text-xl text-white block">
            {user.xp?.toLocaleString()}
          </span>
          <span className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-widest block">
            TOTAL XP
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto liquid-glass rounded-[32px] p-6 md:p-10 border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden">
      {/* Visual background glows */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-purple/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="text-center mb-10">
        <h2 className="font-instrument text-4xl md:text-5xl text-white font-medium tracking-tight mt-2">
          Global Level Leaderboard
        </h2>
        <p className="font-inter text-white/50 text-xs md:text-sm max-w-md mx-auto mt-2 leading-relaxed">
          The top 10 most active scholars on the AP Lab network. Gain XP by completing sections and checking your understanding.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3.5 py-2 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 md:px-6 rounded-2xl border border-white/5 bg-white/[0.01]">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-5 bg-white/5 rounded" />
                <div className="w-10 h-10 bg-white/5 rounded-xl" />
                <div className="flex flex-col space-y-2">
                  <div className="w-28 h-4 bg-white/5 rounded" />
                  <div className="w-16 h-3 bg-white/5 rounded" />
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className="w-12 h-5 bg-white/5 rounded" />
                <div className="w-8 h-2 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <User className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 font-inter text-sm">No leaderboard entries found yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          <AnimatePresence>
            {top10.map((user, index) => renderRow(user, index, user.uid === activeUid))}

            {/* If user is below rank 10, ALWAYS render separator & user's personal row */}
            {!isUserInTop10 && (
              <React.Fragment key="user-below-rank-10">
                <div className="flex items-center justify-center py-2 space-x-2 text-white/30">
                  <MoreHorizontal className="w-5 h-5 animate-pulse" />
                </div>
                {renderRow(currentUserObj, currentUserIndex, true)}
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
