"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Sparkles, Trophy, LogOut, Home, LayoutDashboard, BarChart2, Star, Award, 
  CheckCircle2, RotateCw, Crown, Palette, Dices, Activity, ArrowRight, Sparkle
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

// Cosmetic Items Data with Clean Styling
const AVATAR_FRAMES = [
  { id: "frame-gold", name: "Imperial Gold", cost: 150, color: "from-amber-400 to-yellow-600", desc: "Golden glowing aura ring around your avatar" },
  { id: "frame-neon-cyan", name: "Cyber Cyan", cost: 250, color: "from-cyan-400 to-blue-600", desc: "High-tech energetic neon glow ring" },
  { id: "frame-emerald", name: "Elite Emerald", cost: 350, color: "from-emerald-400 to-teal-600", desc: "Prestigious bio-luminescent emerald ring" },
  { id: "frame-cosmic-purple", name: "Cosmic Nebula", cost: 500, color: "from-purple-500 via-pink-500 to-amber-400", desc: "Mystical galaxy shimmer frame" },
];

const NAME_GRADIENTS = [
  { id: "grad-fire", name: "Phoenix Fire", cost: 100, style: "bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent font-extrabold", desc: "Fiery red & orange name glow effect" },
  { id: "grad-ocean", name: "Deep Ocean", cost: 200, style: "bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent font-extrabold", desc: "Deep aquatic gradient tone" },
  { id: "grad-gold", name: "Pure Gold", cost: 300, style: "bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 bg-clip-text text-transparent font-extrabold", desc: "Pure 24k polished gold sheen" },
  { id: "grad-holographic", name: "Holographic", cost: 500, style: "bg-gradient-to-r from-pink-500 via-purple-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent font-extrabold animate-pulse", desc: "Multi-chromatic rainbow holographic luster" },
];

// Unique Slot Machine Symbols
const SLOT_SYMBOLS = [
  { symbol: "🎰", name: "Lucky 7", multiplier: 10, color: "text-amber-400" },
  { symbol: "💎", name: "Diamond Gem", multiplier: 7, color: "text-cyan-400" },
  { symbol: "👑", name: "Golden Crown", multiplier: 5, color: "text-yellow-400" },
  { symbol: "⚡", name: "Lightning Bolt", multiplier: 3, color: "text-purple-400" },
  { symbol: "🍒", name: "Cherry Pair", multiplier: 2, color: "text-rose-400" },
];

export default function ShopPage() {
  const { currentUser } = useAuth();
  const { progress, spendCredits, addCredits, buyItem, equipItem } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"cosmetics" | "gamble">("cosmetics");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  
  // Slot Machine State
  const [betAmount, setBetAmount] = useState<number>(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState([SLOT_SYMBOLS[0], SLOT_SYMBOLS[1], SLOT_SYMBOLS[2]]);
  const [gambleResult, setGambleResult] = useState<{ message: string; won: boolean; amount: number } | null>(null);

  const credits = progress?.credits || 0;
  const inventory = progress?.inventory || [];
  const activeFrame = progress?.activeAvatarFrame || "";
  const activeGrad = progress?.activeNameGradient || "";

  // Slot Machine Spin Handler
  const handleSpinSlots = async () => {
    if (betAmount <= 0 || betAmount > credits || spinning) return;
    
    // Spend credits
    const success = await spendCredits?.(betAmount);
    if (!success) return;

    setSpinning(true);
    setGambleResult(null);

    // Spin animation loop
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
        
        // Final outcomes
        const finalReels = [
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        ];

        setReels(finalReels);
        setSpinning(false);

        // Check wins
        if (finalReels[0].name === finalReels[1].name && finalReels[1].name === finalReels[2].name) {
          // Jackpot 3 matching!
          const winnings = Math.round(betAmount * finalReels[0].multiplier);
          addCredits?.(winnings, `JACKPOT! 3x ${finalReels[0].name}!`);
          setGambleResult({ message: `JACKPOT! Matched 3x ${finalReels[0].symbol} ${finalReels[0].name}! Won ${winnings} Coins!`, won: true, amount: winnings });
        } else if (finalReels[0].name === finalReels[1].name || finalReels[1].name === finalReels[2].name || finalReels[0].name === finalReels[2].name) {
          // 2 matching
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
    <div className="min-h-screen flex flex-row relative z-0 overflow-x-hidden bg-[#07080e] text-white selection:bg-amber-400 selection:text-black font-manrope">
      
      {/* Sidebar Navigation */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-6 sticky top-0">
          {/* Top: Logo + Nav Links */}
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

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mb-4 mx-2" />

            {/* Nav Links */}
            <div className="flex flex-col gap-1">
              <motion.div whileHover="hover" initial="rest">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
                  <motion.div
                    className="flex-shrink-0"
                    variants={{
                      rest: { y: 0, scale: 1 },
                      hover: { y: -3, scale: 1.1 },
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
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
                  <motion.div
                    className="flex-shrink-0"
                    variants={{
                      rest: { scale: 1, rotate: 0 },
                      hover: { scale: 1.15, rotate: 8 },
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
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
                        variants={{
                          rest: { scaleY: 1, originY: 1 },
                          hover: { scaleY: [1, 1.5, 1.2, 1.35, 1], originY: 1 },
                        }}
                        transition={{ duration: 0.5, delay: bar.delay, ease: "easeInOut" }}
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

              {/* Review */}
              <motion.button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full group/star"
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

              {/* Quests */}
              <motion.button
                onClick={() => setShowQuestsModal(true)}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full"
                whileHover="hover"
                initial="rest"
              >
                <motion.div
                  className="flex-shrink-0"
                  variants={{
                    rest: { scale: 1, rotate: 0 },
                    hover: { scale: 1.18, rotate: -8 },
                  }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Award className="w-5 h-5" />
                </motion.div>
                <motion.span
                  animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-manrope font-semibold whitespace-pre"
                >
                  Quests
                </motion.span>
              </motion.button>

              {/* AI Assistant */}
              <Link href="/assistant" className="w-full">
                <motion.div
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full group cursor-pointer"
                  whileHover="hover"
                  initial="rest"
                >
                  <motion.div
                    className="w-5 h-5 shrink-0 flex items-center justify-center"
                    variants={{
                      rest: { scale: 1, rotate: 0, y: 0 },
                      hover: { scale: 1.25, rotate: [0, -10, 10, -5, 0], y: -1 },
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <img src="/images/panda-ai.png" alt="Panda AI" className="w-full h-full object-contain" />
                  </motion.div>
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-semibold whitespace-pre"
                  >
                    AI Assistant
                  </motion.span>
                </motion.div>
              </Link>

              {/* Shop (Active) */}
              <Link href="/shop" className="w-full">
                <motion.div
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 bg-white/10 text-white w-full group cursor-pointer"
                  whileHover="hover"
                  initial="rest"
                >
                  <motion.div
                    className="w-5 h-5 shrink-0 flex items-center justify-center text-amber-400"
                    variants={{
                      rest: { scale: 1, rotate: 0 },
                      hover: { scale: 1.2, rotate: 12 },
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ShoppingBag className="w-5 h-5" />
                  </motion.div>
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
        </SidebarBody>
      </Sidebar>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto md:pl-16">
        
        {/* Top Header Bar matching website navbar design */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#07080e]/90 border-b border-white/[0.08] px-8 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-instrument text-2xl font-bold tracking-tight text-white">Store</h1>
              <p className="text-xs text-white/40 font-manrope">Spend earned coins on cosmetics and mini-games</p>
            </div>
          </div>

          {/* Top Right Header Capsules */}
          <HeaderUserCapsules />
        </header>

        {/* Shop Main Content Area */}
        <main className="max-w-6xl mx-auto w-full px-8 py-10 space-y-10 flex-1 text-left">
          
          {/* Simplistic Tab Switcher matching sleek dark theme */}
          <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
            <button
              onClick={() => setActiveTab("cosmetics")}
              className={cn(
                "px-6 py-2.5 rounded-2xl font-manrope font-bold text-sm transition-all flex items-center space-x-2.5 cursor-pointer border",
                activeTab === "cosmetics"
                  ? "bg-white text-black border-white shadow-lg"
                  : "bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.08] hover:text-white"
              )}
            >
              <Palette className="w-4 h-4" />
              <span>Avatar & Name Items</span>
            </button>
            
            <button
              onClick={() => setActiveTab("gamble")}
              className={cn(
                "px-6 py-2.5 rounded-2xl font-manrope font-bold text-sm transition-all flex items-center space-x-2.5 cursor-pointer border",
                activeTab === "gamble"
                  ? "bg-purple-600 text-white border-purple-500 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
                  : "bg-white/[0.03] text-white/60 border-white/10 hover:bg-white/[0.08] hover:text-white"
              )}
            >
              <Dices className="w-4 h-4" />
              <span>Coin Slots</span>
            </button>
          </div>

          {/* TAB 1: COSMETICS SHOP */}
          {activeTab === "cosmetics" && (
            <div className="space-y-12">
              
              {/* Avatar Aura Frames Section */}
              <section className="space-y-5">
                <div className="flex items-center space-x-2 text-white/80">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <h2 className="font-manrope text-lg font-bold text-white">Avatar Glowing Frames</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {AVATAR_FRAMES.map((item) => {
                    const isOwned = inventory.includes(item.id);
                    const isEquipped = activeFrame === item.id;

                    return (
                      <div 
                        key={item.id}
                        className={cn(
                          "relative rounded-3xl bg-[#0e101a] border p-6 flex flex-col justify-between space-y-6 transition-all group",
                          isEquipped ? "border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.15)]" : "border-white/10 hover:border-white/20"
                        )}
                      >
                        {/* Preview Circle */}
                        <div className="flex flex-col items-center justify-center py-2 text-center">
                          <div className={`relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr ${item.color} shadow-[0_0_20px_rgba(255,255,255,0.15)]`}>
                            <div className="w-full h-full rounded-full bg-[#121422] border border-black/40 flex items-center justify-center font-bold text-white text-lg overflow-hidden">
                              {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                              ) : (
                                <span>{currentUser?.displayName?.charAt(0) || "AP"}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-bold text-white mt-4">{item.name}</span>
                          <span className="text-xs text-white/40 mt-1">{item.desc}</span>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4 border-t border-white/5">
                          {isOwned ? (
                            <button
                              onClick={() => equipItem?.("frame", isEquipped ? "" : item.id)}
                              className={cn(
                                "w-full py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer",
                                isEquipped 
                                  ? "bg-amber-400 text-black font-extrabold" 
                                  : "bg-white/10 hover:bg-white/20 text-white"
                              )}
                            >
                              {isEquipped ? "Equipped ✓" : "Equip Frame"}
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                const success = await buyItem?.(item.id, item.cost, "frame");
                                if (!success) alert("Not enough coins!");
                              }}
                              disabled={credits < item.cost}
                              className={cn(
                                "w-full py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer",
                                credits >= item.cost 
                                  ? "bg-amber-400 hover:bg-amber-300 text-black font-extrabold shadow-lg" 
                                  : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                              )}
                            >
                              <img src="/images/coin-exact.png" alt="Coin" className="w-5 h-5 object-contain inline" />
                              <span>{item.cost} Coins</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Leaderboard Name Gradients Section */}
              <section className="space-y-5">
                <div className="flex items-center space-x-2 text-white/80">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h2 className="font-manrope text-lg font-bold text-white">Name Gradients</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {NAME_GRADIENTS.map((item) => {
                    const isOwned = inventory.includes(item.id);
                    const isEquipped = activeGrad === item.id;

                    return (
                      <div 
                        key={item.id}
                        className={cn(
                          "relative rounded-3xl bg-[#0e101a] border p-6 flex flex-col justify-between space-y-6 transition-all group",
                          isEquipped ? "border-purple-500/80 shadow-[0_0_30px_rgba(168,85,247,0.15)]" : "border-white/10 hover:border-white/20"
                        )}
                      >
                        {/* Name Gradient Preview */}
                        <div className="flex flex-col items-center justify-center py-5 text-center">
                          <span className={`text-xl ${item.style}`}>
                            {currentUser?.displayName || "Scholar Name"}
                          </span>
                          <span className="text-xs text-white/40 mt-3">{item.desc}</span>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4 border-t border-white/5">
                          {isOwned ? (
                            <button
                              onClick={() => equipItem?.("gradient", isEquipped ? "" : item.id)}
                              className={cn(
                                "w-full py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer",
                                isEquipped 
                                  ? "bg-purple-600 text-white font-extrabold" 
                                  : "bg-white/10 hover:bg-white/20 text-white"
                              )}
                            >
                              {isEquipped ? "Equipped ✓" : "Equip Gradient"}
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                const success = await buyItem?.(item.id, item.cost, "gradient");
                                if (!success) alert("Not enough coins!");
                              }}
                              disabled={credits < item.cost}
                              className={cn(
                                "w-full py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer",
                                credits >= item.cost 
                                  ? "bg-purple-600 hover:bg-purple-500 text-white font-extrabold shadow-lg" 
                                  : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                              )}
                            >
                              <img src="/images/coin-exact.png" alt="Coin" className="w-5 h-5 object-contain inline" />
                              <span>{item.cost} Coins</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>
          )}

          {/* TAB 2: COIN SLOTS */}
          {activeTab === "gamble" && (
            <div className="max-w-xl mx-auto py-4">
              <div className="bg-[#0e101a] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center space-y-7 text-center">
                
                {/* Header */}
                <div className="space-y-1">
                  <h2 className="font-instrument text-3xl font-bold text-white">Coin Slot Machine</h2>
                  <p className="text-xs text-white/40">Spin to match symbols and multiply your coins!</p>
                </div>

                {/* Reels Container */}
                <div className="w-full bg-[#07080e] border border-white/10 rounded-2xl p-6 flex items-center justify-center space-x-4">
                  {reels.map((item, idx) => (
                    <motion.div 
                      key={idx}
                      animate={spinning ? { y: [-6, 6, -6] } : { y: 0 }}
                      transition={{ repeat: Infinity, duration: 0.1 }}
                      className="w-24 h-32 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center shadow-inner select-none space-y-1"
                    >
                      <span className="text-4xl drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">{item.symbol}</span>
                      <span className={cn("text-[10px] font-bold font-mono uppercase tracking-wider", item.color)}>
                        {item.name}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Result Notification */}
                {gambleResult && (
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      "w-full p-3.5 rounded-2xl text-center text-xs font-bold border",
                      gambleResult.won 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    )}
                  >
                    {gambleResult.message}
                  </motion.div>
                )}

                {/* Bet Selector */}
                <div className="w-full flex items-center justify-between bg-white/[0.03] border border-white/10 p-3 rounded-2xl">
                  <span className="text-xs font-mono text-white/50 font-bold">BET AMOUNT</span>
                  <div className="flex items-center space-x-2">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setBetAmount(amt)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer",
                          betAmount === amt 
                            ? "bg-amber-400 text-black shadow-md" 
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
                    "w-full py-4 rounded-2xl font-manrope font-extrabold text-sm tracking-wider uppercase transition-all flex items-center justify-center space-x-2.5 cursor-pointer shadow-lg",
                    spinning || betAmount > credits 
                      ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5" 
                      : "bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-black"
                  )}
                >
                  <RotateCw className={`w-4 h-4 ${spinning ? "animate-spin" : ""}`} />
                  <span>{spinning ? "Spinning..." : `SPIN SLOTS (${betAmount} COINS)`}</span>
                </button>

                {/* Paytable */}
                <div className="w-full pt-4 border-t border-white/5 flex justify-around text-[10px] font-mono text-white/40">
                  <span>🎰🎰🎰 10x</span>
                  <span>💎💎💎 7x</span>
                  <span>👑👑👑 5x</span>
                  <span>⚡⚡⚡ 3x</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <DashboardContextMenu onOpenProfile={() => {}} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </div>
  );
}
