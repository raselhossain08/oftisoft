"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { forwardRef } from "react";

type AnimateSectionProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  className?: string;
};

const defaultVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const AnimateSection = forwardRef<HTMLDivElement, AnimateSectionProps>(
  ({ children, className, variants, initial, whileInView, viewport, transition, ...props }, ref) => {
    const prefersReduced = useReducedMotion();

    if (prefersReduced) {
      return <div ref={ref} className={className}>{children}</div>;
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={variants || defaultVariants}
        initial={initial ?? "hidden"}
        whileInView={whileInView ?? "visible"}
        viewport={viewport ?? { once: true, margin: "-80px" }}
        transition={transition ?? { duration: 0.5, ease: "easeOut" }}
        style={{ willChange: "transform, opacity" }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AnimateSection.displayName = "AnimateSection";

export { AnimateSection };
