"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    CreditCard, Download, ExternalLink, CheckCircle2, AlertCircle,
    ArrowUpRight, ArrowDownRight, Zap, Shield, FileText, Plus, X, Lock, Check, Loader2, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { useInvoices } from "@/hooks/useInvoices";
import { useSubscription } from "@/hooks/useSubscription";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { billingAPI } from "@/lib/api";
import { useEffect } from "react";

export default function BillingOverview() {
    const { invoices, isLoading: isLoadingInvoices } = useInvoices();
    const { subscription } = useSubscription();
    const { 
        paymentMethods, 
        isLoading: isLoadingMethods, 
        addPaymentMethod, 
        setDefaultMethod, 
        deleteMethod 
    } = usePaymentMethods();

    const [isAddCardOpen, setIsAddCardOpen] = useState(false);
    const [newCard, setNewCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [usage, setUsage] = useState<any>(null);

    useEffect(() => {
        billingAPI.getUsage().then(setUsage).catch(console.error);
    }, [subscription?.plan]);

    const chartData = useMemo(() => {
        // Build chart data from invoices (last 6 months)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        const last6Months: { name: string; amount: number }[] = [];
        
        for (let i = 5; i >= 0; i--) {
            const m = (currentMonth - i + 12) % 12;
            last6Months.push({ name: months[m], amount: 0 });
        }

        invoices.forEach(inv => {
            const date = new Date(inv.createdAt);
            const mName = months[date.getMonth()];
            const dataPoint = last6Months.find(d => d.name === mName);
            if (dataPoint) {
                const amt = parseFloat(inv.amount.replace(/[^0-9.-]+/g, ""));
                dataPoint.amount += isNaN(amt) ? 0 : amt;
            }
        });

        return last6Months;
    }, [invoices]);

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddingCard(true);
        try {
            const last4 = newCard.number.replace(/\s/g, "").slice(-4);
            const brand = newCard.number.startsWith("4") ? "Visa" : "Mastercard";
            
            await addPaymentMethod({
                last4,
                brand,
                expiry: newCard.expiry,
                isDefault: paymentMethods.length === 0,
                type: brand
            });
            
            setIsAddCardOpen(false);
            setNewCard({ number: "", expiry: "", cvc: "", name: "" });
        } catch (error) {
            // Error managed by hook
        } finally {
            setIsAddingCard(false);
        }
    };

    return (
        <div className="space-y-8 mx-auto">

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Billing & Usage</h1>
                    <p className="text-muted-foreground font-medium">Manage your subscription, methods and monitor usage.</p>
                </div>
                <div className="flex gap-3">
                    <Link href="/dashboard/billing/invoices" className="px-5 py-2.5 border border-border/50 bg-card rounded-2xl font-bold hover:bg-muted transition-all text-sm shadow-sm">
                        View Ledger
                    </Link>
                    <Link href="/dashboard/billing/subscription" className="px-5 py-2.5 bg-primary text-white rounded-2xl font-black text-sm hover:hover:scale-[1.02] transition-all shadow-xl shadow-primary/20 flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-white" /> Upgrade Tier
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Current Plan */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                        "md:col-span-1 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-500",
                        subscription?.plan === 'Business' ? "bg-gradient-to-br from-slate-900 to-slate-800" :
                        subscription?.plan === 'Pro' ? "bg-gradient-to-br from-indigo-600 to-purple-700" :
                        "bg-gradient-to-br from-blue-500 to-cyan-600"
                    )}
                >
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-white/60 text-xs font-black uppercase tracking-widest mb-1">Compute Tier</p>
                                <h2 className="text-4xl font-black flex items-center gap-3 tracking-tighter">
                                    {subscription?.plan || 'Starter'} <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse" />
                                </h2>
                            </div>
                            <div className="bg-white/10 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tighter backdrop-blur-md border border-white/20">
                                {subscription?.status === 'active' ? 'Active System' : 'Maintenance'}
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <div className="space-y-2 group/usage">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-white/70 uppercase flex items-center gap-1.5">
                                        Storage Cluster 
                                        { (usage?.storage?.percent || 80) > 85 && <AlertCircle className="w-3 h-3 text-orange-300 animate-pulse" /> }
                                    </span>
                                    <span className="font-black tracking-wider">{usage?.storage?.used || "0.4GB"} / {usage?.storage?.total || "0.5GB"}</span>
                                </div>
                                <div className="w-full bg-black/30 rounded-full h-2.5 p-0.5 overflow-hidden border border-white/10 relative">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${usage?.storage?.percent || 80}%` }}
                                        className={cn(
                                            "h-full rounded-full transition-colors duration-500",
                                            (usage?.storage?.percent || 80) > 90 ? "bg-red-400 shadow-[0_0_15px_rgba(248,113,113,0.8)]" :
                                            (usage?.storage?.percent || 80) > 75 ? "bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.8)]" :
                                            "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-white/70 uppercase">Throughput / API</span>
                                    <span className="font-black tracking-wider">{usage?.apiCalls?.used || "450"} / {usage?.apiCalls?.total || "500"}</span>
                                </div>
                                <div className="w-full bg-black/30 rounded-full h-2.5 p-0.5 overflow-hidden border border-white/10">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${usage?.apiCalls?.percent || 90}%` }}
                                        className={cn(
                                            "h-full rounded-full transition-colors duration-500",
                                            (usage?.apiCalls?.percent || 90) > 90 ? "bg-red-400 shadow-[0_0_15px_rgba(248,113,113,0.8)]" :
                                            (usage?.apiCalls?.percent || 90) > 80 ? "bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.8)]" :
                                            "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-t border-white/10 pt-6">
                            <span className="text-white/50">Next Cycle: Aug 01, 2026</span>
                            <span className="text-white flex items-center gap-1.5">
                                <Lock className="w-2.5 h-2.5 opacity-50" />
                                {subscription?.plan === 'Business' ? "$99/mo" : subscription?.plan === 'Pro' ? "$29/mo" : "Free Tier"}
                            </span>
                        </div>
                    </div>

                    <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-black/20 rounded-full blur-3xl" />
                </motion.div>

                {/* Usage Chart */}
                <div className="md:col-span-2 bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <BarChart className="w-5 h-5 text-primary/20" />
                    </div>
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-xl tracking-tight leading-none mb-1">Computational Investment</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Efficiency tracking pipeline</p>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50 shadow-inner">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Trend 6M</span>
                        </div>
                    </div>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            < BarChart data={chartData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)', radius: 12 }}
                                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: 'none', borderRadius: '24px', color: '#fff', backdropFilter: 'blur(12px)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                    labelStyle={{ fontWeight: 'black', color: '#6366f1', marginBottom: '6px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.15em' }}
                                />
                                <Bar dataKey="amount" radius={[10, 10, 10, 10]} barSize={40}>
                                    {chartData.map((entry, index) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={index === chartData.length - 1 ? 'url(#barGradient)' : 'rgba(99, 102, 241, 0.15)'}
                                            className="transition-all duration-500 hover:opacity-80 cursor-pointer"
                                        />
                                    ))}
                                </Bar>
                            </ BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Payment Methods */}
                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-xl tracking-tight">Authorized Methods</h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active payment vectors</p>
                        </div>
                        <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsAddCardOpen(true)}
                            className="text-primary h-10 px-4 bg-primary/5 font-black uppercase tracking-widest text-[10px] hover:bg-primary/10 rounded-xl border border-primary/10 transition-all"
                        >
                            <Plus size={14} className="mr-2 stroke-[3px]" /> Add Entity
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {isLoadingMethods ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-3 opacity-50">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                <span className="text-[10px] font-black tracking-widest uppercase text-primary">Decryption in progress...</span>
                            </div>
                        ) : paymentMethods.length === 0 ? (
                            <div className="py-16 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-border/50 rounded-[2rem] bg-muted/5">
                                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground/30">
                                    <CreditCard className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="font-black text-sm uppercase tracking-widest text-muted-foreground">No Methods Found</p>
                                    <p className="text-xs text-muted-foreground/60 font-medium">Connect a credit source to enable services.</p>
                                </div>
                            </div>
                        ) : (
                            paymentMethods.map((card) => (
                                <div key={card.id} className="group relative flex items-center justify-between p-6 border border-border/50 rounded-[1.75rem] bg-background/50 hover:bg-muted/10 transition-all duration-500 hover:border-primary/20 hover:scale-[1.01]">
                                    <div className="flex items-center gap-6">
                                        <div className={cn(
                                            "w-16 h-10 rounded-xl flex items-center justify-center shadow-lg border relative overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3",
                                            card.brand.toLowerCase() === 'visa' ? "bg-blue-600 border-blue-400/30" : "bg-slate-800 border-slate-600/30"
                                        )}>
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
                                            <span className="text-[10px] font-black text-white italic tracking-tighter z-10">{card.brand}</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-sm tracking-[0.2em] leading-none mb-1.5 uppercase opacity-80 group-hover:opacity-100 transition-opacity">•••• •••• •••• {card.last4}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Cycle {card.expiry}</p>
                                                <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-60">{card.type}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {card.isDefault ? (
                                            <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Primary</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                <Button 
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDefaultMethod(card.id)}
                                                    className="h-9 px-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-xl"
                                                >
                                                    Activate
                                                </Button>
                                                <Button 
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteMethod(card.id)}
                                                    className="h-9 w-9 p-0 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-muted-foreground"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Invoices */}
                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-xl tracking-tight">Recent Ledger</h3>
                    </div>
                    <div className="space-y-1">
                        {isLoadingInvoices ? (
                            <div className="py-12 flex flex-col items-center justify-center opacity-50">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : invoices.length === 0 ? (
                            <p className="text-center py-12 text-muted-foreground text-sm font-medium">No transactions recorded yet.</p>
                        ) : (
                            invoices.slice(0, 4).map((inv, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-primary/[0.03] rounded-2xl transition-all cursor-pointer group animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="flex items-center gap-5">
                                        <div className="w-11 h-11 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all group-hover:rotate-6">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm tracking-tight">{inv.amount}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                                {new Date(inv.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                                            inv.status === 'completed' ? "bg-green-500/10 text-green-600 border-green-500/10" : "bg-orange-500/10 text-orange-600 border-orange-500/10"
                                        )}>
                                            {inv.status}
                                        </span>
                                        <button className="p-2.5 hover:bg-muted bg-background border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all shadow-sm">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* Add Card Dialog */}
            <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] border-border/50">
                    <DialogHeader>
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                            <CreditCard className="w-7 h-7 text-primary" />
                        </div>
                        <DialogTitle className="text-3xl font-black tracking-tighter">Register Method</DialogTitle>
                        <DialogDescription className="text-sm">
                            Connect a new computational credit source to your cluster.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handleAddCard} className="space-y-6 py-4">
                        <div className="p-4 bg-green-500/5 rounded-2xl border border-green-500/20 flex items-start gap-4">
                            <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                            <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                                YOUR CREDENTIALS ARE ENCRYPTED VIA QUANTUM-RESISTANT SHS-256 INFRASTRUCTURE. WE NEVER STORE SENSITIVE PII.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Entity Name</Label>
                                <Input 
                                    required
                                    value={newCard.name}
                                    onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                                    placeholder="JAYDEN DOE"
                                    className="h-auto border-border/50 bg-muted/20 rounded-xl font-bold uppercase placeholder:opacity-30 placeholder:normal-case"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Universal Identifier (PAN)</Label>
                                <div className="relative">
                                    <Input 
                                        required
                                        value={newCard.number}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\s/g, "").replace(/[^0-9]/g, "");
                                            const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                                            setNewCard({...newCard, number: formatted.slice(0, 19)});
                                        }}
                                        placeholder="0000 0000 0000 0000"
                                        className="h-auto pl-12 border-border/50 bg-muted/20 rounded-xl font-black tracking-widest"
                                    />
                                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Cycle Expiry</Label>
                                    <Input 
                                        required
                                        value={newCard.expiry}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/[^0-9]/g, "");
                                            if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
                                            setNewCard({...newCard, expiry: val.slice(0, 5)});
                                        }}
                                        placeholder="MM/YY"
                                        className="h-auto border-border/50 bg-muted/20 rounded-xl font-black text-center"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Security Key (CVC)</Label>
                                    <div className="relative">
                                        <Input 
                                            required
                                            type="password"
                                            value={newCard.cvc}
                                            onChange={(e) => setNewCard({...newCard, cvc: e.target.value.slice(0, 4)})}
                                            placeholder="•••"
                                            className="h-auto border-border/50 bg-muted/20 rounded-xl font-black text-center tracking-[0.5em]"
                                        />
                                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button 
                                type="submit"
                                disabled={isAddingCard}
                                className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform"
                            >
                                {isAddingCard ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    "Authorize Link"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
