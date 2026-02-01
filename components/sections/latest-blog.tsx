
"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock, User } from "lucide-react";

export default function LatestBlog() {
    const posts = [
        {
            title: "The Future of AI in Web Development",
            excerpt: "How Artificial Intelligence is reshaping the way we build and interact with web applications.",
            category: "Technology",
            date: "Oct 15, 2025",
            readTime: "5 min read",
            image: "bg-blue-900", // Placeholder class
        },
        {
            title: "Optimizing Next.js for Performance",
            excerpt: "Key strategies and best practices to ensure your Next.js application runs at lightning speed.",
            category: "Development",
            date: "Sep 28, 2025",
            readTime: "8 min read",
            image: "bg-purple-900", // Placeholder class
        },
        {
            title: "Why UI/UX Matters More Than Ever",
            excerpt: "Exploring the impact of user-centric design on conversion rates and customer satisfaction.",
            category: "Design",
            date: "Sep 10, 2025",
            readTime: "6 min read",
            image: "bg-indigo-900", // Placeholder class
        },
    ];

    return (
        <section className="py-24 bg-background">
            <div className="container px-4 mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Latest Insights
                    </h2>
                    <a href="#" className="hidden md:flex items-center text-primary font-medium hover:underline">
                        View all posts <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.article
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer flex flex-col h-full"
                        >
                            <div className={`relative h-56 rounded-2xl overflow-hidden mb-6 ${post.image}`}>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-4">
                                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {post.readTime}</span>
                                <span className="flex items-center"><User className="w-3 h-3 mr-1" /> Admin</span>
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                {post.title}
                            </h3>

                            <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center text-primary text-sm font-medium mt-auto">
                                Read Article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
