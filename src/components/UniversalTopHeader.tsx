"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, X, BookOpen, MessageSquare, CheckSquare,
  Dna, FlaskConical, Zap, Landmark, Brain, Calculator, BarChart2, Code2,
  Award, ChevronRight, ArrowRight, FileText, UserPlus, Mail, ShieldCheck, FileCheck, ShoppingBag, Trophy, Bot, User, Package, Star, Settings, LayoutDashboard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderUserCapsules } from "@/components/HeaderUserCapsules";
import { AccountProfileModal } from "@/components/AccountProfileModal";
import { cn } from "@/lib/utils";

interface ChatSessionItem {
  id: string;
  title: string;
  timestamp: string;
  messages?: any[];
}

// 9 AP Courses with actual course page colors
const ALL_COURSES = [
  { slug: "ap-biology", name: "AP® Biology", category: "Science", icon: Dna, accent: "#10b981", url: "/dashboard/ap-biology" },
  { slug: "ap-chemistry", name: "AP® Chemistry", category: "Science", icon: FlaskConical, accent: "#06b6d4", url: "/dashboard/ap-chemistry" },
  { slug: "ap-physics-c", name: "AP® Physics C", category: "Science", icon: Zap, accent: "#3b82f6", url: "/dashboard/ap-physics-c" },
  { slug: "ap-calc-bc", name: "AP® Calculus BC", category: "Math", icon: Calculator, accent: "#8b5cf6", url: "/dashboard/ap-calc-bc" },
  { slug: "ap-csa", name: "AP® Comp Sci A", category: "Math & CS", icon: Code2, accent: "#f59e0b", url: "/dashboard/ap-csa" },
  { slug: "ap-stats", name: "AP® Statistics", category: "Math", icon: BarChart2, accent: "#ec4899", url: "/dashboard/ap-stats" },
  { slug: "ap-ush", name: "AP® US History", category: "Humanities", icon: Landmark, accent: "#ef4444", url: "/dashboard/apush" },
  { slug: "ap-eng-lang", name: "AP® English Language", category: "Humanities", icon: BookOpen, accent: "#14b8a6", url: "/dashboard/ap-english" },
  { slug: "ap-psych", name: "AP® Psychology", category: "Humanities", icon: Brain, accent: "#a855f7", url: "/dashboard/ap-psychology" },
];

// All AP Lab Platform & Core Pages
const PLATFORM_PAGES = [
  { name: "Dashboard", category: "Core", icon: LayoutDashboard, url: "/dashboard" },
  { name: "Progress Analytics", category: "Core", icon: BarChart2, url: "/dashboard/progress" },
  { name: "Quests & Rewards", category: "Core", icon: Award, url: "/dashboard/quests" },
  { name: "Global Leaderboard", category: "Core", icon: Trophy, url: "/dashboard/leaderboard" },
  { name: "AI Assistant", category: "Core", icon: Bot, url: "/assistant" },
  { name: "My Profile", category: "Core", icon: User, url: "/dashboard/user/me" },
  { name: "Shop", category: "Core", icon: ShoppingBag, url: "/dashboard/shop" },
  { name: "My Inventory", category: "Core", icon: Package, url: "/dashboard/shop?openInventory=true" },
  { name: "Reviews & Feedback", category: "Core", icon: Star, url: "/dashboard/feedback" },
  { name: "Account Settings", category: "Core", icon: Settings, url: "/dashboard/settings" },
  { name: "Blog & Articles", category: "Platform", icon: FileText, url: "/blog" },
  { name: "Join AP Lab", category: "Platform", icon: UserPlus, url: "/join" },
  { name: "Contact Us", category: "Platform", icon: Mail, url: "/contact" },
  { name: "Privacy Policy", category: "Platform", icon: ShieldCheck, url: "/privacy" },
  { name: "Terms of Service", category: "Platform", icon: FileCheck, url: "/terms" },
];

// Custom Trophy Image Mapping for AP Courses
export const COURSE_TROPHY_CONFIG: Record<string, { image: string; circleBg: string }> = {
  "ap-biology": { image: "/images/trophies/ap-biology.png", circleBg: "#dcfce7" },
  "ap-chemistry": { image: "/images/trophies/ap-chemistry.png", circleBg: "#cffafe" },
  "ap-physics-c": { image: "/images/trophies/ap-physics-c.png", circleBg: "#dbeafe" },
  "ap-calc-bc": { image: "/images/trophies/ap-calc-bc.png", circleBg: "#e0f2fe" },
  "ap-csa": { image: "/images/trophies/ap-csa.png", circleBg: "#f3e8ff" },
  "ap-stats": { image: "/images/trophies/ap-stats.png", circleBg: "#e0f2fe" },
  "ap-statistics": { image: "/images/trophies/ap-stats.png", circleBg: "#e0f2fe" },
  "ap-ush": { image: "/images/trophies/ap-ush.png", circleBg: "#fef3c7" },
  "ap-us-history": { image: "/images/trophies/ap-ush.png", circleBg: "#fef3c7" },
  "ap-eng-lang": { image: "/images/trophies/ap-eng-lang.png", circleBg: "#fce7f3" },
  "ap-english": { image: "/images/trophies/ap-eng-lang.png", circleBg: "#fce7f3" },
  "ap-psych": { image: "/images/trophies/ap-psych.png", circleBg: "#f3e8ff" },
  "ap-psychology": { image: "/images/trophies/ap-psych.png", circleBg: "#f3e8ff" },
};

// Fallback AI Study Sessions with dates & times if user doesn't have local chat history yet
const DEFAULT_AI_CHATS: ChatSessionItem[] = [
  { id: "ap-bio-ai-tutor", title: "AP Biology Gene Expression & Transcription Tutor", timestamp: "Today at 3:12 PM" },
  { id: "ap-calc-bc-ai-coach", title: "AP Calculus BC Taylor Series & Power Series Coach", timestamp: "Yesterday at 4:45 PM" },
  { id: "ap-physics-c-solver", title: "AP Physics C Torque & Rotational Dynamics Solver", timestamp: "Aug 6, 2:15 PM" },
  { id: "apush-dbq-reviewer", title: "APUSH DBQ Essay Critique & Document Analysis", timestamp: "Aug 5, 11:30 AM" },
];

export function UniversalTopHeader() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"courses" | "chats" | "exams">("courses");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userChats, setUserChats] = useState<ChatSessionItem[]>([]);

  // Listen for right-click search trigger or global search events
  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
    window.addEventListener("ap-lab-open-search-modal", handleOpenModal);
    return () => window.removeEventListener("ap-lab-open-search-modal", handleOpenModal);
  }, []);

  // Load real user chats from localStorage when modal opens
  useEffect(() => {
    if (isModalOpen && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ap-lab-ai-chats");
        if (saved) {
          const parsed: ChatSessionItem[] = JSON.parse(saved);
          if (parsed && parsed.length > 0) {
            setUserChats(parsed);
          } else {
            setUserChats(DEFAULT_AI_CHATS);
          }
        } else {
          setUserChats(DEFAULT_AI_CHATS);
        }
      } catch (e) {
        setUserChats(DEFAULT_AI_CHATS);
      }
    }
  }, [isModalOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Real-time filtered courses, platform pages, and chats
  const filteredCourses = ALL_COURSES.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPlatformPages = PLATFORM_PAGES.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredChats = userChats.filter(
    (c) => c.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleNavigate = (url: string) => {
    setIsModalOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#080911]/95 px-4 sm:px-8 py-3 flex items-center justify-between font-manrope">
        {/* Universal Search Bar Trigger */}
        <div className="relative flex-1 mr-4 sm:mr-6">
          <div 
            onClick={() => setIsModalOpen(true)}
            className="relative flex items-center w-full h-12 pl-11 pr-4 rounded-full bg-[#181a26] hover:bg-[#202232] border border-white/10 text-sm font-medium text-white placeholder:text-white/40 transition-all cursor-pointer shadow-inner group"
          >
            <Search className="absolute left-4 w-5 h-5 text-white/50 group-hover:text-white transition-colors pointer-events-none" />
            <span className="text-white/40 group-hover:text-white/60 transition-colors select-none">
              Search for anything...
            </span>
          </div>
        </div>

        {/* Top Right User Capsules */}
        <HeaderUserCapsules onOpenProfile={() => setShowProfileModal(true)} />
      </header>

      {/* Account Profile Modal */}
      <AccountProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* ========================================================= */}
      {/* DARKER SEARCH MODAL DIALOG WITH WHITE ACTIVE TAB SELECTOR */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 font-manrope">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Window Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-4xl bg-[#090b12] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[580px] max-h-[88vh] z-10 text-left"
            >
              {/* LEFT SIDEBAR NAVIGATION (WHITE SELECT ACTIVE TAB) */}
              <div className="w-full md:w-56 bg-[#05060b] border-b md:border-b-0 md:border-r border-white/10 p-4 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 shrink-0 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("courses")}
                  className={cn(
                    "flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer shrink-0 font-manrope",
                    activeTab === "courses"
                      ? "bg-white text-black font-extrabold shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/5 font-semibold"
                  )}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>All of AP Lab</span>
                </button>

                <button
                  onClick={() => setActiveTab("chats")}
                  className={cn(
                    "flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer shrink-0 font-manrope",
                    activeTab === "chats"
                      ? "bg-white text-black font-extrabold shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/5 font-semibold"
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>My Chats</span>
                </button>

                <button
                  onClick={() => setActiveTab("exams")}
                  className={cn(
                    "flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer shrink-0 font-manrope",
                    activeTab === "exams"
                      ? "bg-white text-black font-extrabold shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/5 font-semibold"
                  )}
                >
                  <CheckSquare className="w-4 h-4 shrink-0" />
                  <span>Exams</span>
                </button>
              </div>

              {/* RIGHT MAIN PANEL WITH GUARANTEED WORKING FLEX SCROLLING */}
              <div className="flex-1 bg-[#090b12] p-5 sm:p-6 flex flex-col min-h-0 h-full overflow-hidden">
                {/* Search Input Box & Close Button */}
                <div className="flex items-center space-x-3 mb-5 shrink-0">
                  <div className="relative flex-1 flex items-center bg-[#10121c] border border-white/10 focus-within:border-white/30 rounded-full px-4 py-3 text-white transition-all shadow-inner">
                    <Search className="w-4 h-4 text-white/50 mr-2.5 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search for anything..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm font-manrope font-medium"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery("")}
                        className="p-1 text-white/40 hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all shrink-0 cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* TAB CONTENT SCROLL AREA - WORKING 100% */}
                <div className="flex-1 overflow-y-auto max-h-[460px] custom-scrollbar pr-2 min-h-0 select-text">
                  
                  {/* TAB 1: ALL OF AP LAB (AP Courses + All Platform Pages) */}
                  {activeTab === "courses" && (
                    <div className="space-y-6 pb-6">
                      {/* AP Courses Section */}
                      <div>
                        <span className="text-xs font-manrope font-bold text-white/60 uppercase tracking-wider block mb-3">
                          AP Courses
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {filteredCourses.map((c) => {
                            const Icon = c.icon;
                            return (
                              <div
                                key={c.slug}
                                onClick={() => handleNavigate(c.url)}
                                className="bg-[#12141f] hover:bg-[#181a29] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2.5 cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
                              >
                                <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                  <Icon className="w-6 h-6 transition-all stroke-[1.75]" style={{ color: c.accent }} />
                                </div>
                                <span className="font-manrope font-bold text-xs text-white tracking-tight group-hover:text-white transition-colors">
                                  {c.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Platform & Core Pages Section */}
                      <div>
                        <span className="text-xs font-manrope font-bold text-white/60 uppercase tracking-wider block mb-3">
                          Platform & Navigation Pages
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {filteredPlatformPages.map((p, idx) => {
                            const Icon = p.icon;
                            return (
                              <div
                                key={idx}
                                onClick={() => handleNavigate(p.url)}
                                className="bg-[#12141f] hover:bg-[#181a29] border border-white/10 rounded-2xl p-3.5 flex items-center space-x-3 cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
                              >
                                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-white/80 group-hover:text-white">
                                  <Icon className="w-5 h-5 stroke-[1.75]" />
                                </div>
                                <span className="font-manrope font-bold text-xs text-white tracking-tight truncate">
                                  {p.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MY CHATS */}
                  {activeTab === "chats" && (
                    <div className="space-y-3 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-manrope font-bold text-white block">
                          My AI Conversations
                        </span>
                        <button
                          onClick={() => handleNavigate("/dashboard/assistant")}
                          className="text-xs font-manrope font-bold text-white hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>New Chat</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      {filteredChats.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => handleNavigate(`/dashboard/assistant?chatId=${chat.id}`)}
                          className="bg-[#12141f] hover:bg-[#181a29] border border-white/10 rounded-2xl p-3.5 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-4 min-w-0">
                            <img src="/images/chat_bubble_icon.png" alt="Chat" className="w-14 h-14 sm:w-16 sm:h-16 object-contain shrink-0" />
                            <div className="min-w-0 text-left">
                              <h4 className="font-manrope font-bold text-sm text-white truncate group-hover:text-white transition-colors">
                                {chat.title}
                              </h4>
                              <span className="text-xs font-mono text-white/50 block mt-1">
                                {chat.timestamp || "Today at 3:12 PM"}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: EXAMS (RAW TRANSPARENT TROPHY IMAGES WITHOUT CIRCLE BACKGROUNDS, ENLARGED!) */}
                  {activeTab === "exams" && (
                    <div className="space-y-3 pb-6">
                      <span className="text-xs font-manrope font-bold text-white block mb-3">
                        Browse by AP Diagnostic Exams
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ALL_COURSES.map((c) => {
                          const Icon = c.icon;
                          const trophyConfig = COURSE_TROPHY_CONFIG[c.slug];
                          return (
                            <div
                              key={c.slug}
                              onClick={() => handleNavigate(`/dashboard/${c.slug}?tab=practice&openExam=true`)}
                              className="bg-[#12141f] hover:bg-[#181a29] border border-white/10 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between group"
                            >
                              <div className="flex items-center space-x-4 min-w-0">
                                {trophyConfig ? (
                                  <img 
                                    src={trophyConfig.image} 
                                    alt={c.name} 
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" 
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    <Icon className="w-8 h-8 stroke-[1.75]" style={{ color: c.accent }} />
                                  </div>
                                )}
                                <div className="text-left min-w-0">
                                  <h4 className="font-manrope font-bold text-xs sm:text-sm text-white truncate group-hover:text-white transition-colors">
                                    {c.name} Diagnostic Exam
                                  </h4>
                                  <span className="text-[10px] font-mono text-white/40 block mt-0.5 truncate">
                                    Open Official Exam Simulator
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors shrink-0 ml-2" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
