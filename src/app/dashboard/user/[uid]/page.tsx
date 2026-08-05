"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, GraduationCap, Trophy, Zap, Target,
  BookOpen, Clock, Flame, CheckCircle, User
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { UserAvatar } from "@/components/UserAvatar";
import { UserDisplayName } from "@/components/UserDisplayName";
import { LevelBadge } from "@/components/LevelBadge";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { getXpThresholdForLevel } from "@/lib/xpProgression";

const COURSE_META: Record<string, { name: string; accentColor: string; emoji: string }> = {
  "ap-biology":    { name: "AP® Biology",         accentColor: "#22c55e", emoji: "🧬" },
  "ap-chemistry":  { name: "AP® Chemistry",        accentColor: "#00f2ff", emoji: "⚗️" },
  "ap-physics-c":  { name: "AP® Physics C",        accentColor: "#818cf8", emoji: "⚡" },
  "ap-ush":        { name: "AP® US History",       accentColor: "#fbbf24", emoji: "🏛️" },
  "ap-psych":      { name: "AP® Psychology",       accentColor: "#7b39fc", emoji: "🧠" },
  "ap-eng-lang":   { name: "AP® English Language", accentColor: "#fb7185", emoji: "✍️" },
  "ap-calc-bc":    { name: "AP® Calculus BC",      accentColor: "#34d399", emoji: "∫" },
  "ap-stats":      { name: "AP® Statistics",       accentColor: "#38bdf8", emoji: "📊" },
  "ap-csa":        { name: "AP® Comp Sci A",       accentColor: "#a78bfa", emoji: "💻" },
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

  const isOwnProfile =
    uid === currentUser?.uid || uid === progress?.uid;

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

  // For own profile, prefer live context data over API
  const liveProfile: UserProfile | null = isOwnProfile && progress
    ? {
        uid: currentUser?.uid || progress.uid || uid,
        displayName: progress.displayName || currentUser?.displayName || "AP Scholar",
        photoURL: progress.photoURL || currentUser?.photoURL || "",
        email: currentUser?.email || progress.email || "",
        xp: progress.xp || 0,
        level: progress.level || 1,
        credits: progress.credits || 0,
        graduationYear: progress.graduationYear || null,
        totalQuestionsAnswered: progress.totalQuestionsAnswered || 0,
        totalQuestionsCorrect: progress.totalQuestionsCorrect || 0,
        activeAvatarFrame: progress.activeAvatarFrame || "",
        activeNameColor: progress.activeNameColor || null,
        activeNameGradient: progress.activeNameGradient || "",
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
  const xpNeeded = nextThreshold - prevThreshold;
  const progressPct = Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100));
  const accuracy =
    (user?.totalQuestionsAnswered || 0) > 0
      ? Math.round(((user?.totalQuestionsCorrect || 0) / (user?.totalQuestionsAnswered || 1)) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-clip selection:bg-neutral-800 selection:text-white font-manrope">
      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      <AppSidebar currentPath="/dashboard/leaderboard" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        <UniversalTopHeader />

        <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-10 pb-24">
          {/* Back */}
          <Link
            href="/dashboard/leaderboard"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm font-medium transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leaderboard
          </Link>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-40 bg-white/[0.03] rounded-3xl border border-white/5" />
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3].map(i => <div key={i} className="h-28 bg-white/[0.03] rounded-2xl border border-white/5" />)}
              </div>
            </div>
          ) : notFound ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
              <User className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <h2 className="text-white/60 font-bold text-lg font-manrope">Profile Not Found</h2>
              <p className="text-white/30 text-sm mt-2">This may be a bot or the account doesn't exist.</p>
            </div>
          ) : user ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="space-y-5"
            >
              {/* Hero Card */}
              <div className="relative bg-[#0a0b12] border border-white/[0.08] rounded-3xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
                {/* Purple top gradient bar */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                {/* Ambient glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-violet-900/20 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative p-7 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <UserAvatar
                      photoURL={user.photoURL}
                      name={user.displayName}
                      activeFrame={user.activeAvatarFrame}
                      size="xl"
                    />
                    {isOwnProfile && (
                      <span className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-black/20">
                        YOU
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <UserDisplayName
                        name={user.displayName}
                        activeNameColor={user.activeNameColor}
                        className="font-manrope font-extrabold text-2xl text-white tracking-tight"
                      />
                      <LevelBadge level={level} />
                    </div>
                    {user.graduationYear && (
                      <div className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium mb-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>Class of {user.graduationYear}</span>
                      </div>
                    )}
                    {/* Level progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-mono text-white/30 mb-1">
                        <span>Level {level}</span>
                        <span>{xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* XP & Coins */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2">
                      <img src="/images/xp-shield-zoomed.png" alt="XP" className="w-5 h-5 object-contain" />
                      <span className="font-bold text-white text-sm">{xp.toLocaleString()}<span className="text-white/30 font-normal ml-1 text-xs">XP</span></span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-2">
                      <img src="/images/coin-zoomed.png" alt="Coins" className="w-5 h-5 object-contain" />
                      <span className="font-bold text-amber-400 text-sm">{(user.credits || 0).toLocaleString()}<span className="text-white/30 font-normal ml-1 text-xs">Coins</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Target, label: "Questions", value: (user.totalQuestionsAnswered || 0).toLocaleString(), color: "text-violet-400" },
                  { icon: CheckCircle, label: "Correct", value: (user.totalQuestionsCorrect || 0).toLocaleString(), color: "text-emerald-400" },
                  { icon: Trophy, label: "Accuracy", value: `${accuracy}%`, color: "text-amber-400" },
                  { icon: Flame, label: "Streak", value: `${user.streakDays || 0}d`, color: "text-orange-400" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex flex-col gap-2">
                    <Icon className={`w-4 h-4 ${color}`} />
                    <div>
                      <div className={`font-instrument text-2xl font-bold ${color}`}>{value}</div>
                      <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enrolled Courses */}
              <div className="bg-[#0a0b12] border border-white/[0.07] rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="w-4 h-4 text-white/40" />
                  <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.18em]">
                    Enrolled Courses
                  </span>
                </div>

                {!user.enrolledCourses || user.enrolledCourses.length === 0 ? (
                  <div className="text-center py-8 text-white/20 text-sm">
                    No courses enrolled yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.enrolledCourses.map((slug) => {
                      const meta = COURSE_META[slug];
                      if (!meta) return null;
                      return (
                        <Link
                          key={slug}
                          href={`/dashboard/${slug}`}
                          className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all group"
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                            style={{ backgroundColor: `${meta.accentColor}20`, border: `1px solid ${meta.accentColor}30` }}
                          >
                            {meta.emoji}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white text-sm truncate group-hover:text-violet-300 transition-colors">
                              {meta.name}
                            </div>
                            <div className="text-[10px] text-white/30 font-mono uppercase tracking-wider">Enrolled</div>
                          </div>
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.accentColor }} />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Member since */}
              {user.createdAt && (
                <p className="text-center text-white/20 text-xs font-mono">
                  Member since {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                </p>
              )}
            </motion.div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
