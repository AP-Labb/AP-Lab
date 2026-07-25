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
import CircularGallery from "@/components/CircularGallery";

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

import CircularGallery from "@/components/CircularGallery";

/* ... */

      {/* 3D Interactive Circular Stats Gallery */}
      <section className="px-4 sm:px-6 md:px-[120px] pb-24 z-10 relative">
        <div className="max-w-7xl mx-auto h-[560px] relative rounded-3xl overflow-hidden bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl">
          <CircularGallery
            bend={3}
            textColor="#ffffff"
            borderRadius={0.06}
            scrollSpeed={2.5}
            scrollEase={0.04}
            items={[
              { image: "/images/stats/card1.png", text: "1,340 Concurrent Scholars" },
              { image: "/images/stats/card2.png", text: "56m Daily Study Session" },
              { image: "/images/stats/card3.png", text: "88.4% Accuracy Rate" },
              { image: "/images/stats/card4.png", text: "22.4K Network Visits" },
              { image: "/images/stats/card5.png", text: "50 US States Active" },
              { image: "/images/stats/card6.png", text: "100% Free & Open Access" }
            ]}
          />
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
