
"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { Code2, Brain, Sparkles, Send, Github, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FounderIntro() {
    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smoother Spring Physics
    const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    const rotateX = useTransform(mouseY, [-300, 300], [8, -8]); // Increased range
    const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

    // Floating Animation when idle
    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            rotate: [0, 1, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <section className="py-24 bg-transparent relative overflow-visible z-10">
             {/* Background Gradient Mesh */}
             <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

            <div className="container px-4 mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    <motion.div
                        onMouseMove={onMouseMove}
                        onMouseLeave={() => { x.set(0); y.set(0); }}
                        className="relative perspective-1000 w-full max-w-md mx-auto"
                        variants={floatingVariants}
                        animate="animate"
                    >
                        <motion.div
                            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                            className="relative aspect-[3/4] rounded-3xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-2 shadow-2xl overflow-hidden group will-change-transform" // Added will-change-transform
                        >
                            {/* Inner Border Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20 opacity-50 rounded-3xl -z-10 group-hover:opacity-100 transition-opacity duration-700" />
                            
                            {/* Profile Image Container */}
                            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/5">
                                {/* Placeholder gradient if no image */}
                                <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 to-black" />
                                
                                {/* Image (replace with actual src) */}
                                <div className="absolute inset-0 flex items-center justify-center text-neutral-700 font-bold text-6xl opacity-20">
                                    RH
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                            </div>

                            {/* Floating Card Content */}
                            <motion.div 
                                style={{ translateZ: 40 }}
                                className="absolute bottom-8 left-8 right-8"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-3 py-1 rounded-full bg-primary/20 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                        Founder & CEO
                                    </span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-1">Rasel Hossain</h3>
                                <p className="text-white/60 text-sm mb-6">Visionary . Engineer . Consultant</p>
                                
                                {/* Socials */}
                                <div className="flex gap-3">
                                    {[Github, Linkedin, Twitter].map((Icon, i) => (
                                        <Link 
                                            key={i} 
                                            href="#" 
                                            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black flex items-center justify-center transition-all duration-300 border border-white/5"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Background Decorative Elements */}
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-12 -right-12 w-64 h-64 border border-dashed border-white/10 rounded-full -z-10 pointer-events-none"
                        />
                         <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-12 -left-12 w-80 h-80 border border-dashed border-white/5 rounded-full -z-10 pointer-events-none"
                        />
                    </motion.div>

                    {/* Right Side: Editorial Content */}
                    <div className="space-y-8">
                        <div>
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 mb-4"
                            >
                                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                <span className="text-sm font-bold text-primary tracking-widest uppercase">The Architect</span>
                            </motion.div>
                            
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                Coding the Future, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    One Line at a Time.
                                </span>
                            </h2>
                        </div>

                        <div className="prose prose-invert prose-lg text-muted-foreground/80 leading-relaxed">
                            <p>
                                I am a passionate software engineer and technology consultant dedicated to building modern, scalable, and high-performance digital solutions.
                            </p>
                            <p>
                                With a vision to bridge the gap between complex engineering and intuitive design, I founded <strong className="text-white">Ofitsoft</strong>. We don't just write code; we architect digital ecosystems that empower businesses to scale effortlessly in the AI era.
                            </p>
                        </div>

                        {/* Interactive Stats */}
                        <div className="grid grid-cols-3 gap-8 py-8 border-y border-white/5">
                            <StatBlock num={150} label="Projects Delivered" suffix="+" delay={0} />
                            <StatBlock num={50} label="Happy Clients" suffix="+" delay={0.1} />
                            <StatBlock num={6} label="Years Experience" suffix="Y" delay={0.2} />
                        </div>

                        {/* Signature / CTA */}
                        <div className="pt-4 flex items-center gap-8">
                            <div className="opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                                {/* SVG Signature Placeholder */}
                                <svg width="180" height="50" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <motion.path 
                                        d="M10 40 C 30 10, 60 60, 90 30 C 120 0, 150 50, 190 20" 
                                        stroke="white" 
                                        strokeWidth="3" 
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        whileInView={{ pathLength: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                    />
                                    <text x="50" y="55" className="fill-white text-[10px] font-mono tracking-widest uppercase opacity-50">Founder's Signature</text>
                                </svg>
                            </div>
                            
                            <Link 
                                href="#contact" 
                                className="group flex items-center gap-2 text-white font-medium hover:text-primary transition-colors"
                            >
                                Let's Talk
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatBlock({ num, label, suffix, delay }: { num: number, label: string, suffix: string, delay: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
        >
            <div className="text-4xl font-bold text-white mb-1 flex items-baseline">
                <CountUp end={num} duration={2.5} />
                <span className="text-primary text-2xl ml-1">{suffix}</span>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {label}
            </div>
        </motion.div>
    );
}
