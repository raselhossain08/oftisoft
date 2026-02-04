"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Sparkles, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const featuredPosts = [
    {
        id: 1,
        initials: "RH",
        category: "AI & Innovation",
        title: "The Future of Web Development: How AI is Changing the Landscape",
        author: "Rasel Hossain",
        date: "Oct 24, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2665&auto=format&fit=crop",
        accent: "from-blue-600 to-violet-600"
    },
    {
        id: 2,
        initials: "SJ",
        category: "Design Systems",
        title: "Creating Fluid User Interfaces with Modern CSS Tech",
        author: "Sarah Jenkins",
        date: "Oct 20, 2026",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070",
        accent: "from-emerald-500 to-teal-500"
    },
    {
        id: 3,
        initials: "DC",
        category: "Cloud Architecture",
        title: "Serverless at Scale: Lessons from a High-Traffic Launch",
        author: "David Chen",
        date: "Oct 15, 2026",
        readTime: "10 min read",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072",
        accent: "from-orange-500 to-red-500"
    }
];

export default function FeaturedPost() {
    const [activeIndex, setActiveIndex] = useState(0);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 8000);
        return () => clearInterval(timer);
    }, [activeIndex]);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % featuredPosts.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
    };

    return (
        <section className="relative h-[85vh] w-full overflow-hidden flex items-end justify-center bg-black">
            {/* Dynamic Backgrounds */}
            <AnimatePresence mode="popLayout">
                {featuredPosts.map((post, index) => (
                    index === activeIndex && (
                        <motion.div
                            key={`bg-${post.id}`}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2 }}
                            style={{ y }}
                            className="absolute inset-0 z-0"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
                            <div className="absolute inset-0 bg-black/40 z-10" /> {/* Dimmer */}
                            <div 
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${post.image}')` }}
                            />
                        </motion.div>
                    )
                ))}
            </AnimatePresence>

            {/* Navigation Overlay - Desktop */}
            <div className="absolute top-1/2 left-4 right-4 z-40 hidden md:flex justify-between -translate-y-1/2 pointer-events-none px-8">
                <button 
                    onClick={handlePrev}
                    className="pointer-events-auto w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                    onClick={handleNext}
                    className="pointer-events-auto w-12 h-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            <div className="container px-4 mx-auto relative z-20 pb-20 md:pb-28">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={featuredPosts[activeIndex].id}
                        initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-5xl mx-auto"
                    >
                        {/* Meta Tags */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow-lg"
                            >
                                <Sparkles className="w-3 h-3 text-yellow-400" />
                                <span>Featured</span>
                            </motion.div>
                            
                            <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
                                className={cn(
                                    "px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-lg bg-gradient-to-r",
                                    featuredPosts[activeIndex].accent
                                )}
                            >
                                {featuredPosts[activeIndex].category}
                            </motion.div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight drop-shadow-2xl">
                            {featuredPosts[activeIndex].title}
                        </h1>

                        {/* Author & Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-8 text-white/90">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 backdrop-blur flex items-center justify-center font-bold text-white shadow-lg">
                                    {featuredPosts[activeIndex].initials}
                                </div>
                                <div>
                                    <p className="text-base font-bold text-white">{featuredPosts[activeIndex].author}</p>
                                    <p className="text-xs text-white/60 uppercase tracking-widest">Author</p>
                                </div>
                            </div>

                            <div className="hidden sm:block h-10 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent" />

                            <div className="flex items-center gap-6 text-sm font-medium">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <span>{featuredPosts[activeIndex].readTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    <span>{featuredPosts[activeIndex].date}</span>
                                </div>
                            </div>

                            <div className="sm:ml-auto">
                                <Link href={`/blog/${featuredPosts[activeIndex].id}`} className="group relative px-6 py-3 bg-white text-black rounded-full font-bold text-sm tracking-wide overflow-hidden transition-all hover:scale-105 active:scale-95 block w-fit">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                                    <span className="relative flex items-center gap-2">
                                        Read Article 
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicators */}
                <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-30">
                    {featuredPosts.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className="group relative h-1.5 rounded-full overflow-hidden bg-white/20 transition-all duration-300 hover:h-2"
                            style={{ width: activeIndex === i ? '3rem' : '1.5rem' }}
                        >
                            {activeIndex === i && (
                                <motion.div 
                                    className="absolute inset-0 bg-primary"
                                    layoutId="progress"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '0%' }}
                                    transition={{ duration: 8, ease: "linear" }}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
