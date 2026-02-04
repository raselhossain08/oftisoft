"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Video, FileText, Code2, ClipboardCheck, Rocket, HeartPulse, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const steps = [
    { 
        id: 1, 
        title: "Discovery & Strategy", 
        icon: Video, 
        color: "text-blue-500", 
        gradient: "from-blue-500/20 to-cyan-500/20",
        desc: "We start with a deep dive into your business goals. Through collaborative workshops, we define the roadmap, user personas, and core technical requirements." 
    },
    { 
        id: 2, 
        title: "Architecture & Design", 
        icon: FileText, 
        color: "text-purple-500", 
        gradient: "from-purple-500/20 to-pink-500/20",
        desc: "Our architects map out the scalable system infrastructure while designers craft intuitive, high-fidelity prototypes for your approval." 
    },
    { 
        id: 3, 
        title: "Agile Development", 
        icon: Code2, 
        color: "text-orange-500", 
        gradient: "from-orange-500/20 to-red-500/20",
        desc: "We code in two-week sprints, giving you regular demos and the ability to pivot. Quality is baked in with TDD (Test Driven Development)." 
    },
    { 
        id: 4, 
        title: "QA & Refinement", 
        icon: ClipboardCheck, 
        color: "text-yellow-500", 
        gradient: "from-yellow-500/20 to-amber-500/20",
        desc: "Rigorous testing across devices, security audits, and performance tuning ensures a bug-free experience before we even think about launch." 
    },
    { 
        id: 5, 
        title: "Launch & Scale", 
        icon: Rocket, 
        color: "text-red-500", 
        gradient: "from-red-500/20 to-rose-500/20",
        desc: "A seamless deployment strategy ensures zero downtime. We configure CDNs, SSLs, and analytics to get you ready for prime time." 
    },
    { 
        id: 6, 
        title: "Growth & Support", 
        icon: HeartPulse, 
        color: "text-green-500", 
        gradient: "from-green-500/20 to-emerald-500/20",
        desc: "Launch is just day one. We provide 24/7 monitoring, feature updates, and scaling optimization to help your product grow." 
    }
];

export default function ServiceProcess() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="py-24 bg-background relative overflow-hidden">
             {/* Background */}
             <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
             <div className="absolute top-1/2 left-0 w-full h-[500px] bg-primary/2 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 mx-auto max-w-5xl">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">Our Process</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A proven, transparent workflow designed to mitigate risk and deliver exceptional results.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Connecting Line (Mobile & Desktop) */}
                    <div className="absolute left-[28px] md:left-1/2 top-4 bottom-4 w-1 bg-muted/50 -translate-x-1/2 rounded-full z-0">
                        <motion.div 
                            style={{ height: lineHeight }}
                            className="w-full bg-gradient-to-b from-primary via-purple-500 to-green-500 rounded-full origin-top"
                        />
                    </div>

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <ProcessStep key={step.id} step={step} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function ProcessStep({ step, index }: { step: typeof steps[0], index: number }) {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={cn(
                "relative flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0",
                isEven ? "md:flex-row-reverse" : ""
            )}
        >
            {/* Content Side */}
            <div className={cn("w-full md:w-[calc(50%-40px)] pl-16 md:pl-0", isEven ? "md:text-right md:pr-12" : "md:pl-12")}>
                <div className="hidden md:block">
                     <span className={cn("inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 bg-muted border border-border", step.color)}>
                        Step 0{step.id}
                    </span>
                    <h3 className="text-3xl font-bold mb-4">{step.title}</h3>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        {step.desc}
                    </p>
                </div>
                {/* Mobile Only Header (to match visual hierarchy) */}
                <div className="md:hidden">
                    <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed">
                        {step.desc}
                    </p>
                </div>
            </div>

            {/* Center Icon */}
            <div className="absolute left-0 md:left-1/2 -translate-x-[2px] md:-translate-x-1/2 z-10 flex items-center justify-center">
                <div className="relative w-14 h-14 rounded-full bg-background border-4 border-muted flex items-center justify-center group shadow-xl">
                    {/* Active State Ring */}
                    <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        className={cn("absolute inset-0 rounded-full border-4 opacity-50", step.color.replace('text-', 'border-'))} 
                    />
                    
                    <step.icon className={cn("w-6 h-6 z-20 transition-all duration-300 group-hover:scale-110", step.color)} />
                </div>
            </div>
            
            {/* Empty Side for Desktop Layout Balance */}
            <div className="hidden md:block w-[calc(50%-40px)]" />
        </motion.div>
    );
}
