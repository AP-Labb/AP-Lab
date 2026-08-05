"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Zap, Target, BookOpen, Flame, CheckCircle, User,
  MapPin, Calendar, Edit3, UserPlus, UserCheck, X
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
        totalStudyMinutes: 0,
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
  const prevThreshold = getXpThresholdForLevel(level);
  const nextThreshold = getXpThresholdForLevel(level + 1);
  const xpInLevel = Math.max(0, xp - prevThreshold);
  const xpNeeded = Math.max(100, nextThreshold - prevThreshold);
  const progressPct = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));

  const totalAnswered = user?.totalQuestionsAnswered || 0;
  const totalCorrect = user?.totalQuestionsCorrect || 0;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const enrolledCount = user?.enrolledCourses?.length || 0;

  // Active list for modal
  const activeFollowListUids = followModalTab === "followers" ? userFollowers : userFollowing;

  const themeBannerColor = user?.profileBannerColor || "#7b39fc";

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-clip selection:bg-neutral-800 selection:text-white font-manrope">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      <AppSidebar currentPath="/dashboard/leaderboard" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 space-y-6">
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-64 bg-white/[0.03] rounded-3xl border border-white/5" />
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-28 bg-white/[0.03] rounded-2xl border border-white/5" />
                ))}
              </div>
            </div>
          ) : notFound ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
              <User className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <h2 className="text-white/60 font-bold text-lg">Profile Not Found</h2>
              <p className="text-white/30 text-sm mt-1">This user profile could not be found.</p>
            </div>
          ) : user ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* HERO PROFILE SECTION WITH FULL TEXTURED GRADIENT BANNER */}
              <div className="relative bg-[#090a12] border border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)] space-y-6 p-6 sm:p-8">
                {/* Textured Gradient Banner (Matches User's Noise Texture Image & Tints Dynamically) */}
                <div className="absolute top-0 left-0 right-0 h-44 sm:h-52 overflow-hidden pointer-events-none z-0">
                  <img
                    src="/images/profile-banner-texture.jpg"
                    alt="Profile Banner Texture"
                    className="w-full h-full object-cover object-center transition-all duration-500 opacity-90"
                  />
                  {/* Dynamic Color Tint Layer */}
                  <div
                    className="absolute inset-0 transition-colors duration-500 mix-blend-color opacity-90"
                    style={{ backgroundColor: themeBannerColor }}
                  />
                  {/* Soft Light Tint Overlay for Rich Vibrancy */}
                  <div
                    className="absolute inset-0 transition-colors duration-500 opacity-60 mix-blend-soft-light"
                    style={{
                      background: `linear-gradient(135deg, ${themeBannerColor}ff 0%, ${themeBannerColor}44 60%, #000000 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090a12]/50 to-[#090a12] pointer-events-none" />
                </div>

                {/* Hero Header Content */}
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6 relative z-10 pt-10 sm:pt-12">
                  {/* Left Column: Avatar & User Details */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1 min-w-0">
                    <UserAvatar
                      photoURL={user.photoURL}
                      name={user.displayName}
                      activeFrame={user.activeAvatarFrame}
                      size="xl"
                    />

                    <div className="space-y-2 min-w-0 flex-1">
                      <div>
                        <UserDisplayName
                          name={user.displayName}
                          activeNameColor={user.activeNameColor}
                          className="font-manrope font-black text-2xl sm:text-3xl text-white tracking-tight leading-none"
                        />
                      </div>

                      {/* Location & Academic Details */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/60 font-manrope">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>{user.location && user.location.trim() !== "" ? user.location : "N/A"}</span>
                        </div>
                        {user.createdAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-white/40 shrink-0" />
                            <span>Member Since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 font-semibold text-emerald-400">
                          <span>Class of {user.graduationYear || "2028"}</span>
                        </div>
                      </div>

                      {/* Followers & Following Counts */}
                      <div className="flex items-center gap-4 pt-0.5 text-xs font-manrope">
                        <button
                          type="button"
                          onClick={() => openFollowModal("followers")}
                          className="hover:underline cursor-pointer flex items-center gap-1 text-white/80"
                        >
                          <span className="font-extrabold text-white font-mono">{userFollowers.length}</span>
                          <span className="text-white/40">Followers</span>
                        </button>
                        <span className="text-white/20">•</span>
                        <button
                          type="button"
                          onClick={() => openFollowModal("following")}
                          className="hover:underline cursor-pointer flex items-center gap-1 text-white/80"
                        >
                          <span className="font-extrabold text-white font-mono">{userFollowing.length}</span>
                          <span className="text-white/40">Following</span>
                        </button>
                      </div>

                      {/* Bio Quote */}
                      <p className="text-xs text-white/70 font-manrope max-w-xl leading-relaxed pt-1 font-medium">
                        {user.bio && user.bio.trim() !== "" ? `"${user.bio}"` : "N/A"}
                      </p>

                      {/* Action Buttons: Follow/Unfollow vs Edit Profile */}
                      <div className="pt-2 flex items-center gap-3">
                        {isOwnProfile ? (
                          <Link
                            href="/dashboard/settings?tab=account"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-manrope font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-violet-400" />
                            <span>Edit Profile</span>
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={handleFollowToggle}
                            className={cn(
                              "inline-flex items-center gap-2 px-5 py-2 rounded-xl font-manrope font-extrabold text-xs transition-all cursor-pointer shadow-md active:scale-95",
                              isFollowingThisUser
                                ? "bg-white/10 hover:bg-red-500/20 border border-white/15 text-white hover:text-red-400"
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
                  </div>

                  {/* Right Column: Level Badge & Level Progress Bar (Scholar Level text and icon removed) */}
                  <div className="w-full lg:w-72 bg-[#0d0f1a]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shrink-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black font-manrope text-white">Level {level}</span>
                      <LevelBadge level={level} />
                    </div>

                    <div className="space-y-1">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: themeBannerColor }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-white/40">
                        <span>{xpInLevel.toLocaleString()} XP</span>
                        <span>{xpNeeded.toLocaleString()} next</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* STATS CONTAINERS MOVED UP INSIDE THE HERO CARD */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 relative z-10 pt-4 border-t border-white/[0.08]">
                  {[
                    { label: "XP", value: xp.toLocaleString(), color: "text-purple-400", img: "/images/xp-shield-zoomed.png" },
                    { label: "COINS", value: (user.credits || 0).toLocaleString(), color: "text-amber-400", img: "/images/coin-zoomed.png" },
                    { label: "STREAK", value: `${user.streakDays || 0}d`, color: "text-orange-400" },
                    { label: "ACCURACY", value: `${accuracy}%`, icon: Target, color: "text-emerald-400" },
                    { label: "COURSES", value: enrolledCount, icon: BookOpen, color: "text-blue-400" },
                    { label: "QUESTIONS", value: totalAnswered.toLocaleString(), icon: CheckCircle, color: "text-cyan-400" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="bg-[#0b0d18]/90 border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between hover:border-white/20 transition-all shadow-lg"
                      >
                        <div className="flex items-center justify-between text-white/50">
                          <span className="text-[10px] font-mono font-extrabold tracking-widest uppercase">{item.label}</span>
                          {item.label === "STREAK" ? (
                            <StreakFlameIcon streakCount={user.streakDays || 0} sizeClassName="w-12 h-12" />
                          ) : item.img ? (
                            <img src={item.img} alt={item.label} className="w-12 h-12 object-contain" />
                          ) : Icon ? (
                            <Icon className={`w-10 h-10 ${item.color}`} />
                          ) : null}
                        </div>
                        <div className={`font-instrument text-2xl font-bold ${item.color} mt-3`}>
                          {item.value}
                        </div>
                      </div>
                    );
                  })}
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
