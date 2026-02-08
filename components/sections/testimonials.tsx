
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Quote, MessageSquareQuote } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useHomeContentStore } from "@/lib/store/home-content";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Testimonials() {
    // Get content from CMS store
    const { content } = useHomeContentStore();
    const testimonialsContent = content?.testimonials || {
        title: "Voices of",
        subtitle: "Innovation.",
        badge: "Trusted by Market Leaders",
        testimonials: []
    };

    // Duplicate for infinite loop
    const loopTestimonials = [
        ...testimonialsContent.testimonials,
        ...testimonialsContent.testimonials,
        ...testimonialsContent.testimonials
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-transparent relative overflow-hidden z-10 text-center">
            {/* Background Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 mx-auto mb-16 md:mb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <Badge variant="outline" className="mb-6 px-4 py-2 border-white/10 bg-white/5 backdrop-blur-md text-white/90 gap-2 hover:bg-white/10 transition-colors">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        {testimonialsContent.badge}
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                        {testimonialsContent.title} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            {testimonialsContent.subtitle}
                        </span>
                    </h2>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden mask-gradient-x">
                <div className="flex gap-6 animate-marquee hover:pause whitespace-nowrap py-10">
                    {loopTestimonials.map((t: any, i: number) => (
                        <TestimonialCard key={i} data={t} index={i} />
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .pause:hover { animation-play-state: paused; }
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
                /* Mobile optimization */
                @media (max-width: 768px) {
                    .animate-marquee { animation-duration: 40s; }
                }
            `}</style>
        </section>
    );
}

function TestimonialCard({ data, index }: { data: any, index: number }) {
    return (
        <div className="w-[320px] md:w-[450px] shrink-0 p-[1px] relative group h-full">
            {/* Gradient Border Glow */}
            <div className={cn(
                "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r blur-xl -z-10",
                data.gradient
            )} />

            <Card className="h-full bg-[#050505]/80 backdrop-blur-xl border-white/5 group-hover:bg-[#0a0a0a]/90 transition-colors rounded-3xl overflow-hidden flex flex-col justify-between">
                <CardContent className="p-8 pb-0">
                    <div className="mb-6">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 text-yellow-500/50 fill-current group-hover:text-yellow-500 transition-colors" />
                            ))}
                        </div>
                        <p className="text-base md:text-lg text-muted-foreground/90 leading-relaxed font-light whitespace-normal italic">
                            "{data.quote}"
                        </p>
                    </div>
                </CardContent>
                
                <CardFooter className="p-8 pt-6 border-t border-white/5 mt-auto bg-white/[0.02]">
                    <div className="flex items-center gap-4 w-full">
                        <Avatar className={cn("h-12 w-12 border-2 border-transparent group-hover:border-primary/50 transition-colors", data.gradient.replace("from-", "bg-"))}>
                             <AvatarImage src={data.avatar} alt={data.name} />
                             <AvatarFallback className={cn("text-white font-bold bg-gradient-to-br", data.gradient)}>{data.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="text-left flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm tracking-wide truncate">{data.name}</h4>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider truncate">{data.role}</p>
                        </div>
                        
                        <Quote className="w-8 h-8 text-white/5 ml-auto group-hover:text-white/10 transition-colors shrink-0" />
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
