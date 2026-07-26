"use client";

import { LevelBadge } from "@/components/LevelBadge";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { Flame, Play, Calendar, Calculator, Minus, X, GripHorizontal } from "lucide-react";
import BorderGlow from "@/components/BorderGlow";

export function AppShowcase() {
  const [isLeaderboardHovered, setIsLeaderboardHovered] = useState(false);

  const leaderboardUsers = isLeaderboardHovered ? [
    { id: "2", rank: 1, name: "Sofia Rodriguez", lvl: 29, xp: "12.8k XP" },
    { id: "1", rank: 2, name: "Tyler Davis", lvl: 26, xp: "10.4k XP" },
    { id: "3", rank: 3, name: "Alex Mercer", lvl: 25, xp: "8.0k XP" }
  ] : [
    { id: "1", rank: 1, name: "Tyler Davis", lvl: 29, xp: "10.4k XP" },
    { id: "2", rank: 2, name: "Sofia Rodriguez", lvl: 26, xp: "8.6k XP" },
    { id: "3", rank: 3, name: "Alex Mercer", lvl: 25, xp: "8.0k XP" }
  ];

  return (
    <section className="relative w-full py-[140px] px-4 sm:px-6 md:px-[120px] bg-transparent">
      {/* Seamless blend: fade in from above (deep-navy) and out to below (deep-navy) */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep-navy via-[#0c0d12] to-deep-navy pointer-events-none" />
      {/* Background Decorative Elements - Monochrome dual grid and spotlights */}
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute inset-0 grid-pattern-bold opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.02)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.015] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-inter font-extrabold text-white text-3xl md:text-5xl tracking-tight mb-4"
          >
            Included Workspace
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-inter text-white/50 text-sm md:text-base max-w-lg mx-auto leading-relaxed"
          >
            Experience the most advanced academic interface ever designed. Precision, speed, and aesthetics blended into one seamless portal.
          </motion.p>
        </div>

        {/* Sticky Scroll-Into-Each-Other Stacking Bento Grid */}
        <div className="relative w-full max-w-6xl mx-auto space-y-28 md:space-y-36 pb-32">
          
          {/* ROW 1 STICKY STACK (Gamification & Interactive Lessons) */}
          <div className="sticky top-[100px] z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Box 1 (Top Left) - GAMIFICATION (Pitch Black Card -> Light Monochrome Gradient Glow) */}
              <BorderGlow colors={['#ffffff', '#cbd5e1', '#64748b']} glowColor="0 0% 100%" borderRadius={32} backgroundColor="#000000" className="h-[450px]">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  onMouseEnter={() => setIsLeaderboardHovered(true)}
                  onMouseLeave={() => setIsLeaderboardHovered(false)}
                  className="h-full flex flex-col justify-between p-8 md:p-10 relative overflow-hidden group bg-black cursor-pointer"
                >
                  <div className="text-center relative z-10 flex flex-col items-center">
                    <span className="text-[10px] font-mono tracking-widest text-white/40 font-bold uppercase mb-1">GAMIFICATION</span>
                    <h3 className="text-2xl md:text-3xl font-inter font-bold text-white tracking-tight">Academic Progression & Badges.</h3>
                    <p className="text-white/50 font-inter text-xs max-w-sm mt-2 leading-relaxed">
                      Earn XP across all courses to level up and climb the live global leaderboard.
                    </p>
                  </div>

                  <div className="relative w-full flex-1 flex items-center justify-center z-10 mt-2">
                    <div className="flex flex-col space-y-2 bg-[#ffffff] border border-neutral-200 rounded-2xl p-4 w-full max-w-[300px] text-left shadow-lg group-hover:scale-[1.04] transition-transform duration-500 ease-out">
                      {leaderboardUsers.map((user) => (
                        <motion.div 
                          key={user.id} 
                          layout
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className="flex items-center justify-between bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono font-bold text-neutral-400 w-3">#{user.rank}</span>
                            <LevelBadge level={user.lvl} showLabel={false} size="sm" className="scale-75 origin-center shrink-0 -mx-1" />
                            <div className="flex flex-col">
                              <span className="text-[11px] font-manrope font-bold text-neutral-800 leading-tight">{user.name}</span>
                              <span className="text-[8px] font-mono text-neutral-400 mt-0.5">Level {user.lvl}</span>
                            </div>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-neutral-600 bg-neutral-200/50 px-2 py-0.5 rounded">{user.xp}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </BorderGlow>

              {/* Box 2 (Top Right) - INTERACTIVE LESSONS (White Card -> Dark Monochrome Gradient Glow) */}
              <BorderGlow colors={['#000000', '#334155', '#1e293b']} glowColor="0 0% 0%" borderRadius={32} backgroundColor="#ffffff" className="h-[450px]">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="h-full flex flex-col justify-between p-8 md:p-10 relative overflow-hidden group bg-white"
                >
                  <div className="text-center relative z-10 flex flex-col items-center">
                    <span className="text-[10px] font-mono tracking-widest text-black/40 font-bold uppercase mb-1">INTERACTIVE LESSONS</span>
                    <h3 className="text-2xl md:text-3xl font-inter font-bold text-black tracking-tight mb-1">Interactive Course Guides.</h3>
                    <p className="text-black/50 font-inter text-xs max-w-sm mt-1 leading-relaxed">
                      Seamless curriculum mapping of video modules, reading articles, and interactive visual aids.
                    </p>
                  </div>

                  <div className="relative w-full flex-1 flex items-center justify-center z-10 mt-2 px-1">
                    <div className="w-full max-w-[400px] h-[235px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neutral-800 group-hover:scale-[1.03] transition-transform duration-500 bg-[#07080f] p-1 flex items-center justify-center">
                      <img 
                        src="/images/interactive-lesson-showcase.png" 
                        alt="Interactive Course Guides" 
                        className="w-full h-full object-contain rounded-xl"
                      />
                    </div>
                  </div>
                </motion.div>
              </BorderGlow>
            </div>
          </div>

          {/* ROW 2 STICKY STACK (Embedded Desmos Calculator & Mock Exams) */}
          <div className="sticky top-[125px] z-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Box 3 (Bottom Left) - EMBEDDED GRAPHING CALCULATOR (White Card -> Dark Monochrome Gradient Glow) */}
              <BorderGlow colors={['#000000', '#334155', '#1e293b']} glowColor="0 0% 0%" borderRadius={32} backgroundColor="#ffffff" className="h-[460px]">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="h-full flex flex-col justify-between p-6 sm:p-7 relative overflow-hidden group bg-white"
                >
                  <div className="text-center relative z-10 flex flex-col items-center shrink-0">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-600 font-extrabold uppercase mb-1">EMBEDDED CALCULATOR</span>
                    <h3 className="text-xl md:text-2xl font-inter font-bold text-black tracking-tight mb-1">Built-in Desmos® Graphing Calculator.</h3>
                    <p className="text-neutral-500 font-inter text-xs max-w-sm leading-relaxed">
                      Seamlessly plot functions, solve equations, and analyze datasets with an integrated, floating Desmos graphing window during practice and mock exams.
                    </p>
                  </div>

                  <div className="w-full max-w-[420px] mx-auto relative z-10 transition-all duration-300 group-hover:scale-[1.03] -mt-5 shrink-0">
                    <div className="bg-[#0c0d16] border border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden text-left font-sans">
                      <div className="flex items-center justify-between px-3.5 py-2 bg-[#131524] border-b border-white/10 select-none">
                        <div className="flex items-center space-x-2">
                          <GripHorizontal className="w-3.5 h-3.5 text-white/40" />
                          <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <Calculator className="w-3 h-3 text-emerald-400" />
                          </div>
                          <span className="font-manrope font-bold text-[11px] text-white tracking-wide">
                            Desmos® Graphing Calculator
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <div className="w-4 h-4 rounded flex items-center justify-center text-white/40 hover:text-white">
                            <Minus className="w-3 h-3" />
                          </div>
                          <div className="w-4 h-4 rounded flex items-center justify-center text-white/40 hover:text-white">
                            <X className="w-3 h-3" />
                          </div>
                        </div>
                      </div>

                      <div className="relative w-full h-[195px] overflow-hidden bg-[#1a1a1a]">
                        <img 
                          src="/images/desmos-showcase.png" 
                          alt="Desmos Graphing Calculator" 
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </BorderGlow>

              {/* Box 4 (Bottom Right) - EXAM SIMULATOR (Pitch Black Card -> Light Monochrome Gradient Glow) */}
              <BorderGlow colors={['#ffffff', '#cbd5e1', '#64748b']} glowColor="0 0% 100%" borderRadius={32} backgroundColor="#000000" className="h-[460px]">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="h-full flex flex-col justify-between p-6 sm:p-7 relative overflow-hidden group bg-black"
                >
                  <div className="text-center relative z-10 flex flex-col items-center shrink-0">
                    <span className="text-[10px] font-mono tracking-widest text-white/40 font-bold uppercase mb-1">EXAM SIMULATOR</span>
                    <h3 className="text-xl md:text-2xl font-inter font-bold text-white tracking-tight mb-1">Comprehensive Mock Diagnostics.</h3>
                    <p className="text-white/50 font-inter text-xs max-w-sm leading-relaxed">
                      Full-length, timed diagnostic mock exams built to match the exact scoring weight of the actual test.
                    </p>
                  </div>

                  <div className="relative w-full flex-1 flex items-center justify-center z-10 mt-1 px-1">
                    <div className="w-full max-w-[420px] h-[240px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10 group-hover:scale-[1.04] transition-transform duration-500 bg-[#07080f]">
                      <img 
                        src="/images/mock-exam-showcase.png" 
                        alt="Comprehensive Mock Diagnostics" 
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  </div>
                </motion.div>
              </BorderGlow>
            </div>
          </div>

          {/* ROW 3 STICKY STACK (Progress Tracking & Video Lessons) */}
          <div className="sticky top-[150px] z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Box 5 (Bottom Left) - PROGRESS TRACKING (Pitch Black Card -> Light Monochrome Gradient Glow) */}
              <BorderGlow colors={['#ffffff', '#cbd5e1', '#64748b']} glowColor="0 0% 100%" borderRadius={32} backgroundColor="#000000" className="h-[450px]">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="h-full flex flex-col justify-between p-8 relative overflow-hidden group bg-black col-span-1"
                >
                  <div className="text-left z-10 shrink-0">
                    <span className="text-[10px] font-mono tracking-widest text-white/40 font-bold uppercase mb-1">PROGRESS TRACKING</span>
                    <h3 className="text-2xl font-inter font-bold text-white tracking-tight">Real-Time Performance Metrics.</h3>
                    <p className="text-white/50 font-inter text-[11px] max-w-sm mt-1 leading-relaxed">
                      Track your syllabus progress and daily learning habits in one unified place.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:border-white/10 transition-colors w-full mt-2.5 z-10 flex-1 min-h-[220px] shrink-0">
                    <div className="flex items-center space-x-2 mb-3 text-white shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                      <span className="text-[13px] font-mono font-bold uppercase tracking-wider text-white">Activity Calendar</span>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-around w-full">
                      <div className="grid grid-cols-7 gap-2 text-center w-full text-[11px] font-mono text-white/40 font-bold uppercase mb-2 shrink-0">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                          <div key={idx}>{day}</div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-2 w-full">
                        {Array.from({ length: 28 }).map((_, idx) => {
                          const dayNum = idx - 2;
                          const isValid = dayNum > 0 && dayNum <= 25;
                          
                          let bgClass = "bg-white/[0.02] border-white/5 text-white/20 opacity-30 cursor-default select-none";
                          let displayDay = "";
                          let xpGained = 0;
                          
                          if (isValid) {
                            const activeDays = {
                              1: { bg: "bg-emerald-950/40 border-emerald-500/30 text-emerald-400", xp: 50 },
                              2: { bg: "bg-emerald-900/50 border-emerald-500/40 text-emerald-300", xp: 150 },
                              4: { bg: "bg-emerald-500/25 border-emerald-500/60 text-emerald-100 font-black", xp: 450 },
                              5: { bg: "bg-emerald-500/25 border-emerald-500/60 text-emerald-100 font-black", xp: 350 },
                              8: { bg: "bg-emerald-950/40 border-emerald-500/30 text-emerald-400", xp: 75 },
                              9: { bg: "bg-emerald-900/50 border-emerald-500/40 text-emerald-300", xp: 200 },
                              14: { bg: "bg-emerald-500/25 border-emerald-500/60 text-emerald-100 font-black", xp: 400 },
                              15: { bg: "bg-emerald-500/25 border-emerald-500/60 text-emerald-100 font-black", xp: 300 },
                              16: { bg: "bg-emerald-900/50 border-emerald-500/40 text-emerald-300", xp: 180 },
                              20: { bg: "bg-emerald-950/40 border-emerald-500/30 text-emerald-400", xp: 90 },
                              21: { bg: "bg-emerald-900/50 border-emerald-500/40 text-emerald-300", xp: 220 },
                              22: { bg: "bg-emerald-500/25 border-emerald-500/60 text-emerald-100 font-black", xp: 500 },
                              23: { bg: "bg-emerald-900/50 border-emerald-500/40 text-emerald-300", xp: 140 },
                            };

                            displayDay = dayNum.toString();
                            const dayInfo = (activeDays as any)[dayNum];
                            if (dayInfo) {
                              bgClass = `${dayInfo.bg} shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer hover:scale-105 transition-transform`;
                              xpGained = dayInfo.xp;
                            } else {
                              bgClass = "bg-white/[0.04] border-white/10 text-white/40 hover:bg-white/10 cursor-pointer";
                            }
                          } else if (dayNum <= 0) {
                            displayDay = (28 + dayNum).toString();
                          } else {
                            displayDay = (dayNum - 25).toString();
                          }

                          return (
                            <div
                              key={idx}
                              className={`h-8 sm:h-9 rounded-lg border flex flex-col items-center justify-center text-[12px] font-bold font-mono transition-all relative group/day ${bgClass}`}
                            >
                              <span>{displayDay}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </BorderGlow>

              {/* Box 6 (Bottom Right) - VIDEO MODULES (White Card -> Dark Monochrome Gradient Glow) */}
              <BorderGlow colors={['#000000', '#334155', '#1e293b']} glowColor="0 0% 0%" borderRadius={32} backgroundColor="#ffffff" className="h-[450px]">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="h-full flex flex-col justify-between p-8 relative overflow-hidden group backdrop-blur-2xl col-span-1 text-black cursor-pointer"
                >
                  <div className="text-left relative z-10 flex flex-col shrink-0">
                    <span className="text-[10px] font-mono tracking-widest text-black/40 font-bold uppercase mb-1">VIDEO COMPANIONS</span>
                    <h3 className="text-2xl font-inter font-bold text-black tracking-tight">Topic-Specific Video Lessons.</h3>
                    <p className="text-black/50 font-inter text-[11px] max-w-sm mt-1 leading-relaxed">
                      Every syllabus topic is paired with a handpicked specialized video to clarify complex concepts.
                    </p>
                  </div>

                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-neutral-200/80 shadow-lg mt-4 bg-black flex flex-col justify-between p-4 transition-all duration-300 shrink-0">
                    <Image 
                      src="/images/biology-thumbnail.jpg"
                      alt="Introduction to Cells with the Amoeba Sisters"
                      fill
                      sizes="(max-w-md) 100vw, 350px"
                      style={{ objectFit: "cover" }}
                      className="opacity-90 scale-[1.05] group-hover:scale-110 transition-transform duration-500 ease-out"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                    <div className="flex justify-end items-center relative z-10">
                      <span className="text-[8px] font-mono text-white/90 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded">12:45</span>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <div className="w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-out group-hover:bg-red-600 group-hover:text-white">
                        <Play className="w-5 h-5 text-black fill-current transition-colors duration-300 group-hover:text-white ml-0.5" />
                      </div>
                    </div>

                    <div className="w-full relative z-10 space-y-2">
                      <div className="flex flex-col">
                        <span className="text-white font-manrope font-extrabold text-[12px] leading-tight drop-shadow-md">Introduction to Cells</span>
                        <span className="text-[9px] text-white/70 mt-0.5 drop-shadow-sm">with the Amoeba Sisters</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </BorderGlow>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
