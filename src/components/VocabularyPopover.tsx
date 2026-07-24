"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { cn } from "@/lib/utils";

interface VocabProps {
  term: string;
  definition: string;
  children?: React.ReactNode;
  accentColor?: string;
  accentColorBorder?: string;
}

export function VocabularyPopover({ term, definition, children, accentColor, accentColorBorder }: VocabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { progress } = useProgress();
  const isLightMode = progress?.theme === "light";

  const resolvedAccent = accentColor || "var(--theme-accent, #22c55e)";

  return (
    <span className="relative inline-block">
      <button 
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="inline-flex items-center font-bold border-b transition-all cursor-help group vocab-term-btn"
        style={{
          color: resolvedAccent,
          borderBottomColor: accentColorBorder || "var(--theme-accent-border, rgba(34, 197, 94, 0.3))"
        }}
      >
        {children || term}
        <Info className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: resolvedAccent }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={cn(
              "absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-[100] w-64 p-4 rounded-2xl border shadow-2xl pointer-events-none backdrop-blur-xl transition-colors",
              isLightMode ? "bg-white border-slate-300 text-slate-900 shadow-slate-900/10" : "bg-[#0a0a14] border-white/10 text-white"
            )}
          >
            <div className="space-y-1.5">
              <h5 className="font-manrope font-black text-[10px] uppercase tracking-widest" style={{ color: resolvedAccent }}>{term}</h5>
              <p className={cn("text-xs leading-relaxed font-inter", isLightMode ? "text-slate-800 font-medium" : "text-white/80")}>
                {definition}
              </p>
            </div>
            {/* Arrow */}
            <div className={cn("absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent", isLightMode ? "border-t-white" : "border-t-[#0a0a14]")} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
