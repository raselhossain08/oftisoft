"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    CreditCard, Download, ExternalLink, CheckCircle2, AlertCircle,
    ArrowUpRight, ArrowDownRight, Zap, Shield, FileText, Plus, X, Lock, Check
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

// --- Components ---

const CustomDialog = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl pointer-events-auto overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-border">
                                <h3 className="font-bold text-lg">{title}</h3>
                                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default function BillingOverview() {
    const [cards, setCards] = useState([
        { id: 1, last4: "4242", brand: "Visa", expiry: "12/28", default: true },
        { id: 2, last4: "8888", brand: "Mastercard", expiry: "10/27", default: false },
    ]);

    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [newCard, setNewCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
    const [loading, setLoading] = useState(false);

    const handleSetDefault = (id: number) => {
        setCards(cards.map(card => ({
            ...card,
            default: card.id === id
        })));
    };

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API
        setTimeout(() => {
            const last4 = newCard.number.slice(-4) || "0000";
            const brand = newCard.number.startsWith("4") ? "Visa" : "Mastercard";
            const newId = Math.max(...cards.map(c => c.id)) + 1;
            
            setCards([...cards, {
                id: newId,
                last4,
                brand,
                expiry: newCard.expiry || "12/30",
                default: false
            }]);
            
            setLoading(false);
            setIsAddCardOpen(false);
            setNewCard({ number: "", expiry: "", cvc: "", name: "" });
        }, 1500);
    };

    return (
        <div className="space-y-8  mx-auto">

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Billing & Usage</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-border rounded-xl font-medium hover:bg-muted transition-colors">
                        View All Invoices
                    </button>
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
                        <button 
                            onClick={() => setIsAddCardOpen(true)}
                            className="text-primary text-sm font-bold hover:underline flex items-center gap-1"
                        >
                            <Plus size={14} /> Add New
                        </button>
                    </div>
                    <div className="space-y-4">
                        {cards.map((card) => (
                            <div key={card.id} className="flex items-center justify-between p-4 border border-border rounded-2xl bg-muted/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-8 bg-card border border-border rounded-md flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">•••• •••• •••• {card.last4}</p>
                                        <p className="text-xs text-muted-foreground">Expires {card.expiry} • {card.brand}</p>
                                    </div>
                                </div>
                                <div>
                                    {card.default ? (
                                        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 flex items-center gap-1">
                                            <Check size={10} /> Default
                                        </span>
                                    ) : (
                                        <button 
                                            onClick={() => handleSetDefault(card.id)}
                                            className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors hover:bg-muted px-2 py-1 rounded-lg"
                                        >
                                            Set Default
                                        </button>
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

            {/* Add Card Dialog */}
            <CustomDialog 
                isOpen={isAddCardOpen} 
                onClose={() => setIsAddCardOpen(false)} 
                title="Add Payment Method"
            >
                <form onSubmit={handleAddCard} className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg flex items-center gap-3 border border-border">
                        <Shield className="w-5 h-5 text-green-500" />
                        <p className="text-xs text-muted-foreground">Your payment information is encrypted and secure.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Name on Card</label>
                        <input 
                            required
                            value={newCard.name}
                            onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                            placeholder="J. Doe"
                            className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Card Number</label>
                        <div className="relative">
                            <input 
                                required
                                value={newCard.number}
                                onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                                placeholder="0000 0000 0000 0000"
                                className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                            />
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">Expiry Date</label>
                            <input 
                                required
                                value={newCard.expiry}
                                onChange={(e) => setNewCard({...newCard, expiry: e.target.value})}
                                placeholder="MM/YY"
                                className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase text-muted-foreground">CVC / CWW</label>
                            <div className="relative">
                                <input 
                                    required
                                    value={newCard.cvc}
                                    onChange={(e) => setNewCard({...newCard, cvc: e.target.value})}
                                    placeholder="123"
                                    className="w-full bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                                />
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add Card"}
                        </button>
                    </div>
                </form>
            </CustomDialog>

        </div>
    );
}
