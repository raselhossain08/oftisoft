
"use client";

import { motion } from "framer-motion";

const skills = [
    { name: "Frontend Development", value: 95, color: "bg-blue-500" },
    { name: "Backend Engineering", value: 90, color: "bg-green-500" },
    { name: "Mobile App Development", value: 85, color: "bg-purple-500" },
    { name: "AI & Machine Learning", value: 80, color: "bg-pink-500" },
    { name: "DevOps & Cloud", value: 88, color: "bg-orange-500" },
];

export default function TechBreakdown() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 mx-auto max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Technical Expertise</h2>

                <div className="space-y-8">
                    {skills.map((skill, index) => (
                        <div key={index} className="relative">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-lg">{skill.name}</span>
                                <span className="font-mono text-muted-foreground">{skill.value}%</span>
                            </div>
                            <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.value}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                                    className={`h-full rounded-full ${skill.color}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
