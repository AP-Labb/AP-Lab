"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ChevronRight, ArrowLeft, BookOpen, Layers, CheckCircle2, Play, FileText, Activity,
  Award, Clock, GraduationCap, Target, Sparkles, HelpCircle, ShieldCheck
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

  const COURSE_DESCRIPTIONS: Record<string, {
    description: string;
    skills: string[];
    passRate: string;
    score5Rate: string;
    prerequisites: string;
    timeCommitment: string;
    targetAudience: string;
  }> = {
    "ap-biology": {
      description: "AP® Biology is an introductory college-level biology course that explores the fundamental principles governing living organisms. Students cultivate their understanding of biology through inquiry-based investigations as they explore topics including evolution, cellular processes, energetics, information transfer, ecology, and system interactions. With an emphasis on scientific modeling, quantitative reasoning, and experimental design, this course equips students with the critical analytical skills needed to master both the multiple-choice and free-response sections of the College Board AP Biology Exam.",
      skills: ["Experimental Design & Data Analysis", "Molecular & Cellular Mechanisms", "Evolutionary Genetics & Phylogenetics", "AP FRQ Data & Graphing Scenarios"],
      passRate: "68.2%",
      score5Rate: "14.3%",
      prerequisites: "High School Biology & Chemistry",
      timeCommitment: "4–6 Hours / Week",
      targetAudience: "Pre-Med, Bioengineering & Life Sciences"
    },
    "ap-chemistry": {
      description: "AP® Chemistry provides students with a college-level foundation to support advanced coursework in chemical sciences. Students explore concepts such as atomic structure, chemical bonding, intermolecular forces, chemical reactions, kinetics, thermodynamics, and equilibrium. Through hands-on laboratory investigations and quantitative problem-solving, students learn to construct explanations of chemical phenomena, analyze experimental data, and manipulate chemical equations to achieve high-level conceptual mastery.",
      skills: ["Stoichiometry & Reaction Kinetics", "Thermodynamic Calculations & Hess Law", "Equilibrium & Acid-Base Titrations", "Laboratory Synthesis & Error Analysis"],
      passRate: "74.8%",
      score5Rate: "15.8%",
      prerequisites: "General Chemistry & Algebra II",
      timeCommitment: "5–7 Hours / Week",
      targetAudience: "Chemical Engineering, Pre-Med & Physical Sciences"
    },
    "ap-physics-c": {
      description: "AP® Physics C: Mechanics is a calculus-based, college-level physics course designed for prospective engineers, computer scientists, and physical science majors. The course covers kinematics, Newton's laws of motion, work, energy, power, systems of particles, linear momentum, circular motion, rotation, oscillations, and gravitation. Students utilize differential and integral calculus to solve complex physical problems, derive theoretical equations, and analyze laboratory data with rigorous mathematical precision.",
      skills: ["Calculus Derivatives & Integrals in Physics", "Rotational Dynamics & Vector Torque", "Energy Conservation & Momentum Vectors", "Differential Equation Modeling"],
      passRate: "76.4%",
      score5Rate: "24.2%",
      prerequisites: "Pre-Calculus & Concurrent Calculus BC",
      timeCommitment: "6–8 Hours / Week",
      targetAudience: "Engineering, Aerospace, Physics & Computer Science"
    },
    "ap-calc-bc": {
      description: "AP® Calculus BC is an intensive, college-level course in single-variable calculus that encompasses all topics covered in Calculus AB plus advanced techniques of integration, Euler's method, vector-valued functions, parametric equations, polar coordinates, and infinite sequences and series. Students build a deep conceptual framework around limits, derivatives, integrals, and Taylor polynomials while honing analytical techniques required for multi-step FRQ derivations and graph analysis on the AP Exam.",
      skills: ["Taylor & Maclaurin Power Series", "Parametric, Polar & Vector Calculus", "Advanced Integration & Partial Fractions", "Differential Equations & Slope Fields"],
      passRate: "78.5%",
      score5Rate: "42.5%",
      prerequisites: "Pre-Calculus & Trigonometry",
      timeCommitment: "5–7 Hours / Week",
      targetAudience: "Mathematics, Quantitative Finance, CS & Engineering"
    },
    "ap-stats": {
      description: "AP® Statistics introduces students to the major concepts and tools for collecting, analyzing, and drawing conclusions from data. Students cultivate their understanding of statistics using technology, investigations, problem-solving, and writing as they explore concepts like randomness, probability, sampling distributions, confidence intervals, and hypothesis testing. Emphasizing real-world applications, the course teaches students how to communicate statistical evidence effectively and construct rigorous statistical arguments.",
      skills: ["Hypothesis Testing & Z/T Inference", "Probability Distributions & Simulation", "Exploratory Data & Regression Analysis", "Experimental Design & Random Sampling"],
      passRate: "60.1%",
      score5Rate: "14.7%",
      prerequisites: "Algebra II",
      timeCommitment: "3–5 Hours / Week",
      targetAudience: "Data Science, Economics, Business & Social Sciences"
    },
    "ap-csa": {
      description: "AP® Computer Science A introduces students to computer science through object-oriented programming in Java. The course covers fundamental topics including problem solving, design strategies and methodologies, organization of data (data structures), processing of data (algorithms), analysis of potential solutions, and the ethical and social implications of computing. Students write, run, test, and debug code while developing algorithms that make effective use of logic, control structures, and array manipulations.",
      skills: ["Object-Oriented Architecture & Inheritance", "Array & ArrayList Algorithm Tracing", "2D Array & String Manipulation", "Recursion & Searching/Sorting Algorithms"],
      passRate: "67.5%",
      score5Rate: "23.9%",
      prerequisites: "Algebra I & Basic Logic",
      timeCommitment: "4–6 Hours / Week",
      targetAudience: "Software Engineering, AI & CS Majors"
    },
    "ap-ush": {
      description: "AP® United States History is a college-level course that analyzes the historical development of the United States from 1491 to the present. Students investigate political, social, economic, and cultural trends while developing critical historical thinking skills such as analyzing primary and secondary sources, making historical comparisons, and contextualizing major events. The course emphasizes writing coherent, evidence-based essays including Document-Based Questions (DBQs) and Long Essay Questions (LEQs).",
      skills: ["DBQ & LEQ Thesis Statement Construction", "Primary Source Analysis & HIPP Context", "Periodization & Causal Argumentation", "Short Answer Question (SAQ) Precision"],
      passRate: "48.0%",
      score5Rate: "10.7%",
      prerequisites: "High School World History / Social Studies",
      timeCommitment: "5–7 Hours / Week",
      targetAudience: "Law, Political Science, Journalism & Humanities"
    },
    "ap-psych": {
      description: "AP® Psychology introduces students to the systematic and scientific study of human behavior and mental processes. While considering the psychologists and studies that have shaped the field, students explore and apply psychological theories, key concepts, and biological foundations associated with topics such as cognition, development, learning, personality, social psychology, and clinical treatment. Students also learn to evaluate research methods and ethical guidelines used in contemporary psychological science.",
      skills: ["Biological Bases of Behavior & Brain Anatomy", "Cognition, Memory & Learning Theories", "Research Methods & Experimental Variables", "Psychological FRQ Application & Vocabulary"],
      passRate: "59.6%",
      score5Rate: "16.9%",
      prerequisites: "General High School Science",
      timeCommitment: "3–4 Hours / Week",
      targetAudience: "Psychology, Neuroscience & Behavioral Economics"
    },
    "ap-eng-lang": {
      description: "AP® English Language and Composition engages students in becoming skilled readers of prose written in a variety of rhetorical contexts and skilled writers who compose for a variety of purposes. Both their writing and reading should make students aware of the interactions among a writer's purposes, audience expectations, and subjects, as well as the way genre conventions and the resources of language contribute to effectiveness in writing. Students master Synthesis, Rhetorical Analysis, and Argumentative Essay structures.",
      skills: ["Synthesis Essay Source Integration", "Rhetorical Analysis & Device Identification", "Argumentative Counter-Argument Construction", "MCQ Rhetorical Feature Analysis"],
      passRate: "56.1%",
      score5Rate: "10.1%",
      prerequisites: "English 10 / High School Literature",
      timeCommitment: "4–5 Hours / Week",
      targetAudience: "Pre-Law, Communications & Creative Writing"
    }
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
  const courseInfo = COURSE_DESCRIPTIONS[slug] || {
    description: "Master essential AP concepts, practice exam-weighted questions, and accelerate your mastery with AP Lab's structured curriculum.",
    skills: ["Concept Mastery", "Problem Solving", "Free Response Writing", "Exam Strategy"],
    passRate: "65.0%",
    score5Rate: "15.0%",
    prerequisites: "Standard High School Preparation",
    timeCommitment: "4–5 Hours / Week",
    targetAudience: "AP Scholars & STEM/Humanities Majors"
  };

  const courseWeightings = OFFICIAL_WEIGHTINGS[slug] || {};
  const examStructure = EXAM_STRUCTURE_SUMMARY[slug] || { mcq: "60 Questions (50%)", frq: "6 Questions (50%)", duration: "3 Hours" };
  const totalSubunits = course.units.reduce((acc, u) => acc + u.topics.length, 0);

  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-row relative z-0 overflow-x-hidden font-manrope">
      <AppSidebar currentPath="/dashboard" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16">
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-6 sm:px-8 py-8 space-y-10 pb-20 text-left">
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
              backgroundImage: `linear-gradient(to right, rgba(7,9,20,0.92), rgba(7,9,20,0.65)), url('${heroBgImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="space-y-5 max-w-2xl text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider shadow-sm">
                  AP® COLLEGEBOARD ALIGNED
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider shadow-sm">
                  {course.category || "STEM & SCIENCES"}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  <span>100% FREE</span>
                </span>
              </div>

              <h1 className="font-instrument text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
                {course.name}
              </h1>

              {/* Comprehensive Paragraph Description */}
              <p className="text-sm sm:text-base text-white/90 font-manrope leading-relaxed drop-shadow bg-black/30 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                {courseInfo.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                {/* Primary CTA Start Course */}
                <Link
                  href={`/dashboard/${slug}`}
                  className="flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 font-manrope font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95 border border-amber-300/40"
                >
                  <Play className="w-4 h-4 fill-neutral-950 text-neutral-950" />
                  <span>Start Course</span>
                </Link>

                <div className="flex items-center space-x-2 px-4 py-3 rounded-full bg-black/60 border border-white/20 text-xs font-mono text-white backdrop-blur-md">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>{course.units.length} Units</span>
                  <span className="text-white/30">•</span>
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>{totalSubunits} Subunits</span>
                </div>
              </div>
            </div>

            {/* Right Side CollegeBoard Exam Weighting Box */}
            <div className="w-full lg:w-80 bg-[#090b16]/95 border border-amber-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4 shrink-0">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">OFFICIAL EXAM SUMMARY</span>
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
                  <span className="text-white/60 font-semibold">Total Duration</span>
                  <span className="font-mono font-bold text-white/90">{examStructure.duration}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>College Board Code</span>
                <span className="text-emerald-400 font-bold uppercase">{slug}</span>
              </div>
            </div>
          </div>

          {/* FOUR COURSE OVERVIEW HIGHLIGHT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Key Skills Covered */}
            <div className="bg-[#090b16]/90 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3">
              <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>Key Competencies</span>
              </div>
              <div className="space-y-2">
                {courseInfo.skills.map((skill, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-white/80 font-manrope">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Pass Rate & 5 Score Rate */}
            <div className="bg-[#090b16]/90 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Exam Statistics</span>
              </div>
              <div className="space-y-2 font-mono">
                <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                  <span className="text-white/50 text-xs">National Pass Rate</span>
                  <span className="text-sm font-bold text-emerald-400">{courseInfo.passRate}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                  <span className="text-white/50 text-xs">5-Score Rate</span>
                  <span className="text-sm font-bold text-amber-300">{courseInfo.score5Rate}</span>
                </div>
              </div>
            </div>

            {/* Card 3: Recommended Prerequisites */}
            <div className="bg-[#090b16]/90 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3">
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Prerequisites</span>
              </div>
              <div className="space-y-1.5 text-xs text-white/80 font-manrope">
                <span className="text-white/40 block font-mono text-[10px] uppercase">Recommended Prep</span>
                <p className="font-bold text-white leading-relaxed">{courseInfo.prerequisites}</p>
                <span className="text-white/40 block font-mono text-[10px] uppercase pt-2">Pacing</span>
                <p className="text-white/70">{courseInfo.timeCommitment}</p>
              </div>
            </div>

            {/* Card 4: Target Majors */}
            <div className="bg-[#090b16]/90 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Target Focus</span>
              </div>
              <div className="space-y-1.5 text-xs text-white/80 font-manrope">
                <span className="text-white/40 block font-mono text-[10px] uppercase">College Pathway</span>
                <p className="font-bold text-white leading-relaxed">{courseInfo.targetAudience}</p>
              </div>
            </div>
          </div>

          {/* UNITS & SUBUNITS COURSE PATH */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest block">CURRICULUM ARCHITECTURE</span>
                <h2 className="font-instrument text-2xl font-bold text-white">Units & CollegeBoard Weightings</h2>
              </div>
              <div className="text-xs font-mono text-white/50 space-x-4">
                <span>{course.units.length} Units</span>
                <span>•</span>
                <span>{totalSubunits} Lessons</span>
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
                        <BookOpen className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider block">
                          UNIT {unit.id}
                        </span>
                        <h3 className="font-manrope font-bold text-lg text-white">
                          {unit.title}
                        </h3>
                        <span className="text-xs font-mono text-white/40 block mt-0.5">
                          {unitTopicsCount} Subunits & Study Modules
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end space-y-1 font-mono text-xs">
                      <span className="font-extrabold text-amber-400 text-sm">{officialWeighting} EXAM WEIGHTING</span>
                      <span className="text-white/40">{unitTopicsCount} Lessons</span>
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
            <div className="pt-6 flex justify-end">
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
