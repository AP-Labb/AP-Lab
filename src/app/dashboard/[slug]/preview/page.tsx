"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ChevronRight, ArrowLeft, BookOpen, Layers, CheckCircle2, Play, FileText, Activity
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { courseRegistry } from "@/lib/courses/course-registry";
import { useProgress } from "@/context/ProgressContext";
import { cn } from "@/lib/utils";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function CoursePreviewPage({ params }: PageProps) {
  const { slug } = params;
  const router = useRouter();
  const { progress } = useProgress();
  const course = courseRegistry[slug];

  if (!course) {
    return (
      <div className="min-h-screen bg-[#070913] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold font-manrope">Course Not Found</h1>
          <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-purple-600 text-xs font-bold">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const COURSE_HERO_IMAGES: Record<string, string> = {
    "ap-biology": "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&q=80",
    "ap-chemistry": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80",
    "ap-physics-c": "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=1200&q=80",
    "ap-calc-bc": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80",
    "ap-stats": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    "ap-csa": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
    "ap-ush": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&q=80",
    "ap-psych": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80",
    "ap-eng-lang": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200&q=80",
  };

  const OFFICIAL_WEIGHTINGS: Record<string, Record<number, string>> = {
    "ap-biology": { 1: "8–11%", 2: "10–13%", 3: "12–16%", 4: "10–15%", 5: "8–11%", 6: "12–16%", 7: "13–20%", 8: "10–15%" },
    "ap-chemistry": { 1: "7–9%", 2: "7–9%", 3: "18–22%", 4: "7–9%", 5: "7–9%", 6: "7–9%", 7: "7–9%", 8: "11–15%", 9: "7–9%" },
    "ap-physics-c": { 1: "14–20%", 2: "17–23%", 3: "14–17%", 4: "14–17%", 5: "14–20%", 6: "6–14%", 7: "6–14%" },
    "ap-calc-bc": { 1: "4–7%", 2: "4–7%", 3: "4–7%", 4: "6–9%", 5: "8–11%", 6: "17–20%", 7: "6–9%", 8: "6–9%", 9: "11–12%", 10: "17–18%" },
    "ap-stats": { 1: "15–23%", 2: "5–7%", 3: "12–15%", 4: "10–20%", 5: "7–12%", 6: "12–15%", 7: "10–18%", 8: "2–5%", 9: "2–5%" },
    "ap-csa": { 1: "2.5–5%", 2: "5–7.5%", 3: "15–17.5%", 4: "17.5–22.5%", 5: "5–7.5%", 6: "10–15%", 7: "2.5–7.5%", 8: "7.5–10%", 9: "5–10%", 10: "5–7.5%" },
    "ap-ush": { 1: "4–6%", 2: "6–8%", 3: "10–17%", 4: "10–17%", 5: "10–17%", 6: "10–17%", 7: "10–17%", 8: "10–17%", 9: "4–6%" },
    "ap-psych": { 1: "15–25%", 2: "15–25%", 3: "15–25%", 4: "15–25%", 5: "15–25%" },
    "ap-eng-lang": { 1: "22–26%", 2: "22–26%", 3: "22–26%", 4: "45%", 5: "55%" },
  };

  const EXAM_STRUCTURE_SUMMARY: Record<string, { mcq: string; frq: string; duration: string }> = {
    "ap-biology": { mcq: "60 Questions (50% Exam Weight)", frq: "6 Questions (50% Exam Weight)", duration: "3 Hours 00 Mins" },
    "ap-chemistry": { mcq: "60 Questions (50% Exam Weight)", frq: "7 Questions (50% Exam Weight)", duration: "3 Hours 15 Mins" },
    "ap-physics-c": { mcq: "35 Questions (50% Exam Weight)", frq: "3 Questions (50% Exam Weight)", duration: "1 Hour 30 Mins" },
    "ap-calc-bc": { mcq: "45 Questions (50% Exam Weight)", frq: "6 Questions (50% Exam Weight)", duration: "3 Hours 15 Mins" },
    "ap-stats": { mcq: "40 Questions (50% Exam Weight)", frq: "6 Questions (50% Exam Weight)", duration: "3 Hours 00 Mins" },
    "ap-csa": { mcq: "40 Questions (50% Exam Weight)", frq: "4 Questions (50% Exam Weight)", duration: "3 Hours 00 Mins" },
    "ap-ush": { mcq: "55 Questions (40% Exam Weight)", frq: "4 Questions (60% Exam Weight)", duration: "3 Hours 15 Mins" },
    "ap-psych": { mcq: "100 Questions (66.7% Exam Weight)", frq: "2 Questions (33.3% Exam Weight)", duration: "2 Hours 00 Mins" },
    "ap-eng-lang": { mcq: "45 Questions (45% Exam Weight)", frq: "3 Essays (55% Exam Weight)", duration: "3 Hours 15 Mins" },
  };

  const heroBgImage = COURSE_HERO_IMAGES[slug] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80";
  const courseWeightings = OFFICIAL_WEIGHTINGS[slug] || {};
  const examStructure = EXAM_STRUCTURE_SUMMARY[slug] || { mcq: "60 Questions (50%)", frq: "6 Questions (50%)", duration: "3 Hours" };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-row relative z-0 overflow-x-hidden font-manrope">
      <AppSidebar currentPath="/dashboard" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16">
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-6 sm:px-8 py-8 space-y-8 pb-20 text-left">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-xs font-mono text-white/50">
            <Link href="/dashboard" className="hover:text-white transition-colors flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Courses</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            <span className="text-white font-semibold">{course.name} Preview</span>
          </div>

          {/* HERO BANNER SECTION */}
          <div 
            className="relative w-full rounded-3xl overflow-hidden border border-white/15 p-6 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(7,9,20,0.85), rgba(7,9,20,0.50)), url('${heroBgImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="space-y-4 max-w-xl text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider shadow-sm">
                  AP
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider shadow-sm">
                  {course.category || "STEM"}
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider shadow-sm">
                  High School
                </span>
              </div>

              <h1 className="font-instrument text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                {course.name}
              </h1>

              <p className="text-sm text-white/90 font-manrope leading-relaxed drop-shadow">
                Comprehensive CollegeBoard aligned curriculum, unit weightings, and practice exam workspace.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-black/50 border border-white/20 text-xs font-mono text-white backdrop-blur-md">
                  <BookOpen className="w-4 h-4 text-white/80" />
                  <span>{course.units.length} units</span>
                </div>

                {/* Sleek High-Contrast Start Course Button */}
                <Link
                  href={`/dashboard/${slug}?mode=workspace`}
                  className="flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-manrope font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95 border border-amber-300/40"
                >
                  <Play className="w-4 h-4 fill-neutral-950 text-neutral-950" />
                  <span>Start Course</span>
                </Link>
              </div>
            </div>

            {/* Right Top Card: COLLEGEBOARD OFFICIAL EXAM STRUCTURE */}
            <div className="w-full lg:w-80 bg-[#090b16]/95 border border-amber-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">COLLEGEBOARD EXAM WEIGHTING</span>
                <FileText className="w-4 h-4 text-amber-400" />
              </div>

              <div className="space-y-2 text-xs font-manrope">
                <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-white/60 font-semibold">Section 1 (MCQ)</span>
                  <span className="font-mono font-bold text-amber-300">{examStructure.mcq}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-white/60 font-semibold">Section 2 (FRQ)</span>
                  <span className="font-mono font-bold text-amber-300">{examStructure.frq}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="text-white/60 font-semibold">Exam Duration</span>
                  <span className="font-mono font-bold text-white/90">{examStructure.duration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* UNITS & SUBUNITS COURSE PATH */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest block">OFFICIAL COURSE PATH</span>
                <h2 className="font-instrument text-2xl font-bold text-white">Units & CollegeBoard Weightings</h2>
              </div>
              <div className="text-xs font-mono text-white/50 space-x-4">
                <span>{course.units.length} units</span>
              </div>
            </div>

            {/* Render Each Unit Card with Official Weightings */}
            {course.units.map((unit) => {
              const unitTopicsCount = unit.topics.length;
              const officialWeighting = courseWeightings[unit.id] || "10–15%";

              return (
                <div 
                  key={unit.id}
                  className="bg-[#090b16]/90 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider block">
                          UNIT {unit.id}
                        </span>
                        <h3 className="font-manrope font-bold text-lg text-white">
                          {unit.title}
                        </h3>
                        <span className="text-xs font-mono text-white/40 block mt-0.5">
                          {unitTopicsCount} lessons
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end space-y-1 font-mono text-xs">
                      <span className="font-extrabold text-amber-400 text-sm">{officialWeighting} AP EXAM WEIGHTING</span>
                      <span className="text-white/40">{unitTopicsCount} Subunits</span>
                    </div>
                  </div>

                  {/* Subunits Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {unit.topics.map((topic) => (
                      <Link
                        key={topic.id}
                        href={`/dashboard/${slug}`}
                        className="flex items-center space-x-2.5 p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 text-white/80 transition-all cursor-pointer group"
                      >
                        <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100 text-purple-400" />
                        <span className="font-manrope font-semibold text-xs truncate">
                          {topic.id} {topic.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Bottom Start Course Button */}
            <div className="pt-4 flex justify-end">
              <Link
                href={`/dashboard/${slug}`}
                className="flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-manrope font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-2xl hover:scale-105 border border-amber-300/40"
              >
                <Play className="w-4 h-4 fill-neutral-950 text-neutral-950" />
                <span>Start Course</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
