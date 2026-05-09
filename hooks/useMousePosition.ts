import { useState, useEffect, useCallback, useRef } from "react";

export const useMousePosition = (throttleMs: number = 16) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const lastUpdate = useRef(0);
    const rafId = useRef<number | null>(null);
    const pendingPosition = useRef({ x: 0, y: 0 });

    const updatePosition = useCallback(() => {
        setMousePosition(pendingPosition.current);
        rafId.current = null;
    }, []);

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            pendingPosition.current = { x: ev.clientX, y: ev.clientY };
            
            const now = performance.now();
            if (now - lastUpdate.current >= throttleMs) {
                lastUpdate.current = now;
                if (rafId.current) cancelAnimationFrame(rafId.current);
                rafId.current = requestAnimationFrame(updatePosition);
            }
        };

        window.addEventListener("mousemove", updateMousePosition, { passive: true });

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [throttleMs, updatePosition]);

    return mousePosition;
};
