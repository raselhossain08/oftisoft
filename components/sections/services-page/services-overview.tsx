"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Plus, Save, Trash2, LayoutTemplate, Grid, HelpCircle, Server, Database, Cloud, 
    Brain, Smartphone, Layout, Video, FileText, Code2, ClipboardCheck, Rocket, 
    HeartPulse, Globe, Zap, Code, ShieldCheck, Sparkles, Layers, Crown, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useServicesContentStore } from "@/lib/store/services-content";
import { usePageContent } from "@/hooks/usePageContent";

// Icon mapping
const iconMap: any = {
    Plus, Save, Trash2, LayoutTemplate, Grid, HelpCircle, Server, Database, Cloud, 
    Brain, Smartphone, Layout, Video, FileText, Code2, ClipboardCheck, Rocket, 
    HeartPulse, Globe, Zap, Code, ShieldCheck, Sparkles, Layers, Crown, ArrowRight,
    MessageSquare: Layout // Added fallback
};

export default function ServicesOverview() {
    const { pageContent, isLoading } = usePageContent('services');
    const { content: storeContent } = useServicesContentStore();

    if (isLoading) {
        return (
            <div className="py-16 md:py-24 bg-background relative flex items-center justify-center">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Syncing Service Nodes...
                </div>
            </div>
        );
    }

    const content = pageContent?.content || storeContent;
    const services = content?.overview || [];
    const [activeServiceId, setActiveServiceId] = useState<string | null>(null);

    // Initialize with first service when data loads or if valid
    const activeService = services.find((s: any) => s.id === activeServiceId) || services[0];
    
    // Safety check if no services
    if (!activeService) return null;

    const ActiveIcon = iconMap[activeService.iconName] || Globe;

    return (
        <section className="py-16 md:py-24 bg-background relative overflow-hidden flex items-center">
            {/* Dynamic Background Gradient */}
            <div className="absolute inset-0 transition-colors duration-1000 bg-background">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeService.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className={cn("absolute -top-[50%] -left-[20%] w-[600px] md:w-[1200px] h-[600px] md:h-[1200px] rounded-full blur-[100px] md:blur-[150px] bg-gradient-to-br", activeService.gradient)}
                    />
                </AnimatePresence>
            </div>

            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                    
                    {/* Left: Navigation Menu (Horizontal Scroll on Mobile) */}
                    <div className="w-full lg:w-1/3">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12">Our Expertise</h2>
                            
                            <div className="flex lg:flex-col overflow-x-auto pb-4 lg:pb-0 gap-4 lg:gap-0 no-scrollbar snap-x">
                                {services.map((service: any) => {
                                    const Icon = iconMap[service.iconName] || Globe;
                                    return (
                                        <button
                                            key={service.id}
                                            onClick={() => setActiveServiceId(service.id)}
                                        className="group lg:w-full text-left flex-shrink-0 snap-center"
                                    >
                                        <div className={cn(
                                            "p-4 md:p-6 rounded-2xl transition-all duration-300 border backdrop-blur-sm min-w-[260px] lg:min-w-0",
                                            activeService.id === service.id 
                                                ? "bg-card border-primary/20 shadow-xl shadow-primary/5 lg:translate-x-4" 
                                                : "bg-transparent border-transparent hover:bg-card/30 text-muted-foreground hover:text-foreground"
                                        )}>
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-colors duration-300",
                                                    activeService.id === service.id ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-card"
                                                )}>
                                                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-base md:text-lg">{service.label}</h3>
                                                    {activeService.id === service.id && (
                                                        <motion.div 
                                                            layoutId="active-arrow"
                                                            className="h-1 w-12 bg-primary rounded-full mt-2 hidden lg:block" 
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Dynamic Content Area */}
                    <div className="w-full lg:w-2/3 min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeService.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="relative"
                            >
                                {/* Decorative Icon Background */}
                                <ActiveIcon className="absolute -top-10 -right-10 w-48 h-48 md:w-64 md:h-64 opacity-[0.03] text-foreground rotate-12 pointer-events-none" />

                                <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/10 border-primary/20 text-primary mb-6">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Premium Service
                                </Badge>
                                
                                <h3 className="text-3xl md:text-6xl font-black mb-6 leading-tight">
                                    {activeService.title}
                                </h3>
                                
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl">
                                    {activeService.description}
                                </p>

                                {/* Feature Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
                                    {activeService.features.map((feature: any, idx: number) => {
                                        const FeatureIcon = iconMap[feature.iconName] || Zap;
                                        return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 + (idx * 0.1) }}
                                        >
                                            <Card className="h-full border-border hover:border-primary/50 transition-colors group/card">
                                                <CardContent className="p-6">
                                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover/card:bg-primary/20 group-hover/card:text-primary transition-colors">
                                                        <FeatureIcon className="w-5 h-5" />
                                                    </div>
                                                    <h4 className="font-bold mb-1">{feature.title}</h4>
                                                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                        );
                                    })}
                                </div>

                                <Button asChild size="lg" className="rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                    <Link href={`/services/${activeService.id}`}>
                                        Explore {activeService.label}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>

                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}
