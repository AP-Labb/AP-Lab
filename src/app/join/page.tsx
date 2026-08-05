"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LogoFieldBackground } from "@/components/LogoFieldBackground";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { CheckCircle2, Loader2, Users, Eye, GraduationCap, Award } from "lucide-react";

function OdometerDigit({ digit, delay }: { digit: string; delay: number }) {
  const isNumber = !isNaN(Number(digit));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView) {
      setHasAnimated(true);
    }
  }, [isInView]);

  if (digit === " ") {
    return <span className="inline-block w-[0.6em] h-[1.2em]" />;
  }

  if (!isNumber) {
    return (
      <span className="inline-block font-mono text-center w-[0.6em] h-[1.2em] align-middle">
        {digit}
      </span>
    );
  }

  const num = Number(digit);
  
  // We will create a list of digits: 3 cycles of 0-9 to make it spin
  const cycles = 3;
  const digitList = Array.from({ length: cycles * 10 }, (_, i) => i % 10);
  
  // The final position is in the last cycle: (cycles - 1) * 10 + num
  const finalIndex = (cycles - 1) * 10 + num;

  return (
    <span ref={ref} className="relative inline-block h-[1.2em] overflow-hidden w-[0.6em] align-middle">
      <motion.span
        initial={{ y: "0em", filter: "blur(0px)" }}
        animate={hasAnimated ? {
          y: -finalIndex * 1.2 + "em",
          filter: ["blur(0px)", "blur(2.5px)", "blur(0px)"]
        } : {}}
        transition={{
          y: { duration: 1.8, delay, ease: [0.16, 1, 0.3, 1] }, // custom ease-out
          filter: { duration: 1.8, delay, ease: "easeInOut" }
        }}
        className="flex flex-col absolute left-0 top-0 w-full"
      >
        {digitList.map((n, idx) => (
          <span key={idx} className="h-[1.2em] flex items-center justify-center select-none font-mono">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

// CountUp component using high-performance hardware-accelerated odometer roll-up
function CountUp({ end, suffix = "", delay = 0 }: { end: number; duration?: number; suffix?: string; delay?: number }) {
  const valueStr = end.toLocaleString();
  const digits = valueStr.split("");

  return (
    <span className="inline-flex items-center">
      {digits.map((char, idx) => (
        <OdometerDigit 
          key={idx} 
          digit={char} 
          delay={delay + (idx * 0.06)} // Stagger delay from left to right
        />
      ))}
      <span className="ml-0.5">{suffix}</span>
    </span>
  );
}

export default function JoinPage() {
  useEffect(() => {
    document.title = "Join | AP Lab";
  }, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "AP Chemistry",
    role: "Resource Creator / Writer",
    experience: "",
    contribution: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const formspreeKey = process.env.NEXT_PUBLIC_FORMSPREE_KEY || "mgojyqwp";
    const submitUrl = formspreeKey.includes("@")
      ? `https://formspree.io/${formspreeKey}`
      : `https://formspree.io/f/${formspreeKey}`;

    try {
      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `AP Lab: Join Form Submission from ${formData.name}`,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          role: formData.role,
          experience: formData.experience,
          contribution: formData.contribution
        })
      });
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setFormData({
            name: "",
            email: "",
            subject: "AP Chemistry",
            role: "Resource Creator / Writer",
            experience: "",
            contribution: ""
          });
        }, 4000);
      } else {
        alert("Failed to submit application. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  const apClasses = [
    "AP Chemistry",
    "AP Biology",
    "AP Physics 1",
    "AP Calculus BC",
    "AP Statistics",
    "AP Computer Science",
    "AP World History",
    "AP US History",
    "AP Psychology",
    "AP Lang",
    "AP Macroeconomics",
    "AP Environmental",
    "Core Codebase / Infrastructure",
    "Visual Design / Branding",
    "Other / Multi-subject"
  ];

  const roles = [
    "Resource Creator / Writer",
    "Developer / Coder",
    "Graphic Designer / Illustrator",
    "Beta Tester / Quality Reviewer",
    "Community Moderator"
  ];

  return (
    <main className="relative z-0 min-h-screen selection:bg-[#00f2ff] selection:text-white flex flex-col overflow-hidden bg-[#020202]">
      
      {/* Canvas Logo Field Background - White theme */}
      <LogoFieldBackground color="#ffffff" opacity={0.14} speedX={0.25} speedY={0.12} />

      {/* Radial Gradient Mask for Vignette Effect */}
      <div className="absolute inset-0 -z-20 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02050d]/50 to-[#020202]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,2,2,0.85)_100%)]" />
      </div>

      <Navbar />
      
      <div className="flex-1 flex items-center pt-32 pb-24 px-6 md:px-[120px] relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 lg:items-stretch items-start"
        >
          
          {/* Left Column: Metrics & Why Join Us */}
          <div className="flex flex-col text-left space-y-8 lg:h-full justify-between">
            <div className="space-y-4">
              <motion.h1 variants={itemVariants} className="font-instrument text-5xl md:text-7xl text-white">
                Join the team
              </motion.h1>
              <motion.p variants={itemVariants} className="font-inter text-lg text-white/60 max-w-md leading-relaxed">
                AP Lab is a global learning initiative built by students, for students. Work alongside top builders and shape the future of study platforms.
              </motion.p>
            </div>

            {/* Performance Metrics Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Stat 1 */}
              <div className="liquid-glass border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                <div className="text-white/40 mb-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-mono text-2xl font-extrabold text-white tracking-tight">
                    <CountUp end={10000} suffix="+" delay={0} />
                  </h3>
                  <span className="font-manrope text-[10px] uppercase tracking-wider text-white/50 text-left block mt-1 leading-normal">Students Impacted</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="liquid-glass border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                <div className="text-white/40 mb-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-mono text-2xl font-extrabold text-white tracking-tight">
                    <CountUp end={20000} suffix="+" delay={0.2} />
                  </h3>
                  <span className="font-manrope text-[10px] uppercase tracking-wider text-white/50 text-left block mt-1 leading-normal">Site Visits</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="liquid-glass border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
                <div className="text-white/40 mb-2">
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-mono text-2xl font-extrabold text-white tracking-tight">
                    <CountUp end={1000} suffix="+" delay={0.4} />
                  </h3>
                  <span className="font-manrope text-[10px] uppercase tracking-wider text-white/50 text-left block mt-1 leading-normal">Total Accounts</span>
                </div>
              </div>
            </motion.div>

            {/* Why People Should Join Cards */}
            <motion.div variants={itemVariants} className="liquid-glass border border-white/10 rounded-[28px] p-8 space-y-6 flex-grow flex flex-col justify-center">
              <h3 className="font-manrope font-extrabold text-white text-xs tracking-widest uppercase flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-cyan-400" />
                Why Join AP Lab?
              </h3>

              <div className="space-y-5">
                <div className="flex items-start space-x-4 group">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 group-hover:scale-125 transition-transform duration-300" />
                  <div className="space-y-1">
                    <h4 className="font-manrope font-bold text-white text-sm">Pioneer Interactive Classrooms</h4>
                    <p className="font-inter text-white/50 text-xs leading-relaxed">
                      Help create interactive articles, practice questions, and realistic mock exams that bring learning to life and mirror the real digital testing environment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 group-hover:scale-125 transition-transform duration-300" />
                  <div className="space-y-1">
                    <h4 className="font-manrope font-bold text-white text-sm">Empower Global Equity</h4>
                    <p className="font-inter text-white/50 text-xs leading-relaxed">
                      Contribute to a completely free, open platform that levels the playing field for student groups in underfunded districts who lack access to premium prep materials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 group-hover:scale-125 transition-transform duration-300" />
                  <div className="space-y-1">
                    <h4 className="font-manrope font-bold text-white text-sm">Learn Production-Grade Architecture</h4>
                    <p className="font-inter text-white/50 text-xs leading-relaxed">
                      Gain practical frontend, backend, and 3D graphics experience using Next.js App Router, Framer Motion render triggers, WebGL/Three.js environments, and serverless architectures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 group-hover:scale-125 transition-transform duration-300" />
                  <div className="space-y-1">
                    <h4 className="font-manrope font-bold text-white text-sm">Website Attribution</h4>
                    <p className="font-inter text-white/50 text-xs leading-relaxed">
                      Every resource you write, code feature you ship, or design layout you produce carries your profile link, credit, and contributor badge on the live platform.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column: Application Form */}
          <div className="flex flex-col space-y-6 w-full">
            <motion.div variants={itemVariants} className="liquid-glass-strong rounded-[32px] p-8 md:p-10 relative overflow-hidden border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="font-cabin text-sm font-bold text-white/70 tracking-wide">Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#02050D]/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-white/20"
                      placeholder="Jane Doe"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="font-cabin text-sm font-bold text-white/70 tracking-wide">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-[#02050D]/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-white/20"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Subject Selection */}
                  <div className="space-y-2">
                    <label className="font-cabin text-sm font-bold text-white/70 tracking-wide">Subject of Interest</label>
                    <div className="relative">
                      <select 
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-[#02050D]/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all appearance-none"
                      >
                        {apClasses.map((subj) => (
                          <option key={subj} value={subj}>{subj}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="font-cabin text-sm font-bold text-white/70 tracking-wide">Contribution Role</label>
                    <div className="relative">
                      <select 
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full bg-[#02050D]/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all appearance-none"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* What can you add */}
                <div className="space-y-2">
                  <label className="font-cabin text-sm font-bold text-white/70 tracking-wide">What can you add or contribute?</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.contribution}
                    onChange={(e) => setFormData({...formData, contribution: e.target.value})}
                    className="w-full bg-[#02050D]/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-white/20 resize-none font-sans"
                    placeholder="Notes, study guides, interactive code, diagrams, animations, or questions..."
                  />
                </div>

                {/* Experience / Link */}
                <div className="space-y-2">
                  <label className="font-cabin text-sm font-bold text-white/70 tracking-wide">Prior Experience / Link (optional)</label>
                  <input 
                    type="text" 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full bg-[#02050D]/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-white/20"
                    placeholder="e.g. GitHub link, portfolio, or past projects..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <AnimatePresence mode="wait">
                    {success ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full bg-cyan-400/20 border border-cyan-400/50 rounded-xl py-4 flex items-center justify-center space-x-2 text-cyan-400 font-bold"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Application Submitted!</span>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="submit"
                        type="submit"
                        disabled={loading}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full bg-cyan-400 hover:brightness-110 transition-all rounded-xl py-4 flex items-center justify-center space-x-2 text-black font-bold disabled:opacity-50 shadow-[0_0_20px_rgba(0,242,255,0.3)]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Submitting...</span>
                          </>
                        ) : (
                          <span>Submit Application</span>
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

              </form>
            </motion.div>

            {/* Discord Promo Card */}
            <motion.div 
              variants={itemVariants}
              className="liquid-glass rounded-3xl p-6 relative overflow-hidden border border-white/5 flex items-center justify-between group hover:border-[#7289da]/30 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7289da]/5 blur-[50px] rounded-full pointer-events-none" />
              <div className="space-y-1 relative z-10 text-left">
                <h4 className="font-manrope font-bold text-white text-sm tracking-wide">Join our Discord</h4>
                <p className="font-inter text-white/50 text-xs leading-relaxed max-w-sm">Connect with us on Discord to further discuss contributions and meet the team.</p>
              </div>
              <div className="relative z-10 flex-shrink-0">
                <a 
                  href="https://discord.com/invite/dUSaevPETd" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="discord-invite-btn"
                >
                  <div className="discord-invite-bg"></div>
                  <div className="discord-invite-svg-container">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 127.14 96.36" fill="currentColor">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.1,46,96,53,91.08,65.69,84.69,65.69Z"/>
                    </svg>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>

        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
