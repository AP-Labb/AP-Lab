"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/UserAvatar";

interface MinecraftInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MinecraftInventoryModal({ isOpen, onClose }: MinecraftInventoryModalProps) {
  const { currentUser } = useAuth();
  const { progress, equipItem, useBoostItem } = useProgress();
  const [hoveredSlotInfo, setHoveredSlotInfo] = useState<string | null>(null);
  const [activeMsg, setActiveMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const inventory = progress?.inventory || [];
  const activeFrame = progress?.activeAvatarFrame || "";
  const activeGrad = progress?.activeNameGradient || "";
  const displayName = progress?.displayName || currentUser?.displayName || "Steve";
  const photoURL = currentUser?.photoURL || progress?.photoURL || "";

  // Group inventory items by count
  const itemCounts: Record<string, number> = {};
  inventory.forEach((id) => {
    itemCounts[id] = (itemCounts[id] || 0) + 1;
  });

  const uniqueItems = Object.keys(itemCounts);

  const getItemDetails = (id: string) => {
    if (id === "boost-2x-xp") return { name: "2x XP Boost", type: "boost", desc: "Grants 2x Double XP for 10 hours", icon: "/images/2x-xp-boost.png" };
    if (id === "boost-2x-coin") return { name: "2x Coin Boost", type: "boost", desc: "Grants 2x Double Coins for 10 hours", icon: "/images/2x-coin-boost.png" };
    if (id === "gear-top-hat") return { name: "Top Hat", type: "frame", desc: "Black magician top hat", icon: "/images/avatar-gear/top-hat.png" };
    if (id === "gear-purple-beanie") return { name: "Purple Beanie", type: "frame", desc: "Winter beanie with pom pom", icon: "/images/avatar-gear/purple-beanie.png" };
    if (id === "gear-purple-party-hat") return { name: "Purple Party Hat", type: "frame", desc: "Striped party cone hat", icon: "/images/avatar-gear/purple-party-hat.png" };
    if (id === "gear-golden-crown") return { name: "Golden Crown", type: "frame", desc: "24k gold scholar crown", icon: "/images/avatar-gear/golden-crown.png" };
    if (id === "gear-neon-pink-visor") return { name: "Cyber Neon Visor", type: "frame", desc: "Futuristic pink visor glasses", icon: "/images/avatar-gear/neon-pink-visor.png" };
    if (id === "gear-dark-cyber-visor") return { name: "Dark Cyber Visor", type: "frame", desc: "Tactical dark sunglasses", icon: "/images/avatar-gear/dark-cyber-visor.png" };
    if (id === "gear-face-mask") return { name: "Face Mask", type: "frame", desc: "Blue surgical face mask", icon: "/images/avatar-gear/face-mask.png" };
    if (id === "gear-heart-necklace") return { name: "Heart Necklace", type: "frame", desc: "Pink gem heart pendant", icon: "/images/avatar-gear/heart-necklace.png" };
    if (id === "gear-gold-chain") return { name: "Gold Chain", type: "frame", desc: "24k gold Cuban link chain", icon: "/images/avatar-gear/gold-chain.png" };
    if (id === "custom-name-color") return { name: "Custom Name Color", type: "color-picker", desc: "Custom display name color", icon: "🎨" };
    return { name: id.replace("gear-", "").replace("frame-", ""), type: "item", desc: "Cosmetic Item", icon: "🛡️" };
  };

  const handleSlotClick = async (itemId: string) => {
    if (itemId === "boost-2x-xp" || itemId === "boost-2x-coin") {
      const ok = await useBoostItem?.(itemId);
      if (ok) {
        setActiveMsg(`Activated 10-Hour ${itemId === "boost-2x-xp" ? "2x XP" : "2x Coin"} Boost!`);
        setTimeout(() => setActiveMsg(null), 3000);
      }
    } else {
      const details = getItemDetails(itemId);
      const isEquipped = activeFrame === itemId || activeGrad === itemId;
      equipItem?.(details.type === "gradient" ? "gradient" : "frame", isEquipped ? "" : itemId);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999999] flex items-center justify-center p-4 font-mono select-none"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#c6c6c6] border-4 border-[#373737] p-5 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-black rounded-sm"
        style={{
          boxShadow: "inset -4px -4px 0px 0px #555555, inset 4px 4px 0px 0px #ffffff"
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#555555] pb-2 mb-4">
          <span className="font-bold text-sm tracking-wider text-[#373737]">PLAYER INVENTORY</span>
          <button 
            onClick={onClose}
            className="w-6 h-6 bg-[#c6c6c6] border-2 border-[#ffffff] border-r-[#555555] border-b-[#555555] flex items-center justify-center text-xs font-bold active:translate-y-0.5"
          >
            <X className="w-3.5 h-3.5 text-[#373737]" />
          </button>
        </div>

        {activeMsg && (
          <div className="mb-3 p-2 bg-[#55ff55]/30 border-2 border-[#00aa00] text-[#006600] text-xs font-bold text-center">
            {activeMsg}
          </div>
        )}

        {/* Player Profile Header Card */}
        <div className="flex items-center space-x-4 bg-[#8b8b8b] border-2 border-[#373737] p-3 mb-4">
          <UserAvatar photoURL={photoURL} name={displayName} activeFrame={activeFrame} size="lg" />
          <div className="text-left leading-tight">
            <span className="font-bold text-sm text-white block drop-shadow-[#373737]">{displayName}</span>
            <span className="text-xs text-[#e0e0e0] block">Level {progress?.level || 1} Scholar</span>
            <span className="text-xs text-[#ffff55] font-bold block mt-0.5">{progress?.credits || 0} Coins</span>
          </div>
        </div>

        {/* Inventory Item Backpack Section */}
        <div className="text-left text-xs font-bold text-[#373737] mb-1.5 flex justify-between items-center">
          <span>Backpack Items</span>
          <span className="text-[10px] text-[#555555]">{inventory.length} total</span>
        </div>

        {/* 9x3 Item Grid Slots */}
        <div className="grid grid-cols-9 gap-1.5 bg-[#8b8b8b] p-2.5 border-2 border-[#373737] border-r-[#ffffff] border-b-[#ffffff] mb-3">
          {Array.from({ length: 27 }).map((_, idx) => {
            const itemId = uniqueItems[idx];
            const count = itemId ? itemCounts[itemId] : 0;
            const details = itemId ? getItemDetails(itemId) : null;
            const isEquipped = itemId && (activeFrame === itemId || activeGrad === itemId);

            return (
              <div
                key={idx}
                onMouseEnter={() => details && setHoveredSlotInfo(`${details.name}: ${details.desc}`)}
                onMouseLeave={() => setHoveredSlotInfo(null)}
                onClick={() => itemId && handleSlotClick(itemId)}
                className={`relative w-11 h-11 bg-[#8b8b8b] border-2 flex items-center justify-center cursor-pointer transition-all ${
                  itemId ? "hover:bg-[#a0a0a0] active:translate-y-0.5" : ""
                } ${
                  isEquipped ? "border-amber-400 bg-amber-200/50" : "border-[#373737] border-r-[#ffffff] border-b-[#ffffff]"
                }`}
              >
                {details && (
                  <>
                    {details.icon.startsWith("/") ? (
                      <img src={details.icon} alt={details.name} className="w-8 h-8 object-contain drop-shadow" />
                    ) : (
                      <span className="text-lg">{details.icon}</span>
                    )}

                    {count > 1 && (
                      <span className="absolute bottom-0.5 right-1 text-[10px] font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                        {count}
                      </span>
                    )}

                    {isEquipped && (
                      <span className="absolute top-0.5 left-0.5 bg-amber-500 text-black text-[8px] px-0.5 rounded font-extrabold">
                        EQ
                      </span>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Hover Slot Tooltip Description */}
        <div className="h-6 text-left">
          {hoveredSlotInfo ? (
            <span className="text-xs font-bold text-[#006600] bg-[#e0e0e0] px-2 py-1 border border-[#555555] inline-block">
              {hoveredSlotInfo}
            </span>
          ) : (
            <span className="text-[10px] text-[#555555] italic">Hover over items to view details. Click to activate boost / equip.</span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
