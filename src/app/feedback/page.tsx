"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [starsCount, setStarsCount] = useState<number>(6);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("https://api.github.com/repos/Yash123644/AP-Lab")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStarsCount(data.stargazers_count);
        }
      })
      .catch((err) => console.error("Error fetching github stars:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsLoading(true);

    const formspreeKey = process.env.NEXT_PUBLIC_FORMSPREE_KEY || "mgojyqwp";
    const submitUrl = formspreeKey.includes("@")
      ? `https://formspree.io/${formspreeKey}`
      : `https://formspree.io/f/${formspreeKey}`;

    try {
      await fetch(submitUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New AP Lab Review (${rating}/5 Stars): ${title}`,
          rating: `${rating} / 5 Stars`,
          title,
          description,
          email: "theaplabbss@gmail.com",
          target_email: "theaplabbss@gmail.com",
        }),
      });
    } catch (err) {
      console.error("Error submitting review to Formspree:", err);
    }

    setIsLoading(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setRating(0);
      setTitle("");
      setDescription("");
    }, 3500);
  };

  return (
    <>
      <title>Feedback | AP Lab</title>
      <meta name="description" content="Share your AP Lab learning experience with the community." />

      <div className="min-h-screen bg-[#070810] flex flex-col items-center justify-start relative px-4 py-12">
        {/* Subtle ambient glow - non-overflow-hidden so they don't clip form */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-violet-900/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="fixed bottom-0 right-1/4 w-[500px] h-[400px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />

        {/* Back button */}
        <div className="w-full max-w-2xl mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/80 text-sm font-manrope font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          {/* Card */}
          <div className="relative bg-[#0c0d17] border border-white/[0.08] rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.9)]">
            {/* Top gradient bar */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

            <div className="p-8">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                    >
                      <CheckCircle className="w-14 h-14 text-emerald-400 mb-5" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-manrope">Review Submitted!</h3>
                    <p className="text-white/40 text-sm font-manrope">
                      Thank you for helping us improve AP Lab. Your feedback means the world to us.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="mb-7">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center">
                          <Star className="w-4 h-4 text-violet-400" />
                        </div>
                        <span className="text-[10px] font-bold text-violet-400/80 uppercase tracking-[0.18em] font-mono">
                          AP Lab Feedback
                        </span>
                      </div>
                      <h1 className="text-2xl font-bold text-white tracking-tight font-manrope">
                        Write a Review
                      </h1>
                      <p className="text-white/40 text-sm mt-1.5 font-manrope">
                        Share your learning experience with the community.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Star Rating */}
                      <div className="flex flex-col items-center py-5 bg-white/[0.03] rounded-2xl border border-white/[0.06]">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-3 font-mono">
                          Overall Rating
                        </span>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setRating(star)}
                              className="p-0.5 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                            >
                              <Star
                                className={cn(
                                  "w-8 h-8 transition-all duration-150",
                                  (hoverRating || rating) >= star
                                    ? "fill-white text-white"
                                    : "text-white/20 fill-transparent"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-3 font-mono">
                          {rating > 0 ? `${rating} / 5 Stars` : "Tap to rate"}
                        </span>
                      </div>

                      {/* Title */}
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2 font-mono"
                        >
                          Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Summarize your review"
                          className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all text-sm font-medium font-manrope"
                          required
                        />
                      </div>

                      {/* Review */}
                      <div>
                        <label
                          htmlFor="description"
                          className="block text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2 font-mono"
                        >
                          Review
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="What's your experience been like?"
                          rows={4}
                          className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all text-sm font-medium font-manrope resize-none"
                          required
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={rating === 0 || !title || !description || isLoading}
                        className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-sm hover:bg-neutral-100 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed font-manrope"
                      >
                        {isLoading ? "Submitting..." : "Submit Review"}
                      </button>

                      {/* GitHub star */}
                      <div className="flex justify-center pt-1">
                        <a
                          href="https://github.com/AP-Labb"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex overflow-hidden items-center text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 max-w-52 whitespace-pre md:flex group relative w-full justify-center gap-2 rounded-md transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2"
                        >
                          <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40" />
                          <div className="flex items-center">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 438.549 438.549">
                              <path d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z" />
                            </svg>
                            <span className="ml-1 text-white">Star on GitHub</span>
                          </div>
                          <div className="ml-2 flex items-center gap-1 text-sm md:flex">
                            <svg
                              className="w-4 h-4 text-gray-500 transition-all duration-300 group-hover:text-yellow-300"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                clipRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                                fillRule="evenodd"
                              />
                            </svg>
                            <span className="inline-block tabular-nums tracking-wider font-display font-medium text-white">
                              {starsCount}
                            </span>
                          </div>
                        </a>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-white/20 text-xs mt-6 font-manrope">
            All reviews are sent directly to our team at{" "}
            <span className="text-white/35">theaplabbss@gmail.com</span>
          </p>
        </motion.div>
      </div>
    </>
  );
}
