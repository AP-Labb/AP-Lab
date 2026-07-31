"use client";

import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { LevelLeaderboard } from "@/components/LevelLeaderboard";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[#030408] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] text-white flex flex-row relative z-0 overflow-x-hidden selection:bg-neutral-800 selection:text-white font-manrope">
      {/* Unified App Sidebar */}
      <AppSidebar currentPath="/dashboard/leaderboard" />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-16">
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8 pb-20 text-left">
          {/* Page Header */}
          <div className="flex items-center space-x-4 border-b border-white/10 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-xl">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-instrument text-3xl font-extrabold text-white tracking-tight">Global Leaderboard</h1>
              <p className="text-xs text-white/50 font-manrope mt-1">Real-time level rankings & top AP scholars across all courses</p>
            </div>
          </div>

          {/* Global Level Leaderboard Component */}
          <div className="w-full">
            <LevelLeaderboard />
          </div>
        </main>
      </div>
    </div>
  );
}
