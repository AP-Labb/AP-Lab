"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Image as ImageIcon, Video, FileSpreadsheet, Mic, Upload,
  Sparkles, Check, ArrowRight, RefreshCw, BookOpen, HelpCircle, Layers,
  RotateCw, Square, Play, Pause, AlertCircle
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
  const [showPastedText, setShowPastedText] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SummarizeResult | null>(null);
  const [activeResultView, setActiveResultView] = useState<"summary" | "notes" | "flashcards" | "quiz">("summary");

  // Live Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Flashcard flip state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

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

  // Live Microphone Recording handlers
  const startRecording = async () => {
    setRecordingError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const recordedFile = new File([audioBlob], `live_lecture_${Date.now()}.webm`, { type: "audio/webm" });
        setSelectedFile(recordedFile);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setRecordingError("Microphone permission denied or not supported. You can upload an audio file directly.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainderSecs.toString().padStart(2, "0")}`;
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
        setCurrentCardIndex(0);
        setIsCardFlipped(false);
        setSelectedAnswers({});
        setShowQuizResults(false);
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
      description: "Upload any AP PDF study guide, textbook chapter, or syllabus. AP Lab extracts high-yield notes, key takeaways, and flashcards instantly.",
      icon: FileText,
      iconBg: "bg-red-500/20 text-red-400 border-red-500/30",
      accept: ".pdf,application/pdf",
      uploadTitle: "Drag & drop a PDF file to upload",
    },
    image: {
      title: "AI Image Summarizer",
      description: "Snap a photo of your textbook, whiteboard notes, or diagram. AP Lab performs AI visual recognition and summarizes key concepts automatically.",
      icon: ImageIcon,
      iconBg: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      accept: "image/*,.png,.jpg,.jpeg,.webp",
      uploadTitle: "Drag & drop Image files (PNG, JPG, WebP)",
    },
    video: {
      title: "AI Video Summarizer",
      description: "Paste a YouTube video URL or upload a video lecture. AP Lab transcribes the lesson and builds structured study guides and practice quizzes.",
      icon: Video,
      iconBg: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      accept: "video/*,.mp4,.mov,.webm,.mkv",
      uploadTitle: "Paste a YouTube video URL or upload video file",
    },
    powerpoint: {
      title: "AI PowerPoint Summarizer",
      description: "Upload slide decks (.ppt, .pptx). AP Lab analyzes slide bullets, figures, and notes into concise study cheat sheets.",
      icon: FileSpreadsheet,
      iconBg: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      accept: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
      uploadTitle: "Drag & drop PowerPoint slides (.ppt, .pptx)",
    },
    recording: {
      title: "AI Live Recording Summarizer",
      description: "Record live teacher lectures using your microphone or upload audio files. AP Lab creates real-time transcripts and structured AP exam notes.",
      icon: Mic,
      iconBg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      accept: "audio/*,.mp3,.wav,.m4a,.webm,.ogg",
      uploadTitle: "Record live lecture or upload an audio file",
    },
  };

  const currentConfig = tabConfigs[activeTab];
  const IconComponent = currentConfig.icon;

  const hasInputReady = Boolean(selectedFile || videoUrl.trim() || pastedText.trim());

  return (
    <div className="min-h-screen bg-[#070810] text-white flex flex-row relative z-0 selection:bg-neutral-800 selection:text-white font-manrope">
      <AppSidebar currentPath="/dashboard/ai-summarizer" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
          
          {/* TOP CENTERED CAPSULE TAB SWITCHER */}
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-[#161824] border border-white/10 shadow-xl">
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
                      setVideoUrl("");
                      setPastedText("");
                      setResult(null);
                      if (isRecording) stopRecording();
                    }}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-xs font-manrope font-extrabold transition-all cursor-pointer select-none",
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

          {/* MAIN TWO-COLUMN INPUT CONTAINER */}
          {!result ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
              
              {/* LEFT PANEL: OVERVIEW & EXAMPLES */}
              <div className="lg:col-span-5 bg-[#0f111a] border border-white/10 rounded-3xl p-8 flex flex-col justify-between space-y-8 shadow-2xl">
                <div className="space-y-6">
                  {/* Badge Icon */}
                  <div className={cn("w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg", currentConfig.iconBg)}>
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
                    <span>How to use</span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h4 className="font-manrope font-extrabold text-xs text-white">1. Choose or Record Material</h4>
                      <p className="text-xs text-white/50 leading-relaxed">
                        Upload your file, record live lecture audio, or paste a video URL / text notes.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-manrope font-extrabold text-xs text-white">2. AI High-Yield Processing</h4>
                      <p className="text-xs text-white/50 leading-relaxed">
                        AP Lab analyzes key concepts and generates study notes, interactive flashcards & practice quiz questions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL: INTERACTIVE DRAG & DROP / RECORDING / URL INPUT */}
              <div className="lg:col-span-7 bg-[#0f111a] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl relative min-h-[440px]">
                
                {/* Dashed Border Outer Box */}
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="w-full h-full border-2 border-purple-500/40 border-dashed rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-6 bg-purple-500/[0.02] hover:bg-purple-500/[0.04] transition-all"
                >
                  
                  {/* LIVE RECORDING SPECIAL VIEW */}
                  {activeTab === "recording" ? (
                    <div className="w-full space-y-6 flex flex-col items-center">
                      <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center shadow-lg relative">
                        {isRecording && (
                          <span className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping" />
                        )}
                        <Mic className={cn("w-10 h-10 transition-colors", isRecording ? "text-emerald-400" : "text-white/60")} />
                      </div>

                      <div className="space-y-1 text-center">
                        <h3 className="font-manrope font-black text-xl text-white tracking-tight">
                          {isRecording ? "Recording Live Lecture..." : selectedFile ? selectedFile.name : "Live Microphone Recording"}
                        </h3>
                        <p className="text-xs text-emerald-400 font-mono font-bold">
                          {isRecording ? `Timer: ${formatTimer(recordingSeconds)}` : selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Audio Recorded` : "Click below to start live lecture recording"}
                        </p>
                      </div>

                      {recordingError && (
                        <p className="text-xs text-red-400 font-manrope bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                          {recordingError}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center justify-center gap-3">
                        {isRecording ? (
                          <button
                            type="button"
                            onClick={stopRecording}
                            className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-manrope font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                          >
                            <Square className="w-4 h-4 fill-white" />
                            <span>Stop Recording</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={startRecording}
                            className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-manrope font-black text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                          >
                            <Mic className="w-4 h-4" />
                            <span>Start Live Recording</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-manrope font-bold text-xs transition-colors cursor-pointer border border-white/10"
                        >
                          Upload Audio File
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* NORMAL FILE / URL / TEXT UPLOAD VIEW */
                    <>
                      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                        {activeTab === "video" ? (
                          <Video className="w-8 h-8 text-purple-400" />
                        ) : activeTab === "image" ? (
                          <ImageIcon className="w-8 h-8 text-blue-400" />
                        ) : activeTab === "powerpoint" ? (
                          <FileSpreadsheet className="w-8 h-8 text-amber-400" />
                        ) : (
                          <Upload className="w-8 h-8 text-purple-400" />
                        )}
                      </div>

                      <div className="space-y-2 max-w-sm">
                        <h3 className="font-manrope font-black text-xl text-white tracking-tight">
                          {selectedFile ? selectedFile.name : currentConfig.uploadTitle}
                        </h3>
                        <p className="text-xs text-white/40 font-manrope">
                          {selectedFile
                            ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for AI processing`
                            : "Select a file from your device or paste content"}
                        </p>
                      </div>

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
                    </>
                  )}

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={currentConfig.accept}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Collapsible Text Area Option */}
                  <div className="w-full max-w-md">
                    {!showPastedText ? (
                      <button
                        type="button"
                        onClick={() => setShowPastedText(true)}
                        className="text-xs text-purple-400 hover:underline font-manrope"
                      >
                        + Or paste notes / raw text directly
                      </button>
                    ) : (
                      <div className="space-y-2 text-left">
                        <label className="text-[11px] font-manrope text-white/60">Pasted Notes / Text:</label>
                        <textarea
                          rows={3}
                          placeholder="Paste textbook excerpt, lecture notes, or topic outline here..."
                          value={pastedText}
                          onChange={(e) => setPastedText(e.target.value)}
                          className="w-full bg-black/50 border border-white/15 rounded-2xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-purple-500 font-manrope"
                        />
                      </div>
                    )}
                  </div>

                  {/* Action Button: Summarize Now */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (hasInputReady) {
                          handleSummarize();
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      disabled={isProcessing}
                      className="px-8 py-3.5 rounded-full bg-white text-black font-manrope font-black text-sm hover:bg-neutral-200 transition-all cursor-pointer shadow-lg disabled:opacity-50 flex items-center gap-2 active:scale-95"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>Generating AP Study Guide...</span>
                        </>
                      ) : hasInputReady ? (
                        <>
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span>Summarize Now</span>
                        </>
                      ) : (
                        <span>Select Files</span>
                      )}
                    </button>
                  </div>
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
                  onClick={() => {
                    setResult(null);
                    setSelectedFile(null);
                    setVideoUrl("");
                    setPastedText("");
                  }}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-manrope font-bold text-xs transition-colors cursor-pointer border border-white/10"
                >
                  Upload New Material
                </button>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3">
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
                    className="w-full max-w-xl h-80 bg-[#141624] border border-purple-500/30 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl cursor-pointer relative transition-all duration-300 hover:border-purple-500 select-none"
                  >
                    <div className="absolute top-4 right-4 flex items-center space-x-2 text-xs text-white/40 font-mono">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Click to flip</span>
                    </div>

                    <span className="text-xs font-manrope font-extrabold text-purple-400 uppercase tracking-widest mb-4">
                      {isCardFlipped ? "Answer" : "Question"} ({currentCardIndex + 1} / {result.flashcards.length})
                    </span>

                    <p className="font-manrope font-extrabold text-xl text-white leading-relaxed px-4">
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

                      {showQuizResults && (
                        <p className="text-xs text-white/60 font-manrope bg-white/[0.03] p-3 rounded-xl border border-white/5">
                          <strong className="text-emerald-400">Explanation:</strong> {q.explanation}
                        </p>
                      )}
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
