"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, DollarSign, Activity } from "lucide-react";

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMPARISON_DATA = [
  {
    feature: "24/7 Socratic AI Assistant",
    apLab: "check",
    khan: "paid",
    fiveable: "paid",
    knowt: "check",
    quizlet: "paid",
    brilliant: "paid"
  },
  {
    feature: "Comprehensive AP Practice Questions",
    apLab: "check",
    khan: "check",
    fiveable: "paid",
    knowt: "check",
    quizlet: "paid",
    brilliant: "paid"
  },
  {
    feature: "Full-Length AP Mock Exams & Timer",
    apLab: "check",
    khan: "cross",
    fiveable: "paid",
    knowt: "paid",
    quizlet: "cross",
    brilliant: "cross"
  },
  {
    feature: "Live Unit Diagnostic Analytics",
    apLab: "check",
    khan: "check",
    fiveable: "cross",
    knowt: "cross",
    quizlet: "cross",
    brilliant: "check"
  },
  {
    feature: "Interactive Unit Lessons & Guides",
    apLab: "check",
    khan: "check",
    fiveable: "check",
    knowt: "check",
    quizlet: "cross",
    brilliant: "paid"
  },
  {
    feature: "Formulas & Vocabulary Flashcards",
    apLab: "check",
    khan: "cross",
    fiveable: "check",
    knowt: "check",
    quizlet: "paid",
    brilliant: "cross"
  },
  {
    feature: "Gamified XP Leaderboard & Streaks",
    apLab: "check",
    khan: "cross",
    fiveable: "cross",
    knowt: "check",
    quizlet: "cross",
    brilliant: "check"
  },
  {
    feature: "Price (per month)",
    apLab: "Free $0.00",
    khan: "$4.00 (Khanmigo)",
    fiveable: "$27.00",
    knowt: "$24.99/yr",
    quizlet: "$35.99/yr",
    brilliant: "$27.99"
  }
];

export function ComparisonModal({ isOpen, onClose }: ComparisonModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const renderCellContent = (value: string, isApLab = false) => {
    if (value === "check") {
      return (
        <div className="w-7 h-7 rounded-full flex items-center justify-center mx-auto bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
          <Check className="w-4 h-4 stroke-[2.5]" />
        </div>
      );
    }
    if (value === "cross") {
      return (
        <div className="w-7 h-7 rounded-full flex items-center justify-center mx-auto bg-white/[0.04] text-white/20 border border-white/5">
          <X className="w-4 h-4" />
        </div>
      );
    }
    if (value === "paid") {
      return (
        <div className="w-7 h-7 rounded-full flex items-center justify-center mx-auto bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <DollarSign className="w-4 h-4" />
        </div>
      );
    }
    return (
      <span className={`text-xs font-mono font-bold ${isApLab ? "text-emerald-400 font-extrabold text-sm tracking-wide" : "text-white/60"}`}>
        {value}
      </span>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999999] bg-[#030409] overflow-y-auto select-none flex items-center justify-center p-4 sm:p-6"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Global Style overrides to lock body scroll and hide top Navbar */}
          <style>{`
            body {
              overflow: hidden !important;
            }
            header, nav {
              opacity: 0 !important;
              pointer-events: none !important;
              transition: opacity 0.2s ease !important;
            }
          `}</style>

          {/* Modal Content Box - Larger & More Spacious */}
          <motion.div
            initial={{ y: "100vh", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100vh", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-6xl w-[94%] sm:w-[96%] bg-[#080914] border border-white/15 rounded-3xl overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,1)] z-10 flex flex-col max-h-[92vh] my-auto"
          >
            {/* Small Close Button (Top Right Inside Modal) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-40 w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Matrix Table */}
            <div 
              data-lenis-prevent="true"
              className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6 pt-10 custom-scrollbar"
            >
              <table className="w-full text-left border-collapse min-w-[840px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-3.5 px-5 text-xs font-mono uppercase tracking-wider text-white/40 font-bold w-[26%]">
                      Feature Comparison
                    </th>

                    {/* AP Lab Column Header - Forced 1 Horizontal Line */}
                    <th className="py-3.5 px-5 text-center bg-white/[0.06] border-x border-t border-white/20 rounded-t-2xl">
                      <div className="flex items-center justify-center space-x-2 py-1 whitespace-nowrap">
                        <Activity className="w-4.5 h-4.5 text-white shrink-0" />
                        <span className="text-sm sm:text-base font-extrabold text-white tracking-tight font-manrope whitespace-nowrap">
                          AP Lab
                        </span>
                      </div>
                    </th>

                    {/* Khan Academy Header Logo */}
                    <th className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center h-8">
                        <img src="/images/logos/khan.png" alt="Khan Academy" className="h-6 sm:h-7 object-contain max-w-[130px] filter brightness-110" />
                      </div>
                    </th>

                    {/* Fiveable Header Logo */}
                    <th className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center h-8">
                        <img src="/images/logos/fiveable.png" alt="Fiveable" className="h-6 sm:h-7 object-contain max-w-[120px] filter brightness-110" />
                      </div>
                    </th>

                    {/* Knowt Header Logo */}
                    <th className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center h-8">
                        <img src="/images/logos/knowt.png" alt="Knowt" className="h-6 sm:h-7 object-contain max-w-[110px] filter brightness-110" />
                      </div>
                    </th>

                    {/* Quizlet Header Logo */}
                    <th className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center h-8">
                        <img src="/images/logos/quizlet.png" alt="Quizlet" className="h-6 sm:h-7 object-contain max-w-[120px] filter brightness-110" />
                      </div>
                    </th>

                    {/* Brilliant Header Logo */}
                    <th className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center h-8">
                        <img src="/images/logos/brilliant.png" alt="Brilliant" className="h-6 sm:h-7 object-contain max-w-[130px] filter invert brightness-200" />
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {COMPARISON_DATA.map((row, idx) => {
                    const isLastRow = idx === COMPARISON_DATA.length - 1;
                    return (
                      <tr 
                        key={row.feature} 
                        className={`hover:bg-white/[0.02] transition-colors ${isLastRow ? "bg-white/[0.04] font-bold" : ""}`}
                      >
                        <td className="py-3.5 px-5 text-xs sm:text-sm font-manrope font-semibold text-white/90">
                          {row.feature}
                        </td>

                        {/* AP Lab Highlight Cell - NO BLUR OVERLAY */}
                        <td className={`py-3.5 px-5 text-center bg-white/[0.04] border-x border-white/15 ${isLastRow ? "border-b rounded-b-2xl" : ""}`}>
                          {renderCellContent(row.apLab, true)}
                        </td>

                        <td className="py-3.5 px-5 text-center">
                          {renderCellContent(row.khan)}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          {renderCellContent(row.fiveable)}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          {renderCellContent(row.knowt)}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          {renderCellContent(row.quizlet)}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          {renderCellContent(row.brilliant)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
