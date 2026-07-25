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

      {/* Bento Grid Command Center with BorderGlow & Continuous Animated Background Graphs */}
      <section className="px-6 md:px-[120px] pb-24 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Card 1: Active Scholars (Centered & Larger) */}
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
              <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center h-full relative overflow-hidden group min-h-[340px]">
                {/* Continuous Detailed Animated Teal Background Wave Graph */}
                <div className="absolute inset-x-0 bottom-0 top-[15%] opacity-35 pointer-events-none z-0">
                  <svg viewBox="0 0 1000 400" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="tealGraphGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#20c997" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#20c997" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      fill="url(#tealGraphGrad)"
                      animate={{ 
                        d: [
                          "M0,400 L0,260 Q250,140 500,240 T750,140 T1000,40 L1000,400 Z",
                          "M0,400 L0,240 Q250,260 500,160 T750,220 T1000,100 L1000,400 Z",
                          "M0,400 L0,260 Q250,140 500,240 T750,140 T1000,40 L1000,400 Z"
                        ]
                      }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.path
                      fill="none"
                      stroke="#20c997"
                      strokeWidth="3.5"
                      animate={{ 
                        d: [
                          "M0,260 Q250,140 500,240 T750,140 T1000,40",
                          "M0,240 Q250,260 500,160 T750,220 T1000,100",
                          "M0,260 Q250,140 500,240 T750,140 T1000,40"
                        ]
                      }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="text-7xl sm:text-8xl md:text-[104px] font-inter font-bold mb-3 tracking-tight text-white leading-none">1,340</div>
                  <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-white/60 font-semibold">Verified Concurrent Scholars</span>
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Card 2: Average Study Session (Centered & Larger) */}
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
              <div className="p-8 flex flex-col items-center justify-center text-center h-full relative overflow-hidden group min-h-[260px]">
                {/* Continuous Detailed Animated Amber Mountain Background Graph */}
                <div className="absolute inset-x-0 bottom-0 top-[15%] opacity-35 pointer-events-none z-0">
                  <svg viewBox="0 0 400 200" className="w-full h-full" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="amberGraphGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      fill="url(#amberGraphGrad)"
                      animate={{
                        d: [
                          "M0,200 L0,140 Q100,40 200,100 T400,20 L400,200 Z",
                          "M0,200 L0,110 Q100,90 200,50 T400,70 L400,200 Z",
                          "M0,200 L0,140 Q100,40 200,100 T400,20 L400,200 Z"
                        ]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.path
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                      animate={{
                        d: [
                          "M0,140 Q100,40 200,100 T400,20",
                          "M0,110 Q100,90 200,50 T400,70",
                          "M0,140 Q100,40 200,100 T400,20"
                        ]
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </svg>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="text-6xl sm:text-7xl md:text-8xl font-inter font-bold mb-2 text-white tracking-tight leading-none">56m</div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">Avg. Study Session</span>
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Card 3: Pass Rate Matrix (Clean High-Tech Accuracy Matrix Graph) */}
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
              <div className="p-8 flex flex-col items-center justify-center text-center h-full relative overflow-hidden group min-h-[260px]">
                {/* Continuous Clean Purple Accuracy Histogram Step Matrix Background */}
                <div className="absolute inset-x-4 bottom-2 top-[20%] opacity-30 pointer-events-none z-0 flex items-end justify-between space-x-1.5 px-2">
                  {[45, 60, 50, 75, 65, 88, 92, 85, 95, 78, 88].map((val, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: [`${val * 0.6}%`, `${val * 0.95}%`, `${val * 0.6}%`] }}
                      transition={{ repeat: Infinity, duration: 2.2 + (idx * 0.2), ease: "easeInOut" }}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-purple-600/80 via-primary-purple to-purple-300 shadow-[0_0_8px_rgba(192,132,252,0.5)]"
                    />
                  ))}
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div className="text-6xl sm:text-7xl md:text-8xl font-inter font-bold mb-2 text-white tracking-tight leading-none">88.4%</div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">Questions Correct</span>
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          {/* Card 4: Monthly Traffic */}
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
              <div className="p-8 flex items-center justify-between h-full relative overflow-hidden group min-h-[170px]">
                <div className="relative z-10">
                  <div className="text-5xl sm:text-6xl md:text-7xl font-inter font-bold text-white tracking-tight mb-1">22.4K</div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 font-semibold">Total Network Visits</span>
                </div>
                {/* Continuous Smooth Animated Cyan Equalizer Frequency Bar Graph Background */}
                <div className="absolute right-6 bottom-0 top-0 w-1/2 opacity-35 flex items-end justify-between px-2 pb-6 pointer-events-none">
                  {[35, 65, 45, 85, 55, 95, 75, 110, 50, 90, 60, 100].map((h, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [h * 0.3, h * 0.9, h * 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5 + (i * 0.18), ease: "easeInOut" }}
                      className="w-2 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t-full shadow-[0_0_12px_rgba(34,211,238,0.6)]" 
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
