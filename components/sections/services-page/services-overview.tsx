"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Smartphone, Brain, Layers, Server, Sparkles, ArrowRight, Code, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const services = [
    {
        id: "web",
        label: "Modern Web",
        icon: Globe,
        gradient: "from-blue-600 to-cyan-500",
        title: "High-Performance Web Applications",
        description: "We build pixel-perfect, SEO-optimized web applications using Next.js 15 and React Server Components. Our sites aren't just beautiful; they are lightning fast and score 100 on Core Web Vitals.",
        features: [
            { icon: Zap, title: "Speed Optimization", desc: "Sub-second load times" },
            { icon: Code, title: "Clean Architecture", desc: "Scalable codebase patterns" },
            { icon: ShieldCheck, title: "Enterprise Security", desc: "OWASP compliance built-in" }
        ]
    },
    {
        id: "mobile",
        label: "Mobile Apps",
        icon: Smartphone,
        gradient: "from-purple-600 to-pink-500",
        title: "Native-Quality Cross-Platform Apps",
        description: "Reach iOS and Android users simultaneously with React Native. We deliver fluid animations, offline capabilities, and deeply integrated native features without the cost of two separate teams.",
        features: [
            { icon: Smartphone, title: "One Codebase", desc: "iOS & Android support" },
            { icon: Zap, title: "60 FPS Performance", desc: "Fluid animations" },
            { icon: Layers, title: "Offline First", desc: "Works without signal" }
        ]
    },
    {
        id: "ai",
        label: "AI Solutions",
        icon: Brain,
        gradient: "from-indigo-600 to-violet-500",
        title: "Intelligent Business Automation",
        description: "Transform your business operations with custom AI agents. From customer support chatbots tied to your knowledge base, to predictive analytics models that spot trends before they happen.",
        features: [
            { icon: Brain, title: "RAG Pipelines", desc: "Chat with your data" },
            { icon: Sparkles, title: "Generative AI", desc: "Automated content creation" },
            { icon: Code, title: "Custom Models", desc: "Fine-tuned for your niche" }
        ]
    },
    {
        id: "devops",
        label: "DevOps & Cloud",
        icon: Server,
        gradient: "from-emerald-500 to-teal-500",
        title: "Scalable Cloud Infrastructure",
        description: "Sleep soundly knowing your infrastructure scales automatically. We design serverless architectures on AWS and Vercel that handle traffic spikes effortlessly while minimizing costs.",
        features: [
            { icon: Server, title: "Auto-Scaling", desc: "Zero downtime deployment" },
            { icon: ShieldCheck, title: "Cloud Security", desc: "Automated compliance" },
            { icon: Layers, title: "Infrastructure as Code", desc: "Terraform / CDK" }
        ]
    }
];

export default function ServicesOverview() {
    const [activeService, setActiveService] = useState(services[0]);

    return (
        <section className="py-24 bg-background relative overflow-hidden min-h-screen flex items-center">
            {/* Dynamic Background Gradient */}
            <div className="absolute inset-0 transition-colors duration-1000 bg-background">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeService.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.15 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className={cn("absolute -top-[50%] -left-[20%] w-[1200px] h-[1200px] rounded-full blur-[150px] bg-gradient-to-br", activeService.gradient)}
                    />
                </AnimatePresence>
            </div>

            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
                    
                    {/* Left: Navigation Menu */}
                    <div className="w-full lg:w-1/3">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <h2 className="text-4xl font-bold mb-12">Our Expertise</h2>
                            
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => setActiveService(service)}
                                    className="group w-full text-left"
                                >
                                    <div className={cn(
                                        "p-6 rounded-2xl transition-all duration-300 border backdrop-blur-sm",
                                        activeService.id === service.id 
                                            ? "bg-card border-primary/20 shadow-xl shadow-primary/5 translate-x-4" 
                                            : "bg-transparent border-transparent hover:bg-card/30 text-muted-foreground hover:text-foreground"
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300",
                                                activeService.id === service.id ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-card"
                                            )}>
                                                <service.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg">{service.label}</h3>
                                                {activeService.id === service.id && (
                                                    <motion.div 
                                                        layoutId="active-arrow"
                                                        className="h-1 w-12 bg-primary rounded-full mt-2" 
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right: Dynamic Content Area */}
                    <div className="w-full lg:w-2/3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeService.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="relative"
                            >
                                {/* Decorative Icon Background */}
                                <activeService.icon className="absolute -top-10 -right-10 w-64 h-64 opacity-[0.03] text-foreground rotate-12" />

                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20 mb-6">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Premium Service</span>
                                </div>
                                
                                <h3 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                                    {activeService.title}
                                </h3>
                                
                                <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl">
                                    {activeService.description}
                                </p>

                                {/* Feature Cards Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                    {activeService.features.map((feature, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 + (idx * 0.1) }}
                                            className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group/card"
                                        >
                                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover/card:bg-primary/20 group-hover/card:text-primary transition-colors">
                                                <feature.icon className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold mb-1">{feature.title}</h4>
                                            <p className="text-sm text-muted-foreground">{feature.desc}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <Link href={`/services/${activeService.id}`} className="h-14 px-8 rounded-full bg-foreground text-background font-bold flex items-center gap-2 hover:bg-foreground/80 transition-colors shadow-2xl w-fit">
                                    explore {activeService.label}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>

                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}
