"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { PermissionGuard } from "@/components/auth/role-guard";
import { 
    Link as LinkIcon, 
    Copy, 
    Check, 
    TrendingUp, 
    DollarSign, 
    History, 
    Wallet, 
    BarChart3, 
    ChevronRight,
    Search,
    Filter,
    Zap,
    Download,
    RefreshCw,
    AlertCircle,
    Crown,
    Users,
    MousePointer,
    Percent,
    ArrowRight,
    Settings,
    CreditCard,
    Building2,
    Bitcoin,
    Loader2,
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
    Area,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAffiliate } from "@/hooks/useAffiliate";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

// Theme colors from globals.css: --primary #6366f1, --chart-2 #0ea5e9
const THEME_PRIMARY = "#6366f1";
const THEME_SECONDARY = "#0ea5e9";
const THEME_SUCCESS = "#22c55e";
const THEME_WARNING = "#f59e0b";
const CHART_TEXT_WHITE = "#ffffff";

export default function AffiliatePage() {
    const { stats, isLoading, isWithdrawing, error, refresh, withdraw, withdrawalMethods, isLoadingMethods } = useAffiliate();
    const { hasPermission, isAdmin, isSuperAdmin } = useRole();
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [selectedMethod, setSelectedMethod] = useState<string>("");
    const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    
    const referralCode = stats?.profile?.referralCode || "loading...";
    const referralLink = `https://oftisoft.com/ref/${referralCode}`;

    const handleCopy = () => {
        if (referralCode === "loading...") return;
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success("Referral link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredCommissions = useMemo(() => {
        const list = stats?.commissions || [];
        return list.filter((tx: any) => {
            const matchesSearch = !searchQuery.trim() || 
                (tx.id?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (tx.order?.id?.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [stats?.commissions, searchQuery, statusFilter]);

    const handleWithdraw = async () => {
        const amount = withdrawAmount ? parseFloat(withdrawAmount) : 0;
        const minAmount = withdrawalMethods?.find((m: any) => m.id === selectedMethod)?.minAmount || 50;
        
        if (amount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }
        if (amount < minAmount) {
            toast.error(`Minimum withdrawal amount is $${minAmount}.`);
            return;
        }
        if (amount > Number(stats?.profile?.balance || 0)) {
            toast.error("Insufficient balance.");
            return;
        }
        if (!selectedMethod) {
            toast.error("Please select a withdrawal method.");
            return;
        }

        const success = await withdraw(amount, selectedMethod, paymentDetails);
        if (success) {
            setShowWithdrawDialog(false);
            setWithdrawAmount("");
            setSelectedMethod("");
            setPaymentDetails({});
        }
    };

    const handleExportWithdrawals = () => {
        const list = stats?.withdrawals || [];
        if (list.length === 0) {
            toast.error("No withdrawals to export.");
            return;
        }
        const headers = ["ID", "Date", "Amount", "Method", "Status", "Transaction ID"];
        const rows = list.map((w: any) => [
            w.id,
            new Date(w.createdAt).toLocaleDateString(),
            Number(w.amount).toFixed(2),
            w.method,
            w.status,
            w.transactionId || "N/A"
        ]);
        const csv = [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `affiliate-withdrawals-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Withdrawals exported successfully.");
    };

    const handleExportCSV = () => {
        const list = stats?.commissions || [];
        if (list.length === 0) {
            toast.error("No commissions to export.");
            return;
        }
        const headers = ["ID", "Date", "Order ID", "Order Total", "Commission", "Status", "Type"];
        const rows = list.map((tx: any) => [
            tx.id,
            new Date(tx.createdAt).toLocaleDateString(),
            tx.order?.id || "",
            Number(tx.order?.total || 0).toFixed(2),
            Number(tx.amount).toFixed(2),
            tx.status,
            tx.type
        ]);
        const csv = [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `affiliate-commissions-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Commissions exported successfully.");
    };

    if (isLoading && !stats) {
        return (
          <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary animate-pulse">Loading affiliate data...</p>
          </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <AlertCircle className="w-16 h-16 text-red-500/80" />
                <h3 className="text-xl font-bold">Failed to load affiliate data</h3>
                <p className="text-muted-foreground text-sm text-center max-w-sm">Something went wrong. Please try again.</p>
                <Button onClick={refresh} className="gap-2 rounded-xl">
                    <RefreshCw className="w-4 h-4" /> Retry
                </Button>
            </div>
        );
    }

    const performanceData = stats?.performanceReports || [];
    const tierProgress = stats?.tierProgress || { currentTier: 'STANDARD', progress: 0, nextTier: null };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Affiliate Dashboard
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">
                        Earn commissions by referring new customers to Oftisoft.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={refresh}
                        disabled={isLoading}
                        className="rounded-xl gap-2 font-bold h-11 border-border/50 bg-card/50 backdrop-blur-sm"
                    >
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} /> Refresh
                    </Button>
                    <PermissionGuard permission="affiliate.admin">
                        <Button 
                            variant="outline" 
                            className="rounded-xl gap-2 font-bold h-11"
                            onClick={() => router.push('/dashboard/affiliate/admin')}
                        >
                            <Settings className="w-4 h-4" /> Admin Portal
                        </Button>
                    </PermissionGuard>
                </div>
            </div>

            {/* Tier Status Banner */}
            <Card className={cn(
                "border-2 overflow-hidden relative group rounded-[32px]",
                tierProgress.currentTier === 'DIAMOND' ? "border-purple-500/30 bg-purple-500/5" :
                tierProgress.currentTier === 'PLATINUM' ? "border-yellow-500/30 bg-yellow-500/5" :
                tierProgress.currentTier === 'GOLD' ? "border-amber-500/30 bg-amber-500/5" :
                tierProgress.currentTier === 'SILVER' ? "border-gray-400/30 bg-gray-400/5" :
                tierProgress.currentTier === 'BRONZE' ? "border-orange-600/30 bg-orange-600/5" :
                "border-border/50 bg-card/50"
            )}>
                <div className={cn(
                    "absolute -right-10 -bottom-10 w-40 h-40 rounded-full pointer-events-none blur-[60px]",
                    tierProgress.currentTier === 'DIAMOND' ? "bg-purple-500/20" :
                    tierProgress.currentTier === 'PLATINUM' ? "bg-yellow-500/20" :
                    tierProgress.currentTier === 'GOLD' ? "bg-amber-500/20" :
                    tierProgress.currentTier === 'SILVER' ? "bg-gray-400/20" :
                    tierProgress.currentTier === 'BRONZE' ? "bg-orange-600/20" :
                    "bg-primary/10"
                )} />
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center",
                                tierProgress.currentTier === 'DIAMOND' ? "bg-purple-500/20 text-purple-500" :
                                tierProgress.currentTier === 'PLATINUM' ? "bg-yellow-500/20 text-yellow-500" :
                                tierProgress.currentTier === 'GOLD' ? "bg-amber-500/20 text-amber-500" :
                                tierProgress.currentTier === 'SILVER' ? "bg-gray-400/20 text-gray-400" :
                                tierProgress.currentTier === 'BRONZE' ? "bg-orange-600/20 text-orange-600" :
                                "bg-primary/20 text-primary"
                            )}>
                                <Crown className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground font-medium">Current Tier</p>
                                <h2 className="text-2xl font-black">{stats?.profile?.tier || "STANDARD"}</h2>
                                <p className="text-sm text-muted-foreground">
                                    Commission Rate: <span className="font-bold text-primary">{stats?.profile?.commissionRate || 10}%</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex-1 max-w-md">
                            {tierProgress.nextTier ? (
                                <>
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-sm font-medium">Progress to {tierProgress.nextTier}</p>
                                        <p className="text-sm font-bold">{tierProgress.progress}%</p>
                                    </div>
                                    <Progress value={tierProgress.progress} className="h-2" />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Earn ${Number(tierProgress.requirements?.minEarnings || 0).toLocaleString()} &amp; get {tierProgress.requirements?.minReferrals} referrals to upgrade
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm font-medium text-green-500">Congratulations! You&apos;ve reached the highest tier! 🎉</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        label: "Total Earnings", 
                        value: `$${(Number(stats?.profile?.totalEarnings) || 0).toLocaleString()}`, 
                        icon: DollarSign,
                        color: THEME_PRIMARY,
                    },
                    { 
                        label: "Available Balance", 
                        value: `$${(Number(stats?.profile?.balance) || 0).toLocaleString()}`, 
                        icon: Wallet,
                        color: THEME_SUCCESS,
                    },
                    { 
                        label: "Total Referrals", 
                        value: (stats?.profile?.totalReferrals || 0).toLocaleString(), 
                        icon: Users,
                        color: THEME_SECONDARY,
                    },
                    { 
                        label: "Conversion Rate", 
                        value: `${stats?.summary?.conversionRate || 0}%`, 
                        icon: Percent,
                        color: THEME_WARNING,
                    },
                ].map((stat, i) => (
                    <Card key={i} className="border-border/50 bg-card/50 backdrop-blur-md rounded-[32px] p-6 group hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{stat.label}</p>
                                <h4 className="text-2xl font-black">{stat.value}</h4>
                            </div>
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                style={{ backgroundColor: `${stat.color}20`, color: stat.color }}
                            >
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Referral Link & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Referral Link Card */}
                <Card className="lg:col-span-2 overflow-hidden relative group rounded-[32px] border-2" style={{ borderColor: 'rgba(99,102,241,0.2)', backgroundColor: 'rgba(99,102,241,0.03)' }}>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full pointer-events-none" style={{ backgroundColor: 'rgba(99,102,241,0.1)', filter: 'blur(60px)' }} />
                    
                    <CardHeader>
                        <CardTitle className="text-xl font-black flex items-center gap-2" style={{ color: THEME_PRIMARY }}>
                            <LinkIcon className="w-5 h-5" style={{ color: THEME_PRIMARY }} /> Your Referral Link
                        </CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'rgba(99,102,241,0.7)' }}>Share this link to earn commissions</CardDescription>
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
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
                                style={{ backgroundColor: THEME_PRIMARY }}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-background border border-border/50">
                                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Your Commission Rate</p>
                                <p className="text-2xl font-black" style={{ color: THEME_PRIMARY }}>{stats?.profile?.commissionRate || 10}%</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-background border border-border/50">
                                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Total Clicks</p>
                                <p className="text-2xl font-black">{stats?.profile?.totalClicks?.toLocaleString() || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="overflow-hidden rounded-[32px] border-border/50 bg-gradient-to-br from-card to-card/80">
                    <CardHeader>
                        <CardTitle className="text-xl font-black">Quick Actions</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-3">
                        <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                            <DialogTrigger asChild>
                                <Button 
                                    className="w-full h-14 rounded-2xl gap-2 font-bold bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/30"
                                    disabled={Number(stats?.profile?.balance || 0) <= 0}
                                >
                                    <Wallet className="w-5 h-5" /> Withdraw Funds
                                </Button>
                            </DialogTrigger>
                            
                            <DialogContent className="sm:max-w-[500px] rounded-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">Request Withdrawal</DialogTitle>
                                    <DialogDescription>
                                        Available Balance: <span className="font-bold text-primary">${Number(stats?.profile?.balance || 0).toLocaleString()}</span>
                                    </DialogDescription>
                                </DialogHeader>
                                
                                <div className="space-y-6 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                placeholder="Enter amount"
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                                className="pl-8 pr-16 h-14 rounded-2xl"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                                onClick={() => setWithdrawAmount(String(stats?.profile?.balance || 0))}
                                            >
                                                Max
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {withdrawalMethods?.map((method: any) => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => setSelectedMethod(method.id)}
                                                    className={cn(
                                                        "p-4 rounded-xl border-2 text-left transition-all",
                                                        selectedMethod === method.id 
                                                            ? "border-primary bg-primary/5" 
                                                            : "border-border hover:border-primary/30"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <GetMethodIcon icon={method.icon} />
                                                        <span className="font-bold text-sm">{method.name}</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">Min: ${method.minAmount}</p>
                                                    <p className="text-xs text-muted-foreground">{method.processingTime}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {selectedMethod && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Payment Details</label>
                                            <Input
                                                placeholder="Enter your payment details (email, wallet address, etc.)"
                                                value={paymentDetails.account || ''}
                                                onChange={(e) => setPaymentDetails({ ...paymentDetails, account: e.target.value })}
                                                className="h-12 rounded-xl"
                                            />
                                        </div>
                                    )}
                                </div>
                                
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>Cancel</Button>
                                    <Button 
                                        onClick={handleWithdraw}
                                        disabled={isWithdrawing || !withdrawAmount || !selectedMethod}
                                        className="bg-primary text-white"
                                    >
                                        {isWithdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Request Withdrawal"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button 
                            variant="outline" 
                            className="w-full h-12 rounded-2xl gap-2 font-bold"
                            onClick={() => toast.info("Marketing materials coming soon!")}
                        >
                            <Zap className="w-5 h-5" /> Marketing Materials
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Dashboard Sections */}
            <Tabs defaultValue="performance" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-fit border border-border">
                    <TabsTrigger value="performance" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8">
                        <BarChart3 className="w-4 h-4" /> Performance
                    </TabsTrigger>
                    <TabsTrigger value="commissions" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8">
                        <DollarSign className="w-4 h-4" /> Commissions
                    </TabsTrigger>
                    <TabsTrigger value="withdrawals" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8">
                        <Wallet className="w-4 h-4" /> Withdrawals
                    </TabsTrigger>
                </TabsList>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6">
                    <Card className="border-border/50 bg-card/60 backdrop-blur-md rounded-[40px] overflow-hidden p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <h3 className="text-xl font-black">Conversion Analytics</h3>
                                <p className="text-sm text-muted-foreground">Track your referral performance over time.</p>
                            </div>
                        </div>
                        
                        <div className="h-[350px] w-full">
                            {performanceData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={performanceData}>
                                        <defs>
                                            <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={THEME_SUCCESS} stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor={THEME_SUCCESS} stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorReferrals" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={THEME_SECONDARY} stopOpacity={0.2}/>
                                                <stop offset="95%" stopColor={THEME_SECONDARY} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: "#888888", fontSize: 12 }} 
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{ fill: "#888888", fontSize: 12 }} 
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'hsl(var(--card))', 
                                                borderRadius: '12px', 
                                                border: '1px solid hsl(var(--border))',
                                            }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="conversions" 
                                            stroke={THEME_SUCCESS} 
                                            strokeWidth={3} 
                                            fill="url(#colorConversions)" 
                                            name="Conversions"
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="referrals" 
                                            stroke={THEME_SECONDARY} 
                                            strokeWidth={2} 
                                            strokeDasharray="5 5"
                                            fill="url(#colorReferrals)"
                                            name="Referrals"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                                    <BarChart3 className="w-16 h-16 opacity-30" />
                                    <p className="text-sm font-medium">No data yet</p>
                                    <p className="text-xs">Share your referral link to start earning</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </TabsContent>

                {/* Commissions Tab */}
                <TabsContent value="commissions" className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search commissions..." 
                                className="pl-11 h-12 rounded-2xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px] h-12 rounded-2xl">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="cleared">Cleared</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Button variant="outline" className="h-12 rounded-2xl gap-2" onClick={handleExportCSV}>
                                <Download className="w-4 h-4" /> Export
                            </Button>
                        </div>
                    </div>

                    <Card className="border-border/50 bg-card/60 backdrop-blur-md rounded-[40px] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-muted/30 border-b border-border/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <th className="px-8 py-6">Order</th>
                                        <th className="px-8 py-6">Date</th>
                                        <th className="px-8 py-6">Amount</th>
                                        <th className="px-8 py-6">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/30">
                                    {filteredCommissions.map((tx: any) => (
                                        <tr key={tx.id} className="group hover:bg-primary/[0.02]">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                        <Zap className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-mono text-sm">#{tx.order?.id?.substring(0, 8)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-muted-foreground">
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-8 py-6 font-bold" style={{ color: THEME_SUCCESS }}>
                                                +${Number(tx.amount).toFixed(2)}
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge className={cn(
                                                    "text-[10px] font-black uppercase rounded-lg",
                                                    tx.status === "cleared" ? "bg-green-500 text-white" : 
                                                    tx.status === "pending" ? "bg-yellow-500 text-white" : 
                                                    "bg-red-500 text-white"
                                                )}>
                                                    {tx.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCommissions.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground">
                                                No commissions found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </TabsContent>

                {/* Withdrawals Tab */}
                <TabsContent value="withdrawals" className="space-y-6">
                    <div className="flex justify-end">
                        <Button variant="outline" className="rounded-2xl gap-2" onClick={handleExportWithdrawals}>
                            <Download className="w-4 h-4" /> Export History
                        </Button>
                    </div>

                    <div className="grid gap-4">
                        {(stats?.withdrawals || []).map((wr: any) => (
                            <Card key={wr.id} className="border-border/50 rounded-2xl p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                                            wr.status === "completed" ? "bg-green-500/10 text-green-500" :
                                            wr.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                                            wr.status === "processing" ? "bg-blue-500/10 text-blue-500" :
                                            "bg-red-500/10 text-red-500"
                                        )}>
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">${Number(wr.amount).toFixed(2)} {wr.method}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(wr.createdAt).toLocaleDateString()} • {wr.status}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <Badge className={cn(
                                        "text-[10px] font-black uppercase rounded-lg",
                                        wr.status === "completed" ? "bg-green-500 text-white" :
                                        wr.status === "pending" ? "bg-yellow-500 text-white" :
                                        wr.status === "processing" ? "bg-blue-500 text-white" :
                                        wr.status === "approved" ? "bg-indigo-500 text-white" :
                                        "bg-red-500 text-white"
                                    )}>
                                        {wr.status}
                                    </Badge>
                                </div>
                                
                                {wr.transactionId && (
                                    <p className="text-xs text-muted-foreground mt-3 font-mono">
                                        TX: {wr.transactionId}
                                    </p>
                                )}
                            </Card>
                        ))}
                        
                        {(!stats?.withdrawals || stats.withdrawals.length === 0) && (
                            <div className="text-center py-12 text-muted-foreground">
                                No withdrawal history found.
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Helper component for payment method icons
function GetMethodIcon({ icon }: { icon: string }) {
    const icons: Record<string, any> = {
        paypal: CreditCard,
        stripe: CreditCard,
        bank: Building2,
        crypto: Bitcoin,
        wise: Wallet,
        payoneer: CreditCard,
    };
    const IconComponent = icons[icon] || Wallet;
    return <IconComponent className="w-5 h-5" />;
}