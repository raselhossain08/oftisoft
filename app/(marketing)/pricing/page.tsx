"use client";

import { useEffect } from "react";
import { usePageContent } from "@/hooks/usePageContent";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, Zap, Rocket, Shield, Globe, Terminal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { usePricingContentStore } from "@/lib/store/pricing-content";
import { useCart } from "@/hooks/use-cart";

export default function PricingPage() {
    const { pageContent, isLoading } = usePageContent('pricing');
    const setContent = usePricingContentStore((state) => state.setContent);

    useEffect(() => {
        if (pageContent?.content) {
            setContent(pageContent.content);
        }
    }, [pageContent, setContent]);

    const { content } = usePricingContentStore();
    const cart = useCart();

    const handleAddToCart = (plan: any) => {
        const isNumeric = !isNaN(Number(plan.price));
        if (isNumeric) {
             cart.addItem({
                id: `plan-${plan.name}`,
                name: `${plan.name} License`,
                price: Number(plan.price),
                image: '',
                quantity: 1,
                type: 'service'
            });
        }
    };

    if (isLoading && !pageContent) {
// ...
        return (
            <div className="fixed inset-0 bg-[#020202] flex items-center justify-center z-[100]">
                <div className="text-primary font-black italic animate-pulse tracking-[0.3em] uppercase">
                    Compiling Fiscal Matrix...
                </div>
            </div>
        );
    }

    const plans = content?.plans || [];
    const header = content?.header;
    const consultation = content?.consultation;
    return (
        <div className="relative min-h-screen pt-32 pb-24 bg-[#020202]">
            {/* Neural Background Matrix */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[70vw] h-[70vw] bg-primary/10 rounded-full blur-[140px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/5 rounded-full blur-[120px] opacity-30" />
            </div>

            <div className="container px-6 mx-auto relative z-10 space-y-24">
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <Badge variant="outline" className="px-6 py-2 rounded-full border-primary/30 bg-primary/5 text-primary font-black italic tracking-[0.3em] text-[10px] uppercase shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                            {header?.badge || "Fiscal Investment Matrix"}
                        </Badge>
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-black italic tracking-tighter text-white"
                    >
                        {header?.titlePrefix || "Pricing"} <span className="text-primary NOT-italic underline decoration-white/10 decoration-8 underline-offset-8">{header?.titleHighlight || "Protocol"}</span>.
                    </motion.h1>
                    <motion.p className="text-xl text-muted-foreground font-medium italic max-w-2xl mx-auto leading-relaxed">
                        {header?.description || "Secure high-fidelity development artifacts and architectural support via our subscription nodes."}
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                        >
                            <Card className={cn(
                                "relative h-full border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[50px] overflow-hidden hover:border-primary/40 transition-all duration-700 flex flex-col group",
                                plan.popular && "border-primary/30 ring-1 ring-primary/20 bg-primary/[0.03]"
                            )}>
                                {plan.popular && (
                                    <div className="absolute top-8 right-8">
                                        <Badge className="bg-primary text-white font-black italic text-[9px] uppercase tracking-widest px-4 py-1.5 shadow-xl shadow-primary/20">
                                            Architect Choice
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader className="p-10 md:p-12 space-y-6 pb-6 border-b border-white/5 bg-white/[0.01]">
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black italic text-white tracking-tight leading-none">{plan.name}</h3>
                                        <p className="text-sm text-muted-foreground font-medium italic">{plan.description}</p>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black italic text-white tracking-tighter">${plan.price}</span>
                                        <span className="text-muted-foreground font-black uppercase text-[10px] tracking-widest italic">/ {plan.period || "MoonCycle"}</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-10 md:p-12 space-y-8 flex-1">
                                    <ul className="space-y-5">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-4 text-white/70 group/item">
                                                <div className="mt-1 w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300">
                                                    <Check className="w-3 h-3 text-primary group-hover/item:text-white" />
                                                </div>
                                                <span className="text-base font-bold italic tracking-tight group-hover/item:text-white transition-colors">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="p-10 md:p-12 pt-0">
                                    {!isNaN(Number(plan.price)) ? (
                                        <Button 
                                            onClick={() => handleAddToCart(plan)}
                                            className={cn(
                                                "w-full h-16 rounded-2xl font-black italic transition-all duration-500 text-lg shadow-2xl",
                                                plan.popular 
                                                    ? "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95" 
                                                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                                            )}
                                        >
                                            {plan.buttonText} <ArrowRight className="w-5 h-5 ml-3" />
                                        </Button>
                                    ) : (
                                        <Button asChild className={cn(
                                            "w-full h-16 rounded-2xl font-black italic transition-all duration-500 text-lg shadow-2xl",
                                            plan.popular 
                                                ? "bg-primary text-white shadow-primary/20 hover:scale-[1.02] active:scale-95" 
                                                : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                                        )}>
                                            <Link href="/contact">
                                                {plan.buttonText} <ArrowRight className="w-5 h-5 ml-3" />
                                            </Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Prompt */}
                <div className="pt-12 text-center">
                    <p className="text-muted-foreground font-medium italic text-lg">
                        {consultation?.text || "Need a custom deployment configuration?"} <Link href="/contact" className="text-primary underline decoration-primary/20 hover:text-primary/70 transition-colors cursor-pointer">{consultation?.linkText || "Initiate Consultation Node"}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
