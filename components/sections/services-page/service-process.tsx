
"use client";

import { motion } from "framer-motion";
import { Video, FileText, Code2, ClipboardCheck, Rocket, HeartPulse } from "lucide-react";

const steps = [
    { id: 1, title: "Consultation", icon: Video, color: "text-blue-500", desc: "Initial video call to understand requirements." },
    { id: 2, title: "Planning", icon: FileText, color: "text-purple-500", desc: "Creating detailed SRS and architecture docs." },
    { id: 3, title: "Development", icon: Code2, color: "text-orange-500", desc: "Agile development with bi-weekly updates." },
    { id: 4, title: "Review", icon: ClipboardCheck, color: "text-yellow-500", desc: "Thorough testing and client feedback rounds." },
    { id: 5, title: "Launch", icon: Rocket, color: "text-red-500", desc: "Deployment to production servers." },
    { id: 6, title: "Support", icon: HeartPulse, color: "text-green-500", desc: "Ongoing maintenance and improvements." },
];

export default function ServiceProcess() {
    return (
        <section className="py-24 bg-card/50 overflow-hidden">
            <div className="container px-4 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">How We Work</h2>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-[60px] left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 opacity-20" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                <div className="w-28 h-28 mb-6 rounded-full bg-background border-4 border-card shadow-xl flex items-center justify-center group-hover:border-primary transition-colors duration-300 relative">
                                    {/* Pulse Effect */}
                                    <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-current transition-opacity ${step.color.replace('text-', 'bg-')}`} />

                                    <step.icon className={`w-10 h-10 ${step.color}`} />

                                    <div className="absolute top-0 right-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center font-bold text-sm border-2 border-background">
                                        {step.id}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
