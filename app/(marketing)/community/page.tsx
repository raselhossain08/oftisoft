"use client";
import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
    Users, 
    MessageSquare, 
    Github, 
    Twitter, 
    Slack, 
    Globe, 
    Zap, 
    Heart, 
    Share2, 
    ArrowRight,
    Terminal,
    Bot,
    Code2
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useCommunityContentStore } from "@/lib/store/community-content";

// Icon Map
const iconMap: any = {
    Github, MessageSquare, Slack, Twitter, Globe, Zap, Heart, Share2
};

export default function CommunityPage() {
    const { pageContent, isLoading } = usePageContent('community');
    const setContent = useCommunityContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    const { content } = useCommunityContentStore();

    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Initializing Community Grid...
                </div>
            </div>
        );
    }

    const links = (content?.links || []).filter(l => l.isActive);
    const header = content?.header;
    const newsletter = content?.newsletter;
    const stats = content?.stats || [];

    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            {/* Background Texture & Neural Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[140px] opacity-40" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute inset-0 bg-grain opacity-[0.02]" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-24">
                {/* Header Section */}
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-primary/30 bg-primary/5 text-primary font-black italic tracking-[0.3em] text-[10px] uppercase shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            {header?.badge || "Social Intelligence Hub"}
                        </Badge>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black italic tracking-tighter text-white"
                    >
                        {header?.title || "Community"} <span className="text-primary NOT-italic">{header?.highlight || "Nexus"}</span>.
                    </motion.h1>
                    <motion.p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
                        {header?.description || "Join the global grid of architects, neural engineers, and visual designers building the meta-layer of 2026."}
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {links.map((item, idx) => {
                        const Icon = iconMap[item.iconName || 'Github'] || Github;
                        return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <Card className="h-full border-white/5 bg-white/[0.01] backdrop-blur-3xl rounded-[32px] overflow-hidden hover:border-primary/30 hover:bg-white/[0.03] transition-all duration-700 group cursor-pointer">
                                    <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                                        <div className={cn("w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:rotate-6", item.color)}>
                                            <Icon size={36} />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black italic text-white tracking-tight">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground font-medium italic">{item.label}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </a>
                        </motion.div>
                    );})}
                </div>

                {/* Newsletter Sub-Core */}
                <div className="bg-gradient-to-br from-primary/10 via-background to-background border border-white/10 rounded-[50px] p-12 md:p-24 relative overflow-hidden group shadow-2xl shadow-primary/5">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[140px] rounded-full pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                    <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="flex flex-col lg:flex-row items-center gap-4 text-primary">
                                <Bot size={48} />
                                <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter text-white">{newsletter?.title || "Neural Digest"}</h2>
                            </div>
                            <p className="text-xl text-muted-foreground font-medium italic leading-relaxed">
                                {newsletter?.description || "Receive high-fidelity platform updates, weekly artifact drops, and architectural intelligence nodes directly to your inbox."}
                            </p>
                        </div>
                        <div className="space-y-6">
                            <form className="relative group/form" onSubmit={(e) => e.preventDefault()}>
                                <div className="relative overflow-hidden rounded-[28px] bg-white/[0.03] border border-white/10 p-3 backdrop-blur-xl group-focus-within/form:border-primary/50 transition-all duration-500">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Input 
                                            placeholder={newsletter?.placeholder || "Enter secure email interface..."}
                                            className="h-16 border-none bg-transparent text-white placeholder:text-white/20 focus-visible:ring-0 text-lg font-bold italic px-8"
                                        />
                                        <Button className="h-16 px-12 rounded-[22px] bg-primary hover:bg-primary/90 text-white font-black italic text-lg shadow-2xl shadow-primary/30 transition-all active:scale-95 group/btn">
                                            {newsletter?.buttonText || "Initiate Sync"} <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-2 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </form>
                            <div className="flex items-center gap-4 justify-center lg:justify-start">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">
                                    {newsletter?.footerText || "Trusted by 14k+ Global Architects"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Community Stats */}
                <div className="grid md:grid-cols-3 gap-12 pt-12 border-t border-white/5 opacity-40">
                    {stats.map((stat) => (
                        <div key={stat.id} className="flex flex-col items-center text-center space-y-2">
                            <span className="text-4xl font-black italic text-white tracking-tighter">{stat.value}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
