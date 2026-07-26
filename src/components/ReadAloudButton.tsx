"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, Pause } from "lucide-react";
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

  const getSelectedVoice = (availableVoices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (availableVoices.length === 0) return null;

    const savedVoiceProfile = localStorage.getItem("aplab_voice_setting") || "1";
    const englishVoices = availableVoices.filter((v) => v.lang.toLowerCase().startsWith("en"));
    const allVoices = englishVoices.length > 0 ? englishVoices : availableVoices;

    switch (savedVoiceProfile) {
      case "2": // Natural US Male
        return (
          allVoices.find(
            (v) =>
              (v.name.includes("Male") || v.name.includes("Daniel") || v.name.includes("David") || v.name.includes("Alex") || v.name.includes("Fred")) &&
              !v.name.includes("UK") &&
              !v.lang.toLowerCase().includes("gb")
          ) || allVoices[0]
        );
      case "3": // Natural UK Female
        return (
          allVoices.find(
            (v) =>
              v.lang.toLowerCase().includes("gb") ||
              v.lang.toLowerCase().includes("uk") ||
              v.name.includes("UK English Female") ||
              v.name.includes("British") ||
              v.name.includes("Karen") ||
              v.name.includes("Serena") ||
              v.name.includes("Martha") ||
              v.name.includes("Kate") ||
              v.name.includes("Fiona")
          ) ||
          allVoices.find((v) => v.lang.toLowerCase().includes("gb")) ||
          allVoices[0]
        );
      case "4": // Natural UK Male
        return (
          allVoices.find(
            (v) =>
              (v.lang.toLowerCase().includes("gb") ||
                v.lang.toLowerCase().includes("uk") ||
                v.name.includes("UK English Male") ||
                v.name.includes("British") ||
                v.name.includes("Arthur") ||
                v.name.includes("Oliver") ||
                v.name.includes("George") ||
                v.name.includes("Daniel")) &&
              (v.name.includes("Male") || v.name.includes("UK") || v.lang.toLowerCase().includes("gb"))
          ) ||
          allVoices.find((v) => v.lang.toLowerCase().includes("gb")) ||
          allVoices[0]
        );
      case "1": // Natural US Female (Default)
      default:
        return (
          allVoices.find(
            (v) =>
              (v.name.includes("Google US English") || v.name.includes("Samantha") || v.name.includes("Natural") || v.name.includes("Enhanced") || v.name.includes("Victoria") || v.name.includes("Zira")) &&
              !v.name.includes("UK") &&
              !v.lang.toLowerCase().includes("gb")
          ) || allVoices[0]
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

      let currentVoices = voices;
      if (currentVoices.length === 0) {
        currentVoices = window.speechSynthesis.getVoices();
        setVoices(currentVoices);
      }

      const cleanText = getCleanText(textToRead, title);
      const utterance = new SpeechSynthesisUtterance(cleanText);

      const targetVoice = getSelectedVoice(currentVoices);
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
        "w-10 h-10 rounded-full border border-white/25 hover:border-white/40 bg-white/10 hover:bg-white/20 text-white backdrop-blur-2xl flex items-center justify-center cursor-pointer select-none group shadow-lg active:scale-95 transition-all duration-200",
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
