
"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
    Layout,
    Smartphone,
    Server,
    MessageSquare,
    Code,
    Infinity,
    ArrowRight,
    Brain,
    Globe,
    Zap,
    Cpu,
    Database,
    Cloud,
    Shield
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHomeContentStore } from "@/lib/store/home-content";

const iconMap: Record<string, any> = {
    Layout,
    Smartphone,
    Server,
    MessageSquare,
    Code,
    Infinity,
    Brain,
    Globe,
    Zap,
    Cpu,
    Database,
    Cloud,
    Shield
};

export default function Services() {
    // Get content from CMS store
    const { content } = useHomeContentStore();
    const servicesContent = content?.services || {
        title: "Engineering the",
        subtitle: "Digital Future",
        badge: "Capabilities",
        services: []
    };

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Scroll parallax for section header
    const { scrollYProgress } = useScroll();
    const headerY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    return (
        <section className="py-24 md:py-32 bg-transparent relative overflow-visible z-10" id="services">
            {/* Background Decorations - Optimized */}
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
            
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
                    <motion.div 
                        style={{ y: headerY, opacity: headerOpacity }}
                        className="max-w-3xl w-full md:w-auto"
                    >
                        <Badge variant="outline" className="mb-4 border-primary/20 text-primary uppercase tracking-[0.2em] px-4 py-1.5 backdrop-blur-sm">
                            {servicesContent.badge}
                        </Badge>
                        <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                            {servicesContent.title} <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {servicesContent.subtitle}
                            </span>
                        </h3>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="w-full md:w-auto flex justify-start md:justify-end"
                    >
                        <Link href="/services">
                            <Button variant="ghost" className="group text-base md:text-lg font-medium text-white/80 hover:text-white px-0 hover:bg-transparent">
                                Explore All Services
                                <div className="w-10 h-10 ml-2 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-300">
                                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                                </div>
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Unified Responsive Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servicesContent.services.map((service: any, index: number) => {
                        const Icon = iconMap[service.icon] || Globe;
                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Link href="/services" passHref className="block h-full">
                                <Card className="group relative h-full min-h-[320px] border-white/5 bg-white/5 hover:bg-white/[0.07] transition-all duration-500 overflow-hidden flex flex-col justify-between backdrop-blur-sm">
                                    {/* Gradient Glow Effect */}
                                    <div className={cn(
                                        "absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-gradient-to-tr will-change-transform",
                                        service.gradient
                                    )} />

                                    {/* Card Header & Icon */}
                                    <CardHeader className="relative z-10 pb-0">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={cn(
                                                "p-3 rounded-2xl bg-white/5 border border-white/10 transition-colors duration-300 group-hover:border-white/20",
                                                hoveredIndex === index ? "bg-white/10" : ""
                                            )}>
                                                <Icon className="w-8 h-8 text-white" />
                                            </div>
                                            <ArrowRight className="w-6 h-6 text-white/30 -rotate-45 group-hover:rotate-0 group-hover:text-white transition-all duration-500 ease-out" />
                                        </div>
                                        <CardTitle className="text-2xl font-semibold text-white group-hover:translate-x-1 transition-transform duration-300">
                                            {service.title}
                                        </CardTitle>
                                    </CardHeader>

                                    {/* Content & Tags */}
                                    <CardContent className="relative z-10 pt-4 flex flex-col gap-6 h-full justify-between">
                                        <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                                            {service.description}
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {service.tags.map((tag: string) => (
                                                <Badge 
                                                    key={tag} 
                                                    variant="secondary" 
                                                    className="bg-white/5 border-white/5 text-muted-foreground group-hover:text-white/90 group-hover:border-white/10 transition-colors"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                    
                                </Card>
                            </Link>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
