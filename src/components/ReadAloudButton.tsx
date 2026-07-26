"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, Pause, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReadAloudButtonProps {
  textToRead: string;
  title?: string;
  className?: string;
}

export function ReadAloudButton({
  textToRead,
  title,
  className,
}: ReadAloudButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Clean raw markdown text: remove images, image alt text, code blocks, HTML, and duplicate headers
  const getCleanText = (rawText: string, articleTitle?: string) => {
    let clean = rawText
      // Remove images completely (alt text and URLs)
      .replace(/!\[.*?\]\(.*?\)/g, "")
      // Remove HTML tags (including <img>, <svg>, <div>)
      .replace(/<[^>]*>/g, "")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove math equations
      .replace(/\$\$[\s\S]*?\$\$/g, "")
      .replace(/[$]\s*([^$]+)\s*[$]/g, "$1")
      // Remove headers formatting hashes
      .replace(/#+\s+/g, "")
      // Remove markdown links but keep anchor text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      // Remove bold and italic markers
      .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
      // Remove backticks
      .replace(/`([^`]+)`/g, "$1")
      // Replace multiple newlines with period pause
      .replace(/\n+/g, ". ");

    // Ensure title isn't read twice if already present at start
    if (articleTitle && !clean.toLowerCase().startsWith(articleTitle.toLowerCase())) {
      clean = `${articleTitle}. ${clean}`;
    }

    return clean.trim();
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const getSelectedVoice = (): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;

    const savedVoiceProfile = localStorage.getItem("aplab_voice_setting") || "1";
    const englishVoices = voices.filter((v) => v.lang.startsWith("en"));

    switch (savedVoiceProfile) {
      case "2": // Natural US Male
        return (
          englishVoices.find(
            (v) => v.name.includes("Male") || v.name.includes("Daniel") || v.name.includes("David") || v.name.includes("Alex")
          ) || englishVoices[0]
        );
      case "3": // Natural UK Female
        return (
          englishVoices.find(
            (v) => (v.lang.includes("GB") || v.name.includes("UK")) && (v.name.includes("Female") || v.name.includes("Karen") || v.name.includes("Serena"))
          ) || englishVoices.find((v) => v.lang.includes("GB")) || englishVoices[0]
        );
      case "4": // Natural UK Male
        return (
          englishVoices.find(
            (v) => (v.lang.includes("GB") || v.name.includes("UK")) && (v.name.includes("Male") || v.name.includes("Oliver") || v.name.includes("George"))
          ) || englishVoices.find((v) => v.lang.includes("GB")) || englishVoices[0]
        );
      case "1": // Natural US Female (Default)
      default:
        return (
          englishVoices.find(
            (v) => v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Natural") || v.name.includes("Enhanced")
          ) || englishVoices[0]
        );
    }
  };

  const handleTogglePlay = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Stop previous playback

      const cleanText = getCleanText(textToRead, title);
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const targetVoice = getSelectedVoice();
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
      
      utterance.rate = 0.96; // Fluid, natural human pace
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

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
        "w-10 h-10 rounded-full border transition-all duration-300 backdrop-blur-2xl flex items-center justify-center text-white cursor-pointer select-none group shadow-lg active:scale-95",
        isPlaying
          ? "bg-purple-600/30 border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse"
          : "bg-white/10 hover:bg-white/20 border-white/25 hover:border-white/40",
        className
      )}
      title={isPlaying ? "Pause Read Aloud" : "Read Article Aloud (Fluid Natural Speech)"}
    >
      {isPlaying ? (
        <Pause className="w-4 h-4 text-white fill-white" />
      ) : (
        <Volume2 className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
}
