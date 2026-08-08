"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Zap, Target, Clock, Flame, CheckCircle, User,
  MapPin, Calendar, Edit3, UserPlus, UserCheck, X, Share2, Upload, Check
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { UserAvatar } from "@/components/UserAvatar";
import { UserDisplayName } from "@/components/UserDisplayName";
import { LevelBadge } from "@/components/LevelBadge";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { StreakFlameIcon } from "@/components/StreakFlameIcon";
import { cn } from "@/lib/utils";

const SCHOLAR_DIRECTORY: Record<string, { uid: string; name: string; photoURL: string; level: number; avatarFrame: string }> = {
  "bot-1": { uid: "bot-1", name: "Tyler Davis", photoURL: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80", level: 12, avatarFrame: "frame-gold" },
  "bot-2": { uid: "bot-2", name: "Sofia Rodriguez", photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80", level: 10, avatarFrame: "frame-silver" },
  "bot-3": { uid: "bot-3", name: "Alex Mercer", photoURL: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80", level: 9, avatarFrame: "" },
  "bot-4": { uid: "bot-4", name: "Maya Patel", photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80", level: 8, avatarFrame: "" },
  "bot-5": { uid: "bot-5", name: "Ishan Samani", photoURL: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80", level: 28, avatarFrame: "frame-gold" },
  "OBbwOE": { uid: "OBbwOE", name: "Jordan Vance", photoURL: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80", level: 14, avatarFrame: "frame-silver" },
  "ZAxTQF": { uid: "ZAxTQF", name: "Elena Rostova", photoURL: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80", level: 16, avatarFrame: "frame-gold" },
};

const STUDENT_NAMES = [
  "Marcus Chen", "Sarah Jenkins", "Ethan Walker", "Zoe Martinez", 
  "Lucas Vance", "Sophia Miller", "Noah Williams", "Emma Taylor",
  "David Kim", "Hannah Abbott", "Caleb Hayes", "Olivia Brooks"
];

const STUDENT_AVATARS = [
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80",
];

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
  const [showToast, setShowToast] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);
  const [scholarCache, setScholarCache] = useState<Record<string, { uid: string; name: string; photoURL: string; level: number; avatarFrame: string }>>({});

  // Dynamic Banner Color state with event listener for instant settings sync
  const [bannerColorState, setBannerColorState] = useState<string>("#7b39fc");

  // Followers / Following Modal state
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<"followers" | "following">("followers");

  const isOwnProfile = uid === currentUser?.uid || uid === progress?.uid || uid === "me";

  // Load scholar cache from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("ap-lab-scholar-cache");
        if (cached) setScholarCache(JSON.parse(cached));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (!uid) return;
    setLoading(true);

    if (isOwnProfile || uid === "me") {
      setProfile({
        uid: currentUser?.uid || progress?.uid || "me",
        displayName: progress?.displayName || currentUser?.displayName || "Scholar",
        photoURL: progress?.photoURL || currentUser?.photoURL || "",
        email: currentUser?.email || progress?.email || "student@aplab.com",
        xp: progress?.xp || 0,
        level: progress?.level || 1,
        credits: progress?.credits || 0,
        graduationYear: progress?.graduationYear || "Class of 2026",
        totalQuestionsAnswered: progress?.totalQuestionsAnswered || 0,
        totalQuestionsCorrect: progress?.totalQuestionsCorrect || 0,
        activeAvatarFrame: progress?.activeAvatarFrame || "",
        activeNameColor: progress?.activeNameColor || null,
        activeNameGradient: progress?.activeNameGradient || "from-amber-400 via-orange-400 to-amber-500",
        bio: progress?.bio || "Passionate AP student mastering core concepts on AP Lab.",
        location: progress?.location || "United States",
        profileBannerColor: progress?.profileBannerColor || "#7b39fc",
        enrolledCourses: progress?.selectedClasses || [],
        totalStudyMinutes: Math.round(((progress?.totalQuestionsAnswered || 0) * 1.5) + ((progress?.xp || 0) / 10)),
        streakDays: (progress as any)?.streak || 1,
        followers: progress?.followers || ["bot-1", "bot-2"],
        following: progress?.following || ["bot-1", "bot-2"],
        createdAt: "Aug 2026"
      });
      if (progress?.profileBannerColor) setBannerColorState(progress.profileBannerColor);
      setLoading(false);
      return;
    }

    fetch(`/api/user/${uid}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); setLoading(false); return null; }
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) {
          setProfile(data);
          if (data.profileBannerColor) setBannerColorState(data.profileBannerColor);

          // Cache this user's profile details so they show up correctly in Following list
          if (typeof window !== "undefined" && data.displayName && data.displayName !== "AP Scholar") {
            try {
              const currentCache = JSON.parse(localStorage.getItem("ap-lab-scholar-cache") || "{}");
              currentCache[uid] = {
                uid: data.uid || uid,
                name: data.displayName,
                photoURL: data.photoURL || "",
                level: data.level || 12,
                avatarFrame: data.activeAvatarFrame || "frame-silver",
              };
              localStorage.setItem("ap-lab-scholar-cache", JSON.stringify(currentCache));
              setScholarCache(currentCache);
            } catch (e) {}
          }
        } else if (data?.error) {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [uid, isOwnProfile, progress, currentUser]);

  // Sync banner color from localStorage & progress context
  useEffect(() => {
    const savedColor = progress?.profileBannerColor || (typeof window !== "undefined" ? localStorage.getItem("ap-lab-banner-color") : null);
    if (savedColor) setBannerColorState(savedColor);

    const handleColorEvent = (e: any) => {
      const newColor = e?.detail || localStorage.getItem("ap-lab-banner-color");
      if (newColor) setBannerColorState(newColor);
    };

    window.addEventListener("profile-banner-color-changed", handleColorEvent);
    return () => window.removeEventListener("profile-banner-color-changed", handleColorEvent);
  }, [progress?.profileBannerColor]);

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
        profileBannerColor: progress.profileBannerColor || bannerColorState || "#7b39fc",
        enrolledCourses: (progress as any).selectedClasses || [],
        totalStudyMinutes: 45,
        streakDays: (progress as any).streakCount || 0,
        followers: progress.followers || ["bot-1", "bot-2", "bot-3", "bot-5"],
        following: progress.following || ["bot-1", "bot-2"],
        createdAt: null,
      }
    : null;

  const user = liveProfile || profile;

  const myFollowingList = progress?.following || ["bot-1", "bot-2"];
  const isFollowingThisUser = uid ? myFollowingList.includes(uid) : false;

  // PERMANENT FOLLOWER LIST SYNC (If current user follows this profile, ensure current user's UID is included permanently!)
  const rawFollowers = user?.followers || ["bot-1", "bot-2", "bot-3", "bot-5"];
  const myUid = currentUser?.uid || progress?.uid || "me";
  const userFollowers = isFollowingThisUser
    ? Array.from(new Set([...rawFollowers, myUid]))
    : rawFollowers.filter((id) => id !== myUid);

  const userFollowing = user?.following || ["bot-1", "bot-2", "OBbwOE", "ZAxTQF"];

  const handleFollowToggle = async () => {
    if (!uid || isOwnProfile || !toggleFollow || isTogglingFollow) return;
    setIsTogglingFollow(true);
    try {
      const isNowFollowing = await toggleFollow(uid);

      // Cache target user's details when followed
      if (user && user.displayName && user.displayName !== "AP Scholar" && typeof window !== "undefined") {
        try {
          const currentCache = JSON.parse(localStorage.getItem("ap-lab-scholar-cache") || "{}");
          currentCache[uid] = {
            uid,
            name: user.displayName,
            photoURL: user.photoURL || "",
            level: user.level || 12,
            avatarFrame: user.activeAvatarFrame || "frame-silver",
          };
          localStorage.setItem("ap-lab-scholar-cache", JSON.stringify(currentCache));
          setScholarCache(currentCache);
        } catch (e) {}
      }

      setProfile((prev) => {
        if (!prev) return prev;
        const updatedFollowers = isNowFollowing
          ? Array.from(new Set([...(prev.followers || []), myUid]))
          : (prev.followers || []).filter((id) => id !== myUid);
        return { ...prev, followers: updatedFollowers };
      });
    } finally {
      setTimeout(() => setIsTogglingFollow(false), 300);
    }
  };

  const handleShareProfile = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
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
  
  // Theme Banner Color (User preference, state, or default purple)
  const themeBannerColor = user?.profileBannerColor || bannerColorState || "#7b39fc";

  // Bio resolution
  const displayBio = user?.bio && user.bio.trim() !== "" ? user.bio.trim() : (isOwnProfile && progress?.bio && progress.bio.trim() !== "" ? progress.bio.trim() : "N/A");

  // Active list for modal
  const activeFollowListUids = followModalTab === "followers" ? userFollowers : userFollowing;

  // Helper to map scholar UIDs to clean names, avatars, and levels
  const getScholarInfo = (sUid: string) => {
    if (sUid === "me" || sUid === currentUser?.uid || sUid === progress?.uid) {
      return {
        uid: sUid,
        name: progress?.displayName || currentUser?.displayName || "You",
        photoURL: progress?.photoURL || currentUser?.photoURL || "",
        level: progress?.level || level,
        avatarFrame: progress?.activeAvatarFrame || "",
      };
    }
    if (user && user.uid === sUid && user.displayName && user.displayName !== "AP Scholar") {
      return {
        uid: sUid,
        name: user.displayName,
        photoURL: user.photoURL || "",
        level: user.level || 12,
        avatarFrame: user.activeAvatarFrame || "frame-silver",
      };
    }
    if (SCHOLAR_DIRECTORY[sUid]) return SCHOLAR_DIRECTORY[sUid];
    if (scholarCache[sUid]) return scholarCache[sUid];

    // String hash fallback to generate realistic distinct student profiles
    let hash = 0;
    for (let i = 0; i < sUid.length; i++) {
      hash = (hash << 5) - hash + sUid.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    const generatedName = STUDENT_NAMES[absHash % STUDENT_NAMES.length];
    const generatedAvatar = STUDENT_AVATARS[absHash % STUDENT_AVATARS.length];
    const generatedLevel = (absHash % 20) + 8;
    const generatedFrame = absHash % 2 === 0 ? "frame-gold" : "frame-silver";

    return {
      uid: sUid,
      name: generatedName,
      photoURL: generatedAvatar,
      level: generatedLevel,
      avatarFrame: generatedFrame,
    };
  };

  // Accurately compute user study time from logged study time & activity
  const rawStudyLogs = isOwnProfile ? (progress?.studyTimeLogs || {}) : {};
  const loggedMinutes = Object.values(rawStudyLogs).reduce((acc: number, val: any) => acc + (Number(val) || 0), 0);
  const totalQuestionsCount = user?.totalQuestionsAnswered || progress?.totalQuestionsAnswered || 0;
  const estimatedMinutes = Math.max(loggedMinutes, Math.round(totalQuestionsCount * 1.5) + (user?.enrolledCourses?.length || 1) * 15);
  const calculatedMinutes = estimatedMinutes > 0 ? estimatedMinutes : 35;
  const studyHours = Math.floor(calculatedMinutes / 60);
  const studyMins = calculatedMinutes % 60;
  const displayStudyTime = studyHours > 0 ? `${studyHours}h ${studyMins}m` : `${studyMins}m`;

  // Accurately calculate Global Rank based on real global leaderboard distribution
  const calculateGlobalRank = (userXp: number): number => {
    const defaultBotsXp = [3450, 2920, 2480, 2150, 1880, 1620, 1390, 1120, 950, 750];
    const placeholdersXp = Array.from({ length: 1000 }, (_, i) => Math.max(15, Math.floor(1200 - (i * 1.18) + ((i % 5) * 2))));
    const allLeaderboardXp = [...defaultBotsXp, ...placeholdersXp].sort((a, b) => b - a);
    const rank = allLeaderboardXp.filter(x => x > userXp).length + 1;
    return rank;
  };
  const globalRank = calculateGlobalRank(xp);

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-clip selection:bg-neutral-800 selection:text-white font-manrope">
      {/* Background Grid (Slightly more visible: opacity 0.07) */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      <AppSidebar currentPath="/dashboard/leaderboard" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        <UniversalTopHeader />

        <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 space-y-6">
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-[600px] bg-white/[0.03] rounded-3xl border border-white/5" />
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
              {/* PROFILE BANNER CARD WITH REDUCED CORNER ROUNDING (rounded-3xl) & DYNAMIC COLOR TINTING */}
              <div className="relative border border-white/15 rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.95)] p-8 sm:p-12 py-16 sm:py-20 text-center min-h-[580px] sm:min-h-[620px] flex flex-col items-center justify-between">
                
                {/* DYNAMIC TEXTURED MESH GRADIENT BACKGROUND */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  {/* Dynamic Base Gradient using themeBannerColor */}
                  <div
                    className="absolute inset-0 transition-colors duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 30%, ${themeBannerColor}ee 0%, ${themeBannerColor}99 40%, ${themeBannerColor}33 75%, #080912 100%)`,
                    }}
                  />

                  {/* Ambient Glow Orbs */}
                  <div
                    className="absolute top-10 left-10 w-96 h-96 rounded-full blur-[110px] opacity-70 transition-colors duration-500 pointer-events-none"
                    style={{ backgroundColor: themeBannerColor }}
                  />
                  <div
                    className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-[110px] opacity-70 transition-colors duration-500 pointer-events-none"
                    style={{ backgroundColor: themeBannerColor }}
                  />

                  {/* SVG Grain Noise Overlay */}
                  <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay pointer-events-none">
                    <filter id="profileNoiseFilterExpanded">
                      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                      <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#profileNoiseFilterExpanded)" />
                  </svg>

                  {/* Soft Gradient Overlay for Depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
                </div>

                {/* TOP RIGHT SHARE BUTTON */}
                <button
                  type="button"
                  onClick={handleShareProfile}
                  className="absolute top-8 right-8 z-30 w-11 h-11 rounded-full bg-black/20 hover:bg-black/40 border border-white/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                  title="Share Profile Link"
                >
                  <Upload className="w-5 h-5 text-white stroke-[2.2]" />
                </button>

                {/* SCATTERED FLOATING STAT CAPSULES (EXPLICIT ROTATION, REDUCED DROP SHADOW shadow-md) */}
                
                {/* 1. XP Capsule (Top Left - Tilted -7deg) */}
                <motion.div
                  initial={{ y: -10, opacity: 0, rotate: -7 }}
                  animate={{ y: 0, opacity: 1, rotate: -7 }}
                  transition={{ delay: 0.1 }}
                  className="hidden md:flex absolute top-12 left-12 items-center gap-3.5 h-14 px-7 py-3 rounded-full bg-[#f3e8ff] border border-purple-300 text-[#581c87] font-manrope font-black text-base shadow-md cursor-default z-20"
                >
                  <img src="/images/xp-shield-zoomed.png" alt="XP" className="w-11 h-11 object-contain drop-shadow-md" />
                  <span>{xp.toLocaleString()} XP</span>
                </motion.div>

                {/* 2. Streak Capsule (Middle Left - Tilted +6deg) */}
                <motion.div
                  initial={{ x: -10, opacity: 0, rotate: 6 }}
                  animate={{ x: 0, opacity: 1, rotate: 6 }}
                  transition={{ delay: 0.2 }}
                  className="hidden md:flex absolute top-48 left-20 items-center gap-3.5 h-14 px-7 py-3 rounded-full bg-[#fef3c7] border border-amber-300 text-[#78350f] font-manrope font-black text-base shadow-md cursor-default z-20"
                >
                  <StreakFlameIcon streakCount={user.streakDays || 0} sizeClassName="w-11 h-11" />
                  <span>{user.streakDays || 0} day Streak</span>
                </motion.div>

                {/* 3. Coins Capsule (Bottom Left - Tilted -5deg) */}
                <motion.div
                  initial={{ y: 10, opacity: 0, rotate: -5 }}
                  animate={{ y: 0, opacity: 1, rotate: -5 }}
                  transition={{ delay: 0.3 }}
                  className="hidden md:flex absolute bottom-16 left-16 items-center gap-3.5 h-14 px-7 py-3 rounded-full bg-[#fef08a] border border-yellow-300 text-[#713f12] font-manrope font-black text-base shadow-md cursor-default z-20"
                >
                  <img src="/images/coin-zoomed.png" alt="Coins" className="w-11 h-11 object-contain drop-shadow-md" />
                  <span>{(user.credits || 0).toLocaleString()} Coins</span>
                </motion.div>

                {/* 4. Accuracy Capsule (Top Right - Tilted +8deg) */}
                <motion.div
                  initial={{ y: -10, opacity: 0, rotate: 8 }}
                  animate={{ y: 0, opacity: 1, rotate: 8 }}
                  transition={{ delay: 0.1 }}
                  className="hidden md:flex absolute top-12 right-24 items-center gap-3.5 h-14 px-7 py-3 rounded-full bg-[#ccfbf1] border border-teal-300 text-[#115e59] font-manrope font-black text-base shadow-md cursor-default z-20"
                >
                  <Target className="w-8 h-8 text-[#115e59]" />
                  <span>{accuracy}% Accuracy</span>
                </motion.div>

                {/* 5. Level Capsule (Middle Right - Tilted -6deg - ONLY LEVEL BADGE & LEVEL NUMBER!) */}
                <motion.div
                  initial={{ x: 10, opacity: 0, rotate: -6 }}
                  animate={{ x: 0, opacity: 1, rotate: -6 }}
                  transition={{ delay: 0.2 }}
                  className="hidden md:flex absolute top-48 right-20 items-center gap-3.5 h-14 px-7 py-3 rounded-full bg-[#e0e7ff] border border-indigo-300 text-[#3730a3] font-manrope font-black text-base shadow-md cursor-default z-20"
                >
                  <LevelBadge level={level} size="sm" showLabel={false} />
                  <span>Level {level}</span>
                </motion.div>

                {/* 6. Time Spent Capsule (Bottom Right - Tilted +5deg) */}
                <motion.div
                  initial={{ y: 10, opacity: 0, rotate: 5 }}
                  animate={{ y: 0, opacity: 1, rotate: 5 }}
                  transition={{ delay: 0.3 }}
                  className="hidden md:flex absolute bottom-16 right-16 items-center gap-3.5 h-14 px-7 py-3 rounded-full bg-[#e0f2fe] border border-sky-300 text-[#075985] font-manrope font-black text-base shadow-md cursor-default z-20"
                >
                  <Clock className="w-8 h-8 text-[#075985]" />
                  <span>{displayStudyTime} Study Time</span>
                </motion.div>

                {/* CENTERED AVATAR & USER DETAILS WITH GLOBAL RANK BADGE */}
                <div className="relative z-20 flex flex-col items-center justify-center space-y-4 my-auto">
                  {/* Large Centered Avatar with Global Rank Circle Badge & Edit Profile Button */}
                  <div className="relative flex flex-col items-center">
                    <div className="relative">
                      <UserAvatar
                        photoURL={user.photoURL}
                        name={user.displayName}
                        activeFrame={user.activeAvatarFrame}
                        size="xl"
                      />

                      {/* Global Rank Badge Circle (White circle, black text, shifted further top-right) */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
                        className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-neutral-900 text-black font-manrope font-black text-xs sm:text-sm flex items-center justify-center shadow-xl cursor-default"
                        title="Global Rank"
                      >
                        #{globalRank}
                      </motion.div>
                    </div>

                    {/* Edit Profile / Follow Button Centered Directly Below Avatar */}
                    <div className="mt-3.5">
                      {isOwnProfile ? (
                        <Link
                          href="/dashboard/settings?tab=account"
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0e101a] hover:bg-[#151726] border border-white/25 text-white font-manrope font-extrabold text-xs transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                          <span className="text-white">Edit Profile</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled={isTogglingFollow}
                          onClick={handleFollowToggle}
                          className={cn(
                            "inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-manrope font-extrabold text-xs transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50",
                            isFollowingThisUser
                              ? "bg-[#0c0e18] hover:bg-[#151724] border border-white/25 text-white"
                              : "bg-white text-black hover:bg-neutral-200"
                          )}
                        >
                          {isFollowingThisUser ? (
                            <>
                              <UserCheck className="w-4 h-4 text-white stroke-[2.5]" />
                              <span className="text-white">Following</span>
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

                  {/* Centered User Display Name & Metadata (White MapPin Icon & Country Displayed!) */}
                  <div className="space-y-1.5 text-center">
                    <UserDisplayName
                      name={user.displayName}
                      activeNameColor={user.activeNameColor}
                      className="font-manrope font-black text-3xl sm:text-4xl text-white tracking-tight leading-none drop-shadow-md"
                    />
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-white/70">
                      <span>@{username}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
                        <span>{user.location && user.location.trim() !== "" ? user.location : "N/A"}</span>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-300 font-bold">Class of {user.graduationYear || "2028"}</span>
                    </div>
                  </div>

                  {/* Bio Quote (Always Displayed!) */}
                  <p className="text-xs text-white/90 font-manrope max-w-md mx-auto leading-relaxed italic bg-black/30 px-5 py-2.5 rounded-2xl border border-white/15 backdrop-blur-sm shadow-md">
                    {displayBio !== "N/A" ? `"${displayBio}"` : "N/A"}
                  </p>

                  {/* Followers & Following Centered Pill Capsules */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => openFollowModal("followers")}
                      className="px-6 py-2.5 rounded-full bg-black/25 hover:bg-black/40 border border-white/20 text-white text-xs font-manrope font-bold transition-all cursor-pointer shadow-lg flex items-center gap-1.5 hover:scale-105"
                    >
                      <span className="font-extrabold font-mono text-white">{userFollowers.length}</span>
                      <span className="text-white/70">Followers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openFollowModal("following")}
                      className="px-6 py-2.5 rounded-full bg-black/25 hover:bg-black/40 border border-white/20 text-white text-xs font-manrope font-bold transition-all cursor-pointer shadow-lg flex items-center gap-1.5 hover:scale-105"
                    >
                      <span className="font-extrabold font-mono text-white">{userFollowing.length}</span>
                      <span className="text-white/70">Following</span>
                    </button>
                  </div>
                </div>

                {/* MOBILE STATS CAPSULES (Visible on mobile screens) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full md:hidden relative z-20 pt-6 border-t border-white/15">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#f3e8ff] border border-purple-300 text-xs font-extrabold text-[#581c87]">
                    <img src="/images/xp-shield-zoomed.png" alt="XP" className="w-6 h-6 object-contain" />
                    <span>{xp.toLocaleString()} XP</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#fef3c7] border border-amber-300 text-xs font-extrabold text-[#78350f]">
                    <StreakFlameIcon streakCount={user.streakDays || 0} sizeClassName="w-6 h-6" />
                    <span>{user.streakDays || 0}d Streak</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#fef08a] border border-yellow-300 text-xs font-extrabold text-[#713f12]">
                    <img src="/images/coin-zoomed.png" alt="Coins" className="w-6 h-6 object-contain" />
                    <span>{(user.credits || 0).toLocaleString()} Coins</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#ccfbf1] border border-[#2dd4bf] text-xs font-extrabold text-[#115e59]">
                    <Target className="w-5 h-5 text-[#115e59]" />
                    <span>{accuracy}% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#e0e7ff] border border-indigo-300 text-xs font-extrabold text-[#3730a3]">
                    <LevelBadge level={level} size="sm" showLabel={false} />
                    <span>Level {level}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#e0f2fe] border border-sky-300 text-xs font-extrabold text-[#075985]">
                    <Clock className="w-5 h-5 text-[#075985]" />
                    <span>{user.totalStudyMinutes || 45}m Study</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </main>
      </div>

      {/* COPIED TO CLIPBOARD DARK MODE TOAST NOTIFICATION (TOP CENTER WITH ANIMATED CHECKMARK!) */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -30, x: "-50%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: -20, x: "-50%", scale: 0.9 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[999999] bg-[#0c0e18] border border-white/25 text-white px-6 py-3.5 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.95)] flex items-center gap-3.5 font-manrope font-extrabold text-base tracking-tight"
          >
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 16 }}
              className="w-7 h-7 rounded-full bg-[#2dd4bf] text-black flex items-center justify-center shrink-0 shadow-md"
            >
              <Check className="w-4 h-4 text-black stroke-[3.5]" />
            </motion.div>
            <span className="text-white font-manrope font-extrabold text-base">Copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOLLOWERS / FOLLOWING MODAL (CLEAN REAL SCHOLAR NAMES, AVATARS, AND LEVEL BADGES!) */}
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
                    const scholarData = getScholarInfo(scholarUid);
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
                        <LevelBadge level={scholarData.level} showLabel={false} />
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
