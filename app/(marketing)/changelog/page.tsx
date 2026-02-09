"use client";
import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GitBranch, Zap, Sparkles, ShieldCheck, Box, Package } from "lucide-react";

import { useChangelogContentStore } from "@/lib/store/changelog-content";

// Icon Map
const iconMap: any = {
    Sparkles, ShieldCheck, Box, GitBranch, Zap, Package
};

export default function ChangelogPage() {
    const { pageContent, isLoading } = usePageContent('changelog');
    const setContent = useChangelogContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    const { content } = useChangelogContentStore();
    
    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-background flex items-center justify-center z-[100]">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Initializing History Log...
                </div>
            </div>
        );
    }

    const updates = (content?.updates || []).filter(u => u.isActive);
    const header = content?.header;
    return (
        <div className="relative min-h-screen pt-32 pb-24">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="container px-6 mx-auto max-w-4xl space-y-16">
                <div className="space-y-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/20 bg-primary/5 text-primary font-black italic tracking-widest text-[10px] uppercase">
                            {header?.badge || "Evolution Log"}
                        </Badge>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl font-black italic tracking-tighter"
                    >
                        {header?.titlePrefix || "Changelog"}<span className="text-primary NOT-italic">{header?.titleSuffix || "."}</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto"
                    >
                        {header?.description || "Tracking the architectural development and platform iterative cycles of the Ofitsoft ecosystem."}
                    </motion.p>
                </div>

                <div className="relative space-y-12 before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-px before:bg-gradient-to-b before:from-primary/50 before:via-border before:to-transparent">
                    {updates.map((update, idx) => {
                        const Icon = iconMap[update.iconName || 'Sparkles'] || Sparkles;
                        return (
                        <motion.div 
                            key={update.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative pl-12 group"
                        >
                            <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center z-10 shadow-lg group-hover:border-primary/50 transition-colors duration-500">
                                <GitBranch className="w-5 h-5 text-primary" />
                            </div>

                            <Card className="border-border/50 bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden hover:border-primary/20 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/5">
                                <CardHeader className="p-8 md:p-10 border-b border-border/50 bg-primary/[0.02]">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <Badge className={cn("text-[9px] font-black uppercase tracking-widest", 
                                                    update.category === "Major" ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {update.category}
                                                </Badge>
                                                <span className="text-[10px] font-black text-muted-foreground uppercase">{update.date}</span>
                                            </div>
                                            <CardTitle className="text-2xl md:text-3xl font-black italic">{update.title}</CardTitle>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black font-mono text-primary/40 group-hover:text-primary transition-colors duration-500">{update.version}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 md:p-10 space-y-8">
                                    <p className="text-lg text-muted-foreground font-medium leading-relaxed italic">
                                        {update.description}
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase text-primary italic tracking-widest flex items-center gap-2">
                                            <Icon size={14} /> Refinements & Features
                                        </h4>
                                        <ul className="grid md:grid-cols-1 gap-3">
                                            {update.changes.map((change, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm font-medium text-foreground/80 group/item">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 group-hover/item:scale-150 transition-transform" />
                                                    {change}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );})}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="pt-12 text-center"
                >
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic bg-muted/30 py-3 px-6 rounded-full w-fit mx-auto border border-border/50">
                        Operational nodes synced. End of Log.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
