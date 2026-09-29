"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, ArrowLeft, BookOpen, Layers, CheckCircle2, Play, FileText,
  Clock, GraduationCap, Target, Sparkles, X, Info, Calendar, Zap,
  Check, Video, ShieldCheck, BarChart2, Percent, HelpCircle
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

const OFFICIAL_COURSE_LOGOS: Record<string, string> = {
  "ap-biology": "/images/course-logos/ap-biology-logo.png",
  "ap-chemistry": "/images/course-logos/ap-chemistry-logo.png",
  "ap-physics-c": "/images/course-logos/ap-physics-c-logo.png",
  "ap-ush": "/images/course-logos/ap-ushistory-logo.png",
  "ap-apes": "/images/course-logos/ap-environmental-science-logo.png",
  "ap-environmental-science": "/images/course-logos/ap-environmental-science-logo.png",
  "ap-physics-1": "/images/course-logos/ap-physics-1-logo.png",
  "ap-csa": "/images/course-logos/ap-csa-logo.png",
  "ap-world": "/images/course-logos/ap-world-history-logo.png",
  "ap-world-history": "/images/course-logos/ap-world-history-logo.png",
  "ap-eng-lang": "/images/course-logos/ap-eng-lang-logo.png",
  "ap-psych": "/images/course-logos/ap-psychology-logo.png",
  "ap-psychology": "/images/course-logos/ap-psychology-logo.png",
  "ap-stats": "/images/course-logos/ap-stats-logo.png",
  "ap-calc-bc": "/images/course-logos/ap-calc-bc-logo.png",
};

const OFFICIAL_EXAM_SCHEDULE: Record<string, { dateStr: string; targetDate: Date; mcqWeight: string; frqWeight: string }> = {
  "ap-biology": { dateStr: "Thu, May 13, 2027", targetDate: new Date("2027-05-13T08:00:00"), mcqWeight: "60%", frqWeight: "40%" },
  "ap-chemistry": { dateStr: "Mon, May 3, 2027", targetDate: new Date("2027-05-03T12:00:00"), mcqWeight: "50%", frqWeight: "50%" },
  "ap-physics-c": { dateStr: "Tue, May 11, 2027", targetDate: new Date("2027-05-11T12:00:00"), mcqWeight: "50%", frqWeight: "50%" },
  "ap-calc-bc": { dateStr: "Mon, May 10, 2027", targetDate: new Date("2027-05-10T08:00:00"), mcqWeight: "50%", frqWeight: "50%" },
  "ap-stats": { dateStr: "Thu, May 13, 2027", targetDate: new Date("2027-05-13T12:00:00"), mcqWeight: "50%", frqWeight: "50%" },
  "ap-csa": { dateStr: "Wed, May 5, 2027", targetDate: new Date("2027-05-05T12:00:00"), mcqWeight: "50%", frqWeight: "50%" },
  "ap-ush": { dateStr: "Fri, May 7, 2027", targetDate: new Date("2027-05-07T08:00:00"), mcqWeight: "40%", frqWeight: "60%" },
  "ap-psych": { dateStr: "Tue, May 4, 2027", targetDate: new Date("2027-05-04T12:00:00"), mcqWeight: "66.7%", frqWeight: "33.3%" },
  "ap-eng-lang": { dateStr: "Tue, May 11, 2027", targetDate: new Date("2027-05-11T08:00:00"), mcqWeight: "45%", frqWeight: "55%" },
};

const OFFICIAL_SCORE_CUTOFFS: Record<string, Array<{ score: number; range: string }>> = {
  "ap-biology": [
    { score: 5, range: "74%+" },
    { score: 4, range: "60-73%" },
    { score: 3, range: "53-59%" },
    { score: 2, range: "39-52%" },
    { score: 1, range: "0-38%" },
  ],
  "ap-chemistry": [
    { score: 5, range: "72%+" },
    { score: 4, range: "58-71%" },
    { score: 3, range: "47-57%" },
    { score: 2, range: "33-46%" },
    { score: 1, range: "0-32%" },
  ],
  "ap-physics-c": [
    { score: 5, range: "70%+" },
    { score: 4, range: "55-69%" },
    { score: 3, range: "42-54%" },
    { score: 2, range: "28-41%" },
    { score: 1, range: "0-27%" },
  ],
  "ap-calc-bc": [
    { score: 5, range: "68%+" },
    { score: 4, range: "54-67%" },
    { score: 3, range: "40-53%" },
    { score: 2, range: "27-39%" },
    { score: 1, range: "0-26%" },
  ],
  "ap-stats": [
    { score: 5, range: "70%+" },
    { score: 4, range: "57-69%" },
    { score: 3, range: "44-56%" },
    { score: 2, range: "30-43%" },
    { score: 1, range: "0-29%" },
  ],
  "ap-csa": [
    { score: 5, range: "77%+" },
    { score: 4, range: "63-76%" },
    { score: 3, range: "51-62%" },
    { score: 2, range: "37-50%" },
    { score: 1, range: "0-36%" },
  ],
  "ap-ush": [
    { score: 5, range: "74%+" },
    { score: 4, range: "60-73%" },
    { score: 3, range: "50-59%" },
    { score: 2, range: "36-49%" },
    { score: 1, range: "0-35%" },
  ],
  "ap-psych": [
    { score: 5, range: "78%+" },
    { score: 4, range: "65-77%" },
    { score: 3, range: "52-64%" },
    { score: 2, range: "38-51%" },
    { score: 1, range: "0-37%" },
  ],
  "ap-eng-lang": [
    { score: 5, range: "76%+" },
    { score: 4, range: "63-75%" },
    { score: 3, range: "53-62%" },
    { score: 2, range: "38-52%" },
    { score: 1, range: "0-37%" },
  ],
};

const OFFICIAL_WEIGHTINGS: Record<string, Record<number, string>> = {
  "ap-biology": { 1: "6–8%", 2: "6–8%", 3: "10–15%", 4: "10–15%", 5: "12–16%", 6: "12–16%", 7: "13–20%", 8: "10–15%" },
  "ap-chemistry": { 1: "7–9%", 2: "7–9%", 3: "18–22%", 4: "7–9%", 5: "7–9%", 6: "7–9%", 7: "7–9%", 8: "11–15%", 9: "7–9%" },
  "ap-physics-c": { 1: "14–20%", 2: "17–23%", 3: "14–17%", 4: "14–17%", 5: "14–20%", 6: "6–14%", 7: "6–14%" },
  "ap-calc-bc": { 1: "4–7%", 2: "4–7%", 3: "4–7%", 4: "6–9%", 5: "8–11%", 6: "17–20%", 7: "6–9%", 8: "6–9%", 9: "11–12%", 10: "17–18%" },
  "ap-stats": { 1: "15–23%", 2: "5–7%", 3: "12–15%", 4: "10–20%", 5: "7–12%", 6: "12–15%", 7: "10–18%", 8: "2–5%", 9: "2–5%" },
  "ap-csa": { 1: "2.5–5%", 2: "5–7.5%", 3: "15–17.5%", 4: "17.5–22.5%", 5: "5–7.5%", 6: "10–15%", 7: "2.5–7.5%", 8: "7.5–10%", 9: "5–10%", 10: "5–7.5%" },
  "ap-ush": { 1: "4–6%", 2: "6–8%", 3: "10–17%", 4: "10–17%", 5: "10–17%", 6: "10–17%", 7: "10–17%", 8: "10–17%", 9: "4–6%" },
  "ap-psych": { 1: "15–25%", 2: "15–25%", 3: "15–25%", 4: "15–25%", 5: "15–25%" },
  "ap-eng-lang": { 1: "22–26%", 2: "22–26%", 3: "22–26%", 4: "45%", 5: "55%" },
};

const COURSE_TAGS: Record<string, string[]> = {
  "ap-biology": ["AP", "Biology", "Natural Science", "High School"],
  "ap-chemistry": ["AP", "Chemistry", "Physical Science", "High School"],
  "ap-physics-c": ["AP", "Physics", "Engineering", "High School"],
  "ap-calc-bc": ["AP", "Calculus", "Mathematics", "High School"],
  "ap-stats": ["AP", "Statistics", "Data Science", "High School"],
  "ap-csa": ["AP", "Computer Science", "Java", "High School"],
  "ap-ush": ["AP", "US History", "Social Science", "High School"],
  "ap-psych": ["AP", "Psychology", "Behavioral Science", "High School"],
  "ap-eng-lang": ["AP", "English Language", "Literature", "High School"],
};

const COURSE_HERO_IMAGES: Record<string, string> = {
  "ap-biology": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80",
  "ap-chemistry": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1400&q=80",
  "ap-physics-c": "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1400&q=80",
  "ap-calc-bc": "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1400&q=80",
  "ap-stats": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&q=80",
  "ap-csa": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&q=80",
  "ap-ush": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1400&q=80",
  "ap-psych": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1400&q=80",
  "ap-eng-lang": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1400&q=80",
  "ap-environmental-science": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=80",
  "ap-apes": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1400&q=80",
  "ap-physics-1": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1400&q=80",
  "ap-world-history": "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1400&q=80",
};

const COURSE_FEATURES = [
  { id: "lessons", title: "Lessons", desc: "Structured curriculum, units, and lesson content.", status: "Available", icon: BookOpen },
  { id: "practice", title: "Practice", desc: "Course practice sessions generated from lesson material.", status: "Available", icon: Zap },
  { id: "exams", title: "Exams", desc: "Full-length or exam-style assessment generation.", status: "Available", icon: FileText },
  { id: "metadata", title: "AP Metadata", desc: "College Board themes, skills, unit weighting, and AP lesson tags.", status: "Available", icon: Target },
  { id: "frqs", title: "AP FRQs", desc: "AP-style free response practice and scoring.", status: "Available", icon: HelpCircle },
  { id: "calculator", title: "AP Score Calculator", desc: "Score projection tools for AP exam sections.", status: "Available", icon: BarChart2 },
];

export default function CoursePreviewPage({ params }: PageProps) {
  const { slug } = params;
  const router = useRouter();
  const { progress } = useProgress();
  const course = courseRegistry[slug];

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [countdown, setCountdown] = useState({ days: 228, hours: 7 });

  const examInfo = OFFICIAL_EXAM_SCHEDULE[slug] || {
    dateStr: "Thu, May 13, 2027",
    targetDate: new Date("2027-05-13T08:00:00"),
    mcqWeight: "60%",
    frqWeight: "40%",
  };

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const diffTime = Math.max(0, examInfo.targetDate.getTime() - now.getTime());
      const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setCountdown({ days, hours });
    };
    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [examInfo.targetDate]);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#070913] text-white flex items-center justify-center font-manrope">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Course Not Found</h1>
          <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const logoUrl = OFFICIAL_COURSE_LOGOS[slug];
  const tags = COURSE_TAGS[slug] || ["AP", course.category || "Science", "High School"];
  const weightings = OFFICIAL_WEIGHTINGS[slug] || {};
  const scoreCutoffs = OFFICIAL_SCORE_CUTOFFS[slug] || [
    { score: 5, range: "74%+" },
    { score: 4, range: "60-73%" },
    { score: 3, range: "53-59%" },
    { score: 2, range: "39-52%" },
    { score: 1, range: "0-38%" },
  ];
  const heroBgImage = COURSE_HERO_IMAGES[slug] || "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1400&q=80";

  // Calculate actual course progress from ProgressContext
  const completedTopicIds = progress?.completedTopics || [];

  const isTopicCompleted = (topicId: string) => {
    if (!course) return false;
    const fullId = `${course.masteryPrefix}-${topicId}`;
    return completedTopicIds.includes(fullId) || completedTopicIds.includes(topicId);
  };

  const totalSubunits = course.units.reduce((acc, u) => acc + u.topics.length, 0);

  const completedSubunitsCount = course.units.reduce((acc, u) => {
    return acc + u.topics.filter((t) => isTopicCompleted(t.id)).length;
  }, 0);

  const courseProgressPercent = totalSubunits > 0 
    ? Math.round((completedSubunitsCount / totalSubunits) * 100) 
    : 0;

  const courseAccentHex = course?.accentColor || "#a855f7";

  return (
    <div className="min-h-screen bg-[#04050a] text-white flex flex-row relative z-0 overflow-x-hidden font-manrope selection:bg-purple-600">
      <AppSidebar currentPath="/dashboard" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16">
        <UniversalTopHeader />

        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 space-y-8 pb-20 text-left">
          
          {/* TOP HERO BANNER */}
          <div 
            className="relative w-full rounded-3xl border border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl bg-[#080912] flex flex-col justify-between min-h-[220px]"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(8,9,18,0.95) 20%, rgba(8,9,18,0.7) 60%, rgba(8,9,18,0.4) 100%), url('${heroBgImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            {/* OFFICIAL COLLEGE BOARD AP LOGO WATERMARK MOVED RIGHT TO TOUCH & OVERLAP COURSE PROGRESS JUST A LITTLE BIT */}
            {logoUrl && (
              <div className="absolute right-[170px] sm:right-[195px] lg:right-[205px] top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none hidden md:block">
                <img
                  src={logoUrl}
                  alt={`${course.name} emblem`}
                  className={cn(
                    "w-44 h-44 sm:w-56 sm:h-56 object-contain opacity-35 filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]",
                    slug === "ap-ush" && "scale-135 sm:scale-150"
                  )}
                />
              </div>
            )}

            {/* TOP ROW: Pill Tags */}
            <div className="relative z-10 flex items-center gap-2 flex-wrap">
              {tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/80 text-[11px] font-manrope font-semibold">
                  {t}
                </span>
              ))}
            </div>

            {/* MIDDLE ROW: Course Title & Course Progress Box */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-4">
              <div className="space-y-3">
                <h1 className="font-manrope font-black text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight drop-shadow-md">
                  {course.name}
                </h1>

                {/* Sub-info Metrics Pill Row */}
                <div className="flex items-center gap-2.5 flex-wrap pt-1">
                  <span className="px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/10 text-white text-xs font-manrope font-bold flex items-center gap-1.5 shadow-sm">
                    <BookOpen className="w-3.5 h-3.5 text-white/70" />
                    <span>{course.units.length} units</span>
                  </span>

                  <span className="px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/10 text-white text-xs font-manrope font-bold flex items-center gap-1.5 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-white/70" />
                    <span>In {countdown.days} Days {String(countdown.hours).padStart(2, '0')} Hours</span>
                  </span>

                  {/* Course Details Button (Triggers Pop-up Menu, White Info Icon) */}
                  <button
                    type="button"
                    onClick={() => setShowDetailsModal(true)}
                    className="px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-manrope font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Info className="w-3.5 h-3.5 text-white" />
                    <span>Course details</span>
                  </button>
                </div>
              </div>

              {/* Course Progress Box on Top Right (Course Accent Styled) */}
              <div className="bg-[#0b0c18]/90 border border-white/10 rounded-2xl p-3.5 w-full lg:w-56 shadow-xl backdrop-blur-md space-y-2 shrink-0">
                <div className="flex items-center justify-between text-[11px] font-manrope font-extrabold tracking-wider text-white/50 uppercase">
                  <span>COURSE PROGRESS</span>
                  <span 
                    className="px-2 py-0.5 rounded-md font-mono font-bold text-[10px] border shadow-sm"
                    style={{
                      backgroundColor: `${courseAccentHex}25`,
                      borderColor: `${courseAccentHex}45`,
                      color: courseAccentHex,
                    }}
                  >
                    {completedSubunitsCount}/{totalSubunits}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="font-manrope font-black text-2xl text-white">{courseProgressPercent}%</span>
                </div>

                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${courseProgressPercent}%`, backgroundColor: courseAccentHex }} 
                  />
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: Black Practice Action Button */}
            <div className="relative z-10 pt-2">
              <Link
                href={`/dashboard/${slug}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-900 text-white border border-white/20 font-manrope font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Practice</span>
              </Link>
            </div>
          </div>

          {/* FULL WIDTH UNITS COURSE PATH */}
          <div className="w-full space-y-6">
            
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-manrope font-extrabold text-white/40 uppercase tracking-widest block">COURSE PATH</span>
                <h2 className="font-manrope font-black text-2xl text-white tracking-tight">Units</h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-xs font-manrope font-bold">
                  {course.units.length} units
                </span>
                <span 
                  className="px-3 py-1 rounded-full border text-xs font-manrope font-bold shadow-sm"
                  style={{
                    backgroundColor: `${courseAccentHex}18`,
                    borderColor: `${courseAccentHex}35`,
                    color: courseAccentHex,
                  }}
                >
                  {courseProgressPercent}% complete
                </span>
              </div>
            </div>

            {/* Units List (Full Width) */}
            <div className="space-y-5">
              {course.units.map((unit) => {
                const weighting = weightings[unit.id] || "8–12%";
                const topicCount = unit.topics.length;
                const unitCompletedTopics = unit.topics.filter(t => isTopicCompleted(t.id)).length;
                const unitProgressPercent = topicCount > 0 
                  ? Math.round((unitCompletedTopics / topicCount) * 100) 
                  : 0;

                return (
                  <div 
                    key={unit.id}
                    className="bg-[#080911] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4"
                  >
                    {/* Unit Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-center shrink-0 mt-0.5"
                          style={{ color: courseAccentHex }}
                        >
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-manrope font-bold text-white/40 uppercase tracking-wider block">
                            UNIT {unit.id}
                          </span>
                          <h3 className="font-manrope font-bold text-base sm:text-lg text-white">
                            {unit.title}
                          </h3>
                          <span className="text-xs font-manrope text-white/40 block">
                            {topicCount} lessons
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start sm:items-end space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-manrope font-extrabold text-sm text-white">{weighting}</span>
                          <span className="text-[9px] font-manrope font-bold text-white/40 uppercase">AP WEIGHTING</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-manrope">
                          <span className="text-white/40">Progress</span>
                          <div className="w-20 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500" 
                              style={{ width: `${unitProgressPercent}%`, backgroundColor: courseAccentHex }} 
                            />
                          </div>
                          <span className="font-bold" style={{ color: courseAccentHex }}>{unitProgressPercent}%</span>
                          <span 
                            className="px-2 py-0.5 rounded font-mono text-[10px] font-bold border"
                            style={{
                              backgroundColor: `${courseAccentHex}25`,
                              borderColor: `${courseAccentHex}45`,
                              color: courseAccentHex,
                            }}
                          >
                            {unitCompletedTopics}/{topicCount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Subunits Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {unit.topics.map((topic) => {
                        const isDone = isTopicCompleted(topic.id);

                        return (
                          <Link
                            key={topic.id}
                            href={`/dashboard/${slug}?topic=${topic.id}`}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group",
                              isDone 
                                ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-200 hover:bg-emerald-950/30" 
                                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 text-white/80"
                            )}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                              ) : (
                                <BookOpen className="w-3.5 h-3.5 shrink-0 text-white/40 group-hover:text-white transition-colors" />
                              )}
                              <span className="font-manrope font-semibold text-xs truncate">
                                {topic.id} {topic.title}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* POP-UP MENU: COURSE DETAILS MODAL (MATCHING EXACT USER IMAGES) */}
      <AnimatePresence>
        {showDetailsModal && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Single Clean Modal Box (No Double Outline/Border) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-[#0a0c16] border border-white/10 rounded-2xl p-6 sm:p-8 text-white z-10 shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header inside content flow so title scrolls naturally */}
              <div className="flex items-start justify-between pb-5 border-b border-white/10 mb-6">
                <div>
                  <h2 className="font-manrope font-black text-2xl text-white tracking-tight">
                    Course details
                  </h2>
                  <p className="text-white/40 text-xs font-manrope mt-0.5">
                    Release status, course metadata, and feature availability.
                  </p>
                </div>

                {/* Small simple X icon button without circle container */}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white/40 hover:text-white transition-colors cursor-pointer p-1 -mr-1"
                  title="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Scrollable Content Sections */}
              <div className="space-y-6">
                
                {/* 1. Course Tags Card */}
                <div className="bg-[#05060d] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-white/70">
                    <Target className="w-4 h-4 text-white/40" />
                    <span className="font-manrope font-bold text-xs uppercase tracking-wider text-white">Course tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-xl bg-white/[0.06] border border-white/10 text-white/90 text-xs font-manrope font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Release Status Card */}
                <div className="bg-[#05060d] border border-white/10 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center space-x-2 text-white/70">
                    <CheckCircle2 className="w-4 h-4 text-white/40" />
                    <span className="font-manrope font-bold text-xs uppercase tracking-wider text-white">Release status</span>
                  </div>
                  <h4 className="font-manrope font-black text-lg text-white">Stable</h4>
                  <p className="text-xs text-white/50 font-manrope">
                    The full curriculum is complete, and most tools are fully implemented.
                  </p>
                </div>

                {/* 3. Feature Availability Card (Only Shows Available Features) */}
                <div className="bg-[#05060d] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 text-white/70">
                      <Layers className="w-4 h-4 text-white/40" />
                      <span className="font-manrope font-bold text-xs uppercase tracking-wider text-white">Feature Availability</span>
                    </div>
                    <p className="text-xs text-white/40 font-manrope mt-1">
                      Each tool can move independently through planned, preview, in progress, and available states.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-manrope font-bold text-xs flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      6 Available
                    </span>
                  </div>

                  {/* Green Available Features List */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-manrope font-bold text-emerald-400 pb-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Available</span>
                    </div>

                    {COURSE_FEATURES.map((feat) => {
                      const IconComp = feat.icon;
                      return (
                        <div key={feat.id} className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-white">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-manrope font-bold text-xs text-white">{feat.title}</p>
                              <p className="text-[11px] text-white/50 font-manrope">{feat.desc}</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-manrope font-bold text-[10px] border border-emerald-500/40 flex items-center gap-1 shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                            Available
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Upcoming Exam Dates Card */}
                <div className="bg-[#05060d] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-white/70">
                    <Calendar className="w-4 h-4 text-white/50" />
                    <span className="font-manrope font-bold text-xs uppercase tracking-wider text-white">Upcoming Exam Dates</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-manrope font-extrabold text-white/40 uppercase tracking-widest block">NEXT EXAM</span>
                      <p className="font-manrope font-extrabold text-lg text-white mt-0.5">{examInfo.dateStr}</p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-manrope font-bold text-xs">
                      {countdown.days} days away
                    </span>
                  </div>
                </div>

                {/* 5. AP Course Details Card */}
                <div className="bg-[#05060d] border border-white/10 rounded-2xl p-5 space-y-5">
                  <div className="flex items-center space-x-2 text-white/70 border-b border-white/10 pb-3">
                    <FileText className="w-4 h-4 text-white/50" />
                    <div>
                      <span className="font-manrope font-bold text-xs uppercase tracking-wider text-white block">AP Course Details</span>
                      <p className="text-[11px] text-white/40 font-manrope">Course skills, themes, and exam weighting data from the AP framework.</p>
                    </div>
                  </div>

                  {/* Exam Structure */}
                  <div className="space-y-2.5">
                    <h4 className="font-manrope font-bold text-xs text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-white/50" />
                      <span>Exam Structure</span>
                    </h4>

                    <div className="rounded-xl border border-white/10 overflow-hidden text-xs">
                      <div className="flex items-center justify-between p-3 bg-white/[0.04] border-b border-white/10">
                        <span className="font-manrope font-bold text-white">Section I: Multiple Choice</span>
                        <span className="font-manrope font-black text-white">{examInfo.mcqWeight} <span className="text-[10px] font-normal text-white/40">WEIGHT</span></span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/[0.02]">
                        <span className="font-manrope font-bold text-white">Section II: Free Response</span>
                        <span className="font-manrope font-black text-white">{examInfo.frqWeight} <span className="text-[10px] font-normal text-white/40">WEIGHT</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Score Cutoffs Table with Grey Percent Icon */}
                  <div className="space-y-2.5">
                    <h4 className="font-manrope font-bold text-xs text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-white/50" />
                      <span>Score Cutoffs</span>
                    </h4>

                    <div className="rounded-xl border border-white/10 overflow-hidden text-xs">
                      <div className="grid grid-cols-2 p-2.5 bg-white/[0.06] border-b border-white/10 font-manrope font-extrabold text-white/40 text-[10px] uppercase">
                        <span>AP SCORE</span>
                        <span className="text-right">COMPOSITE RANGE</span>
                      </div>
                      {scoreCutoffs.map((item) => (
                        <div key={item.score} className="grid grid-cols-2 p-2.5 border-b border-white/5 last:border-0 bg-white/[0.02] font-manrope font-bold">
                          <span className="text-white">{item.score}</span>
                          <span className="text-right text-white">{item.range}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unit Weighting Table with Grey Percent Icon */}
                  <div className="space-y-2.5">
                    <h4 className="font-manrope font-bold text-xs text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-white/50" />
                      <span>Unit Weighting</span>
                    </h4>

                    <div className="rounded-xl border border-white/10 overflow-hidden text-xs">
                      <div className="grid grid-cols-3 p-2.5 bg-white/[0.06] border-b border-white/10 font-manrope font-extrabold text-white/40 text-[10px] uppercase">
                        <span>UNIT</span>
                        <span>TOPIC</span>
                        <span className="text-right">EXAM WEIGHTING</span>
                      </div>
                      {course.units.map((u) => (
                        <div key={u.id} className="grid grid-cols-3 p-2.5 border-b border-white/5 last:border-0 bg-white/[0.02] font-manrope font-semibold items-center">
                          <span className="font-bold text-white">Unit {u.id}</span>
                          <span className="text-white/70 truncate pr-2">{u.title}</span>
                          <span className="text-right font-bold text-white">{weightings[u.id] || "8–12%"}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
