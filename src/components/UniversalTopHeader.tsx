"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Command, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderUserCapsules } from "@/components/HeaderUserCapsules";
import { AccountProfileModal } from "@/components/AccountProfileModal";

const SEARCH_ITEMS = [
  { title: "AP Biology", category: "Course", url: "/dashboard/ap-biology/preview" },
  { title: "AP Chemistry", category: "Course", url: "/dashboard/ap-chemistry/preview" },
  { title: "AP Calculus AB", category: "Course", url: "/dashboard/ap-calc-ab/preview" },
  { title: "AP Physics 1", category: "Course", url: "/dashboard/ap-physics-1/preview" },
  { title: "AP US History", category: "Course", url: "/dashboard/apush/preview" },
  { title: "Daily Quests", category: "Feature", url: "/dashboard/quests" },
  { title: "Global Leaderboard", category: "Feature", url: "/dashboard/leaderboard" },
  { title: "AI Study Assistant", category: "Feature", url: "/assistant" },
  { title: "Store & Cosmetics", category: "Feature", url: "/shop" },
];

export function UniversalTopHeader() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter((i) => i.title.toLowerCase().includes(query.toLowerCase()) || i.category.toLowerCase().includes(query.toLowerCase()))
    : SEARCH_ITEMS;

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#080911]/95 border-b border-white/[0.08] px-4 sm:px-8 py-3 flex items-center justify-between font-manrope">
        {/* Universal Search Bar (Extends horizontally all the way until streak capsule with h-12 matching height) */}
        <div className="relative flex-1 mr-4 sm:mr-6">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-4 w-4.5 h-4.5 text-white/50 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for anything"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full h-12 pl-11 pr-12 rounded-full bg-[#181a26] hover:bg-[#202232] border border-white/10 text-sm font-medium text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400/50 transition-all shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 text-white/40 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown Menu */}
          <AnimatePresence>
            {isSearchOpen && (
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsSearchOpen(false)} 
              />
            )}
            {isSearchOpen && filtered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="absolute left-0 top-full mt-2 w-full bg-[#121420] border border-white/15 rounded-2xl p-2 shadow-2xl z-40 max-h-72 overflow-y-auto custom-scrollbar text-left"
              >
                <span className="px-3 py-1.5 text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider block">
                  Quick Search Results
                </span>
                {filtered.map((item) => (
                  <button
                    key={item.url}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setQuery("");
                      router.push(item.url);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center justify-between text-xs text-white transition-all cursor-pointer group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <BookOpen className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold">{item.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      {item.category}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Top Right User Capsules (Streak, XP, Coins, Profile) */}
        <HeaderUserCapsules onOpenProfile={() => setShowProfileModal(true)} />
      </header>

      <AccountProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </>
  );
}
