
"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Users, Workflow, Cpu, Headphones, Shield, Zap, Target, Award } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useHomeContentStore } from "@/lib/store/home-content";

const iconMap: Record<string, any> = {
    Users,
    Workflow,
    Cpu,
    Headphones,
    Shield,
    Zap,
    Target,
    Award
};

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function WhyUs() {
    // Get content from CMS store
    const { content } = useHomeContentStore();
    const whyUsContent = content?.whyUs || {
        title: "Why Visionaries",
        subtitle: "Choose Us.",
        badge: "The Ofitsoft Edge",
        description: "We bridge the gap between creative ambition and technical reality.",
        features: [],
        stats: [
            { value: "98%", label: "Retention" },
            { value: "150+", label: "Launches" },
            { value: "Top 3%", label: "Global Talent" }
        ]
    };

    const features = whyUsContent.features || [];
    const stats = whyUsContent.stats || [];

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-transparent relative overflow-hidden z-10" id="why-us">
            {/* Background Beams */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="container px-4 mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 md:mb-20">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <Badge variant="outline" className="mb-6 border-primary/20 text-primary uppercase tracking-widest px-3 py-1 bg-primary/5">
                            {whyUsContent.badge}
                        </Badge>
                        <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {whyUsContent.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                                {whyUsContent.subtitle}
                            </span>
                        </h3>
                        <p className="text-base md:text-lg text-muted-foreground/80 max-w-xl leading-relaxed mx-auto lg:mx-0">
                            {whyUsContent.description}
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                         whileInView={{ opacity: 1, scale: 1 }}
                         viewport={{ once: true }}
                        className="grid grid-cols-2 gap-4"
                    >
                         <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center">
                            <CardContent className="p-6">
                                <h4 className="text-3xl md:text-4xl font-bold text-white mb-1">{stats[0]?.value || "98%"}</h4>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">{stats[0]?.label || "Retention"}</p>
                            </CardContent>
                         </Card>
                         <Card className="bg-primary/10 border-primary/20 backdrop-blur-sm text-center">
                            <CardContent className="p-6">
                                <h4 className="text-3xl md:text-4xl font-bold text-primary mb-1">{stats[1]?.value || "150+"}</h4>
                                <p className="text-xs text-primary/80 uppercase tracking-widest">{stats[1]?.label || "Launches"}</p>
                            </CardContent>
                         </Card>
                         <Card className="bg-white/5 border-white/10 backdrop-blur-sm text-center col-span-2">
                            <CardContent className="p-6">
                                <h4 className="text-3xl md:text-4xl font-bold text-white mb-1">{stats[2]?.value || "Top 3%"}</h4>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest">{stats[2]?.label || "Global Talent"}</p>
                            </CardContent>
                         </Card>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature: any, index: number) => {
                        const Icon = iconMap[feature.icon] || Users;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="h-full"
                            >
                                <Card className="group relative h-full bg-white/5 border-white/5 hover:border-white/10 overflow-hidden transition-all duration-500">
                                    {/* Hover Gradient */}
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                        feature.gradient
                                    )} />
                                     
                                    <CardContent className="relative z-10 flex flex-col h-full p-8 md:p-6 lg:p-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-white/20 transition-colors duration-300 border border-white/5",
                                                feature.color
                                            )}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <Badge variant="secondary" className="bg-white/5 border-white/5 text-xs font-mono text-white/50 group-hover:bg-white/10 group-hover:text-white transition-colors backdrop-blur-md">
                                                {feature.stat} {feature.statLabel}
                                            </Badge>
                                        </div>
                                        
                                        <h4 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                                            {feature.title}
                                        </h4>
                                        
                                        <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
