"use client";

import { motion } from "framer-motion";
import { Check, CheckCircle2, Zap, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const SUBSCRIPTION_PLANS = [
    {
        name: "Starter",
        price: "$0",
        period: "/mo",
        description: "Perfect for hobbyists and personal projects.",
        features: ["1 Project", "Basic Analytics", "Community Support", "500MB Storage"]
    },
    {
        name: "Pro",
        price: "$29",
        period: "/mo",
        description: "For professionals requiring more power.",
        features: ["Unlimited Projects", "Advanced Analytics", "Priority Support", "10GB Storage", "AI Assistant"],
        recommended: true
    },
    {
        name: "Business",
        price: "$99",
        period: "/mo",
        description: "Complete solution for growing teams.",
        features: ["Dedicated Team", "Custom Integrations", "SLA Guarantee", "1TB Storage", "24/7 Phone Support", "Audit Logs"]
    }
];

export default function SubscriptionPage() {
    return (
        <div className=" mx-auto py-10 space-y-12">
            
            <div className="flex items-center gap-4">
                <Link href="/dashboard/billing" className="p-2 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Upgrade Plan</h1>
                    <p className="text-muted-foreground">Unlock the full potential of your dashboard.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SUBSCRIPTION_PLANS.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "relative p-8 rounded-[2.5rem] border flex flex-col transition-all duration-300",
                            plan.recommended 
                                ? "bg-gradient-to-b from-[#1a1f35] to-card border-primary ring-2 ring-primary/20 shadow-2xl shadow-primary/10 scale-105 z-10" 
                                : "bg-card border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-1"
                        )}
                    >
                        {plan.recommended && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-white" /> Recommended
                            </div>
                        )}

                        <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground mb-6 h-10">{plan.description}</p>
                        
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-4xl font-black">{plan.price}</span>
                            <span className="text-muted-foreground font-medium">{plan.period}</span>
                        </div>

                        <div className="space-y-4 mb-8 flex-1">
                            {plan.features.map(feat => (
                                <div key={feat} className="flex items-start gap-3 text-sm">
                                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 text-green-500 mt-0.5">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-muted-foreground">{feat}</span>
                                </div>
                            ))}
                        </div>

                        <button className={cn(
                            "w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2",
                            plan.recommended
                                ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 hover:scale-[1.02]"
                                : "bg-muted text-foreground hover:bg-muted/80"
                        )}>
                            {plan.recommended ? "Upgrade to Pro" : "Choose " + plan.name}
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="bg-muted/10 border border-border rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Enterprise Security</h3>
                        <p className="text-sm text-muted-foreground">SSO, Audit Logs, and extensive compliance for large teams.</p>
                    </div>
                </div>
                <button className="px-6 py-3 border border-border bg-card rounded-xl font-bold hover:bg-muted transition-colors">
                    Contact Sales
                </button>
            </div>

        </div>
    );
}
