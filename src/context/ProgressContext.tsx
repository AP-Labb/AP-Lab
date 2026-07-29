"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { doc, onSnapshot, setDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { getLevelForXp } from "@/lib/xpProgression";
import { playLevelUpSound } from "@/lib/sounds";
import { LevelBadge } from "@/components/LevelBadge";
import confetti from "canvas-confetti";

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
  inventory?: string[];
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
  equipItem?: (itemType: "frame" | "gradient", itemId: string) => Promise<void>;
  buyItem?: (itemId: string, cost: number, itemType: "frame" | "gradient") => Promise<boolean>;
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
    // 1. Play the combined level up sound (riser + impact) on mount once
    if (!playedSoundRef.current) {
      playedSoundRef.current = true;
      playLevelUpSound();
    }

    // 2. Trigger morph at 1.8s
    const morphTimer = setTimeout(() => {
      setIsMorphed(true);
      // Trigger a direct confetti burst at the morph instant
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 }
      });
    }, 1800);

    // 3. Auto-hide modal at 4.2s (after new badge wiggles and text settles)
    const closeTimer = setTimeout(() => {
      onClose();
    }, 4200);

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
            transition={{ duration: 0.45, times: [0, 0.2, 1] }}
            className="absolute inset-0 bg-white pointer-events-none z-50 mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-md bg-[#050508]/90 border border-yellow-500/20 rounded-[40px] p-10 text-center relative overflow-hidden shadow-[0_0_100px_rgba(234,179,8,0.15)] backdrop-blur-md"
      >
        {/* Decorative radial glows */}
        <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full blur-[100px] opacity-25 bg-amber-500 pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[100px] opacity-25 bg-amber-500 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
          
          {/* Header text with elegant fade-in after morph */}
          <div className="space-y-1">
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-[0.3em] block"
            >
              Academic Advancement
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-instrument text-4xl text-white tracking-tight leading-none"
            >
              Level Up!
            </motion.h2>
          </div>

          {/* Centered Morphing Badge Frame */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            
            {/* Spinning/Morphing Old Badge */}
            {!isMorphed && (
              <motion.div
                key="old-badge"
                initial={{ scale: 1, rotate: 0, opacity: 1 }}
                animate={{ 
                  scale: [1, 1.15, 0.9, 0],
                  rotate: [0, 90, 720, 1800],
                  opacity: [1, 1, 1, 0]
                }}
                transition={{ 
                  duration: 1.8,
                  times: [0, 0.4, 0.8, 1],
                  ease: "easeInOut"
                }}
                className="absolute flex items-center justify-center"
              >
                <LevelBadge level={oldLevel} size="lg" />
                {/* Glowing charged energy overlay */}
                <motion.div 
                  className="absolute inset-0 bg-white rounded-full mix-blend-screen blur-sm pointer-events-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0, 0.3, 0.8, 1], scale: [0.8, 1.0, 1.2, 1.3] }}
                  transition={{ duration: 1.8, times: [0, 0.4, 0.8, 1], ease: "easeInOut" }}
                />
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
                  stiffness: 140,
                  damping: 10,
                  mass: 0.8
                }}
                className="relative filter drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]"
              >
                <LevelBadge level={newLevel} size="lg" />
              </motion.div>
            )}
            
            {/* Ambient gold halo during morph */}
            <motion.div
              animate={isMorphed 
                ? { scale: [1, 1.4, 1.2], opacity: [0.1, 0.5, 0.2] } 
                : { scale: [0.9, 1.1, 0.9], opacity: [0.05, 0.15, 0.05] }
              }
              transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-36 h-36 border border-amber-500/30 rounded-full blur-md -z-10 pointer-events-none"
            />
          </div>

          {/* Sub-text revealing smoothly after new badge settles */}
          <div className="h-12 flex flex-col items-center justify-center">
            <AnimatePresence>
              {isMorphed && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-1"
                >
                  <p className="text-white/60 text-sm font-manrope">
                    You have ascended to level <span className="text-amber-400 font-bold font-mono">{newLevel}</span>
                  </p>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">
                    Keep up the exceptional performance
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
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
    const id = Date.now() + Math.random();
    setXpToasts((prev) => [...prev, { id, amount, message, type, creditAmount }]);
    setTimeout(() => {
      setXpToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
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

      const xpEarned = isFirstTime ? 100 : 0;
      const creditsEarned = canEarnCredits ? 50 : 0;
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
      
      const xpEarned = isCorrect ? (isCompleted ? 5 : 10) : 0;
      const creditsEarned = canEarnQCredits ? 5 : 0;

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

  const buyItem = async (itemId: string, cost: number, itemType: "frame" | "gradient"): Promise<boolean> => {
    const currentCreds = progress.credits || 0;
    if (currentCreds < cost) return false;
    const inv = progress.inventory || [];
    if (inv.includes(itemId)) return true; // already owned
    const newCreds = currentCreds - cost;
    const newInv = [...inv, itemId];
    const activeFrame = itemType === "frame" ? itemId : progress.activeAvatarFrame;
    const activeGrad = itemType === "gradient" ? itemId : progress.activeNameGradient;
    const updated: UserProgress = {
      ...progress,
      credits: newCreds,
      inventory: newInv,
      activeAvatarFrame: activeFrame,
      activeNameGradient: activeGrad
    };
    setProgress(updated);
    if (currentUser) {
      const localKey = `ap-lab-progress-${currentUser.uid}`;
      try { localStorage.setItem(localKey, JSON.stringify(updated)); } catch (e) {}
      setDoc(doc(db, "userProgress", currentUser.uid), {
        credits: newCreds,
        inventory: newInv,
        activeAvatarFrame: activeFrame,
        activeNameGradient: activeGrad
      }, { merge: true }).catch(() => {});
    }
    return true;
  };

  const equipItem = async (itemType: "frame" | "gradient", itemId: string) => {
    const updated: UserProgress = {
      ...progress,
      activeAvatarFrame: itemType === "frame" ? itemId : progress.activeAvatarFrame,
      activeNameGradient: itemType === "gradient" ? itemId : progress.activeNameGradient,
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

  return (
    <ProgressContext.Provider value={{
      progress, loading, completeTopic, recordQuestionAttempt, recordTutorMessage,
      recordMockExamAttempt, claimSocialXp, updatePreferences, spendCredits, addCredits, buyItem, equipItem
    }}>
      {children}
      
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

      {/* Top-Center XP / Credit Earned Toasts */}
      <div className="fixed top-24 left-0 right-0 pointer-events-none z-[99999] flex flex-col items-center justify-start space-y-3">
        <AnimatePresence>
          {xpToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex items-center space-x-3 pointer-events-auto bg-black/90 backdrop-blur-md border border-amber-500/30 text-white px-4 py-3 rounded-2xl shadow-[0_8px_32px_rgba(234,179,8,0.2)] border-l-4 border-l-amber-400"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                <span className="font-extrabold text-sm font-manrope">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{toast.message}</span>
                <div className="flex items-center gap-2">
                  {toast.amount > 0 && <span className="text-sm font-black text-white font-mono tracking-wide">+{toast.amount} XP</span>}
                  {toast.creditAmount !== undefined && toast.creditAmount > 0 && (
                    <span className="text-sm font-black text-amber-300 font-mono tracking-wide flex items-center gap-1">
                      +{toast.creditAmount} Credits
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ProgressContext.Provider>
  );
};

