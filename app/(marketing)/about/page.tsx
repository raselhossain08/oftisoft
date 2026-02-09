"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Globe, 
    Zap, 
    Users,
    ArrowUpRight,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

// Import Integrated Sections
import FounderIntro from "@/components/sections/about/founder-intro";
import MissionValues from "@/components/sections/about/mission-values";
import CompanyTimeline from "@/components/sections/about/company-timeline";
import OfficeCulture from "@/components/sections/about/office-culture";
import Awards from "@/components/sections/about/awards";
import TeamShowcase from "@/components/sections/about/team-showcase";

import { useAboutContentStore } from "@/lib/store/about-content";
import { usePageContent } from "@/hooks/usePageContent";

const iconMap: any = {
    Globe,
    Users,
    Zap,
    ShieldCheck: Globe // Added fallback
};

export default function AboutPage() {
    const { pageContent, isLoading } = usePageContent('about');
    const { content: storeContent } = useAboutContentStore();

    if (isLoading) {
        return (
            <div className="relative min-h-screen pt-32 pb-24 bg-[#020202] flex items-center justify-center">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Syncing About Metadata...
                </div>
            </div>
        );
    }

    const content = pageContent?.content || storeContent;
    const hero = content?.hero;
    const stats = content?.stats || [];
    const cta = content?.cta;

    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            {/* Neural Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[70vw] h-[70vw] bg-primary/10 rounded-full blur-[160px] opacity-30" />
                <div className="absolute inset-0 bg-neutral-900/5 opacity-50" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-32">
                {/* Hero section */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Badge variant="outline" className="px-6 py-2 rounded-full border-primary/30 bg-primary/5 text-primary font-black italic tracking-[0.3em] text-[10px] uppercase">
                                {hero?.badge || "Evolution & Architecture"}
                            </Badge>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-9xl font-black italic tracking-tighter text-white leading-[0.9]"
                        >
                            {hero?.title || "We build the"} <span className="text-primary NOT-italic underline decoration-white/10 decoration-8 underline-offset-8">{hero?.highlightedWord || "meta-layer"}</span>.
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.4 }} 
                            className="text-xl text-muted-foreground font-medium italic leading-relaxed max-w-xl"
                        >
                            {hero?.description || "Oftisoft is a hyper-scale design and development operative engineering high-fidelity artifacts for the next generation of digital builders."}
                        </motion.p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button className="h-16 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black italic text-lg shadow-2xl shadow-primary/30 group">
                                {hero?.ctaText || "Explore Our Ecosystem"} <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                            </Button>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full group-hover:bg-primary/30 transition-all duration-1000" />
                        <Card className="relative border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[60px] overflow-hidden p-1 shadow-2xl">
                             <div className="aspect-square bg-gradient-to-br from-primary/20 via-background to-background flex items-center justify-center relative overflow-hidden">
                                <Globe className="w-80 h-80 text-primary opacity-5 animate-spin-slow" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-64 h-64 border border-primary/20 rounded-full animate-ping opacity-20" />
                                </div>
                                <div className="absolute bottom-12 left-12 right-12 p-8 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-xl space-y-2">
                                    <h4 className="text-xl font-black italic text-white">{hero?.cardTitle || "Global Presence Node"}</h4>
                                    <p className="text-sm text-muted-foreground font-medium italic">{hero?.cardDescription || "Decentralized hubs operating across 48+ zones."}</p>
                                </div>
                             </div>
                        </Card>
                    </div>
                </div>

                {/* Stats Matrix */}
                <div className="grid md:grid-cols-3 gap-8">
                    {stats.map((stat: any, idx: number) => {
                        const Icon = iconMap[stat.icon] || Zap;
                        const valueNum = parseInt(stat.value);
                        const suffix = stat.value.replace(/[0-9]/g, '');

                        return (
                            <motion.div key={stat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                                <Card className="border-white/5 bg-white/[0.01] rounded-[40px] p-12 text-center space-y-4 hover:border-primary/30 transition-all group">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto group-hover:scale-110 transition-transform">
                                        <Icon size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-5xl font-black italic text-white tracking-tighter font-mono">
                                            {isNaN(valueNum) ? stat.value : (
                                                <>
                                                    <CountUp end={valueNum} duration={2.5} enableScrollSpy scrollSpyOnce />
                                                    {suffix}
                                                </>
                                            )}
                                        </span>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">{stat.label}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Integrated Sections */}
                <FounderIntro data={content?.founder} />
                <MissionValues data={content} />
                <CompanyTimeline data={content} />
                <OfficeCulture data={content?.culture} />
                <Awards data={content} />
                <TeamShowcase data={content?.team} />

                {/* Infrastructure Footer */}
                <div className="p-12 md:p-20 rounded-[60px] bg-primary/[0.03] border-2 border-primary/10 text-center space-y-8 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-1000" />
                     <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white relative z-10">
                        {cta?.title || "Join the architectural elite."}
                     </h3>
                     <p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto relative z-10">
                        {cta?.description || "We are always searching for high-fidelity builders and neural engineers to expand our global hubs."}
                     </p>
                     <Button variant="outline" className="h-16 px-12 rounded-2xl border-2 border-primary/30 bg-background text-primary font-black italic text-lg shadow-xl hover:bg-primary hover:text-white transition-all relative z-10">
                        {cta?.buttonText || "Initiate Recruitment Node"} <ArrowUpRight className="w-5 h-5 ml-3" />
                     </Button>
                </div>
            </div>
        </div>
    );
}