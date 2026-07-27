"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, Transition, Variants, useSpring, useMotionValue, useMotionValueEvent } from "framer-motion";
import Dither from "./Dither";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { ComparisonModal } from "./ComparisonModal";
import { GradientDots } from "@/components/ui/gradient-dots";

const DNAIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
    <path d="M30 15 Q50 50 70 85" strokeWidth="2.5"/>
    <path d="M70 15 Q50 50 30 85" strokeWidth="2.5"/>
    <line x1="36" y1="25" x2="64" y2="25" />
    <line x1="42" y1="35" x2="58" y2="35" />
    <line x1="48" y1="45" x2="52" y2="45" />
    <line x1="48" y1="55" x2="52" y2="55" />
    <line x1="42" y1="65" x2="58" y2="65" />
    <line x1="36" y1="75" x2="64" y2="75" />
    <circle cx="30" cy="15" r="3" fill="currentColor"/>
    <circle cx="70" cy="15" r="3" fill="currentColor"/>
    <circle cx="30" cy="85" r="3" fill="currentColor"/>
    <circle cx="70" cy="85" r="3" fill="currentColor"/>
  </svg>
);

const MoleculeIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
    <circle cx="50" cy="50" r="8" fill="currentColor" />
    <circle cx="20" cy="30" r="6" fill="currentColor" />
    <circle cx="80" cy="30" r="6" fill="currentColor" />
    <circle cx="50" cy="85" r="6" fill="currentColor" />
    <circle cx="80" cy="70" r="5" fill="currentColor" />
    <line x1="50" y1="50" x2="20" y2="30" strokeWidth="2" />
    <line x1="50" y1="50" x2="80" y2="30" strokeWidth="2" />
    <line x1="50" y1="50" x2="50" y2="85" strokeWidth="2" />
    <line x1="80" y1="30" x2="80" y2="70" strokeWidth="2" />
  </svg>
);

const MathGraphIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
    <line x1="15" y1="10" x2="15" y2="85" strokeWidth="2.5" />
    <line x1="15" y1="85" x2="90" y2="85" strokeWidth="2.5" />
    <line x1="15" y1="35" x2="90" y2="35" strokeDasharray="2 4" />
    <line x1="15" y1="60" x2="90" y2="60" strokeDasharray="2 4" />
    <line x1="40" y1="10" x2="40" y2="85" strokeDasharray="2 4" />
    <line x1="65" y1="10" x2="65" y2="85" strokeDasharray="2 4" />
    <path d="M15 70 Q 35 20, 55 60 T 90 20" strokeWidth="2.5" />
    <circle cx="55" cy="60" r="3.5" fill="currentColor" />
    <circle cx="35" cy="20" r="3.5" fill="currentColor" />
  </svg>
);

const BooksIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
    <rect x="20" y="60" width="60" height="15" rx="2" strokeWidth="2" />
    <line x1="28" y1="60" x2="28" y2="75" strokeWidth="2" />
    <rect x="25" y="42" width="50" height="15" rx="2" strokeWidth="2" />
    <line x1="32" y1="42" x2="32" y2="57" strokeWidth="2" />
    <rect x="30" y="24" width="40" height="15" rx="2" strokeWidth="2" />
    <line x1="36" y1="24" x2="36" y2="39" strokeWidth="2" />
  </svg>
);

const MicroscopeIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
    <path d="M30 85h40M50 85V75M35 75h30" />
    <path d="M65 75 C 65 50, 55 38, 50 22" />
    <rect x="42" y="15" width="16" height="30" rx="3" transform="rotate(-25 50 30)" />
    <circle cx="50" cy="55" r="4" fill="currentColor" />
  </svg>
);

const AtomIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
    <circle cx="50" cy="50" r="7" fill="currentColor" />
    <ellipse cx="50" cy="50" rx="40" ry="14" transform="rotate(30 50 50)" />
    <ellipse cx="50" cy="50" rx="40" ry="14" transform="rotate(90 50 50)" />
    <ellipse cx="50" cy="50" rx="40" ry="14" transform="rotate(150 50 50)" />
  </svg>
);

const CapIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
    <polygon points="50,20 85,35 50,50 15,35" />
    <path d="M30 42v18c0 10 9 15 20 15s20-5 20-15V42" />
    <path d="M85 35v25" strokeWidth="1.5" />
    <circle cx="85" cy="60" r="3" fill="currentColor" />
  </svg>
);

const BrainIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20">
    <path d="M48 20 C35 20, 25 30, 25 45 C25 55, 30 65, 40 70 C42 72, 45 76, 45 80" />
    <path d="M52 20 C65 20, 75 30, 75 45 C75 55, 70 65, 60 70 C58 72, 55 76, 55 80" />
    <circle cx="38" cy="35" r="3" fill="currentColor" />
    <circle cx="62" cy="35" r="3" fill="currentColor" />
    <circle cx="34" cy="50" r="3" fill="currentColor" />
    <circle cx="66" cy="50" r="3" fill="currentColor" />
    <circle cx="45" cy="60" r="3" fill="currentColor" />
    <circle cx="55" cy="60" r="3" fill="currentColor" />
    <line x1="38" y1="35" x2="34" y2="50" />
    <line x1="62" y1="35" x2="66" y2="50" />
    <line x1="34" y1="50" x2="45" y2="60" />
    <line x1="66" y1="50" x2="55" y2="60" />
    <line x1="45" y1="60" x2="55" y2="60" />
  </svg>
);

const FlaskIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 lg:w-14 lg:h-14">
    <path d="M38 20v28L20 72a6 6 0 0 0 5 10h50a6 6 0 0 0 5-10L62 48V20" strokeWidth="2.5" />
    <line x1="34" y1="20" x2="66" y2="20" strokeWidth="2.5" />
    <circle cx="38" cy="72" r="4" fill="currentColor" />
    <circle cx="55" cy="78" r="3" fill="currentColor" />
    <circle cx="48" cy="66" r="2.5" fill="currentColor" />
  </svg>
);

const SigmaIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 lg:w-14 lg:h-14">
    <path d="M72 18H28l24 32-24 32h44" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DoorIcon = ({ isHovered }: { isHovered: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[20px] h-[20px] text-black">
    <path 
      d="M12 5H8.5C7.67 5 7 5.67 7 6.5v11c0 .83.67 1.5 1.5 1.5H12" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    <motion.path 
      d={isHovered 
        ? "M12 3 L16 5 L16 19 L12 21 Z" 
        : "M8.5 5 L16 5 L16 19 L8.5 19 Z"
      }
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinejoin="round"
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    />

    <motion.path 
      d="M2 12h9.5M8.5 9l3 3-3 3" 
      stroke="white" 
      strokeWidth="4.2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      animate={{ x: isHovered ? 4.5 : -2.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
    
    <motion.path 
      d="M2 12h9.5M8.5 9l3 3-3 3" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      animate={{ x: isHovered ? 4.5 : -2.5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
  </svg>
);

const RulerIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 lg:w-14 lg:h-14">
    <rect x="15" y="35" width="70" height="30" rx="3" strokeWidth="2" />
    <line x1="25" y1="35" x2="25" y2="50" strokeWidth="2" />
    <line x1="35" y1="35" x2="35" y2="45" strokeWidth="1.5" />
    <line x1="45" y1="35" x2="45" y2="50" strokeWidth="2" />
    <line x1="55" y1="35" x2="55" y2="45" strokeWidth="1.5" />
    <line x1="65" y1="35" x2="65" y2="50" strokeWidth="2" />
    <line x1="75" y1="35" x2="75" y2="45" strokeWidth="1.5" />
  </svg>
);

const PeriodicIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 lg:w-14 lg:h-14">
    <rect x="10" y="10" width="22" height="22" rx="3" />
    <rect x="37" y="10" width="22" height="22" rx="3" />
    <rect x="64" y="10" width="22" height="22" rx="3" />
    <rect x="10" y="37" width="22" height="22" rx="3" />
    <rect x="37" y="37" width="22" height="22" rx="3" />
    <rect x="64" y="37" width="22" height="22" rx="3" />
    <rect x="10" y="64" width="22" height="22" rx="3" />
    <rect x="37" y="64" width="22" height="22" rx="3" />
    <rect x="64" y="64" width="22" height="22" rx="3" />
    <text x="16" y="26" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">H</text>
    <text x="43" y="26" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">C</text>
    <text x="70" y="26" fontSize="10" fill="currentColor" stroke="none" fontFamily="monospace">O</text>
  </svg>
);

const DiscordLogoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);

const layoutTransition: Transition = {
  type: "spring",
  stiffness: 80,
  damping: 22,
  mass: 1
};

const charVariants: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 15,
  },
  visible: (index: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: 0.45 + index * 0.03,
    },
  }),
  exit: (index: number) => ({
    opacity: 0,
    filter: "blur(12px)",
    y: -15,
    transition: {
      duration: 0.75,
      ease: [0.4, 0, 1, 1] as [number, number, number, number],
      delay: index * 0.025,
    },
  }),
};

function MousePushedWrapper({ children, className, style, animate, transition }: { 
  children: React.ReactNode; 
  className?: string; 
  style?: React.CSSProperties;
  animate?: any;
  transition?: any;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 80, damping: 15 });
  const y = useSpring(0, { stiffness: 80, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const elemX = rect.left + rect.width / 2;
      const elemY = rect.top + rect.height / 2;
      
      const dx = elemX - e.clientX;
      const dy = elemY - e.clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const pushRadius = 240;

      if (distance < pushRadius) {
        const force = (pushRadius - distance) / pushRadius;
        const pushAmount = force * 50;
        const angle = Math.atan2(dy, dx);
        x.set(Math.cos(angle) * pushAmount);
        y.set(Math.sin(angle) * pushAmount);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
}

export function HeroSection() {
  const { currentUser } = useAuth();
  const { openAuthModal } = useUI();
  const { scrollY } = useScroll();
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  const words = ["learning", "discovery", "mastery", "science", "medicine", "knowledge"];
  const [wordIndex, setWordIndex] = useState(0);
  const [isHoveredDashboard, setIsHoveredDashboard] = useState(false);
  const [isHoveredSignIn, setIsHoveredSignIn] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const rawX = useMotionValue(-999);
  const rawY = useMotionValue(-999);
  const smoothX = useSpring(rawX, { stiffness: 180, damping: 24, mass: 0.6 });
  const smoothY = useSpring(rawY, { stiffness: 180, damping: 24, mass: 0.6 });

  const [cursorInside, setCursorInside] = useState(false);
  const [springPos, setSpringPos] = useState({ x: -999, y: -999 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      if (inside) {
        rawX.set(x);
        rawY.set(y);
      }
      setCursorInside(inside);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [rawX, rawY]);

  useMotionValueEvent(smoothX, "change", (latestX) => {
    setSpringPos((prev) => ({ ...prev, x: latestX }));
  });
  useMotionValueEvent(smoothY, "change", (latestY) => {
    setSpringPos((prev) => ({ ...prev, y: latestY }));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col items-center justify-between pt-16 sm:pt-20 md:pt-24 pb-8 px-4 sm:px-6 md:px-12 overflow-hidden text-center z-10">
      {/* Base Background Image (HERONEW.png) with Brightened Left & Right Sides */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img 
          src="/images/HERONEW.png" 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-60 brightness-[0.9] contrast-[1.08]"
        />
        {/* Dark Center Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,7,15,0.85)_0%,rgba(5,7,15,0.72)_38%,transparent_82%)]" />
      </div>

      {/* Animated Gradient Dot Overlay — subtle colour shimmer on the background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none" style={{ opacity: 0.08, mixBlendMode: "screen" }}>
        <GradientDots
          dotSize={6}
          spacing={12}
          duration={40}
          colorCycleDuration={8}
          backgroundColor="transparent"
        />
      </div>

      {/* Moving Specular Light Wave Sweep Revealing Image Underneath */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none opacity-85">
        <div 
          className="relative w-full h-full"
          style={{
            WebkitMaskImage: "linear-gradient(110deg, transparent 35%, #000 50%, transparent 65%)",
            maskImage: "linear-gradient(110deg, transparent 35%, #000 50%, transparent 65%)",
            WebkitMaskSize: "200% 100%",
            maskSize: "200% 100%",
            animation: "ui-glint 6.5s infinite ease-in-out",
            transform: "translate3d(0,0,0)",
            willChange: "transform, mask-image",
            backfaceVisibility: "hidden",
          }}
        >
          <img 
            src="/images/HERONEW.png" 
            alt="Hero Natural Image Wave Reveal" 
            className="w-full h-full object-cover brightness-[1.2] contrast-[1.08]"
          />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-gradient-to-t from-deep-navy via-deep-navy/40 to-transparent z-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center justify-center w-full max-w-6xl mt-2 sm:mt-4 md:mt-6 relative z-10"
      >
        {/* Glassmorphic Capsule Header */}
        <div className="mb-6 sm:mb-8 block select-none">
          <button 
            type="button"
            onClick={() => setIsComparisonOpen(true)}
            className="liquid-glass-badge px-4 py-2 sm:px-6 sm:py-2.5 rounded-full flex items-center justify-center text-center cursor-pointer group"
          >
            <span className="relative z-10 font-sans font-extrabold text-[9px] sm:text-xs text-white/90 group-hover:text-white uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-colors duration-300">
              SPECIALIZED FOR ADVANCED PLACEMENT CLASSES
              <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-none stroke-white/80 group-hover:stroke-white stroke-[2.5] group-hover:translate-x-0.5 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>

        {/* Massive Headline (Fully responsive sizing for laptop & mobile screens) */}
        <h1 className="font-inter font-bold text-white text-4xl sm:text-6xl md:text-7xl lg:text-[88px] xl:text-[96px] leading-[1.08] mb-6 sm:mb-8 tracking-tight max-w-5xl text-center select-none drop-shadow-[0_6px_30px_rgba(0,0,0,0.95)]">
          For the love <br />
          <motion.span 
            layout="position" 
            transition={layoutTransition} 
            className="inline-flex items-center justify-center"
          >
            <motion.span 
              layout="position" 
              transition={layoutTransition} 
              className="inline-block"
            >
              of{" "}
            </motion.span>
            <span className="w-[0.25em]" />
            <span className="relative inline-grid grid-cols-1 grid-rows-1 justify-items-center align-middle">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={words[wordIndex]}
                  layout="position"
                  transition={layoutTransition}
                  className="col-start-1 row-start-1 inline-flex select-none text-white pb-1 whitespace-nowrap"
                >
                  {(words[wordIndex] + ".").split("").map((char, index) => (
                    <motion.span
                      key={index}
                      custom={index}
                      variants={charVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="inline-block whitespace-pre"
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.span>
        </h1>

        {/* Subtitle */}
        <p className="font-inter font-medium text-sm sm:text-base md:text-lg lg:text-[20px] text-white/90 max-w-3xl mb-8 sm:mb-12 text-center leading-relaxed text-balance px-4 select-none drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
          Over 10 subjects, always free. The highest prep quality with comprehensive practice questions and mock exams. Track your progress with dynamic analytics and study smarter with our AI assistant. This is everything learning was meant to be.{" "}
          <span className="whitespace-nowrap">
            <strong className="font-extrabold text-medical-teal animate-free-badge">100% Free</strong>
            <span className="relative inline-flex items-center group cursor-pointer align-middle ml-[-2px] translate-y-[-3px]">
              <img 
                src="/images/verified-badge.png" 
                alt="Verified Badge" 
                className="w-[28px] h-[28px] sm:w-[34px] sm:h-[34px] shrink-0 aspect-square select-none transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_6px_rgba(32,201,151,0.3)]" 
              />
            </span>
          </span>
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-4 sm:gap-6 mt-2 relative z-10">
          {currentUser ? (
            <Link href="/dashboard">
              <button 
                className="pb-ai-button w-full sm:w-auto"
                onMouseEnter={() => setIsHoveredDashboard(true)}
                onMouseLeave={() => setIsHoveredDashboard(false)}
              >
                <span className="pb-ai-sparkle flex items-center justify-center">
                  <DoorIcon isHovered={isHoveredDashboard} />
                </span>
                <span className="select-none">Go to Dashboard</span>
              </button>
            </Link>
          ) : (
            <button 
              onClick={() => openAuthModal("signin")}
              className="pb-ai-button w-full sm:w-auto"
              onMouseEnter={() => setIsHoveredSignIn(true)}
              onMouseLeave={() => setIsHoveredSignIn(false)}
            >
              <span className="pb-ai-sparkle flex items-center justify-center">
                <DoorIcon isHovered={isHoveredSignIn} />
              </span>
              <span className="select-none">Sign In</span>
            </button>
          )}

          <a 
            href="https://discord.com/invite/dUSaevPETd" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full sm:w-auto relative group"
          >
            <button className="pb-ai-button-inverted w-full sm:w-auto">
              <span className="pb-ai-sparkle flex items-center justify-center">
                <DiscordLogoIcon className="w-5 h-5" />
              </span>
              <span className="select-none">Join Discord</span>
            </button>
          </a>
        </div>
      </motion.div>

      {/* Animated Scroll Indicator (Smoothly animated white down arrow - Fades on scroll) */}
      <motion.div 
        style={{ opacity: scrollIndicatorOpacity }}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-20"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight - 50, behavior: "smooth" });
        }}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-white/60 stroke-[2]" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      {/* Feature Comparison Matrix Modal */}
      <ComparisonModal 
        isOpen={isComparisonOpen} 
        onClose={() => setIsComparisonOpen(false)} 
      />
    </section>
  );
}
