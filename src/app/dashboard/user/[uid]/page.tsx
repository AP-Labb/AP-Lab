"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Zap, Target, Clock, Flame, CheckCircle, User,
  MapPin, Calendar, Edit3, UserPlus, UserCheck, X, Award
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { UserAvatar } from "@/components/UserAvatar";
import { UserDisplayName } from "@/components/UserDisplayName";
import { LevelBadge } from "@/components/LevelBadge";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { getXpThresholdForLevel } from "@/lib/xpProgression";
import { StreakFlameIcon } from "@/components/StreakFlameIcon";
import { cn } from "@/lib/utils";

const SCHOLAR_DIRECTORY: Record<string, { uid: string; name: string; photoURL: string; level: number; avatarFrame: string }> = {
  "bot-1": { uid: "bot-1", name: "Tyler Davis", photoURL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80", level: 12, avatarFrame: "frame-gold" },
  "bot-2": { uid: "bot-2", name: "Sofia Rodriguez", photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80", level: 10, avatarFrame: "frame-silver" },
  "bot-3": { uid: "bot-3", name: "Alex Mercer", photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80", level: 9, avatarFrame: "" },
  "bot-4": { uid: "bot-4", name: "Maya Patel", photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80", level: 8, avatarFrame: "" },
  "bot-5": { uid: "bot-5", name: "Ishan Samani", photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80", level: 28, avatarFrame: "frame-gold" },
};

interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  email: string;
  xp: number;
  level: number;
  credits: number;
  graduationYear: string | number | null;
  totalQuestionsAnswered: number;
  totalQuestionsCorrect: number;
  activeAvatarFrame: string;
  activeNameColor: string | null;
  activeNameGradient: string;
  bio?: string;
  location?: string;
  profileBannerColor?: string;
  enrolledCourses: string[];
  totalStudyMinutes: number;
  streakDays: number;
  followers?: string[];
  following?: string[];
  createdAt: string | null;
}

export default function UserProfilePage() {
  const { uid } = useParams<{ uid: string }>();
  const router = useRouter();
  const { currentUser } = useAuth();
  const { progress, toggleFollow } = useProgress();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Followers / Following Modal state
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<"followers" | "following">("followers");

  const isOwnProfile = uid === currentUser?.uid || uid === progress?.uid;

  useEffect(() => {
    if (!uid) return;
    setLoading(true);
    fetch(`/api/user/${uid}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); setLoading(false); return null; }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) setProfile(data);
        else if (data?.error) setNotFound(true);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [uid]);

  const liveProfile: UserProfile | null = isOwnProfile && progress
    ? {
        uid: currentUser?.uid || progress.uid || uid,
        displayName: progress.displayName || currentUser?.displayName || "AP Scholar",
        photoURL: progress.photoURL || currentUser?.photoURL || "",
        email: currentUser?.email || progress.email || "",
        xp: progress.xp || 0,
        level: progress.level || 1,
        credits: progress.credits || 0,
        graduationYear: progress.graduationYear || "2028",
        totalQuestionsAnswered: progress.totalQuestionsAnswered || 0,
        totalQuestionsCorrect: progress.totalQuestionsCorrect || 0,
        activeAvatarFrame: progress.activeAvatarFrame || "",
        activeNameColor: progress.activeNameColor || null,
        activeNameGradient: progress.activeNameGradient || "",
        bio: progress.bio || "",
        location: progress.location || "",
        profileBannerColor: progress.profileBannerColor || "#7b39fc",
        enrolledCourses: (progress as any).selectedClasses || [],
        totalStudyMinutes: 45,
        streakDays: (progress as any).streakCount || 0,
        followers: progress.followers || ["bot-1", "bot-2", "bot-3", "bot-5"],
        following: progress.following || ["bot-1", "bot-2"],
        createdAt: null,
      }
    : null;

  const user = liveProfile || profile;

  // Follow state for current user vs target user
  const userFollowers = user?.followers || ["bot-1", "bot-2", "bot-3", "bot-5"];
  const userFollowing = user?.following || ["bot-1", "bot-2"];

  const myFollowingList = progress?.following || ["bot-1", "bot-2"];
  const isFollowingThisUser = uid ? myFollowingList.includes(uid) : false;

  const handleFollowToggle = async () => {
    if (!uid || isOwnProfile || !toggleFollow) return;
    const isNowFollowing = await toggleFollow(uid);
    setProfile((prev) => {
      if (!prev) return prev;
      const myUid = currentUser?.uid || progress.uid || "me";
      const updatedFollowers = isNowFollowing
        ? [...(prev.followers || []), myUid]
        : (prev.followers || []).filter((id) => id !== myUid);
      return { ...prev, followers: updatedFollowers };
    });
  };

  const openFollowModal = (tab: "followers" | "following") => {
    setFollowModalTab(tab);
    setShowFollowModal(true);
  };

  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const totalAnswered = user?.totalQuestionsAnswered || 0;
  const totalCorrect = user?.totalQuestionsCorrect || 0;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const username = (user?.email || "scholar@aplab.com").split("@")[0].toLowerCase();
  const themeBannerColor = user?.profileBannerColor || "#7b39fc";

  // Active list for modal
  const activeFollowListUids = followModalTab === "followers" ? userFollowers : userFollowing;

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-clip selection:bg-neutral-800 selection:text-white font-manrope">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      <AppSidebar currentPath="/dashboard/leaderboard" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        <UniversalTopHeader />

        <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 space-y-6">
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-96 bg-white/[0.03] rounded-3xl border border-white/5" />
            </div>
          ) : notFound ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <User className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h2 className="text-white/60 font-bold text-lg">Profile Not Found</h2>
              <p className="text-white/30 text-sm mt-1">This user profile could not be found.</p>
            </div>
          ) : user ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* KNOWT-STYLE PROFILE BANNER CARD WITH DYNAMIC TEXTURED GRADIENT */}
              <div className="relative bg-[#0e101a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.9)] p-8 sm:p-12 text-center min-h-[460px] flex flex-col items-center justify-between">
                
                {/* DYNAMIC TEXTURED MESH GRADIENT BACKGROUND WITH NOISE OVERLAY */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  {/* Base dynamic mesh gradient */}
                  <div
                    className="absolute inset-0 transition-all duration-700"
                    style={{
                      background: `radial-gradient(circle at 15% 20%, ${themeBannerColor}ff 0%, ${themeBannerColor}bb 35%, ${themeBannerColor}44 70%, #080912 100%)`,
                    }}
                  />
                  {/* Secondary color accent mesh */}
                  <div
                    className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full blur-[100px] opacity-60 transition-all duration-700 pointer-events-none"
                    style={{ backgroundColor: themeBannerColor }}
                  />
                  {/* SVG Grain Noise Overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-35 mix-blend-overlay pointer-events-none">
                    <filter id="profileNoiseFilter">
                      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
                      <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#profileNoiseFilter)" />
                  </svg>
                  {/* Dark Vignette Bottom Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e101a] via-transparent to-black/20 pointer-events-none" />
                </div>

                {/* SCATTERED FLOATING STAT CAPSULES (ROTATED AROUND BANNER LIKE KNOWT SCREENSHOT 1) */}
                
                {/* 1. XP Capsule (Top Left) */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="hidden md:flex absolute top-10 left-10 items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white font-manrope font-extrabold text-sm shadow-xl -rotate-6 hover:rotate-0 transition-transform cursor-default z-10"
                >
                  <img src="/images/xp-shield-zoomed.png" alt="XP" className="w-6 h-6 object-contain" />
                  <span>{xp.toLocaleString()} XP</span>
                </motion.div>

                {/* 2. Streak Capsule (Middle Left) */}
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="hidden md:flex absolute top-36 left-20 items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white font-manrope font-extrabold text-sm shadow-xl rotate-4 hover:rotate-0 transition-transform cursor-default z-10"
                >
                  <StreakFlameIcon streakCount={user.streakDays || 0} sizeClassName="w-6 h-6" />
                  <span>{user.streakDays || 0} day Streak</span>
                </motion.div>

                {/* 3. Coins Capsule (Bottom Left) */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="hidden md:flex absolute bottom-12 left-12 items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white font-manrope font-extrabold text-sm shadow-xl -rotate-4 hover:rotate-0 transition-transform cursor-default z-10"
                >
                  <img src="/images/coin-zoomed.png" alt="Coins" className="w-6 h-6 object-contain" />
                  <span>{(user.credits || 0).toLocaleString()} Coins</span>
                </motion.div>

                {/* 4. Accuracy Capsule (Top Right) */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="hidden md:flex absolute top-10 right-10 items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white font-manrope font-extrabold text-sm shadow-xl rotate-6 hover:rotate-0 transition-transform cursor-default z-10"
                >
                  <Target className="w-5 h-5 text-emerald-300" />
                  <span>{accuracy}% Accuracy</span>
                </motion.div>

                {/* 5. Scholar Level Capsule (Middle Right) */}
                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="hidden md:flex absolute top-36 right-20 items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white font-manrope font-extrabold text-sm shadow-xl -rotate-5 hover:rotate-0 transition-transform cursor-default z-10"
                >
                  <Award className="w-5 h-5 text-purple-300" />
                  <span>Level {level}</span>
                </motion.div>

                {/* 6. Time Spent Capsule (Bottom Right - Replaced Courses!) */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="hidden md:flex absolute bottom-12 right-12 items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 text-white font-manrope font-extrabold text-sm shadow-xl rotate-3 hover:rotate-0 transition-transform cursor-default z-10"
                >
                  <Clock className="w-5 h-5 text-blue-300" />
                  <span>{user.totalStudyMinutes || 45}m Study Time</span>
                </motion.div>

                {/* CENTERED AVATAR & USER PROFILE DETAILS (MATCHING KNOWT SCREENSHOT 1) */}
                <div className="relative z-20 flex flex-col items-center justify-center space-y-4 my-auto">
                  {/* Large Centered Avatar with Edit Profile Button Attached Below */}
                  <div className="relative flex flex-col items-center">
                    <UserAvatar
                      photoURL={user.photoURL}
                      name={user.displayName}
                      activeFrame={user.activeAvatarFrame}
                      size="xl"
                    />

                    {/* Edit Profile / Follow Button Centered Directly Below Avatar (Matching Knowt Screenshot 1!) */}
                    <div className="mt-3">
                      {isOwnProfile ? (
                        <Link
                          href="/dashboard/settings?tab=account"
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#141624] hover:bg-[#1a1d30] border border-white/20 text-white font-manrope font-extrabold text-xs transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                          <span className="text-white">Edit Profile</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFollowToggle}
                          className={cn(
                            "inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-manrope font-extrabold text-xs transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95",
                            isFollowingThisUser
                              ? "bg-white/15 hover:bg-red-500/20 border border-white/20 text-white hover:text-red-400"
                              : "bg-white text-black hover:bg-neutral-200"
                          )}
                        >
                          {isFollowingThisUser ? (
                            <>
                              <UserCheck className="w-4 h-4 text-emerald-400" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 text-black" />
                              <span>Follow</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Centered User Display Name & Username Metadata */}
                  <div className="space-y-1 text-center">
                    <UserDisplayName
                      name={user.displayName}
                      activeNameColor={user.activeNameColor}
                      className="font-manrope font-black text-3xl sm:text-4xl text-white tracking-tight leading-none drop-shadow-md"
                    />
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-white/60">
                      <span>@{username}</span>
                      {user.location && user.location.trim() !== "" && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-violet-300" />
                            {user.location}
                          </span>
                        </>
                      )}
                      <span>•</span>
                      <span className="text-emerald-300 font-bold">Class of {user.graduationYear || "2028"}</span>
                    </div>
                  </div>

                  {/* Bio Quote (if present) */}
                  {user.bio && user.bio.trim() !== "" && (
                    <p className="text-xs text-white/80 font-manrope max-w-md mx-auto leading-relaxed italic bg-black/20 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                      "{user.bio}"
                    </p>
                  )}

                  {/* Followers / Following / Badges Centered Pill Capsules (Matching Knowt Screenshot 1!) */}
                  <div className="flex items-center justify-center gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => openFollowModal("followers")}
                      className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-manrope font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <span className="font-extrabold font-mono text-white">{userFollowers.length}</span>
                      <span className="text-white/70">Followers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openFollowModal("following")}
                      className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-manrope font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <span className="font-extrabold font-mono text-white">{userFollowing.length}</span>
                      <span className="text-white/70">Following</span>
                    </button>

                    <div className="px-5 py-2 rounded-full bg-white/10 border border-white/15 text-white text-xs font-manrope font-bold shadow-md flex items-center gap-1.5">
                      <span className="font-extrabold font-mono text-amber-300">15</span>
                      <span className="text-white/70">Badges</span>
                    </div>
                  </div>
                </div>

                {/* MOBILE STATS CAPSULES (Visible on mobile screens) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full md:hidden relative z-20 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white">
                    <img src="/images/xp-shield-zoomed.png" alt="XP" className="w-5 h-5 object-contain" />
                    <span>{xp.toLocaleString()} XP</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white">
                    <StreakFlameIcon streakCount={user.streakDays || 0} sizeClassName="w-5 h-5" />
                    <span>{user.streakDays || 0}d Streak</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white">
                    <img src="/images/coin-zoomed.png" alt="Coins" className="w-5 h-5 object-contain" />
                    <span>{(user.credits || 0).toLocaleString()} Coins</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white">
                    <Target className="w-4 h-4 text-emerald-300" />
                    <span>{accuracy}% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white">
                    <Award className="w-4 h-4 text-purple-300" />
                    <span>Level {level}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs font-bold text-white">
                    <Clock className="w-4 h-4 text-blue-300" />
                    <span>{user.totalStudyMinutes || 45}m Study</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </main>
      </div>

      {/* FOLLOWERS / FOLLOWING MODAL (Matching Knowt Screenshot) */}
      <AnimatePresence>
        {showFollowModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#14151f] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowFollowModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Tab Selector Pill Bar (Followers vs Following) */}
              <div className="flex justify-center pt-2">
                <div className="inline-flex p-1.5 rounded-full bg-white/10 border border-white/5 gap-1">
                  <button
                    type="button"
                    onClick={() => setFollowModalTab("followers")}
                    className={cn(
                      "px-6 py-2 rounded-full text-xs font-manrope font-bold transition-all cursor-pointer",
                      followModalTab === "followers"
                        ? "bg-white text-black shadow-md"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    Followers ({userFollowers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFollowModalTab("following")}
                    className={cn(
                      "px-6 py-2 rounded-full text-xs font-manrope font-bold transition-all cursor-pointer",
                      followModalTab === "following"
                        ? "bg-white text-black shadow-md"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    Following ({userFollowing.length})
                  </button>
                </div>
              </div>

              {/* Scholars List */}
              <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                {activeFollowListUids.length === 0 ? (
                  <div className="text-center py-8 text-white/40 text-xs font-manrope">
                    No scholars listed yet.
                  </div>
                ) : (
                  activeFollowListUids.map((scholarUid) => {
                    const scholarData = SCHOLAR_DIRECTORY[scholarUid] || {
                      uid: scholarUid,
                      name: scholarUid === "me" || scholarUid === currentUser?.uid ? (progress?.displayName || "You") : `Scholar (${scholarUid.slice(0, 6)})`,
                      photoURL: "",
                      level: 10,
                      avatarFrame: "",
                    };

                    return (
                      <div
                        key={scholarUid}
                        onClick={() => {
                          setShowFollowModal(false);
                          router.push(`/dashboard/user/${scholarUid}`);
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <UserAvatar
                            photoURL={scholarData.photoURL}
                            name={scholarData.name}
                            activeFrame={scholarData.avatarFrame}
                            size="md"
                          />
                          <span className="font-manrope font-extrabold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                            {scholarData.name}
                          </span>
                        </div>
                        <LevelBadge level={scholarData.level} />
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
