
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef } from "react";

// --- Mock Data ---
const posts = [
    {
        slug: "ai-web-dev",
        title: "The Agentic Web: How AI is Rewriting the Frontend",
        excerpt: "Why traditional UI components are being replaced by generative interfaces that adapt to user intent in real-time.",
        category: "Deep Tech",
        date: "Oct 15, 2026",
        readTime: "5 min",
        // Gradient placeholders for images
        gradient: "from-blue-600 via-indigo-600 to-violet-600"
    },
    {
        slug: "nextjs-optimization",
        title: "Server Components at Scale: Lessons from 10M Users",
        excerpt: "A deep dive into caching strategies, streaming hydration, and edge-rendering patterns for enterprise applications.",
        category: "Engineering",
        date: "Sep 28, 2026",
        readTime: "8 min",
        gradient: "from-emerald-600 via-green-600 to-teal-600"
    },
    {
        slug: "design-systems",
        title: "Micro-Interactions: The Secret Language of Trust",
        excerpt: "How subtle motion design psychological cues can increase user retention and perceived product value.",
        category: "Design",
        date: "Sep 10, 2026",
        readTime: "6 min",
        gradient: "from-orange-600 via-amber-600 to-yellow-600"
    },
    {
        slug: "future-fintech",
        title: "DeFi Interfaces: Bridging the Gap for Normies",
        excerpt: "Simplify complex blockchain transactions into intuitive, zero-friction user experiences.",
        category: "Fintech",
        date: "Aug 22, 2026",
        readTime: "7 min",
        gradient: "from-pink-600 via-rose-600 to-red-600"
    }
];

export default function LatestBlog() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"]});
    const y = useTransform(scrollYProgress, [0, 1], [100, -50]);

    return (
        <section ref={containerRef} className="py-32 bg-transparent relative overflow-hidden z-10">
            {/* Texture */}
            <div className="absolute inset-0 bg-[url('https://grain-texture-url-here.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <div className="container px-4 mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">
                            Thought Leadership
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                            Insights from the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Bleeding Edge.
                            </span>
                        </h3>
                    </motion.div>

                    <Link href="/blog" className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors">
                        View Editorial Archive
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {posts.map((post, index) => (
                        <BlogCard key={post.slug} post={post} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function BlogCard({ post, index }: { post: typeof posts[0], index: number }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative flex flex-col h-full bg-mutted/10 group cursor-pointer"
        >
            <Link href="/blog" className="flex flex-col h-full">
                {/* Image Container */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 border border-white/5">
                    {/* Gradient Placeholder */}
                    <div className={cn(
                        "absolute inset-0 bg-gradient-to-br opacity-80 transition-transform duration-700 group-hover:scale-105",
                        post.gradient
                    )} />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                    
                    {/* Floating Badge */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                            {post.category}
                        </span>
                    </div>

                    {/* Corner Icon */}
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3 font-mono">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> {post.date}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-sm font-medium text-white/40 group-hover:text-white transition-colors">
                        Read Story
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
