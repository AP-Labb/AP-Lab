"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Palette, Check, Volume2, ShieldAlert, Trash2, Edit3, Camera, Pipette
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { UserAvatar } from "@/components/UserAvatar";
import { UserDisplayName } from "@/components/UserDisplayName";
import { ALL_COUNTRIES, COURSE_BG_THEMES } from "@/components/SettingsModal";
import { MinecraftInventoryModal } from "@/components/MinecraftInventoryModal";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "firebase/auth";
import { cn } from "@/lib/utils";

import { CustomColorPicker } from "@/components/CustomColorPicker";

const BANNER_COLORS = [
  { id: "#ef4444", name: "Coral Red", hex: "#ef4444" },
  { id: "#f59e0b", name: "Amber Gold", hex: "#f59e0b" },
  { id: "#84cc16", name: "Lime Green", hex: "#84cc16" },
  { id: "#10b981", name: "Emerald", hex: "#10b981" },
  { id: "#06b6d4", name: "Cyan", hex: "#06b6d4" },
  { id: "#0284c7", name: "Sky Blue", hex: "#0284c7" },
  { id: "#6366f1", name: "Indigo", hex: "#6366f1" },
  { id: "#7b39fc", name: "Primary Purple", hex: "#7b39fc" },
  { id: "#ec4899", name: "Magenta", hex: "#ec4899" },
  { id: "#f43f5e", name: "Rose", hex: "#f43f5e" },
  { id: "#090a12", name: "Obsidian", hex: "#090a12" },
];

const GRADUATION_YEARS = ["2024", "2025", "2026", "2027", "2028", "2029", "2030", "Other"];

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { progress, updatePreferences } = useProgress();
  const { currentUser } = useAuth();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"account" | "customize">("account");

  useEffect(() => {
    if (tabParam === "account" || tabParam === "customize") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Form states
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light">("dark");
  const [selectedBg, setSelectedBg] = useState<string>("dark-matrix");
  const [nameInput, setNameInput] = useState<string>("");
  const [bioInput, setBioInput] = useState<string>("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [gradYearInput, setGradYearInput] = useState<string>("2028");
  const [countrySearch, setCountrySearch] = useState<string>("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGradYearDropdown, setShowGradYearDropdown] = useState(false);
  const [showPfpModal, setShowPfpModal] = useState(false);
  const [selectedBannerColor, setSelectedBannerColor] = useState<string>("#7b39fc");
  const [voiceSetting, setVoiceSetting] = useState<string>("1");
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasModifiedColor, setHasModifiedColor] = useState(false);

  useEffect(() => {
    if (progress) {
      if (progress.theme) setSelectedTheme(progress.theme);
      if (progress.courseBg) setSelectedBg(progress.courseBg);
      setNameInput(progress.displayName || currentUser?.displayName || "");
      setBioInput(progress.bio || "");
      setLocationInput(progress.location || "");
      setGradYearInput(String(progress.graduationYear || "2028"));
      if (!hasModifiedColor && progress.profileBannerColor) {
        setSelectedBannerColor(progress.profileBannerColor);
      }
    }
    if (typeof window !== "undefined") {
      const savedVoice = localStorage.getItem("aplab_voice_setting") || "1";
      setVoiceSetting(savedVoice);
      const savedColor = localStorage.getItem("aplab-banner-color");
      if (savedColor && !hasModifiedColor) {
        setSelectedBannerColor(savedColor);
      }
    }
  }, [progress, currentUser, hasModifiedColor]);

  const handleTabChange = (tab: "account" | "customize") => {
    setActiveTab(tab);
    router.push(`/dashboard/settings?tab=${tab}`);
  };

  const handleBannerColorChange = (colorHex: string) => {
    setSelectedBannerColor(colorHex);
    setHasModifiedColor(true);
    if (typeof window !== "undefined") {
      try { localStorage.setItem("aplab-banner-color", colorHex); } catch (e) {}
    }
    if (updatePreferences) {
      updatePreferences({ profileBannerColor: colorHex });
    }
  };

  const handleThemeChange = (theme: "dark" | "light") => {
    setSelectedTheme(theme);
    if (updatePreferences) {
      updatePreferences({ theme });
    }
  };

  const handleBgChange = (bgId: string) => {
    setSelectedBg(bgId);
    if (updatePreferences) {
      updatePreferences({ courseBg: bgId });
    }
  };

  const handleVoiceChange = (id: string) => {
    setVoiceSetting(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("aplab_voice_setting", id);
    }
  };

  const handleSaveAccountInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentUser && nameInput.trim()) {
        await updateProfile(currentUser, { displayName: nameInput.trim() });
      }
      if (updatePreferences) {
        await updatePreferences({
          displayName: nameInput.trim(),
          bio: bioInput.trim(),
          location: locationInput.trim(),
          graduationYear: gradYearInput,
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error("Error saving account info:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-clip selection:bg-neutral-800 selection:text-white font-manrope">
      <title>Settings | AP Lab</title>

      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      <AppSidebar currentPath="/dashboard/settings" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        <UniversalTopHeader />

        <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 space-y-6">
          {/* TOP SETTINGS HEADER CARD (Knowt Style) */}
          <div className="bg-[#090a12] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_24px_60px_rgba(0,0,0,0.8)]">
            <div>
              <h1 className="font-manrope font-black text-3xl text-white tracking-tight">
                Settings
              </h1>
              <p className="text-sm font-manrope text-white/40 mt-1">
                Manage all your preferences
              </p>
            </div>

            {/* TAB SELECTOR BAR (Only Account & Customize) */}
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
              {[
                { id: "account", label: "Account", icon: User },
                { id: "customize", label: "Customize", icon: Palette },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-manrope font-bold transition-all cursor-pointer border whitespace-nowrap",
                      isActive
                        ? "bg-white text-black border-white shadow-lg"
                        : "bg-white/[0.03] hover:bg-white/[0.08] border-white/10 text-white/70 hover:text-white"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-black" : "text-white/60")} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: ACCOUNT */}
          {activeTab === "account" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Profile Details Form */}
              <form onSubmit={handleSaveAccountInfo} className="bg-[#090a12] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-manrope font-extrabold text-xl text-white">Account</h3>
                    <p className="text-xs text-white/40 font-manrope mt-0.5">
                      Update your public profile info, bio, and academic details.
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-manrope font-bold text-xs hover:bg-neutral-200 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {saving ? "Saving..." : savedSuccess ? "Saved!" : "Save Changes"}
                  </button>
                </div>

                {/* Avatar Display with Circular Edit Pencil Icon Badge */}
                <div className="flex items-center gap-5 pt-2 border-t border-white/[0.06]">
                  <div className="relative group">
                    <UserAvatar
                      photoURL={progress?.photoURL || currentUser?.photoURL}
                      name={nameInput}
                      activeFrame={progress?.activeAvatarFrame}
                      size="xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPfpModal(true)}
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#1c1e2e] border-2 border-[#090a12] text-white flex items-center justify-center shadow-lg hover:bg-white hover:text-black transition-all cursor-pointer"
                      title="Change PFP / Avatar Frame"
                    >
                      <Edit3 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <UserDisplayName
                      name={nameInput || "AP Scholar"}
                      activeNameColor={progress?.activeNameColor}
                      className="font-manrope font-extrabold text-lg text-white"
                    />
                    <p className="text-xs text-white/40 font-mono">{currentUser?.email || progress?.email || "scholar@aplab.org"}</p>
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                  <label className="text-sm font-manrope font-bold text-white/90 block">
                    Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter name..."
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm font-manrope focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Bio Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-sm font-manrope font-bold">
                    <span className="text-white/90">Bio / About You</span>
                    <span className={cn("text-xs font-mono font-normal", bioInput.length >= 150 ? "text-amber-400 font-bold" : "text-white/40")}>
                      {bioInput.length} / 160
                    </span>
                  </div>
                  <textarea
                    value={bioInput}
                    maxLength={160}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Tell scholars a bit about yourself..."
                    rows={3}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-manrope focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>

                {/* Location & Graduation Year Custom Pop-Down Dropdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Location Selector */}
                  <div className="space-y-1.5 relative">
                    <span className="text-sm font-manrope font-bold text-white/90 block">Location / Country</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLocationDropdown(!showLocationDropdown);
                        setShowGradYearDropdown(false);
                      }}
                      className="w-full flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-manrope text-left hover:border-white/20 transition-all cursor-pointer"
                    >
                      <span className="truncate">{locationInput || "N/A"}</span>
                      <span className="text-xs text-white/30">▼</span>
                    </button>

                    {showLocationDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#0e101a] border border-white/20 rounded-2xl shadow-2xl p-2 z-50 max-h-52 overflow-y-auto custom-scrollbar">
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Search countries..."
                          autoFocus
                          className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2 text-white text-xs placeholder-white/30 mb-2 focus:outline-none"
                        />
                        <div className="space-y-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setLocationInput("");
                              setShowLocationDropdown(false);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-xl text-xs font-manrope transition-colors",
                              !locationInput ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            N/A (Clear Location)
                          </button>
                          {ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase())).map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => {
                                setLocationInput(c);
                                setShowLocationDropdown(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-xl text-xs font-manrope transition-colors",
                                locationInput === c ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10 hover:text-white"
                              )}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Graduation Year Custom Pop-Down Dropdown */}
                  <div className="space-y-1.5 relative">
                    <span className="text-sm font-manrope font-bold text-white/90 block">Graduation Year</span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowGradYearDropdown(!showGradYearDropdown);
                        setShowLocationDropdown(false);
                      }}
                      className="w-full flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white text-xs font-manrope text-left hover:border-white/20 transition-all cursor-pointer"
                    >
                      <span className="truncate">Class of {gradYearInput}</span>
                      <span className="text-xs text-white/30">▼</span>
                    </button>

                    {showGradYearDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#0e101a] border border-white/20 rounded-2xl shadow-2xl p-2 z-50 max-h-52 overflow-y-auto custom-scrollbar">
                        <div className="space-y-0.5">
                          {GRADUATION_YEARS.map((yr) => (
                            <button
                              key={yr}
                              type="button"
                              onClick={() => {
                                setGradYearInput(yr);
                                setShowGradYearDropdown(false);
                              }}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded-xl text-xs font-manrope transition-colors",
                                gradYearInput === yr ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10 hover:text-white"
                              )}
                            >
                              Class of {yr}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>

              {/* Danger Zone / Delete Account */}
              <div className="bg-[#090a12] border border-red-500/20 rounded-3xl p-6 sm:p-8 space-y-4">
                <div>
                  <h3 className="font-manrope font-extrabold text-xl text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    Danger Zone
                  </h3>
                  <p className="text-xs text-white/40 font-manrope mt-0.5">
                    Irreversible account operations and data removal.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <div>
                    <p className="font-manrope font-bold text-sm text-white">Delete Account</p>
                    <p className="text-xs text-white/40">Permanently delete your AP Lab progress, coins, and profile data.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-bold font-manrope transition-all cursor-pointer"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: CUSTOMIZE */}
          {activeTab === "customize" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Appearance & Cover Banner Selector */}
              <div className="bg-[#090a12] border border-white/[0.08] rounded-3xl p-6 sm:p-8 space-y-5">
                <div>
                  <h3 className="font-manrope font-extrabold text-xl text-white">Appearance</h3>
                  <p className="text-xs text-white/40 font-manrope mt-0.5">
                    Change how your profile looks and feels.
                  </p>
                </div>

                {/* Profile Cover Banner Color Palette */}
                <div className="space-y-3 pt-2 border-t border-white/[0.06]">
                  <label className="text-sm font-manrope font-bold text-white/90 block">
                    Select cover color
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {BANNER_COLORS.map((color) => {
                      const isSelected = selectedBannerColor.toLowerCase() === color.hex.toLowerCase();
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => handleBannerColorChange(color.hex)}
                          className={cn(
                            "w-9 h-9 rounded-full transition-all flex items-center justify-center cursor-pointer border-2 relative",
                            isSelected ? "border-white scale-110 shadow-lg" : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"
                          )}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white drop-shadow stroke-[3]" />}
                        </button>
                      );
                    })}

                    {/* Custom Color Picker Button (Eyedropper with 2D Canvas Gradient Picker) */}
                    <CustomColorPicker color={selectedBannerColor} onChange={handleBannerColorChange} />
                  </div>
                </div>

                {/* Color Theme Mode Toggle */}
                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-manrope font-bold text-sm text-white">Theme Mode</p>
                      <p className="text-xs text-white/40">Switch between Dark Obsidian and Bright Light mode for course content.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleThemeChange(selectedTheme === "light" ? "dark" : "light")}
                      className={cn(
                        "relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        selectedTheme === "light" ? "bg-emerald-500" : "bg-white/20"
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                          selectedTheme === "light" ? "translate-x-5" : "translate-x-0"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Course Background Theme */}
                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <div>
                    <p className="font-manrope font-bold text-sm text-white">Course Background Theme</p>
                    <p className="text-xs text-white/40">Custom background visual overlays applied during study sessions.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {COURSE_BG_THEMES.map((theme) => {
                      const isSelected = selectedBg === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => handleBgChange(theme.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer",
                            isSelected
                              ? "bg-white/10 border-white/40 text-white shadow-lg"
                              : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-white/70"
                          )}
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className={`w-10 h-7 rounded-lg shrink-0 ${theme.miniPreviewClass}`}>
                              {theme.renderMini()}
                            </div>
                            <div>
                              <p className="font-manrope font-bold text-xs text-white">{theme.name}</p>
                              <p className="text-[10px] text-white/40 font-inter">{theme.desc}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Article Read Aloud Voice Profile */}
                <div className="space-y-3 pt-4 border-t border-white/[0.06]">
                  <div>
                    <p className="font-manrope font-bold text-sm text-white flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-violet-400" />
                      <span>Article Read Aloud Voice Profile</span>
                    </p>
                    <p className="text-xs text-white/40">Select your AI voiceover profile for reading articles and lessons.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: "1", name: "Natural US Female", desc: "Google Samantha" },
                      { id: "2", name: "Natural US Male", desc: "Alex / Daniel" },
                      { id: "3", name: "Natural UK Female", desc: "Karen / Serena" },
                      { id: "4", name: "Natural UK Male", desc: "Oliver / George" },
                    ].map((v) => {
                      const isSelected = voiceSetting === v.id;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => handleVoiceChange(v.id)}
                          className={cn(
                            "p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer",
                            isSelected
                              ? "bg-purple-600/20 border-purple-500/60 text-white shadow-md"
                              : "bg-white/[0.03] border-white/10 hover:bg-white/[0.07] text-white/70"
                          )}
                        >
                          <div className="flex items-center justify-between w-full mb-1">
                            <span className="font-manrope font-bold text-xs text-white">{v.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-purple-400 stroke-[3]" />}
                          </div>
                          <span className="text-[10px] font-mono text-white/40">{v.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* Delete Account Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0e101a] border border-red-500/30 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-bold text-xl text-white">Are you sure?</h3>
            <p className="text-xs text-white/60">
              This action cannot be undone. All your progress, XP, and coins will be permanently removed.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Account deletion request submitted.");
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PFP / Avatar Inventory Modal */}
      <MinecraftInventoryModal
        isOpen={showPfpModal}
        onClose={() => setShowPfpModal(false)}
      />
    </div>
  );
}
