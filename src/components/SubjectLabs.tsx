"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, X, BookOpen, Video, Clock, Star, GraduationCap, Pencil,
  Dna, FlaskConical, Atom, History as HistoryIcon, DollarSign, Brain, Globe, Compass, Activity, Rocket
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
  status: "STABLE" | "PREVIEW" | "BUILDING";
  description: string;
  bannerImage: string;
  logoImage?: string;
  unitsCount?: number;
  modulesCount?: number;
  isPracticeOnly?: boolean;
  accentHex: string;
  stats: { label: string; value: string }[];
  units: { number: string; title: string; desc: string }[];
  highlights: string[];
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
    id: "biology",
    name: "Biology",
    subCategory: "Natural Science",
    icon: Dna,
    courses: [
      {
        id: "honors-biology",
        name: "Honors Biology",
        slug: "honors-biology",
        status: "PREVIEW",
        description: "Honors Biology is a rigorous course that examines the principles of life sciences through an in-depth study of cell biology, genetics, evolution, and ecology.",
        bannerImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
        unitsCount: 1,
        modulesCount: 6,
        accentHex: "#3b82f6",
        stats: [{ label: "Articles", value: "6" }, { label: "Videos", value: "6" }, { label: "Est. Study", value: "12h" }, { label: "Practice Qs", value: "60+" }],
        units: [{ number: "Unit 1", title: "Foundations of Biological Life", desc: "Cell structure, biomolecules, and genetics." }],
        highlights: ["In-depth study of cellular biology", "Genetic replication & evolution frameworks"]
      },
      {
        id: "ap-biology",
        name: "AP® Biology",
        slug: "ap-biology",
        status: "STABLE",
        logoImage: "/images/course-logos/ap-biology-logo.png",
        description: "AP Biology is an introductory college-level biology course. Students cultivate their understanding of biology through inquiry-based investigations as they explore evolution, cellular processes, and information transfer.",
        bannerImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80",
        unitsCount: 8,
        modulesCount: 63,
        accentHex: "#10b981",
        stats: [{ label: "Articles", value: "25" }, { label: "Videos", value: "25" }, { label: "Est. Study", value: "48h" }, { label: "Practice Qs", value: "250+" }],
        units: [
          { number: "Unit 1", title: "Chemistry of Life", desc: "Macromolecules, water properties, and enzymes." },
          { number: "Unit 2", title: "Cell Structure & Function", desc: "Organelles, membrane transport, and tonicity." },
          { number: "Unit 3", title: "Cellular Energetics", desc: "Photosynthesis, respiration, and metabolic pathways." },
          { number: "Unit 4", title: "Cell Communication & Cycle", desc: "Signal transduction and mitosis." }
        ],
        highlights: ["8 Mapped Curriculum Units with 63 Subtopic Modules", "Interactive Vocabulary Popovers & Video Tutorials", "Full AP Exam Question Bank & Diagnostic Rubrics"]
      },
      {
        id: "ap-env-science",
        name: "AP® Environmental Science",
        slug: "ap-env-science",
        status: "STABLE",
        description: "The AP Environmental Science course is designed to engage students with the scientific principles, concepts, and methodologies required to understand environmental systems.",
        bannerImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 99,
        accentHex: "#22c55e",
        stats: [{ label: "Articles", value: "30" }, { label: "Videos", value: "30" }, { label: "Est. Study", value: "50h" }, { label: "Practice Qs", value: "300+" }],
        units: [{ number: "Unit 1", title: "The Living World: Ecosystems", desc: "Biomes, energy flow, and biogeochemical cycles." }],
        highlights: ["Comprehensive ecosystem coverage", "Data-driven sustainability case studies"]
      },
      {
        id: "ap-psychology",
        name: "AP® Psychology",
        slug: "ap-psychology",
        status: "STABLE",
        description: "The AP Psychology course introduces students to the systematic and scientific study of human behavior and mental processes. Explore cognitive models and biological influences.",
        bannerImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80",
        unitsCount: 5,
        modulesCount: 35,
        accentHex: "#a855f7",
        stats: [{ label: "Articles", value: "20" }, { label: "Videos", value: "20" }, { label: "Est. Study", value: "35h" }, { label: "Practice Qs", value: "200+" }],
        units: [{ number: "Unit 1", title: "Biological Bases of Behavior", desc: "Brain structures, neurotransmitters, and perception." }],
        highlights: ["Cognitive & behavioral psychology models", "High-yield neuroscience flashcards"]
      },
      {
        id: "ib-biology",
        name: "IB® Biology",
        slug: "ib-biology",
        status: "BUILDING",
        description: "IB Biology covers key biological concepts with emphasis on international perspectives, experimental design, and molecular biochemistry.",
        bannerImage: "https://images.unsplash.com/photo-1511497584788-876761c144ee?auto=format&fit=crop&w=600&q=80",
        unitsCount: 1,
        modulesCount: 6,
        accentHex: "#06b6d4",
        stats: [{ label: "Articles", value: "6" }, { label: "Videos", value: "6" }, { label: "Est. Study", value: "10h" }, { label: "Practice Qs", value: "50+" }],
        units: [{ number: "Unit 1", title: "Cell Biology & Genetics", desc: "Ultrastructure and membrane biology." }],
        highlights: ["IB Higher Level syllabus alignment", "Experimental analysis modules"]
      },
      {
        id: "ib-ess",
        name: "IB® Environmental Systems and Societies",
        slug: "ib-ess",
        status: "BUILDING",
        isPracticeOnly: true,
        description: "Interdisciplinary course combining science and society to evaluate environmental systems, sustainability, and global human impacts.",
        bannerImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80",
        accentHex: "#14b8a6",
        stats: [{ label: "Practice Qs", value: "150+" }],
        units: [{ number: "Practice Suite", title: "System Question Banks", desc: "Interactive scenario practice questions." }],
        highlights: ["Practice-only problem sets", "Real-world environmental case scenarios"]
      },
      {
        id: "ib-psychology",
        name: "IB® Psychology",
        slug: "ib-psychology",
        status: "BUILDING",
        isPracticeOnly: true,
        description: "Examines biological, cognitive, and sociocultural approaches to understanding human behavior in global contexts.",
        bannerImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
        accentHex: "#c084fc",
        stats: [{ label: "Practice Qs", value: "120+" }],
        units: [{ number: "Practice Suite", title: "Essay Prompt Drills", desc: "Short & extended response practice." }],
        highlights: ["Biological, cognitive & sociocultural essay drills"]
      },
      {
        id: "ib-sports",
        name: "IB® Sports, Exercise and Health Science",
        slug: "ib-sports",
        status: "BUILDING",
        isPracticeOnly: true,
        description: "Explores human anatomy, exercise physiology, biomechanics, movement analysis, and sports performance psychology.",
        bannerImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80",
        accentHex: "#f97316",
        stats: [{ label: "Practice Qs", value: "100+" }],
        units: [{ number: "Practice Suite", title: "Anatomy & Biomechanics", desc: "Targeted sports science question sets." }],
        highlights: ["Anatomy & exercise science problem banks"]
      }
    ]
  },
  {
    id: "economics",
    name: "Economics",
    subCategory: "Social Science",
    icon: DollarSign,
    courses: [
      {
        id: "ap-macro",
        name: "AP® Macroeconomics",
        slug: "ap-macroeconomics",
        status: "STABLE",
        description: "AP Macroeconomics is a college-level course that introduces students to the principles that apply to an economic system as a whole.",
        bannerImage: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=600&q=80",
        unitsCount: 6,
        modulesCount: 47,
        accentHex: "#3b82f6",
        stats: [{ label: "Articles", value: "22" }, { label: "Videos", value: "22" }, { label: "Est. Study", value: "36h" }, { label: "Practice Qs", value: "220+" }],
        units: [{ number: "Unit 1", title: "Basic Economic Concepts", desc: "Scarcity, opportunity cost, and trade." }],
        highlights: ["6 Mapped Units covering fiscal & monetary policy", "Interactive Phillips Curve & AD-AS graphs"]
      },
      {
        id: "ap-micro",
        name: "AP® Microeconomics",
        slug: "ap-microeconomics",
        status: "STABLE",
        description: "AP Microeconomics is a college-level course that introduces students to the principles of economics that apply to the functions of individual decision makers.",
        bannerImage: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=600&q=80",
        unitsCount: 6,
        modulesCount: 36,
        accentHex: "#60a5fa",
        stats: [{ label: "Articles", value: "18" }, { label: "Videos", value: "18" }, { label: "Est. Study", value: "30h" }, { label: "Practice Qs", value: "180+" }],
        units: [{ number: "Unit 1", title: "Supply & Demand", desc: "Market equilibrium, elasticity, and consumer surplus." }],
        highlights: ["Firm cost curves & market structure models", "Comprehensive elasticity calculation drills"]
      },
      {
        id: "ib-economics",
        name: "IB® Economics",
        slug: "ib-economics",
        status: "BUILDING",
        description: "Covers microeconomics, macroeconomics, international trade theories, and global development economic frameworks.",
        bannerImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80",
        unitsCount: 3,
        modulesCount: 18,
        accentHex: "#818cf8",
        stats: [{ label: "Articles", value: "12" }, { label: "Videos", value: "12" }, { label: "Est. Study", value: "20h" }, { label: "Practice Qs", value: "100+" }],
        units: [{ number: "Unit 1", title: "International Economics", desc: "Tariffs, trade barriers, and exchange rates." }],
        highlights: ["Global trade & macro equilibrium analysis"]
      }
    ]
  },
  {
    id: "history",
    name: "History",
    subCategory: "Social Science",
    icon: HistoryIcon,
    courses: [
      {
        id: "ap-afam",
        name: "AP® African American Studies",
        slug: "ap-african-american",
        status: "PREVIEW",
        description: "AP African American Studies is an interdisciplinary course that examines the diversity of African American experiences through direct encounters with authentic resources.",
        bannerImage: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=600&q=80",
        unitsCount: 4,
        modulesCount: 24,
        accentHex: "#eab308",
        stats: [{ label: "Articles", value: "16" }, { label: "Videos", value: "16" }, { label: "Est. Study", value: "24h" }, { label: "Practice Qs", value: "140+" }],
        units: [{ number: "Unit 1", title: "Origins of the African Diaspora", desc: "Early kingdoms, culture, and transatlantic trade." }],
        highlights: ["Interdisciplinary primary source analyses", "Artistic & literary movement study guides"]
      },
      {
        id: "ap-euro",
        name: "AP® European History",
        slug: "ap-european-history",
        status: "PREVIEW",
        description: "In AP European History, students investigate significant events, individuals, developments, and processes from approximately 1450 to the present.",
        bannerImage: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 90,
        accentHex: "#f59e0b",
        stats: [{ label: "Articles", value: "30" }, { label: "Videos", value: "30" }, { label: "Est. Study", value: "45h" }, { label: "Practice Qs", value: "280+" }],
        units: [{ number: "Unit 1", title: "Renaissance & Exploration", desc: "Humanism, artistic innovations, and global contact." }],
        highlights: ["DBQ document analysis strategies", "9 Complete historical periods breakdown"]
      },
      {
        id: "ap-humangeo",
        name: "AP® Human Geography",
        slug: "ap-human-geography",
        status: "PREVIEW",
        description: "AP Human Geography introduces students to the systematic study of patterns and processes that have shaped human understanding, use, and alteration of Earth's surface.",
        bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
        unitsCount: 7,
        modulesCount: 63,
        accentHex: "#10b981",
        stats: [{ label: "Articles", value: "24" }, { label: "Videos", value: "24" }, { label: "Est. Study", value: "36h" }, { label: "Practice Qs", value: "210+" }],
        units: [{ number: "Unit 1", title: "Thinking Geographically", desc: "Maps, spatial data, and GIS applications." }],
        highlights: ["Spatial data & demographic models", "Urbanization & agricultural trend studies"]
      },
      {
        id: "ap-us-history",
        name: "AP® US History",
        slug: "ap-ushistory",
        status: "PREVIEW",
        logoImage: "/images/course-logos/ap-ushistory-logo.png",
        description: "In AP U.S. History, students investigate significant events, individuals, developments, and processes in nine historical periods from 1491 to the present.",
        bannerImage: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 86,
        accentHex: "#ef4444",
        stats: [{ label: "Articles", value: "32" }, { label: "Videos", value: "32" }, { label: "Est. Study", value: "50h" }, { label: "Practice Qs", value: "300+" }],
        units: [
          { number: "Period 1", title: "1491 - 1607", desc: "Native American societies and European contact." },
          { number: "Period 2", title: "1607 - 1754", desc: "Colonial settlement and transatlantic commerce." },
          { number: "Period 3", title: "1754 - 1800", desc: "American Revolution and Constitution." }
        ],
        highlights: ["9 Historical Periods fully mapped with videos", "DBQ & LEQ essay writing rubrics & primary sources", "Custom AP US History official line art logo"]
      },
      {
        id: "ap-world-history",
        name: "AP® World History: Modern",
        slug: "ap-world-history",
        status: "STABLE",
        description: "In AP World History: Modern, students explore significant events, individuals, developments, and processes from 1200 to the present across global civilizations.",
        bannerImage: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 63,
        accentHex: "#84cc16",
        stats: [{ label: "Articles", value: "28" }, { label: "Videos", value: "28" }, { label: "Est. Study", value: "42h" }, { label: "Practice Qs", value: "260+" }],
        units: [{ number: "Unit 1", title: "The Global Tapestry", desc: "State building in Asia, Dar al-Islam, and Europe." }],
        highlights: ["Global historical process comparisons", "Cross-cultural trade & empire networks"]
      }
    ]
  },
  {
    id: "physics",
    name: "Physics",
    subCategory: "Natural Science",
    icon: Rocket,
    courses: [
      {
        id: "ap-physics-c",
        name: "AP® Physics C: Mechanics",
        slug: "ap-physics-c",
        status: "STABLE",
        logoImage: "/images/course-logos/ap-physics-c-logo.png",
        description: "AP Physics C: Mechanics is a calculus-based physics course covering kinematics, Newton's laws of motion, work, energy, power, momentum, circular motion, rotation, and oscillations.",
        bannerImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80",
        unitsCount: 7,
        modulesCount: 50,
        accentHex: "#6366f1",
        stats: [{ label: "Articles", value: "36" }, { label: "Videos", value: "36" }, { label: "Est. Study", value: "38h" }, { label: "Practice Qs", value: "360+" }],
        units: [
          { number: "Unit 1", title: "Kinematics", desc: "Position vectors, velocity, and derivative acceleration." },
          { number: "Unit 2", title: "Newton's Laws of Motion", desc: "Forces, friction, and differential equations." },
          { number: "Unit 3", title: "Work, Energy & Power", desc: "Line integrals and potential energy functions." }
        ],
        highlights: ["Calculus-based derivations & vector proofs", "Rocket kinematics & rotational dynamics models", "Custom AP Physics C official rocket logo"]
      },
      {
        id: "ap-physics-1",
        name: "AP® Physics 1",
        slug: "ap-physics-1",
        status: "STABLE",
        description: "AP Physics 1 is an algebra-based, introductory college-level physics course exploring Newtonian mechanics, work, energy, and mechanical waves.",
        bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
        unitsCount: 7,
        modulesCount: 45,
        accentHex: "#38bdf8",
        stats: [{ label: "Articles", value: "25" }, { label: "Videos", value: "25" }, { label: "Est. Study", value: "32h" }, { label: "Practice Qs", value: "250+" }],
        units: [{ number: "Unit 1", title: "Kinematics", desc: "1D and 2D projectile motion." }],
        highlights: ["Algebra-based mechanics & wave models"]
      }
    ]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    subCategory: "Natural Science",
    icon: FlaskConical,
    courses: [
      {
        id: "ap-chemistry",
        name: "AP® Chemistry",
        slug: "ap-chemistry",
        status: "STABLE",
        logoImage: "/images/course-logos/ap-chemistry-logo.png",
        description: "AP Chemistry provides students with a college-level foundation to support future advanced coursework in chemistry. Analyze atomic structure, kinetics, equilibrium, and thermodynamics.",
        bannerImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
        unitsCount: 9,
        modulesCount: 72,
        accentHex: "#60a5fa",
        stats: [{ label: "Articles", value: "27" }, { label: "Videos", value: "27" }, { label: "Est. Study", value: "45h" }, { label: "Practice Qs", value: "270+" }],
        units: [
          { number: "Unit 1", title: "Atomic Structure & Properties", desc: "Periodic trends and mass spectrometry." },
          { number: "Unit 2", title: "Molecular & Ionic Compound Structure", desc: "Lewis diagrams, VSEPR, and hybridization." },
          { number: "Unit 3", title: "Intermolecular Forces & Properties", desc: "Solutions, phase diagrams, and gas laws." }
        ],
        highlights: ["9 Mapped Units with reaction simulations", "Interactive Equilibrium & Thermodynamics math", "Custom AP Chemistry official flask logo"]
      }
    ]
  }
];

export function SubjectLabs() {
  const [activeCourse, setActiveCourse] = useState<CourseCardData | null>(null);
  const router = useRouter();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (activeCourse) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeCourse]);

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
            High-yield AP & IB learning environments powered by interactive visuals, mapped syllabus units, and practice question suites.
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

                {/* COURSES CARDS GRID (NO LIFT ON HOVER, SHINE HOVER EFFECT KEPT) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {category.courses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => setActiveCourse(course)}
                      className="group relative bg-[#13141c] border border-[#242636] hover:border-white/25 rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-colors duration-300 flex flex-col justify-between"
                    >
                      {/* SHINE SWEEP HOVER EFFECT (NO ELEVATION/LIFT ON HOVER) */}
                      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute -top-1/2 -left-full w-full h-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent transform -rotate-45 group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out" />
                      </div>

                      {/* TOP BANNER IMAGE CONTAINER */}
                      <div className="h-28 w-full relative overflow-hidden bg-neutral-900 shrink-0">
                        <img
                          src={course.bannerImage}
                          alt={course.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#13141c] via-transparent to-black/40" />

                        {/* TOP RIGHT STATUS BADGE */}
                        <div className="absolute top-3 right-3 z-10">
                          {course.status === "STABLE" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#162942]/90 border border-blue-400/40 text-blue-300 text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 shadow-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                              STABLE
                            </span>
                          )}
                          {course.status === "PREVIEW" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#3d2c18]/90 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 shadow-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                              PREVIEW
                            </span>
                          )}
                          {course.status === "BUILDING" && (
                            <span className="px-2.5 py-0.5 rounded-full bg-[#3b2118]/90 border border-amber-500/50 text-amber-400 text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 shadow-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              BUILDING
                            </span>
                          )}
                        </div>

                        {/* OVERLAID OFFICIAL COURSE LOGO (FOR AP BIO, AP CHEM, AP PHYSICS C, AP US HISTORY) */}
                        {course.logoImage && (
                          <div className="absolute top-2.5 left-3 z-10 w-10 h-10 rounded-full bg-black/65 border border-white/20 backdrop-blur-md flex items-center justify-center p-1.5 shadow-xl group-hover:border-white/40 transition-colors">
                            <img src={course.logoImage} alt={`${course.name} logo`} className="w-full h-full object-contain filter drop-shadow-md" />
                          </div>
                        )}
                      </div>

                      {/* CARD CONTENT BODY */}
                      <div className="p-4 flex flex-col justify-between space-y-3 flex-1 min-h-[160px]">
                        <div className="space-y-1.5">
                          {/* TITLE WITH MORTARBOARD ICON */}
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="w-4 h-4 text-white/80 shrink-0" />
                            <h4 className="font-manrope font-extrabold text-sm sm:text-base text-white tracking-tight group-hover:text-purple-300 transition-colors">
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
                          {course.isPracticeOnly ? (
                            <div className="flex items-center">
                              <span className="px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-[10px] font-manrope font-extrabold tracking-wider uppercase">
                                &bull; PRACTICE-ONLY COURSE
                              </span>
                            </div>
                          ) : (
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
                          )}

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

      {/* AESTHETIC COURSE PREVIEW MODAL */}
      <AnimatePresence>
        {activeCourse && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCourse(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-4xl bg-[#12131a] border border-white/15 rounded-[32px] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col z-10 text-white"
            >
              {/* Top Accent Bar */}
              <div 
                className="absolute top-0 inset-x-0 h-1 pointer-events-none"
                style={{
                  background: `linear-gradient(to right, transparent, ${activeCourse.accentHex}, transparent)`
                }}
              />
              
              {/* Close Button */}
              <button
                onClick={() => setActiveCourse(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all z-30 border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Modal Content */}
              <div className="p-6 md:p-8 overflow-y-auto w-full max-h-[85vh] space-y-6 flex-1 min-h-0 custom-scrollbar">
                
                {/* Header Section */}
                <div className="flex items-center space-x-4">
                  {activeCourse.logoImage ? (
                    <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/20 flex items-center justify-center p-2 shrink-0">
                      <img src={activeCourse.logoImage} alt={activeCourse.name} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                      <GraduationCap className="w-7 h-7 text-purple-400" />
                    </div>
                  )}

                  <div>
                    <h2 className="text-2xl sm:text-3xl font-manrope font-extrabold text-white tracking-tight">
                      {activeCourse.name}
                    </h2>
                    <p className="text-xs text-white/50 font-manrope">
                      AP Lab Curriculum Suite &bull; {activeCourse.status}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-white/80 font-manrope leading-relaxed bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                  {activeCourse.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeCourse.stats.map((stat, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/10 rounded-2xl p-3.5 text-center">
                      <div className="text-lg font-bold text-white tracking-tight">{stat.value}</div>
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/40">Course Highlights</h4>
                  <div className="space-y-2">
                    {activeCourse.highlights.map((h, idx) => (
                      <div key={idx} className="flex items-center space-x-2.5 text-xs text-white/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Syllabus Preview */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white/40">Curriculum Units</h4>
                  <div className="space-y-2">
                    {activeCourse.units.map((u, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-300 font-mono">{u.number}: {u.title}</span>
                        <span className="text-white/50 text-[11px] truncate max-w-xs">{u.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex items-center space-x-3 border-t border-white/10">
                  <button
                    onClick={() => {
                      if (currentUser) {
                        router.push(`/dashboard/${activeCourse.slug}`);
                      } else {
                        router.push("/login?view=signin");
                      }
                      setActiveCourse(null);
                    }}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-neutral-200 text-black font-manrope font-bold text-xs text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95"
                  >
                    <span>Start Course</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveCourse(null)}
                    className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-manrope font-semibold text-xs transition-colors cursor-pointer border border-white/10"
                  >
                    Close Preview
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
