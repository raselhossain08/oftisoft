
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Smartphone, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TwoFactorPage() {
    const router = useRouter();
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`);
            prevInput?.focus();
        }
    };

    const handleVerify = () => {
        setLoading(true);
        setTimeout(() => {
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <ShieldCheck className="w-8 h-8" />
                </div>

                <h1 className="text-2xl font-bold mb-2">Two-Factor Authentication</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    Enter the 6-digit code sent to your device ending in <span className="font-bold text-foreground">...8832</span>
                </p>

                <div className="flex gap-2 justify-center mb-8">
                    {code.map((digit, i) => (
                        <input
                            key={i}
                            id={`code-${i}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            className="w-12 h-14 bg-muted/50 border border-border rounded-xl text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={code.some(c => !c) || loading}
                    className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Verify Identity <ArrowRight className="w-5 h-5" /></>}
                </button>

                <div className="mt-6 text-sm">
                    <span className="text-muted-foreground">Didn't receive code? </span>
                    <button className="text-primary font-bold hover:underline">Resend</button>
                </div>
            </div>
        </div>
    );
}
