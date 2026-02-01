
"use client";

import { motion } from "framer-motion";
import {
    Layout,
    Smartphone,
    Server,
    MessageSquare,
    Code,
    Infinity,
    ArrowRight,
    Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

const services = [
    {
        title: "WordPress Development",
        icon: Layout,
        description: "Custom Themes, Plugin Dev, WooCommerce, Speed Opt",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        animationClass: "group-hover:rotate-[360deg] transition-transform duration-700"
    },
    {
        title: "Mobile App Development",
        icon: Smartphone,
        description: "Android & iOS apps, MAUI, Cross-platform solutions",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        animationClass: "group-hover:scale-110 transition-transform duration-500"
    },
    {
        title: "Backend Development",
        icon: Server,
        description: "Node.js, NestJS, Secure & Scalable Architectures",
        color: "text-green-500",
        bg: "bg-green-500/10",
        animationClass: "group-hover:animate-pulse"
    },
    {
        title: "AI Chatbots",
        icon: MessageSquare,
        secondaryIcon: Brain,
        description: "AI automation, Intelligent natural conversations",
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        animationClass: "group-hover:scale-110 transition-transform duration-500"
    },
    {
        title: "Full-Stack Development",
        icon: Code,
        description: "React, Next.js, Modern UI/UX, End-to-end solutions",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        animationClass: "group-hover:translate-x-1 transition-transform duration-300"
    },
    {
        title: "DevOps Services",
        icon: Infinity,
        description: "CI/CD, Cloud Infrastructure, High-availability",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
        animationClass: "group-hover:spin-slow" // Custom class needed or animate-spin
    }
];

export default function Services() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4"
                    >
                        Our Expertise
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg max-w-2xl mx-auto"
                    >
                        Comprehensive software solutions tailored to your business needs.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group relative p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-primary/10 overflow-hidden"
                        >
                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300", service.bg)}>
                                <service.icon className={cn("w-7 h-7", service.color, service.animationClass)} />
                                {service.secondaryIcon && (
                                    <service.secondaryIcon className="absolute w-4 h-4 -top-1 -right-1 text-primary animate-bounce" />
                                )}
                            </div>

                            <h3 className="text-xl font-semibold mb-3 text-card-foreground group-hover:text-primary transition-colors">
                                {service.title}
                            </h3>

                            <p className="text-muted-foreground mb-6 line-clamp-2 group-hover:text-foreground/80 transition-colors">
                                {service.description}
                            </p>

                            <div className="flex items-center text-primary font-medium text-sm">
                                <span className="relative overflow-hidden group-hover:w-full transition-all">
                                    Learn More
                                </span>
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="group relative inline-flex items-center justify-center px-8 py-3 bg-muted text-foreground rounded-full hover:bg-primary hover:text-white transition-all duration-300 overflow-hidden">
                        <span className="relative z-10 font-medium flex items-center gap-2">
                            View All Services <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </span>
                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>
            </div>
        </section>
    );
}
