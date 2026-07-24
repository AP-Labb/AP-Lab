"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, AlertCircle, ArrowUp, Activity } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { courseRegistry } from "@/lib/courses/course-registry";
import { useProgress } from "@/context/ProgressContext";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const getCourseDisplayName = (slug: string) => {
  if (slug === "ap-biology" || slug === "biology") return "Biology";
  if (slug === "ap-chemistry" || slug === "chemistry") return "Chemistry";
  if (slug === "ap-physics-c") return "Physics C";
  if (slug === "ap-ush") return "US History";
  if (slug === "ap-psych") return "Psychology";
  if (slug === "ap-eng-lang") return "English Lang";
  if (slug === "ap-calc-bc") return "Calculus BC";
  if (slug === "ap-stats") return "Statistics";
  if (slug === "ap-csa") return "Computer Science A";
  return slug;
};

export function AIAssistantDrawer({ 
  course, 
  isOpen, 
  onClose,
  initialQuery
}: { 
  course: string, 
  isOpen: boolean, 
  onClose: () => void,
  initialQuery?: string 
}) {
  const { progress, recordTutorMessage } = useProgress();
  const isLightMode = progress?.theme === "light";

  // Resolve course registry details for custom theme coloring
  let registrySlug = course;
  if (registrySlug === "biology") registrySlug = "ap-biology";
  if (registrySlug === "chemistry") registrySlug = "ap-chemistry";
  const courseData = courseRegistry[registrySlug];
  const accentColor = courseData?.accentColor || "#8b5cf6"; // Default violet/purple

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: `Hi! I'm your AP Lab AI Tutor. I can answer up to 5 questions about your ${getCourseDisplayName(course)} curriculum today. How can I help?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Resolve count from context (synced to Firestore/LocalStorage)
  const todayStr = new Date().toLocaleDateString('en-CA');
  const userMessageCount = progress.dailyTutorMessagesDate === todayStr 
    ? (progress.dailyTutorMessagesCount || 0) 
    : 0;
  const isLimitReached = userMessageCount >= 5;

  const suggestions = [
    { label: "🔍 Explain concept", text: "Can you explain the key concepts of this topic in detail?" },
    { label: "📝 Quiz me", text: "Can you give me a practice question with options to test my understanding?" },
    { label: "💡 Key Terms", text: "What are the most important vocabulary terms I need to know for this topic?" }
  ];

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialQuery && isOpen) {
      setInput(`Regarding this text: "${initialQuery}"\n\n`);
    }
  }, [initialQuery, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isLimitReached) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      await recordTutorMessage();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: newMessages.slice(1), // Exclude initial greeting
          course
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
    } catch (error: any) {
      console.error(error);
      let errorMsg = `**Error:** ${error.message}. Please try again later.`;
      if (error.message.includes("API Key") || error.message.includes("configured") || error.message.includes("placeholder")) {
        errorMsg = `### ⚠️ Gemini API Key Not Configured\n\nIt looks like your Gemini API Key is missing or using the placeholder value.\n\n**To fix this:**\n1. Open \`.env.local\` in your workspace.\n2. Add your real API key under \`GEMINI_API_KEY\`.\n3. **Restart** your Next.js development server.`;
      }
      setMessages(prev => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={cn(
              "fixed top-0 right-0 h-full w-full max-w-md border-l z-[100] flex flex-col shadow-2xl backdrop-blur-3xl transition-colors duration-300",
              isLightMode ? "bg-white border-slate-200 text-slate-900" : "bg-[#05060c]/90 border-white/10 text-white"
            )}
          >
            {/* Header */}
            <div className={cn("h-20 border-b flex items-center justify-between px-6", isLightMode ? "border-slate-200 bg-slate-50" : "border-white/5 bg-white/[0.01]")}>
              <div className="flex items-center space-x-3.5">
                <div 
                  className={cn("w-10 h-10 rounded-full border flex items-center justify-center relative overflow-hidden group shadow-inner", isLightMode ? "bg-slate-100" : "bg-white/[0.02]")}
                  style={{ borderColor: `${accentColor}30` }}
                >
                  <div 
                    className="absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                    style={{ backgroundColor: accentColor }}
                  />
                  <Activity className="w-5 h-5 relative z-10 animate-pulse" style={{ color: accentColor }} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className={cn("font-instrument text-lg font-medium", isLightMode ? "text-slate-900 font-bold" : "text-white")}>AI Tutor</h3>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" title="Active" />
                  </div>
                  <p className={cn("text-xs mt-0.5", isLightMode ? "text-slate-500 font-semibold" : "text-white/40")}>
                    {getCourseDisplayName(course)} • {userMessageCount}/5 messages • Powered by Gemini
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={onClose}
                  className={cn("p-2 rounded-full transition-colors", isLightMode ? "hover:bg-slate-200 text-slate-500 hover:text-slate-900" : "hover:bg-white/10 text-white/40 hover:text-white")}
                  title="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages (Clean i-Message layout) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth select-text no-scrollbar">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "user" ? (
                    /* User Message Bubble */
                    <div className="max-w-[78%] flex flex-col items-end">
                      <div 
                        className="rounded-[20px] rounded-br-[4px] px-5 py-2.5 text-sm font-inter leading-relaxed text-white w-full overflow-hidden break-words whitespace-normal shadow-md"
                        style={{
                          backgroundColor: accentColor,
                        }}
                      >
                        <div className="prose prose-invert prose-sm max-w-none text-white break-words select-text">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* AI Assistant Message Bubble */
                    <div className="max-w-[82%] flex flex-col items-start">
                      <div className={cn(
                        "rounded-[20px] rounded-bl-[4px] px-5 py-2.5 text-sm font-inter leading-relaxed w-full overflow-hidden break-words whitespace-normal border shadow-sm",
                        isLightMode ? "bg-slate-100 border-slate-300 text-slate-900 font-medium" : "bg-[#242429] border-transparent text-white/95"
                      )}>
                        <div className={cn(
                          "max-w-none leading-relaxed select-text break-words whitespace-normal text-sm",
                          isLightMode ? "text-slate-900 prose prose-slate prose-p:text-slate-900 prose-p:font-medium prose-headings:text-slate-900 prose-strong:text-slate-900" : "prose prose-invert prose-sm text-white"
                        )}>
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[82%] flex flex-col items-start">
                    <div className={cn("rounded-[20px] rounded-bl-[4px] p-4 flex space-x-1.5 items-center border", isLightMode ? "bg-slate-100 border-slate-200" : "bg-[#242429] border-transparent")}>
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: "0s" }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: "0.15s" }} />
                      <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: "0.3s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input & Quick suggestions */}
            <div className={cn("p-5 border-t backdrop-blur-md transition-colors duration-300", isLightMode ? "bg-slate-50 border-slate-200" : "bg-[#030408]/90 border-white/5")}>
              {isLimitReached ? (
                <div 
                  className={cn("border rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-2.5 backdrop-blur-md", isLightMode ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-amber-500/5 border-white/10 text-white")}
                  style={{ borderColor: `${accentColor}30` }}
                >
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <p className={cn("text-xs font-inter leading-relaxed", isLightMode ? "text-slate-700" : "text-white/70")}>
                    Message limit reached (5/5). Close the drawer or review the resources to continue studying!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Clickable Quick Suggestions */}
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-1.5 select-none scrollbar-none">
                    {suggestions.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSuggestionClick(s.text)}
                        className={cn(
                          "shrink-0 text-[10px] px-3.5 py-2 rounded-full border transition-all font-manrope font-semibold cursor-pointer",
                          isLightMode ? "bg-white border-slate-300 text-slate-800 shadow-sm hover:bg-slate-100" : "bg-white/[0.03] border-white/5 text-white/70 hover:text-white"
                        )}
                        style={{
                          borderColor: `${accentColor}25`
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className={cn("relative flex items-center rounded-full border px-4 py-1.5 w-full transition-colors", isLightMode ? "bg-white border-slate-300 text-slate-900 shadow-sm" : "bg-[#1c1c1f] border-white/5 text-white")}>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={`Ask about ${getCourseDisplayName(course)}...`}
                      className={cn("flex-1 bg-transparent text-sm focus:outline-none py-1.5", isLightMode ? "text-slate-900 placeholder-slate-400 font-medium" : "text-white placeholder-white/20")}
                      disabled={isLoading}
                      style={{
                        caretColor: accentColor
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-white disabled:opacity-20 transition-all hover:scale-105 active:scale-95 absolute right-2"
                      style={{
                        backgroundColor: accentColor,
                      }}
                    >
                      <ArrowUp className="w-4 h-4 text-black stroke-[3px]" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
