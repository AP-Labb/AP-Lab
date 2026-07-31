"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { doc, onSnapshot, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { getLevelForXp } from "@/lib/xpProgression";
import { playLevelUpSound, playSpinSound } from "@/lib/sounds";
import { LevelBadge } from "@/components/LevelBadge";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

interface UserProgress {
  completedTopics: string[];
  masteryScores: Record<string, number>;
  lastAccessed: any;
  totalQuestionsAnswered?: number;
  totalQuestionsCorrect?: number;
  dailyTutorMessagesCount?: number;
  dailyTutorMessagesDate?: string;
  xp?: number;
  level?: number;
  credits?: number;
  totalCreditsEarned?: number;
  earnedCreditIds?: string[];
  activeAvatarFrame?: string;
  activeNameGradient?: string;
  activeNameColor?: string;
  inventory?: string[];
  activeBoosts?: Record<string, number>; // boostId -> expiryTimestamp
  displayName?: string;
  photoURL?: string;
  email?: string;
  uid?: string;
  streakCount?: number;
  maxStreak?: number;
  streakLastActive?: string;
  activityLogs?: { date: string; time: string; type: string; title: string; xp: number }[];
  studyTimeLogs?: Record<string, number>;
  isOnboarded?: boolean;
  graduationYear?: number | string | null;
  referredBy?: string;
  goalScore?: number;
  usageIntents?: string[];
  selectedClasses?: string[];
  theme?: "dark" | "light";
  courseBg?: string;
}

interface ProgressContextType {
  progress: UserProgress;
  loading: boolean;
  completeTopic: (topicId: string, score: number) => Promise<void>;
  recordQuestionAttempt: (isCorrect: boolean, masteryKey?: string) => Promise<void>;
  recordTutorMessage: () => Promise<void>;
  recordMockExamAttempt: (correctCount: number, totalQuestions: number) => Promise<void>;
  claimSocialXp?: (taskName: string, xpAmount: number) => Promise<void>;
  updatePreferences?: (prefs: { theme?: "dark" | "light"; courseBg?: string; displayName?: string }) => Promise<void>;
  spendCredits?: (amount: number) => Promise<boolean>;
  addCredits?: (amount: number, reason?: string) => Promise<void>;
  equipItem?: (itemType: string, itemId: string) => Promise<void>;
  buyItem?: (itemId: string, cost: number, itemType: string, customColorHex?: string) => Promise<boolean>;
  useBoostItem?: (boostId: string) => Promise<boolean>;
}

const defaultProgress: UserProgress = {
  completedTopics: [],
  masteryScores: {},
  lastAccessed: null,
  totalQuestionsAnswered: 0,
  totalQuestionsCorrect: 0,
  dailyTutorMessagesCount: 0,
  dailyTutorMessagesDate: "",
  xp: 0,
  level: 1,
  displayName: "",
  photoURL: "",
  email: "",
  uid: "",
  streakCount: 0,
  maxStreak: 0,
  streakLastActive: "",
  activityLogs: [],
  studyTimeLogs: {},
  isOnboarded: false,
};

const ProgressContext = createContext<ProgressContextType>({
  progress: defaultProgress,
  loading: true,
  completeTopic: async () => {},
  recordQuestionAttempt: async (isCorrect: boolean, masteryKey?: string) => {},
  recordTutorMessage: async () => {},
  recordMockExamAttempt: async () => {},
  claimSocialXp: async () => {},
});

export const useProgress = () => useContext(ProgressContext);

// Helper Cinematic Level Up Modal Component
interface LevelUpModalProps {
  oldLevel: number;
  newLevel: number;
  onClose: () => void;
}

function LevelUpModal({ oldLevel, newLevel, onClose }: LevelUpModalProps) {
  const [isMorphed, setIsMorphed] = useState(false);
  const playedSoundRef = useRef(false);

  useEffect(() => {
    // 1. Play spin sound and level up sound on mount
    if (!playedSoundRef.current) {
      playedSoundRef.current = true;
      playSpinSound();
      playLevelUpSound();
    }

    // 2. Trigger morph at 0.9s (fast, smooth spin)
    const morphTimer = setTimeout(() => {
      setIsMorphed(true);
      // Trigger a direct confetti burst at the morph instant
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 900);

    // 3. Auto-hide modal at 3.0s
    const closeTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(morphTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/85 backdrop-blur-3xl px-4"
    >
      {/* Cinematic Flash Overlay */}
      <AnimatePresence>
        {isMorphed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, times: [0, 0.2, 1] }}
            className="absolute inset-0 bg-white pointer-events-none z-50 mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-md bg-black border border-white/15 rounded-[36px] p-10 text-center relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.95)]"
      >
        <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
          
          {/* Main Title */}
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-instrument text-4xl sm:text-5xl font-extrabold text-white tracking-tight uppercase"
          >
            Level Up!
          </motion.h2>

          {/* Centered Morphing Badge Frame */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            
            {/* Faster/Smoother Spinning Old Badge */}
            {!isMorphed && (
              <motion.div
                key="old-badge"
                initial={{ scale: 1, rotate: 0, opacity: 1 }}
                animate={{ 
                  scale: [1, 1.15, 0],
                  rotate: [0, 180, 540],
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="absolute flex items-center justify-center"
              >
                <LevelBadge level={oldLevel} size="lg" />
              </motion.div>
            )}
 
            {/* Exploding/Glowing New Badge */}
            {isMorphed && (
              <motion.div
                key="new-badge"
                initial={{ scale: 0.2, rotate: -180, opacity: 0 }}
                animate={{ scale: 1.2, rotate: 0, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  stiffness: 220,
                  damping: 14,
                  mass: 0.6
                }}
                className="relative"
              >
                <LevelBadge level={newLevel} size="lg" />
              </motion.div>
            )}
          </div>

          {/* Level Transition text (e.g. 16 ➔ 17) */}
          <div className="flex items-center justify-center space-x-3 text-2xl font-mono font-black text-white pt-2">
            <span className="text-white/60">LVL {oldLevel}</span>
            <span className="text-amber-400">➔</span>
            <span className="text-amber-400 font-extrabold">LVL {newLevel}</span>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

const updateStreakAndLogs = (
  currentProgress: UserProgress,
  xpEarned: number,
  activityType: string,
  activityTitle: string,
  studyMinutesEarned: number
): UserProgress => {
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  let streakCount = currentProgress.streakCount || 0;
  let maxStreak = currentProgress.maxStreak || 0;
  const streakLastActive = currentProgress.streakLastActive || "";

  if (streakLastActive === "") {
    streakCount = 1;
  } else if (streakLastActive === todayStr) {
    // Stays the same
  } else {
    try {
      const lastActiveDate = new Date(streakLastActive + 'T00:00:00');
      const todayDate = new Date(todayStr + 'T00:00:00');
      const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streakCount += 1;
      } else if (diffDays > 1) {
        streakCount = 1;
      }
    } catch (e) {
      streakCount = 1;
    }
  }
  maxStreak = Math.max(maxStreak, streakCount);

  const newLog = {
    date: todayStr,
    time: timeStr,
    type: activityType,
    title: activityTitle,
    xp: xpEarned
  };
  const activityLogs = [newLog, ...(currentProgress.activityLogs || [])].slice(0, 100);

  const studyTimeLogs = { ...(currentProgress.studyTimeLogs || {}) };
  studyTimeLogs[todayStr] = (studyTimeLogs[todayStr] || 0) + studyMinutesEarned;

  return {
    ...currentProgress,
    streakCount,
    maxStreak,
    streakLastActive: todayStr,
    activityLogs,
    studyTimeLogs
  };
};

export const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [loading, setLoading] = useState(true);
  const [xpToasts, setXpToasts] = useState<{ id: number; amount: number; message: string; type: "question" | "section"; creditAmount?: number }[]>([]);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number } | null>(null);

  const triggerXpToast = (amount: number, message: string, type: "question" | "section", creditAmount?: number) => {
    console.log("AP Lab Toast triggered:", { amount, message, type, creditAmount });
    setXpToasts((prev) => {
      const now = Date.now();
      // If there's an active toast added in the last 400ms, merge into it
      const recentIndex = prev.findIndex((t) => now - t.id < 400);
      if (recentIndex !== -1) {
        const updated = [...prev];
        const existing = updated[recentIndex];
        updated[recentIndex] = {
          ...existing,
          amount: existing.amount + amount,
          creditAmount: (existing.creditAmount || 0) + (creditAmount || 0),
          message: existing.message.includes("Claimed") || message.includes("Claimed") ? "Rewards Claimed!" : message,
        };
        return updated;
      }
      const id = now;
      setTimeout(() => {
        setXpToasts((p) => p.filter((t) => t.id !== id));
      }, 3800);
      return [...prev, { id, amount, message, type, creditAmount }];
    });
  };

  // Sync profile details to Firestore in background whenever user loads in
  useEffect(() => {
    if (currentUser) {
      const docRef = doc(db, "userProgress", currentUser.uid);
      setDoc(
        docRef,
        {
          uid: currentUser.uid,
          displayName: currentUser.displayName || "AP Scholar",
          photoURL: currentUser.photoURL || "",
          email: currentUser.email || "",
        },
        { merge: true }
      ).catch((err) => {
        console.error("Error syncing profile info: ", err);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    // Load guest progress to see if we need to migrate it
    let guestProgress: UserProgress | null = null;
    try {
      const guestSaved = localStorage.getItem("ap-lab-progress-guest");
      if (guestSaved) {
        guestProgress = JSON.parse(guestSaved);
      }
    } catch (e) {
      console.error("Error reading guest progress for migration:", e);
    }

    if (!currentUser) {
      const guestKey = "ap-lab-progress-guest";
      try {
        const saved = localStorage.getItem(guestKey);
        if (saved) {
          setProgress(JSON.parse(saved));
        } else {
          setProgress(defaultProgress);
        }
      } catch (e) {
        setProgress(defaultProgress);
      }
      setLoading(false);
      return;
    }

    const localKey = `ap-lab-progress-${currentUser.uid}`;
    
    // 1. Initial load from localStorage for instant offline/session recovery
    let hasLocal = false;
    try {
      const saved = localStorage.getItem(localKey);
      if (saved) {
        setProgress(JSON.parse(saved));
        setLoading(false);
        hasLocal = true;
      }
    } catch (e) {
      console.error("Error reading progress from localStorage:", e);
    }

    // Safeguard: Force loading to false after 1.5 seconds regardless of Firestore connection speed
    const forceTimer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // 2. Set up Firestore real-time listener
    const docRef = doc(db, "userProgress", currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      clearTimeout(forceTimer);
      if (docSnap.exists()) {
        const firestoreData = docSnap.data() as UserProgress;
        
        let localProgress: UserProgress | null = null;
        try {
          const saved = localStorage.getItem(localKey);
          if (saved) {
            localProgress = JSON.parse(saved);
          }
        } catch (e) {}

        const completedTopics = Array.from(new Set([
          ...(firestoreData.completedTopics || []),
          ...(localProgress?.completedTopics || []),
          ...(guestProgress?.completedTopics || [])
        ]));

        const masteryScores = { ...(firestoreData.masteryScores || {}) };
        if (localProgress?.masteryScores) {
          Object.entries(localProgress.masteryScores).forEach(([k, v]) => {
            masteryScores[k] = Math.max(masteryScores[k] || 0, v as number);
          });
        }
        if (guestProgress?.masteryScores) {
          Object.entries(guestProgress.masteryScores).forEach(([k, v]) => {
            masteryScores[k] = Math.max(masteryScores[k] || 0, v as number);
          });
        }

        // Merge daily tutor message counts based on local date
        const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        let mergedMessagesCount = localProgress?.dailyTutorMessagesCount || 0;
        let mergedMessagesDate = localProgress?.dailyTutorMessagesDate || todayStr;

        if (firestoreData.dailyTutorMessagesDate === todayStr) {
          if (mergedMessagesDate === todayStr) {
            mergedMessagesCount = Math.max(mergedMessagesCount, firestoreData.dailyTutorMessagesCount || 0);
          } else {
            mergedMessagesCount = firestoreData.dailyTutorMessagesCount || 0;
            mergedMessagesDate = todayStr;
          }
        } else if (mergedMessagesDate !== todayStr) {
          mergedMessagesCount = 0;
          mergedMessagesDate = todayStr;
        }

        if (guestProgress?.dailyTutorMessagesDate === todayStr) {
          mergedMessagesCount = Math.max(mergedMessagesCount, guestProgress.dailyTutorMessagesCount || 0);
        }

        const mergedXp = Math.max(firestoreData.xp || 0, localProgress?.xp || 0, guestProgress?.xp || 0);
        const mergedLevel = Math.max(getLevelForXp(mergedXp), firestoreData.level || 1, localProgress?.level || 1, guestProgress?.level || 1);

        const merged: UserProgress = {
          completedTopics,
          masteryScores,
          totalQuestionsAnswered: Math.max(
            firestoreData.totalQuestionsAnswered || 0, 
            localProgress?.totalQuestionsAnswered || 0,
            guestProgress?.totalQuestionsAnswered || 0
          ),
          totalQuestionsCorrect: Math.max(
            firestoreData.totalQuestionsCorrect || 0, 
            localProgress?.totalQuestionsCorrect || 0,
            guestProgress?.totalQuestionsCorrect || 0
          ),
          dailyTutorMessagesCount: mergedMessagesCount,
          dailyTutorMessagesDate: mergedMessagesDate,
          lastAccessed: firestoreData.lastAccessed || localProgress?.lastAccessed || null,
          xp: mergedXp,
          level: mergedLevel,
          displayName: firestoreData.displayName || localProgress?.displayName || currentUser.displayName || "AP Scholar",
          photoURL: firestoreData.photoURL || localProgress?.photoURL || currentUser.photoURL || "",
          email: firestoreData.email || localProgress?.email || currentUser.email || "",
          uid: firestoreData.uid || localProgress?.uid || currentUser.uid || "",
          streakCount: Math.max(firestoreData.streakCount || 0, localProgress?.streakCount || 0, guestProgress?.streakCount || 0),
          maxStreak: Math.max(firestoreData.maxStreak || 0, localProgress?.maxStreak || 0, guestProgress?.maxStreak || 0),
          streakLastActive: firestoreData.streakLastActive || localProgress?.streakLastActive || guestProgress?.streakLastActive || "",
          credits: Math.max(firestoreData.credits || 0, localProgress?.credits || 0, guestProgress?.credits || 0),
          totalCreditsEarned: Math.max(firestoreData.totalCreditsEarned || 0, localProgress?.totalCreditsEarned || 0, guestProgress?.totalCreditsEarned || 0),
          earnedCreditIds: Array.from(new Set([...(firestoreData.earnedCreditIds || []), ...(localProgress?.earnedCreditIds || []), ...(guestProgress?.earnedCreditIds || [])])),
          inventory: Array.from(new Set([...(firestoreData.inventory || []), ...(localProgress?.inventory || []), ...(guestProgress?.inventory || [])])),
          activeAvatarFrame: firestoreData.activeAvatarFrame || localProgress?.activeAvatarFrame || "",
          activeNameGradient: firestoreData.activeNameGradient || localProgress?.activeNameGradient || "",
          activityLogs: firestoreData.activityLogs || localProgress?.activityLogs || guestProgress?.activityLogs || [],
          studyTimeLogs: firestoreData.studyTimeLogs || localProgress?.studyTimeLogs || guestProgress?.studyTimeLogs || {},
          isOnboarded: firestoreData.isOnboarded || localProgress?.isOnboarded || false,
          graduationYear: firestoreData.graduationYear || localProgress?.graduationYear || guestProgress?.graduationYear || "2026",
          theme: firestoreData.theme || localProgress?.theme || "dark",
          courseBg: firestoreData.courseBg || localProgress?.courseBg || "dark-matrix",
          referredBy: firestoreData.referredBy || localProgress?.referredBy || "",
          goalScore: firestoreData.goalScore || localProgress?.goalScore || 5,
          usageIntents: firestoreData.usageIntents || localProgress?.usageIntents || [],
          selectedClasses: firestoreData.selectedClasses || localProgress?.selectedClasses || [],
        };

        // Sync back to Firestore if Firestore is out of sync or guest migration is needed
        const needsFirestoreWrite = 
          firestoreData.xp !== merged.xp || 
          firestoreData.level !== merged.level || 
          firestoreData.credits !== merged.credits ||
          (firestoreData.completedTopics || []).length !== merged.completedTopics.length ||
          firestoreData.streakCount !== merged.streakCount;

        if (needsFirestoreWrite || (guestProgress && (guestProgress.xp || 0) > 0)) {
          console.log("Firestore is out of sync or guest migration needed. Syncing merged progress to Firestore...");
          setDoc(docRef, {
            completedTopics: merged.completedTopics,
            masteryScores: merged.masteryScores,
            totalQuestionsAnswered: merged.totalQuestionsAnswered,
            totalQuestionsCorrect: merged.totalQuestionsCorrect,
            xp: merged.xp,
            level: merged.level,
            credits: merged.credits,
            totalCreditsEarned: merged.totalCreditsEarned,
            earnedCreditIds: merged.earnedCreditIds,
            inventory: merged.inventory,
            activeAvatarFrame: merged.activeAvatarFrame,
            activeNameGradient: merged.activeNameGradient,
            lastAccessed: serverTimestamp(),
            streakCount: merged.streakCount,
            maxStreak: merged.maxStreak,
            streakLastActive: merged.streakLastActive,
            activityLogs: merged.activityLogs,
            studyTimeLogs: merged.studyTimeLogs
          }, { merge: true }).then(() => {
            if (guestProgress) {
              try {
                localStorage.removeItem("ap-lab-progress-guest");
              } catch (e) {
                console.error("Error clearing guest progress:", e);
              }
            }
          }).catch((err) => {
            console.error("Error syncing merged progress to Firestore:", err);
          });
        }

        setProgress(merged);

        // Save merged back to localStorage
        try {
          localStorage.setItem(localKey, JSON.stringify(merged));
        } catch (e) {
          console.error("Error writing progress to localStorage:", e);
        }
      } else {
        // Document does not exist in Firestore! Initialize it with guest progress if available, otherwise default values
        const initialDoc: UserProgress = {
          completedTopics: guestProgress?.completedTopics || [],
          masteryScores: guestProgress?.masteryScores || {},
          lastAccessed: new Date(),
          totalQuestionsAnswered: guestProgress?.totalQuestionsAnswered || 0,
          totalQuestionsCorrect: guestProgress?.totalQuestionsCorrect || 0,
          dailyTutorMessagesCount: guestProgress?.dailyTutorMessagesCount || 0,
          dailyTutorMessagesDate: guestProgress?.dailyTutorMessagesDate || new Date().toLocaleDateString('en-CA'),
          xp: guestProgress?.xp || 0,
          level: guestProgress?.level || 1,
          displayName: currentUser.displayName || "AP Scholar",
          photoURL: currentUser.photoURL || "",
          email: currentUser.email || "",
          uid: currentUser.uid,
          streakCount: guestProgress?.streakCount || 0,
          maxStreak: guestProgress?.maxStreak || 0,
          streakLastActive: guestProgress?.streakLastActive || "",
          activityLogs: guestProgress?.activityLogs || [],
          studyTimeLogs: guestProgress?.studyTimeLogs || {},
        };

        setProgress(initialDoc);

        try {
          localStorage.setItem(localKey, JSON.stringify(initialDoc));
          if (guestProgress) {
            localStorage.removeItem("ap-lab-progress-guest");
          }
        } catch (e) {
          console.error("Error writing initial progress to localStorage:", e);
        }

        setDoc(docRef, initialDoc).catch((err) => {
          console.error("Error initializing userProgress document in Firestore: ", err);
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching progress from Firestore:", error);
      clearTimeout(forceTimer);
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(forceTimer);
    };
  }, [currentUser]);

  const completeTopic = async (topicId: string, score: number) => {
    const localKey = currentUser ? `ap-lab-progress-${currentUser.uid}` : "ap-lab-progress-guest";
    const docRef = currentUser ? doc(db, "userProgress", currentUser.uid) : null;
    
    try {
      const currentScore = progress.masteryScores[topicId] || 0;
      const newScore = Math.max(currentScore, score);
      const isFirstTime = !progress.completedTopics.includes(topicId);
      const earnedIds = progress.earnedCreditIds || [];
      const topicCreditId = `topic-${topicId}`;
      const canEarnCredits = isFirstTime && !earnedIds.includes(topicCreditId);

      const now = Date.now();
      const activeBoosts = progress.activeBoosts || {};
      const hasXpBoost = (activeBoosts["boost-2x-xp"] || 0) > now;
      const hasCoinBoost = (activeBoosts["boost-2x-coin"] || 0) > now;

      const rawXp = isFirstTime ? 100 : 0;
      const rawCredits = canEarnCredits ? 50 : 0;
      const xpEarned = hasXpBoost ? rawXp * 2 : rawXp;
      const creditsEarned = hasCoinBoost ? rawCredits * 2 : rawCredits;

      const currentXp = progress.xp || 0;
      const newXp = currentXp + xpEarned;
      const currentCredits = progress.credits || 0;
      const newCredits = currentCredits + creditsEarned;
      const newTotalCredits = (progress.totalCreditsEarned || 0) + creditsEarned;
      const newEarnedIds = canEarnCredits ? [...earnedIds, topicCreditId] : earnedIds;

      const oldLevel = progress.level || 1;
      const newLevel = getLevelForXp(newXp);
      const isLevelUp = newLevel > oldLevel;

      let updatedProgress: UserProgress = {
        ...progress,
        completedTopics: isFirstTime
          ? [...progress.completedTopics, topicId]
          : progress.completedTopics,
        masteryScores: {
          ...progress.masteryScores,
          [topicId]: newScore
        },
        xp: newXp,
        level: newLevel,
        credits: newCredits,
        totalCreditsEarned: newTotalCredits,
        earnedCreditIds: newEarnedIds,
        lastAccessed: new Date()
      };

      const courseNameClean = topicId.split("-").slice(0, 2).join(" ").toUpperCase();
      const topicNumClean = topicId.split("-").slice(2).join(".");
      updatedProgress = updateStreakAndLogs(
        updatedProgress,
        xpEarned,
        "mastery",
        `Mastered Topic ${topicNumClean} in ${courseNameClean}`,
        15
      );

      if (xpEarned > 0 || creditsEarned > 0) {
        triggerXpToast(xpEarned, creditsEarned > 0 ? "Section Completed + 50 Credits!" : "Section Completed!", "section", creditsEarned);
      }

      if (isLevelUp) {
        setTimeout(() => {
          setLevelUpData({ oldLevel, newLevel });
        }, 500);
      }

      // 1. Immediately update local React state and LocalStorage for zero-latency UI
      setProgress(updatedProgress);
      try {
        localStorage.setItem(localKey, JSON.stringify(updatedProgress));
      } catch (e) {
        console.error("Error writing progress to localStorage:", e);
      }

      // 2. Sync to Firestore in the background
      if (docRef) {
        await setDoc(docRef, {
          completedTopics: updatedProgress.completedTopics,
          masteryScores: updatedProgress.masteryScores,
          xp: updatedProgress.xp,
          level: updatedProgress.level,
          credits: updatedProgress.credits,
          totalCreditsEarned: updatedProgress.totalCreditsEarned,
          earnedCreditIds: updatedProgress.earnedCreditIds,
          lastAccessed: serverTimestamp(),
          streakCount: updatedProgress.streakCount,
          maxStreak: updatedProgress.maxStreak,
          streakLastActive: updatedProgress.streakLastActive,
          activityLogs: updatedProgress.activityLogs,
          studyTimeLogs: updatedProgress.studyTimeLogs
        }, { merge: true });
      }

    } catch (error) {
      console.error("Error updating progress in Firestore:", error);
    }
  };

  const recordQuestionAttempt = async (isCorrect: boolean, masteryKey?: string) => {
    const localKey = currentUser ? `ap-lab-progress-${currentUser.uid}` : "ap-lab-progress-guest";
    const docRef = currentUser ? doc(db, "userProgress", currentUser.uid) : null;

    try {
      const isCompleted = masteryKey ? progress.completedTopics.includes(masteryKey) : false;
      const earnedIds = progress.earnedCreditIds || [];
      const qCreditId = masteryKey ? `q-${masteryKey}` : undefined;
      const canEarnQCredits = isCorrect && (!qCreditId || !earnedIds.includes(qCreditId));
      
      const now = Date.now();
      const activeBoosts = progress.activeBoosts || {};
      const hasXpBoost = (activeBoosts["boost-2x-xp"] || 0) > now;
      const hasCoinBoost = (activeBoosts["boost-2x-coin"] || 0) > now;

      const rawXp = isCorrect ? (isCompleted ? 5 : 10) : 0;
      const rawCredits = canEarnQCredits ? 5 : 0;
      const xpEarned = hasXpBoost ? rawXp * 2 : rawXp;
      const creditsEarned = hasCoinBoost ? rawCredits * 2 : rawCredits;

      const updatedAnswered = (progress.totalQuestionsAnswered || 0) + 1;
      const updatedCorrect = (progress.totalQuestionsCorrect || 0) + (isCorrect ? 1 : 0);
      const currentXp = progress.xp || 0;
      const newXp = currentXp + xpEarned;
      const currentCredits = progress.credits || 0;
      const newCredits = currentCredits + creditsEarned;
      const newTotalCredits = (progress.totalCreditsEarned || 0) + creditsEarned;
      const newEarnedIds = (canEarnQCredits && qCreditId) ? [...earnedIds, qCreditId] : earnedIds;

      const oldLevel = progress.level || 1;
      const newLevel = getLevelForXp(newXp);
      const isLevelUp = newLevel > oldLevel;

      let updatedProgress: UserProgress = {
        ...progress,
        totalQuestionsAnswered: updatedAnswered,
        totalQuestionsCorrect: updatedCorrect,
        xp: newXp,
        level: newLevel,
        credits: newCredits,
        totalCreditsEarned: newTotalCredits,
        earnedCreditIds: newEarnedIds,
        lastAccessed: new Date()
      };

      if (isCorrect) {
        updatedProgress = updateStreakAndLogs(
          updatedProgress,
          xpEarned,
          "quiz",
          `Solved practice question correctly`,
          2
        );
      } else {
        updatedProgress = updateStreakAndLogs(
          updatedProgress,
          0,
          "quiz",
          `Attempted practice question`,
          2
        );
      }

      if (xpEarned > 0 || creditsEarned > 0) {
        triggerXpToast(
          xpEarned, 
          creditsEarned > 0 ? "Correct Answer (+5 Credits!)" : (isCompleted ? "Practice Repeated (Halved XP)" : "Question Correct!"), 
          "question", 
          creditsEarned
        );
      }
      if (isLevelUp) {
        setTimeout(() => {
          setLevelUpData({ oldLevel, newLevel });
        }, 500);
      }

      setProgress(updatedProgress);

      // 1. Immediately update LocalStorage
      try {
        localStorage.setItem(localKey, JSON.stringify(updatedProgress));
      } catch (e) {
        console.error("Error writing progress to localStorage:", e);
      }

      // 2. Sync to Firestore in the background
      if (docRef) {
        setDoc(docRef, {
          totalQuestionsAnswered: updatedProgress.totalQuestionsAnswered,
          totalQuestionsCorrect: updatedProgress.totalQuestionsCorrect,
          xp: updatedProgress.xp,
          level: updatedProgress.level,
          credits: updatedProgress.credits,
          totalCreditsEarned: updatedProgress.totalCreditsEarned,
          earnedCreditIds: updatedProgress.earnedCreditIds,
          lastAccessed: serverTimestamp(),
          streakCount: updatedProgress.streakCount,
          maxStreak: updatedProgress.maxStreak,
          streakLastActive: updatedProgress.streakLastActive,
          activityLogs: updatedProgress.activityLogs,
          studyTimeLogs: updatedProgress.studyTimeLogs
        }, { merge: true }).catch((err) => {
          console.error("Error syncing question attempt to Firestore:", err);
        });
      }

    } catch (error) {
      console.error("Error setting up question attempt update:", error);
    }
  };

  const recordTutorMessage = async () => {
    const localKey = currentUser ? `ap-lab-progress-${currentUser.uid}` : "ap-lab-progress-guest";
    const docRef = currentUser ? doc(db, "userProgress", currentUser.uid) : null;
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

    try {
      setProgress((prev) => {
        const isSameDay = prev.dailyTutorMessagesDate === todayStr;
        const newCount = isSameDay ? (prev.dailyTutorMessagesCount || 0) + 1 : 1;

        let updatedProgress: UserProgress = {
          ...prev,
          dailyTutorMessagesCount: newCount,
          dailyTutorMessagesDate: todayStr,
          lastAccessed: new Date()
        };

        updatedProgress = updateStreakAndLogs(
          updatedProgress,
          0,
          "tutor",
          "Consulted AI tutor assistant",
          3
        );

        // 1. Immediately update LocalStorage
        try {
          localStorage.setItem(localKey, JSON.stringify(updatedProgress));
        } catch (e) {
          console.error("Error writing progress to localStorage:", e);
        }

        // 2. Sync to Firestore in the background
        if (docRef) {
          setDoc(docRef, {
            dailyTutorMessagesCount: newCount,
            dailyTutorMessagesDate: todayStr,
            lastAccessed: serverTimestamp(),
            streakCount: updatedProgress.streakCount,
            maxStreak: updatedProgress.maxStreak,
            streakLastActive: updatedProgress.streakLastActive,
            activityLogs: updatedProgress.activityLogs,
            studyTimeLogs: updatedProgress.studyTimeLogs
          }, { merge: true }).catch((err) => {
            console.error("Error syncing message count to Firestore:", err);
          });
        }

        return updatedProgress;
      });

    } catch (error) {
      console.error("Error setting up message count update:", error);
    }
  };

  const recordMockExamAttempt = async (correctCount: number, totalQuestions: number) => {
    const localKey = currentUser ? `ap-lab-progress-${currentUser.uid}` : "ap-lab-progress-guest";
    const docRef = currentUser ? doc(db, "userProgress", currentUser.uid) : null;

    try {
      const xpEarned = correctCount * 15; // 15 XP per correct answer
      
      const updatedAnswered = (progress.totalQuestionsAnswered || 0) + totalQuestions;
      const updatedCorrect = (progress.totalQuestionsCorrect || 0) + correctCount;
      const currentXp = progress.xp || 0;
      const newXp = currentXp + xpEarned;
      const oldLevel = progress.level || 1;
      const newLevel = getLevelForXp(newXp);
      const isLevelUp = newLevel > oldLevel;

      let updatedProgress: UserProgress = {
        ...progress,
        totalQuestionsAnswered: updatedAnswered,
        totalQuestionsCorrect: updatedCorrect,
        xp: newXp,
        level: newLevel,
        lastAccessed: new Date()
      };

      updatedProgress = updateStreakAndLogs(
        updatedProgress,
        xpEarned,
        "exam",
        `Finished Mock Exam with ${correctCount}/${totalQuestions} score`,
        20
      );

      if (xpEarned > 0) {
        triggerXpToast(xpEarned, `Mock Exam Finished!`, "section");
      }
      if (isLevelUp) {
        setTimeout(() => {
          setLevelUpData({ oldLevel, newLevel });
        }, 500);
      }

      setProgress(updatedProgress);

      try {
        localStorage.setItem(localKey, JSON.stringify(updatedProgress));
      } catch (e) {
        console.error("Error writing progress to localStorage:", e);
      }

      if (docRef) {
        setDoc(docRef, {
          totalQuestionsAnswered: updatedProgress.totalQuestionsAnswered,
          totalQuestionsCorrect: updatedProgress.totalQuestionsCorrect,
          xp: updatedProgress.xp,
          level: updatedProgress.level,
          lastAccessed: serverTimestamp(),
          streakCount: updatedProgress.streakCount,
          maxStreak: updatedProgress.maxStreak,
          streakLastActive: updatedProgress.streakLastActive,
          activityLogs: updatedProgress.activityLogs,
          studyTimeLogs: updatedProgress.studyTimeLogs
        }, { merge: true }).catch((err) => {
          console.error("Error syncing mock exam to Firestore:", err);
        });
      }
    } catch (error) {
      console.error("Error setting up mock exam update:", error);
    }
  };

  const claimSocialXp = async (taskName: string, xpAmount: number) => {
    const localKey = currentUser ? `ap-lab-progress-${currentUser.uid}` : "ap-lab-progress-guest";
    const docRef = currentUser ? doc(db, "userProgress", currentUser.uid) : null;

    try {
      const currentXp = progress.xp || 0;
      const newXp = currentXp + xpAmount;
      const oldLevel = progress.level || 1;
      const newLevel = getLevelForXp(newXp);
      const isLevelUp = newLevel > oldLevel;

      let updatedProgress: UserProgress = {
        ...progress,
        xp: newXp,
        level: newLevel,
        lastAccessed: new Date()
      };

      updatedProgress = updateStreakAndLogs(
        updatedProgress,
        xpAmount,
        "social",
        `Claimed Social XP: ${taskName}`,
        15
      );

      triggerXpToast(xpAmount, "XP Claimed!", "section");

      if (isLevelUp) {
        setTimeout(() => {
          setLevelUpData({ oldLevel, newLevel });
        }, 500);
      }

      setProgress(updatedProgress);

      try {
        localStorage.setItem(localKey, JSON.stringify(updatedProgress));
      } catch (e) {
        console.error("Error writing progress to localStorage:", e);
      }

      if (docRef) {
        setDoc(docRef, {
          xp: updatedProgress.xp,
          level: updatedProgress.level,
          lastAccessed: serverTimestamp(),
          streakCount: updatedProgress.streakCount,
          maxStreak: updatedProgress.maxStreak,
          streakLastActive: updatedProgress.streakLastActive,
          activityLogs: updatedProgress.activityLogs,
          studyTimeLogs: updatedProgress.studyTimeLogs
        }, { merge: true }).catch((err) => {
          console.error("Error syncing social XP to Firestore:", err);
        });
      }
    } catch (error) {
      console.error("Error setting up social XP update:", error);
    }
  };

  // Instant synchronous Light/Dark theme class sync
  useEffect(() => {
    if (progress?.theme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
  }, [progress?.theme]);

  const updatePreferences = async (prefs: { theme?: "dark" | "light"; courseBg?: string; displayName?: string }) => {
    try {
      // 1. Instant DOM sync
      if (prefs.theme) {
        if (prefs.theme === "light") {
          document.documentElement.classList.add("light-theme");
        } else {
          document.documentElement.classList.remove("light-theme");
        }
      }

      // 2. Instant React state update
      const updated = {
        ...progress,
        ...prefs,
      };
      setProgress(updated);

      // 3. Instant LocalStorage sync
      if (typeof window !== "undefined") {
        try {
          if (currentUser) {
            const localKey = `ap-lab-progress-${currentUser.uid}`;
            localStorage.setItem(localKey, JSON.stringify(updated));
          }
          localStorage.setItem("ap-lab-theme", prefs.theme || progress?.theme || "dark");
          localStorage.setItem("ap-lab-course-bg", prefs.courseBg || progress?.courseBg || "dark-matrix");
        } catch (e) {}
      }

      // 4. Firestore sync
      if (currentUser) {
        const docRef = doc(db, "userProgress", currentUser.uid);
        await setDoc(docRef, { ...prefs }, { merge: true });
      }
    } catch (err) {
      console.error("Error updating user preferences:", err);
    }
  };

  const spendCredits = async (amount: number): Promise<boolean> => {
    const currentCreds = progress.credits || 0;
    if (currentCreds < amount) return false;
    const newCreds = currentCreds - amount;
    const updated = { ...progress, credits: newCreds };
    setProgress(updated);
    if (currentUser) {
      const localKey = `ap-lab-progress-${currentUser.uid}`;
      try { localStorage.setItem(localKey, JSON.stringify(updated)); } catch (e) {}
      setDoc(doc(db, "userProgress", currentUser.uid), { credits: newCreds }, { merge: true }).catch(() => {});
    }
    return true;
  };

  const addCredits = async (amount: number, reason?: string) => {
    const currentCreds = progress.credits || 0;
    const totalEarned = (progress.totalCreditsEarned || 0) + amount;
    const newCreds = currentCreds + amount;
    const updated = { ...progress, credits: newCreds, totalCreditsEarned: totalEarned };
    setProgress(updated);
    if (reason) triggerXpToast(0, reason, "question", amount);
    if (currentUser) {
      const localKey = `ap-lab-progress-${currentUser.uid}`;
      try { localStorage.setItem(localKey, JSON.stringify(updated)); } catch (e) {}
      setDoc(doc(db, "userProgress", currentUser.uid), { credits: newCreds, totalCreditsEarned: totalEarned }, { merge: true }).catch(() => {});
    }
  };

  const buyItem = async (itemId: string, cost: number, itemType: string, customColorHex?: string): Promise<boolean> => {
    const currentCreds = progress.credits || 0;
    if (currentCreds < cost) return false;
    const inv = progress.inventory || [];
    
    const isBoost = itemId.startsWith("boost-");
    if (isBoost) {
      const boostCount = inv.filter((id) => id === itemId).length;
      if (boostCount >= 5) {
        alert("You have reached the maximum limit of 5 for this boost!");
        return false;
      }
    }

    const newCreds = currentCreds - cost;
    const newInv = isBoost ? [...inv, itemId] : Array.from(new Set([...inv, itemId]));
    const isGradient = itemType === "gradient";
    const isColorPicker = itemType === "color-picker" || itemId === "custom-name-color";
    
    const activeFrame = !isGradient && !isColorPicker && itemType !== "boost" && itemType !== "powerup" ? itemId : progress.activeAvatarFrame;
    const activeGrad = isGradient ? itemId : (isColorPicker ? "" : progress.activeNameGradient);
    const activeNameColor = isColorPicker && customColorHex ? customColorHex : progress.activeNameColor;

    const updated: UserProgress = {
      ...progress,
      credits: newCreds,
      inventory: newInv,
      activeAvatarFrame: activeFrame,
      activeNameGradient: activeGrad,
      activeNameColor
    };
    setProgress(updated);
    if (currentUser) {
      const localKey = `ap-lab-progress-${currentUser.uid}`;
      try { localStorage.setItem(localKey, JSON.stringify(updated)); } catch (e) {}
      setDoc(doc(db, "userProgress", currentUser.uid), {
        credits: newCreds,
        inventory: newInv,
        activeAvatarFrame: activeFrame,
        activeNameGradient: activeGrad,
        activeNameColor
      }, { merge: true }).catch(() => {});
    }
    return true;
  };

  const equipItem = async (itemType: string, itemId: string) => {
    const isGradient = itemType === "gradient";
    const updated: UserProgress = {
      ...progress,
      activeAvatarFrame: !isGradient ? itemId : progress.activeAvatarFrame,
      activeNameGradient: isGradient ? itemId : progress.activeNameGradient,
    };
    setProgress(updated);
    if (currentUser) {
      const localKey = `ap-lab-progress-${currentUser.uid}`;
      try { localStorage.setItem(localKey, JSON.stringify(updated)); } catch (e) {}
      setDoc(doc(db, "userProgress", currentUser.uid), {
        activeAvatarFrame: updated.activeAvatarFrame,
        activeNameGradient: updated.activeNameGradient
      }, { merge: true }).catch(() => {});
    }
  };

  const useBoostItem = async (boostId: string): Promise<boolean> => {
    const inv = progress.inventory || [];
    const idx = inv.indexOf(boostId);
    if (idx === -1) return false;
    
    // Remove one instance of boost item from inventory
    const newInv = [...inv];
    newInv.splice(idx, 1);
    
    // Set 10 hour expiry timestamp (10 * 60 * 60 * 1000 = 36000000ms)
    const activeBoosts = { ...(progress.activeBoosts || {}) };
    activeBoosts[boostId] = Date.now() + 10 * 60 * 60 * 1000;
    
    const updated: UserProgress = {
      ...progress,
      inventory: newInv,
      activeBoosts
    };
    setProgress(updated);
    if (currentUser) {
      const localKey = `ap-lab-progress-${currentUser.uid}`;
      try { localStorage.setItem(localKey, JSON.stringify(updated)); } catch (e) {}
      setDoc(doc(db, "userProgress", currentUser.uid), {
        inventory: newInv,
        activeBoosts
      }, { merge: true }).catch(() => {});
    }
    return true;
  };

  return (
    <ProgressContext.Provider value={{
      progress, loading, completeTopic, recordQuestionAttempt, recordTutorMessage,
      recordMockExamAttempt, claimSocialXp, updatePreferences, spendCredits, addCredits, buyItem, equipItem, useBoostItem
    }}>
      {children}

      {/* Top Center Active Boosts HUD */}
      {(() => {
        const activeBoosts = progress.activeBoosts || {};
        const now = Date.now();
        const activeList = Object.entries(activeBoosts).filter(([_, expiry]) => expiry > now);
        if (activeList.length === 0) return null;

        return (
          <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[99999] flex items-center space-x-3 pointer-events-none">
            {activeList.map(([id, expiry]) => {
              const diffMs = Math.max(0, expiry - now);
              const hours = Math.floor(diffMs / (1000 * 60 * 60));
              const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
              const isXp = id === "boost-2x-xp";
              
              return (
                <div 
                  key={id} 
                  className={cn(
                    "px-4 py-1.5 rounded-full border shadow-2xl backdrop-blur-md flex items-center space-x-2 font-mono font-bold text-xs pointer-events-auto animate-pulse",
                    isXp ? "bg-purple-950/90 border-purple-500/50 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "bg-amber-950/90 border-amber-500/50 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                  )}
                >
                  <span className="text-base">{isXp ? "⚡" : "🪙"}</span>
                  <span className="font-manrope font-extrabold uppercase text-[11px]">{isXp ? "2x XP Boost:" : "2x Coin Boost:"}</span>
                  <span className="font-mono text-white tracking-wider">{hours}h {mins}m left</span>
                </div>
              );
            })}
          </div>
        );
      })()}
      
      {/* Level Up Modal */}
      <AnimatePresence>
        {levelUpData && (
          <LevelUpModal
            oldLevel={levelUpData.oldLevel}
            newLevel={levelUpData.newLevel}
            onClose={() => setLevelUpData(null)}
          />
        )}
      </AnimatePresence>

      {/* Top-Center XP / Credit Earned Toasts (Classic Green Accent Style) */}
      <div className="fixed top-20 left-0 right-0 pointer-events-none z-[99999] flex flex-col items-center justify-start space-y-3">
        <AnimatePresence>
          {xpToasts.map((toast) => {
            const hasBoth = toast.amount > 0 && toast.creditAmount !== undefined && toast.creditAmount > 0;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
                className="flex items-center space-x-4 pointer-events-auto bg-[#0a0d18]/95 backdrop-blur-2xl border border-emerald-500/40 text-white px-6 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_20px_rgba(16,185,129,0.15)]"
              >
                <div className="flex items-center justify-center shrink-0 space-x-[-6px]">
                  {toast.amount > 0 && (
                    <img src="/images/xp-shield-exact.png" alt="XP" className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(168,85,247,0.8)]" />
                  )}
                  {toast.creditAmount !== undefined && toast.creditAmount > 0 && (
                    <img src="/images/coin-exact.png" alt="Coins" className="w-9 h-9 object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-manrope font-extrabold text-emerald-400 tracking-wide uppercase">{toast.message}</span>
                  <div className="flex items-center space-x-3 mt-0.5 font-mono font-extrabold text-sm">
                    {toast.amount > 0 && (
                      <span className="text-purple-300 flex items-center gap-1.5">
                        +{toast.amount} XP
                      </span>
                    )}
                    {hasBoth && <span className="text-white/30">•</span>}
                    {toast.creditAmount !== undefined && toast.creditAmount > 0 && (
                      <span className="text-amber-400 flex items-center gap-1.5">
                        +{toast.creditAmount} Coins
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ProgressContext.Provider>
  );
};

