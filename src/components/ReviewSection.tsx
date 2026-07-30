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

export function ReviewSection() {
  // Duplicate arrays to allow seamless infinite looping
  const row1 = [...reviews.slice(0, 4), ...reviews.slice(0, 4)];
  const row2 = [...reviews.slice(4, 8), ...reviews.slice(4, 8)];

  return (
    <section className="relative w-full py-[120px] bg-transparent overflow-hidden flex flex-col items-center z-10">
      
      {/* Header with Exact Golden Laurel Wreath Images matching user upload */}
      <div className="text-center mb-20 relative z-20 px-6 flex items-center justify-center space-x-4 sm:space-x-8">
        {/* Left Golden Laurel Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src="/images/laurel-left.png" 
            alt="Laurel Left" 
            className="w-12 sm:w-16 md:w-20 h-auto object-contain select-none"
          />
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

        {/* Right Golden Laurel Image */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img 
            src="/images/laurel-right.png" 
            alt="Laurel Right" 
            className="w-12 sm:w-16 md:w-20 h-auto object-contain select-none"
          />
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
