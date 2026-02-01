
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Search,
    FileSpreadsheet,
    Palette,
    Code2,
    CheckCircle2,
    Rocket
} from "lucide-react";

const steps = [
    {
        title: "Discovery",
        description: "We dive deep into your requirements, understanding your business goals and target audience.",
        icon: Search,
        color: "text-blue-500"
    },
    {
        title: "Planning",
        description: "Developing a strategic roadmap and system architecture to ensure a solid foundation.",
        icon: FileSpreadsheet,
        color: "text-indigo-500"
    },
    {
        title: "Design",
        description: "Crafting intuitive and visually stunning interfaces that enhance user experience.",
        icon: Palette,
        color: "text-purple-500"
    },
    {
        title: "Development",
        description: "Writing clean, scalable, and efficient code to bring the design to life.",
        icon: Code2,
        color: "text-pink-500"
    },
    {
        title: "Testing",
        description: "Rigorous quality assurance to ensure bug-free and high-performance delivery.",
        icon: CheckCircle2,
        color: "text-green-500"
    },
    {
        title: "Launch",
        description: "Deployment, monitoring, and ongoing support to ensure continued success.",
        icon: Rocket,
        color: "text-orange-500"
    }
];

export default function ProcessTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Animate the vertical line
        gsap.fromTo(lineRef.current,
            { height: "0%" },
            {
                height: "100%",
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top center",
                    end: "bottom center",
                    scrub: 1,
                }
            }
        );

        // Animate steps
        const stepElements = document.querySelectorAll(".timeline-step");
        stepElements.forEach((step, index) => {
            gsap.fromTo(step,
                { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: step,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        return () => {
            // Cleanup if needed, though ScrollTrigger usually handles it
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <section className="py-24 bg-background relative overflow-hidden" ref={containerRef}>
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                        Our Process
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        A proven workflow for successful delivery.
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Central Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-border h-full -z-10 rounded-full">
                        <div ref={lineRef} className="w-full bg-gradient-to-b from-primary to-secondary rounded-full" />
                    </div>

                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div key={index} className={`timeline-step flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                                {/* Content Side */}
                                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12 text-left'}`}>
                                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>

                                {/* Center Icon */}
                                <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-card border-2 border-primary rounded-full shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                    <step.icon className={`w-5 h-5 ${step.color}`} />
                                </div>

                                {/* Empty Side */}
                                <div className="w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
