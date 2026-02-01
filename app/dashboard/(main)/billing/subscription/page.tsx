
"use client";

import { motion } from "framer-motion";
import { Check, X, Zap, Shield, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PLANS = [
    {
        name: "Starter",
        price: "$0",
        desc: "For individuals and hobbyists.",
        features: ["1 Project", "500MB Storage", "Community Support", "Basic Analytics"],
        missing: ["Team Members", "Custom Domain", "Priority Support"]
    },
    {
        name: "Pro",
        price: "$49",
        period: "/month",
        desc: "For growing teams and startups.",
        popular: true,
        features: ["Unlimited Projects", "100GB Storage", "Priority Email Support", "Advanced Analytics", "5 Team Members"],
        missing: ["SSO & Security", "Dedicated Account Manager"]
    },
    {
        name: "Enterprise",
        price: "Custom",
        desc: "For large organizations.",
        features: ["Unlimited Everything", "1TB+ Storage", "24/7 Phone Support", "Audit Logs", "SSO & SAML", "Dedicated Manager"],
        missing: []
    }
];

export default function SubscriptionPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-8">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Upgrade your plan</h1>
                <p className="text-muted-foreground text-lg mb-8">
                    Choose the perfect plan for your team. Scale up or down at any time.
                </p>

                {/* Toggle */}
                <div className="bg-muted p-1 rounded-xl inline-flex relative">
                    <div
                        className={cn(
                            "absolute top-1 bottom-1 w-[calc(50%-4px)] bg-background rounded-lg shadow-sm transition-all duration-300",
                            billingCycle === "monthly" ? "left-1" : "left-[calc(50%+4px)]"
                        )}
                    />
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={cn("px-6 py-2 text-sm font-bold relative z-10 transition-colors", billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground")}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle("yearly")}
                        className={cn("px-6 py-2 text-sm font-bold relative z-10 transition-colors", billingCycle === "yearly" ? "text-foreground" : "text-muted-foreground")}
                    >
                        Yearly <span className="text-[10px] text-green-500 ml-1 font-extrabold">-20%</span>
                    </button>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PLANS.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "group bg-card border rounded-3xl p-8 relative flex flex-col",
                            plan.popular ? "border-primary shadow-2xl shadow-primary/10" : "border-border hover:border-primary/50 transition-colors shadow-sm"
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="font-bold text-lg mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{plan.desc}</p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {plan.features.map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span>{feat}</span>
                                </div>
                            ))}
                            {plan.missing?.map((feat) => (
                                <div key={feat} className="flex items-center gap-3 text-sm text-muted-foreground/50">
                                    <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center shrink-0">
                                        <X className="w-3 h-3" />
                                    </div>
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                        <button className={cn(
                            "w-full py-4 rounded-xl font-bold transition-all",
                            plan.popular
                                ? "bg-primary text-white hover:bg-primary/90 shadow-lg"
                                : "bg-muted text-foreground hover:bg-muted/80"
                        )}>
                            {plan.name === "Enterprise" ? "Contact Support" : "Get Started"}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-3xl mx-auto pt-10 border-t border-border">
                <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                <div className="grid gap-6">
                    {[
                        { q: "Can I cancel my subscription at any time?", a: "Yes, you can cancel your subscription at any time. Your plan will remain active until the end of the billing period." },
                        { q: "Do you offer a free trial?", a: "We offer a 14-day free trial for our Pro plan. No credit card required." },
                        { q: "How do I upgrade from Starter to Pro?", a: "You can upgrade directly from your billing dashboard. The changes will be applied immediately." }
                    ].map((item, i) => (
                        <div key={i} className="bg-card border border-border p-6 rounded-2xl">
                            <h4 className="font-bold mb-2">{item.q}</h4>
                            <p className="text-muted-foreground text-sm">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
