"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Microscope, Library, Calculator, 
  Search, Dna, Beaker, Atom, History, Brain, BookOpen, Sigma, BarChart3, Binary,
  ChevronRight, Activity, Star, User, Mail, X, BarChart2, Upload, GraduationCap,
  Folder, Eye, Trophy, Video, FileText, Layers, Clock, ArrowUpRight, Leaf, Home, LayoutDashboard, Settings, Award, BookMarked
} from "lucide-react";
import { LevelBadge } from "@/components/LevelBadge";
import { LevelLeaderboard } from "@/components/LevelLeaderboard";
import LightRays from "@/components/LightRays";
import { auth, db } from "@/lib/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { useProgress } from "@/context/ProgressContext";
import { courseRegistry } from "@/lib/courses/course-registry";
import { ReviewModal } from "@/components/ReviewModal";
import { Onboarding } from "@/components/Onboarding";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AccountNavbarWidget } from "@/components/AccountNavbarWidget";
import { SettingsModal } from "@/components/SettingsModal";
import { getLevelForXp, getXpThresholdForLevel } from "@/lib/xpProgression";
import { DashboardContextMenu } from "@/components/DashboardContextMenu";
import { FloatingXPOperations } from "@/components/FloatingXPOperations";
import FolderComponent from "@/components/Folder";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";


const folders = [
  {
    title: "STEM & Sciences",
    icon: Microscope,
    color: "text-medical-teal",
    bgGlow: "bg-medical-teal",
    accent: "#0088ff",
    bgGradient: "from-[#0088ff] to-[#0044cc]",
    classes: [
      { name: "AP® Biology", slug: "ap-biology", icon: Dna, accent: "#0088ff" },
      { name: "AP® Chemistry", slug: "ap-chemistry", icon: Beaker, accent: "#0088ff" },
      { name: "AP® Physics C", slug: "ap-physics-c", icon: Atom, accent: "#0088ff" }
    ]
  },
  {
    title: "Humanities & Arts",
    icon: Library,
    color: "text-primary-purple",
    bgGlow: "bg-primary-purple",
    accent: "#a484d7",
    bgGradient: "from-[#8b5cf6] to-[#5b21b6]",
    classes: [
      { name: "AP® US History", slug: "ap-ush", icon: History, accent: "#a484d7" },
      { name: "AP® Psychology", slug: "ap-psych", icon: Brain, accent: "#a484d7" },
      { name: "AP® English Language", slug: "ap-eng-lang", icon: BookOpen, accent: "#a484d7" }
    ]
  },
  {
    title: "Mathematical Logic",
    icon: Calculator,
    color: "text-emerald-400",
    bgGlow: "bg-emerald-400",
    accent: "#34d399",
    bgGradient: "from-[#10b981] to-[#047857]",
    classes: [
      { name: "AP® Calculus BC", slug: "ap-calc-bc", icon: Sigma, accent: "#34d399" },
      { name: "AP® Statistics", slug: "ap-stats", icon: BarChart3, accent: "#34d399" },
      { name: "AP® Comp Sci A", slug: "ap-csa", icon: Binary, accent: "#34d399" }
    ]
  },
];

function SearchBar({ onSelect }: { onSelect: (slug: string) => void }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const allClassList = folders.flatMap(f => f.classes.map(c => ({ 
    ...c, 
    category: f.title, 
    folderAccent: c.accent || f.accent 
  })));

  const filtered = query === "" 
    ? allClassList 
    : allClassList.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) || 
        c.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <>
      {/* Focused Backdrop Blur Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[9990] pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-3xl mb-24 z-[9999] group">
        <style>{`
          @keyframes float-dust {
            0% { transform: translateY(0px) translateX(0px); opacity: 0.1; }
            50% { transform: translateY(-4px) translateX(12px); opacity: 0.7; }
            100% { transform: translateY(0px) translateX(24px); opacity: 0.1; }
          }
          .gradient-cycle-effect {
            background: linear-gradient(90deg, #1d4ed8, #2563eb, #3b82f6, #60a5fa, #3b82f6, #2563eb, #1d4ed8);
            background-size: 200% auto;
            animation: gradient-flow 6s linear infinite;
          }
          @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>
        
        {/* Smooth Cycling Ambient Glow (Increases glow on focus OR hover) */}
        <div className={cn(
          "absolute -inset-[12px] rounded-full blur-[24px] pointer-events-none z-0 gradient-cycle-effect transition-opacity duration-300 group-hover:opacity-75",
          isFocused ? "opacity-75" : "opacity-35"
        )} />
        <div className={cn(
          "absolute -inset-[6px] rounded-full pointer-events-none z-10 gradient-cycle-effect shadow-[0_12px_40px_rgba(37,99,235,0.4)] transition-opacity duration-300 group-hover:opacity-75",
          isFocused ? "opacity-75" : "opacity-35"
        )} />

        {/* Search Bar Container */}
        <div className="relative bg-[#050508]/95 rounded-full flex items-center p-1 backdrop-blur-3xl border border-white/10 z-20 shadow-2xl">
          <div className="flex-1 flex items-center px-6 relative overflow-hidden">
            <Search className="w-5 h-5 text-white/80 mr-4 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for an AP® Course..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => {
                setIsFocused(true);
                setIsOpen(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                setTimeout(() => setIsOpen(false), 220);
              }}
              className="w-full bg-transparent py-4.5 text-white placeholder-white/30 focus:outline-none text-xl font-manrope font-semibold"
            />
            {query && (
              <button 
                onClick={() => setQuery("")} 
                className="p-1.5 text-white/40 hover:text-white rounded-full bg-white/5 hover:bg-white/15 transition-all mr-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Clean Course Search Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full mt-3 w-full bg-[#0c0d16]/95 backdrop-blur-3xl border border-white/15 rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85)] z-[70] p-2"
            >
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-white/40 font-manrope text-sm">
                  No matching AP® courses found.
                </div>
              ) : (
                <div className="max-h-[340px] overflow-y-auto custom-scrollbar space-y-1.5 p-1">
                  {filtered.map((item) => {
                    const courseColor = item.folderAccent || item.accent || "#3b82f6";
                    return (
                      <button
                        key={item.name}
                        onMouseDown={() => {
                          onSelect(item.slug);
                          setQuery("");
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-transparent hover:bg-white/[0.08] hover:border-white/10 border border-transparent transition-all group/item text-left relative overflow-hidden"
                      >
                        <div className="flex items-center space-x-3.5">
                          {/* Course Icon matching category folder color */}
                          <div 
                            className="w-10 h-10 rounded-xl bg-white/[0.06] border flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-105 shadow-inner"
                            style={{ borderColor: `${courseColor}40` }}
                          >
                            <item.icon className="w-5 h-5" style={{ color: courseColor }} />
                          </div>
                          <div>
                            <div className="text-white font-manrope font-bold text-sm sm:text-base group-hover/item:text-white transition-colors flex items-center gap-2">
                              <span>{item.name}</span>
                            </div>
                            <div className="text-white/40 text-[11px] font-mono tracking-wider uppercase mt-0.5">
                              {item.category}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-white/40 group-hover/item:text-white transition-colors">
                          <span className="text-xs font-manrope font-medium text-white/40 group-hover/item:text-white/80 hidden sm:inline-block">
                            Open Course
                          </span>
                          <ArrowUpRight className="w-4 h-4 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-transform" style={{ color: courseColor }} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function FolderCard({ title, icon: Icon, color, bgGlow, classes, accent, progressData, bgGradient }: typeof folders[0] & { progressData: Record<string, number> }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative w-full mt-6 select-none group transition-all duration-300 hover:-translate-y-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Physical Folder Tab Badge Header */}
      <div className="relative w-full">
        <div 
          className="inline-flex items-center space-x-3 px-6 py-2.5 rounded-t-2xl border-t border-x transition-all duration-300 relative z-10"
          style={{ 
            backgroundColor: isHovered ? "#121424" : "#0a0c16",
            borderColor: isHovered ? `${accent}60` : "rgba(255, 255, 255, 0.18)",
            boxShadow: isHovered ? `0 -6px 20px ${accent}20` : "none"
          }}
        >
          <div 
            className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-inner"
            style={{ color: accent }}
          >
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="font-manrope font-extrabold text-sm sm:text-base text-white tracking-tight whitespace-nowrap">
            {title}
          </span>
        </div>
      </div>

      {/* Main Folder Front Body & Pocket Base */}
      <div 
        className="relative w-full rounded-b-[24px] rounded-tr-[24px] rounded-tl-none border bg-[#090b14]/95 backdrop-blur-2xl p-5 sm:p-6 flex flex-col justify-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden z-20 transition-all duration-300"
        style={{
          borderColor: isHovered ? `${accent}50` : "rgba(255, 255, 255, 0.16)",
          boxShadow: isHovered ? `0 25px 60px ${accent}20` : "0 20px 50px rgba(0,0,0,0.6)"
        }}
      >
        {/* Top Folder Rim Highlight Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[2px] opacity-80 transition-opacity duration-300"
          style={{ backgroundColor: accent }}
        />

        {/* Inside Folder Glow */}
        <div 
          className="absolute inset-0 opacity-10 blur-3xl pointer-events-none -z-10 transition-opacity duration-300"
          style={{ backgroundColor: accent, opacity: isHovered ? 0.22 : 0.08 }}
        />

        {/* Clickable Course Subject Cards */}
        <div className="flex flex-col space-y-2.5 z-10 p-1">
          {classes.map((subject) => {
            const progressPercent = Math.round(progressData[subject.slug] || 0);
            const isCompleted = progressPercent === 100;
            const itemAccent = subject.accent || accent;
            return (
              <Link 
                key={subject.name}
                href={`/dashboard/${subject.slug}`}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.1] hover:border-white/15 transition-all duration-200 group/item w-full relative overflow-hidden",
                  isCompleted && "border-amber-500/35 bg-amber-500/[0.03]"
                )}
              >
                <div className="flex items-center flex-1 mr-3 overflow-hidden relative z-10">
                  <subject.icon 
                    className="w-4 h-4 text-white/70 group-hover/item:text-white transition-colors shrink-0" 
                    style={{ color: isCompleted ? "#fbbf24" : itemAccent }} 
                  />
                  <div className="flex-1 flex flex-col items-start ml-3 min-w-0">
                    <span className={cn(
                      "text-xs sm:text-sm font-manrope font-bold text-white/90 group-hover/item:text-white transition-colors truncate w-full text-left",
                      isCompleted && "text-yellow-400 font-extrabold"
                    )}>
                      {subject.name}
                    </span>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${progressPercent}%`,
                          backgroundColor: isCompleted ? "#fbbf24" : itemAccent 
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 shrink-0 relative z-10">
                  <span className="text-[10px] font-mono font-bold text-white/50 group-hover/item:text-white transition-colors">
                    {progressPercent}%
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover/item:text-white transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getLevelName(lvl: number): string {
  if (lvl === 100) return "Grandmaster";
  if (lvl >= 90) return "Ascendant";
  if (lvl >= 70) return "Elite";
  if (lvl >= 50) return "Master";
  if (lvl >= 30) return "Expert";
  if (lvl >= 10) return "Scholar";
  return "Apprentice";
}

function SidebarSettingsButton({ open }: { open: boolean }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  return (
    <>
      <motion.button
        onClick={() => setIsSettingsOpen(true)}
        className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full"
        whileHover="hover"
        initial="rest"
      >
        <motion.div
          className="flex-shrink-0"
          variants={{ rest: { rotate: 0 }, hover: { rotate: 90 } }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Settings className="w-5 h-5" />
        </motion.div>
        <motion.span
          animate={{
            display: open ? "inline-block" : "none",
            opacity: open ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="text-sm font-manrope font-semibold whitespace-pre"
        >
          Settings
        </motion.span>
      </motion.button>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}

function HoldSignOutButton({ onConfirm }: { onConfirm: () => void }) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(100, (elapsed / 3000) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(intervalRef.current!);
        onConfirm();
      }
    }, 16);
  };

  const stopHold = () => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
      onTouchCancel={stopHold}
      className="flex-1 relative overflow-hidden rounded-full bg-red-500 text-white text-sm font-semibold select-none shadow-[0_4px_12px_rgba(239,68,68,0.2)] py-2.5"
    >
      {/* Fill bar */}
      <div
        className="absolute inset-0 bg-red-700 origin-left pointer-events-none"
        style={{ transform: `scaleX(${progress / 100})`, transition: progress === 0 ? "transform 0.2s ease" : "none" }}
      />
      <span className="relative z-10 pointer-events-none">
        {progress > 5 ? `Hold... ${Math.round(progress)}%` : "Hold to Sign Out"}
      </span>
    </button>
  );
}

export default function Dashboard() {
  const { currentUser, loading: authLoading } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const router = useRouter();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [onboardCompleted, setOnboardCompleted] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<"courses" | "previews" | "leaderboard">("courses");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 128;
          const MAX_HEIGHT = 128;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);

            // Save immediately to LocalStorage
            const progressRef = doc(db, "userProgress", currentUser.uid);
            const updated = {
              ...progress,
              photoURL: compressedDataUrl
            };
            try {
              localStorage.setItem(`ap-lab-progress-${currentUser.uid}`, JSON.stringify(updated));
            } catch (err) {}

            // Save to Firestore
            try {
              await setDoc(progressRef, { photoURL: compressedDataUrl }, { merge: true });
            } catch (err) {
              console.error("Error updating avatar in Firestore:", err);
            }

            // Update Auth profile
            try {
              await updateProfile(currentUser, { photoURL: compressedDataUrl });
            } catch (err) {}
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    document.title = "Dashboard | AP Lab";
  }, []);

  useEffect(() => {
    if (!authLoading && !progressLoading) {
      if (!currentUser) {
        router.push("/");
      } else if (!currentUser.emailVerified) {
        router.push("/verify-email");
      } else if (progress && !progress.isOnboarded && !onboardCompleted) {
        router.push("/onboarding");
      }
    }
  }, [currentUser, authLoading, progressLoading, progress, onboardCompleted, router]);

  if (authLoading || progressLoading || !currentUser || !currentUser.emailVerified || (progress && !progress.isOnboarded && !onboardCompleted)) {
    return (
      <div className="min-h-screen bg-[#03040a]">
        <LoadingSpinner />
      </div>
    );
  }

  const coursePreviewsData = [
    {
      name: "AP® Biology",
      slug: "ap-biology",
      category: "Life Sciences",
      videos: 48,
      articles: 36,
      topics: 12,
      subtopics: 42,
      estTime: "32 Hours",
      questions: "850+ Items",
      difficulty: "Advanced",
      color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
    },
    {
      name: "AP® Chemistry",
      slug: "ap-chemistry",
      category: "Physical Sciences",
      videos: 52,
      articles: 40,
      topics: 14,
      subtopics: 48,
      estTime: "38 Hours",
      questions: "920+ Items",
      difficulty: "Expert",
      color: "border-cyan-500/30 bg-cyan-500/5 text-cyan-400"
    },
    {
      name: "AP® Physics C",
      slug: "ap-physics-c",
      category: "Physical Sciences",
      videos: 45,
      articles: 35,
      topics: 11,
      subtopics: 38,
      estTime: "30 Hours",
      questions: "800+ Items",
      difficulty: "Expert",
      color: "border-blue-500/30 bg-blue-500/5 text-blue-400"
    },
    {
      name: "AP® Calculus BC",
      slug: "ap-calc-bc",
      category: "Mathematics",
      videos: 60,
      articles: 45,
      topics: 15,
      subtopics: 54,
      estTime: "42 Hours",
      questions: "1,050+ Items",
      difficulty: "Expert",
      color: "border-amber-500/30 bg-amber-500/5 text-amber-400"
    },
    {
      name: "AP® Statistics",
      slug: "ap-stats",
      category: "Mathematics",
      videos: 38,
      articles: 30,
      topics: 10,
      subtopics: 34,
      estTime: "25 Hours",
      questions: "720+ Items",
      difficulty: "Intermediate",
      color: "border-pink-500/30 bg-pink-500/5 text-pink-400"
    },
    {
      name: "AP® Computer Science A",
      slug: "ap-csa",
      category: "Technology",
      videos: 42,
      articles: 34,
      topics: 11,
      subtopics: 38,
      estTime: "28 Hours",
      questions: "800+ Items",
      difficulty: "Advanced",
      color: "border-blue-500/30 bg-blue-500/5 text-blue-400"
    },
    {
      name: "AP® Psychology",
      slug: "ap-psych",
      category: "Social Sciences",
      videos: 36,
      articles: 30,
      topics: 9,
      subtopics: 32,
      estTime: "24 Hours",
      questions: "680+ Items",
      difficulty: "Intermediate",
      color: "border-rose-500/30 bg-rose-500/5 text-rose-400"
    },
    {
      name: "AP® Macroeconomics",
      slug: "ap-macroeconomics",
      category: "Social Sciences",
      videos: 28,
      articles: 24,
      topics: 7,
      subtopics: 24,
      estTime: "18 Hours",
      questions: "520+ Items",
      difficulty: "Intermediate",
      color: "border-teal-500/30 bg-teal-500/5 text-teal-400"
    },
    {
      name: "AP® US History",
      slug: "ap-ush",
      category: "History & Social",
      videos: 56,
      articles: 48,
      topics: 14,
      subtopics: 50,
      estTime: "40 Hours",
      questions: "980+ Items",
      difficulty: "Advanced",
      color: "border-red-500/30 bg-red-500/5 text-red-400"
    }
  ];

  const handleSignOut = () => {
    setShowSignOutConfirm(true);
  };

  const handleSearchSelect = (slug: string) => {
    router.push(`/dashboard/${slug}`);
  };

  const firstName = currentUser?.displayName?.split(' ')[0] || 'Scholar';

  const totalAnswered = progress?.totalQuestionsAnswered || 0;
  const totalCorrect = progress?.totalQuestionsCorrect || 0;
  const accuracyRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  
  const xp = progress?.xp || 0;
  const level = getLevelForXp(xp);
  const currentLevelThreshold = getXpThresholdForLevel(level);
  const nextLevelThreshold = getXpThresholdForLevel(level + 1);
  const xpNeededForNext = nextLevelThreshold - currentLevelThreshold;
  const xpInCurrentLevel = xp - currentLevelThreshold;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));

  // Calculate Progress for each class
  const calculateCourseProgress = (slug: string) => {
    const course = courseRegistry[slug];
    if (!course || !progress?.completedTopics) return 0;

    let totalTopics = 0;
    let completedInCourse = 0;

    course.units.forEach(unit => {
      unit.topics.forEach(topic => {
        totalTopics++;
        if (progress.completedTopics.includes(`${course.masteryPrefix}-${topic.id}`)) {
          completedInCourse++;
        }
      });
    });

    if (totalTopics === 0) return 0;
    return (completedInCourse / totalTopics) * 100;
  };

  const classProgressMap: Record<string, number> = {};
  folders.forEach(folder => {
    folder.classes.forEach(cls => {
      classProgressMap[cls.slug] = calculateCourseProgress(cls.slug);
    });
  });

  const sideNavLinks = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="w-5 h-5 flex-shrink-0" />,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-5 h-5 flex-shrink-0" />,
    },
    {
      label: "Progress",
      href: "/dashboard/progress",
      icon: <BarChart2 className="w-5 h-5 flex-shrink-0" />,
    },
    {
      label: "Review",
      href: "#",
      icon: <Star className="w-5 h-5 flex-shrink-0" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-row relative z-0 overflow-x-hidden bg-[#03040a] selection:bg-primary-purple selection:text-white">

      {/* ===== LEFT SIDEBAR ===== */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-6 sticky top-0">

          {/* Top: Logo + Nav Links */}
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

            {/* AP Lab Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 px-2 py-2.5 mb-4 group"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -6, 6, 0] }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Activity className="w-5 h-5 text-white flex-shrink-0 group-hover:text-white/80 transition-colors" />
              </motion.div>
              <motion.span
                animate={{
                  display: sidebarOpen ? "inline-block" : "none",
                  opacity: sidebarOpen ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
                className="font-manrope font-bold text-white tracking-tight whitespace-pre text-sm"
              >
                AP Lab
              </motion.span>
            </Link>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mb-4 mx-2" />

            {/* Nav Links with animated icons — hover on the whole row triggers child variants */}
            <div className="flex flex-col gap-1">

              {/* Home — smooth float up on row hover */}
              <motion.div whileHover="hover" initial="rest">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
                  <motion.div
                    className="flex-shrink-0"
                    variants={{
                      rest: { y: 0, scale: 1 },
                      hover: { y: -3, scale: 1.1 },
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Home className="w-5 h-5" />
                  </motion.div>
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-semibold whitespace-pre"
                  >
                    Home
                  </motion.span>
                </Link>
              </motion.div>

              {/* Dashboard — squares shift/scale on row hover */}
              <motion.div whileHover="hover" initial="rest">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 bg-white/10 text-white"
                >
                  <motion.div
                    className="flex-shrink-0"
                    variants={{
                      rest: { scale: 1, rotate: 0 },
                      hover: { scale: 1.15, rotate: 8 },
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </motion.div>
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-semibold whitespace-pre"
                  >
                    Dashboard
                  </motion.span>
                </Link>
              </motion.div>

              {/* Progress — animated rising bars on row hover */}
              <motion.div whileHover="hover" initial="rest">
                <Link
                  href="/dashboard/progress"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
                  {/* Custom animated bars SVG replacing BarChart2 */}
                  <div className="w-5 h-5 flex-shrink-0 flex items-end gap-[2px]">
                    {[
                      { height: "40%", delay: 0 },
                      { height: "70%", delay: 0.05 },
                      { height: "55%", delay: 0.1 },
                      { height: "90%", delay: 0.15 },
                    ].map((bar, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-sm bg-current"
                        style={{ height: bar.height }}
                        variants={{
                          rest: { scaleY: 1, originY: 1 },
                          hover: { scaleY: [1, 1.5, 1.2, 1.35, 1], originY: 1 },
                        }}
                        transition={{ duration: 0.5, delay: bar.delay, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-semibold whitespace-pre"
                  >
                    Progress
                  </motion.span>
                </Link>
              </motion.div>

              {/* Review — star with rays that radiate out and fade on row hover */}
              <motion.button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full"
                whileHover="hover"
                initial="rest"
              >
                <div className="flex-shrink-0 relative w-5 h-5">
                  {/* 8 radiating rays */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <motion.div
                      key={angle}
                      className="absolute rounded-full bg-yellow-300"
                      style={{
                        width: "1.5px",
                        height: "5px",
                        top: "50%",
                        left: "50%",
                        transformOrigin: "center bottom",
                        transform: `rotate(${angle}deg) translateX(-50%) translateY(-140%)`,
                      }}
                      variants={{
                        rest: { opacity: 0, scaleY: 0.3, translateY: 0 },
                        hover: {
                          opacity: [0, 0.9, 0],
                          scaleY: [0.3, 1.2, 0.8],
                          translateY: [0, -4, -6],
                        },
                      }}
                      transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
                    />
                  ))}
                  {/* Star icon */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.2 },
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <Star className="w-4 h-4" />
                  </motion.div>
                </div>
                <motion.span
                  animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-manrope font-semibold whitespace-pre"
                >
                  Review
                </motion.span>
              </motion.button>

              {/* Quests — award icon with glow pulse on row hover */}
              <motion.button
                onClick={() => setShowQuestsModal(true)}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full"
                whileHover="hover"
                initial="rest"
              >
                <motion.div
                  className="flex-shrink-0"
                  variants={{
                    rest: { scale: 1, rotate: 0 },
                    hover: { scale: 1.18, rotate: -8 },
                  }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Award className="w-5 h-5" />
                </motion.div>
                <motion.span
                  animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-manrope font-semibold whitespace-pre"
                >
                  Quests
                </motion.span>
              </motion.button>

              {/* AI Assistant — Panda Mascot Icon */}
              <Link href="/assistant" className="w-full">
                <motion.div
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full group cursor-pointer"
                  whileHover="hover"
                  initial="rest"
                >
                  <motion.div
                    className="w-5 h-5 shrink-0 flex items-center justify-center"
                    variants={{
                      rest: { scale: 1, rotate: 0, y: 0 },
                      hover: { scale: 1.25, rotate: [0, -10, 10, -5, 0], y: -1 },
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <img src="/images/panda-ai.png" alt="Panda AI" className="w-full h-full object-contain" />
                  </motion.div>
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-semibold whitespace-pre"
                  >
                    AI Assistant
                  </motion.span>
                </motion.div>
              </Link>

              {/* Settings */}
              <SidebarSettingsButton open={sidebarOpen} />

            </div>
          </div>

          {/* Bottom: Profile Widget + Sign Out — pb-24 clears the bottom blur */}
          <div className="flex flex-col gap-2 pb-24">
            <div className="h-px bg-white/[0.06] mx-2 mb-2" />

            {/* Profile — compact circle when closed, full widget when open */}
            <button
              onClick={() => setShowAccountPopup(true)}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-xl transition-all duration-200 text-white/60 hover:bg-white/[0.05] hover:text-white"
            >
              {/* Avatar - always a circle */}
              <div className="flex-shrink-0">
                {progress?.photoURL || currentUser?.photoURL ? (
                  <img
                    src={progress?.photoURL || currentUser?.photoURL || ""}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full object-cover border border-white/20 flex-shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-black bg-gradient-to-br from-cyan-400 to-white flex-shrink-0">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Full profile info — visible only when expanded */}
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-start text-left overflow-hidden"
                  >
                    <span className="font-manrope font-extrabold text-xs text-white tracking-tight leading-none truncate max-w-[120px]">
                      {progress?.displayName || currentUser?.displayName || "Scholar"}
                    </span>
                    <span className="font-mono font-bold text-[9px] text-white/40 tracking-wider mt-0.5 whitespace-nowrap">
                      Lvl {level} • {xp.toLocaleString()} XP
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* Sign Out — animated on row hover */}
            <motion.button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-2 py-2.5 rounded-xl transition-all duration-200 text-white/30 hover:bg-red-500/10 hover:text-red-400"
              whileHover="hover"
              initial="rest"
            >
              <motion.div
                className="flex-shrink-0"
                variants={{
                  rest: { x: 0 },
                  hover: { x: 3 },
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <LogOut className="w-5 h-5" />
              </motion.div>
              <motion.span
                animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                className="font-manrope font-semibold text-sm whitespace-pre"
              >
                Sign Out
              </motion.span>
            </motion.button>
          </div>
        </SidebarBody>
      </Sidebar>


      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile top bar spacer */}
        <div className="h-14 md:hidden" />

        <main className="flex-1 w-full flex flex-col items-center z-10">
        
        {/* UPPER REGION: Header & Search Bar (Dot Matrix Background) */}
        <div className="relative w-full flex flex-col items-center pt-24 pb-12 px-6 z-40">
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <LightRays
              raysOrigin="top-center"
              raysColor="#a5f3fc"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
            />
          </div>


          {/* Header Section */}
          <div className="text-center mb-10 flex flex-col items-center justify-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3 mb-3 w-fit mx-auto"
            >
              <span className="text-sm md:text-base uppercase tracking-[0.3em] font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                WELCOME BACK, {firstName.toUpperCase()}
              </span>
              <LevelBadge level={level} className="normal-case tracking-normal shrink-0 translate-y-[1px]" />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="font-inter text-white/50 text-sm md:text-base max-w-lg mx-auto leading-relaxed mt-1"
            >
              Navigate your folders or search for a course below.
            </motion.p>
          </div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 25, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex justify-center relative z-10 mb-4"
          >
            <SearchBar onSelect={handleSearchSelect} />
          </motion.div>
        </div>

        {/* SEPARATION LINE PASSING DIRECTLY THROUGH THE VERTICAL MIDDLE OF THE SELECTION MENU */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full flex justify-center z-30 my-0"
        >
          {/* Horizontal Separation Line intersecting the middle */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 -translate-y-1/2 z-0 pointer-events-none" />

          {/* Segmented Tab Selector sitting directly on top of the separation line */}
          <div className="flex items-center justify-center p-1.5 rounded-full bg-[#0a0b12] border border-white/20 shadow-2xl gap-1.5 sm:gap-2 select-none z-10 relative">
            {[
              { id: "courses", label: "Courses", icon: Folder },
              { id: "previews", label: "Previews", icon: Eye },
              { id: "leaderboard", label: "Leaderboard", icon: Trophy }
            ].map((tab) => {
              const isActive = dashboardTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashboardTab(tab.id as any)}
                  className="relative flex items-center space-x-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-manrope font-bold text-xs sm:text-sm cursor-pointer transition-colors duration-300 z-10 select-none"
                >
                  {/* Regular White Capsule Oval */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDashboardTabOval"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-white shadow-lg z-0"
                    />
                  )}
                  
                  <Icon className={cn("w-4 h-4 relative z-10 transition-colors duration-300", isActive ? "text-black" : "text-white/60")} />
                  <span className={cn("relative z-10 transition-colors duration-300", isActive ? "text-black font-extrabold" : "text-white/60 hover:text-white")}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* LOWER REGION: Folders Grid / Previews Grid / Leaderboard with Grid Background Pattern */}
        <div 
          className="w-full flex-1 relative z-20 flex flex-col items-center -mt-7 pt-12 pb-12 px-6 md:px-12 bg-[#060712]"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            backgroundSize: "36px 36px"
          }}
        >
          {/* Tab 1: Course Image Cards Grid */}
          {dashboardTab === "courses" && (() => {
            // Course card data: images from Unsplash (subject-matched), descriptions, unit/topic counts
            const COURSE_CARDS = [
              { slug: "ap-biology",    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&q=80", desc: "Explore life's molecular machinery, genetics, ecology, and evolution through inquiry-based AP science.", units: 8, topics: 63 },
              { slug: "ap-chemistry",  image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80", desc: "Master atomic structure, chemical reactions, thermodynamics, and electrochemistry at the AP level.", units: 9, topics: 52 },
              { slug: "ap-physics-c",  image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=600&q=80", desc: "Calculus-based mechanics and electricity & magnetism designed for the most rigorous AP physics exam.", units: 7, topics: 43 },
              { slug: "ap-ush",        image: "https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=600&q=80", desc: "Journey through American history from colonization to the present, analysing key events and primary sources.", units: 9, topics: 55 },
              { slug: "ap-psych",      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", desc: "Uncover the science of mind and behaviour: cognition, development, social psychology, and clinical concepts.", units: 8, topics: 46 },
              { slug: "ap-eng-lang",   image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80", desc: "Develop rhetoric analysis, argumentation, and synthesis writing skills for the AP Language exam.", units: 9, topics: 48 },
              { slug: "ap-calc-bc",    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80", desc: "Limits, derivatives, integrals, infinite series, and parametric equations covered to BC depth.", units: 10, topics: 58 },
              { slug: "ap-stats",      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80", desc: "Statistical reasoning, data collection, probability models, and inference for the AP Statistics exam.", units: 9, topics: 44 },
              { slug: "ap-csa",        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80", desc: "Object-oriented programming in Java: data structures, algorithms, and software design principles.", units: 10, topics: 64 },
            ];
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-7xl mt-8 mb-12"
              >
                {COURSE_CARDS.map((card, idx) => {
                  const reg = courseRegistry[card.slug];
                  if (!reg) return null;
                  const Icon = (() => {
                    const m: Record<string, React.ElementType> = {
                      "ap-biology": Dna, "ap-chemistry": Beaker, "ap-physics-c": Atom,
                      "ap-ush": History, "ap-psych": Brain, "ap-eng-lang": BookOpen,
                      "ap-calc-bc": Sigma, "ap-stats": BarChart3, "ap-csa": Binary,
                    };
                    return m[card.slug] || GraduationCap;
                  })();
                  const courseProgress = classProgressMap?.[card.slug];
                  const totalTopics = card.topics;
                  const pct = typeof courseProgress === "number" ? Math.min(100, Math.round(courseProgress)) : 0;
                  const completedTopics = Math.round((pct / 100) * totalTopics);

                  return (
                    <motion.div
                      key={card.slug}
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link href={`/dashboard/${card.slug}`} className="block group">
                        <div className="bg-[#0b0d1a] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.7)] hover:-translate-y-1">
                          {/* Hero image */}
                          <div className="relative h-36 overflow-hidden">
                            <img
                              src={card.image}
                              alt={reg.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Dark bottom fade */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d1a] via-transparent to-transparent" />
                            {/* Stable badge */}
                            <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                              STABLE
                            </span>
                          </div>

                          {/* Card body */}
                          <div className="p-4">
                            {/* Course name + icon */}
                            <div className="flex items-center gap-2 mb-1.5">
                              <Icon className="w-4 h-4 shrink-0" style={{ color: reg.accentColor }} />
                              <h3 className="font-manrope font-extrabold text-sm text-white truncate">{reg.name}</h3>
                            </div>

                            {/* Description */}
                            <p className="font-sans text-[11px] text-white/45 leading-relaxed line-clamp-2 mb-3">
                              {card.desc}
                            </p>

                            {/* Unit + topic pills */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border" style={{ borderColor: `${reg.accentColor}55`, color: reg.accentColor, background: `${reg.accentColor}18` }}>
                                <Layers className="w-2.5 h-2.5" /> {card.units} UNITS
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-400">
                                <BookMarked className="w-2.5 h-2.5" /> {card.topics} TOPICS
                              </span>
                            </div>

                            {/* Progress */}
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-mono text-white/35">✦ {pct}% Progress</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, delay: idx * 0.05 + 0.3, ease: "easeOut" }}
                                  className="h-full rounded-full"
                                  style={{ background: reg.accentColor }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          })()}


          {/* Tab 2: Course Statistics Previews Grid */}
          {dashboardTab === "previews" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mt-8 mb-8 sm:mb-12"
            >
              {coursePreviewsData.map((course) => (
                <div 
                  key={course.slug}
                  className={cn(
                    "bg-[#08090e]/90 border rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-xl backdrop-blur-md",
                    course.color
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                        {course.category}
                      </span>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-white/90">
                        {course.difficulty}
                      </span>
                    </div>

                    <h3 className="font-manrope font-extrabold text-2xl text-white mb-6 tracking-tight">
                      {course.name}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <Video className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                          <div className="font-manrope font-bold text-white text-sm">{course.videos}</div>
                          <div className="font-mono text-[9px] text-white/40 uppercase">Videos</div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                          <div className="font-manrope font-bold text-white text-sm">{course.articles}</div>
                          <div className="font-mono text-[9px] text-white/40 uppercase">Articles</div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                          <div className="font-manrope font-bold text-white text-sm">{course.topics} / {course.subtopics}</div>
                          <div className="font-mono text-[9px] text-white/40 uppercase">Topics / Subs</div>
                        </div>
                      </div>

                      <div className="bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-white/80" />
                        </div>
                        <div>
                          <div className="font-manrope font-bold text-white text-sm">{course.estTime}</div>
                          <div className="font-mono text-[9px] text-white/40 uppercase">Est. Duration</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link href={`/dashboard/${course.slug}`}>
                    <button className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black font-manrope font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 border border-white/10">
                      <span>Enter Course</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              ))}
            </motion.div>
          )}

          {/* Tab 3: Level Leaderboard Section */}
          {dashboardTab === "leaderboard" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-4xl mt-8 mb-8 sm:mb-12"
            >
              <LevelLeaderboard />
            </motion.div>
          )}
        </div>

      </main>
      </div>

      {/* Sign Out Confirmation Modal */}
      <AnimatePresence>
        {showSignOutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="liquid-glass-strong w-full max-w-sm p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
              
              {/* Circular Warning Icon */}
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4 relative z-10">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>

              <h3 className="font-manrope font-bold text-lg text-white text-center mb-1 px-2 relative z-10">
                Are you sure you want to sign out?
              </h3>
              <p className="text-white/40 text-xs text-center mb-6 relative z-10">Hold the button for 3 seconds to confirm</p>
              
              <div className="flex items-center space-x-3 w-full relative z-10">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="flex-1 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <HoldSignOutButton
                  onConfirm={async () => {
                    try {
                      await signOut(auth);
                      window.location.href = "/";
                    } catch (error) {
                      console.error("Error signing out:", error);
                    }
                  }}
                />
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ReviewModal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
      />

      {/* Account Profile Stats Modal */}
      <AnimatePresence>
        {showAccountPopup && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
            onClick={() => setShowAccountPopup(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-lg bg-[#07080e]/95 border border-white/10 rounded-[32px] overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow effect */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[100px] opacity-35 bg-cyan-500" />
              
              {/* Close button */}
              <button 
                onClick={() => setShowAccountPopup(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 text-white/40 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Profile info */}
              <div className="flex items-center space-x-4 mb-8">
                <div 
                  className="relative group cursor-pointer shrink-0" 
                  onClick={() => avatarInputRef.current?.click()}
                  title="Click to change profile picture"
                >
                  {progress?.photoURL || currentUser?.photoURL ? (
                    <img
                      src={progress?.photoURL || currentUser?.photoURL || ""}
                      alt={progress?.displayName || currentUser?.displayName || "Avatar"}
                      className="w-14 h-14 rounded-full object-cover border border-white/15 group-hover:opacity-75 transition-opacity"
                    />
                  ) : (
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center font-instrument text-2xl font-bold text-black shadow-lg bg-gradient-to-br from-cyan-400 to-white group-hover:opacity-75 transition-opacity"
                    >
                      {firstName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Hover upload icon overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                  {/* Hidden input element */}
                  <input 
                    type="file" 
                    ref={avatarInputRef} 
                    onChange={handleAvatarChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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
                {/* Header */}
                <div className="border-b border-white/5 pb-4">
                  <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/40 uppercase">Academic Portal Stats</span>
                </div>

                {/* Level / XP Progress Section */}
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
                    <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                  <div className="text-center text-[10px] text-white/30 tracking-wider">
                    Total XP Earned: <span className="text-white font-bold">{xp.toLocaleString()} XP</span>
                  </div>
                </div>

                {/* Core metrics grid */}
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

                {/* Quick actions / Sign Out inside the Account statistics */}
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

      <DashboardContextMenu onOpenProfile={() => setShowAccountPopup(true)} />
      <FloatingXPOperations externalOpen={showQuestsModal} onClose={() => setShowQuestsModal(false)} />

    </div>
  );
}
