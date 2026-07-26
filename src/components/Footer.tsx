"use client";

import Link from "next/link";
import React from "react";
import LogoLoop from "./LogoLoop";

function GoogleWhiteLogo() {
  return (
    <img 
      src="/images/logos/google.png" 
      alt="Google" 
      className="h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
    />
  );
}

function FirebaseWhiteLogo() {
  return (
    <img 
      src="/images/logos/firebase.png" 
      alt="Firebase" 
      className="h-8 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
    />
  );
}

function ReactWhiteIcon() {
  return (
    <svg className="w-9 h-9 text-white/90 hover:text-white transition-colors" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="9" fill="currentColor" />
      <ellipse cx="50" cy="50" rx="38" ry="14" stroke="currentColor" strokeWidth="5.5" />
      <ellipse cx="50" cy="50" rx="38" ry="14" stroke="currentColor" strokeWidth="5.5" transform="rotate(60 50 50)" />
      <ellipse cx="50" cy="50" rx="38" ry="14" stroke="currentColor" strokeWidth="5.5" transform="rotate(120 50 50)" />
    </svg>
  );
}

function NextWhiteIcon() {
  return (
    <svg className="w-9 h-9 text-white/90 hover:text-white transition-colors" viewBox="0 0 128 128" fill="currentColor">
      <path d="M64 0a64 64 0 1 0 64 64A64.07 64.07 0 0 0 64 0zm33.4 96L55.8 45.4V96H45V32h14.8l41.6 50.6V32h10.8v64z" />
    </svg>
  );
}

function TSWhiteIcon() {
  return (
    <svg className="w-9 h-9 text-white/90 hover:text-white transition-colors" viewBox="0 0 128 128">
      <rect width="128" height="128" rx="18" fill="currentColor" />
      <path d="M38.5 48h30.8v11.7H54v42.3H39.2V59.7H38.5V48zm50.3 35.8c-2.4-1.6-5.8-2.9-10.1-3.9-3.2-.8-5.3-1.6-6.4-2.5-1.1-.9-1.6-2-1.6-3.4 0-1.5.7-2.7 2-3.6 1.4-.9 3.4-1.4 6-1.4 2.8 0 5.4.6 7.9 1.7 2.5 1.1 4.7 2.7 6.6 4.7l6.6-8.7c-3.1-2.9-6.8-5.1-11.1-6.5s-8.9-2.2-13.8-2.2c-7.3 0-13.1 1.7-17.3 5-4.2 3.3-6.3 8-6.3 14.2 0 4.7 1.3 8.6 4 11.6 2.7 3 6.9 5.3 12.6 6.9 3.8 1.1 6.5 2.1 7.9 3 1.4.9 2.1 2.2 2.1 3.9 0 1.7-.8 3.1-2.3 4.1-1.5 1-3.7 1.5-6.6 1.5-3.8 0-7.3-.9-10.7-2.7-3.4-1.8-6.3-4.4-8.8-7.7l-7.3 8.9c3.7 4.5 8.1 7.9 13.3 10.1 5.2 2.2 11.1 3.3 17.7 3.3 7.8 0 14-1.8 18.5-5.3 4.5-3.5 6.8-8.4 6.8-14.7 0-4.9-1.4-8.9-4.2-12.1z" fill="#000" />
    </svg>
  );
}

function TailwindWhiteIcon() {
  return (
    <svg className="w-9 h-9 text-white/90 hover:text-white transition-colors" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 20c-15 0-25 7.5-30 22.5 7.5-7.5 16.25-10 26.25-7.5 5.7 1.4 9.8 5.6 14.3 10.2C67.8 51.9 76.5 60 95 60c15 0 25-7.5 30-22.5-7.5 7.5-16.25 10-26.25 7.5-5.7-1.4-9.8-5.6-14.3-10.2C77.2 28.1 68.5 20 50 20zM25 60c-15 0-25 7.5-30 22.5 7.5-7.5 16.25-10 26.25-7.5 5.7 1.4 9.8 5.6 14.3 10.2C42.8 91.9 51.5 100 70 100c15 0 25-7.5 30-22.5-7.5 7.5-16.25 10-26.25 7.5-5.7-1.4-9.8-5.6-14.3-10.2C52.2 68.1 43.5 60 25 60z" />
    </svg>
  );
}

const whiteTechLogos = [
  { node: <GoogleWhiteLogo />, title: "Google", href: "https://google.com" },
  { node: <FirebaseWhiteLogo />, title: "Firebase", href: "https://firebase.google.com" },
  { node: <ReactWhiteIcon />, title: "React", href: "https://react.dev" },
  { node: <NextWhiteIcon />, title: "Next.js", href: "https://nextjs.org" },
  { node: <TSWhiteIcon />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <TailwindWhiteIcon />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
];

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
  </svg>
);
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const RedditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <img 
    src="/images/onboarding/reddit_white.png" 
    alt="Reddit" 
    className={`${props.className || ""} object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-200`} 
  />
);
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);
const TiktokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.18.94 1.13 2.27 1.9 3.73 2.16.01 1.29.01 2.58.01 3.87-1.46-.06-2.85-.64-3.95-1.58-.29-.25-.56-.52-.8-.82V14.5a7.5 7.5 0 1 1-8.5-7.44V11a3.5 3.5 0 1 0 4.5 3.36V0h.05z" />
  </svg>
);

const footerSocials = [
  { name: "Discord", url: "https://discord.com/invite/dUSaevPETd", Icon: DiscordIcon },
  { name: "GitHub", url: "https://github.com/AP-Labb", Icon: GithubIcon },
  { name: "X", url: "https://x.com/APLabss", Icon: TwitterIcon },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/ap-labb", Icon: LinkedinIcon },
  { name: "YouTube", url: "https://www.youtube.com/@AP_Labss", Icon: YoutubeIcon },
  { name: "Reddit", url: "https://www.reddit.com/user/APLabs/", Icon: RedditIcon },
  { name: "Instagram", url: "https://www.instagram.com/ap.labb/", Icon: InstagramIcon },
  { name: "TikTok", url: "https://www.tiktok.com/@ap_lab", Icon: TiktokIcon },
];

export function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-0 overflow-hidden relative border-t border-white/10">
      {/* Top Section: Connected All-White Monochrome Partner Logo Loop */}
      <div className="w-full border-b border-white/10 py-8 bg-black relative overflow-hidden select-none mb-12">
        <div className="max-w-[1400px] mx-auto px-6 mb-4 text-center">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
            POWERED BY INDUSTRY LEADERS
          </span>
        </div>
        <div className="h-14 relative overflow-hidden flex items-center">
          <LogoLoop
            logos={whiteTechLogos}
            speed={100}
            direction="left"
            logoHeight={36}
            gap={60}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="#000000"
            ariaLabel="Technology partners"
          />
        </div>
      </div>
      
      {/* Top Section: Three Columns with Vertical Lines */}
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-8 md:gap-0 border-b border-white/10 pb-16 relative">
        
        {/* Left Column */}
        <div className="flex flex-col md:border-r border-white/10 md:pr-8">
          <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-4">
            © {new Date().getFullYear()} All Rights Reserved.
          </span>
          <div className="flex space-x-4">
            <Link href="/terms" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/privacy" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Center Column */}
        <div className="flex flex-col md:border-r border-white/10 md:px-8">
          <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-4">
            Navigation:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
              Home
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/dashboard" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
              Dashboard
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/impact" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
              Impact
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/blog" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
              Blog
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/join" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
              Join
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/contact" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Social Icons Column — sits to the left of Connect */}
        <div className="flex flex-col md:border-r border-white/10 md:px-8">
          <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-4">
            Follow:
          </span>
          <div className="flex flex-wrap gap-2">
            {footerSocials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                title={social.name}
                className="w-9 h-9 rounded-[10px] bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.12] hover:border-white/20 transition-all duration-200 hover:scale-105 active:scale-95 group relative"
              >
                <social.Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Right Column — Connect */}
        <div className="flex flex-col md:pl-8 md:text-right">
          <span className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-4">
            Connect:
          </span>
          <div className="flex md:justify-end space-x-4 items-center mb-1">
            <Link href="/join" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
              Join
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/contact" className="font-mono text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors">
              Contact Us
            </Link>
          </div>
          <div className="mt-1">
            <a href="mailto:ap.labbss@gmail.com" className="font-mono text-[10px] text-white/40 hover:text-white tracking-widest transition-colors lowercase">
              ap.labbss@gmail.com
            </a>
          </div>
        </div>

      </div>



      {/* Center Subtitle */}
      <div className="w-full text-center mb-4">
        <span className="font-manrope text-[11px] text-white/60 uppercase tracking-[0.3em]">
          Advanced Placement Preparation Platform
        </span>
      </div>

      {/* Massive Bottom Text */}
      <div className="w-full overflow-hidden flex justify-center items-end leading-none select-none h-[12vw] max-h-[200px] min-h-[60px] relative">
        <h1 
          className="font-inter font-bold text-center tracking-tighter absolute bottom-0 translate-y-[35%]"
          style={{
            fontSize: 'clamp(80px, 25vw, 400px)',
            lineHeight: '0.8',
            color: '#ffffff'
          }}
        >
          AP LAB
        </h1>
      </div>

    </footer>
  );
}

