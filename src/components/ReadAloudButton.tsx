"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Pause, Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadAloudButtonProps {
  textToRead: string;
  title?: string;
  className?: string;
  isLightMode?: boolean;
}

export function ReadAloudButton({
  textToRead,
  title,
  className,
  isLightMode = false,
}: ReadAloudButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean raw markdown text for natural speech reading
  const getCleanText = (rawText: string) => {
    return rawText
      .replace(/#+\s+/g, "") // Remove headers
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1") // Remove bold/italic
      .replace(/`([^`]+)`/g, "$1") // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove link syntax
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/[$]\s*([^$]+)\s*[$]/g, "$1") // Remove math delimiters
      .replace(/\n+/g, ". "); // Natural pauses between paragraphs
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Priority for natural fluid human voices
        const naturalVoice = voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Google") ||
              v.name.includes("Natural") ||
              v.name.includes("Samantha") ||
              v.name.includes("Karen") ||
              v.name.includes("Daniel") ||
              v.name.includes("Premium") ||
              v.name.includes("Enhanced"))
        ) || voices.find((v) => v.lang.startsWith("en")) || voices[0];

        if (naturalVoice) {
          setVoice(naturalVoice);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Stop any previous playback

      const cleanText = getCleanText(`${title ? title + ". " : ""}${textToRead}`);
      const utterance = new SpeechSynthesisUtterance(cleanText);

      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.rate = 0.96; // Fluid human reading pace
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) return null;

  return (
    <button
      onClick={handleTogglePlay}
      className={cn(
        "inline-flex items-center space-x-2.5 px-3.5 py-1.8 rounded-full border transition-all duration-200 shadow-sm cursor-pointer select-none group text-xs font-manrope font-bold",
        isPlaying
          ? "bg-purple-600/20 border-purple-500/50 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-pulse"
          : isLightMode
          ? "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
          : "bg-white/10 border-white/15 text-white/90 hover:bg-white/15 hover:text-white",
        className
      )}
      title={isPlaying ? "Pause Read Aloud" : "Read Article Aloud (Fluid Natural Speech)"}
    >
      {isPlaying ? (
        <>
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <Pause className="w-3.5 h-3.5 text-purple-300" />
          <span>Reading Aloud...</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          <span>Listen to Article</span>
        </>
      )}
    </button>
  );
}
