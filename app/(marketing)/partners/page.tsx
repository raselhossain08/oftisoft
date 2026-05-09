"use client";
import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Users, 
    Handshake, 
    Globe, 
    Zap, 
    ArrowRight,
    Briefcase,
    ShieldCheck,
    Box,
    Sparkles,
    Gem,
    Workflow,
    ExternalLink,
    Cpu,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";

import { usePartnersContentStore } from "@/lib/store/partners-content";

// Icon Map
const iconMap: any = {
    Zap, Globe, Sparkles, ShieldCheck, Handshake, Users, Cpu, Workflow, Gem, Target, Briefcase, Box
};

export default function PartnersPage() {
    const { pageContent, isLoading } = usePageContent('partners');
    const setContent = usePartnersContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    const { content } = usePartnersContentStore();

    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-primary font-semibold animate-pulse tracking-[0.3em]">
                    Initializing Alliance Matrix...
                </div>
            </div>
        );
    }

    const partners = content?.partners || [];
    const header = content?.header;
    const cta = content?.cta;
    const ecosystem = content?.ecosystem;
    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            {/* Background Texture & Neural Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[160px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-600/5 rounded-full blur-[140px] opacity-30" />
                <div className="absolute inset-0 bg-grain opacity-[0.02]" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-24">
                {/* Header Section */}
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-primary/30 bg-primary/5 text-primary font-semibold tracking-[0.3em] text-[10px] shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            {header?.badge ?? ""}
                        </Badge>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-semibold tracking-tighter text-white"
                    >
                        {header?.titlePrefix ?? ""} <span className="text-primary underline decoration-white/10 decoration-8 underline-offset-8">{header?.titleHighlight ?? ""}</span>.
                    </motion.h1>
                    <motion.p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                        {header?.description ?? ""}
                    </motion.p>
                </div>

                {/* Performance Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {partners.map((partner, idx) => {
                        const Icon = iconMap[partner.iconName ?? ''] || Zap;
                        return (
                        <motion.div
                            key={partner.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="h-full border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[40px] overflow-hidden hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-700 group cursor-pointer">
                                <CardContent className="p-10 md:p-14 space-y-8">
                                    <div className="flex items-start justify-between">
                                        <div className={cn("w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110", partner.color)}>
                                            <Icon size={40} />
                                        </div>
                                        <Badge variant="outline" className="text-[9px] font-semibold tracking-widest px-4 py-1.5 border-white/10 bg-white/5 text-white/40">Tier-1 Node</Badge>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-4xl font-semibold text-white tracking-tight leading-none group-hover:text-primary transition-colors">{partner.name}</h3>
                                            <span className="text-[10px] font-semibold tracking-[0.2em] text-primary">{partner.role}</span>
                                        </div>
                                        <p className="text-xl text-muted-foreground font-medium leading-relaxed">{partner.desc}</p>
                                    </div>
                                    <Button variant="ghost" className="h-10 text-white/40 font-semibold tracking-widest text-[10px] hover:bg-transparent hover:text-white p-0 group/btn">
                                        Analyze Integration <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );})}
                </div>

                {/* Partner CTA */}
                <div className="bg-gradient-to-br from-primary/10 via-background to-background border border-white/10 rounded-[60px] p-12 md:p-24 overflow-hidden relative group text-center lg:text-left">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
                    <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-8">
                            <div className="flex flex-col lg:flex-row items-center gap-6 text-primary">
                                <Handshake size={64} className="group-hover:rotate-12 transition-transform" />
                                <h2 className="text-4xl md:text-7xl font-semibold tracking-tighter text-white">{cta?.title ?? ""}</h2>
                            </div>
                            <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                                {cta?.description ?? ""}
                            </p>
                        </div>
                        <div className="flex flex-col gap-6 items-center lg:items-end">
                            <Button className="h-18 px-12 rounded-3xl bg-primary hover:bg-primary/90 text-white font-semibold text-xl shadow-2xl shadow-primary/30 active:scale-95 transition-all group/btn">
                                {cta?.buttonText ?? ""} <Zap className="w-5 h-5 ml-3" />
                            </Button>
                            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/20">
                                {cta?.subText ?? ""}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Ecosystem Brands (Mock Logotypes) */}
                <div className="pt-24 space-y-12">
                     <h4 className="text-[10px] font-semibold tracking-[0.4rem] text-muted-foreground text-center">{ecosystem?.title ?? ""}</h4>
                     <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all">
                        {(ecosystem?.brands || []).map((brand) => (
                            <span key={brand.id} className="text-2xl md:text-4xl font-semibold text-white tracking-widest">{brand.name}</span>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
}

