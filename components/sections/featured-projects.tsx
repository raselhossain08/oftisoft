
"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

// Mock Data
const projects = [
    {
        id: 1,
        title: "E-Commerce Platform",
        category: "Full Stack Development",
        image: "/project-1.jpg",
        description: "A high-performance e-commerce platform with Next.js and Stripe integration.",
        tech: ["Next.js", "TypeScript", "Stripe", "Prisma"],
        stats: { users: "10k+", sales: "$1M+" }
    },
    {
        id: 2,
        title: "Healthcare Dashboard",
        category: "Web Application",
        image: "/project-2.jpg",
        description: "Comprehensive patient management system with real-time analytics.",
        tech: ["React", "Redux", "Node.js", "Socket.io"],
        stats: { hospitals: "50+", patients: "100k+" }
    },
    {
        id: 3,
        title: "AI Chatbot Solution",
        category: "AI & Automation",
        image: "/project-3.jpg",
        description: "Intelligent customer support bot powered by LLMs.",
        tech: ["Python", "FastAPI", "OpenAI", "VectorDB"],
        stats: { conversations: "500k+", accuracy: "95%" }
    }
];

export default function FeaturedProjects() {
    return (
        <section className="py-24 bg-background/50 relative">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                            Featured Projects
                        </h2>
                        <p className="text-muted-foreground text-lg text-white">
                            Some of our finest work delivering impact.
                        </p>
                    </div>
                    <div className="flex gap-4 mt-6 md:mt-0">
                        {/* Custom Navigation Buttons will be handled by Swiper or we hide default and use these */}
                        {/* For simplicity in this iteration, we use Swiper default nav masked with custom styles if needed, 
                 or just let Swiper render them. I will use Swiper's built-in navigation with custom class names. */}
                    </div>
                </div>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 2 },
                    }}
                    autoplay={{ delay: 8000, disableOnInteraction: false }}
                    navigation
                    pagination={{ clickable: true }}
                    className="w-full pb-12 !overflow-visible"
                >
                    {projects.map((project) => (
                        <SwiperSlide key={project.id} className="h-auto">
                            <div className="group relative rounded-2xl overflow-hidden bg-card border border-border h-full flex flex-col">
                                {/* Image Placeholder - As we don't have real images, we use a colored div with pattern */}
                                <div className="relative h-64 bg-slate-800 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                                    {/* Placeholder Text */}
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-bold text-4xl opacity-20 transform group-hover:scale-110 transition-transform duration-700">
                                        IMAGE
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                                        <button className="p-3 bg-white text-black rounded-full hover:bg-primary hover:text-white transition-colors">
                                            <ExternalLink className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <span className="text-primary text-sm font-medium mb-2 block">{project.category}</span>
                                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-muted-foreground mb-6 flex-1">{project.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tech.map((t, i) => (
                                            <span key={i} className="px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="border-t border-border pt-4 flex justify-between items-center text-sm text-muted-foreground">
                                        {Object.entries(project.stats).map(([k, v], i) => (
                                            <div key={i} className="flex flex-col">
                                                <span className="font-bold text-white text-lg">{v}</span>
                                                <span className="capitalize text-xs">{k}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
