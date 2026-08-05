"use client";

import React, { useState, useRef } from "react";
import { Pipette, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomColorPickerProps {
  color: string;
  isCustomActive?: boolean;
  onChange: (colorHex: string) => void;
}

// Convert HSV to Hex
function hsvToHex(h: number, s: number, v: number): string {
  s /= 100;
  v /= 100;
  const i = Math.floor((h / 60) % 6);
  const f = (h / 60) - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0, g = 0, b = 0;
  switch (i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function CustomColorPicker({ color, isCustomActive, onChange }: CustomColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hsv, setHsv] = useState({ h: 140, s: 100, v: 100 });

  const satBoxRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);

  const currentColorHex = hsvToHex(hsv.h, hsv.s, hsv.v);

  const updateSatVal = (e: MouseEvent | React.MouseEvent) => {
    if (!satBoxRef.current) return;
    const rect = satBoxRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const s = Math.round((x / rect.width) * 100);
    const v = Math.round((1 - y / rect.height) * 100);

    const newHsv = { ...hsv, s, v };
    setHsv(newHsv);

    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    onChange(hex);
  };

  const handleSatMouseDown = (e: React.MouseEvent) => {
    updateSatVal(e);
    const onMouseMove = (moveEvent: MouseEvent) => updateSatVal(moveEvent);
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const updateHue = (e: MouseEvent | React.MouseEvent) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const h = Math.round((x / rect.width) * 360);

    const newHsv = { ...hsv, h };
    setHsv(newHsv);

    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    onChange(hex);
  };

  const handleHueMouseDown = (e: React.MouseEvent) => {
    updateHue(e);
    const onMouseMove = (moveEvent: MouseEvent) => updateHue(moveEvent);
    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="relative inline-block">
      {/* Eyedropper Button: Displays black checkmark when custom color is in use! */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 border-2 relative",
          isCustomActive
            ? "border-white scale-110 shadow-lg text-black"
            : isOpen
            ? "bg-white text-black border-white ring-2 ring-white/50 scale-110"
            : "bg-white text-black border-white hover:bg-neutral-200"
        )}
        style={{
          backgroundColor: isCustomActive ? color : isOpen ? "#ffffff" : "#ffffff",
        }}
        title={isCustomActive ? `Custom Color (${color})` : "Pick Custom Color"}
      >
        {isCustomActive ? (
          <Check className="w-4 h-4 text-black drop-shadow stroke-[3]" />
        ) : (
          <Pipette className="w-4 h-4 stroke-[2.5]" />
        )}
      </button>

      {/* Custom Color Picker Popover (Matching Screenshot 1!) */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-3 w-64 bg-[#14151f] border border-white/20 rounded-3xl p-4 shadow-2xl z-[999999] space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-manrope font-bold text-xs text-white">Custom Cover Color</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2D Saturation / Value Canvas Gradient Box */}
          <div
            ref={satBoxRef}
            onMouseDown={handleSatMouseDown}
            className="relative w-full h-44 rounded-2xl cursor-crosshair overflow-hidden shadow-inner border border-white/10"
            style={{
              backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
              backgroundImage: `linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)`,
            }}
          >
            {/* Pointer Ring matching exact mouse coordinates */}
            <div
              className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${hsv.s}%`,
                top: `${100 - hsv.v}%`,
                backgroundColor: currentColorHex,
              }}
            />
          </div>

          {/* Rainbow Hue Slider Bar */}
          <div
            ref={hueSliderRef}
            onMouseDown={handleHueMouseDown}
            className="relative w-full h-6 rounded-full cursor-pointer border border-white/10 shadow-inner"
            style={{
              background: `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)`,
            }}
          >
            <div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2"
              style={{
                left: `${(hsv.h / 360) * 100}%`,
                backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
              }}
            />
          </div>

          {/* Hex Input Display & Done Button */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: currentColorHex }}
              />
              <span className="font-mono text-xs font-bold text-white uppercase">{currentColorHex}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3.5 py-1.5 rounded-xl bg-white text-black font-manrope font-bold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
