"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
    ArrowLeft, ArrowRight, CheckCircle2, Zap, Layout, Layers, Box, Globe, 
    Code, Cpu, Server, Smartphone, Shield, Database, Sparkles, Code2, 
    ClipboardCheck, Rocket, HeartPulse, ShieldCheck, Plus, Save, Trash2, 
    LayoutTemplate, Grid, HelpCircle, Crown, Cloud
} from "lucide-react";
import CTA from "@/components/sections/cta";
import { Button } from "@/components/ui/button";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

import { cn } from "@/lib/utils";
import { useServicesContentStore } from "@/lib/store/services-content";

// Icon mapping matching the CMS
const iconMap: any = {
    Plus, Save, Trash2, LayoutTemplate, Grid, HelpCircle, Server, Database, Cloud: Globe, 
    Brain: Cpu, Smartphone, Layout, Video: Code, FileText: Box, Code2, 
    ClipboardCheck, Rocket, HeartPulse, Globe, Zap, Code, ShieldCheck, 
    Sparkles, Layers, Crown, ArrowRight, Box, Cpu
};

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const { content } = useServicesContentStore();
    const service = content?.overview.find(s => s.id === params.slug);
    const globalProcess = content?.process || [];
    
    const [isMounted, setIsMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    // Parallax Effects
    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    // Handle 404
    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
                <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist or has been moved.</p>
                <Button asChild>
                    <Link href="/services">Back to Services</Link>
                </Button>
            </div>
        );
    }

    return (
        <main ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
            
            {/* Top Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
                <Link 
                    href="/services"
                    className="pointer-events-auto w-12 h-12 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center hover:bg-muted transition-all group shadow-lg"
                >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <Link 
                    href="/#contact" 
                    className="pointer-events-auto px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all flex items-center gap-2"
                >
                    Book Consultation
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                     <div className={cn("absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full blur-[120px] mix-blend-screen animate-pulse-slow opacity-20 bg-gradient-to-br", service.gradient)} />
                     <div className="absolute inset-0 opacity-[0.04] bg-grain mix-blend-overlay" />
                     {/* Grid pattern overlay */}
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
                </div>

                <div className="container px-4 mx-auto relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-5xl mx-auto text-center"
                        style={{ y: yHero, opacity: opacityHero }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold uppercase tracking-wider mb-8 shadow-glow">
                            <Sparkles className="w-4 h-4" />
                            <span>{service.label}</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                            {service.title.split(" ").map((word, i) => (
                                <span key={i} className="inline-block mr-4 bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/50">
                                    {word}
                                </span>
                            ))}
                        </h1>

                        {service.subtitle && (
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground/80 tracking-tight">
                                {service.subtitle}
                            </h2>
                        )}

                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto">
                            {service.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/portfolio" className="border-b border-muted-foreground/50 hover:text-primary hover:border-primary transition-colors pb-0.5 text-sm font-medium">
                                View Related Projects
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features BENTO GRID */}
            <section className="py-24 relative z-10">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {service.features.map((feature, i) => {
                            const FeatureIcon = iconMap[feature.iconName] || Zap;
                            return (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className={cn(
                                        "p-8 rounded-[2rem] bg-card/50 backdrop-blur-md border border-border/50 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 group",
                                        i % 3 === 0 ? "lg:col-span-2" : "lg:col-span-1"
                                    )}
                                >
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110 shadow-lg bg-muted")}>
                                        <FeatureIcon className={cn("w-7 h-7 text-primary")} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Methodology (Global Process) */}
            <section className="py-24 bg-card/20 border-y border-border/50 relative overflow-hidden">
                <div className="container px-4 mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Methodology</h2>
                        <p className="text-muted-foreground">From concept to deployment, we follow a rigorous process.</p>
                    </div>

                    {/* Mobile Swipe */}
                    <div className="lg:hidden">
                        <Swiper
                            modules={[Pagination, EffectCreative, Autoplay]}
                            effect={'creative'}
                            creativeEffect={{
                                prev: { shadow: true, translate: [0, 0, -400] },
                                next: { translate: ['100%', 0, 0] },
                            }}
                            pagination={{ clickable: true }}
                            autoplay={{ delay: 3000, disableOnInteraction: true }}
                            grabCursor={true}
                            spaceBetween={20}
                            slidesPerView={1.1}
                            centeredSlides={true}
                            className="!pb-12"
                        >
                            {globalProcess.map((step, i) => (
                                <SwiperSlide key={i}>
                                    <div className="bg-background border border-border rounded-3xl p-8 h-full min-h-[300px] flex flex-col items-center text-center shadow-lg">
                                        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-xl font-black text-primary-foreground mb-6 shadow-xl shadow-primary/20">
                                            {i + 1}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                                        <p className="text-muted-foreground">{step.desc}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Desktop Timeline */}
                    <div className="hidden lg:grid grid-cols-6 gap-8 px-4">
                        {globalProcess.map((step, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="relative flex flex-col items-center text-center group"
                            >
                                {/* Connector Line */}
                                {i !== globalProcess.length - 1 && (
                                    <div className="absolute top-8 left-[50%] w-full h-[2px] bg-border -z-10 bg-gradient-to-r from-border to-border overflow-hidden">
                                        <motion.div 
                                            initial={{ x: "-100%" }}
                                            whileInView={{ x: "0%" }}
                                            transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                                            className="h-full w-full bg-primary"
                                        />
                                    </div>
                                )}
                                
                                <div className="w-16 h-16 rounded-full bg-background border-4 border-border flex items-center justify-center text-xl font-black text-muted-foreground mb-8 group-hover:border-primary group-hover:text-primary group-hover:scale-110 transition-all duration-500 shadow-xl z-10 relative overflow-hidden">
                                    <span className="relative z-10">{i + 1}</span>
                                    <div className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-125 transition-transform duration-300 rounded-full" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack Horizontal Scroll */}
            {service.techs && service.techs.length > 0 && (
                <section className="py-24 relative overflow-hidden">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-muted-foreground text-xs font-bold uppercase tracking-wider mb-4">
                            <Cpu className="w-3 h-3" />
                            <span>Powered By</span>
                        </div>
                        <h2 className="text-3xl font-bold">Technology Stack</h2>
                    </div>
                    
                    <div className="relative w-full max-w-7xl mx-auto px-4">
                        <Swiper
                            modules={[Autoplay]}
                            spaceBetween={20}
                            slidesPerView={2}
                            breakpoints={{
                                640: { slidesPerView: 3 },
                                1024: { slidesPerView: 6 }
                            }}
                            loop={true}
                            autoplay={{
                                delay: 2000,
                                disableOnInteraction: false,
                            }}
                            className="py-10"
                        >
                            {service.techs.map((tech, i) => (
                                <SwiperSlide key={i}>
                                    <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all hover:-translate-y-1">
                                        <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
                                            <span className="text-xl font-bold text-primary">{tech.charAt(0)}</span>
                                        </div>
                                        <span className="font-bold text-sm text-muted-foreground truncate w-full text-center">{tech}</span>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>
            )}

            {/* Project CTA */}
            <div className="sticky bottom-6 z-40 flex justify-center lg:hidden pointer-events-none">
                 <Link href="/#contact" className="pointer-events-auto bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold flex items-center gap-2 shadow-2xl shadow-primary/30 animate-in fade-in slide-in-from-bottom-5">
                    Start Your Project
                    <ArrowRight className="w-4 h-4" />
                 </Link>
            </div>

            <CTA />
        </main>
    );
}


