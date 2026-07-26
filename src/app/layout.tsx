import type { Metadata } from "next";
import { Inter, Manrope, Cabin, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { UIProvider } from "@/context/UIContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { LiquidFilter } from "@/components/LiquidFilter";
import SmoothScroll from "@/components/SmoothScroll";
import { Preloader } from "@/components/Preloader";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const cabin = Cabin({
  subsets: ["latin"],
  variable: "--font-cabin",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-instrument",
});

import { SeoSchema } from "@/components/SeoSchema";

export const metadata: Metadata = {
  title: "AP Lab | Free Online AP Courses, Study Guides & AI Practice",
  description: "Master AP Biology, AP Chemistry, AP Calculus, AP Physics C, AP US History and more for 100% free. Deep-dive reading articles, video tutorials, full mock exams & AI tutoring.",
  metadataBase: new URL("https://theaplab.org"),
  alternates: {
    canonical: "/",
  },
  keywords: [
    "AP Lab",
    "AP Exam Prep",
    "Free AP Courses",
    "AP Biology",
    "AP Chemistry",
    "AP Calculus BC",
    "AP Physics C",
    "AP Study Guides",
    "Mock Exams",
    "College Board Prep"
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  openGraph: {
    title: "AP Lab | Free Online AP Courses & AI-Powered Practice",
    description: "Over 10 subjects, always free. Master AP Biology, AP Chemistry, AP Calculus, AP Physics C with video tutorials, interactive study guides, and full-length mock exams.",
    url: "https://theaplab.org",
    siteName: "AP Lab",
    images: [
      {
        url: "https://theaplab.org/images/embed-preview.png",
        width: 2500,
        height: 1406,
        alt: "AP Lab - Free Online Courses Preview",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AP® Lab | Free Online AP® Courses & AI-Powered Practice",
    description: "Over 10 subjects, 100% free. Comprehensive AP® study guides, embedded video lectures, and AI diagnostic tools.",
    images: ["https://theaplab.org/images/embed-preview.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <SeoSchema />
        <link rel="canonical" href="https://theaplab.org/" />
      </head>
      <body className={`${inter.variable} ${manrope.variable} ${cabin.variable} ${instrumentSerif.variable} font-inter antialiased`}>
        <LiquidFilter />
        <AuthProvider>
          <ProgressProvider>
            <UIProvider>
              <Preloader />
              <SmoothScroll>
                {children}
              </SmoothScroll>
            </UIProvider>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
