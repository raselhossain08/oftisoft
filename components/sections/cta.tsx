
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CTA() {
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');
        // Simulate API call
        setTimeout(() => {
            setFormState('success');
            toast.success("Message sent successfully! We'll be in touch soon.");
        }, 2000);
    };

    return (
        <section id="contact" className="py-24 bg-transparent relative overflow-hidden z-10">
            <div className="container px-4 mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
                    
                    {/* Left: Content Info */}
                    <div className="max-w-xl pt-8">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
                        >
                            Let's Build the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Next Big Thing.
                            </span>
                        </motion.h2>

                        <p className="text-xl text-muted-foreground/80 mb-12 leading-relaxed">
                            Have a project in mind? We'd love to hear about it. 
                            Schedule a free 15-min discovery call to discuss your vision.
                        </p>

                        <div className="space-y-6">
                             <ContactItem icon={Mail} title="Email Us" value="hello@ofitsoft.com" delay={0.1} />
                             <ContactItem icon={Phone} title="Call Us" value="+1 (555) 000-0000" delay={0.2} />
                             <ContactItem icon={MapPin} title="HQ" value="San Francisco, CA" delay={0.3} />
                        </div>
                    </div>

                    {/* Right: Modern Glass Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* Glow Behind Form */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[2rem] blur-2xl transform rotate-3 scale-95 -z-10" />

                        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl overflow-hidden relative">
                             {/* Decorative noise */}
                            <div className="absolute inset-0 bg-[url('https://grain-texture-url-here.png')] opacity-[0.05] pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {formState === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="min-h-[420px] flex flex-col items-center justify-center text-center p-8"
                                    >
                                        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500 animate-pulse">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-3">Message Received!</h3>
                                        <p className="text-muted-foreground mb-8 text-lg">
                                            We've sent a confirmation email to your inbox. Expect a reply within 24 hours.
                                        </p>
                                        <button
                                            onClick={() => setFormState('idle')}
                                            className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
                                        >
                                            Send another message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                    >
                                        <div className="grid grid-cols-2 gap-5">
                                            <InputGroup label="First Name" placeholder="Jane" />
                                            <InputGroup label="Last Name" placeholder="Doe" />
                                        </div>
                                        <InputGroup label="Email" type="email" placeholder="jane@example.com" />
                                        
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-white/60 ml-1">Project Details</label>
                                            <textarea 
                                                required 
                                                rows={4} 
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all resize-none"
                                                placeholder="Tell us a bit about your goals..."
                                            />
                                        </div>

                                        <button
                                            disabled={formState === 'submitting'}
                                            className="w-full group mt-4 py-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]"
                                        >
                                            {formState === 'submitting' ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                <>
                                                    Start Conversation
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                        
                                        <p className="text-xs text-center text-muted-foreground mt-4">
                                            By submitting, you agree to our <a href="#" className="underline hover:text-white">Privacy Policy</a>.
                                        </p>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function ContactItem({ icon: Icon, title, value, delay }: { icon: any, title: string, value: string, delay: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="flex items-center gap-6 group cursor-pointer"
        >
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors duration-300">
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-1 group-hover:text-primary transition-colors">{title}</h4>
                <p className="text-lg font-medium text-white">{value}</p>
            </div>
        </motion.div>
    );
}

function InputGroup({ label, type = "text", placeholder }: { label: string, type?: string, placeholder: string }) {
    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/60 ml-1">{label}</label>
            <input 
                required 
                type={type} 
                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                placeholder={placeholder}
            />
        </div>
    );
}
