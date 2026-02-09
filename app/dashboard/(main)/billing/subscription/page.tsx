"use client";

import { motion } from "framer-motion";
import { Check, CheckCircle2, Zap, Shield, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    const { subscription, isLoading, updateSubscription } = useSubscription();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handlePlanSelect = (planName: string) => {
        if (subscription?.plan === planName) {
            toast.info(`You are already on the ${planName} plan.`);
            return;
        }
        setSelectedPlan(planName);
        setIsConfirmOpen(true);
    };

    const handleConfirmUpgrade = async () => {
        if (selectedPlan) {
            const toastId = toast.loading(`Provisioning ${selectedPlan} infrastructure...`, {
                description: "Reconfiguring global cluster nodes and expanding storage."
            });
            
            try {
                await updateSubscription(selectedPlan);
                toast.success(`${selectedPlan} Tier successfully deployed`, {
                    id: toastId,
                    description: "Your new computational capacity is now online."
                });
                setIsConfirmOpen(false);
                setSelectedPlan(null);
            } catch (error) {
                toast.error("Provisioning failed", {
                    id: toastId,
                    description: "Rolling back changes. Please try again."
                });
            }
        }
    };

    const handleContactSales = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1500)),
            {
                loading: 'Connecting to enterprise solutions architect...',
                success: 'Request sent! We will contact you within 2 hours.',
                error: 'Connection failed. Please check your network.',
            }
        );
    };

    return (
        <div className="mx-auto py-10 space-y-12">
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/settings/billing" className="p-2 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">System Tier</h1>
                        <p className="text-muted-foreground">Select the computational power that fits your workflow.</p>
                    </div>
                </div>

                {subscription && (
                    <div className="px-5 py-2.5 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-bold">Current: <span className="text-primary">{subscription.plan}</span></span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {SUBSCRIPTION_PLANS.map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "relative p-8 rounded-[2.5rem] border flex flex-col transition-all duration-500 group",
                            plan.recommended 
                                ? "bg-gradient-to-b from-primary/[0.05] to-card border-primary ring-2 ring-primary/20 shadow-2xl shadow-primary/10 scale-105 z-10" 
                                : "bg-card border-border hover:border-primary/30 hover:shadow-xl hover:-translate-y-2",
                            subscription?.plan === plan.name && "border-green-500/50 bg-green-500/[0.02]"
                        )}
                    >
                        {plan.recommended && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 fill-white" /> Power Choice
                            </div>
                        )}

                        {subscription?.plan === plan.name && (
                            <div className="absolute top-0 right-8 -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide shadow-lg">
                                Active
                            </div>
                        )}

                        <h3 className="text-2xl font-black mb-2">{plan.name}</h3>
                        <p className="text-sm text-muted-foreground mb-8 h-10 leading-relaxed">{plan.description}</p>
                        
                        <div className="flex items-baseline gap-1 mb-10">
                            <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                            <span className="text-muted-foreground font-bold text-lg opacity-50">{plan.period}</span>
                        </div>

                        <div className="space-y-4 mb-10 flex-1">
                            {plan.features.map(feat => (
                                <div key={feat} className="flex items-center gap-3 text-sm font-medium">
                                    <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                                        <Check className="w-3 h-3 stroke-[3px]" />
                                    </div>
                                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{feat}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            disabled={isLoading || subscription?.plan === plan.name}
                            onClick={() => handlePlanSelect(plan.name)}
                            className={cn(
                                "w-full h-14 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300",
                                plan.recommended
                                    ? "bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/30 hover:shadow-primary/40"
                                    : "bg-muted text-foreground hover:bg-muted/80",
                                subscription?.plan === plan.name && "bg-green-500/10 text-green-600 border-2 border-green-500/20"
                            )}
                        >
                            {isLoading && selectedPlan === plan.name ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : subscription?.plan === plan.name ? (
                                "Current Tier"
                            ) : plan.recommended ? (
                                "Switch to Pro"
                            ) : (
                                "Select " + plan.name
                            )}
                        </Button>
                    </motion.div>
                ))}
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-card/50 backdrop-blur-xl border border-primary/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-primary/5"
            >
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary shadow-inner">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="font-black text-2xl tracking-tight">Enterprise Infrastructure</h3>
                        <p className="text-muted-foreground font-medium max-w-md">Quantum-ready security, dedicated throughput, and global compliance for high-scale operations.</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    size="lg"
                    className="rounded-2xl h-14 px-10 font-black border-border/50 bg-background hover:bg-muted transition-all uppercase tracking-widest text-xs"
                    onClick={handleContactSales}
                >
                    Contact Fleet Support
                </Button>
            </motion.div>

            {/* Confirm Upgrade Dialog */}
            <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] border-border/50">
                    <DialogHeader>
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                            <Zap className="w-7 h-7 text-primary" />
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tighter">Confirm Tier Upgrade</DialogTitle>
                        <DialogDescription className="text-lg">
                            You are about to switch your computational tier to <span className="text-primary font-bold">{selectedPlan}</span>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                        <div className="p-6 rounded-3xl bg-muted/20 border border-border/50">
                            <p className="text-xs uppercase font-bold text-muted-foreground mb-2">UPGRADE SUMMARY</p>
                            <div className="flex justify-between items-center bg-background p-4 rounded-2xl border border-border/50">
                                <span className="font-bold text-muted-foreground">Monthly Billing</span>
                                <span className="text-xl font-black text-primary">
                                    {SUBSCRIPTION_PLANS.find(p => p.name === selectedPlan)?.price}
                                </span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground italic px-2">
                            Note: Subscription changes are processed immediately. Any remaining credit from your current tier will be pro-rated.
                        </p>
                    </div>
                    <DialogFooter className="gap-3 sm:gap-0">
                        <Button variant="ghost" className="rounded-xl h-auto font-bold flex-1" onClick={() => setIsConfirmOpen(false)}>
                            Abort
                        </Button>
                        <Button 
                            className="rounded-xl h-auto px-8 font-black flex-1 shadow-lg shadow-primary/20"
                            onClick={handleConfirmUpgrade}
                        >
                            Authorize Provisioning
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}
