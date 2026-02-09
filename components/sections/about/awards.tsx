
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

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAboutContentStore } from "@/lib/store/about-content";

const partners = [
    { name: "Google Cloud Partner", icon: Zap },
    { name: "AWS Certified", icon: BadgeCheck },
    { name: "Meta Developers", icon: Star },
    { name: "Vercel Enterprise", icon: Trophy }
];

export default function Awards({ data }: { data?: any }) {
    const { content: storeContent } = useAboutContentStore();
    const awards = data?.awards || storeContent?.awards || [];
    const content = data || storeContent;
    
    const [activeCard, setActiveCard] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-cycle for Desktop Stack
    useEffect(() => {
        if (!awards.length) return;
        const interval = setInterval(() => {
            setActiveCard((prev) => (prev + 1) % awards.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [awards.length]);

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
                        >
                            <Badge variant="outline" className="gap-2 px-3 py-1.5 rounded-full bg-white/5 border-white/10 text-xs font-medium text-primary mb-6 hover:bg-white/10 transition-colors">
                                <Trophy className="w-3 h-3 fill-current" />
                                {content?.awardsBadge || "Hall of Fame"}
                            </Badge>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                        >
                            {content?.awardsTitle || "Recognized for"} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {content?.awardsTitleHighlight || "Digital Excellence."}
                            </span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-muted-foreground/80 mb-10 max-w-lg leading-relaxed"
                        >
                            {content?.awardsDescription || "Our relentless pursuit of perfection has earned us accolades from the industry's most prestigious bodies."}
                        </motion.p>

                        {/* Partners Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {partners.map((partner, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <Card className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-default group h-full">
                                        <div className="p-2 rounded-lg bg-white/5 text-white/60 group-hover:text-primary transition-colors">
                                            <partner.icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{partner.name}</span>
                                    </Card>
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
                                {awards.map((award: any) => (
                                    <SwiperSlide key={award.id} className="rounded-[2rem]">
                                        <AwardCard award={award} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* 2. Desktop: Custom 3D Stack */}
                        <div className="hidden lg:flex h-[500px] w-full items-center justify-end perspective-1000 relative">
                            <AnimatePresence mode="popLayout">
                                {awards.map((award: any, index: number) => {
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
                                {awards.map((_: any, idx: number) => (
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
function AwardCard({ award }: { award: any }) {
    return (
        <Card className="relative h-full overflow-hidden rounded-[2rem] bg-[#0a0a0a] border-white/10 border shadow-2xl flex flex-col justify-between group p-0">
            <CardContent className="h-full flex flex-col justify-between p-8 relative z-10">
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
                        <Badge variant="secondary" className="px-3 py-1 bg-white/5 border-white/10 text-white/90 font-mono text-xs font-bold hover:bg-white/10">
                            {award.year}
                        </Badge>
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
            </CardContent>
        </Card>
    );
}