
"use client";

import { motion } from "framer-motion";
import { Twitter, Linkedin } from "lucide-react";

export default function AuthorSpotlight() {
    return (
        <section className="py-24 bg-background border-t border-border">
            <div className="container px-4 mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center">Meet the Author</h2>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-card border border-border rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg hover:shadow-xl transition-all"
                    >
                        {/* Photo */}
                        <div className="relative w-40 h-40 flex-shrink-0">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-slow" />
                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background shadow-lg">
                                {/* Avatar Placeholder */}
                                <div className="w-full h-full bg-slate-700 flex items-center justify-center text-4xl text-slate-500 font-bold">RH</div>
                            </div>
                            {/* Badge */}
                            <div className="absolute bottom-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-background">
                                Top Writer
                            </div>
                        </div>

                        {/* Content */}
                        <div className="text-center md:text-left flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold">Rasel Hossain</h3>
                                    <p className="text-primary font-medium">Founder & CEO @ Ofitsoft</p>
                                </div>
                                <div className="flex justify-center gap-2 mt-4 md:mt-0">
                                    <button className="p-2 bg-muted rounded-full hover:bg-black hover:text-white transition-colors"><Twitter className="w-5 h-5" /></button>
                                    <button className="p-2 bg-muted rounded-full hover:bg-blue-600 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></button>
                                </div>
                            </div>

                            <p className="text-muted-foreground mb-6">
                                Passionate software engineer with 6+ years of experience helping startups and enterprises scale their digital products. I write about React, Next.js, System Architecture, and AI.
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                <div className="text-center">
                                    <div className="font-bold text-xl">150+</div>
                                    <div className="text-xs text-muted-foreground uppercase">Articles</div>
                                </div>
                                <div className="w-px h-10 bg-border" />
                                <div className="text-center">
                                    <div className="font-bold text-xl">50k+</div>
                                    <div className="text-xs text-muted-foreground uppercase">Readers</div>
                                </div>
                                <div className="w-px h-10 bg-border" />
                                <div className="flex flex-wrap gap-2 items-center">
                                    {["Architecture", "AI", "Frontend"].map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
