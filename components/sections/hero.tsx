
"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import CountUp from "react-countup";
import ParticlesBackground from "../ui/particles-background";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-20">
            {/* Background */}
            <div className="absolute inset-0 bg-background/80 z-0" />
            <ParticlesBackground />

            {/* Geometric Shapes (CSS/Framer) */}
            <motion.div
                animate={{
                    y: [-20, 20],
                    rotate: [0, 10],
                    scale: [1, 1.1]
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="absolute top-20 left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-5"
            />
            <motion.div
                animate={{
                    y: [20, -20],
                    rotate: [0, -10],
                    scale: [1, 1.2]
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                }}
                className="absolute bottom-20 right-[10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-5"
            />

            <div className="container relative z-10 px-4 text-center">
                {/* Main Headline */}
                <div className="mb-6 h-32 md:h-24 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary drop-shadow-sm">
                        <TypeAnimation
                            sequence={[
                                "Transform Your Digital Vision Into Reality",
                                1000,
                            ]}
                            wrapper="span"
                            speed={50}
                            cursor={true}
                            repeat={0}
                        />
                    </h1>
                </div>

                {/* Sub Headline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-xl md:text-2xl text-muted-foreground mb-10 font-light"
                >
                    Rasel Hossain | 6+ Years Software Expertise
                </motion.p>

                {/* Call to Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
                >
                    {/* Primary Button */}
                    <button className="relative px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-semibold shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] transition-all duration-300 animate-[pulse_5s_cubic-bezier(0.4,0,0.6,1)_infinite] hover:scale-105 active:scale-95 group overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            Start Your Project
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    {/* Secondary Button */}
                    <button className="px-8 py-4 bg-transparent border border-muted hover:border-secondary text-foreground rounded-full text-lg font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:text-secondary hover:scale-105 active:scale-95">
                        View Our Work
                    </button>
                </motion.div>

                {/* Stats Counters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    {/* 150+ Projects */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                            <CountUp end={150} duration={2.5} suffix="+" />
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">Projects</p>
                    </div>

                    {/* 98% Satisfaction */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                            <CountUp end={98} duration={2.5} suffix="%" />
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">Satisfaction</p>
                    </div>

                    {/* 36+ Team Members */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                            <CountUp end={36} duration={2.5} suffix="+" />
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">Team Members</p>
                    </div>

                    {/* 24/7 Support */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                            <CountUp end={24} duration={2} suffix="/7" />
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">Support</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
