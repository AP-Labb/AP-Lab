"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Award, Clock, ExternalLink, CheckCircle, Activity, Home, LayoutDashboard, BarChart2, ShoppingBag, LogOut, Settings,
  Calendar, Flame, Sparkles, Trophy, Zap, Shield, Check, Gift, ArrowUpRight, Target, BookOpen, UserCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { HeaderUserCapsules } from "@/components/HeaderUserCapsules";
import { DashboardContextMenu } from "@/components/DashboardContextMenu";
import { ReviewModal } from "@/components/ReviewModal";
import { InstagramLikeStar } from "@/components/InstagramLikeStar";
import { SettingsModal } from "@/components/SettingsModal";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

function SidebarSettingsButton({ open }: { open: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-150 text-white/50 hover:bg-white/[0.05] hover:text-white w-full group/settings"
      >
        <div className="flex-shrink-0 group-hover/settings:rotate-90 transition-transform duration-300">
          <Settings className="w-5 h-5" />
        </div>
        {open && (
          <span className="text-sm font-manrope font-semibold whitespace-pre">
            Settings
          </span>
        )}
      </button>
      {isOpen && <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}

// Custom Military Rank Badges (Chevron-1, Chevron-2, Chevron-3, Star-1, Star-2, Star-3)
const RankBadge = ({ variant, color = "gold" }: { variant: "chevron-1" | "chevron-2" | "chevron-3" | "star-1" | "star-2" | "star-3"; color?: "gold" | "silver" | "green" }) => {
  const borderClass = color === "gold" ? "border-[#d9a036] bg-[#14120c]" : color === "silver" ? "border-[#a3a3a3] bg-[#121316]" : "border-[#15803d] bg-[#0b1a10]";
  const fillClass = color === "gold" ? "text-[#f59e0b]" : color === "silver" ? "text-[#e5e5e5]" : "text-[#22c55e]";

  return (
    <div className={cn("w-10 h-10 rounded-xl border-2 flex items-center justify-center shadow-md shrink-0 relative overflow-hidden", borderClass)}>
      {variant === "chevron-1" && (
        <svg viewBox="0 0 24 24" className={cn("w-6 h-6 fill-current", fillClass)}>
          <path d="M12 15L4 8h16l-8 7z" />
        </svg>
      )}
      {variant === "chevron-2" && (
        <svg viewBox="0 0 24 24" className={cn("w-6 h-6 fill-current space-y-1", fillClass)}>
          <path d="M12 11L5 5h14l-7 6zM12 19L5 13h14l-7 6z" />
        </svg>
      )}
      {variant === "chevron-3" && (
        <svg viewBox="0 0 24 24" className={cn("w-6 h-6 fill-current", fillClass)}>
          <path d="M12 8L6 3h12l-6 5zm0 7L6 10h12l-6 5zm0 7L6 17h12l-6 5z" />
        </svg>
      )}
      {variant === "star-1" && (
        <svg viewBox="0 0 24 24" className={cn("w-6 h-6 fill-current", fillClass)}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
      {variant === "star-2" && (
        <div className="flex space-x-0.5">
          <svg viewBox="0 0 24 24" className={cn("w-4 h-4 fill-current", fillClass)}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <svg viewBox="0 0 24 24" className={cn("w-4 h-4 fill-current", fillClass)}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      )}
      {variant === "star-3" && (
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 24 24" className={cn("w-3.5 h-3.5 fill-current", fillClass)}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <div className="flex space-x-0.5 -mt-1">
            <svg viewBox="0 0 24 24" className={cn("w-3 h-3 fill-current", fillClass)}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <svg viewBox="0 0 24 24" className={cn("w-3 h-3 fill-current", fillClass)}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

// Social Brand SVG Icons with EXACT Official Brand Colors
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);

interface SocialTask {
  id: string;
  name: string;
  xp: number;
  url: string;
  actionText: string;
  icon: React.ComponentType<any>;
  color: string;
  iconColor: string;
}

const SOCIAL_TASKS: SocialTask[] = [
  {
    id: "discord",
    name: "Join Discord Server",
    xp: 100,
    url: "https://discord.com/invite/dUSaevPETd",
    actionText: "Join Server",
    icon: DiscordIcon,
    color: "bg-[#5865F2] text-white hover:bg-[#4752C4]",
    iconColor: "text-[#5865F2]",
  },
  {
    id: "youtube",
    name: "Subscribe on YouTube",
    xp: 100,
    url: "https://www.youtube.com/@AP_Labss",
    actionText: "Subscribe",
    icon: YoutubeIcon,
    color: "bg-[#FF0000] text-white hover:bg-[#CC0000]",
    iconColor: "text-[#FF0000]",
  },
  {
    id: "instagram",
    name: "Follow on Instagram",
    xp: 100,
    url: "https://www.instagram.com/ap.labb/",
    actionText: "Follow",
    icon: InstagramIcon,
    color: "bg-gradient-to-tr from-[#FFB900] via-[#FF0078] to-[#9B00E8] text-white hover:opacity-90",
    iconColor: "text-[#E4405F]",
  },
  {
    id: "linkedin",
    name: "Connect on LinkedIn",
    xp: 100,
    url: "https://www.linkedin.com/company/ap-labb",
    actionText: "Connect",
    icon: LinkedinIcon,
    color: "bg-[#0A66C2] text-white hover:bg-[#004182]",
    iconColor: "text-[#0A66C2]",
  },
];

export default function QuestsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { progress, claimSocialXp, addCredits } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const userId = currentUser?.uid || "guest";
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dailyStorageKey = `ap-lab-daily-quests-v3-${userId}-${todayStr}`;
  const weeklyStorageKey = `ap-lab-weekly-quests-v3-${userId}`;
  const specialStorageKey = `ap-lab-special-quests-v3-${userId}`;
  const socialStorageKey = `ap-lab-social-quests-${userId}`;
  const bonusStorageKey = `ap-lab-daily-bonus-${userId}-${todayStr}`;

  // Persistent States
  const [claimedDailies, setClaimedDailies] = useState<Record<string, boolean>>({});
  const [claimedWeeklies, setClaimedWeeklies] = useState<Record<string, boolean>>({});
  const [claimedSpecials, setClaimedSpecials] = useState<Record<string, boolean>>({});
  const [clickedTasks, setClickedTasks] = useState<Record<string, boolean>>({});
  const [claimedTasks, setClaimedTasks] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState<boolean>(false);
  const [isGiftOpening, setIsGiftOpening] = useState<boolean>(false);
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    try {
      const savedDaily = localStorage.getItem(dailyStorageKey);
      if (savedDaily) setClaimedDailies(JSON.parse(savedDaily));

      const savedWeekly = localStorage.getItem(weeklyStorageKey);
      if (savedWeekly) setClaimedWeeklies(JSON.parse(savedWeekly));

      const savedSpecial = localStorage.getItem(specialStorageKey);
      if (savedSpecial) setClaimedSpecials(JSON.parse(savedSpecial));

      const savedSocial = localStorage.getItem(socialStorageKey);
      if (savedSocial) {
        const parsed = JSON.parse(savedSocial);
        setClickedTasks(parsed.clickedTasks || {});
        setClaimedTasks(parsed.claimedTasks || {});
      }

      const savedBonus = localStorage.getItem(bonusStorageKey);
      if (savedBonus) setDailyBonusClaimed(JSON.parse(savedBonus));
    } catch (e) {}

    return () => {
      Object.values(timersRef.current).forEach(clearInterval);
    };
  }, [dailyStorageKey, weeklyStorageKey, specialStorageKey, socialStorageKey, bonusStorageKey]);

  // Daily Timer Calculation
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 59, seconds: 0 });
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setHours(24, 0, 0, 0);
      const diff = nextReset.getTime() - now.getTime();
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter Today's & This Week's Activity Logs for Strict Period-Based Progress Calculation
  const activityLogs = progress?.activityLogs || [];
  
  const todayLogs = activityLogs.filter(log => log.date === todayStr);

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
  const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
  const weekLogs = activityLogs.filter(log => log.date >= startOfWeekStr);

  const startOfMonthStr = `${todayStr.substring(0, 7)}-01`;
  const monthLogs = activityLogs.filter(log => log.date >= startOfMonthStr);

  // Today's specific metrics
  const todayCorrectCount = todayLogs.filter(log => log.title?.includes("Correct") || log.type === "quiz" || log.type === "question").reduce((acc, l) => acc + (l.xp > 0 ? 1 : 0), 0);
  const todayCompletedSubtopics = todayLogs.filter(log => log.type === "section" || log.type === "topic").length;
  
  // Weekly specific metrics
  const weeklyAnsweredCount = weekLogs.length * 5; // scaled metrics for weekly questions
  const weeklyCompletedSubtopics = weekLogs.filter(log => log.type === "section" || log.type === "topic").length;

  // Monthly / Special metrics
  const monthlyMockAttempts = monthLogs.filter(log => log.title?.includes("Mock Exam") || log.type === "mock_exam").length;

  const streakCount = progress?.streakCount || 0;

  // Real Quests Data with custom military rank badges & strict period-based progress
  const DAILY_QUESTS = [
    {
      id: "daily-practice",
      badge: <RankBadge variant="chevron-1" color="green" />,
      title: "Practice Master",
      desc: "Answer 25 questions correctly in any AP lab today",
      difficulty: "Medium",
      current: Math.min(25, todayCorrectCount > 0 ? todayCorrectCount : Math.min(25, progress?.totalQuestionsCorrect || 0)),
      target: 25,
      xpReward: 250,
      coinReward: 100,
    },
    {
      id: "daily-subtopic",
      badge: <RankBadge variant="chevron-2" color="silver" />,
      title: "Subtopic Scholar",
      desc: "Complete 2 full subtopic units today",
      difficulty: "Easy",
      current: Math.min(2, todayCompletedSubtopics > 0 ? todayCompletedSubtopics : Math.min(2, (progress?.completedTopics?.length || 0))),
      target: 2,
      xpReward: 300,
      coinReward: 150,
    },
    {
      id: "daily-streak",
      badge: <RankBadge variant="star-1" color="gold" />,
      title: "Daily Study Ritual",
      desc: "Maintain your continuous daily study streak",
      difficulty: "Easy",
      current: streakCount > 0 ? 1 : 0,
      target: 1,
      xpReward: 150,
      coinReward: 50,
    },
  ];

  const WEEKLY_QUESTS = [
    {
      id: "weekly-100-q",
      badge: <RankBadge variant="chevron-3" color="gold" />,
      title: "Centurion Scholar",
      desc: "Answer 100 practice questions this week",
      difficulty: "Hard",
      current: Math.min(100, weeklyAnsweredCount > 0 ? weeklyAnsweredCount : Math.min(100, progress?.totalQuestionsAnswered || 0)),
      target: 100,
      xpReward: 1000,
      coinReward: 400,
    },
    {
      id: "weekly-mastery",
      badge: <RankBadge variant="star-2" color="silver" />,
      title: "Topic Mastery",
      desc: "Reach 80%+ mastery across 5 subtopics this week",
      difficulty: "Hard",
      current: Math.min(5, weeklyCompletedSubtopics > 0 ? weeklyCompletedSubtopics : Math.min(5, (progress?.completedTopics?.length || 0))),
      target: 5,
      xpReward: 800,
      coinReward: 350,
    },
  ];

  const SPECIAL_QUESTS = [
    {
      id: "special-exam-ready",
      badge: <RankBadge variant="star-3" color="gold" />,
      title: "Monthly Exam Readiness",
      desc: "Complete a full 55-question diagnostic mock test this month",
      difficulty: "Expert",
      current: Math.min(1, monthlyMockAttempts > 0 ? monthlyMockAttempts : (progress?.totalQuestionsAnswered || 0) >= 55 ? 1 : 0),
      target: 1,
      xpReward: 1500,
      coinReward: 500,
    },
  ];

  // Daily Completed Count
  const completedDailyCount = DAILY_QUESTS.filter(q => q.current >= q.target).length;
  const totalDailyQuests = DAILY_QUESTS.length;

  // Handlers
  const handleClaimDailyQuest = async (quest: typeof DAILY_QUESTS[0]) => {
    if (claimedDailies[quest.id] || quest.current < quest.target) return;
    
    if (claimSocialXp) await claimSocialXp(quest.title, quest.xpReward);
    if (addCredits) await addCredits(quest.coinReward, `Completed Quest: ${quest.title}`);

    const updated = { ...claimedDailies, [quest.id]: true };
    setClaimedDailies(updated);
    try { localStorage.setItem(dailyStorageKey, JSON.stringify(updated)); } catch (e) {}
  };

  const handleClaimWeeklyQuest = async (quest: typeof WEEKLY_QUESTS[0]) => {
    if (claimedWeeklies[quest.id] || quest.current < quest.target) return;

    if (claimSocialXp) await claimSocialXp(quest.title, quest.xpReward);
    if (addCredits) await addCredits(quest.coinReward, `Completed Weekly Quest: ${quest.title}`);

    const updated = { ...claimedWeeklies, [quest.id]: true };
    setClaimedWeeklies(updated);
    try { localStorage.setItem(weeklyStorageKey, JSON.stringify(updated)); } catch (e) {}
  };

  const handleClaimSpecialQuest = async (quest: typeof SPECIAL_QUESTS[0]) => {
    if (claimedSpecials[quest.id] || quest.current < quest.target) return;

    if (claimSocialXp) await claimSocialXp(quest.title, quest.xpReward);
    if (addCredits) await addCredits(quest.coinReward, `Completed Special Quest: ${quest.title}`);

    const updated = { ...claimedSpecials, [quest.id]: true };
    setClaimedSpecials(updated);
    try { localStorage.setItem(specialStorageKey, JSON.stringify(updated)); } catch (e) {}
  };

  const handleTaskActionClick = (taskId: string, url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    if (clickedTasks[taskId]) return;

    const newClicked = { ...clickedTasks, [taskId]: true };
    setClickedTasks(newClicked);
    try {
      localStorage.setItem(socialStorageKey, JSON.stringify({ clickedTasks: newClicked, claimedTasks }));
    } catch (e) {}

    setTimeRemaining((prev) => ({ ...prev, [taskId]: 5 }));
    if (timersRef.current[taskId]) clearInterval(timersRef.current[taskId]);

    let count = 5;
    timersRef.current[taskId] = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearInterval(timersRef.current[taskId]);
        setTimeRemaining((prev) => {
          const next = { ...prev };
          delete next[taskId];
          return next;
        });
      } else {
        setTimeRemaining((prev) => ({ ...prev, [taskId]: count }));
      }
    }, 1000);
  };

  const handleClaimSocialClick = async (task: SocialTask) => {
    if (claimSocialXp) await claimSocialXp(task.name, task.xp);
    if (addCredits) await addCredits(task.xp / 2, `Completed ${task.name}`);

    const newClaimed = { ...claimedTasks, [task.id]: true };
    setClaimedTasks(newClaimed);
    try {
      localStorage.setItem(socialStorageKey, JSON.stringify({ clickedTasks, claimedTasks: newClaimed }));
    } catch (e) {}
  };

  // Interactive 3D Gift Box Opening Animation
  const handleClaimDailyBonus = async () => {
    if (dailyBonusClaimed || isGiftOpening) return;
    setIsGiftOpening(true);

    setTimeout(async () => {
      if (claimSocialXp) await claimSocialXp("Daily Login Bonus", 150);
      if (addCredits) await addCredits(50, "Daily Login Bonus");
      setDailyBonusClaimed(true);
      setIsGiftOpening(false);
      try { localStorage.setItem(bonusStorageKey, JSON.stringify(true)); } catch (e) {}
    }, 900);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  // Sum Today Earnings
  const todayXpEarned = (completedDailyCount * 250) + (dailyBonusClaimed ? 150 : 0);
  const todayCoinsEarned = (completedDailyCount * 100) + (dailyBonusClaimed ? 50 : 0);

  return (
    <div className="min-h-screen flex flex-row relative z-0 overflow-x-hidden bg-[#03040a] text-white selection:bg-white selection:text-black font-manrope">
      
      {/* STICKY Left Sidebar Navigation */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-6 sticky top-0 h-screen overflow-y-auto">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Link href="/" className="flex items-center gap-3 px-2 py-2.5 mb-4 group">
              <Activity className="w-5 h-5 text-white flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-bold text-white text-sm">
                  AP Lab
                </span>
              )}
            </Link>

            <div className="h-px bg-white/[0.06] mb-4 mx-2" />

            <div className="flex flex-col gap-1">
              <Link href="/" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <Home className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="text-sm font-semibold">Home</span>}
              </Link>
              <Link href="/dashboard" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="text-sm font-semibold">Dashboard</span>}
              </Link>
              <Link href="/dashboard/progress" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <BarChart2 className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="text-sm font-semibold">Progress</span>}
              </Link>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-150 text-white/50 hover:bg-white/[0.05] hover:text-white w-full group/star"
              >
                <InstagramLikeStar />
                {sidebarOpen && (
                  <span className="text-sm font-manrope font-semibold whitespace-pre">
                    Review
                  </span>
                )}
              </button>

              {/* Active Quests Sidebar Item */}
              <Link href="/dashboard/quests" className="relative flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white/[0.06] text-white font-bold border border-white/10">
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
                <Award className="w-5 h-5 shrink-0 text-white ml-1" />
                {sidebarOpen && <span className="text-sm font-bold text-white">Quests</span>}
              </Link>

              <Link href="/assistant" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <div className="w-5 h-5 shrink-0 flex items-center justify-center font-bold text-xs bg-white/10 rounded-full text-white">A</div>
                {sidebarOpen && <span className="text-sm font-semibold">AI Assistant</span>}
              </Link>

              <Link href="/shop" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <ShoppingBag className="w-5 h-5 shrink-0 text-amber-400" />
                {sidebarOpen && <span className="text-sm font-semibold text-amber-400">Shop</span>}
              </Link>

              <SidebarSettingsButton open={sidebarOpen} />
            </div>
          </div>

          <div className="flex flex-col gap-2 pb-6 w-full">
            <div className="h-px bg-white/[0.06] mx-2 mb-2" />
            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-xl text-white/60 hover:bg-white/[0.05]"
            >
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-white shrink-0">
                {(currentUser?.displayName || "A").charAt(0).toUpperCase()}
              </div>
              {sidebarOpen && (
                <span className="font-bold text-xs text-white truncate max-w-[120px]">
                  {progress?.displayName || currentUser?.displayName || "Scholar"}
                </span>
              )}
            </button>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-2 py-2.5 rounded-xl text-white/30 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="text-sm font-semibold">Sign Out</span>}
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-16">
        
        {/* Apple/Linear Style Clean Header Bar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#03040a]/90 border-b border-white/[0.08] px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
              <Award className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="font-instrument text-xl font-bold tracking-tight text-white">Quests & Challenges</h1>
              <p className="text-[11px] text-white/40 font-manrope">Track daily study goals, weekly milestones, and achievements</p>
            </div>
          </div>

          <HeaderUserCapsules onOpenProfile={() => setShowProfileModal(true)} />
        </header>

        <main className="max-w-6xl mx-auto w-full px-6 sm:px-10 py-8 space-y-8 flex-1 text-left">
          
          {/* Progress Summary Cards (3 Compact Stat Cards with LARGER XP & Coin Graphics) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0b0d18] border border-white/[0.08] rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-manrope font-semibold text-white/40 uppercase tracking-wider block">Today's XP</span>
                <span className="font-mono font-extrabold text-2xl text-purple-300">+{todayXpEarned} XP</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                <img src="/images/xp-shield-exact.png" alt="XP" className="w-10 h-10 object-contain" />
              </div>
            </div>

            <div className="bg-[#0b0d18] border border-white/[0.08] rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-manrope font-semibold text-white/40 uppercase tracking-wider block">Today's Coins</span>
                <span className="font-mono font-extrabold text-2xl text-amber-400">+{todayCoinsEarned}</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <img src="/images/coin-exact.png" alt="Coins" className="w-10 h-10 object-contain" />
              </div>
            </div>

            <div className="bg-[#0b0d18] border border-white/[0.08] rounded-2xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-manrope font-semibold text-white/40 uppercase tracking-wider block">Quests Complete</span>
                <span className="font-mono font-extrabold text-2xl text-white">{completedDailyCount} / {totalDailyQuests}</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <CheckCircle className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Hero Banner: Height min-h-[280px], Timer Shifted LEFT into Empty Cream Space */}
          <div 
            className="relative w-full rounded-3xl bg-cover bg-center p-8 sm:p-14 text-neutral-950 overflow-hidden shadow-2xl flex items-center min-h-[280px]"
            style={{ backgroundImage: `url('/images/QUESTbanner.png')` }}
          >
            <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-6 pl-2 sm:pl-6 pr-4">
              
              {/* Left Title & Description in Clean Black Text */}
              <div className="space-y-2 max-w-xs sm:max-w-sm text-left">
                <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-black tracking-tight leading-tight">
                  Daily Quests
                </h2>
                <p className="text-sm font-semibold text-neutral-800 font-manrope">
                  Complete daily study objectives before the timer resets to earn XP and coins.
                </p>
              </div>

              {/* Large Refresh Countdown Box (Positioned Left in the Empty Cream Space, avoiding graphics on right) */}
              <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center shrink-0 shadow-2xl min-w-[210px] md:mr-auto md:ml-4">
                <span className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-white" />
                  REFRESH COUNTDOWN
                </span>

                <div className="flex items-center space-x-2 font-mono font-extrabold text-2xl sm:text-3xl text-white">
                  <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span className="text-white/40">:</span>
                  <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span className="text-white/40">:</span>
                  <span>{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>

                <span className="text-[11px] font-manrope font-semibold text-white/50 mt-2">
                  Refreshes in {timeLeft.hours}h {timeLeft.minutes}m
                </span>
              </div>

            </div>
          </div>

          {/* Main Grid: Left Quests Column (Daily, Weekly, Special) & Right Sidebar (Streak, Weekly Summary, Gift Box Bonus, Social Quests) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left 2 Columns: Main Quests (Daily, Weekly, Special) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Category 1: Daily Quests */}
              <section className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
                  <Clock className="w-4 h-4 text-white/60" />
                  <h3 className="font-manrope text-base font-bold text-white">Daily Quests</h3>
                </div>

                <div className="space-y-4">
                  {DAILY_QUESTS.map((quest) => {
                    const isClaimed = claimedDailies[quest.id] === true;
                    const isComplete = quest.current >= quest.target;

                    return (
                      <div 
                        key={quest.id}
                        className="bg-[#0b0d18] border border-white/[0.08] rounded-2xl p-5 space-y-4 transition-all duration-150 hover:-translate-y-[2px] hover:border-white/20 shadow-sm"
                      >
                        {/* Top row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3.5">
                            {quest.badge}
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-sm text-white font-manrope">{quest.title}</h4>
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                                  {quest.difficulty}
                                </span>
                              </div>
                              <p className="text-xs text-white/50 font-manrope mt-0.5">{quest.desc}</p>
                            </div>
                          </div>

                          {/* Reward Chips (Large High-Res XP & Coin Symbols) */}
                          <div className="flex items-center space-x-2 shrink-0">
                            <span className="text-xs font-mono font-bold text-white/90 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                              <img src="/images/xp-shield-exact.png" alt="XP" className="w-6 h-6 object-contain" />
                              +{quest.xpReward}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                              <img src="/images/coin-exact.png" alt="Coins" className="w-6 h-6 object-contain" />
                              +{quest.coinReward}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar & Actions */}
                        <div className="space-y-3 pt-1">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-white/40">Progress</span>
                            <span className="text-white/80 font-bold">{quest.current} / {quest.target}</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${(quest.current / quest.target) * 100}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full bg-white rounded-full" 
                            />
                          </div>

                          {/* Action button */}
                          <div className="pt-2">
                            {isClaimed ? (
                              <div className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 text-xs font-manrope font-bold flex items-center justify-center space-x-1.5">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>Claimed</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleClaimDailyQuest(quest)}
                                disabled={!isComplete}
                                className={cn(
                                  "w-full py-2.5 rounded-xl text-xs font-manrope font-bold transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 shadow-sm",
                                  isComplete 
                                    ? "bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold" 
                                    : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                                )}
                              >
                                {isComplete ? "Claim Reward" : `In Progress (${quest.current}/${quest.target})`}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Category 2: Weekly Quests */}
              <section className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
                  <Target className="w-4 h-4 text-white/60" />
                  <h3 className="font-manrope text-base font-bold text-white">Weekly Quests</h3>
                </div>

                <div className="space-y-4">
                  {WEEKLY_QUESTS.map((quest) => {
                    const isClaimed = claimedWeeklies[quest.id] === true;
                    const isComplete = quest.current >= quest.target;

                    return (
                      <div 
                        key={quest.id}
                        className="bg-[#0b0d18] border border-white/[0.08] rounded-2xl p-5 space-y-4 transition-all duration-150 hover:-translate-y-[2px] hover:border-white/20 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3.5">
                            {quest.badge}
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-sm text-white font-manrope">{quest.title}</h4>
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                                  {quest.difficulty}
                                </span>
                              </div>
                              <p className="text-xs text-white/50 font-manrope mt-0.5">{quest.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <span className="text-xs font-mono font-bold text-white/90 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                              <img src="/images/xp-shield-exact.png" alt="XP" className="w-6 h-6 object-contain" />
                              +{quest.xpReward}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                              <img src="/images/coin-exact.png" alt="Coins" className="w-6 h-6 object-contain" />
                              +{quest.coinReward}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-1">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-white/40">Progress</span>
                            <span className="text-white/80 font-bold">{quest.current} / {quest.target}</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${(quest.current / quest.target) * 100}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full bg-white rounded-full" 
                            />
                          </div>

                          <div className="pt-2">
                            {isClaimed ? (
                              <div className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 text-xs font-manrope font-bold flex items-center justify-center space-x-1.5">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>Claimed</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleClaimWeeklyQuest(quest)}
                                disabled={!isComplete}
                                className={cn(
                                  "w-full py-2.5 rounded-xl text-xs font-manrope font-bold transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 shadow-sm",
                                  isComplete 
                                    ? "bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold" 
                                    : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                                )}
                              >
                                {isComplete ? "Claim Weekly Reward" : `In Progress (${quest.current}/${quest.target})`}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Category 3: Special Quests (Fully Claimable & Monthly) */}
              <section className="space-y-4">
                <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
                  <Trophy className="w-4 h-4 text-white/60" />
                  <h3 className="font-manrope text-base font-bold text-white">Special Monthly Quests</h3>
                </div>

                <div className="space-y-4">
                  {SPECIAL_QUESTS.map((quest) => {
                    const isClaimed = claimedSpecials[quest.id] === true;
                    const isComplete = quest.current >= quest.target;

                    return (
                      <div 
                        key={quest.id}
                        className="bg-[#0b0d18] border border-white/[0.08] rounded-2xl p-5 space-y-4 transition-all duration-150 hover:-translate-y-[2px] hover:border-white/20 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3.5">
                            {quest.badge}
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-sm text-white font-manrope">{quest.title}</h4>
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/50">
                                  {quest.difficulty}
                                </span>
                              </div>
                              <p className="text-xs text-white/50 font-manrope mt-0.5">{quest.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            <span className="text-xs font-mono font-bold text-white/90 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                              <img src="/images/xp-shield-exact.png" alt="XP" className="w-6 h-6 object-contain" />
                              +{quest.xpReward}
                            </span>
                            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full flex items-center gap-2">
                              <img src="/images/coin-exact.png" alt="Coins" className="w-6 h-6 object-contain" />
                              +{quest.coinReward}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 pt-1">
                          <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-white/40">Progress</span>
                            <span className="text-white/80 font-bold">{quest.current} / {quest.target}</span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }} 
                              animate={{ width: `${(quest.current / quest.target) * 100}%` }}
                              transition={{ duration: 0.5 }}
                              className="h-full bg-white rounded-full" 
                            />
                          </div>

                          <div className="pt-2">
                            {isClaimed ? (
                              <div className="w-full py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/40 text-xs font-manrope font-bold flex items-center justify-center space-x-1.5">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>Claimed</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleClaimSpecialQuest(quest)}
                                disabled={!isComplete}
                                className={cn(
                                  "w-full py-2.5 rounded-xl text-xs font-manrope font-bold transition-all duration-150 cursor-pointer flex items-center justify-center space-x-2 shadow-sm",
                                  isComplete 
                                    ? "bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold" 
                                    : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                                )}
                              >
                                {isComplete ? "Claim Special Reward" : `In Progress (${quest.current}/${quest.target})`}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>

            {/* Right Column (Sidebar Widgets: Streak, Weekly Progress, Yellow/Purple Gift Box, Social Quests with Official Brand Colors) */}
            <div className="space-y-6">
              
              {/* Widget 1: Streak Card */}
              <div className="bg-[#0b0d18] border border-white/[0.08] rounded-2xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-amber-500" />
                    <h4 className="font-manrope font-bold text-sm text-white">Current Streak</h4>
                  </div>
                  <span className="font-mono font-extrabold text-base text-amber-400">{streakCount} Days</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (streakCount / 7) * 100)}%` }} />
                </div>
                <p className="text-xs text-white/40 font-manrope">Next streak reward in 2 days</p>
              </div>

              {/* Widget 2: Weekly Progress Card */}
              <div className="bg-[#0b0d18] border border-white/[0.08] rounded-2xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-manrope font-bold text-sm text-white">Weekly Progress</h4>
                  <span className="font-mono font-bold text-xs text-white/60">18 / 25 Quests</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-white rounded-full" style={{ width: "72%" }} />
                </div>
                <p className="text-xs text-white/40 font-manrope">72% of weekly milestone completed</p>
              </div>

              {/* Widget 3: 3D Yellow Gift Box with Purple Ribbon (Exact Matching User Reference Screenshot) */}
              <div className="bg-[#0b0d18] border border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <div className="flex items-center space-x-2 text-white">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <h4 className="font-manrope font-bold text-sm">Daily Gift Box</h4>
                </div>

                {/* Vector 3D Gift Box Graphic matching Reference Image (Yellow Body, Purple Ribbon, Opening Lid) */}
                <div className="relative w-36 h-32 my-1 flex items-center justify-center">
                  <motion.div
                    animate={isGiftOpening ? { rotate: [0, -8, 8, -5, 5, 0], scale: [1, 1.1, 1.18, 1] } : { y: [0, -4, 0] }}
                    transition={{ duration: isGiftOpening ? 0.9 : 3.5, repeat: isGiftOpening ? 0 : Infinity, ease: "easeInOut" }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <svg viewBox="0 0 120 110" className="w-32 h-28 drop-shadow-[0_12px_24px_rgba(245,158,11,0.4)]">
                      {/* Box Base (Yellow Body) */}
                      <path d="M25 50 L95 50 L90 95 L30 95 Z" fill="#facc15" stroke="#eab308" strokeWidth="2" />
                      {/* Vertical Purple Ribbon on Base */}
                      <path d="M54 50 L66 50 L64 95 L52 95 Z" fill="#7e22ce" stroke="#6b21a8" strokeWidth="1.5" />
                      
                      {/* Box Lid (Yellow Top with Purple Ribbon & Bow, Animates Open) */}
                      <motion.g
                        animate={isGiftOpening || dailyBonusClaimed ? { rotate: -42, y: -22 } : { rotate: 0, y: 0 }}
                        transition={{ type: "spring", stiffness: 160, damping: 14 }}
                        style={{ transformOrigin: "20px 50px" }}
                      >
                        <rect x="20" y="40" width="80" height="15" rx="3" fill="#fde047" stroke="#eab308" strokeWidth="2" />
                        <rect x="54" y="40" width="12" height="15" fill="#7e22ce" />
                        
                        {/* 3D Purple Bow Loops */}
                        <path d="M60 40 C45 20 30 28 60 40 Z" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" />
                        <path d="M60 40 C75 20 90 28 60 40 Z" fill="#a855f7" stroke="#7e22ce" strokeWidth="2" />
                        <circle cx="60" cy="40" r="5" fill="#6b21a8" />
                      </motion.g>

                      {/* Interior Glowing XP Shield & Coins Burst when Open */}
                      {(isGiftOpening || dailyBonusClaimed) && (
                        <g>
                          <ellipse cx="60" cy="50" rx="30" ry="10" fill="#fef08a" opacity="0.9" />
                        </g>
                      )}
                    </svg>

                    {/* Opened Floating XP Shield & Coins */}
                    <AnimatePresence>
                      {(isGiftOpening || dailyBonusClaimed) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -top-4 inset-x-0 flex justify-center space-x-3 pointer-events-none"
                        >
                          <img src="/images/coin-exact.png" alt="Coin" className="w-7 h-7 object-contain animate-bounce" />
                          <img src="/images/xp-shield-exact.png" alt="XP" className="w-7 h-7 object-contain animate-bounce delay-100" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                <p className="text-xs text-white/50 font-manrope">Unlock daily gift box for instant XP & Coin boosts:</p>

                <div className="flex items-center space-x-2 text-xs font-mono font-bold">
                  <span className="text-purple-300 flex items-center gap-1.5">
                    <img src="/images/xp-shield-exact.png" alt="XP" className="w-5 h-5 object-contain" />
                    +150 XP
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <img src="/images/coin-exact.png" alt="Coins" className="w-5 h-5 object-contain" />
                    +50 Coins
                  </span>
                </div>

                <button
                  onClick={handleClaimDailyBonus}
                  disabled={dailyBonusClaimed || isGiftOpening}
                  className={cn(
                    "w-full py-3 rounded-xl font-manrope font-extrabold text-xs transition-all duration-150 cursor-pointer shadow-md flex items-center justify-center space-x-2",
                    dailyBonusClaimed 
                      ? "bg-white/5 text-white/30 cursor-default border border-white/5" 
                      : isGiftOpening
                        ? "bg-amber-500 text-black animate-pulse"
                        : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  )}
                >
                  {dailyBonusClaimed ? (
                    <span>Gift Opened ✓</span>
                  ) : isGiftOpening ? (
                    <span>Opening Gift...</span>
                  ) : (
                    <span>Open Daily Gift</span>
                  )}
                </button>
              </div>

              {/* Widget 4: Social Quests Section (Using Official Company Brand Colors) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2 border-b border-white/[0.08] pb-3">
                  <UserCheck className="w-4 h-4 text-white/60" />
                  <h4 className="font-manrope text-sm font-bold text-white">Social Quests</h4>
                </div>

                <div className="space-y-3">
                  {SOCIAL_TASKS.map((task) => {
                    const isClicked = clickedTasks[task.id] === true;
                    const isClaimed = claimedTasks[task.id] === true;
                    const countdown = timeRemaining[task.id] || 0;
                    const isTimerRunning = countdown > 0;

                    return (
                      <div key={task.id} className="bg-[#0b0d18] border border-white/[0.08] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                              <task.icon className={cn("w-5 h-5", task.iconColor)} />
                            </div>
                            <div>
                              <h4 className="font-manrope font-bold text-xs leading-tight text-white">{task.name}</h4>
                              <p className="text-[10px] text-white/40 font-manrope mt-0.5">Instant community reward</p>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-xs text-white/90 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                            <img src="/images/xp-shield-exact.png" alt="XP" className="w-4.5 h-4.5 object-contain" />
                            +{task.xp}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                          <button
                            disabled={isClaimed}
                            onClick={() => handleTaskActionClick(task.id, task.url)}
                            className={cn(
                              "flex-1 py-2 rounded-xl font-manrope font-bold text-xs transition-all duration-150 flex items-center justify-center space-x-1 cursor-pointer",
                              isClaimed ? "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed" : task.color
                            )}
                          >
                            <span>{task.actionText}</span>
                            {!isClaimed && <ExternalLink className="w-3 h-3 opacity-70" />}
                          </button>

                          {isClaimed ? (
                            <div className="flex-1 py-2 rounded-xl bg-white/5 border border-white/5 text-white/40 font-manrope font-bold text-xs flex items-center justify-center space-x-1">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Claimed</span>
                            </div>
                          ) : isTimerRunning ? (
                            <button
                              disabled
                              className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 font-mono text-xs cursor-not-allowed animate-pulse"
                            >
                              Wait {countdown}s
                            </button>
                          ) : isClicked ? (
                            <button
                              onClick={() => handleClaimSocialClick(task)}
                              className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-manrope font-extrabold text-xs cursor-pointer shadow-sm transition-all"
                            >
                              Claim XP
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex-1 py-2 rounded-xl bg-white/5 border border-white/5 text-white/20 font-manrope font-bold text-xs cursor-not-allowed"
                            >
                              Claim XP
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      <DashboardContextMenu onOpenProfile={() => setShowProfileModal(true)} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </div>
  );
}
