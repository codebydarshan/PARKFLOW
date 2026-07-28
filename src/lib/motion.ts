import { useReducedMotion, type Transition, type Variants } from "framer-motion";

export const easeOut: Transition["ease"] = [0.22, 1, 0.36, 1];

const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.01 } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: easeOut },
  },
};

export const staggerChildren = (stagger = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.04,
    },
  },
});

export const scalePop: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.32, ease: easeOut },
  },
};

/** Prefer these in components so reduced-motion users get instant UI. */
export function useMotionVariants() {
  const reduced = useReducedMotion();
  return {
    reduced: !!reduced,
    fadeUp: reduced ? reducedFade : fadeUp,
    fadeIn: reduced ? reducedFade : fadeIn,
    scalePop: reduced ? reducedFade : scalePop,
    hoverLift: reduced ? undefined : { y: -2 },
    hoverScale: reduced ? undefined : { scale: 1.02 },
  };
}
