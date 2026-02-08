"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Calendar, Layers, Cpu, Globe, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import CTA from "@/components/sections/cta";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

import { cn } from "@/lib/utils";
import { usePortfolioContentStore } from "@/lib/store/portfolio-content";
import { notFound, useRouter } from "next/navigation";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
    const { content } = usePortfolioContentStore();
    const router = useRouter();
    
    // Find project by ID (slug)
    const project = content?.projects.find(p => p.id === params.slug);

    // Fallback if not found (should be handled by middleware or static generation usually, but here client-side)
    useEffect(() => {
        if (!project && content?.projects.length) {
            router.push('/portfolio');
        }
    }, [project, router, content]);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const yHero = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    
    // Lightbox State
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    if (!isMounted || !project) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse bg-primary/20 w-12 h-12 rounded-full" /></div>;

    // Use fallback images if none provided
    const galleryImages = [
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1472851294608-415522f96319?q=80&w=2070&auto=format&fit=crop"
    ];

    return (
        <main ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
            
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <Link 
                    href="/portfolio"
                    className="pointer-events-auto w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center hover:bg-muted transition-all group shadow-lg"
                >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <div className="pointer-events-auto flex gap-4">
                     <a href="#" className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all">
                        <ExternalLink className="w-4 h-4" />
                        <span>Visit Live Site</span>
                     </a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden flex items-end pb-20">
                {/* Parallax Background */}
                <motion.div 
                    style={{ y: yHero }}
                    className="absolute inset-0 z-0"
                >
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-30", project.gradient)} />
                    {/* Placeholder image logic since we don't have real uploaded images yet */}
                    <Image 
                        src={galleryImages[0]} 
                        alt={project.title} 
                        fill 
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                    <div className="absolute inset-0 bg-black/20" />
                </motion.div>

                <div className="container px-4 mx-auto relative z-10">
                    <motion.div 
                        style={{ opacity: opacityHero }}
                        className="max-w-5xl"
                    >
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-bold uppercase tracking-wider mb-6 shadow-xl">
                                <Layers className="w-4 h-4" />
                                <span>{project.category}</span>
                            </div>
                            
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-6 tracking-tighter leading-[0.9]">
                                {project.title}
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-white/80 max-w-2xl font-light mb-10 leading-relaxed">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-8 text-white/90 font-medium text-lg border-t border-white/20 pt-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-widest text-white/60">Client</span>
                                        <span>{project.client}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase tracking-widest text-white/60">Project ID</span>
                                        <span className="text-xs">{project.id.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 bg-background relative z-10">
                <div className="container px-4 mx-auto">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                        
                        {/* Left Column: Narrative */}
                        <div className="lg:col-span-8 space-y-20">
                            
                            {/* Intro Text */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="text-3xl font-bold mb-6">About the Project</h3>
                                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                                    <p className="text-xl md:text-2xl font-light text-foreground mb-8">
                                        {project.longDescription}
                                    </p>
                                    <p>{project.description}</p>
                                </div>
                            </motion.div>

                            {/* Gallery Carousel (Swiper) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="w-full h-[500px] rounded-[2rem] overflow-hidden border border-border shadow-2xl relative group cursor-zoom-in"
                            >
                                 <Swiper
                                    modules={[Navigation, Pagination, Autoplay, EffectFade]}
                                    effect="fade"
                                    loop={true}
                                    autoplay={{ delay: 4000 }}
                                    pagination={{ clickable: true }}
                                    navigation={true}
                                    className="h-full w-full"
                                 >
                                    {galleryImages.map((img, i) => (
                                        <SwiperSlide key={i} onClick={() => setLightboxIndex(i)}>
                                            <div className="relative w-full h-full">
                                                <Image 
                                                    src={img} 
                                                    alt={`Gallery image ${i + 1}`} 
                                                    fill 
                                                    className="object-cover" 
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                 </Swiper>
                                 <div className="absolute bottom-6 right-6 z-10 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold pointer-events-none">
                                     Click to Expand
                                 </div>
                            </motion.div>

                            {/* Challenge & Solution Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                {[
                                    { title: "The Summary", content: project.description, color: "bg-blue-500" },
                                    { title: "Detailed Analysis", content: project.longDescription, color: "bg-purple-500" }
                                ].map((item, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2 }}
                                        className="bg-card p-8 rounded-3xl border border-border hover:border-primary/20 transition-all hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className={cn("w-3 h-3 rounded-full animate-pulse", item.color)} />
                                            <h4 className="text-xl font-bold">{item.title}</h4>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {item.content}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                        </div>

                        {/* Right Column: Sticky Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-32 space-y-12">
                                
                                {/* Key Metrics */}
                                <div className="bg-card/50 backdrop-blur-xl border border-border p-8 rounded-3xl shadow-xl">
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-8">Impact & Results</h4>
                                    <div className="grid grid-cols-1 gap-6">
                                        {project.stats.map((result, i) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ opacity: 0, x: 20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-center justify-between group"
                                            >
                                                <span className="text-sm font-medium text-muted-foreground">{result.label}</span>
                                                <span className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{result.value}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tech Stack Tags */}
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                                        <Cpu className="w-4 h-4" />
                                        Technology Stack
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tech, i) => (
                                            <motion.span 
                                                key={tech}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.05 }}
                                                className="px-4 py-2 bg-background border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-default hover:scale-105"
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                {/* Source Code CTA */}
                                <a href="#" className="flex items-center justify-center gap-3 w-full py-5 rounded-2xl border border-border bg-card hover:bg-muted font-bold transition-all group">
                                    <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>View Source Code</span>
                                </a>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Next Project Navigation */}
            <section className="py-20 border-t border-border">
                <div className="container px-4 mx-auto">
                    <div className="flex justify-between items-center group cursor-pointer">
                        <div className="text-left">
                            <span className="text-sm text-muted-foreground uppercase tracking-widest mb-2 block">Next Project</span>
                            <h2 className="text-3xl md:text-5xl font-black group-hover:text-primary transition-colors">FinTech Analytics Core</h2>
                        </div>
                        <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                        onClick={() => setLightboxIndex(null)}
                    >
                        <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                            <X className="w-10 h-10" />
                        </button>
                        
                        <div className="relative w-full max-w-7xl h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                <Swiper
                                initialSlide={lightboxIndex}
                                modules={[Navigation]}
                                navigation={true}
                                className="w-full h-full"
                            >
                                {galleryImages.map((img, i) => (
                                    <SwiperSlide key={i} className="flex items-center justify-center">
                                        <div className="relative w-full h-full max-h-[85vh]">
                                            <Image 
                                                src={img} 
                                                alt={`Full screen image ${i}`} 
                                                fill 
                                                className="object-contain" 
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <CTA />
        </main>
    );
}
