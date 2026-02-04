"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Smartphone, Brain, ShoppingCart, Building, Search, X, ExternalLink, ArrowRight, Github, Sparkles, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Types
type Project = {
    id: number;
    title: string;
    category: "Web" | "Mobile" | "AI" | "Ecommerce" | "Enterprise";
    image: string | null;
    tags: string[];
    description: string;
    longDescription: string;
    client: string;
    stats: { label: string; value: string }[];
    gradient: string;
};

// Mock Data
const projects: Project[] = [
    {
        id: 1,
        title: "EcoSmart E-commerce",
        category: "Ecommerce",
        image: null,
        tags: ["Next.js", "Stripe", "Tailwind", "Redis"],
        description: "A sustainable fashion marketplace with real-time inventory.",
        longDescription: "EcoSmart is a pioneering e-commerce platform dedicated to sustainable fashion. We engineered a real-time inventory system using Redis and developed a personalized recommendation engine that increased conversion rates by 40%.",
        client: "EcoLife Inc.",
        stats: [{ label: "ROI", value: "250%" }, { label: "Sales", value: "$2M+" }],
        gradient: "from-emerald-500/20 to-teal-500/20"
    },
    {
        id: 2,
        title: "FinTech Analytics Core",
        category: "Enterprise",
        image: null,
        tags: ["React", "D3.js", "Node.js", "GraphQL"],
        description: "High-performance dashboard processing millions of transactions.",
        longDescription: "Built for high-frequency trading firms, this dashboard visualizes millions of data points in real-time without rendering lag. Utilizes WebWorkers and canvas-based rendering for maximum performance.",
        client: "FinanceFlow",
        stats: [{ label: "Latency", value: "<50ms" }, { label: "Users", value: "50k" }],
        gradient: "from-blue-600/20 to-indigo-600/20"
    },
    {
        id: 3,
        title: "Nexus AI Assistant",
        category: "AI",
        image: null,
        tags: ["Python", "LangChain", "FastAPI", "Pinecone"],
        description: "Customer service automation handling 80% of inquiries.",
        longDescription: "A context-aware AI agent that integrates with existing helpdesk categories. It uses RAG (Retrieval Augmented Generation) to provide accurate answers based on company knowledge bases.",
        client: "TechHelp",
        stats: [{ label: "Automation", value: "80%" }, { label: "Cost Saving", value: "40%" }],
        gradient: "from-purple-600/20 to-pink-600/20"
    },
    {
        id: 4,
        title: "Nomad Travel App",
        category: "Mobile",
        image: null,
        tags: ["React Native", "Firebase", "Google Maps"],
        description: "Cross-platform mobile app for offline travel planning.",
        longDescription: "Designed for digital nomads, this app features robust offline-first architecture. Syncs data automatically when connection is restored, ensuring seamless travel planning in remote areas.",
        client: "GoTravel",
        stats: [{ label: "Downloads", value: "100k+" }, { label: "Rating", value: "4.8" }],
        gradient: "from-orange-500/20 to-yellow-500/20"
    },
    {
        id: 5,
        title: "MediCare Portal",
        category: "Enterprise",
        image: null,
        tags: ["Next.js", "PostgreSQL", "HIPAA", "Docker"],
        description: "Secure patient management system for hospital networks.",
        longDescription: "A HIPAA-compliant platform connecting patients with doctors. Features end-to-end encryption for all medical records and a highly accessible UI for elderly patients.",
        client: "MediCare",
        stats: [{ label: "Efficiency", value: "+45%" }, { label: "Security", value: "100%" }],
        gradient: "from-cyan-500/20 to-blue-500/20"
    },
    {
        id: 6,
        title: "Chronos Luxury",
        category: "Web",
        image: null,
        tags: ["GSAP", "Three.js", "WebGL", "Blender"],
        description: "Award-winning immersive 3D website for luxury watches.",
        longDescription: "To capturing the craftsmanship of luxury timepieces, we built a fully 3D interactive product showcase using Three.js and WebGL. The result is a showroom experience in the browser.",
        client: "Chronos",
        stats: [{ label: "Traffic", value: "500k" }, { label: "Awards", value: "3" }],
        gradient: "from-amber-600/20 to-red-600/20"
    }
];

const categories = [
    { id: "All", label: "All Works", icon: Layers },
    { id: "Web", label: "Web Platforms", icon: Globe },
    { id: "Mobile", label: "Mobile Apps", icon: Smartphone },
    { id: "AI", label: "AI & ML", icon: Brain },
    { id: "Ecommerce", label: "E-commerce", icon: ShoppingCart },
    { id: "Enterprise", label: "Enterprise", icon: Building },
];

export default function PortfolioMain() {
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const filteredProjects = projects.filter(p =>
        (filter === "All" || p.category === filter) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    );

    return (
        <section className="py-24 bg-background min-h-screen relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container px-4 mx-auto relative z-10">

                {/* Header Section */}
                <div className="flex flex-col items-center justify-center text-center mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>World Class Engineering</span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50"
                    >
                        Success Stories
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-2xl"
                    >
                        We build digital products that scale. Explore our portfolio of award-winning applications and systems.
                    </motion.p>
                </div>

                {/* Filter & Search Bar - Floating Glass Dock */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="sticky top-4 z-40 mb-12"
                >
                    <div className="mx-auto max-w-5xl bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-2 flex flex-col md:flex-row gap-4 items-center justify-between">
                        
                        {/* Scrollable Categories */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0 mask-gradient-right px-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setFilter(cat.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                                        filter === cat.id
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <cat.icon className="w-4 h-4" />
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 outline-none text-sm transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Project Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                layout
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                className="group"
                                onClick={() => setSelectedProject(project)}
                            >
                                <div className="h-full bg-card hover:bg-card/80 border border-border/50 hover:border-primary/20 rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col relative group-hover:-translate-y-2">
                                    
                                    {/* Image Area */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 transition-transform duration-700 group-hover:scale-110", project.gradient)} />
                                        
                                        {/* Abstract patterns or Placeholder Image */}
                                        <div className="absolute inset-0 opacity-[0.1] bg-[url('https://grain-texture-url-here.png')] mix-blend-overlay" />
                                        
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-4xl font-black text-foreground/5 group-hover:text-foreground/10 transition-colors uppercase tracking-tighter">
                                                {project.category}
                                            </span>
                                        </div>

                                        {/* Overlay Content */}
                                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                            <div className="flex flex-wrap gap-2 mb-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                                {project.tags.slice(0, 3).map((tag) => (
                                                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white/90 text-[10px] font-bold border border-white/10">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                                            <ArrowRight className="w-5 h-5 -rotate-45" />
                                        </div>
                                    </div>

                                    {/* Info Area */}
                                    <div className="p-6 md:p-8 flex flex-col flex-grow bg-card">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                                        </div>
                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow">{project.description}</p>
                                        
                                        <div className="pt-6 border-t border-border/50 flex items-center justify-between text-xs font-medium text-muted-foreground">
                                            <span>{project.client}</span>
                                            <Link href={`/portfolio/${project.id}`} className="flex items-center gap-1 text-primary hover:underline">
                                                View Case Study <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No projects found for your search.</p>
                        <button 
                            onClick={() => { setFilter("All"); setSearch(""); }}
                            className="mt-4 text-primary hover:underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}


                {/* Project Details Modal */}
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ margin: 0 }}> {/* Reset margin */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedProject(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            />
                            
                            <motion.div
                                layoutId={`project-${selectedProject.id}`} 
                                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-background rounded-[2rem] shadow-2xl border border-border/50 no-scrollbar"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            >
                                {/* Modal Header (Image) */}
                                <div className="relative h-64 md:h-96 w-full overflow-hidden">
                                     <div className={cn("absolute inset-0 bg-gradient-to-br", selectedProject.gradient)} />
                                     <div className="absolute inset-0 flex items-center justify-center">
                                         <h2 className="text-5xl md:text-7xl font-black text-white/10 uppercase tracking-tighter">
                                             {selectedProject.category}
                                         </h2>
                                     </div>
                                     <button 
                                        onClick={() => setSelectedProject(null)}
                                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all z-20"
                                     >
                                         <X className="w-5 h-5" />
                                     </button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-8 md:p-12 lg:p-16">
                                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                                        
                                        {/* Main Content */}
                                        <div className="flex-1 space-y-8">
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20 uppercase tracking-wider">
                                                        {selectedProject.category}
                                                    </span>
                                                </div>
                                                <h2 className="text-4xl md:text-5xl font-bold mb-6">{selectedProject.title}</h2>
                                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                                    {selectedProject.longDescription}
                                                </p>
                                            </div>

                                            {/* Tech Stack */}
                                            <div>
                                                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-4">Technologies Used</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProject.tags.map(tag => (
                                                        <span key={tag} className="px-4 py-2 rounded-lg bg-muted border border-border text-sm font-medium text-foreground hover:border-primary/50 transition-colors">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-4 pt-4">
                                                <button className="flex-1 sm:flex-none h-12 px-8 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                                    <ExternalLink className="w-4 h-4" />
                                                    View Live Site
                                                </button>
                                                <button className="flex-1 sm:flex-none h-12 px-8 bg-card border border-border text-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-muted transition-all">
                                                    <Github className="w-4 h-4" />
                                                    View Code
                                                </button>
                                            </div>
                                        </div>

                                        {/* Sidebar Stats */}
                                        <div className="w-full lg:w-80 space-y-6">
                                            <div className="bg-muted/30 border border-border rounded-3xl p-8 space-y-8">
                                                <div>
                                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Results & Impact</h4>
                                                    <div className="space-y-6">
                                                        {selectedProject.stats.map((stat, i) => (
                                                            <div key={i} className="space-y-1">
                                                                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                                                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                <div className="w-full h-px bg-border/50" />
                                                
                                                <div>
                                                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Client</h4>
                                                    <div className="text-lg font-bold">{selectedProject.client}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
