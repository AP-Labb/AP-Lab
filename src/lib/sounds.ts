/**
 * Audio synthesis helper using the Web Audio API.
 * This does not require downloading external audio files, works offline,
 * and executes with zero loading latency.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    // @ts-ignore
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;
  
  // First note: 523.25 Hz (C5)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(523.25, now);
  
  gain1.gain.setValueAtTime(0.15, now);
  gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
  
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  
  osc1.start(now);
  osc1.stop(now + 0.08);

  // Second note: 659.25 Hz (E5) after 0.08s
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(659.25, now + 0.08);
  
  gain2.gain.setValueAtTime(0.15, now + 0.08);
  gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
  
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  
  osc2.start(now + 0.08);
  osc2.stop(now + 0.25);
}

export function playLevelUpRiser() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const duration = 1.8;

  // Dual-oscillator for rich, cinematic swell
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();

  // Smooth triangle wave
  osc1.type = "triangle";
  osc1.frequency.setValueAtTime(65, now);
  osc1.frequency.exponentialRampToValueAtTime(520, now + duration);

  // Sub sine wave slightly detuned for thickness
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(67, now);
  osc2.frequency.exponentialRampToValueAtTime(525, now + duration);

  // Lowpass sweep from muffled deep rumble to bright open crescendo
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(90, now);
  filter.frequency.exponentialRampToValueAtTime(1600, now + duration);
  filter.Q.setValueAtTime(1.5, now);

  // Smooth volume swell that dips slightly right before impact for tension
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.16, now + duration * 0.85);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);
}

export function playLevelUpImpact() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // 1. Sub Bass Drop Impact
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  
  subOsc.type = "sine";
  subOsc.frequency.setValueAtTime(110, now);
  subOsc.frequency.exponentialRampToValueAtTime(45, now + 1.2);
  
  subGain.gain.setValueAtTime(0.24, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
  
  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + 1.2);

  // 2. High Cinematic Glass Chime Strum (C6, E6, G6, B6, D7, G7 - Pentatonic / Major 9)
  const freqs = [1046.50, 1318.51, 1567.98, 1975.53, 2349.32, 3135.96];
  freqs.forEach((freq, i) => {
    // Beautiful strum cascade
    const time = now + i * 0.04;
    const oscTriangle = ctx.createOscillator();
    const oscSine = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Triangle wave for warm woody/metal resonance
    oscTriangle.type = "triangle";
    oscTriangle.frequency.setValueAtTime(freq, time);
    
    // Sine wave at double frequency for pure crystal bell tone
    oscSine.type = "sine";
    oscSine.frequency.setValueAtTime(freq * 2.0, time);
    
    gainNode.gain.setValueAtTime(0.05, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 2.2); // smooth long ring-out
    
    oscTriangle.connect(gainNode);
    oscSine.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscTriangle.start(time);
    oscTriangle.stop(time + 2.2);
    oscSine.start(time);
    oscSine.stop(time + 2.2);
  });
}

export function playLevelUpSound() {
  playLevelUpRiser();
  setTimeout(() => {
    playLevelUpImpact();
  }, 1800);
}

export function playFailureSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = "triangle";
  
  // Frequency slides down from 160Hz to 110Hz
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.linearRampToValueAtTime(110, now + 0.35);
  
  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(now);
  osc.stop(now + 0.35);
}

export function playSpinSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const now = ctx.currentTime;
  const duration = 0.8;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(280, now);
  osc.frequency.exponentialRampToValueAtTime(950, now + duration);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

