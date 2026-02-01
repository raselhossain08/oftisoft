
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    { question: "How long does a typical project take?", answer: "Timeline depends on complexity. A simple website takes 2-4 weeks, while a complex web app can take 2-4 months." },
    { question: "Do you provide hosting services?", answer: "We can set up hosting for you on AWS, Vercel, or VPS, but you usually pay the provider directly." },
    { question: "What is your payment structure?", answer: "Typically 40% upfront, 30% midway, and 30% upon completion. We are flexible for larger projects." },
    { question: "Can you update my existing website?", answer: "Yes, we offer redesign and modernization services for legacy websites." },
    { question: "Do you offer post-launch support?", answer: "Absolutely. All our packages come with a support period, and we offer maintenance plans thereafter." },
    { question: "What technologies do you use?", answer: "We primarily use the MERN stack (MongoDB, Express, React, Node.js), Next.js, and Python for AI tasks." },
];

export default function ServiceFAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [search, setSearch] = useState("");

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="py-24 bg-background">
            <div className="container px-4 mx-auto max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>

                    {/* Search */}
                    <div className="relative max-w-md mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            className="w-full pl-12 pr-4 py-3 rounded-full bg-muted/50 border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredFaqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={cn(
                                    "border rounded-xl transition-all duration-300 overflow-hidden",
                                    activeIndex === index ? "border-primary bg-primary/5" : "border-border bg-card/50 hover:border-primary/50"
                                )}
                            >
                                <button
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    className="flex items-center justify-between w-full p-6 text-left"
                                >
                                    <span className="font-bold text-lg">{faq.question}</span>
                                    <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", activeIndex === index ? "rotate-180 text-primary" : "text-muted-foreground")} />
                                </button>

                                <div
                                    className={cn(
                                        "grid transition-all duration-300 ease-in-out",
                                        activeIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredFaqs.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            No questions found matching "{search}"
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
