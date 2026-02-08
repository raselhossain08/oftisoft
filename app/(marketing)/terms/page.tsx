"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
    Shield, 
    Lock, 
    Eye, 
    FileText, 
    Clock, 
    Globe, 
    Scale,
    ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePageContent } from "@/hooks/usePageContent";
import { TermsPageContent } from "@/lib/store/terms-content";

const iconMap: any = {
    Globe,
    Scale,
    ShieldAlert,
    Clock,
    Lock,
    Eye,
    FileText,
    ShieldCheck: Shield,
};

export default function TermsPage() {
    const { pageContent, isLoading } = usePageContent('terms');

    if (isLoading) {
        return (
            <div className="relative min-h-screen pt-32 pb-24 bg-[#020202] flex items-center justify-center">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Syncing Governance Nodes...
                </div>
            </div>
        );
    }

    const content = (pageContent?.content as TermsPageContent) || null;

    if (!content) return null;

    const { header, navigationRail, sections, revision } = content;

    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            {/* Background Texture & Orbs */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] right-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full blur-[140px] opacity-40" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/5 rounded-full blur-[120px] opacity-30" />
                <div className="absolute inset-0 bg-grain opacity-[0.02]" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-24">
                {/* Header Section */}
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-primary/30 bg-primary/5 text-primary font-black italic tracking-[0.3em] text-[10px] uppercase">
                            {header.badge}
                        </Badge>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black italic tracking-tighter text-white"
                    >
                        {header.title.split(" ").map((word, i) => (
                            <span key={i} className={cn(word.toLowerCase() === "sync." ? "text-primary NOT-italic" : "")}>
                                {word}{" "}
                            </span>
                        ))}
                    </motion.h1>
                    <motion.p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">
                        {header.description}
                    </motion.p>
                </div>

                {/* Content Matrix */}
                <div className="grid lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
                    {/* Navigation Rail */}
                    <div className="lg:col-span-4 space-y-8 hidden lg:block">
                        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[40px] p-8 sticky top-32">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary italic mb-6">{navigationRail.title}</h3>
                            <ul className="space-y-6">
                                {navigationRail.items.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-4 group cursor-pointer hover:text-primary transition-all">
                                        <div className="w-1 h-1 rounded-full bg-border group-hover:bg-primary transition-all group-hover:scale-150" />
                                        <span className="text-sm font-bold italic text-muted-foreground group-hover:text-white transition-all">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>

                    {/* Main Legal Artifacts */}
                    <div className="lg:col-span-12 xl:col-span-8 space-y-16">
                        {sections.map((section, idx) => {
                            const Icon = iconMap[section.iconName] || FileText;
                            return (
                                <motion.div
                                    key={section.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <Card className="border-white/5 bg-white/[0.01] rounded-[40px] p-10 md:p-14 space-y-8 hover:bg-white/[0.02] transition-all duration-700">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                                <Icon size={32} />
                                            </div>
                                            <h3 className="text-3xl font-black italic text-white tracking-tight">{section.title}</h3>
                                        </div>
                                        <p className="text-xl text-muted-foreground font-medium italic leading-relaxed">
                                            {section.content}
                                        </p>
                                    </Card>
                                </motion.div>
                            );
                        })}

                        {/* Revision Node */}
                        <div className="pt-12 text-center lg:text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.4rem] text-muted-foreground italic">
                                {revision.prefix} {revision.updatedAt}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

