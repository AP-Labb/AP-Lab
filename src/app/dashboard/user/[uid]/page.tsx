"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, Trophy, Zap, Target,
  BookOpen, Clock, Flame, CheckCircle, User, MapPin, Calendar,
  Edit3, ShieldCheck, ChevronRight
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { UserAvatar } from "@/components/UserAvatar";
import { UserDisplayName } from "@/components/UserDisplayName";
import { LevelBadge } from "@/components/LevelBadge";
import { SettingsModal } from "@/components/SettingsModal";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { getXpThresholdForLevel } from "@/lib/xpProgression";
import { StreakFlameIcon } from "@/components/StreakFlameIcon";

const COURSE_META: Record<
  string,
  { name: string; accentColor: string; category: string; thumbnail: string }
> = {
  "ap-biology": {
    name: "AP® Biology",
    accentColor: "#22c55e",
    category: "STEM & Sciences",
    thumbnail: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80",
  },
  "ap-chemistry": {
    name: "AP® Chemistry",
    accentColor: "#00f2ff",
    category: "STEM & Sciences",
    thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
  },
  "ap-physics-c": {
    name: "AP® Physics C",
    accentColor: "#818cf8",
    category: "STEM & Sciences",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
  },
  "ap-ush": {
    name: "AP® US History",
    accentColor: "#fbbf24",
    category: "Humanities & Arts",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&q=80",
  },
  "ap-psych": {
    name: "AP® Psychology",
    accentColor: "#7b39fc",
    category: "Humanities & Arts",
    thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
  },
  "ap-eng-lang": {
    name: "AP® English Language",
    accentColor: "#fb7185",
    category: "Humanities & Arts",
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
  },
  "ap-calc-bc": {
    name: "AP® Calculus BC",
    accentColor: "#34d399",
    category: "Mathematical Logic",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&q=80",
  },
  "ap-stats": {
    name: "AP® Statistics",
    accentColor: "#38bdf8",
    category: "Mathematical Logic",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  },
  "ap-csa": {
    name: "AP® Comp Sci A",
    accentColor: "#a78bfa",
    category: "Mathematical Logic",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
  },
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
  createdAt: string | null;
}

export default function UserProfilePage() {
  const { uid } = useParams<{ uid: string }>();
  const { currentUser } = useAuth();
  const { progress } = useProgress();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

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
        location: progress.location || "United States",
        profileBannerColor: progress.profileBannerColor || "#7b39fc",
        enrolledCourses: (progress as any).selectedClasses || [],
        totalStudyMinutes: 0,
        streakDays: (progress as any).streakCount || 0,
        createdAt: null,
      }
    : null;

  const user = liveProfile || profile;

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

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-clip selection:bg-neutral-800 selection:text-white font-manrope">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      <AppSidebar currentPath="/dashboard/leaderboard" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 space-y-6">
          {/* Navigation Breadcrumb */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
              <Link href="/dashboard/leaderboard" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Leaderboard
              </Link>
              <span>/</span>
              <span className="text-white/80 font-bold">User Profile</span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-48 bg-white/[0.03] rounded-3xl border border-white/5" />
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-24 bg-white/[0.03] rounded-2xl border border-white/5" />
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
              {/* HERO PROFILE HEADER */}
              <div className="relative bg-[#090a12] border border-white/[0.08] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.8)]">
                <div
                  className="h-1 w-full absolute top-0 left-0 right-0"
                  style={{
                    background: `linear-gradient(to right, transparent, ${user.profileBannerColor || "#7b39fc"}, transparent)`,
                  }}
                />
                <div
                  className="absolute -top-10 left-1/4 w-80 h-40 blur-[90px] rounded-full pointer-events-none opacity-20"
                  style={{ backgroundColor: user.profileBannerColor || "#7b39fc" }}
                />

                <div className="flex flex-col lg:flex-row items-start justify-between gap-6 relative z-10">
                  {/* Left Column: Avatar & User Metadata */}
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
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/50 font-manrope">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span>{user.location || "United States"}</span>
                        </div>
                        {user.createdAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-white/40 shrink-0" />
                            <span>Member Since {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 font-semibold text-emerald-400">
                          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                          <span>Class of {user.graduationYear || "2028"}</span>
                        </div>
                      </div>

                      {/* Bio Quote */}
                      <p className="text-xs text-white/80 font-manrope max-w-xl leading-relaxed pt-1 font-medium">
                        "{user.bio || "AP Scholar studying for College Board exams on AP Lab."}"
                      </p>

                      {/* Action Button: Edit Profile (Only for own profile) */}
                      {isOwnProfile && (
                        <div className="pt-2 flex items-center gap-3">
                          <Link
                            href="/dashboard/settings?tab=account"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-manrope font-bold text-xs transition-all cursor-pointer shadow-sm active:scale-95"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-violet-400" />
                            <span>Edit Profile</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Scholar Level Progress */}
                  <div className="w-full lg:w-72 bg-white/[0.03] border border-white/10 rounded-2xl p-4 shrink-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-violet-400" />
                        <span>Scholar Level</span>
                      </span>
                      <LevelBadge level={level} />
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-black font-manrope text-white">Level {level}</span>
                      <span className="text-xs font-mono text-white/40">{xpInLevel.toLocaleString()} XP</span>
                    </div>

                    <div className="space-y-1">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-white/30">
                        <span>{xpInLevel.toLocaleString()} XP</span>
                        <span>{xpNeeded.toLocaleString()} next</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KEY STATS METRICS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: "XP", value: xp.toLocaleString(), icon: Trophy, color: "text-purple-400", img: "/images/xp-shield-zoomed.png" },
                  { label: "COINS", value: (user.credits || 0).toLocaleString(), icon: Zap, color: "text-amber-400", img: "/images/coin-zoomed.png" },
                  { label: "STREAK", value: `${user.streakDays || 0}d`, icon: Flame, color: "text-orange-400" },
                  { label: "ACCURACY", value: `${accuracy}%`, icon: Target, color: "text-emerald-400" },
                  { label: "COURSES", value: enrolledCount, icon: BookOpen, color: "text-blue-400" },
                  { label: "QUESTIONS", value: totalAnswered.toLocaleString(), icon: CheckCircle, color: "text-cyan-400" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-[#090a12] border border-white/[0.07] rounded-2xl p-4 flex flex-col justify-between hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center justify-between text-white/40">
                      <span className="text-[10px] font-mono font-bold tracking-widest uppercase">{item.label}</span>
                      {item.label === "STREAK" ? (
                        <StreakFlameIcon streakCount={user.streakDays || 0} sizeClassName="w-6 h-6" />
                      ) : item.img ? (
                        <img src={item.img} alt={item.label} className="w-5 h-5 object-contain" />
                      ) : (
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                      )}
                    </div>
                    <div className={`font-instrument text-2xl font-bold ${item.color} mt-2`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* MAIN CONTENT GRID: COURSES & LEARNING SNAPSHOT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Columns: Courses Section */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-[#090a12] border border-white/[0.08] rounded-3xl p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-violet-400" />
                          <h3 className="font-manrope font-bold text-lg text-white">Courses</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-mono font-bold">
                            {enrolledCount}
                          </span>
                        </div>
                        <p className="text-xs text-white/40 font-manrope mt-0.5">
                          Enrolled AP® courses and current mastery progress.
                        </p>
                      </div>
                    </div>

                    {enrolledCount === 0 ? (
                      <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                        <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-2" />
                        <p className="text-white/40 text-xs font-manrope">No courses enrolled yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3.5">
                        {user.enrolledCourses.map((slug) => {
                          const meta = COURSE_META[slug] || {
                            name: slug.toUpperCase().replace("-", " "),
                            accentColor: "#818cf8",
                            category: "Course",
                            thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
                          };

                          return (
                            <Link
                              key={slug}
                              href={`/dashboard/${slug}`}
                              className="group relative bg-white/[0.02] border border-white/[0.07] hover:border-white/20 rounded-2xl p-4 transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-4 overflow-hidden"
                            >
                              {/* Course Thumbnail Image */}
                              <div className="relative w-full sm:w-28 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                                <img
                                  src={meta.thumbnail}
                                  alt={meta.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                              </div>

                              {/* Course Title & Details */}
                              <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider block">
                                      {meta.category}
                                    </span>
                                    <h4 className="font-manrope font-extrabold text-base text-white group-hover:text-violet-300 transition-colors truncate">
                                      {meta.name}
                                    </h4>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-white/50 group-hover:text-white transition-colors">
                                    <span>View</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </div>
                                </div>

                                {/* Mastery Progress Bar */}
                                <div className="space-y-1">
                                  <div className="flex justify-between items-center text-[10px] font-mono">
                                    <span className="text-white/40">Mastery Progress</span>
                                    <span className="text-white font-bold" style={{ color: meta.accentColor }}>
                                      Active
                                    </span>
                                  </div>
                                  <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                    <div
                                      className="h-full rounded-full transition-all duration-500"
                                      style={{ backgroundColor: meta.accentColor, width: "35%" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Learning Snapshot */}
                <div className="space-y-4">
                  <div className="bg-[#090a12] border border-white/[0.08] rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-manrope font-bold text-lg text-white">Learning Snapshot</h3>
                    </div>

                    <div className="space-y-3 pt-2">
                      {[
                        { label: "Questions Attempted", value: totalAnswered.toLocaleString() },
                        { label: "Correct Answers", value: totalCorrect.toLocaleString() },
                        { label: "Accuracy Rate", value: `${accuracy}%` },
                        { label: "Current Level", value: `Level ${level}` },
                        { label: "Total XP Earned", value: `${xp.toLocaleString()} XP` },
                        { label: "Coin Balance", value: (user.credits || 0).toLocaleString() },
                      ].map((stat) => (
                        <div key={stat.label} className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0 text-xs font-manrope">
                          <span className="text-white/50 font-medium">{stat.label}</span>
                          <span className="font-bold text-white font-mono">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : null}
        </main>
      </div>

      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </div>
  );
}
