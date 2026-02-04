
"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Users, Workflow, Cpu, Headphones, Shield, Zap, Target, Award } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const features = [
    {
        title: "Top 1% Talent Network",
        description: "Access a curated team of elite engineers, designers, and strategists. We hire only the best to ensure your product is world-class.",
        icon: Users,
        color: "text-blue-500",
        gradient: "from-blue-500/20 to-blue-600/5",
        stat: "10k+ Hrs",
        statLabel: "Dev Time"
    },
    {
        title: "Agile Rapid Delivery",
        description: "Our streamlined CI/CD pipelines and agile methodologies ensure we ship features 2x faster than traditional agencies.",
        icon: Zap,
        color: "text-yellow-500",
        gradient: "from-yellow-500/20 to-orange-600/5",
        stat: "2x",
        statLabel: "Faster Ship"
    },
    {
        title: "Enterprise Architecture",
        description: "Built for scale from day one. We use microservices and serverless tech that can handle millions of users without breaking.",
        icon: Cpu,
        color: "text-purple-500",
        gradient: "from-purple-500/20 to-indigo-600/5",
        stat: "99.99%",
        statLabel: "Uptime"
    },
    {
        title: "Dedicated 24/7 Support",
        description: "We don't just launch and leave. Our global support team monitors your infrastructure around the clock for peace of mind.",
        icon: Shield,
        color: "text-green-500",
        gradient: "from-green-500/20 to-emerald-600/5",
        stat: "15min",
        statLabel: "Response"
    },
];

export default function WhyUs() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={containerRef} className="py-32 bg-transparent relative overflow-hidden z-10">
            {/* Background Beams */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="container px-4 mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">
                            The Ofitsoft Edge
                        </h2>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Why Visionaries <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                                Choose Us.
                            </span>
                        </h3>
                        <p className="text-lg text-muted-foreground/80 max-w-xl leading-relaxed">
                            We bridge the gap between creative ambition and technical reality. 
                            Our process is designed for clarity, speed, and uncompromising quality.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                         whileInView={{ opacity: 1, scale: 1 }}
                         viewport={{ once: true }}
                        className="grid grid-cols-2 gap-4"
                    >
                         <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                            <h4 className="text-4xl font-bold text-white mb-1">98%</h4>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Retention</p>
                         </div>
                         <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm text-center">
                            <h4 className="text-4xl font-bold text-primary mb-1">150+</h4>
                            <p className="text-xs text-primary/80 uppercase tracking-widest">Launches</p>
                         </div>
                         <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center col-span-2">
                            <h4 className="text-4xl font-bold text-white mb-1">Top 3%</h4>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Global Talent Verification</p>
                         </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group relative h-full bg-mutted/10 border border-white/5 p-8 rounded-3xl flex flex-col overflow-hidden"
                        >
                            {/* Hover Gradient */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                                feature.gradient
                            )} />
                             
                            {/* Content */}
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 group-hover:bg-white/20 transition-colors duration-300",
                                        feature.color
                                    )}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-xs font-mono text-white/50 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                        {feature.stat} {feature.statLabel}
                                    </div>
                                </div>
                                
                                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                                    {feature.title}
                                </h4>
                                
                                <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
