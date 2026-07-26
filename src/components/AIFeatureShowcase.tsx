"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Dna, Brain, FlaskConical, ArrowUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface ShowcaseSlide {
  id: number;
  courseName: string;
  courseIcon: React.ReactNode;
  accentColor: string;
  imageSrc: string;
  imageAlt: string;
  highlightText: string;
  userQuestion: string;
  aiResponse: string;
  zoomScale: string;
}

const showcaseSlides: ShowcaseSlide[] = [
  {
    id: 1,
    courseName: "AP® Biology",
    courseIcon: <Dna className="w-5 h-5 relative z-10 text-emerald-400" />,
    accentColor: "#10b981", // Bio Green
    imageSrc: "/images/ai-showcase/screenshot_1.png",
    imageAlt: "Molecular Geometry and Polarity Textbook Selection",
    highlightText: "This unequal electron distribution creates a polar covalent bond",
    userQuestion: "Can you explain what a polar covalent bond is and why unequal electron distribution causes an electric dipole in water?",
    aiResponse: "A polar covalent bond occurs when two atoms share electrons unequally due to a difference in electronegativity. In water ($H_2O$), oxygen is significantly more electronegative than hydrogen, pulling shared electron density toward its nucleus. This creates a partial negative charge ($\delta^-$) on oxygen and a partial positive charge ($\delta^+$) on each hydrogen, forming a permanent **electric dipole**.",
    zoomScale: "scale-[1.18]"
  },
  {
    id: 2,
    courseName: "AP® Psychology",
    courseIcon: <Brain className="w-5 h-5 relative z-10 text-purple-400" />,
    accentColor: "#8b5cf6", // AP Psychology Purple
    imageSrc: "/images/ai-showcase/screenshot_2.png",
    imageAlt: "Sleep States and Waves Textbook Selection",
    highlightText: "NREM-1",
    userQuestion: "What characterizes NREM-1 sleep and how does it transition into theta waves and hypnagogic jerks?",
    aiResponse: "NREM-1 (Non-Rapid Eye Movement Stage 1) is the light transition phase between wakefulness and sleep. As brain activity slows, high-frequency alpha waves are replaced by **theta waves (4–7 Hz)**. During NREM-1, individuals frequently experience **hypnagogic hallucinations** or **hypnagogic jerks**—sudden muscle spasms often accompanied by a sensation of falling.",
    zoomScale: "scale-[1.12]"
  },
  {
    id: 3,
    courseName: "AP® Chemistry",
    courseIcon: <FlaskConical className="w-5 h-5 relative z-10 text-cyan-400" />,
    accentColor: "#06b6d4", // AP Chemistry Teal Blue
    imageSrc: "/images/ai-showcase/screenshot_3.png",
    imageAlt: "Periodic Trends Map Textbook Selection",
    highlightText: "periodic trends",
    userQuestion: "How do ionization energy, electronegativity, and atomic radius change across periodic trends?",
    aiResponse: "Across a period (left to right), **ionization energy** and **electronegativity** increase due to a higher effective nuclear charge ($Z_{eff}$), while **atomic radius** decreases as protons pull electrons closer. Down a group (top to bottom), atomic radius increases with added electron shells, while ionization energy and electronegativity decrease due to electron shielding.",
    zoomScale: "scale-[1.12]"
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
      className="relative w-full bg-[#02040a] text-white py-20 px-4 sm:px-6 md:px-12 z-20"
    >
      {/* Clean Section Title */}
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

      {/* Main Split Layout: Left Screenshots vs Right Sticky Course Page AI Tutor Drawer */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* Left Column: Exact Uploaded Course Page Screenshots */}
        <div className="lg:col-span-7 space-y-12 pt-2">
          {showcaseSlides.map((slide, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={slide.id}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "rounded-3xl border border-white/20 transition-opacity duration-300 cursor-pointer overflow-hidden relative shadow-2xl bg-black/80",
                  isActive ? "opacity-100 ring-1 ring-white/30" : "opacity-40 hover:opacity-70"
                )}
              >
                {/* Real Course Page Screenshot Image */}
                <div className="relative w-full overflow-hidden bg-black/90 p-1 sm:p-2">
                  <img
                    src={slide.imageSrc}
                    alt={slide.imageAlt}
                    className={cn(
                      "w-full h-auto object-cover rounded-2xl origin-center transition-transform duration-300",
                      slide.zoomScale
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: STICKY Course Page AI Tutor Drawer (Stops cleanly at bottom of last screenshot) */}
        <div className="lg:col-span-5 sticky top-28 z-30 pt-2">
          <motion.div 
            layout
            className="w-full bg-[#05060c]/95 border border-white/15 text-white rounded-3xl flex flex-col shadow-2xl backdrop-blur-3xl overflow-hidden"
          >
            {/* Course Page AIAssistantDrawer Header */}
            <div className="h-20 border-b border-white/10 bg-white/[0.01] flex items-center justify-between px-6">
              <div className="flex items-center space-x-3.5">
                <div 
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center relative overflow-hidden bg-white/[0.03] shadow-inner"
                  style={{ borderColor: `${current.accentColor}40` }}
                >
                  <div 
                    className="absolute inset-0 opacity-15"
                    style={{ backgroundColor: current.accentColor }}
                  />
                  {current.courseIcon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-instrument text-lg font-bold text-white">AI Tutor</h3>
                  </div>
                  <p className="text-xs mt-0.5 text-white/40 font-mono">
                    {current.courseName} • 1/5 messages • Powered by Gemini
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-5 space-y-4 font-inter min-h-[340px] flex flex-col justify-end">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
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

            {/* Input & Quick Suggestions Bar */}
            <div className="p-5 border-t border-white/5 bg-[#030408]/90">
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
