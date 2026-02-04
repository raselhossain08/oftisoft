"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Rocket, Crown, ArrowRight, Zap, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCreative } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-creative";

const packages = [
    {
        id: "starter",
        name: "Starter",
        icon: Rocket,
        description: "Perfect for small businesses getting started.",
        price: 1499,
        monthlyPrice: 199,
        tag: "Best for Startups",
        gradient: "from-blue-600/20 to-cyan-600/20",
        border: "border-blue-500/20",
        features: ["5 Page Website", "Contact Form", "Basic SEO", "Mobile Responsive", "1 Month Support"]
    },
    {
        id: "pro",
        name: "Professional",
        icon: Sparkles,
        description: "Comprehensive solution for growing companies.",
        price: 3999,
        monthlyPrice: 499,
        tag: "Most Popular",
        highlight: true,
        gradient: "from-purple-600/20 to-pink-600/20",
        border: "border-purple-500/50",
        features: ["10 Page Website", "CMS Integration", "Advanced SEO", "Blog Section", "Social Media Feed", "3 Months Support"],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        icon: Crown,
        description: "Custom built solutions for large scale needs.",
        price: "Custom",
        monthlyPrice: "Custom",
        tag: "Full Scale",
        gradient: "from-orange-600/20 to-red-600/20",
        border: "border-orange-500/20",
        features: ["Unlimited Pages", "E-commerce Store", "Custom Web App", "Database Integration", "User Auth System", "Dedicated Manager"]
    }
];

export default function ServicePackages() {
    const [billing, setBilling] = useState<'one-time' | 'monthly'>('one-time');

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-16 space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold"
                    >
                        <Zap className="w-4 h-4" />
                        <span>Pricing Plans</span>
                    </motion.div>
                    
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Choose Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Trajectory</span>
                    </h2>
                    
                    {/* Billing Toggle */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <span className={cn("text-sm font-medium transition-colors", billing === 'one-time' ? "text-foreground" : "text-muted-foreground")}>One-time Payment</span>
                        <button 
                            onClick={() => setBilling(b => b === 'one-time' ? 'monthly' : 'one-time')}
                            className="w-14 h-8 rounded-full bg-card border border-border relative flex items-center p-1 cursor-pointer hover:border-primary/50 transition-colors"
                        >
                            <motion.div 
                                className="w-6 h-6 rounded-full bg-primary shadow-sm"
                                animate={{ x: billing === 'one-time' ? 0 : 24 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                        <span className={cn("text-sm font-medium transition-colors", billing === 'monthly' ? "text-foreground" : "text-muted-foreground")}>Monthly Retainer</span>
                    </div>
                </div>

                {/* Mobile Slider */}
                <div className="lg:hidden">
                    <Swiper
                        modules={[Pagination, EffectCreative]}
                        effect={'creative'}
                        creativeEffect={{
                            prev: { shadow: true, translate: [0, 0, -400] },
                            next: { translate: ['100%', 0, 0] },
                        }}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={1.1}
                        spaceBetween={20}
                        pagination={{ clickable: true }}
                        className="pb-12"
                    >
                        {packages.map((pkg) => (
                            <SwiperSlide key={pkg.id}>
                                <div className="h-full">
                                    <PricingCard pkg={pkg} billing={billing} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Desktop Grid */}
                <div className="hidden lg:grid grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <PricingCard pkg={pkg} billing={billing} />
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

function PricingCard({ pkg, billing }: { pkg: any, billing: 'one-time' | 'monthly' }) {
    const isCustom = typeof pkg.price === 'string';
    const priceDisplay = isCustom ? pkg.price : (billing === 'one-time' ? `$${pkg.price.toLocaleString()}` : `$${pkg.monthlyPrice}`);
    const period = isCustom ? '' : (billing === 'one-time' ? '' : '/mo');

    return (
        <div className={cn(
            "relative h-full flex flex-col p-8 rounded-[2rem] bg-card/40 backdrop-blur-md border transition-all duration-300 group hover:-translate-y-2",
            pkg.highlight ? "border-primary/50 shadow-2xl shadow-primary/10" : "border-border hover:border-primary/30"
        )}>
             {/* Gradient Background */}
             <div className={cn("absolute inset-0 rounded-[2rem] bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", pkg.gradient)} />
             
             {/* Highlight Badge */}
             {pkg.highlight && (
                <div className="absolute top-0 right-0 p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-lg shadow-primary/20">
                        Most Popular
                    </span>
                </div>
             )}

            <div className="relative z-10 flex-1">
                <div className={cn("inline-flex p-3 rounded-2xl bg-background border border-border mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm", pkg.highlight && "border-primary/20 bg-primary/5")}>
                    <pkg.icon className={cn("w-6 h-6", pkg.highlight ? "text-primary" : "text-muted-foreground")} />
                </div>

                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm mb-6 h-10">{pkg.description}</p>

                <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                        <motion.span 
                            key={priceDisplay}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
                        >
                            {priceDisplay}
                        </motion.span>
                        <span className="text-muted-foreground font-medium">{period}</span>
                    </div>
                     {billing === 'monthly' && !isCustom && (
                        <p className="text-xs text-primary mt-2 font-medium bg-primary/10 inline-block px-2 py-1 rounded">Includes ongoing maintenance</p>
                    )}
                </div>

                <div className="space-y-4 mb-8">
                    {pkg.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                            <div className={cn("mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", pkg.highlight ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                                <Check className="w-3 h-3" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 pt-6">
                <Link href="/#contact" className={cn(
                    "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300",
                    pkg.highlight 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/25" 
                        : "bg-background border border-border hover:bg-muted hover:border-primary/30"
                )}>
                    Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
