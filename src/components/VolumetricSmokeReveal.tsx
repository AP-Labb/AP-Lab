"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './VolumetricSmokeReveal.css';

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
uniform float uRadius;
uniform float uDecay;
uniform float uAspect;
varying vec2 vUv;

// Distance to line segment for smooth mouse velocity trail drawing
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

  float d = distToSegment(st, pm, m);
  float brush = 1.0 - smoothstep(0.0, uRadius, d);

  float finalVal = max(prevVal, brush);
  gl_FragColor = vec4(vec3(finalVal), 1.0);
}
`;

const smokeVertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const smokeFragmentShader = `
precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D uTrailMap;
uniform sampler2D uImageTexture;
uniform float uReducedMotion;
varying vec2 vUv;

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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.87758, 0.47942, -0.47942, 0.87758);
  for (int i = 0; i < 4; i++) {
    v += a * cnoise(p);
    p = rot * p * 2.05;
    a *= 0.5;
  }
  return v;
}

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
  vec2 uv = vUv;
  vec2 st = (gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y;

  // 1. Base 4K background interface image
  vec4 imgColor = texture2D(uImageTexture, uv);

  // 2. Slow natural smoke drift FBM layers
  float timeSpeed = uReducedMotion > 0.5 ? 0.003 : 0.018;
  float t = iTime * timeSpeed;

  vec2 q = vec2(0.0);
  q.x = fbm(st * 2.2 + vec2(t, t * 0.7));
  q.y = fbm(st * 2.2 + vec2(t * 1.1, t));

  vec2 r = vec2(0.0);
  r.x = fbm(st * 2.8 + 1.2 * q + vec2(1.7, 9.2) + 0.1 * t);
  r.y = fbm(st * 2.8 + 1.2 * q + vec2(8.3, 2.8) + 0.08 * t);

  float smokeNoise = fbm(st * 2.0 + r);

  // Volumetric Dark Navy/Indigo/Purple Haze Color Palette
  vec3 darkNavy = vec3(0.015, 0.02, 0.045);
  vec3 deepIndigo = vec3(0.06, 0.045, 0.14);
  vec3 purpleHaze = vec3(0.18, 0.09, 0.32);

  vec3 smokeColor = mix(darkNavy, deepIndigo, clamp(smokeNoise * smokeNoise * 3.5, 0.0, 1.0));
  smokeColor = mix(smokeColor, purpleHaze, clamp(length(r.x), 0.0, 1.0));

  // Ambient light bleed: Interface beneath softly illuminates smoke
  smokeColor += imgColor.rgb * 0.12;

  // 3. Persistent organic trail reveal (No hard circular mask)
  float trailVal = texture2D(uTrailMap, uv).r;

  // Edge noise warping for fluid, irregular smoke evaporation
  float edgeWarp = cnoise(st * 6.5 + vec2(t * 1.5, t)) * 0.14;
  float reveal = clamp(trailVal + edgeWarp * smoothstep(0.05, 0.6, trailVal), 0.0, 1.0);

  // 4. Subtle digital pixel breakup at evaporating boundary
  int px = int(mod(gl_FragCoord.x / 2.5, 8.0));
  int py = int(mod(gl_FragCoord.y / 2.5, 8.0));
  float ditherNoise = bayer8[py * 8 + px] - 0.5;

  float edgeDitherMask = smoothstep(0.05, 0.85, reveal + ditherNoise * 0.15);

  // Faint cyan-violet rim glow where smoke separates
  float rimMask = smoothstep(0.08, 0.35, reveal) * (1.0 - smoothstep(0.35, 0.75, reveal));
  vec3 rimGlow = vec3(0.5, 0.38, 0.95) * rimMask * 0.35;

  // 5. Final color compositing
  vec3 finalColor = mix(smokeColor + rimGlow, imgColor.rgb, clamp(edgeDitherMask * 1.15, 0.0, 1.0));

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

interface VolumetricSmokeRevealProps {
  imageSrc: string;
  className?: string;
}

export default function VolumetricSmokeReveal({ imageSrc, className = '' }: VolumetricSmokeRevealProps) {
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

    // Ping-Pong FBO RenderTargets for 1.5s Persistent Mouse Trail
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
      uRadius: { value: 0.14 },
      uDecay: { value: 0.965 }, // Trail persists ~1.5 - 2 seconds
      uAspect: { value: 1.0 }
    };
    const trailMaterial = new THREE.ShaderMaterial({
      vertexShader: trailVertexShader,
      fragmentShader: trailFragmentShader,
      uniforms: trailUniforms
    });
    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const trailQuad = new THREE.Mesh(quadGeo, trailMaterial);
    trailScene.add(trailQuad);

    // Main Smoke Reveal Shader Scene
    const smokeUniforms = {
      iResolution: { value: new THREE.Vector2() },
      iTime: { value: 0 },
      uTrailMap: { value: null as THREE.Texture | null },
      uImageTexture: { value: null as THREE.Texture | null },
      uReducedMotion: { value: checkReducedMotion() ? 1.0 : 0.0 }
    };

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageSrc, texture => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      smokeUniforms.uImageTexture.value = texture;
    });

    const smokeMaterial = new THREE.ShaderMaterial({
      vertexShader: smokeVertexShader,
      fragmentShader: smokeFragmentShader,
      uniforms: smokeUniforms,
      transparent: true
    });
    const smokeMesh = new THREE.Mesh(quadGeo, smokeMaterial);
    scene.add(smokeMesh);

    // Mouse Tracking Logic
    const mousePos = new THREE.Vector2(-10, -10);
    const prevMousePos = new THREE.Vector2(-10, -10);
    const targetMousePos = new THREE.Vector2(-10, -10);

    const handleResize = () => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      smokeUniforms.iResolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
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

      // Smooth damp mouse position
      prevMousePos.copy(mousePos);
      mousePos.lerp(targetMousePos, 0.25);

      trailUniforms.uMouse.value.copy(mousePos);
      trailUniforms.uPrevMouse.value.copy(prevMousePos);
      trailUniforms.uPrevTrail.value = rtA.texture;

      // 1. Render Ping-Pong Trail Map Pass
      renderer.setRenderTarget(rtB);
      renderer.render(trailScene, camera);
      renderer.setRenderTarget(null);

      // Swap ping-pong render targets
      const temp = rtA;
      rtA = rtB;
      rtB = temp;

      // 2. Render Main Volumetric Smoke Shader Pass
      smokeUniforms.iTime.value = clock.getElapsedTime();
      smokeUniforms.uTrailMap.value = rtA.texture;

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
      smokeMaterial.dispose();
      if (smokeUniforms.uImageTexture.value) {
        smokeUniforms.uImageTexture.value.dispose();
      }
      renderer.dispose();
    };
  }, [imageSrc]);

  return <div ref={containerRef} className={`volumetric-smoke-container ${className}`} />;
}
