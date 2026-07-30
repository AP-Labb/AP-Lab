"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, LayoutDashboard, Star, Award, Bot, ShoppingBag, Activity, 
  Settings, User, FileText, Lock, Package, LogOut, ExternalLink, Trophy
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { ReviewModal } from "@/components/ReviewModal";
import { SettingsModal } from "@/components/SettingsModal";
import { AccountProfileModal } from "@/components/AccountProfileModal";
import { InstagramLikeStar } from "@/components/InstagramLikeStar";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountModalDefaultTab, setAccountModalDefaultTab] = useState<"profile" | "inventory">("profile");

  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = progress?.displayName || currentUser?.displayName || "Scholar";
  const email = currentUser?.email || progress?.email || "student@aplab.com";
  const username = email.split("@")[0].toLowerCase();
  const photoURL = progress?.photoURL || currentUser?.photoURL || "";

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
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
    { label: "Home", href: "/", icon: Home },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Progress", href: "/dashboard/progress", icon: "progress" },
    { label: "Review", href: "#review", icon: "review" },
    { label: "Quests", href: "/dashboard/quests", icon: Award },
    { label: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
    { label: "AI Assistant", href: "/assistant", icon: "panda" },
    { label: "Shop", href: "/shop", icon: ShoppingBag },
  ];

  return (
    <>
      <aside className="fixed top-0 left-0 h-screen z-50 flex-shrink-0">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
          <SidebarBody className="justify-between gap-6 h-screen overflow-y-auto">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Top Logo */}
            <Link href="/" className="flex items-center gap-3 px-2 py-2.5 mb-4 group">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -6, 6, 0] }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Activity className="w-5 h-5 text-white flex-shrink-0 group-hover:text-amber-400 transition-colors" />
              </motion.div>
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

                if (item.label === "Review") {
                  return (
                    <motion.button
                      key={item.label}
                      onClick={() => setShowReviewModal(true)}
                      className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/60 hover:bg-white/[0.06] hover:text-white w-full group/star cursor-pointer text-left"
                      whileHover="hover"
                      initial="rest"
                    >
                      <InstagramLikeStar />
                      <motion.span
                        animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="text-sm font-manrope font-semibold whitespace-pre"
                      >
                        Review
                      </motion.span>
                    </motion.button>
                  );
                }

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
                        <div className="w-5 h-5 flex-shrink-0 flex items-end gap-[2px]">
                          {[{ height: "40%" }, { height: "70%" }, { height: "55%" }, { height: "90%" }].map((bar, i) => (
                            <div key={i} className="flex-1 rounded-sm bg-current" style={{ height: bar.height }} />
                          ))}
                        </div>
                      ) : item.icon === "panda" ? (
                        <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                          <img src="/images/panda-ai.png" alt="Panda AI" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        // @ts-ignore
                        <item.icon className="w-5 h-5 flex-shrink-0" />
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
                "flex items-center gap-3 w-full px-2 py-2 rounded-2xl transition-all duration-200 border text-left cursor-pointer",
                showProfileMenu 
                  ? "bg-white/10 border-white/20 text-white shadow-lg" 
                  : "border-transparent text-white/70 hover:bg-white/[0.06] hover:text-white"
              )}
            >
              <div className="flex-shrink-0">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover border border-amber-400/60 shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-black bg-gradient-to-br from-amber-400 to-yellow-500 shadow-md flex-shrink-0">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
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
                    <span className="font-manrope font-extrabold text-xs text-white tracking-tight leading-none truncate max-w-[110px]">
                      {displayName}
                    </span>
                    <span className="font-mono font-medium text-[10px] text-white/40 tracking-wider mt-0.5 truncate max-w-[110px]">
                      {username}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* UNCLIPPED DARK FLOATING POPOVER MENU (Positioned FIXED outside sidebar bounds) */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="fixed bottom-16 left-3 w-60 bg-[#07080e] border border-white/20 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-[999999] text-left text-white flex flex-col space-y-1"
                >
                  {/* 1. Settings */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowSettingsModal(true);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/90"
                  >
                    <Settings className="w-4 h-4 text-white/70" />
                    <span>Settings</span>
                  </button>

                  {/* 2. My Profile */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setAccountModalDefaultTab("profile");
                      setShowAccountModal(true);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/90"
                  >
                    <User className="w-4 h-4 text-white/70" />
                    <span>My Profile</span>
                  </button>

                  <div className="h-px bg-white/10 my-0.5" />

                  {/* 3. My Inventory (White Package Icon) */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setAccountModalDefaultTab("inventory");
                      setShowAccountModal(true);
                    }}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/90"
                  >
                    <Package className="w-4 h-4 text-white/70" />
                    <span>My Inventory</span>
                  </button>

                  <div className="h-px bg-white/10 my-0.5" />

                  {/* 4. Terms of Service */}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/90"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-white/70" />
                      <span>Terms of Service</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/40" />
                  </a>

                  {/* 5. Privacy Policy */}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all cursor-pointer text-xs font-manrope font-semibold text-white/90"
                  >
                    <div className="flex items-center space-x-3">
                      <Lock className="w-4 h-4 text-white/70" />
                      <span>Privacy Policy</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-white/40" />
                  </a>

                  <div className="h-px bg-white/10 my-0.5" />

                  {/* 6. Log Out */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-all cursor-pointer text-xs font-manrope font-bold text-red-400"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Log Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SidebarBody>
      </Sidebar>
    </aside>

      <ReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} />
      <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      <AccountProfileModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)} 
        defaultTab={accountModalDefaultTab}
      />
    </>
  );
}
