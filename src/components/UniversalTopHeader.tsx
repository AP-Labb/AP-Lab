"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, X, BookOpen, MessageSquare, CheckSquare,
  Dna, FlaskConical, Zap, Landmark, Brain, Calculator, BarChart2, Code2,
  Award, ChevronRight, ArrowRight
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

// 9 AP Courses with clean white symbols (matching Knowt clean aesthetic)
const ALL_COURSES = [
  { slug: "ap-biology", name: "AP® Biology", category: "Science", icon: Dna, url: "/dashboard/ap-biology" },
  { slug: "ap-chemistry", name: "AP® Chemistry", category: "Science", icon: FlaskConical, url: "/dashboard/ap-chemistry" },
  { slug: "ap-physics-c", name: "AP® Physics C", category: "Science", icon: Zap, url: "/dashboard/ap-physics-c" },
  { slug: "ap-calc-bc", name: "AP® Calculus BC", category: "Math", icon: Calculator, url: "/dashboard/ap-calc-bc" },
  { slug: "ap-csa", name: "AP® Comp Sci A", category: "Math & CS", icon: Code2, url: "/dashboard/ap-csa" },
  { slug: "ap-stats", name: "AP® Statistics", category: "Math", icon: BarChart2, url: "/dashboard/ap-stats" },
  { slug: "ap-ush", name: "AP® US History", category: "Humanities", icon: Landmark, url: "/dashboard/apush" },
  { slug: "ap-eng-lang", name: "AP® English Language", category: "Humanities", icon: BookOpen, url: "/dashboard/ap-english" },
  { slug: "ap-psych", name: "AP® Psychology", category: "Humanities", icon: Brain, url: "/dashboard/ap-psychology" },
];

// Fallback AI Study Sessions if user doesn't have local chat history yet
const DEFAULT_AI_CHATS: ChatSessionItem[] = [
  { id: "ap-bio-ai-tutor", title: "AP Biology Gene Expression & Transcription Tutor", timestamp: "Today" },
  { id: "ap-calc-bc-ai-coach", title: "AP Calculus BC Taylor Series & Power Series Coach", timestamp: "Yesterday" },
  { id: "ap-physics-c-solver", title: "AP Physics C Torque & Rotational Dynamics Solver", timestamp: "3 days ago" },
  { id: "apush-dbq-reviewer", title: "APUSH DBQ Essay Critique & Document Analysis", timestamp: "4 days ago" },
];

export function UniversalTopHeader() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"courses" | "chats" | "exams">("courses");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userChats, setUserChats] = useState<ChatSessionItem[]>([]);

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

  // Real-time filtered courses and chats
  const filteredCourses = ALL_COURSES.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
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
            className="relative flex items-center w-full h-12 pl-11 pr-12 rounded-full bg-[#181a26] hover:bg-[#202232] border border-white/10 text-sm font-medium text-white placeholder:text-white/40 transition-all cursor-pointer shadow-inner group"
          >
            <Search className="absolute left-4 w-5 h-5 text-white/50 group-hover:text-white transition-colors pointer-events-none" />
            <span className="text-white/40 group-hover:text-white/60 transition-colors select-none">
              Search for anything...
            </span>
            <div className="absolute right-3 hidden sm:flex items-center space-x-1 bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[10px] font-mono text-white/40">
              <span>⌘K</span>
            </div>
          </div>
        </div>

        {/* Top Right User Capsules */}
        <HeaderUserCapsules onOpenProfile={() => setShowProfileModal(true)} />
      </header>

      {/* Account Profile Modal */}
      <AccountProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* ========================================================= */}
      {/* CLEAN KNOWT-STYLE SEARCH MODAL DIALOG */}
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
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Dialog Window - Exact Knowt Dark Styling */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-4xl bg-[#1e1f25] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[560px] z-10 text-left"
            >
              {/* LEFT SIDEBAR NAVIGATION (Knowt style) */}
              <div className="w-full md:w-56 bg-[#15161a] border-b md:border-b-0 md:border-r border-white/10 p-4 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 shrink-0 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("courses")}
                  className={cn(
                    "flex items-center space-x-2.5 px-4 py-2.5 rounded-full text-xs transition-all cursor-pointer shrink-0 font-manrope",
                    activeTab === "courses"
                      ? "bg-[#c4f2e3] text-black font-extrabold shadow-sm"
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
                      ? "bg-[#c4f2e3] text-black font-extrabold shadow-sm"
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
                      ? "bg-[#c4f2e3] text-black font-extrabold shadow-sm"
                      : "text-white/70 hover:text-white hover:bg-white/5 font-semibold"
                  )}
                >
                  <CheckSquare className="w-4 h-4 shrink-0" />
                  <span>Exams</span>
                </button>
              </div>

              {/* RIGHT MAIN PANEL */}
              <div className="flex-1 bg-[#1e1f25] p-5 sm:p-6 flex flex-col overflow-hidden">
                {/* Search Input Box & Close Button */}
                <div className="flex items-center space-x-3 mb-6 shrink-0">
                  <div className="relative flex-1 flex items-center bg-[#131418] border border-white/10 focus-within:border-white/30 rounded-full px-4 py-3 text-white transition-all shadow-inner">
                    <Search className="w-4 h-4 text-white/50 mr-2.5 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search for anything"
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

                {/* TAB CONTENT AREA */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                  
                  {/* TAB 1: ALL AP COURSES */}
                  {activeTab === "courses" && (
                    <div className="space-y-4">
                      <span className="text-xs font-manrope font-bold text-white block">
                        Browse by AP Course
                      </span>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filteredCourses.map((c) => {
                          const Icon = c.icon;
                          return (
                            <div
                              key={c.slug}
                              onClick={() => handleNavigate(c.url)}
                              className="bg-[#28292e] hover:bg-[#303137] border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2.5 cursor-pointer transition-all hover:scale-[1.02] shadow-md group"
                            >
                              {/* Clean Solid White Icon */}
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                <Icon className="w-6 h-6 text-white opacity-90 group-hover:opacity-100 transition-opacity stroke-[1.75]" />
                              </div>
                              <span className="font-manrope font-bold text-xs text-white tracking-tight group-hover:text-[#c4f2e3] transition-colors">
                                {c.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MY CHATS (REAL SAVED CHATS / ASSISTANT DEEP-LINKS) */}
                  {activeTab === "chats" && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-manrope font-bold text-white block">
                          My AI Conversations
                        </span>
                        <button
                          onClick={() => handleNavigate("/dashboard/assistant")}
                          className="text-xs font-manrope font-bold text-[#c4f2e3] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>New Chat</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      {filteredChats.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => handleNavigate(`/dashboard/assistant?chatId=${chat.id}`)}
                          className="bg-[#28292e] hover:bg-[#303137] border border-white/10 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center space-x-3.5 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white shrink-0">
                              <MessageSquare className="w-4.5 h-4.5 text-white stroke-[1.75]" />
                            </div>
                            <div className="min-w-0 text-left">
                              <h4 className="font-manrope font-bold text-xs text-white truncate group-hover:text-[#c4f2e3] transition-colors">
                                {chat.title}
                              </h4>
                              <span className="text-[10px] font-mono text-white/40 block mt-0.5">
                                {chat.timestamp}
                              </span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: EXAMS */}
                  {activeTab === "exams" && (
                    <div className="space-y-3">
                      <span className="text-xs font-manrope font-bold text-white block mb-3">
                        Browse by AP Diagnostic Exams
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ALL_COURSES.map((c) => {
                          const Icon = c.icon;
                          return (
                            <div
                              key={c.slug}
                              onClick={() => handleNavigate(c.url)}
                              className="bg-[#28292e] hover:bg-[#303137] border border-white/10 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between group"
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white shrink-0">
                                  <Icon className="w-5 h-5 text-white stroke-[1.75]" />
                                </div>
                                <div className="text-left min-w-0">
                                  <h4 className="font-manrope font-bold text-xs text-white truncate group-hover:text-[#c4f2e3] transition-colors">
                                    {c.name} Exam
                                  </h4>
                                  <span className="text-[10px] font-mono text-white/40 block mt-0.5 truncate">
                                    Diagnostic Exam Simulator
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
