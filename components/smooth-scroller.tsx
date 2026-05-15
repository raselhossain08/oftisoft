"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";

const styles = `
html.lenis {
  overflow-y: scroll;
}
html.lenis::-webkit-scrollbar {
  width: 6px;
}
html.lenis::-webkit-scrollbar-track {
  background: transparent;
}
html.lenis::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
html.lenis::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
`;

export default function SmoothScroller({ children }: { children: ReactNode }) {
  const rafRef = useRef<number>(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
      syncTouch: true,
      syncTouchLerp: 0.1,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    rafRef.current = requestAnimationFrame(raf);

    // Stop Lenis on route changes so Next.js can handle scroll restoration
  const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (anchor && anchor.href && !anchor.target && anchor.href !== window.location.href) {
        lenis.destroy();
      }
    };
    document.addEventListener('click', handleAnchorClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return <><style>{styles}</style>{children}</>;
}
