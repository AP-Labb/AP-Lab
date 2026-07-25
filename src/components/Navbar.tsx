"use client";

import { useState, useEffect } from "react";
import { Menu, X, Activity, Globe, Users, Mail, LayoutDashboard, LogIn, Newspaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { cn } from "@/lib/utils";

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
  const { currentUser } = useAuth();
  const { openAuthModal } = useUI();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > 120) {
        if (currentScrollY > lastScrollY + 5) {
          setIsVisible(false); // Scroll down -> hide
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

  const navLinks: NavLinkItem[] = [
    { name: "Impact", href: "/impact", icon: Globe },
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
          "pointer-events-auto transition-all duration-500 ease-in-out flex items-center justify-between text-white",
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

          {/* Center Container: Desktop Navigation Links with Hover & Active Icons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
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

          {/* Right Container: Action Button (Dashboard / Sign In) - No White Outline */}
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
            className="fixed inset-0 z-50 bg-[#090a0e] text-white flex flex-col p-6"
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
