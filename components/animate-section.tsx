"use client"
import { AnimatedDiv, useReducedMotion } from "@/lib/animated";

import { useRef } from "react";

type AnimateSectionProps = {
  children: React.ReactNode;
  className?: string;
  variants?: any;
  initial?: any;
  whileInView?: any;
  viewport?: any;
  transition?: any;
  style?: React.CSSProperties;
};

const defaultVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function AnimateSection({ children, className, variants, initial, whileInView, viewport, transition, style }: AnimateSectionProps) {
  const prefersReduced = useReducedMotion();
  const fallbackRef = useRef<HTMLDivElement>(null);

  if (prefersReduced) {
    return <div ref={fallbackRef} className={className}>{children}</div>;
  }

  return (
    <AnimatedDiv
      className={className}
      variants={variants || defaultVariants}
      initial={initial ?? "hidden"}
      whileInView={whileInView ?? "visible"}
      viewport={viewport ?? { once: true, margin: "-80px" }}
      transition={transition ?? { duration: 0.5, ease: "easeOut" }}
      style={{ willChange: "transform, opacity", ...style }}
    >
      {children}
    </AnimatedDiv>
  );
}

export { AnimateSection };
