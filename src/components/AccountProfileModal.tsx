"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Settings, LogOut, Package, Zap, Shield, Check } from "lucide-react";
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

  // Sync activeTab whenever defaultTab or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const xp = progress?.xp || 3060;
  const level = progress?.level || 14;
  const credits = progress?.credits || 0;
  const inventory = progress?.inventory || [];
  const activeFrame = progress?.activeAvatarFrame || "";
  const activeGrad = progress?.activeNameGradient || "";
  const displayName = progress?.displayName || currentUser?.displayName || "Yash Patil";
  const email = currentUser?.email || progress?.email || "lamermakerultragamer@gmail.com";
  const photoURL = currentUser?.photoURL || progress?.photoURL || "";
  const gradYear = progress?.graduationYear || "2028";

  const totalAnswered = progress?.totalQuestionsAnswered || 62;
  const totalCorrect = progress?.totalQuestionsCorrect || 1;
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 2;

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
          className="relative w-full max-w-lg bg-[#070913] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-7 text-white flex flex-col space-y-6"
        >
          {/* Top Header Row with User Avatar & Info */}
          <div className="flex items-start justify-between border-b border-white/10 pb-5">
            <div className="flex items-center space-x-4">
              {photoURL ? (
                <img src={photoURL} alt={displayName} className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500/80 shadow-md" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-manrope font-extrabold text-xl shadow-md">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left space-y-1">
                <div className="flex items-center space-x-2">
                  <h2 className="font-manrope font-extrabold text-xl text-white tracking-tight">{displayName}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-[10px] font-mono font-bold text-blue-300 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>SCHOLAR LVL {level}</span>
                  </span>
                </div>
                <p className="text-xs text-white/50 font-manrope flex items-center space-x-2">
                  <span>✉ {email}</span>
                </p>
                <p className="text-xs font-mono text-emerald-400 font-bold">
                  🎓 Class of {gradYear}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Sub-Tab Bar (Profile vs Inventory) */}
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 gap-1 font-manrope text-xs font-bold">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === "profile" ? "bg-white text-black font-extrabold shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile Stats</span>
            </button>
            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                activeTab === "inventory" ? "bg-white text-black font-extrabold shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>My Inventory ({inventory.length})</span>
            </button>
          </div>

          {usedMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
              {usedMsg}
            </div>
          )}

          {/* TAB 1: ACADEMIC PORTAL STATS (Matching Screenshot 3) */}
          {activeTab === "profile" && (
            <div className="space-y-5 text-left">
              <div className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
                ACADEMIC PORTAL STATS
              </div>

              {/* LEVEL PROGRESS BOX */}
              <div className="bg-[#0c0e1a] border border-white/10 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white/60 uppercase">LEVEL PROGRESS</span>
                  <span className="text-xs font-mono font-bold text-white/60">200 / 360 XP</span>
                </div>
                <div className="font-instrument text-2xl font-bold text-white">
                  Level {level}
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500 rounded-full w-[55%]" />
                </div>
                <div className="text-xs font-mono text-white/40 pt-1">
                  Total XP Earned: <span className="text-white/80 font-bold">{xp.toLocaleString()} XP</span>
                </div>
              </div>

              {/* 3 STAT CARDS ROW */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#0c0e1a] border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-mono font-bold text-white/40 uppercase leading-tight">QUESTIONS ANSWERED</span>
                  <span className="font-instrument text-3xl font-extrabold text-white mt-3">{totalAnswered}</span>
                </div>

                <div className="bg-[#0c0e1a] border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-mono font-bold text-white/40 uppercase leading-tight">CORRECT ANSWERS</span>
                  <span className="font-instrument text-3xl font-extrabold text-emerald-400 mt-3">{totalCorrect}</span>
                </div>

                <div className="bg-[#0c0e1a] border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-[9px] font-mono font-bold text-white/40 uppercase leading-tight">OVERALL ACCURACY</span>
                  <span className="font-instrument text-3xl font-extrabold text-emerald-400 mt-3">{accuracy}%</span>
                </div>
              </div>

              {/* COURSE COMPLETION PROGRESS BOX */}
              <div className="bg-[#0c0e1a] border border-white/10 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-manrope font-extrabold text-white text-sm">AP® Biology</h4>
                  <span className="text-xs font-mono font-bold text-emerald-400">0 / 25 Topics</span>
                </div>
                <div className="text-[10px] font-mono text-white/40 uppercase">COURSE COMPLETION PROGRESS</div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-emerald-500 rounded-full w-0" />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-1">
                  <span>0% Started</span>
                  <span>0% Mastered</span>
                </div>
              </div>

              {/* CLOSE PROFILE BUTTON */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-manrope font-bold text-xs transition-all cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY GRID (Item Backpack with uploaded Boost Icons) */}
          {activeTab === "inventory" && (
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-manrope text-xs font-extrabold text-white/80 uppercase tracking-wider">Your Item Backpack</h3>
                <span className="text-xs font-mono text-white/40">{inventory.length} items</span>
              </div>
              
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
                        {isXpBoost && (
                          <img src="/images/2x-xp-boost.png" alt="2X XP Boost" className="w-10 h-10 object-contain drop-shadow-md" />
                        )}
                        {isCoinBoost && (
                          <img src="/images/2x-coin-boost.png" alt="2X Coin Boost" className="w-10 h-10 object-contain drop-shadow-md" />
                        )}
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

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-manrope font-bold text-xs transition-all cursor-pointer"
                >
                  Close Inventory
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {isSettingsModalOpen && <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />}
    </>
  );
}
