"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
    Video, FileText, Code2, ClipboardCheck, Rocket, HeartPulse, Zap, Plus, Save, 
    Trash2, LayoutTemplate, Grid, HelpCircle, Server, Database, Cloud, Brain, 
    Smartphone, Layout, Globe, Code, ShieldCheck, Sparkles, Layers, Crown, ArrowRight
} from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

import { useServicesContentStore } from "@/lib/store/services-content";

// Icon mapping
const iconMap: any = {
    Video, FileText, Code2, ClipboardCheck, Rocket, HeartPulse, Zap, Plus, Save, 
    Trash2, LayoutTemplate, Grid, HelpCircle, Server, Database, Cloud, Brain, 
    Smartphone, Layout, Globe, Code, ShieldCheck, Sparkles, Layers, Crown, ArrowRight
};

export default function ServiceProcess() {
    const { content } = useServicesContentStore();
    const steps = content?.process || [];
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="py-16 md:py-24 bg-background relative overflow-hidden">
             {/* Background */}
             <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
             <div className="absolute top-1/2 left-0 w-full h-[500px] bg-primary/2 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 mx-auto  relative z-10">
                <div className="text-center mb-16 md:mb-24">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-6"
                    >
                        <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors">
                            <Zap className="w-3.5 h-3.5" />
                            Workflow
                        </Badge>
                    </motion.div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Our Process</h2>
                    <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
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

function ProcessStep({ step, index }: { step: any, index: number }) {
    const isEven = index % 2 === 0;
    const Icon = iconMap[step.iconName] || Video;

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
                 <Card className="border-none shadow-none bg-transparent md:bg-card/30 md:backdrop-blur-sm md:border md:border-border/50 transition-all hover:bg-card/50">
                    <CardContent className="p-0 md:p-6">
                        <Badge variant="secondary" className={cn("mb-4 bg-muted border border-border", step.color.replace('text-', 'text-'))}>
                            Step 0{index + 1}
                        </Badge>
                        <h3 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h3>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                            {step.desc}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Center Icon */}
            <div className="absolute left-0 md:left-1/2 -translate-x-[2px] md:-translate-x-1/2 z-10 flex items-center justify-center">
                <div className="relative w-14 h-14 rounded-full bg-background border-4 border-muted flex items-center justify-center group shadow-xl transition-transform duration-300 hover:scale-110">
                    {/* Active State Ring */}
                    <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        className={cn("absolute inset-0 rounded-full border-4 opacity-50", step.color.replace('text-', 'border-'))} 
                    />
                    
                    <Icon className={cn("w-6 h-6 z-20 transition-all duration-300", step.color)} />
                </div>
            </div>
            
            {/* Empty Side for Desktop Layout Balance */}
            <div className="hidden md:block w-[calc(50%-40px)]" />
        </motion.div>
    );
}
