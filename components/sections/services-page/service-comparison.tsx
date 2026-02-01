
"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
    "Custom Design",
    "SEO Optimization",
    "CMS Integration",
    "E-commerce Functionality",
    "API Integration",
    "Database Setup",
    "Maintenance",
    "Source Code"
];

const tiers = [
    { name: "Basic", price: "$999", color: "text-muted-foreground", features: [true, true, true, false, false, false, "1 Month", false] },
    { name: "Pro", price: "$2,499", color: "text-primary", highlight: true, features: [true, true, true, true, true, true, "3 Months", true] },
    { name: "Enterprise", price: "Custom", color: "text-secondary", features: [true, true, true, true, true, true, "12 Months", true] },
];

export default function ServiceComparison() {
    return (
        <section className="py-24 bg-card/30">
            <div className="container px-4 mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Compare Plans</h2>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                            <tr>
                                <th className="p-6 text-left w-1/4">Features</th>
                                {tiers.map((tier) => (
                                    <th key={tier.name} className={cn("p-6 text-center w-1/4 align-bottom", tier.highlight && "bg-primary/5 rounded-t-xl border-t border-x border-primary/20 relative")}>
                                        {tier.highlight && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                                        )}
                                        <h3 className={cn("text-xl font-bold mb-2", tier.color)}>{tier.name}</h3>
                                        <p className="text-2xl font-bold text-foreground">{tier.price}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature, featureIndex) => (
                                <tr key={feature} className="border-b border-border hover:bg-muted/30 transition-colors">
                                    <td className="p-6 font-medium text-muted-foreground">{feature}</td>
                                    {tiers.map((tier, tierIndex) => (
                                        <td key={tierIndex} className={cn("p-6 text-center", tier.highlight && "bg-primary/5 border-x border-primary/20")}>
                                            <div className="flex justify-center">
                                                {typeof tier.features[featureIndex] === 'boolean' ? (
                                                    tier.features[featureIndex] ? (
                                                        <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}>
                                                            <Check className="w-6 h-6 text-green-500" />
                                                        </motion.div>
                                                    ) : (
                                                        <X className="w-6 h-6 text-muted-foreground/30" />
                                                    )
                                                ) : (
                                                    <span className="font-bold text-foreground">{tier.features[featureIndex]}</span>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {/* Action Buttons Row */}
                            <tr>
                                <td className="p-6"></td>
                                {tiers.map((tier, i) => (
                                    <td key={i} className={cn("p-6 text-center", tier.highlight && "bg-primary/5 rounded-b-xl border-b border-x border-primary/20")}>
                                        <button className={cn(
                                            "w-full py-3 rounded-lg font-bold transition-all",
                                            tier.highlight
                                                ? "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-primary/25"
                                                : "bg-muted hover:bg-muted/80 text-foreground"
                                        )}>
                                            Choose {tier.name}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
