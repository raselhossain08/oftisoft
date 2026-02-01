
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Smartphone, Brain, ShoppingCart, Building, Search, X, ExternalLink } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Types
type Project = {
    id: number;
    title: string;
    category: "Web" | "Mobile" | "AI" | "Ecommerce" | "Enterprise";
    image: string;
    tags: string[];
    description: string;
    client: string;
    stats: { label: string; value: string }[];
};

// Mock Data
const projects: Project[] = [
    {
        id: 1,
        title: "EcoSmart E-commerce",
        category: "Ecommerce",
        image: "/port-1.jpg",
        tags: ["Next.js", "Stripe", "Tailwind"],
        description: "A sustainable fashion marketplace with real-time inventory and AI recommendations.",
        client: "EcoLife Inc.",
        stats: [{ label: "ROI", value: "250%" }, { label: "Sales", value: "$2M+" }]
    },
    {
        id: 2,
        title: "FinTech Dashboard",
        category: "Enterprise",
        image: "/port-2.jpg",
        tags: ["React", "D3.js", "Node.js"],
        description: "High-performance analytics dashboard for processing millions of transactions.",
        client: "FinanceFlow",
        stats: [{ label: "Speed", value: "10x" }, { label: "Users", value: "50k" }]
    },
    {
        id: 3,
        title: "AI Chat Assistant",
        category: "AI",
        image: "/port-3.jpg",
        tags: ["Python", "OpenAI", "FastAPI"],
        description: "Customer service automation bot handling 80% of inquiries autonomously.",
        client: "TechHelp",
        stats: [{ label: "Automation", value: "80%" }, { label: "Cost Saving", value: "40%" }]
    },
    {
        id: 4,
        title: "Travel App",
        category: "Mobile",
        image: "/port-4.jpg",
        tags: ["React Native", "Firebase"],
        description: "Cross-platform mobile app for booking flights and hotels with offline mode.",
        client: "GoTravel",
        stats: [{ label: "Downloads", value: "100k+" }, { label: "Rating", value: "4.8" }]
    },
    {
        id: 5,
        title: "Healthcare Portal",
        category: "Enterprise",
        image: "/port-5.jpg",
        tags: ["Next.js", "PostgreSQL", "HIPAA"],
        description: "Secure patient management system for hospitals.",
        client: "MediCare",
        stats: [{ label: "Efficiency", value: "+45%" }, { label: "Security", value: "100%" }]
    },
    {
        id: 6,
        title: "Luxury Brand Site",
        category: "Web",
        image: "/port-6.jpg",
        tags: ["GSAP", "Three.js", "WebGL"],
        description: "Award-winning immersive website for a luxury watch brand.",
        client: "Chronos",
        stats: [{ label: "Traffic", value: "500k" }, { label: "Awards", value: "3" }]
    }
];

const categories = [
    { id: "All", label: "All Projects", icon: null },
    { id: "Web", label: "Web Development", icon: Globe },
    { id: "Mobile", label: "Mobile Apps", icon: Smartphone },
    { id: "AI", label: "AI Solutions", icon: Brain },
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
        <section className="py-24 bg-background min-h-screen">
            <div className="container px-4 mx-auto">

                {/* Header & Filter */}
                <div className="mb-16 space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Work</h1>
                        <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                            A collection of digital products that drive business growth.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="max-w-md mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-muted/50 border border-border focus:outline-none focus:border-primary transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-full transition-all border",
                                    filter === cat.id
                                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                                        : "bg-card border-border hover:border-primary/50 text-muted-foreground"
                                )}
                            >
                                {cat.icon && <cat.icon className="w-4 h-4" />}
                                <span className="font-medium">{cat.label}</span>
                                {filter === cat.id && (
                                    <span className="ml-1 bg-white/20 px-2 py-0.5 rounded text-xs">
                                        {filter === "All" ? projects.length : projects.filter(p => p.category === filter).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Project Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <motion.div
                                layout
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -10 }}
                                onClick={() => setSelectedProject(project)}
                                className="group cursor-pointer relative bg-card rounded-2xl overflow-hidden border border-border shadow-lg"
                            >
                                {/* Image Placeholder */}
                                <div className="relative aspect-[4/3] bg-slate-800 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                    {/* Tags Floating */}
                                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-4 group-hover:translate-y-0">
                                        {project.tags.slice(0, 2).map((tag) => (
                                            <span key={tag} className="px-2 py-1 bg-black/50 backdrop-blur-md text-white text-xs rounded border border-white/10">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Center Text Placeholder */}
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-bold text-3xl group-hover:scale-110 transition-transform duration-700">
                                        {project.category.toUpperCase()}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                                    <p className="text-gray-300 text-sm line-clamp-1">{project.description}</p>

                                    <div className="mt-4 flex items-center text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                        View Case Study <ExternalLink className="w-4 h-4 ml-2" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Modal */}
                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-y-auto"
                            onClick={() => setSelectedProject(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 50 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 50 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-background w-full max-w-4xl rounded-3xl overflow-hidden relative border border-border"
                            >
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full z-10 transition-colors"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>

                                {/* Modal Header Image */}
                                <div className="h-64 md:h-80 bg-slate-800 relative">
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl text-slate-700 font-bold">
                                        {selectedProject.title} COVER
                                    </div>
                                </div>

                                {/* Modal Content */}
                                <div className="p-8 md:p-12">
                                    <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12">
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-bold mb-4">{selectedProject.title}</h2>
                                            <p className="text-muted-foreground text-lg mb-6">{selectedProject.description}</p>

                                            <div className="flex flex-wrap gap-2 mb-8">
                                                {selectedProject.tags.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex gap-4">
                                                <button className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">
                                                    Live Demo
                                                </button>
                                                <button className="px-6 py-3 border border-border hover:bg-muted rounded-lg font-bold transition-colors">
                                                    GitHub
                                                </button>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-64 space-y-6">
                                            <div className="p-6 bg-card rounded-2xl border border-border">
                                                <h4 className="font-bold mb-4 text-muted-foreground uppercase text-xs tracking-wider">Project Stats</h4>
                                                <div className="space-y-4">
                                                    {selectedProject.stats.map((stat, i) => (
                                                        <div key={i}>
                                                            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="p-6 bg-card rounded-2xl border border-border">
                                                <h4 className="font-bold mb-2 text-muted-foreground uppercase text-xs tracking-wider">Client</h4>
                                                <div className="font-bold text-lg">{selectedProject.client}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
