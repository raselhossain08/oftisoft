"use client";

import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, Shield, Crown, HelpCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const features = [
    { name: "Custom Design", tooltip: "Tailored UI/UX specifically for your brand" },
    { name: "SEO Optimization", tooltip: "Advanced technical SEO setup" },
    { name: "CMS Integration", tooltip: "Easy content management" },
    { name: "E-commerce", tooltip: "Full shopping cart & checkout" },
    { name: "API Integration", tooltip: "Connect 3rd party services" },
    { name: "Database Setup", tooltip: "Scalable data architecture" },
    { name: "Maintenance", tooltip: "Ongoing support duration" },
    { name: "Source Code", tooltip: "Full ownership of codebase" }
];

const tiers = [
    { 
        id: "starter",
        name: "Starter", 
        price: "$2,999", 
        description: "Perfect for landing pages and small business sites.",
        icon: Zap,
        color: "text-blue-500", 
        highlight: false, 
        features: [true, true, true, false, false, false, "1 Month", false],
        btnVariant: "outline"
    },
    { 
        id: "growth",
        name: "Growth", 
        price: "$5,499", 
        description: "Ideal for growing startups and e-commerce brands.",
        icon: Sparkles,
        color: "text-purple-500", 
        highlight: true, 
        features: [true, true, true, true, true, true, "3 Months", true],
        btnVariant: "solid"
    },
    { 
        id: "enterprise",
        name: "Enterprise", 
        price: "Custom", 
        description: "Full-scale solution for large organizations.",
        icon: Crown,
        color: "text-orange-500", 
        highlight: false, 
        features: [true, true, true, true, true, true, "12 Months", true],
        btnVariant: "outline"
    },
];

export default function ServiceComparison() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Compare Plans</h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Transparent pricing with no hidden fees. Choose the plan that fits your scale.
                    </p>
                </div>

                {/* Mobile View: Cards Carousel */}
                <div className="lg:hidden">
                    <Swiper
                        modules={[Pagination]}
                        spaceBetween={20}
                        slidesPerView={1.1}
                        centeredSlides={true}
                        pagination={{ clickable: true }}
                        className="pb-12"
                    >
                        {tiers.map((tier) => (
                            <SwiperSlide key={tier.name}>
                                <div className={cn(
                                    "bg-card border rounded-3xl p-8 relative overflow-hidden",
                                    tier.highlight ? "border-primary shadow-2xl shadow-primary/10" : "border-border"
                                )}>
                                    {tier.highlight && (
                                        <div className="absolute top-0 right-0 bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-primary/20">
                                            MOST POPULAR
                                        </div>
                                    )}
                                    <div className="mb-6">
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-muted", tier.color)}>
                                            <tier.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-2xl font-bold">{tier.name}</h3>
                                        <p className="text-3xl font-bold mt-2">{tier.price}</p>
                                        <p className="text-muted-foreground text-sm mt-2">{tier.description}</p>
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        {features.map((feature, i) => (
                                            <div key={feature.name} className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">{feature.name}</span>
                                                {typeof tier.features[i] === 'boolean' ? (
                                                    tier.features[i] ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-muted-foreground/30" />
                                                ) : (
                                                    <span className="font-bold">{tier.features[i]}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <Link href="/#contact" className={cn(
                                        "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                                        tier.highlight ? "bg-primary text-white" : "bg-muted text-foreground"
                                    )}>
                                        Choose {tier.name}
                                    </Link>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Desktop View: Table */}
                <div className="hidden lg:block overflow-hidden rounded-3xl border border-border bg-card/30 backdrop-blur-md shadow-2xl">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="p-8 text-left w-1/4 bg-card/50 backdrop-blur-md sticky left-0 z-20">
                                    <span className="text-lg font-bold">Features</span>
                                </th>
                                {tiers.map((tier) => (
                                    <th key={tier.name} className={cn(
                                        "p-8 text-left w-1/4 align-top relative transition-colors duration-300",
                                        tier.highlight ? "bg-primary/5" : "bg-transparent"
                                    )}>
                                        <div className="flex flex-col h-full justify-between gap-6">
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className={cn("inline-flex p-2 rounded-lg bg-background border border-border", tier.color)}>
                                                        <tier.icon className="w-5 h-5" />
                                                    </div>
                                                    {tier.highlight && (
                                                        <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold border border-primary/20">
                                                            POPULAR
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-bold tracking-tight">{tier.price}</span>
                                                    {tier.price !== 'Custom' && <span className="text-muted-foreground text-sm font-normal">/project</span>}
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                                                    {tier.description}
                                                </p>
                                            </div>
                                            
                                            <Link href="/#contact" className={cn(
                                                "w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]",
                                                tier.highlight 
                                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25" 
                                                    : "bg-background border border-border hover:bg-muted"
                                            )}>
                                                Get Started <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {features.map((feature, featureIndex) => (
                                <tr key={feature.name} className="group hover:bg-muted/30 transition-colors">
                                    <td className="p-6 text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        {feature.name}
                                        <div className="group/tooltip relative">
                                            <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
                                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg border border-border shadow-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none w-48 z-50">
                                                {feature.tooltip}
                                            </div>
                                        </div>
                                    </td>
                                    {tiers.map((tier, tierIndex) => (
                                        <td key={tierIndex} className={cn(
                                            "p-6 text-center transition-colors",
                                            tier.highlight ? "bg-primary/5 group-hover:bg-primary/10" : ""
                                        )}>
                                            <div className="flex justify-start pl-4 align-middle h-full">
                                                {typeof tier.features[featureIndex] === 'boolean' ? (
                                                    tier.features[featureIndex] ? (
                                                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-green-500" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 flex items-center justify-center">
                                                            <MinusIcon className="w-4 h-4 text-muted-foreground/30" />
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="font-bold text-foreground bg-muted/50 px-3 py-1 rounded-md text-sm border border-border">
                                                        {tier.features[featureIndex]}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

function MinusIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.25 7.5H12.75" stroke="currentColor" strokeLinecap="square" />
        </svg>
    );
}
