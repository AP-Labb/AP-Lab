"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Image as ImageIcon, Video, FileSpreadsheet, Mic, Upload,
  Sparkles, Check, ArrowRight, RefreshCw, BookOpen, HelpCircle, Layers,
  RotateCw, Square, Plus, Info, X, Paperclip, ExternalLink, Play
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { cn } from "@/lib/utils";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<SummarizeResult | null>(null);
  const [activeResultView, setActiveResultView] = useState<"summary" | "notes" | "flashcards" | "quiz">("summary");

  // Modals state
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);

  // Live Audio Recording & Volume Meter State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioVolume, setAudioVolume] = useState(0);
  const [recordingError, setRecordingError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

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
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Live Audio Recording & Spectrum Meter
  const startRecording = async () => {
    setRecordingError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Web Audio API volume analyzer
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setAudioVolume(avg);
        animFrameRef.current = requestAnimationFrame(checkVolume);
      };
      checkVolume();

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
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        if (audioCtxRef.current) audioCtxRef.current.close();
        setAudioVolume(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      setRecordingError("Microphone access denied or unverified. You can upload audio files directly.");
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
      formData.append("type", selectedFile ? "file" : videoUrl.trim() ? "video" : "text");
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

  // Determine volume bar colors based on level (Silent, Red, Yellow, Green)
  const getMeterBars = () => {
    const numBars = 7;
    return Array.from({ length: numBars }).map((_, i) => {
      if (audioVolume <= 2) {
        return { height: "15%", color: "bg-neutral-600" };
      } else if (audioVolume <= 25) {
        const h = Math.min(100, Math.max(25, (audioVolume / 25) * 60 + i * 4));
        return { height: `${h}%`, color: "bg-red-500" };
      } else if (audioVolume <= 60) {
        const h = Math.min(100, Math.max(40, (audioVolume / 60) * 80 + (i % 3) * 5));
        return { height: `${h}%`, color: "bg-amber-400" };
      } else {
        const h = Math.min(100, Math.max(60, (audioVolume / 120) * 100 + (i % 2) * 8));
        return { height: `${h}%`, color: "bg-emerald-400" };
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white flex flex-row relative z-0 selection:bg-neutral-800 selection:text-white font-manrope">
      <AppSidebar currentPath="/dashboard/ai-summarizer" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8">
          
          {!result ? (
            <div className="space-y-6">
              {/* MAIN TWO-COLUMN LAYOUT (MATCHING EXACT UPLOADED KNOWT SCREENSHOT) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* LEFT / MAIN DRAG & DROP CARD */}
                <div className="lg:col-span-8 bg-[#16171d] border border-[#272832] rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between shadow-2xl relative min-h-[460px]">
                  
                  {/* DRAG & DROP BLUE HIGHLIGHT OVERLAY (MATCHING SCREENSHOT 2) */}
                  {isDragging ? (
                    <div 
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className="absolute inset-4 z-50 bg-[#131b2e]/95 border-2 border-dashed border-blue-500 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4 animate-pulse shadow-[0_0_40px_rgba(59,130,246,0.3)]"
                    >
                      <Paperclip className="w-10 h-10 text-blue-400 animate-bounce" />
                      <h3 className="font-manrope font-extrabold text-2xl text-blue-300">Drop files here</h3>
                      <p className="text-xs text-blue-200/60 font-manrope">PDFs, images, videos, ppts, and audio supported</p>
                    </div>
                  ) : null}

                  {/* TOP DASHED INNER BOX WITH 4 ACTION PILLS */}
                  <div 
                    onDragOver={handleDragOver}
                    className="w-full border border-dashed border-white/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5 bg-[#191a21]/60"
                  >
                    <div className="space-y-1">
                      <h2 className="font-manrope font-bold text-lg sm:text-xl text-white tracking-tight">
                        Upload file(s) or drag & drop it here
                      </h2>
                      <p className="font-manrope text-xs sm:text-sm text-white/50">
                        PDFs, images, videos, ppts, and audio
                      </p>
                    </div>

                    {/* ACTION PILL BUTTONS ROW */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                      {/* 1. Upload Files Pill */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-full bg-[#20212b] hover:bg-[#2a2c39] border border-white/15 text-white font-manrope font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5 text-white/90" />
                        <span>Upload files</span>
                      </button>

                      {/* 2. Drive Pill */}
                      <button
                        type="button"
                        onClick={() => setShowDriveModal(true)}
                        className="px-4 py-2 rounded-full bg-[#20212b] hover:bg-[#2a2c39] border border-white/15 text-white font-manrope font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 87.3 78">
                          <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066da"/>
                          <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3L1.2 51.7c-.8 1.4-1.2 2.95-1.2 4.5h27.5L43.65 25z" fill="#00ac47"/>
                          <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 3.8-6.6c.8-1.4 1.2-2.95 1.2-4.5H55.95l6.4 11.1 11.2 6.05z" fill="#ea4335"/>
                          <path d="M43.65 25L57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2H34.4c-1.6 0-3.15.4-4.5 1.2L43.65 25z" fill="#00832d"/>
                          <path d="M55.95 56.2H27.5L13.75 80c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.4 4.5-1.2L55.95 56.2z" fill="#2684fc"/>
                          <path d="M73.55 25H43.65l13.75 23.8h29.9c0-1.55-.4-3.1-1.2-4.5L76.85 28.3c-.8-1.4-1.95-2.5-3.3-3.3z" fill="#ffba00"/>
                        </svg>
                        <span>Drive</span>
                      </button>

                      {/* 3. Live Record Class Pill */}
                      <button
                        type="button"
                        onClick={() => setShowRecordingModal(true)}
                        className="px-4 py-2 rounded-full bg-[#20212b] hover:bg-[#2a2c39] border border-white/15 text-white font-manrope font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                      >
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                          <Mic className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span>Live Record Class</span>
                      </button>

                      {/* 4. YouTube Pill */}
                      <button
                        type="button"
                        onClick={() => setShowYouTubeModal(true)}
                        className="px-4 py-2 rounded-full bg-[#20212b] hover:bg-[#2a2c39] border border-white/15 text-white font-manrope font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
                      >
                        <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center">
                          <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
                        </div>
                        <span>YouTube</span>
                      </button>
                    </div>
                  </div>

                  {/* Hidden Native File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*,video/*,.ppt,.pptx,audio/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* MAIN CONTAINER CONTENT (NO FILE SELECTED STATE OR SELECTED FILE STATE) */}
                  {!selectedFile && !videoUrl.trim() && !pastedText.trim() ? (
                    <div className="my-8 flex flex-col items-center justify-center text-center space-y-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-14 h-14 rounded-full bg-[#222430] hover:bg-[#2c2e3e] border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
                      >
                        <Plus className="w-7 h-7" />
                      </button>

                      <div className="space-y-1">
                        <h3 className="font-manrope font-bold text-xl text-white tracking-tight">
                          No file(s) selected yet
                        </h3>
                        <p className="font-manrope text-xs text-white/40">
                          Selected files will appear here.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* SELECTED FILE / CONTENT CARD */
                    <div className="my-6 w-full max-w-md bg-[#20222d] border border-purple-500/40 rounded-2xl p-5 flex items-center justify-between shadow-xl">
                      <div className="flex items-center space-x-3.5 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                          {selectedFile ? <FileText className="w-5 h-5" /> : videoUrl ? <Video className="w-5 h-5 text-red-400" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <div className="truncate text-left">
                          <h4 className="font-manrope font-bold text-sm text-white truncate">
                            {selectedFile ? selectedFile.name : videoUrl ? "YouTube Video Link" : "Pasted Study Notes"}
                          </h4>
                          <p className="text-[11px] text-white/50 font-manrope">
                            {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready` : "Ready for AI summarization"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            setVideoUrl("");
                            setPastedText("");
                          }}
                          className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* BOTTOM ACTION BUTTON */}
                  <div className="w-full flex justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedFile || videoUrl.trim() || pastedText.trim()) {
                          handleSummarize();
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      disabled={isProcessing}
                      className="px-8 py-3.5 rounded-full bg-white text-black font-manrope font-black text-sm hover:bg-neutral-200 transition-all cursor-pointer shadow-xl disabled:opacity-50 flex items-center gap-2 active:scale-95"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>Building Full Study Suite...</span>
                        </>
                      ) : (selectedFile || videoUrl.trim() || pastedText.trim()) ? (
                        <>
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span>Summarize Study Suite</span>
                        </>
                      ) : (
                        <span>Select files</span>
                      )}
                    </button>
                  </div>

                </div>

                {/* RIGHT SIDE PANEL: "Turn your files into a full study suite" (MATCHING SCREENSHOT 1) */}
                <div className="lg:col-span-4 bg-[#16171d] border border-[#272832] rounded-3xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-2xl">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-manrope font-bold text-lg text-white tracking-tight leading-snug">
                        Turn your files into a full study suite
                      </h3>
                      <p className="text-xs text-white/50 font-manrope">
                        Hover to preview each resource.
                      </p>
                    </div>

                    {/* RESOURCE ITEM 1: NOTEBOOK */}
                    <div className="group relative bg-[#20222c] border border-white/10 hover:border-blue-500/50 rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer shadow-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="font-manrope font-extrabold text-sm text-white">
                          Notebook
                        </span>
                      </div>
                      <div className="text-white/40 group-hover:text-white transition-colors">
                        <Info className="w-4 h-4" />
                      </div>
                    </div>

                    {/* RESOURCE ITEM 2: FLASHCARDS */}
                    <div className="group relative bg-[#20222c] border border-white/10 hover:border-amber-500/50 rounded-2xl p-4 flex items-center justify-between transition-all cursor-pointer shadow-md">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4" />
                        </div>
                        <span className="font-manrope font-extrabold text-sm text-white">
                          Flashcards
                        </span>
                      </div>
                      <div className="text-white/40 group-hover:text-white transition-colors">
                        <Info className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Small Bottom Info */}
                  <div className="pt-2 text-center">
                    <p className="text-[11px] text-white/35 font-manrope">
                      Powered by AP Lab AI Study Engine
                    </p>
                  </div>
                </div>

              </div>

              {/* FOOTER DISCLAIMER NOTE (MATCHING SCREENSHOT 1) */}
              <div className="text-center pt-4">
                <p className="text-xs text-white/40 font-manrope leading-relaxed max-w-2xl mx-auto">
                  By uploading your file to AP Lab, you acknowledge that you agree to AP Lab&apos;s{" "}
                  <Link href="/terms" className="underline hover:text-white">Terms of Service</Link> &{" "}
                  <Link href="/privacy" className="underline hover:text-white">Community Guidelines</Link>. Please be sure not to violate others&apos; copyright or privacy rights.
                </p>
              </div>
            </div>
          ) : (
            /* ── PROCESSED SUMMARY & FLASHCARDS RESULT VIEW ── */
            <div className="space-y-6">
              {/* Header & Back Button */}
              <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="font-manrope font-black text-2xl sm:text-3xl text-white">{result.title}</h2>
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
                <div className="space-y-6 bg-[#16171d] border border-[#272832] rounded-3xl p-8 shadow-2xl">
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
                <div className="space-y-6 bg-[#16171d] border border-[#272832] rounded-3xl p-8 shadow-2xl">
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
                    className="w-full max-w-xl h-80 bg-[#1e202c] border border-purple-500/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl cursor-pointer relative transition-all duration-300 hover:border-purple-500 select-none"
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
                <div className="space-y-6 bg-[#16171d] border border-[#272832] rounded-3xl p-8 shadow-2xl">
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

      {/* ── MODAL 1: GOOGLE DRIVE IMPORT POPUP ── */}
      <AnimatePresence>
        {showDriveModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1e1f28] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowDriveModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8" viewBox="0 0 87.3 78">
                  <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5l5.4 9.35z" fill="#0066da"/>
                  <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3L1.2 51.7c-.8 1.4-1.2 2.95-1.2 4.5h27.5L43.65 25z" fill="#00ac47"/>
                  <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 3.8-6.6c.8-1.4 1.2-2.95 1.2-4.5H55.95l6.4 11.1 11.2 6.05z" fill="#ea4335"/>
                  <path d="M43.65 25L57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2H34.4c-1.6 0-3.15.4-4.5 1.2L43.65 25z" fill="#00832d"/>
                  <path d="M55.95 56.2H27.5L13.75 80c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.4 4.5-1.2L55.95 56.2z" fill="#2684fc"/>
                  <path d="M73.55 25H43.65l13.75 23.8h29.9c0-1.55-.4-3.1-1.2-4.5L76.85 28.3c-.8-1.4-1.95-2.5-3.3-3.3z" fill="#ffba00"/>
                </svg>
                <h3 className="font-manrope font-extrabold text-xl text-white">Google Drive Integration</h3>
              </div>

              <p className="text-xs text-white/60 font-manrope leading-relaxed">
                Connect your Google account to import Docs, Slides, and PDFs directly from your Google Drive storage.
              </p>

              {/* Sample Google Drive Files List */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-manrope font-bold text-white/40 uppercase tracking-wider block">Available Drive Files</span>
                {[
                  { name: "AP_Biology_Unit_3_Cellular_Energetics.gdoc", size: "1.4 MB" },
                  { name: "AP_Physics_Kinematics_Lecture.gslides", size: "3.2 MB" },
                  { name: "AP_US_History_DBQ_Rubric_Guide.pdf", size: "2.1 MB" },
                ].map((df, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const sampleFile = new File(["Google Drive Document Content"], df.name, { type: "application/pdf" });
                      setSelectedFile(sampleFile);
                      setShowDriveModal(false);
                    }}
                    className="w-full p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-left flex items-center justify-between transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-xs font-manrope font-semibold text-white truncate">{df.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40">{df.size}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowDriveModal(false)}
                className="w-full py-3 rounded-full bg-white text-black font-manrope font-extrabold text-xs hover:bg-neutral-200 transition-all cursor-pointer shadow-lg"
              >
                Connect Google Account
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 2: LIVE RECORD CLASS POPUP WITH AUDIO METER & PANDA TV IMAGE ── */}
      <AnimatePresence>
        {showRecordingModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1e1f28] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
            >
              <button
                type="button"
                onClick={() => {
                  if (isRecording) stopRecording();
                  setShowRecordingModal(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* LEFT COLUMN: CONTROLS & AUDIO METER */}
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-manrope font-black text-2xl text-white">Live Record Class</h3>
                    <p className="text-xs text-white/50 font-manrope">
                      Record live lecture audio directly from your device microphone.
                    </p>
                  </div>

                  {/* REAL-TIME AUDIO LEVEL SPECTRUM METER */}
                  <div className="bg-[#14151e] border border-white/10 rounded-2xl p-5 space-y-3 text-center">
                    <span className="text-[11px] font-manrope font-extrabold text-white/60 uppercase tracking-widest block">
                      {isRecording ? `Recording • ${formatTimer(recordingSeconds)}` : "Microphone Input Level"}
                    </span>

                    {/* Audio Level Bars (Color coded: Grey=Silent, Red=Low, Yellow=Medium, Green=Loud & Clear) */}
                    <div className="h-16 flex items-end justify-center gap-1.5 px-4 py-2 bg-black/40 rounded-xl border border-white/5">
                      {getMeterBars().map((bar, i) => (
                        <div
                          key={i}
                          className={cn("w-2.5 rounded-full transition-all duration-75", bar.color)}
                          style={{ height: bar.height }}
                        />
                      ))}
                    </div>

                    <p className="text-[11px] font-manrope text-white/40">
                      {audioVolume <= 2 ? "No audio detected" : audioVolume <= 25 ? "Low audio volume" : audioVolume <= 60 ? "Medium volume" : "Loud & clear audio!"}
                    </p>
                  </div>

                  {recordingError && (
                    <p className="text-xs text-red-400 font-manrope bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                      {recordingError}
                    </p>
                  )}

                  {/* Record Buttons */}
                  <div className="flex flex-col space-y-2">
                    {isRecording ? (
                      <button
                        type="button"
                        onClick={() => {
                          stopRecording();
                          setShowRecordingModal(false);
                        }}
                        className="w-full py-3 rounded-full bg-red-600 hover:bg-red-500 text-white font-manrope font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        <Square className="w-4 h-4 fill-white" />
                        <span>Stop & Summarize Class</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="w-full py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-manrope font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Start Recording</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: PANDA SITTING ON BEAN BAG WATCHING TV (input_file_2.png) */}
                <div className="flex flex-col items-center justify-center p-2 relative">
                  <div className="relative w-full max-w-[240px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src="/images/panda-tv.png"
                      alt="Panda Mascot Watching TV"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-white/40 font-manrope mt-3 text-center">
                    Sit back while AP Lab records & summarizes your lecture!
                  </p>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL 3: YOUTUBE URL POPUP (MATCHING SCREENSHOT 4) ── */}
      <AnimatePresence>
        {showYouTubeModal && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1e1f26] border border-white/15 rounded-3xl p-6 sm:p-7 max-w-lg w-full space-y-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowYouTubeModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="font-manrope font-black text-2xl text-white">YouTube URLs</h3>
                <p className="text-xs text-white/50 font-manrope">Paste an educational YouTube video link to summarize.</p>
              </div>

              {/* YouTube URL Text Input (Matching screenshot 4) */}
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Paste a YouTube link"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-[#121319] border border-white/15 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-500 font-manrope pr-10"
                  />
                  {videoUrl && (
                    <button
                      type="button"
                      onClick={() => setVideoUrl("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-white/40 font-manrope">
                  Paste YouTube link (e.g. https://youtube.com/watch?v=...)
                </p>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowYouTubeModal(false)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-manrope font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (videoUrl.trim()) {
                      setShowYouTubeModal(false);
                      handleSummarize();
                    }
                  }}
                  disabled={!videoUrl.trim()}
                  className="px-7 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-manrope font-black text-xs disabled:opacity-40 transition-all cursor-pointer shadow-lg"
                >
                  Summarize Video
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
