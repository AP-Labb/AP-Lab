"use client";

import React, { useEffect, useState } from "react";
import { LevelBadge } from "@/components/LevelBadge";
import { Trophy, Crown, Award, User, MoreHorizontal, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/UserAvatar";
import { UserDisplayName } from "@/components/UserDisplayName";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface LeaderboardUser {
  uid: string;
  displayName?: string;
  photoURL?: string;
  xp?: number;
  level?: number;
  activeAvatarFrame?: string;
  activeNameGradient?: string;
  activeNameColor?: string;
}

const isBot = (uid: string) =>
  uid.startsWith("bot-") || uid.startsWith("placeholder-");

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
    const interval = setInterval(() => fetchLeaderboard(false), 10000);
    return () => clearInterval(interval);
  }, [progress?.uid, progress?.xp, progress?.photoURL, progress?.displayName, currentUser?.uid]);

  const activeUid = progress?.uid || currentUser?.uid || "current-user";

  let currentUserIndex = users.findIndex((u) => u.uid === activeUid);
  let currentUserObj: LeaderboardUser;

  if (currentUserIndex !== -1) {
    currentUserObj = users[currentUserIndex];
  } else {
    const userXp = progress?.xp || 0;
    const rankAbove = users.filter((u) => (u.xp || 0) > userXp).length;
    currentUserIndex = rankAbove;
    currentUserObj = {
      uid: activeUid,
      displayName: progress?.displayName || currentUser?.displayName || "AP Scholar",
      photoURL: progress?.photoURL || currentUser?.photoURL || "",
      xp: userXp,
      level: progress?.level || 1,
      activeAvatarFrame: progress?.activeAvatarFrame,
      activeNameColor: progress?.activeNameColor,
    };
  }

  const isUserInTop10 = currentUserIndex < 10;
  const top3 = users.slice(0, 3);
  const rest = users.slice(3, 10);

  // Podium order: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumRanks = [1, 0, 2]; // actual rank indices for each podium position

  const podiumConfig = [
    {
      height: "h-24",
      labelHeight: "pt-24",
      color: "#c0c0c0",
      bgGlow: "from-slate-300/10",
      borderColor: "border-slate-300/20",
      badgeClass: "bg-slate-300/10 text-slate-200 border-slate-300/30",
      icon: <Trophy className="w-4 h-4" />,
      rankLabel: "#2",
      avatarSize: "w-16 h-16" as const,
      zOffset: -1,
    },
    {
      height: "h-36",
      labelHeight: "pt-36",
      color: "#f59e0b",
      bgGlow: "from-amber-400/15",
      borderColor: "border-amber-400/30",
      badgeClass: "bg-amber-400/15 text-amber-300 border-amber-400/30",
      icon: <Crown className="w-5 h-5 fill-amber-400" />,
      rankLabel: "#1",
      avatarSize: "w-20 h-20" as const,
      zOffset: 0,
    },
    {
      height: "h-16",
      labelHeight: "pt-16",
      color: "#cd7f32",
      bgGlow: "from-amber-700/10",
      borderColor: "border-amber-700/20",
      badgeClass: "bg-amber-700/10 text-amber-600 border-amber-700/20",
      icon: <Award className="w-4 h-4" />,
      rankLabel: "#3",
      avatarSize: "w-14 h-14" as const,
      zOffset: -1,
    },
  ];

  const renderNameGradient = (user: LeaderboardUser, isCurrent: boolean) => {
    const grad = isCurrent ? progress?.activeNameGradient : user.activeNameGradient;
    const nameColor = isCurrent ? (progress?.activeNameColor || user.activeNameColor) : user.activeNameColor;
    return (
      <UserDisplayName
        name={user.displayName || "AP Scholar"}
        activeNameColor={nameColor}
        className={cn(
          "font-extrabold text-sm",
          isCurrent && grad === "grad-fire" && "bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent",
          isCurrent && grad === "grad-ocean" && "bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent",
          isCurrent && grad === "grad-gold" && "bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent",
          isCurrent && grad === "grad-holographic" && "bg-gradient-to-r from-pink-500 via-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
        )}
      />
    );
  };

  const renderRow = (user: LeaderboardUser, actualRankIndex: number, isCurrentUser: boolean) => {
    const activeFrame = isCurrentUser ? (progress?.activeAvatarFrame || user.activeAvatarFrame) : user.activeAvatarFrame;
    const showProfileLink = !isBot(user.uid);

    const rankColors = [
      "text-amber-400",
      "text-slate-300",
      "text-amber-700",
    ];

    return (
      <motion.div
        key={user.uid}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={cn(
          "flex items-center justify-between p-4 md:px-5 rounded-2xl border transition-all duration-300 select-none",
          actualRankIndex === 0 && "bg-gradient-to-r from-amber-500/8 to-transparent border-amber-500/20",
          actualRankIndex === 1 && "bg-gradient-to-r from-slate-300/8 to-transparent border-slate-300/20",
          actualRankIndex === 2 && "bg-gradient-to-r from-amber-800/8 to-transparent border-amber-800/20",
          actualRankIndex >= 3 && "bg-white/[0.01] border-white/[0.05] hover:bg-white/[0.025]",
          isCurrentUser && "ring-1 ring-emerald-500/40 bg-emerald-500/5 border-emerald-500/30"
        )}
      >
        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className="w-7 flex items-center justify-center shrink-0">
            <span className={cn(
              "font-mono text-sm font-bold",
              actualRankIndex < 3 ? rankColors[actualRankIndex] : "text-white/35"
            )}>
              #{actualRankIndex + 1}
            </span>
          </div>

          <UserAvatar
            photoURL={user.photoURL}
            name={user.displayName}
            activeFrame={activeFrame}
            size="md"
          />

          <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-3">
            <div className="flex items-center gap-2">
              {renderNameGradient(user, isCurrentUser)}
              {isCurrentUser && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 text-[9px] font-black tracking-widest uppercase">
                  YOU
                </span>
              )}
            </div>
            <LevelBadge level={user.level || 1} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="font-instrument italic font-bold text-base md:text-lg text-white block">
              {user.xp?.toLocaleString()}
            </span>
            <span className="text-[9px] font-mono font-bold text-white/25 uppercase tracking-widest block">
              XP
            </span>
          </div>
          {showProfileLink && (
            <Link
              href={`/dashboard/user/${user.uid}`}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/10 hover:border-white/20 transition-all flex-shrink-0"
              title="View Profile"
            >
              <ChevronRight className="w-4 h-4 text-white/50" />
            </Link>
          )}
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
          The top scholars on the AP Lab network. Gain XP by completing sections and checking your understanding.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3.5 py-2 animate-pulse">
          {/* Podium skeleton */}
          <div className="flex items-end justify-center gap-4 mb-8 h-52">
            {[1,2,3].map(i => (
              <div key={i} className={cn("flex flex-col items-center gap-3", i === 2 ? "mb-12" : i === 1 ? "" : "mb-8")}>
                <div className="w-16 h-16 bg-white/5 rounded-2xl" />
                <div className="w-20 h-4 bg-white/5 rounded" />
                <div className={cn("w-28 rounded-t-xl bg-white/5", i === 1 ? "h-36" : i === 2 ? "h-24" : "h-16")} />
              </div>
            ))}
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 md:px-6 rounded-2xl border border-white/5 bg-white/[0.01]">
              <div className="flex items-center space-x-4">
                <div className="w-7 h-5 bg-white/5 rounded" />
                <div className="w-10 h-10 bg-white/5 rounded-xl" />
                <div className="flex flex-col space-y-2">
                  <div className="w-28 h-4 bg-white/5 rounded" />
                  <div className="w-16 h-3 bg-white/5 rounded" />
                </div>
              </div>
              <div className="w-12 h-5 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <User className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40 font-inter text-sm">No leaderboard entries found yet. Be the first!</p>
        </div>
      ) : (
        <>
          {/* PODIUM TOP 3 — Clean Elevated Cards */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-10 items-end">
              {podiumOrder.map((user, podiumPos) => {
                if (!user) return null;
                const config = podiumConfig[podiumPos];
                const actualRank = podiumRanks[podiumPos];
                const isCurrent = user.uid === activeUid;
                const showProfileLink = !isBot(user.uid);
                const activeFrame = isCurrent ? (progress?.activeAvatarFrame || user.activeAvatarFrame) : user.activeAvatarFrame;
                const nameColor = isCurrent ? (progress?.activeNameColor || user.activeNameColor) : user.activeNameColor;

                return (
                  <motion.div
                    key={user.uid}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: podiumPos * 0.1, duration: 0.4 }}
                    className={cn(
                      "relative bg-[#090b14] border rounded-2xl md:rounded-3xl p-4 sm:p-5 flex flex-col items-center text-center space-y-3 transition-all",
                      config.borderColor,
                      actualRank === 0 ? "shadow-[0_0_30px_rgba(245,158,11,0.15)] pb-7" : actualRank === 1 ? "pb-5" : "pb-4"
                    )}
                  >
                    {/* Top Rank Badge */}
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold font-mono shadow-sm",
                        config.badgeClass
                      )}
                    >
                      {config.icon}
                      <span>Rank {config.rankLabel}</span>
                    </div>

                    {/* Avatar */}
                    <div className="pt-1">
                      <UserAvatar
                        photoURL={user.photoURL}
                        name={user.displayName}
                        activeFrame={activeFrame}
                        size={actualRank === 0 ? "xl" : "lg"}
                      />
                    </div>

                    {/* Name & Level */}
                    <div className="w-full space-y-1">
                      <UserDisplayName
                        name={user.displayName || "AP Scholar"}
                        activeNameColor={nameColor}
                        className="font-manrope font-extrabold text-sm sm:text-base text-white truncate w-full block"
                      />
                      <div className="flex justify-center">
                        <LevelBadge level={user.level || 1} />
                      </div>
                    </div>

                    {/* XP display */}
                    <div className="pt-1">
                      <div className="font-instrument italic font-bold text-base sm:text-lg text-white">
                        {user.xp?.toLocaleString()} <span className="text-[10px] font-mono not-italic text-white/40">XP</span>
                      </div>
                    </div>

                    {/* Profile Button */}
                    {showProfileLink && (
                      <Link
                        href={`/dashboard/user/${user.uid}`}
                        className="w-full py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-[11px] font-manrope font-semibold text-white/80 hover:text-white transition-all block text-center"
                      >
                        View Profile
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ROWS #4–10 */}
          <div className="space-y-2.5">
            <AnimatePresence>
              {rest.map((user, i) => renderRow(user, i + 3, user.uid === activeUid))}

              {/* Current user if below top 10 */}
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
        </>
      )}
    </div>
  );
}
