"use client";
import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Zap, 
    Rocket, 
    ArrowRight, 
    Globe, 
    Cpu, 
    Terminal, 
    Github,
    Linkedin,
    Twitter,
    Briefcase,
    Sparkles,
    Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useCareersContentStore } from "@/lib/store/careers-content";

// Icon Map
const iconMap: any = {
    Cpu, Sparkles, Globe, Terminal, Briefcase, Rocket
};

export default function CareersPage() {
    const { pageContent, isLoading } = usePageContent('careers');
    const setContent = useCareersContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    const { content } = useCareersContentStore();
    
    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Initializing Talent Pipeline...
                </div>
            </div>
        );
    }

    const jobs = (content?.jobs || []).filter(j => j.isActive);
    const hero = content?.hero;
    const culture = content?.cultureValues || [];

    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            {/* Background Texture & Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[140px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/5 rounded-full blur-[140px] opacity-30" />
                <div className="absolute inset-0 bg-grain opacity-[0.02]" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-24">
                {/* Header Section */}
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-primary/30 bg-primary/5 text-primary font-black italic tracking-[0.3em] text-[10px] uppercase shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            {hero?.badge || "Architectural Talent Acquisition"}
                        </Badge>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black italic tracking-tighter text-white"
                    >
                        {hero?.titlePrefix || "Forge the"} <span className="text-primary NOT-italic underline decoration-white/10 decoration-8 underline-offset-8">{hero?.titleHighlight || "Future"}</span>{hero?.titleSuffix || "."}
                    </motion.h1>
                    <motion.p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
                        {hero?.description || "Join our global operative and engineer the high-fidelity infrastructure that powers the next generation of digital design."}
                    </motion.p>
                </div>

                {/* Culture Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {culture.map((val) => {
                        const Icon = iconMap[val.iconName] || Flame;
                        return (
                            <Card key={val.id} className="border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[50px] p-12 md:p-16 space-y-8 overflow-hidden relative group">
                                <div className={cn("absolute top-0 right-0 w-64 h-64 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-1000", val.color === 'text-blue-500' ? 'bg-blue-500/10' : 'bg-primary/10')} />
                                <Icon className={cn("w-16 h-16 group-hover:scale-110 transition-transform", val.color)} />
                                <div className="space-y-4 relative z-10">
                                    <h3 className="text-4xl font-black italic text-white tracking-tight">{val.title}</h3>
                                    <p className="text-lg text-muted-foreground font-medium italic">{val.description}</p>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Job Board */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between border-b border-white/10 pb-8">
                        <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white">Open Nodes (Jobs)</h2>
                        <Badge variant="outline" className="border-primary/30 text-primary font-black italic px-4 py-1">{jobs.length} Active Roles</Badge>
                    </div>

                    <div className="grid gap-6">
                        {jobs.map((job, idx) => {
                            const Icon = iconMap[job.iconName || 'Briefcase'] || Briefcase;
                            return (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="group border-white/5 bg-white/[0.01] hover:bg-white/[0.03] rounded-[32px] overflow-hidden transition-all duration-500 hover:border-primary/20 cursor-pointer">
                                    <CardContent className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                        <div className="flex items-center gap-8">
                                            <div className={cn("w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center transition-transform group-hover:scale-110", job.color)}>
                                                <Icon size={28} />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black italic text-white tracking-tight leading-none transition-colors group-hover:text-primary">{job.title}</h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">{job.team}</span>
                                                    <div className="w-1 h-1 rounded-full bg-white/10" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">{job.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button className="h-14 px-8 rounded-2xl bg-white/5 border border-white/10 text-white font-black italic hover:bg-primary hover:text-white hover:border-primary transition-all group-hover:translate-x-2">
                                            Initiate Application <ArrowRight className="w-5 h-5 ml-3" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );})}
                    </div>
                </div>

                {/* Future Node Prompt */}
                <div className="text-center pt-24 space-y-6">
                    <h3 className="text-3xl font-black italic text-white/40">{content?.contact.title || "Don't see your node?"}</h3>
                    <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">
                        {content?.contact.description || "If you're a high-fidelity engineer or visual architect, initiate a direct sync. We're always expanding."}
                    </p>
                    <Button variant="outline" className="h-16 px-12 rounded-2xl border-white/10 bg-white/5 text-white font-black italic text-lg hover:bg-white/10">
                        {content?.contact.buttonText || "Direct Sync (Speculative)"} <ArrowRight className="w-5 h-5 ml-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
