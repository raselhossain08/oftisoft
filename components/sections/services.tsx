
"use client";

import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import {
    Layout,
    Smartphone,
    Server,
    MessageSquare,
    Code,
    Infinity,
    ArrowRight,
    Brain,
    Globe,
    Zap,
    Cpu,
    Database,
    Cloud,
    Shield
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

// --- Data ---
const services = [
    {
        id: "web",
        title: "Enterprise Web Platforms",
        icon: Globe,
        description: "Scalable, high-performance web applications built with Next.js and React. Designed for speed, SEO, and conversion.",
        tags: ["Next.js", "React", "Scalability"],
        gradient: "from-blue-500 to-cyan-400"
    },
    {
        id: "mobile",
        title: "Native Mobile Solutions",
        icon: Smartphone,
        description: "Cross-platform iOS and Android apps using React Native and Flutter. Native performance with shared codebases.",
        tags: ["iOS", "Android", "Flutter"],
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: "ai",
        title: "AI Integration",
        icon: Brain,
        description: "Custom AI agents, Chatbots, and LLM integrations that automate workflows and enhance user engagement.",
        tags: ["LLMs", "Automation", "OpenAI"],
        gradient: "from-emerald-500 to-green-400"
    },
    {
        id: "cloud",
        title: "Cloud Infrastructure",
        icon: Cloud,
        description: "Robust AWS/Azure architectures, Kubernetes orchestration, and serverless deployments for 99.99% uptime.",
        tags: ["AWS", "Docker", "K8s"],
        gradient: "from-orange-500 to-amber-400"
    },
    {
        id: "backend",
        title: "Microservices Backend",
        icon: Server,
        description: "Secure, battle-tested APIs and biological database structures designed for immense data throughput.",
        tags: ["Node.js", "Go", "GraphQL"],
        gradient: "from-indigo-500 to-violet-500"
    },
    {
        id: "cyber",
        title: "Security & DevOps",
        icon: Shield,
        description: "Automated CI/CD pipelines, penetration testing, and ironclad security protocols for banking-grade protection.",
        tags: ["DevSecOps", "CI/CD", "Security"],
        gradient: "from-rose-500 to-red-400"
    }
];

export default function Services() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Embla Carousel for Mobile/Tablet
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });

    // Scroll parallax for section header
    const { scrollYProgress } = useScroll();
    const headerY = useTransform(scrollYProgress, [0, 0.2], [50, 0]);
    const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

    return (
        <section className="py-32 bg-transparent relative overflow-visible z-10">
            {/* Background Decorations */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
            
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <motion.div 
                        style={{ y: headerY, opacity: headerOpacity }}
                        className="max-w-2xl"
                    >
                        <h2 className="text-sm font-bold text-primary tracking-[0.2em] uppercase mb-4">
                            Capabilities
                        </h2>
                        <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
                            Engineering the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Digital Future
                            </span>
                        </h3>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link 
                            href="/services" 
                            className="group flex items-center gap-2 text-lg font-medium text-white/80 hover:text-white transition-colors"
                        >
                            Explore All Services
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all duration-300">
                                <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Desktop Grid Layout (Bento Grid Style) */}
                <div className="hidden lg:grid grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="group relative h-[380px] rounded-3xl bg-mutted/10 border border-white/5 p-8 flex flex-col justify-between overflow-hidden cursor-pointer"
                        >
                            {/* Glass Background */}
                            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-md transition-all duration-500 group-hover:bg-white/[0.05]" />
                            
                            {/* Gradient Glow */}
                            <div className={cn(
                                "absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-0 group-hover:opacity-40 transition-opacity duration-700 bg-gradient-to-tr",
                                service.gradient
                            )} />

                            {/* Top Content */}
                            <div className="relative z-10 w-full flex justify-between items-start">
                                <div className={cn(
                                    "p-3 rounded-2xl bg-white/5 border border-white/10 transition-colors duration-300",
                                    hoveredIndex === index ? "bg-white/10 border-white/20" : ""
                                )}>
                                    <service.icon className="w-8 h-8 text-white" />
                                </div>
                                <ArrowRight className="w-6 h-6 text-white/30 -rotate-45 group-hover:rotate-0 group-hover:text-white transition-all duration-300" />
                            </div>

                            {/* Middle Description */}
                            <div className="relative z-10 mt-auto">
                                <h4 className="text-2xl font-semibold text-white mb-3 group-hover:translate-x-2 transition-transform duration-300">
                                    {service.title}
                                </h4>
                                <p className="text-white/60 text-sm leading-relaxed mb-6 group-hover:text-white/80 transition-colors duration-300">
                                    {service.description}
                                </p>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {service.tags.map(tag => (
                                        <span key={tag} className="text-xs font-mono px-2 py-1 rounded-md bg-white/5 border border-white/5 text-white/50 group-hover:bg-white/10 group-hover:border-white/10 group-hover:text-white/80 transition-all">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <Link href="/services" className="absolute inset-0 z-20" aria-label={`View ${service.title}`} />
                        </motion.div>
                    ))}
                </div>

                {/* Mobile/Tablet Carousel Layout */}
                <div className="lg:hidden" ref={emblaRef}>
                    <div className="flex gap-4">
                        {services.map((service, index) => (
                            <div key={service.id} className="flex-[0_0_85%] min-w-0 md:flex-[0_0_45%]">
                                <div className="relative h-[360px] rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between overflow-hidden">
                                     {/* Gradient Glow */}
                                     <div className={cn(
                                        "absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-[60px] opacity-30 bg-gradient-to-tr",
                                        service.gradient
                                    )} />

                                    <div className="relative z-10">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                                            <service.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2">{service.title}</h4>
                                        <p className="text-white/60 text-sm">{service.description}</p>
                                    </div>

                                    <div className="relative z-10 flex flex-wrap gap-2 mt-4">
                                        {service.tags.map(tag => (
                                            <span key={tag} className="text-xs px-2 py-1 rounded bg-white/5 text-white/60">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    
                                     <Link href="/services" className="absolute inset-0" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
