"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, User, Calendar, LogOut, Compass, BookOpen, 
  Home, LayoutDashboard, BarChart2, Star, Award, Bot, FileText, Folder, Sparkles, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";

interface ContextMenuProps {
  onOpenProfile: () => void;
}

const SEARCHABLE_PAGES = [
  { name: "Home", url: "/", desc: "/app", category: "Core", icon: Home },
  { name: "Dashboard", url: "/dashboard", desc: "/app/dashboard", category: "Core", icon: LayoutDashboard },
  { name: "Progress Analytics", url: "/dashboard/progress", desc: "/app/progress", category: "Core", icon: BarChart2 },
  { name: "AI Assistant", url: "/assistant", desc: "/app/assistant", category: "Core", icon: Bot },
  { name: "Review", url: "/dashboard", desc: "/app/review", category: "Core", icon: Star },
  { name: "Quests", url: "/dashboard", desc: "/app/quests", category: "Core", icon: Award },
  { name: "AP® Biology", url: "/dashboard/ap-biology", desc: "/app/courses/ap-biology", category: "Courses", icon: BookOpen },
  { name: "AP® Chemistry", url: "/dashboard/ap-chemistry", desc: "/app/courses/ap-chemistry", category: "Courses", icon: BookOpen },
  { name: "AP® Physics C", url: "/dashboard/ap-physics", desc: "/app/courses/ap-physics", category: "Courses", icon: BookOpen },
  { name: "AP® Psychology", url: "/dashboard/ap-psychology", desc: "/app/courses/ap-psychology", category: "Courses", icon: BookOpen },
  { name: "AP® US History", url: "/dashboard/ap-ush", desc: "/app/courses/ap-ush", category: "Courses", icon: BookOpen },
  { name: "Portfolio Tools", url: "/dashboard", desc: "/app/ap-portfolios", category: "Tools", icon: Folder },
];

export function DashboardContextMenu({ onOpenProfile }: ContextMenuProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Context menu trigger
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    return () => window.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  // Global & Dropdown Keyboard Shortcut Handler
  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      // Check if user is typing in a text field
      const isEditing = document.activeElement && (
        document.activeElement.tagName === "INPUT" || 
        document.activeElement.tagName === "TEXTAREA" ||
        document.activeElement.getAttribute("contenteditable") === "true"
      );

      // Handle Escape key
      if (key === "escape") {
        if (visible) {
          e.preventDefault();
          setVisible(false);
        }
        return;
      }

      // 1. Global Commands: Cmd + Key (when user is not writing in input)
      if (isCmdOrCtrl) {
        if (isEditing) return;

        if (key === "s" || key === "k") {
          e.preventDefault();
          setSearchOpen(true);
          setVisible(false);
        } else if (key === "p") {
          e.preventDefault();
          onOpenProfile();
          setVisible(false);
        } else if (key === "g") {
          e.preventDefault();
          router.push("/dashboard/progress");
          setVisible(false);
        } else if (key === "e") {
          e.preventDefault();
          handleSignOut();
          setVisible(false);
        }
      } 
      // 2. Menu-Specific hotkeys (when dropdown is visible, e.g. pressing S, P, V, Q)
      else if (visible) {
        if (key === "s") {
          e.preventDefault();
          setSearchOpen(true);
          setVisible(false);
        } else if (key === "p") {
          e.preventDefault();
          onOpenProfile();
          setVisible(false);
        } else if (key === "g" || key === "v") {
          e.preventDefault();
          router.push("/dashboard/progress");
          setVisible(false);
        } else if (key === "e" || key === "q") {
          e.preventDefault();
          handleSignOut();
          setVisible(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeys);
    return () => window.removeEventListener("keydown", handleKeys);
  }, [visible, onOpenProfile, router]);

  // Hide context menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Focus input when Search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const filteredPages = SEARCHABLE_PAGES.filter((page) =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredPages.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredPages.length) % Math.max(1, filteredPages.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredPages[selectedIndex]) {
        router.push(filteredPages[selectedIndex].url);
        setSearchOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Context Menu Dropdown */}
      <AnimatePresence>
        {visible && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, filter: "blur(12px)", scale: 0.94 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(12px)", scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed z-[999999] w-52 rounded-xl bg-[#060608]/85 backdrop-blur-xl border border-white/10 p-1.5 shadow-[0_16px_50px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.07)] text-white/90"
            style={{
              top: `${Math.min(position.y, window.innerHeight - 200)}px`,
              left: `${Math.min(position.x, window.innerWidth - 220)}px`,
              backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 100%), url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPjxyZWN0IHdpZHRoPSI2IiBoZWlnaHQ9IjYiIGZpbGw9InRyYW5zcGFyZW50Ii8+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjAuNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA4Ii8+PGNpcmNsZSBjeD0iNCIgY3k9IjQiIHI9IjAuNSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA0Ii8+PC9zdmc+')",
              backgroundSize: "auto, 6px 6px",
            }}
          >
            <button
              onClick={() => {
                setVisible(false);
                setSearchOpen(true);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center space-x-2.5">
                <Search className="w-3.5 h-3.5 text-white/40" />
                <span>Search</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-[9px] font-mono text-white/35 bg-white/5 border border-white/10 px-1 py-0.5 rounded">⌘S</span>
              </div>
            </button>

            <button
              onClick={() => {
                setVisible(false);
                onOpenProfile();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center space-x-2.5">
                <User className="w-3.5 h-3.5 text-white/40" />
                <span>Profile</span>
              </div>
              <span className="text-[9px] font-mono text-white/35 bg-white/5 border border-white/10 px-1 py-0.5 rounded">⌘P</span>
            </button>

            <button
              onClick={() => {
                setVisible(false);
                router.push("/dashboard/progress");
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all text-left"
            >
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-3.5 h-3.5 text-white/40" />
                <span>Progress</span>
              </div>
              <span className="text-[9px] font-mono text-white/35 bg-white/5 border border-white/10 px-1 py-0.5 rounded">⌘G</span>
            </button>

            <div className="h-[1px] bg-white/5 my-1" />

            <button
              onClick={() => {
                setVisible(false);
                handleSignOut();
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all text-left"
            >
              <div className="flex items-center space-x-2.5">
                <LogOut className="w-3.5 h-3.5 opacity-60" />
                <span>Sign Out</span>
              </div>
              <span className="text-[9px] font-mono text-red-400/40 bg-red-950/20 border border-red-500/10 px-1 py-0.5 rounded">⌘E</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command Palette Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-[9999999] flex items-start justify-center pt-[15vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Sleek Black-themed Stellar Search Card */}
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-xl bg-[#090a10]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden z-10 text-white font-manrope flex flex-col"
            >
              {/* Top Search Header */}
              <div className="relative w-full flex items-center px-5 py-4 border-b border-white/[0.08]">
                <Search className="w-5 h-5 text-white/40 mr-3.5 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search AP® Lab..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full bg-transparent border-0 outline-none text-white text-base font-manrope font-medium placeholder-white/30 focus:ring-0"
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="text-[10px] font-mono font-bold text-white/30 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded transition-all shrink-0 ml-2"
                >
                  ESC
                </button>
              </div>

              {/* Scrollable Results List */}
              <div
                data-lenis-prevent="true"
                tabIndex={0}
                className="w-full p-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-1.5 outline-none"
              >
                {filteredPages.length === 0 ? (
                  <div className="py-10 text-center text-white/30 font-manrope text-sm">
                    No matching results found.
                  </div>
                ) : (
                  filteredPages.map((page, index) => {
                    const isSelected = index === selectedIndex;
                    const IconComponent = page.icon || Compass;

                    return (
                      <button
                        key={page.url}
                        ref={(el) => {
                          if (isSelected && el) {
                            el.scrollIntoView({ block: "nearest", behavior: "smooth" });
                          }
                        }}
                        onClick={() => {
                          router.push(page.url);
                          setSearchOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer group/item relative border",
                          isSelected 
                            ? "bg-blue-600/15 border-blue-500/40 text-white" 
                            : "bg-transparent border-transparent text-white/70 hover:bg-white/[0.04] hover:text-white"
                        )}
                      >
                        <div className="flex items-center space-x-3.5 min-w-0 mr-3">
                          {/* Icon Container matching Stellar screenshot */}
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200",
                            isSelected 
                              ? "bg-blue-500/20 border-blue-400/30 text-blue-400" 
                              : "bg-white/[0.04] border-white/10 text-white/50 group-hover/item:text-white group-hover/item:border-white/20"
                          )}>
                            <IconComponent className="w-5 h-5" />
                          </div>

                          <div className="min-w-0">
                            <span className={cn(
                              "text-sm font-bold block leading-tight truncate transition-colors",
                              isSelected ? "text-white" : "text-white/90"
                            )}>
                              {page.name}
                            </span>
                            <span className="text-xs font-mono text-white/40 block mt-1 truncate">
                              {page.desc}
                            </span>
                          </div>
                        </div>

                        {/* Arrow Right Indicator matching Stellar screenshot */}
                        <ArrowRight className={cn(
                          "w-4 h-4 shrink-0 transition-transform duration-200",
                          isSelected ? "text-blue-400 translate-x-0.5 opacity-100" : "text-white/20 opacity-0 group-hover/item:opacity-40"
                        )} />
                      </button>
                    );
                  })
                )}
              </div>

              {/* Bottom Footer Info Bar matching Stellar screenshot */}
              <div className="px-5 py-2.5 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-[11px] font-mono text-white/30">
                <span>{filteredPages.length} results</span>
                <span className="text-[10px]">Use ↑ ↓ to navigate, ↵ to select</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
