"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Award, ShoppingBag, Activity, 
  Settings, User, FileText, Lock, Package, LogOut, ExternalLink, Trophy, MessageSquarePlus
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

          {/* Bottom Section: Profile Button Capsule */}
          <div className="relative flex flex-col gap-2 pb-6 w-full" ref={menuRef}>
            <div className="h-px bg-white/[0.08] mx-2 mb-2" />

            {/* Profile Menu Trigger Capsule */}
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className={cn(
                "flex items-center gap-3 w-full py-2 rounded-2xl transition-all duration-200 border cursor-pointer",
                sidebarOpen ? "px-2.5 text-left justify-start" : "px-0 justify-center text-center",
                showProfileMenu 
                  ? "bg-white/10 border-white/20 text-white shadow-lg" 
                  : "border-transparent text-white/70 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <div className="flex-shrink-0 flex items-center justify-center">
                <UserAvatar 
                  photoURL={photoURL} 
                  name={displayName} 
                  activeFrame={progress?.activeAvatarFrame} 
                  size="md" 
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

            {/* Dark page overlay behind popup */}
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

            {/* PROFILE POPOVER — slides out to the right of the sidebar */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, x: -12, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -12, scale: 0.97 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed bottom-6 left-[72px] w-64 bg-[#0b0c16] border border-white/[0.12] rounded-2xl p-2 shadow-[0_24px_60px_rgba(0,0,0,0.95)] z-[99999] text-left text-white flex flex-col space-y-0.5"
                >
                  {/* User header in menu */}
                  <div className="flex items-center gap-3 px-3 py-3 mb-1">
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
                        className="font-manrope font-extrabold text-xs text-white tracking-tight leading-none truncate"
                      />
                      <span className="font-mono text-[10px] text-white/35 mt-0.5 truncate">{username}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/[0.07] mx-1 mb-1" />

                  {/* 1. Settings */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowSettingsModal(true);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/80 hover:text-white"
                  >
                    <Settings className="w-4 h-4 text-white/50" />
                    <span>Settings</span>
                  </button>

                  {/* 2. My Profile */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowProgressProfile(true);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/80 hover:text-white"
                  >
                    <User className="w-4 h-4 text-white/50" />
                    <span>My Profile</span>
                  </button>

                  {/* 3. My Inventory */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowMinecraftInventory(true);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/80 hover:text-white"
                  >
                    <Package className="w-4 h-4 text-white/50" />
                    <span>My Inventory</span>
                  </button>

                  {/* 4. Feedback */}
                  <Link
                    href="/feedback"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/80 hover:text-white"
                  >
                    <MessageSquarePlus className="w-4 h-4 text-white/50" />
                    <span>Feedback</span>
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
