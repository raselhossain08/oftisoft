"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, HelpCircle, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
    { 
        id: "timeline",
        category: "General",
        question: "How long does a typical project take?", 
        answer: "Timeline depends on complexity. A simple website takes 2-4 weeks, while a complex web app can take 2-4 months. We provide a detailed Gantt chart during the onboarding phase so you always know what to expect." 
    },
    { 
        id: "hosting",
        category: "Technical",
        question: "Do you provide hosting services?", 
        answer: "We typically set up hosting for you on industry-standard platforms like AWS, Vercel, or DigitalOcean. You retain full ownership of the accounts. We can also manage the infrastructure for a monthly maintenance fee." 
    },
    { 
        id: "payment",
        category: "Billing",
        question: "What is your payment structure?", 
        answer: "We work on a milestone basis to ensure trust. Typically, it's 40% upfront to kickstart resources, 30% after the design phase approval, and 30% upon final delivery and deployment." 
    },
    { 
        id: "redesign",
        category: "General",
        question: "Can you update my existing website?", 
        answer: "Yes! We specialize in modernization. We can refactor your legacy code, improve performance metrics (Core Web Vitals), and give the UI a fresh '2026' aesthetic without losing your SEO ranking." 
    },
    { 
        id: "support",
        category: "Support",
        question: "Do you offer post-launch support?", 
        answer: "Absolutely. All our packages come with a 30-day bug-fix warranty. Beyond that, we offer tiered maintenance plans that cover security updates, feature additions, and server monitoring." 
    },
    { 
        id: "tech",
        category: "Technical",
        question: "What technologies do you use?", 
        answer: "We are full-stack experts. Frontend: React, Next.js, Tailwind, Three.js. Backend: Node.js, Python (Django/FastAPI), Go. Database: PostgreSQL, MongoDB, Redis. We choose the best tool for your specific goals." 
    },
];

export default function ServiceFAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);
    const [search, setSearch] = useState("");

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />

            <div className="container px-4 mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-16 space-y-4">
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold"
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span>Support Center</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to know about our process, pricing, and technical approach.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-lg mx-auto mb-16">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-20" />
                    <div className="relative bg-card rounded-full border border-border shadow-lg flex items-center px-6 py-4 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <Search className="w-5 h-5 text-muted-foreground mr-4" />
                        <input
                            type="text"
                            placeholder="Type keywords to search..."
                            className="bg-transparent border-none outline-none w-full text-lg placeholder:text-muted-foreground/70"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                         {search && (
                            <button onClick={() => setSearch("")} className="text-xs font-bold text-primary hover:underline ml-2">
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode="wait">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <AccordionItem 
                                    key={faq.id} 
                                    faq={faq} 
                                    isOpen={activeIndex === index}
                                    onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                                    index={index}
                                />
                            ))
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                    <HelpCircle className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-bold">No matching questions</h3>
                                <p className="text-muted-foreground">Try adjusting your search terms or contact us directly.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Contact CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-card to-card border border-border/50 text-center relative overflow-hidden"
                >
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px]" />
                     
                    <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Can't find the answer you're looking for? Please chat to our friendly team.
                    </p>
                    <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:scale-105 active:scale-95">
                        <MessageCircle className="w-5 h-5" />
                        Chat with Support
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

function AccordionItem({ faq, isOpen, onClick, index }: { faq: any, isOpen: boolean, onClick: () => void, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "group border rounded-2xl overflow-hidden transition-all duration-300",
                isOpen 
                    ? "bg-card border-primary/30 shadow-lg shadow-primary/5" 
                    : "bg-card/40 border-border hover:bg-card hover:border-primary/20"
            )}
        >
            <button
                onClick={onClick}
                className="flex items-center justify-between w-full p-6 text-left"
            >
                <div className="flex items-center gap-4">
                    <span className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                        isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                        {index + 1}
                    </span>
                    <span className={cn("font-bold text-lg transition-colors", isOpen ? "text-foreground" : "text-foreground/80")}>
                        {faq.question}
                    </span>
                </div>
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300",
                    isOpen 
                        ? "bg-primary border-primary text-primary-foreground rotate-180" 
                        : "border-border bg-background text-muted-foreground group-hover:border-primary/50"
                )}>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-6 pb-6 pt-0 ml-12 border-l-2 border-primary/10">
                            <p className="text-muted-foreground leading-relaxed text-base">
                                {faq.answer}
                            </p>
                            {/* Optional: Add related link or subtle action */}
                            <div className="mt-4 pt-4 border-t border-dashed border-border flex items-center gap-2 text-sm font-medium text-primary cursor-pointer hover:underline">
                                <Sparkles className="w-3 h-3" />
                                <span>Learn more in our documentation</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
