
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Smartphone, Brain, Infinity, ChartBar, Grid, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

// Mock Data
const categories = [
    { id: "all", label: "All Posts", icon: Grid },
    { id: "web", label: "Web Dev", icon: Code2 },
    { id: "mobile", label: "Mobile", icon: Smartphone },
    { id: "ai", label: "AI & ML", icon: Brain },
    { id: "devops", label: "DevOps", icon: Infinity },
    { id: "business", label: "Business", icon: ChartBar },
];

const posts = [
    {
        id: 1,
        title: "Mastering Next.js 15 Server Actions",
        excerpt: "Learn how to build type-safe mutations without API routes.",
        category: "web",
        image: "/blog-1.jpg",
        readTime: "8 min",
        date: "Dec 10, 2025"
    },
    {
        id: 2,
        title: "The Rise of Edge Computing",
        excerpt: "Why moving logic closer to the user is the future of performance.",
        category: "devops",
        image: "/blog-2.jpg",
        readTime: "12 min",
        date: "Nov 28, 2025"
    },
    {
        id: 3,
        title: "Building LLM Apps with LangChain",
        excerpt: "A practical guide to creating context-aware chatbots.",
        category: "ai",
        image: "/blog-3.jpg",
        readTime: "15 min",
        date: "Nov 15, 2025"
    },
    {
        id: 4,
        title: "Mobile UX Best Practices 2026",
        excerpt: "Designing for foldable screens and gesture navigation.",
        category: "mobile",
        image: "/blog-4.jpg",
        readTime: "6 min",
        date: "Oct 30, 2025"
    },
    {
        id: 5,
        title: "Scaling Your SaaS Revenue",
        excerpt: "Key metrics you should track to grow your subscription business.",
        category: "business",
        image: "/blog-5.jpg",
        readTime: "10 min",
        date: "Oct 12, 2025"
    },
    {
        id: 6,
        title: "Kubernetes for Startups",
        excerpt: "Is K8s overkill? When to adopt orchestration tools.",
        category: "devops",
        image: "/blog-6.jpg",
        readTime: "9 min",
        date: "Sep 25, 2025"
    },
];

export default function BlogList() {
    const [activeCategory, setActiveCategory] = useState("all");
    const filteredPosts = activeCategory === "all"
        ? posts
        : posts.filter(post => post.category === activeCategory);

    return (
        <section className="py-16 bg-background">
            <div className="container px-4 mx-auto">

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all border",
                                activeCategory === cat.id
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-105"
                                    : "bg-card border-border hover:border-primary/50 text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <cat.icon className={cn("w-4 h-4", activeCategory === cat.id && "animate-pulse")} />
                            <span className="font-medium text-sm">{cat.label}</span>
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredPosts.map((post) => (
                            <motion.article
                                layout
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -10 }}
                                className="group bg-card rounded-2xl overflow-hidden border border-border shadow-md hover:shadow-xl transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-56 bg-muted overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-800" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-background/80 backdrop-blur text-foreground text-xs font-bold rounded-lg border border-border">
                                            {post.category.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center text-xs text-muted-foreground mb-4 space-x-3">
                                        <span>{post.date}</span>
                                        <span className="w-1 h-1 rounded-full bg-border" />
                                        <span>{post.readTime} read</span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center text-primary text-sm font-bold">
                                        <span className="relative">
                                            Read Article
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                                        </span>
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </motion.div>

            </div>
        </section>
    );
}
