"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, ArrowLeft, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";

export default function FeedbackPage() {
  const { currentUser } = useAuth();
  const { progress } = useProgress();

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsLoading(true);

    const userName = progress?.displayName || currentUser?.displayName || "AP Scholar";
    const userEmail = currentUser?.email || progress?.email || "scholar@aplab.org";

    const payload = {
      _subject: `AP Lab Feedback (${rating}/5 Stars): ${title || "Scholar Review"}`,
      name: userName,
      email: userEmail,
      target_email: "theaplabbss@gmail.com",
      rating: `${rating} / 5 Stars`,
      title: title || "Scholar Review",
      description: description || "No written description provided.",
      submittedAt: new Date().toISOString(),
    };

    try {
      // Primary submit to configured Formspree endpoint
      await fetch("https://formspree.io/f/mgojyqwp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      // Direct fallback target email submit to ensure delivery to theaplabbss@gmail.com
      await fetch("https://formspree.io/theaplabbss@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (err) {
      console.error("Feedback submit error:", err);
    }

    setIsLoading(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setTitle("");
      setDescription("");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#030408] text-white flex flex-row relative z-0 overflow-x-clip selection:bg-neutral-800 selection:text-white font-manrope">
      <title>Feedback & Reviews | AP Lab</title>

      {/* Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      {/* Left Sidebar */}
      <AppSidebar currentPath="/feedback" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        {/* Top Header */}
        <UniversalTopHeader />

        <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 space-y-6">
          {/* Breadcrumb Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
              <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <span>/</span>
              <span className="text-white/80 font-bold">Feedback & Reviews</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* Dark Obsidian Card */}
            <div className="relative bg-[#090a12] border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.9)] overflow-hidden">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent absolute top-0 left-0 right-0" />

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="submitted"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-manrope font-extrabold text-2xl text-white">
                        Feedback Received!
                      </h3>
                      <p className="text-sm font-manrope text-white/50 max-w-md mx-auto">
                        Thank you for sharing your experience. Your feedback has been sent directly to the AP Lab team at <span className="text-white font-mono">theaplabbss@gmail.com</span>.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    {/* Header */}
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-xs font-mono">
                        <MessageSquare className="w-3.5 h-3.5 text-white/70" />
                        <span>Scholar Feedback</span>
                      </div>
                      <h2 className="font-manrope font-black text-2xl sm:text-3xl text-white tracking-tight">
                        Share Your AP Lab Experience
                      </h2>
                      <p className="text-xs sm:text-sm font-manrope text-white/50">
                        Your honest review helps shape AP Lab for students everywhere. Responses are delivered directly to <span className="text-white/80 font-mono">theaplabbss@gmail.com</span>.
                      </p>
                    </div>

                    {/* Star Rating Picker */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest block">
                        Overall Rating <span className="text-amber-400">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all cursor-pointer"
                          >
                            <Star
                              className={cn(
                                "w-7 h-7 transition-colors",
                                (hoverRating || rating) >= star
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-white/20 fill-transparent"
                              )}
                            />
                          </button>
                        ))}
                        {rating > 0 && (
                          <span className="ml-2 font-mono font-bold text-sm text-amber-400">
                            {rating} / 5 Stars
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Title Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest block">
                        Review Title / Headline
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Best AP Prep platform I've used!"
                        required
                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-manrope placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
                      />
                    </div>

                    {/* Review Details Textarea */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest block">
                        Detailed Feedback
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell us what features you loved, what helped you study, or suggestions for improvement..."
                        rows={5}
                        required
                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-manrope placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading || rating === 0}
                        className="w-full py-4 rounded-2xl bg-white text-black font-manrope font-extrabold text-sm hover:bg-neutral-200 transition-all disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.99]"
                      >
                        {isLoading ? (
                          <span>Sending Feedback...</span>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Submit Feedback to AP Lab</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
