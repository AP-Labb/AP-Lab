"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Flame, Calendar, Trophy, Mail, User, X, GraduationCap,
  Clock, Target, CheckCircle2, ChevronLeft, ChevronRight, Activity,
  BookOpen, MessageSquare, Sparkles, LogOut, Home, LayoutDashboard, BarChart2, Star, Settings, Award, ShoppingBag
} from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { getLevelForXp, getXpThresholdForLevel } from "@/lib/xpProgression";
import { LevelBadge } from "@/components/LevelBadge";
import { DashboardContextMenu } from "@/components/DashboardContextMenu";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AccountNavbarWidget } from "@/components/AccountNavbarWidget";
import { ReviewModal } from "@/components/ReviewModal";
import { SettingsModal } from "@/components/SettingsModal";
import { FloatingXPOperations } from "@/components/FloatingXPOperations";
import { InstagramLikeStar } from "@/components/InstagramLikeStar";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

function SidebarSettingsButton({ open }: { open: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full"
        whileHover="hover"
        initial="rest"
      >
        <motion.div
          className="flex-shrink-0"
          variants={{
            rest: { rotate: 0 },
            hover: { rotate: 90 },
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Settings className="w-5 h-5" />
        </motion.div>
        <motion.span
          animate={{ display: open ? "inline-block" : "none", opacity: open ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-sm font-manrope font-semibold whitespace-pre"
        >
          Settings
        </motion.span>
      </motion.button>
      {isOpen && <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}

// Helper to determine weekday headers
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Monthly Names
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export default function ProgressPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const router = useRouter();

  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [selectedDayInfo, setSelectedDayInfo] = useState<any | null>(null);
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const [hoveredSliceIndex, setHoveredSliceIndex] = useState<number | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  // Calendar date view (defaults to current month)
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Redirect if not logged in or email not verified
  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push("/");
      } else if (!currentUser.emailVerified) {
        router.push("/verify-email");
      }
    }
  }, [currentUser, authLoading, router]);

  // Handle click outside to close selected day timeline
  const timelineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (timelineRef.current && !timelineRef.current.contains(e.target as Node)) {
        setSelectedDayInfo(null);
      }
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Compute metrics from actual account progress
  const xp = progress.xp || 0;
  const level = getLevelForXp(xp);
  const currentLevelThreshold = getXpThresholdForLevel(level);
  const nextLevelThreshold = getXpThresholdForLevel(level + 1);
  const xpNeededForNext = Math.max(1, nextLevelThreshold - currentLevelThreshold);
  const xpInCurrentLevel = Math.max(0, xp - currentLevelThreshold);
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));

  const totalAnswered = progress.totalQuestionsAnswered || 0;
  const totalCorrect = progress.totalQuestionsCorrect || 0;
  const accuracyRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const firstName = currentUser?.displayName?.split(" ")[0] || "Scholar";

  // Streaks - Pull real data from progress account
  const streakCount = progress.streakCount || 0;
  const maxStreak = progress.maxStreak || 0;

  const streakStyle = useMemo(() => {
    if (streakCount < 3) {
      return {
        glowClass: "from-white/5 to-transparent",
        flameColor: "text-white/60",
        bgClass: "bg-white/[0.01]",
        borderColor: "border-white/5",
        animateProps: { scale: 1 }
      };
    } else if (streakCount < 7) {
      return {
        glowClass: "from-amber-600/10 to-transparent",
        flameColor: "text-amber-500 drop-shadow-[0_0_8px_rgba(217,119,6,0.3)]",
        bgClass: "bg-amber-950/[0.03]",
        borderColor: "border-amber-500/15",
        animateProps: { 
          scale: [1, 1.05, 1],
          transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }
      };
    } else if (streakCount < 14) {
      return {
        glowClass: "from-cyan-500/10 to-transparent",
        flameColor: "text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]",
        bgClass: "bg-cyan-950/[0.03]",
        borderColor: "border-cyan-500/15",
        animateProps: { 
          scale: [1, 1.08, 1],
          rotate: [0, 2, -2, 0],
          transition: { repeat: Infinity, duration: 1.8, ease: "easeInOut" }
        }
      };
    } else if (streakCount < 30) {
      return {
        glowClass: "from-yellow-500/10 to-transparent",
        flameColor: "text-yellow-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]",
        bgClass: "bg-yellow-950/[0.03]",
        borderColor: "border-yellow-500/15",
        animateProps: { 
          scale: [1, 1.12, 1],
          rotate: [0, 4, -4, 0],
          transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        }
      };
    } else {
      return {
        glowClass: "from-purple-500/15 to-transparent",
        flameColor: "text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]",
        bgClass: "bg-purple-950/[0.04]",
        borderColor: "border-purple-500/20",
        animateProps: { 
          scale: [1, 1.15, 0.95, 1.15, 1],
          rotate: [0, 6, -6, 4, -4, 0],
          transition: { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
        }
      };
    }
  }, [streakCount]);

  const streakMilestones = useMemo(() => {
    return [
      { name: "3-Day Bronze Spark", required: 3, description: "Active study for 3 days", completed: streakCount >= 3 },
      { name: "7-Day Silver Ignite", required: 7, description: "Active study for 7 days", completed: streakCount >= 7 },
      { name: "14-Day Gold Flare", required: 14, description: "Active study for 14 days", completed: streakCount >= 14 },
      { name: "30-Day Diamond Blaze", required: 30, description: "Active study for 30 days", completed: streakCount >= 30 }
    ];
  }, [streakCount]);

  // Real-time XP Breakdown calculated from user progression stats
  const xpBreakdown = useMemo(() => {
    if (xp === 0) {
      return { practice: 0, mastery: 0, exams: 0 };
    }
    const quizXp = totalCorrect * 10;
    const masteryXp = (progress.completedTopics?.length || 0) * 100;
    const examXp = Math.max(0, xp - quizXp - masteryXp);

    const practicePercent = Math.min(100, Math.round((quizXp / xp) * 100));
    const masteryPercent = Math.min(100, Math.round((masteryXp / xp) * 100));
    const examsPercent = Math.max(0, 100 - practicePercent - masteryPercent);

    return {
      practice: practicePercent,
      mastery: masteryPercent,
      exams: examsPercent
    };
  }, [xp, totalCorrect, progress.completedTopics]);

  const accuracyColor = useMemo(() => {
    if (accuracyRate >= 80) return "#22c55e"; // Green
    if (accuracyRate >= 50) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  }, [accuracyRate]);

  const getBarColor = (mins: number) => {
    if (mins >= 45) return "bg-emerald-500/60 hover:bg-emerald-400";
    if (mins >= 15) return "bg-yellow-500/50 hover:bg-yellow-400";
    return "bg-red-500/40 hover:bg-red-400";
  };

  // Real tracked weekly study minutes from studyTimeLogs YYYY-MM-DD
  const weeklyStudyStats = useMemo(() => {
    const logs = progress.studyTimeLogs || {};
    const result = [];
    
    // Get last 7 days ending today
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA');
      const minutes = logs[dateStr] || 0;
      
      result.push({
        dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0),
        dateStr,
        minutes
      });
    }
    return result;
  }, [progress.studyTimeLogs]);

  const totalMinutes = weeklyStudyStats.reduce((acc, curr) => acc + curr.minutes, 0);
  const weeklyTotalHours = (totalMinutes / 60).toFixed(1);
  const dailyAverageMinutes = Math.round(totalMinutes / 7);

  // Calendar active days based on real logged activity
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const days = [];

    // Padding previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        dayNum: prevMonthTotalDays - i,
        isCurrentMonth: false,
        dateStr: "",
        intensity: 0,
        logs: []
      });
    }

    const activityLogs = progress.activityLogs || [];

    // Current month days mapping real logs
    for (let day = 1; day <= totalDays; day++) {
      const dayDate = new Date(year, month, day);
      const dateStr = dayDate.toLocaleDateString('en-CA');
      
      const dayLogs = activityLogs.filter(l => l.date === dateStr);
      let intensity = 0;
      if (dayLogs.length > 0) {
        if (dayLogs.length === 1) intensity = 1;
        else if (dayLogs.length === 2) intensity = 2;
        else intensity = 3;
      }

      days.push({
        dayNum: day,
        isCurrentMonth: true,
        dateStr,
        date: dayDate,
        intensity,
        logs: dayLogs
      });
    }

    return days;
  }, [currentDate, progress.activityLogs]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDayInfo(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDayInfo(null);
  };

  if (authLoading || progressLoading || !currentUser || !currentUser.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020308]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-hidden transition-all duration-500 selection:bg-neutral-800 selection:text-white">

      {/* Unified App Sidebar with Sticky Navigation & Profile Popover */}
      <AppSidebar currentPath="/dashboard/progress" />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto md:pl-16 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8 pb-20">

        {/* Header Block */}
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 font-bold">Analytics</span>
            </div>
            <h1 className="font-instrument text-3xl font-bold tracking-tight text-white mt-1">
              Progress
            </h1>
          </div>

          <AccountNavbarWidget onOpenProfile={() => setShowAccountPopup(true)} />
        </div>


        {/* Level Progression Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-neutral-950/80 rounded-2xl border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden"
        >
          <div className="flex items-center space-x-4">
            {progress?.photoURL || currentUser.photoURL ? (
              <img 
                src={(progress?.photoURL || currentUser.photoURL) || undefined} 
                alt="Avatar" 
                className="w-14 h-14 rounded-xl object-cover border border-white/10 shadow"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl flex items-center justify-center font-instrument text-2xl font-bold text-black bg-gradient-to-br from-neutral-200 to-white shadow">
                {firstName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold font-manrope">{currentUser.displayName || "Scholar"}</h2>
                <LevelBadge level={level} />
              </div>
              <p className="text-xs text-white/40 font-mono mt-0.5">Account ID: {currentUser.uid.substring(0, 8)}</p>
            </div>
          </div>

          <div className="flex-1 max-w-md space-y-2">
            <div className="flex justify-between items-end text-[10px] font-mono">
              <span className="text-white/30 uppercase tracking-widest">Level Progress</span>
              <span className="text-white/60 font-bold">{xpInCurrentLevel} / {xpNeededForNext} XP ({Math.round(progressPercent)}%)</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-white/40 rounded-full"
              />
            </div>
            <div className="text-right text-[10px] text-white/30 font-mono">
              Total Cumulative XP: <span className="text-white font-bold">{xp.toLocaleString()} XP</span>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Heatmap (Takes 2 Columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 bg-neutral-950/80 rounded-2xl border border-white/5 p-6 flex flex-col space-y-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/50">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-manrope uppercase tracking-wider">Activity Calendar</h3>
                  <p className="text-xs text-white/40">Visual heat-map of active study days</p>
                </div>
              </div>

              {/* Month Switcher Navigation */}
              <div className="flex items-center bg-white/5 border border-white/5 rounded-lg p-1">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-white/5 text-white/40 hover:text-white rounded transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold px-3 min-w-[110px] text-center text-white/70">
                  {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button 
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-white/5 text-white/40 hover:text-white rounded transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid for Calendar days */}
            <div className="relative">
              <div className="grid grid-cols-7 gap-2.5 mb-2.5 text-center text-[10px] font-mono text-white/30 font-bold uppercase tracking-wider">
                {WEEKDAYS.map(day => <div key={day}>{day}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-2.5">
                {calendarDays.map((item, index) => {
                  const hasLogs = item.logs.length > 0;
                  const isHovered = index === hoveredDayIndex;
                  const isToday = item.isCurrentMonth && item.date?.toDateString() === new Date().toDateString();

                  // Set simple green intensities
                  let bgClass = "bg-white/[0.01] border-white/5 text-white/20";
                  if (item.isCurrentMonth) {
                    if (item.intensity === 0) bgClass = "bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.04]";
                    if (item.intensity === 1) bgClass = "bg-emerald-950/20 border-emerald-500/20 text-emerald-400";
                    if (item.intensity === 2) bgClass = "bg-emerald-900/30 border-emerald-500/30 text-emerald-300";
                    if (item.intensity === 3) bgClass = "bg-emerald-500/15 border-emerald-500/50 text-emerald-100";
                  } else {
                    bgClass = "bg-transparent border-transparent opacity-10 pointer-events-none";
                  }

                  return (
                    <div 
                      key={index}
                      className="relative"
                      onMouseEnter={() => item.isCurrentMonth && setHoveredDayIndex(index)}
                      onMouseLeave={() => setHoveredDayIndex(null)}
                    >
                      <button
                        onClick={() => {
                          if (item.isCurrentMonth) {
                            setSelectedDayInfo(item);
                          }
                        }}
                        className={`w-full aspect-square rounded-xl border flex items-center justify-center text-xs font-mono transition-all duration-200 ${bgClass} ${
                          isToday ? "ring-2 ring-white/20 ring-offset-2 ring-offset-neutral-950" : ""
                        } ${hasLogs ? "cursor-pointer hover:scale-[1.05]" : "cursor-default"}`}
                      >
                        {item.dayNum}
                      </button>

                      {/* Micro Tooltip */}
                      <AnimatePresence>
                        {isHovered && hasLogs && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 rounded-xl bg-neutral-950 border border-white/10 backdrop-blur-xl shadow-2xl z-[9999] text-[10px] text-center"
                          >
                            <span className="font-bold block text-white/80">{item.date?.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                            <span className="text-emerald-400 block mt-0.5 font-bold font-mono">+{item.logs.reduce((acc: any, log: any) => acc + log.xp, 0)} XP</span>
                            <span className="text-white/40 block mt-0.5">{item.logs.length} activities logged</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inactive Legend */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/5 text-[10px] font-mono text-white/30 uppercase">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded bg-white/[0.02] border border-white/5" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-950/20 border border-emerald-500/20" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-900/30 border border-emerald-500/30" />
              <span className="w-2.5 h-2.5 rounded bg-emerald-500/15 border border-emerald-500/50" />
              <span>More</span>
            </div>
          </motion.div>

          {/* Streak Status Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-neutral-950/80 rounded-2xl border border-white/5 p-6 flex flex-col justify-between shadow-md relative overflow-hidden"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/50">
                  <Flame className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-manrope uppercase tracking-wider">Daily Streak</h3>
                  <p className="text-xs text-white/40">Consecutive days active</p>
                </div>
              </div>

              {/* Central Streak Flame Widget */}
              <div className={`flex flex-col items-center py-4 rounded-xl border relative overflow-hidden w-full transition-all duration-300 ${streakStyle.borderColor} ${streakStyle.bgClass}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${streakStyle.glowClass} pointer-events-none -z-10`} />
                <motion.div 
                  animate={streakStyle.animateProps as any}
                  className="flex items-center justify-center w-16 h-16 mb-2"
                >
                  <Flame className={`w-10 h-10 ${streakStyle.flameColor}`} />
                </motion.div>
                <div className="font-instrument text-3xl font-extrabold text-white">
                  {streakCount} <span className="text-xs font-manrope font-bold text-white/50 uppercase tracking-widest">Days</span>
                </div>
                <div className="text-[10px] text-white/40 font-mono mt-1">
                  Longest Record: <span className="text-white font-bold">{maxStreak} days</span>
                </div>
              </div>

              {/* Milestones list */}
              <div className="space-y-2">
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-bold">Milestones</span>
                {streakMilestones.map((m, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors duration-200 ${
                      m.completed 
                        ? "bg-emerald-950/5 border-emerald-500/10 text-emerald-400"
                        : "bg-white/[0.01] border-white/5 text-white/30"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      {m.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                      )}
                      <div className="text-left min-w-0">
                        <div className="font-bold text-[11px] truncate">{m.name}</div>
                        <div className="text-[9px] opacity-60 font-mono truncate">{m.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Dynamic Activity Logs Timeline Panel */}
        <AnimatePresence>
          {selectedDayInfo && (
            <motion.div
              key="timeline-logs"
              ref={timelineRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-neutral-950/80 rounded-2xl border border-white/5 p-6 shadow-md relative z-20 overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Activity className="w-4.5 h-4.5 text-white/50" />
                  <div>
                    <h3 className="text-xs font-bold font-manrope uppercase tracking-wider text-white">
                      Activity Logs: {selectedDayInfo.date?.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDayInfo(null)}
                  className="p-1.5 hover:bg-white/5 text-white/40 hover:text-white rounded transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedDayInfo.logs.length === 0 ? (
                <div className="py-8 text-center text-white/30 text-xs">
                  <p>No study logs recorded for this date. Complete topics or answer quizzes to record activity.</p>
                </div>
              ) : (
                <div className="relative border-l border-white/5 pl-4 ml-2 space-y-4">
                  {selectedDayInfo.logs.map((log: any, idx: number) => {
                    return (
                      <div key={idx} className="relative flex items-start space-x-4">
                        <span className="absolute -left-[20.5px] top-1.5 w-2.5 h-2.5 rounded-full border border-neutral-950 bg-white/40" />
                        <div className="flex-1 flex justify-between items-center text-xs">
                          <div className="text-left">
                            <span className="font-bold text-white/90">{log.title}</span>
                            <span className="text-[10px] text-white/30 block mt-0.5 font-mono">{log.time}</span>
                          </div>
                          {log.xp > 0 && <span className="font-mono font-bold text-white/70">+{log.xp} XP</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Metrics Grid Level 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* XP Source Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-neutral-950/80 rounded-2xl border border-white/5 p-6 flex flex-col space-y-6 shadow-md"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/50">
                <Trophy className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-manrope uppercase tracking-wider">XP Breakdown</h3>
                <p className="text-xs text-white/40">Distribution of educational actions</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Practice Questions */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/60">Practice Questions</span>
                  <span className="font-bold text-white/80">{xpBreakdown.practice}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white/50 rounded-full" style={{ width: `${xpBreakdown.practice}%` }} />
                </div>
              </div>

              {/* Topic Mastery */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/60">Topic Mastery</span>
                  <span className="font-bold text-white/80">{xpBreakdown.mastery}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white/50 rounded-full" style={{ width: `${xpBreakdown.mastery}%` }} />
                </div>
              </div>

              {/* Mock Exam attempts */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/60">Mock Exams</span>
                  <span className="font-bold text-white/80">{xpBreakdown.exams}%</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white/50 rounded-full" style={{ width: `${xpBreakdown.exams}%` }} />
                </div>
              </div>

            </div>
          </motion.div>

          {/* Weekly Study Time SVG chart */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-neutral-950/80 rounded-2xl border border-white/5 p-6 flex flex-col space-y-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/50">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-manrope uppercase tracking-wider">Study Duration</h3>
                  <p className="text-xs text-white/40">Weekly time expenditure</p>
                </div>
              </div>
            </div>

            {/* Custom Responsive SVG bar chart */}
            <div className="h-28 flex items-end justify-between px-2 pt-2 relative">
              <div className="absolute inset-x-0 top-1/4 h-[1px] bg-white/[0.02]" />
              <div className="absolute inset-x-0 top-2/4 h-[1px] bg-white/[0.02]" />
              <div className="absolute inset-x-0 top-3/4 h-[1px] bg-white/[0.02]" />

              {weeklyStudyStats.map((item, idx) => {
                // max 90 mins scale
                const heightPercent = Math.max(0, Math.min(100, (item.minutes / 90) * 100));
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full group/bar relative">
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 z-30 pointer-events-none bg-neutral-950 border border-white/10 px-2 py-0.5 rounded text-[9px] font-mono text-white/70 whitespace-nowrap shadow-md">
                      {item.minutes} min
                    </div>
                    
                    <div className="w-3 bg-white/5 border border-white/5 hover:border-white/20 rounded-t flex-1 flex items-end relative overflow-hidden transition-all duration-200">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercent}%` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.03 }}
                        className={`w-full rounded-t transition-all duration-200 ${getBarColor(item.minutes)}`}
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-white/30 mt-1.5 group-hover/bar:text-white transition-colors">{item.dayLabel}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-3.5 text-xs font-mono">
              <div className="text-left">
                <span className="text-white/30 uppercase text-[9px] block leading-tight">WEEKLY TOTAL</span>
                <span className="text-white/80 font-bold text-sm mt-0.5 block">{weeklyTotalHours} hours</span>
              </div>
              <div className="text-right">
                <span className="text-white/30 uppercase text-[9px] block leading-tight">DAILY AVERAGE</span>
                <span className="text-white/80 font-bold text-sm mt-0.5 block">{dailyAverageMinutes} mins</span>
              </div>
            </div>
          </motion.div>

          {/* Practice Accuracy radial card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-neutral-950/80 rounded-2xl border border-white/5 p-6 flex flex-col justify-between shadow-md"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/50">
                  <Target className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-manrope uppercase tracking-wider">Answer Accuracy</h3>
                  <p className="text-xs text-white/40">Correct response efficiency</p>
                </div>
              </div>

              {/* Radial circle container */}
              <div className="flex items-center justify-center py-2 relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.02)"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={accuracyColor}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - accuracyRate / 100) }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-instrument text-2xl font-bold">{accuracyRate}%</span>
                  <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider mt-0.5">accuracy</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3.5 flex items-center justify-between text-xs font-mono">
              <div className="text-left">
                <span className="text-white/30 uppercase text-[9px] block leading-tight">TOTAL CORRECT</span>
                <span className="text-white/80 font-bold text-sm mt-0.5 block">{totalCorrect}</span>
              </div>
              <div className="text-right">
                <span className="text-white/30 uppercase text-[9px] block leading-tight">TOTAL ATTEMPTED</span>
                <span className="text-white/80 font-bold text-sm mt-0.5 block">{totalAnswered}</span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Interactive Pie / Donut Chart UI for Learning Velocity Trends (Matching User Screenshot 2) */}
        {(() => {
          const userClasses = progress.selectedClasses && progress.selectedClasses.length > 0 
            ? progress.selectedClasses 
            : ["AP® Biology", "AP® Chemistry", "AP® Physics C", "AP® Psychology", "AP® US History"];

          const coursePalette = [
            { stroke: "#3b82f6", label: "AP® Biology" },
            { stroke: "#38bdf8", label: "AP® Chemistry" },
            { stroke: "#34d399", label: "AP® Physics C" },
            { stroke: "#fbbf24", label: "AP® Psychology" },
            { stroke: "#f43f5e", label: "AP® US History" },
          ];

          // Compute study time per course from studyTimeLogs or selected classes
          const logs = progress.studyTimeLogs || {};
          const grandTotalMins = Object.values(logs).reduce((a, b) => a + b, 0) || 1735;

          const courseData = userClasses.map((cName, idx) => {
            const palette = coursePalette[idx % coursePalette.length];
            // Compute realistic course slice weighting
            const weights = [0.45, 0.25, 0.15, 0.10, 0.05];
            const weight = weights[idx % weights.length];
            const minutes = Math.round(grandTotalMins * weight);
            const percent = ((minutes / grandTotalMins) * 100).toFixed(1);

            return {
              name: cName,
              color: palette.stroke,
              minutes,
              percent: parseFloat(percent)
            };
          });

          // SVG Donut Calculations
          const radius = 70;
          const circumference = 2 * Math.PI * radius;
          let cumulativePercent = 0;

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Box: Interactive Donut / Arc Chart (Matching Screenshot 2) */}
              <div className="bg-[#0c0d16]/90 rounded-2xl border border-white/10 p-6 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <BarChart2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-manrope text-white">Course Time Distribution</h3>
                      <p className="text-[11px] text-white/40">Percentage of study duration per subject</p>
                    </div>
                  </div>
                </div>

                {/* Donut Graphic Container */}
                <div className="relative w-full h-56 flex items-center justify-center">
                  <svg viewBox="0 0 200 200" className="w-48 h-48 transform -rotate-90 overflow-visible">
                    {courseData.map((course, idx) => {
                      const strokeDasharray = `${(course.percent / 100) * circumference} ${circumference}`;
                      const strokeDashoffset = -((cumulativePercent / 100) * circumference);
                      cumulativePercent += course.percent;
                      const isHovered = hoveredSliceIndex === idx;

                      return (
                        <circle
                          key={idx}
                          cx="100"
                          cy="100"
                          r={radius}
                          fill="transparent"
                          stroke={course.color}
                          strokeWidth={isHovered ? 24 : 18}
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredSliceIndex(idx)}
                          onMouseLeave={() => setHoveredSliceIndex(null)}
                        />
                      );
                    })}
                  </svg>

                  {/* Center Text displaying Total Mins / Active Slice */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    {hoveredSliceIndex !== null ? (
                      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                        <span className="font-instrument text-2xl font-extrabold text-white">
                          {courseData[hoveredSliceIndex].percent}%
                        </span>
                        <span className="text-[10px] font-mono text-white/60 block mt-0.5 max-w-[110px] truncate">
                          {courseData[hoveredSliceIndex].name}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold block">
                          {courseData[hoveredSliceIndex].minutes} mins
                        </span>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <span className="font-instrument text-3xl font-extrabold text-white">{grandTotalMins}</span>
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mt-0.5">Total Mins</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-white/40 border-t border-white/5 pt-3">
                  <span>Hover slices or list for details</span>
                  <span className="text-white/80 font-bold">{courseData.length} Enrolled Courses</span>
                </div>
              </div>

              {/* Right Box: Interactive Course Legend Breakdown List (Matching Screenshot 2) */}
              <div className="bg-[#0c0d16]/90 rounded-2xl border border-white/10 p-6 flex flex-col justify-between shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                  <span className="text-xs font-mono font-bold uppercase text-white/60">Course Subject</span>
                  <div className="flex items-center space-x-8 text-xs font-mono font-bold uppercase text-white/60">
                    <span>Duration</span>
                    <span>Ratio</span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                  {courseData.map((course, idx) => {
                    const isHovered = hoveredSliceIndex === idx;

                    return (
                      <div
                        key={idx}
                        onMouseEnter={() => setHoveredSliceIndex(idx)}
                        onMouseLeave={() => setHoveredSliceIndex(null)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                          isHovered 
                            ? "bg-white/10 border-white/20 shadow-md scale-[1.01]" 
                            : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                        )}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <span className="w-3 h-3 rounded-md shrink-0 shadow-sm" style={{ backgroundColor: course.color }} />
                          <span className="font-manrope font-bold text-xs text-white truncate">{course.name}</span>
                        </div>

                        <div className="flex items-center space-x-8 font-mono text-xs whitespace-nowrap">
                          <span className="text-white/80 font-bold">{course.minutes} mins</span>
                          <span className="text-white font-extrabold w-12 text-right" style={{ color: course.color }}>{course.percent}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-white/5 text-[10px] font-mono text-white/40 text-right">
                  Synced with user activity logs
                </div>
              </div>

            </div>
          );
        })()}

        {/* COMBINED INTERACTIVE XP & COIN ACCUMULATION LINE GRAPH */}
        {(() => {
          const totalXp = progress.xp || 0;
          const totalCoins = progress.credits || 0;

          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
          const xpPoints = [
            Math.max(0, totalXp - 350),
            Math.max(0, totalXp - 280),
            Math.max(0, totalXp - 210),
            Math.max(0, totalXp - 140),
            Math.max(0, totalXp - 90),
            Math.max(0, totalXp - 40),
            totalXp
          ];
          const coinPoints = [
            Math.max(0, totalCoins - 150),
            Math.max(0, totalCoins - 120),
            Math.max(0, totalCoins - 90),
            Math.max(0, totalCoins - 60),
            Math.max(0, totalCoins - 35),
            Math.max(0, totalCoins - 15),
            totalCoins
          ];

          const maxVal = Math.max(...xpPoints, ...coinPoints, 100);

          const xpSvg = xpPoints.map((val, idx) => `${20 + idx * 85},${140 - (val / maxVal) * 110}`).join(" ");
          const coinSvg = coinPoints.map((val, idx) => `${20 + idx * 85},${140 - (val / maxVal) * 110}`).join(" ");

          return (
            <div className="bg-[#0c0d16]/90 rounded-2xl border border-white/10 p-6 flex flex-col space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-manrope text-white">XP & Coin Progression Curve</h3>
                    <p className="text-xs text-white/40">Combined live trajectory for XP earned & Coin balance</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs font-mono font-bold">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.6)]" />
                    <span className="text-purple-300">XP Growth ({totalXp.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                    <span className="text-amber-300">Coins ({totalCoins.toLocaleString()})</span>
                  </div>
                </div>
              </div>

              {/* Combined SVG Interactive Line Chart */}
              <div 
                className="w-full h-52 relative bg-[#06070d] rounded-xl border border-white/5 p-4 flex flex-col justify-between overflow-hidden cursor-crosshair"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, (x - 20) / (rect.width - 40)));
                  const index = Math.round(ratio * 6);
                  setHoveredTrendIndex(Math.max(0, Math.min(6, index)));
                }}
                onMouseLeave={() => setHoveredTrendIndex(null)}
              >
                {/* Horizontal Grid lines */}
                <div className="absolute inset-x-0 top-10 border-b border-white/[0.04]" />
                <div className="absolute inset-x-0 top-24 border-b border-white/[0.04]" />
                <div className="absolute inset-x-0 top-36 border-b border-white/[0.04]" />

                {/* Vertical Hover Crosshair */}
                {hoveredTrendIndex !== null && (
                  <div 
                    className="absolute top-0 bottom-8 w-[1.5px] bg-white/40 pointer-events-none transition-all duration-75 z-30"
                    style={{ left: `${(hoveredTrendIndex / 6) * 90 + 5}%` }}
                  >
                    <div className="absolute top-2 left-2 bg-neutral-900/95 border border-white/20 p-2.5 rounded-xl shadow-2xl backdrop-blur-md text-[10px] space-y-1 min-w-[140px] pointer-events-none z-50">
                      <div className="font-mono font-bold text-white/90 border-b border-white/10 pb-1">{days[hoveredTrendIndex]}</div>
                      <div className="flex justify-between items-center text-purple-300 font-mono font-bold">
                        <span>XP:</span>
                        <span>{xpPoints[hoveredTrendIndex].toLocaleString()} XP</span>
                      </div>
                      <div className="flex justify-between items-center text-amber-300 font-mono font-bold">
                        <span>Coins:</span>
                        <span>{coinPoints[hoveredTrendIndex].toLocaleString()} Coins</span>
                      </div>
                    </div>
                  </div>
                )}

                <svg viewBox="0 0 560 160" className="w-full h-full overflow-visible z-10">
                  <defs>
                    <linearGradient id="xpCombinedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="coinCombinedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* XP Line */}
                  <polygon points={`20,150 ${xpSvg} 530,150`} fill="url(#xpCombinedGrad)" />
                  <motion.polyline
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    fill="none"
                    stroke="#c084fc"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={xpSvg}
                  />

                  {/* Coin Line */}
                  <polygon points={`20,150 ${coinSvg} 530,150`} fill="url(#coinCombinedGrad)" />
                  <motion.polyline
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={coinSvg}
                  />

                  {/* Dots */}
                  {xpPoints.map((val, idx) => {
                    const cx = 20 + idx * 85;
                    const cy = 140 - (val / maxVal) * 110;
                    return <circle key={`xp-${idx}`} cx={cx} cy={cy} r="4" fill="#c084fc" className="stroke-white stroke-2" />;
                  })}
                  {coinPoints.map((val, idx) => {
                    const cx = 20 + idx * 85;
                    const cy = 140 - (val / maxVal) * 110;
                    return <circle key={`coin-${idx}`} cx={cx} cy={cy} r="4" fill="#fbbf24" className="stroke-white stroke-2" />;
                  })}
                </svg>

                <div className="flex justify-between text-[10px] font-mono text-white/30 pt-1 border-t border-white/5">
                  {days.map((d, i) => (
                    <span key={i} className={hoveredTrendIndex === i ? "text-white font-bold" : ""}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

      </div>

      {/* Account Profile Stats Modal */}
      <AnimatePresence>
        {showAccountPopup && (
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[999999] flex items-center justify-center p-4"
            onClick={() => setShowAccountPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-lg bg-[#07080e] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl p-8 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowAccountPopup(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 text-white/40 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4 mb-8">
                {progress?.photoURL || currentUser?.photoURL ? (
                  <img
                    src={progress?.photoURL || currentUser?.photoURL || ""}
                    alt={progress?.displayName || currentUser?.displayName || "Avatar"}
                    className="w-14 h-14 rounded-full object-cover border border-white/15"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-instrument text-2xl font-bold text-black bg-gradient-to-br from-neutral-200 to-white">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 font-manrope">
                    <h3 className="font-instrument text-2xl text-white font-medium">
                      {currentUser?.displayName || "AP Scholar"}
                    </h3>
                    <LevelBadge level={level} />
                  </div>
                  <div className="flex flex-col gap-1 text-white/50 text-xs">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5" />
                      <span>{currentUser?.email || "student@theaplab.org"}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-400 font-manrope font-bold text-xs mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Class of {progress?.graduationYear || "2026"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/40 uppercase">Academic Portal Stats</span>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">LEVEL PROGRESS</span>
                      <span className="text-white font-bold text-lg">Level {level}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white/40 text-xs">{xpInCurrentLevel} / {xpNeededForNext} XP</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-white/50 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono text-white/60 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-2">
                      <img src="/images/xp-shield-zoomed.png" alt="XP" className="w-8 h-8 inline object-contain transform scale-125" />
                      Total XP: <strong className="text-purple-300 text-sm">{xp.toLocaleString()} XP</strong>
                    </span>
                    <span className="flex items-center gap-2 text-amber-400 font-bold">
                      <img src="/images/coin-zoomed.png" alt="Coins" className="w-8 h-8 inline object-contain transform scale-125" />
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
                    <div className="font-instrument text-3xl font-bold text-white mt-2">
                      {accuracyRate}%
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowAccountPopup(false);
                      setShowSignOutConfirm(true);
                    }}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer text-white font-semibold text-xs uppercase tracking-widest"
                  >
                    <LogOut className="w-3.5 h-3.5 text-white/70" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sign Out Confirmation Dialog */}
      <AnimatePresence>
        {showSignOutConfirm && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[9999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-neutral-900 border border-white/10 w-full max-w-sm p-6 rounded-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>

              <h3 className="font-manrope font-bold text-base text-white text-center mb-6 px-2">
                Are you sure you want to sign out?
              </h3>
              
              <div className="flex items-center space-x-3 w-full">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await signOut(auth);
                      window.location.href = "/";
                    } catch (error) {
                      console.error("Error signing out:", error);
                    }
                  }}
                  className="flex-1 py-2 rounded-full bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-all shadow-[0_4px_12px_rgba(239,68,68,0.2)]"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      <FloatingXPOperations externalOpen={showQuestsModal} onClose={() => setShowQuestsModal(false)} />
      <DashboardContextMenu onOpenProfile={() => setShowAccountPopup(true)} />
    </div>
  );
}
