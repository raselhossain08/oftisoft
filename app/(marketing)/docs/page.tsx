"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Search, 
    BookOpen, 
    Code2, 
    Cpu, 
    ShieldCheck, 
    Box, 
    Globe, 
    Zap, 
    ChevronRight, 
    ArrowRight,
    ExternalLink,
    Terminal,
    MessageSquare,
    Layers,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useDocsContentStore } from "@/lib/store/docs-content";

// Icon Map
const iconMap: any = {
    Layers, Cpu, ShieldCheck, Terminal, Zap, Code2, BookOpen, MessageSquare, Box, Globe, FileText
};

export default function DocsPage() {
    const { content } = useDocsContentStore();
    const categories = content?.categories || [];
    const header = content?.header;
    const cta = content?.cta;
    const support = content?.support || [];
    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            {/* Background Texture & Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[140px] opacity-40" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute inset-0 bg-grain opacity-[0.02]" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-24">
                {/* Header Section */}
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-primary/30 bg-primary/5 text-primary font-black italic tracking-[0.3em] text-[10px] uppercase shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            {header?.badge || "Intelligence Repositorium"}
                        </Badge>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black italic tracking-tighter text-white"
                    >
                        {header?.title || "Documentation"} <span className="text-primary NOT-italic">{header?.highlight || "Protocol"}</span>.
                    </motion.h1>
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative max-w-2xl mx-auto group"
                    >
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder={header?.placeholder || "Find architectural intelligence nodes..."}
                            className="h-16 pl-16 rounded-[24px] bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-primary/50 text-lg font-bold italic shadow-2xl transition-all"
                        />
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, idx) => {
                        const Icon = iconMap[category.iconName || 'Layers'] || Layers;
                        return (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="group h-full border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[40px] overflow-hidden hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-700 cursor-pointer">
                                <CardContent className="p-10 space-y-6">
                                    <div className={cn("w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6", category.color)}>
                                        <Icon size={28} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black italic text-white tracking-tight leading-tight">{category.title}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest">{category.count}</span>
                                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );})}
                </div>

                {/* Integration Node (Mock Call to Action) */}
                <div className="bg-gradient-to-r from-primary/10 to-transparent border border-white/10 rounded-[50px] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group shadow-2xl shadow-primary/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[130px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                    <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 text-primary">
                            <BookOpen size={32} />
                            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">{cta?.title || "Advanced SDK Guides"}</h2>
                        </div>
                        <p className="text-xl text-muted-foreground font-medium italic leading-relaxed max-w-2xl">
                            {cta?.description || "Unlock the full architectural potential of your development environment with our hyper-scaled SDK documentation nodes."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black italic shadow-xl shadow-primary/20 text-lg group/btn">
                                {cta?.primaryButton || "Explore SDK Repo"} <Terminal className="w-5 h-5 ml-3 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="outline" className="h-16 px-10 rounded-2xl border-white/10 bg-white/5 text-white font-black italic text-lg hover:bg-white/10">
                                {cta?.secondaryButton || "View GitHub"} <ExternalLink className="w-5 h-5 ml-3" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sub-Footer links/support */}
                <div className="grid md:grid-cols-2 gap-12 pt-12">
                    {support.map((card) => {
                        const Icon = iconMap[card.iconName || 'MessageSquare'] || MessageSquare;
                        return (
                        <div key={card.id} className="flex items-center gap-8 p-10 rounded-[40px] bg-white/[0.02] border border-white/5 group hover:border-blue-500/20 transition-all">
                            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", card.color.replace('text-', 'bg-').replace('500', '500/10'), card.color)}>
                                <Icon size={32} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xl font-black italic text-white tracking-tight">{card.title}</h4>
                                <p className="text-sm text-muted-foreground font-medium italic">{card.description}</p>
                            </div>
                        </div>
                    );})}
                </div>
            </div>
        </div>
    );
}
