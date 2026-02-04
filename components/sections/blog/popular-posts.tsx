"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { TrendingUp, ArrowRight, Flame, Eye, Clock, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRef } from "react";

const popularPosts = [
    { 
        id: 1, 
        rank: "01",
        category: "AI Tools",
        title: "10 AI Tools Every Developer Needs in 2026", 
        views: "125k",
        readTime: "8 min",
        gradient: "from-purple-600 to-indigo-600"
    },
    { 
        id: 2, 
        rank: "02",
        category: "Frameworks",
        title: "Next.js 15 vs Remix: The Ultimate Comparison", 
        views: "98k",
        readTime: "12 min",
        gradient: "from-blue-600 to-cyan-600" 
    },
    { 
        id: 3, 
        rank: "03",
        category: "Serverless",
        title: "How We Scaled to 1 Million Users with Serverless", 
        views: "85k",
        readTime: "10 min",
        gradient: "from-emerald-600 to-teal-600" 
    },
    { 
        id: 4, 
        rank: "04",
        category: "Privacy",
        title: "The End of Third-Party Cookies: What Now?", 
        views: "72k",
        readTime: "6 min",
        gradient: "from-orange-600 to-red-600" 
    },
    { 
        id: 5, 
        rank: "05",
        category: "Career",
        title: "Surviving the Tech Layoffs: A Guide", 
        views: "65k",
        readTime: "7 min",
        gradient: "from-pink-600 to-rose-600" 
    },
];

export default function PopularPosts() {
    const swiperRef = useRef<any>(null);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
             {/* Decor Elements */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
                    <div>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <div className="p-2.5 bg-orange-500/10 rounded-xl">
                                <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                            </div>
                            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest">Trending Now</span>
                        </motion.div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
                        >
                            Most Popular Reads
                        </motion.h2>
                    </div>

                    {/* Custom Nav Controls */}
                    <div className="flex gap-2">
                        <button 
                            onClick={() => swiperRef.current?.swiper?.slidePrev()}
                            className="w-12 h-12 rounded-full border border-border bg-card/50 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => swiperRef.current?.swiper?.slideNext()}
                            className="w-12 h-12 rounded-full border border-border bg-card/50 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center backdrop-blur-sm"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <Swiper
                    ref={swiperRef}
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={24}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 3.5 },
                    }}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    className="!pb-12 !overflow-visible"
                    loop={true}
                >
                    {popularPosts.map((post, index) => (
                        <SwiperSlide key={post.id} className="h-full pt-10">
                            <Link href={`/blog/${post.id}`} className="block h-full">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="group relative h-[400px] rounded-[2rem] overflow-hidden cursor-pointer"
                                >
                                {/* Floating Rank Number */}
                                <div className="absolute -top-10 left-6 text-8xl font-black text-foreground/5 z-0 group-hover:text-primary/10 transition-colors duration-500 pointer-events-none select-none">
                                    {post.rank}
                                </div>

                                {/* Card Background */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-br opacity-80 transition-transform duration-700 group-hover:scale-110",
                                    post.gradient
                                )} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                                {/* Glass Overlay / Border */}
                                <div className="absolute inset-0 border-[1.5px] border-white/10 rounded-[2rem] z-20 group-hover:border-white/30 transition-colors" />

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start">
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/10">
                                            {post.category}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-4 text-white/70 text-xs font-medium mb-3">
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>{post.views}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{post.readTime}</span>
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-white/90 transition-colors">
                                            {post.title}
                                        </h3>

                                        <div className="flex items-center text-white/90 text-sm font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                                            <span>Read Article</span>
                                            <div className="w-6 h-6 ml-2 rounded-full bg-white/20 flex items-center justify-center">
                                                <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </motion.div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
