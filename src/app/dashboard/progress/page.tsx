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
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { UserAvatar } from "@/components/UserAvatar";
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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDayInfo(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDayInfo(null);
  };

  // Compute metrics safely
  const xp = progress?.xp || 0;
  const level = getLevelForXp(xp);
  const currentLevelThreshold = getXpThresholdForLevel(level);
  const nextLevelThreshold = getXpThresholdForLevel(level + 1);
  const xpNeededForNext = Math.max(1, nextLevelThreshold - currentLevelThreshold);
  const xpInCurrentLevel = Math.max(0, xp - currentLevelThreshold);
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));

  const totalAnswered = progress?.totalQuestionsAnswered || 0;
  const totalCorrect = progress?.totalQuestionsCorrect || 0;
  const accuracyRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const firstName = currentUser?.displayName?.split(" ")[0] || "Scholar";

  const streakCount = progress?.streakCount || 0;
  const maxStreak = progress?.maxStreak || 0;

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

  const xpBreakdown = useMemo(() => {
    if (xp === 0) {
      return { practice: 0, mastery: 0, exams: 0 };
    }
    const quizXp = totalCorrect * 10;
    const masteryXp = (progress?.completedTopics?.length || 0) * 100;
    const examXp = Math.max(0, xp - quizXp - masteryXp);

    const practicePercent = Math.min(100, Math.round((quizXp / xp) * 100));
    const masteryPercent = Math.min(100, Math.round((masteryXp / xp) * 100));
    const examsPercent = Math.max(0, 100 - practicePercent - masteryPercent);

    return {
      practice: practicePercent,
      mastery: masteryPercent,
      exams: examsPercent
    };
  }, [xp, totalCorrect, progress?.completedTopics]);

  const accuracyColor = useMemo(() => {
    if (accuracyRate >= 80) return "#22c55e";
    if (accuracyRate >= 50) return "#eab308";
    return "#ef4444";
  }, [accuracyRate]);

  const getBarColor = (mins: number) => {
    if (mins >= 45) return "bg-emerald-500/60 hover:bg-emerald-400";
    if (mins >= 15) return "bg-yellow-500/50 hover:bg-yellow-400";
    return "bg-red-500/40 hover:bg-red-400";
  };

  const weeklyStudyStats = useMemo(() => {
    const logs = progress?.studyTimeLogs || {};
    const result = [];
    
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
  }, [progress?.studyTimeLogs]);

  const totalMinutes = weeklyStudyStats.reduce((acc, curr) => acc + curr.minutes, 0);
  const weeklyTotalHours = (totalMinutes / 60).toFixed(1);
  const dailyAverageMinutes = Math.round(totalMinutes / 7);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const days = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        dayNum: prevMonthTotalDays - i,
        isCurrentMonth: false,
        dateStr: "",
        intensity: 0,
        logs: []
      });
    }

    const activityLogs = progress?.activityLogs || [];

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
  }, [currentDate, progress?.activityLogs]);

  if (authLoading || progressLoading || !currentUser || !currentUser.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020308]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-clip transition-all duration-500 selection:bg-neutral-800 selection:text-white font-manrope">

      {/* Unified App Sidebar with Sticky Navigation */}
      <AppSidebar currentPath="/dashboard/progress" />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-16">
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8 pb-20 text-left">
          {/* Header Block */}
          <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 font-bold">Analytics</span>
              </div>
              <h1 className="font-instrument text-3xl font-bold tracking-tight text-white mt-1">
                Progress & Mastery
              </h1>
            </div>
          </div>

          {/* Level Progression Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-950/80 rounded-2xl border border-white/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden"
          >
            <div className="flex items-center space-x-4">
              <UserAvatar 
                photoURL={progress?.photoURL || currentUser.photoURL} 
                name={currentUser.displayName || "Scholar"} 
                activeFrame={progress?.activeAvatarFrame} 
                size="lg" 
              />
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
                <span className="text-white/40 uppercase tracking-widest font-bold">Level {level} Progress</span>
                <span className="text-white/60">{xpInCurrentLevel} / {xpNeededForNext} XP</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold block">Total XP</span>
              <span className="font-instrument text-3xl font-extrabold text-white block">{xp.toLocaleString()}</span>
            </div>
            <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold block">Questions Answered</span>
              <span className="font-instrument text-3xl font-extrabold text-white block">{totalAnswered.toLocaleString()}</span>
            </div>
            <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold block">Accuracy Rate</span>
              <span className="font-instrument text-3xl font-extrabold text-emerald-400 block">{accuracyRate}%</span>
            </div>
            <div className="bg-neutral-900/60 border border-white/5 rounded-2xl p-5 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 font-bold block">Current Streak</span>
              <span className="font-instrument text-3xl font-extrabold text-amber-400 block">{streakCount} Days</span>
            </div>
          </div>
        </main>
      </div>

      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      <FloatingXPOperations externalOpen={showQuestsModal} onClose={() => setShowQuestsModal(false)} />
    </div>
  );
}
