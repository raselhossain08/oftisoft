
"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCreative } from "swiper/modules";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Layers, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

// --- Mock Data with 2026 Vibes ---
const projects = [
    {
        id: "fintech-core",
        title: "NeoBank Core",
        category: "Fintech Infrastructure",
        description: "A next-generation banking server with AI fraud detection and 50ms transaction finality. Built for high-frequency trading.",
        imageGradient: "from-blue-600 via-indigo-500 to-purple-600",
        tech: ["Rust", "gRPC", "Kafka", "React"],
        stats: [{ label: "TPS", value: "50k+" }, { label: "Uptime", value: "99.99%" }],
        year: "2026"
    },
    {
        id: "health-ai",
        title: "MediSynth AI",
        category: "Healthcare Intelligence",
        description: "Real-time patient diagnostics dashboard powered by edge-computed LLMs. compliant with HIPAA & GDPR.",
        imageGradient: "from-emerald-500 via-teal-500 to-cyan-500",
        tech: ["Python", "TensorFlow", "Next.js", "WebRTC"],
        stats: [{ label: "Accuracy", value: "99.2%" }, { label: "Hospitals", value: "45+" }],
        year: "2025"
    },
    {
        id: "meta-comm",
        title: "Orbit Commerce",
        category: "Immersive Retail",
        description: "3D product configurator and AR shopping experience for premium luxury brands. Reduces return rates by 40%.",
        imageGradient: "from-orange-500 via-amber-500 to-yellow-500",
        tech: ["Three.js", "WebGL", "Shopify Headless"],
        stats: [{ label: "Conv. Rate", value: "+35%" }, { label: "Sessions", value: "2M+" }],
        year: "2026"
    },
    {
        id: "saas-dash",
        title: "Vortex Analytics",
        category: "Enterprise SaaS",
        description: "Unified data pipeline visualization tool. Processes petabytes of log data into actionable business intelligence.",
        imageGradient: "from-pink-500 via-rose-500 to-red-500",
        tech: ["ClickHouse", "Go", "Vue 3"],
        stats: [{ label: "Data Vol", value: "5PB" }, { label: "Users", value: "12k" }],
        year: "2025"
    }
];

export default function FeaturedProjects() {
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef<any>(null);

    const prevSlide = () => swiperRef.current?.slidePrev();
    const nextSlide = () => swiperRef.current?.slideNext();

    return (
        <section className="py-32 bg-transparent relative overflow-hidden z-10">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4 pointer-events-none" />

            <div className="container px-4 mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="w-full  md:max-w-2xl">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <span className="h-px w-8 bg-primary"></span>
                            <span className="text-sm font-bold text-primary tracking-widest uppercase">Selected Work</span>
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                            Building the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                                Impossible.
                            </span>
                        </h2>
                    </div>

                    {/* Custom Controls */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={prevSlide}
                            className="group w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300"
                            aria-label="Previous project"
                        >
                            <ArrowLeft className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                        </button>
                        <button 
                            onClick={nextSlide}
                            className="group w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:border-white transition-all duration-300"
                            aria-label="Next project"
                        >
                            <ArrowRight className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                        </button>
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
                    slidesPerView={1.1} // Show a peek of the next slide on mobile
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
                    {projects.map((project, index) => (
                        <SwiperSlide key={project.id} className="group cursor-grab active:cursor-grabbing">
                            {/* Card Container */}
                            <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-3xl overflow-hidden mb-6 md:mb-8 border border-white/10 bg-card">
                                {/* Dynamic Gradient Image Placeholder */}
                                <div className={cn(
                                    "absolute inset-0 bg-gradient-to-br opacity-80 transition-transform duration-700 group-hover:scale-105",
                                    project.imageGradient
                                )} />
                                
                                {/* Noise Texture Overlay */}
                                <div className="absolute inset-0 opacity-20 bg-[url('https://grain-texture-url-here.png')]" style={{ filter: 'contrast(120%) brightness(120%)' }} />

                                {/* Content Overlay */}
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between bg-black/20 group-hover:bg-black/40 transition-colors duration-500">
                                    <div className="flex justify-between items-start">
                                        <div className="px-3 py-1 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono text-white/80">
                                            {project.year}
                                        </div>
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-black flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                                            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-0 md:mb-4 opacity-100 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 delay-100">
                                            {project.tech.map((t, i) => (
                                                <span key={i} className="text-[10px] md:text-xs font-medium text-white/90 bg-white/10 backdrop-blur-md px-2 py-1 rounded-md">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Info Below Card */}
                            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-white/10 pb-6 group-hover:border-white/30 transition-colors duration-500">
                                <div className="space-y-2 max-w-md">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                                        {project.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm md:text-base line-clamp-2">
                                        {project.description}
                                    </p>
                                </div>
                                
                                {/* Stats - Stacked on mobile, Row on Desktop */}
                                <div className="flex gap-6 md:gap-8 text-left md:text-right shrink-0">
                                    {project.stats.map((stat, i) => (
                                        <div key={i}>
                                            <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                                            <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                <div className="mt-12 flex justify-center md:justify-start">
                    <Link href="/portfolio" className="text-sm font-semibold text-white/60 hover:text-white flex items-center gap-2 group transition-colors">
                        View Complete Case Studies
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
