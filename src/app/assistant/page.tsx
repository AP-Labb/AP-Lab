"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Sparkles, Code2, LineChart, Cpu, FileText, ArrowRight,
  Bot, RefreshCw, Layers, CheckCircle2, ChevronRight, Terminal, User, Copy, Check
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { Home, LayoutDashboard, BarChart2, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  {
    icon: LineChart,
    label: "Draw a Graph",
    prompt: "Can you plot and generate a chart comparing AP Physics kinematics formulas over time with an example calculation?",
    color: "from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30"
  },
  {
    icon: Code2,
    label: "Write Code",
    prompt: "Write a complete AP Computer Science A Java class implementing a Binary Search algorithm with detailed comments.",
    color: "from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30"
  },
  {
    icon: Layers,
    label: "Create a Timeline",
    prompt: "Create a structured timeline table of major AP US History events leading to the American Revolution with key dates and impacts.",
    color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30"
  },
  {
    icon: Cpu,
    label: "Solve a Science Problem",
    prompt: "Step-by-step solution for an AP Chemistry stoichiometry equilibrium problem calculating Kp and Kc values.",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30"
  }
];

export default function AssistantPage() {
  const { currentUser } = useAuth();
  const { progress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello ${currentUser?.displayName?.split(" ")[0] || "there"}! I'm **Panda AI**, your all-in-one AP Lab learning assistant.\n\nI can help you with:\n- 📊 **Charts & Data Visualizations** for any AP subject\n- 💻 **Java, Python, & Pseudo-code** for AP CS A and Principles\n- 🧪 **Problem Solving & Step-by-Step Proofs** (Physics, Chem, Calc, Bio)\n- 📚 **General Course Questions & Essays**\n\nWhat would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-hidden selection:bg-purple-500/30 selection:text-purple-200">
      {/* Left Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden gap-1 pt-2">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 px-2 pb-4">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-500/40 shrink-0">
                <img src="/images/panda-mascot.png" alt="Panda AI" className="w-full h-full object-cover" />
              </div>
              <motion.span
                animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                className="font-manrope font-bold text-white text-sm whitespace-pre"
              >
                AP Lab
              </motion.span>
            </Link>

            {/* Nav items */}
            {([
              { icon: Home, label: "Home", href: "/" },
              { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
              { icon: BarChart2, label: "Progress", href: "/dashboard/progress" },
            ] as { icon: React.ElementType; label: string; href: string }[]).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all duration-200 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <motion.span
                    animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-manrope font-semibold whitespace-pre"
                  >
                    {item.label}
                  </motion.span>
                </Link>
              );
            })}

            {/* Panda AI Assistant Nav Item (Active) */}
            <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-white mt-1 cursor-default">
              <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-emerald-400">
                <img src="/images/panda-mascot.png" alt="Panda AI" className="w-full h-full object-cover" />
              </div>
              <motion.span
                animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-manrope font-bold text-emerald-400 whitespace-pre flex items-center gap-1.5"
              >
                Panda AI
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/30 text-emerald-300">PRO</span>
              </motion.span>
            </div>
          </div>

          {/* Bottom: Sign out */}
          <div className="flex flex-col gap-2 pb-6">
            <button
              onClick={async () => {
                await signOut(auth);
                window.location.href = "/";
              }}
              className="flex items-center gap-3 px-2 py-2.5 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <motion.span
                animate={{ display: sidebarOpen ? "inline-block" : "none", opacity: sidebarOpen ? 1 : 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-manrope font-semibold whitespace-pre"
              >
                Sign Out
              </motion.span>
            </button>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-emerald-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#030408]/80 backdrop-blur-xl flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-emerald-500/40 p-0.5 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <img src="/images/panda-mascot.png" alt="Panda Mascot" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#030408]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-manrope font-bold text-base text-white">Panda AI Assistant</h1>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  AP UNLIMITED
                </span>
              </div>
              <p className="text-xs font-inter text-white/40">General Course Inquiry • Code Execution • Charts & Math Models</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([{
                id: "welcome",
                role: "assistant",
                content: `Chat history cleared! What would you like to solve or learn next?`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }])}
              className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/50 hover:text-white hover:bg-white/[0.08] transition-all text-xs flex items-center gap-1.5"
              title="Clear Conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-manrope font-semibold">New Chat</span>
            </button>
          </div>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-4 max-w-4xl mx-auto ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/40 shrink-0 mt-1 shadow-md">
                  <img src="/images/panda-mascot.png" alt="Panda" className="w-full h-full object-cover" />
                </div>
              )}

              <div className={`flex flex-col space-y-1 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[10px] font-mono text-white/40">
                    {msg.role === "user" ? (currentUser?.displayName || "You") : "Panda AI"}
                  </span>
                  <span className="text-[9px] font-mono text-white/20">{msg.timestamp}</span>
                </div>

                <div
                  className={`rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-lg relative group ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none font-inter"
                      : "bg-[#0c0e1a] border border-white/10 text-white/90 rounded-tl-none font-inter"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline ? (
                          <div className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#060710]">
                            <div className="px-4 py-1.5 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
                              <span>{match ? match[1] : 'code'}</span>
                              <button
                                onClick={() => handleCopy(msg.id, String(children))}
                                className="hover:text-white transition-colors"
                              >
                                {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
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
                      },
                      table({ children }) {
                        return (
                          <div className="my-4 overflow-x-auto rounded-xl border border-white/10">
                            <table className="w-full text-left text-xs border-collapse">
                              {children}
                            </table>
                          </div>
                        );
                      },
                      th({ children }) {
                        return <th className="bg-white/[0.06] p-2.5 font-manrope font-bold text-white border-b border-white/10">{children}</th>;
                      },
                      td({ children }) {
                        return <td className="p-2.5 border-b border-white/[0.05] text-white/80">{children}</td>;
                      }
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>

                  {msg.role === "assistant" && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
                  {currentUser?.displayName?.charAt(0) || "U"}
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 max-w-4xl mx-auto items-start"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500/40 shrink-0 shadow-md">
                <img src="/images/panda-mascot.png" alt="Panda" className="w-full h-full object-cover" />
              </div>
              <div className="bg-[#0c0e1a] border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-xs font-mono text-white/40">Panda is reasoning & generating...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Suggestion Chips (when conversation is short) */}
        {messages.length <= 2 && (
          <div className="px-4 md:px-8 max-w-4xl mx-auto w-full mb-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {QUICK_PROMPTS.map((qp, idx) => {
                const Icon = qp.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSend(qp.prompt)}
                    className={`p-3 rounded-xl bg-gradient-to-br ${qp.color} border transition-all text-left group hover:scale-[1.02] flex flex-col justify-between space-y-2`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-manrope font-bold text-xs leading-tight text-white group-hover:text-white">
                      {qp.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Floating Input Bar */}
        <div className="p-4 md:px-8 md:pb-6 bg-gradient-to-t from-[#030408] via-[#030408] to-transparent shrink-0">
          <div className="max-w-4xl mx-auto relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Panda AI anything (e.g. 'Plot kinetic energy vs velocity', 'Write Java binary search', 'Explain AP Bio Unit 3')..."
                className="w-full bg-[#0a0c16] border border-white/15 focus:border-emerald-500/60 rounded-2xl pl-5 pr-14 py-4 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2.5 p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-400 hover:to-teal-500 disabled:opacity-30 disabled:hover:from-emerald-500 transition-all shadow-md active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] font-mono text-center text-white/30 mt-2">
              Panda AI can write code, render LaTeX formulas & Markdown tables. Verify important exam dates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
