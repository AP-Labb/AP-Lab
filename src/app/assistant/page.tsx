"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Paperclip, ArrowUp, RefreshCw, Activity,
  Home, LayoutDashboard, BarChart2, Star, Award, Settings, LogOut,
  LineChart, Code2, Layers, Cpu, Compass, BookOpen
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
import { ReviewModal } from "@/components/ReviewModal";
import { SettingsModal } from "@/components/SettingsModal";
import { FloatingXPOperations } from "@/components/FloatingXPOperations";
import { DashboardContextMenu } from "@/components/DashboardContextMenu";
import { AccountNavbarWidget } from "@/components/AccountNavbarWidget";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await res.json();

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
    <div className="min-h-screen bg-[#060712] text-white flex flex-row relative z-0 overflow-x-hidden transition-all duration-500 selection:bg-neutral-800 selection:text-white">
      {/* ===== IDENTICAL DASHBOARD SIDEBAR (z-50) ===== */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between gap-10 z-50">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* Logo */}
            <Link
              href="/"
              className="font-normal flex items-center space-x-2.5 text-[#f5f5f5] text-sm py-1.5 px-2 relative z-20 hover:opacity-90 transition-opacity group"
            >
              <motion.div
                className="flex-shrink-0"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Activity className="w-5 h-5 text-white flex-shrink-0 group-hover:text-white/80 transition-colors" />
              </motion.div>
              <motion.span
                animate={{
                  display: sidebarOpen ? "inline-block" : "none",
                  opacity: sidebarOpen ? 1 : 0,
                }}
                transition={{ duration: 0.15 }}
                className="font-manrope font-bold text-white tracking-tight whitespace-pre text-sm"
              >
                AP Lab
              </motion.span>
            </Link>

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mb-4 mx-2" />

            {/* Nav Links with animated icons */}
            <div className="flex flex-col gap-1">
              {/* Home */}
              <motion.div whileHover="hover" initial="rest">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
                  <motion.div
                    className="flex-shrink-0"
                    variants={{
                      rest: { y: 0, scale: 1 },
                      hover: { y: -3, scale: 1.1 },
                    }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Home className="w-5 h-5" />
                  </motion.div>
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-semibold whitespace-pre"
                  >
                    Home
                  </motion.span>
                </Link>
              </motion.div>

              {/* Dashboard */}
              <motion.div whileHover="hover" initial="rest">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
                  <motion.div
                    className="flex-shrink-0"
                    variants={{
                      rest: { scale: 1, rotate: 0 },
                      hover: { scale: 1.15, rotate: 8 },
                    }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </motion.div>
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-semibold whitespace-pre"
                  >
                    Dashboard
                  </motion.span>
                </Link>
              </motion.div>

              {/* Progress */}
              <motion.div whileHover="hover" initial="rest">
                <Link
                  href="/dashboard/progress"
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
                  <div className="w-5 h-5 flex-shrink-0 flex items-end gap-[2px]">
                    {[
                      { height: "40%", delay: 0 },
                      { height: "70%", delay: 0.05 },
                      { height: "55%", delay: 0.1 },
                      { height: "90%", delay: 0.15 },
                    ].map((bar, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-sm bg-current"
                        style={{ height: bar.height }}
                        variants={{
                          rest: { scaleY: 1, originY: 1 },
                          hover: { scaleY: [1, 1.5, 1.2, 1.35, 1], originY: 1 },
                        }}
                        transition={{ duration: 0.5, delay: bar.delay, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-semibold whitespace-pre"
                  >
                    Progress
                  </motion.span>
                </Link>
              </motion.div>

              {/* Review */}
              <motion.button
                onClick={() => setIsReviewModalOpen(true)}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full"
                whileHover="hover"
                initial="rest"
              >
                <div className="flex-shrink-0 relative w-5 h-5">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <motion.div
                      key={angle}
                      className="absolute rounded-full bg-yellow-300"
                      style={{
                        width: "1.5px",
                        height: "5px",
                        top: "50%",
                        left: "50%",
                        transformOrigin: "center bottom",
                        transform: `rotate(${angle}deg) translateX(-50%) translateY(-140%)`,
                      }}
                      variants={{
                        rest: { opacity: 0, scaleY: 0.3, translateY: 0 },
                        hover: {
                          opacity: [0, 0.9, 0],
                          scaleY: [0.3, 1.2, 0.8],
                          translateY: [0, -4, -6],
                        },
                      }}
                      transition={{ duration: 0.5, delay: i * 0.03, ease: "easeOut" }}
                    />
                  ))}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    variants={{
                      rest: { scale: 1 },
                      hover: { scale: 1.2 },
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <Star className="w-4 h-4" />
                  </motion.div>
                </div>
                <motion.span
                  animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-manrope font-semibold whitespace-pre"
                >
                  Review
                </motion.span>
              </motion.button>

              {/* Quests */}
              <motion.button
                onClick={() => setShowQuestsModal(true)}
                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white w-full"
                whileHover="hover"
                initial="rest"
              >
                <motion.div
                  className="flex-shrink-0"
                  variants={{
                    rest: { scale: 1, rotate: 0 },
                    hover: { scale: 1.18, rotate: -8 },
                  }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Award className="w-5 h-5" />
                </motion.div>
                <motion.span
                  animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-sm font-manrope font-semibold whitespace-pre"
                >
                  Quests
                </motion.span>
              </motion.button>

              {/* AI Assistant (Active Page) */}
              <Link href="/assistant" className="w-full">
                <motion.div
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 bg-white/10 text-white w-full group cursor-pointer"
                  whileHover="hover"
                  initial="rest"
                >
                  <motion.div
                    className="w-5 h-5 shrink-0 flex items-center justify-center"
                    variants={{
                      rest: { scale: 1, rotate: 0, y: 0 },
                      hover: { scale: 1.25, rotate: [0, -10, 10, -5, 0], y: -1 },
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <img src="/images/panda-ai.png" alt="Panda AI" className="w-full h-full object-contain" />
                  </motion.div>
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-bold whitespace-pre"
                  >
                    AI Assistant
                  </motion.span>
                </motion.div>
              </Link>

              {/* Settings */}
              <SidebarSettingsButton open={sidebarOpen} />
            </div>
          </div>

          {/* Bottom: Profile Widget + Sign Out (pb-24 to clear bottom blur) */}
          <div className="flex flex-col gap-2 pb-24">
            <div className="h-px bg-white/[0.06] mx-2 mb-2" />

            <button
              onClick={() => setShowAccountPopup(true)}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-xl transition-all duration-200 text-white/60 hover:bg-white/[0.05] hover:text-white"
            >
              <div className="flex-shrink-0">
                {progress?.photoURL || currentUser?.photoURL ? (
                  <img
                    src={progress?.photoURL || currentUser?.photoURL || ""}
                    alt="Avatar"
                    className="w-7 h-7 rounded-full object-cover border border-white/20 flex-shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-black bg-gradient-to-br from-cyan-400 to-white flex-shrink-0">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-start text-left overflow-hidden"
                  >
                    <span className="font-manrope font-extrabold text-xs text-white tracking-tight leading-none truncate max-w-[120px]">
                      {progress?.displayName || currentUser?.displayName || "Scholar"}
                    </span>
                    <span className="font-mono font-bold text-[9px] text-white/40 tracking-wider mt-0.5 whitespace-nowrap">
                      Lvl {level} • {xp.toLocaleString()} XP
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <motion.button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-2 py-2.5 rounded-xl transition-all duration-200 text-white/30 hover:bg-red-500/10 hover:text-red-400"
              whileHover="hover"
              initial="rest"
            >
              <motion.div
                className="flex-shrink-0"
                variants={{
                  rest: { x: 0 },
                  hover: { x: 3 },
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <LogOut className="w-5 h-5" />
              </motion.div>
              <motion.span
                animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                className="font-manrope font-semibold text-sm whitespace-pre"
              >
                Sign Out
              </motion.span>
            </motion.button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* ===== MAIN WORKSPACE (CENTERED VERTICALLY WITH PEEKING PANDA) ===== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#0b0c10]">
        
        {/* Messages / Hero Container - Centered Vertically */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 flex flex-col items-center justify-center">
          <div className="max-w-3xl w-full flex flex-col items-center justify-center my-auto py-6">
            
            {/* Header Title */}
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-manrope font-bold text-3xl sm:text-4xl text-white tracking-tight text-center mb-8"
            >
              What do you need help with, {firstName}?
            </motion.h1>

            {/* Chat Messages Stream (If messages exist) */}
            {messages.length > 0 && (
              <div className="w-full space-y-6 mb-6 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className="text-[10px] font-mono text-white/30 mb-1 px-1">
                      {msg.role === "user" ? "You" : "Panda AI"}
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

                {isLoading && (
                  <div className="flex flex-col items-start">
                    <div className="text-[10px] font-mono text-white/30 mb-1 px-1">Panda AI</div>
                    <div className="p-4 rounded-2xl bg-[#141622] border border-white/10 text-white/50 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white/40 animate-ping" />
                      Panda is thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input Box Card with Peeking Panda & Grabbing Paws */}
            <div className="w-full relative pt-20">
              
              {/* Larger Panda Head Peeking from Behind top edge of message box */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none select-none z-0">
                <img 
                  src="/images/panda-ai.png" 
                  alt="Peeking Panda" 
                  className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
                />
              </div>

              {/* Input Box Wrapper */}
              <div className="relative z-10 bg-[#14161f] border border-white/10 rounded-2xl p-3 flex flex-col justify-between min-h-[110px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] focus-within:border-white/25 transition-all">
                
                {/* Left Paw Grabbing Box Edge */}
                <div className="absolute -left-3 top-12 pointer-events-none select-none z-20">
                  <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 6C22 6 16 2 10 5C4 8 2 15 2 20C2 25 5 30 11 30C17 30 22 24 22 24V6Z" fill="white" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round"/>
                    <circle cx="7" cy="12" r="2" fill="black"/>
                    <circle cx="7" cy="18" r="2" fill="black"/>
                    <circle cx="10" cy="24" r="2" fill="black"/>
                  </svg>
                </div>

                {/* Right Paw Grabbing Box Edge */}
                <div className="absolute -right-3 top-12 pointer-events-none select-none z-20 transform scale-x-[-1]">
                  <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 6C22 6 16 2 10 5C4 8 2 15 2 20C2 25 5 30 11 30C17 30 22 24 22 24V6Z" fill="white" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round"/>
                    <circle cx="7" cy="12" r="2" fill="black"/>
                    <circle cx="7" cy="18" r="2" fill="black"/>
                    <circle cx="10" cy="24" r="2" fill="black"/>
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
                  <button
                    type="button"
                    className="p-1.5 text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/[0.05]"
                    title="Attach file (Coming Soon)"
                  >
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

              {/* Non-clickable Capability Badges */}
              <div className="flex items-center justify-center flex-wrap gap-2 pt-4 select-none">
                {CAPABILITY_BADGES.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#14161f]/80 border border-white/[0.08] text-white/50 text-xs font-manrope font-medium"
                    >
                      <Icon className="w-3.5 h-3.5 text-white/40" />
                      <span>{b.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Blur Overlay for Page Footer Aesthetics */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#060712] via-[#060712]/80 to-transparent pointer-events-none z-40 backdrop-blur-[2px]" />

      {/* Modals */}
      <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      <FloatingXPOperations externalOpen={showQuestsModal} onClose={() => setShowQuestsModal(false)} />
      <DashboardContextMenu onOpenProfile={() => setShowAccountPopup(true)} />
    </div>
  );
}
