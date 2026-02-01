
"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import CountUp from "react-countup";
import { Code, Users, Boxes, Brain } from "lucide-react";
import Image from "next/image";

export default function FounderIntro() {
    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
    const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Floating Tech Orbits */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/4 w-[500px] h-[500px] border border-primary/20 rounded-full"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-2 rounded-full border border-primary"><Code className="w-6 h-6 text-primary" /></div>
                </motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/4 w-[700px] h-[700px] border border-secondary/20 rounded-full"
                >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-background p-2 rounded-full border border-secondary"><Brain className="w-6 h-6 text-secondary" /></div>
                </motion.div>
            </div>

            <div className="container px-4 mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">

                {/* Left Side - Image with 3D Tilt */}
                <div
                    onMouseMove={onMouseMove}
                    onMouseLeave={() => { x.set(0); y.set(0); }}
                    className="flex-1 w-full flex justify-center perspective-[1000px]"
                >
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="relative w-full max-w-md aspect-[3/4] bg-card rounded-2xl border border-border shadow-2xl p-2"
                    >
                        {/* Gradient Border Pulse */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-50 blur-lg -z-10 animate-pulse-slow" />

                        <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted">
                            {/* Placeholder for real image */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                            <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold opacity-20 text-white">RASEL</div>
                            {/* Add your Image component here */}
                            {/* <Image src="/rasel.jpg" alt="Rasel Hossain" fill className="object-cover" /> */}
                        </div>

                        <motion.div
                            style={{ translateZ: 50 }}
                            className="absolute bottom-8 left-8 z-20"
                        >
                            <h3 className="text-2xl font-bold text-white">Rasel Hossain</h3>
                            <p className="text-primary font-medium">Founder & CEO</p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            <span className="text-foreground">Hello, I'm </span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                <TypeAnimation
                                    sequence={["Rasel Hossain", 2000, "a Visionary", 2000]}
                                    wrapper="span"
                                    speed={50}
                                    repeat={Infinity}
                                />
                            </span>
                        </h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-xl text-muted-foreground"
                        >
                            Founder & CEO | 6+ Years Experience
                        </motion.p>
                    </div>

                    <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                        <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                            I am a passionate software engineer and technology consultant dedicated to building modern, scalable, and high-performance digital solutions.
                        </motion.p>
                        <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                            With a vision to help businesses grow, I founded <strong>Ofitsoft</strong> to deliver products that are technically strong, visually stunning, and business-focused.
                        </motion.p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border">
                        <div>
                            <h4 className="text-3xl font-bold text-foreground flex items-baseline">
                                <CountUp end={150} duration={2} />+
                            </h4>
                            <span className="text-sm text-muted-foreground">Projects</span>
                        </div>
                        <div>
                            <h4 className="text-3xl font-bold text-foreground flex items-baseline">
                                <CountUp end={50} duration={2} />+
                            </h4>
                            <span className="text-sm text-muted-foreground">Clients</span>
                        </div>
                        <div>
                            <h4 className="text-3xl font-bold text-foreground flex items-baseline">
                                6 <span className="text-lg ml-1">Years</span>
                            </h4>
                            {/* Progress bar animation */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 1.5 }}
                                className="h-1 bg-gradient-to-r from-primary to-secondary mt-1 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Signature */}
                    <div className="pt-8">
                        <svg width="200" height="60" viewBox="0 0 200 60" className="opacity-80">
                            <motion.path
                                d="M10,50 Q40,10 70,40 T130,30 T190,50"
                                fill="transparent"
                                stroke="currentColor" // Uses text color
                                strokeWidth="2"
                                className="text-primary"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                        </svg>
                    </div>
                </div>

            </div>
        </section>
    );
}
