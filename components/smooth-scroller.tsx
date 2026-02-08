"use client";

import { ReactNode } from "react";

/**
 * Lenis disabled to prevent infinite reload / scroll glitches.
 * Can re-enable ReactLenis when stability is confirmed.
 */
export default function SmoothScroller({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
