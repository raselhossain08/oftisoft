"use client";

import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    ShieldCheck, 
    Lock, 
    Eye, 
    Database, 
    Globe, 
    UserCheck, 
    Server, 
    ChevronRight,
    Search,
    Fingerprint,
    Zap,
    Cpu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrivacyContentStore } from "@/lib/store/privacy-content";

const iconMap: any = {
    ShieldCheck, Lock, Eye, Database, Globe, UserCheck, Server, Fingerprint
};

export default function PrivacyPage() {
    const { pageContent, isLoading } = usePageContent('privacy');
    const setContent = usePrivacyContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    const { content } = usePrivacyContentStore();

    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-blue-500 font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Syncing Privacy Protocols...
                </div>
            </div>
        );
    }

    const features = content?.features || [];
    const header = content?.header;
    const guarantee = content?.guarantee;
    const footer = content?.footer;

    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            {/* Background Texture & Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[140px] opacity-40" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute inset-0 bg-grain opacity-[0.02]" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-24">
                {/* Header Section */}
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-blue-500/30 bg-blue-500/5 text-blue-400 font-black italic tracking-[0.3em] text-[10px] uppercase">
                            {header?.badge || "Intelligence Protection Node"}
                        </Badge>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black italic tracking-tighter text-white"
                    >
                        {header?.titlePrefix || "Privacy"} <span className="text-blue-500 NOT-italic">{header?.titleHighlight || "Protocol"}</span>.
                    </motion.h1>
                    <motion.p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">
                        {header?.description || "High-fidelity data governance and identity protection protocols for the Oftisoft architect community."}
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((item, idx) => {
                        const Icon = iconMap[item.iconName] || Lock;
                        return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className="group h-full border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[40px] overflow-hidden hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-700">
                                <CardContent className="p-10 space-y-6">
                                    <div className={cn("w-14 h-14 rounded-2xl bg-muted/30 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6", item.color)}>
                                        <Icon size={28} />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-black italic text-white tracking-tight leading-tight">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">{item.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        );
                    })}
                </div>

                {/* Privacy Guarantee Block */}
                <div className="bg-gradient-to-br from-blue-500/5 via-background to-background border border-white/10 rounded-[50px] p-12 md:p-20 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000" />
                     <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-blue-500">
                                    <ShieldCheck size={40} />
                                    <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">{guarantee?.title || "Trust the Core."}</h2>
                                </div>
                                <p className="text-xl text-muted-foreground font-medium italic leading-relaxed">
                                    {guarantee?.description || "Our commitment to professional privacy is encoded into the very logic-nodes of the Oftisoft engine. We don't just protect data; we engineer trust into the foundation of your digital ecosystem."}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                                {guarantee?.stats.map((stat, i) => (
                                    <Card key={i} className="bg-white/5 border-white/10 rounded-3xl p-6 text-center space-y-2">
                                        <h4 className="text-2xl font-black text-white italic tracking-tight">{stat.value}</h4>
                                        <p className="text-[9px] font-black uppercase text-blue-400 tracking-widest italic">{stat.label}</p>
                                    </Card>
                                ))}
                            </div>
                     </div>
                </div>

                {/* Sub-Footer Meta */}
                <div className="pt-12 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4rem] text-muted-foreground italic">
                        {footer?.status || "Digital Privacy Sync Status: OPERATIONAL / 2026.4.2"}
                    </p>
                </div>
            </div>
        </div>
    );
}
