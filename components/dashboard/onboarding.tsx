
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Zap, Target, ShieldCheck } from "lucide-react";

const STEPS = [
    {
        title: "Welcome to Ofitsoft Dashboard!",
        desc: "Let's take a quick tour of your new power center. Ready to scale your operations?",
        icon: Zap,
        color: "bg-blue-500",
    },
    {
        title: "Project Management Redefined",
        desc: "Track every milestone, chat with your team, and manage files—all in one place.",
        icon: Target,
        color: "bg-purple-500",
    },
    {
        title: "Secure & Transparent",
        desc: "From encrypted messaging to real-time billing, we keep your business safe and clear.",
        icon: ShieldCheck,
        color: "bg-green-500",
    }
];

export default function OnboardingTutorial() {
    const [step, setStep] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        const hasSeen = localStorage.getItem("onboarding_complete");
        if (!hasSeen) {
            const timer = setTimeout(() => setShow(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const next = () => {
        if (step < STEPS.length - 1) setStep(step + 1);
        else finish();
    };

    const finish = () => {
        setShow(false);
        localStorage.setItem("onboarding_complete", "true");
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
                <button onClick={finish} className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="space-y-6 text-center"
                    >
                        <div className={cn(
                            "w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl shadow-opacity-20",
                            STEPS[step].color
                        )}>
                            {(() => {
                                const Icon = STEPS[step].icon;
                                return <Icon size={40} />;
                            })()}
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">{STEPS[step].title}</h2>
                            <p className="text-muted-foreground">{STEPS[step].desc}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="flex flex-col gap-4 mt-8">
                    <div className="flex justify-center gap-1.5">
                        {STEPS.map((_, i) => (
                            <div key={i} className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                step === i ? "w-8 bg-primary" : "w-1.5 bg-muted"
                            )} />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold dark:shadow-lg dark:shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                    >
                        {step === STEPS.length - 1 ? "Get Started" : "Continue"}
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
