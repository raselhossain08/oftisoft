
"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { 
    Search, 
    MessageSquareText, 
    PenTool, 
    Code2, 
    Rocket, 
    BarChart3,
    CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    {
        id: "01",
        title: "Discovery & Strategy",
        description: "We dive deep into your business goals, user needs, and market landscape to build a blueprint for success.",
        icon: Search,
        gradient: "from-blue-500 to-cyan-500"
    },
    {
        id: "02",
        title: "UX/UI Design",
        description: "Crafting intuitive, high-fidelity prototypes. We focus on user journeys that convert visitors into loyal customers.",
        icon: PenTool,
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: "03",
        title: "Agile Development",
        description: "Writing clean, scalable code using Next.js and modern stacks. Variable sprints ensure rapid feedback and iteration.",
        icon: Code2,
        gradient: "from-orange-500 to-amber-500"
    },
    {
        id: "04",
        title: "Testing & QA",
        description: "Rigorous automated and manual testing to ensure rock-solid security, performance, and accessibility.",
        icon: CheckCircle2,
        gradient: "from-green-500 to-emerald-500"
    },
    {
        id: "05",
        title: "Launch & Scale",
        description: "Seamless deployment to edge networks. We monitor real-time metrics and optimize for growth.",
        icon: Rocket,
        gradient: "from-rose-500 to-red-500"
    }
];

export default function ProcessTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Smooth filling of the timeline
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section ref={containerRef} className="py-32 bg-transparent relative overflow-hidden z-10">
            {/* Background Noise/Texture */}
            <div className="absolute inset-0 bg-[url('https://grain-texture-url-here.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
            
            <div className="container px-4 mx-auto">
                <div className="text-center mb-24 max-w-3xl mx-auto">
                     <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">
                            How We Work
                        </h2>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            From Concept to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Reality.
                            </span>
                        </h3>
                    </motion.div>
                </div>

                {/* Vertical Timeline Container */}
                <div className="relative max-w-5xl mx-auto">
                    
                    {/* Central Track Line (Desktop) / Left Line (Mobile) */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2">
                        <motion.div 
                            style={{ scaleY, transformOrigin: "top" }}
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary via-purple-500 to-secondary"
                        />
                    </div>

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <TimelineItem 
                                key={step.id} 
                                step={step} 
                                index={index} 
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineItem({ step, index }: { step: typeof steps[0], index: number }) {
    const isEven = index % 2 === 0;
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={cn(
                "relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0",
                isEven ? "md:flex-row" : "md:flex-row-reverse"
            )}
        >
            {/* Content Card */}
            <div className="w-full md:w-1/2 pl-20 md:pl-0 md:px-16">
                 <div className="group relative bg-white/5 border border-white/5 hover:border-white/10 p-8 rounded-3xl backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.07] overflow-hidden">
                    {/* Glow Effect */}
                    <div className={cn(
                        "absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br opacity-5 blur-[80px] group-hover:opacity-20 transition-opacity duration-500",
                        step.gradient
                    )} />
                    
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/5 group-hover:scale-110 transition-transform duration-300",
                        )}>
                            <step.icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-4xl font-bold text-white/5 font-mono group-hover:text-white/10 transition-colors">
                            {step.id}
                        </span>
                    </div>

                    <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors duration-300 relative z-10">
                        {step.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed relative z-10">
                        {step.description}
                    </p>
                 </div>
            </div>

            {/* Central Node */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-black border-2 border-white/20 z-10 shadow-[0_0_0_8px_rgba(0,0,0,0.5)]">
                    <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="w-full h-full rounded-full bg-primary"
                    />
                </div>
            </div>

            {/* Empty Space for alignment */}
            <div className="hidden md:block w-1/2" />
        </motion.div>
    );
}
