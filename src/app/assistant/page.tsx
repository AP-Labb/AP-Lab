"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Paperclip, ArrowUp, RefreshCw, Activity,
  Home, LayoutDashboard, BarChart2, Star, Award, Settings, LogOut,
  LineChart, Code2, Layers, Cpu, Compass, BookOpen, ChevronDown, ShoppingBag
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { getLevelForXp } from "@/lib/xpProgression";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { ReviewModal } from "@/components/ReviewModal";
import { SettingsModal } from "@/components/SettingsModal";
import { FloatingXPOperations } from "@/components/FloatingXPOperations";
import { DashboardContextMenu } from "@/components/DashboardContextMenu";
import { AccountNavbarWidget } from "@/components/AccountNavbarWidget";
import { InstagramLikeStar } from "@/components/InstagramLikeStar";
import MeshDriftShader from "@/components/MeshDriftShader";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const CAPABILITY_BADGES = [
  { label: "Draw a Graph", icon: LineChart },
  { label: "Write Code", icon: Code2 },
  { label: "Create a Timeline", icon: Layers },
  { label: "Solve Physics & Chem", icon: Cpu },
  { label: "Explain Concepts", icon: BookOpen },
];

function HoldSignOutButton({ onConfirm }: { onConfirm: () => void }) {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const animRef = useRef<number | null>(null);

  const startHold = () => {
    setHolding(true);
    let start = performance.now();
    const duration = 3000;
    const animate = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setHolding(false);
        setProgress(0);
        onConfirm();
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  const stopHold = () => {
    setHolding(false);
    setProgress(0);
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={stopHold}
      onMouseLeave={stopHold}
      onTouchStart={startHold}
      onTouchEnd={stopHold}
      className="relative flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl transition-all duration-200 text-red-400 bg-red-500/10 hover:bg-red-500/20 overflow-hidden font-manrope font-semibold text-xs select-none cursor-pointer border border-red-500/20"
    >
      <div
        className="absolute left-0 top-0 bottom-0 bg-red-500/40 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
      <LogOut className="w-4 h-4 relative z-10" />
      <span className="relative z-10">
        {progress > 5 ? `Hold... ${Math.round(progress)}%` : "Hold to Sign Out"}
      </span>
    </button>
  );
}

function SidebarSettingsButton({ open }: { open: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full"
        whileHover="hover"
        initial="rest"
      >
        <motion.div
          className="flex-shrink-0"
          variants={{
            rest: { rotate: 0 },
            hover: { rotate: 90 },
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Settings className="w-5 h-5" />
        </motion.div>
        <motion.span
          animate={{ display: open ? "inline-block" : "none", opacity: open ? 1 : 0 }}
          transition={{ duration: 0.15 }}
          className="text-sm font-manrope font-semibold whitespace-pre"
        >
          Settings
        </motion.span>
      </motion.button>
      {isOpen && <SettingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}

export default function AssistantPage() {
  useEffect(() => {
    document.title = "Assistant | AP Lab";
  }, []);
  const { currentUser } = useAuth();
  const { progress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstResponse = useRef(true);

  const xp = progress?.xp || 0;
  const level = getLevelForXp(xp);
  const firstName = currentUser?.displayName?.split(" ")[0] || "Scholar";

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (e) {
      console.error("Sign out error:", e);
    }
  };

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsAtBottom(distFromBottom < 80);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = textToSend || input;
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: apiMessages,
          isFirstMessage: isFirstResponse.current,
          userName: firstName
        })
      });

      const data = await res.json();
      isFirstResponse.current = false;

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `⚠️ **Error:** ${err.message || "Something went wrong. Please check your connection and try again."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060712] text-white flex flex-row relative z-0 transition-all duration-500 selection:bg-neutral-800 selection:text-white overflow-x-clip">
      {/* WebGL Mesh Drift Shader Background */}
      <MeshDriftShader />
      {/* Standardized Sticky App Sidebar */}
      <AppSidebar currentPath="/assistant" />

      {/* ===== MAIN WORKSPACE ===== */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 flex flex-col min-h-screen overflow-y-auto relative bg-[#0b0c10] md:pl-16"
      >
        <UniversalTopHeader />
        {messages.length === 0 ? (
          /* ── INITIAL LANDING: vertically + horizontally centered ── */
          <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 pb-10">

            {/* Welcome heading */}
            <motion.h1
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="font-manrope font-bold text-3xl sm:text-4xl text-white tracking-tight text-center mb-10"
            >
              What do you need help with, {firstName}?
            </motion.h1>

            {/* Input card + panda — all in a single centered flex column */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl flex flex-col items-center"
            >
              {/* Panda peeking from behind card — flex-centered, overlaps card via -mb */}
              <div className="w-44 h-44 pointer-events-none select-none z-0 -mb-14">
                <img
                  src="/images/panda-ai.png"
                  alt="Peeking Panda"
                  className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
                />
              </div>

              {/* Card — sits in FRONT of panda (z-10) */}
              <div className="relative z-10 w-full bg-[#14161f] border border-white/10 rounded-2xl p-3 flex flex-col justify-between min-h-[110px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] focus-within:border-white/25 transition-all">

                {/* Left Paw */}
                <div className="absolute -left-5 top-7 pointer-events-none select-none z-20">
                  <svg width="22" height="34" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 6C22 6 16 2 10 5C4 8 2 15 2 20C2 25 5 30 11 30C17 30 22 24 22 24V6Z" fill="white" stroke="#1a1c2e" strokeWidth="2" strokeLinejoin="round"/>
                    <circle cx="7" cy="12" r="2" fill="#1a1c2e"/>
                    <circle cx="7" cy="18" r="2" fill="#1a1c2e"/>
                    <circle cx="10" cy="24" r="2" fill="#1a1c2e"/>
                  </svg>
                </div>

                {/* Right Paw */}
                <div className="absolute -right-5 top-7 pointer-events-none select-none z-20 scale-x-[-1]">
                  <svg width="22" height="34" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 6C22 6 16 2 10 5C4 8 2 15 2 20C2 25 5 30 11 30C17 30 22 24 22 24V6Z" fill="white" stroke="#1a1c2e" strokeWidth="2" strokeLinejoin="round"/>
                    <circle cx="7" cy="12" r="2" fill="#1a1c2e"/>
                    <circle cx="7" cy="18" r="2" fill="#1a1c2e"/>
                    <circle cx="10" cy="24" r="2" fill="#1a1c2e"/>
                  </svg>
                </div>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Panda AI a question..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none px-2 pt-1 font-inter min-h-[60px]"
                />

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <button type="button" className="p-1.5 text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/[0.05]" title="Attach file (Coming Soon)">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Capability Badges */}
              <div className="flex items-center justify-center flex-wrap gap-2 pt-5 select-none">
                {CAPABILITY_BADGES.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14161f]/80 border border-white/[0.08] text-white/50 text-xs font-manrope font-medium">
                      <Icon className="w-3.5 h-3.5 text-white/40" />
                      <span>{b.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        ) : (
          /* ── CHAT MODE: scrollable messages + sticky bottom input ── */
          <div className="flex flex-col min-h-screen">

            {/* Messages list */}
            <div className="flex-1 w-full max-w-3xl mx-auto px-6 pt-10 pb-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className="text-[10px] font-mono text-white/30 mb-1 px-1">
                    {msg.role === "user" ? "You" : "Panda AI 🐼"}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[90%] ${
                    msg.role === "user"
                      ? "bg-white/10 text-white rounded-tr-none font-inter"
                      : "bg-[#141622] border border-white/10 text-white/90 rounded-tl-none font-inter shadow-lg"
                  }`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                      components={{
                        code({ node, inline, className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline ? (
                            <div className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#080910]">
                              <div className="px-4 py-1.5 bg-white/[0.04] border-b border-white/10 text-xs font-mono text-white/50">
                                {match ? match[1] : 'code'}
                              </div>
                              <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-300">
                                <code {...props}>{children}</code>
                              </pre>
                            </div>
                          ) : (
                            <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs text-emerald-300" {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {/* Skeleton loading */}
              {isLoading && (
                <div className="flex flex-col items-start w-full max-w-[85%] space-y-2">
                  <div className="text-[10px] font-mono text-white/30 px-1">Panda AI 🐼</div>
                  <div className="p-5 rounded-2xl bg-[#141622] border border-white/10 w-full space-y-3 shadow-lg">
                    <div className="h-3.5 bg-white/10 rounded-md w-3/4 animate-pulse" />
                    <div className="h-3.5 bg-white/[0.07] rounded-md w-full animate-pulse" style={{animationDelay:'0.15s'}} />
                    <div className="h-3.5 bg-white/10 rounded-md w-5/6 animate-pulse" style={{animationDelay:'0.3s'}} />
                    <div className="h-3.5 bg-white/[0.05] rounded-md w-1/2 animate-pulse" style={{animationDelay:'0.45s'}} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Sticky bottom input */}
            <div className="sticky bottom-0 w-full bg-gradient-to-t from-[#0b0c10] via-[#0b0c10]/95 to-transparent pt-6 pb-8 px-6">
              <div className="w-full max-w-3xl mx-auto relative z-10 bg-[#14161f] border border-white/10 rounded-2xl p-3 flex flex-col justify-between min-h-[90px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] focus-within:border-white/25 transition-all">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Panda AI a question..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none px-2 pt-1 font-inter min-h-[46px]"
                />
                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <button type="button" className="p-1.5 text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/[0.05]" title="Attach file (Coming Soon)">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="w-7 h-7 rounded-lg bg-white/15 hover:bg-white/25 text-white flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scroll-to-bottom floating button */}
      <AnimatePresence>
        {messages.length > 0 && !isAtBottom && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={scrollToBottom}
            className="fixed bottom-32 left-[52%] -translate-x-1/2 z-50 w-10 h-10 rounded-full bg-[#181a26]/90 border border-white/20 backdrop-blur-md flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white hover:border-white/40 transition-all shadow-[0_8px_25px_rgba(0,0,0,0.6)] cursor-pointer group"
            title="Return to bottom"
          >
            <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>



      {/* Modals */}
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      <FloatingXPOperations externalOpen={showQuestsModal} onClose={() => setShowQuestsModal(false)} />
      <DashboardContextMenu onOpenProfile={() => setShowAccountPopup(true)} />
    </div>
  );
}
