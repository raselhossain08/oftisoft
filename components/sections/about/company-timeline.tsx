
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAboutContentStore } from "@/lib/store/about-content";

const iconMap: any = {
    Building2,
    Briefcase,
    Globe,
    Zap,
    Rocket,
    Clock,
    Award,
    Code2,
    Users
};

export default function CompanyTimeline() {
    const { content } = useAboutContentStore();
    const timelineData = content?.timeline || [];
    
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
                        <Badge variant="outline" className="mb-4 border-primary/20 text-primary uppercase tracking-[0.2em] font-bold px-4 py-1.5 bg-primary/5 rounded-full">
                            {content?.timelineBadge || "Our Origins"}
                        </Badge>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            {content?.timelineTitle || "Evolution of"} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {content?.timelineTitleHighlight || "Innovation."}
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

function TimelineNode({ item, index }: { item: any, index: number }) {
    const isEven = index % 2 === 0;
    const Icon = iconMap[item.icon] || Rocket;

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
                 <Card className="group relative bg-white/5 border-white/5 hover:border-white/10 overflow-hidden transition-all duration-300 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <div className={cn(
                            "text-5xl font-black text-white/5 absolute -top-4 -z-10 transition-colors duration-500 group-hover:text-white/10",
                            isEven ? "right-4" : "left-4"
                        )}>
                            {item.year}
                        </div>
                        
                        <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300 relative z-10">
                            {item.title}
                        </h4>
                        <p className="text-muted-foreground leading-relaxed relative z-10">
                            {item.desc}
                        </p>
                    </CardContent>
                 </Card>
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
                    <Icon className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                </div>
            </div>

            {/* Empty Space */}
            <div className="hidden md:block w-1/2" />
        </motion.div>
    );
}