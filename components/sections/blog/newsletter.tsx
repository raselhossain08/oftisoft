"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles, Zap, Code2, Rocket } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.includes("@")) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 2000);
            return;
        }

        setStatus('loading');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setStatus('success');
        confetti({
            particleCount: 150,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#3b82f6', '#8b5cf6', '#10b981'] // Custom brand colors
        });
        
        setTimeout(() => {
            setEmail("");
            setStatus('idle');
        }, 3000);
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-background">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                
                {/* Glowing Orbs */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
            </div>

            <div className="container px-4 mx-auto relative z-10">
                <div className="relative max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-card/30 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl">
                    
                    {/* Decorative Grid */}
                    <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                    <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-12 lg:p-16 items-center">
                        
                        {/* Text Content */}
                        <div className="text-center lg:text-left">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Weekly Tech Insights</span>
                                </div>
                                
                                <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                                    Join the <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Innovation</span>
                                </h2>
                                
                                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                                    Get the latest articles on 
                                    <span className="text-foreground font-medium"> AI</span>, 
                                    <span className="text-foreground font-medium"> Next.js</span>, and 
                                    <span className="text-foreground font-medium"> Cloud Architecture</span>. 
                                    Join 15,000+ developers leveling up their skills.
                                </p>

                                <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
                                    {[
                                        { icon: Zap, label: "Zero Spam" },
                                        { icon: Code2, label: "Code Snippets" },
                                        { icon: Rocket, label: "Early Access" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-foreground/80 bg-background/50 px-3 py-1.5 rounded-lg border border-border/50">
                                            <item.icon className="w-4 h-4 text-primary" />
                                            <span>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Form Section */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="bg-background/80 backdrop-blur-md border border-border rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden group">
                                {/* Border Gradient Animation */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                                <div className="text-center mb-6">
                                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25">
                                        <Mail className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold">Subscribe to Newsletter</h3>
                                </div>

                                <form onSubmit={handleSubscribe} className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="developer@example.com"
                                            value={email}
                                            disabled={status === 'loading' || status === 'success'}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (status === 'error') setStatus('idle');
                                            }}
                                            className={cn(
                                                "w-full px-5 py-4 rounded-xl bg-muted/50 border outline-none text-foreground placeholder:text-muted-foreground transition-all",
                                                status === 'error' 
                                                    ? "border-red-500/50 bg-red-500/5 focus:ring-2 focus:ring-red-500/20" 
                                                    : "border-border focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
                                            )}
                                        />
                                        <AnimatePresence>
                                            {status === 'error' && (
                                                <motion.div 
                                                    initial={{ opacity: 0, x: 10 }} 
                                                    animate={{ opacity: 1, x: 0 }} 
                                                    exit={{ opacity: 0 }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
                                                >
                                                    <AlertCircle className="w-5 h-5" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === 'loading' || status === 'success'}
                                        className={cn(
                                            "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all relative overflow-hidden",
                                            status === 'success' 
                                                ? "bg-green-500 text-white hover:bg-green-600" 
                                                : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                                        )}
                                    >
                                        <AnimatePresence mode="wait">
                                            {status === 'loading' ? (
                                                <motion.div 
                                                    key="loading" 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                >
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                </motion.div>
                                            ) : status === 'success' ? (
                                                <motion.div 
                                                    key="success" 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                    <span>Subscribed!</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    key="idle" 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span>Subscribe Now</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                    
                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        We respect your privacy. Unsubscribe at any time.
                                    </p>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
