"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Settings, LogOut, Package, Zap, Shield, Flame, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { SettingsModal } from "./SettingsModal";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AccountProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "profile" | "inventory" | "settings";
}

export function AccountProfileModal({ isOpen, onClose, defaultTab = "profile" }: AccountProfileModalProps) {
  const { currentUser } = useAuth();
  const { progress, equipItem, useBoostItem } = useProgress();

  const [activeTab, setActiveTab] = useState<"profile" | "inventory" | "settings">(defaultTab);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [usedMsg, setUsedMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const xp = progress?.xp || 0;
  const level = progress?.level || 1;
  const credits = progress?.credits || 0;
  const inventory = progress?.inventory || [];
  const activeFrame = progress?.activeAvatarFrame || "";
  const activeGrad = progress?.activeNameGradient || "";
  const displayName = progress?.displayName || currentUser?.displayName || "Scholar";
  const photoURL = currentUser?.photoURL || progress?.photoURL || "";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  const handleActivateBoost = async (itemId: string) => {
    const ok = await useBoostItem?.(itemId);
    if (ok) {
      setUsedMsg(`Activated 10-Hour Boost! Timer is now live at top of screen.`);
      setTimeout(() => setUsedMsg(null), 4000);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-xl z-[999999] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl bg-[#0a0b12] border border-white/15 rounded-[36px] overflow-hidden shadow-2xl p-6 sm:p-8 text-white flex flex-col space-y-6"
        >
          {/* Top Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Header Capsule */}
          <div className="flex items-center space-x-4 border-b border-white/10 pb-6">
            {photoURL ? (
              <img src={photoURL} alt={displayName} className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/80 shadow-lg" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-black flex items-center justify-center font-manrope font-extrabold text-2xl shadow-lg">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="text-left">
              <h2 className="font-manrope font-extrabold text-2xl text-white tracking-tight">{displayName}</h2>
              <p className="font-mono text-xs text-white/50 mt-0.5">Lvl {level} • {xp.toLocaleString()} XP • {credits.toLocaleString()} Coins</p>
            </div>
          </div>

          {/* Navigation Tab Bar (Profile, Inventory, Settings, Sign Out) */}
          <div className="flex items-center bg-white/5 p-1.5 rounded-2xl border border-white/10 gap-1 font-manrope text-xs font-bold">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === "profile" ? "bg-white text-black font-extrabold shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === "inventory" ? "bg-white text-black font-extrabold shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventory ({inventory.length})</span>
            </button>
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="flex-1 py-2.5 rounded-xl text-white/60 hover:text-white transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button
              onClick={handleSignOut}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all flex items-center justify-center space-x-1.5 cursor-pointer font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {usedMsg && (
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
              {usedMsg}
            </div>
          )}

          {/* TAB 1: PROFILE SUMMARY */}
          {activeTab === "profile" && (
            <div className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <span className="text-[10px] font-mono uppercase text-white/40 block">Level Progression</span>
                  <span className="font-manrope font-extrabold text-xl text-purple-400 mt-1 block">Level {level}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                  <span className="text-[10px] font-mono uppercase text-white/40 block">Coin Vault Balance</span>
                  <span className="font-manrope font-extrabold text-xl text-amber-400 mt-1 block">{credits.toLocaleString()} Coins</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY GRID (Grid slots matching user uploaded screenshot) */}
          {activeTab === "inventory" && (
            <div className="space-y-4 text-left">
              <h3 className="font-manrope text-sm font-extrabold text-white/80 uppercase tracking-wider">Your Item Backpack</h3>
              
              {inventory.length === 0 ? (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-white/40 text-xs">
                  Your inventory backpack is currently empty. Visit the Store to buy cosmetics & boosts!
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-64 overflow-y-auto p-1">
                  {inventory.map((itemId, idx) => {
                    const isXpBoost = itemId === "boost-2x-xp";
                    const isCoinBoost = itemId === "boost-2x-coin";
                    const isEquipped = activeFrame === itemId || activeGrad === itemId;

                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          if (isXpBoost || isCoinBoost) {
                            handleActivateBoost(itemId);
                          } else {
                            equipItem?.(itemId.includes("gradient") ? "gradient" : "frame", isEquipped ? "" : itemId);
                          }
                        }}
                        className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-2 relative cursor-pointer group transition-all ${
                          isEquipped ? "bg-amber-400/20 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]" : "bg-neutral-900/90 border-white/10 hover:border-white/30"
                        }`}
                      >
                        {isXpBoost && <Zap className="w-8 h-8 text-purple-400 drop-shadow-md" />}
                        {isCoinBoost && <img src="/images/coin-zoomed.png" alt="Coin" className="w-8 h-8 object-contain drop-shadow-md" />}
                        {!isXpBoost && !isCoinBoost && <Shield className="w-7 h-7 text-cyan-400" />}

                        <span className="text-[9px] font-mono text-white/60 font-bold truncate w-full text-center mt-1">
                          {isXpBoost ? "2x XP" : isCoinBoost ? "2x Coin" : itemId.replace("gear-", "").replace("frame-", "")}
                        </span>

                        {isEquipped && (
                          <div className="absolute top-1 right-1 bg-amber-400 text-black rounded-full p-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Empty backpack slots placeholder */}
                  {Array.from({ length: Math.max(0, 15 - inventory.length) }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-2xl border border-white/5 bg-white/[0.01]" />
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {isSettingsModalOpen && <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />}
    </>
  );
}
