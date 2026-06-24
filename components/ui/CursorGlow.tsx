"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

const BLOOM = 280;
const SPOT = 48;

type CursorMode = "default" | "pointer" | "text";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function CursorGlow() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");

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
      // No offset — centering done via CSS translateX/Y(-50%)
      sx.set(e.clientX);
      sy.set(e.clientY);

      const cursor = window.getComputedStyle(e.target as Element).cursor;
      if (cursor === "pointer") setMode("pointer");
      else if (cursor === "text") setMode("text");
      else setMode("default");
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, bx, by, sx, sy]);

  if (reduce || !enabled) return null;

  // ── spot shape per mode ─────────────────────────────────────────────────────
  const spotAnimate =
    mode === "pointer"
      ? { width: 64, height: 64, borderRadius: 32, opacity: 0.55 }
      : mode === "text"
        ? { width: 2, height: 26, borderRadius: 2, opacity: 0.75 }
        : { width: 8, height: 8, borderRadius: 4, opacity: 0.8 };

  // ring appears only in pointer mode
  const ringOpacity = mode === "pointer" ? 1 : 0;
  // fill disappears in pointer mode (replaced by ring)
  const fillOpacity = mode === "pointer" ? 0 : 1;

  return (
    <>
      {/* ── Ambient bloom ───────────────────────────────────── */}
      <motion.div
        aria-hidden
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

      {/*
       * ── Focused spot ──────────────────────────────────────
       * Two-div trick: outer is a 0×0 anchor at the cursor.
       * Inner uses translateX/Y("-50%") to truly center itself
       * on the anchor regardless of its animated size.
       */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-9999 h-0 w-0"
        style={{ x: sSx, y: sSy }}
      >
        <motion.div
          className="absolute will-change-transform"
          animate={spotAnimate}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          style={{ translateX: "-50%", translateY: "-50%" }}
        >
          {/* fill — default & text modes */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: fillOpacity }}
            transition={{ duration: 0.15 }}
            style={{ background: "var(--accent)" }}
          />

          {/* ring — pointer mode */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ opacity: ringOpacity, scale: ringOpacity ? 1 : 0.7 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            style={{ boxShadow: "inset 0 0 0 1.5px var(--accent)" }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}
