import type { Variants, Transition } from "framer-motion";

export const defaultTransition: Transition = {
  ease: [0.21, 0.47, 0.32, 0.98],
  duration: 0.55,
};

export const exitTransition: Transition = {
  ease: "easeOut",
  duration: 0.25,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...defaultTransition, duration: 0.6 },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { ...defaultTransition, duration: 0.4 },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...defaultTransition, duration: 0.5 },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...defaultTransition, duration: 0.3 },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...defaultTransition, duration: 0.5 },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...defaultTransition, duration: 0.5 },
  },
};

export const hoverLift = { y: -3 };

export const tapPress = { y: 1, scale: 0.98 };

export const hoverGlow = {
  "--card-glow-opacity": "1",
} as const;

export const errorShake = {
  x: [0, -6, 6, -4, 4, 0],
  transition: { duration: 0.4 },
};
