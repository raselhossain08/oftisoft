
"use client";

import { motion } from "framer-motion";
import { Users, Workflow, Cpu, Headphones } from "lucide-react";

const features = [
    {
        title: "Expert Team",
        description: "Highly skilled professionals dedicated to excellence.",
        icon: Users,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Proven Process",
        description: "Streamlined workflows that ensure timely delivery.",
        icon: Workflow,
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
    {
        title: "Cutting-edge Tech",
        description: "We use the latest frameworks for maximum performance.",
        icon: Cpu,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        title: "24/7 Support",
        description: "Always here to help you solve critical issues.",
        icon: Headphones,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
    },
];

export default function WhyUs() {
    return (
        <section className="py-24 bg-card/50">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4">
                        Why Choose Ofitsoft
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We deliver more than just code; we deliver value.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-background border border-border p-8 rounded-2xl flex flex-col items-center text-center hover:shadow-lg transition-all"
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${feature.bg}`}>
                                <feature.icon className={`w-8 h-8 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
