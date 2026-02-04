
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Quote, MessageSquareQuote } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef } from "react";

// --- Mock Data ---
const testimonials = [
    {
        name: "Alex Rivera",
        role: "CTO, FinTech Global",
        quote: "Ofitsoft's architecture handled our Black Friday traffic without a single hiccup. Absolute engineering mastery.",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        gradient: "from-blue-500 to-indigo-500"
    },
    {
        name: "Jessica Chen",
        role: "Product Lead, Nexus AI",
        quote: "They didn't just build what we asked for. They anticipated what we needed 6 months down the line.",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        name: "Marcus Thorne",
        role: "Founder, Zenith",
        quote: "The level of polish in the UI/UX is unmatched. Best dev agency I've worked with in a decade.",
        avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
        gradient: "from-green-500 to-emerald-500"
    },
    {
        name: "Sarah Jenkins",
        role: "Director, Creative Pulse",
        quote: "Incredible attention to detail. The animations and micro-interactions make our app feel alive.",
        avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d", // Reusing for mock
        gradient: "from-orange-500 to-amber-500"
    },
    {
        name: "David Kim",
        role: "VP Eng, CloudScale",
        quote: "Scalable, secure, and delivered early. Their DevOps game is strong.",
        avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
        gradient: "from-cyan-500 to-blue-500"
    }
];

// Duplicate for infinite loop
const loopTestimonials = [...testimonials, ...testimonials, ...testimonials];

export default function Testimonials() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
    
    const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const rotate = useTransform(scrollYProgress, [0, 1], [5, -5]);

    return (
        <section ref={containerRef} className="py-32 bg-transparent relative overflow-hidden z-10 text-center">
            {/* Background Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 mx-auto mb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-white/90">Trusted by Market Leaders</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        Voices of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Innovation.
                        </span>
                    </h2>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden mask-gradient-x">
                <div className="flex gap-6 animate-marquee hover:pause whitespace-nowrap py-10">
                    {loopTestimonials.map((t, i) => (
                        <TestimonialCard key={i} data={t} index={i} />
                    ))}
                </div>
                
                {/* Reverse Direction Row (Optional, uncomment if enough data) */}
                {/* 
                <div className="flex gap-6 animate-marquee-reverse hover:pause whitespace-nowrap mt-6">
                    {loopTestimonials.map((t, i) => (
                         <TestimonialCard key={i} data={t} />
                    ))}
                </div> 
                */}
            </div>

            <style jsx global>{`
                .pause { animation-play-state: paused; }
                .mask-gradient-x {
                    mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
            `}</style>
        </section>
    );
}

function TestimonialCard({ data, index }: { data: typeof testimonials[0], index: number }) {
    return (
        <div className="w-[400px] md:w-[450px] shrink-0 p-[1px] rounded-3xl bg-gradient-to-br from-white/10 to-transparent relative group">
            {/* Gradient Border Glow */}
            <div className={cn(
                "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r blur-xl -z-10",
                data.gradient
            )} />

            <div className="h-full bg-[#050505]/80 backdrop-blur-xl rounded-3xl p-8 flex flex-col justify-between border border-white/5 group-hover:bg-[#0a0a0a]/90 transition-colors">
                <div className="mb-6">
                    <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500/50 fill-current group-hover:text-yellow-500 transition-colors" />
                        ))}
                    </div>
                    <p className="text-lg text-muted-foreground/90 leading-relaxed font-light whitespace-normal italic">
                        "{data.quote}"
                    </p>
                </div>
                
                <div className="flex items-center gap-4 border-t border-white/5 pt-6 mt-auto">
                    {/* Avatar Placeholder */}
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br",
                        data.gradient
                    )}>
                        {data.name.charAt(0)}
                    </div>
                    
                    <div className="text-left">
                        <h4 className="text-white font-bold text-sm tracking-wide">{data.name}</h4>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{data.role}</p>
                    </div>
                    
                    <Quote className="w-8 h-8 text-white/5 ml-auto group-hover:text-white/10 transition-colors" />
                </div>
            </div>
        </div>
    );
}
