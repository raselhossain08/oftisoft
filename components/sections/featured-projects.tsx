
"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCreative } from "swiper/modules";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Layers, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHomeContentStore } from "@/lib/store/home-content";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

export default function FeaturedProjects() {
    // Get content from CMS store
    const { content } = useHomeContentStore();
    const projectsContent = content?.projects || {
        title: "Building the",
        subtitle: "Impossible.",
        badge: "Selected Work",
        projects: [
            {
                id: "fintech-core",
                title: "NeoBank Core",
                category: "Fintech Infrastructure",
                description: "A next-generation banking server with AI fraud detection and 50ms transaction finality.",
                imageGradient: "from-blue-600 via-indigo-500 to-purple-600",
                tech: ["Rust", "gRPC", "Kafka", "React"],
                stats: [{ label: "TPS", value: "50k+" }, { label: "Uptime", value: "99.99%" }],
                year: "2026"
            }
        ]
    };

    const projects = projectsContent.projects || [];

    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<any>(null);

    const prevSlide = () => swiperRef.current?.slidePrev();
    const nextSlide = () => swiperRef.current?.slideNext();

    return (
        <section className="py-24 md:py-32 bg-transparent relative overflow-hidden z-10" id="projects">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />

            <div className="container px-4 mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-8">
                    <div className="w-full md:max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="mb-4"
                        >
                            <Badge variant="outline" className="border-primary/20 text-primary uppercase tracking-widest px-3 py-1">
                                {projectsContent.badge}
                            </Badge>
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 md:mb-6">
                            {projectsContent.title} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                                {projectsContent.subtitle}
                            </span>
                        </h2>
                    </div>

                    {/* Custom Controls */}
                    <div className="flex items-center gap-4 hidden md:flex">
                        <Button 
                            onClick={prevSlide}
                            variant="outline"
                            size="icon"
                            className="w-14 h-14 rounded-full border-white/10 bg-transparent hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                            aria-label="Previous project"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <Button 
                            onClick={nextSlide}
                            variant="outline"
                            size="icon"
                            className="w-14 h-14 rounded-full border-white/10 bg-transparent hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                            aria-label="Next project"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Slider */}
                <Swiper
                    modules={[Navigation, Autoplay, EffectCreative]}
                    onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                    spaceBetween={20}
                    slidesPerView={1.1}
                    breakpoints={{
                        640: { slidesPerView: 1.2, spaceBetween: 30 },
                        768: { slidesPerView: 1.5, spaceBetween: 40 },
                        1024: { slidesPerView: 2, spaceBetween: 50 },
                        1280: { slidesPerView: 2.2, spaceBetween: 60 }
                    }}
                    loop={true}
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    speed={800}
                    className="!overflow-visible"
                    centeredSlides={false} 
                >
                    {projects.map((project: any, index: number) => (
                        <SwiperSlide key={project.id} className="group cursor-grab active:cursor-grabbing">
                            {/* Card Image Container */}
                            <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden mb-6 md:mb-8 border border-white/10 bg-card">
                                {/* Dynamic Gradient Image Placeholder */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-br opacity-80 transition-transform duration-700 group-hover:scale-105",
                                    project.imageGradient
                                )} />
                                
                                {/* Noise Texture Overlay */}
                                <div className="absolute inset-0 opacity-20 bg-grain" style={{ filter: 'contrast(120%) brightness(120%)' }} />

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between bg-black/20 group-hover:bg-black/40 transition-colors duration-500">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="secondary" className="bg-black/30 backdrop-blur-md border-white/10 text-white/80 hover:bg-black/40">
                                            {project.year}
                                        </Badge>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center opacity-100 md:opacity-0 md:-translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                                            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                    </div>

                                        <div className="flex flex-wrap gap-2 mb-0 md:mb-4 opacity-100 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 delay-100">
                                            {(project.tech || []).map((t: string, i: number) => (
                                                <Badge key={i} variant="secondary" className="bg-white/10 backdrop-blur-md text-white/90 font-medium hover:bg-white/20">
                                                    {t}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                {project.stats?.length ? (
                                    /* Info Below Card */
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-white/10 pb-6 group-hover:border-white/30 transition-colors duration-500">
                                        <div className="space-y-2 max-w-md">
                                            <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                                                {project.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm md:text-base line-clamp-2">
                                                {project.description}
                                            </p>
                                        </div>
                                        
                                        {/* Stats - Row on all screens for better density */}
                                        <div className="flex gap-6 md:gap-8 text-left md:text-right shrink-0">
                                            {(project.stats || []).map((stat: any, i: number) => (
                                                <div key={i}>
                                                    <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                                                    <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                     /* Fallback if no stats (just info) */
                                     <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-white/10 pb-6 group-hover:border-white/30 transition-colors duration-500">
                                        <div className="space-y-2 max-w-md">
                                            <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                                                {project.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm md:text-base line-clamp-2">
                                                {project.description}
                                            </p>
                                        </div>
                                    </div>
                                )}
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                {/* Mobile Controls & Link */}
                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                     <div className="flex md:hidden items-center gap-4">
                        <Button 
                                onClick={prevSlide}
                                variant="outline"
                                size="icon"
                                className="w-12 h-12 rounded-full border-white/10 bg-transparent hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                            >
                                <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <Button 
                                onClick={nextSlide}
                                variant="outline"
                                size="icon"
                                className="w-12 h-12 rounded-full border-white/10 bg-transparent hover:bg-white hover:text-black hover:border-white transition-all duration-300"
                            >
                                <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex justify-center md:justify-start">
                        <Link href="/portfolio">
                            <Button variant="ghost" className="text-sm font-semibold text-white/60 hover:text-white group transition-colors">
                                View Complete Case Studies
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
