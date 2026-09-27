"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, X, BookOpen, GraduationCap, Pencil,
  Dna, FlaskConical, Atom, History as HistoryIcon, Calculator, Clock, Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { courseRegistry } from "@/lib/courses/course-registry";
import { cn } from "@/lib/utils";

interface CourseCardData {
  id: string;
  name: string;
  slug: string;
  description: string;
  bannerImage: string;
  logoImage?: string;
  unitsCount: number;
  modulesCount: number;
  isUpcoming?: boolean;
  accentHex: string;
}

interface CourseCategory {
  id: string;
  name: string;
  subCategory: string;
  icon: any;
  courses: CourseCardData[];
}

const CATEGORIZED_COURSES: CourseCategory[] = [
  {
    id: "stem",
    name: "STEM & Sciences",
    subCategory: "Science & Engineering",
    icon: Dna,
    courses: [
      {
        id: "ap-biology",
        name: "AP® Biology",
        slug: "ap-biology",
        logoImage: "/images/course-logos/ap-biology-logo.png",
        description: "AP Biology is an introductory college-level biology course. Students cultivate their understanding of biology through inquiry-based investigations into cells, genetics, evolution, and ecology.",
        bannerImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
        unitsCount: 8,
        modulesCount: 63,
        accentHex: "#10b981"
      },
      {
        id: "ap-chemistry",
        name: "AP® Chemistry",
        slug: "ap-chemistry",
        logoImage: "/images/course-logos/ap-chemistry-logo.png",
        description: "AP Chemistry provides a college-level foundation to support advanced science study. Analyze atomic structures, chemical bonding, kinetics, equilibrium, and thermodynamics.",
        bannerImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 72,
        accentHex: "#06b6d4"
      },
      {
        id: "ap-physics-c",
        name: "AP® Physics C",
        slug: "ap-physics-c",
        logoImage: "/images/course-logos/ap-physics-c-logo.png",
        description: "AP Physics C: Mechanics is a calculus-based physics course covering kinematics, Newton's laws of motion, work, energy, momentum, rotational dynamics, and oscillations.",
        bannerImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80",
        unitsCount: 7,
        modulesCount: 50,
        accentHex: "#3b82f6"
      }
    ]
  },
  {
    id: "humanities",
    name: "Humanities & Social Sciences",
    subCategory: "History & Literature",
    icon: HistoryIcon,
    courses: [
      {
        id: "ap-ush",
        name: "AP® US History",
        slug: "ap-ush",
        logoImage: "/images/course-logos/ap-ushistory-logo.png",
        description: "In AP U.S. History, students investigate significant events, individuals, developments, and processes in nine historical periods from 1491 to the present.",
        bannerImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 86,
        accentHex: "#ef4444"
      },
      {
        id: "ap-psychology",
        name: "AP® Psychology",
        slug: "ap-psych",
        description: "The AP Psychology course introduces students to the systematic and scientific study of human behavior, mental processes, cognitive models, and biological influences.",
        bannerImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
        unitsCount: 5,
        modulesCount: 35,
        accentHex: "#a855f7"
      },
      {
        id: "ap-eng-lang",
        name: "AP® English Language",
        slug: "ap-eng-lang",
        description: "AP English Language and Composition cultivates essential reading and writing skills needed for rhetorical analysis, argument synthesis, and academic essay composition.",
        bannerImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 45,
        accentHex: "#14b8a6"
      }
    ]
  },
  {
    id: "math",
    name: "Mathematical Logic",
    subCategory: "Mathematics & Computation",
    icon: Calculator,
    courses: [
      {
        id: "ap-calc-bc",
        name: "AP® Calculus BC",
        slug: "ap-calc-bc",
        description: "Conquer limits, derivatives, integration techniques, Taylor power series, and polar coordinate calculus through interactive coordinate models and rigorous proofs.",
        bannerImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
        unitsCount: 10,
        modulesCount: 80,
        accentHex: "#8b5cf6"
      },
      {
        id: "ap-stats",
        name: "AP® Statistics",
        slug: "ap-stats",
        description: "AP Statistics introduces tools for collecting, analyzing, and drawing conclusions from data using probability models, sampling distributions, and hypothesis testing.",
        bannerImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 54,
        accentHex: "#ec4899"
      },
      {
        id: "ap-csa",
        name: "AP® Computer Science A",
        slug: "ap-csa",
        description: "AP Computer Science A emphasizes object-oriented programming in Java, algorithm design, data structures, recursion, and computational problem-solving.",
        bannerImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
        unitsCount: 10,
        modulesCount: 60,
        accentHex: "#f59e0b"
      }
    ]
  },
  {
    id: "upcoming",
    name: "Coming Soon AP® Courses",
    subCategory: "In Active Development",
    icon: Clock,
    courses: [
      {
        id: "ap-env-science",
        name: "AP® Environmental Science",
        slug: "ap-environmental-science",
        isUpcoming: true,
        description: "Examines ecological processes, human environmental impacts, renewable energy systems, biodiversity, and global climate mechanisms.",
        bannerImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 99,
        accentHex: "#10b981"
      },
      {
        id: "ap-world-history",
        name: "AP® World History",
        slug: "ap-world-history",
        isUpcoming: true,
        description: "Explores global historical patterns, cultural exchanges, trans-regional trade networks, and empire developments from 1200 CE to present.",
        bannerImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 63,
        accentHex: "#f59e0b"
      },
      {
        id: "ap-physics-1",
        name: "AP® Physics 1",
        slug: "ap-physics-1",
        isUpcoming: true,
        description: "Algebra-based physics course introducing Newtonian mechanics, work, energy, rotational dynamics, and mechanical waves.",
        bannerImage: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80",
        unitsCount: 7,
        modulesCount: 45,
        accentHex: "#3b82f6"
      },
      {
        id: "ap-macro",
        name: "AP® Macroeconomics",
        slug: "ap-macroeconomics",
        isUpcoming: true,
        description: "Explores economic principles applying to an economic system as a whole, national income, fiscal policy, price determination, and monetary policy.",
        bannerImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
        unitsCount: 6,
        modulesCount: 47,
        accentHex: "#8b5cf6"
      }
    ]
  }
];

export function SubjectLabs() {
  const router = useRouter();

  return (
    <section className="relative w-full py-20 px-4 sm:px-8 md:px-12 bg-[#090a0e] text-white selection:bg-purple-600 font-manrope overflow-hidden z-10">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Title */}
        <div className="text-center space-y-3">
          <h2 className="font-manrope font-black text-3xl sm:text-5xl text-white tracking-tight">
            Explore All Courses & Curriculum
          </h2>
          <p className="text-sm sm:text-base text-white/50 font-manrope max-w-2xl mx-auto">
            Specialized AP® learning environments powered by interactive visual modules, mapped syllabus units, and high-yield question banks.
          </p>
        </div>

        {/* CATEGORIZED COURSES SECTIONS */}
        <div className="space-y-14">
          {CATEGORIZED_COURSES.map((category) => {
            const CategoryIcon = category.icon;

            return (
              <div key={category.id} className="space-y-6">
                
                {/* CATEGORY HEADER ROW */}
                <div className="flex items-center space-x-3 border-b border-white/10 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-purple-400 shrink-0 shadow-md">
                    <CategoryIcon className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <h3 className="font-manrope font-extrabold text-xl sm:text-2xl text-white tracking-tight">
                      {category.name}
                    </h3>
                    <span className="text-xs font-manrope font-semibold text-white/40">
                      &bull; {category.subCategory}
                    </span>
                  </div>
                </div>

                {/* COURSES CARDS GRID (NO STABLE/BUILDING BADGES, NO LIFT ON HOVER, LOGO ON LEFT OF BANNER) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.courses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => {
                        if (!course.isUpcoming) {
                          router.push(`/dashboard/${course.slug}/preview`);
                        }
                      }}
                      className={cn(
                        "group relative bg-[#13141c] border border-[#242636] rounded-2xl overflow-hidden shadow-xl transition-colors duration-300 flex flex-col justify-between select-none",
                        course.isUpcoming ? "opacity-75 cursor-not-allowed" : "hover:border-white/25 cursor-pointer"
                      )}
                    >
                      {/* SHINE SWEEP HOVER EFFECT (NO ELEVATION/LIFT ON HOVER) */}
                      {!course.isUpcoming && (
                        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute -top-1/2 -left-full w-full h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent transform -rotate-45 group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
                        </div>
                      )}

                      {/* TOP BANNER IMAGE CONTAINER */}
                      <div className="h-28 sm:h-32 w-full relative overflow-hidden bg-neutral-900 shrink-0">
                        <img
                          src={course.bannerImage}
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#13141c] via-transparent to-black/40" />

                        {/* COMING SOON BADGE ONLY FOR UPCOMING COURSES (NO STABLE OR BUILDING BADGES) */}
                        {course.isUpcoming && (
                          <div className="absolute top-3 right-3 z-10">
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              COMING SOON
                            </span>
                          </div>
                        )}

                        {/* OVERLAID OFFICIAL COLLEGEBOARD AP LOGO (ON THE LEFT OF THE BANNER IMAGE WITHOUT CIRCLE) */}
                        {course.logoImage && (
                          <div className="absolute top-2.5 left-3 sm:top-3 sm:left-4 z-10 w-16 h-16 sm:w-20 sm:h-20 pointer-events-none flex items-center justify-center">
                            <img 
                              src={course.logoImage} 
                              alt={`${course.name} logo`} 
                              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] opacity-90" 
                            />
                          </div>
                        )}
                      </div>

                      {/* CARD CONTENT BODY */}
                      <div className="p-4 sm:p-5 flex flex-col justify-between space-y-3 flex-1 min-h-[160px]">
                        <div className="space-y-1.5">
                          {/* TITLE WITH MORTARBOARD ICON */}
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="w-4 h-4 text-white/80 shrink-0" />
                            <h4 className="font-manrope font-extrabold text-base sm:text-lg text-white tracking-tight group-hover:text-purple-300 transition-colors">
                              {course.name}
                            </h4>
                          </div>

                          {/* DESCRIPTION */}
                          <p className="text-xs text-white/50 font-manrope line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        {/* METRICS & PILLS */}
                        <div className="space-y-3 pt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-1 rounded-full bg-[#1b233a] border border-blue-500/30 text-[#818cf8] text-[10px] font-manrope font-extrabold flex items-center gap-1.5">
                              <BookOpen className="w-3 h-3 text-[#818cf8]" />
                              {course.unitsCount} UNITS
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-[#2a1b38] border border-purple-500/30 text-[#c084fc] text-[10px] font-manrope font-extrabold flex items-center gap-1.5">
                              <Pencil className="w-3 h-3 text-[#c084fc]" />
                              {course.modulesCount} MODULES
                            </span>
                          </div>

                          {/* PROGRESS BAR ROW */}
                          <div className="flex items-center gap-2.5 pt-1 border-t border-white/5">
                            <span className="text-[11px] font-manrope font-semibold text-white/50 shrink-0">
                              ✧ 0% Progress
                            </span>
                            <div className="h-1.5 bg-neutral-800 rounded-full flex-1 overflow-hidden relative">
                              <div className="h-full w-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
