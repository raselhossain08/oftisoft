
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Smartphone, Brain, Layers, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
    {
        id: "web", label: "Web Development", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10",
        content: {
            title: "Modern Web Applications",
            description: "We build fast, secure, and scalable web applications using the latest technologies like Next.js and React. Our solutions are SEO-optimized and designed for maximum conversion.",
            features: ["Responsive Design", "SSR & SEO Optimized", "PWA Support", "CMS Integration"]
        }
    },
    {
        id: "mobile", label: "Mobile Solutions", icon: Smartphone, color: "text-purple-500", bg: "bg-purple-500/10",
        content: {
            title: "Native & Cross-Platform Apps",
            description: "Reach your customers on any device with our top-tier mobile development services. We specialize in React Native and MAUI for efficient cross-platform deployment.",
            features: ["iOS & Android", "Offline Capabilities", "Push Notifications", "App Store Optimization"]
        }
    },
    {
        id: "ai", label: "AI & Automation", icon: Brain, color: "text-pink-500", bg: "bg-pink-500/10",
        content: {
            title: "Intelligent Business Solutions",
            description: "Leverage the power of Artificial Intelligence to automate workflows, analyze data, and engage customers with smart chatbots.",
            features: ["Custom Chatbots", "Process Automation", "Predictive Analytics", "NLP Integration"]
        }
    },
    {
        id: "fullstack", label: "Full-Stack", icon: Layers, color: "text-orange-500", bg: "bg-orange-500/10",
        content: {
            title: "End-to-End Development",
            description: "Complete software solutions from database architecture to frontend user experience. We handle the entire technology stack.",
            features: ["API Development", "Database Design", "Cloud Integration", "Security Audits"]
        }
    },
    {
        id: "devops", label: "DevOps", icon: Server, color: "text-green-500", bg: "bg-green-500/10",
        content: {
            title: "Cloud & Infrastructure",
            description: "Ensure your applications are always available and scalable with our expert DevOps services including CI/CD pipelines and cloud management.",
            features: ["AWS/Azure/GCP", "Docker & Kubernetes", "CI/CD Pipelines", "24/7 Monitoring"]
        }
    },
];

export default function ServicesOverview() {
    const [activeTab, setActiveTab] = useState(categories[0].id);

    const activeContent = categories.find(c => c.id === activeTab)?.content;

    return (
        <section className="py-24 bg-background">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                        Comprehensive digital solutions tailored to accelerate your business growth.
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={cn(
                                "relative flex items-center gap-2 px-6 py-4 rounded-xl transition-all duration-300 border",
                                activeTab === cat.id
                                    ? "bg-card border-primary/50 text-foreground shadow-lg shadow-primary/10"
                                    : "bg-transparent border-transparent hover:bg-muted text-muted-foreground"
                            )}
                        >
                            <cat.icon className={cn("w-5 h-5", activeTab === cat.id ? cat.color : "text-muted-foreground")} />
                            <span className="font-semibold">{cat.label}</span>
                            {activeTab === cat.id && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute inset-0 rounded-xl border-2 border-primary pointer-events-none"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="max-w-5xl mx-auto min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                        >
                            {/* Text Content */}
                            <div>
                                <h2 className="text-3xl font-bold mb-6 text-foreground">{activeContent?.title}</h2>
                                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                    {activeContent?.description}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {activeContent?.features.map((feature, i) => (
                                        <motion.div
                                            key={feature}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                            <span className="font-medium text-foreground">{feature}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Dynamic Graphic Area */}
                            <div className={cn("relative aspect-video rounded-2xl overflow-hidden flex items-center justify-center", categories.find(c => c.id === activeTab)?.bg)}>
                                {/* Placeholder Graphic - could be a specific component per service */}
                                <div className="text-center p-8">
                                    {categories.map(cat => cat.id === activeTab && (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
                                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                            transition={{ type: "spring", duration: 0.8 }}
                                        >
                                            <cat.icon className={cn("w-32 h-32 opacity-20", cat.color)} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
