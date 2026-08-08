"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Paperclip, ArrowUp, RefreshCw, Activity,
  LineChart, Code2, Layers, Cpu, BookOpen, Settings, LogOut,
  ChevronsLeft, ChevronsRight, Plus, SquarePen, Search, Trash2, MessageSquare
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { getLevelForXp } from "@/lib/xpProgression";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { AppSidebar } from "@/components/AppSidebar";
import { SettingsModal } from "@/components/SettingsModal";
import { UserDisplayName } from "@/components/UserDisplayName";
import MeshDriftShader from "@/components/MeshDriftShader";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

const CAPABILITY_BADGES = [
  { label: "Draw a Graph", icon: LineChart },
  { label: "Write Code", icon: Code2 },
  { label: "Create a Timeline", icon: Layers },
  { label: "Solve Physics & Chem", icon: Cpu },
  { label: "Explain Concepts", icon: BookOpen },
];

export default function AssistantPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatIdParam = searchParams.get("chatId");

  const { currentUser } = useAuth();
  const { progress } = useProgress();

  const [showChatHistory, setShowChatHistory] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(chatIdParam);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstResponse = useRef(true);

  const firstName = currentUser?.displayName?.split(" ")[0] || "Scholar";

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    document.title = "AI Assistant | AP Lab";
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ap-lab-ai-chats");
        if (saved) {
          const parsed: ChatSession[] = JSON.parse(saved);
          setChatSessions(parsed);

          if (chatIdParam) {
            const found = parsed.find(c => c.id === chatIdParam);
            if (found) {
              setMessages(found.messages);
              setActiveChatId(found.id);
            }
          }
        }
      } catch (e) {}
    }
  }, [chatIdParam]);

  // Save active chat to localStorage whenever messages update
  const saveChatSession = (id: string, newMessages: Message[]) => {
    if (typeof window === "undefined" || newMessages.length === 0) return;
    try {
      const firstUserMsg = newMessages.find(m => m.role === "user")?.content || "New Chat";
      const title = firstUserMsg.slice(0, 30) + (firstUserMsg.length > 30 ? "..." : "");
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setChatSessions(prev => {
        const existingIdx = prev.findIndex(c => c.id === id);
        let updated: ChatSession[];
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            title: updated[existingIdx].title || title,
            messages: newMessages,
            timestamp: timeStr,
          };
        } else {
          updated = [{ id, title, timestamp: timeStr, messages: newMessages }, ...prev];
        }
        localStorage.setItem("ap-lab-ai-chats", JSON.stringify(updated));
        return updated;
      });
    } catch (e) {}
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setActiveChatId(null);
    isFirstResponse.current = true;
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", "/dashboard/assistant");
    }
  };

  const loadChat = (session: ChatSession) => {
    setMessages(session.messages);
    setActiveChatId(session.id);
    isFirstResponse.current = false;
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/dashboard/assistant?chatId=${session.id}`);
    }
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChatSessions(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("ap-lab-ai-chats", JSON.stringify(filtered));
      }
      return filtered;
    });
    if (activeChatId === id) {
      startNewChat();
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

    // Generate chatId if new chat
    let chatId = activeChatId;
    if (!chatId) {
      chatId = "chat_" + Date.now();
      setActiveChatId(chatId);
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `/dashboard/assistant?chatId=${chatId}`);
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    saveChatSession(chatId, newMessages);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({
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

      if (data.error) throw new Error(data.error);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "I'm sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...newMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatSession(chatId, finalMessages);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ **Error:** ${err.message || "Something went wrong. Please check your connection and try again."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
      saveChatSession(chatId, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChatSessions = chatSessions.filter(c =>
    c.title.toLowerCase().includes(chatSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060712] text-white flex flex-row relative z-0 selection:bg-neutral-800 selection:text-white overflow-hidden">
      {/* WebGL Mesh Drift Shader Background */}
      <MeshDriftShader />

      {/* App Sidebar */}
      <AppSidebar currentPath="/dashboard/assistant" />

      {/* ===== COLLAPSABLE CHAT HISTORY DRAWER ===== */}
      <AnimatePresence>
        {showChatHistory && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex flex-col h-screen bg-[#090b14] border-r border-white/10 z-20 shrink-0 ml-16 overflow-hidden"
          >
            {/* History Drawer Header */}
            <div className="p-4 space-y-3 border-b border-white/[0.08]">
              <div className="flex items-center justify-between">
                <h2 className="font-manrope font-black text-base text-white tracking-tight">Chat History</h2>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Chats"
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 font-manrope"
                />
              </div>
            </div>

            {/* Chat History Sessions List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
              {filteredChatSessions.length === 0 ? (
                <div className="text-center py-10 text-white/30 text-xs font-manrope">
                  No past chats found
                </div>
              ) : (
                filteredChatSessions.map((session) => {
                  const isActive = activeChatId === session.id;
                  return (
                    <div
                      key={session.id}
                      onClick={() => loadChat(session)}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer group",
                        isActive
                          ? "bg-white/15 border-white/25 text-white shadow-md"
                          : "bg-white/[0.03] border-white/5 hover:bg-white/[0.08] text-white/70 hover:text-white"
                      )}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        {/* CHAT BUBBLE ICON - Direct Large Image without Square Container */}
                        <img src="/images/chat_bubble_icon.png" alt="Chat" className="w-10 h-10 object-contain shrink-0" />
                        <span className="font-manrope font-bold text-xs truncate max-w-[150px]">
                          {session.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => deleteChat(session.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                        title="Delete Chat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN CHAT WORKSPACE ===== */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 flex flex-col h-screen overflow-y-auto relative bg-[#0b0c10] md:pl-0"
      >
        {/* TOP ACTION BAR: Always-Visible Expand/Collapse Button (Shifted right for 100% clickability) */}
        <div className={cn(
          "sticky top-0 z-50 flex items-center justify-between py-4 pr-6 bg-[#0b0c10]/80 backdrop-blur-xl border-none transition-[padding] duration-200",
          showChatHistory ? "pl-6" : "pl-20 md:pl-24"
        )}>
          {/* Top Left Toggle Drawer Button */}
          <button
            type="button"
            onClick={() => setShowChatHistory(!showChatHistory)}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg z-50 shrink-0"
            title={showChatHistory ? "Collapse History" : "Expand History"}
          >
            {showChatHistory ? (
              <ChevronsLeft className="w-5 h-5 text-white" />
            ) : (
              <ChevronsRight className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Top Right New Chat Button */}
          <button
            type="button"
            onClick={startNewChat}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg shrink-0"
            title="New Chat"
          >
            <SquarePen className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* WORKSPACE CONTENT */}
        {messages.length === 0 ? (
          /* ── INITIAL LANDING ── */
          <div className="flex flex-col items-center justify-center flex-1 w-full px-6 pb-12 my-auto">
            {/* Welcome heading (NO Yellow Underline!) */}
            <motion.h1
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="font-manrope font-extrabold text-3xl sm:text-4xl text-white tracking-tight text-center mb-8"
            >
              What do you need help with today,{" "}
              <span 
                style={{ color: (progress?.activeNameColor && progress.activeNameColor !== "#ffffff") ? progress.activeNameColor : undefined }}
              >
                {progress?.displayName || currentUser?.displayName?.split(" ")[0] || "Scholar"}
              </span>?
            </motion.h1>

            {/* Input card + panda */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl flex flex-col items-center"
            >
              {/* Peeking Panda (10% Larger Head) */}
              <div className="w-44 h-44 pointer-events-none select-none z-0 -mb-14">
                <img
                  src="/images/panda-ai.png"
                  alt="Peeking Panda"
                  className="w-full h-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
                />
              </div>

              {/* Card with Anatomical Reaching Panda Paws Holding onto Top Edge */}
              <div className="relative z-10 w-full bg-[#14161f] border border-white/10 rounded-2xl p-4 flex flex-col justify-between min-h-[120px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] focus-within:border-white/25 transition-all">
                {/* Left Reaching Panda Paw */}
                <div className="absolute -left-3.5 -top-3.5 w-10 h-8 rounded-[40%_60%_70%_30%] bg-white border-2 border-neutral-300 flex flex-col items-center justify-center p-1 shadow-lg transform -rotate-[35deg] pointer-events-none select-none z-20">
                  <div className="w-3.5 h-2.5 bg-black rounded-full mb-0.5" />
                  <div className="flex space-x-0.5">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
                </div>

                {/* Right Reaching Panda Paw */}
                <div className="absolute -right-3.5 -top-3.5 w-10 h-8 rounded-[60%_40%_30%_70%] bg-white border-2 border-neutral-300 flex flex-col items-center justify-center p-1 shadow-lg transform rotate-[35deg] pointer-events-none select-none z-20">
                  <div className="w-3.5 h-2.5 bg-black rounded-full mb-0.5" />
                  <div className="flex space-x-0.5">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                  </div>
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
                  placeholder="Type your question here..."
                  className="w-full bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none px-2 pt-1 font-inter min-h-[60px]"
                />

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <button type="button" className="p-1.5 text-white/40 hover:text-white/80 transition-colors rounded-lg hover:bg-white/[0.05]" title="Attach file">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="w-8 h-8 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer shadow-md"
                  >
                    <ArrowUp className="w-4 h-4 text-black stroke-[3]" />
                  </button>
                </div>
              </div>

              {/* Capability Badges */}
              <div className="flex items-center justify-center flex-wrap gap-2 pt-6 select-none">
                {CAPABILITY_BADGES.map((b, i) => {
                  const Icon = b.icon;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSend(b.label)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#14161f]/80 border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/10 text-xs font-manrope font-medium transition-all cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-white/50" />
                      <span>{b.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        ) : (
          /* ── CHAT MODE: scrollable messages + sticky bottom input ── */
          <div className="flex flex-col flex-1 h-full justify-between">
            <div className="flex-1 w-full max-w-3xl mx-auto px-6 pt-6 pb-28 space-y-6">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-col space-y-1.5",
                    m.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "px-5 py-3.5 rounded-2xl max-w-[85%] text-sm font-manrope leading-relaxed shadow-lg",
                      m.role === "user"
                        ? "bg-white text-black font-semibold rounded-br-none"
                        : "bg-[#14161f] border border-white/10 text-white/90 rounded-bl-none"
                    )}
                  >
                    {m.role === "assistant" ? (
                      <div className="prose prose-invert max-w-none text-sm font-inter">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-white/30 font-mono px-1">{m.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-white/40 text-xs font-manrope italic">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Panda AI is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Floating Input Bar */}
            <div className="sticky bottom-0 z-30 w-full bg-[#0b0c10]/90 backdrop-blur-xl border-t border-white/[0.08] p-4">
              <div className="max-w-3xl mx-auto flex items-center gap-3 bg-[#14161f] border border-white/10 rounded-2xl p-2.5 shadow-2xl">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask Panda AI..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/30 focus:outline-none resize-none px-2 font-inter max-h-24"
                  rows={1}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center disabled:opacity-20 transition-all cursor-pointer shrink-0"
                >
                  <ArrowUp className="w-4 h-4 text-black stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSettingsModal && (
        <SettingsModal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
}
