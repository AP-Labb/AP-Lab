"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SVGProps } from "react";
import { ArrowRight, X, BookOpen, Video, Clock, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BiologyDNA3D } from "./BiologyDNA3D";
import { ChemistryMolecule3D } from "./ChemistryMolecule3D";
import { PhysicsOrbit3D } from "./PhysicsOrbit3D";
import { courseRegistry } from "@/lib/courses/course-registry";
import { Cursor } from "@/components/ui/cursor";

const MouseIcon = ({ color, ...props }: SVGProps<SVGSVGElement> & { color: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={26}
      height={31}
      fill="none"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          fill={color}
          fillRule="evenodd"
          stroke={"#fff"}
          strokeLinecap="square"
          strokeWidth={2}
          d="M21.993 14.425 2.549 2.935l4.444 23.108 4.653-10.002z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill={color} d="M0 0h26v31H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

interface CoursePreview {
  id: string;
  name: string;
  badge: string;
  category: string;
  description: string;
  accentHex: string;
  stats: { label: string; value: string }[];
  units: { number: string; title: string; desc: string }[];
  highlights: string[];
  visualType: "dna" | "calculus" | "physics" | "chemistry";
  slug: string;
}

const COURSE_PREVIEWS: CoursePreview[] = [
  {
    id: "biology",
    name: "AP® Biology",
    badge: "25 Articles • 25 Videos",
    category: "STEM & Sciences",
    description: "Explore the fundamental principles of life. Decode the cellular matrix, delve into evolutionary models, and unravel gene replication mechanics with deep-dive visual modules, laboratory guides, and interactive simulations.",
    accentHex: "#10b981",
    slug: "ap-biology",
    stats: [
      { label: "Articles", value: "25" },
      { label: "Videos", value: "25" },
      { label: "Est. Study", value: "48h" },
      { label: "Practice Qs", value: "250+" }
    ],
    units: [
      { number: "Unit 1", title: "Chemistry of Life", desc: "Properties of water, macromolecule structures, biological polymers, and cellular chemical reactions." },
      { number: "Unit 2", title: "Cell Structure & Function", desc: "Organelle specialization, membrane permeability, active/passive transport, and tonicity." },
      { number: "Unit 3", title: "Cellular Energetics", desc: "Enzyme kinetics, metabolic pathways, photosynthesis light/dark reactions, and respiration." },
      { number: "Unit 4", title: "Genetics & Gene Regulation", desc: "Meiotic division, Mendelian inheritance, chromatin remodeling, and transcription regulation." }
    ],
    highlights: [
      "8 Mapped Curriculum Units: Mapped study structure covering the complete course syllabus.",
      "25 Subtopic Video Lectures: Embedded video tutorials for every single subtopic.",
      "Detailed Reading Articles: Comprehensive reading material to master complex concepts.",
      "Interactive Vocabulary Definitions: Instant popover tooltips for highlighted terms in articles.",
      "Multiple-Choice Quizzes: Practice questions for each subtopic with explanations."
    ],
    visualType: "dna"
  },
  {
    id: "calculus",
    name: "AP® Calculus",
    badge: "28 Articles • 14 Videos",
    category: "Mathematical Logic",
    description: "Conquer the foundations of limits, derivatives, and integrals. Build intuitive geometric understanding through interactive coordinate models, dynamic slope visualizations, and step-by-step calculus proofs.",
    accentHex: "#c084fc",
    slug: "ap-calc-bc",
    stats: [
      { label: "Articles", value: "28" },
      { label: "Videos", value: "14" },
      { label: "Est. Study", value: "42h" },
      { label: "Practice Qs", value: "1,500+" }
    ],
    units: [
      { number: "Unit 1", title: "Limits & Continuity", desc: "Definition of limit, algebraic evaluation, intermediate value theorem, and asymptote behaviors." },
      { number: "Unit 2", title: "Differentiation Foundations", desc: "Derivative definition, derivative rules, rates of change, and implicit differentiation." },
      { number: "Unit 3", title: "Analytical Applications", desc: "Extreme Value Theorem, Mean Value Theorem, optimization scenarios, and curve sketching." },
      { number: "Unit 4", title: "Integration & Accumulation", desc: "Riemann sums, Fundamental Theorem of Calculus, accumulation functions, and area calculations." }
    ],
    highlights: [
      "Structured Curriculum Units: Full syllabus coverage of limits, derivatives, and integrals.",
      "28 Subtopic Video Lectures: Video tutorials mapping all sections of the course.",
      "Interactive Reading Articles: Formatted articles for studying calculus proofs and concepts.",
      "Multiple-Choice Quizzes: Practice question sets to test mathematical logic."
    ],
    visualType: "calculus"
  },
  {
    id: "physics",
    name: "AP® Physics",
    badge: "36 Articles • 36 Videos",
    category: "STEM & Sciences",
    description: "Master the laws governing the universe. Investigate particle dynamics, electromagnetism, and energy conservation models with precision vector setups, force diagrams, and physical system sandboxes.",
    accentHex: "#818cf8",
    slug: "ap-physics-c",
    stats: [
      { label: "Articles", value: "36" },
      { label: "Videos", value: "36" },
      { label: "Est. Study", value: "38h" },
      { label: "Practice Qs", value: "360+" }
    ],
    units: [
      { number: "Unit 1", title: "Kinematics & Dynamics", desc: "Motion vector analysis, projectile paths, Newton's laws of motion, and friction coefficients." },
      { number: "Unit 2", title: "Work, Energy & Power", desc: "Conservation of mechanical energy, work-energy theorem, and conservative forces." },
      { number: "Unit 3", title: "Momentum & Rotation", desc: "Elastic and inelastic collisions, torque, center of mass, and rotational inertia." },
      { number: "Unit 4", title: "Oscillations & Gravity", desc: "Simple harmonic oscillators, gravitational force fields, and Kepler's laws." }
    ],
    highlights: [
      "12 Mapped Curriculum Units: Thorough coverage of Newtonian mechanics, kinematics, and rotation.",
      "36 Subtopic Video Lectures: Embedded video explanations for every subtopic.",
      "Detailed Mechanics Articles: Targeted reading guides covering core physics equations.",
      "Interactive Vocabulary Definitions: Tap highlighted terms in articles to read quick definitions.",
      "Multiple-Choice Quizzes: 10 practice questions per subtopic with explanations."
    ],
    visualType: "physics"
  },
  {
    id: "chemistry",
    name: "AP® Chemistry",
    badge: "27 Articles • 27 Videos",
    category: "STEM & Sciences",
    description: "Deconstruct the micro-world. Analyze thermodynamic systems, equilibrium math, kinetics, and molecular orbital structures using fully interactive chemical reaction simulations and molecular models.",
    accentHex: "#60a5fa",
    slug: "ap-chemistry",
    stats: [
      { label: "Articles", value: "27" },
      { label: "Videos", value: "27" },
      { label: "Est. Study", value: "45h" },
      { label: "Practice Qs", value: "270+" }
    ],
    units: [
      { number: "Unit 1", title: "Atomic Structure & Properties", desc: "Electron configuration, periodic trends (electronegativity, atomic radius), and bonding types." },
      { number: "Unit 2", title: "Chemical Reactions", desc: "Stoichiometry, net ionic equations, precipitation, and redox reaction processes." },
      { number: "Unit 3", title: "Kinetics & Equilibrium", desc: "Rate laws, activation energy, collision theory, and Le Chatelier's equilibrium principle." },
      { number: "Unit 4", title: "Thermodynamics & pH", desc: "Enthalpy, entropy, Gibbs free energy, acid-base theories, and buffer system math." }
    ],
    highlights: [
      "9 Mapped Curriculum Units: Mapped study structure for atomic structure, thermodynamics, and kinetics.",
      "27 Subtopic Video Lectures: Video tutorials for every subtopic.",
      "Comprehensive Chemistry Articles: Reading material covering reactions and equilibrium principles.",
      "Interactive Vocabulary Definitions: Instant definition tooltips for key chemistry terms.",
      "Multiple-Choice Quizzes: 10 practice questions per subtopic with explanations."
    ],
    visualType: "chemistry"
  }
];

function CalculusVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[200px] select-none cursor-pointer overflow-hidden rounded-2xl relative bg-white/[0.01]">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
      <svg width="320" height="220" viewBox="0 0 320 220" className="w-full h-full max-w-[320px] z-10 p-4">
        <defs>
          <linearGradient id="calcGradModal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        {/* Axes */}
        <line x1="20" y1="110" x2="300" y2="110" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <line x1="160" y1="20" x2="160" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        
        {/* Grid lines */}
        {[60, 110, 210, 260].map(x => (
          <line key={`x-${x}`} x1={x} y1="20" x2={x} y2="200" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        ))}
        {[60, 160].map(y => (
          <line key={`y-${y}`} x1="20" y1={y} x2="300" y2={y} stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
        ))}

        {/* Function Curve */}
        <motion.path
          d="M 20 160 Q 90 20, 160 110 T 300 60"
          fill="none"
          stroke="url(#calcGradModal)"
          strokeWidth="3.5"
        />

        {/* Tangent line */}
        <motion.line
          x1="60" y1="130" x2="120" y2="50"
          stroke="#10b981"
          strokeWidth="2"
          animate={{
            x1: [30, 130, 230, 130, 30],
            y1: [150, 70, 70, 70, 150],
            x2: [90, 190, 270, 190, 90],
            y2: [110, 150, 50, 150, 110],
          }}
          transition={{
            duration: 6, repeat: Infinity, ease: "easeInOut"
          }}
        />

        {/* Tracing Point */}
        <motion.circle
          r="6"
          fill="#ffffff"
          animate={{
            cx: [60, 160, 250, 160, 60],
            cy: [130, 110, 60, 110, 130],
          }}
          transition={{
            duration: 6, repeat: Infinity, ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );
}

export function SubjectLabs() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeCourse, setActiveCourse] = useState<string | null>(null);
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

  const activeCourseData = COURSE_PREVIEWS.find(c => c.id === activeCourse);

  return (
    <section className={`relative w-full py-[160px] px-6 md:px-[120px] bg-deep-navy overflow-hidden ${activeCourse ? "z-[60]" : "z-10"}`}>
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-inter font-extrabold text-white text-3xl md:text-5xl tracking-tight mb-4"
          >
            Class Previews
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-inter text-white/50 text-sm md:text-base max-w-lg mx-auto leading-relaxed"
          >
            Immerse yourself in specialized high-yield learning environments powered by interactive visuals and precision guides.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: AP Biology (Large, Hero Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            onMouseEnter={() => setHoveredCard("biology")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setActiveCourse("biology")}
            whileHover={{ y: -6 }}
            className="lg:col-span-2 md:col-span-2 h-auto md:h-[440px] relative bg-[#121212] border border-white/[0.03] rounded-[28px] p-8 md:p-10 flex flex-col md:flex-row justify-between items-stretch overflow-hidden group cursor-pointer transition-all duration-150 hover:bg-[#1a1a1a] hover:border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            <Cursor
              attachToParent
              variants={{
                initial: { scale: 0.3, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.3, opacity: 0 },
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.15,
              }}
              className="left-4 top-4"
            >
              <div>
                <MouseIcon color="#22c55e" className="h-6 w-6" />
                <div className="ml-4 mt-1 rounded-[4px] bg-[#22c55e] px-2 py-0.5 text-xs text-white font-manrope font-semibold whitespace-nowrap shadow-md">
                  AP® Biology
                </div>
              </div>
            </Cursor>
            {/* Card Content (Left) */}
            <div className="flex flex-col justify-between relative z-10 w-full md:w-1/2 min-h-[200px] md:min-h-0">
              <div>
                {/* Resource Density Badge */}
                <div className="bg-white/[0.07] text-white/70 text-[11px] font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full w-fit mb-6 select-none">
                  25 Articles &bull; 25 Videos
                </div>
                <h3 className="font-manrope font-bold text-3xl md:text-4xl text-white mb-4 tracking-tight">
                  AP® Biology
                </h3>
                <p className="font-inter text-white/50 text-sm md:text-base leading-relaxed max-w-sm">
                  Decode the cellular matrix, evolutionary models, and gene replication mechanics with deep-dive visual modules.
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 md:mt-0">
                <span className="font-manrope font-bold text-[13px] tracking-wide uppercase text-[#1db954] hover:text-[#1ed760] flex items-center gap-1.5 group/btn transition-colors duration-300">
                  Learn more
                  <ArrowRight className="w-4 h-4 text-[#1db954] group-hover:text-[#1ed760] group-hover/btn:translate-x-1 transition-all duration-300" />
                </span>
              </div>
            </div>

            {/* 3D Visual Section (Right) */}
            <div 
              className="relative w-full md:w-1/2 flex items-center justify-center h-[200px] md:h-auto select-none"
            >
              <div className="absolute inset-0 bg-radial-gradient from-emerald-500/5 to-transparent pointer-events-none" />
              <BiologyDNA3D isHovered={hoveredCard === "biology"} />
            </div>
          </motion.div>

          {/* Card 2: AP Calculus (Small Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            onMouseEnter={() => setHoveredCard("calculus")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setActiveCourse("calculus")}
            whileHover={{ y: -6 }}
            className="lg:col-span-1 md:col-span-1 h-auto md:h-[440px] relative bg-[#121212] border border-white/[0.03] rounded-[28px] p-8 md:p-10 flex flex-col justify-between overflow-hidden group cursor-pointer transition-all duration-150 hover:bg-[#1a1a1a] hover:border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            <Cursor
              attachToParent
              variants={{
                initial: { scale: 0.3, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.3, opacity: 0 },
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.15,
              }}
              className="left-4 top-4"
            >
              <div>
                <MouseIcon color="#ec4899" className="h-6 w-6" />
                <div className="ml-4 mt-1 rounded-[4px] bg-[#ec4899] px-2 py-0.5 text-xs text-white font-manrope font-semibold whitespace-nowrap shadow-md">
                  AP® Calculus
                </div>
              </div>
            </Cursor>
            {/* Background SVG Curve Animation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity duration-150 pointer-events-none mt-28">
              <svg width="280" height="180" viewBox="0 0 280 180" className="w-full h-full max-w-[280px]">
                <defs>
                  <linearGradient id="calcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
                {/* Grid Lines */}
                <line x1="10" y1="90" x2="270" y2="90" stroke={hoveredCard === "calculus" ? "rgba(255,255,255,0.08)" : "#050505"} strokeWidth="1.5" style={{ transition: "stroke 0.4s ease" }} />
                <line x1="140" y1="10" x2="140" y2="170" stroke={hoveredCard === "calculus" ? "rgba(255,255,255,0.08)" : "#050505"} strokeWidth="1.5" style={{ transition: "stroke 0.4s ease" }} />
                {/* Curve */}
                <motion.path
                  d="M 10 130 Q 75 10, 140 90 T 270 50"
                  fill="none"
                  stroke={hoveredCard === "calculus" ? "url(#calcGrad)" : "#050505"}
                  strokeWidth="3"
                  initial={{ pathLength: 0.9 }}
                  animate={hoveredCard === "calculus" ? {
                    strokeWidth: 4,
                  } : {
                    strokeWidth: 3,
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ transition: "stroke 0.4s ease" }}
                />
                {/* Scanning point */}
                <motion.circle
                  r="5"
                  fill={hoveredCard === "calculus" ? "#ffffff" : "#050505"}
                  className="shadow-lg"
                  animate={{
                    cx: [20, 260, 20],
                    cy: [122, 53, 122],
                  }}
                  transition={{
                    duration: hoveredCard === "calculus" ? 2.5 : 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ transition: "fill 0.4s ease" }}
                />
              </svg>
            </div>

            <div className="relative z-10">
              {/* Resource Density Badge */}
              <div className="bg-white/[0.07] text-white/70 text-[11px] font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full w-fit mb-6 select-none">
                28 Articles &bull; 14 Videos
              </div>
              <h3 className="font-manrope font-bold text-3xl text-white mb-4 tracking-tight">
                AP® Calculus
              </h3>
              <p className="font-inter text-white/50 text-sm leading-relaxed max-w-[260px]">
                Conquer limit proofs, derivatives, and integral calculus structures through interactive coordinate models.
              </p>
            </div>

            {/* Action Button */}
            <div className="relative z-10 mt-6">
              <span className="font-manrope font-bold text-[13px] tracking-wide uppercase text-[#1db954] hover:text-[#1ed760] flex items-center gap-1.5 group/btn transition-colors duration-300">
                Learn more
                <ArrowRight className="w-4 h-4 text-[#1db954] group-hover:text-[#1ed760] group-hover/btn:translate-x-1 transition-all duration-300" />
              </span>
            </div>
          </motion.div>

          {/* Card 3: AP Physics (Small Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.15 }}
            onMouseEnter={() => setHoveredCard("physics")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setActiveCourse("physics")}
            whileHover={{ y: -6 }}
            className="lg:col-span-1 md:col-span-1 h-auto md:h-[440px] relative bg-[#121212] border border-white/[0.03] rounded-[28px] p-8 md:p-10 flex flex-col justify-between overflow-hidden group cursor-pointer transition-all duration-150 hover:bg-[#1a1a1a] hover:border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            <Cursor
              attachToParent
              variants={{
                initial: { scale: 0.3, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.3, opacity: 0 },
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.15,
              }}
              className="left-4 top-4"
            >
              <div>
                <MouseIcon color="#0ea5e9" className="h-6 w-6" />
                <div className="ml-4 mt-1 rounded-[4px] bg-[#0ea5e9] px-2 py-0.5 text-xs text-white font-manrope font-semibold whitespace-nowrap shadow-md">
                  AP® Physics
                </div>
              </div>
            </Cursor>
            {/* 3D Visual Section */}
            <div className="absolute inset-x-0 bottom-12 flex items-center justify-center h-[200px] pointer-events-none z-0">
              <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 to-transparent pointer-events-none" />
              <PhysicsOrbit3D isHovered={hoveredCard === "physics"} />
            </div>

            <div className="relative z-10">
              {/* Resource Density Badge */}
              <div className="bg-white/[0.07] text-white/70 text-[11px] font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full w-fit mb-6 select-none">
                36 Articles &bull; 36 Videos
              </div>
              <h3 className="font-manrope font-bold text-3xl text-white mb-4 tracking-tight">
                AP® Physics
              </h3>
              <p className="font-inter text-white/50 text-sm leading-relaxed max-w-[260px]">
                Master particle dynamics, electromagnetism, and energy conservation models with precision vector setups.
              </p>
            </div>

            {/* Action Button */}
            <div className="relative z-10 mt-6">
              <span className="font-manrope font-bold text-[13px] tracking-wide uppercase text-[#1db954] hover:text-[#1ed760] flex items-center gap-1.5 group/btn transition-colors duration-300">
                Learn more
                <ArrowRight className="w-4 h-4 text-[#1db954] group-hover:text-[#1ed760] group-hover/btn:translate-x-1 transition-all duration-300" />
              </span>
            </div>
          </motion.div>

          {/* Card 4: AP Chemistry (Large, Hero Card) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            onMouseEnter={() => setHoveredCard("chemistry")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => setActiveCourse("chemistry")}
            whileHover={{ y: -6 }}
            className="lg:col-span-2 md:col-span-2 h-auto md:h-[440px] relative bg-[#121212] border border-white/[0.03] rounded-[28px] p-8 md:p-10 flex flex-col md:flex-row-reverse justify-between items-stretch overflow-hidden group cursor-pointer transition-all duration-150 hover:bg-[#1a1a1a] hover:border-white/[0.08] shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
          >
            <Cursor
              attachToParent
              variants={{
                initial: { scale: 0.3, opacity: 0 },
                animate: { scale: 1, opacity: 1 },
                exit: { scale: 0.3, opacity: 0 },
              }}
              transition={{
                ease: "easeInOut",
                duration: 0.15,
              }}
              className="left-4 top-4"
            >
              <div>
                <MouseIcon color="#14b8a6" className="h-6 w-6" />
                <div className="ml-4 mt-1 rounded-[4px] bg-[#14b8a6] px-2 py-0.5 text-xs text-white font-manrope font-semibold whitespace-nowrap shadow-md">
                  AP® Chemistry
                </div>
              </div>
            </Cursor>
            {/* Card Content (Right/Left depending on orientation, here it is md:flex-row-reverse) */}
            <div className="flex flex-col justify-between relative z-10 w-full md:w-1/2 min-h-[200px] md:min-h-0">
              <div>
                {/* Resource Density Badge */}
                <div className="bg-white/[0.07] text-white/70 text-[11px] font-mono tracking-wider uppercase px-3.5 py-1.5 rounded-full w-fit mb-6 select-none">
                  27 Articles &bull; 27 Videos
                </div>
                <h3 className="font-manrope font-bold text-3xl md:text-4xl text-white mb-4 tracking-tight">
                  AP® Chemistry
                </h3>
                <p className="font-inter text-white/50 text-sm md:text-base leading-relaxed max-w-sm">
                  Deconstruct thermodynamic systems, equilibrium math, and molecular orbital structures.
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 md:mt-0">
                <span className="font-manrope font-bold text-[13px] tracking-wide uppercase text-[#1db954] hover:text-[#1ed760] flex items-center gap-1.5 group/btn transition-colors duration-300">
                  Learn more
                  <ArrowRight className="w-4 h-4 text-[#1db954] group-hover:text-[#1ed760] group-hover/btn:translate-x-1 transition-all duration-300" />
                </span>
              </div>
            </div>

            {/* 3D Visual Section (Left/Right) */}
            <div className="relative w-full md:w-1/2 flex items-center justify-center h-[200px] md:h-auto select-none">
              <div className="absolute inset-0 bg-radial-gradient from-indigo-500/5 to-transparent pointer-events-none" />
              <ChemistryMolecule3D isHovered={hoveredCard === "chemistry"} />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Aesthetic detailed course preview modal */}
      <AnimatePresence>
        {activeCourseData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
            {/* Backdrop with strong blur */}
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
              className="relative w-full max-w-5xl bg-[#0a0a0c] border border-white/10 rounded-[32px] shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden max-h-[90vh] flex flex-col z-10"
            >
              {/* Colored accent line at the top */}
              <div 
                className="absolute top-0 inset-x-0 h-1 pointer-events-none"
                style={{
                  background: `linear-gradient(to right, transparent, ${activeCourseData.accentHex}, transparent)`
                }}
              />
              
              {/* Close Button */}
              <button
                onClick={() => setActiveCourse(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all z-20 border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Container */}
              <div className="p-8 md:p-12 overflow-y-auto w-full max-h-[90vh] no-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-stretch">
                  
                  {/* Left Column: General Info, Badges, Stats & Highlights */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Tags */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-white/5 border border-white/5 text-white/60">
                          {activeCourseData.category}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#1db954] font-semibold">
                          {activeCourseData.badge}
                        </span>
                      </div>
                      
                      {/* Name */}
                      <h2 className="text-4xl md:text-5xl font-manrope font-extrabold text-white tracking-tight leading-none mb-4">
                        {activeCourseData.name}
                      </h2>
                      
                      {/* Description */}
                      <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8">
                        {activeCourseData.description}
                      </p>
                      
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {activeCourseData.stats.map((stat, i) => {
                          let StatIcon = BookOpen;
                          if (stat.label.includes("Video")) StatIcon = Video;
                          if (stat.label.includes("Study")) StatIcon = Clock;
                          if (stat.label.includes("Rate")) StatIcon = Star;
                          
                          return (
                            <div 
                              key={i}
                              className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-between h-[100px] hover:border-white/10 transition-all"
                            >
                              <StatIcon className="w-4 h-4 text-white/40" />
                              <div>
                                <div className="text-xl font-bold text-white tracking-tight leading-none mb-1">
                                  {stat.value}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest font-mono text-white/40">
                                  {stat.label}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Highlights */}
                      <div className="space-y-3.5 mb-8">
                        <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-3.5">
                          Course Highlights & Features
                        </h4>
                        {activeCourseData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <span 
                              className="w-1.5 h-1.5 rounded-full mt-2 shrink-0 animate-pulse" 
                              style={{ backgroundColor: activeCourseData.accentHex }}
                            />
                            <span className="text-sm text-white/80">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/5">
                      <button
                        onClick={() => {
                          if (currentUser) {
                            router.push(`/dashboard/${activeCourseData.slug}`);
                          } else {
                            router.push("/login?view=signin");
                          }
                          setActiveCourse(null);
                        }}
                        className="flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-white/90 text-black font-semibold text-center active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                        style={{
                          boxShadow: `0 4px 25px ${activeCourseData.accentHex}40`
                        }}
                      >
                        <span>Start Course</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveCourse(null)}
                        className="flex-1 py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-center border border-white/5 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                  
                  {/* Right Column: Concept Preview Visual & Syllabus Units */}
                  <div className="lg:col-span-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-8">
                    <div>
                      {/* Visual */}
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mb-3">
                        Interactive Concept Preview
                      </h4>
                      <div 
                        className="h-[200px] w-full rounded-2xl border border-white/5 bg-white/[0.01] relative overflow-hidden flex items-center justify-center select-none"
                      >
                        {activeCourseData.visualType === "dna" && (
                          <BiologyDNA3D isHovered={true} />
                        )}
                        {activeCourseData.visualType === "chemistry" && (
                          <ChemistryMolecule3D isHovered={true} />
                        )}
                        {activeCourseData.visualType === "physics" && (
                          <PhysicsOrbit3D isHovered={true} />
                        )}
                        {activeCourseData.visualType === "calculus" && (
                          <CalculusVisual />
                        )}
                      </div>
                      
                      {/* Syllabus */}
                      <h4 className="text-xs font-mono uppercase tracking-wider text-white/40 mt-8 mb-4">
                        {courseRegistry[activeCourseData.slug] ? "Full Curriculum Syllabus" : "Curriculum Syllabus (4 Main Units)"}
                      </h4>
                      <div className="flex flex-col gap-2">
                        {(() => {
                          const registryCourse = courseRegistry[activeCourseData.slug];
                          const displayUnits = registryCourse
                            ? registryCourse.units.map(u => ({
                                number: `Unit ${u.id}`,
                                title: u.title,
                              }))
                            : activeCourseData.units.map(u => ({
                                number: u.number,
                                title: u.title,
                              }));

                          return displayUnits.map((unit, index) => (
                            <div 
                              key={index}
                              className="bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2.5 hover:bg-white/[0.04] transition-all duration-300 flex items-center gap-3"
                            >
                              <span 
                                className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 shrink-0"
                                style={{ color: activeCourseData.accentHex }}
                              >
                                {unit.number}
                              </span>
                              <h5 className="text-xs font-semibold text-white/90">
                                {unit.title}
                              </h5>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}

