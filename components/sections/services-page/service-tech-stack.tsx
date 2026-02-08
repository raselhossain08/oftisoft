"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Layout, Server, Database, Cloud, Brain, Smartphone, Code2, Globe, Cpu, Layers,
    Plus, Save, Trash2, LayoutTemplate, Grid, HelpCircle, Video, FileText, 
    ClipboardCheck, Rocket, HeartPulse, Zap, Code, ShieldCheck, Sparkles, Crown, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { useServicesContentStore } from "@/lib/store/services-content";

// Icon mapping
const iconMap: any = {
    Layout, Server, Database, Cloud, Brain, Smartphone, Code2, Globe, Cpu, Layers,
    Plus, Save, Trash2, LayoutTemplate, Grid, HelpCircle, Video, FileText, 
    ClipboardCheck, Rocket, HeartPulse, Zap, Code, ShieldCheck, Sparkles, Crown, ArrowRight
};

export default function ServiceTechStack() {
    const { content } = useServicesContentStore();
    const techCategories = content?.techStack || [];
    const [activeTab, setActiveTab] = useState(techCategories[0]?.id || "");

    // Update activeTab if it's empty but categories exist
    if (!activeTab && techCategories.length > 0) {
        setActiveTab(techCategories[0].id);
    }

    if (techCategories.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-12 md:mb-16">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-6"
                    >
                        <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors">
                            <Layers className="w-3.5 h-3.5" />
                            Our Toolkit
                        </Badge>
                    </motion.div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
                        Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Technology Stack</span>
                    </h2>
                    <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        We leverage the latest frameworks and tools to build future-proof, high-performance applications.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left: Sidebar Navigation (Scrollable on Mobile) */}
                    <div className="w-full lg:w-1/4">
                        <div className="flex lg:flex-col overflow-x-auto pb-4 lg:pb-0 gap-2 lg:gap-2 sticky lg:top-24 no-scrollbar snap-x">
                            {techCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={cn(
                                        "min-w-[200px] lg:min-w-0 snap-center flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border text-left group relative overflow-hidden",
                                        activeTab === cat.id 
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                                            : "bg-card hover:bg-muted border-border text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {/* Active Indicator Splash */}
                                    {activeTab === cat.id && (
                                        <motion.div
                                            layoutId="active-bg"
                                            className="absolute inset-0 bg-primary z-0"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    <div className="relative z-10 flex items-center gap-4 w-full">
                                        <div className={cn(
                                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0",
                                            activeTab === cat.id ? "bg-white/20" : "bg-muted group-hover:bg-background"
                                        )}>
                                            {(() => {
                                                const Icon = iconMap[cat.iconName] || Layout;
                                                return <Icon className="w-5 h-5" />;
                                            })()}
                                        </div>
                                        <div className="shrink-0 max-w-[150px] lg:max-w-none">
                                            <div className="font-bold truncate">{cat.label}</div>
                                            <div className={cn("text-xs opacity-80 truncate", activeTab === cat.id ? "text-primary-foreground" : "text-muted-foreground")}>
                                                {cat.description}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Content Grid */}
                    <div className="w-full lg:w-3/4 min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                            >
                                {techCategories.find(c => c.id === activeTab)?.techs.map((tech, index) => (
                                    <motion.div
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -5, scale: 1.05 }}
                                    >
                                        <Card className="aspect-[4/3] relative group overflow-hidden border-border/50 hover:border-primary/50 transition-colors duration-300">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 group-hover:opacity-100 transition-opacity" />
                                            
                                            {/* Glow Effect */}
                                            <div className="absolute inset-0 bg-primary/20 hover:bg-primary/30 blur-2xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                                            <CardContent className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-card/10 backdrop-blur-sm">
                                                 {/* Placeholder for Tech Icon - Generative based on name first letter if no image */}
                                                 <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-background to-muted shadow-inner flex items-center justify-center border border-white/10 group-hover:border-primary/20 transition-colors">
                                                     <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground group-hover:from-primary group-hover:to-purple-500">
                                                        {tech.charAt(0)}
                                                     </span>
                                                 </div>
                                                 
                                                 <span className="font-bold text-center text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate w-full">
                                                     {tech}
                                                 </span>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
