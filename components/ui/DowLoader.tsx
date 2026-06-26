"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const VIEWBOX = "0 0 375 375";
const DRAW_DUR = 0.85;
const FADE_DUR = 0.28;
const HOLD_BEFORE_FADE = 0.35;
const STROKE_FRAC = 0.78;
const FILL_FRAC = 1 - STROKE_FRAC;
const EASE_DRAW = [0.35, 0.05, 0.25, 1] as const;

const DRAW_STARTS = [0, DRAW_DUR, DRAW_DUR * 2, DRAW_DUR * 3];
const FADE_STARTS = [
  DRAW_DUR * 4 + HOLD_BEFORE_FADE,
  DRAW_DUR * 4 + HOLD_BEFORE_FADE + FADE_DUR,
  DRAW_DUR * 4 + HOLD_BEFORE_FADE + FADE_DUR * 2,
  DRAW_DUR * 4 + HOLD_BEFORE_FADE + FADE_DUR * 3,
];
const CYCLE = FADE_STARTS[3] + FADE_DUR;

const PATH_TOP_DOT =
  "M 26.15625 -59.265625 C 27.644531 -59.265625 29.425781 -59.265625 31.5 -59.265625 C 33.570312 -59.265625 35.4375 -59.015625 37.09375 -58.515625 C 38.757812 -58.023438 40.210938 -57.195312 41.453125 -56.03125 C 42.703125 -54.875 43.328125 -53.050781 43.328125 -50.5625 C 43.328125 -47.070312 41.707031 -44.039062 38.46875 -41.46875 C 35.238281 -38.894531 31.421875 -36.734375 27.015625 -34.984375 C 22.617188 -33.242188 18.050781 -32 13.3125 -31.25 C 8.582031 -30.507812 4.8125 -30.140625 2 -30.140625 C 2 -34.453125 2.453125 -38.347656 3.359375 -41.828125 C 4.273438 -45.316406 5.644531 -48.347656 7.46875 -50.921875 C 9.289062 -53.492188 11.738281 -55.523438 14.8125 -57.015625 C 17.882812 -58.515625 21.664062 -59.265625 26.15625 -59.265625 Z";

const PATH_LINE =
  "M 16.1875 96.125 C 21.832031 83.507812 25.484375 70.476562 27.140625 57.03125 C 28.804688 43.582031 28.640625 29.96875 26.640625 16.1875 L 37.359375 5.484375 C 40.679688 6.472656 43.128906 8.585938 44.703125 11.828125 C 46.273438 15.066406 47.351562 18.675781 47.9375 22.65625 C 48.519531 26.644531 48.769531 30.796875 48.6875 35.109375 C 48.601562 39.429688 48.5625 43.085938 48.5625 46.078125 C 48.5625 46.734375 48.476562 48.054688 48.3125 50.046875 C 48.144531 52.046875 48.0625 53.210938 48.0625 53.546875 C 47.726562 55.203125 47.101562 58.019531 46.1875 62 C 45.28125 65.988281 44.242188 70.265625 43.078125 74.828125 C 41.921875 79.398438 40.800781 83.675781 39.71875 87.65625 C 38.644531 91.644531 37.859375 94.46875 37.359375 96.125 C 37.023438 96.457031 36.359375 96.875 35.359375 97.375 C 34.367188 97.875 33.25 98.410156 32 98.984375 C 30.757812 99.566406 29.679688 100.109375 28.765625 100.609375 C 27.847656 101.109375 27.140625 101.441406 26.640625 101.609375 L 21.171875 101.609375 C 20.671875 101.273438 19.796875 100.398438 18.546875 98.984375 C 17.304688 97.578125 16.519531 96.625 16.1875 96.125 Z";

const PATH_ARROW =
  "M 21.171875 -10.703125 C 21.171875 -13.359375 22.332031 -16.84375 24.65625 -21.15625 C 26.976562 -25.476562 29.960938 -30.085938 33.609375 -34.984375 C 37.265625 -39.890625 41.207031 -44.957031 45.4375 -50.1875 C 49.675781 -55.414062 53.785156 -60.394531 57.765625 -65.125 C 61.753906 -69.851562 65.242188 -74.003906 68.234375 -77.578125 C 71.222656 -81.148438 73.382812 -83.765625 74.71875 -85.421875 C 74.71875 -85.753906 74.796875 -86.207031 74.953125 -86.78125 C 75.117188 -87.363281 75.203125 -87.820312 75.203125 -88.15625 C 75.203125 -88.15625 75.117188 -88.570312 74.953125 -89.40625 C 74.796875 -89.738281 74.71875 -90.15625 74.71875 -90.65625 C 74.382812 -91.3125 73.550781 -92.300781 72.21875 -93.625 C 70.894531 -94.957031 69.898438 -95.789062 69.234375 -96.125 C 68.234375 -96.789062 66.238281 -98.035156 63.25 -99.859375 C 60.257812 -101.691406 56.769531 -103.9375 52.78125 -106.59375 C 48.800781 -109.25 44.53125 -111.988281 39.96875 -114.8125 C 35.40625 -117.632812 31.128906 -120.332031 27.140625 -122.90625 C 23.160156 -125.476562 19.675781 -127.71875 16.6875 -129.625 C 13.695312 -131.53125 11.617188 -132.734375 10.453125 -133.234375 C 7.960938 -134.890625 6.257812 -136.628906 5.34375 -138.453125 C 4.4375 -140.285156 3.984375 -142.695312 3.984375 -145.6875 C 8.460938 -145.6875 14.3125 -144.976562 21.53125 -143.5625 C 28.757812 -142.15625 36.359375 -140.25 44.328125 -137.84375 C 52.296875 -135.4375 60.347656 -132.570312 68.484375 -129.25 C 76.617188 -125.925781 83.921875 -122.3125 90.390625 -118.40625 C 96.867188 -114.507812 102.179688 -110.398438 106.328125 -106.078125 C 110.484375 -101.765625 112.5625 -97.535156 112.5625 -93.390625 C 112.5625 -93.054688 112.476562 -92.597656 112.3125 -92.015625 C 112.144531 -91.429688 112.0625 -90.976562 112.0625 -90.65625 C 110.570312 -88.820312 108.332031 -86.117188 105.34375 -82.546875 C 102.351562 -78.984375 98.945312 -74.875 95.125 -70.21875 C 91.3125 -65.570312 87.285156 -60.71875 83.046875 -55.65625 C 78.816406 -50.59375 74.75 -45.816406 70.84375 -41.328125 C 66.945312 -36.847656 63.421875 -32.78125 60.265625 -29.125 C 57.109375 -25.476562 54.785156 -22.828125 53.296875 -21.171875 C 50.804688 -18.347656 48.8125 -15.9375 47.3125 -13.9375 C 45.820312 -11.945312 44.453125 -10.285156 43.203125 -8.953125 C 41.960938 -7.628906 40.550781 -6.632812 38.96875 -5.96875 C 37.394531 -5.3125 35.195312 -4.984375 32.375 -4.984375 C 31.707031 -4.984375 30.75 -5.023438 29.5 -5.109375 C 28.257812 -5.191406 27.015625 -5.394531 25.765625 -5.71875 C 24.523438 -6.050781 23.445312 -6.59375 22.53125 -7.34375 C 21.625 -8.09375 21.171875 -9.210938 21.171875 -10.703125 Z";

const PURPLE_DOT = { cx: 284.757812, cy: 252.832031, r: 10.47 };
const ACCENT = "#5e17eb";

function getTimings(drawIndex: number, fadeIndex: number) {
  const drawStart = Math.max(0.001, DRAW_STARTS[drawIndex]);
  const strokeEnd = drawStart + DRAW_DUR * STROKE_FRAC;
  const fillStart = drawStart + DRAW_DUR * STROKE_FRAC;
  const fillEnd = drawStart + DRAW_DUR;
  const fadeStart = FADE_STARTS[fadeIndex];
  const fadeMid = fadeStart + FADE_DUR * FILL_FRAC;
  const fadeEnd = Math.min(fadeStart + FADE_DUR, CYCLE - 0.001);
  const t = (seconds: number) => seconds / CYCLE;

  return {
    drawStart,
    strokeEnd,
    fillStart,
    fillEnd,
    fadeStart,
    fadeMid,
    fadeEnd,
    t,
  };
}

function makeStrokeTransition(drawIndex: number, fadeIndex: number) {
  const { drawStart, strokeEnd, fadeStart, fadeMid, fadeEnd, t } = getTimings(
    drawIndex,
    fadeIndex,
  );

  return {
    duration: CYCLE,
    repeat: Infinity,
    repeatType: "loop" as const,
    ease: EASE_DRAW,
    times: [
      t(0),
      t(drawStart),
      t(strokeEnd),
      t(fadeStart),
      t(fadeMid),
      t(fadeEnd),
    ],
  };
}

function makeFillTransition(drawIndex: number, fadeIndex: number) {
  const { fillStart, fillEnd, fadeStart, fadeMid, fadeEnd, t } = getTimings(
    drawIndex,
    fadeIndex,
  );

  return {
    duration: CYCLE,
    repeat: Infinity,
    repeatType: "loop" as const,
    ease: EASE_DRAW,
    times: [
      t(0),
      t(fillStart),
      t(fillEnd),
      t(fadeStart),
      t(fadeMid),
      t(fadeEnd),
    ],
  };
}

const strokeKeyframes = {
  pathLength: [0, 0, 1, 1, 1, 0],
  opacity: [0, 0, 1, 1, 1, 0],
};

const fillKeyframes = {
  opacity: [0, 0, 1, 1, 0, 0],
};

const purpleStrokeKeyframes = {
  pathLength: [0, 0, 1, 1, 1, 0],
  opacity: [0, 0, 1, 1, 1, 0],
};

const purpleFillKeyframes = {
  opacity: [0, 0, 1, 1, 0, 0],
};

function AnimatedPart({
  d,
  transform,
  drawIndex,
  fadeIndex,
}: {
  d: string;
  transform?: string;
  drawIndex: number;
  fadeIndex: number;
}) {
  return (
    <g transform={transform}>
      <motion.path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={strokeKeyframes}
        transition={makeStrokeTransition(drawIndex, fadeIndex)}
      />
      <motion.path
        d={d}
        fill="currentColor"
        stroke="none"
        initial={{ opacity: 0 }}
        animate={fillKeyframes}
        transition={makeFillTransition(drawIndex, fadeIndex)}
      />
    </g>
  );
}

function AnimatedPurpleDot({
  drawIndex,
  fadeIndex,
}: {
  drawIndex: number;
  fadeIndex: number;
}) {
  return (
    <>
      <motion.circle
        cx={PURPLE_DOT.cx}
        cy={PURPLE_DOT.cy}
        r={PURPLE_DOT.r}
        fill="none"
        stroke={ACCENT}
        strokeWidth={3}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={purpleStrokeKeyframes}
        transition={makeStrokeTransition(drawIndex, fadeIndex)}
      />
      <motion.circle
        cx={PURPLE_DOT.cx}
        cy={PURPLE_DOT.cy}
        r={PURPLE_DOT.r}
        fill={ACCENT}
        stroke="none"
        initial={{ opacity: 0 }}
        animate={purpleFillKeyframes}
        transition={makeFillTransition(drawIndex, fadeIndex)}
      />
    </>
  );
}

function StaticLogo() {
  return (
    <>
      <g transform="translate(110, 170.687856)" className="fill-current">
        <path d={PATH_TOP_DOT} />
        <path d={PATH_LINE} />
      </g>
      <g transform="translate(170, 266.056886)" className="fill-current">
        <path d={PATH_ARROW} />
      </g>
      <circle
        cx={PURPLE_DOT.cx}
        cy={PURPLE_DOT.cy}
        r={PURPLE_DOT.r}
        fill={ACCENT}
      />
    </>
  );
}

type DowLoaderProps = {
  className?: string;
  size?: number;
  label?: string;
  decorative?: boolean;
};

export function DowLoader({
  className,
  size = 56,
  label = "Loading",
  decorative = false,
}: DowLoaderProps) {
  const reduce = useReducedMotion();

  return (
    <div
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      className={cn(
        "inline-flex items-center justify-center text-text-primary",
        className,
      )}
    >
      <svg
        width={size}
        height={size}
        viewBox={VIEWBOX}
        aria-hidden
        className={cn("text-inherit", reduce && "opacity-80")}
      >
        {reduce ? (
          <StaticLogo />
        ) : (
          <>
            <AnimatedPart
              d={PATH_TOP_DOT}
              transform="translate(110, 170.687856)"
              drawIndex={0}
              fadeIndex={0}
            />
            <AnimatedPart
              d={PATH_LINE}
              transform="translate(110, 170.687856)"
              drawIndex={1}
              fadeIndex={1}
            />
            <AnimatedPart
              d={PATH_ARROW}
              transform="translate(170, 266.056886)"
              drawIndex={2}
              fadeIndex={2}
            />
            <AnimatedPurpleDot drawIndex={3} fadeIndex={3} />
          </>
        )}
      </svg>
    </div>
  );
}
