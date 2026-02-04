
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Award, Star, Trophy, BadgeCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

// --- Mock Data ---
const awards = [
    {
        id: 1,
        title: "Global Tech Innovator",
        org: "Web3 Summit",
        year: "2025",
        description: "Awarded for breakthrough architecture in decentralized finance platforms.",
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: 2,
        title: "Best UX/UI Design",
        org: "Awwwards",
        year: "2025",
        description: "Recognized for setting new standards in user-centric digital experiences.",
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: 3,
        title: "Enterprise Solution",
        org: "SaaS Awards",
        year: "2024",
        description: "Top-tier reliability and scalability for high-traffic enterprise systems.",
        gradient: "from-orange-500 to-amber-500"
    },
    {
        id: 4,
        title: "Fastest Growing Agency",
        org: "Inc. 5000",
        year: "2024",
        description: "Ranked among the top 100 fastest growing software agencies globally.",
        gradient: "from-green-500 to-emerald-500"
    }
];

const partners = [
    { name: "Google Cloud Partner", icon: Zap },
    { name: "AWS Certified", icon: BadgeCheck },
    { name: "Meta Developers", icon: Star },
    { name: "Vercel Enterprise", icon: Trophy }
];

export default function Awards() {
    const [activeCard, setActiveCard] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-cycle for Desktop Stack
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % awards.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-transparent relative overflow-hidden">
             {/* Dynamic Background */}
             <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

            <div className="container px-4 mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    
                    {/* Left Content */}
                    <div className="relative z-10 w-full">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-6"
                        >
                            <Trophy className="w-3 h-3 fill-current" />
                            <span>Hall of Fame</span>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                        >
                            Recognized for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Digital Excellence.
                            </span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-muted-foreground/80 mb-10 max-w-lg leading-relaxed"
                        >
                            Our relentless pursuit of perfection has earned us accolades from the industry's most prestigious bodies.
                        </motion.p>

                        {/* Partners Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {partners.map((partner, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-default group"
                                >
                                    <div className="p-2 rounded-lg bg-white/5 text-white/60 group-hover:text-primary transition-colors">
                                        <partner.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{partner.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Responsive Logic */}
                    <div className="w-full relative">
                        
                        {/* 1. Mobile & Tablet: Swiper Carousel */}
                        <div className="block lg:hidden w-full max-w-[320px] mx-auto">
                            <Swiper
                                effect={'cards'}
                                grabCursor={true}
                                modules={[EffectCards, Autoplay, Pagination]}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                pagination={{ clickable: true, dynamicBullets: true }}
                                className="w-full aspect-[3/4]"
                            >
                                {awards.map((award) => (
                                    <SwiperSlide key={award.id} className="rounded-[2rem]">
                                        <AwardCard award={award} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* 2. Desktop: Custom 3D Stack */}
                        <div className="hidden lg:flex h-[500px] w-full items-center justify-end perspective-1000 relative">
                            <AnimatePresence mode="popLayout">
                                {awards.map((award, index) => {
                                    const isActive = index === activeCard;
                                    const offset = (index - activeCard + awards.length) % awards.length;
                                    
                                    // Only show 3 cards visually
                                    if (offset > 2) return null;

                                    return (
                                        <motion.div
                                            key={award.id}
                                            layoutId={`award-${award.id}`}
                                            initial={{ opacity: 0, scale: 0.8, z: -100, x: 100 }}
                                            animate={{ 
                                                opacity: isActive ? 1 : 1 - (offset * 0.3),
                                                scale: isActive ? 1 : 1 - (offset * 0.1),
                                                // Stack to the right and back
                                                x: isActive ? 0 : offset * 40, 
                                                y: isActive ? 0 : offset * 10,
                                                z: isActive ? 0 : -offset * 50,
                                                rotateY: isActive ? 0 : -10, // Slight rotation for fan effect
                                                zIndex: awards.length - offset
                                            }}
                                            exit={{ opacity: 0, scale: 0.8, x: -100 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                            className="absolute right-12 w-[350px]"
                                            style={{ transformStyle: "preserve-3d" }}
                                        >
                                            <AwardCard award={award} />
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Desktop Custom Nav Dots */}
                            <div className="absolute bottom-10 right-[400px] flex flex-col gap-3">
                                {awards.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveCard(idx)}
                                        className={cn(
                                            "w-1.5 rounded-full transition-all duration-300 bg-white/20 hover:bg-white/60",
                                            idx === activeCard ? "h-8 bg-primary" : "h-1.5"
                                        )}
                                        aria-label={`View award ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </section>
    );
}

// Reusable Card Component to keep code DRY
function AwardCard({ award }: { award: typeof awards[0] }) {
    return (
        <div className="relative h-full overflow-hidden rounded-[2rem] bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl flex flex-col justify-between">
            {/* Gradient Background Glow */}
            <div className={cn(
                "absolute inset-0 opacity-[0.15] bg-gradient-to-br transition-opacity duration-500",
                award.gradient
            )} />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg text-white",
                        award.gradient
                    )}>
                        <Award className="w-7 h-7" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/90 font-mono text-xs font-bold">
                        {award.year}
                    </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {award.title}
                </h3>
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                    {award.org}
                </div>
                <p className="text-muted-foreground/90 text-sm leading-relaxed">
                    {award.description}
                </p>
            </div>

            {/* Bottom Glow */}
            <div className={cn(
                "absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-20 pointer-events-none",
                award.gradient
            )} />
        </div>
    );
}
