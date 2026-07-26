"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Sparkles, ArrowUp, MousePointer2, MessageSquare, BookOpen, Calculator, Plus, Bot, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShowcaseStep {
  id: number;
  subject: string;
  badgeBg: string;
  badgeText: string;
  userQuery: string;
  thinkingTime: string;
  thinkingProgress: string;
  aiResponse: string;
  leftTitle: string;
  leftSubtitle: string;
  leftTag: string;
  highlightText: string;
  contextTextBefore: string;
  contextTextAfter: string;
  codeSnippet?: string;
}

const showcaseSteps: ShowcaseStep[] = [
  {
    id: 1,
    subject: "AP Biology — Cell Respiration",
    badgeBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    badgeText: "Topic 2.2 — Cell Energetics",
    userQuery: "Explain how mitochondria generate ATP during oxidative phosphorylation.",
    thinkingTime: "8s",
    thinkingProgress: "Cross-referencing AP Biology AP scoring rubric & membrane transport...",
    aiResponse: "Oxidative phosphorylation relies on the electron transport chain (ETC) establishing a proton gradient across the inner mitochondrial membrane. Chemiosmosis then drives ATP synthase to phosphorylate ADP into ATP.",
    leftTitle: "Smart Textbook Highlighting",
    leftSubtitle: "Highlight any sentence in the textbook to trigger the contextual AI mentor popover.",
    leftTag: "Unit 2 — Cellular Energetics • Page 142",
    contextTextBefore: "Mitochondria are double-membrane organelles responsible for converting biochemical energy from nutrients into adenosine triphosphate. During aerobic respiration, pyruvate undergoes oxidation before entering the Krebs cycle.",
    highlightText: "Chemical energy produced by mitochondria is stored in adenosine triphosphate (ATP), powered by a chemiosmotic proton gradient across the inner membrane.",
    contextTextAfter: "This proton motive force drives protons back into the matrix through the F₀F₁ ATP synthase complex, producing roughly 30 to 32 ATP molecules per glucose molecule.",
  },
  {
    id: 2,
    subject: "AP Physics 1 — Kinematics & Momentum",
    badgeBg: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    badgeText: "Unit 4 — Momentum & Collisions",
    userQuery: "How do I set up momentum conservation for this 2D oblique collision?",
    thinkingTime: "11s",
    thinkingProgress: "Resolving velocity vectors into independent X and Y component equations...",
    aiResponse: "For 2D inelastic collisions, break initial momentum into perpendicular axes: p_x = m₁v₁ₓ + m₂v₂ₓ and p_y = m₁v₁y + m₂v₂y. Momentum is conserved independently on each axis, allowing you to solve for v_f and θ.",
    leftTitle: "Interactive Problem Solver",
    leftSubtitle: "Highlight tricky variables or problem statements to get step-by-step physics breakdowns.",
    leftTag: "AP Physics 1 • Practice Exam Q14",
    contextTextBefore: "A 2.5 kg mass m₁ moving initially along the +x-axis at 4.0 m/s collides with a stationary 1.5 kg mass m₂. After the collision, mass m₁ moves at 2.5 m/s at an angle of 30° above the +x-axis.",
    highlightText: "Calculate the magnitude and direction angle θ of the final velocity vector for mass m₂ immediately following the collision.",
    contextTextAfter: "Assume the surface is frictionless and neglect rotational effects during the collision interval Δt.",
    codeSnippet: "p_1x = (2.5)(4.0) = 10.0 kg·m/s\np_1y' = (2.5)(2.5 sin 30°) = 3.125 kg·m/s\np_2x' = 10.0 - 5.41 = 4.59 kg·m/s"
  },
  {
    id: 3,
    subject: "AP Calculus BC — Derivatives & Proofs",
    badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    badgeText: "Unit 6 — Integration Techniques",
    userQuery: "Walk me through integration by parts for ∫ x · e^(2x) dx.",
    thinkingTime: "5s",
    thinkingProgress: "Selecting u and dv using LIATE rule (Algebraic before Exponential)...",
    aiResponse: "Set u = x ⇒ du = dx, and dv = e^(2x) dx ⇒ v = ½e^(2x). Applying ∫u dv = uv - ∫v du yields ½x e^(2x) - ¼e^(2x) + C = ¼e^(2x)(2x - 1) + C.",
    leftTitle: "Math Theorem & Proof Explainer",
    leftSubtitle: "Instant step-by-step calculus derivations with automated formula verification.",
    leftTag: "AP Calculus BC • Free Response #3",
    contextTextBefore: "Integration by parts is derived directly from the product rule of differentiation: d/dx [u(x)v(x)] = u'(x)v(x) + u(x)v'(x).",
    highlightText: "Theorem: ∫ u(x) v'(x) dx = u(x)v(x) - ∫ v(x) u'(x) dx. Choose u(x) such that u'(x) is simpler than u(x).",
    contextTextAfter: "For definite integrals, evaluate the boundary limits [u(x)v(x)]ₐᵇ before integrating the remaining integral expression.",
    codeSnippet: "∫ x·e^(2x) dx = ½x·e^(2x) - ∫ ½e^(2x) dx\n            = ½x·e^(2x) - ¼e^(2x) + C"
  }
];

export function AIFeatureShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.35) {
      setActiveStep(0);
    } else if (latest < 0.70) {
      setActiveStep(1);
    } else {
      setActiveStep(2);
    }
  });

  const current = showcaseSteps[activeStep];

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#030712] text-white py-20 px-4 sm:px-6 md:px-12 z-20"
    >
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Included AI Guidance
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-inter font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 text-white"
        >
          Learn faster with an AI assistant native to your canvas
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-inter text-white/50 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Highlight any text, formula, or problem in the textbook to trigger real-time AI explanations aligned with College Board rubrics.
        </motion.p>

        {/* Step Selector Tabs (Clickable for desktop/mobile) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
          {showcaseSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold font-inter transition-all duration-300 flex items-center gap-2 border",
                activeStep === idx 
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105" 
                  : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", activeStep === idx ? "bg-purple-600 animate-pulse" : "bg-white/30")} />
              {step.leftTitle}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Section: Left Interactive Dashboard View vs Right Sticky Framer-style AI Drawer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative min-h-[1600px] lg:min-h-[2000px]">
        
        {/* Left Column: Interactive Dashboard Canvas (Scrolls through 3 showcase steps) */}
        <div className="lg:col-span-7 space-y-24 pt-4">
          {showcaseSteps.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isActive ? 1 : 0.45, scale: isActive ? 1 : 0.98 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "rounded-3xl p-6 sm:p-8 border transition-all duration-500 cursor-pointer relative overflow-hidden",
                  isActive 
                    ? "bg-[#0A0E17] border-purple-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(168,85,247,0.15)]" 
                    : "bg-[#060911] border-white/5 opacity-50 hover:opacity-75"
                )}
              >
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      {idx === 0 && <BookOpen className="w-5 h-5 text-cyan-400" />}
                      {idx === 1 && <MousePointer2 className="w-5 h-5 text-purple-400" />}
                      {idx === 2 && <Calculator className="w-5 h-5 text-emerald-400" />}
                    </div>
                    <div>
                      <h3 className="font-inter font-bold text-white text-lg sm:text-xl">{step.leftTitle}</h3>
                      <p className="text-white/40 text-xs mt-0.5">{step.leftSubtitle}</p>
                    </div>
                  </div>
                  <span className={cn("text-[11px] font-mono px-3 py-1 rounded-full border", step.badgeBg)}>
                    Step 0{step.id}
                  </span>
                </div>

                {/* Dashboard Canvas Window Mockup */}
                <div className="bg-[#03050B] border border-white/10 rounded-2xl p-5 sm:p-6 relative overflow-hidden shadow-inner">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                      <span className="ml-2 text-[11px] font-mono text-white/40">{step.leftTag}</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400/80 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      Live Selection
                    </span>
                  </div>

                  {/* Context Article Body with Vibrant Glowing Highlighted Text */}
                  <div className="space-y-4 font-inter text-sm sm:text-base leading-relaxed text-white/60">
                    <p className="text-white/40 text-xs sm:text-sm">{step.contextTextBefore}</p>

                    {/* Highlighting Sentence Container */}
                    <div className="relative p-3 sm:p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent shadow-[0_0_25px_rgba(56,189,248,0.2)]">
                      <span className="relative z-10 text-white font-semibold leading-relaxed">
                        {step.highlightText}
                      </span>
                      
                      {/* Floating Ask AI Button Pointer Badge */}
                      <div className="absolute -top-3.5 right-4 z-20 bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-white/20 animate-bounce">
                        <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                        Ask AP Lab AI
                      </div>
                    </div>

                    <p className="text-white/40 text-xs sm:text-sm">{step.contextTextAfter}</p>

                    {/* Code / Equation Block if available */}
                    {step.codeSnippet && (
                      <div className="mt-4 p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
                        <pre>{step.codeSnippet}</pre>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: STICKY AI Assistant Window (Sticks to screen like Framer AI agent drawer) */}
        <div className="lg:col-span-5 sticky top-28 z-30 pt-4">
          <motion.div 
            layout
            className="w-full bg-[#0B0F19] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(168,85,247,0.2)] flex flex-col relative overflow-hidden backdrop-blur-2xl"
          >
            {/* AI Assistant Header Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg">
                  <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
                    <Bot className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                <div>
                  <h4 className="font-inter font-bold text-white text-sm">AP Lab Assistant</h4>
                  <p className="text-[11px] text-white/40 font-mono">GPT 5.5 • Canvas Native</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-mono text-emerald-400">Active</span>
              </div>
            </div>

            {/* Active User Prompt Capsule (Framer-style Badge) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* User Prompt Capsule */}
                <div className="bg-[#131927] border border-white/10 rounded-2xl p-4 relative shadow-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-[10px] font-mono px-2.5 py-0.5 rounded-full border", current.badgeBg)}>
                      {current.badgeText}
                    </span>
                    <span className="text-[10px] font-mono text-white/30">Selection #0{current.id}</span>
                  </div>
                  <p className="font-inter text-xs sm:text-sm text-white font-medium leading-relaxed">
                    "{current.userQuery}"
                  </p>
                </div>

                {/* Thinking Progress Bar (Framer Style) */}
                <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-white/50 mb-1">
                      <span>Thinking...</span>
                      <span className="text-purple-400">{current.thinkingTime}</span>
                    </div>
                    <p className="text-[11px] text-white/40 truncate font-inter">{current.thinkingProgress}</p>
                  </div>
                </div>

                {/* AI Assistant Output Card (Framer Style Response) */}
                <div className="bg-gradient-to-b from-purple-950/20 to-[#0A0D16] border border-purple-500/20 rounded-2xl p-4 shadow-lg space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>AI Breakdown</span>
                  </div>

                  <p className="font-inter text-xs sm:text-sm text-white/80 leading-relaxed">
                    {current.aiResponse}
                  </p>

                  {/* Feature Checklist Tags */}
                  <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2 text-[11px] text-white/50 font-mono">
                    <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      <Check className="w-3 h-3 text-emerald-400" /> Rubric Aligned
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                      <Check className="w-3 h-3 text-cyan-400" /> Step-by-Step
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Input Drawer Mock (Framer-style Prompt Input) */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs text-white/40">
                <span>Add follow up question...</span>
                <span className="text-[10px] font-mono text-white/20">GPT 5.5</span>
              </div>

              <button className="w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center shadow-lg transition-colors flex-shrink-0">
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
