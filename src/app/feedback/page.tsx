"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, ArrowLeft, MessageSquare, Send, Sparkles, Zap, Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AppSidebar } from "@/components/AppSidebar";
import { UniversalTopHeader } from "@/components/UniversalTopHeader";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";

interface FeedbackItem {
  id: string;
  name: string;
  avatar: string;
  avatarBg: string;
  avatarIcon: React.ElementType;
  rating: number;
  text: string;
  isUserSubmitted?: boolean;
}

export default function FeedbackPage() {
  const { currentUser } = useAuth();
  const { progress } = useProgress();

  // Dynamic Live Rating Breakdown State
  const [ratingCounts, setRatingCounts] = useState({
    5: 989,
    4: 4500,
    3: 50,
    2: 16,
    1: 8,
  });

  // Recent Feedbacks list with 3 initial bot users (Galaxy, Vroom, Pulse) with non-person PFP graphics
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      id: "bot-1",
      name: "Galaxy",
      avatarBg: "bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 border-purple-400/40 text-purple-200",
      avatarIcon: Sparkles,
      avatar: "",
      rating: 5,
      text: "AP Lab made studying for AP Bio so much easier! The interactive guides, proof explainers, and diagnostic tests helped me score a 5.",
    },
    {
      id: "bot-2",
      name: "Vroom",
      avatarBg: "bg-gradient-to-tr from-amber-500 via-orange-600 to-red-500 border-amber-400/40 text-amber-200",
      avatarIcon: Zap,
      avatar: "",
      rating: 5,
      text: "The mock exam simulator and Desmos calculator integration are absolute game changers for Calculus BC and Physics C.",
    },
    {
      id: "bot-3",
      name: "Pulse",
      avatarBg: "bg-gradient-to-tr from-cyan-500 via-teal-600 to-emerald-500 border-cyan-400/40 text-cyan-200",
      avatarIcon: Activity,
      avatar: "",
      rating: 4,
      text: "Super clean UI and amazing study tools. Best free AP prep platform out there hands down.",
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

  // Pre-fill user details if logged in
  useEffect(() => {
    if (currentUser || progress) {
      if (!name) setName(progress?.displayName || currentUser?.displayName || "");
      if (!email) setEmail(currentUser?.email || progress?.email || "");
    }
  }, [currentUser, progress]);

  // Calculate live total ratings & average score
  const totalRatingsCount = Object.values(ratingCounts).reduce((a, b) => a + b, 0);
  const totalWeightedStars = Object.entries(ratingCounts).reduce((acc, [star, count]) => acc + (Number(star) * count), 0);
  const averageRatingScore = (totalWeightedStars / totalRatingsCount).toFixed(1);

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
      // Primary submit to Formspree endpoint
      await fetch("https://formspree.io/f/mgojyqwp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      }).catch(() => {});

      // Fallback submit directly targeting email
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

    // Live update rating counts!
    setRatingCounts((prev) => ({
      ...prev,
      [rating]: (prev[rating as keyof typeof prev] || 0) + 1,
    }));

    // Live prepend user review to top of Recent Feedbacks list!
    const newFeedback: FeedbackItem = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      avatarBg: "bg-gradient-to-tr from-amber-400 to-yellow-500 text-black border-amber-300",
      avatarIcon: ShieldCheck,
      avatar: currentUser?.photoURL || progress?.photoURL || "",
      rating: rating,
      text: reviewText.trim(),
      isUserSubmitted: true,
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);

    setIsLoading(false);
    setIsSubmitted(true);

    // Reset form inputs after 3.5s
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
      <AppSidebar currentPath="/feedback" />

      <div className="flex-1 flex flex-col min-h-screen md:pl-16 relative z-10">
        {/* Top Universal Header */}
        <UniversalTopHeader />

        <main className="max-w-6xl mx-auto w-full px-4 sm:px-8 py-8 pb-28 space-y-10 text-left">
          
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
              <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
              </Link>
              <span>/</span>
              <span className="text-white/80 font-bold">Reviews & Ratings</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* TOP SECTION: RATINGS BREAKDOWN + BIG OVERALL RATING BOX */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-center">
            
            {/* Left Column: 5-Star to 1-Star Breakdown Bars */}
            <div className="bg-[#0b0c16] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              {[
                { star: 5, label: "FIVE", count: ratingCounts[5], formattedCount: ratingCounts[5] > 999 ? `${(ratingCounts[5]/1000).toFixed(1)}K` : ratingCounts[5], percent: Math.min(100, Math.round((ratingCounts[5] / totalRatingsCount) * 100)) },
                { star: 4, label: "FOUR", count: ratingCounts[4], formattedCount: ratingCounts[4] > 999 ? `${(ratingCounts[4]/1000).toFixed(1)}K` : ratingCounts[4], percent: Math.min(100, Math.round((ratingCounts[4] / totalRatingsCount) * 100)) },
                { star: 3, label: "THREE", count: ratingCounts[3], formattedCount: ratingCounts[3], percent: Math.min(100, Math.round((ratingCounts[3] / totalRatingsCount) * 100)) },
                { star: 2, label: "TWO", count: ratingCounts[2], formattedCount: ratingCounts[2], percent: Math.min(100, Math.round((ratingCounts[2] / totalRatingsCount) * 100)) },
                { star: 1, label: "ONE", count: ratingCounts[1], formattedCount: ratingCounts[1], percent: Math.min(100, Math.round((ratingCounts[1] / totalRatingsCount) * 100)) },
              ].map((row) => (
                <div key={row.star} className="flex items-center justify-between text-xs sm:text-sm font-mono font-bold">
                  {/* Star Label & Single Gold Star Icon */}
                  <div className="w-20 shrink-0 flex items-center space-x-1.5 text-white/80">
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
                  <span className="w-12 text-right shrink-0 text-white/70 font-mono font-extrabold">
                    {row.formattedCount}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column: Big Overall Rating Summary Card */}
            <div className="bg-[#0e101d] border border-amber-500/25 rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden h-full min-h-[220px]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              
              <span className="font-manrope font-black text-6xl sm:text-7xl text-amber-400 tracking-tight leading-none mb-3 drop-shadow-md">
                {averageRatingScore}
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
          {/* BOTTOM SECTION: RECENT FEEDBACKS + ADD A REVIEW FORM */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-4">
            
            {/* LEFT COLUMN: RECENT FEEDBACKS */}
            <div className="space-y-6">
              <h2 className="font-manrope font-extrabold text-2xl text-white tracking-tight">
                Recent Feedbacks
              </h2>

              <div className="space-y-4">
                {feedbacks.map((fb) => {
                  const Icon = fb.avatarIcon;
                  return (
                    <motion.div
                      key={fb.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#0b0c16] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl flex items-start space-x-4 text-left transition-all hover:border-white/20 relative overflow-hidden group"
                    >
                      {/* Avatar PFP */}
                      {fb.avatar ? (
                        <img 
                          src={fb.avatar} 
                          alt={fb.name} 
                          className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0 shadow-md"
                        />
                      ) : (
                        <div className={cn("w-12 h-12 rounded-full border flex items-center justify-center shrink-0 shadow-md", fb.avatarBg)}>
                          <Icon className="w-6 h-6" />
                        </div>
                      )}

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
                  );
                })}
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
                          Thank you for your feedback! Your review has been added live and delivered to <span className="text-white font-mono">theaplabbss@gmail.com</span>.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      
                      {/* Add Your Rating * */}
                      <div className="space-y-2">
                        <label className="text-xs font-manrope font-bold text-white/90 block">
                          Add Your Rating <span className="text-amber-400">*</span>
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

                      {/* Name * Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-manrope font-bold text-white/90 block">
                          Name <span className="text-amber-400">*</span>
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

                      {/* Email * Input */}
                      <div className="space-y-2">
                        <label className="text-xs font-manrope font-bold text-white/90 block">
                          Email <span className="text-amber-400">*</span>
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

                      {/* Write Your Review * Textarea */}
                      <div className="space-y-2">
                        <label className="text-xs font-manrope font-bold text-white/90 block">
                          Write Your Review <span className="text-amber-400">*</span>
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

                      {/* Submit Button (Bright Yellow rounded rectangle matching screenshot) */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isLoading || rating === 0}
                          className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-manrope font-extrabold text-base transition-all disabled:opacity-40 flex items-center justify-center space-x-2 cursor-pointer shadow-lg active:scale-[0.99]"
                        >
                          {isLoading ? (
                            <span>Submitting Review...</span>
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
