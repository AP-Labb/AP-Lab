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

  // Lower stiffness = more lag = trails behind the real cursor
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

  // Track scroll progress of this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center start"]
  });

  // Perspective animation: locks completely flat (0 deg) when in center view
  const rotateX = useTransform(scrollYProgress, [0, 0.45, 1], [20, 0, 0]);
  const y = useTransform(scrollYProgress, [0, 0.45, 1], [100, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.85, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.3, 1, 1]);

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
      className="relative w-full py-[160px] px-6 md:px-[120px] flex flex-col justify-center items-center z-20" 
      style={{ perspective: "1500px" }}
    >
      <div className="mb-12 text-center relative z-30">
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
      {/* Intense Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-primary-purple/40 blur-[120px] rounded-[100%] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-medical-teal/30 blur-[100px] rounded-[100%] pointer-events-none" />

      {/* Outer wrapper: relative, no overflow-hidden, so cursor can render on top freely */}
      <div
        className="relative w-full max-w-[1200px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => {
          setIsHovered(false);
          mouseX.set(-200);
          mouseY.set(-200);
        }}
        onMouseMove={handleMouseMove}
        style={{ 
          cursor: "auto",
          perspective: "1200px"
        }}
      >
        {/* Custom play cursor that trails behind the real cursor — inverts colors it passes over */}
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
          className="absolute z-[100] w-16 h-16 bg-white rounded-full flex items-center justify-center"
        >
          <svg
            viewBox="0 0 100 100"
            className="w-7 h-7 fill-black"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="32,20 76,50 32,80" />
          </svg>
        </motion.div>

        {/* React Bits LaserFlow Effect Container around the Video Frame */}
        <div className="absolute -inset-6 z-0 pointer-events-none rounded-[28px] overflow-hidden opacity-75">
          <LaserFlow
            color="#38BDF8"
            horizontalBeamOffset={0.0}
            verticalBeamOffset={0.0}
            fogIntensity={0.55}
            flowSpeed={0.4}
            wispDensity={1.2}
            wispSpeed={18.0}
          />
        </div>

        {/* The actual 3D card — overflow-hidden clips its inner content, not the cursor above */}
        <motion.div 
          style={{ 
            rotateX, 
            scale, 
            opacity, 
            y,
            transformStyle: "preserve-3d" 
          }}
          className="relative w-full aspect-video rounded-[12px] md:rounded-[20px] p-3 md:p-6 bg-white/[0.08] border border-white/[0.15] backdrop-blur-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,1),_inset_0_2px_4px_rgba(255,255,255,0.3)] flex justify-center items-center overflow-hidden"
        >
          {/* Inner Liquid Glass Border */}
          <div className="relative w-full h-full rounded-[8px] md:rounded-[12px] overflow-hidden border border-white/20 bg-[#020202] flex justify-center items-center shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
             
             <video
               ref={videoRef}
               src="/videos/Dashboard.mp4"
               muted
               loop
               playsInline
               // scale-x-[1.03] and scale-y-[1.08] zooms in to crop the blue OS background from the video recording borders
               className="w-full h-full object-cover absolute inset-0 z-10 scale-x-[1.03] scale-y-[1.08]"
             />
             
             <div className="absolute inset-0 bg-[#0A0A0A] z-0" />

             {/* Glass Refraction effect overlay */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none z-20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

