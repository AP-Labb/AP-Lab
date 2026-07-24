"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import { cn } from "@/lib/utils";

export function SelectionAIPopover({ onAsk }: { onAsk: (text: string) => void }) {
  const [selection, setSelection] = useState<{ text: string; x: number; y: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { progress } = useProgress();
  const isLightMode = progress?.theme === "light";

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const windowSelection = window.getSelection();
        const text = windowSelection?.toString().trim();

        const anchorNode = windowSelection?.anchorNode;
        const parentElement = anchorNode?.parentElement;
        const isInsideArticle = parentElement ? !!parentElement.closest(".article-content-container") : false;

        if (isInsideArticle && text && text.length > 0 && windowSelection && windowSelection.rangeCount > 0) {
          const range = windowSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          
          setSelection({
            text,
            x: rect.right,
            y: rect.top - 6,
          });
        } else {
          setSelection(null);
        }
      }, 50);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && popoverRef.current.contains(e.target as Node)) {
        return;
      }
      setSelection(null);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <AnimatePresence>
      {selection && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: 5, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed z-[9999] -translate-x-full -translate-y-full pb-1.5"
          style={{ left: selection.x, top: selection.y }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAsk(selection.text);
              setSelection(null);
              window.getSelection()?.removeAllRanges();
            }}
            className={cn(
              "px-3.5 py-2 rounded-xl border shadow-2xl transition-all cursor-pointer font-medium flex items-center gap-1.5 active:scale-95",
              isLightMode 
                ? "bg-slate-900 border-slate-700 text-white shadow-slate-900/30 hover:bg-slate-800" 
                : "liquid-glass-strong border-white/20 text-white hover:bg-white/10"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-manrope font-bold text-white tracking-wide">Ask AI</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
