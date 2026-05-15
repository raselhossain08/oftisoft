"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
    const [init, setInit] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const particlesContainer = useRef<Container | undefined>(undefined);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    // Intersection Observer to pause particles when not visible
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0, rootMargin: "100px" }
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    // Pause/resume particles based on visibility
    useEffect(() => {
        if (particlesContainer.current) {
            if (!isVisible) {
                particlesContainer.current.pause();
            } else {
                particlesContainer.current.play();
            }
        }
    }, [isVisible]);

    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        particlesContainer.current = container;
    }, []);

    const options: ISourceOptions = {
        background: {
            color: {
                value: "transparent",
            },
        },
        fpsLimit: 60, // Reduced from 120 to 60 for better performance
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
            },
            modes: {
                push: {
                    quantity: 2, // Reduced from 4
                },
                repulse: {
                    distance: 100, // Reduced from 200, duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: ["#6366f1", "#0ea5e9"],
            },
            links: {
                color: "#6366f1",
                distance: 150,
                enable: true,
                opacity: 0.3,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 0.5, // Reduced from 1
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    width: 800,
                    height: 800
                },
                value: 50, // Reduced from 80
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 1, max: 4 }, // Reduced max from 5
            },
        },
        detectRetina: false, // Disabled for better performance
        pauseOnBlur: true, // Pause when tab is not active
    };

    if (init) {
        return (
            <div ref={containerRef} className="absolute inset-0 -z-10">
                <Particles id="tsparticles"
                    className="absolute inset-0"
                    options={options}
                    particlesLoaded={particlesLoaded}
                />
            </div>
        );
    }

    return <></>;
}
