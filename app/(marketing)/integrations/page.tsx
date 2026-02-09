"use client";
import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Globe, 
    Share2, 
    Code2, 
    Zap, 
    ArrowRight,
    Github,
    Slack,
    Terminal,
    Bot,
    Smartphone,
    Database,
    Cloud,
    Server
} from "lucide-react";

import { useIntegrationsContentStore } from "@/lib/store/integrations-content";

// Icon Map
const iconMap: any = {
    Github, Slack, Bot, Smartphone, Globe, Share2, Code2, Zap, Terminal, Database, Cloud, Server
};

export default function IntegrationsPage() {
    const { pageContent, isLoading } = usePageContent('integrations');
    const setContent = useIntegrationsContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    const { content } = useIntegrationsContentStore();

    if (isLoading && !pageContent) {
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-blue-500 font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Initializing Interop Hub...
                </div>
            </div>
        );
    }

    const integrations = content?.integrations || [];
    const header = content?.header;
    const cta = content?.cta;
    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[100vw] h-[100vw] bg-blue-600/5 rounded-full blur-[160px] opacity-20" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-20">
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-blue-500/20 bg-blue-500/5 text-blue-400 font-black italic tracking-[0.3em] text-[10px] uppercase">
                            {header?.badge || "Global Interoperability Hub"}
                        </Badge>
                    </motion.div>
                    <motion.h1 className="text-5xl md:text-8xl font-black italic tracking-tighter text-white">
                        {header?.titlePrefix || "Integrations"} <span className="text-blue-500 NOT-italic">{header?.titleHighlight || "Matrix"}</span>.
                    </motion.h1>
                    <motion.p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto">
                        {header?.description || "Connect your Oftisoft environment with the world's most powerful developer tools and neural services."}
                    </motion.p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {integrations.map((item, idx) => {
                        const Icon = iconMap[item.iconName || 'Zap'] || Zap;
                        return (
                        <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                            <Card className="h-full border-white/5 bg-white/[0.01] backdrop-blur-3xl rounded-[32px] overflow-hidden hover:border-blue-500/30 transition-all duration-700 group">
                                <CardContent className="p-8 space-y-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500">
                                        <Icon size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black italic text-xl text-white">{item.name}</h3>
                                            <Badge variant="outline" className="text-[8px] bg-blue-500/10 text-blue-400 border-none">{item.status}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">{item.description}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );})}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[50px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
                        <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white">{cta?.title || "Custom API Access"}</h2>
                        <p className="text-lg text-muted-foreground font-medium italic">{cta?.description || "Building something unique? Access our full neural API suite and forge your own custom integrations."}</p>
                        <Button className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black italic shadow-xl shadow-blue-600/20">
                            {cta?.buttonText || "Request API Access Node"} <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
