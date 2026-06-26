"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

const BLOOM = 280;
const SPOT = 48;
const POINTER_SIZE = 64;
const RING_CENTER = POINTER_SIZE / 2;
const RING_RADIUS = 28;

type CursorMode = "default" | "pointer" | "text";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const WAVE_DURATION_MS = 820;
const WAVE_SEGMENTS = 96;
const WAVE_POINTS = 9;
const WAVE_SPREAD = Math.PI / 14;

function wrapAngle(delta: number): number {
  let angle = delta % (Math.PI * 2);
  if (angle > Math.PI) angle -= Math.PI * 2;
  if (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function bumpAtAnchor(
  angle: number,
  anchor: number,
  amplitude: number,
): number {
  const delta = wrapAngle(angle - anchor);
  const abs = Math.abs(delta);
  if (abs > WAVE_SPREAD) return 0;

  const t = abs / WAVE_SPREAD;
  // Soft cosine profile — gentle slopes, less sharp peaks.
  return amplitude * Math.cos((t * Math.PI) / 2) ** 2;
}

function buildFixedPointRingPath(
  cx: number,
  cy: number,
  radius: number,
  amplitude: number,
): string {
  let path = "";

  for (let i = 0; i <= WAVE_SEGMENTS; i++) {
    const angle = (i / WAVE_SEGMENTS) * Math.PI * 2;
    let wave = 0;

    for (let point = 0; point < WAVE_POINTS; point++) {
      const anchorOut = (point / WAVE_POINTS) * Math.PI * 2 - Math.PI / 2;
      const anchorIn = anchorOut + Math.PI / WAVE_POINTS;

      wave += bumpAtAnchor(angle, anchorOut, amplitude);
      wave -= bumpAtAnchor(angle, anchorIn, amplitude);
    }

    const x = cx + Math.cos(angle) * (radius + wave);
    const y = cy + Math.sin(angle) * (radius + wave);
    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  return `${path} Z`;
}

export function CursorGlow() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const modeRef = useRef<CursorMode>("default");
  const [wavePath, setWavePath] = useState<string | null>(null);
  const waveRafRef = useRef(0);
  const waveSessionRef = useRef(0);

  const triggerAudioWave = useCallback(() => {
    const session = ++waveSessionRef.current;
    const start = performance.now();

    const tick = (now: number) => {
      if (session !== waveSessionRef.current) return;

      const elapsed = now - start;
      if (elapsed >= WAVE_DURATION_MS) {
        setWavePath(null);
        return;
      }

      const progress = elapsed / WAVE_DURATION_MS;
      const envelope = (1 - progress) ** 1.2;
      const amplitude = 2.4 * envelope;

      setWavePath(
        buildFixedPointRingPath(
          RING_CENTER,
          RING_CENTER,
          RING_RADIUS,
          amplitude,
        ),
      );

      waveRafRef.current = requestAnimationFrame(tick);
    };

    cancelAnimationFrame(waveRafRef.current);
    waveRafRef.current = requestAnimationFrame(tick);
  }, []);

  // Ambient bloom — slow, dreamy
  const bx = useMotionValue(-BLOOM);
  const by = useMotionValue(-BLOOM);
  const sBx = useSpring(bx, { stiffness: 90, damping: 20 });
  const sBy = useSpring(by, { stiffness: 90, damping: 20 });

  // Focused spot — snappy
  const sx = useMotionValue(-SPOT);
  const sy = useMotionValue(-SPOT);
  const sSx = useSpring(sx, { stiffness: 700, damping: 42 });
  const sSy = useSpring(sy, { stiffness: 700, damping: 42 });

  useEffect(() => {
    const check = () => setEnabled(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      bx.set(e.clientX - BLOOM / 2);
      by.set(e.clientY - BLOOM / 2);
      sx.set(e.clientX);
      sy.set(e.clientY);

      const cursor = window.getComputedStyle(e.target as Element).cursor;
      const nextMode: CursorMode =
        cursor === "pointer"
          ? "pointer"
          : cursor === "text"
            ? "text"
            : "default";
      modeRef.current = nextMode;
      setMode(nextMode);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, bx, by, sx, sy]);

  useEffect(() => {
    if (!enabled) return;

    const onDown = () => {
      if (modeRef.current !== "pointer") return;
      triggerAudioWave();
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [enabled, triggerAudioWave]);

  useEffect(
    () => () => {
      waveSessionRef.current += 1;
      cancelAnimationFrame(waveRafRef.current);
    },
    [],
  );

  if (reduce || !enabled) return null;

  const spotAnimate =
    mode === "pointer"
      ? {
          width: POINTER_SIZE,
          height: POINTER_SIZE,
          borderRadius: POINTER_SIZE / 2,
          opacity: 0.55,
        }
      : mode === "text"
        ? { width: 2, height: 26, borderRadius: 2, opacity: 0.75 }
        : { width: 8, height: 8, borderRadius: 4, opacity: 0.8 };

  const fillOpacity = mode === "pointer" ? 0 : 1;
  const ringOpacity = mode === "pointer" ? 1 : 0;

  return (
    <>
      <motion.div
        aria-hidden
        dir="ltr"
        className="pointer-events-none fixed left-0 top-0 z-9999 rounded-full will-change-transform"
        animate={{
          scale: mode === "pointer" ? 1.15 : 1,
          opacity: mode === "text" ? 0.5 : 1,
        }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
        style={{
          x: sBx,
          y: sBy,
          width: BLOOM,
          height: BLOOM,
          background:
            "radial-gradient(circle at center, var(--cursor-glow) 0%, transparent 65%)",
        }}
      />

      <motion.div
        aria-hidden
        dir="ltr"
        className="pointer-events-none fixed left-0 top-0 z-9999 h-0 w-0"
        style={{ x: sSx, y: sSy }}
      >
        <motion.div
          className="absolute will-change-transform"
          animate={spotAnimate}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          style={{ translateX: "-50%", translateY: "-50%" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: fillOpacity }}
            transition={{ duration: 0.15 }}
            style={{ background: "var(--accent)" }}
          />

          <motion.svg
            width={POINTER_SIZE}
            height={POINTER_SIZE}
            viewBox={`0 0 ${POINTER_SIZE} ${POINTER_SIZE}`}
            className="absolute inset-0 overflow-visible"
            animate={{ opacity: ringOpacity }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            aria-hidden
          >
            {wavePath ? (
              <path
                d={wavePath}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            ) : (
              <circle
                cx={RING_CENTER}
                cy={RING_CENTER}
                r={RING_RADIUS}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={1.5}
              />
            )}
          </motion.svg>
        </motion.div>
      </motion.div>
    </>
  );
}
