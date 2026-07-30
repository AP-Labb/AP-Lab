"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  { id: 1, name: "Sophia M.", role: "AP Bio Student", text: "The Live Diagnostics showed exactly where I was failing. Got a 5!", avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80" },
  { id: 2, name: "Daniel K.", role: "AP Chem Student", text: "Socratic AI is literally a 24/7 tutor. Unbelievable platform.", avatar: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=150&q=80" },
  { id: 3, name: "Emily R.", role: "AP Calc Student", text: "I struggled with integrals until the Neural Recall system stepped in.", avatar: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=150&q=80" },
  { id: 4, name: "Liam T.", role: "AP Physics Student", text: "The mock exams are exactly like the real thing. Highly recommend.", avatar: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=150&q=80" },
  { id: 5, name: "Ava L.", role: "AP Lang Student", text: "Beautiful UI. Studying actually feels engaging now instead of a chore.", avatar: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=150&q=80" },
  { id: 6, name: "Noah W.", role: "AP Euro Student", text: "My teacher recommended this, and my DBQ scores skyrocketed.", avatar: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=150&q=80" },
  { id: 7, name: "Mia S.", role: "AP Psych Student", text: "The spaced repetition algorithm is absolute magic. Never forgetting vocab again.", avatar: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=150&q=80" },
  { id: 8, name: "Ethan H.", role: "AP US History", text: "Best $0 I've ever spent. The fact that this is free is insane.", avatar: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=150&q=80" }
];

interface Review {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
}

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="shrink-0 w-[360px] md:w-[460px] bg-neutral-50/50 border border-neutral-200/70 rounded-[28px] p-7 md:p-8 mx-4 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.03)] relative group overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-neutral-300 hover:bg-neutral-50/80">
    
    <div className="flex space-x-1 mb-5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className="w-[18px] h-[18px] fill-amber-400 text-amber-400" />
      ))}
    </div>
    
    <p className="font-inter text-neutral-700 text-[16px] leading-relaxed mb-8 flex-1 italic select-none">
      &ldquo;{review.text}&rdquo;
    </p>
    
    <div className="flex items-center space-x-4">
      <div className="w-11 h-11 rounded-full bg-neutral-200 overflow-hidden border border-neutral-200/80 shrink-0 select-none shadow-sm">
        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col">
        <span className="font-inter font-semibold text-neutral-800 text-[15px] tracking-tight">{review.name}</span>
        <span className="font-inter text-neutral-500 text-[13px]">{review.role}</span>
      </div>
    </div>
  </div>
);

function LaurelBranch({ flip = false }: { flip?: boolean }) {
  return (
    <svg 
      className={`w-10 h-16 sm:w-14 sm:h-22 md:w-16 md:h-24 text-amber-400 shrink-0 ${flip ? "scale-x-[-1]" : ""}`} 
      viewBox="0 0 100 150" 
      fill="currentColor"
    >
      {/* Laurel Stem */}
      <path d="M 60 145 C 52 100, 25 55, 82 12" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      {/* Outer Leaves */}
      <path d="M 55 138 C 38 132, 24 122, 28 112 C 40 118, 50 128, 55 138 Z" />
      <path d="M 48 120 C 28 114, 16 100, 22 90 C 35 98, 44 108, 48 120 Z" />
      <path d="M 40 102 C 20 95, 10 78, 18 68 C 30 77, 37 89, 40 102 Z" />
      <path d="M 35 83 C 15 74, 8 57, 18 47 C 28 58, 33 70, 35 83 Z" />
      <path d="M 36 63 C 18 50, 15 32, 28 24 C 35 36, 37 50, 36 63 Z" />
      <path d="M 43 44 C 28 30, 30 12, 45 6 C 48 20, 46 33, 43 44 Z" />
      <path d="M 56 27 C 46 12, 52 -2, 66 -4 C 65 10, 60 21, 56 27 Z" />
      {/* Inner Leaves */}
      <path d="M 58 128 C 72 122, 78 110, 70 104 C 62 112, 59 120, 58 128 Z" />
      <path d="M 52 108 C 66 100, 72 87, 64 80 C 56 90, 53 100, 52 108 Z" />
      <path d="M 46 88 C 60 78, 64 64, 56 58 C 48 68, 46 78, 46 88 Z" />
      <path d="M 46 68 C 58 56, 62 42, 55 36 C 48 46, 46 57, 46 68 Z" />
      <path d="M 52 48 C 62 34, 65 20, 58 14 C 52 24, 51 37, 52 48 Z" />
    </svg>
  );
}

export function ReviewSection() {
  // Duplicate arrays to allow seamless infinite looping
  const row1 = [...reviews.slice(0, 4), ...reviews.slice(0, 4)];
  const row2 = [...reviews.slice(4, 8), ...reviews.slice(4, 8)];

  return (
    <section className="relative w-full py-[120px] bg-transparent overflow-hidden flex flex-col items-center z-10">
      
      {/* Header with Golden Laurel Wreaths matching Knowt design */}
      <div className="text-center mb-20 relative z-20 px-6 flex items-center justify-center space-x-4 sm:space-x-8">
        {/* Left Golden Laurel Branch */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <LaurelBranch flip={false} />
        </motion.div>

        {/* Center Title & Rating Subtext */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col items-center select-none"
        >
          <h2 className="font-inter font-black text-neutral-900 text-4xl sm:text-5xl md:text-6xl tracking-tight mb-2">
            4.8 Stars
          </h2>
          <p className="font-inter font-bold text-neutral-800 text-lg sm:text-xl md:text-2xl tracking-wide">
            1,000+ Reviews
          </p>
        </motion.div>

        {/* Right Golden Laurel Branch */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <LaurelBranch flip={true} />
        </motion.div>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative w-full flex flex-col space-y-6">
        
        {/* Edge Gradients for smooth fade */}
        <div className="absolute top-0 bottom-0 left-0 w-[100px] md:w-[250px] bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-[100px] md:w-[250px] bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Row 1 - Moves Left */}
        <div className="flex w-max">
          <motion.div 
            className="flex"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {row1.map((review, i) => (
              <ReviewCard key={`r1-${i}`} review={review} />
            ))}
          </motion.div>
        </div>

        {/* Row 2 - Moves Right */}
        <div className="flex w-max">
          <motion.div 
            className="flex"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {row2.map((review, i) => (
              <ReviewCard key={`r2-${i}`} review={review} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
