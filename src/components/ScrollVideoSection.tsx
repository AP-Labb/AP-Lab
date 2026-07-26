"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import LaserFlow from "./LaserFlow";

export function ScrollVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);

  const cursorX = useSpring(mouseX, { stiffness: 60, damping: 18, mass: 1.2 });
  const cursorY = useSpring(mouseY, { stiffness: 60, damping: 18, mass: 1.2 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseX.jump(x);
    mouseY.jump(y);
    cursorX.jump(x);
    cursorY.jump(y);
    setIsHovered(true);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch((err) => {
            console.log("Auto-play failed/prevented:", err);
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => {
      observer.unobserve(video);
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full pt-12 pb-32 px-4 sm:px-6 md:px-12 flex flex-col justify-center items-center z-20 overflow-visible" 
    >
      {/* Top Volumetric LaserFlow Beam Container: Flows down from Included Classes section into top-left of the video frame */}
      <div className="absolute -top-[220px] left-1/2 -translate-x-1/2 w-full max-w-[1300px] h-[650px] z-10 pointer-events-none overflow-hidden select-none">
        <LaserFlow
          horizontalBeamOffset={-0.26}
          verticalBeamOffset={-0.12}
          horizontalSizing={0.45}
          verticalSizing={2.2}
          fogIntensity={0.65}
          fogScale={0.35}
          flowSpeed={0.4}
          wispDensity={1.4}
          wispSpeed={16.0}
          wispIntensity={6.0}
          color="#38BDF8"
        />
      </div>

      <div className="mb-10 text-center relative z-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-inter font-extrabold text-white text-3xl md:text-5xl tracking-tight mb-4"
        >
          See The Platform In Action
        </motion.h2>
        <p className="font-inter text-white/50 text-lg">Watch how the dashboard effortlessly adapts to your studying needs.</p>
      </div>

      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary-purple/30 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-medical-teal/25 blur-[100px] rounded-[100%] pointer-events-none" />

      {/* Video Card Container (Clean flat layout without 3D fold scroll distortion) */}
      <div
        className="relative w-full max-w-[1150px] z-20"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(-200);
          mouseY.set(-200);
        }}
        onMouseMove={handleMouseMove}
      >
        {/* Custom play cursor */}
        <motion.div
          style={{
            x: cursorX,
            y: cursorY,
            translateX: "-50%",
            translateY: "-50%",
            mixBlendMode: "difference",
            opacity: isHovered ? 1 : 0,
            pointerEvents: "none",
          }}
          transition={{ opacity: { duration: 0.2 } }}
          className="absolute z-[100] w-16 h-16 bg-white rounded-full flex items-center justify-center pointer-events-none"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-7 h-7 fill-black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="32,20 76,50 32,80" />
          </svg>
        </motion.div>

        {/* Video Card Frame */}
        <div className="relative w-full aspect-video rounded-[16px] md:rounded-[24px] p-2 sm:p-3 md:p-4 bg-white/[0.06] border border-sky-400/30 backdrop-blur-[40px] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(56,189,248,0.25)] flex justify-center items-center overflow-hidden">
          <div className="relative w-full h-full rounded-[12px] md:rounded-[18px] overflow-hidden border border-white/20 bg-[#020202] flex justify-center items-center shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
             <video
               ref={videoRef}
               src="/videos/Dashboard.mp4"
               muted
               loop
               playsInline
               className="w-full h-full object-cover absolute inset-0 z-10 scale-x-[1.03] scale-y-[1.08]"
             />
             <div className="absolute inset-0 bg-[#0A0A0A] z-0" />
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none z-20" />
          </div>
        </div>
      </div>
    </section>
  );
}

