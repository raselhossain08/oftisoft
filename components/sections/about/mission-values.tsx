
"use client";

import { motion } from "framer-motion";
import { Lightbulb, Award, Handshake } from "lucide-react";

const values = [
    {
        title: "Innovation",
        icon: Lightbulb,
        desc: "We constantly explore new technologies to solve complex problems efficiently.",
        color: "text-amber-400",
        bg: "bg-amber-400/10",
        animation: { rotate: [0, 10, -10, 0] }
    },
    {
        title: "Excellence",
        icon: Award,
        desc: "We commit to the highest quality standards in every line of code we write.",
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        animation: { scale: [1, 1.2, 1] }
    },
    {
        title: "Collaboration",
        icon: Handshake,
        desc: "We believe great software is built through strong partnerships and open dialogue.",
        color: "text-cyan-400",
        bg: "bg-cyan-400/10",
        animation: { x: [-2, 2, -2, 2, 0] }
    }
];

export default function MissionValues() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Our Mission</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        "To empower businesses with intelligent, scalable, and premium digital solutions that drive growth and deliver exceptional user experiences."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            className="bg-card border border-border p-8 rounded-2xl relative overflow-hidden group"
                        >
                            {/* Hover Glow */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br from-white to-transparent`} />

                            <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mb-6`}>
                                <motion.div
                                    whileHover={item.animation}
                                    transition={{ duration: 0.5 }}
                                >
                                    <item.icon className={`w-8 h-8 ${item.color}`} />
                                </motion.div>
                            </div>

                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-muted-foreground">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
