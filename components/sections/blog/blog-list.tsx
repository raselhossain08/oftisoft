"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid, Code, Smartphone, Brain, Cloud, Briefcase, Clock, Calendar, ArrowUpRight, Filter } from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock Data
const categories = [
    { id: "all", label: "All View", icon: Grid },
    { id: "web", label: "Engineering", icon: Code },
    { id: "mobile", label: "Mobile", icon: Smartphone },
    { id: "ai", label: "AI & Data", icon: Brain },
    { id: "devops", label: "DevOps", icon: Cloud },
    { id: "business", label: "Growth", icon: Briefcase },
];

const posts = [
    {
        id: 1,
        title: "Mastering Next.js 15 Server Actions",
        excerpt: "Learn how to build type-safe mutations without API routes in the modern React ecosystem.",
        category: "web",
        image: null,
        readTime: "8 min",
        date: "Dec 10, 2025"
    },
    {
        id: 2,
        title: "The Rise of Edge Computing",
        excerpt: "Why moving logic closer to the user is the future of performance and low latency.",
        category: "devops",
        image: null,
        readTime: "12 min",
        date: "Nov 28, 2025"
    },
    {
        id: 3,
        title: "Building LLM Apps with LangChain",
        excerpt: "A practical guide to creating context-aware chatbots using the latest AI models.",
        category: "ai",
        image: null,
        readTime: "15 min",
        date: "Nov 15, 2025"
    },
    {
        id: 4,
        title: "Mobile UX Best Practices 2026",
        excerpt: "Designing for foldable screens, gesture navigation, and adaptive interfaces.",
        category: "mobile",
        image: null,
        readTime: "6 min",
        date: "Oct 30, 2025"
    },
    {
        id: 5,
        title: "Scaling Your SaaS Revenue",
        excerpt: "Key metrics you should track to grow your subscription business sustainably.",
        category: "business",
        image: null,
        readTime: "10 min",
        date: "Oct 12, 2025"
    },
    {
        id: 6,
        title: "Kubernetes for Startups",
        excerpt: "Is K8s overkill? When to adopt orchestration tools in your growth journey.",
        category: "devops",
        image: null,
        readTime: "9 min",
        date: "Sep 25, 2025"
    },
    {
        id: 7,
        title: "The Future of React Server Components",
        excerpt: "Deep dive into RSC and how it changes the way we think about state management.",
        category: "web",
        image: null,
        readTime: "11 min",
        date: "Sep 15, 2025"
    },
    {
        id: 8,
        title: "Zero Trust Security Architecture",
        excerpt: "Implementing robust security models for remote-first organizations.",
        category: "devops",
        image: null,
        readTime: "14 min",
        date: "Sep 10, 2025"
    },
    {
        id: 9,
        title: "AI-Driven Design Systems",
        excerpt: "How generative AI is helping designers create more consistent design languages.",
        category: "ai",
        image: null,
        readTime: "7 min",
        date: "Aug 22, 2025"
    }
];

export default function BlogList() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Filter Logic
    const filteredPosts = posts.filter(post => {
        const matchesCategory = activeCategory === "all" || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section className="py-24 bg-background relative min-h-screen">
            {/* Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="container px-4 mx-auto relative z-10">
                
                {/* Header & Controls */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-16">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-4">
                            Latest Insights
                        </h2>
                        <p className="text-muted-foreground max-w-md">
                            Discover the latest trends, tutorials, and deep dives from our engineering team.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        {/* Search Bar */}
                        <div className={cn(
                            "relative group transition-all duration-300",
                            isSearchFocused ? "w-full lg:w-[320px]" : "w-full lg:w-[280px]"
                        )}>
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-xl blur-md transition-opacity",
                                isSearchFocused ? "opacity-100" : "opacity-0"
                            )} />
                            <div className="relative bg-card border border-border rounded-xl flex items-center px-4 h-12 shadow-sm focus-within:shadow-md focus-within:border-primary/50 transition-all">
                                <Search className="w-4 h-4 text-muted-foreground mr-3" />
                                <input 
                                    type="text" 
                                    placeholder="Search articles..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/70"
                                />
                            </div>
                        </div>

                        {/* Filter Button (Mobile only perhaps, or just extra action) */}
                         <button className="lg:hidden h-12 px-4 bg-card border border-border rounded-xl flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>
                </div>

                {/* Categories - Scrollable on mobile */}
                <div className="relative mb-12 overflow-hidden">
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar mask-gradient-right">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border",
                                    activeCategory === cat.id
                                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                                        : "bg-background/50 backdrop-blur-sm border-border hover:border-primary/50 text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <cat.icon className="w-4 h-4" />
                                <span>{cat.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Posts Grid */}
                <motion.div 
                    layout 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post, index) => (
                            <motion.article
                                layout
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                            >
                                <Link href={`/blog/${post.id}`} className="group relative flex flex-col h-full">
                                {/* Card Container */}
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -z-10 blur-xl" />
                                
                                <div className="h-full bg-card/50 backdrop-blur-md border border-border/50 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 flex flex-col">
                                    
                                    {/* Image Area */}
                                    <div className="relative h-52 overflow-hidden bg-muted">
                                        {/* Abstract Placeholder Gradient */}
                                        <div className={cn(
                                            "absolute inset-0 bg-gradient-to-br",
                                            post.category === 'web' ? 'from-blue-600/20 to-purple-600/20' :
                                            post.category === 'ai' ? 'from-emerald-600/20 to-cyan-600/20' :
                                            post.category === 'mobile' ? 'from-orange-600/20 to-red-600/20' :
                                            'from-slate-600/20 to-gray-600/20'
                                        )} />
                                        
                                        {/* Grid Pattern Overlay */}
                                        <div className="absolute inset-0 opacity-[0.1] bg-[url('https://grain-texture-url-here.png')] mix-blend-overlay" style={{backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px'}} />

                                        <div className="absolute top-4 left-4 z-10">
                                             <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-background/80 backdrop-blur-md border border-white/10 text-foreground shadow-sm">
                                                {categories.find(c => c.id === post.category)?.label || post.category.toUpperCase()}
                                             </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{post.date}</span>
                                            </div>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>

                                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                                            {post.excerpt}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-primary group-hover:underline decoration-primary/30 underline-offset-4">
                                                Read Article
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-all duration-300">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </Link>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="text-center py-20"
                    >
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold">No articles found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filter.</p>
                        <button 
                            onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                            className="mt-4 text-primary font-medium hover:underline"
                        >
                            Clear all filters
                        </button>
                    </motion.div>
                )}

                {/* Load More Trigger (Visual Only for now) */}
                {filteredPosts.length > 0 && (
                    <div className="mt-16 text-center">
                        <button className="px-8 py-3 rounded-full bg-card border border-border hover:bg-muted hover:border-primary/30 transition-all font-medium text-sm shadow-sm hover:shadow-md">
                            Load More Articles
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
}
