"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Image as ImageIcon, Video, FileSpreadsheet, Mic, Upload,
  Sparkles, Check, ArrowRight, RefreshCw, BookOpen, HelpCircle, Layers,
  RotateCw
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { cn } from "@/lib/utils";

type TabType = "pdf" | "image" | "video" | "powerpoint" | "recording";

interface SummarizeResult {
  title: string;
  executiveSummary: string;
  keyTakeaways: string[];
  studyNotes: { heading: string; content: string }[];
  flashcards: { question: string; answer: string }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export default function AiPdfSummarizerPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pdf");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SummarizeResult | null>(null);
  const [activeResultView, setActiveResultView] = useState<"summary" | "notes" | "flashcards" | "quiz">("summary");

  // Flashcard flip state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleSummarize = async () => {
    if (!selectedFile && !videoUrl.trim() && !pastedText.trim()) return;

    setIsProcessing(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("type", activeTab);
      if (selectedFile) formData.append("file", selectedFile);
      if (videoUrl.trim()) formData.append("videoUrl", videoUrl.trim());
      if (pastedText.trim()) formData.append("text", pastedText.trim());

      const res = await fetch("/api/summarize", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.data) {
        setResult(json.data);
        setActiveResultView("summary");
      }
    } catch (err) {
      console.error("Summarizer error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const tabConfigs = {
    pdf: {
      title: "AI PDF Summarizer",
      description: "Upload any PDF & AP Lab will make notes & flashcards instantly. In < 30 seconds AP Lab will read your PDF and tell you all the important stuff in it.",
      icon: FileText,
      iconBg: "bg-red-500/20 text-red-400 border-red-500/30",
      accept: ".pdf",
      uploadTitle: "Drag & drop a PDF file to upload",
    },
    image: {
      title: "AI Image Summarizer",
      description: "Snap a photo of your textbook page, lecture slide, or handwritten notes. AP Lab will extract text and summarize key concepts automatically.",
      icon: ImageIcon,
      iconBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      accept: "image/*",
      uploadTitle: "Drag & drop Image files to upload",
    },
    video: {
      title: "AI Video Summarizer",
      description: "Paste any YouTube educational video link or lecture recording. AP Lab transcribes the lesson and generates study guides & flashcards.",
      icon: Video,
      iconBg: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      accept: "video/*",
      uploadTitle: "Paste a YouTube video URL or upload video",
    },
    powerpoint: {
      title: "AI PowerPoint Summarizer",
      description: "Upload slide decks (.ppt, .pptx). AP Lab analyzes slide bullets, diagrams, and presenter notes into concise study cheat sheets.",
      icon: FileSpreadsheet,
      iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      accept: ".ppt,.pptx",
      uploadTitle: "Drag & drop PowerPoint slides (.ppt, .pptx)",
    },
    recording: {
      title: "AI Live Recording Summarizer",
      description: "Record your teacher's lecture live or upload audio files. AP Lab generates real-time transcripts and structured AP exam notes.",
      icon: Mic,
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      accept: "audio/*",
      uploadTitle: "Upload audio lecture or start live recording",
    },
  };

  const currentConfig = tabConfigs[activeTab];
  const IconComponent = currentConfig.icon;

  return (
    <div className="min-h-screen bg-[#070810] text-white flex flex-row relative z-0 selection:bg-neutral-800 selection:text-white font-manrope">
      <AppSidebar currentPath="/dashboard/assistant" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
          
          {/* TOP CENTERED CAPSULE TAB SWITCHER (MATCHING KNOWT SCREENSHOT) */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-[#161824] border border-white/10 shadow-xl">
              {[
                { id: "pdf", label: "PDF" },
                { id: "image", label: "Image(s)" },
                { id: "video", label: "Video" },
                { id: "powerpoint", label: "PowerPoint" },
                { id: "recording", label: "Live Recording" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id as TabType);
                      setSelectedFile(null);
                      setResult(null);
                    }}
                    className={cn(
                      "px-6 py-2.5 rounded-full text-xs font-manrope font-extrabold transition-all cursor-pointer select-none",
                      isActive
                        ? "bg-[#27272a] text-white shadow-md border border-white/10 scale-105"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN TWO-COLUMN CONTAINER (MATCHING KNOWT SCREENSHOT) */}
          {!result ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
              
              {/* LEFT PANEL: OVERVIEW & EXAMPLES */}
              <div className="lg:col-span-5 bg-[#0f111a] border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-2xl">
                <div className="space-y-6">
                  {/* Badge Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center shadow-lg">
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-3">
                    <h1 className="font-manrope font-black text-2xl sm:text-3xl text-white tracking-tight">
                      {currentConfig.title}
                    </h1>
                    <p className="text-sm font-manrope text-white/60 leading-relaxed">
                      {currentConfig.description}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Examples Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-white/90 font-manrope font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Examples</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-manrope font-extrabold text-xs text-white">Reading Comprehension:</h4>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Summarize a nonfiction article on ecosystems for 5th-grade science and generate key takeaways.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-manrope font-extrabold text-xs text-white">Study Support:</h4>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Upload a biology textbook chapter and create flashcards for high school test prep.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: INTERACTIVE DRAG & DROP UPLOAD BOX */}
              <div className="lg:col-span-7 bg-[#0f111a] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative min-h-[420px]">
                
                {/* Purple Dashed Border Outer Box */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="w-full h-full border-2 border-purple-500/40 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-6 bg-purple-500/[0.02] hover:bg-purple-500/[0.04] transition-all"
                >
                  {/* Cloud Icon */}
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    {activeTab === "video" ? (
                      <Video className="w-8 h-8 text-red-500" />
                    ) : (
                      <Upload className="w-8 h-8 text-purple-400" />
                    )}
                  </div>

                  {/* Text Header */}
                  <div className="space-y-2 max-w-sm">
                    <h3 className="font-manrope font-black text-xl text-white tracking-tight">
                      {selectedFile ? selectedFile.name : currentConfig.uploadTitle}
                    </h3>
                    <p className="text-xs text-white/40 font-manrope">
                      {selectedFile
                        ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for AI processing`
                        : "Supports PDF documents, images, slide decks & text files"}
                    </p>
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={currentConfig.accept}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Video URL Input when Video Tab selected */}
                  {activeTab === "video" && (
                    <div className="w-full max-w-md space-y-2">
                      <input
                        type="text"
                        placeholder="Paste YouTube Video URL (e.g. https://youtube.com/watch?v=...)"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        className="w-full bg-black/40 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500 font-manrope"
                      />
                    </div>
                  )}

                  {/* Action Button: Select Files or Summarize Now */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedFile || videoUrl.trim()) {
                          handleSummarize();
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      disabled={isProcessing}
                      className="px-8 py-3 rounded-full bg-white text-black font-manrope font-extrabold text-sm hover:bg-neutral-200 transition-all cursor-pointer shadow-lg disabled:opacity-50 flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>Generating Notes & Flashcards...</span>
                        </>
                      ) : selectedFile || videoUrl.trim() ? (
                        <>
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span>Summarize Now</span>
                        </>
                      ) : (
                        <span>Select files</span>
                      )}
                    </button>
                  </div>

                  {/* Google Drive Subtext */}
                  <p className="text-[11px] text-white/35 font-manrope">
                    Or, upload from Google Drive
                  </p>
                </div>
              </div>

            </div>
          ) : (
            /* ── PROCESSED SUMMARY & FLASHCARDS RESULT VIEW ── */
            <div className="space-y-6">
              {/* Header & Back Button */}
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="font-manrope font-black text-2xl text-white">{result.title}</h2>
                  <p className="text-xs text-white/40 font-manrope mt-1">Generated by AP Lab AI Summarizer Engine</p>
                </div>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-manrope font-bold text-xs transition-colors cursor-pointer border border-white/10"
                >
                  Upload New File
                </button>
              </div>

              {/* View Switcher Tabs (Executive Summary | Study Notes | Flashcards | Practice Quiz) */}
              <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
                {[
                  { id: "summary", label: "Executive Summary", icon: FileText },
                  { id: "notes", label: "Study Notes", icon: BookOpen },
                  { id: "flashcards", label: "Interactive Flashcards", icon: Layers },
                  { id: "quiz", label: "Practice Quiz", icon: HelpCircle },
                ].map((v) => {
                  const Icon = v.icon;
                  const isActive = activeResultView === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveResultView(v.id as any)}
                      className={cn(
                        "flex items-center gap-2 px-5 py-2.5 rounded-full font-manrope font-bold text-xs transition-all cursor-pointer",
                        isActive
                          ? "bg-purple-600 text-white shadow-lg"
                          : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{v.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* VIEW 1: EXECUTIVE SUMMARY */}
              {activeResultView === "summary" && (
                <div className="space-y-6 bg-[#0f111a] border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-3">
                    <h3 className="font-manrope font-black text-lg text-purple-300">Executive Summary</h3>
                    <p className="text-sm font-manrope text-white/80 leading-relaxed bg-white/[0.03] p-5 rounded-2xl border border-white/5">
                      {result.executiveSummary}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-manrope font-black text-lg text-amber-300">Key Takeaways</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.keyTakeaways.map((point, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                          <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="text-xs font-manrope text-white/70 leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: STUDY NOTES */}
              {activeResultView === "notes" && (
                <div className="space-y-6 bg-[#0f111a] border border-white/10 rounded-3xl p-8 shadow-2xl">
                  {result.studyNotes.map((sec, idx) => (
                    <div key={idx} className="space-y-2 border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
                      <h3 className="font-manrope font-black text-base text-cyan-300">{sec.heading}</h3>
                      <p className="text-xs font-manrope text-white/70 leading-relaxed bg-white/[0.02] p-4 rounded-xl border border-white/5">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* VIEW 3: INTERACTIVE FLIP FLASHCARDS */}
              {activeResultView === "flashcards" && result.flashcards.length > 0 && (
                <div className="flex flex-col items-center justify-center space-y-6 py-6">
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="w-full max-w-xl h-80 bg-[#141624] border border-purple-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl cursor-pointer relative transition-all duration-300 hover:border-purple-500"
                  >
                    <div className="absolute top-4 right-4 flex items-center space-x-2 text-xs text-white/40 font-mono">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click to flip</span>
                    </div>

                    <span className="text-xs font-manrope font-extrabold text-purple-400 uppercase tracking-widest mb-4">
                      {isCardFlipped ? "Answer" : "Question"} ({currentCardIndex + 1} / {result.flashcards.length})
                    </span>

                    <p className="font-manrope font-extrabold text-xl text-white leading-relaxed">
                      {isCardFlipped
                        ? result.flashcards[currentCardIndex].answer
                        : result.flashcards[currentCardIndex].question}
                    </p>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      disabled={currentCardIndex === 0}
                      onClick={() => {
                        setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                        setIsCardFlipped(false);
                      }}
                      className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs disabled:opacity-30 transition-all cursor-pointer"
                    >
                      Previous
                    </button>

                    <button
                      type="button"
                      disabled={currentCardIndex === result.flashcards.length - 1}
                      onClick={() => {
                        setCurrentCardIndex((prev) => Math.min(result.flashcards.length - 1, prev + 1));
                        setIsCardFlipped(false);
                      }}
                      className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-30 transition-all cursor-pointer shadow-lg"
                    >
                      Next Card
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 4: PRACTICE QUIZ */}
              {activeResultView === "quiz" && result.quiz.length > 0 && (
                <div className="space-y-6 bg-[#0f111a] border border-white/10 rounded-3xl p-8 shadow-2xl">
                  {result.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-4 border-b border-white/10 pb-6 last:border-b-0 last:pb-0">
                      <h4 className="font-manrope font-bold text-sm text-white">
                        {qIdx + 1}. {q.question}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[qIdx] === optIdx;
                          const isCorrect = q.correctIndex === optIdx;
                          const showFeedback = showQuizResults;

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }))}
                              className={cn(
                                "p-3.5 rounded-2xl border text-left text-xs font-manrope transition-all cursor-pointer",
                                showFeedback
                                  ? isCorrect
                                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold"
                                    : isSelected
                                    ? "bg-red-500/20 border-red-500 text-red-300"
                                    : "bg-white/[0.03] border-white/5 text-white/40"
                                  : isSelected
                                  ? "bg-purple-600/30 border-purple-500 text-white font-bold"
                                  : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.08]"
                              )}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowQuizResults(true)}
                      className="px-8 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-manrope font-black text-xs transition-all cursor-pointer shadow-lg"
                    >
                      Check Quiz Answers
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
