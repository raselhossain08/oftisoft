
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, Loader2, TimerReset } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const forgotSchema = z.object({
    email: z.string().email("Please enter a valid email"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
    const [step, setStep] = useState<"input" | "success">("input");
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema),
    });

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === "success" && countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        } else if (countdown === 0) {
            setCanResend(true);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const onSubmit = async (data: ForgotFormData) => {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API
        setStep("success");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-secondary" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="inline-block text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
                        Ofitsoft
                    </Link>
                </div>

                <motion.div
                    layout
                    className="bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {step === "input" ? (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                        <TimerReset className="w-8 h-8" />
                                    </div>
                                    <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
                                    <p className="text-muted-foreground text-sm">
                                        No worries! Enter your email and we'll send you reset instructions.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                            <input
                                                {...register("email")}
                                                type="email"
                                                placeholder="name@company.com"
                                                className={cn(
                                                    "w-full pl-12 pr-4 py-3 rounded-xl bg-muted/30 border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20",
                                                    errors.email ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                                                )}
                                            />
                                        </div>
                                        {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
                                >
                                    <Mail className="w-10 h-10" />
                                </motion.div>

                                <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                                <p className="text-muted-foreground text-sm mb-6">
                                    We sent a password reset link to <br />
                                    <span className="font-bold text-foreground">your email address</span>
                                </p>

                                <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left space-y-3">
                                    <p className="text-xs font-bold uppercase text-muted-foreground">Next Steps:</p>
                                    <ul className="text-sm space-y-2">
                                        <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex gap-2">
                                            <span className="text-primary">•</span> Click the link in the email
                                        </motion.li>
                                        <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex gap-2">
                                            <span className="text-primary">•</span> Enter your new password
                                        </motion.li>
                                        <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex gap-2">
                                            <span className="text-primary">•</span> Log in with new credentials
                                        </motion.li>
                                    </ul>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        className="text-sm text-muted-foreground hover:text-primary disabled:opacity-50"
                                        disabled={!canResend}
                                        onClick={() => { setCountdown(60); setCanResend(false); }}
                                    >
                                        {canResend ? "Result Email" : `Resend in 00:${countdown.toString().padStart(2, '0')}`}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <Link href="/dashboard/login" className="text-sm font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-2 group transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Login
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
