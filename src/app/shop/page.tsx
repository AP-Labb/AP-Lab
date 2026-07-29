"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Sparkles, Trophy, LogOut, Home, LayoutDashboard, BarChart2, Star, Award, 
  CheckCircle2, RotateCw, Crown, Palette, Dices, Activity, ArrowRight, Flame, Tag, Layers, Glasses, HardHat, Shield, X, PauseCircle, Wrench, RefreshCw, Zap, Stars
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { DashboardContextMenu } from "@/components/DashboardContextMenu";
import { HeaderUserCapsules } from "@/components/HeaderUserCapsules";
import { ReviewModal } from "@/components/ReviewModal";
import { InstagramLikeStar } from "@/components/InstagramLikeStar";
import { SettingsModal } from "@/components/SettingsModal";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

function SidebarSettingsButton({ open }: { open: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full"
        whileHover="hover"
        initial="rest"
      >
        <motion.div
          className="flex-shrink-0"
          variants={{
            rest: { rotate: 0 },
            hover: { rotate: 90 },
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Settings className="w-5 h-5" />
        </motion.div>
        <motion.span
          animate={{ display: open ? "inline-block" : "none", opacity: open ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-sm font-manrope font-semibold whitespace-pre"
        >
          Settings
        </motion.span>
      </motion.button>
      {isOpen && <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}

// Custom Premium Shop Items
const GEAR_ITEMS = [
  // Streak Powerups as Functional Store Items
  { 
    id: "streak-freeze", 
    name: "Streak Freeze", 
    desc: "Pause your study streak for up to 30 days without losing progress", 
    cost: 50, 
    bgColor: "bg-neutral-900 border-neutral-800",
    innerBg: "bg-gradient-to-br from-rose-500/20 to-pink-500/20 border-rose-400/40",
    type: "powerup",
    renderAccessory: () => (
      <div className="relative w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
        <PauseCircle className="w-12 h-12 drop-shadow-md" />
      </div>
    )
  },
  { 
    id: "streak-repair", 
    name: "Streak Repair", 
    desc: "Instantly repair and restore a missed study streak day", 
    cost: 100, 
    bgColor: "bg-neutral-900 border-neutral-800",
    innerBg: "bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-400/40",
    type: "powerup",
    renderAccessory: () => (
      <div className="relative w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
        <Wrench className="w-11 h-11 drop-shadow-md" />
      </div>
    )
  },
  { 
    id: "streak-revive", 
    name: "Streak Revive", 
    desc: "Complete phoenix revival for broken study streaks", 
    cost: 150, 
    bgColor: "bg-neutral-900 border-neutral-800",
    innerBg: "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-400/40",
    type: "powerup",
    renderAccessory: () => (
      <div className="relative w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]">
        <Flame className="w-12 h-12 fill-orange-400 drop-shadow-md" />
      </div>
    )
  },

  // Avatar Wearables
  { 
    id: "gear-sunglasses", 
    name: "Sunglasses", 
    desc: "Glasses for the sun", 
    cost: 35, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-emerald-400/40",
    type: "sunglasses",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-neutral-900 border-2 border-emerald-400 overflow-hidden">
        {userPhoto ? (
          <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-cyan-500/20 flex items-center justify-center font-bold text-xl text-white">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-14 flex items-center justify-between z-10 pointer-events-none drop-shadow-md">
          <div className="w-6 h-4 bg-black rounded-md border border-neutral-700" />
          <div className="w-2 h-0.5 bg-black" />
          <div className="w-6 h-4 bg-black rounded-md border border-neutral-700" />
        </div>
      </div>
    )
  },
  { 
    id: "gear-helmet", 
    name: "Football Helmet", 
    desc: "Protective sports helmet for your avatar", 
    cost: 100, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-red-500/20 to-rose-500/20 border-red-400/40",
    type: "helmet",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-neutral-900 border-2 border-red-500">
        {userPhoto ? (
          <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-red-500/20 flex items-center justify-center font-bold text-xl text-white">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-22 h-16 bg-gradient-to-b from-red-500 to-red-700 rounded-t-full border-2 border-red-900 z-10 pointer-events-none flex flex-col items-center justify-between p-1 drop-shadow-lg overflow-hidden">
          <div className="w-18 h-1 bg-white rounded-full mt-1 opacity-90 shadow-sm" />
          <div className="w-20 h-5 bg-neutral-950/90 rounded-b-lg border-t-2 border-red-900 flex justify-around items-center px-1">
            <div className="w-1 h-3 bg-neutral-300" />
            <div className="w-1 h-3 bg-neutral-300" />
            <div className="w-1 h-3 bg-neutral-300" />
          </div>
        </div>
      </div>
    )
  },
  { 
    id: "gear-party-hat", 
    name: "Party Hat", 
    desc: "Festive party cone hat with pom pom", 
    cost: 50, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-400/40",
    type: "hat",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-neutral-900 border-2 border-amber-400">
        {userPhoto ? (
          <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-xl text-white">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-10 pointer-events-none drop-shadow-md flex flex-col items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-md" />
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[38px] border-b-amber-400" />
        </div>
      </div>
    )
  },
  { 
    id: "gear-crown", 
    name: "Golden Crown", 
    desc: "Royal 24k gold scholar crown", 
    cost: 150, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-400/40",
    type: "crown",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-neutral-900 border-2 border-yellow-400">
        {userPhoto ? (
          <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-yellow-500/20 flex items-center justify-center font-bold text-xl text-white">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-7 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 border-2 border-yellow-600 rounded-t-md z-10 pointer-events-none drop-shadow-lg flex justify-between items-end px-1">
          <div className="w-3 h-3 rounded-full bg-rose-500 border border-yellow-700 -mt-2" />
          <div className="w-3 h-3 rounded-full bg-cyan-400 border border-yellow-700 -mt-3" />
          <div className="w-3 h-3 rounded-full bg-emerald-400 border border-yellow-700 -mt-2" />
        </div>
      </div>
    )
  },

  // Premium Animated Auras & Effects
  { 
    id: "frame-gold", 
    name: "Imperial Gold Aura", 
    desc: "Golden glowing aura ring around your avatar", 
    cost: 150, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-400/40",
    type: "frame",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 blur-md opacity-90 animate-pulse" />
        <div className="absolute -inset-1.5 rounded-full border-4 border-amber-400 z-10 shadow-[0_0_15px_rgba(245,158,11,0.9)]" />
        {userPhoto ? (
          <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover rounded-full relative z-20" />
        ) : (
          <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center font-bold text-xl text-white relative z-20">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    )
  },
  { 
    id: "frame-neon-cyan", 
    name: "Cyber Cyan Aura", 
    desc: "High-tech energetic neon cyan glow ring", 
    cost: 250, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border-cyan-400/40",
    type: "frame",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500 blur-md opacity-90 animate-pulse" />
        <div className="absolute -inset-1.5 rounded-full border-4 border-cyan-400 z-10 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
        {userPhoto ? (
          <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover rounded-full relative z-20" />
        ) : (
          <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center font-bold text-xl text-white relative z-20">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    )
  },
  { 
    id: "frame-cosmic-purple", 
    name: "Cosmic Nebula Aura", 
    desc: "Spinning deep space purple particle glow aura", 
    cost: 350, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-400/40",
    type: "frame",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute -inset-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-md opacity-90" />
        <div className="absolute -inset-1.5 rounded-full border-4 border-purple-400 z-10 shadow-[0_0_20px_rgba(168,85,247,0.9)]" />
        {userPhoto ? (
          <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover rounded-full relative z-20" />
        ) : (
          <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center font-bold text-xl text-white relative z-20">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    )
  },

  // Animated Text Gradients
  { 
    id: "grad-fire", 
    name: "Phoenix Fire Gradient", 
    desc: "Fiery red & orange leaderboard name glow", 
    cost: 100, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-400/40",
    type: "gradient",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <span className="font-manrope font-extrabold text-xl bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(249,115,22,0.6)] text-center animate-pulse">
          {userName || "Scholar"}
        </span>
      </div>
    )
  },
  { 
    id: "grad-holographic", 
    name: "Holographic Gradient", 
    desc: "Multi-chromatic rainbow holographic text", 
    cost: 500, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/40",
    type: "gradient",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <span className="font-manrope font-extrabold text-xl bg-gradient-to-r from-indigo-400 via-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(192,132,252,0.6)] text-center">
          {userName || "Scholar"}
        </span>
      </div>
    )
  },
];

// Slot Machine Symbols
const SLOT_SYMBOLS = [
  { symbol: "🎰", name: "Lucky 7", multiplier: 10, color: "text-amber-400" },
  { symbol: "💎", name: "Diamond Gem", multiplier: 7, color: "text-cyan-400" },
  { symbol: "👑", name: "Golden Crown", multiplier: 5, color: "text-yellow-400" },
  { symbol: "⚡", name: "Lightning Bolt", multiplier: 3, color: "text-purple-400" },
  { symbol: "🍒", name: "Cherry Pair", multiplier: 2, color: "text-rose-400" },
];

export default function ShopPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { progress, spendCredits, addCredits, buyItem, equipItem } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showHowToEarnModal, setShowHowToEarnModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [powerupStatusMsg, setPowerupStatusMsg] = useState<string | null>(null);

  // Slot Machine State with Mechanical Lever Animation
  const [betAmount, setBetAmount] = useState<number>(10);
  const [spinning, setSpinning] = useState(false);
  const [handlePulled, setHandlePulled] = useState(false);
  const [reels, setReels] = useState([SLOT_SYMBOLS[0], SLOT_SYMBOLS[1], SLOT_SYMBOLS[2]]);
  const [gambleResult, setGambleResult] = useState<{ message: string; won: boolean; amount: number } | null>(null);

  const credits = progress?.credits || 0;
  const level = progress?.level || 1;
  const xp = progress?.xp || 0;
  const inventory = progress?.inventory || [];
  const activeFrame = progress?.activeAvatarFrame || "";
  const activeGrad = progress?.activeNameGradient || "";
  const userName = progress?.displayName || currentUser?.displayName || "Scholar";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  // Functional Store Item Trigger (Handles powerups, wearables & gradients)
  const handleItemClick = async (item: typeof GEAR_ITEMS[0], isOwned: boolean, isEquipped: boolean) => {
    if (item.type === "powerup") {
      const success = await spendCredits?.(item.cost);
      if (!success) {
        alert("Not enough coins!");
        return;
      }
      if (item.id === "streak-freeze") {
        setPowerupStatusMsg("Streak Freeze Activated! Your study streak is paused & protected for 30 days.");
      } else if (item.id === "streak-repair") {
        setPowerupStatusMsg("Streak Repaired! Your missed study streak day has been restored!");
      } else if (item.id === "streak-revive") {
        setPowerupStatusMsg("Streak Revived! Phoenix power has completely restored your study streak!");
      }
      setTimeout(() => setPowerupStatusMsg(null), 4500);
      return;
    }

    if (isOwned) {
      equipItem?.(item.type, isEquipped ? "" : item.id);
    } else {
      const success = await buyItem?.(item.id, item.cost, item.type);
      if (!success) alert("Not enough coins!");
    }
  };

  // Slot Machine Handle Pull & Spin
  const handleSpinSlots = async () => {
    if (betAmount <= 0 || betAmount > credits || spinning) return;
    
    // Animate handle pull down
    setHandlePulled(true);
    setTimeout(() => setHandlePulled(false), 450);

    const success = await spendCredits?.(betAmount);
    if (!success) return;

    setSpinning(true);
    setGambleResult(null);

    let spinCount = 0;
    const interval = setInterval(() => {
      spinCount++;
      setReels([
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
      ]);

      if (spinCount >= 22) {
        clearInterval(interval);
        
        const finalReels = [
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        ];

        setReels(finalReels);
        setSpinning(false);

        if (finalReels[0].name === finalReels[1].name && finalReels[1].name === finalReels[2].name) {
          const winnings = Math.round(betAmount * finalReels[0].multiplier);
          addCredits?.(winnings, `JACKPOT! 3x ${finalReels[0].name}!`);
          setGambleResult({ message: `JACKPOT! Matched 3x ${finalReels[0].symbol} ${finalReels[0].name}! Won ${winnings} Coins!`, won: true, amount: winnings });
        } else if (finalReels[0].name === finalReels[1].name || finalReels[1].name === finalReels[2].name || finalReels[0].name === finalReels[2].name) {
          const winnings = Math.round(betAmount * 1.5);
          addCredits?.(winnings, "Double Match!");
          setGambleResult({ message: `Matched 2 symbols! Won ${winnings} Coins!`, won: true, amount: winnings });
        } else {
          setGambleResult({ message: `No match! Lost ${betAmount} Coins. Spin again!`, won: false, amount: 0 });
        }
      }
    }, 80);
  };

  return (
    <div className="min-h-screen flex flex-row relative z-0 overflow-x-hidden bg-[#0a0b10] text-white selection:bg-amber-400 selection:text-black font-manrope">
      
      {/* STICKY Left Sidebar Navigation */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-6 sticky top-0 h-screen overflow-y-auto">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
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

            <div className="h-px bg-white/[0.06] mb-4 mx-2" />

            <div className="flex flex-col gap-1">
              <motion.div whileHover="hover" initial="rest">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
                  <motion.div className="flex-shrink-0">
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

              <motion.div whileHover="hover" initial="rest">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
                  <motion.div className="flex-shrink-0">
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

              <motion.div whileHover="hover" initial="rest">
                <Link
                  href="/dashboard/progress"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
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

              <motion.button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full group/star"
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

              <Link href="/assistant" className="w-full">
                <motion.div className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full">
                  <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                    <img src="/images/panda-ai.png" alt="Panda AI" className="w-full h-full object-contain" />
                  </div>
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-semibold whitespace-pre"
                  >
                    AI Assistant
                  </motion.span>
                </motion.div>
              </Link>

              <Link href="/shop" className="w-full">
                <motion.div className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 bg-white/10 text-amber-400 font-bold border border-amber-400/20 w-full">
                  <ShoppingBag className="w-5 h-5 shrink-0 text-amber-400" />
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-bold whitespace-pre text-amber-400"
                  >
                    Shop
                  </motion.span>
                </motion.div>
              </Link>

              <SidebarSettingsButton open={sidebarOpen} />
            </div>
          </div>

          {/* Bottom: Profile Widget + Sign Out */}
          <div className="flex flex-col gap-2 pb-6 w-full">
            <div className="h-px bg-white/[0.06] mx-2 mb-2" />

            <button
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-xl transition-all duration-200 text-white/60 hover:bg-white/[0.05] hover:text-white"
            >
              <div className="flex-shrink-0">
                {progress?.photoURL || currentUser?.photoURL ? (
                  <img
                    src={progress?.photoURL || currentUser?.photoURL || ""}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full object-cover border border-white/20 flex-shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-black bg-gradient-to-br from-cyan-400 to-white flex-shrink-0">
                    {(userName).charAt(0).toUpperCase()}
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
                    className="flex flex-col items-start text-left overflow-hidden"
                  >
                    <span className="font-manrope font-extrabold text-xs text-white tracking-tight leading-none truncate max-w-[120px]">
                      {userName}
                    </span>
                    <span className="font-mono font-bold text-[9px] text-white/40 tracking-wider mt-0.5 whitespace-nowrap">
                      Lvl {level} • {xp.toLocaleString()} XP
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <motion.button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-2 py-2.5 rounded-xl transition-all duration-200 text-white/30 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="w-5 h-5 shrink-0" />
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

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto md:pl-16">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#0a0b10]/90 border-b border-white/[0.08] px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-instrument text-2xl font-bold tracking-tight text-white">Store</h1>
              <p className="text-xs text-white/40 font-manrope">Redeem coins for exclusive gear, power ups & cosmetics</p>
            </div>
          </div>

          {/* Top Right Header Capsules */}
          <HeaderUserCapsules onOpenProfile={() => setShowProfileModal(true)} />
        </header>

        {/* Shop Main Content Area */}
        <main className="max-w-6xl mx-auto w-full px-6 sm:px-10 py-8 space-y-10 flex-1 text-left">
          
          {/* Top Banner using SHOPbanner.png with text positioned slightly right into clear space */}
          <div 
            className="relative w-full rounded-3xl bg-cover bg-center p-8 sm:p-12 text-neutral-950 overflow-hidden shadow-2xl flex flex-col justify-center min-h-[240px]"
            style={{ backgroundImage: `url('/images/SHOPbanner.png')` }}
          >
            <div className="relative z-10 max-w-sm sm:max-w-md mr-auto space-y-3.5 text-left pl-16 sm:pl-28">
              <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                Redeem coins for exclusive gear
              </h2>
              <p className="text-sm font-semibold text-neutral-800 font-manrope">
                Get power ups, avatars, and customization hats & glasses.
              </p>
              <div className="pt-1">
                <button 
                  onClick={() => setShowHowToEarnModal(true)}
                  className="px-7 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-manrope font-bold text-xs transition-all cursor-pointer shadow-xl"
                >
                  How to earn
                </button>
              </div>
            </div>
          </div>

          {/* Powerup status message */}
          {powerupStatusMsg && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-manrope text-center">
              {powerupStatusMsg}
            </motion.div>
          )}

          {/* Store Items Grid with Dark Card Outer Frame & Light Inner Preview Rectangle */}
          <section className="space-y-6 pt-4">
            <h3 className="font-manrope text-xl font-bold text-white">Store Items</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {GEAR_ITEMS.map((item) => {
                const isOwned = inventory.includes(item.id);
                const isEquipped = activeFrame === item.id || activeGrad === item.id;

                return (
                  <div 
                    key={item.id}
                    className="relative rounded-3xl bg-[#12141e] border border-white/10 p-6 flex flex-col justify-between space-y-5 transition-all group shadow-xl hover:border-white/20"
                  >
                    {/* Visual Card Display Box (Light Inner Pastel Rectangle) */}
                    <div className={cn("w-full h-36 rounded-2xl border flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform p-3", item.innerBg)}>
                      {item.renderAccessory(currentUser?.photoURL || undefined, userName)}
                    </div>

                    {/* Title & Simple Description */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-sm text-white font-manrope">{item.name}</h4>
                        <span className="text-[10px] font-mono font-bold text-white/40">{item.type === "powerup" ? "Unlimited" : isOwned ? "1/1" : "0/1"}</span>
                      </div>
                      <p className="text-xs text-white/50 font-medium mt-1">{item.desc}</p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-white/10">
                      {isOwned && item.type !== "powerup" ? (
                        <button
                          onClick={() => equipItem?.(item.type, isEquipped ? "" : item.id)}
                          className={cn(
                            "w-full py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer shadow-md",
                            isEquipped 
                              ? "bg-amber-400 text-black font-extrabold" 
                              : "bg-white/10 hover:bg-white/20 text-white"
                          )}
                        >
                          {isEquipped ? "Equipped ✓" : "Equip Item"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleItemClick(item, isOwned, isEquipped)}
                          disabled={credits < item.cost}
                          className={cn(
                            "w-full py-2.5 rounded-full font-bold text-xs transition-all flex items-center justify-center space-x-2.5 cursor-pointer shadow-md",
                            credits >= item.cost 
                              ? "bg-amber-400 hover:bg-amber-300 text-black font-extrabold" 
                              : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                          )}
                        >
                          <div className="w-7 h-7 flex items-center justify-center shrink-0">
                            <img src="/images/coin-zoomed.png" alt="Coin" className="w-full h-full object-contain transform scale-150 drop-shadow-md" />
                          </div>
                          <span className="text-base font-extrabold font-mono">{item.cost}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* REALISTIC CASINO SLOT MACHINE UI WITH SHINY CHROME FRAME & PULL LEVER */}
            <div className="pt-10">
              <div className="bg-gradient-to-b from-[#1c1d2e] via-[#121320] to-[#0a0b12] border-4 border-amber-500/50 rounded-[42px] p-8 sm:p-12 shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col items-center space-y-8 text-center max-w-2xl mx-auto relative">
                
                {/* Top Casino Marquee Box */}
                <div className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 p-1 rounded-2xl shadow-xl">
                  <div className="bg-[#0e0f18] py-3 px-6 rounded-xl border border-amber-400/40">
                    <h3 className="font-instrument text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-wider uppercase drop-shadow-md">
                      🎰 VEGAS SLOTS 🎰
                    </h3>
                    <p className="text-[11px] font-mono font-bold text-amber-200/70 tracking-widest uppercase mt-0.5">
                      PULL LEVER TO SPIN & WIN COINS
                    </p>
                  </div>
                </div>

                {/* Slot Machine Main Body with Pull Lever on the Right */}
                <div className="w-full flex items-center justify-center space-x-6 relative py-4">
                  
                  {/* Chrome Reels Display Housing */}
                  <div className="flex-1 bg-[#05060b] border-4 border-[#333852] rounded-3xl p-6 flex items-center justify-between shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] relative overflow-hidden">
                    <div className="absolute inset-0 rounded-2xl border-2 border-amber-400/30 pointer-events-none z-20" />
                    {reels.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        animate={spinning ? { y: [-12, 12, -12] } : { y: 0 }}
                        transition={{ repeat: Infinity, duration: 0.08 }}
                        className="w-24 sm:w-28 h-36 rounded-2xl bg-gradient-to-b from-[#181926] via-[#10111c] to-[#0c0d17] border-2 border-amber-500/30 flex flex-col items-center justify-center shadow-2xl select-none space-y-2 relative z-10"
                      >
                        <span className="text-4xl sm:text-5xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">{item.symbol}</span>
                        <span className={cn("text-[10px] font-extrabold font-mono uppercase tracking-wider", item.color)}>
                          {item.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mechanical Pull Lever Handle */}
                  <div 
                    onClick={handleSpinSlots}
                    className="flex flex-col items-center cursor-pointer group select-none"
                    title="Pull Lever to Spin!"
                  >
                    {/* Red Sphere Ball Knob */}
                    <motion.div 
                      animate={handlePulled ? { y: 55 } : { y: 0 }}
                      transition={{ type: "spring", stiffness: 350, damping: 15 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 border-2 border-red-900 shadow-[0_0_15px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform flex items-center justify-center z-30"
                    >
                      <div className="w-3 h-3 rounded-full bg-white/50" />
                    </motion.div>

                    {/* Chrome Rod Shaft */}
                    <motion.div 
                      animate={handlePulled ? { height: 18 } : { height: 70 }}
                      transition={{ type: "spring", stiffness: 350, damping: 15 }}
                      className="w-4 bg-gradient-to-b from-neutral-300 via-neutral-100 to-neutral-400 rounded-full border border-neutral-600 shadow-inner z-20"
                    />

                    {/* Lever Socket Mount */}
                    <div className="w-12 h-12 rounded-2xl bg-neutral-900 border-2 border-amber-500/60 flex items-center justify-center shadow-2xl z-10">
                      <div className="w-5 h-5 rounded-full bg-neutral-950 border border-neutral-700 shadow-inner" />
                    </div>
                  </div>
                </div>

                {/* Result Notification */}
                {gambleResult && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "w-full p-4 rounded-2xl text-center text-xs font-bold font-manrope border shadow-2xl",
                      gambleResult.won 
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300" 
                        : "bg-red-500/10 border-red-500/40 text-red-300"
                    )}
                  >
                    {gambleResult.message}
                  </motion.div>
                )}

                {/* Bet Selector */}
                <div className="w-full flex items-center justify-between bg-white/[0.03] border border-white/10 p-3.5 rounded-2xl">
                  <span className="text-xs font-mono text-white/60 font-bold tracking-wider">BET COINS</span>
                  <div className="flex items-center space-x-2">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setBetAmount(amt)}
                        className={cn(
                          "px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer",
                          betAmount === amt 
                            ? "bg-amber-400 text-black shadow-md font-extrabold" 
                            : "bg-white/5 hover:bg-white/10 text-white/60"
                        )}
                      >
                        {amt} C
                      </button>
                    ))}
                  </div>
                </div>

                {/* Spin Button */}
                <button
                  onClick={handleSpinSlots}
                  disabled={spinning || betAmount > credits || betAmount <= 0}
                  className={cn(
                    "w-full py-4 rounded-2xl font-manrope font-extrabold text-sm tracking-wider uppercase transition-all flex items-center justify-center space-x-2.5 cursor-pointer shadow-xl",
                    spinning || betAmount > credits 
                      ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5" 
                      : "bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black"
                  )}
                >
                  <RotateCw className={`w-4 h-4 ${spinning ? "animate-spin" : ""}`} />
                  <span>{spinning ? "Spinning..." : `PULL LEVER TO SPIN (${betAmount} COINS)`}</span>
                </button>

                {/* Multiplier Table */}
                <div className="w-full pt-4 border-t border-white/10 flex justify-around text-xs font-mono font-bold text-amber-300/80">
                  <span>🎰🎰🎰 10x</span>
                  <span>💎💎💎 7x</span>
                  <span>👑👑👑 5x</span>
                  <span>⚡⚡⚡ 3x</span>
                </div>
              </div>
            </div>

          </section>

        </main>
      </div>

      {/* HOW TO EARN COINS MODAL */}
      <AnimatePresence>
        {showHowToEarnModal && (
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#7a5833] via-[#3a2818] to-[#1e140d] border border-amber-500/40 rounded-[36px] p-8 sm:p-10 shadow-2xl text-center text-white"
            >
              <button
                onClick={() => setShowHowToEarnModal(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-28 h-28 mx-auto mb-6">
                <img src="/images/coin-zoomed.png" alt="Coin" className="w-full h-full object-contain" />
              </div>

              <h3 className="font-manrope font-extrabold text-2xl sm:text-3xl text-white mb-2">
                Actions that earn coins
              </h3>
              <p className="text-xs text-amber-200/80 font-manrope mb-8">
                Collect coins and redeem them for cool in-game items.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-manrope font-bold text-sm text-white max-w-md mx-auto">
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs shrink-0">✓</div>
                  <span>Refer friends</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs shrink-0">✓</div>
                  <span>Reach a streak milestone</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs shrink-0">✓</div>
                  <span>Level up</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-3 rounded-2xl">
                  <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs shrink-0">✓</div>
                  <span>Complete badges</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DashboardContextMenu onOpenProfile={() => setShowProfileModal(true)} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </div>
  );
}
