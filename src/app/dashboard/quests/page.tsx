"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Award, Clock, CheckCircle2, Flame, Sparkles, Trophy, Zap, Shield, ArrowRight, Activity, Home, LayoutDashboard, BarChart2, Star, ShoppingBag, LogOut, X, RefreshCw
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { HeaderUserCapsules } from "@/components/HeaderUserCapsules";
import { DashboardContextMenu } from "@/components/DashboardContextMenu";
import { ReviewModal } from "@/components/ReviewModal";
import { InstagramLikeStar } from "@/components/InstagramLikeStar";
import { SettingsModal } from "@/components/SettingsModal";
import { Settings } from "lucide-react";
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

// Social Tasks Data
const SOCIAL_TASKS = [
  { id: "instagram", name: "Follow us on Instagram", xp: 100, rewardText: "+100 XP & 50 Coins", href: "https://instagram.com", icon: "📸" },
  { id: "youtube", name: "Subscribe to YouTube", xp: 150, rewardText: "+150 XP & 75 Coins", href: "https://youtube.com", icon: "▶️" },
  { id: "tiktok", name: "Follow on TikTok", xp: 100, rewardText: "+100 XP & 50 Coins", href: "https://tiktok.com", icon: "🎵" },
  { id: "discord", name: "Join Discord Community", xp: 200, rewardText: "+200 XP & 100 Coins", href: "https://discord.com", icon: "💬" },
];

export default function QuestsPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { progress, claimSocialXp, addCredits } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [claimedSocials, setClaimedSocials] = useState<string[]>([]);
  const [claimedDailies, setClaimedDailies] = useState<string[]>([]);

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

  // Dynamic Daily Quests based on user progress
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

  const handleClaimSocial = async (task: typeof SOCIAL_TASKS[0]) => {
    if (claimedSocials.includes(task.id)) return;
    window.open(task.href, "_blank");
    await claimSocialXp?.(task.name, task.xp);
    await addCredits?.(task.xp / 2, `Completed ${task.name}`);
    setClaimedSocials(prev => [...prev, task.id]);
  };

  const handleClaimDaily = async (quest: typeof DAILY_QUESTS[0]) => {
    if (claimedDailies.includes(quest.id) || quest.current < quest.target) return;
    await claimSocialXp?.(quest.title, quest.xpReward);
    await addCredits?.(quest.coinReward, `Completed Daily Quest: ${quest.title}`);
    setClaimedDailies(prev => [...prev, quest.id]);
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
    <div className="min-h-screen flex flex-row relative z-0 overflow-x-hidden bg-[#07080e] text-white selection:bg-purple-500 selection:text-white font-manrope">
      
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

              <Link href="/dashboard/quests" className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">
                <Award className="w-5 h-5 shrink-0 text-purple-400" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-bold text-purple-400">Quests</motion.span>
              </Link>

              <Link href="/assistant" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <img src="/images/panda-ai.png" alt="Panda AI" className="w-5 h-5 shrink-0 object-contain" />
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
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center font-bold text-xs text-white">
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
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto md:pl-16">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#07080e]/90 border-b border-white/[0.08] px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-instrument text-2xl font-bold tracking-tight text-white">Quests & Rewards</h1>
              <p className="text-xs text-white/40 font-manrope">Earn XP and coins by completing daily study quests & social tasks</p>
            </div>
          </div>

          <HeaderUserCapsules onOpenProfile={() => setShowProfileModal(true)} />
        </header>

        <main className="max-w-6xl mx-auto w-full px-6 sm:px-10 py-10 space-y-12 flex-1 text-left">
          
          {/* Daily Countdown Refresh Header */}
          <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#17142b] via-[#1b1736] to-[#120f24] border border-purple-500/30 p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            <div className="space-y-2 max-w-lg z-10">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-purple-400 inline" />
                DAILY QUEST REFRESH
              </span>
              <h2 className="font-manrope text-3xl font-extrabold text-white">
                Fresh quests drop every 24 hours
              </h2>
              <p className="text-xs text-white/50">
                Complete all daily quests before the timer resets to maximize your XP levels & coin earnings.
              </p>
            </div>

            {/* Countdown Digital Clock */}
            <div className="bg-[#0b0c16] border-2 border-purple-500/50 rounded-2xl p-4 sm:p-6 flex items-center space-x-4 shadow-2xl z-10 shrink-0">
              <Clock className="w-8 h-8 text-purple-400" />
              <div className="flex items-center space-x-3 font-mono font-extrabold text-2xl sm:text-3xl text-white">
                <div className="flex flex-col items-center">
                  <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[9px] font-manrope font-normal text-white/40 uppercase">HRS</span>
                </div>
                <span className="text-purple-400 mb-3">:</span>
                <div className="flex flex-col items-center">
                  <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[9px] font-manrope font-normal text-white/40 uppercase">MIN</span>
                </div>
                <span className="text-purple-400 mb-3">:</span>
                <div className="flex flex-col items-center">
                  <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[9px] font-manrope font-normal text-white/40 uppercase">SEC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Daily Quests */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-manrope text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>Daily Quests</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DAILY_QUESTS.map((quest) => {
                const isClaimed = claimedDailies.includes(quest.id);
                const isComplete = quest.current >= quest.target;

                return (
                  <div key={quest.id} className="bg-[#10121d] border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full uppercase">
                          +{quest.xpReward} XP & +{quest.coinReward} Coins
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
                      <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 rounded-full" 
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
                              ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white font-extrabold" 
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

          {/* Section 2: Social Media Quests */}
          <section className="space-y-6 pt-4">
            <h3 className="font-manrope text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Social Quests</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOCIAL_TASKS.map((task) => {
                const isClaimed = claimedSocials.includes(task.id);

                return (
                  <div key={task.id} className="bg-[#10121d] border border-white/10 rounded-2xl p-5 flex items-center justify-between space-x-4 shadow-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                        {task.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white font-manrope">{task.name}</h4>
                        <p className="text-xs text-amber-400 font-mono font-bold mt-0.5">{task.rewardText}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaimSocial(task)}
                      disabled={isClaimed}
                      className={cn(
                        "px-5 py-2.5 rounded-full font-bold text-xs transition-all shrink-0 cursor-pointer shadow-md",
                        isClaimed 
                          ? "bg-white/5 text-white/30 border border-white/5 cursor-default" 
                          : "bg-white text-black hover:bg-neutral-200 font-extrabold"
                      )}
                    >
                      {isClaimed ? "Claimed ✓" : "Claim"}
                    </button>
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
