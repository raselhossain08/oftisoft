
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useHomeContentStore } from "@/lib/store/home-content";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function LatestBlog() {
    // Get content from CMS store
    const { content } = useHomeContentStore();
    const blogContent = content?.blog || {
        title: "Insights from the",
        subtitle: "Bleeding Edge.",
        badge: "Thought Leadership",
        posts: [
            {
                id: "1",
                slug: "ai-web-dev",
                title: "The Agentic Web: How AI is Rewriting the Frontend",
                excerpt: "Why traditional UI components are being replaced by generative interfaces.",
                category: "Deep Tech",
                date: "Oct 15, 2026",
                readTime: "5 min",
                gradient: "from-blue-600 via-indigo-600 to-violet-600"
            }
        ]
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"]});
    const y = useTransform(scrollYProgress, [0, 1], [100, -50]);

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-transparent relative overflow-hidden z-10" id="blog">
            {/* Texture */}
            <div className="absolute inset-0 bg-grain opacity-[0.03] pointer-events-none mix-blend-overlay" />

            <div className="container px-4 mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6 md:gap-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-full md:w-auto"
                    >
                        <Badge variant="outline" className="mb-4 border-primary/20 text-primary uppercase tracking-widest px-3 py-1">
                            {blogContent.badge}
                        </Badge>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                            {blogContent.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {blogContent.subtitle}
                            </span>
                        </h3>
                    </motion.div>

                    <Link href="/blog" className="hidden md:block">
                        <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 group">
                            View Editorial Archive
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {blogContent.posts.map((post: any, index: number) => (
                        <BlogCard key={post.id || post.slug} post={post} index={index} />
                    ))}
                </div>

                {/* Mobile Link */}
                <div className="mt-8 md:hidden flex justify-center">
                    <Link href="/blog">
                        <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 group">
                             View Editorial Archive
                             <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function BlogCard({ post, index }: { post: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="h-full"
        >
            <Link href="/blog" className="h-full block">
                <Card className="group relative flex flex-col h-full bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 overflow-hidden backdrop-blur-sm">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                         {/* Gradient Placeholder */}
                        <div className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-80 transition-transform duration-700 group-hover:scale-105",
                            post.gradient
                        )} />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                        
                        {/* Floating Badge */}
                        <div className="absolute top-4 left-4 z-10">
                            <Badge variant="secondary" className="bg-white/10 backdrop-blur-md border-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/20">
                                {post.category}
                            </Badge>
                        </div>

                        {/* Corner Icon */}
                        <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            <ArrowUpRight className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <CardContent className="flex flex-col flex-1 p-6">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 font-mono">
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

                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {post.excerpt}
                        </p>
                    </CardContent>

                    <CardFooter className="p-6 pt-0 mt-auto border-t border-white/5">
                        <div className="w-full pt-4 flex items-center text-sm font-medium text-white/40 group-hover:text-white transition-colors">
                            Read Story
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
}
