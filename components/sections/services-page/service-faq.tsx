"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, HelpCircle, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useServicesContentStore } from "@/lib/store/services-content";

export default function ServiceFAQ() {
    const { content } = useServicesContentStore();
    const faqs = content?.faqs || [];
    const [search, setSearch] = useState("");

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(search.toLowerCase()) ||
        f.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-primary/3 rounded-full blur-[150px] pointer-events-none" />

            <div className="container px-4 mx-auto max-w-4xl relative z-10">
                <div className="text-center mb-12 md:mb-16 space-y-4">
                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Badge variant="outline" className="gap-2 px-3 py-1 bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors">
                            <HelpCircle className="w-3.5 h-3.5" />
                            Support Center
                        </Badge>
                    </motion.div>
                    
                    <h2 className="text-3xl md:text-5xl font-bold">Frequently Asked Questions</h2>
                    <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to know about our process, pricing, and technical approach.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-lg mx-auto mb-12 md:mb-16">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-20" />
                    <div className="relative flex items-center gap-2">
                         <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Type keywords to search..." 
                                className="pl-10 h-12 rounded-full border-border/60 bg-card/80 backdrop-blur-sm shadow-sm focus-visible:ring-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                         {search && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setSearch("")} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary rounded-full"
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    {filteredFaqs.length > 0 ? (
                        <div className="grid gap-4">
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {filteredFaqs.map((faq, index) => (
                                    <AccordionItem 
                                        key={faq.id} 
                                        value={faq.id} 
                                        className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl px-6 data-[state=open]:border-primary/30 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5 transition-all duration-300"
                                    >
                                        <AccordionTrigger className="hover:no-underline py-5 text-left">
                                            <div className="flex items-center gap-4 text-left">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                                    {index + 1}
                                                </span>
                                                <span className="font-bold text-lg">{faq.question}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 pt-0 pl-10">
                                            <p className="text-muted-foreground leading-relaxed text-base">
                                                {faq.answer}
                                            </p>
                                            {/* Optional: Add related link or subtle action */}
                                            <div className="mt-4 pt-4 border-t border-dashed border-border flex items-center gap-2 text-sm font-medium text-primary cursor-pointer hover:underline">
                                                <Sparkles className="w-3.5 h-3.5" />
                                                <span>Learn more in our documentation</span>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
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
                    <Button 
                        size="lg" 
                        className="rounded-full font-bold shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
                    >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Chat with Support
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
