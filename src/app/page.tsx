"use client";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SubjectLabs } from "@/components/SubjectLabs";
import { ReviewSection } from "@/components/ReviewSection";
import { AIFeatureShowcase } from "@/components/AIFeatureShowcase";
import { PracticeQuizSection } from "@/components/PracticeQuizSection";
import { Footer } from "@/components/Footer";
import { HowItWorks } from "@/components/HowItWorks";
import { AppShowcase } from "@/components/AppShowcase";
import { APClassesPills } from "@/components/APClassesPills";
import { SocialsSlider } from "@/components/SocialsSlider";
import { ScrollVideoSection } from "@/components/ScrollVideoSection";
import { FAQSection } from "@/components/FAQSection";
import { CollegesLogoWheel } from "@/components/CollegesLogoWheel";

import { StatsSection } from "@/components/StatsSection";

import LogoLoop from "@/components/LogoLoop";

function ReactIcon() {
  return (
    <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="10" fill="currentColor" />
      <ellipse cx="50" cy="50" rx="40" ry="15" stroke="currentColor" strokeWidth="6" />
      <ellipse cx="50" cy="50" rx="40" ry="15" stroke="currentColor" strokeWidth="6" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="40" ry="15" stroke="currentColor" strokeWidth="6" transform="rotate(120 50 50)" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg className="w-8 h-8 text-white" viewBox="0 0 128 128" fill="currentColor">
      <path d="M64 0a64 64 0 1 0 64 64A64.07 64.07 0 0 0 64 0zm33.4 96L55.8 45.4V96H45V32h14.8l41.6 50.6V32h10.8v64z" />
    </svg>
  );
}

function TSIcon() {
  return (
    <svg className="w-8 h-8 text-blue-500 rounded" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="16" fill="#3178C6" />
      <path d="M38.5 48h30.8v11.7H54v42.3H39.2V59.7H38.5V48zm50.3 35.8c-2.4-1.6-5.8-2.9-10.1-3.9-3.2-.8-5.3-1.6-6.4-2.5-1.1-.9-1.6-2-1.6-3.4 0-1.5.7-2.7 2-3.6 1.4-.9 3.4-1.4 6-1.4 2.8 0 5.4.6 7.9 1.7 2.5 1.1 4.7 2.7 6.6 4.7l6.6-8.7c-3.1-2.9-6.8-5.1-11.1-6.5s-8.9-2.2-13.8-2.2c-7.3 0-13.1 1.7-17.3 5-4.2 3.3-6.3 8-6.3 14.2 0 4.7 1.3 8.6 4 11.6 2.7 3 6.9 5.3 12.6 6.9 3.8 1.1 6.5 2.1 7.9 3 1.4.9 2.1 2.2 2.1 3.9 0 1.7-.8 3.1-2.3 4.1-1.5 1-3.7 1.5-6.6 1.5-3.8 0-7.3-.9-10.7-2.7-3.4-1.8-6.3-4.4-8.8-7.7l-7.3 8.9c3.7 4.5 8.1 7.9 13.3 10.1 5.2 2.2 11.1 3.3 17.7 3.3 7.8 0 14-1.8 18.5-5.3 4.5-3.5 6.8-8.4 6.8-14.7 0-4.9-1.4-8.9-4.2-12.1z" fill="#FFF" />
    </svg>
  );
}

function TailwindIcon() {
  return (
    <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 20c-15 0-25 7.5-30 22.5 7.5-7.5 16.25-10 26.25-7.5 5.7 1.4 9.8 5.6 14.3 10.2C67.8 51.9 76.5 60 95 60c15 0 25-7.5 30-22.5-7.5 7.5-16.25 10-26.25 7.5-5.7-1.4-9.8-5.6-14.3-10.2C77.2 28.1 68.5 20 50 20zM25 60c-15 0-25 7.5-30 22.5 7.5-7.5 16.25-10 26.25-7.5 5.7 1.4 9.8 5.6 14.3 10.2C42.8 91.9 51.5 100 70 100c15 0 25-7.5 30-22.5-7.5 7.5-16.25 10-26.25 7.5-5.7-1.4-9.8-5.6-14.3-10.2C52.2 68.1 43.5 60 25 60z" />
    </svg>
  );
}

const partnerLogos = [
  { src: "/images/logos/google.png", alt: "Google", href: "https://google.com", title: "Google" },
  { src: "/images/logos/firebase.png", alt: "Firebase", href: "https://firebase.google.com", title: "Firebase" },
  { node: <ReactIcon />, title: "React", href: "https://react.dev" },
  { node: <NextIcon />, title: "Next.js", href: "https://nextjs.org" },
  { node: <TSIcon />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <TailwindIcon />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-deep-navy selection:bg-medical-teal selection:text-white">
      <Navbar />
      <div className="flex flex-col">
        <HeroSection />
        <StatsSection />
        <div className="relative z-20">
          <APClassesPills />
        </div>
        <ScrollVideoSection />
        <HowItWorks />
        <AppShowcase />
        <AIFeatureShowcase />
        <PracticeQuizSection />
        <SubjectLabs />
        <div className="relative">
          {/* White dots transition mask on the black background */}
          <div 
            className="absolute -top-24 left-0 right-0 h-[156px] z-20 pointer-events-none opacity-80"
            style={{
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.35) 1.2px, transparent 1.2px)",
              backgroundSize: "14px 14px",
              WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
              maskImage: "linear-gradient(to top, rgba(0,0,0,0.95), transparent)",
              clipPath: "polygon(0 0, 100% 0, 100% 96px, 0 156px)",
            }}
          />
          <div className="bg-white text-black relative z-10 overflow-hidden pt-20 pb-16 [clip-path:polygon(0_60px,100%_0,100%_100%,0_100%)]">

            {/* Clean black dot-matrix patterns in the background (enhanced visibility) */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.09] mix-blend-multiply bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjEuNSIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==')] bg-repeat" />
            
            {/* Faint grid lines overlay (enhanced visibility) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

            <div className="relative z-10">
              <ReviewSection />
              <CollegesLogoWheel />
            </div>
          </div>
          
          {/* White dots transition mask on the black background at the bottom */}
          <div 
            className="absolute bottom-[-96px] left-0 right-0 h-[96px] z-20 pointer-events-none opacity-80"
            style={{
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.35) 1.2px, transparent 1.2px)",
              backgroundSize: "14px 14px",
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.95), transparent)",
            }}
          />
        </div>
        <FAQSection />
        <SocialsSlider />

        {/* React Bits Logo Loop Component at the VERY bottom of the landing page */}
        <section className="py-10 bg-black/60 border-t border-white/10 z-20 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-3 text-center">
            <p className="text-[11px] font-mono tracking-widest text-white/40 uppercase">POWERED BY GLOBAL TECH PARTNERS</p>
          </div>
          <div className="h-16 relative overflow-hidden flex items-center">
            <LogoLoop
              logos={partnerLogos}
              speed={100}
              direction="left"
              logoHeight={36}
              gap={48}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#05070f"
              ariaLabel="Technology partners"
            />
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
