"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { defaultTransition } from "@/lib/animations";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
  once?: boolean;
}

function offsetFor(direction: Direction) {
  switch (direction) {
    case "up":
      return { x: 0, y: 24 };
    case "down":
      return { x: 0, y: -24 };
    case "left":
      return { x: -32, y: 0 };
    case "right":
      return { x: 32, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
}

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-60px" });
  const reduce = useReducedMotion();

  const offset = reduce ? { x: 0, y: 0 } : offsetFor(direction);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              transition: reduce
                ? { duration: 0.2 }
                : { ...defaultTransition, delay },
            }
          : { opacity: 0, x: offset.x, y: offset.y }
      }
    >
      {children}
    </motion.div>
  );
}
