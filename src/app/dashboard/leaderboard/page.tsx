"use client";

import React from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { LevelLeaderboard } from "@/components/LevelLeaderboard";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-clip selection:bg-neutral-800 selection:text-white font-manrope">
      {/* Clean Grid Background Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      {/* Unified App Sidebar */}
      <AppSidebar currentPath="/dashboard/leaderboard" />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8 pb-20 text-left">
          {/* Global Level Leaderboard Component */}
          <div className="w-full">
            <LevelLeaderboard />
          </div>
        </main>
      </div>
    </div>
  );
}
