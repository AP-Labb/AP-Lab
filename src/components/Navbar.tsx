"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Menu, X, Activity, Globe, Users, Mail, LayoutDashboard, LogIn, Newspaper,
  ChevronDown, Compass, Sparkles, Calculator, Target, Trophy, Play, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";

interface FeatureItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  image: string;
  href: string;
}

const featureItems: FeatureItem[] = [
  {
    id: "guides",
    name: "Interactive Guides",
    subtitle: "Curriculum mapped articles & diagrams",
    description: "Deep dive into topic readings, step-by-step experiment schematics, and interactive visual aids built for every AP course.",
    icon: Compass,
    image: "/images/features-pixel-guides.png",
    href: "/#app-showcase"
  },
  {
    id: "ai",
    name: "AI Tutor & Proof Explainer",
    subtitle: "Instant problem solver & concepts",
    description: "Get 24/7 step-by-step assistance, instant AP FRQ scoring breakdown, and conceptual proof explainers tailored to your pace.",
    icon: Sparkles,
    image: "/images/features-pixel-ai.png",
    href: "/#ai-showcase"
  },
  {
    id: "calculator",
    name: "Desmos® Graphing Window",
    subtitle: "Built-in floating graphing tool",
    description: "Plot functions, solve parametric equations, and analyze datasets directly inside practice questions and mock diagnostics.",
    icon: Calculator,
    image: "/images/features-pixel-calculator.png",
    href: "/#app-showcase"
  },
  {
    id: "exam",
    name: "Full Diagnostic Mocks",
    subtitle: "Timed exam simulators with real weights",
    description: "Simulate official College Board exam conditions with weighted section timing, instant scoring analytics, and weak-area reports.",
    icon: Target,
    image: "/images/features-pixel-exam.png",
    href: "/#app-showcase"
  },
  {
    id: "leaderboard",
    name: "Gamification & Live XP",
    subtitle: "Climb global student leaderboards",
    description: "Earn experience points for completed lessons and streaks, unlocking exclusive badges and competing against top AP scholars.",
    icon: Trophy,
    image: "/images/features-pixel-leaderboard.png",
    href: "/#app-showcase"
  },
  {
    id: "video",
    name: "HD Video Companions",
    subtitle: "Handpicked topic lecture videos",
    description: "Watch concise, high-yield video lessons from top educators paired directly with every single topic in the AP specification.",
    icon: Play,
    image: "/images/features-pixel-video.png",
    href: "/#app-showcase"
  }
];

interface NavLinkItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  
  // Mega Menu State
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [activeFeatureId, setActiveFeatureId] = useState<string>("guides");
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { currentUser } = useAuth();
  const { openAuthModal } = useUI();
  const pathname = usePathname();

  const activeFeature = featureItems.find(f => f.id === activeFeatureId) || featureItems[0];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY + 5) {
          setIsVisible(false); // Scroll down -> hide
          setIsFeaturesOpen(false);
        } else if (currentScrollY < lastScrollY - 5) {
          setIsVisible(true);  // Scroll up -> reveal
        }
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleMouseEnterFeatures = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setIsFeaturesOpen(true);
  };

  const handleMouseLeaveFeatures = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsFeaturesOpen(false);
    }, 180);
  };

  const navLinks: NavLinkItem[] = [
    { name: "Blog", href: "/blog", icon: Newspaper },
    { name: "Join", href: "/join", icon: Users },
    { name: "Contact Us", href: "/contact", icon: Mail },
  ];

  return (
    <>
      {/* Hide / Reveal Wrapper on Scroll */}
      <motion.div 
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 pointer-events-none flex justify-center"
      >
        <nav className={cn(
          "pointer-events-auto transition-all duration-500 ease-in-out flex items-center justify-between text-white relative",
          isScrolled 
            ? "mt-4 sm:mt-5 w-[92%] sm:w-[94%] max-w-7xl rounded-full border border-white/15 px-6 sm:px-8 md:px-10 py-3 bg-[#0b0c10]/90 backdrop-blur-2xl shadow-[0_12px_40px_0_rgba(0,0,0,0.7)]" 
            : "mt-0 w-full max-w-full rounded-none border-b border-white/10 border-x-0 border-t-0 px-8 sm:px-12 md:px-16 py-4 sm:py-5 bg-[#0b0c10]/50 backdrop-blur-xl shadow-none"
        )}>
          {/* Left Container: Logo */}
          <div className="flex-1 flex justify-start">
            <Link 
              href="/" 
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-white/80 transition-colors" />
              <span className="font-manrope font-bold text-white tracking-tight text-base sm:text-lg">AP Lab</span>
            </Link>
          </div>

          {/* Center Container: Desktop Navigation Links with Features Hover Mega-Menu */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-5">
            {/* Features Hover Trigger Wrapper */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnterFeatures}
              onMouseLeave={handleMouseLeaveFeatures}
            >
              <button
                className={cn(
                  "relative font-manrope font-semibold text-[13px] tracking-wide transition-all duration-200 flex items-center px-4 py-1.5 rounded-full select-none cursor-pointer",
                  isFeaturesOpen ? "text-white bg-white/20 font-bold" : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-purple-300" />
                <span>Features</span>
                <ChevronDown className={cn("w-3.5 h-3.5 ml-1 transition-transform duration-200", isFeaturesOpen ? "rotate-180" : "")} />
              </button>

              {/* Hover Mega-Menu Dropdown Panel (Twenty style screenshot) */}
              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[740px] z-50 pointer-events-auto"
                  >
                    <div className="bg-[#0e1017] border border-white/15 rounded-3xl p-4 sm:p-5 shadow-[0_25px_70px_rgba(0,0,0,0.9)] backdrop-blur-3xl grid grid-cols-[1.1fr_1fr] gap-4 overflow-hidden">
                      
                      {/* Left Column: List of 6 Features with Icons */}
                      <div className="flex flex-col space-y-1 pr-1">
                        <div className="px-3 py-1 mb-1 border-b border-white/10 flex justify-between items-center">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">AP LAB CAPABILITIES</span>
                          <span className="text-[10px] font-mono text-purple-400 font-semibold">Hover to preview</span>
                        </div>

                        {featureItems.map((item) => {
                          const Icon = item.icon;
                          const isHovered = activeFeatureId === item.id;

                          return (
                            <Link
                              key={item.id}
                              href={item.href}
                              onMouseEnter={() => setActiveFeatureId(item.id)}
                              onClick={() => setIsFeaturesOpen(false)}
                              className={cn(
                                "flex items-start space-x-3 p-2.5 rounded-2xl transition-all duration-200 group text-left",
                                isHovered 
                                  ? "bg-white/10 border border-white/15 shadow-md translate-x-1" 
                                  : "hover:bg-white/5 border border-transparent"
                              )}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors mt-0.5",
                                isHovered ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30" : "bg-white/5 text-white/70 group-hover:text-white"
                              )}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className={cn(
                                  "font-manrope font-bold text-[13px] leading-tight transition-colors",
                                  isHovered ? "text-white" : "text-white/80 group-hover:text-white"
                                )}>
                                  {item.name}
                                </span>
                                <span className="font-sans text-[11px] text-white/50 leading-snug mt-0.5">
                                  {item.subtitle}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Right Column: Display Image Frame & Dynamic Pixel Artwork */}
                      <div className="bg-[#05060a] border border-white/10 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group/frame">
                        {/* Dynamic Pixel Art Image Container */}
                        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-[#090a12] shadow-inner mb-3">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={activeFeature.id}
                              src={activeFeature.image}
                              alt={activeFeature.name}
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 1.04 }}
                              transition={{ duration: 0.25 }}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </AnimatePresence>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-mono font-bold text-purple-300 uppercase">
                            16-BIT PREVIEW
                          </div>
                        </div>

                        {/* Feature Description Card underneath */}
                        <div className="flex flex-col text-left space-y-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-inter font-bold text-sm text-white tracking-tight">
                              {activeFeature.name}
                            </h4>
                          </div>
                          <p className="font-sans text-[11px] text-white/60 leading-relaxed">
                            {activeFeature.description}
                          </p>
                          <Link 
                            href={activeFeature.href}
                            onClick={() => setIsFeaturesOpen(false)}
                            className="inline-flex items-center space-x-1 text-[11px] font-manrope font-bold text-purple-400 hover:text-purple-300 pt-1 group/link"
                          >
                            <span>Explore feature</span>
                            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Other Navbar Links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === "/blog" && pathname.startsWith("/blog/"));
              const isHovered = hoveredHref === link.href;
              const showIcon = isActive || isHovered;
              const Icon = link.icon;

              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onMouseEnter={() => setHoveredHref(link.href)}
                  onMouseLeave={() => setHoveredHref(null)}
                  className={cn(
                    "relative font-manrope font-semibold text-[13px] tracking-wide transition-all duration-200 flex items-center px-4 py-1.5 rounded-full select-none",
                    isActive ? "text-white bg-white/15 font-bold" : "text-white/70 hover:text-white hover:bg-white/10"
                  )}
                >
                  <AnimatePresence initial={false}>
                    {showIcon && (
                      <motion.span
                        initial={{ opacity: 0, width: 0, marginRight: 0 }}
                        animate={{ opacity: 1, width: "auto", marginRight: 6 }}
                        exit={{ opacity: 0, width: 0, marginRight: 0 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="inline-flex items-center shrink-0 overflow-hidden"
                      >
                        <Icon className="w-3.5 h-3.5 text-white shrink-0" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Container: Action Button (Dashboard / Sign In) */}
          <div className="flex-1 flex justify-end items-center">
            <div className="hidden md:flex items-center space-x-6">
              {currentUser ? (
                <Link 
                  href="/dashboard"
                  onMouseEnter={() => setHoveredHref("/dashboard")}
                  onMouseLeave={() => setHoveredHref(null)}
                >
                  <button className="font-manrope font-bold text-[13px] transition-all duration-200 flex items-center px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 shadow-md active:scale-95">
                    <AnimatePresence initial={false}>
                      {(pathname === "/dashboard" || hoveredHref === "/dashboard") && (
                        <motion.span
                          initial={{ opacity: 0, width: 0, marginRight: 0 }}
                          animate={{ opacity: 1, width: "auto", marginRight: 6 }}
                          exit={{ opacity: 0, width: 0, marginRight: 0 }}
                          transition={{ duration: 0.18 }}
                          className="inline-flex items-center shrink-0 overflow-hidden"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-black shrink-0" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <span>Dashboard</span>
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => openAuthModal("signin")}
                  onMouseEnter={() => setHoveredHref("signin")}
                  onMouseLeave={() => setHoveredHref(null)}
                  className="font-manrope font-bold text-[13px] transition-all duration-200 flex items-center px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 shadow-md active:scale-95"
                >
                  <AnimatePresence initial={false}>
                    {hoveredHref === "signin" && (
                      <motion.span
                        initial={{ opacity: 0, width: 0, marginRight: 0 }}
                        animate={{ opacity: 1, width: "auto", marginRight: 6 }}
                        exit={{ opacity: 0, width: 0, marginRight: 0 }}
                        transition={{ duration: 0.18 }}
                        className="inline-flex items-center shrink-0 overflow-hidden"
                      >
                        <LogIn className="w-3.5 h-3.5 text-black shrink-0" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#090a0e] text-white flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-white" />
                <span className="font-manrope font-bold text-lg text-white">AP Lab</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2">
                <X className="w-7 h-7" />
              </button>
            </div>
            <div className="flex flex-col space-y-6 mt-8 items-start">
              <Link 
                href="/" 
                className="font-manrope font-semibold text-xl text-white flex items-center space-x-3" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Home</span>
              </Link>
              <Link 
                href="/#app-showcase" 
                className="font-manrope font-semibold text-xl text-purple-300 flex items-center space-x-3" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Sparkles className="w-5 h-5 text-purple-300" />
                <span>Features</span>
              </Link>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className="font-manrope font-semibold text-xl text-white/80 flex items-center space-x-3" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 text-white" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              {currentUser ? (
                <Link 
                  href="/dashboard"
                  className="font-manrope font-semibold text-xl text-white flex items-center space-x-3 pt-4 border-t border-white/10 w-full" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5 text-white" />
                  <span>Dashboard</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal("signin");
                  }}
                  className="font-manrope font-semibold text-xl text-white flex items-center space-x-3 pt-4 border-t border-white/10 w-full text-left"
                >
                  <LogIn className="w-5 h-5 text-white" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
