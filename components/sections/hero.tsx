
"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CountUp from "react-countup";
import { ArrowRight, Play, Code2, Cpu, Globe, CheckCircle2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useHomeContentStore } from "@/lib/store/home-content";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
    // Get content from CMS store
    const { content } = useHomeContentStore();
    const heroContent = content?.hero || {
        title: 'Future-Ready',
        subtitle: 'Digital Solutions.',
        description: 'We engineer premium software experiences that redefine industries. Built for performance, scalability, and impact.',
        badge: 'Accepting New Projects',
        primaryCTA: { text: 'Start Project', link: '/#contact' },
        secondaryCTA: { text: 'Showreel', link: '/portfolio' },
        stats: [
            { value: 150, suffix: '+', label: 'Projects Completed' },
            { value: 98, suffix: '%', label: 'Client Satisfaction' },
            { value: 6, suffix: 'Y', label: 'Years Experience' }
        ]
    };

    // ... existing refs and hooks ...
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 100]);
    
    // SMOOTH MOUSE PARALLAX
    // We use a much softer spring config to prevent jitter/flickering
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Optimized mouse handler with requestAnimationFrame implicit in framer motion
    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        // Calculate percentage from center (-1 to 1)
        const x = (clientX - innerWidth / 2) / innerWidth;
        const y = (clientY - innerHeight / 2) / innerHeight;
        
        mouseX.set(x);
        mouseY.set(y);
    };

    // Very smooth spring physics
    const springConfig = { damping: 50, stiffness: 400, mass: 2 }; 
    const rotateX = useSpring(useTransform(mouseY, [-1, 1], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), springConfig);

    return (
        <section 
            ref={containerRef}
            className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-0 bg-transparent perspective-container"
            onMouseMove={handleMouseMove}
        >
            {/* Ambient Background Glows - Optimized with translate3d for GPU */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-20 pointer-events-none will-change-transform" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] mix-blend-screen opacity-20 pointer-events-none will-change-transform" />

            <div className="container relative z-10 px-4 mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Content */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 max-w-2xl mx-auto lg:mx-0">
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Link href="/contact">
                                <Badge variant="glass" className="px-5 py-2.5 gap-2.5 rounded-full text-base font-medium tracking-wide cursor-pointer hover:bg-white/10 transition-colors">
                                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                    </span>
                                    {heroContent.badge}
                                </Badge>
                            </Link>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
                        >
                            <span className="block text-foreground drop-shadow-sm">{heroContent.title}</span>
                            <SmoothTypewriter heroContent={heroContent} />
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-muted-foreground/80 font-light leading-relaxed"
                        >
                            {heroContent.description}
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
                        >
                            <Button asChild size="xl" variant="premium" className="w-full sm:w-auto overflow-hidden group">
                                <Link href="/contact">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {heroContent.primaryCTA.text}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                                </Link>
                            </Button>

                            <Button asChild size="xl" variant="outline" className="w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 text-foreground backdrop-blur-sm rounded-full group">
                                <Link href="/portfolio">
                                    <Play className="w-4 h-4 fill-current mr-2 group-hover:scale-110 transition-transform" />
                                    {heroContent.secondaryCTA.text}
                                </Link>
                            </Button>
                        </motion.div>

                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                            }}
                            className="pt-10 w-full border-t border-white/5 mt-8 flex flex-wrap justify-center md:justify-between lg:justify-start gap-x-8 gap-y-6"
                        >
                            {heroContent.stats?.map((stat: any, i: number) => (
                                <motion.div 
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    className="relative group flex flex-col items-center lg:items-start min-w-[100px]"
                                >
                                    <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative w-full">
                                        <div className="flex items-baseline justify-center lg:justify-start gap-1">
                                            <span className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                                <CountUp end={stat.value} duration={2.5} enableScrollSpy scrollSpyOnce />
                                            </span>
                                            <span className="text-xl text-primary font-semibold">{stat.suffix}</span>
                                        </div>
                                        <div className="h-0.5 w-8 bg-primary/30 mt-2 mb-2 mx-auto lg:mx-0 group-hover:w-full transition-all duration-500" />
                                        <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-medium text-center lg:text-left">
                                            {stat.label}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: 3D Animation Hub - REFINED & FLICKER-FREE */}
                    <div className="relative hidden lg:flex h-[600px] w-full items-center justify-center perspective-[2000px]">
                        
                        <motion.div 
                            style={{ rotateX, rotateY }}
                            className="relative w-[500px] h-[500px] flex items-center justify-center transform-style-3d will-change-transform"
                        >
                            {/* 1. Main Outer Ring (Dashed) */}
                            <div className="absolute inset-0 border border-dashed border-white/20 rounded-full animate-[spin_60s_linear_infinite]" />
                            
                            {/* 2. Inner Orbit Ring (Solid Thin) */}
                            <div className="absolute inset-[15%] border border-white/10 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                            
                            {/* 3. Central Core Glow */}
                            <div className="absolute inset-[30%] bg-blue-500/20 rounded-full blur-[80px] animate-pulse-slow" />
                            
                            {/* 4. The Sphere */}
                            <Link href="/services">
                                <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 backdrop-blur-md border border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.2)] flex items-center justify-center z-10 group transition-transform duration-500 hover:scale-110 cursor-pointer">
                                    <Globe className="w-20 h-20 text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" strokeWidth={1} />
                                    {/* Detail rings on sphere */}
                                    <div className="absolute inset-0 rounded-full border-t border-white/30 rotate-45" />
                                    <div className="absolute inset-2 rounded-full border-b border-white/10 -rotate-12" />
                                </div>
                            </Link>

                            {/* 5. Floating Glass Cards - Positioned in 3D Space */}
                            
                            {/* Card 1: CPU */}
                            <Link href="/services">
                                <motion.div 
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 -left-4 w-48 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl transform-style-3d hover:border-purple-500/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/40 transition-colors">
                                            <Cpu className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div className="h-2 w-12 bg-white/10 rounded-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-1.5 w-full bg-white/5 rounded-full" />
                                        <div className="h-1.5 w-3/4 bg-white/5 rounded-full" />
                                    </div>
                                </motion.div>
                            </Link>

                            {/* Card 2: Code */}
                            <Link href="/services">
                                <motion.div 
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute bottom-8 -right-8 w-44 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl transform-style-3d hover:border-blue-500/50 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/40 transition-colors">
                                            <Code2 className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-mono">.TSX</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-1.5 w-20 bg-blue-400/20 rounded-full" />
                                        <div className="h-1.5 w-full bg-white/5 rounded-full" />
                                    </div>
                                </motion.div>
                            </Link>

                            {/* Card 3: Status Pill */}
                            <Link href="/status">
                                <motion.div 
                                    animate={{ x: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute top-1/2 -right-24 -translate-y-1/2 px-4 py-3 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl flex items-center gap-3 transform-style-3d hover:scale-105 transition-transform cursor-pointer"
                                >
                                    <span className="relative flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    <span className="text-sm font-semibold text-white tracking-wide">System Online</span>
                                </motion.div>
                            </Link>

                        </motion.div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .perspective-container { perspective: 2000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .will-change-transform { will-change: transform; }
            `}</style>
        </section>
    );
}

function SmoothTypewriter({ heroContent }: { heroContent: any }) {
    const defaultWords = [
        "Digital Solutions.",
        "Web Architecture.",
        "AI Innovation.",
        "SaaS Platforms."
    ];
    
    // If subtitles array is provided, use it, otherwise use subtitle as a single word, otherwise default words
    const words = heroContent.subtitles?.length ? heroContent.subtitles : (heroContent.subtitle ? [heroContent.subtitle] : defaultWords);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (words.length <= 1) return; // Don't cycle if only one word
        
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className="flex gap-2 items-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient h-[1.1em]">
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[index]}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="overflow-hidden whitespace-nowrap block"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
            {words.length > 1 && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-[3px] h-[0.9em] bg-purple-400 rounded-full inline-block"
                />
            )}
        </span>
    );
}
