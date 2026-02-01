
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    CreditCard, Download, ExternalLink, CheckCircle2, AlertCircle,
    ArrowUpRight, ArrowDownRight, Zap, Shield, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";

// --- Mock Data ---

const USAGE_DATA = [
    { name: 'Jan', amount: 1200 },
    { name: 'Feb', amount: 1900 },
    { name: 'Mar', amount: 1500 },
    { name: 'Apr', amount: 2400 },
    { name: 'May', amount: 3200 },
    { name: 'Jun', amount: 2800 },
];

const INVOICES = [
    { id: "INV-001", date: "Jun 01, 2026", amount: "$2,800.00", status: "Paid" },
    { id: "INV-002", date: "May 01, 2026", amount: "$3,200.00", status: "Paid" },
    { id: "INV-003", date: "Apr 01, 2026", amount: "$2,400.00", status: "Paid" },
];

const CARDS = [
    { last4: "4242", brand: "Visa", expiry: "12/28", default: true },
    { last4: "8888", brand: "Mastercard", expiry: "10/27", default: false },
];

export default function BillingOverview() {
    return (
        <div className="space-y-8 max-w-6xl mx-auto">

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Billing & Usage</h1>
                <div className="flex gap-2">
                    <Link href="/dashboard/billing/invoices" className="px-4 py-2 border border-border rounded-xl font-medium hover:bg-muted transition-colors">
                        View All Invoices
                    </Link>
                    <Link href="/dashboard/billing/subscription" className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        Upgrade Plan
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Current Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-indigo-200 font-medium mb-1">Current Plan</p>
                                <h2 className="text-3xl font-bold flex items-center gap-2">
                                    Pro Plan <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                </h2>
                            </div>
                            <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm border border-white/20">
                                Active
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-indigo-100">Storage Usage</span>
                                    <span className="font-bold">45GB / 100GB</span>
                                </div>
                                <div className="w-full bg-black/20 rounded-full h-2">
                                    <div className="bg-white h-full rounded-full w-[45%]" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-indigo-100">API Calls</span>
                                    <span className="font-bold">8.2k / 10k</span>
                                </div>
                                <div className="w-full bg-black/20 rounded-full h-2">
                                    <div className="bg-green-400 h-full rounded-full w-[82%]" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4">
                            <span className="text-indigo-200">Renews on Jul 01, 2026</span>
                            <span className="font-bold">$49/month</span>
                        </div>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-2xl" />
                </motion.div>

                {/* Usage Chart */}
                <div className="md:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <h3 className="font-bold mb-6">Spend History</h3>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={USAGE_DATA}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                    {USAGE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === USAGE_DATA.length - 1 ? '#6366f1' : '#334155'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Payment Methods */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold">Payment Methods</h3>
                        <button className="text-primary text-sm font-bold hover:underline">+ Add New</button>
                    </div>
                    <div className="space-y-4">
                        {CARDS.map((card, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border border-border rounded-2xl bg-muted/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-card border border-border rounded-md flex items-center justify-center">
                                        {/* Placeholder Icon */}
                                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">•••• •••• •••• {card.last4}</p>
                                        <p className="text-xs text-muted-foreground">Expires {card.expiry}</p>
                                    </div>
                                </div>
                                <div>
                                    {card.default ? (
                                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">Default</span>
                                    ) : (
                                        <button className="text-xs text-muted-foreground hover:text-primary">Set Default</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Invoices */}
                <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold">Recent Invoices</h3>
                    </div>
                    <div className="space-y-1">
                        {INVOICES.map((inv, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{inv.amount}</p>
                                        <p className="text-xs text-muted-foreground">{inv.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{inv.status}</span>
                                    <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    );
}
