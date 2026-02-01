
"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const packages = [
    {
        name: "Starter Package",
        description: "Perfect for small businesses getting started.",
        price: "$1,499",
        tag: "Best for Startups",
        color: "bronze", // Custom class trigger
        borderColor: "border-orange-900/50",
        gradient: "from-orange-900/20 to-transparent",
        features: ["5 Page Website", "Contact Form", "Basic SEO", "Mobile Responsive", "1 Month Support"]
    },
    {
        name: "Professional Package",
        description: "Comprehensive solution for growing companies.",
        price: "$3,999",
        tag: "Most Popular",
        color: "silver",
        borderColor: "border-primary/50",
        gradient: "from-primary/20 to-transparent", // Silver looking -> actually Primary for brand
        features: ["10 Page Website", "CMS Integration", "Advanced SEO", "Blog Section", "Social Media Feed", "3 Months Support"],
        highlight: true,
    },
    {
        name: "Enterprise Package",
        description: "Custom built solutions for large scale needs.",
        price: "Custom",
        tag: "Custom Solutions",
        color: "gold",
        borderColor: "border-yellow-600/50",
        gradient: "from-yellow-600/20 to-transparent",
        features: ["Unlimited Pages", "E-commerce Store", "Custom Web App", "Database Integration", "User Auth System", "12 Months Support", "Dedicated Manager"]
    }
];

export default function ServicePackages() {
    return (
        <section className="py-24 bg-background">
            <div className="container px-4 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Select Your Package</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={pkg.highlight ? { y: -15, scale: 1.02 } : { y: -10 }}
                            className={cn(
                                "relative p-8 rounded-2xl bg-card border flex flex-col h-full",
                                pkg.borderColor,
                                pkg.highlight ? "shadow-2xl shadow-primary/10" : "shadow-lg"
                            )}
                        >
                            {/* Background Gradient */}
                            <div className={cn("absolute inset-0 bg-gradient-to-b rounded-2xl opacity-50 pointer-events-none", pkg.gradient)} />

                            {/* Tag */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <span className={cn(
                                    "px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-background",
                                    pkg.highlight ? "text-primary border-primary animate-pulse" : "text-muted-foreground border-border"
                                )}>
                                    {pkg.tag}
                                </span>
                            </div>

                            <div className="text-center mb-8 mt-4 relative z-10">
                                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                                <p className="text-muted-foreground text-sm mb-6 h-10">{pkg.description}</p>
                                <div className="text-4xl font-bold text-foreground">
                                    {pkg.price}
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 flex-1 relative z-10">
                                {pkg.features.map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + (i * 0.05) }}
                                        className="flex items-center text-sm"
                                    >
                                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center mr-3 bg-muted", pkg.highlight ? "text-primary" : "text-muted-foreground")}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span className="text-muted-foreground">{feature}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <button className={cn(
                                "w-full py-4 rounded-xl font-bold transition-all relative z-10",
                                pkg.highlight
                                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/30 transform hover:scale-105"
                                    : "bg-muted text-foreground hover:bg-muted/80"
                            )}>
                                Get Started
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
