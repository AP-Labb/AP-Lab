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
      </div>
      <Footer />
    </main>
  );
}
