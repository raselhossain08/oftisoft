
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Clock, Calendar, ArrowUpRight, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useHomeContentStore } from "@/lib/store/home-content";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";

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

    const swiperRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"]});
    const y = useTransform(scrollYProgress, [0, 1], [100, -50]);

    const prevSlide = () => swiperRef.current?.slidePrev();
    const nextSlide = () => swiperRef.current?.slideNext();

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

                    <div className="flex items-center gap-4">
                        {/* Custom Controls */}
                        <div className="flex items-center gap-3 hidden md:flex">
                            <Button 
                                onClick={prevSlide}
                                variant="outline"
                                size="icon"
                                className="w-12 h-12 rounded-full border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <Button 
                                onClick={nextSlide}
                                variant="outline"
                                size="icon"
                                className="w-12 h-12 rounded-full border-white/10 bg-white/5 hover:bg-white hover:text-black transition-all duration-300"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                        
                        <Link href="/blog" className="hidden md:block">
                            <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 group">
                                View Archive
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Swiper Slider */}
                <div className="relative group/swiper">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, FreeMode]}
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        spaceBetween={24}
                        slidesPerView={1.2}
                        breakpoints={{
                            640: { slidesPerView: 2.2, spaceBetween: 24 },
                            1024: { slidesPerView: 3.2, spaceBetween: 32 },
                            1440: { slidesPerView: 4, spaceBetween: 32 }
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        speed={800}
                        className="!overflow-visible"
                        grabCursor={true}
                        autoHeight={false}
                    >
                        {blogContent.posts.map((post: any, index: number) => (
                            <SwiperSlide key={post.id || post.slug} className="h-auto">
                                <BlogCard post={post} index={index} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Mobile Link & Controls */}
                <div className="mt-12 md:hidden flex flex-col items-center gap-8">
                    <div className="flex items-center gap-4">
                        <Button 
                            onClick={prevSlide}
                            variant="outline"
                            size="icon"
                            className="w-12 h-12 rounded-full border-white/10 bg-white/5"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button 
                            onClick={nextSlide}
                            variant="outline"
                            size="icon"
                            className="w-12 h-12 rounded-full border-white/10 bg-white/5"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                    
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
            className="h-full flex flex-col"
        >
            <Link href="/blog" className="h-full block flex flex-col">
                <Card className="pt-0 group relative flex flex-col h-full bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 overflow-hidden backdrop-blur-sm rounded-[32px]">
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
                        <div className="absolute top-6 left-6 z-10">
                            <Badge variant="secondary" className="bg-black/30 backdrop-blur-md border-white/10 text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-black/50 py-1.5 px-4 rounded-full">
                                {post.category}
                            </Badge>
                        </div>

                        {/* Corner Icon */}
                        <div className="absolute bottom-6 right-6 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-2xl">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                    </div>

                    <CardContent className="flex flex-col flex-1 p-8">
                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-4 font-black uppercase tracking-widest">
                            <span className="flex items-center gap-1.5 font-bold italic">
                                <Calendar className="w-3.5 h-3.5 text-primary" /> {post.date}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <span className="flex items-center gap-1.5 font-bold italic">
                                <Clock className="w-3.5 h-3.5 text-primary" /> {post.readTime}
                            </span>
                        </div>

                        <h3 className="text-2xl font-black italic text-white mb-4 leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 uppercase tracking-tighter">
                            {post.title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium italic">
                            {post.excerpt}
                        </p>
                    </CardContent>

                    <CardFooter className="p-8 pt-0 mt-auto border-t border-white/5">
                        <div className="w-full pt-6 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.3em] text-white/30 group-hover:text-white transition-colors italic">
                            <span>Read Intelligence Story</span>
                            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
}

