function mkCtx(): AudioContext | null {
  try { return new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { return null; }
}

function tone(freq: number, type: OscillatorType, vol: number, dur: number, ctx: AudioContext, startAt = 0) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  gain.gain.setValueAtTime(vol, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + dur);
}

export function playFlip() {
  const ctx = mkCtx(); if (!ctx) return;
  tone(1046, 'sine', 0.12, 0.12, ctx);
}

export function playMatch() {
  const ctx = mkCtx(); if (!ctx) return;
  tone(880, 'sine', 0.2, 0.12, ctx, 0);
  tone(1108, 'sine', 0.2, 0.12, ctx, 0.13);
  tone(1320, 'sine', 0.2, 0.18, ctx, 0.26);
}

export function playMiss() {
  const ctx = mkCtx(); if (!ctx) return;
  tone(220, 'sawtooth', 0.12, 0.18, ctx);
  tone(180, 'sawtooth', 0.1, 0.18, ctx, 0.12);
}

export function playReady() {
  const ctx = mkCtx(); if (!ctx) return;
  tone(660, 'square', 0.08, 0.08, ctx, 0);
  tone(990, 'square', 0.1, 0.13, ctx, 0.1);
}

export function playTooEarly() {
  const ctx = mkCtx(); if (!ctx) return;
  tone(280, 'sawtooth', 0.14, 0.22, ctx);
}

export function playReactionHit(ms: number) {
  const ctx = mkCtx(); if (!ctx) return;
  const freq = ms < 200 ? 1320 : ms < 300 ? 1046 : 880;
  tone(freq, 'sine', 0.18, 0.12, ctx, 0);
  tone(freq * 1.25, 'sine', 0.14, 0.2, ctx, 0.13);
}

export function playScore() {
  const ctx = mkCtx(); if (!ctx) return;
  tone(440, 'square', 0.06, 0.08, ctx);
}

export function playCrash() {
  const ctx = mkCtx(); if (!ctx) return;
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / data.length);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.35, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();
  src.stop(ctx.currentTime + 0.3);
}

export function playSOSBeep() {
  const ctx = mkCtx(); if (!ctx) return;
  tone(880, 'sine', 0.3, 0.4, ctx, 0);
  tone(660, 'sine', 0.25, 0.5, ctx, 0.45);
}
