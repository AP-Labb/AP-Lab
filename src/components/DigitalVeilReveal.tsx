"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './DigitalVeilReveal.css';

const trailVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const trailFragmentShader = `
uniform sampler2D uPrevTrail;
uniform vec2 uMouse;
uniform vec2 uPrevMouse;
uniform vec2 uVel;
uniform float uRadius;
uniform float uDecay;
uniform float uAspect;
uniform float uTime;
varying vec2 vUv;

// Simplex 2D noise generator for organic trail warping
vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

float distToSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec4 prev = texture2D(uPrevTrail, vUv);
  float prevVal = prev.r * uDecay;

  vec2 st = vUv;
  vec2 m = uMouse;
  vec2 pm = uPrevMouse;
  
  st.x *= uAspect;
  m.x *= uAspect;
  pm.x *= uAspect;

  // Warp brush coordinates with multi-frequency noise & velocity displacement (100% NO CIRCLES!)
  vec2 velOffset = uVel * 0.08;
  vec2 noiseOffset = vec2(
    cnoise(st * 7.5 + vec2(uTime * 0.6, uTime * 0.4)),
    cnoise(st * 7.5 - vec2(uTime * 0.5, uTime * 0.7))
  ) * 0.12 + velOffset;

  float d = distToSegment(st + noiseOffset, pm, m);
  
  // Breathing organic focus lens brush (expands/contracts subtly)
  float noiseShape = cnoise(st * 10.0 + vec2(uTime * 0.3));
  float breathe = 0.85 + 0.25 * sin(uTime * 1.6) + 0.30 * noiseShape;
  float dynamicRadius = uRadius * breathe;
  float rawBrush = clamp(1.0 - (d / max(dynamicRadius, 0.01)), 0.0, 1.0);
  float brush = pow(rawBrush, 1.25) * (0.75 + 0.5 * noiseShape);

  float finalVal = max(prevVal, brush);
  gl_FragColor = vec4(vec3(finalVal), 1.0);
}
`;

const veilVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const veilFragmentShader = `
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec2 iVel;
uniform sampler2D uTrailMap;
uniform sampler2D uImageTexture;
uniform float uReducedMotion;
varying vec2 vUv;

// Simplex 2D noise generator
vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
  vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
  Pi = mod289(Pi);
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x, gy.x);
  vec2 g10 = vec2(gx.y, gy.y);
  vec2 g01 = vec2(gx.z, gy.z);
  vec2 g11 = vec2(gx.w, gy.w);
  vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
  g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

// 1.5% Animated Fine Digital Film Grain
float rand(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Multi-tap Gaussian Blur for smooth 6-8px out-of-focus background effect
vec4 sampleBlurredImage(sampler2D tex, vec2 uv, float blurAmount) {
  if (blurAmount < 0.005) return texture2D(tex, uv);
  vec4 col = vec4(0.0);
  vec2 off = vec2(blurAmount * 2.5) / iResolution.xy;
  col += texture2D(tex, uv + vec2(-off.x, -off.y)) * 0.0625;
  col += texture2D(tex, uv + vec2( 0.0,   -off.y)) * 0.125;
  col += texture2D(tex, uv + vec2( off.x,  -off.y)) * 0.0625;
  col += texture2D(tex, uv + vec2(-off.x,   0.0))   * 0.125;
  col += texture2D(tex, uv)                         * 0.25;
  col += texture2D(tex, uv + vec2( off.x,   0.0))   * 0.125;
  col += texture2D(tex, uv + vec2(-off.x,   off.y)) * 0.0625;
  col += texture2D(tex, uv + vec2( 0.0,    off.y)) * 0.125;
  col += texture2D(tex, uv + vec2( off.x,   off.y)) * 0.0625;
  return col;
}

// Bayer 8x8 Dither Matrix for digital edge breakup
const float bayer8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

void main() {
  // Parallax UV offset based on mouse position (1-3px)
  vec2 mouseParallax = (iMouse - 0.5) * 0.003;
  vec2 uv = vUv + mouseParallax;
  vec2 st = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

  // 1. Organic Noise-Based Cursor Focus Mask (NO CIRCLES!)
  float trailVal = texture2D(uTrailMap, uv).r;

  float timeSpeed = uReducedMotion > 0.5 ? 0.002 : 0.012;
  float t = iTime * timeSpeed;

  float n1 = cnoise(st * 4.0 + vec2(t * 0.6, t * 0.4));
  float n2 = cnoise(st * 8.0 - vec2(t * 0.4, t * 0.5)) * 0.5;
  float organicNoise = n1 + n2;

  float revealMask = clamp(trailVal + organicNoise * 0.22 * smoothstep(0.03, 0.6, trailVal), 0.0, 1.0);

  // Bayer dither breakup at focus edge boundary
  int px = int(mod(gl_FragCoord.x / 2.0, 8.0));
  int py = int(mod(gl_FragCoord.y / 2.0, 8.0));
  float ditherVal = bayer8[py * 8 + px] - 0.5;
  float ditherFactor = smoothstep(0.04, 0.82, revealMask + ditherVal * 0.12);

  // 2. Lens Focus Blur Transition: Out-of-focus background has 7.5px soft blur; Focus spotlight has 0px blur
  float focusFactor = clamp(ditherFactor * 1.15, 0.0, 1.0);
  float blurAmount = mix(7.5, 0.0, focusFactor);
  vec4 blurredImg = sampleBlurredImage(uImageTexture, uv, blurAmount);

  // 3. Translucent Digital Veil Layer (Deep Navy / Near-Black Tint: #05070A to #0B0F16)
  // Baseline image is visible at ~28% opacity, clearer in hero center
  float centerClarity = smoothstep(0.9, 0.15, length(st));
  vec3 baselineImage = blurredImg.rgb * mix(0.24, 0.38, centerClarity);

  // Atmospheric Gradient (Cool Blue #0B192E to Soft Purple #1A1033)
  float dist = length(st);
  vec3 coolBlue = vec3(0.043, 0.098, 0.180);  // #0B192E
  vec3 softPurple = vec3(0.102, 0.063, 0.200); // #1A1033
  vec3 veilGradient = mix(coolBlue, softPurple, smoothstep(0.1, 0.85, dist));

  // Soft Vignette: Focus attention toward center
  float vignette = smoothstep(0.95, 0.25, dist);
  vec3 dimmedBackground = (baselineImage + veilGradient * 0.50) * vignette;

  // 1.5% Animated Fine Digital Film Grain (displaced by cursor velocity)
  vec2 grainVelOffset = iVel * 0.02;
  float grain = (rand(gl_FragCoord.xy + grainVelOffset + t * 4.0) - 0.5) * 0.015;
  dimmedBackground += vec3(grain);

  // Floating Micro-Dust Sparks with Cursor Repulsion Physics
  vec2 sparkPos = gl_FragCoord.xy * 0.08 + vec2(t * 0.5, t * 0.3);
  vec2 sparkMouseDist = (iMouse - vUv);
  float sparkRepulsion = smoothstep(0.25, 0.0, length(sparkMouseDist));
  sparkPos += sparkMouseDist * sparkRepulsion * 0.05;

  float sparkNoise = rand(sparkPos);
  if (sparkNoise > 0.994) {
    dimmedBackground += vec3(0.15, 0.18, 0.38);
  }

  // 4. Focused Spotlight (Pin-Sharp 4K, Saturation Boost, Highlight Bloom)
  // Subtle Chromatic Aberration at lens boundary (0.3px refraction)
  float edgeDistortion = smoothstep(0.1, 0.4, revealMask) * (1.0 - smoothstep(0.4, 0.8, revealMask));
  vec2 caOffset = vec2(edgeDistortion * 0.0004, 0.0);
  float rCh = texture2D(uImageTexture, uv + caOffset).r;
  float gCh = texture2D(uImageTexture, uv).g;
  float bCh = texture2D(uImageTexture, uv - caOffset).b;
  vec3 focusedImg = vec3(rCh, gCh, bCh);

  // Saturation boost in revealed zone
  float gray = dot(focusedImg, vec3(0.299, 0.587, 0.114));
  focusedImg = mix(vec3(gray), focusedImg, 1.18);
  focusedImg = pow(focusedImg, vec3(0.92)) * 1.10;

  // Soft Bloom Lift in Highlights
  float lum = dot(focusedImg, vec3(0.299, 0.587, 0.114));
  vec3 highlightBloom = vec3(0.12, 0.16, 0.38) * smoothstep(0.65, 1.0, lum) * 0.18;
  focusedImg += highlightBloom;

  // Faint Blue/Purple Bloom at reveal boundary edge
  float rimBloom = edgeDistortion * 0.22;
  vec3 bloomColor = vec3(0.25, 0.32, 0.85) * rimBloom;

  // 5. Final Composite (Adaptive Glass Lens Focus Reveal)
  vec3 finalColor = mix(dimmedBackground + bloomColor, focusedImg, focusFactor);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface DigitalVeilRevealProps {
  imageSrc: string;
  className?: string;
}

export default function DigitalVeilReveal({ imageSrc, className = '' }: DigitalVeilRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const checkReducedMotion = () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Ping-Pong FBO RenderTargets for 1.5-2.5s Persistent Lens Focus Trail
    const width = 512;
    const height = 512;
    const renderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    };

    let rtA = new THREE.WebGLRenderTarget(width, height, renderTargetOptions);
    let rtB = new THREE.WebGLRenderTarget(width, height, renderTargetOptions);

    // Trail Pass Scene
    const trailScene = new THREE.Scene();
    const trailUniforms = {
      uPrevTrail: { value: null as THREE.Texture | null },
      uMouse: { value: new THREE.Vector2(-10, -10) },
      uPrevMouse: { value: new THREE.Vector2(-10, -10) },
      uVel: { value: new THREE.Vector2(0, 0) },
      uRadius: { value: 0.35 }, // Large generous focus spotlight
      uDecay: { value: 0.972 }, // Smooth 1.5 - 2.5s trail recovery
      uAspect: { value: 1.0 },
      uTime: { value: 0 }
    };
    const trailMaterial = new THREE.ShaderMaterial({
      vertexShader: trailVertexShader,
      fragmentShader: trailFragmentShader,
      uniforms: trailUniforms
    });
    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const trailQuad = new THREE.Mesh(quadGeo, trailMaterial);
    trailScene.add(trailQuad);

    // Main Digital Focus Veil Shader Scene
    const veilUniforms = {
      iResolution: { value: new THREE.Vector2() },
      iTime: { value: 0 },
      iMouse: { value: new THREE.Vector2(0.5, 0.5) },
      iVel: { value: new THREE.Vector2(0, 0) },
      uTrailMap: { value: null as THREE.Texture | null },
      uImageTexture: { value: null as THREE.Texture | null },
      uReducedMotion: { value: checkReducedMotion() ? 1.0 : 0.0 }
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageSrc, texture => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      veilUniforms.uImageTexture.value = texture;
    });

    const veilMaterial = new THREE.ShaderMaterial({
      vertexShader: veilVertexShader,
      fragmentShader: veilFragmentShader,
      uniforms: veilUniforms,
      transparent: true
    });
    const veilMesh = new THREE.Mesh(quadGeo, veilMaterial);
    scene.add(veilMesh);

    // Mouse Tracking & Velocity Logic
    const mousePos = new THREE.Vector2(-10, -10);
    const prevMousePos = new THREE.Vector2(-10, -10);
    const targetMousePos = new THREE.Vector2(-10, -10);
    const mouseVel = new THREE.Vector2(0, 0);

    const handleResize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      veilUniforms.iResolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
      trailUniforms.uAspect.value = w / h;
    };
    handleResize();

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMousePos.set(x, y);
    };

    window.addEventListener('pointermove', handlePointerMove);

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damp mouse position & compute velocity
      prevMousePos.copy(mousePos);
      mousePos.lerp(targetMousePos, 0.25);
      mouseVel.subVectors(mousePos, prevMousePos);

      trailUniforms.uMouse.value.copy(mousePos);
      trailUniforms.uPrevMouse.value.copy(prevMousePos);
      trailUniforms.uVel.value.copy(mouseVel);
      trailUniforms.uPrevTrail.value = rtA.texture;
      trailUniforms.uTime.value = elapsedTime;

      veilUniforms.iMouse.value.copy(mousePos);
      veilUniforms.iVel.value.copy(mouseVel);

      // 1. Render Ping-Pong Trail Pass
      renderer.setRenderTarget(rtB);
      renderer.render(trailScene, camera);
      renderer.setRenderTarget(null);

      // Swap targets
      const temp = rtA;
      rtA = rtB;
      rtB = temp;

      // 2. Render Main Digital Focus Veil Pass
      veilUniforms.iTime.value = elapsedTime;
      veilUniforms.uTrailMap.value = rtA.texture;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      rtA.dispose();
      rtB.dispose();
      quadGeo.dispose();
      trailMaterial.dispose();
      veilMaterial.dispose();
      if (veilUniforms.uImageTexture.value) {
        veilUniforms.uImageTexture.value.dispose();
      }
      renderer.dispose();
    };
  }, [imageSrc]);

  return <div ref={containerRef} className={`digital-veil-container ${className}`} />;
}
