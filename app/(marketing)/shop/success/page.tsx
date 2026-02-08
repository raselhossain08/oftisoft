"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Download, Copy, Mail, ShieldCheck, ArrowRight, Home, LayoutDashboard, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function OrderSuccessPage() {
    const [copied, setCopied] = useState(false);
    const licenseKey = "OFTI-2026-XXXX-REGL-8892";

    const copyToClipboard = () => {
        navigator.clipboard.writeText(licenseKey);
        setCopied(true);
        toast.success("License key copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container px-4 py-16 md:py-24 mx-auto max-w-4xl">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-extrabold mb-4"
                >
                    Payment Successful!
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground text-lg"
                >
                    Thank you for your purchase. Your order <span className="text-foreground font-bold">#ORD-88291</span> has been confirmed.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Product Access Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-full border-primary/20 shadow-xl overflow-hidden relative">
                         <div className="absolute top-0 right-0 p-4">
                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Instant Access</Badge>
                        </div>
                        <CardHeader>
                            <CardTitle>Your Digital Assets</CardTitle>
                            <CardDescription>Download your files and view your license.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                                <p className="text-sm font-bold mb-3">License Key:</p>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 p-2 bg-background rounded-lg border font-mono text-xs overflow-x-auto">
                                        {licenseKey}
                                    </code>
                                    <Button size="icon" variant="outline" className="h-9 w-9 shrink-0" onClick={copyToClipboard}>
                                        <Copy className={`w-4 h-4 ${copied ? "text-green-500" : ""}`} />
                                    </Button>
                                </div>
                            </div>

                            <Button className="w-full h-14 rounded-2xl font-bold text-lg gap-2 shadow-lg shadow-primary/20" size="lg">
                                <Download className="w-5 h-5" />
                                Download Files (.zip)
                            </Button>

                            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                                <Mail className="w-3 h-3" />
                                A copy has been sent to your email.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Next Steps Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="h-full border-border/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Manage & Support</CardTitle>
                            <CardDescription>What would you like to do next?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href="/dashboard" className="flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <LayoutDashboard className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">Customer Dashboard</p>
                                        <p className="text-xs text-muted-foreground">Manage all your purchases</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <Link href="/support" className="flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">Get Support</p>
                                        <p className="text-xs text-muted-foreground">Open a technical ticket</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </Link>

                             <Link href="/shop" className="flex items-center justify-between p-4 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                                        <Home className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">Continue Shopping</p>
                                        <p className="text-xs text-muted-foreground">Discover more premium assets</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center p-8 rounded-3xl bg-secondary/20 border border-border/50"
            >
                <div className="flex items-center justify-center gap-4 mb-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <span className="font-bold text-lg">Lifetime Support & Updates</span>
                </div>
                <p className="text-muted-foreground max-w-lg mx-auto mb-6">
                    Our team is committed to providing ongoing updates and technical assistance for all our products. You can access future versions directly from your dashboard.
                </p>
                <Separator className="mb-6" />
                <p className="text-sm text-muted-foreground">
                    Need help with installation? <Link href="/docs" className="text-primary font-bold hover:underline">Check our documentation</Link> or <Link href="/contact" className="text-primary font-bold hover:underline">contact us</Link>.
                </p>
            </motion.div>
        </div>
    );
}

import { Badge } from "@/components/ui/badge";
