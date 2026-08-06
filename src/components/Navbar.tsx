"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Menu, X, Activity, Users, Mail, LayoutDashboard, LogIn, Newspaper,
  ChevronDown, Lightbulb, BookOpen, Code2, CheckSquare, Trophy, Play,
  ArrowRight, Compass, Globe, Heart, Cpu, GraduationCap
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";
import { FeaturesPreviewSVG } from "./FeaturesPreviewSVG";

interface FeatureItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const featureItems: FeatureItem[] = [
  {
    id: "guides",
    name: "Interactive Guides",
    subtitle: "Curriculum mapped articles & diagrams",
    description: "Deep dive into topic readings, step-by-step experiment schematics, and interactive visual aids built for every AP course.",
    icon: Lightbulb,
    href: "/#app-showcase"
  },
  {
    id: "ai",
    name: "AI Tutor & Proof Explainer",
    subtitle: "Instant problem solver & concepts",
    description: "Get 24/7 step-by-step assistance, instant AP FRQ scoring breakdown, and conceptual proof explainers tailored to your pace.",
    icon: BookOpen,
    href: "/#ai-showcase"
  },
  {
    id: "calculator",
    name: "Desmos® Calculator",
    subtitle: "Built-in floating graphing tool",
    description: "Plot functions, solve parametric equations, and analyze datasets directly inside practice questions and mock diagnostics.",
    icon: Code2,
    href: "/#app-showcase"
  },
  {
    id: "exam",
    name: "Mock Diagnostics",
    subtitle: "Timed exam simulators with real weights",
    description: "Simulate official College Board exam conditions with weighted section timing, instant scoring analytics, and weak-area reports.",
    icon: CheckSquare,
    href: "/#app-showcase"
  },
  {
    id: "leaderboard",
    name: "Gamification & XP",
    subtitle: "Climb global student leaderboards",
    description: "Earn experience points for completed lessons and streaks, unlocking exclusive badges and competing against top AP scholars.",
    icon: Trophy,
    href: "/#app-showcase"
  },
  {
    id: "video",
    name: "HD Video Modules",
    subtitle: "Handpicked topic lecture videos",
    description: "Watch concise, high-yield video lessons from top educators paired directly with every single topic in the AP specification.",
    icon: Play,
    href: "/#app-showcase"
  }
];

interface AboutItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
}

const aboutItems: AboutItem[] = [
  {
    id: "mission",
    name: "Our Mission",
    subtitle: "Why we built AP Lab",
    description: "AP Lab was built to give every student — regardless of income or location — access to the highest-quality AP preparation. Free, always.",
    icon: Compass,
  },
  {
    id: "community",
    name: "Our Community",
    subtitle: "Students from around the world",
    description: "Tens of thousands of students in 40+ countries use AP Lab to study together, compete on leaderboards, and celebrate real progress.",
    icon: Globe,
  },
  {
    id: "values",
    name: "Our Values",
    subtitle: "What we stand for",
    description: "Transparency, accessibility, and student-first design. We never paywall content. Every feature is built to help students learn better, faster.",
    icon: Heart,
  },
  {
    id: "technology",
    name: "Our Technology",
    subtitle: "Built for real learning outcomes",
    description: "From AI tutors to Desmos integrations and adaptive XP systems, every tool is engineered around proven learning science principles.",
    icon: Cpu,
  },
  {
    id: "team",
    name: "For Students, By Students",
    subtitle: "A student-led platform",
    description: "AP Lab was created and is maintained by AP students who know firsthand what great study tools should feel like. We eat our own cooking.",
    icon: GraduationCap,
  },
];

interface FeatureItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  
  // Mega Menu State — Features
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [activeFeatureId, setActiveFeatureId] = useState<string>("guides");
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mega Menu State — About
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [activeAboutId, setActiveAboutId] = useState<string>("mission");
  const aboutMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activeAbout = aboutItems.find(a => a.id === activeAboutId) || aboutItems[0];

  const { currentUser } = useAuth();
  const { openAuthModal } = useUI();
  const pathname = usePathname();

  const activeFeature = featureItems.find(f => f.id === activeFeatureId) || featureItems[0];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);
      setIsVisible(true); // Navbar stays visible on scroll
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

  const handleMouseEnterAbout = () => {
    if (aboutMenuTimeoutRef.current) clearTimeout(aboutMenuTimeoutRef.current);
    setIsAboutOpen(true);
    setIsFeaturesOpen(false);
  };

  const handleMouseLeaveAbout = () => {
    aboutMenuTimeoutRef.current = setTimeout(() => {
      setIsAboutOpen(false);
    }, 180);
  };

  interface NavLinkItem {
    name: string;
    href: string;
    icon: React.ElementType;
  }

  const navLinks: NavLinkItem[] = [
    { name: "Blog", href: "/blog", icon: Newspaper },
    { name: "Join", href: "/join", icon: Users },
    { name: "Contact Us", href: "/contact", icon: Mail },
  ];


  return (
    <>
      {/* Sticky Top Wrapper */}
      <div 
        className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none flex justify-center"
      >
        <nav 
          className={cn(
            "pointer-events-auto transition-all duration-300 ease-out flex items-center justify-between text-white relative mt-3 sm:mt-4 w-[94%] sm:w-[96%] max-w-7xl rounded-full px-6 sm:px-8 py-2.5 overflow-visible",
            isScrolled
              ? "bg-white/[0.10] backdrop-blur-[28px] border border-white/25 shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
              : "bg-transparent border border-transparent shadow-none"
          )}
        >
          {/* Subtle Transparent Glass Sheen */}
          <div 
            className={cn(
              "absolute inset-0 rounded-full bg-white/[0.04] pointer-events-none transition-opacity duration-300",
              isScrolled ? "opacity-100" : "opacity-0"
            )}
          />
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

          {/* Center Container: Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-5">

            {/* About Hover Trigger Wrapper */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnterAbout}
              onMouseLeave={handleMouseLeaveAbout}
            >
              <button
                className={cn(
                  "relative font-manrope font-semibold text-[13px] tracking-wide transition-all duration-200 flex items-center px-4 py-1.5 rounded-full select-none cursor-pointer",
                  isAboutOpen ? "text-white bg-white/15 font-bold" : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <span>About</span>
                <ChevronDown className={cn("w-3.5 h-3.5 ml-1 transition-transform duration-200", isAboutOpen ? "rotate-180" : "")} />
              </button>

              {/* About Mega-Menu Dropdown */}
              <AnimatePresence>
                {isAboutOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.99 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 pt-2.5 w-[710px] z-[1000000] pointer-events-auto"
                  >
                    <div className="bg-[#08090e] border border-white/10 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.95)] backdrop-blur-3xl overflow-hidden text-left grid grid-cols-[240px_1fr]">

                      {/* Left: Portrait gradient card — exact uploaded image */}
                      <div className="relative flex flex-col justify-between p-5 overflow-hidden" style={{
                        backgroundImage: "url('/images/about-gradient.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}>

                        {/* Dynamic description text - changes on hover */}
                        <div className="relative z-10 mt-auto">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={activeAboutId}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.18 }}
                            >
                              <h4 className="font-manrope font-extrabold text-sm text-white leading-tight mb-2">
                                {activeAbout.name}
                              </h4>
                              <p className="font-sans text-[11px] text-white/55 leading-relaxed">
                                {activeAbout.description}
                              </p>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Bottom CTA */}
                        <Link
                          href="/join"
                          onClick={() => setIsAboutOpen(false)}
                          className="relative z-10 mt-4 flex items-center gap-1.5 text-white/60 hover:text-white text-[11px] font-manrope font-bold transition-colors group/join"
                        >
                          <span>Want to Join?</span>
                          <ArrowRight className="w-3 h-3 group-hover/join:translate-x-1 transition-transform" />
                        </Link>
                      </div>

                      {/* Right: Hover items list */}
                      <div className="flex flex-col py-3 px-2">
                        {aboutItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeAboutId === item.id;
                          return (
                            <button
                              key={item.id}
                              onMouseEnter={() => setActiveAboutId(item.id)}
                              onClick={() => setIsAboutOpen(false)}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left transition-all duration-150",
                                isActive ? "bg-white/[0.07] text-white" : "text-white/60 hover:text-white hover:bg-white/[0.04]"
                              )}
                            >
                              <div className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                isActive ? "bg-white/15 text-white" : "bg-white/5 text-white/40"
                              )}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="font-manrope font-bold text-xs text-white">{item.name}</div>
                                <div className="font-sans text-[10px] text-white/40 mt-0.5">{item.subtitle}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Features Hover Trigger Wrapper */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnterFeatures}
              onMouseLeave={handleMouseLeaveFeatures}
            >
              <button
                className={cn(
                  "relative font-manrope font-semibold text-[13px] tracking-wide transition-all duration-200 flex items-center px-4 py-1.5 rounded-full select-none cursor-pointer",
                  isFeaturesOpen ? "text-white bg-white/15 font-bold" : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <span>Features</span>
                <ChevronDown className={cn("w-3.5 h-3.5 ml-1 transition-transform duration-200", isFeaturesOpen ? "rotate-180" : "")} />
              </button>

              {/* Hover Mega-Menu Dropdown Panel (Dark Twenty style) */}
              <AnimatePresence>
                {isFeaturesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.99 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute top-full left-0 pt-2.5 w-[710px] z-[1000000] pointer-events-auto"
                  >
                    <div className="bg-[#08090e] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-[0_30px_80px_rgba(0,0,0,0.95)] backdrop-blur-3xl grid grid-cols-[1fr_1.1fr] gap-5 text-left">
                      
                      {/* Left Column: 6 Feature Items */}
                      <div className="flex flex-col space-y-1">
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
                                "flex items-start space-x-3.5 p-2.5 rounded-xl transition-all duration-150 group",
                                isHovered 
                                  ? "bg-white/[0.08] text-white" 
                                  : "text-white/70 hover:text-white hover:bg-white/[0.04]"
                              )}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors mt-0.5",
                                isHovered ? "bg-white/15 text-white" : "bg-white/5 text-white/50"
                              )}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex flex-col">
                                <span className="font-manrope font-bold text-xs tracking-tight text-white">
                                  {item.name}
                                </span>
                                <span className="font-sans text-[11px] text-white/45 leading-normal mt-0.5">
                                  {item.subtitle}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Right Column: Display Frame Container */}
                      <div className="bg-[#030407] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between overflow-hidden">
                        {/* Vector Preview Illustration */}
                        <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-white/10 bg-[#020204] shadow-inner mb-3">
                          <FeaturesPreviewSVG id={activeFeature.id} />
                        </div>

                        {/* Title and Subtitle underneath image */}
                        <div className="flex flex-col text-left px-1 pb-1">
                          <h4 className="font-manrope font-bold text-sm text-white tracking-tight">
                            {activeFeature.name}
                          </h4>
                          <p className="font-sans text-xs text-white/45 leading-relaxed mt-1">
                            {activeFeature.description}
                          </p>
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
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#08090e] text-white flex flex-col p-6 overflow-y-auto"
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
                className="font-manrope font-semibold text-xl text-white flex items-center space-x-3" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
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
