import { Variants, Transition } from 'framer-motion';

/**
 * Editorial Easing Curves
 * - EASE_EDITORIAL: Standard restrained ease-out for architectural reveals
 * - EASE_CINEMATIC: Slower, grand curve for full-bleed heroes and images
 * - EASE_SMOOTH: Fast micro-interactions for buttons and hovers
 */
export const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_CINEMATIC: [number, number, number, number] = [0.25, 1, 0.5, 1];
export const EASE_SMOOTH: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const TRANSITION_EDITORIAL: Transition = {
  duration: 0.8,
  ease: EASE_EDITORIAL,
};

export const TRANSITION_CINEMATIC: Transition = {
  duration: 1.2,
  ease: EASE_CINEMATIC,
};

export const TRANSITION_FAST: Transition = {
  duration: 0.3,
  ease: EASE_SMOOTH,
};

/**
 * Core Reusable Animation Variants
 */

// 1. Fade Up (standard scroll reveal)
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITION_EDITORIAL,
  },
};

// 2. Fade Down
export const fadeDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITION_EDITORIAL,
  },
};

// 3. Fade In (opacity only)
export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: EASE_EDITORIAL,
    },
  },
};

// 4. Stagger Container for Grids & Lists
export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// 5. Stagger Item
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: TRANSITION_EDITORIAL,
  },
};

// 6. Image Cinematic Scale Reveal
export const imageRevealVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 1.06,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: TRANSITION_CINEMATIC,
  },
};

// 7. Masked Clip Text Reveal
export const textMaskRevealVariants: Variants = {
  hidden: {
    y: '100%',
    opacity: 0,
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: EASE_EDITORIAL,
    },
  },
};

// 8. Connecting Line Reveal (e.g. Process section)
export const lineRevealVariants: Variants = {
  hidden: {
    scaleX: 0,
    transformOrigin: 'left',
  },
  visible: {
    scaleX: 1,
    transformOrigin: 'left',
    transition: {
      duration: 1.1,
      ease: EASE_EDITORIAL,
    },
  },
};

// 9. Card Subtle Hover
export const cardHoverTransition: Transition = {
  duration: 0.35,
  ease: EASE_SMOOTH,
};
