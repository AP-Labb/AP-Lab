"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronDown, 
  Play, 
  FileText, 
  CheckCircle2, 
  ArrowLeft,
  Trophy,
  Brain,
  AlertCircle,
  Activity,
  XCircle,
  RotateCcw,
  User,
  Mail,
  GraduationCap,
  X,
  Check,
  BarChart2,
  Beaker,
  Dna,
  Leaf,
  Atom,
  Calculator,
  BarChart3,
  Code,
  Globe,
  History,
  BookOpen,
  TrendingUp
} from "lucide-react";

function getCourseIcon(slug: string) {
  switch (slug) {
    case "ap-biology": return Dna;
    case "ap-chemistry": return Beaker;
    case "ap-environmental-science":
    case "ap-environmental": return Leaf;
    case "ap-physics-1": return Atom;
    case "ap-calculus-bc":
    case "ap-calc-bc": return Calculator;
    case "ap-statistics":
    case "ap-stats": return BarChart3;
    case "ap-computer-science-a":
    case "ap-csa": return Code;
    case "ap-world-history": return Globe;
    case "ap-us-history":
    case "ap-ush": return History;
    case "ap-psychology":
    case "ap-psych": return Brain;
    case "ap-lang":
    case "ap-eng-lang": return BookOpen;
    case "ap-macroeconomics": return TrendingUp;
    default: return BookOpen;
  }
}
import { DashboardContextMenu } from "@/components/DashboardContextMenu";
import Link from "next/link";
import { courseRegistry, CourseUnit, CourseTopic } from "@/lib/courses/course-registry";
import { cn } from "@/lib/utils";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { LevelBadge } from "@/components/LevelBadge";
import { getLevelForXp, getXpThresholdForLevel } from "@/lib/xpProgression";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import confetti from "canvas-confetti";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { CourseThemeBackground } from "@/components/CourseThemeBackground";
import { AccountNavbarWidget } from "@/components/AccountNavbarWidget";
import { MockExam } from "@/components/MockExam";
import { AIAssistantDrawer } from "@/components/AIAssistantDrawer";
import { SelectionAIPopover } from "@/components/SelectionAIPopover";
import { VocabularyPopover } from "@/components/VocabularyPopover";
import { DiagramContainer } from "@/components/DiagramContainer";
import { playSuccessSound, playFailureSound } from "@/lib/sounds";
import { DesmosCalculatorModal } from "@/components/DesmosCalculatorModal";

function MagneticButton({ children, className, onClick, disabled, accentColor }: { children: React.ReactNode, className?: string, onClick?: () => void, disabled?: boolean, accentColor: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "relative group focus:outline-none focus:ring-2",
        className
      )}
      style={{
        // @ts-ignore
        "--tw-ring-color": `${accentColor}80`
      }}
    >
      <div 
        className="absolute inset-0 rounded-2xl blur-xl transition-all duration-300 pointer-events-none" 
        style={{
          backgroundColor: `${accentColor}10`
        }}
      />
      {children}
    </motion.button>
  );
}

function getRomanNumeral(n: number): string {
  const map: Record<number, string> = {
    1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
    6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X"
  };
  return map[n] || n.toString();
}

function getInsightLabel(slug: string) {
  if (slug === "ap-biology") return "Biological Insight";
  if (slug === "ap-chemistry") return "Chemical Insight";
  if (slug.includes("physics")) return "Physical Insight";
  if (slug === "ap-ush") return "Historical Insight";
  if (slug === "ap-psych") return "Psychological Insight";
  if (slug === "ap-eng-lang") return "Rhetorical Insight";
  if (slug === "ap-calc-bc") return "Mathematical Insight";
  if (slug === "ap-stats") return "Statistical Insight";
  if (slug === "ap-csa") return "Computational Insight";
  return "Academic Insight";
}

const getCourseNameFromSlug = (slug: string) => {
  const map: Record<string, string> = {
    "ap-physics-1": "AP Physics 1",
    "ap-world-history": "AP World History",
    "ap-macroeconomics": "AP Macroeconomics",
    "ap-environmental": "AP Environmental",
    "ap-physics-c": "AP Physics C",
    "ap-calc-bc": "AP Calculus BC",
    "ap-stats": "AP Statistics",
    "ap-csa": "AP Computer Science A",
    "ap-ush": "AP US History",
    "ap-psych": "AP Psychology",
    "ap-eng-lang": "AP English Language",
  };
  return map[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

interface RadarBlip {
  distance: number;
  angle: number;
  speed: number;
  intensity: number;
}

function RadarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Hardcode small canvas resolution for authentic pixelated rendering
    canvas.width = 256;
    canvas.height = 256;

    const cx = 128;
    const cy = 128;
    let sweepAngle = 0;

    // Setup blips with randomized starting states
    const blips: RadarBlip[] = [
      { distance: 115, angle: 0.6, speed: 0.15, intensity: 0 },
      { distance: 90, angle: 2.2, speed: 0.11, intensity: 0 },
      { distance: 65, angle: 3.7, speed: 0.13, intensity: 0 },
      { distance: 105, angle: 5.0, speed: 0.17, intensity: 0 },
      { distance: 45, angle: 1.1, speed: 0.09, intensity: 0 },
    ];

    let animationId: number;

    const render = () => {
      // Radial fade to create trails
      ctx.fillStyle = "rgba(1, 12, 1, 0.07)";
      ctx.fillRect(0, 0, 256, 256);

      // 1. Draw radar concentric circle grids (pixelated stroke)
      ctx.strokeStyle = "rgba(0, 180, 0, 0.16)";
      ctx.lineWidth = 1;

      // Vertical & horizontal lines through center
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, 256);
      ctx.moveTo(0, cy);
      ctx.lineTo(256, cy);
      ctx.stroke();

      // Concentric circles
      [35, 72, 108].forEach((radius) => {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 2. Update and render blips (incoming dots)
      blips.forEach((blip) => {
        // Move closer to center over time
        blip.distance -= blip.speed;
        
        // Loop seamlessly: reset when blips reach the center
        if (blip.distance < 6) {
          blip.distance = 115 + Math.random() * 10;
          blip.angle = Math.random() * Math.PI * 2;
          blip.speed = Math.random() * 0.10 + 0.12;
          blip.intensity = 0;
        }

        // Detect sweep line crossing the blip's angle to trigger ping
        const diff = Math.abs((sweepAngle % (Math.PI * 2)) - (blip.angle % (Math.PI * 2)));
        if (diff < 0.04) {
          blip.intensity = 1.0;
        }

        // Fade blip intensity
        blip.intensity *= 0.96;

        if (blip.intensity > 0.02) {
          const bx = cx + Math.cos(blip.angle) * blip.distance;
          const by = cy + Math.sin(blip.angle) * blip.distance;

          // Inner pixel core
          ctx.fillStyle = `rgba(0, 255, 0, ${blip.intensity})`;
          ctx.fillRect(Math.round(bx - 1.5), Math.round(by - 1.5), 3, 3);
          
          // Outer glow ring
          ctx.fillStyle = `rgba(0, 255, 0, ${blip.intensity * 0.28})`;
          ctx.fillRect(Math.round(bx - 2.5), Math.round(by - 2.5), 5, 5);
        }
      });

      // 3. Draw radar sweep line
      sweepAngle += 0.022;
      if (sweepAngle > Math.PI * 2) {
        sweepAngle -= Math.PI * 2;
      }

      // Draw phosphor sweep sector (trailing line sweeps)
      const trails = 20;
      for (let i = 0; i < trails; i++) {
        const trailAngle = sweepAngle - i * 0.015;
        const alpha = ((trails - i) / trails) * 0.22;
        ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx + Math.cos(trailAngle) * 120,
          cy + Math.sin(trailAngle) * 120
        );
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.24]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function ForestBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 256;
    canvas.height = 256;

    // Detailed large trees for 3 parallax layers (height, speed, colors, offset, spacing)
    const layers = [
      {
        speed: 0.15,
        height: 105,
        foliage: "#0e5c38",
        foliageHighlight: "#1b9d62",
        foliageShadow: "#073c24",
        trunk: "#2c1f17",
        offset: 0,
        spacing: 90
      },
      {
        speed: 0.08,
        height: 80,
        foliage: "#083822",
        foliageHighlight: "#0e5b38",
        foliageShadow: "#052014",
        trunk: "#1b140f",
        offset: 60,
        spacing: 75
      },
      {
        speed: 0.03,
        height: 60,
        foliage: "#051b11",
        foliageHighlight: "#082c1b",
        foliageShadow: "#03110b",
        trunk: "#0e0b09",
        offset: 130,
        spacing: 60
      }
    ];

    const leaves = Array.from({ length: 15 }, () => ({
      x: Math.random() * 256,
      y: Math.random() * 256,
      speedY: 0.35 + Math.random() * 0.4,
      speedX: -0.15 + Math.random() * 0.3
    }));

    let animId: number;

    const drawPixelTree = (
      rx: number,
      ry: number,
      height: number,
      foliageColor: string,
      shadowColor: string,
      highlightColor: string,
      trunkColor: string
    ) => {
      const trunkW = Math.max(3, Math.round(height * 0.08));
      const trunkH = Math.round(height * 0.35);
      const foliageH = height - trunkH;
      
      // 1. Draw trunk with bark texture (vertical stripes)
      ctx.fillStyle = trunkColor;
      ctx.fillRect(rx - Math.floor(trunkW / 2), ry - trunkH, trunkW, trunkH);
      
      // Left highlight stripe
      ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
      ctx.fillRect(rx - Math.floor(trunkW / 2), ry - trunkH, Math.max(1, Math.floor(trunkW / 3)), trunkH);
      
      // Right shadow stripe
      ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
      ctx.fillRect(rx + Math.floor(trunkW / 2) - Math.max(1, Math.floor(trunkW / 3)), ry - trunkH, Math.max(1, Math.floor(trunkW / 3)), trunkH);

      // 2. Draw Pine Foliage (layered triangles with jagged edges)
      // 3 overlapping tiers.
      const tiers = 3;
      const tierH = foliageH / tiers;
      
      for (let t = 0; t < tiers; t++) {
        const tierBottomY = ry - trunkH - t * (tierH * 0.75);
        const tierTopY = tierBottomY - tierH;
        
        // Width of this tier
        const maxW = height * 0.45 * (1 - t * 0.28);
        
        // Draw jagged foliage for this tier row-by-row
        const step = 2; // pixel block size
        for (let py = Math.round(tierTopY); py <= Math.round(tierBottomY); py += step) {
          const progress = (py - tierTopY) / (tierBottomY - tierTopY);
          const rowW = maxW * (0.2 + progress * 0.8);
          
          const rxStart = rx - rowW / 2;
          const rxEnd = rx + rowW / 2;
          
          // Draw base foliage row
          ctx.fillStyle = foliageColor;
          ctx.fillRect(Math.round(rxStart), py, Math.round(rowW), step);
          
          // Add jagged branch tips at the edges
          if (py % 4 === 0) {
            ctx.fillRect(Math.round(rxStart - 2), py, 2, step);
            ctx.fillRect(Math.round(rxEnd), py, 2, step);
          }
          
          // Highlight on the top-left edge
          ctx.fillStyle = highlightColor;
          ctx.fillRect(Math.round(rxStart), py, Math.max(1, Math.round(rowW * 0.22)), step);
          
          // Shadow on the bottom-right edge
          ctx.fillStyle = shadowColor;
          ctx.fillRect(Math.round(rxEnd - Math.max(1, Math.round(rowW * 0.35))), py, Math.max(1, Math.round(rowW * 0.35)), step);
        }
      }
    };

    const render = () => {
      // Clear the canvas completely (no-smear)
      ctx.fillStyle = "#010801";
      ctx.fillRect(0, 0, 256, 256);

      // Draw starry sky
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      for (let i = 0; i < 15; i++) {
        const sx = (Math.sin(i * 12345) * 0.5 + 0.5) * 256;
        const sy = (Math.cos(i * 54321) * 0.5 + 0.5) * 120;
        ctx.fillRect(Math.round(sx), Math.round(sy), 1, 1);
      }

      // Draw layers of detailed trees
      layers.forEach((layer) => {
        layer.offset -= layer.speed;
        if (layer.offset < -256) layer.offset += 256;

        for (let x = layer.offset - 40; x < 256 + 80; x += layer.spacing) {
          const rx = Math.round(x);
          const ry = 220; // Ground line
          
          drawPixelTree(
            rx,
            ry,
            layer.height,
            layer.foliage,
            layer.foliageShadow,
            layer.foliageHighlight,
            layer.trunk
          );
        }
      });

      // Draw ground
      ctx.fillStyle = "#05180f";
      ctx.fillRect(0, 220, 256, 36);
      ctx.fillStyle = "#083822";
      ctx.fillRect(0, 220, 256, 4);
      // Add pixelated grass details on ground
      ctx.fillStyle = "#1b9d62";
      for (let gx = 0; gx < 256; gx += 8) {
        ctx.fillRect(gx + (Math.floor(gx * 0.7) % 4), 218, 2, 2);
      }

      // Leaves falling
      ctx.fillStyle = "#34d399";
      leaves.forEach((l) => {
        l.y += l.speedY;
        l.x += l.speedX;
        if (l.y > 256) {
          l.y = -5;
          l.x = Math.random() * 256;
        }
        ctx.fillRect(Math.round(l.x), Math.round(l.y), 2, 2);
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.24]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function PhysicsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 256;
    canvas.height = 256;

    let time = 0;
    let animId: number;

    const render = () => {
      ctx.fillStyle = "rgba(1, 1, 10, 0.12)";
      ctx.fillRect(0, 0, 256, 256);

      // Draw gravity grid warping
      ctx.strokeStyle = "rgba(129, 140, 248, 0.08)";
      ctx.lineWidth = 1;
      const step = 32;
      for (let x = 0; x <= 256; x += step) {
        ctx.beginPath();
        for (let y = 0; y <= 256; y += 4) {
          const dx = x - 128;
          const dy = y - 128;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const warp = Math.min(16, 260 / (dist + 16));
          const wx = x - (dx / (dist + 0.1)) * warp;
          const wy = y - (dy / (dist + 0.1)) * warp;
          if (y === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      }
      for (let y = 0; y <= 256; y += step) {
        ctx.beginPath();
        for (let x = 0; x <= 256; x += 4) {
          const dx = x - 128;
          const dy = y - 128;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const warp = Math.min(16, 260 / (dist + 16));
          const wx = x - (dx / (dist + 0.1)) * warp;
          const wy = y - (dy / (dist + 0.1)) * warp;
          if (x === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.stroke();
      }

      // Orbiting particles
      time += 0.015;
      const orbits = [
        { rx: 65, ry: 25, speed: 1.2, color: "rgba(129, 140, 248, 0.7)", rot: 0.4 },
        { rx: 95, ry: 35, speed: 0.8, color: "rgba(167, 139, 250, 0.7)", rot: -0.6 }
      ];

      orbits.forEach((orb) => {
        const theta = time * orb.speed;
        const ox = Math.cos(theta) * orb.rx;
        const oy = Math.sin(theta) * orb.ry;

        // Apply rotation to ellipse orbit path
        const rx = 128 + ox * Math.cos(orb.rot) - oy * Math.sin(orb.rot);
        const ry = 128 + ox * Math.sin(orb.rot) + oy * Math.cos(orb.rot);

        // Draw orbital trail path
        ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
        ctx.beginPath();
        ctx.ellipse(128, 128, orb.rx, orb.ry, orb.rot, 0, Math.PI * 2);
        ctx.stroke();

        // Draw particle core
        ctx.fillStyle = orb.color;
        ctx.fillRect(Math.round(rx - 1.5), Math.round(ry - 1.5), 3, 3);
      });

      // Nuclear core
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.fillRect(126, 126, 4, 4);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.24]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function HistoryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Highly detailed pixelated map of the world (80 columns x 19 rows)
    const mapData = [
      "                       ...........                                              ",
      "                  .  .............                                       ....   ",
      "  .  ....     ...... .............                 .    ..        ............. ",
      " .......    ........  ...........                 ..   ...       .............. ",
      ".........  ..........   .......         .       ....  ....      ................",
      ".........  ..........    .....                 ..........      ................ ",
      " ........  .........      .                   ..........     .................. ",
      "  ......   .......                           ... ........     ..............     ",
      "   ....    .....                            ...........     ..............      ",
      "    .     ......                            ..........       ...........        ",
      "          .......                           .........         .........         ",
      "         .........                           .......          .......   .       ",
      "         .........                           ......            ....      .      ",
      "          .......                            .....             ..               ",
      "          ......                             ....               .      ......   ",
      "           ....                               ..                      ........  ",
      "           ...                                 .                      ........  ",
      "            .                                                          ......   ",
      "                                                                          .     "
    ];

    canvas.width = 256;
    canvas.height = 256;

    let scrollX = 0;
    let scanY = 0;
    let animId: number;

    const render = () => {
      // Historical dark brown parchment/satellite radar bg
      ctx.fillStyle = "rgba(12, 6, 2, 0.14)";
      ctx.fillRect(0, 0, 256, 256);

      // Draw grid lines
      ctx.strokeStyle = "rgba(245, 158, 11, 0.02)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= 256; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 256);
        ctx.stroke();
      }
      for (let y = 0; y <= 256; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }

      // Scroll world map
      scrollX += 0.35;
      if (scrollX >= 256) scrollX -= 256;

      const scaleX = 3.2; // 256 width / 80 columns
      const scaleY = 3.8;
      const startY = 85;

      // Draw pixel map
      ctx.fillStyle = "rgba(245, 158, 11, 0.16)";
      for (let r = 0; r < mapData.length; r++) {
        const row = mapData[r];
        for (let c = 0; c < row.length; c++) {
          if (row[c] === ".") {
            const x1 = Math.round((c * scaleX + scrollX) % 256);
            const y1 = Math.round(startY + r * scaleY);
            ctx.fillRect(x1, y1, 2.5, 2.5);
          }
        }
      }

      // Blinking research indicators at historical centers
      const pulse = Math.floor(Date.now() / 350) % 2 === 0;
      if (pulse) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
        const dots = [
          { cx: 14, cy: 5 },  // North America (East Coast)
          { cx: 48, cy: 4 },  // Western Europe
          { cx: 48, cy: 7 },  // Egypt / Middle East
          { cx: 66, cy: 5 }   // East Asia
        ];
        dots.forEach((dot) => {
          const dx = Math.round((dot.cx * scaleX + scrollX) % 256);
          const dy = Math.round(startY + dot.cy * scaleY);
          ctx.fillRect(dx - 1, dy - 1, 3, 3);
        });
      }

      // Scanning radar line
      scanY += 1.25;
      if (scanY > 256) scanY = 0;
      ctx.strokeStyle = "rgba(245, 158, 11, 0.08)";
      ctx.beginPath();
      ctx.moveTo(0, Math.round(scanY));
      ctx.lineTo(256, Math.round(scanY));
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.24]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function EconomicsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 256;
    canvas.height = 256;

    // Set up initial candles
    const candles = Array.from({ length: 16 }, (_, i) => {
      const open = 110 + Math.sin(i * 0.5) * 30 + Math.random() * 10;
      const close = open + (Math.random() - 0.5) * 20;
      return {
        x: i * 18 + 10,
        open,
        close,
        high: Math.max(open, close) + Math.random() * 8,
        low: Math.min(open, close) - Math.random() * 8
      };
    });

    let animId: number;

    const render = () => {
      ctx.fillStyle = "rgba(1, 8, 1, 0.12)";
      ctx.fillRect(0, 0, 256, 256);

      // Draw grid lines
      ctx.strokeStyle = "rgba(16, 185, 129, 0.03)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= 256; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 256);
        ctx.stroke();
      }
      for (let y = 0; y <= 256; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
      }

      // Shift candles left
      candles.forEach((c) => {
        c.x -= 0.35;
      });

      // Wrap-around candles
      if (candles[0].x < -15) {
        candles.shift();
        const last = candles[candles.length - 1];
        const lastOpen = last.close;
        const nextClose = lastOpen + (Math.random() - 0.48) * 24; // slight upward trend
        const nextHigh = Math.max(lastOpen, nextClose) + Math.random() * 10;
        const nextLow = Math.min(lastOpen, nextClose) - Math.random() * 10;
        
        candles.push({
          x: last.x + 18,
          open: lastOpen,
          close: nextClose,
          high: Math.min(230, Math.max(20, nextHigh)),
          low: Math.min(230, Math.max(20, nextLow))
        });
      }

      // Draw candles
      candles.forEach((c) => {
        const isUp = c.close >= c.open;
        ctx.strokeStyle = isUp ? "rgba(16, 185, 129, 0.28)" : "rgba(239, 68, 68, 0.28)";
        ctx.fillStyle = isUp ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)";
        ctx.lineWidth = 1.5;

        // Wick
        ctx.beginPath();
        ctx.moveTo(Math.round(c.x), Math.round(c.low));
        ctx.lineTo(Math.round(c.x), Math.round(c.high));
        ctx.stroke();

        // Body
        const top = Math.min(c.open, c.close);
        const bottom = Math.max(c.open, c.close);
        const h = Math.max(2, bottom - top);
        ctx.fillRect(Math.round(c.x - 4), Math.round(top), 8, Math.round(h));
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.24]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function UpcomingCourseFallback({ slug }: { slug: string }) {
  const courseName = getCourseNameFromSlug(slug);

  let Background = RadarBackground;
  let themeBg = "bg-[#010601]";
  let ambientColor = "bg-green-500/[0.03]";

  if (slug === "ap-environmental") {
    Background = ForestBackground;
    themeBg = "bg-[#010801]";
    ambientColor = "bg-emerald-500/[0.04]";
  } else if (slug === "ap-physics-1" || slug === "ap-physics-c") {
    Background = PhysicsBackground;
    themeBg = "bg-[#01020d]";
    ambientColor = "bg-indigo-500/[0.04]";
  } else if (slug === "ap-world-history") {
    Background = HistoryBackground;
    themeBg = "bg-[#0a0501]";
    ambientColor = "bg-amber-500/[0.03]";
  } else if (slug === "ap-macroeconomics") {
    Background = EconomicsBackground;
    themeBg = "bg-[#010601]";
    ambientColor = "bg-green-500/[0.03]";
  }

  return (
    <div className={`min-h-screen ${themeBg} text-white flex flex-col font-sans relative overflow-hidden select-none`}>
      {/* Dynamic themed pixelated background */}
      <Background />

      {/* Dynamic ambient lighting */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${ambientColor} blur-[160px] rounded-full pointer-events-none`} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 z-10 text-center">
        <div className="flex flex-col items-center max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 rounded-[32px] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Animated pulsing activity radar icon */}
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
            <Activity className="w-7 h-7 text-white/80 animate-pulse" />
          </div>

          <span className="text-[10px] font-manrope font-black text-white/40 uppercase tracking-[0.25em] mb-4">
            {courseName}
          </span>

          <h1 className="font-instrument text-4xl md:text-5xl text-white font-medium tracking-tight mb-4 leading-tight">
            We are working on creating this course
          </h1>

          <p className="font-inter text-white/50 text-sm md:text-base leading-relaxed max-w-md mb-10">
            We are actively creating the curriculum for this course.
          </p>

          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3.5 rounded-full bg-white text-black font-manrope font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all shadow-[0_8px_30px_rgba(255,255,255,0.15)]"
            >
              Go Back to Home Page
            </motion.button>
          </Link>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="h-16 flex items-center justify-center px-8 z-10">
        <span className="text-xs text-white/20 font-mono">
          © {new Date().getFullYear()} AP Lab. All rights reserved.
        </span>
      </footer>
    </div>
  );
}

interface UnitBannerBackgroundProps {
  slug: string;
  unitId: number;
  accentColor: string;
}

function UnitBannerBackground({ slug, unitId, accentColor }: UnitBannerBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const unitIdRef = useRef(unitId);

  useEffect(() => {
    unitIdRef.current = unitId;
  }, [unitId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 480;
    canvas.height = 160;

    let animId: number;
    let frame = 0;

    const seedRandom = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return () => {
        const x = Math.sin(hash++) * 10000;
        return x - Math.floor(x);
      };
    };

    const rng = seedRandom(slug);
    const particles: any[] = [];

    if (slug === "ap-biology") {
      const labels = ["DNA", "RNA", "ATP", "CELL"];
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: rng() * canvas.width,
          y: rng() * canvas.height,
          size: 2 + rng() * 3,
          speedY: 0.15 + rng() * 0.35,
          speedX: -0.15 + rng() * 0.3,
          color: rng() > 0.5 ? "rgba(34, 197, 94, 0.55)" : "rgba(16, 185, 129, 0.45)",
          wiggleSpeed: 0.02 + rng() * 0.03,
          seed: rng() * 100,
          text: rng() > 0.7 ? labels[Math.floor(rng() * labels.length)] : null
        });
      }
    } else if (slug === "ap-chemistry") {
      const elements = ["H", "C", "O", "N", "Na", "Cl", "Fe", "Cu"];
      const formulas = ["H2O", "CO2", "NaCl", "HCl", "NH3", "CH4"];
      
      // Floating flasks/beakers
      for (let i = 0; i < 4; i++) {
        particles.push({
          type: "beaker",
          x: 50 + rng() * (canvas.width - 100),
          y: 40 + rng() * (canvas.height - 80),
          size: 14 + rng() * 6,
          speedX: -0.15 + rng() * 0.3,
          speedY: -0.1 + rng() * 0.2,
          color: rng() > 0.5 ? "rgba(0, 242, 255, 0.65)" : "rgba(59, 130, 246, 0.55)"
        });
      }

      // Floating elements/formulas
      for (let i = 0; i < 8; i++) {
        const isFormula = rng() > 0.5;
        particles.push({
          type: isFormula ? "formula" : "element",
          x: rng() * canvas.width,
          y: rng() * canvas.height,
          text: isFormula ? formulas[Math.floor(rng() * formulas.length)] : elements[Math.floor(rng() * elements.length)],
          speedX: -0.2 + rng() * 0.4,
          speedY: -0.2 + rng() * 0.4,
          color: "rgba(0, 242, 255, 0.6)"
        });
      }

      // Bubbling particles rising up
      for (let i = 0; i < 15; i++) {
        particles.push({
          type: "bubble",
          x: rng() * canvas.width,
          y: canvas.height + rng() * 20,
          size: 1.5 + rng() * 2,
          speedY: -0.3 - rng() * 0.5,
          speedX: -0.1 + rng() * 0.2,
          color: "rgba(0, 242, 255, 0.8)"
        });
      }
    } else if (slug === "ap-physics-c") {
      const formulas = ["F=ma", "E=mc²", "p=mv", "τ=rF", "Δp", "v=d/t"];
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: rng() * canvas.width,
          y: rng() * canvas.height,
          text: rng() > 0.5 ? formulas[Math.floor(rng() * formulas.length)] : null,
          angle: rng() * Math.PI * 2,
          speed: 0.01 + rng() * 0.02,
          radius: 15 + rng() * 30,
          cx: rng() * canvas.width,
          cy: rng() * canvas.height,
          size: 2 + rng() * 2,
          color: "rgba(129, 140, 248, 0.65)",
          vx: -0.2 + rng() * 0.4,
          vy: -0.2 + rng() * 0.4
        });
      }
    } else if (slug === "ap-ush") {
      const dates = ["1776", "1787", "1865", "1945", "USA"];
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: rng() * canvas.width,
          y: rng() * canvas.height,
          text: rng() > 0.4 ? dates[Math.floor(rng() * dates.length)] : null,
          size: 1.5 + rng() * 2,
          speedX: -0.1 - rng() * 0.2,
          color: rng() > 0.5 ? "rgba(251, 191, 36, 0.5)" : "rgba(245, 158, 11, 0.4)"
        });
      }
    } else if (slug === "ap-psych") {
      const brainTerms = ["Dopamine", "Serotonin", "CNS", "EEG", "Brain"];
      for (let i = 0; i < 14; i++) {
        particles.push({
          x: rng() * canvas.width,
          y: rng() * canvas.height,
          targetX: rng() * canvas.width,
          targetY: rng() * canvas.height,
          speed: 0.005 + rng() * 0.01,
          size: 2 + rng() * 2,
          text: rng() > 0.6 ? brainTerms[Math.floor(rng() * brainTerms.length)] : null,
          color: "rgba(168, 85, 247, 0.6)",
          pulseOffset: Math.floor(rng() * 120)
        });
      }
    } else if (slug === "ap-eng-lang") {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ?,!;:\"'".split("");
      const words = ["LOGOS", "PATHOS", "ETHOS", "SOAPSTone", "Rhetoric"];
      for (let i = 0; i < 20; i++) {
        const isWord = rng() > 0.8;
        particles.push({
          x: rng() * canvas.width,
          y: rng() * canvas.height,
          char: isWord ? words[Math.floor(rng() * words.length)] : chars[Math.floor(rng() * chars.length)],
          isWord: isWord,
          speedY: 0.2 + rng() * 0.35,
          color: rng() > 0.5 ? "rgba(251, 113, 133, 0.55)" : "rgba(244, 63, 94, 0.45)"
        });
      }
    } else if (slug === "ap-calc-bc") {
      const mathSymbols = ["dx", "dy", "∫", "Σ", "π", "lim", "f(x)", "Δx", "∞"];
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: rng() * canvas.width,
          y: rng() * canvas.height,
          symbol: mathSymbols[Math.floor(rng() * mathSymbols.length)],
          speedY: -0.15 - rng() * 0.25,
          speedX: -0.1 + rng() * 0.2,
          color: rng() > 0.5 ? "rgba(52, 211, 153, 0.6)" : "rgba(16, 185, 129, 0.45)"
        });
      }
    } else if (slug === "ap-stats") {
      const statsTerms = ["μ", "σ", "x̄", "p-val", "z-score", "R²", "df"];
      for (let i = 0; i < 25; i++) {
        particles.push({
          x: rng() * canvas.width,
          y: rng() * canvas.height,
          text: rng() > 0.6 ? statsTerms[Math.floor(rng() * statsTerms.length)] : null,
          size: 2.5,
          speedX: -0.1 + rng() * 0.2,
          speedY: -0.05 + rng() * 0.1,
          color: rng() > 0.4 ? "rgba(56, 189, 248, 0.6)" : "rgba(14, 165, 233, 0.45)"
        });
      }
    } else if (slug === "ap-csa") {
      const codeKeywords = ["public", "class", "void", "main", "int", "for", "if", "while", "new", "null"];
      for (let i = 0; i < 22; i++) {
        const isWord = rng() > 0.75;
        particles.push({
          x: rng() * canvas.width,
          y: rng() * canvas.height,
          val: isWord ? codeKeywords[Math.floor(rng() * codeKeywords.length)] : (rng() > 0.5 ? "0" : "1"),
          isWord: isWord,
          speedY: 0.4 + rng() * 0.6,
          color: rng() > 0.5 ? "rgba(167, 139, 250, 0.6)" : "rgba(139, 92, 246, 0.45)"
        });
      }
    } else {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: rng() * canvas.width,
          y: rng() * canvas.height,
          targetX: rng() * canvas.width,
          targetY: rng() * canvas.height,
          speed: 0.005 + rng() * 0.01,
          size: 1.5 + rng() * 2
        });
      }
    }

    const render = () => {
      ctx.fillStyle = "#06060c";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      frame++;

      if (slug === "ap-biology") {
        // DNA horizontal double-helix waves
        ctx.strokeStyle = "rgba(34, 197, 94, 0.22)";
        ctx.lineWidth = 2;
        const amplitude = 22;
        const wavelength = 120;
        
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 4) {
          const y1 = canvas.height / 2 + Math.sin((x + frame * 0.8) / wavelength * Math.PI * 2) * amplitude;
          if (x === 0) ctx.moveTo(x, y1);
          else ctx.lineTo(x, y1);
        }
        ctx.stroke();

        ctx.strokeStyle = "rgba(16, 185, 129, 0.22)";
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 4) {
          const y2 = canvas.height / 2 - Math.sin((x + frame * 0.8) / wavelength * Math.PI * 2) * amplitude;
          if (x === 0) ctx.moveTo(x, y2);
          else ctx.lineTo(x, y2);
        }
        ctx.stroke();

        // Connectors
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        for (let x = 20; x < canvas.width; x += 24) {
          const y1 = canvas.height / 2 + Math.sin((x + frame * 0.8) / wavelength * Math.PI * 2) * amplitude;
          const y2 = canvas.height / 2 - Math.sin((x + frame * 0.8) / wavelength * Math.PI * 2) * amplitude;
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.stroke();
        }

        // Floating pixel cells
        particles.forEach((p) => {
          p.y += p.speedY;
          p.x += Math.sin(frame * p.wiggleSpeed + p.seed) * 0.15;
          if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
          }
          if (p.text) {
            ctx.save();
            ctx.fillStyle = "rgba(34, 197, 94, 0.65)";
            ctx.font = "bold 8px Courier New";
            ctx.fillText(p.text, Math.round(p.x), Math.round(p.y));
            ctx.restore();
          } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
          }
        });

      } else if (slug === "ap-chemistry") {
        particles.forEach((p) => {
          p.x += p.speedX || 0;
          p.y += p.speedY || 0;

          if (p.type === "bubble") {
            if (p.y < -10) {
              p.y = canvas.height + 10;
              p.x = Math.random() * canvas.width;
            }
          } else {
            if (p.x < -20) p.x = canvas.width + 20;
            if (p.x > canvas.width + 20) p.x = -20;
            if (p.y < -20) p.y = canvas.height + 20;
            if (p.y > canvas.height + 20) p.y = -20;
          }

          if (p.type === "beaker") {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.lineWidth = 1;
            
            // Draw beaker/flask body outline
            ctx.beginPath();
            ctx.moveTo(p.x - 3, p.y - 10);
            ctx.lineTo(p.x + 3, p.y - 10);
            ctx.moveTo(p.x - 2, p.y - 10);
            ctx.lineTo(p.x - 2, p.y - 3);
            ctx.lineTo(p.x - 8, p.y + 8);
            ctx.lineTo(p.x + 8, p.y + 8);
            ctx.lineTo(p.x + 2, p.y - 3);
            ctx.lineTo(p.x + 2, p.y - 10);
            ctx.stroke();

            // Draw liquid level inside the flask
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.moveTo(p.x - 5, p.y + 2);
            ctx.lineTo(p.x + 5, p.y + 2);
            ctx.lineTo(p.x + 7, p.y + 7);
            ctx.lineTo(p.x - 7, p.y + 7);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          } else if (p.type === "element") {
            ctx.save();
            ctx.strokeStyle = "rgba(0, 242, 255, 0.35)";
            ctx.lineWidth = 1;
            ctx.strokeRect(p.x - 8, p.y - 8, 16, 16);
            ctx.fillStyle = "rgba(0, 242, 255, 0.15)";
            ctx.fillRect(p.x - 8, p.y - 8, 16, 16);

            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.font = "bold 8px Courier New";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(p.text, p.x, p.y + 0.5);
            ctx.restore();
          } else if (p.type === "formula") {
            ctx.save();
            ctx.fillStyle = "rgba(0, 242, 255, 0.65)";
            ctx.font = "bold 8px Courier New";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(p.text, p.x, p.y);
            ctx.restore();
          } else if (p.type === "bubble") {
            ctx.fillStyle = p.color;
            ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
          }
        });

      } else if (slug === "ap-physics-c") {
        // Space-time warp grid lines
        ctx.strokeStyle = "rgba(129, 140, 248, 0.2)";
        ctx.lineWidth = 1;
        const spacing = 20;
        for (let gx = 0; gx < canvas.width; gx += spacing) {
          ctx.beginPath();
          for (let gy = 0; gy < canvas.height; gy += 4) {
            const dx = Math.sin((gy + frame) * 0.04) * 8 * Math.sin(gx * 0.01);
            if (gy === 0) ctx.moveTo(gx + dx, gy);
            else ctx.lineTo(gx + dx, gy);
          }
          ctx.stroke();
        }

        particles.forEach((p) => {
          p.x = p.cx + Math.cos(p.angle) * p.radius;
          p.y = p.cy + Math.sin(p.angle) * p.radius;
          p.angle += p.speed;

          p.cx += p.vx;
          p.cy += p.vy;
          if (p.cx < 0 || p.cx > canvas.width) p.vx *= -1;
          if (p.cy < 0 || p.cy > canvas.height) p.vy *= -1;

          // Vector arrows
          ctx.save();
          ctx.strokeStyle = "rgba(129, 140, 248, 0.5)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + Math.cos(p.angle + Math.PI/2) * 8, p.y + Math.sin(p.angle + Math.PI/2) * 8);
          ctx.stroke();

          ctx.fillStyle = p.color;
          ctx.fillRect(Math.round(p.x) - 1, Math.round(p.y) - 1, p.size, p.size);

          if (p.text) {
            ctx.fillStyle = "rgba(129, 140, 248, 0.7)";
            ctx.font = "bold 8px Courier New";
            ctx.fillText(p.text, p.x + 4, p.y + 3);
          }
          ctx.restore();
        });

      } else if (slug === "ap-ush") {
        ctx.fillStyle = "rgba(239, 68, 68, 0.08)"; // Red
        ctx.fillRect(0, 15, canvas.width, 25);
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)"; // White
        ctx.fillRect(0, 40, canvas.width, 25);
        ctx.fillStyle = "rgba(59, 130, 246, 0.08)"; // Blue
        ctx.fillRect(0, 65, canvas.width, 25);

        ctx.strokeStyle = "rgba(251, 191, 36, 0.22)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 12) {
          const y = 80 + Math.sin((x + frame * 0.5) / 80 + unitIdRef.current) * 15;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        particles.forEach((p) => {
          p.x += p.speedX;
          if (p.x < -30) {
            p.x = canvas.width + 30;
            p.y = Math.random() * canvas.height;
          }
          if (p.text) {
            ctx.save();
            ctx.fillStyle = "rgba(251, 191, 36, 0.65)";
            ctx.font = "bold 8px Courier New";
            ctx.fillText(p.text, p.x, p.y);
            ctx.restore();
          } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
          }
        });

      } else if (slug === "ap-psych") {
        // Synaptic network
        ctx.strokeStyle = "rgba(168, 85, 247, 0.22)";
        ctx.lineWidth = 1.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 70) {
              ctx.beginPath();
              ctx.moveTo(Math.round(particles[i].x), Math.round(particles[i].y));
              ctx.lineTo(Math.round(particles[j].x), Math.round(particles[j].y));
              ctx.stroke();
            }
          }
        }

        // EEG brainwaves
        ctx.strokeStyle = "rgba(168, 85, 247, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 6) {
          const y = 100 + Math.sin(x * 0.05 + frame * 0.1) * 15 * Math.cos(x * 0.01 + frame * 0.02);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        particles.forEach((p) => {
          p.x += (p.targetX - p.x) * p.speed;
          p.y += (p.targetY - p.y) * p.speed;
          if (Math.abs(p.x - p.targetX) < 2 && Math.abs(p.y - p.targetY) < 2) {
            p.targetX = Math.random() * canvas.width;
            p.targetY = Math.random() * canvas.height;
          }

          ctx.fillStyle = p.color;
          ctx.fillRect(Math.round(p.x) - 2, Math.round(p.y) - 2, 4, 4);

          const offset = p.pulseOffset || 0;
          if ((frame + offset) % 120 < 15) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
            ctx.fillRect(Math.round(p.x) - 3, Math.round(p.y) - 3, 6, 6);
          }

          if (p.text) {
            ctx.save();
            ctx.fillStyle = "rgba(168, 85, 247, 0.7)";
            ctx.font = "bold 8px Courier New";
            ctx.fillText(p.text, p.x + 6, p.y + 3);
            ctx.restore();
          }
        });

      } else if (slug === "ap-eng-lang") {
        ctx.font = "bold 8px Courier New";
        particles.forEach((p) => {
          p.y += p.speedY;
          if (p.y > canvas.height + 15) {
            p.y = -15;
            p.x = Math.random() * canvas.width;
          }
          ctx.fillStyle = p.color;
          if (p.isWord) {
            ctx.save();
            ctx.fillStyle = "rgba(251, 113, 133, 0.7)";
            ctx.fillText(p.char, Math.round(p.x), Math.round(p.y));
            ctx.restore();
          } else {
            ctx.fillText(p.char, Math.round(p.x), Math.round(p.y));
          }
        });

      } else if (slug === "ap-calc-bc") {
        ctx.font = "bold 8px Courier New";
        particles.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y < -12) {
            p.y = canvas.height + 12;
            p.x = Math.random() * canvas.width;
          }
          ctx.fillStyle = p.color;
          ctx.fillText(p.symbol, Math.round(p.x), Math.round(p.y));
        });

        // Riemann blocks
        ctx.fillStyle = "rgba(52, 211, 153, 0.15)";
        ctx.strokeStyle = "rgba(52, 211, 153, 0.35)";
        ctx.lineWidth = 1;

        const rectWidth = 14;
        const amplitude = 26;
        const frequency = 0.015;
        for (let x = 10; x < canvas.width - 10; x += rectWidth + 4) {
          const y = canvas.height / 2 + Math.sin(x * frequency + frame * 0.012) * amplitude;
          const rectHeight = (canvas.height / 2) - y;
          ctx.fillRect(x, y, rectWidth, rectHeight);
          ctx.strokeRect(x, y, rectWidth, rectHeight);
        }

        ctx.strokeStyle = "rgba(52, 211, 153, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 5) {
          const y = canvas.height / 2 + Math.sin(x * frequency + frame * 0.012) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

      } else if (slug === "ap-stats") {
        ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 4) {
          const dx = (x - canvas.width / 2) / 60;
          const y = canvas.height - 20 - Math.exp(-dx * dx) * 80;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
        ctx.beginPath();
        const startY = 120 + Math.sin(frame * 0.01) * 12;
        const endY = 40 + Math.cos(frame * 0.01) * 12;
        ctx.moveTo(10, startY);
        ctx.lineTo(canvas.width - 10, endY);
        ctx.stroke();

        particles.forEach((p) => {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < -10 || p.x > canvas.width + 10) p.speedX *= -1;
          if (p.y < -10 || p.y > canvas.height + 10) p.speedY *= -1;

          if (p.text) {
            ctx.save();
            ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
            ctx.font = "bold 9px Courier New";
            ctx.fillText(p.text, p.x, p.y);
            ctx.restore();
          } else {
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
          }
        });

      } else if (slug === "ap-csa") {
        ctx.font = "8px monospace";
        particles.forEach((p) => {
          p.y += p.speedY;
          if (p.y > canvas.height + 10) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
          }
          if (!p.isWord && frame % 30 === 0 && Math.random() > 0.7) {
            p.val = p.val === "0" ? "1" : "0";
          }
          ctx.fillStyle = p.color;
          if (p.isWord) {
            ctx.save();
            ctx.fillStyle = "rgba(167, 139, 250, 0.7)";
            ctx.fillText(p.val, Math.round(p.x), Math.round(p.y));
            ctx.restore();
          } else {
            ctx.fillText(p.val, Math.round(p.x), Math.round(p.y));
          }
        });
      } else {
        particles.forEach((p) => {
          p.x += (p.targetX - p.x) * p.speed;
          p.y += (p.targetY - p.y) * p.speed;
          if (Math.abs(p.x - p.targetX) < 2 && Math.abs(p.y - p.targetY) < 2) {
            p.targetX = Math.random() * canvas.width;
            p.targetY = Math.random() * canvas.height;
          }
          ctx.fillStyle = accentColor + "77";
          ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
        });

        ctx.strokeStyle = accentColor + "33";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 50) {
              ctx.beginPath();
              ctx.moveTo(Math.round(particles[i].x), Math.round(particles[i].y));
              ctx.lineTo(Math.round(particles[j].x), Math.round(particles[j].y));
              ctx.stroke();
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [slug, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-[0.82]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

export default function APDynamicCoursePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const course = courseRegistry[slug];
  
  const { progress, completeTopic } = useProgress();
  const { currentUser } = useAuth();
  
  const [activeUnit, setActiveUnit] = useState<number>(1);
  const [activeTopic, setActiveTopic] = useState<CourseTopic | null>(null);
  const [activeTab, setActiveTab] = useState<"video" | "article" | "practice">("video");
  const [expandedUnits, setExpandedUnits] = useState<number[]>([1]);
  const [expandedImage, setExpandedImage] = useState<{ src: string; isSvg?: boolean } | null>(null);
  const [isMobileSyllabusOpen, setIsMobileSyllabusOpen] = useState(false);
  const [showExam, setShowExam] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState("");
  const [topicInteracted, setTopicInteracted] = useState(false);
  const [tabInteracted, setTabInteracted] = useState(false);

  // Safely initialize active topic
  useEffect(() => {
    if (course && course.units.length > 0 && course.units[0].topics.length > 0) {
      setActiveTopic(course.units[0].topics[0]);
      setActiveUnit(course.units[0].id);
    }
  }, [course]);

  // Dynamic Browser Tab Title tracking course, unit number, and topic
  useEffect(() => {
    if (course) {
      const rawTitle = (course.title || course.name || "").replace(/^AP[®\s]*/i, "").trim();
      const courseTitle = `AP® ${rawTitle}`;
      if (activeTopic) {
        const unit = course.units.find(u => u.topics.some(t => t.id === activeTopic.id));
        if (unit) {
          const topicNum = activeTopic.id.startsWith(`${unit.id}.`) 
            ? activeTopic.id 
            : `${unit.id}.${activeTopic.id}`;
          document.title = `${courseTitle} - Unit ${topicNum}: ${activeTopic.title} | AP Lab`;
        } else {
          document.title = `${courseTitle} | AP Lab`;
        }
      } else {
        document.title = `${courseTitle} | AP Lab`;
      }
    }
  }, [course, activeTopic]);

  // Redirect unverified logged-in users
  useEffect(() => {
    if (currentUser && !currentUser.emailVerified) {
      router.push("/verify-email");
    }
  }, [currentUser, router]);

  if (!course) {
    return <UpcomingCourseFallback slug={slug} />;
  }

  if (currentUser && !currentUser.emailVerified) {
    return null;
  }

  const toggleUnit = (id: number) => {
    setExpandedUnits(prev => 
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const masteryKey = `${course.masteryPrefix}-${activeTopic?.id}`;
  const masteryScore = progress.masteryScores[masteryKey] || 0;
  const isLightMode = progress?.theme === "light";

  return (
    <div 
      className={cn(
        "min-h-screen flex flex-col relative z-0 selection:bg-white selection:text-black transition-colors duration-300",
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-deep-navy text-white"
      )}
      style={{
        // @ts-ignore
        "--theme-accent": course.accentColor,
        "--theme-accent-border": `${course.accentColor}4d`
      }}
    >
      {/* Inject custom variables for page accent coloring */}
      <style>{`
        .subject-accent-text { color: ${course.accentColor}; }
        .subject-accent-bg { background-color: ${course.accentColor}; }
        .subject-accent-border { border-color: ${course.accentColor}33; }
        .subject-accent-border-hover:hover { border-color: ${course.accentColor}66; }
        .subject-accent-bg-glow { background-color: ${course.accentColor}15; }
        .subject-accent-selection::selection {
          background-color: ${course.accentColor};
          color: #000000;
        }
      `}</style>

      {showExam && (
        <MockExam 
          units={course.units} 
          subjectName={course.name} 
          accentColor={course.accentColor}
          onClose={() => setShowExam(false)} 
        />
      )}

      <AnimatePresence>
        {expandedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setExpandedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
              onClick={() => setExpandedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            {expandedImage.isSvg ? (
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="max-w-[90vw] max-h-[90vh] overflow-hidden flex items-center justify-center p-8 bg-[#050508]/90 border border-white/10 rounded-xl shadow-2xl [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[80vh] [&>svg]:max-w-[80vw]"
                dangerouslySetInnerHTML={{ __html: expandedImage.src }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                src={expandedImage.src} 
                alt="Expanded view" 
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAccountPopup && (
          <AccountStatsModal
            course={course}
            progress={progress}
            currentUser={currentUser}
            onClose={() => setShowAccountPopup(false)}
          />
        )}
      </AnimatePresence>
      
      <AIAssistantDrawer 
        course={course.slug} 
        isOpen={isAssistantOpen} 
        onClose={() => setIsAssistantOpen(false)} 
        initialQuery={assistantQuery} 
      />
      
      <SelectionAIPopover onAsk={(text) => {
        setAssistantQuery(text);
        setIsAssistantOpen(true);
      }} />

      {/* Floating AP Lab Logo AI Toggle */}
      <div className="fixed bottom-8 right-8 z-[80]">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center border shadow-xl hover:scale-105 transition-all group cursor-pointer",
            isLightMode 
              ? "bg-slate-900 border-slate-700 text-white shadow-[0_10px_30px_rgba(15,23,42,0.3)]" 
              : "liquid-glass border-white/20 text-white shadow-[0_10px_40px_rgba(255,255,255,0.15)]"
          )}
          style={{
            boxShadow: isLightMode ? undefined : `0 10px 40px ${course.accentColor}33`
          }}
        >
          <Activity className={cn("w-8 h-8 transition-colors", isLightMode ? "text-white" : "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]")} />
        </button>
      </div>
      
      {/* Dynamic Course Page Background Theme */}
      {progress?.theme !== "light" && (
        <CourseThemeBackground 
          themeId={progress?.courseBg || "dark-matrix"} 
          accentColor={course.accentColor} 
        />
      )}

      {/* Header */}
      <header className={cn(
        "h-16 border-b flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300",
        isLightMode ? "bg-white/90 border-slate-200 text-slate-900 shadow-sm" : "border-white/5 bg-black/20 text-white"
      )}>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className={cn("p-2 rounded-full transition-colors", isLightMode ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : "text-white/50 hover:text-white hover:bg-white/5")}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className={cn("h-4 w-[1px]", isLightMode ? "bg-slate-200" : "bg-white/10")} />
          <div className="flex items-center space-x-3">
            <div 
              className={cn("w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-sm", isLightMode ? "bg-slate-100" : "bg-white/10")}
              style={{ borderColor: `${course.accentColor}40` }}
            >
              {(() => {
                const IconComp = getCourseIcon(course.slug);
                return <IconComp className="w-4 h-4" style={{ color: course.accentColor }} />;
              })()}
            </div>
            <div className="flex flex-col items-start">
              <h1 className={cn("font-instrument text-lg md:text-xl tracking-tight leading-tight", isLightMode ? "text-slate-900 font-semibold" : "text-white")}>
                {course.name}
              </h1>
              <button 
                onClick={() => setIsMobileSyllabusOpen(true)}
                className={cn("lg:hidden text-[10px] font-manrope font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5", isLightMode ? "text-slate-500 hover:text-slate-900" : "text-white/50 hover:text-white")}
              >
                <span>Topic {activeTopic?.id || "1.1"} (Change)</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
        <AccountNavbarWidget onOpenProfile={() => setShowAccountPopup(true)} />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation (With Backdrop Blur for Backgrounds) */}
        <aside className={cn(
          "w-80 border-r flex flex-col hidden lg:flex backdrop-blur-2xl transition-colors duration-300 z-10",
          isLightMode ? "bg-white/80 border-slate-200 text-slate-900 shadow-sm" : "border-white/10 bg-black/40 text-white"
        )}>
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-2">
            {course.units.map((unit) => {
              const isUnitCompleted = unit.topics.length > 0 && unit.topics.every(topic => 
                progress.completedTopics.includes(`${course.masteryPrefix}-${topic.id}`)
              );

              return (
                <div key={unit.id} className="space-y-1">
                  <button
                    onClick={() => toggleUnit(unit.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 relative overflow-hidden group",
                      activeUnit === unit.id ? (isLightMode ? "bg-slate-200/60" : "bg-white/5") : (isLightMode ? "hover:bg-slate-100" : "hover:bg-white/5")
                    )}
                  >
                    <div className="flex flex-col items-start text-left relative z-10">
                      <span className="text-[10px] font-manrope font-black uppercase tracking-widest mb-1 subject-accent-text flex items-center gap-1.5">
                        <span>Unit {unit.id} • {unit.masteryWeight}</span>
                        {isUnitCompleted && (
                          <span className={cn("text-[8px] px-1.5 py-0.5 rounded border font-black tracking-widest uppercase", isLightMode ? "bg-emerald-100 border-emerald-300 text-emerald-800" : "bg-white/10 border-white/15 text-white/90")}>
                            ✓ Done
                          </span>
                        )}
                      </span>
                      <span className={cn(
                        "text-sm font-medium leading-tight",
                        activeUnit === unit.id ? (isLightMode ? "text-slate-900 font-bold" : "text-white") : (isLightMode ? "text-slate-700" : "text-white/60")
                      )}>
                        {unit.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 relative z-10">
                      {expandedUnits.includes(unit.id) ? (
                        <ChevronDown className={cn("w-4 h-4", isLightMode ? "text-slate-400" : "text-white/40")} />
                      ) : (
                        <ChevronRight className={cn("w-4 h-4", isLightMode ? "text-slate-400" : "text-white/40")} />
                      )}
                    </div>

                    {/* Unit Roman Numeral Background decoration */}
                    <div 
                      className={cn(
                        "absolute right-4 bottom-0 text-5xl font-mono font-black transition-opacity duration-300 pointer-events-none select-none z-0 tracking-tighter leading-none",
                        isLightMode ? "opacity-45 font-extrabold" : "opacity-[0.08] group-hover:opacity-[0.16]"
                      )}
                      style={{ color: course.accentColor }}
                    >
                      {getRomanNumeral(unit.id)}
                    </div>
                  </button>

                <AnimatePresence>
                  {expandedUnits.includes(unit.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1"
                    >
                      <div className={cn("pl-2 pt-1 border-l ml-4 space-y-1", isLightMode ? "border-slate-200" : "border-white/5")}>
                        {unit.topics.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => {
                              setActiveTopic(topic);
                              setActiveUnit(unit.id);
                              setTopicInteracted(true);
                            }}
                            className={cn(
                              "w-full text-left p-3 pl-6 text-xs transition-colors rounded-r-lg relative",
                              activeTopic?.id === topic.id 
                                ? (isLightMode ? "bg-slate-200/80 font-bold text-slate-900" : "bg-white/5 text-white") 
                                : (isLightMode ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : "text-white/40 hover:text-white/60 hover:bg-white/5")
                            )}
                            style={{
                              color: activeTopic?.id === topic.id ? course.accentColor : undefined
                            }}
                          >
                            {activeTopic?.id === topic.id && (
                              <motion.div 
                                layoutId={topicInteracted ? "activeTopicDynamic" : undefined}
                                className="absolute left-0 top-0 bottom-0 w-[2px] subject-accent-bg"
                              />
                            )}
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <span className="font-manrope font-bold mr-2">{topic.id}</span>
                                {topic.title}
                              </div>
                              {progress.completedTopics.includes(`${course.masteryPrefix}-${topic.id}`) && (
                                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-2 subject-accent-text" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )})}
          </div>
          
          <div className="p-4 border-t border-white/5">
            <button 
              onClick={() => setShowExam(true)}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              style={{
                borderColor: `${course.accentColor}33`
              }}
            >
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 subject-accent-text" />
                <span className="text-sm font-bold text-white uppercase tracking-widest">Mock Exam</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white" />
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {activeTopic ? (
            <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-8">
              {/* Unit Header Banner Card */}
              <div className={cn(
                "relative w-full rounded-[24px] overflow-hidden p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-10 transition-colors duration-300",
                isLightMode ? "bg-white border border-slate-200 text-slate-900 shadow-md" : "border border-white/10 bg-black/40 text-white shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
              )}>
                {/* Pixel Background Banner (Only in Dark Mode) */}
                {!isLightMode && (
                  <div className="absolute inset-0 -z-10">
                    <UnitBannerBackground slug={course.slug} unitId={activeUnit} accentColor={course.accentColor} />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-black/25" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
                  </div>
                )}
                
                {/* Left: Breadcrumbs + Title + Description */}
                <div className="space-y-4 max-w-2xl relative z-20">
                  {/* Breadcrumbs */}
                  <div className={cn("flex items-center space-x-2 text-[10px] font-manrope font-black uppercase tracking-[0.2em]", isLightMode ? "text-slate-500" : "text-white/40")}>
                    <span>{course.name}</span>
                    <ChevronRight className={cn("w-3 h-3", isLightMode ? "text-slate-400" : "text-white/20")} />
                    <span className={isLightMode ? "text-slate-700" : "text-white/60"}>Unit {activeUnit}</span>
                    <ChevronRight className={cn("w-3 h-3", isLightMode ? "text-slate-400" : "text-white/20")} />
                    <span className="subject-accent-text font-bold">Topic {activeTopic.id}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className={cn("font-instrument text-3xl md:text-4xl tracking-tight leading-tight", isLightMode ? "text-slate-900 font-semibold" : "text-white")}>
                      {activeTopic.title}
                    </h2>
                    <p className={cn("font-inter text-xs md:text-sm leading-relaxed", isLightMode ? "text-slate-600 font-medium" : "text-white/60")}>
                      {activeTopic.description}
                    </p>
                  </div>
                </div>
                
                {/* Right: Mastery Progress */}
                <div className={cn(
                  "w-full md:w-64 space-y-3 p-4 rounded-xl border backdrop-blur-md shrink-0 relative z-20 transition-colors duration-300",
                  isLightMode ? "bg-slate-100 border-slate-200 text-slate-900 shadow-inner" : "bg-black/50 border-white/5 text-white"
                )}>
                  <div className="flex justify-between items-end">
                    <span className={cn("text-[10px] font-manrope font-black uppercase tracking-widest", isLightMode ? "text-slate-500" : "text-white/40")}>Topic Mastery</span>
                    <span className="text-sm font-instrument italic subject-accent-text font-bold">
                      {masteryScore}%
                    </span>
                  </div>
                  <div className={cn("h-2 w-full rounded-full overflow-hidden border", isLightMode ? "bg-slate-200 border-slate-300" : "bg-white/5 border-white/5")}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${masteryScore}%` }}
                      className="h-full subject-accent-bg"
                      style={{
                        boxShadow: `0 0 15px ${course.accentColor}4d`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Tab System */}
              <div className={cn(
                "flex items-center space-x-1 p-1 backdrop-blur-md rounded-2xl w-fit border transition-colors duration-300",
                isLightMode ? "bg-slate-200/80 border-slate-300 text-slate-800" : "bg-black/20 border-white/5 text-white"
              )}>
                {[
                  { id: "video", label: "Video", icon: Play },
                  { id: "article", label: "Article", icon: FileText },
                  { id: "practice", label: "Practice", icon: Brain }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setTabInteracted(true);
                    }}
                    className={cn(
                      "flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all relative",
                      activeTab === tab.id 
                        ? (isLightMode ? "text-slate-900 font-bold" : "text-white") 
                        : (isLightMode ? "text-slate-600 hover:text-slate-900" : "text-white/40 hover:text-white/60")
                    )}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId={tabInteracted ? "activeTabDynamic" : undefined}
                        className={cn("absolute inset-0 border shadow-sm rounded-xl", isLightMode ? "bg-white border-slate-300" : "bg-white/5 border-white/10")}
                      />
                    )}
                    <tab.icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  {activeTab === "video" && (
                    <motion.div
                      key={activeTopic.id + "_video"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="relative aspect-video w-full liquid-glass-strong rounded-[32px] overflow-hidden border border-white/10"
                    >
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${activeTopic.youtubeId}?rel=0&modestbranding=1&autohide=1&showinfo=0`}
                        title={activeTopic.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </motion.div>
                  )}

                  {activeTab === "article" && (
                    <motion.div
                      key={activeTopic.id + "_article"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-8 article-content-container"
                    >
                      {activeTopic.article.split("##").map((section, idx) => {
                        if (!section.trim()) return null;
                        const isFirst = idx === 0;
                        const fullSection = isFirst ? section : `## ${section}`;
                        const isExample = fullSection.toLowerCase().includes("example problem") || fullSection.toLowerCase().includes("example");
                        
                        const cleanHeader = (children: any): any => {
                          if (typeof children === 'string') {
                            return children.replace(/^[#\s\u00A0]+/, '').trim();
                          }
                          if (Array.isArray(children)) {
                            return children.map(c => cleanHeader(c));
                          }
                          return children;
                        };

                        return (
                          <div 
                            key={idx}
                            className={cn(
                              "rounded-[32px] p-8 md:p-12 border transition-all duration-500",
                              isLightMode 
                                ? (isExample ? "bg-slate-100 border-slate-300 shadow-md text-slate-900" : "bg-white border-slate-200 shadow-sm text-slate-900")
                                : (isExample ? "liquid-glass-strong bg-white/[0.02] border-white/20 shadow-xl text-white" : "liquid-glass-strong bg-white/5 border-white/10 text-white")
                            )}
                            style={isExample ? {
                              borderColor: `${course.accentColor}40`,
                              boxShadow: `0 0 50px ${course.accentColor}10`
                            } : undefined}
                          >
                            <div className={cn(
                              "max-w-none prose-headings:font-instrument prose-headings:font-normal prose-h1:text-4xl prose-h2:text-2xl prose-p:font-inter prose-p:leading-relaxed",
                              isLightMode ? "prose prose-slate text-slate-900 prose-p:text-slate-800 prose-headings:text-slate-900" : "prose prose-invert text-white prose-p:text-white/70 prose-headings:text-white"
                            )}>
                              <ReactMarkdown 
                                remarkPlugins={[remarkMath, remarkGfm]} 
                                rehypePlugins={[rehypeKatex, rehypeRaw]}
                                components={{
                                  h1: ({ node, children, ...props }: any) => <h1 {...props}>{cleanHeader(children)}</h1>,
                                  h2: ({ node, children, ...props }: any) => <h2 {...props}>{cleanHeader(children)}</h2>,
                                  h3: ({ node, children, ...props }: any) => <h3 {...props}>{cleanHeader(children)}</h3>,
                                  h4: ({ node, children, ...props }: any) => <h4 {...props}>{cleanHeader(children)}</h4>,
                                  h5: ({ node, children, ...props }: any) => <h5 {...props}>{cleanHeader(children)}</h5>,
                                  h6: ({ node, children, ...props }: any) => <h6 {...props}>{cleanHeader(children)}</h6>,
                                  // Custom vocab component handler in react-markdown
                                  // @ts-ignore
                                  vocab: ({ node, children, ...props }) => {
                                    const term = (props as any).term || "";
                                    const definition = (props as any).definition || "";
                                    return (
                                      <VocabularyPopover 
                                        term={term} 
                                        definition={definition}
                                        accentColor={course.accentColor}
                                        accentColorBorder={`${course.accentColor}4d`}
                                      >
                                        {children}
                                      </VocabularyPopover>
                                    );
                                  },
                                  img: ({ node, ...props }: any) => (
                                    <div 
                                      className="my-8 p-[1.5px] rounded-2xl max-w-2xl mx-auto shadow-xl animate-fade-in"
                                      style={{
                                        background: `linear-gradient(135deg, ${course.accentColor}66, transparent, ${course.accentColor}22)`
                                      }}
                                    >
                                      <div className="bg-[#050508]/90 backdrop-blur-md rounded-[15px] overflow-hidden border border-white/5 p-6 flex flex-col items-center justify-center">
                                        <img 
                                          {...props} 
                                          className="max-h-[350px] max-w-full object-contain rounded-lg cursor-zoom-in hover:scale-[1.01] transition-transform duration-300" 
                                          onClick={() => setExpandedImage(props.src ? { src: props.src } : null)}
                                        />
                                        {props.alt && (
                                          <p className="text-xs text-white/40 mt-3 text-center italic leading-relaxed border-t border-white/5 pt-2 w-full">
                                            {props.alt}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ),
                                  svg: ({ node, children, className, ...props }: any) => {
                                    // Bypass wrapping for KaTeX mathematical symbol SVGs (e.g. vector arrows/hats)
                                    const isMathSvg = 
                                      props["aria-hidden"] === "true" ||
                                      !className ||
                                      (!className.includes("max-w-") && !className.includes("w-") && !className.includes("bg-") && !className.includes("p-"));

                                    if (isMathSvg) {
                                      return (
                                        <svg {...props} className={className}>
                                          {children}
                                        </svg>
                                      );
                                    }

                                    const cleanClassName = className
                                      ? className
                                          .replace(/\bbg-black\/40\b/g, '')
                                          .replace(/\bbg-black\/30\b/g, '')
                                          .replace(/\bborder\b/g, '')
                                          .replace(/\bborder-white\/10\b/g, '')
                                          .replace(/\bp-4\b/g, '')
                                          .trim()
                                      : '';
                                    return (
                                      <div 
                                        className="my-8 p-[1.5px] rounded-2xl max-w-2xl mx-auto shadow-xl animate-fade-in"
                                        style={{
                                          background: `linear-gradient(135deg, ${course.accentColor}66, transparent, ${course.accentColor}22)`
                                        }}
                                      >
                                        <div 
                                          className="bg-[#050508]/90 backdrop-blur-md rounded-[15px] overflow-hidden border border-white/5 p-6 flex flex-col items-center justify-center cursor-zoom-in hover:scale-[1.01] transition-transform duration-300 w-full"
                                          onClick={(e) => {
                                            const svgEl = e.currentTarget.querySelector('svg');
                                            if (svgEl) {
                                              setExpandedImage({ src: svgEl.outerHTML, isSvg: true });
                                            }
                                          }}
                                        >
                                          <svg 
                                            {...props} 
                                            className={cn("max-h-[350px] max-w-full object-contain rounded-lg", cleanClassName)}
                                          >
                                            {children}
                                          </svg>
                                        </div>
                                      </div>
                                    );
                                  }
                                } as any}
                              >
                                {fullSection}
                              </ReactMarkdown>
                            </div>
                          </div>
                        );
                      })}
                      
                      {/* Visual Aids - Dynamic Rendering based on Topic Image */}
                      {activeTopic.image && (
                        <DiagramContainer 
                          title={activeTopic.title}
                          alt={activeTopic.title}
                          src={activeTopic.image}
                          caption={activeTopic.description}
                          accentColor={course.accentColor}
                          insightLabel={getInsightLabel(slug)}
                        />
                      )}
                    </motion.div>
                  )}

                  {activeTab === "practice" && (
                    <motion.div
                      key={activeTopic.id + "_practice"}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <PracticeSystem 
                        topicId={activeTopic.id}
                        masteryKey={masteryKey}
                        questions={activeTopic.questions.slice(0, 4)} 
                        accentColor={course.accentColor}
                        courseSlug={slug as string}
                        onComplete={(score) => completeTopic(masteryKey, score)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center text-white/40">Loading workspace...</div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Syllabus Drawer */}
      <AnimatePresence>
        {isMobileSyllabusOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSyllabusOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            {/* Drawer Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-full max-w-[320px] bg-[#0c0c0e] border-r border-white/10 p-6 flex flex-col justify-between shadow-[5px_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                  <span className="font-manrope font-bold text-white tracking-tight text-lg">Syllabus</span>
                  <button 
                    onClick={() => setIsMobileSyllabusOpen(false)}
                    className="p-1.5 rounded-full bg-white/5 text-white/60 hover:text-white border border-white/5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Units List */}
                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 pr-1">
                  {course.units.map((unit) => {
                    const isUnitCompleted = unit.topics.length > 0 && unit.topics.every(topic => 
                      progress.completedTopics.includes(`${course.masteryPrefix}-${topic.id}`)
                    );

                    return (
                      <div key={unit.id} className="space-y-1">
                        <button
                          onClick={() => toggleUnit(unit.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 relative overflow-hidden group",
                            activeUnit === unit.id ? "bg-white/5" : "hover:bg-white/5"
                          )}
                        >
                          <div className="flex flex-col items-start text-left relative z-10">
                            <span className="text-[10px] font-manrope font-black uppercase tracking-widest mb-1 subject-accent-text flex items-center gap-1.5">
                              <span>Unit {unit.id}</span>
                              {isUnitCompleted && (
                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-white/10 text-white/90">✓</span>
                              )}
                            </span>
                            <span className={cn(
                              "text-sm font-medium leading-tight",
                              activeUnit === unit.id ? "text-white" : "text-white/60"
                            )}>
                              {unit.title}
                            </span>
                          </div>
                          <ChevronDown className={cn("w-4 h-4 text-white/40 transition-transform", expandedUnits.includes(unit.id) && "rotate-180")} />
                        </button>

                        <AnimatePresence>
                          {expandedUnits.includes(unit.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden pl-4 space-y-1 border-l border-white/5 ml-4"
                            >
                              {unit.topics.map((topic) => {
                                const isCompleted = progress.completedTopics.includes(`${course.masteryPrefix}-${topic.id}`);
                                const isActive = activeTopic?.id === topic.id;

                                return (
                                  <button
                                    key={topic.id}
                                    onClick={() => {
                                      setActiveUnit(unit.id);
                                      setActiveTopic(topic);
                                      setShowExam(false);
                                      setIsMobileSyllabusOpen(false);
                                    }}
                                    className={cn(
                                      "w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors",
                                      isActive 
                                        ? "bg-white/10 text-white" 
                                        : "text-white/40 hover:text-white/60"
                                    )}
                                  >
                                    <div className="flex items-center space-x-2 truncate">
                                      <span className="font-mono font-bold">{topic.id}</span>
                                      <span className="truncate">{topic.title}</span>
                                    </div>
                                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 ml-2" />}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer inside Drawer */}
              <div className="pt-4 border-t border-white/5 mt-4">
                <button 
                  onClick={() => {
                    setShowExam(true);
                    setIsMobileSyllabusOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                >
                  <span className="text-xs font-bold uppercase tracking-widest">Mock Exam</span>
                  <Trophy className="w-4 h-4 subject-accent-text" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <DashboardContextMenu onOpenProfile={() => setShowAccountPopup(true)} />
    </div>
  );
}

interface PracticeProps {
  topicId: string;
  masteryKey: string;
  questions: any[];
  accentColor: string;
  courseSlug?: string;
  onComplete: (score: number) => void;
}

function PracticeSystem({ topicId, masteryKey, questions, accentColor, courseSlug, onComplete }: PracticeProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasRewarded, setHasRewarded] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const lastTopicIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (lastTopicIdRef.current === topicId) return;
    lastTopicIdRef.current = topicId;

    if (!questions || questions.length === 0) {
      setShuffledQuestions([]);
      return;
    }

    const shuffled = questions.map((q) => {
      // Create options with their original index so we can trace which one was correct
      const optionsWithIndex = q.options.map((opt: string, index: number) => ({
        opt,
        isCorrect: index === q.correctIndex,
      }));

      // Fisher-Yates shuffle options
      const shuffledOpts = [...optionsWithIndex];
      for (let i = shuffledOpts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOpts[i], shuffledOpts[j]] = [shuffledOpts[j], shuffledOpts[i]];
      }

      // Find the new index of the correct option
      const newCorrectIndex = shuffledOpts.findIndex((item) => item.isCorrect);

      return {
        ...q,
        options: shuffledOpts.map((item) => item.opt),
        correctIndex: newCorrectIndex,
      };
    });

    // Fisher-Yates shuffle the list of questions
    const shuffledQuestionsList = [...shuffled];
    for (let i = shuffledQuestionsList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestionsList[i], shuffledQuestionsList[j]] = [shuffledQuestionsList[j], shuffledQuestionsList[i]];
    }

    setShuffledQuestions(shuffledQuestionsList);
  }, [topicId, questions]);

  useEffect(() => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowHint(false);
    setCorrectAnswers(0);
    setIsFinished(false);
    setHasRewarded(false);
  }, [topicId]);

  const activeQuestions = shuffledQuestions.length > 0 ? shuffledQuestions : questions;

  useEffect(() => {
    if (isFinished && !hasRewarded && activeQuestions.length > 0) {
      setHasRewarded(true);
      const percentage = Math.round((correctAnswers / activeQuestions.length) * 100);
      if (percentage >= 60) {
        onComplete(percentage);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: [accentColor, "#ffffff", "#22c55e"]
        });
      }
    }
  }, [isFinished, hasRewarded, correctAnswers, activeQuestions.length, onComplete, accentColor]);

  if (!questions || questions.length === 0) {
    return (
      <div className="liquid-glass-strong rounded-[32px] p-12 text-center border border-white/10">
        <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <p className="text-white/40">No practice questions available for this topic yet.</p>
      </div>
    );
  }

  const handleRetake = () => {
    // Re-shuffle on retake
    const shuffled = questions.map((q) => {
      const optionsWithIndex = q.options.map((opt: string, index: number) => ({
        opt,
        isCorrect: index === q.correctIndex,
      }));
      const shuffledOpts = [...optionsWithIndex];
      for (let i = shuffledOpts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOpts[i], shuffledOpts[j]] = [shuffledOpts[j], shuffledOpts[i]];
      }
      const newCorrectIndex = shuffledOpts.findIndex((item) => item.isCorrect);
      return {
        ...q,
        options: shuffledOpts.map((item) => item.opt),
        correctIndex: newCorrectIndex,
      };
    });
    setShuffledQuestions(shuffled);

    setCurrentIdx(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowHint(false);
    setCorrectAnswers(0);
    setIsFinished(false);
    setHasRewarded(false);
  };

  if (isFinished) {
    const percentage = Math.round((correctAnswers / activeQuestions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className="liquid-glass-strong rounded-[32px] p-8 md:p-12 border border-white/10 space-y-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="space-y-4 max-w-md">
          {/* Animated/Glowing Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full border border-white/10 bg-white/5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute inset-0 rounded-full blur-md opacity-15"
              style={{
                backgroundColor: passed ? "#22c55e" : "#ef4444"
              }}
            />
            {passed ? (
              <Check className="w-10 h-10 text-green-400" />
            ) : (
              <X className="w-10 h-10 text-red-400 animate-pulse" />
            )}
          </div>

          <span className="text-[10px] font-manrope font-black text-white/40 uppercase tracking-[0.25em]">
            Topic Practice Complete
          </span>

          <h3 className="font-instrument text-4xl text-white font-medium">
            {passed ? "Topic Mastered!" : "Keep Practicing"}
          </h3>

          <div className="py-4">
            <span className="text-6xl font-instrument italic font-bold animate-pulse" style={{ color: passed ? "#22c55e" : "#ef4444" }}>
              {percentage}%
            </span>
            <p className="text-white/40 font-inter text-xs mt-2 uppercase tracking-widest">
              Score: {correctAnswers} / {activeQuestions.length} Correct
            </p>
          </div>

          <p className="font-inter text-white/60 text-sm leading-relaxed">
            {passed
              ? "Fantastic work! You have exceeded the 60% passing threshold and successfully completed this section."
              : "You need at least 60% to count this section as completed. Review the article and video tabs, and try again!"}
          </p>

          <div className="pt-8">
            <MagneticButton
              onClick={handleRetake}
              accentColor={accentColor}
              className="px-12 py-4 rounded-2xl text-black bg-white hover:bg-neutral-200 transition-all font-manrope font-black uppercase tracking-widest text-xs shadow-lg"
            >
              <span className="relative z-10 text-black">Retake Quiz</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    );
  }

  const { recordQuestionAttempt, progress } = useProgress();
  const isLightMode = progress?.theme === "light";
  const question = activeQuestions[currentIdx];

  const handleCheck = () => {
    if (selectedOption === null || !question) return;
    
    const correct = selectedOption === question.correctIndex;
    setIsCorrect(correct);
    setShowFeedback(true);

    recordQuestionAttempt(correct, masteryKey);

    if (correct) {
      playSuccessSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [accentColor, "#ffffff"]
      });
      setCorrectAnswers((prev) => prev + 1);
    } else {
      playFailureSound();
    }
  };

  const nextQuestion = () => {
    setCurrentIdx((prev) => (prev + 1) % activeQuestions.length);
    setSelectedOption(null);
    setShowFeedback(false);
    setShowHint(false);
  };

  if (!question) {
    return (
      <div className={cn("rounded-[32px] p-12 text-center border", isLightMode ? "bg-white border-slate-200 text-slate-900 shadow-sm" : "liquid-glass-strong border-white/10")}>
        <Brain className={cn("w-12 h-12 mx-auto mb-4", isLightMode ? "text-slate-400" : "text-white/20")} />
        <p className={isLightMode ? "text-slate-500" : "text-white/40"}>Loading practice questions...</p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-[32px] p-8 md:p-12 border space-y-8 relative transition-colors duration-300", isLightMode ? "bg-white border-slate-200 shadow-md text-slate-900" : "liquid-glass-strong border-white/10 text-white")}>
      <DesmosCalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className={cn("font-instrument text-3xl", isLightMode ? "text-slate-900 font-bold" : "text-white")}>Check Understanding</h3>
          <p className="text-xs font-manrope font-bold uppercase tracking-[0.2em] subject-accent-text">Question {currentIdx + 1} of {activeQuestions.length}</p>
        </div>
        <div className="flex items-center space-x-3">
          {(!courseSlug || /biology|chemistry|physics|calc|stats|csa/i.test(courseSlug)) && (
            <button
              onClick={() => setIsCalcOpen(!isCalcOpen)}
              className="w-10 h-10 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-400 flex items-center justify-center transition-all shadow-md active:scale-95 group cursor-pointer"
              title="Open Desmos Graphing Calculator"
            >
              <Calculator className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}
          <div className={cn("h-12 w-12 rounded-full border flex items-center justify-center", isLightMode ? "border-slate-300 bg-slate-100" : "border-white/10")}>
            <span className={cn("text-xs font-bold", isLightMode ? "text-slate-700 font-bold" : "text-white/40")}>{Math.round(((currentIdx) / activeQuestions.length) * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={cn("text-xl leading-relaxed font-inter", isLightMode ? "text-slate-900 font-medium" : "text-white/90")}>
          {question.text.split('$').map((part: string, i: number) => (
            i % 2 === 0 ? part : <InlineMath key={i}>{part}</InlineMath>
          ))}
        </div>

        <div className="grid gap-3">
          {question.options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => !showFeedback && setSelectedOption(idx)}
              className={cn(
                "w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer",
                selectedOption === idx 
                  ? (isLightMode ? "bg-slate-100 text-slate-900 font-bold border-slate-400 shadow-sm" : "text-white") 
                  : (isLightMode ? "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300" : "bg-white/5 border-white/5 text-white/60 hover:border-white/20 hover:bg-white/10"),
                showFeedback && idx === question.correctIndex && (isLightMode ? "border-green-500 bg-green-50 text-green-900 font-bold" : "border-green-500 bg-green-500/20 text-white"),
                showFeedback && selectedOption === idx && idx !== question.correctIndex && (isLightMode ? "border-red-500 bg-red-50 text-red-900 font-bold" : "border-red-500 bg-red-500/20 text-white")
              )}
              style={{
                borderColor: selectedOption === idx && !showFeedback ? accentColor : undefined,
                backgroundColor: selectedOption === idx && !showFeedback ? (isLightMode ? `${accentColor}18` : `${accentColor}15`) : undefined
              }}
            >
              <div className="flex items-center space-x-4">
                <div 
                  className={cn(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-colors",
                    selectedOption === idx ? "text-black border-transparent" : (isLightMode ? "border-slate-300 text-slate-700 bg-slate-100 font-bold" : "border-white/10 text-white/40")
                  )}
                  style={{
                    backgroundColor: selectedOption === idx && !showFeedback ? accentColor : undefined
                  }}
                >
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={isLightMode ? (selectedOption === idx ? "text-slate-900 font-bold" : "text-slate-800 font-medium") : "text-white"}>
                  {option.split('$').map((part, i) => (
                    i % 2 === 0 ? part : <InlineMath key={i}>{part}</InlineMath>
                  ))}
                </span>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-6 rounded-2xl border",
                isCorrect ? (isLightMode ? "bg-green-50 border-green-300 text-green-950" : "bg-green-500/10 border-green-500/30 text-white") : (isLightMode ? "bg-red-50 border-red-300 text-red-950" : "bg-red-500/10 border-red-500/30 text-white")
              )}
            >
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "p-2 rounded-xl shrink-0",
                  isCorrect ? "bg-green-500/20" : "bg-red-500/20"
                )}>
                  {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                </div>
                <div className="space-y-1">
                  <h4 className={cn("font-bold text-sm", isCorrect ? (isLightMode ? "text-green-800" : "text-green-400") : (isLightMode ? "text-red-800" : "text-red-400"))}>
                    {isCorrect ? "Excellent!" : "Not quite right"}
                  </h4>
                  <div className={cn("text-sm leading-relaxed font-inter", isLightMode ? "text-slate-800 font-medium" : "text-white/60")}>
                    {question.explanation.split('$').map((part: string, i: number) => (
                      i % 2 === 0 ? part : <InlineMath key={i}>{part}</InlineMath>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {showHint && !showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("p-6 rounded-2xl border", isLightMode ? "bg-slate-50 border-slate-300 text-slate-900" : "bg-white/5 border-white/10 text-white")}
              style={{
                borderColor: `${accentColor}44`,
                backgroundColor: isLightMode ? `${accentColor}10` : `${accentColor}08`
              }}
            >
              <div className="flex items-center space-x-3 mb-2">
                <AlertCircle className="w-4 h-4" style={{ color: accentColor }} />
                <span className="font-bold text-sm uppercase tracking-widest" style={{ color: accentColor }}>Mastery Hint</span>
              </div>
              <p className={cn("text-sm", isLightMode ? "text-slate-800 font-medium" : "text-white/70")}>{question.hint || "Recall key properties discussed in the article tab."}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center pt-4">
          <button 
            onClick={() => setShowHint(!showHint)}
            className={cn("text-xs font-manrope font-black uppercase tracking-widest transition-colors cursor-pointer", isLightMode ? "text-slate-600 hover:text-slate-900 font-bold" : "text-white/40 hover:text-white")}
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
          
          <div className="flex space-x-4">
            {!showFeedback ? (
              <MagneticButton
                onClick={handleCheck}
                disabled={selectedOption === null}
                accentColor={accentColor}
                className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-md px-12 py-4 rounded-2xl text-white font-manrope font-black uppercase tracking-widest text-xs disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <span className="flex items-center space-x-2 relative z-10">
                  <span>Check Answer</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </MagneticButton>
            ) : (
              <MagneticButton
                onClick={() => {
                  if (currentIdx + 1 === activeQuestions.length) {
                    setIsFinished(true);
                  } else {
                    nextQuestion();
                  }
                }}
                accentColor={accentColor}
                className="bg-white/10 px-12 py-4 rounded-2xl text-white font-manrope font-black uppercase tracking-widest text-xs"
              >
                <span className="flex items-center space-x-2 relative z-10">
                  <span>{currentIdx + 1 === activeQuestions.length ? "Finish Practice" : "Next Question"}</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </MagneticButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AccountStatsModalProps {
  course: any;
  progress: any;
  currentUser: any;
  onClose: () => void;
}

function AccountStatsModal({ course, progress, currentUser, onClose }: AccountStatsModalProps) {
  const totalTopics = course.units.reduce((acc: number, u: any) => acc + (u.topics?.length || 0), 0);
  const completedTopicsCount = course.units.reduce((acc: number, u: any) => {
    return acc + (u.topics?.filter((t: any) => 
      progress.completedTopics.includes(`${course.masteryPrefix}-${t.id}`)
    ).length || 0);
  }, 0);
  const courseProgressPercent = totalTopics > 0 ? Math.round((completedTopicsCount / totalTopics) * 100) : 0;

  const totalAnswered = progress.totalQuestionsAnswered || 0;
  const totalCorrect = progress.totalQuestionsCorrect || 0;
  const accuracyRate = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const xp = progress.xp || 0;
  const level = getLevelForXp(xp);
  const currentLevelThreshold = getXpThresholdForLevel(level);
  const nextLevelThreshold = getXpThresholdForLevel(level + 1);
  const xpNeededForNext = nextLevelThreshold - currentLevelThreshold;
  const xpInCurrentLevel = xp - currentLevelThreshold;
  const progressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));

  const userInitial = currentUser?.displayName 
    ? currentUser.displayName.charAt(0).toUpperCase() 
    : (currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : "U");

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-lg bg-[#07080e]/95 border border-white/10 rounded-[32px] overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div 
          className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[100px] opacity-35"
          style={{ backgroundColor: course.accentColor }}
        />
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 text-white/40 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile info */}
        <div className="flex items-center space-x-4 mb-8">
          {progress?.photoURL || currentUser?.photoURL ? (
            <img
              src={progress?.photoURL || currentUser?.photoURL || ""}
              alt={progress?.displayName || currentUser?.displayName || "Avatar"}
              className="w-14 h-14 rounded-full object-cover border border-white/15"
            />
          ) : (
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center font-instrument text-2xl font-bold text-black shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${course.accentColor}, #ffffff)`,
              }}
            >
              {userInitial}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="font-instrument text-2xl text-white font-medium">
                {currentUser?.displayName || "AP Scholar"}
              </h3>
              <LevelBadge level={level} />
            </div>
            <div className="flex flex-col gap-1 text-white/50 text-xs">
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5" />
                <span>{currentUser?.email || "student@theaplab.org"}</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 font-manrope font-bold text-xs mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Class of {progress?.graduationYear || "2026"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-white/5 pb-4">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/40 uppercase">Academic Portal Stats</span>
          </div>

          {/* Level / XP Progress Section */}
          <div 
            className="border rounded-2xl p-5 bg-white/[0.01] space-y-4"
            style={{ borderColor: `${course.accentColor}22` }}
          >
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block">LEVEL PROGRESS</span>
                <span className="text-white font-bold text-lg">Level {level}</span>
              </div>
              <div className="text-right">
                <span className="text-white/40 text-xs">{xpInCurrentLevel} / {xpNeededForNext} XP</span>
              </div>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  backgroundColor: course.accentColor,
                  width: `${progressPercent}%` 
                }}
              />
            </div>
            <div className="text-center text-[10px] text-white/30 tracking-wider">
              Total XP Earned: <span className="text-white font-bold">{xp.toLocaleString()} XP</span>
            </div>
          </div>

          {/* Core metrics grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-semibold leading-tight">Questions Answered</span>
              <div className="font-instrument text-3xl font-bold text-white mt-2">
                {totalAnswered}
              </div>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-semibold leading-tight">Correct Answers</span>
              <div className="font-instrument text-3xl font-bold text-green-400 mt-2">
                {totalCorrect}
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-28">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest font-semibold leading-tight">Overall Accuracy</span>
              <div className="font-instrument text-3xl font-bold mt-2" style={{ color: course.accentColor }}>
                {accuracyRate}%
              </div>
            </div>
          </div>

          {/* Current Course completion card */}
          <div 
            className="border rounded-2xl p-5 bg-white/[0.01] space-y-4"
            style={{ borderColor: `${course.accentColor}22` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white text-sm font-semibold">{course.name}</h4>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">Course Completion Progress</p>
              </div>
              <span className="text-sm font-instrument italic font-bold" style={{ color: course.accentColor }}>
                {completedTopicsCount} / {totalTopics} Topics
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{ 
                  backgroundColor: course.accentColor,
                  width: `${courseProgressPercent}%` 
                }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-white/30 font-mono">
              <span>0% Started</span>
              <span>{courseProgressPercent}% Mastered</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-white/80 hover:text-white transition-all text-xs font-semibold"
          >
            Close Profile
          </button>
        </div>
      </motion.div>
    </div>
  );
}
