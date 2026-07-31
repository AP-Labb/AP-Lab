"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Sparkles, Trophy, LogOut, Home, LayoutDashboard, BarChart2, Star, Award, 
  CheckCircle2, RotateCw, Crown, Palette, Dices, Activity, ArrowRight, Flame, Tag, Layers, Glasses, HardHat, Shield, X, PauseCircle, Wrench, RefreshCw, Zap, Stars, Package
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { DashboardContextMenu } from "@/components/DashboardContextMenu";
import { HeaderUserCapsules } from "@/components/HeaderUserCapsules";
import { ReviewModal } from "@/components/ReviewModal";
import { AccountProfileModal } from "@/components/AccountProfileModal";
import { InstagramLikeStar } from "@/components/InstagramLikeStar";
import { SettingsModal } from "@/components/SettingsModal";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AppSidebar } from "@/components/AppSidebar";
import { MinecraftInventoryModal } from "@/components/MinecraftInventoryModal";

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

// Custom Premium Shop Items (Boosters, Transparent PNG Gear & Custom Name Color)
const GEAR_ITEMS = [
  // 10-Hour Boost Powerups
  { 
    id: "boost-2x-xp", 
    name: "10-Hour 2x XP Boost", 
    desc: "Earn 2x Double XP on all study activities, quizzes, and completed topics for 10 hours", 
    cost: 150, 
    bgColor: "bg-neutral-900 border-neutral-800",
    innerBg: "bg-[#0b0c16] border-white/10 flex items-center justify-center",
    type: "boost",
    renderAccessory: () => (
      <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
        <img src="/images/2x-xp-boost.png" alt="2X XP Boost" className="w-full h-full object-contain select-none" />
      </div>
    )
  },
  { 
    id: "boost-2x-coin", 
    name: "10-Hour 2x Coin Boost", 
    desc: "Earn 2x Double Coins on daily quests, study duration, and correct answers for 10 hours", 
    cost: 150, 
    bgColor: "bg-neutral-900 border-neutral-800",
    innerBg: "bg-[#0b0c16] border-white/10 flex items-center justify-center",
    type: "boost",
    renderAccessory: () => (
      <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
        <img src="/images/2x-coin-boost.png" alt="2X Coin Boost" className="w-full h-full object-contain select-none" />
      </div>
    )
  },

  // Avatar Gear Wearables (Using Uploaded Transparent PNGs)
  { 
    id: "gear-top-hat", 
    name: "Top Hat", 
    desc: "Classic black magician top hat", 
    cost: 50, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-400/40",
    type: "hat",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-neutral-900 border-2 border-purple-500">
        {userPhoto ? (
          <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-purple-500/20 flex items-center justify-center font-bold text-xl text-white">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
        )}
        <img src="/images/avatar-gear/top-hat.png" alt="Top Hat" className="absolute -top-[52%] left-1/2 -translate-x-1/2 w-[115%] h-[95%] object-contain z-10 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]" />
      </div>
    )
  },
  { 
    id: "gear-purple-beanie", 
    name: "Purple Beanie", 
    desc: "Cozy purple winter beanie with pom pom", 
    cost: 45, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-400/40",
    type: "hat",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg bg-neutral-900 border-2 border-violet-400">
        {userPhoto ? (
          <img src={userPhoto} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full rounded-full bg-violet-500/20 flex items-center justify-center font-bold text-xl text-white">
            {(userName || "A").charAt(0).toUpperCase()}
          </div>
        )}
        <img src="/images/avatar-gear/purple-beanie.png" alt="Purple Beanie" className="absolute -top-[42%] left-1/2 -translate-x-1/2 w-[110%] h-[90%] object-contain z-10 pointer-events-none drop-shadow-md" />
      </div>
    )
  },
  { 
    id: "gear-face-mask", 
    name: "Face Mask", 
    desc: "Protective blue surgical face mask", 
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
  const { progress, spendCredits, addCredits, buyItem, equipItem, useBoostItem } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showHowToEarnModal, setShowHowToEarnModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedStoreItem, setSelectedStoreItem] = useState<typeof GEAR_ITEMS[0] | null>(null);
  const [powerupStatusMsg, setPowerupStatusMsg] = useState<string | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [customColorHex, setCustomColorHex] = useState("#ec4899");

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

  // Functional Store Item Trigger (Handles boosts, wearables, color pickers & gradients)
  const handleItemClick = async (item: typeof GEAR_ITEMS[0], isOwned: boolean, isEquipped: boolean) => {
    if (item.type === "boost") {
      const success = await buyItem?.(item.id, item.cost, item.type);
      if (!success) {
        alert("Not enough coins!");
        return;
      }
      setPowerupStatusMsg(`${item.name} purchased! Open your Inventory to activate it anytime.`);
      setTimeout(() => setPowerupStatusMsg(null), 4500);
      return;
    }

    if (item.type === "color-picker") {
      // Color picker handled via modal
      return;
    }

    if (isOwned) {
      equipItem?.(item.type, isEquipped ? "" : item.id);
    } else {
      const success = await buyItem?.(item.id, item.cost, item.type);
      if (!success) alert("Not enough coins!");
    }
  };

  return (
    <div className="min-h-screen flex flex-row relative z-0 overflow-x-hidden bg-[#0a0b10] text-white selection:bg-amber-400 selection:text-black font-manrope">
      
      {/* Unified App Sidebar with Sticky Navigation & Profile Popover */}
      <AppSidebar currentPath="/shop" />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-16">
        
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
          
          {/* Top Banner using SHOPbanner.png with text spread out horizontally to the right */}
          <div 
            className="relative w-full rounded-3xl bg-cover bg-center p-8 sm:p-12 text-neutral-950 overflow-hidden shadow-2xl flex flex-col justify-center min-h-[260px]"
            style={{ backgroundImage: `url('/images/SHOPbanner.png')` }}
          >
            <div className="relative z-10 max-w-xl sm:max-w-2xl mr-auto space-y-4 text-left pl-32 sm:pl-56 md:pl-64">
              <h2 className="font-manrope text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                Redeem coins for exclusive gear
              </h2>
              <p className="text-base font-bold text-neutral-800 font-manrope tracking-wide">
                Get power ups, avatars, and customization hats & gear.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => setShowInventoryModal(true)}
                  className="px-8 py-3.5 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-manrope font-extrabold text-xs transition-all cursor-pointer shadow-xl flex items-center space-x-2.5"
                >
                  <Package className="w-4.5 h-4.5 text-white" />
                  <span className="text-white">My Inventory</span>
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
                      <button
                        onClick={() => setSelectedStoreItem(item)}
                        className={cn(
                          "w-full py-2.5 rounded-full font-bold text-xs transition-all flex items-center justify-center space-x-2.5 cursor-pointer shadow-md",
                          isOwned 
                            ? "bg-amber-400 hover:bg-amber-300 text-black font-extrabold" 
                            : "bg-white/10 hover:bg-white/20 text-white"
                        )}
                      >
                        {isOwned ? (
                          <span>Owned ✓</span>
                        ) : (
                          <>
                            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                              <img src="/images/coin-zoomed.png" alt="Coin" className="w-full h-full object-contain transform scale-125" />
                            </div>
                            <span className="text-sm font-extrabold font-mono">{item.cost}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>

      {/* ITEM CONFIRMATION & PURCHASE MODAL */}
      <AnimatePresence>
        {selectedStoreItem && (
          <div 
            className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setSelectedStoreItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#141622] border border-white/15 rounded-[36px] overflow-hidden shadow-2xl flex flex-col md:flex-row text-white"
            >
              <button
                onClick={() => setSelectedStoreItem(null)}
                className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left Side Visual Box */}
              <div className="w-full md:w-1/2 bg-[#0c0d16] p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 relative min-h-[220px]">
                {selectedStoreItem.type === "color-picker" ? (
                  <div className="flex flex-col items-center justify-center space-y-3 text-center">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Live Name Preview</span>
                    <span className="font-manrope font-extrabold text-2xl tracking-tight transition-all drop-shadow-md" style={{ color: customColorHex }}>
                      {userName}
                    </span>
                    <span className="text-[10px] font-mono text-white/30">{customColorHex.toUpperCase()}</span>
                  </div>
                ) : (
                  selectedStoreItem.renderAccessory(currentUser?.photoURL || undefined, userName)
                )}
              </div>

              {/* Right Side Item Info & Purchase Confirm Button */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between text-left space-y-6">
                <div>
                  <div className="bg-white/10 text-white/70 font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full w-fit mb-3">
                    {selectedStoreItem.type === "color-picker" ? "Custom Color" : "0/1 Available"}
                  </div>
                  <h3 className="font-manrope font-extrabold text-2xl text-white tracking-tight">
                    {selectedStoreItem.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <img src="/images/coin-zoomed.png" alt="Coin" className="w-6 h-6 object-contain" />
                    <span className="font-manrope font-extrabold text-xl text-amber-400">{selectedStoreItem.cost}</span>
                  </div>
                  <p className="text-xs text-white/50 font-manrope mt-2 leading-relaxed">
                    {selectedStoreItem.desc}
                  </p>

                  {/* Interactive Swatch & Hex Picker when item is Custom Name Color */}
                  {selectedStoreItem.type === "color-picker" && (
                    <div className="mt-4 space-y-3 pt-3 border-t border-white/10">
                      <span className="text-[11px] font-mono font-bold text-white/60 block">Choose Display Color:</span>
                      <div className="flex flex-wrap gap-2">
                        {["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ffffff"].map((color) => (
                          <button
                            key={color}
                            onClick={() => setCustomColorHex(color)}
                            className={cn(
                              "w-7 h-7 rounded-full border-2 transition-transform cursor-pointer shadow-sm hover:scale-110",
                              customColorHex === color ? "border-white scale-110 ring-2 ring-white/40" : "border-transparent"
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <input 
                          type="color" 
                          value={customColorHex}
                          onChange={(e) => setCustomColorHex(e.target.value)}
                          className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                        />
                        <input 
                          type="text" 
                          value={customColorHex}
                          onChange={(e) => setCustomColorHex(e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-white font-bold w-28 uppercase"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={async () => {
                    if (selectedStoreItem.type === "color-picker") {
                      const success = await buyItem?.("custom-name-color", selectedStoreItem.cost, "color-picker", customColorHex);
                      if (!success) {
                        alert("Not enough coins!");
                      } else {
                        setPowerupStatusMsg(`Name color updated to ${customColorHex}!`);
                        setTimeout(() => setPowerupStatusMsg(null), 4500);
                      }
                      setSelectedStoreItem(null);
                      return;
                    }

                    const isOwned = inventory.includes(selectedStoreItem.id);
                    const isEquipped = activeFrame === selectedStoreItem.id || activeGrad === selectedStoreItem.id;
                    await handleItemClick(selectedStoreItem, isOwned, isEquipped);
                    setSelectedStoreItem(null);
                  }}
                  disabled={credits < selectedStoreItem.cost && !inventory.includes(selectedStoreItem.id) && selectedStoreItem.type !== "color-picker"}
                  className={cn(
                    "w-full py-3.5 rounded-2xl font-manrope font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xl flex items-center justify-center space-x-2 border-none",
                    selectedStoreItem.type === "color-picker"
                      ? (credits >= selectedStoreItem.cost ? "bg-fuchsia-500 hover:bg-fuchsia-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]" : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5")
                      : inventory.includes(selectedStoreItem.id)
                        ? "bg-amber-400 text-black hover:bg-amber-300"
                        : credits >= selectedStoreItem.cost 
                          ? "bg-emerald-500 hover:bg-emerald-400 text-black" 
                          : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                  )}
                >
                  <span>
                    {selectedStoreItem.type === "color-picker"
                      ? (credits >= selectedStoreItem.cost ? `Buy & Set Color (${selectedStoreItem.cost} Coins)` : "Not Enough Coins")
                      : inventory.includes(selectedStoreItem.id) ? "Equip Now" : credits >= selectedStoreItem.cost ? "Purchase" : "Not Enough Coins"}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      <MinecraftInventoryModal isOpen={showInventoryModal} onClose={() => setShowInventoryModal(false)} />
      <DashboardContextMenu onOpenProfile={() => setShowProfileModal(true)} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      <AccountProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </div>
  );
}
