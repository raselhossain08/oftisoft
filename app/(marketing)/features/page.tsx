"use client";
import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Zap, 
    ShieldCheck, 
    Box, 
    Globe, 
    Code2, 
    Terminal, 
    Layers, 
    Cpu, 
    Search,
    ChevronRight,
    ArrowRight
} from "lucide-react";

import { useFeaturesContentStore } from "@/lib/store/features-content";

// Icon Map
const iconMap: any = {
    Cpu, Globe, ShieldCheck, Layers, Zap, Terminal, Code2, Search
};

export default function FeaturesPage() {
    const { pageContent, isLoading } = usePageContent('features');
    const setContent = useFeaturesContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    const { content } = useFeaturesContentStore();

    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Calibrating Feature Matrix...
                </div>
            </div>
        );
    }

    const features = content?.features || [];
    const header = content?.header;
    const showcase = content?.showcase;
    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            {/* Background Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[10%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-24">
                {/* Hero section */}
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-primary/20 bg-primary/5 text-primary font-black italic tracking-[0.3em] text-[10px] uppercase">
                            {header?.badge || "Core Capabilities Matrix"}
                        </Badge>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-8xl font-black italic tracking-tighter text-white"
                    >
                        {header?.titlePrefix || "Platform"} <span className="text-primary NOT-italic underline decoration-white/10 decoration-8 underline-offset-8">{header?.titleHighlight || "Features"}</span>.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-muted-foreground font-medium italic leading-relaxed"
                    >
                        {header?.description || "Engineer high-fidelity digital experiences with our suite of modern development tools and architectural nodes."}
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {features.map((feature, idx) => {
                        const Icon = iconMap[feature.iconName || 'Zap'] || Zap;
                        return (
                        <motion.div
                            key={feature.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="group h-full border-white/5 bg-white/[0.02] backdrop-blur-2xl rounded-[40px] overflow-hidden hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-700">
                                <CardContent className="p-10 md:p-14 flex flex-col items-center md:items-start text-center md:text-left space-y-8">
                                    <div className={cn("w-20 h-20 rounded-3xl bg-muted/30 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6", feature.color)}>
                                        <Icon size={40} />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-black italic text-white tracking-tight">{feature.title}</h3>
                                        <p className="text-lg text-muted-foreground font-medium leading-relaxed italic">
                                            {feature.description}
                                        </p>
                                    </div>
                                    <Button variant="ghost" className="h-10 p-0 text-primary font-black uppercase tracking-widest text-[10px] italic hover:bg-transparent group/btn">
                                        Analyze Documentation <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );})}
                </div>

                {/* Visual Showcase (Mock) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="p-1 underline-offset-8 mt-24"
                >
                    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background rounded-[50px] overflow-hidden">
                        <CardHeader className="p-12 md:p-16 border-b border-white/5 text-center md:text-left">
                                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">{showcase?.title || "Integrated Visual Forge"}</h2>
                                    <p className="text-muted-foreground mt-4 text-xl">{showcase?.description || "Real-time multi-device simulation and artifact deployment."}</p>
                                </CardHeader>
                                <CardContent className="p-0 bg-[#050505]">
                                    <div className="h-[500px] flex items-center justify-center relative">
                                        <Terminal className="w-64 h-64 text-primary opacity-5 animate-pulse" />
                                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#020202] to-transparent z-10" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-4 text-center z-20">
                                            <Badge className="bg-primary text-white font-black italic px-4 py-1">{showcase?.badgeText || "OPERATIONAL"}</Badge>
                                            <p className="font-mono text-xs text-primary/40">{showcase?.statusText || "SUDO SYNC --NODES ACTIVE"}</p>
                                        </div>
                                    </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
