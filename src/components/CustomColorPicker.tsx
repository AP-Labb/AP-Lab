"use client";

import React, { useState, useRef, useEffect } from "react";
import { Pipette, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomColorPickerProps {
  color: string;
  onChange: (colorHex: string) => void;
}

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function CustomColorPicker({ color, onChange }: CustomColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(140);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  const satBoxRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);

  const currentColorHex = hslToHex(hue, saturation, lightness);

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

  const updateSatVal = (e: MouseEvent | React.MouseEvent) => {
    if (!satBoxRef.current) return;
    const rect = satBoxRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

    const s = Math.round((x / rect.width) * 100);
    const v = 100 - Math.round((y / rect.height) * 100);
    // Convert HSV (s, v) to HSL lightness
    const l = (v / 100) * (100 - s / 2);
    const sl = l === 0 || l === 100 ? 0 : ((v - l) / Math.min(l, 100 - l)) * 100;

    setSaturation(Math.round(sl || 0));
    setLightness(Math.round(l || 50));

    const hex = hslToHex(hue, Math.round(sl || 0), Math.round(l || 50));
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

  const updateHue = (e: MouseEvent | React.MouseEvent) => {
    if (!hueSliderRef.current) return;
    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newHue = Math.round((x / rect.width) * 360);
    setHue(newHue);

    const hex = hslToHex(newHue, saturation, lightness);
    onChange(hex);
  };

  return (
    <div className="relative inline-block">
      {/* Eyedropper Button: Black icon on White Circle when not selected! */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 border-2",
          isOpen
            ? "bg-white text-black border-white ring-2 ring-white/50 scale-110"
            : "bg-white text-black border-white hover:bg-neutral-200"
        )}
        title="Custom Color Picker"
      >
        <Pipette className="w-4 h-4 stroke-[2.5]" />
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
              backgroundColor: `hsl(${hue}, 100%, 50%)`,
              backgroundImage: `linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)`,
            }}
          >
            {/* Pointer Ring */}
            <div
              className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
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
                left: `${(hue / 360) * 100}%`,
                backgroundColor: `hsl(${hue}, 100%, 50%)`,
              }}
            />
          </div>

          {/* Hex Input Display & Quick Set */}
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
              className="px-3 py-1.5 rounded-xl bg-white text-black font-manrope font-bold text-xs hover:bg-neutral-200 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
