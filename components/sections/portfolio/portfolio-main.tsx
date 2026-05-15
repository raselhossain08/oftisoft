"use client"
import { AnimatedDiv, AnimatedH1, AnimatedH2, AnimatedH3, AnimatedP, AnimatePresence } from "@/lib/animated";

import { useState, useMemo } from "react";
import { Globe, Smartphone, Brain, ShoppingCart, Building, Search, X, ExternalLink, ArrowRight, Github, Sparkles, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import { usePortfolioContentStore, defaultContent, type ProjectItem } from "@/lib/store/portfolio-content";
import { usePublicPortfolio, mapApiPortfolioToProjects } from "@/hooks/usePublicMarketing";

// Re-export type for component usage if needed, or just use ProjectItem
type Project = ProjectItem;

// Removed static projects array

const categories = [
    { id: "All", label: "All Works", icon: Layers },
    { id: "Web", label: "Web Platforms", icon: Globe },
    { id: "Mobile", label: "Mobile Apps", icon: Smartphone },
    { id: "AI", label: "AI & ML", icon: Brain },
    { id: "Ecommerce", label: "E-commerce", icon: ShoppingCart },
    { id: "Enterprise", label: "Enterprise", icon: Building },
];

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ... existing imports

export default function PortfolioMain() {
    const { content } = usePortfolioContentStore();
    const { data: apiPortfolio = [] } = usePublicPortfolio();
    const apiProjects = useMemo(() => mapApiPortfolioToProjects(apiPortfolio), [apiPortfolio]);
    const fallback = defaultContent;
    const projects = apiProjects.length > 0 ? apiProjects : (content?.projects || fallback.projects);
    const header = content?.header ?? fallback.header;

    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const filteredProjects = projects.filter(p =>
        (filter === "All" || p.category === filter) &&
        (p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
    );

    return (
        <section className="py-24 bg-background min-h-screen relative overflow-hidden">
             {/* ... ambient background ... */}

            <div className="container px-4 mx-auto relative z-10">

                {/* Header Section */}
                <div className="flex flex-col items-center justify-center text-center mb-16 space-y-6">
                    <AnimatedDiv initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
                            <Sparkles className="w-4 h-4" />
                            {header?.badge ?? ""}
                        </Badge>
                    </AnimatedDiv>
                    
                    <AnimatedH1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50"
                    >
                        {header?.title ?? ""}
                    </AnimatedH1>
                    
                    <AnimatedP 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl px-4"
                    >
                        {header?.description ?? ""}
                    </AnimatedP>
                </div>

                {/* Filter & Search Bar - Floating Glass Dock */}
                <AnimatedDiv 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="sticky top-4 z-40 mb-12"
                >
                    <div className="mx-auto bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-2xl p-2 flex flex-col md:flex-row gap-4 items-center justify-between">
                        
                        {/* Scrollable Categories */}
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0 mask-gradient-right px-2">
                            {categories.map((cat) => (
                                <Button key={cat.id}
                                    variant={filter === cat.id ? "default" : "ghost"}
                                    size="sm"
                                    onClick={() => setFilter(cat.id)}
                                    className={cn(
                                        "rounded-xl gap-2 font-medium transition-all whitespace-nowrap",
                                        filter === cat.id ? "shadow-md" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <cat.icon className="w-4 h-4" />
                                    <span>{cat.label}</span>
                                </Button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 h-10 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                            />
                        </div>
                    </div>
                </AnimatedDiv>

                {/* Project Grid */}
                <AnimatedDiv layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <AnimatedDiv layout key={project.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                className="group"
                                onClick={() => setSelectedProject(project)}
                            >
                                <div className="h-full bg-card hover:bg-card/80 border border-border/50 hover:border-primary/20 rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col relative group-hover:-translate-y-2">
                                    
                                    {/* Image Area */}
                                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                        {project.image ? (
                                            <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-4xl font-semibold text-foreground/5 tracking-tighter">{project.category}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Area */}
                                    <div className="p-6 md:p-8 flex flex-col flex-grow bg-card">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                                        </div>
                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow">{project.description}</p>
                                        
                                        <div className="pt-6 border-t border-border/50 flex items-center justify-between text-xs font-medium text-muted-foreground">
                                            <span>{project.client}</span>
                                            <div className="flex items-center gap-1 text-primary hover:underline">
                                                View Case Study <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedDiv>
                        ))}
                    </AnimatePresence>
                </AnimatedDiv>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">No projects found for your search.</p>
                        <Button 
                            variant="link"
                            onClick={() => { setFilter("All"); setSearch(""); }}
                            className="mt-4 text-primary"
                        >
                            Reset Filters
                        </Button>
                    </div>
                )}


                {/* Project Details Modal */}
                <AnimatePresence>
                    {selectedProject && (
                        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 sm:p-6" style={{ margin: 0 }}> {/* Reset margin */}
                            <AnimatedDiv initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedProject(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            />
                            
                            <AnimatedDiv layoutId={`project-${selectedProject.id}`} 
                                className="relative w-full h-[85vh] md:max-h-[90vh] overflow-y-auto bg-background rounded-t-[2rem] md:rounded-[2rem] shadow-2xl border border-border/50 no-scrollbar"
                                initial={{ opacity: 0, scale: 0.95, y: 100 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 100 }}
                            >
                                {/* Modal Header (Image) */}
                                <div className="relative h-56 md:h-96 w-full overflow-hidden bg-muted">
                                    {selectedProject.image ? (
                                        <Image src={selectedProject.image} alt={selectedProject.title} fill className="object-cover" />
                                    ) : null}
                                    <Button size="icon"
                                        variant="ghost"
                                        onClick={() => setSelectedProject(null)}
                                        className="absolute top-4 right-4 md:top-6 md:right-6 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-white hover:text-white transition-all z-20"
                                     >
                                         <X className="w-5 h-5" />
                                     </Button>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 md:p-12 lg:p-16">
                                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
                                        
                                        {/* Main Content */}
                                        <div className="flex-1 space-y-6 md:space-y-8">
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/10 border-primary/20 text-primary tracking-wider">
                                                        {selectedProject.category}
                                                    </Badge>
                                                </div>
                                                <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">{selectedProject.title}</h2>
                                                <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
                                                    {selectedProject.longDescription}
                                                </p>
                                            </div>

                                            {/* Tech Stack */}
                                            <div>
                                                <h3 className="text-sm font-bold text-foreground tracking-widest mb-4">Technologies Used</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProject.tags.map(tag => (
                                                        <Badge key={tag} variant="secondary" className="px-4 py-2 rounded-lg text-sm font-medium">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                                <Button size="lg" className="flex-1 sm:flex-none gap-2 rounded-xl font-bold" asChild>
                                                    <a href={selectedProject.url || '#'} target="_blank" rel="noreferrer">
                                                        <ExternalLink className="w-4 h-4" />
                                                        View Live Site
                                                    </a>
                                                </Button>
                                                <Button size="lg" variant="outline" className="flex-1 sm:flex-none gap-2 rounded-xl font-bold bg-card" asChild>
                                                    <a href={selectedProject.github || '#'} target="_blank" rel="noreferrer">
                                                        <Github className="w-4 h-4" />
                                                        View Code
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Sidebar Stats */}
                                        <div className="w-full lg:w-80 space-y-6">
                                            <div className="bg-muted/30 border border-border rounded-3xl p-6 md:p-8 space-y-6 md:space-y-8">
                                                <div>
                                                    <h4 className="text-xs font-bold text-muted-foreground tracking-widest mb-4">Results & Impact</h4>
                                                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
                                                        {selectedProject.stats.map((stat, i) => (
                                                            <div key={i} className="space-y-1">
                                                                <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                                                                <div className="text-sm text-muted-foreground">{stat.label}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                
                                                <div className="w-full h-px bg-border/50" />
                                                
                                                <div>
                                                    <h4 className="text-xs font-bold text-muted-foreground tracking-widest mb-2">Client</h4>
                                                    <div className="text-lg font-bold">{selectedProject.client}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedDiv>
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
}
