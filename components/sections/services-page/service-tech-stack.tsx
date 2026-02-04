"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Server, Database, Cloud, Brain, Smartphone, Code2, Globe, Cpu, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

const techCategories = [
    {
        id: "frontend",
        label: "Frontend",
        icon: Layout,
        description: "Pixel-perfect interfaces",
        techs: ["React", "Next.js 14", "Vue.js", "Tailwind CSS", "Framer Motion", "Three.js", "TypeScript", "Redux"]
    },
    {
        id: "backend",
        label: "Backend",
        icon: Server,
        description: "Robust scalable logic",
        techs: ["Node.js", "NestJS", "Express", "Python", "Django", "GoLang", "GraphQL", "WebSockets"]
    },
    {
        id: "database",
        label: "Database",
        icon: Database,
        description: "High-performance storage",
        techs: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "Prisma", "MySQL", "Elasticsearch"]
    },
    {
        id: "cloud",
        label: "DevOps & Cloud",
        icon: Cloud,
        description: "CI/CD & Infrastructure",
        techs: ["AWS", "Vercel", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Cloudflare"]
    },
    {
        id: "ai",
        label: "AI & ML",
        icon: Brain,
        description: "Intelligent solutions",
        techs: ["OpenAI API", "PyTorch", "TensorFlow", "LangChain", "Hugging Face", "Pinecone", "LlamaIndex"]
    },
    {
        id: "mobile",
        label: "Mobile",
        icon: Smartphone,
        description: "Native experiences",
        techs: ["React Native", "Expo", "Flutter", "Swift", "Kotlin", "PWA"]
    }
];

export default function ServiceTechStack() {
    const [activeTab, setActiveTab] = useState(techCategories[0].id);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-16">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6"
                    >
                        <Layers className="w-4 h-4" />
                        <span>Our Toolkit</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Technology Stack</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We leverage the latest frameworks and tools to build future-proof, high-performance applications.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Sidebar Navigation */}
                    <div className="w-full lg:w-1/4">
                        <div className="space-y-2 sticky top-24">
                            {techCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 border text-left group relative overflow-hidden",
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
                                            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                                            activeTab === cat.id ? "bg-white/20" : "bg-muted group-hover:bg-background"
                                        )}>
                                            <cat.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold">{cat.label}</div>
                                            <div className={cn("text-xs opacity-80", activeTab === cat.id ? "text-primary-foreground" : "text-muted-foreground")}>
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
                                        className="aspect-[4/3] relative group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl border border-border/50 group-hover:border-primary/50 transition-colors duration-300" />
                                        
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-primary/20 hover:bg-primary/30 blur-2xl rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-card/10 backdrop-blur-sm rounded-2xl">
                                             {/* Placeholder for Tech Icon - Generative based on name first letter if no image */}
                                             <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-background to-muted shadow-inner flex items-center justify-center border border-white/10 group-hover:border-primary/20 transition-colors">
                                                 <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground group-hover:from-primary group-hover:to-purple-500">
                                                    {tech.charAt(0)}
                                                 </span>
                                             </div>
                                             
                                             <span className="font-bold text-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                 {tech}
                                             </span>
                                        </div>
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
