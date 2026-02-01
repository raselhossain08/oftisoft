
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes("@")) {
            setStatus('error');
            return;
        }

        setStatus('success');
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-secondary/10" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="max-w-4xl mx-auto bg-card border border-border rounded-3xl p-8 md:p-16 shadow-2xl text-center">

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 text-primary"
                    >
                        <Mail className="w-10 h-10" />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Stay Ahead of the Curve</h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Get the latest tech trends, development tips, and insights delivered directly to your inbox. No spam, just value.
                    </p>

                    <form onSubmit={handleSubscribe} className="max-w-md mx-auto relative">
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (status === 'error') setStatus('idle');
                                }}
                                className={`w-full pl-6 pr-32 py-4 rounded-full bg-background border ${status === 'error' ? 'border-red-500 bg-red-500/5' : 'border-border'} focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-lg`}
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 px-6 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                            >
                                Subscribe
                            </button>
                        </div>

                        {/* Status Messages */}
                        <div className="absolute top-full left-0 w-full mt-2">
                            {status === 'success' && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center text-green-500 text-sm font-medium">
                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Subscribed successfully!
                                </motion.div>
                            )}
                            {status === 'error' && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center text-red-500 text-sm font-medium">
                                    <AlertCircle className="w-4 h-4 mr-1" /> Please enter a valid email.
                                </motion.div>
                            )}
                        </div>
                    </form>

                    <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <input type="checkbox" id="privacy" className="rounded border-border bg-muted text-primary focus:ring-primary" required />
                        <label htmlFor="privacy">I agree to the <a href="#" className="underline hover:text-primary">Privacy Policy</a></label>
                    </div>

                </div>
            </div>
        </section>
    );
}
