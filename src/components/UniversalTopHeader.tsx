"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, X, BookOpen, MessageSquare, CheckSquare, Sparkles,
  Dna, FlaskConical, Zap, Landmark, Brain, Calculator, BarChart2, Code2,
  Clock, ArrowRight, Award, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderUserCapsules } from "@/components/HeaderUserCapsules";
import { AccountProfileModal } from "@/components/AccountProfileModal";
import { cn } from "@/lib/utils";

// 9 AP Courses with exact metadata, icons and colors
const ALL_COURSES = [
  { slug: "ap-biology", name: "AP® Biology", category: "Science", icon: Dna, color: "text-emerald-400", bgGlow: "bg-emerald-500/10 border-emerald-500/30", url: "/dashboard/ap-biology" },
  { slug: "ap-chemistry", name: "AP® Chemistry", category: "Science", icon: FlaskConical, color: "text-cyan-400", bgGlow: "bg-cyan-500/10 border-cyan-500/30", url: "/dashboard/ap-chemistry" },
  { slug: "ap-physics-c", name: "AP® Physics C", category: "Science", icon: Zap, color: "text-indigo-400", bgGlow: "bg-indigo-500/10 border-indigo-500/30", url: "/dashboard/ap-physics-c" },
  { slug: "ap-calc-bc", name: "AP® Calculus BC", category: "Math", icon: Calculator, color: "text-emerald-400", bgGlow: "bg-emerald-500/10 border-emerald-500/30", url: "/dashboard/ap-calc-bc" },
  { slug: "ap-csa", name: "AP® Comp Sci A", category: "Math & CS", icon: Code2, color: "text-violet-400", bgGlow: "bg-violet-500/10 border-violet-500/30", url: "/dashboard/ap-csa" },
  { slug: "ap-stats", name: "AP® Statistics", category: "Math", icon: BarChart2, color: "text-sky-400", bgGlow: "bg-sky-500/10 border-sky-500/30", url: "/dashboard/ap-stats" },
  { slug: "ap-ush", name: "AP® US History", category: "Humanities", icon: Landmark, color: "text-amber-400", bgGlow: "bg-amber-500/10 border-amber-500/30", url: "/dashboard/apush" },
  { slug: "ap-eng-lang", name: "AP® English Language", category: "Humanities", icon: BookOpen, color: "text-rose-400", bgGlow: "bg-rose-500/10 border-rose-500/30", url: "/dashboard/ap-english" },
  { slug: "ap-psych", name: "AP® Psychology", category: "Humanities", icon: Brain, color: "text-purple-400", bgGlow: "bg-purple-500/10 border-purple-500/30", url: "/dashboard/ap-psychology" },
];

// Sample AI Chats History
const MY_CHATS = [
  { id: "chat-1", title: "AP Bio Gene Expression & Transcription Session", time: "2 hours ago", snippet: "Analyzed RNA polymerase promoter binding and lac operon regulation.", url: "/dashboard/assistant" },
  { id: "chat-2", title: "AP Calc BC Taylor Series & Radius of Convergence", time: "Yesterday", snippet: "Solved ratio test steps for power series expansion.", url: "/dashboard/assistant" },
  { id: "chat-3", title: "AP Physics C Rotation & Angular Momentum Problem Solver", time: "3 days ago", snippet: "Calculated moment of inertia for composite disk system.", url: "/dashboard/assistant" },
  { id: "chat-4", title: "APUSH DBQ Essay Outline & Document Analysis", time: "4 days ago", snippet: "Evaluated Antebellum reform movements and sourcing arguments.", url: "/dashboard/assistant" },
  { id: "chat-5", title: "AP Chem Thermodynamics & Gibbs Free Energy Helper", time: "5 days ago", snippet: "Calculated delta G under non-standard temperature conditions.", url: "/dashboard/assistant" },
  { id: "chat-6", title: "AP Psych Neural Transmission & Brain Anatomy", time: "1 week ago", snippet: "Reviewed action potential depolarization and neurotransmitter reuptake.", url: "/dashboard/assistant" },
];

// Sample Recent Search Chips
const RECENT_SEARCHES = ["AP Biology", "AP Calculus BC", "AP US History", "AP Physics C"];

export function UniversalTopHeader() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"courses" | "chats" | "exams">("courses");
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Close modal on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Real-time filtered items based on query
  const filteredCourses = ALL_COURSES.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredChats = MY_CHATS.filter(
    (c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.snippet.toLowerCase().includes(query.toLowerCase())
  );

  const handleCourseClick = (url: string) => {
    setIsModalOpen(false);
    setQuery("");
    router.push(url);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#080911]/95 px-4 sm:px-8 py-3 flex items-center justify-between font-manrope">
        {/* Universal Search Input Bar Trigger */}
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

        {/* Top Right User Capsules (Streak, XP, Coins, Profile) */}
        <HeaderUserCapsules onOpenProfile={() => setShowProfileModal(true)} />
      </header>

      {/* Account Profile Modal */}
      <AccountProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />

      {/* ========================================================= */}
      {/* KNOWT-STYLE SEARCH & EXPLORE MODAL DIALOG */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 font-manrope">
            {/* Backdrop Dim Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="relative w-full max-w-4xl bg-[#0f1019] border border-white/15 rounded-[32px] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col md:flex-row h-[580px] z-10 text-left"
            >
              {/* LEFT SIDEBAR NAVIGATION INSIDE MODAL */}
              <div className="w-full md:w-60 bg-[#080911] border-b md:border-b-0 md:border-r border-white/10 p-4 flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1.5 shrink-0 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("courses")}
                  className={cn(
                    "flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0",
                    activeTab === "courses"
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All AP Courses</span>
                </button>

                <button
                  onClick={() => setActiveTab("chats")}
                  className={cn(
                    "flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0",
                    activeTab === "chats"
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>My Chats</span>
                </button>

                <button
                  onClick={() => setActiveTab("exams")}
                  className={cn(
                    "flex items-center space-x-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0",
                    activeTab === "exams"
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shadow-sm"
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Exams</span>
                </button>
              </div>

              {/* RIGHT MAIN PANEL INSIDE MODAL */}
              <div className="flex-1 bg-[#0f1019] p-5 sm:p-6 flex flex-col overflow-hidden">
                {/* Search Bar Input & Close Button */}
                <div className="flex items-center space-x-3 mb-5 shrink-0">
                  <div className="relative flex-1 flex items-center bg-[#171926] border border-white/10 focus-within:border-emerald-400/50 rounded-2xl px-4 py-3 text-white transition-all shadow-inner">
                    <Search className="w-4 h-4 text-white/40 mr-2.5 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search for anything..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-transparent text-white placeholder:text-white/30 focus:outline-none text-sm font-manrope font-medium"
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
                    className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all shrink-0 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* TAB CONTENT AREA */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                  
                  {/* TAB 1: ALL AP COURSES */}
                  {activeTab === "courses" && (
                    <div className="space-y-6">
                      {/* Recently Searched Chips */}
                      {!query && (
                        <div className="space-y-2.5">
                          <span className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-wider block">
                            Recently Searched
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {RECENT_SEARCHES.map((chip) => (
                              <button
                                key={chip}
                                onClick={() => setQuery(chip)}
                                className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#171926] hover:bg-[#202232] border border-white/10 text-xs font-manrope text-white/80 hover:text-white transition-all cursor-pointer group"
                              >
                                <Search className="w-3 h-3 text-white/40 group-hover:text-emerald-400 transition-colors" />
                                <span>{chip}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Courses Grid */}
                      <div className="space-y-2.5">
                        <span className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-wider block">
                          {query ? "Search Results" : "Browse AP Courses"}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {filteredCourses.map((c) => {
                            const Icon = c.icon;
                            return (
                              <div
                                key={c.slug}
                                onClick={() => handleCourseClick(c.url)}
                                className={cn(
                                  "p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center space-x-3 hover:scale-[1.02] shadow-md group",
                                  c.bgGlow
                                )}
                              >
                                <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                                  <Icon className={cn("w-5 h-5", c.color)} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-manrope font-extrabold text-xs text-white truncate group-hover:text-emerald-300 transition-colors">
                                    {c.name}
                                  </h4>
                                  <span className="text-[10px] font-mono text-white/40 block mt-0.5">
                                    {c.category}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MY CHATS */}
                  {activeTab === "chats" && (
                    <div className="space-y-3">
                      <span className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-wider block mb-3">
                        My Recent AI Conversations
                      </span>
                      {filteredChats.map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => handleCourseClick(chat.url)}
                          className="bg-[#171926] hover:bg-[#202232] border border-white/10 rounded-2xl p-4 transition-all cursor-pointer flex items-start space-x-3.5 group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between">
                              <h4 className="font-manrope font-bold text-xs text-white truncate group-hover:text-emerald-300 transition-colors">
                                {chat.title}
                              </h4>
                              <span className="text-[10px] font-mono text-white/35 shrink-0 ml-2">
                                {chat.time}
                              </span>
                            </div>
                            <p className="text-[11px] font-manrope text-white/50 truncate mt-1">
                              {chat.snippet}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 3: EXAMS */}
                  {activeTab === "exams" && (
                    <div className="space-y-3">
                      <span className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-wider block mb-3">
                        AP Exam Diagnostics Simulators
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ALL_COURSES.map((c) => {
                          const Icon = c.icon;
                          return (
                            <div
                              key={c.slug}
                              onClick={() => handleCourseClick(c.url)}
                              className="bg-[#171926] hover:bg-[#202232] border border-white/10 rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between group"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                  <h4 className="font-manrope font-extrabold text-xs text-white group-hover:text-amber-300 transition-colors">
                                    {c.name} Exam
                                  </h4>
                                  <span className="text-[10px] font-mono text-white/40 block mt-0.5">
                                    Timed FRQ & MCQ Diagnostic
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
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
