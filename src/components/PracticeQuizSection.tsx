"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { playMasterySound, playFailureSound } from "@/lib/soundEffects";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Which organelle is responsible for photosynthesis?",
    options: ["Mitochondria", "Chloroplasts", "Nucleus", "Ribosomes"],
    correctIndex: 1,
    explanation: "Chloroplasts absorb sunlight and use it in conjunction with water and carbon dioxide gas to produce food for the plant (glucose) via photosynthesis."
  },
  {
    id: 2,
    question: "In a cell, where are proteins synthesized?",
    options: ["Lysosomes", "Golgi apparatus", "Ribosomes", "Mitochondria"],
    correctIndex: 2,
    explanation: "Ribosomes are the cellular structures responsible for protein synthesis by translating mRNA codons into polypeptide chains."
  },
  {
    id: 3,
    question: "Which of the following processes produces the most ATP during cellular respiration?",
    options: ["Glycolysis", "Krebs Cycle", "Electron Transport Chain", "Fermentation"],
    correctIndex: 2,
    explanation: "The Electron Transport Chain (ETC) and oxidative phosphorylation generate approximately 32 to 34 ATP molecules per glucose molecule, yielding the vast majority of cellular energy."
  },
  {
    id: 4,
    question: "What is the primary function of the cell membrane?",
    options: ["To store genetic information", "To synthesize lipids", "To regulate the entry and exit of substances", "To provide mechanical support to plant walls"],
    correctIndex: 2,
    explanation: "The plasma membrane is selectively permeable, regulating the transport of materials entering and exiting the cell to maintain homeostasis."
  },
  {
    id: 5,
    question: "Which molecule carries genetic information from DNA to the ribosome?",
    options: ["tRNA", "mRNA", "rRNA", "RNA Polymerase"],
    correctIndex: 1,
    explanation: "Messenger RNA (mRNA) carries genetic codes transcribed from DNA to the ribosomes, serving as the blueprint for translation."
  }
];

export function PracticeQuizSection() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  
  const currentQuestion = quizQuestions[currentIdx];
  const selectedOption = selectedAnswers[currentIdx];
  const isAnswered = selectedOption !== undefined;

  const handleOptionSelect = (optionIdx: number) => {
    if (isAnswered) return; // Prevent changing answer once selected
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIdx
    }));
    if (optionIdx === currentQuestion.correctIndex) {
      playMasterySound();
    } else {
      playFailureSound();
    }
  };

  const handleNext = () => {
    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    }
  };

  return (
    <section className="relative w-full py-[140px] md:py-[170px] px-6 md:px-12 bg-[#03040a] overflow-hidden flex flex-col items-center z-20">
      
      {/* 16px Pixel Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none z-0" 
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />
      
      {/* Seamless Top and Bottom Blend Overlays */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#03040a] via-[#03040a]/90 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#03040a] via-[#03040a]/90 to-transparent pointer-events-none z-10" />
      
      {/* Rich Pixelated Academic Background Elements (Strictly Outer Margins) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        
        {/* Pixel Book - Top Outer Left */}
        <div className="absolute top-12 left-[2%] opacity-45">
          <svg viewBox="0 0 16 16" className="w-14 h-14 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="2" y="2" width="12" height="12" fill="currentColor" fillOpacity="0.3" />
            <rect x="3" y="3" width="4" height="10" fill="currentColor" fillOpacity="0.6" />
            <rect x="8" y="3" width="5" height="10" fill="currentColor" fillOpacity="0.5" />
            <rect x="7" y="2" width="1" height="12" fill="currentColor" />
          </svg>
        </div>

        {/* Pixel Graduation Mortarboard - Top Outer Right */}
        <div className="absolute top-14 right-[3%] opacity-45">
          <svg viewBox="0 0 16 16" className="w-16 h-16 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="1" y="5" width="14" height="2" fill="currentColor" />
            <rect x="7" y="3" width="2" height="2" fill="currentColor" />
            <rect x="4" y="7" width="8" height="4" fill="currentColor" fillOpacity="0.6" />
            <rect x="13" y="7" width="1" height="5" fill="currentColor" />
          </svg>
        </div>

        {/* Pixel Atom Orbit - Middle Outer Left */}
        <div className="absolute top-[36%] left-[1.5%] opacity-45">
          <svg viewBox="0 0 16 16" className="w-14 h-14 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="7" y="7" width="2" height="2" fill="currentColor" />
            <rect x="2" y="7" width="3" height="2" fill="currentColor" fillOpacity="0.6" />
            <rect x="11" y="7" width="3" height="2" fill="currentColor" fillOpacity="0.6" />
            <rect x="7" y="2" width="2" height="3" fill="currentColor" fillOpacity="0.6" />
            <rect x="7" y="11" width="2" height="3" fill="currentColor" fillOpacity="0.6" />
          </svg>
        </div>

        {/* Pixel Chemistry Flask - Middle Outer Right */}
        <div className="absolute top-[40%] right-[2%] opacity-45">
          <svg viewBox="0 0 16 16" className="w-14 h-14 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="6" y="2" width="4" height="1" fill="currentColor" />
            <rect x="7" y="3" width="2" height="4" fill="currentColor" fillOpacity="0.6" />
            <rect x="4" y="7" width="8" height="7" fill="currentColor" fillOpacity="0.4" />
            <rect x="5" y="10" width="6" height="3" fill="currentColor" fillOpacity="0.9" />
          </svg>
        </div>

        {/* Pixel DNA Helix - Bottom Outer Left */}
        <div className="absolute bottom-16 left-[2.5%] opacity-45">
          <svg viewBox="0 0 16 16" className="w-14 h-14 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="3" y="2" width="2" height="2" fill="currentColor" />
            <rect x="11" y="2" width="2" height="2" fill="currentColor" />
            <rect x="5" y="4" width="6" height="2" fill="currentColor" fillOpacity="0.6" />
            <rect x="7" y="6" width="2" height="4" fill="currentColor" />
            <rect x="5" y="10" width="6" height="2" fill="currentColor" fillOpacity="0.6" />
            <rect x="3" y="12" width="2" height="2" fill="currentColor" />
            <rect x="11" y="12" width="2" height="2" fill="currentColor" />
          </svg>
        </div>

        {/* Pixel Microscope - Bottom Outer Right */}
        <div className="absolute bottom-14 right-[3%] opacity-45">
          <svg viewBox="0 0 16 16" className="w-14 h-14 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="6" y="2" width="4" height="3" fill="currentColor" />
            <rect x="7" y="5" width="2" height="4" fill="currentColor" fillOpacity="0.6" />
            <rect x="4" y="9" width="3" height="3" fill="currentColor" fillOpacity="0.8" />
            <rect x="3" y="12" width="10" height="2" fill="currentColor" />
          </svg>
        </div>

        {/* Pixel Certificate Scroll - Top Gutter Left */}
        <div className="absolute top-28 left-[6%] opacity-40">
          <svg viewBox="0 0 16 16" className="w-12 h-12 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="3" y="3" width="10" height="10" fill="currentColor" fillOpacity="0.3" />
            <rect x="5" y="5" width="6" height="1" fill="currentColor" />
            <rect x="5" y="7" width="6" height="1" fill="currentColor" />
            <rect x="5" y="9" width="4" height="1" fill="currentColor" />
          </svg>
        </div>

        {/* Pixel Lightbulb - Top Gutter Right */}
        <div className="absolute top-24 right-[7%] opacity-40">
          <svg viewBox="0 0 16 16" className="w-12 h-12 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="6" y="2" width="4" height="2" fill="currentColor" />
            <rect x="4" y="4" width="8" height="5" fill="currentColor" fillOpacity="0.5" />
            <rect x="6" y="9" width="4" height="2" fill="currentColor" />
            <rect x="7" y="11" width="2" height="2" fill="currentColor" fillOpacity="0.8" />
          </svg>
        </div>

        {/* Pixel Pi Symbol - Bottom Gutter Left */}
        <div className="absolute bottom-32 left-[7%] opacity-40">
          <svg viewBox="0 0 16 16" className="w-11 h-11 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="2" y="3" width="12" height="2" fill="currentColor" />
            <rect x="4" y="5" width="2" height="8" fill="currentColor" />
            <rect x="9" y="5" width="2" height="8" fill="currentColor" />
          </svg>
        </div>

        {/* Pixel Integral Symbol - Bottom Gutter Right */}
        <div className="absolute bottom-36 right-[8%] opacity-40">
          <svg viewBox="0 0 16 16" className="w-11 h-11 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="8" y="2" width="4" height="2" fill="currentColor" />
            <rect x="6" y="4" width="3" height="8" fill="currentColor" />
            <rect x="4" y="12" width="4" height="2" fill="currentColor" />
          </svg>
        </div>

        {/* Pixel Sigma Summation Symbol - Top Outer Center Left */}
        <div className="absolute top-8 left-[18%] opacity-35">
          <svg viewBox="0 0 16 16" className="w-10 h-10 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="3" y="2" width="10" height="2" fill="currentColor" />
            <rect x="3" y="4" width="4" height="2" fill="currentColor" />
            <rect x="6" y="6" width="3" height="2" fill="currentColor" />
            <rect x="3" y="8" width="4" height="2" fill="currentColor" />
            <rect x="3" y="10" width="10" height="2" fill="currentColor" />
          </svg>
        </div>

        {/* Pixel Trophy Award - Top Outer Center Right */}
        <div className="absolute top-10 right-[18%] opacity-35">
          <svg viewBox="0 0 16 16" className="w-11 h-11 text-white/70" shapeRendering="crispEdges" fill="none">
            <rect x="4" y="2" width="8" height="6" fill="currentColor" fillOpacity="0.5" />
            <rect x="7" y="8" width="2" height="3" fill="currentColor" />
            <rect x="5" y="11" width="6" height="2" fill="currentColor" />
          </svg>
        </div>

      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Feature Highlights aligned to AP Lab Curriculum */}
        <div className="space-y-8 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="font-inter font-extrabold text-white text-3xl md:text-5xl tracking-tight leading-tight">
              Practice for any exam.
            </h2>
            <p className="font-inter text-white/50 text-sm md:text-base leading-relaxed">
              Master your AP exams with expert-curated, structured curriculum tracks. Explore comprehensive diagnostic modules designed to target your weaknesses and build perfect-score confidence.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="space-y-5"
          >
            {[
              "Official College Board Alignment: 100% mapped to units and learning objectives.",
              "Expert-Curated Study Tracks: Premade high-yield curriculum for Biology, Chemistry, and Physics.",
              "Active Diagnostic Quizzing: Identify knowledge gaps with unit-by-unit checkpoints.",
              "Detailed Step-by-Step Breakdowns: Learn the core concepts behind every correct and incorrect choice."
            ].map((item, idx) => {
              const [title, desc] = item.split(": ");
              return (
                <div key={idx} className="flex items-start space-x-3.5 group">
                  <div className="mt-1 w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-white/15">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <span className="font-manrope font-bold text-sm text-white block group-hover:text-emerald-400 transition-colors duration-300">{title}</span>
                    <span className="font-inter text-xs text-white/50 block mt-0.5">{desc}</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Column: Interactive Quiz Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="relative w-full max-w-md mx-auto"
          style={{ perspective: "1000px" }}
        >
          {/* Muted ambient glow behind card */}
          <div className="absolute -inset-4 bg-white/[0.03] blur-[40px] rounded-[36px] pointer-events-none -z-10" />

          {/* Outermost Card with 3D Tilt */}
          <motion.div 
            className="w-full bg-[#0b0c16]/95 border border-white/10 rounded-[28px] p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.7)] backdrop-blur-3xl flex flex-col justify-between min-h-[440px]"
            style={{
              transform: "rotateY(-6deg) rotateX(3deg) rotateZ(-0.5deg)",
              transformStyle: "preserve-3d"
            }}
            whileHover={{
              transform: "rotateY(-2deg) rotateX(1.5deg) rotateZ(-0.2deg) translateY(-4px)",
              transition: { duration: 0.4, ease: "easeOut" }
            }}
          >
            
            {/* Header: Question label */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-white/30 tracking-wider">
                <span>Question {currentIdx + 1} of 5</span>
              </div>

              {/* Question Text */}
              <h3 className="font-manrope font-bold text-white text-base tracking-tight leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Options list: Spotify track rows */}
            <div className="space-y-1.5 mt-6 border-t border-white/5 pt-4">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQuestion.correctIndex;
                
                let optionStyle = "bg-transparent text-white/70 hover:bg-white/[0.04]";
                let indexNum = `0${idx + 1}`;
                let rightIcon = null;
                
                if (isAnswered) {
                  if (isCorrectOption) {
                    optionStyle = "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400";
                    indexNum = "✓";
                    rightIcon = <Check className="w-4 h-4 text-emerald-400" />;
                  } else if (isSelected) {
                    optionStyle = "bg-red-500/10 border border-red-500/20 text-red-400";
                    indexNum = "✕";
                    rightIcon = <X className="w-4 h-4 text-red-400" />;
                  } else {
                    optionStyle = "bg-transparent opacity-40 text-white/40";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-white/10 text-white border border-white/10";
                }

                return (
                  <motion.div
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    whileHover={!isAnswered ? { scale: 1.01 } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer select-none group",
                      optionStyle
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Track number / index */}
                      <span className={cn(
                        "w-5 font-mono text-xs text-white/30 text-center transition-colors group-hover:text-white/60",
                        isAnswered && (isCorrectOption || isSelected) && "font-bold text-sm"
                      )}>
                        {indexNum}
                      </span>
                      <span className="font-manrope font-semibold text-sm leading-relaxed">{option}</span>
                    </div>
                    {rightIcon}
                  </motion.div>
                );
              })}
            </div>

            {/* Explanation box */}
            <div className="relative mt-4">
              <AnimatePresence>
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/50 font-inter leading-relaxed space-y-1">
                      <div className="flex items-center space-x-1.5 text-white/80 font-bold text-xs">
                        <HelpCircle className="w-3.5 h-3.5 text-white" />
                        <span>Explanation:</span>
                      </div>
                      <p>{currentQuestion.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Navigation: clean player style controls */}
            <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-6">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-mono text-xs text-white/30 uppercase tracking-widest">Question {currentIdx + 1} / 5</span>

              <button
                onClick={handleNext}
                disabled={currentIdx === quizQuestions.length - 1}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
