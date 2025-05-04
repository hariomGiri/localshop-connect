
export type AnimationConfig = {
  initial: Record<string, any>;
  animate: Record<string, any>;
  transition: Record<string, any>;
};

export const fadeIn: AnimationConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

export const fadeInUp: AnimationConfig = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

export const fadeInDown: AnimationConfig = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

export const staggerChildren = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { 
    staggerChildren: 0.1,
    delayChildren: 0.1
  }
};

export const scaleIn: AnimationConfig = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { 
    duration: 0.5, 
    ease: [0.22, 1, 0.36, 1]
  }
};

export const slideInRight: AnimationConfig = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

export const slideInLeft: AnimationConfig = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
};

// Helper to create stagger delays for multiple elements
export const createStaggerDelay = (
  index: number, 
  baseDelay: number = 0.1, 
  increment: number = 0.1
) => {
  return baseDelay + index * increment;
};
