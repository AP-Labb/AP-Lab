"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Award, Clock, ExternalLink, CheckCircle, Activity, Home, LayoutDashboard, BarChart2, ShoppingBag, LogOut, Settings
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

// Brand SVG Icons
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
  hoverColor: string;
}

const SOCIAL_TASKS: SocialTask[] = [
  {
    id: "discord",
    name: "Join Discord Server",
    xp: 100,
    url: "https://discord.com/invite/dUSaevPETd",
    actionText: "Join Server",
    icon: DiscordIcon,
    color: "bg-[#5865F2] hover:bg-[#4752C4]",
    hoverColor: "text-[#5865F2]",
  },
  {
    id: "youtube",
    name: "Subscribe on YouTube",
    xp: 100,
    url: "https://www.youtube.com/@AP_Labss",
    actionText: "Subscribe",
    icon: YoutubeIcon,
    color: "bg-[#FF0000] hover:bg-[#CC0000]",
    hoverColor: "text-[#FF0000]",
  },
  {
    id: "instagram",
    name: "Follow on Instagram",
    xp: 100,
    url: "https://www.instagram.com/ap.labb/",
    actionText: "Follow",
    icon: InstagramIcon,
    color: "bg-gradient-to-tr from-[#FFB900] via-[#FF0078] to-[#9B00E8] hover:opacity-90",
    hoverColor: "text-[#FF0078]",
  },
  {
    id: "linkedin",
    name: "Connect on LinkedIn",
    xp: 100,
    url: "https://www.linkedin.com/company/ap-labb",
    actionText: "Connect",
    icon: LinkedinIcon,
    color: "bg-[#0A66C2] hover:bg-[#004182]",
    hoverColor: "text-[#0A66C2]",
  },
];

export default function QuestsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { progress, claimSocialXp, addCredits } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Social quests persistent state
  const [clickedTasks, setClickedTasks] = useState<Record<string, boolean>>({});
  const [claimedTasks, setClaimedTasks] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});

  const userId = currentUser?.uid || "guest";
  const storageKey = `ap-lab-social-quests-${userId}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setClickedTasks(parsed.clickedTasks || {});
        setClaimedTasks(parsed.claimedTasks || {});
      }
    } catch (e) {}

    return () => {
      Object.values(timersRef.current).forEach(clearInterval);
    };
  }, [storageKey]);

  const saveSocialState = (clicked: Record<string, boolean>, claimed: Record<string, boolean>) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ clickedTasks: clicked, claimedTasks: claimed }));
    } catch (e) {}
  };

  const handleTaskActionClick = (taskId: string, url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    if (clickedTasks[taskId]) return;

    const newClicked = { ...clickedTasks, [taskId]: true };
    setClickedTasks(newClicked);
    saveSocialState(newClicked, claimedTasks);

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
    saveSocialState(clickedTasks, newClaimed);
  };

  // Daily Timer Calculation
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

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

  const totalAnswered = progress?.totalQuestionsAnswered || 0;
  const totalCorrect = progress?.totalQuestionsCorrect || 0;
  const completedTopics = progress?.completedTopics?.length || 0;

  // Daily Quests persistent state
  const dailyStorageKey = `ap-lab-daily-quests-${userId}-${new Date().toISOString().split('T')[0]}`;
  const [claimedDailies, setClaimedDailies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(dailyStorageKey);
      if (saved) setClaimedDailies(JSON.parse(saved));
    } catch (e) {}
  }, [dailyStorageKey]);

  const DAILY_QUESTS = [
    {
      id: "daily-questions",
      title: "Practice Master",
      desc: "Answer 25 questions correctly across AP courses",
      current: Math.min(25, totalCorrect),
      target: 25,
      xpReward: 250,
      coinReward: 100,
    },
    {
      id: "daily-subtopics",
      title: "Subtopic Scholar",
      desc: "Complete 2 subtopics in any AP course lab",
      current: Math.min(2, completedTopics),
      target: 2,
      xpReward: 300,
      coinReward: 150,
    },
    {
      id: "daily-streak",
      title: "Daily Study Ritual",
      desc: "Maintain your daily study streak today",
      current: (progress?.streakCount || 0) > 0 ? 1 : 0,
      target: 1,
      xpReward: 150,
      coinReward: 50,
    },
  ];

  const handleClaimDaily = async (quest: typeof DAILY_QUESTS[0]) => {
    if (claimedDailies[quest.id] || quest.current < quest.target) return;
    if (claimSocialXp) await claimSocialXp(quest.title, quest.xpReward);
    if (addCredits) await addCredits(quest.coinReward, `Completed Daily Quest: ${quest.title}`);

    const updated = { ...claimedDailies, [quest.id]: true };
    setClaimedDailies(updated);
    try { localStorage.setItem(dailyStorageKey, JSON.stringify(updated)); } catch (e) {}
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-row relative z-0 overflow-x-hidden bg-[#03040a] text-white selection:bg-white selection:text-black font-manrope">
      
      {/* STICKY Left Sidebar Navigation */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-6 sticky top-0 h-screen overflow-y-auto">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Link href="/" className="flex items-center gap-3 px-2 py-2.5 mb-4 group">
              <Activity className="w-5 h-5 text-white flex-shrink-0" />
              <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="font-bold text-white text-sm">
                AP Lab
              </motion.span>
            </Link>

            <div className="h-px bg-white/[0.06] mb-4 mx-2" />

            <div className="flex flex-col gap-1">
              <Link href="/" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <Home className="w-5 h-5 shrink-0" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-semibold">Home</motion.span>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-semibold">Dashboard</motion.span>
              </Link>
              <Link href="/dashboard/progress" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <BarChart2 className="w-5 h-5 shrink-0" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-semibold">Progress</motion.span>
              </Link>

              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full group/star"
              >
                <InstagramLikeStar />
                <motion.span
                  animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-manrope font-semibold whitespace-pre"
                >
                  Review
                </motion.span>
              </button>

              <Link href="/dashboard/quests" className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white/10 text-white font-bold border border-white/20">
                <Award className="w-5 h-5 shrink-0 text-white" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-bold text-white">Quests</motion.span>
              </Link>

              <Link href="/assistant" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <div className="w-5 h-5 shrink-0 flex items-center justify-center font-bold text-xs bg-white/10 rounded-full text-white">A</div>
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-semibold">AI Assistant</motion.span>
              </Link>

              <Link href="/shop" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <ShoppingBag className="w-5 h-5 shrink-0 text-amber-400" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-semibold text-amber-400">Shop</motion.span>
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
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xs text-white">
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

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-16">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#03040a]/90 border-b border-white/[0.08] px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-instrument text-2xl font-bold tracking-tight text-white">Quests & Rewards</h1>
              <p className="text-xs text-white/40 font-manrope">Earn XP and coins by completing daily study quests & social tasks</p>
            </div>
          </div>

          <HeaderUserCapsules onOpenProfile={() => setShowProfileModal(true)} />
        </header>

        <main className="max-w-5xl mx-auto w-full px-6 sm:px-10 py-10 space-y-12 flex-1 text-left">
          
          {/* Daily Countdown Refresh Header */}
          <div className="relative w-full rounded-3xl bg-[#0a0c16] border border-white/10 p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            <div className="space-y-2 max-w-lg z-10">
              <span className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-white/60 inline" />
                DAILY QUEST REFRESH
              </span>
              <h2 className="font-manrope text-2xl sm:text-3xl font-extrabold text-white">
                Quests refresh in 24 hours
              </h2>
              <p className="text-xs text-white/50">
                Complete daily study objectives before the timer resets to earn XP and coins.
              </p>
            </div>

            {/* Minimalist Countdown Clock */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-6 flex items-center space-x-4 shadow-xl z-10 shrink-0">
              <div className="flex items-center space-x-3 font-mono font-extrabold text-2xl sm:text-3xl text-white">
                <div className="flex flex-col items-center">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] font-manrope font-normal text-white/40 uppercase">HRS</span>
                </div>
                <span className="text-white/40 mb-3">:</span>
                <div className="flex flex-col items-center">
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] font-manrope font-normal text-white/40 uppercase">MIN</span>
                </div>
                <span className="text-white/40 mb-3">:</span>
                <div className="flex flex-col items-center">
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] font-manrope font-normal text-white/40 uppercase">SEC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Daily Quests */}
          <section className="space-y-6">
            <h3 className="font-manrope text-lg font-bold text-white">Daily Quests</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DAILY_QUESTS.map((quest) => {
                const isClaimed = claimedDailies[quest.id] === true;
                const isComplete = quest.current >= quest.target;

                return (
                  <div key={quest.id} className="bg-[#0a0c16] border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-white/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full uppercase flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <img src="/images/xp-shield-zoomed.png" alt="XP" className="w-4 h-4 object-contain inline" />
                            +{quest.xpReward}
                          </span>
                          <span className="text-white/30">•</span>
                          <span className="flex items-center gap-1 text-amber-400">
                            <img src="/images/coin-zoomed.png" alt="Coins" className="w-4 h-4 object-contain inline" />
                            +{quest.coinReward}
                          </span>
                        </span>
                        <span className="text-xs font-mono font-bold text-white/40">
                          {quest.current}/{quest.target}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-white font-manrope">{quest.title}</h4>
                      <p className="text-xs text-white/50 leading-relaxed">{quest.desc}</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-white transition-all duration-500 rounded-full" 
                          style={{ width: `${(quest.current / quest.target) * 100}%` }}
                        />
                      </div>

                      <button
                        onClick={() => handleClaimDaily(quest)}
                        disabled={!isComplete || isClaimed}
                        className={cn(
                          "w-full py-3 rounded-full font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md",
                          isClaimed 
                            ? "bg-white/5 text-white/30 border border-white/5 cursor-default" 
                            : isComplete 
                              ? "bg-white text-black hover:bg-neutral-200 font-extrabold" 
                              : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                        )}
                      >
                        {isClaimed ? (
                          <span>Claimed ✓</span>
                        ) : isComplete ? (
                          <span>Claim Rewards!</span>
                        ) : (
                          <span>In Progress ({Math.round((quest.current / quest.target) * 100)}%)</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Social Media Quests (Exact Original FloatingXPOperations Component logic & UI) */}
          <section className="space-y-6 pt-4">
            <h3 className="font-manrope text-lg font-bold text-white">Social Quests</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOCIAL_TASKS.map((task) => {
                const isClicked = clickedTasks[task.id] === true;
                const isClaimed = claimedTasks[task.id] === true;
                const countdown = timeRemaining[task.id] || 0;
                const isTimerRunning = countdown > 0;

                return (
                  <div key={task.id} className="bg-[#0a0c16] border border-white/10 rounded-2xl p-5 flex flex-col space-y-3 shadow-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${task.hoverColor}`}>
                          <task.icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="font-manrope font-bold text-sm leading-tight text-white">{task.name}</h4>
                          <p className="text-[10px] text-white/40 font-inter mt-0.5">Earn bonus levels instantly</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-white/90 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <img src="/images/xp-shield-zoomed.png" alt="XP" className="w-4 h-4 object-contain inline" />
                        +{task.xp}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        disabled={isClaimed}
                        onClick={() => handleTaskActionClick(task.id, task.url)}
                        className={`flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl font-manrope font-bold text-xs uppercase tracking-wider transition-all select-none ${
                          isClaimed
                            ? "bg-white/5 border border-white/5 text-white/30 cursor-not-allowed"
                            : `${task.color} text-white cursor-pointer`
                        }`}
                      >
                        <span>{task.actionText}</span>
                        {!isClaimed && <ExternalLink className="w-3 h-3 opacity-60" />}
                      </button>

                      {isClaimed ? (
                        <button
                          disabled
                          className="flex-1 flex items-center justify-center space-x-1 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-manrope font-bold text-xs uppercase tracking-wider cursor-not-allowed select-none"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Claimed</span>
                        </button>
                      ) : isTimerRunning ? (
                        <button
                          disabled
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 font-manrope font-mono text-xs uppercase tracking-wider cursor-not-allowed select-none animate-pulse"
                        >
                          Wait {countdown}s
                        </button>
                      ) : isClicked ? (
                        <button
                          onClick={() => handleClaimSocialClick(task)}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-manrope font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md select-none transition-all"
                        >
                          Claim XP
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-white/20 font-manrope font-bold text-xs uppercase tracking-wider cursor-not-allowed select-none"
                        >
                          Claim XP
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

        </main>
      </div>

      <DashboardContextMenu onOpenProfile={() => setShowProfileModal(true)} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </div>
  );
}
