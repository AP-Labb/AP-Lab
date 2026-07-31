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
import { UserAvatar } from "@/components/UserAvatar";

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

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

// Custom Premium Shop Items with Custom Item Pastel Background Colors & Bigger Avatars
const GEAR_ITEMS = [
  // 10-Hour Boost Powerups
  { 
    id: "boost-2x-xp", 
    name: "10-Hour 2x XP Boost", 
    desc: "Earn 2x Double XP on all study activities, quizzes, and completed topics for 10 hours", 
    cost: 150, 
    bgColor: "bg-neutral-900 border-neutral-800",
    innerBg: "bg-[#f4effc] border-purple-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "boost",
    renderAccessory: () => (
      <div className="w-32 h-32 flex items-center justify-center">
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
    innerBg: "bg-[#fef9e7] border-amber-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "boost",
    renderAccessory: () => (
      <div className="w-32 h-32 flex items-center justify-center">
        <img src="/images/2x-coin-boost.png" alt="2X Coin Boost" className="w-full h-full object-contain select-none" />
      </div>
    )
  },

  // 1. Top Hat (Very light neutral background)
  { 
    id: "gear-top-hat", 
    name: "Top Hat", 
    desc: "Classic black magician top hat", 
    cost: 50, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#f1f3f5] border-neutral-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "hat",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-top-hat" size="xl" />
    )
  },

  // 2. Purple Beanie (Really light purple background)
  { 
    id: "gear-purple-beanie", 
    name: "Purple Beanie", 
    desc: "Cozy purple winter beanie with pom pom", 
    cost: 45, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#f3edfc] border-violet-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "hat",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-purple-beanie" size="xl" />
    )
  },

  // 3. Purple Striped Party Hat (Really light fuchsia background)
  { 
    id: "gear-purple-party-hat", 
    name: "Purple Party Hat", 
    desc: "Festive striped party cone hat with fluff top", 
    cost: 50, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#fbeafc] border-fuchsia-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "hat",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-purple-party-hat" size="xl" />
    )
  },

  // 4. Golden Crown with Jewels (Really light yellow background)
  { 
    id: "gear-golden-crown", 
    name: "Golden Crown", 
    desc: "Royal 24k gold scholar crown with amethyst jewels", 
    cost: 150, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#fefce8] border-yellow-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "crown",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-golden-crown" size="xl" />
    )
  },

  // 5. Cyber Neon Pink Visor (Really light pink background)
  { 
    id: "gear-neon-pink-visor", 
    name: "Cyber Neon Visor", 
    desc: "Glowing futuristic pink cyberpunk visor glasses", 
    cost: 80, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#fce7f3] border-pink-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "visor",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-neon-pink-visor" size="xl" />
    )
  },

  // 6. Dark Cyber Visor (Really light neutral background)
  { 
    id: "gear-dark-cyber-visor", 
    name: "Dark Cyber Visor", 
    desc: "Tactical dark tinted cyberpunk sunglasses", 
    cost: 75, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#f3f4f6] border-neutral-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "visor",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-dark-cyber-visor" size="xl" />
    )
  },

  // 7. Face Mask (Really light cyan background)
  { 
    id: "gear-face-mask", 
    name: "Face Mask", 
    desc: "Protective blue surgical face mask", 
    cost: 35, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#ecfeff] border-cyan-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "mask",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-face-mask" size="xl" />
    )
  },

  // 8. Heart Necklace (Really light rose background)
  { 
    id: "gear-heart-necklace", 
    name: "Heart Necklace", 
    desc: "Sparkling pink gem pendant necklace", 
    cost: 75, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#ffe4e6] border-rose-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "necklace",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-heart-necklace" size="xl" />
    )
  },

  // 9. Gold Chain (Really light amber background)
  { 
    id: "gear-gold-chain", 
    name: "Gold Chain", 
    desc: "Shiny 24k gold Cuban link chain", 
    cost: 100, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#fef3c7] border-amber-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "necklace",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-gold-chain" size="xl" />
    )
  },

  // 10. Devil Horns (Really light red background)
  { 
    id: "gear-devil-horns", 
    name: "Devil Horns", 
    desc: "Crimson devil horns", 
    cost: 100, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#fee2e2] border-red-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "hat",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-devil-horns" size="xl" />
    )
  },

  // 11. Red Bowtie (Really light red/rose background)
  { 
    id: "gear-red-bowtie", 
    name: "Red Bowtie", 
    desc: "Dapper crimson formal bowtie", 
    cost: 60, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#ffe4e6] border-rose-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "necklace",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-red-bowtie" size="xl" />
    )
  },

  // 12. Golden Halo (Really light yellow background)
  { 
    id: "gear-golden-halo", 
    name: "Golden Halo", 
    desc: "Radiant divine glowing yellow halo", 
    cost: 150, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#fef9c3] border-yellow-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "hat",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-golden-halo" size="xl" />
    )
  },

  // 13. Astronaut Helmet (Really light blue/grey background)
  { 
    id: "gear-astronaut-helmet", 
    name: "Astronaut Helmet", 
    desc: "Futuristic white space exploration helmet", 
    cost: 120, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-[#eff6ff] border-blue-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner",
    type: "helmet",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <UserAvatar photoURL={userPhoto} name={userName} activeFrame="gear-astronaut-helmet" size="xl" />
    )
  },

  // 14. Custom Name Color Customization (Rotating Rainbow Animation on User's Display Name)
  { 
    id: "custom-name-color", 
    name: "Custom Name Color", 
    desc: "Choose any custom color hex for your display name across the site", 
    cost: 120, 
    bgColor: "bg-neutral-900 border-neutral-800", 
    innerBg: "bg-gradient-to-br from-pink-100/90 via-purple-100/90 to-cyan-100/90 border-purple-200/60 flex items-center justify-center h-48 rounded-2xl shadow-inner p-4",
    type: "color-picker",
    renderAccessory: (userPhoto?: string, userName?: string) => (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <span className="font-manrope font-extrabold text-2xl tracking-tight text-center bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-cyan-400 via-blue-500 via-purple-500 to-red-500 bg-[length:200%_200%] animate-gradient-x bg-clip-text text-transparent drop-shadow-sm">
          {userName || "Scholar"}
        </span>
      </div>
    )
  },
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
  const [hueValue, setHueValue] = useState(330);

  const credits = progress?.credits || 0;
  const level = progress?.level || 1;
  const xp = progress?.xp || 0;
  const inventory = progress?.inventory || [];
  const activeFrame = progress?.activeAvatarFrame || "";
  const activeGrad = progress?.activeNameGradient || "";
  const userName = progress?.displayName || currentUser?.displayName || "Scholar";

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
      return;
    }

    if (isOwned) {
      equipItem?.("frame", isEquipped ? "" : item.id);
    } else {
      const success = await buyItem?.(item.id, item.cost, "frame");
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
          
          {/* Top Banner with text & button shifted left to sit inside the cream space */}
          <div 
            className="relative w-full rounded-3xl bg-cover bg-center p-8 sm:p-12 text-neutral-950 overflow-hidden shadow-2xl flex flex-col justify-center min-h-[260px]"
            style={{ backgroundImage: `url('/images/SHOPbanner.png')` }}
          >
            <div className="relative z-10 max-w-xl sm:max-w-2xl mr-auto space-y-4 text-left pl-12 sm:pl-28 md:pl-36">
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

          {/* Store Items Grid */}
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
                    {/* Visual Card Display Box */}
                    <div className={cn(item.innerBg, "group-hover:scale-[1.02] transition-transform")}>
                      {item.id === "custom-name-color" ? (
                        <div className="flex flex-col items-center justify-center h-full w-full">
                          <span className="font-manrope font-extrabold text-2xl tracking-tight text-center bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-cyan-400 via-blue-500 via-purple-500 to-red-500 bg-[length:200%_200%] animate-gradient-x bg-clip-text text-transparent drop-shadow-sm">
                            {userName}
                          </span>
                        </div>
                      ) : (
                        item.renderAccessory(currentUser?.photoURL || undefined, userName)
                      )}
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
              className="relative w-full max-w-xl bg-[#141622] border border-white/15 rounded-[36px] overflow-hidden shadow-2xl flex flex-col md:flex-row text-white"
            >
              <button
                onClick={() => setSelectedStoreItem(null)}
                className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side Visual Box (Enlarged Avatar Display) */}
              <div className="w-full md:w-1/2 bg-[#0c0d16] p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 relative min-h-[300px]">
                {selectedStoreItem.type === "color-picker" ? (
                  <div className="flex flex-col items-center justify-center space-y-3 text-center">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-wider">Live Name Preview</span>
                    <span className="font-manrope font-extrabold text-3xl tracking-tight transition-colors drop-shadow-md" style={{ color: customColorHex }}>
                      {userName}
                    </span>
                    <span className="text-xs font-mono text-white/30">{customColorHex.toUpperCase()}</span>
                  </div>
                ) : (
                  <div className="transform scale-125 flex items-center justify-center">
                    {selectedStoreItem.renderAccessory(currentUser?.photoURL || undefined, userName)}
                  </div>
                )}
              </div>

              {/* Right Side Item Info & Purchase Confirm Button */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between text-left space-y-6">
                <div>
                  <div className="bg-white/10 text-white/70 font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full w-fit mb-3">
                    {selectedStoreItem.type === "color-picker" ? "Custom Color" : "0/1 Available"}
                  </div>
                  <h3 className="font-manrope font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                    {selectedStoreItem.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <img src="/images/coin-zoomed.png" alt="Coin" className="w-7 h-7 object-contain" />
                    <span className="font-manrope font-extrabold text-2xl text-amber-400">{selectedStoreItem.cost}</span>
                  </div>
                  <p className="text-xs text-white/50 font-manrope mt-2 leading-relaxed">
                    {selectedStoreItem.desc}
                  </p>

                  {/* Horizontal Rainbow Color Slider Line */}
                  {selectedStoreItem.type === "color-picker" && (
                    <div className="mt-5 space-y-3 pt-3 border-t border-white/10">
                      <span className="text-[11px] font-mono font-bold text-white/60 block">Pick Display Color:</span>
                      <div className="relative w-full flex items-center py-2">
                        <input 
                          type="range" 
                          min="0" 
                          max="360" 
                          value={hueValue} 
                          onChange={(e) => {
                            const h = Number(e.target.value);
                            setHueValue(h);
                            setCustomColorHex(hslToHex(h, 100, 50));
                          }} 
                          className="w-full h-3 rounded-full appearance-none cursor-pointer outline-none shadow-md"
                          style={{
                            background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)"
                          }}
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
                    "w-full py-4 rounded-2xl font-manrope font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xl flex items-center justify-center space-x-2 border-none",
                    selectedStoreItem.type === "color-picker"
                      ? (credits >= selectedStoreItem.cost ? "bg-emerald-500 hover:bg-emerald-400 text-black font-black" : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5")
                      : inventory.includes(selectedStoreItem.id)
                        ? "bg-amber-400 text-black hover:bg-amber-300"
                        : credits >= selectedStoreItem.cost 
                          ? "bg-emerald-500 hover:bg-emerald-400 text-black" 
                          : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
                  )}
                >
                  <span>
                    {selectedStoreItem.type === "color-picker"
                      ? (credits >= selectedStoreItem.cost ? "Purchase" : "Not Enough Coins")
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
