"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Sparkles, Trophy, LogOut, Home, LayoutDashboard, BarChart2, Star, Award, 
  CheckCircle2, RotateCw, Crown, Palette, Dices, Activity, ArrowRight, Search, Flame, Tag, Layers, Glasses, HardHat, Shield, X
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

// Gear Items Data with Avatars, Glasses, Hats, and Cosmetics
const GEAR_ITEMS = [
  { id: "gear-mr-brightside", category: "Customization", name: "Mr. Brightside", desc: "Kai with sunglasses on", cost: 35, icon: "🕶️", color: "from-cyan-500/20 to-blue-500/20", type: "sunglasses" },
  { id: "gear-[#1-scholar]", category: "Customization", name: "Man of the Match", desc: "Football Kai helmet", cost: 100, icon: "🏈", color: "from-red-500/20 to-orange-500/20", type: "helmet" },
  { id: "gear-casanova", category: "Customization", name: "Casanova", desc: "Kai winking avatar style", cost: 25, icon: "😉", color: "from-[#152e25] to-[#0f241d]", type: "avatar" },
  { id: "gear-frat-boy", category: "Customization", name: "Frat Boy", desc: "Party Kai avatar style", cost: 75, icon: "🥳", color: "from-purple-500/20 to-pink-500/20", type: "avatar" },
  
  // Aura Frames & Gradients
  { id: "frame-gold", category: "Customization", name: "Imperial Gold Aura", desc: "Golden glowing aura ring around your avatar", cost: 150, icon: "👑", color: "from-amber-500/20 to-yellow-500/20", type: "frame" },
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
  const router = useRouter();
  const { currentUser } = useAuth();
  const { progress, spendCredits, addCredits, buyItem, equipItem } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showHowToEarnModal, setShowHowToEarnModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Slot Machine State
  const [betAmount, setBetAmount] = useState<number>(10);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState([SLOT_SYMBOLS[0], SLOT_SYMBOLS[1], SLOT_SYMBOLS[2]]);
  const [gambleResult, setGambleResult] = useState<{ message: string; won: boolean; amount: number } | null>(null);

  const credits = progress?.credits || 0;
  const level = progress?.level || 1;
  const xp = progress?.xp || 0;
  const inventory = progress?.inventory || [];
  const activeFrame = progress?.activeAvatarFrame || "";
  const activeGrad = progress?.activeNameGradient || "";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  // Filtered items
  const filteredGear = GEAR_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === "All" || activeCategory === "Customization";
    return matchesSearch && matchesCat;
  });

  // Slot Machine Spin Handler
  const handleSpinSlots = async () => {
    if (betAmount <= 0 || betAmount > credits || spinning) return;
    
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
      
      {/* STICKY Left Sidebar Navigation matching Progress page */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} animate={true}>
        <SidebarBody className="justify-between gap-6 sticky top-0 h-screen overflow-y-auto">
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
                    {(currentUser?.displayName || "A").charAt(0).toUpperCase()}
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
                      {progress?.displayName || currentUser?.displayName || "Scholar"}
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
              <p className="text-xs text-white/40 font-manrope">Redeem coins for exclusive gear, hats & cosmetics</p>
            </div>
          </div>

          {/* Top Right Header Capsules */}
          <HeaderUserCapsules onOpenProfile={() => setShowProfileModal(true)} />
        </header>

        {/* Shop Main Content Area */}
        <main className="max-w-6xl mx-auto w-full px-6 sm:px-10 py-8 space-y-10 flex-1 text-left">
          
          {/* Top Banner using SHOPbanner.png */}
          <div 
            className="relative w-full rounded-3xl bg-cover bg-center p-8 sm:p-10 text-neutral-950 overflow-hidden shadow-2xl flex flex-col justify-center min-h-[220px]"
            style={{ backgroundImage: `url('/images/SHOPbanner.png')` }}
          >
            <div className="relative z-10 max-w-xl space-y-3">
              <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                Redeem coins for exclusive gear
              </h2>
              <p className="text-sm font-medium text-neutral-800 font-manrope">
                Get power ups, avatars, and customization hats & glasses.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => setShowHowToEarnModal(true)}
                  className="px-6 py-3 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-manrope font-bold text-xs transition-all cursor-pointer shadow-lg"
                >
                  How to earn
                </button>
              </div>
            </div>
          </div>

          {/* "My Items" Row */}
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

          {/* Store Items Header & Search/Filter Controls */}
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

            {/* GEAR & CUSTOMIZATION ITEMS GRID displaying over user avatar */}
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
                      {/* Avatar Item Box displaying the gear over the user photo */}
                      <div className={`w-full h-36 rounded-2xl bg-gradient-to-br ${item.color} border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                        <div className="relative w-20 h-20 rounded-full flex items-center justify-center">
                          {currentUser?.photoURL ? (
                            <img src={currentUser.photoURL} alt="User Avatar" className="w-full h-full object-cover rounded-full border-2 border-white/20" />
                          ) : (
                            <div className="w-full h-full rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center font-bold text-xl text-white">
                              {(currentUser?.displayName || "A").charAt(0).toUpperCase()}
                            </div>
                          )}
                          {/* Item Graphic Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center text-3xl pointer-events-none drop-shadow-lg">
                            {item.icon}
                          </div>
                        </div>
                      </div>

                      {/* Title & Details */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white font-manrope">{item.name}</h4>
                          <span className="text-[10px] font-mono text-white/40">{isOwned ? "1/1" : "0/1"}</span>
                        </div>
                        <p className="text-xs text-white/40 mt-1 line-clamp-2">{item.desc}</p>
                      </div>

                      {/* Action Button */}
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

      {/* HOW TO EARN COINS MODAL matching reference screenshot */}
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

              {/* Large Gold Coin Image */}
              <div className="w-28 h-28 mx-auto mb-6">
                <img src="/images/coin-zoomed.png" alt="Coin" className="w-full h-full object-contain" />
              </div>

              <h3 className="font-manrope font-extrabold text-2xl sm:text-3xl text-white mb-2">
                Actions that earn coins
              </h3>
              <p className="text-xs text-amber-200/80 font-manrope mb-8">
                Collect coins and redeem them for cool in-game items.
              </p>

              {/* Truthful AP Lab Coin Earning Actions Grid matching reference */}
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
