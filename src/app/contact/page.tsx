"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function ContactPage() {
  useEffect(() => {
    document.title = "Contact Us | AP Lab";
  }, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Resolve Formspree endpoint (environment variable for standard Form ID hash, fallback to legacy email or user form ID)
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
          _subject: `AP Lab Contact: ${formData.subject} from ${formData.name}`,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });
      
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
        }, 4000);
      } else {
        alert("Failed to send message. Please try again.");
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
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <main className="relative z-0 min-h-screen selection:bg-medical-teal selection:text-white flex flex-col overflow-hidden bg-[#020202]">
      
      {/* Sophisticated Grid Pattern Background */}
      <div className="absolute inset-0 -z-20 w-full h-full overflow-hidden pointer-events-none">
        {/* Radial Gradient Mask for Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-deep-navy/50 to-deep-navy" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,2,2,0.8)_100%)]" />
        <div className="absolute inset-0 grid-pattern opacity-[0.8]" />
        <div className="absolute inset-0 grid-pattern-bold opacity-[0.5]" />
      </div>

      <Navbar />
      
      <div className="flex-1 flex items-center pt-32 pb-24 px-6 md:px-[120px] relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24"
        >
          
          {/* Left Column: Info */}
          <div className="flex flex-col justify-center">
            <motion.h1 variants={itemVariants} className="font-instrument text-5xl md:text-7xl text-white mb-6">
              Get in touch
            </motion.h1>
            <motion.p variants={itemVariants} className="font-inter text-lg text-white/60 mb-12 max-w-md">
              Whether you&apos;re reporting a bug, requesting a new resource, or just saying hello, we&apos;re here to help you achieve elite academic performance.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-6">
              
              {/* Email Card */}
              <div className="liquid-glass rounded-2xl p-6 flex items-center space-x-5 group">
                <div className="w-12 h-12 rounded-full bg-medical-teal/20 border border-medical-teal/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 text-medical-teal" />
                </div>
                <div>
                  <div className="font-cabin font-bold text-white/50 text-xs tracking-wider uppercase mb-1">Email Us</div>
                  <a href="mailto:ap.labbss@gmail.com" className="font-manrope text-white text-lg hover:text-medical-teal transition-colors">
                    ap.labbss@gmail.com
                  </a>
                </div>
              </div>

              {/* Discord Card */}
              <a 
                href="https://discord.com/invite/dUSaevPETd"
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-colors block"
              >
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    {/* Discord Icon */}
                    <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 127.14 96.36" fill="currentColor">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.1,46,96,53,91.08,65.69,84.69,65.69Z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-cabin font-bold text-white/50 text-xs tracking-wider uppercase mb-1">Community</div>
                    <div className="font-manrope text-white text-lg">Join our Discord</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
              </a>

            </motion.div>
          </div>

          {/* Right Column: Form */}
          <motion.div variants={itemVariants} className="liquid-glass-strong rounded-[32px] p-8 md:p-10 relative overflow-hidden">
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
                    className="w-full bg-[#02050D]/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-medical-teal focus:ring-1 focus:ring-medical-teal transition-all placeholder:text-white/20"
                    placeholder="John Doe"
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
                    className="w-full bg-[#02050D]/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-medical-teal focus:ring-1 focus:ring-medical-teal transition-all placeholder:text-white/20"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="font-cabin text-sm font-bold text-white/70 tracking-wide">Subject</label>
                <div className="relative">
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-[#02050D]/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-medical-teal focus:ring-1 focus:ring-medical-teal transition-all appearance-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Resource Suggestion">Resource Suggestion</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="font-cabin text-sm font-bold text-white/70 tracking-wide">Message</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-[#02050D]/60 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-medical-teal focus:ring-1 focus:ring-medical-teal transition-all placeholder:text-white/20 resize-none"
                  placeholder="How can we help?"
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
                      className="w-full bg-medical-teal/20 border border-medical-teal/50 rounded-xl py-4 flex items-center justify-center space-x-2 text-medical-teal font-bold"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Message Sent!</span>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="submit"
                      type="submit"
                      disabled={loading}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="w-full bg-primary-purple hover:brightness-110 transition-all rounded-xl py-4 flex items-center justify-center space-x-2 text-white font-bold disabled:opacity-50 shadow-[0_0_20px_rgba(123,57,252,0.3)]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <span>Send Message</span>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

            </form>
          </motion.div>

        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
