"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Users, Star, Trophy, Activity, MapPin, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { USMap } from "@/components/USMap";
import { LiveUserCounter } from "@/components/LiveUserCounter";
import ProfileCard from "@/components/ProfileCard";
import BorderGlow from "@/components/BorderGlow";

const SeamlessVideo = ({ src, className }: { src: string; className: string }) => {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const v1 = useRef<HTMLVideoElement>(null);
  const v2 = useRef<HTMLVideoElement>(null);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>, idx: number) => {
    const video = e.currentTarget;
    if (video.duration && video.duration - video.currentTime < 0.8 && active === idx) {
      const nextIdx = idx === 0 ? 1 : 0;
      setActive(nextIdx);
      const nextVid = nextIdx === 0 ? v1.current : v2.current;
      if (nextVid) {
        nextVid.currentTime = 0;
        nextVid.play();
      }
    }
  };

  return (
    <div className={cn("absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-out", loaded ? "opacity-100" : "opacity-0")}>
      <video
        ref={v1}
        muted playsInline preload="auto" autoPlay
        className={cn("absolute inset-0 object-cover w-full h-full transition-opacity duration-700", className, active === 0 ? "opacity-40" : "opacity-0")}
        src={src}
        onTimeUpdate={(e) => handleTimeUpdate(e, 0)}
        onPlaying={() => setLoaded(true)}
      />
      <video
        ref={v2}
        muted playsInline preload="auto"
        className={cn("absolute inset-0 object-cover w-full h-full transition-opacity duration-700", className, active === 1 ? "opacity-40" : "opacity-0")}
        src={src}
        onTimeUpdate={(e) => handleTimeUpdate(e, 1)}
        onPlaying={() => setLoaded(true)}
      />
    </div>
  );
};

export default function ImpactPage() {
  useEffect(() => {
    document.title = "Impact | AP Lab";
  }, []);

  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-medical-teal selection:text-black overflow-hidden relative">
      {/* Background Video */}
      <div className="fixed inset-0 w-full h-screen z-0 overflow-hidden pointer-events-none bg-black">
        <SeamlessVideo 
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4" 
          className=""
        />
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
      </div>

      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-36 md:pt-40 pb-14 px-6 md:px-[120px] z-10">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <LiveUserCounter />

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-inter font-bold text-5xl sm:text-6xl md:text-[88px] text-white tracking-tight leading-[0.9] mb-8"
          >
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-teal via-[#4fd1c5] to-cyan-400 animate-gradient-x bg-[length:200%_200%] pr-4">Epicenter</span> <br /> of Excellence.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-inter text-white/50 text-xl leading-relaxed max-w-2xl"
          >
            Monitor real-time infrastructure metrics and verifiable academic success across the AP Lab global network.
          </motion.p>
        </div>
      </section>

      {/* Bento Grid Command Center with BorderGlow */}
      <section className="px-6 md:px-[120px] pb-24 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Active Scholars */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2"
          >
            <BorderGlow
              glowColor="166 72 50"
              backgroundColor="#070913"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1.2}
              colors={['#20c997', '#38bdf8', '#4fd1c5']}
              className="h-full"
            >
              <div className="p-8 sm:p-10 flex flex-col justify-between h-full relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-medical-teal/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 top-[35%] opacity-20 pointer-events-none z-0">
                  <svg viewBox="0 0 1000 400" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="activeScholarsChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#20c997" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#20c997" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M0,400 L0,300 Q150,200 300,280 T600,150 T800,200 T1000,50 L1000,400 Z"
                      fill="url(#activeScholarsChart)"
                      initial={{ y: 200, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    <motion.path
                      d="M0,300 Q150,200 300,280 T600,150 T800,200 T1000,50"
                      fill="none"
                      stroke="#20c997"
                      strokeWidth="3.5"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                    />
                  </svg>
                </div>

                <div className="flex items-center justify-between relative z-10 mb-16">
                  <div className="flex items-center space-x-3">
                    <div className="w-11 h-11 rounded-xl bg-medical-teal/10 border border-medical-teal/25 flex items-center justify-center shadow-inner">
                      <Users className="w-5 h-5 text-medical-teal" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white/70 uppercase tracking-wider">Infrastructure</span>
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="text-6xl sm:text-7xl md:text-8xl font-inter font-bold mb-3 tracking-tight text-white">1,024</div>
                  <div className="flex items-center space-x-3">
                    <div className="h-[2px] w-8 bg-medical-teal/60 rounded-full" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">Verified Concurrent Scholars</span>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Average Study Session */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <BorderGlow
              glowColor="43 96 56"
              backgroundColor="#070913"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1.2}
              colors={['#f59e0b', '#fbbf24', '#fef08a']}
              className="h-full"
            >
              <div className="p-7 sm:p-8 flex flex-col justify-between h-full relative group">
                <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mb-6">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-4xl sm:text-5xl font-inter font-bold mb-2 text-white tracking-tight">56m</div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">Avg. Study Session</span>
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Pass Rate Matrix */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <BorderGlow
              glowColor="268 60 68"
              backgroundColor="#070913"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1.2}
              colors={['#a484d7', '#c084fc', '#e879f9']}
              className="h-full"
            >
              <div className="p-7 sm:p-8 flex flex-col justify-between h-full relative overflow-hidden group">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-purple/15 blur-3xl rounded-full z-0 pointer-events-none" />
                <div className="w-10 h-10 rounded-xl bg-primary-purple/10 border border-primary-purple/25 flex items-center justify-center mb-6 relative z-10">
                  <Trophy className="w-5 h-5 text-primary-purple" />
                </div>
                <div className="relative z-10">
                  <div className="text-4xl sm:text-5xl font-inter font-bold mb-2 text-white tracking-tight">88.4%</div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 font-medium">Questions Correct</span>
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Monthly Traffic */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2"
          >
            <BorderGlow
              glowColor="189 94 48"
              backgroundColor="#070913"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1.2}
              colors={['#22d3ee', '#38bdf8', '#818cf8']}
              className="h-full"
            >
              <div className="p-7 sm:p-8 flex items-center justify-between h-full relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 font-bold">Total Network Visits</span>
                  </div>
                  <div className="text-5xl sm:text-6xl font-inter font-bold text-white tracking-tight">22.4K</div>
                </div>
                <div className="absolute right-4 bottom-0 top-0 w-1/2 opacity-25 flex items-end justify-between px-4 pb-6 pointer-events-none">
                  {[40, 70, 45, 90, 60, 100, 80, 120].map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [h * 0.4, h * 0.9, h * 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.6 + (i * 0.2), ease: "easeInOut" }}
                      className="w-2 bg-cyan-400 rounded-t-full" 
                    />
                  ))}
                </div>
              </div>
            </BorderGlow>
          </motion.div>
        </div>
      </section>

      {/* Global Scale Map */}
      <section className="py-32 px-6 md:px-[120px] bg-black/40 backdrop-blur-xl relative border-t border-white/5 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(164,132,215,0.05)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-16 relative z-10">
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-full mb-8">
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">National Infrastructure</span>
            </div>
            <h2 className="font-inter font-bold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-8 leading-[0.95]">
              Reach across <br /><span className="italic text-white/50">state lines.</span>
            </h2>
            <p className="font-inter text-white/40 text-xl leading-relaxed mb-12">
              AP Lab is active nationwide, providing students across the country with interactive study tools, practice modules, and real-time concept mastery tracking to succeed on their AP exams.
            </p>
            <div className="flex items-center space-x-8">
              <div>
                <div className="text-4xl font-instrument mb-1 text-white">50</div>
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">States Active</div>
              </div>
              <div className="w-[1px] h-12 bg-white/10" />
              <div>
                <div className="text-4xl font-instrument mb-1 text-white">10K+</div>
                <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">Scholars Reached</div>
              </div>
            </div>
          </div>
          <div className="w-full xl:w-1/2 relative flex items-center justify-center">
            <USMap />
          </div>
        </div>
      </section>

      {/* Founder Profile Card Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden z-10 border-t border-white/5 flex flex-col items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-purple/10 blur-[140px] rounded-full pointer-events-none" />
        
        <h2 className="font-inter font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight mb-12 text-white relative z-10">
          Meet the Founder
        </h2>

        <div className="relative z-10 flex items-center justify-center">
          <ProfileCard
            name="Yash Patil"
            title="Founder"
            handle="yashpatil"
            status="Online"
            contactText="Contact Me"
            avatarUrl="/images/transparentbg.png"
            iconUrl="/images/iconpattern.png"
            showUserInfo={false}
            enableTilt={true}
            enableMobileTilt={false}
            behindGlowEnabled={true}
            behindGlowColor="rgba(125, 190, 255, 0.67)"
            innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
          />
        </div>
      </section>

      <Footer />
    </main>
  );
}
