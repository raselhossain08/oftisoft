"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Activity, 
    Globe, 
    Cpu, 
    ShieldCheck, 
    Database, 
    Zap, 
    Clock, 
    CheckCircle2,
    Lock,
    RefreshCw,
    Server,
    Signal,
    ChevronRight,
    Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { useStatusContentStore } from "@/lib/store/status-content";

const iconMap: any = {
    Globe,
    Cpu,
    Zap,
    Server,
    ShieldCheck,
    Database,
    Activity,
    Signal,
    Monitor
};

export default function StatusPage() {
    const { pageContent, isLoading } = usePageContent('status');
    const setContent = useStatusContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    const { content } = useStatusContentStore();

    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Pinging Cloud Proxies...
                </div>
            </div>
        );
    }

    if (!content) return null;

    const { header, systems, incidents, monitoring } = content;

    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            {/* Background Texture & Neural Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-green-500/10 rounded-full blur-[140px] opacity-20" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute inset-0 bg-grain opacity-[0.02]" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-20">
                {/* Header Section */}
                <div className="text-center space-y-8 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-green-500/30 bg-green-500/5 text-green-400 font-black italic tracking-[0.3em] text-[10px] uppercase shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                            {header.badge}
                        </Badge>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black italic tracking-tighter text-white"
                    >
                        {header.title.split(" ").map((word, i) => (
                            <span key={i} className={cn(word.toLowerCase() === "status." ? "text-green-500 NOT-italic" : "")}>
                                {word}{" "}
                            </span>
                        ))}
                    </motion.h1>
                    
                    <Card className="max-w-xl mx-auto border-green-500/20 bg-green-500/5 backdrop-blur-2xl rounded-[32px] p-6">
                        <div className="flex items-center justify-center gap-6 text-green-500">
                             <div className="relative">
                                <Activity className="w-12 h-12" />
                                <div className="absolute inset-0 animate-ping bg-green-500/20 rounded-full scale-150" />
                             </div>
                             <div className="text-left">
                                <h3 className="text-2xl font-black italic text-white tracking-tight">{header.mainStatus.title}</h3>
                                <p className="text-xs font-black uppercase text-green-400/60 tracking-widest italic">{header.mainStatus.description}</p>
                             </div>
                        </div>
                    </Card>
                </div>

                {/* Status Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {systems.map((system, idx) => {
                        const Icon = iconMap[system.iconName] || Activity;
                        return (
                            <motion.div
                                key={system.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="h-full border-white/5 bg-white/[0.01] backdrop-blur-3xl rounded-[32px] overflow-hidden hover:border-white/10 transition-all duration-500 group">
                                    <CardContent className="p-8 space-y-8">
                                        <div className="flex items-start justify-between">
                                            <div className={cn("w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110", system.color)}>
                                                <Icon size={28} />
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <Badge variant="outline" className={cn("text-[8px] font-black uppercase border-none px-3", 
                                                    system.status === "Operational" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                                                )}>
                                                    {system.status}
                                                </Badge>
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">{system.uptime} Uptime</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-black italic text-white tracking-tight">{system.name}</h3>
                                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <Signal size={12} className="text-white/20" />
                                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Latency</span>
                                                </div>
                                                <span className="text-sm font-mono font-bold text-white/60">{system.latency}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Incident Log */}
                <Card className="border-white/5 bg-white/[0.01] rounded-[40px] overflow-hidden shadow-2xl">
                    <CardHeader className="p-10 md:p-14 border-b border-white/5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white">{incidents.title}</h3>
                            <Button variant="ghost" className="text-[10px] font-black uppercase text-primary italic">View Full Log <ChevronRight size={14} className="ml-2" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-10 md:p-14 space-y-12">
                        {incidents.logs.map((incident, i) => (
                            <div key={incident.id} className="flex gap-8 group">
                                <div className="hidden md:flex flex-col items-center pt-2">
                                    <div className={cn("w-3 h-3 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]", incident.color)} />
                                    <div className="w-px flex-1 bg-white/5 mt-4 group-last:hidden" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">{incident.date}</span>
                                        <Badge className="bg-white/5 text-white/60 text-[8px] font-black uppercase border-none">{incident.status}</Badge>
                                    </div>
                                    <h4 className="text-xl font-bold italic text-white tracking-tight">{incident.title}</h4>
                                    <p className="text-sm text-muted-foreground font-medium italic leading-relaxed">{incident.desc}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Monitoring Note */}
                <div className="text-center pt-12 space-y-4">
                    <p className="text-muted-foreground font-medium italic">{monitoring.note}</p>
                    <div className="flex items-center gap-4 justify-center">
                        <Badge variant="outline" className="border-white/10 bg-white/5 text-[10px] font-black italic px-4 py-1 flex gap-2 items-center">
                            <RefreshCw size={12} className="animate-spin text-primary" />
                            {monitoring.nextSyncText}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
