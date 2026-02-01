
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, User } from "lucide-react";
import Image from "next/image";

export default function FeaturedPost() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]);

    return (
        <section className="relative h-[80vh] w-full overflow-hidden flex items-end">
            {/* Parallax Background */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0 bg-slate-900"
            >
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
                {/* Placeholder for real image */}
                <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070')] bg-cover bg-center" />
            </motion.div>

            <div className="container px-4 mx-auto relative z-20 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <div className="flex gap-2 mb-6">
                        <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                            Featured
                        </span>
                        <span className="px-3 py-1 bg-white/10 text-white text-xs font-bold rounded-full uppercase tracking-wider backdrop-blur-md">
                            AI & Future Tech
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                        The Future of Web Development: <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            How AI is changing the landscape
                        </span>
                    </h1>

                    <div className="flex items-center gap-6 text-white/80">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border-2 border-primary">
                                {/* Avatar placeholder */}
                                <div className="w-full h-full bg-slate-700" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Rasel Hossain</p>
                                <p className="text-xs">Author</p>
                            </div>
                        </div>

                        <div className="h-8 w-[1px] bg-white/20" />

                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>5 min read</span>
                        </div>

                        <div className="h-8 w-[1px] bg-white/20" />

                        <p className="text-sm">Oct 24, 2026</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
