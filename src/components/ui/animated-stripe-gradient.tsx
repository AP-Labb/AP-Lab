'use client';

import { useEffect, useRef } from 'react';

// ── Palette from 21st.dev spec ─────────────────────────────────────
const STOPS = [
  { pos: 0.18, r: 255, g: 255, b: 255 }, // #FFFFFF  White
  { pos: 0.57, r: 120, g: 184, b: 249 }, // #78B8F9  Sky blue
  { pos: 0.60, r:  86, g: 103, b: 255 }, // #5667FF  Ultramarine
  { pos: 1.00, r:  77, g:  47, b: 249 }, // #4D2FF9  Iris
];

const ANGLE_DEG = 32;  // base stripe angle
const WAVE      = 14;  // cross-axis wave amount
const RENDER    = 256; // internal canvas res (scaled up by CSS)
const FPS_CAP   = 30;  // 30 fps is plenty for a smooth gradient shift

/** Lerp the colour stops at position t ∈ [0,1] */
function sample(t: number) {
  const c = Math.max(0, Math.min(1, t));
  if (c <= STOPS[0].pos) return STOPS[0];
  for (let i = 1; i < STOPS.length; i++) {
    if (c <= STOPS[i].pos) {
      const a = STOPS[i - 1], b = STOPS[i];
      const f = (c - a.pos) / (b.pos - a.pos);
      return { r: a.r + (b.r - a.r) * f, g: a.g + (b.g - a.g) * f, b: a.b + (b.b - a.b) * f };
    }
  }
  return STOPS[STOPS.length - 1];
}

interface Props { className?: string }

/**
 * Canvas-driven animated stripe gradient.
 *
 * Implements the 21st.dev "그라데이션" ribbon-field spec:
 *   ph = t * 1.00,  amt = 0.00,  dir = 1,  spin = ph * dir
 *   angle_eff = angle + sin(spin * 0.6) * 28 * amt   (amt=0 → static angle)
 *   wave_clock = 20.75 + ph * 1.2
 *   wave_offset = (wave/100) * 0.35 * sin(cross * 2.4 * 2π + wave_clock)
 *   t_grad = (along + wave_offset + 1) / 2
 *
 * All modulations are exactly 0 at ph=0 (cos–1 / sin+offset form), so there
 * is no gradient snap on mount. Values are never rounded per-frame.
 */
export function AnimatedStripeGradient({ className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    canvas.width  = RENDER;
    canvas.height = RENDER;
    const ctx  = canvas.getContext('2d')!;
    const img  = ctx.createImageData(RENDER, RENDER);
    const data = img.data;

    const angleRad = (ANGLE_DEG * Math.PI) / 180;
    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const TWO_PI       = 2 * Math.PI;
    const FRAME_MS     = 1000 / FPS_CAP;
    const WAVE_FACTOR  = (WAVE / 100) * 0.35;
    const CROSS_FREQ   = 2.4 * TWO_PI;

    let startMs: number | null = null;
    let lastMs  = 0;
    let rafId   = 0;

    function draw(ms: number) {
      rafId = requestAnimationFrame(draw);
      if (ms - lastMs < FRAME_MS) return;   // throttle to 30 fps
      lastMs = ms;

      if (startMs === null) startMs = ms;
      const ph    = (ms - startMs) / 1000;  // elapsed seconds — exact float
      const clock = 20.75 + ph * 1.2;       // advancing wave clock

      for (let y = 0; y < RENDER; y++) {
        for (let x = 0; x < RENDER; x++) {
          // Normalise to [-1, 1]
          const nx = (x / (RENDER - 1)) * 2 - 1;
          const ny = (y / (RENDER - 1)) * 2 - 1;

          // Stripe-axis projections
          const along = nx * cosA + ny * sinA;
          const cross = -nx * sinA + ny * cosA;

          // Wave bend: zero at ph=0 because sin() starts at its natural phase
          const waveOff = WAVE_FACTOR * Math.sin(cross * CROSS_FREQ + clock);

          // Gradient position [0, 1] — no rounding
          const t = (along + waveOff + 1) * 0.5;

          const c = sample(t);
          const i = (y * RENDER + x) * 4;
          data[i]     = c.r;
          data[i + 1] = c.g;
          data[i + 2] = c.b;
          data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={ref}
      className={`absolute inset-0 w-full h-full ${className ?? ''}`}
      style={{ imageRendering: 'smooth' }}
    />
  );
}
