"use client";

import { useState } from "react";
import { 
    Link as LinkIcon, 
    Copy, 
    Check, 
    TrendingUp, 
    Users, 
    DollarSign, 
    ArrowUpRight, 
    History, 
    Wallet, 
    BarChart3, 
    ChevronRight,
    ArrowDownRight,
    Search,
    Filter,
    FileText,
    ExternalLink,
    Zap,
    Download,
    RefreshCw
} from "lucide-react";
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    Cell,
    AreaChart,
    Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
    mockAffiliateTransactions, 
    mockWithdrawals, 
    mockPerformanceReports 
} from "@/lib/shop-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { useAffiliate } from "@/hooks/useAffiliate";
import { Loader2 } from "lucide-react";

export default function AffiliatePage() {
    const { stats, isLoading, refresh, withdraw } = useAffiliate();
    const [copied, setCopied] = useState(false);
    
    // Fallback for referral link while loading or if profile missing
    const referralCode = stats?.profile?.referralCode || "loading...";
    const referralLink = `https://oftisoft.com/ref/${referralCode}`;

    const handleCopy = () => {
        if (referralCode === "loading...") return;
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success("Referral bridge copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (isLoading && !stats) {
        return (
          <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Synchronizing Affiliate Nodes...</p>
          </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Affiliate Protocol
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Scale your earnings by bridging new architects to the Oftisoft ecosystem.</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={refresh}
                        className="rounded-xl gap-2 font-bold h-11 border-border/50 bg-card/50 backdrop-blur-sm"
                    >
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} /> Fast Sync
                    </Button>
                    <Button className="rounded-xl gap-2 font-bold h-11 bg-primary text-white shadow-lg shadow-primary/20">
                        <Zap className="w-4 h-4" /> Expansion Kit
                    </Button>
                </div>
            </div>

            {/* Top Stats & Referral Link */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Referral Link Card */}
                <Card className="lg:col-span-1 border-primary/20 bg-primary/[0.03] overflow-hidden relative group rounded-[32px] border-2">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
                    <CardHeader>
                        <CardTitle className="text-xl font-black italic flex items-center gap-2">
                            <LinkIcon className="w-5 h-5 text-primary" /> Your Referral Bridge
                        </CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest text-primary/70">Unique Acquisition Vector</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div className="relative">
                            <Input 
                                readOnly 
                                value={referralLink} 
                                className="pr-12 h-14 rounded-2xl bg-background border-border/50 font-mono text-xs focus:ring-primary/20"
                            />
                            <button 
                                onClick={handleCopy}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="p-4 rounded-2xl bg-background border border-border/50 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase text-muted-foreground">
                                <span>Commission Yield</span>
                                <span className="text-primary">20% Perpetual</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Earnings Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { 
                            label: "Total Revenue", 
                            val: `$${(Number(stats?.profile?.totalEarnings) || 0).toLocaleString()}`, 
                            growth: "+12.5%", 
                            color: "text-primary", 
                            icon: DollarSign 
                        },
                        { 
                            label: "Vault Balance", 
                            val: `$${(Number(stats?.profile?.balance) || 0).toLocaleString()}`, 
                            growth: "AvailableNow", 
                            color: "text-indigo-500", 
                            icon: Wallet 
                        },
                        { 
                            label: "Conversion Tier", 
                            val: stats?.profile?.tier?.toUpperCase() || "STANDARD", 
                            growth: `${stats?.profile?.commissionRate || 20}% Yield`, 
                            color: "text-green-500", 
                            icon: TrendingUp 
                        },
                    ].map((stat, i) => (
                        <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-md rounded-[32px] p-6 group hover:border-primary/30 transition-all flex flex-col justify-between overflow-hidden shadow-sm relative">
                             <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 blur-[40px] rounded-full group-hover:bg-primary/10 transition-colors" />
                             <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all relative z-10 mb-6">
                                <stat.icon className="w-6 h-6" />
                             </div>
                             <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{stat.label}</p>
                                <div className="flex items-end gap-2">
                                    <h4 className="text-2xl font-black italic">{stat.val}</h4>
                                    <span className={cn("text-[10px] font-bold mb-1", stat.color)}>{stat.growth}</span>
                                </div>
                             </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Dashboard Sections */}
            <Tabs defaultValue="performance" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-fit border border-border">
                    <TabsTrigger value="performance" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8">
                        <BarChart3 className="w-4 h-4" /> Performance Matrix
                    </TabsTrigger>
                    <TabsTrigger value="commissions" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8">
                        <History className="w-4 h-4" /> Yield Log
                    </TabsTrigger>
                    <TabsTrigger value="withdrawals" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8">
                        <Wallet className="w-4 h-4" /> Settlement Vault
                    </TabsTrigger>
                </TabsList>

                {/* Performance Reports Tab */}
                <TabsContent value="performance" className="space-y-6">
                    <Card className="border-border/50 bg-card/60 backdrop-blur-md rounded-[40px] overflow-hidden p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border/30 pb-6">
                            <div>
                                <h3 className="text-xl font-black italic">Conversion Analytics</h3>
                                <p className="text-xs text-muted-foreground font-medium">Tracking node acquisitions and traffic density over the last 7 cycles.</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="rounded-lg h-8 px-3 font-bold">Clicks</Badge>
                                <Badge className="rounded-lg h-8 px-3 bg-primary text-white font-bold border-none">Conversions</Badge>
                            </div>
                        </div>
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.performanceReports || mockPerformanceReports}>
                                    <defs>
                                        <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} 
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }} 
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '24px', border: '1px solid hsl(var(--border))', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)' }}
                                        itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="conversions" 
                                        stroke="hsl(var(--primary))" 
                                        strokeWidth={4} 
                                        fillOpacity={1} 
                                        fill="url(#colorConversions)" 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="referrals" 
                                        stroke="hsl(var(--indigo-500))" 
                                        strokeWidth={2} 
                                        strokeDasharray="5 5"
                                        fill="transparent" 
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-8 rounded-[40px] border border-border/50 bg-indigo-500/[0.03] space-y-4">
                            <h4 className="font-black italic text-lg text-indigo-500">Node Reach Analysis</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">Your referral links are gaining high traction in North American developer communities. 65% of your conversions originate from GitHub readme links.</p>
                            <Button variant="link" className="p-0 h-auto text-indigo-500 font-black text-xs uppercase underline">View Geo-Density Report</Button>
                        </div>
                        <div className="p-8 rounded-[40px] border border-border/50 bg-green-500/[0.03] space-y-4">
                            <h4 className="font-black italic text-lg text-green-500">Tier Status: Gold Elite</h4>
                            <p className="text-sm text-muted-foreground font-medium leading-relaxed">You are 12 conversions away from "Platinum Architect" tier, which unlocks a 25% perpetual commission rate and direct API marketing access.</p>
                            <div className="h-2 w-full bg-green-500/10 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 w-[78%]" />
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Yield Log Tab */}
                <TabsContent value="commissions" className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                         <div className="relative max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search transactions..." 
                                className="pl-11 h-auto rounded-2xl bg-card/50 border-border/50 focus:ring-primary/20 transition-all shadow-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-auto rounded-2xl border-border/50 bg-card/50"><Filter className="w-4 h-4 mr-2" /> All Tiers</Button>
                            <Button variant="outline" className="h-auto rounded-2xl border-border/50 bg-card/50"><Download className="w-4 h-4 mr-2" /> Export CSV</Button>
                        </div>
                    </div>

                    <Card className="border-border/50 bg-card/60 backdrop-blur-md rounded-[40px] overflow-hidden">
                        <div className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-muted/30 border-b border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                            <th className="px-8 py-6">Ledger ID</th>
                                            <th className="px-8 py-6">Temporal Sync</th>
                                            <th className="px-8 py-6">Acquired Artifact</th>
                                            <th className="px-8 py-6">Market Val</th>
                                            <th className="px-8 py-6">Your Yield</th>
                                            <th className="px-8 py-6">Signal Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                         {(stats?.commissions || []).map((tx: any) => (
                                             <tr key={tx.id} className="group hover:bg-primary/[0.02] transition-colors">
                                                 <td className="px-8 py-6 font-black text-xs font-mono">{tx.id.substring(0, 8)}</td>
                                                 <td className="px-8 py-6 text-xs font-bold text-muted-foreground uppercase">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                                 <td className="px-8 py-6">
                                                     <div className="flex items-center gap-3">
                                                         <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                                             <Zap className="w-4 h-4" />
                                                         </div>
                                                         <span className="text-xs font-black italic">Order #{tx.order?.id?.substring(0, 5)}</span>
                                                     </div>
                                                 </td>
                                                 <td className="px-8 py-6 text-xs font-bold">${Number(tx.order?.total || 0).toFixed(2)}</td>
                                                 <td className="px-8 py-6 text-xs font-black text-primary italic">${Number(tx.amount).toFixed(2)}</td>
                                                 <td className="px-8 py-6">
                                                     <Badge className={cn("text-[9px] font-black uppercase tracking-tighter rounded-lg border-none", 
                                                         tx.status === "cleared" ? "bg-green-500 text-white" : tx.status === "pending" ? "bg-orange-500 text-white" : "bg-red-500 text-white"
                                                     )}>
                                                         {tx.status}
                                                     </Badge>
                                                 </td>
                                             </tr>
                                         ))}
                                         {(!stats?.commissions || stats.commissions.length === 0) && (
                                             <tr>
                                                 <td colSpan={6} className="px-8 py-20 text-center opacity-30 italic font-medium">No yield signals detected in the ledger.</td>
                                             </tr>
                                         )}
                                     </tbody>
                                 </table>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                {/* Settlement Vault Tab */}
                <TabsContent value="withdrawals" className="space-y-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Payout Mechanism */}
                        <Card className="border-border/50 bg-card/60 backdrop-blur-md rounded-[40px] p-10 flex flex-col justify-between group overflow-hidden relative">
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-colors" />
                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black italic">Claimable Yield</h3>
                                    <p className="text-muted-foreground text-sm font-medium">Funds matured and ready for extraction from the primary settlement ledger.</p>
                                </div>
                                <div className="flex flex-col gap-1 py-6">
                                    <span className="text-5xl font-black italic text-primary">${Number(stats?.profile?.balance || 0).toLocaleString()}</span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic flex items-center gap-2">
                                        <Wallet className="w-3.5 h-3.5" /> Direct extraction available
                                    </span>
                                </div>
                                <div className="space-y-4">
                                   <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground italic">Target Payout Interface</label>
                                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/50 flex items-center justify-between group/pay cursor-pointer hover:border-primary/50 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary group-hover/pay:scale-110 transition-transform">
                                                    <CreditCardIcon />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black italic">PayPal Node (Verified)</p>
                                                    <p className="text-[10px] text-muted-foreground font-bold leading-none">Extraction active</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                   </div>
                                   <Button 
                                        disabled={Number(stats?.profile?.balance) <= 0}
                                        onClick={() => withdraw(Number(stats?.profile?.balance), 'paypal')}
                                        className="w-full rounded-[24px] h-14 bg-primary text-white font-black italic shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                       {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initialize Ledger Extraction"}
                                   </Button>
                                   <p className="text-[9px] text-center text-muted-foreground font-bold italic">Global processing fees apply via inter-bank liquidity layers.</p>
                                </div>
                            </div>
                        </Card>

                        {/* Recent Extractions */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-black italic flex items-center gap-2">
                                <History className="w-5 h-5 text-primary" /> Extraction History
                            </h3>
                            <div className="grid gap-4">
                                {(stats?.withdrawals || []).map((wr: any) => (
                                    <div key={wr.id} className="p-6 rounded-[32px] bg-card border border-border/50 flex items-center justify-between hover:border-primary/20 transition-all group">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <Wallet size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black italic">{Number(wr.amount).toFixed(2)} USD Extraction</p>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase">{new Date(wr.createdAt).toLocaleDateString()} • {wr.method}</p>
                                            </div>
                                        </div>
                                        <Badge className={cn("text-[9px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-xl border-none",
                                            wr.status === "completed" ? "bg-green-500 text-white" : wr.status === "pending" ? "bg-orange-500 text-white" : "bg-red-500 text-white"
                                        )}>
                                            {wr.status}
                                        </Badge>
                                    </div>
                                ))}
                                {(!stats?.withdrawals || stats.withdrawals.length === 0) && (
                                    <div className="p-10 text-center opacity-30 italic font-medium">No extraction history found.</div>
                                )}
                            </div>
                            <Button variant="outline" className="w-full rounded-[24px] h-auto font-bold border-border/50 text-muted-foreground hover:text-primary transition-all">
                                Complete Audit History
                            </Button>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function CreditCardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}
