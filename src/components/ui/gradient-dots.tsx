'use client';

import React from 'react';
import { motion } from 'framer-motion';

type GradientDotsProps = React.ComponentProps<typeof motion.div> & {
  /** Dot radius in px (default: 1) */
  dotRadius?: number;
  /** Spacing between dot centres in px (default: 20) */
  spacing?: number;
  /** How visible the dots are 0–1 (default: 0.18) */
  dotOpacity?: number;
  /** Colour shift cycle duration in seconds (default: 14) */
  colorCycleDuration?: number;
  /** Drift / position animation duration in seconds (default: 60) */
  driftDuration?: number;
};

/**
 * Premium dot-grid overlay with a slow-drifting site-palette colour wash.
 * Place absolutely inside a relative container. Keep the wrapper opacity
 * low (e.g. 0.55–0.75) for a subtle effect.
 */
export function GradientDots({
  dotRadius = 1,
  spacing = 20,
  dotOpacity = 0.18,
  colorCycleDuration = 14,
  driftDuration = 60,
  className,
  style,
  ...props
}: GradientDotsProps) {
  const d = dotRadius * 2;
  const dotColor = `rgba(255,255,255,${dotOpacity})`;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none ${className ?? ''}`}>
      {/* ── Layer 1: Static white hexagonal dot grid ────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle ${dotRadius}px at ${dotRadius}px ${dotRadius}px, ${dotColor} 100%, transparent 100%),
            radial-gradient(circle ${dotRadius}px at ${spacing / 2 + dotRadius}px ${spacing * 0.866 + dotRadius}px, ${dotColor} 100%, transparent 100%)
          `,
          backgroundSize: `${spacing}px ${spacing * 1.732}px`,
          backgroundPosition: '0 0',
        }}
      />

      {/* ── Layer 2: Slow-drifting coloured blobs (site palette) ─────── */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 60% at 20% 30%, rgba(139,92,246,0.22), transparent),
            radial-gradient(ellipse 55% 55% at 80% 70%, rgba(34,211,238,0.18), transparent),
            radial-gradient(ellipse 50% 50% at 55% 20%, rgba(168,85,247,0.14), transparent),
            radial-gradient(ellipse 45% 45% at 30% 80%, rgba(56,189,248,0.12), transparent)
          `,
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: [
            '0% 0%',
            '100% 50%',
            '50% 100%',
            '0% 50%',
            '0% 0%',
          ],
          filter: ['hue-rotate(0deg)', 'hue-rotate(40deg)', 'hue-rotate(-20deg)', 'hue-rotate(0deg)'],
        }}
        transition={{
          backgroundPosition: {
            duration: driftDuration,
            ease: 'linear',
            repeat: Infinity,
          },
          filter: {
            duration: colorCycleDuration,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'mirror',
          },
        }}
        {...props}
      />

      {/* ── Layer 3: Slow diagonal shimmer sweep ──────────────────────── */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,255,255,0.03) 40%,
            rgba(200,180,255,0.06) 50%,
            rgba(255,255,255,0.03) 60%,
            transparent 100%
          )`,
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['200% 0%', '-200% 0%'],
        }}
        transition={{
          duration: 8,
          ease: 'linear',
          repeat: Infinity,
          repeatDelay: 4,
        }}
      />
    </div>
  );
}
