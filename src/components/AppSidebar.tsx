"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Award, Trophy, ShoppingBag, Bell, LogOut,
  X, Check, Activity, BookOpen, User, Settings, MessageSquare, FileText, Shield, ExternalLink
} from "lucide-react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { UserAvatar } from "@/components/UserAvatar";
import { UserDisplayName } from "@/components/UserDisplayName";
import { LevelBadge } from "@/components/LevelBadge";
import { SettingsModal } from "@/components/SettingsModal";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  currentPath?: string;
}

export function AppSidebar({ currentPath }: AppSidebarProps) {
  const pathname = usePathname() || currentPath || "/dashboard";
  const router = useRouter();
  const { currentUser } = useAuth();
  const { progress } = useProgress();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [notificationsCleared, setNotificationsCleared] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isCleared = localStorage.getItem("aplab_notifications_cleared") === "true";
      setNotificationsCleared(isCleared);
    }
  }, []);

  const handleOpenNotifications = () => {
    setShowNotificationsMenu((prev) => {
      const next = !prev;
      if (next && !notificationsCleared) {
        setNotificationsCleared(true);
        try { localStorage.setItem("aplab_notifications_cleared", "true"); } catch (e) {}
      }
      return next;
    });
    setShowProfileMenu(false);
  };

  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = progress?.displayName || currentUser?.displayName || "Scholar";
  const email = currentUser?.email || progress?.email || "student@aplab.com";
  const username = email.split("@")[0].toLowerCase();
  const photoURL = progress?.photoURL || currentUser?.photoURL || "";

  // Close menu on outside click or touch
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Progress", href: "/dashboard/progress", icon: "progress" },
    { label: "Quests", href: "/dashboard/quests", icon: "scroll" },
    { label: "Leaderboard", href: "/dashboard/leaderboard", icon: "leaderboard" },
    { label: "AI Assistant", href: "/dashboard/assistant", icon: "panda" },
    { label: "Shop", href: "/dashboard/shop", icon: ShoppingBag },
  ];

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen z-[9999] flex-shrink-0">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
          <SidebarBody className="justify-between h-screen overflow-hidden py-3 px-2">
            <div className="flex flex-col flex-1 overflow-hidden w-full">
              {/* Top Logo */}
              <Link 
                href="/" 
                className={cn(
                  "flex items-center gap-3 py-2 mb-3 group rounded-xl transition-all cursor-pointer",
                  sidebarOpen ? "px-2.5 text-left justify-start" : "px-0 justify-center text-center mx-auto w-full"
                )}
              >
                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-manrope font-bold text-white tracking-tight text-base sm:text-lg whitespace-nowrap truncate"
                  >
                    AP Lab
                  </motion.span>
                )}
              </Link>

              <div className="h-px bg-white/[0.08] mx-1 mb-3" />

              {/* Nav Items List */}
              <div className="space-y-1 w-full">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link key={item.href} href={item.href}>
                      <motion.div
                        className={cn(
                          "flex items-center gap-3 w-full h-10 rounded-2xl transition-all duration-150 border cursor-pointer group select-none",
                          sidebarOpen ? "px-2.5 text-left justify-start" : "px-0 justify-center text-center mx-auto",
                          isActive
                            ? "bg-white/10 border-white/20 text-white shadow-md font-bold"
                            : "border-transparent text-white hover:bg-white/[0.06]"
                        )}
                        whileHover="hover"
                        initial="rest"
                      >
                        <div 
                          className={cn(
                            "w-8 h-8 shrink-0 flex items-center justify-center transition-opacity duration-150 text-white",
                            isActive ? "opacity-100" : "opacity-45 group-hover:opacity-100"
                          )}
                          style={{ isolation: "isolate" }}
                        >
                          {item.icon === "progress" ? (
                            <motion.div 
                              className="w-5 h-5 flex-shrink-0 flex items-end gap-[2px]"
                              variants={{
                                rest: { scale: 1 },
                                hover: { scale: 1.1 }
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {[
                                { rest: "40%", hover: "85%" },
                                { rest: "75%", hover: "45%" },
                                { rest: "55%", hover: "95%" },
                                { rest: "90%", hover: "65%" }
                              ].map((bar, i) => (
                                <motion.div 
                                  key={i} 
                                  className="flex-1 rounded-sm bg-white" 
                                  variants={{
                                    rest: { height: bar.rest },
                                    hover: { height: bar.hover }
                                  }}
                                  transition={{ duration: 0.35, ease: "easeInOut", delay: i * 0.05 }}
                                />
                              ))}
                            </motion.div>
                          ) : item.icon === "scroll" ? (
                            /* Quests Blank Clipboard Icon with Bullet Points & Lines Hover Animation */
                            <motion.div
                              className="w-5 h-5 shrink-0 relative flex items-center justify-center text-white"
                              variants={{
                                rest: { scale: 1 },
                                hover: { scale: 1.12 }
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <svg className="w-5 h-5 overflow-visible" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                {/* Clipboard Base Body */}
                                <rect x="5" y="4" width="14" height="17" rx="2" className="stroke-white" />
                                
                                {/* Top Clamp Clip */}
                                <path d="M9 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" className="stroke-white" fill="currentColor" fillOpacity="0.2" />

                                {/* Line 1: Bullet 1 + Text Line */}
                                <motion.circle
                                  cx="8" cy="9" r="0.75" fill="currentColor"
                                  variants={{
                                    rest: { opacity: 0, scale: 0 },
                                    hover: { opacity: 1, scale: 1 }
                                  }}
                                  transition={{ duration: 0.2, delay: 0.05 }}
                                />
                                <motion.line
                                  x1="11" y1="9" x2="16" y2="9"
                                  variants={{
                                    rest: { opacity: 0, x: -3 },
                                    hover: { opacity: 1, x: 0 }
                                  }}
                                  transition={{ duration: 0.22, delay: 0.08 }}
                                />

                                {/* Line 2: Bullet 2 + Text Line */}
                                <motion.circle
                                  cx="8" cy="13" r="0.75" fill="currentColor"
                                  variants={{
                                    rest: { opacity: 0, scale: 0 },
                                    hover: { opacity: 1, scale: 1 }
                                  }}
                                  transition={{ duration: 0.2, delay: 0.12 }}
                                />
                                <motion.line
                                  x1="11" y1="13" x2="15" y2="13"
                                  variants={{
                                    rest: { opacity: 0, x: -3 },
                                    hover: { opacity: 1, x: 0 }
                                  }}
                                  transition={{ duration: 0.22, delay: 0.15 }}
                                />

                                {/* Line 3: Bullet 3 + Text Line */}
                                <motion.circle
                                  cx="8" cy="17" r="0.75" fill="currentColor"
                                  variants={{
                                    rest: { opacity: 0, scale: 0 },
                                    hover: { opacity: 1, scale: 1 }
                                  }}
                                  transition={{ duration: 0.2, delay: 0.18 }}
                                />
                                <motion.line
                                  x1="11" y1="17" x2="14" y2="17"
                                  variants={{
                                    rest: { opacity: 0, x: -3 },
                                    hover: { opacity: 1, x: 0 }
                                  }}
                                  transition={{ duration: 0.22, delay: 0.21 }}
                                />
                              </svg>
                            </motion.div>
                          ) : item.icon === "leaderboard" ? (
                            /* Leaderboard Medal Icon with Lifting Medal & Swaying Ribbon Hover Animation */
                            <div className="w-5 h-5 shrink-0 relative flex items-center justify-center text-white">
                              {/* Top Ribbon Straps */}
                              <motion.svg
                                className="w-5 h-5 absolute inset-0 overflow-visible"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                variants={{
                                  rest: { scaleY: 1, rotate: 0 },
                                  hover: { scaleY: 1.15, rotate: [0, -6, 6, -3, 0] }
                                }}
                                transition={{ duration: 0.35, ease: "easeOut" }}
                              >
                                <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
                              </motion.svg>

                              {/* Lifting Medal Circle / Star Hub */}
                              <motion.svg
                                className="w-5 h-5 absolute inset-0 overflow-visible"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                variants={{
                                  rest: { y: 0, scale: 1 },
                                  hover: { y: -5, scale: 1.15 }
                                }}
                                transition={{ type: "spring", stiffness: 450, damping: 18 }}
                              >
                                <circle cx="12" cy="14" r="5" fill="currentColor" fillOpacity="0.15" />
                                <path d="M12 11.5l.8 1.6 1.8.3-1.3 1.2.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.2 1.8-.3z" fill="currentColor" />
                              </motion.svg>
                            </div>
                          ) : item.icon === "panda" ? (
                            <motion.div 
                              className="w-6 h-6 shrink-0 flex items-center justify-center"
                              variants={{
                                rest: { scale: 1, rotate: 0 },
                                hover: { scale: 1.25, rotate: [0, -10, 10, -5, 0] }
                              }}
                              transition={{ duration: 0.4 }}
                            >
                              <img 
                                src="/images/panda-ai.png" 
                                alt="Panda AI" 
                                className="w-full h-full object-contain" 
                                style={{
                                  filter: "drop-shadow(1px 0 0 rgba(255,255,255,0.75)) drop-shadow(-1px 0 0 rgba(255,255,255,0.75)) drop-shadow(0 1px 0 rgba(255,255,255,0.75)) drop-shadow(0 -1px 0 rgba(255,255,255,0.75))"
                                }}
                              />
                            </motion.div>
                          ) : (
                            <motion.div
                              variants={{
                                rest: { scale: 1, rotate: 0 },
                                hover: { scale: 1.22, rotate: 8 }
                              }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="flex-shrink-0 text-white"
                            >
                              {/* @ts-ignore */}
                              <item.icon className="w-5 h-5 text-white" />
                            </motion.div>
                          )}
                        </div>

                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-sm font-manrope font-semibold whitespace-nowrap truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Bottom Section: Notifications & Profile Button Capsule */}
            <div className="relative flex flex-col gap-1.5 pb-1 mb-0 w-full shrink-0" ref={menuRef}>
              <div className="h-px bg-white/[0.08] mx-1 mb-1" />

              {/* Notifications Trigger Item */}
              <motion.button
                type="button"
                onClick={handleOpenNotifications}
                whileHover="hover"
                initial="rest"
                className={cn(
                  "flex items-center gap-3 w-full h-10 rounded-2xl transition-colors duration-150 border cursor-pointer relative shrink-0 group",
                  sidebarOpen ? "px-2.5 text-left justify-start" : "px-0 justify-center text-center mx-auto",
                  showNotificationsMenu
                    ? "bg-white/10 border-white/20 text-white shadow-lg"
                    : "border-transparent text-white/70 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <div className="w-8 h-8 shrink-0 flex items-center justify-center relative">
                  <motion.div
                    variants={{
                      rest: { rotate: 0, scale: 1 },
                      hover: {
                        rotate: [0, -20, 20, -15, 15, -8, 8, 0],
                        scale: 1.18,
                        transition: { duration: 0.55, ease: "easeInOut" }
                      }
                    }}
                  >
                    <Bell className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                  </motion.div>
                  {hasUnreadNotifications && !notificationsCleared && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[#090a12] absolute top-0.5 right-0.5 shadow-sm" />
                  )}
                </div>

                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-manrope font-semibold whitespace-nowrap truncate"
                    >
                      Notifications
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Profile Menu Trigger Capsule */}
              <button
                type="button"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className={cn(
                  "flex items-center gap-3 w-full h-10 rounded-2xl transition-colors duration-150 border cursor-pointer shrink-0",
                  sidebarOpen ? "px-2.5 text-left justify-start" : "px-0 justify-center text-center mx-auto",
                  showProfileMenu 
                    ? "bg-white/10 border-white/20 text-white shadow-lg" 
                    : "border-transparent text-white/70 hover:bg-white/[0.06] hover:text-white"
                )}
              >
                <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                  <UserAvatar 
                    photoURL={photoURL} 
                    name={displayName} 
                    activeFrame={progress?.activeAvatarFrame} 
                    size="sm" 
                  />
                </div>

                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col min-w-0 text-left"
                    >
                      <UserDisplayName 
                        name={displayName} 
                        activeNameColor={progress?.activeNameColor} 
                        className="font-manrope font-extrabold text-xs text-white tracking-tight leading-none truncate" 
                      />
                      <span className="font-mono text-[10px] text-white/35 truncate mt-0.5">@{username}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Transparent page freeze backdrop for Notifications menu (NO blur, NO darkening) */}
              <AnimatePresence>
                {showNotificationsMenu && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="fixed inset-0 bg-transparent z-[99998]"
                    onClick={() => setShowNotificationsMenu(false)}
                  />
                )}
              </AnimatePresence>

              {/* Dark backdrop overlay ONLY when profile menu is open (NO blur) */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/40 z-[99998]"
                    onClick={() => setShowProfileMenu(false)}
                  />
                )}
              </AnimatePresence>

              {/* NOTIFICATIONS POPOVER — slides out to the right of the sidebar */}
              <AnimatePresence>
                {showNotificationsMenu && (
                  <motion.div
                    initial={{ opacity: 0, x: -12, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -12, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "fixed bottom-16 w-96 bg-[#08080c] border border-white/10 rounded-3xl p-7 shadow-[0_24px_60px_rgba(0,0,0,0.95)] z-[1000001] text-left text-white flex flex-col space-y-4 transition-[left] duration-200",
                      sidebarOpen ? "left-[236px]" : "left-[72px]"
                    )}
                  >
                    {/* Notifications Header (NO line across top) */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-manrope font-extrabold text-lg text-white tracking-tight">Notifications</h3>
                      <button
                        type="button"
                        title="Close"
                        onClick={() => setShowNotificationsMenu(false)}
                        className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Notifications List or Empty View with LIGHTER Plain Yellow Circle */}
                    {!notificationsCleared && progress?.followers && progress.followers.length > 0 ? (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1 py-1">
                        {progress.followers.map((fUid) => (
                          <div
                            key={fUid}
                            className="flex items-center space-x-3 p-3 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-all"
                          >
                            <div className="w-9 h-9 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 font-bold flex items-center justify-center text-xs shrink-0">
                              {fUid.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-manrope font-bold text-xs text-white truncate">
                                Scholar {fUid}
                              </p>
                              <p className="text-[10px] text-white/50">started following you</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center space-y-3">
                        {/* SOFT LIGHTER PLAIN YELLOW CIRCLE BEHIND BELL (SINGLE COLOR, NO BORDER) */}
                        <div 
                          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-sm"
                          style={{ backgroundColor: "#fef9c3" }}
                        >
                          <img
                            src="/images/notification-bell.png"
                            alt="No Notifications"
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-manrope font-extrabold text-base text-white">
                            No notifications yet
                          </h4>
                          <p className="text-xs font-manrope text-white/40">
                            You're all caught up for now
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* PROFILE POPOVER — slides out to the right of the sidebar */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, x: -12, scale: 0.97 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -12, scale: 0.97 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "fixed bottom-6 w-64 bg-[#08080c] border border-white/10 rounded-2xl p-2 shadow-[0_24px_60px_rgba(0,0,0,0.95)] z-[1000001] text-left text-white flex flex-col space-y-0.5 transition-[left] duration-200",
                      sidebarOpen ? "left-[236px]" : "left-[72px]"
                    )}
                  >
                    {/* Clickable User header in menu (Opens user profile!) */}
                    <Link
                      href={`/dashboard/user/${currentUser?.uid || progress?.uid || ""}`}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-3 mb-1 hover:bg-white/[0.06] rounded-xl transition-all cursor-pointer group"
                    >
                      <UserAvatar
                        photoURL={photoURL}
                        name={displayName}
                        activeFrame={progress?.activeAvatarFrame}
                        size="md"
                      />
                      <div className="flex flex-col min-w-0">
                        <UserDisplayName
                          name={displayName}
                          activeNameColor={progress?.activeNameColor}
                          className="font-manrope font-extrabold text-xs text-white tracking-tight leading-none truncate group-hover:text-purple-300 transition-colors"
                        />
                        <span className="font-mono text-[10px] text-white/35 mt-0.5 truncate">@{username}</span>
                      </div>
                    </Link>

                    <div className="h-px bg-white/[0.07] mx-1 mb-1" />

                    {/* 1. My Profile */}
                    <Link
                      href={`/dashboard/user/${currentUser?.uid || progress?.uid || ""}`}
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-manrope font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-white/50" />
                      <span>My Profile</span>
                    </Link>

                    {/* 2. My Inventory */}
                    <Link
                      href="/dashboard/shop?openInventory=true"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-manrope font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-white/50" />
                      <span>My Inventory</span>
                    </Link>

                    {/* 3. Feedback */}
                    <Link
                      href="/dashboard/feedback"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-manrope font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-white/50" />
                      <span>Feedback</span>
                    </Link>

                    {/* 4. Settings */}
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 text-xs font-manrope font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white rounded-xl transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-white/50" />
                      <span>Settings</span>
                    </Link>

                    <div className="h-px bg-white/[0.07] mx-1 my-0.5" />

                    {/* 5. Terms of Service */}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center justify-between w-full px-3 py-2 text-xs font-manrope font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-white/50" />
                        <span>Terms of Service</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
                    </a>

                    {/* 6. Privacy Policy */}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center justify-between w-full px-3 py-2 text-xs font-manrope font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-white/50" />
                        <span>Privacy Policy</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors" />
                    </a>

                    <div className="h-px bg-white/[0.07] mx-1 my-0.5" />

                    {/* 7. Log Out */}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-3 py-2 text-xs font-manrope font-semibold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-400/70" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SidebarBody>
        </Sidebar>
      </aside>

      {showSettingsModal && (
        <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      )}
    </>
  );
}
