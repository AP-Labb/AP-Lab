"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Sparkles, 
  CheckCircle,
  ExternalLink,
  Award
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";

// Local SVG Icon definitions for social brands
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

interface Task {
  id: string;
  name: string;
  xp: number;
  url: string;
  actionText: string;
  icon: React.ComponentType<any>;
  color: string;
  hoverColor: string;
}

const SOCIAL_TASKS: Task[] = [
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

export function FloatingXPOperations({
  externalOpen,
  onClose,
}: {
  externalOpen?: boolean;
  onClose?: () => void;
}) {
  const { currentUser } = useAuth();
  const { claimSocialXp } = useProgress();
  const [internalOpen, setInternalOpen] = useState(false);

  // When controlled externally, sync internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const handleClose = () => {
    setInternalOpen(false);
    onClose?.();
  };

  // Storage states
  const [clickedTasks, setClickedTasks] = useState<Record<string, boolean>>({});
  const [claimedTasks, setClaimedTasks] = useState<Record<string, boolean>>({});
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  // Active timers references
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});

  const userId = currentUser?.uid || "guest";
  const storageKey = `ap-lab-social-quests-${userId}`;

  // 1. Initial Load of State from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setClickedTasks(parsed.clickedTasks || {});
        setClaimedTasks(parsed.claimedTasks || {});
      } else {
        setClickedTasks({});
        setClaimedTasks({});
      }
    } catch (e) {
      console.error("Error reading social quests state:", e);
    }

    // Cleanup timers on unmount
    return () => {
      Object.values(timersRef.current).forEach(clearInterval);
    };
  }, [storageKey]);

  // 2. Helper to Save State to LocalStorage
  const saveState = (clicked: Record<string, boolean>, claimed: Record<string, boolean>) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ clickedTasks: clicked, claimedTasks: claimed })
      );
    } catch (e) {
      console.error("Error writing social quests state:", e);
    }
  };

  // 3. Action Click handler
  const handleTaskActionClick = (taskId: string, url: string) => {
    // Open social media link
    window.open(url, "_blank", "noopener,noreferrer");

    // Skip if already clicked
    if (clickedTasks[taskId]) return;

    // Update clicked map
    const newClicked = { ...clickedTasks, [taskId]: true };
    setClickedTasks(newClicked);
    saveState(newClicked, claimedTasks);

    // Set countdown duration
    setTimeRemaining((prev) => ({ ...prev, [taskId]: 5 }));

    // Start 5-second countdown timer
    if (timersRef.current[taskId]) {
      clearInterval(timersRef.current[taskId]);
    }

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

  // 4. Claim XP handler
  const handleClaimClick = async (task: Task) => {
    if (claimSocialXp) {
      await claimSocialXp(task.name, task.xp);
    }

    const newClaimed = { ...claimedTasks, [task.id]: true };
    setClaimedTasks(newClaimed);
    saveState(clickedTasks, newClaimed);
  };

  // 5. Check if all tasks have been claimed to hide floating icon forever
  const allClaimed = SOCIAL_TASKS.every((task) => claimedTasks[task.id] === true);

  if (allClaimed) {
    return null; // disappear forever
  }

  return (
    <>
      {/* Floating XP Button on Bottom Right — only show when NOT controlled externally */}
      {externalOpen === undefined && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setInternalOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-neutral-950 flex items-center justify-center text-white shadow-[0_8px_32px_rgba(255,255,255,0.12)] cursor-pointer border border-white/15 hover:border-white/30 hover:shadow-[0_8px_32px_rgba(255,255,255,0.22)] transition-all group select-none"
        >
          <div className="absolute inset-0 rounded-full bg-white/5 animate-ping pointer-events-none group-hover:animate-none" />
          <Award className="w-7 h-7 text-white/90" />
        </motion.button>
      )}

      {/* Quest Pop-up Drawer/Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md bg-neutral-950 border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_32px_100px_rgba(0,0,0,0.85)] text-white overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}

                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="mb-4 mt-2">
                <h3 className="font-manrope font-bold text-xl leading-tight tracking-tight">Social Quests</h3>
                <p className="text-white/40 text-xs mt-1 font-inter">Complete the tasks below to claim instant XP boosts</p>
              </div>

              {/* Quests Lists */}
              <div className="space-y-3 mt-6">
                {SOCIAL_TASKS.map((task) => {
                  const isClicked = clickedTasks[task.id] === true;
                  const isClaimed = claimedTasks[task.id] === true;
                  const countdown = timeRemaining[task.id] || 0;
                  const isTimerRunning = countdown > 0;

                  return (
                    <div
                      key={task.id}
                      className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col space-y-3"
                    >
                      {/* Top Row: Icon, Title and XP Badge */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center ${task.hoverColor}`}>
                            <task.icon className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <h4 className="font-manrope font-bold text-sm leading-tight">{task.name}</h4>
                            <p className="text-[10px] text-white/30 font-inter mt-0.5">Earn bonus levels instantly</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xs text-white/90 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                          +{task.xp} XP
                        </span>
                      </div>

                      {/* Bottom Row: Actions */}
                      <div className="flex items-center space-x-2 pt-1">
                        {/* Social Link Button */}
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

                        {/* Claim Button */}
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
                            onClick={() => handleClaimClick(task)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-manrope font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)] select-none transition-all"
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
