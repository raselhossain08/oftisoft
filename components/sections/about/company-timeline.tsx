
"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building, Trophy, Brain, Users, Globe, Rocket } from "lucide-react";

const milestones = [
    { year: "2018", title: "Foundation", icon: Building, color: "text-blue-500", desc: "Laid the groundwork for Ofitsoft with a vision for excellence." },
    { year: "2019", title: "First 50 Projects", icon: Trophy, color: "text-yellow-500", desc: "Reached a major milestone delivering quality solutions." },
    { year: "2020", title: "AI Division Launch", icon: Brain, color: "text-purple-500", desc: "Started integrating AI for smarter business automation." },
    { year: "2022", title: "Team Expansion", icon: Users, color: "text-green-500", desc: "Grew our family of engineers and designers." },
    { year: "2024", title: "Global Clients", icon: Globe, color: "text-cyan-500", desc: "Serving clients across continents with diverse needs." },
    { year: "2026", title: "Current Innovation", icon: Rocket, color: "text-red-500", desc: "Pushing boundaries with Next.js and advanced tech." },
];

export default function CompanyTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top center",
                end: "bottom center",
                scrub: 1
            }
        });

        tl.fromTo(lineRef.current, { height: 0 }, { height: "100%", ease: "none" });

        const items = gsap.utils.toArray(".milestone-item");
        items.forEach((item: any, i) => {
            gsap.from(item, {
                opacity: 0,
                y: 50,
                duration: 0.5,
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                }
            });
        });

    }, []);

    return (
        <section className="py-24 bg-card/50 relative" ref={containerRef}>
            <div className="container px-4 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Our Journey</h2>

                <div className="relative max-w-4xl mx-auto pl-8 md:pl-0">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-border -translate-x-1/2">
                        <div ref={lineRef} className="w-full bg-primary" />
                    </div>

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className={`milestone-item relative flex flex-col md:flex-row items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Content */}
                                <div className={`md:w-1/2 w-full pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                                    <div className="bg-background border border-border p-6 rounded-2xl shadow-lg hover:shadow-primary/10 transition-shadow group cursor-pointer hover:-translate-y-1 duration-300">
                                        <span className={`text-sm font-bold ${milestone.color} mb-1 block`}>{milestone.year}</span>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{milestone.title}</h3>
                                        <p className="text-muted-foreground text-sm">{milestone.desc}</p>
                                    </div>
                                </div>

                                {/* Center Icon */}
                                <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-16 h-16 rounded-full bg-card border-4 border-background flex items-center justify-center shadow-lg z-10 transition-transform hover:scale-110 hover:border-primary">
                                    <milestone.icon className={`w-6 h-6 ${milestone.color}`} />
                                </div>

                                {/* Spacer */}
                                <div className="md:w-1/2 hidden md:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
