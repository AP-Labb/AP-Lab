"use client";

import React, { useState } from "react";
import { Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { SettingsModal } from "@/components/SettingsModal";
import { cn } from "@/lib/utils";

interface AccountNavbarWidgetProps {
  onOpenProfile: () => void;
}

export function AccountNavbarWidget({ onOpenProfile }: AccountNavbarWidgetProps) {
  const { currentUser } = useAuth();
  const { progress } = useProgress();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isLightMode = progress?.theme === "light";

  const displayName = progress?.displayName || currentUser?.displayName || "Scholar";
  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "AP";
  const photoURL = currentUser?.photoURL || progress?.photoURL || "";
  const totalXp = progress?.xp || 0;
  const level = progress?.level || 1;

  return (
    <>
      {/* Single Unified Rectangle Capsule containing Profile + Gear Icon inside */}
      <div 
        className={cn(
          "flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl border transition-all duration-300 shadow-md select-none group",
          isLightMode 
            ? "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-900" 
            : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white"
        )}
      >
        {/* Left Section: Clickable Profile Info (Avatar, Name, XP) */}
        <button
          onClick={onOpenProfile}
          className="flex items-center space-x-2.5 cursor-pointer text-left focus:outline-none"
          title="View Account Profile"
        >
          {/* Avatar Picture */}
          <div className="relative shrink-0">
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName}
                className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border transition-colors", isLightMode ? "border-slate-300 group-hover:border-slate-400" : "border-white/20 group-hover:border-white/40")}
              />
            ) : (
              <div className={cn("w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center font-manrope font-bold text-xs", isLightMode ? "bg-slate-100 border-slate-300 text-slate-900" : "bg-white/10 border-white/15 text-white/90")}>
                {initials}
              </div>
            )}
          </div>

          {/* Account Name & Total XP + Credits */}
          <div className="flex flex-col items-start text-left min-w-0">
            <span className={cn("font-manrope font-extrabold text-xs sm:text-sm tracking-tight leading-none transition-colors truncate max-w-[90px] sm:max-w-[120px]", isLightMode ? "text-slate-900 group-hover:text-emerald-600" : "text-white group-hover:text-emerald-400")}>
              {displayName}
            </span>
            <div className="flex items-center gap-2 mt-0.5 whitespace-nowrap font-mono font-bold text-[9px] sm:text-[10px]">
              <span className={cn("flex items-center gap-1", isLightMode ? "text-slate-600" : "text-white/50")}>
                <img src="/images/xp-shield-exact.png" alt="XP" className="w-5 h-5 inline object-contain" />
                Lvl {level} • {totalXp.toLocaleString()}
              </span>
              <span className="text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full border border-amber-400/20 font-manrope font-extrabold flex items-center gap-1">
                <img src="/images/coin-exact.png" alt="Coins" className="w-5 h-5 inline object-contain" />
                {(progress?.credits || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </button>

        {/* Subtle Vertical Divider */}
        <div className={cn("w-[1px] h-5 mx-0.5 shrink-0", isLightMode ? "bg-slate-200" : "bg-white/15")} />

        {/* Right Section: Settings Gear Icon inside the exact same rectangle */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className={cn("p-1 rounded-lg transition-all cursor-pointer shrink-0 focus:outline-none", isLightMode ? "hover:bg-slate-100 text-slate-700 hover:text-slate-900" : "hover:bg-white/10 text-white/70 hover:text-white")}
          title="Workspace Settings"
        >
          <Settings className="w-4 h-4 hover:rotate-180 transition-transform duration-700 ease-in-out" />
        </button>
      </div>

      {/* Settings Modal (Portalized to document.body) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
