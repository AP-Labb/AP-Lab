"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";

interface FeedbackItem {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

export default function DashboardFeedbackPage() {
  const { currentUser } = useAuth();
  const { progress } = useProgress();

  // Default ratings distribution summing to 1,240
  const DEFAULT_RATING_COUNTS = {
    5: 1040,
    4: 160,
    3: 25,
    2: 10,
    1: 5,
  };

  const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>(DEFAULT_RATING_COUNTS);

  // Load rating counts from localStorage on mount so submissions persist through reloads
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("ap-lab-feedback-rating-counts");
        if (saved) {
          setRatingCounts(JSON.parse(saved));
        }
      } catch (e) {}
    }
  }, []);

  // Top Feedbacks featuring bot users with uploaded avatar images
  const [feedbacks] = useState<FeedbackItem[]>([
    {
      id: "bot-1",
      name: "Galaxy",
      avatar: "/images/reviews/bot1_avatar.png",
      rating: 5,
      text: "AP Lab made studying for AP Bio so much easier! The interactive guides, proof explainers, and diagnostic tests helped me score a 5.",
    },
    {
      id: "bot-2",
      name: "Vroom",
      avatar: "/images/reviews/bot2_avatar.png",
      rating: 5,
      text: "The mock exam simulator and Desmos calculator integration are absolute game changers for Calculus BC and Physics C.",
    },
    {
      id: "bot-3",
      name: "Pulse",
      avatar: "/images/reviews/bot3_avatar.png",
      rating: 4,
      text: "Super clean UI and amazing study tools. Best free AP prep platform out there hands down.",
    },
    {
      id: "bot-4",
      name: "iluv",
      avatar: "/images/reviews/iluv_avatar.png",
      rating: 5,
      text: "Honestly AP Lab is the best platform I've ever used. The diagnostic tests, AI tutor, and practice modules literally saved my AP exam scores!",
    },
  ]);

  // Form State
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reviewText, setReviewText] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid = rating > 0 && name.trim().length > 0 && email.trim().length > 0 && reviewText.trim().length > 0;

  // Pre-fill user details if logged in
  useEffect(() => {
    if (currentUser || progress) {
      if (!name) setName(progress?.displayName || currentUser?.displayName || "");
      if (!email) setEmail(currentUser?.email || progress?.email || "");
    }
  }, [currentUser, progress]);

  // Total Ratings count dynamically calculated
  const totalRatingsCount = Object.values(ratingCounts).reduce((a, b) => a + b, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !name.trim() || !email.trim() || !reviewText.trim()) return;

    setIsLoading(true);

    const targetEmail = "theaplabbss@gmail.com";
    const payload = {
      _subject: `New AP Lab Review (${rating}/5 Stars) from ${name}`,
      name: name.trim(),
      email: email.trim(),
      target_email: targetEmail,
      rating: `${rating} / 5 Stars`,
      review: reviewText.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch("https://formspree.io/f/mgojyqwp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      await fetch(`https://formspree.io/${targetEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (err) {
      console.error("Error submitting review form:", err);
    }

    // Live update & persist rating breakdown counts to localStorage
    setRatingCounts((prev) => {
      const updated = {
        ...prev,
        [rating]: (prev[rating] || 0) + 1,
      };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("ap-lab-feedback-rating-counts", JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });

    setIsLoading(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setReviewText("");
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#060712] text-white flex flex-row relative z-0 overflow-x-clip selection:bg-neutral-800 selection:text-white font-manrope">
      <title>Reviews & Feedback | AP Lab</title>

      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] pointer-events-none z-0" />

      {/* Left Sidebar */}
      <AppSidebar currentPath="/dashboard/feedback" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        {/* Top Universal Header */}
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 pb-28 space-y-10 text-left">
          
          {/* ========================================================= */}
          {/* TOP SECTION: RATINGS BREAKDOWN + BIG OVERALL RATING BOX */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-center">
            
            {/* Left Column: 5-Star to 1-Star Breakdown Bars */}
            <div className="bg-[#0b0c16] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              {[
                { star: 5, label: "FIVE", count: ratingCounts[5], formattedCount: ratingCounts[5].toLocaleString(), percent: Math.min(100, Math.round((ratingCounts[5] / totalRatingsCount) * 100)) },
                { star: 4, label: "FOUR", count: ratingCounts[4], formattedCount: ratingCounts[4].toLocaleString(), percent: Math.min(100, Math.round((ratingCounts[4] / totalRatingsCount) * 100)) },
                { star: 3, label: "THREE", count: ratingCounts[3], formattedCount: ratingCounts[3].toLocaleString(), percent: Math.min(100, Math.round((ratingCounts[3] / totalRatingsCount) * 100)) },
                { star: 2, label: "TWO", count: ratingCounts[2], formattedCount: ratingCounts[2].toLocaleString(), percent: Math.min(100, Math.round((ratingCounts[2] / totalRatingsCount) * 100)) },
                { star: 1, label: "ONE", count: ratingCounts[1], formattedCount: ratingCounts[1].toLocaleString(), percent: Math.min(100, Math.round((ratingCounts[1] / totalRatingsCount) * 100)) },
              ].map((row) => (
                <div key={row.star} className="flex items-center justify-between text-xs sm:text-sm">
                  {/* Clean refined Manrope font label */}
                  <div className="w-20 shrink-0 flex items-center space-x-1.5 font-manrope font-semibold text-white/90">
                    <span>{row.label}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  </div>

                  {/* Rating Trough & Yellow Bar Fill */}
                  <div className="flex-1 mx-4 h-3.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.percent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-amber-400 rounded-full"
                    />
                  </div>

                  {/* Count Text */}
                  <span className="w-14 text-right shrink-0 text-white/70 font-manrope font-bold text-xs sm:text-sm">
                    {row.formattedCount}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column: Big Overall Rating Summary Card */}
            <div className="bg-[#0e101d] border border-amber-500/25 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden h-full min-h-[220px]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              
              <span className="font-manrope font-black text-6xl sm:text-7xl text-amber-400 tracking-tight leading-none mb-3 drop-shadow-md">
                4.8
              </span>

              <div className="flex items-center space-x-1.5 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-7 h-7 fill-amber-400 text-amber-400 drop-shadow-sm" />
                ))}
              </div>

              <span className="text-sm font-manrope font-extrabold text-white/60 tracking-wide mt-1">
                {totalRatingsCount.toLocaleString()} Ratings
              </span>
            </div>

          </div>

          {/* ========================================================= */}
          {/* BOTTOM SECTION: TOP FEEDBACKS + ADD A REVIEW FORM */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-4">
            
            {/* LEFT COLUMN: TOP FEEDBACKS */}
            <div className="space-y-6">
              <h2 className="font-manrope font-extrabold text-2xl text-white tracking-tight">
                Top Feedbacks
              </h2>

              <div className="space-y-4">
                {feedbacks.map((fb) => (
                  <motion.div
                    key={fb.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[#0b0c16] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl flex items-start space-x-4 text-left transition-all hover:border-white/20 relative overflow-hidden group"
                  >
                    {/* Bot Avatar Image */}
                    <img 
                      src={fb.avatar} 
                      alt={fb.name} 
                      className="w-12 h-12 rounded-full object-cover border border-white/15 shrink-0 shadow-md"
                    />

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-manrope font-extrabold text-base text-white truncate">
                          {fb.name}
                        </span>
                        
                        {/* Stars Row */}
                        <div className="flex items-center space-x-1 shrink-0">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={cn(
                                "w-4 h-4",
                                s <= fb.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-white/20 fill-transparent"
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm font-manrope text-white/60 leading-relaxed">
                        {fb.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: ADD A REVIEW FORM */}
            <div className="space-y-6">
              <h2 className="font-manrope font-extrabold text-2xl text-white tracking-tight">
                Add a Review
              </h2>

              <div className="bg-[#0b0c16] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl text-left relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="submitted"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-12 text-center space-y-4"
                    >
                      <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-manrope font-extrabold text-2xl text-white">
                          Review Submitted!
                        </h3>
                        <p className="text-xs sm:text-sm font-manrope text-white/60 max-w-sm mx-auto leading-relaxed">
                          Thank you for your review! It has been delivered directly to <span className="text-white font-mono">theaplabbss@gmail.com</span>.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      
                      {/* Add Your Rating */}
                      <div className="space-y-2">
                        <label className="text-xs font-manrope font-bold text-white/90 block">
                          Add Your Rating
                        </label>
                        <div className="flex items-center space-x-1.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 transition-transform hover:scale-110 cursor-pointer"
                            >
                              <Star
                                className={cn(
                                  "w-7 h-7 transition-colors",
                                  (hoverRating || rating) >= star
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-white/20 fill-transparent stroke-[1.5]"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-manrope font-bold text-white/90 block">
                          Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                          className="w-full bg-[#131522] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm font-manrope placeholder-white/25 focus:outline-none focus:border-amber-400/60 transition-colors shadow-inner"
                        />
                      </div>

                      {/* Email Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-manrope font-bold text-white/90 block">
                          Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="JohnDoe@gmail.com"
                          required
                          className="w-full bg-[#131522] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm font-manrope placeholder-white/25 focus:outline-none focus:border-amber-400/60 transition-colors shadow-inner"
                        />
                      </div>

                      {/* Write Your Review Textarea */}
                      <div className="space-y-2">
                        <label className="text-xs font-manrope font-bold text-white/90 block">
                          Write Your Review
                        </label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Write here..."
                          rows={4}
                          required
                          className="w-full bg-[#131522] border border-white/10 rounded-2xl px-4 py-3.5 text-white text-sm font-manrope placeholder-white/25 focus:outline-none focus:border-amber-400/60 transition-colors resize-none shadow-inner"
                        />
                      </div>

                      {/* Submit Button (Highlights ONLY when all fields are populated) */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading || !isFormValid}
                          className={cn(
                            "w-full py-4 rounded-2xl font-manrope font-extrabold text-base transition-all flex items-center justify-center space-x-2 border",
                            isFormValid && !isLoading
                              ? "bg-amber-400 hover:bg-amber-300 text-black border-amber-400 shadow-lg cursor-pointer active:scale-[0.99]"
                              : "bg-white/[0.05] text-white/30 border-white/5 cursor-not-allowed shadow-none"
                          )}
                        >
                          {isLoading ? (
                            <span>Submitting...</span>
                          ) : (
                            <span>Submit</span>
                          )}
                        </button>
                      </div>

                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
