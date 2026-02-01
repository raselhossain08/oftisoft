
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Twitter, Code2 } from "lucide-react";
import Image from "next/image";

// Placeholder data since only Rasel is specified, will use generics for teammates
const teamMembers = [
    { id: 1, name: "Rasel Hossain", role: "Founder & CEO", category: "Leadership", image: "/rasel-avt.jpg", skills: ["Architecture", "Next.js", "Business"] },
    { id: 2, name: "Alex Morgan", role: "Lead Developer", category: "Development", image: "/dev1.jpg", skills: ["React", "Node.js", "AWS"] },
    { id: 3, name: "Sarah Chen", role: "UI/UX Designer", category: "Design", image: "/des1.jpg", skills: ["Figma", "Motion", "Prototyping"] },
    { id: 4, name: "David Kim", role: "Backend Engineer", category: "Development", image: "/dev2.jpg", skills: ["Python", "SQL", "Docker"] },
    { id: 5, name: "Emily Watson", role: "Product Manager", category: "Leadership", image: "/pm1.jpg", skills: ["Agile", "Strategy", "Scrum"] },
    { id: 6, name: "Lucas Silva", role: "DevOps Engineer", category: "Support", image: "/ops1.jpg", skills: ["CI/CD", "Kubernetes", "Linux"] },
];

const categories = ["All", "Leadership", "Development", "Design", "Support"];

export default function TeamShowcase() {
    const [filter, setFilter] = useState("All");

    const filteredTeam = teamMembers.filter(member =>
        filter === "All" ? true : member.category === filter
    );

    return (
        <section className="py-24 bg-card/30">
            <div className="container px-4 mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet the Team</h2>
                    <p className="text-muted-foreground">The brilliant minds behind our success.</p>
                </div>

                {/* Filter */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                                    : "bg-background border border-border hover:border-primary/50 text-muted-foreground"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredTeam.map((member) => (
                            <motion.div
                                key={member.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative bg-background border border-border rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
                            >
                                {/* Image Area */}
                                <div className="h-64 bg-muted relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                                    {/* Placeholder generic avatar */}
                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-700 group-hover:scale-110 transition-transform duration-700">
                                        {member.name.charAt(0)}
                                    </div>

                                    {/* Socials Slide Up */}
                                    <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-4 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <a href="#" className="p-2 bg-card rounded-full hover:text-primary transition-colors"><Github className="w-4 h-4" /></a>
                                        <a href="#" className="p-2 bg-card rounded-full hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
                                        <a href="#" className="p-2 bg-card rounded-full hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></a>
                                    </div>
                                </div>

                                <div className="p-6 pt-2 text-center relative z-20">
                                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                    <p className="text-primary text-sm font-medium mb-4">{member.role}</p>

                                    <div className="flex flex-wrap justify-center gap-2">
                                        {member.skills.map((skill) => (
                                            <span key={skill} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
