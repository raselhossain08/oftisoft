
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Twitter, ArrowUpRight, Grid, Code, Palette, Zap, Sparkles } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAboutContentStore } from "@/lib/store/about-content";

const categories = [
    { label: "All", icon: Grid },
    { label: "Leadership", icon: Sparkles },
    { label: "Development", icon: Code },
    { label: "Design", icon: Palette },
];

export default function TeamShowcase({ data }: { data?: any }) {
    const { content: storeContent } = useAboutContentStore();
    const team = data || storeContent?.team;
    const teamMembers = team?.members || [];

    const [filter, setFilter] = useState("All");

    const filteredTeam = teamMembers.filter((member: any) =>
        filter === "All" ? true : member.category === filter || (filter === "Development" && (member.category === "Development" || member.category === "Product"))
    );

    return (
        <section className="py-24 md:py-32 bg-transparent relative overflow-hidden z-20">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col items-center text-center mb-16 md:mb-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Badge variant="outline" className="mb-6 border-primary/20 text-primary uppercase tracking-widest px-3 py-1 bg-primary/5 rounded-full">
                            {team?.badge || "The Collective"}
                        </Badge>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            {team?.titleLine1 || "Architects of the"} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {team?.titleLine2 || "Impossible."}
                            </span>
                        </h3>
                    </motion.div>

                    {/* Modern Pill Filter */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.label}
                                onClick={() => setFilter(cat.label)}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300",
                                    filter === cat.label
                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                                )}
                            >
                                <cat.icon className="w-4 h-4" />
                                {cat.label}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* Team Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredTeam.map((member: any) => (
                            <motion.div
                                key={member.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                transition={{ duration: 0.4 }}
                                className="group relative"
                            >
                                <div className="aspect-[4/5] rounded-[2rem] bg-[#0a0a0a] border border-white/10 overflow-hidden relative">
                                    {/* Gradient Background */}
                                    <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-br transition-all duration-700 group-hover:opacity-40", member.gradient)} />
                                    
                                    {/* Profile Image Logic */}
                                    <div className="absolute inset-4 rounded-2xl bg-[#111] overflow-hidden">
                                        {member.image && (member.image.startsWith('data:') || member.image.startsWith('http') || member.image.startsWith('/')) ? (
                                            <Image 
                                                src={member.image} 
                                                alt={member.name} 
                                                fill 
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <>
                                                <div className={cn("w-full h-full opacity-50 mix-blend-overlay", (member.image && !member.image.includes(' ')) ? member.image : member.gradient?.replace("from-", "bg-"))} />
                                                
                                                {/* Fallback Initials */}
                                                <div className="absolute inset-0 flex items-center justify-center text-8xl font-black text-white/5 group-hover:scale-110 transition-transform duration-700">
                                                    {member.name?.split(" ").map((n: string) => n[0]).join("")}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                                    {/* Content Info */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex items-center gap-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                <SocialIcon icon={Github} href={member.socials?.github} />
                                                <SocialIcon icon={Linkedin} href={member.socials?.linkedin} />
                                                <SocialIcon icon={Twitter} href={member.socials?.twitter} />
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors duration-300">
                                                {member.name}
                                            </h3>
                                            <p className="text-white/60 font-medium tracking-wide text-sm uppercase">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Top Right Arrow */}
                                    <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                        <ArrowUpRight className="w-5 h-5 text-white" />
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

function SocialIcon({ icon: Icon, href }: { icon: any, href?: string }) {
    return (
        <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-black transition-all border-white/5"
            asChild
        >
            <a href={href || "#"}>
                <Icon className="w-4 h-4" />
            </a>
        </Button>
    );
}