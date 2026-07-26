"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Activity, ArrowUp, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface ShowcaseSlide {
  id: number;
  courseName: string;
  accentColor: string;
  imageSrc: string;
  imageAlt: string;
  highlightText: string;
  userQuestion: string;
  aiResponse: string;
}

const showcaseSlides: ShowcaseSlide[] = [
  {
    id: 1,
    courseName: "Chemistry",
    accentColor: "#38bdf8",
    imageSrc: "/images/ai-showcase/screenshot_1.png",
    imageAlt: "Molecular Geometry and Polarity Textbook Selection",
    highlightText: "This unequal electron distribution creates a polar covalent bond",
    userQuestion: "Can you explain what a polar covalent bond is and why unequal electron distribution causes an electric dipole in water?",
    aiResponse: "A polar covalent bond occurs when two atoms share electrons unequally due to a difference in electronegativity. In water ($H_2O$), oxygen is significantly more electronegative than hydrogen, pulling shared electron density toward its nucleus. This creates a partial negative charge ($\delta^-$) on oxygen and a partial positive charge ($\delta^+$) on each hydrogen, forming a permanent **electric dipole**."
  },
  {
    id: 2,
    courseName: "Psychology",
    accentColor: "#ec4899",
    imageSrc: "/images/ai-showcase/screenshot_2.png",
    imageAlt: "Sleep States and Waves Textbook Selection",
    highlightText: "NREM-1",
    userQuestion: "What characterizes NREM-1 sleep and how does it transition into theta waves and hypnagogic jerks?",
    aiResponse: "NREM-1 (Non-Rapid Eye Movement Stage 1) is the light transition phase between wakefulness and sleep. As brain activity slows, high-frequency alpha waves are replaced by **theta waves (4–7 Hz)**. During NREM-1, individuals frequently experience **hypnagogic hallucinations** or **hypnagogic jerks**—sudden muscle spasms often accompanied by a sensation of falling."
  },
  {
    id: 3,
    courseName: "Chemistry",
    accentColor: "#34d399",
    imageSrc: "/images/ai-showcase/screenshot_3.png",
    imageAlt: "Periodic Trends Map Textbook Selection",
    highlightText: "periodic trends",
    userQuestion: "How do ionization energy, electronegativity, and atomic radius change across periodic trends?",
    aiResponse: "Across a period (left to right), **ionization energy** and **electronegativity** increase due to a higher effective nuclear charge ($Z_{eff}$), while **atomic radius** decreases as protons pull electrons closer. Down a group (top to bottom), atomic radius increases with added electron shells, while ionization energy and electronegativity decrease due to electron shielding."
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

  const current = showcaseSlides[activeStep];

  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-[#030712] text-white py-24 px-4 sm:px-6 md:px-12 z-20"
    >
      {/* Clean Section Title (No badge, no selection buttons) */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-inter font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-4 text-white"
        >
          24/7 Contextual AI Tutor Native to Your Textbook
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-inter text-white/50 text-base sm:text-lg max-w-2xl mx-auto"
        >
          Highlight any sentence or formula directly on the course page to open the AI Tutor drawer for instant, College Board aligned explanations.
        </motion.p>
      </div>

      {/* Main Split Layout: Left Exact Course Page Screenshots vs Right Course Page AI Tutor Drawer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative min-h-[1400px] lg:min-h-[1800px]">
        
        {/* Left Column: Exact Uploaded Course Page Screenshots */}
        <div className="lg:col-span-7 space-y-16 pt-4">
          {showcaseSlides.map((slide, idx) => {
            const isActive = activeStep === idx;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.98 }}
                transition={{ duration: 0.4 }}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "rounded-3xl border transition-all duration-500 cursor-pointer overflow-hidden relative shadow-2xl group",
                  isActive 
                    ? "bg-[#090D16] border-purple-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(168,85,247,0.2)]" 
                    : "bg-[#05070E] border-white/10 opacity-40 hover:opacity-75"
                )}
              >
                {/* Real Course Page Screenshot Image */}
                <div className="relative w-full overflow-hidden bg-black/60">
                  <img
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    className="w-full h-auto object-cover rounded-3xl transition-transform duration-500 group-hover:scale-[1.01]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Column: STICKY Course Page AI Tutor Drawer (Matches AIAssistantDrawer.tsx exactly) */}
        <div className="lg:col-span-5 sticky top-28 z-30 pt-4">
          <motion.div 
            layout
            className="w-full bg-[#05060c]/95 border border-white/15 text-white rounded-3xl flex flex-col shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(139,92,246,0.2)] backdrop-blur-3xl overflow-hidden"
          >
            {/* Exact AIAssistantDrawer Header */}
            <div className="h-20 border-b border-white/10 bg-white/[0.01] flex items-center justify-between px-6">
              <div className="flex items-center space-x-3.5">
                <div 
                  className="w-10 h-10 rounded-full border flex items-center justify-center relative overflow-hidden group shadow-inner bg-white/[0.02]"
                  style={{ borderColor: `${current.accentColor}40` }}
                >
                  <div 
                    className="absolute inset-0 opacity-15 transition-opacity duration-300"
                    style={{ backgroundColor: current.accentColor }}
                  />
                  <Activity className="w-5 h-5 relative z-10 animate-pulse" style={{ color: current.accentColor }} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-instrument text-lg font-bold text-white">AI Tutor</h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="Active" />
                  </div>
                  <p className="text-xs mt-0.5 text-white/40 font-mono">
                    {current.courseName} • 1/5 messages • Powered by Gemini
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages (Matches AIAssistantDrawer i-Message bubbles) */}
            <div className="p-5 space-y-4 font-inter min-h-[340px] flex flex-col justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* User Message Bubble */}
                  <div className="flex justify-end">
                    <div className="max-w-[86%] flex flex-col items-end">
                      <div 
                        className="rounded-[20px] rounded-br-[4px] px-4 py-3 text-xs sm:text-sm font-inter leading-relaxed text-white shadow-md"
                        style={{ backgroundColor: current.accentColor }}
                      >
                        Regarding this text: "{current.highlightText}"
                        <br /><br />
                        {current.userQuestion}
                      </div>
                    </div>
                  </div>

                  {/* AI Assistant Message Bubble */}
                  <div className="flex justify-start">
                    <div className="max-w-[92%] flex flex-col items-start">
                      <div className="rounded-[20px] rounded-bl-[4px] px-4 py-3 text-xs sm:text-sm font-inter leading-relaxed bg-[#242429] border border-white/5 text-white/95 shadow-sm">
                        <div className="prose prose-invert prose-sm text-white max-w-none leading-relaxed select-text">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {current.aiResponse}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Exact AIAssistantDrawer Input & Quick Suggestions Bar */}
            <div className="p-5 border-t border-white/5 bg-[#030408]/90">
              {/* Clickable Quick Suggestions */}
              <div className="flex gap-2 mb-3.5 overflow-x-auto pb-1 select-none scrollbar-none">
                <div 
                  className="shrink-0 text-[11px] px-3.5 py-1.5 rounded-full border bg-white/[0.03] text-white/70 font-manrope font-semibold"
                  style={{ borderColor: `${current.accentColor}30` }}
                >
                  🔍 Explain concept
                </div>
                <div 
                  className="shrink-0 text-[11px] px-3.5 py-1.5 rounded-full border bg-white/[0.03] text-white/70 font-manrope font-semibold"
                  style={{ borderColor: `${current.accentColor}30` }}
                >
                  📝 Quiz me
                </div>
                <div 
                  className="shrink-0 text-[11px] px-3.5 py-1.5 rounded-full border bg-white/[0.03] text-white/70 font-manrope font-semibold"
                  style={{ borderColor: `${current.accentColor}30` }}
                >
                  💡 Key Terms
                </div>
              </div>

              {/* Exact Course Page Input Form */}
              <div className="relative flex items-center rounded-full border border-white/5 px-4 py-2 bg-[#1c1c1f] text-white">
                <input
                  type="text"
                  readOnly
                  value={`Ask about ${current.courseName}...`}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-white/40 focus:outline-none"
                />
                <button
                  type="button"
                  className="w-7 h-7 flex items-center justify-center rounded-full text-white absolute right-2 shadow-md"
                  style={{ backgroundColor: current.accentColor }}
                >
                  <ArrowUp className="w-4 h-4 text-black stroke-[3px]" />
                </button>
              </div>
            </div>

          </motion.div>
        </div>

      </div>
    </section>
  );
}
