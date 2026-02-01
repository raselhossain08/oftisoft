
"use client";

import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CTA() {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');
        // Simulate API call
        setTimeout(() => {
            setFormState('success');
        }, 1500);
    };

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-background">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-pulse-slow" />
                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--border)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-10" />
            </div>

            <div className="container px-4 mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div className="max-w-xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold text-foreground mb-6"
                        >
                            Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Transform</span> Your Business?
                        </motion.h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Let's build something extraordinary together. Schedule a free consultation to discuss your project.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="font-bold text-lg">1</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Initial Consultation</h4>
                                    <p className="text-sm text-muted-foreground">We discuss your vision and requirements.</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                    <span className="font-bold text-lg">2</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Project Proposal</h4>
                                    <p className="text-sm text-muted-foreground">We provide a detailed plan and timeline.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-card border border-border p-8 rounded-3xl shadow-2xl relative"
                    >
                        {formState === 'success' ? (
                            <div className="h-[400px] flex flex-col items-center justify-center text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500"
                                >
                                    <CheckCircle2 className="w-10 h-10" />
                                </motion.div>
                                <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                <p className="text-muted-foreground">We'll get back to you within 24 hours.</p>
                                <button
                                    onClick={() => setFormState('idle')}
                                    className="mt-8 text-primary hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">First Name</label>
                                        <input required type="text" className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">Last Name</label>
                                        <input required type="text" className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Email Address</label>
                                    <input required type="email" className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50" placeholder="john@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Message</label>
                                    <textarea required rows={4} className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 resize-none" placeholder="Tell us about your project..." />
                                </div>

                                <button
                                    disabled={formState === 'submitting'}
                                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg hover:shadow-primary/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {formState === 'submitting' ? (
                                        <span>Sending...</span>
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
