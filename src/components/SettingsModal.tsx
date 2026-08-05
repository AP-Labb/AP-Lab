"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, User, Palette, Check, Settings, Info, Volume2 } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { updateProfile } from "firebase/auth";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ALL_COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "India", "Germany", "France", "Japan",
  "South Korea", "China", "Brazil", "Mexico", "Spain", "Italy", "Netherlands", "Sweden", "Norway",
  "Switzerland", "Singapore", "New Zealand", "Ireland", "Belgium", "Denmark", "Finland", "Austria",
  "Portugal", "Greece", "Poland", "Czech Republic", "Hungary", "Romania", "Turkey", "Egypt", "South Africa",
  "Nigeria", "Kenya", "Morocco", "United Arab Emirates", "Saudi Arabia", "Qatar", "Israel", "Argentina",
  "Chile", "Colombia", "Peru", "Philippines", "Vietnam", "Thailand", "Indonesia", "Malaysia", "Pakistan",
  "Bangladesh", "Taiwan", "Hong Kong", "Puerto Rico", "Ukraine", "Iceland", "Luxembourg", "Estonia",
  "Croatia", "Slovakia", "Slovenia", "Lithuania", "Latvia", "Bulgaria", "Cyprus", "Malta", "Other / Worldwide"
];

export const COURSE_BG_THEMES = [
  {
    id: "dark-matrix",
    name: "Dark Matrix Grid (Default)",
    desc: "Pure high-contrast dot matrix grid overlay",
    miniPreviewClass: "bg-[#03040a] relative overflow-hidden border border-white/20",
    renderMini: () => (
      <div className="absolute inset-0 bg-[#03040a]">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "6px 6px" }} />
      </div>
    )
  },
  {
    id: "toronto-skyline",
    name: "Toronto Night Skyline 4K",
    desc: "Vibrant CN Tower & waterfront reflections",
    miniPreviewClass: "relative overflow-hidden border border-white/20",
    renderMini: () => (
      <img src="/images/toronto-skyline-night.jpg" alt="Toronto" className="w-full h-full object-cover" />
    )
  },
  {
    id: "nyc-skyline",
    name: "New York City Skyline 4K",
    desc: "One World Trade Center & Manhattan night harbor",
    miniPreviewClass: "relative overflow-hidden border border-white/20",
    renderMini: () => (
      <img src="/images/nyc-skyline-night.jpg" alt="New York" className="w-full h-full object-cover" />
    )
  },
  {
    id: "shanghai-night",
    name: "Shanghai Waterfront 4K",
    desc: "Illuminated 4K Shanghai Pudong towers & river reflection",
    miniPreviewClass: "relative overflow-hidden border border-white/20",
    renderMini: () => (
      <img src="https://images.unsplash.com/photo-1506158669146-619067262a00?q=80&w=300&auto=format&fit=crop" alt="Shanghai" className="w-full h-full object-cover" />
    )
  },
  {
    id: "tokyo-neon",
    name: "Tokyo Tower & Neon City 4K",
    desc: "Vibrant high-resolution Tokyo skyline illuminated at night",
    miniPreviewClass: "relative overflow-hidden border border-white/20",
    renderMini: () => (
      <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=300&auto=format&fit=crop" alt="Tokyo" className="w-full h-full object-cover" />
    )
  },
  {
    id: "venice-sunset",
    name: "Venice Grand Canal 4K",
    desc: "Serene sunset over historic Venice waterways",
    miniPreviewClass: "relative overflow-hidden border border-white/20",
    renderMini: () => (
      <img src="https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=300&auto=format&fit=crop" alt="Venice" className="w-full h-full object-cover" />
    )
  },
  {
    id: "amalfi-coast",
    name: "Amalfi Coast Nightline 4K",
    desc: "Clifftop Italian coastal village with warm evening glows",
    miniPreviewClass: "relative overflow-hidden border border-white/20",
    renderMini: () => (
      <img src="https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=300&auto=format&fit=crop" alt="Amalfi" className="w-full h-full object-cover" />
    )
  }
];

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { progress, updatePreferences } = useProgress();
  const { currentUser } = useAuth();
  
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "light">("dark");
  const [selectedBg, setSelectedBg] = useState<string>("dark-matrix");
  const [nameInput, setNameInput] = useState<string>("");
  const [savingName, setSavingName] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [voiceSetting, setVoiceSetting] = useState<string>("1");
  const [bioInput, setBioInput] = useState<string>("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [gradYearInput, setGradYearInput] = useState<string>("2028");
  const [countrySearch, setCountrySearch] = useState<string>("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  useEffect(() => {
    if (progress) {
      if (progress.theme) setSelectedTheme(progress.theme);
      if (progress.courseBg) setSelectedBg(progress.courseBg);
      setNameInput(progress.displayName || currentUser?.displayName || "");
      setBioInput(progress.bio || "");
      setLocationInput(progress.location || "United States");
      setGradYearInput(String(progress.graduationYear || "2028"));
    }
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("aplab_voice_setting") || "1";
      setVoiceSetting(saved);
    }
  }, [progress, currentUser]);

  const handleVoiceChange = (id: string) => {
    setVoiceSetting(id);
    if (typeof window !== "undefined") {
      localStorage.setItem("aplab_voice_setting", id);
    }
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingName(true);
    try {
      if (currentUser && nameInput.trim()) {
        await updateProfile(currentUser, { displayName: nameInput.trim() });
      }
      if (updatePreferences) {
        await updatePreferences({
          displayName: nameInput.trim(),
          bio: bioInput.trim(),
          location: locationInput,
          graduationYear: gradYearInput,
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error("Error saving profile info:", err);
    } finally {
      setSavingName(false);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-[#080910] border border-white/10 rounded-2xl p-6 text-white z-10 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                <Settings className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-manrope font-bold text-lg text-white tracking-tight">
                  Settings
                </h3>
                <p className="text-white/40 text-xs font-inter">
                  Manage interface theme & account parameters
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Modal Content */}
          <div className="space-y-6 py-5 overflow-y-auto custom-scrollbar flex-1 pr-1" onWheel={(e) => e.stopPropagation()}>

            {/* 1. Theme Selector (Apple-Style Minimal Toggle Switch) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-white/60" />
                  <span>Color Theme Mode</span>
                </label>

                {/* Indicator Mark with Hover Tooltip */}
                <div className="relative flex items-center group/tooltip cursor-pointer">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono">
                    <Info className="w-3 h-3" />
                    <span>Info</span>
                  </div>
                  {/* Tooltip Popup */}
                  <div className="absolute right-0 top-full mt-1.5 hidden group-hover/tooltip:block w-52 p-2.5 rounded-xl bg-[#0f111a] border border-white/20 text-[11px] text-white/90 shadow-2xl z-50 font-inter pointer-events-none leading-tight">
                    Light mode is only applied to course pages.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedTheme === "light" ? "bg-white/15 text-white" : "bg-blue-500/20 text-blue-400"}`}>
                    {selectedTheme === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-manrope font-semibold text-xs text-white">
                      {selectedTheme === "light" ? "Light Theme" : "Dark Theme"}
                    </p>
                    <p className="text-[10px] text-white/40 font-inter">
                      {selectedTheme === "light" ? "Bright contrast mode" : "Dark obsidian mode"}
                    </p>
                  </div>
                </div>

                {/* Apple Toggle Switch */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newTheme = selectedTheme === "light" ? "dark" : "light";
                    handleThemeChange(newTheme);
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    selectedTheme === "light" ? "bg-[#34c759]" : "bg-white/20"
                  }`}
                  aria-label="Toggle light/dark theme"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      selectedTheme === "light" ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 2. Profile Information (Display Name, Bio, Location with Search, Graduation Year) */}
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-white/60" />
                  <span>Profile Information</span>
                </label>
                <button
                  type="submit"
                  disabled={savingName}
                  className="px-4 py-1.5 rounded-xl bg-white text-black font-manrope font-bold text-xs hover:bg-neutral-200 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
                >
                  {savingName ? "Saving..." : savedSuccess ? "Saved!" : "Save Profile"}
                </button>
              </div>

              {/* Display Name */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Display Name</span>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter display name..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-manrope font-medium text-xs transition-colors"
                />
              </div>

              {/* Bio Field with 160 character limit */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-white/40">Bio / About You</span>
                  <span className={bioInput.length >= 150 ? "text-amber-400 font-bold" : "text-white/30"}>
                    {bioInput.length} / 160
                  </span>
                </div>
                <textarea
                  value={bioInput}
                  maxLength={160}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Tell scholars a bit about yourself..."
                  rows={3}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-white/30 font-manrope font-medium text-xs transition-colors resize-none"
                />
              </div>

              {/* Location & Graduation Year Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Location Search Dropdown */}
                <div className="space-y-1.5 relative">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Location / Country</span>
                  <button
                    type="button"
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                    className="w-full flex items-center justify-between bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-manrope text-left"
                  >
                    <span className="truncate">{locationInput || "Select country..."}</span>
                    <span className="text-[10px] text-white/30">▼</span>
                  </button>

                  {/* Searchable Dropdown Popup */}
                  {showLocationDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#0e101a] border border-white/20 rounded-xl shadow-2xl p-2 z-50 max-h-48 overflow-y-auto custom-scrollbar">
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search countries..."
                        autoFocus
                        className="w-full bg-white/[0.06] border border-white/10 rounded-lg px-2.5 py-1.5 text-white text-xs placeholder-white/30 mb-2 focus:outline-none"
                      />
                      <div className="space-y-0.5">
                        {ALL_COUNTRIES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase())).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setLocationInput(c);
                              setShowLocationDropdown(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-manrope transition-colors ${
                              locationInput === c ? "bg-white/20 text-white font-bold" : "text-white/70 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Graduation Year Select */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Graduation Year</span>
                  <select
                    value={gradYearInput}
                    onChange={(e) => setGradYearInput(e.target.value)}
                    className="w-full bg-[#0d0f19] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs font-manrope focus:outline-none"
                  >
                    {["2024", "2025", "2026", "2027", "2028", "2029", "2030", "Other"].map((yr) => (
                      <option key={yr} value={yr} className="bg-[#0e101a] text-white">
                        Class of {yr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>

            {/* 3. Course Page Background Image Theme */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-white/60" />
                  <span>Course Page Background Theme</span>
                </label>
              </div>

              {/* Disclaimer Notice */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-inter">
                <Info className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                <span>Note: Custom course background themes are applied during Dark Mode.</span>
              </div>

              {/* Actual Background Visual Mini Preview Rectangles */}
              <div className="space-y-2 pt-1">
                {COURSE_BG_THEMES.map((theme) => {
                  const isSelected = selectedBg === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleBgChange(theme.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                        isSelected
                          ? "bg-white/10 border-white/40 text-white shadow-lg"
                          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-white/70"
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        {/* Mini Actual Background Visual Preview */}
                        <div className={`w-10 h-7 rounded-lg shrink-0 ${theme.miniPreviewClass}`}>
                          {theme.renderMini()}
                        </div>

                        <div>
                          <p className="font-manrope font-bold text-xs text-white">{theme.name}</p>
                          <p className="text-[10px] text-white/40 font-inter">{theme.desc}</p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-black shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Audio Voice Selector (4 Global Options) */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-mono font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-white/60" />
                <span>Article Read Aloud Voice Profile</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "1", name: "Natural US Female", desc: "Google / Samantha" },
                  { id: "2", name: "Natural US Male", desc: "Daniel / Alex" },
                  { id: "3", name: "Natural UK Female", desc: "Karen / Serena" },
                  { id: "4", name: "Natural UK Male", desc: "Oliver / George" },
                ].map((v) => {
                  const isSelected = voiceSetting === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => handleVoiceChange(v.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? "bg-purple-600/20 border-purple-500/60 text-white shadow-md"
                          : "bg-white/[0.03] border-white/10 hover:bg-white/[0.07] text-white/70"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="font-manrope font-bold text-xs text-white">{v.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <span className="text-[10px] text-white/40 font-sans">{v.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer Close */}
          <div className="pt-3 border-t border-white/10 flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-manrope font-bold text-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
