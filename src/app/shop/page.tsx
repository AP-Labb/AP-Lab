"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Sparkles, Dna, Trophy, LogOut, Home, LayoutDashboard, BarChart2, Star, Award, 
  Flame, CheckCircle2, RotateCw, ShieldAlert, Zap, Compass, BookOpen, Crown, Palette, Dices, Activity
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { DashboardContextMenu } from "@/components/DashboardContextMenu";
import { AccountNavbarWidget } from "@/components/AccountNavbarWidget";

// Cosmetic Items Data
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

// Slot Machine Symbols
const SLOT_SYMBOLS = [
  { char: "💎", name: "Diamond", multiplier: 10 },
  { char: "⭐", name: "Star", multiplier: 5 },
  { char: "⚡", name: "Bolt", multiplier: 3 },
  { char: "🍀", name: "Clover", multiplier: 2 },
  { char: "🍒", name: "Cherry", multiplier: 1.5 },
];

export default function ShopPage() {
  const { currentUser } = useAuth();
  const { progress, spendCredits, addCredits, buyItem, equipItem } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"cosmetics" | "gamble">("cosmetics");
  
  // Gambling State
  const [betAmount, setBetAmount] = useState<number>(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState(["💎", "⭐", "⚡"]);
  const [gambleResult, setGambleResult] = useState<{ message: string; won: boolean; amount: number } | null>(null);

  const credits = progress?.credits || 0;
  const xp = progress?.xp || 0;
  const level = progress?.level || 1;
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

    // Spin animation intervals
    let spinCount = 0;
    const interval = setInterval(() => {
      spinCount++;
      setReels([
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].char,
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].char,
        SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)].char,
      ]);

      if (spinCount >= 20) {
        clearInterval(interval);
        
        // Final outcomes
        const finalReels = [
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
          SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)],
        ];

        setReels(finalReels.map(r => r.char));
        setSpinning(false);

        // Check wins
        if (finalReels[0].char === finalReels[1].char && finalReels[1].char === finalReels[2].char) {
          // Jackpot 3 matching!
          const winnings = Math.round(betAmount * finalReels[0].multiplier);
          addCredits?.(winnings, `JACKPOT! 3x ${finalReels[0].name}!`);
          setGambleResult({ message: `JACKPOT! Matched 3x ${finalReels[0].name}! Won ${winnings} Credits!`, won: true, amount: winnings });
        } else if (finalReels[0].char === finalReels[1].char || finalReels[1].char === finalReels[2].char || finalReels[0].char === finalReels[2].char) {
          // 2 matching
          const winnings = Math.round(betAmount * 1.5);
          addCredits?.(winnings, "Double Match!");
          setGambleResult({ message: `Nice! Matched 2 symbols! Won ${winnings} Credits!`, won: true, amount: winnings });
        } else {
          setGambleResult({ message: `No match! Lost ${betAmount} Credits. Spin again!`, won: false, amount: 0 });
        }
      }
    }, 90);
  };

  return (
    <div className="min-h-screen flex flex-row relative z-0 overflow-x-hidden bg-[#03040a] text-white selection:bg-amber-500 selection:text-black font-manrope">
      
      {/* Sidebar Navigation */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-6 sticky top-0">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Link href="/" className="flex items-center gap-3 px-2 py-2.5 mb-4 group">
              <Activity className="w-5 h-5 text-white flex-shrink-0" />
              <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="font-bold text-white text-sm">
                AP Lab
              </motion.span>
            </Link>
            <div className="h-px bg-white/[0.06] mb-4 mx-2" />
            <div className="flex flex-col gap-1">
              <Link href="/" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <Home className="w-5 h-5 shrink-0" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-semibold">Home</motion.span>
              </Link>
              <Link href="/dashboard" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-semibold">Dashboard</motion.span>
              </Link>
              <Link href="/dashboard/progress" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <BarChart2 className="w-5 h-5 shrink-0" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-semibold">Progress</motion.span>
              </Link>
              <Link href="/assistant" className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/50 hover:bg-white/[0.05]">
                <img src="/images/panda-ai.png" alt="Panda AI" className="w-5 h-5 shrink-0 object-contain" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-semibold">AI Assistant</motion.span>
              </Link>
              <Link href="/shop" className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <ShoppingBag className="w-5 h-5 shrink-0" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-bold">Shop</motion.span>
              </Link>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto md:pl-16">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#03040a]/80 border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-instrument text-2xl font-bold tracking-tight text-white">Academic Marketplace</h1>
              <p className="text-xs text-white/40 font-mono">Unlock Avatar Effects, Name Styles & Slot Machine Gambling</p>
            </div>
          </div>

          {/* Top Left/Right Stats Capsules */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white/[0.04] border border-white/10 px-4 py-2 rounded-2xl">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono text-white/40 uppercase">Level {level}</span>
                <span className="text-xs font-bold font-mono text-white">{xp.toLocaleString()} XP</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-4 py-2 rounded-2xl">
              <span className="w-5 h-5 rounded-lg bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-xs">C</span>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono text-amber-400/60 uppercase">Credits</span>
                <span className="text-xs font-black font-mono text-amber-300">{credits.toLocaleString()} C</span>
              </div>
            </div>
          </div>
        </header>

        {/* Shop Main Content Area */}
        <main className="max-w-6xl mx-auto w-full px-6 py-10 space-y-10 flex-1">
          
          {/* Hero Banner */}
          <div className="relative w-full rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 border border-amber-500/20 p-8 overflow-hidden flex flex-col md:flex-row items-center justify-between">
            <div className="space-y-3 max-w-lg z-10 text-left">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
                Exclusive Marketplace
              </span>
              <h2 className="font-instrument text-4xl font-extrabold tracking-tight text-white">
                Customize Your Scholar Identity
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                Spend your earned AP Lab Credits to unlock glowing avatar frames, rare custom name gradients for the leaderboards, or test your luck in the Scholar Casino!
              </p>
            </div>

            {/* Tab Switches */}
            <div className="flex items-center space-x-2 bg-black/40 border border-white/10 p-1.5 rounded-2xl mt-6 md:mt-0 z-10">
              <button
                onClick={() => setActiveTab("cosmetics")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
                  activeTab === "cosmetics" 
                    ? "bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Avatar Cosmetics</span>
              </button>
              <button
                onClick={() => setActiveTab("gamble")}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center space-x-2 ${
                  activeTab === "gamble" 
                    ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.4)]" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Dices className="w-4 h-4" />
                <span>Slot Machine</span>
              </button>
            </div>
          </div>

          {/* TAB 1: COSMETICS SHOP */}
          {activeTab === "cosmetics" && (
            <div className="space-y-12">
              
              {/* Avatar Glowing Frames Section */}
              <section className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-instrument text-2xl font-bold text-white">Avatar Aura Frames</h3>
                    <p className="text-xs text-white/40">Displays glowing rings around your profile photo across all leaderboards</p>
                  </div>
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {AVATAR_FRAMES.map((item) => {
                    const isOwned = inventory.includes(item.id);
                    const isEquipped = activeFrame === item.id;

                    return (
                      <div 
                        key={item.id}
                        className={`relative rounded-3xl bg-[#090b14] border p-6 flex flex-col justify-between space-y-6 transition-all group hover:border-amber-500/50 ${
                          isEquipped ? "border-amber-500 ring-2 ring-amber-500/30" : "border-white/10"
                        }`}
                      >
                        {/* Preview Circle */}
                        <div className="flex flex-col items-center justify-center py-4">
                          <div className={`relative w-20 h-20 rounded-full p-1 bg-gradient-to-tr ${item.color} shadow-[0_0_25px_rgba(245,158,11,0.3)]`}>
                            <div className="w-full h-full rounded-full bg-neutral-900 border border-black/40 flex items-center justify-center font-bold text-white text-lg overflow-hidden">
                              {currentUser?.photoURL ? (
                                <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                              ) : (
                                <span>{currentUser?.displayName?.charAt(0) || "AP"}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-bold text-white mt-4">{item.name}</span>
                          <span className="text-[11px] text-white/40 text-center mt-1 px-2">{item.desc}</span>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                          {isOwned ? (
                            <button
                              onClick={() => equipItem?.("frame", isEquipped ? "" : item.id)}
                              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                                isEquipped 
                                  ? "bg-amber-500 text-black font-extrabold" 
                                  : "bg-white/10 hover:bg-white/20 text-white"
                              }`}
                            >
                              {isEquipped ? "Equipped ✓" : "Equip Frame"}
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                const success = await buyItem?.(item.id, item.cost, "frame");
                                if (!success) alert("Not enough credits!");
                              }}
                              disabled={credits < item.cost}
                              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                                credits >= item.cost 
                                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold hover:brightness-110 shadow-lg" 
                                  : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                              }`}
                            >
                              <span>Unlock for {item.cost} Credits</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Leaderboard Name Gradients Section */}
              <section className="space-y-6 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-instrument text-2xl font-bold text-white">Leaderboard Name Gradients</h3>
                    <p className="text-xs text-white/40">Apply rich glowing text gradients to your username everywhere</p>
                  </div>
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {NAME_GRADIENTS.map((item) => {
                    const isOwned = inventory.includes(item.id);
                    const isEquipped = activeGrad === item.id;

                    return (
                      <div 
                        key={item.id}
                        className={`relative rounded-3xl bg-[#090b14] border p-6 flex flex-col justify-between space-y-6 transition-all group hover:border-purple-500/50 ${
                          isEquipped ? "border-purple-500 ring-2 ring-purple-500/30" : "border-white/10"
                        }`}
                      >
                        {/* Name Gradient Preview */}
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <span className={`text-xl ${item.style}`}>
                            {currentUser?.displayName || "Scholar Name"}
                          </span>
                          <span className="text-[11px] text-white/40 mt-3 px-2">{item.desc}</span>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
                          {isOwned ? (
                            <button
                              onClick={() => equipItem?.("gradient", isEquipped ? "" : item.id)}
                              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                                isEquipped 
                                  ? "bg-purple-600 text-white font-extrabold" 
                                  : "bg-white/10 hover:bg-white/20 text-white"
                              }`}
                            >
                              {isEquipped ? "Equipped ✓" : "Equip Gradient"}
                            </button>
                          ) : (
                            <button
                              onClick={async () => {
                                const success = await buyItem?.(item.id, item.cost, "gradient");
                                if (!success) alert("Not enough credits!");
                              }}
                              disabled={credits < item.cost}
                              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                                credits >= item.cost 
                                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-extrabold hover:brightness-110 shadow-lg" 
                                  : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                              }`}
                            >
                              <span>Unlock for {item.cost} Credits</span>
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

          {/* TAB 2: SLOT MACHINE GAMBLING */}
          {activeTab === "gamble" && (
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-[#090b16] border border-purple-500/30 rounded-3xl p-8 shadow-[0_20px_80px_rgba(147,51,234,0.15)] flex flex-col items-center space-y-8">
                
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/30 px-3 py-1 rounded-full text-purple-300 font-mono text-xs font-bold">
                    <Dices className="w-4 h-4" />
                    <span>AP Scholar Casino</span>
                  </div>
                  <h3 className="font-instrument text-3xl font-bold text-white">Credit Slot Machine</h3>
                  <p className="text-xs text-white/40">Risk your credits for a chance to win up to 10x multiplier!</p>
                </div>

                {/* Reels Cabinet */}
                <div className="w-full bg-[#05060b] border-4 border-purple-600/40 rounded-3xl p-6 shadow-inner flex items-center justify-center space-x-4">
                  {reels.map((symbol, idx) => (
                    <motion.div 
                      key={idx}
                      animate={spinning ? { y: [-10, 10, -10] } : { y: 0 }}
                      transition={{ repeat: Infinity, duration: 0.1 }}
                      className="w-24 h-32 rounded-2xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-2xl select-none"
                    >
                      {symbol}
                    </motion.div>
                  ))}
                </div>

                {/* Result Notification */}
                {gambleResult && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-full p-4 rounded-2xl text-center text-sm font-bold border ${
                      gambleResult.won 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                    }`}
                  >
                    {gambleResult.message}
                  </motion.div>
                )}

                {/* Bet Selector */}
                <div className="w-full flex items-center justify-between bg-white/[0.03] border border-white/10 p-3 rounded-2xl">
                  <span className="text-xs font-mono text-white/60 font-bold">SELECT BET AMOUNT</span>
                  <div className="flex items-center space-x-2">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setBetAmount(amt)}
                        className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                          betAmount === amt 
                            ? "bg-purple-600 text-white shadow-md" 
                            : "bg-white/5 hover:bg-white/10 text-white/60"
                        }`}
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
                  className={`w-full py-4 rounded-2xl font-extrabold text-base tracking-wider uppercase transition-all shadow-xl flex items-center justify-center space-x-3 ${
                    spinning || betAmount > credits 
                      ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/5" 
                      : "bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:brightness-115 text-white cursor-pointer shadow-[0_0_30px_rgba(147,51,234,0.4)]"
                  }`}
                >
                  <RotateCw className={`w-5 h-5 ${spinning ? "animate-spin" : ""}`} />
                  <span>{spinning ? "Spinning Reels..." : `SPIN SLOTS (${betAmount} CREDITS)`}</span>
                </button>

                {/* Paytable */}
                <div className="w-full pt-4 border-t border-white/5 flex justify-around text-[10px] font-mono text-white/40">
                  <span>💎💎💎 10x</span>
                  <span>⭐⭐⭐ 5x</span>
                  <span>⚡⚡⚡ 3x</span>
                  <span>2 Matching 1.5x</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      <DashboardContextMenu onOpenProfile={() => {}} />
    </div>
  );
}
