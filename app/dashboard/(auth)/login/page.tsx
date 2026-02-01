
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Clock, Brain, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Types & Schema ---

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    remember: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

// --- Mock Data ---

const testimonials = [
    { quote: "Ofitsoft transformed our workflow completely. The real-time updates are a game changer.", author: "Sarah Jenkins", role: "CTO, TechFlow", stars: 5 },
    { quote: "The best dashboard experience we've ever had. Scalable, fast, and beautiful.", author: "Michael Chen", role: "Product Lead, Innovate", stars: 5 },
    { quote: "Support is top-notch. They helped us integrate our AI models in record time.", author: "Elena Rodriguez", role: "Founder, AI Labs", stars: 5 },
];

const features = [
    { icon: ShieldCheck, text: "Secure File Sharing" },
    { icon: Clock, text: "24/7 Support Access" },
    { icon: Brain, text: "AI-Powered Insights" },
];

import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Testimonial Carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        setIsSuccess(true);

        // Final destination: Dashboard
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex">

            {/* LEFT SIDE - HERO (60%) */}
            <div className="hidden lg:flex w-[60%] relative bg-[#030712] overflow-hidden flex-col justify-between p-16">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-[#030712] to-[#030712]" />
                    <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/20 via-[#030712] to-[#030712]" />

                    {/* Floating Code Snippets Decoration */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 right-20 w-64 h-40 bg-card/10 backdrop-blur-md rounded-lg border border-white/5 p-4 transform rotate-6"
                    >
                        <div className="h-2 w-20 bg-primary/40 rounded mb-2" />
                        <div className="space-y-2 opacity-30">
                            <div className="h-2 w-full bg-white/20 rounded" />
                            <div className="h-2 w-3/4 bg-white/20 rounded" />
                            <div className="h-2 w-1/2 bg-white/20 rounded" />
                        </div>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                    {/* Logo */}
                    <div>
                        <Link href="/" className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Ofitsoft
                        </Link>
                        <p className="text-muted-foreground mt-2">Premium Software Solutions</p>
                    </div>

                    {/* Testimonials */}
                    <div className="max-w-xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTestimonial}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonials[currentTestimonial].stars)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <span className="text-yellow-500">★</span>
                                        </motion.div>
                                    ))}
                                </div>
                                <h3 className="text-2xl font-medium text-white mb-6 leading-relaxed">
                                    "{testimonials[currentTestimonial].quote}"
                                </h3>
                                <div>
                                    <p className="font-bold text-white">{testimonials[currentTestimonial].author}</p>
                                    <p className="text-muted-foreground">{testimonials[currentTestimonial].role}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Features List */}
                    <div className="flex gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                <div className="p-2 rounded-full bg-white/5 border border-white/10 text-primary">
                                    <feature.icon className="w-4 h-4" />
                                </div>
                                <span>{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - FORM (40%) */}
            <div className="w-full lg:w-[40%] bg-background flex items-center justify-center p-8 relative">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground">Sign in to your dashboard to manage projects.</p>
                    </div>

                    {isSuccess ? (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex flex-col items-center justify-center py-12 text-center"
                        >
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Login Successful!</h2>
                            <p className="text-muted-foreground">Redirecting to dashboard...</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email Field */}
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

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-sm font-medium">Password</label>
                                    <Link href="/dashboard/forgot-password" className="text-xs text-primary hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <input
                                        {...register("password")}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className={cn(
                                            "w-full pl-12 pr-12 py-3 rounded-xl bg-muted/30 border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20",
                                            errors.password ? "border-red-500 focus:border-red-500" : "border-border focus:border-primary"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2 ml-1">
                                <input type="checkbox" id="remember" {...register("remember")} className="rounded border-gray-600 bg-muted text-primary focus:ring-primary" />
                                <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me for 30 days</label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            {/* Social Login */}
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                                    {/* Google Icon SVG */}
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    <span className="font-medium text-sm">Google</span>
                                </button>
                                <button type="button" className="flex items-center justify-center gap-2 py-3 border border-border rounded-xl hover:bg-muted/50 transition-colors">
                                    {/* Apple Icon SVG */}
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M17.5 12.6c0-2.4 2-3.6 2.1-3.7-.2-.6-.5-1.3-.9-1.9-1.1-1.6-3-1.8-3.6-1.8-1.6-.1-3 .9-3.8 .9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.6 1.3 10.1 .9 1.3 1.9 2.7 3.3 2.7 1.3 0 1.8-.8 3.4-.8 1.6 0 2 .8 3.4 .8 1.4 0 2.4-1.3 3.3-2.6 1-1.5 1.5-2.9 1.5-3-.1 0-2.9-1.1-2.9-4.3zM12.8 4.4c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3 .7-3 1.5-.6 .8-1.2 2.1-1.1 3.2 1.1 .2 2.4-.6 3-1.4z" />
                                    </svg>
                                    <span className="font-medium text-sm">Apple</span>
                                </button>
                            </div>

                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link href="/dashboard/register" className="text-primary font-bold hover:underline flex items-center justify-center gap-1 inline-flex">
                                    create one now <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>

        </div>
    );
}
