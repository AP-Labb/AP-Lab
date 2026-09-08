"use client";

import Image from "next/image";
import { useEffect } from "react";

export function MobileOnlyNotice() {
  useEffect(() => {
    const checkAndLock = () => {
      if (window.innerWidth < 768) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    checkAndLock();
    window.addEventListener("resize", checkAndLock);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", checkAndLock);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[999999] bg-black text-white flex flex-col items-center justify-center p-6 text-center select-none md:hidden min-h-[100dvh] w-screen overflow-hidden">
      <div className="flex flex-col items-center max-w-sm mx-auto space-y-6">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 drop-shadow-[0_10px_25px_rgba(239,68,68,0.15)]">
          <Image
            src="/images/mobile-panda.png"
            alt="AP Lab Desktop Only"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Desktop Only
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed px-2">
            AP Lab is currently only accessible on desktop devices. We apologize for the inconvenience!
          </p>
        </div>
      </div>
    </div>
  );
}
