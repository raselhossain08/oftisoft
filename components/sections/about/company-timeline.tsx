
"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { 
    Clock, 
    Zap, 
    Award, 
    Globe, 
    Users, 
    Rocket,
    Briefcase,
    Building2,
    Code2
} from "lucide-react";
import { cn } from "@/lib/utils";

const timelineData = [
    {
        year: "2018",
        title: "The Genesis",
        desc: "Founded in a garage with a single laptop and a vision to simplify complex software.",
        icon: Building2,
        gradient: "from-blue-500 to-indigo-500"
    },
    {
        year: "2020",
        title: "First Major Pivot",
        desc: "Transitioned from general web dev to Specialized Enterprise SaaS engineering.",
        icon: Briefcase,
        gradient: "from-purple-500 to-pink-500"
    },
    {
        year: "2022",
        title: "Scale & Expansion",
        desc: "Doubled the team size and opened our first international office in Singapore.",
        icon: Globe,
        gradient: "from-cyan-500 to-teal-500"
    },
    {
        year: "2024",
        title: "AI Integration",
        desc: "launched 'OfitAI', our proprietary engine for automating frontend workflows.",
        icon: Zap,
        gradient: "from-amber-500 to-orange-500"
    },
    {
        year: "2026",
        title: "Industry Leader",
        desc: "Recognized as a Top 10 Global Tech Partner with 500+ successful deployments.",
        icon: Rocket,
        gradient: "from-green-500 to-emerald-500"
    }
];

export default function CompanyTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100, damping: 30, restDelta: 0.001
    });

    return (
        <section className="py-24 bg-transparent relative overflow-hidden" ref={containerRef}>
            <div className="container px-4 mx-auto">
                <div className="text-center mb-24 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                         <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">
                            Our Origins
                        </h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Evolution of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Innovation.
                            </span>
                        </h3>
                    </motion.div>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Central Track Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2">
                        <motion.div 
                            style={{ scaleY, transformOrigin: "top" }}
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary via-purple-500 to-secondary"
                        />
                    </div>

                    <div className="space-y-12 md:space-y-32">
                        {timelineData.map((item, index) => (
                            <TimelineNode key={index} item={item} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function TimelineNode({ item, index }: { item: typeof timelineData[0], index: number }) {
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
            <div className={cn(
                "w-full md:w-1/2 pl-20 md:pl-0",
                isEven ? "md:text-right md:pr-16" : "md:text-left md:pl-16"
            )}>
                 <div className="group relative">
                    <div className={cn(
                        "text-5xl font-black text-white/5 absolute -top-10 -z-10 transition-colors duration-500 group-hover:text-white/10",
                        isEven ? "right-0" : "left-0"
                    )}>
                        {item.year}
                    </div>
                    
                    <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                        {item.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                        {item.desc}
                    </p>
                 </div>
            </div>

            {/* Central Node */}
            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className={cn(
                    "w-12 h-12 rounded-full border border-white/10 bg-[#0a0a0a] flex items-center justify-center z-10 group shadow-[0_0_0_8px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-110 hover:border-white/30"
                )}>
                    <div className={cn(
                        "absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 bg-gradient-to-r",
                        item.gradient
                    )} />
                    <item.icon className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                </div>
            </div>

            {/* Empty Space */}
            <div className="hidden md:block w-1/2" />
        </motion.div>
    );
}
