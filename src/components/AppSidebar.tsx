"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Award, ShoppingBag, Activity, 
  Settings, User, FileText, Lock, Package, LogOut, ExternalLink, Trophy, MessageSquarePlus, Bell, CheckCheck, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { SettingsModal } from "@/components/SettingsModal";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { MinecraftInventoryModal } from "@/components/MinecraftInventoryModal";
import { ProgressProfileModal } from "@/components/ProgressProfileModal";
import { UserAvatar } from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { UserDisplayName } from "@/components/UserDisplayName";

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
  const [showMinecraftInventory, setShowMinecraftInventory] = useState(false);
  const [showProgressProfile, setShowProgressProfile] = useState(false);

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
    { label: "Quests", href: "/dashboard/quests", icon: Award },
    { label: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
    { label: "AI Assistant", href: "/dashboard/assistant", icon: "panda" },
    { label: "Shop", href: "/dashboard/shop", icon: ShoppingBag },
  ];

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen z-[9999] flex-shrink-0">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
          <SidebarBody className="justify-between gap-6 h-screen overflow-y-auto">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Top Logo */}
            <Link href="/" className="flex items-center gap-3 px-2 py-2.5 mb-4 group">
              <Activity className="w-5 h-5 text-white flex-shrink-0" />
              <motion.span
                animate={{
                  display: sidebarOpen ? "inline-block" : "none",
                  opacity: sidebarOpen ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
                className="font-manrope font-extrabold text-white tracking-tight whitespace-pre text-base"
              >
                AP Lab
              </motion.span>
            </Link>

            <div className="h-px bg-white/[0.08] mb-4 mx-2" />

            {/* Navigation Links */}
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link key={item.label} href={item.href} className="w-full">
                    <motion.div
                      className={cn(
                        "flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 w-full",
                        isActive
                          ? "bg-white/10 text-white font-bold border border-white/10 shadow-sm"
                          : "text-white/60 hover:bg-white/[0.06] hover:text-white font-semibold"
                      )}
                      whileHover="hover"
                      initial="rest"
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
                              className="flex-1 rounded-sm bg-current" 
                              variants={{
                                rest: { height: bar.rest },
                                hover: { height: bar.hover }
                              }}
                              transition={{ duration: 0.35, ease: "easeInOut", delay: i * 0.05 }}
                            />
                          ))}
                        </motion.div>
                      ) : item.icon === "panda" ? (
                        <motion.div 
                          className="w-7 h-7 shrink-0 flex items-center justify-center -ml-1"
                          variants={{
                            rest: { scale: 1, rotate: 0 },
                            hover: { scale: 1.25, rotate: [0, -10, 10, -5, 0] }
                          }}
                          transition={{ duration: 0.4 }}
                        >
                          <img src="/images/panda-ai.png" alt="Panda AI" className="w-full h-full object-contain" />
                        </motion.div>
                      ) : (
                        <motion.div
                          variants={{
                            rest: { scale: 1, rotate: 0 },
                            hover: { scale: 1.22, rotate: 8 }
                          }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="flex-shrink-0"
                        >
                          {/* @ts-ignore */}
                          <item.icon className="w-5 h-5" />
                        </motion.div>
                      )}

                      <motion.span
                        animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-manrope whitespace-pre"
                      >
                        {item.label}
                      </motion.span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom Section: Notifications & Profile Button Capsule */}
          <div className="relative flex flex-col gap-2 pb-6 w-full" ref={menuRef}>
            <div className="h-px bg-white/[0.08] mx-2 mb-2" />

            {/* Notifications Trigger Item */}
            <button
              type="button"
              onClick={() => {
                setShowNotificationsMenu((prev) => !prev);
                setShowProfileMenu(false);
                setHasUnreadNotifications(false);
              }}
              className={cn(
                "flex items-center gap-3 w-full h-11 rounded-2xl transition-colors duration-150 border cursor-pointer relative shrink-0",
                sidebarOpen ? "px-2.5 text-left justify-start" : "px-0 justify-center text-center",
                showNotificationsMenu
                  ? "bg-white/10 border-white/20 text-white shadow-lg"
                  : "border-transparent text-white/70 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <div className="w-9 h-9 shrink-0 flex items-center justify-center relative">
                <Bell className="w-5 h-5 text-white/80" />
                {hasUnreadNotifications && (
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
                    className="text-xs font-manrope font-semibold whitespace-pre truncate"
                  >
                    Notifications
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Profile Menu Trigger Capsule */}
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className={cn(
                "flex items-center gap-3 w-full h-11 rounded-2xl transition-colors duration-150 border cursor-pointer shrink-0",
                sidebarOpen ? "px-2.5 text-left justify-start" : "px-0 justify-center text-center",
                showProfileMenu 
                  ? "bg-white/10 border-white/20 text-white shadow-lg" 
                  : "border-transparent text-white/70 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <div className="w-9 h-9 shrink-0 flex items-center justify-center">
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
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-start text-left overflow-hidden min-w-0 flex-1"
                  >
                    <UserDisplayName 
                      name={displayName} 
                      activeNameColor={progress?.activeNameColor} 
                      className="font-manrope font-extrabold text-xs text-white tracking-tight leading-none truncate max-w-[110px]" 
                    />
                    <span className="font-mono font-medium text-[10px] text-white/40 tracking-wider mt-0.5 truncate max-w-[110px]">
                      {username}
                    </span>
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
                    "fixed bottom-16 w-96 bg-[#0b0c16] border border-white/[0.12] rounded-3xl p-7 shadow-[0_24px_60px_rgba(0,0,0,0.95)] z-[1000001] text-left text-white flex flex-col space-y-4 transition-[left] duration-200",
                    sidebarOpen ? "left-[232px]" : "left-[68px]"
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

                  {/* Notifications List or Empty View with Light Yellow Background Circle */}
                  {progress?.followers && progress.followers.length > 0 ? (
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
                      {/* Very Light Yellow Background Circle Behind Notification Bell */}
                      <div className="w-24 h-24 rounded-full bg-[#fde047]/15 border border-[#fde047]/30 flex items-center justify-center mx-auto shadow-inner">
                        <img
                          src="/images/notification-bell.png"
                          alt="No Notifications"
                          className="w-16 h-16 object-contain drop-shadow-md"
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
                    "fixed bottom-6 w-64 bg-[#0b0c16] border border-white/[0.12] rounded-2xl p-2 shadow-[0_24px_60px_rgba(0,0,0,0.95)] z-[1000001] text-left text-white flex flex-col space-y-0.5 transition-[left] duration-200",
                    sidebarOpen ? "left-[232px]" : "left-[68px]"
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
                      <span className="font-mono text-[10px] text-white/35 mt-0.5 truncate">{username}</span>
                    </div>
                  </Link>

                  <div className="h-px bg-white/[0.07] mx-1 mb-1" />

                  {/* 1. My Profile */}
                  <Link
                    href={`/dashboard/user/${currentUser?.uid || progress?.uid || ""}`}
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/80 hover:text-white"
                  >
                    <User className="w-4 h-4 text-white/50" />
                    <span>My Profile</span>
                  </Link>

                  {/* 2. My Inventory */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowMinecraftInventory(true);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/80 hover:text-white"
                  >
                    <Package className="w-4 h-4 text-white/50" />
                    <span>My Inventory</span>
                  </button>

                  {/* 3. Feedback */}
                  <Link
                    href="/feedback"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/80 hover:text-white"
                  >
                    <MessageSquarePlus className="w-4 h-4 text-white/50" />
                    <span>Feedback</span>
                  </Link>

                  {/* 4. Settings */}
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/80 hover:text-white"
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
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/80 hover:text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-white/50" />
                      <span>Terms of Service</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/30" />
                  </a>

                  {/* 6. Privacy Policy */}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/80 hover:text-white"
                  >
                    <div className="flex items-center space-x-3">
                      <Lock className="w-4 h-4 text-white/50" />
                      <span>Privacy Policy</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/30" />
                  </a>

                  <div className="h-px bg-white/[0.07] mx-1 my-0.5" />

                  {/* 7. Log Out */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer text-xs font-manrope font-bold text-red-400/80 hover:text-red-400"
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

      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      <ProgressProfileModal isOpen={showProgressProfile} onClose={() => setShowProgressProfile(false)} />
      <MinecraftInventoryModal isOpen={showMinecraftInventory} onClose={() => setShowMinecraftInventory(false)} />
    </>
  );
}
