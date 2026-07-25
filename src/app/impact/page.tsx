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
            className="font-inter font-extrabold text-5xl sm:text-6xl md:text-[88px] text-white tracking-tight leading-[0.9] mb-8"
          >
            The <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-medical-teal via-[#4fd1c5] to-cyan-400 animate-gradient-x bg-[length:200%_200%] pr-4">Epicenter</span> <br /> of Excellence.
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

      {/* Bento Grid Command Center */}
      <section className="px-6 md:px-[120px] pb-24 z-10 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Active Scholars */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 liquid-glass-strong bg-[#0a0a0f] border border-white/10 rounded-[32px] p-10 flex flex-col justify-between relative overflow-hidden group hover:border-medical-teal/30 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-medical-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0" />
            <div className="absolute inset-x-0 bottom-0 top-[30%] opacity-30 pointer-events-none z-0">
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
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>
            </div>
            <div className="flex items-center justify-between relative z-10 mb-20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-medical-teal/10 border border-medical-teal/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-medical-teal" />
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest animate-pulse">
                Online
              </div>
            </div>
            <div className="relative z-10">
              <div className="text-7xl md:text-8xl font-instrument mb-4 tracking-tighter text-white">1,024</div>
              <div className="flex items-center space-x-4">
                <div className="h-[2px] w-12 bg-medical-teal/50" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Verified Concurrent Scholars</span>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wNSkiLz48L3N2Zz4=')] opacity-50 mask-image:linear-gradient(to_bottom_left,black,transparent)" />
          </motion.div>

          {/* Average Study Session */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="liquid-glass-strong bg-[#0a0a0f] border border-white/10 rounded-[32px] p-8 relative group hover:border-yellow-400/30 transition-all duration-500 flex flex-col justify-between"
          >
             <div className="w-10 h-10 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-8">
               <Clock className="w-5 h-5 text-yellow-400" />
             </div>
              <div>
                <div className="text-5xl font-instrument mb-2 text-white">56m</div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Avg. Study Session</span>
              </div>
          </motion.div>

          {/* Pass Rate Matrix */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="liquid-glass-strong bg-[#0a0a0f] border border-white/10 rounded-[32px] p-8 relative group hover:border-primary-purple/30 transition-all duration-500 flex flex-col justify-between overflow-hidden"
          >
             <div className="absolute right-[-40%] bottom-[-40%] w-[180%] aspect-square opacity-10 pointer-events-none z-0">
               <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                 <circle cx="100" cy="100" r="80" fill="none" stroke="#a484d7" strokeWidth="40" opacity="0.2" />
                 <motion.circle 
                   cx="100" cy="100" r="80" 
                   fill="none" 
                   stroke="#a484d7" 
                   strokeWidth="40" 
                   strokeDasharray="502" 
                   strokeDashoffset="502"
                   initial={{ strokeDashoffset: 502 }}
                   whileInView={{ strokeDashoffset: 8 }}
                   transition={{ duration: 2, ease: "easeInOut" }}
                   strokeLinecap="round"
                 />
               </svg>
             </div>
             <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary-purple/20 blur-3xl rounded-full z-0" />
             <div className="w-10 h-10 rounded-xl bg-primary-purple/10 border border-primary-purple/20 flex items-center justify-center mb-8 relative z-10">
               <Trophy className="w-5 h-5 text-primary-purple" />
             </div>
              <div className="relative z-10">
                <div className="text-5xl font-instrument mb-2 text-white tracking-tighter">88.4%</div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">questions answered correctly</span>
              </div>
          </motion.div>

          {/* Monthly Traffic */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 liquid-glass-strong bg-[#0a0a0f] border border-white/10 rounded-[32px] p-8 flex items-center justify-between relative group hover:border-cyan-400/30 transition-all duration-500 overflow-hidden"
          >
             <div className="relative z-10">
               <div className="flex items-center space-x-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center">
                   <Activity className="w-5 h-5 text-cyan-400" />
                 </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400">total site visits</span>
               </div>
                <div className="text-6xl font-instrument text-white tracking-tighter">22.4K</div>
             </div>
             <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-20 flex items-end justify-between px-6 pb-6">
               {[40, 70, 45, 90, 60, 100, 80, 120].map((h, i) => (
                 <motion.div 
                   key={i}
                   animate={{ height: [h * 0.5, h, h * 0.5] }}
                   transition={{ repeat: Infinity, duration: 1.5 + (i * 0.2), ease: "easeInOut" }}
                   className="w-2 bg-cyan-400 rounded-t-full" 
                 />
               ))}
             </div>
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
            <h2 className="font-inter font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight mb-8 leading-[0.95]">
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
        
        <h2 className="font-inter font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight mb-12 text-white relative z-10">
          Meet the <span className="italic text-primary-purple">Founder</span>
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
