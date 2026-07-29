"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Sparkles, Trophy, LogOut, Home, LayoutDashboard, BarChart2, Star, Award, 
  CheckCircle2, RotateCw, Crown, Palette, Dices, Activity, ArrowRight, Sparkle, Search, Flame, Tag, Layers, Glasses, HardHat, Shield
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

// Gear Items Data with Avatars, Glasses, Hats, and Cosmetics
const GEAR_ITEMS = [
  { id: "gear-mr-brightside", category: "Customization", name: "Mr. Brightside", desc: "Scholar with sunglasses on", cost: 35, icon: "🕶️", color: "from-cyan-500/20 to-blue-500/20", type: "sunglasses" },
  { id: "gear-[#1-scholar]", category: "Customization", name: "Man of the Match", desc: "Football helmet & mouthguard scholar", cost: 100, icon: "🏈", color: "from-red-500/20 to-orange-500/20", type: "helmet" },
  { id: "gear-casanova", category: "Customization", name: "Casanova", desc: "Winking smooth AP scholar avatar", cost: 25, icon: "😉", color: "from-[#152e25] to-[#0f241d]", type: "avatar" },
  { id: "gear-frat-boy", category: "Customization", name: "Frat Boy", desc: "Party blowout scholar", cost: 75, icon: "🥳", color: "from-purple-500/20 to-pink-500/20", type: "avatar" },
  
  // Aura Frames & Gradients
  { id: "frame-gold", category: "Customization", name: "Imperial Gold Aura", desc: "Golden glowing aura ring around profile photo", cost: 150, icon: "👑", color: "from-amber-500/20 to-yellow-500/20", type: "frame" },
  { id: "frame-neon-cyan", category: "Customization", name: "Cyber Cyan Aura", desc: "High-tech energetic neon glow ring", cost: 250, icon: "⚡", color: "from-cyan-500/20 to-teal-500/20", type: "frame" },
  { id: "grad-fire", category: "Customization", name: "Phoenix Fire Gradient", desc: "Fiery red & orange leaderboard name glow", cost: 100, icon: "🔥", color: "from-orange-500/20 to-red-500/20", type: "gradient" },
  { id: "grad-holographic", category: "Customization", name: "Holographic Gradient", desc: "Multi-chromatic rainbow holographic name text", cost: 500, icon: "✨", color: "from-indigo-500/20 to-purple-500/20", type: "gradient" },
];

const STREAK_POWERUPS = [
  { id: "streak-freeze", category: "Streak", name: "Long Pause", desc: "Need a break? Pause your streak for up to 30 days.", count: "4/4", cost: 50, icon: "⏸️" },
  { id: "streak-repair", category: "Streak", name: "Streak Repair", desc: "Instantly restore a missed streak day", count: "1/1", cost: 150, icon: "🩹" },
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
  const { currentUser } = useAuth();
  const { progress, spendCredits, addCredits, buyItem, equipItem } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
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

  // Filtered items
  const filteredGear = GEAR_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "All" || activeCategory === "Customization";
    return matchesSearch && matchesCat;
  });

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
      
      {/* Sidebar Navigation matching Progress page */}
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
              <Link href="/shop" className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-white/10 text-amber-400 font-bold border border-amber-400/20">
                <ShoppingBag className="w-5 h-5 shrink-0 text-amber-400" />
                <motion.span animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }} className="text-sm font-bold text-amber-400">Shop</motion.span>
              </Link>
              <SidebarSettingsButton open={sidebarOpen} />
            </div>
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
              <p className="text-xs text-white/40 font-manrope">Redeem coins for exclusive gear, hats & cosmetics</p>
            </div>
          </div>

          {/* Top Right Header Capsules */}
          <HeaderUserCapsules />
        </header>

        {/* Shop Main Content Area */}
        <main className="max-w-6xl mx-auto w-full px-6 sm:px-10 py-8 space-y-10 flex-1 text-left">
          
          {/* Top Promo Banner matching reference screenshot */}
          <div className="relative w-full rounded-3xl bg-gradient-to-r from-[#fffbeb] via-[#fef3c7] to-[#fde68a] p-8 sm:p-10 text-neutral-950 overflow-hidden shadow-2xl flex flex-col justify-center">
            <div className="relative z-10 max-w-xl space-y-3">
              <h2 className="font-manrope text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 leading-tight">
                Redeem coins for exclusive gear
              </h2>
              <p className="text-sm font-semibold text-neutral-700 font-manrope">
                Get power ups, merchandise, and customization hats & glasses.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => alert("Earn coins by completing AP practice questions, unit quizzes, and maintaining daily study streaks!")}
                  className="px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-manrope font-bold text-xs transition-all cursor-pointer shadow-lg"
                >
                  How to earn
                </button>
              </div>
            </div>

            {/* Decorative Floating Bag Graphic */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center space-x-4">
              <div className="w-24 h-28 bg-red-500 rounded-2xl shadow-2xl flex items-center justify-center text-white font-extrabold text-2xl -rotate-6">
                🛍️
              </div>
              <div className="w-28 h-32 bg-amber-500 rounded-2xl shadow-2xl flex items-center justify-center text-white font-black text-3xl rotate-6">
                U
              </div>
            </div>
          </div>

          {/* "My Items" Row matching reference screenshot */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-manrope text-xl font-bold text-white">My Items</h3>
              <button 
                onClick={() => setActiveCategory("All")}
                className="text-xs font-bold font-manrope text-white/50 hover:text-white flex items-center gap-1 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full transition-all cursor-pointer"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STREAK_POWERUPS.map((item) => (
                <div key={item.id} className="bg-[#12141e] border border-white/10 rounded-2xl p-5 flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-2xl shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white font-manrope">{item.name}</h4>
                      <p className="text-xs text-white/50 mt-0.5 max-w-xs">{item.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white/40 shrink-0">{item.count}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Store Items Header & Search/Filter Controls matching screenshot */}
          <section className="space-y-6 pt-4">
            <h3 className="font-manrope text-xl font-bold text-white">Store Items</h3>

            {/* Filter Pills Bar */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search an item" 
                  className="w-full bg-[#12141e] border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/50"
                />
              </div>

              {["All", "Streak", "Customization", "Mini Games"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-manrope font-bold transition-all cursor-pointer border flex items-center space-x-1.5",
                    activeCategory === cat 
                      ? "bg-white text-black border-white shadow-md" 
                      : "bg-[#12141e] text-white/60 border-white/10 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {cat === "Streak" && <Flame className="w-3.5 h-3.5 text-orange-400" />}
                  {cat === "Customization" && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                  {cat === "Mini Games" && <Dices className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            {/* GEAR & CUSTOMIZATION ITEMS GRID matching reference screenshot */}
            {(activeCategory === "All" || activeCategory === "Customization") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredGear.map((item) => {
                  const isOwned = inventory.includes(item.id);
                  const isEquipped = activeFrame === item.id || activeGrad === item.id;

                  return (
                    <div 
                      key={item.id}
                      className={cn(
                        "relative rounded-3xl bg-[#12141e] border p-6 flex flex-col justify-between space-y-5 transition-all group hover:border-white/20",
                        isEquipped ? "border-amber-400 ring-2 ring-amber-400/20" : "border-white/10"
                      )}
                    >
                      {/* Item Preview Card Box matching screenshot */}
                      <div className={`w-full h-36 rounded-2xl bg-gradient-to-br ${item.color} border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                        <div className="text-5xl drop-shadow-xl">{item.icon}</div>
                      </div>

                      {/* Title & Details */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white font-manrope">{item.name}</h4>
                          <span className="text-[10px] font-mono text-white/40">{isOwned ? "1/1" : "0/1"}</span>
                        </div>
                        <p className="text-xs text-white/40 mt-1 line-clamp-2">{item.desc}</p>
                      </div>

                      {/* Action Button matching screenshot */}
                      <div className="pt-2 border-t border-white/5">
                        {isOwned ? (
                          <button
                            onClick={() => equipItem?.(item.type as any, isEquipped ? "" : item.id)}
                            className={cn(
                              "w-full py-2.5 rounded-full font-bold text-xs transition-all cursor-pointer",
                              isEquipped 
                                ? "bg-amber-400 text-black font-extrabold" 
                                : "bg-white/10 hover:bg-white/20 text-white"
                            )}
                          >
                            {isEquipped ? "Equipped ✓" : "Equip Item"}
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              const success = await buyItem?.(item.id, item.cost, item.type as any);
                              if (!success) alert("Not enough coins!");
                            }}
                            disabled={credits < item.cost}
                            className={cn(
                              "w-full py-2.5 rounded-full font-bold text-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer",
                              credits >= item.cost 
                                ? "bg-amber-400 hover:bg-amber-300 text-black font-extrabold shadow-md" 
                                : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                            )}
                          >
                            <img src="/images/coin-zoomed.png" alt="Coin" className="w-4 h-4 object-contain inline" />
                            <span>{item.cost}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* MINI GAMES / SLOT MACHINE SECTION */}
            {(activeCategory === "All" || activeCategory === "Mini Games") && (
              <div className="pt-6">
                <div className="bg-[#12141e] border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center space-y-7 text-center max-w-xl mx-auto">
                  
                  <div className="space-y-1">
                    <h3 className="font-instrument text-3xl font-bold text-white">Coin Slot Machine</h3>
                    <p className="text-xs text-white/40">Spin to match symbols and multiply your coins!</p>
                  </div>

                  {/* Reels Container */}
                  <div className="w-full bg-[#0a0b10] border border-white/10 rounded-2xl p-6 flex items-center justify-center space-x-4">
                    {reels.map((item, idx) => (
                      <motion.div 
                        key={idx}
                        animate={spinning ? { y: [-6, 6, -6] } : { y: 0 }}
                        transition={{ repeat: Infinity, duration: 0.1 }}
                        className="w-24 h-32 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center justify-center shadow-inner select-none space-y-1"
                      >
                        <span className="text-4xl">{item.symbol}</span>
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

                  <div className="w-full pt-4 border-t border-white/5 flex justify-around text-[10px] font-mono text-white/40">
                    <span>🎰🎰🎰 10x</span>
                    <span>💎💎💎 7x</span>
                    <span>👑👑👑 5x</span>
                    <span>⚡⚡⚡ 3x</span>
                  </div>
                </div>
              </div>
            )}

          </section>

        </main>
      </div>

      <DashboardContextMenu onOpenProfile={() => {}} />
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
    </div>
  );
}
