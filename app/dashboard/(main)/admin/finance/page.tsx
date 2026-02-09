"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  History,
  Settings,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Globe,
  Zap,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Layout,
  Pencil,
  Copy,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockTransactions, mockPayouts } from "@/lib/shop-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { ShoppingBag, Users, BarChart3, Link2, CreditCard } from "lucide-react";

import { useFinance } from "@/hooks/useFinance";
import { useEffect } from "react";

export default function FinanceManagementPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [sandboxMode, setSandboxMode] = useState(false);
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutRecipient, setPayoutRecipient] = useState("");
  const [scheduleType, setScheduleType] = useState("monthly");

  const { 
    transactions, 
    payouts,
    stats, 
    config,
    isLoading, 
    fetchTransactions, 
    fetchPayouts,
    fetchStats,
    fetchConfig,
    processPayout,
    updateConfig
  } = useFinance();

  useEffect(() => {
    fetchStats();
    fetchTransactions();
    fetchPayouts();
    fetchConfig();
  }, [fetchStats, fetchTransactions, fetchPayouts, fetchConfig]);

  useEffect(() => {
    if (config) {
      setSandboxMode(config.sandboxMode);
    }
  }, [config]);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "success":
      case "paid":
      case "completed":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20 gap-2 h-7 px-3 font-black text-[9px] tracking-widest rounded-lg uppercase italic">
            <CheckCircle2 className="w-3 h-3 fill-primary" /> NODE_SETTLED
          </Badge>
        );
      case "pending":
      case "processing":
      case "scheduled":
        return (
          <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-2 h-7 px-3 font-black text-[9px] tracking-widest rounded-lg uppercase italic animate-pulse">
            <Clock className="w-3 h-3" /> {s.toUpperCase()}_QUEUE
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-2 h-7 px-3 font-black text-[9px] tracking-widest rounded-lg uppercase italic">
            <AlertCircle className="w-3 h-3" /> SIGNAL_DROP
          </Badge>
        );
      default:
        return <Badge variant="outline" className="h-7 px-3 font-black text-[9px] tracking-widest rounded-lg uppercase italic border-2">{s}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.user?.name?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.description?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.invoiceId?.toLowerCase().includes(transactionSearch.toLowerCase())
  );

  const handleDownloadStatement = () => {
    toast.info("Generating Ledger Export Protocol...");
    setTimeout(() => toast.success("Ledger Exported Successfully"), 1500);
  };

  const handleProcessPayout = () => {
    setIsPayoutDialogOpen(true);
  };

  const handleConfirmPayout = async () => {
    if (!payoutAmount || !payoutRecipient) {
      toast.error("MISSING_IDENTITY_OR_VOLUME");
      return;
    }
    const success = await processPayout({
      amount: payoutAmount,
      recipient: payoutRecipient,
    });
    if (success) {
      setIsPayoutDialogOpen(false);
      setPayoutAmount("");
      setPayoutRecipient("");
    }
  };

  const handleConfigureGateway = () => {
    toast.info("GATEWAY_SYNC_INITIATED");
  };

  const handleGatewaySettings = (name: string) => {
    toast.info(`${name.toUpperCase()}_TUNNEL_OPEN`);
  };

  const handleCustomizeInvoice = () => {
    toast.info("DESIGN_TOKEN_LOADED");
  };

  const handleEditSchedule = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleSaveSchedule = () => {
    toast.success(`CYCLE_COMMIT_SUCCESS: ${scheduleType.toUpperCase()}`);
    setIsScheduleDialogOpen(false);
  };

  const handleSaveConfig = async () => {
    const success = await updateConfig({
      sandboxMode,
    });
    if (success) {
      toast.success("SYSTEM_CFG_WRITE_SUCCESS");
    }
  };

  const handleResetDefaults = () => {
    setSandboxMode(false);
    toast.info("FACTORY_RESET_NODE_INITIATED");
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 sm:pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-[-0.05em] italic uppercase">
            Fiscal Operations
          </h1>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">
            Network Liquid Assets Management & Settlement Protocol
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Button
            variant="ghost"
            className="rounded-[1.2rem] h-12 px-6 font-black text-[10px] tracking-widest border border-border/50 hover:bg-muted/20 uppercase italic transition-all"
            onClick={handleDownloadStatement}
          >
            <Download className="w-4 h-4 mr-3" /> EXPORT_LEDGER
          </Button>
          <Button
            className="rounded-[1.2rem] h-12 px-8 font-black text-[10px] tracking-widest shadow-xl shadow-primary/20 bg-primary hover:scale-[1.02] transition-transform uppercase italic"
            onClick={handleProcessPayout}
          >
            <Plus className="w-4 h-4 mr-3" /> Payout_DISPATCH
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Liquid Reserve",
            value: stats ? `$${stats.availableBalance}` : "$0.00",
            icon: Wallet,
            color: "text-primary",
            sub: "NODE_STABLE"
          },
          {
            label: "Incoming Traffic",
            value: stats ? `$${stats.pendingSales}` : "$0.00",
            icon: Clock,
            color: "text-amber-500",
            sub: "TRANSIT_SYNC"
          },
          {
            label: "Partner Claims",
            value: stats ? `$${stats.partnerPayouts}` : "$0.00",
            icon: ArrowDownRight,
            color: "text-destructive",
            sub: "DEBIT_LOCK"
          },
          {
            label: "Gateway Status",
            value: stats?.gatewayStatus || "Verified",
            icon: ShieldCheck,
            color: "text-green-500",
            sub: "PCI_COMPLIANT"
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-border/40 bg-card/40 backdrop-blur-md shadow-sm rounded-[2rem] overflow-hidden group hover:border-primary/20 transition-all"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                {stat.label}
              </span>
              <stat.icon className={cn("h-5 w-5 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity", stat.color)} />
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
              <div className="text-2xl font-black italic tracking-tighter leading-none mb-2">
                {stat.value}
              </div>
              <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] opacity-40 italic">
                {stat.sub}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        defaultValue="overview"
        className="space-y-8"
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-muted/30 p-1.5 rounded-[1.5rem] h-16 w-fit border border-border/50 backdrop-blur-md mb-8">
          <TabsTrigger
            value="overview"
            className="rounded-xl h-full gap-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-black text-[10px] tracking-widest uppercase px-8 transition-all"
          >
            <Layout className="w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="rounded-xl h-full gap-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-black text-[10px] tracking-widest uppercase px-8 transition-all"
          >
            <History className="w-4 h-4" /> Transactions
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="rounded-xl h-full gap-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-black text-[10px] tracking-widest uppercase px-8 transition-all"
          >
            <Zap className="w-4 h-4" /> Payouts
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-xl h-full gap-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-black text-[10px] tracking-widest uppercase px-8 transition-all"
          >
            <Settings className="w-4 h-4" /> Config
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-0">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-border/40 rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md shadow-sm">
                <CardHeader className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black italic uppercase">Connected Gateways</CardTitle>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-60">Primary Payment Settlement Nodes</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border-none font-black text-[9px] tracking-widest px-4 h-7 rounded-lg uppercase italic">
                      LIVE_SYNC
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-8 pt-0">
                  {[
                    {
                      name: "Stripe",
                      status: "Connected",
                      account: "acct_1NZ...92J",
                      icon: "S",
                    },
                    {
                      name: "PayPal",
                      status: "Verified",
                      account: "payments@oftisoft.com",
                      icon: "P",
                    },
                    {
                      name: "Coinbase",
                      status: "Inactive",
                      account: "Not Configured",
                      icon: "C",
                    },
                  ].map((gateway) => (
                    <div
                      key={gateway.name}
                      className="flex items-center justify-between p-6 rounded-[2rem] border border-border/40 bg-muted/20 hover:bg-muted/30 transition-all group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-background border-2 border-border/50 flex items-center justify-center font-black text-xl text-primary shadow-inner group-hover:scale-110 transition-transform">
                          {gateway.icon}
                        </div>
                        <div>
                          <p className="font-black italic text-lg uppercase leading-none">{gateway.name}</p>
                          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mt-2 opacity-50">
                            ID: {gateway.account}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <Badge
                          variant={
                            gateway.status === "Inactive" ? "outline" : "secondary"
                          }
                          className={cn(
                            "h-8 px-4 font-black text-[9px] tracking-widest rounded-lg uppercase italic border-2 transition-all",
                            gateway.status === "Inactive"
                              ? "opacity-30"
                              : "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                          )}
                        >
                          {gateway.status === "Inactive" ? "NODE_OFFLINE" : "NODE_ACTIVE"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl hover:bg-muted"
                          onClick={() => handleGatewaySettings(gateway.name)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="bg-muted/10 border-t border-border/20 px-8 py-5">
                  <Button
                    variant="link"
                    className="text-primary font-black text-[10px] tracking-[0.2em] gap-3 p-0 h-auto uppercase italic"
                    onClick={handleConfigureGateway}
                  >
                    Configure New Gateway <Plus className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-border/40 rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md shadow-sm">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-black italic uppercase">Tax & VAT Ledger</CardTitle>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-60">Global Jurisdictional Nexus Settings</p>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-6 p-8 pt-0">
                  <div className="p-6 rounded-[2rem] border border-border/40 bg-muted/20 group hover:border-primary/20 transition-all">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-4 opacity-70">
                      Standard VAT
                    </p>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-black italic tracking-tighter text-primary">
                        20.00%
                      </span>
                      <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest h-6 px-3 rounded-md border-2">
                        EU/UK_DEFAULT
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 rounded-[2rem] border border-border/40 bg-muted/20 group hover:border-primary/20 transition-all">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-4 opacity-70">
                      US Sales Tax
                    </p>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-black italic tracking-tighter text-primary">
                        VARIABLE
                      </span>
                      <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest h-6 px-3 rounded-md border-2">
                        COMPUTED_SYNC
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-border/40 rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md shadow-sm">
                <CardHeader className="bg-primary/5 border-b border-border/20 p-6">
                  <CardTitle className="text-sm font-black italic uppercase flex items-center gap-3">
                    <FileText className="w-4 h-4 text-primary" /> Invoice_MANIFEST
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div
                    className="aspect-[3/4] rounded-[2rem] border-2 border-dashed border-border/50 flex flex-col items-center justify-center p-8 text-center bg-muted/10 hover:bg-muted/20 hover:border-primary/40 transition-all cursor-pointer group"
                    onClick={handleCustomizeInvoice}
                  >
                    <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center border-2 border-border shadow-lg group-hover:scale-110 transition-transform mb-4">
                      <Pencil className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-widest italic">Standard_DESIGN</p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-2 opacity-50 uppercase">
                      REF: 2026_V1.PDF
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-6 rounded-xl h-11 font-black text-[10px] tracking-widest uppercase italic border-2"
                    onClick={handleCustomizeInvoice}
                  >
                    MOD_DESIGN_CORE
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/40 rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md shadow-sm">
                <CardHeader className="p-6">
                  <CardTitle className="text-sm font-black italic uppercase flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Security_PROTOCOL
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 px-6 pb-6 pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Settlement_LAG</span>
                    <span className="text-xs font-black italic tracking-widest uppercase">3-5_CYCLES</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">FX_SYNC_CHANNEL</span>
                    <div className="flex items-center gap-2 text-primary font-black text-[10px] tracking-widest italic uppercase">
                      <Globe className="w-3 h-3 animate-spin-slow" /> LIVE_PULSE
                    </div>
                  </div>
                  <Separator className="bg-border/30" />
                  <p className="text-[9px] font-black text-muted-foreground italic leading-relaxed uppercase tracking-wider opacity-60">
                    PCI-DSS Level 1 Compliant. Assets encrypted via Quantum-Grade Protocol. Managed by Tier-1 Fiscal Nodes.
                  </p>
                </CardContent>
              </Card>

              {/* Related pages */}
              <Card className="border-border/40 rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md shadow-sm">
                <CardHeader className="p-6">
                  <CardTitle className="text-sm font-black italic uppercase flex items-center gap-3">
                    <Link2 className="w-4 h-4 text-primary" /> Cross_LINKS
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 pt-0 space-y-3">
                  {[
                    { href: "/dashboard/orders", icon: ShoppingBag, label: "Orders", sub: "TXN_MAPPING" },
                    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics", sub: "REV_METRICS" },
                    { href: "/dashboard/affiliate", icon: Zap, label: "Affiliate", sub: "PAY_COMM" },
                    { href: "/dashboard/admin/users", icon: Users, label: "Entities", sub: "CUST_SYNC" },
                    { href: "/dashboard/settings/billing", icon: CreditCard, label: "Billing", sub: "METHOD_CFG" },
                    { href: "/dashboard/billing/invoices", icon: FileText, label: "Invoices", sub: "PDF_VAULT" },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-4 p-4 rounded-[1.2rem] border border-border/40 bg-muted/10 hover:bg-primary/5 hover:border-primary/20 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                        <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase italic tracking-widest">{link.label}</p>
                      </div>
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 italic transition-opacity">
                        {link.sub}
                      </span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6 mt-0">
          <Card className="border-border/40 rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md shadow-sm">
            <CardHeader className="p-8 border-b border-border/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6">
              <div className="relative flex-1 max-w-full sm:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="SEARCH_LEDGER_BY_HASH_OR_IDENTITY..."
                  className="pl-12 h-12 rounded-xl bg-muted/20 border-border/40 font-black text-[10px] tracking-widest uppercase italic"
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-xl h-12 px-6 gap-3 font-black text-[10px] tracking-widest uppercase italic border-2"
                    >
                      <Filter className="w-4 h-4" /> Filter_SIGNAL
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                    <DropdownMenuItem className="rounded-lg font-black text-[10px] uppercase tracking-widest py-3 italic">
                      Filter by Status
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg font-black text-[10px] uppercase tracking-widest py-3 italic">
                      Filter by Date
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg font-black text-[10px] uppercase tracking-widest py-3 italic">
                      Filter by Amount
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/10 border-b border-border/20">
                      <TableHead className="px-8 h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic">Hash_REF</TableHead>
                      <TableHead className="h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic">Entity</TableHead>
                      <TableHead className="hidden md:table-cell h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic">Description</TableHead>
                      <TableHead className="h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic">Signal_TYPE</TableHead>
                      <TableHead className="h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic text-primary">Value</TableHead>
                      <TableHead className="h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic">Pulse</TableHead>
                      <TableHead className="text-right w-[80px] pr-8 h-14"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((txn) => (
                      <TableRow
                        key={txn.id}
                        className="group hover:bg-primary/5 border-b border-border/10 transition-colors"
                      >
                        <TableCell className="px-8 py-5 font-mono text-[10px] font-black text-muted-foreground tracking-widest">
                          {txn.id.substring(0, 12).toUpperCase()}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/dashboard/admin/users/${txn.user?.id}`}
                            className="flex flex-col group/link"
                          >
                            <span className="text-sm font-black italic uppercase tracking-tight group-hover/link:text-primary transition-colors">
                              {txn.user?.name || "SYSTEM_PROTOCOL"}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground opacity-50">
                              {txn.user?.email || "SYSTEM_CORE"}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hidden md:table-cell max-w-[200px] truncate opacity-60">
                          {txn.type || txn.description}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="h-6 px-3 font-black text-[8px] tracking-widest rounded-md uppercase italic border-2 bg-muted/20"
                          >
                            {txn.invoiceId ? "LEDGER_INV" : "EXT_SETTLE"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-black text-sm italic tracking-tighter text-primary">
                          {txn.amount}
                        </TableCell>
                        <TableCell>{getStatusBadge(txn.status)}</TableCell>
                        <TableCell className="text-right pr-8">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl opacity-40 group-hover:opacity-100 transition-all hover:bg-muted"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl p-2">
                              <DropdownMenuItem asChild className="rounded-lg font-black text-[10px] uppercase tracking-widest py-3 italic">
                                <Link href="/dashboard/orders">
                                  <Eye className="w-4 h-4 mr-3" /> Inspect Order
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="rounded-lg font-black text-[10px] uppercase tracking-widest py-3 italic"
                                onClick={() => {
                                  navigator.clipboard.writeText(txn.id);
                                  toast.success("ID_COPIED_TO_CLIPBOARD");
                                }}
                              >
                                <Copy className="w-4 h-4 mr-3" /> Capture Hash
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-8 mt-0">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-border/40 rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md shadow-sm">
                <CardHeader className="p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <CardTitle className="text-2xl font-black italic uppercase">Partner Payout Ledger</CardTitle>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-60">Disbursement History for External Nodes</p>
                    </div>
                    <Button variant="ghost" className="rounded-xl h-12 px-6 gap-3 font-black text-[10px] tracking-widest uppercase italic border-2" asChild>
                      <Link href="/dashboard/affiliate">
                        <Zap className="w-4 h-4" /> Affiliate_HUB
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/10 border-b border-border/20">
                          <TableHead className="px-8 h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic">PAY_ID</TableHead>
                          <TableHead className="h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic">Identity</TableHead>
                          <TableHead className="h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic">Class</TableHead>
                          <TableHead className="hidden sm:table-cell h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic">Timestamp</TableHead>
                          <TableHead className="h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic text-primary">Volume</TableHead>
                          <TableHead className="h-14 font-black text-[10px] uppercase tracking-[0.2em] opacity-50 italic">Pulse</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payouts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 italic">
                                NO_SIGNAL_DATA_FOUND
                            </TableCell>
                          </TableRow>
                        ) : (
                          payouts.map((p) => (
                            <TableRow key={p.id} className="border-b border-border/10 hover:bg-primary/5 transition-colors">
                              <TableCell className="px-8 py-5 font-mono text-[10px] font-black text-muted-foreground tracking-widest">
                                {p.id.toUpperCase()}
                              </TableCell>
                              <TableCell className="text-sm font-black italic uppercase tracking-tight">
                                <Link
                                  href="/dashboard/affiliate"
                                  className="hover:text-primary transition-colors"
                                >
                                  {p.recipient}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className="h-6 px-3 font-black text-[8px] tracking-widest rounded-md uppercase italic border-2 border-primary/20 text-primary"
                                >
                                  {p.type.toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-[10px] font-black text-muted-foreground hidden sm:table-cell uppercase tracking-widest opacity-60">
                                {p.date}
                              </TableCell>
                              <TableCell className="font-black text-sm italic tracking-tighter text-primary">
                                ${p.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>{getStatusBadge(p.status)}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="border-border/40 rounded-[2.5rem] overflow-hidden bg-primary/5 backdrop-blur-md shadow-sm">
                <CardHeader className="p-8">
                  <CardTitle className="text-lg font-black italic uppercase">Payout_CONFIG</CardTitle>
                </CardHeader>
                <CardContent className="space-y-10 p-8 pt-0">
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">
                      Minimal_THRESHOLD
                    </Label>
                    <div className="flex items-end gap-3 font-black italic tracking-tighter">
                      <span className="text-3xl text-primary">$100.00</span>
                      <span className="text-[10px] mb-1 uppercase tracking-widest opacity-40">USD_UNIT</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60">
                      Disbursement_CYCLE
                    </Label>
                    <p className="text-sm font-black uppercase italic tracking-tight">
                      1st and 15th of every cycle
                    </p>
                  </div>
                  <Button
                    className="w-full rounded-[1.2rem] h-14 font-black text-[10px] tracking-widest uppercase italic shadow-xl shadow-primary/10"
                    onClick={handleEditSchedule}
                  >
                    MOD_CYCLE_PROTOCOL
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Settings/Config Tab */}
        <TabsContent value="settings" className="space-y-8 mt-0">
          <Card className="border-border/40 rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md shadow-sm">
            <CardHeader className="p-8 border-b border-border/20">
              <CardTitle className="text-2xl font-black italic uppercase">Fiscal_PROTOCOL_CFG</CardTitle>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-60">System-wide Financial Governance & Gateway Controls</p>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 p-6 rounded-[2rem] border border-border/40 bg-muted/10">
                <div className="space-y-2">
                  <h4 className="text-sm font-black uppercase italic tracking-widest">GATEWAY_SANDBOX_MODE</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                    Toggle simulation layer for payment verification nodes.
                  </p>
                </div>
                <div className="flex items-center gap-6 bg-background/50 p-3 rounded-2xl border border-border/50">
                  <Switch
                    checked={sandboxMode}
                    onCheckedChange={setSandboxMode}
                    className="data-[state=checked]:bg-amber-500"
                  />
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-black text-[9px] tracking-[0.2em] px-4 h-7 rounded-lg uppercase italic border-2 transition-all",
                      sandboxMode
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        : "bg-muted/10 text-muted-foreground border-border/50 opacity-40"
                    )}
                  >
                    {sandboxMode ? "SIM_ACTIVE" : "LIVE_PULSE"}
                  </Badge>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60 ml-2">Audit_INTERVAL</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger className="h-14 rounded-[1.2rem] bg-muted/20 border-border/40 font-black text-[10px] tracking-widest uppercase italic border-2">
                      <SelectValue placeholder="Precision" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl p-2 font-black text-[10px] uppercase italic">
                      <SelectItem value="realtime">REAL_TIME_SYNC</SelectItem>
                      <SelectItem value="hourly">HOURLY_BATCH</SelectItem>
                      <SelectItem value="daily">DAILY_SETTLE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground opacity-60 ml-2">Base_CURRENCY</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="h-14 rounded-[1.2rem] bg-muted/20 border-border/40 font-black text-[10px] tracking-widest uppercase italic border-2">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl p-2 font-black text-[10px] uppercase italic">
                      <SelectItem value="usd">USD_STABLE</SelectItem>
                      <SelectItem value="eur">EUR_ZONE</SelectItem>
                      <SelectItem value="gbp">GBP_POUND</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                variant="ghost"
                className="rounded-xl h-12 px-8 font-black text-[10px] tracking-widest uppercase italic opacity-60 hover:opacity-100"
                onClick={handleResetDefaults}
              >
                FACTORY_RESET_NODE
              </Button>
              <Button
                className="rounded-xl h-12 px-10 font-black text-[10px] tracking-widest uppercase italic shadow-xl shadow-primary/20 bg-primary hover:scale-[1.02] transition-transform"
                onClick={handleSaveConfig}
              >
                WRITE_CFG_TO_LEDGER
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Process Payout Dialog */}
      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">Disburse Liquidity</DialogTitle>
            <DialogDescription className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Initiating direct fund transfer to network participant.</DialogDescription>
          </DialogHeader>
          <div className="p-8 pt-0 space-y-8">
            <div className="p-8 rounded-[2rem] bg-primary/5 border border-primary/20 shadow-inner flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest opacity-60 mb-2">
                  AVAIL_LIQUIDITY
                </p>
                <p className="text-4xl font-black italic tracking-tighter text-primary">{stats ? `$${stats.availableBalance}` : "$0.00"}</p>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
            </div>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70">Target_IDENTITY</Label>
                    <Input 
                        placeholder="ENTITY_HASH_OR_ALIAS" 
                        className="rounded-[1.2rem] h-12 bg-background/50 border-border/50 font-black tracking-tight"
                        value={payoutRecipient}
                        onChange={(e) => setPayoutRecipient(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70">Volume_UNIT (USD)</Label>
                    <div className="relative">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-primary italic opacity-50">$</span>
                        <Input 
                            type="number" 
                            placeholder="0.00" 
                            className="rounded-[1.2rem] h-12 bg-background/50 border-border/50 font-black tracking-tight pl-10"
                            value={payoutAmount}
                            onChange={(e) => setPayoutAmount(e.target.value)}
                        />
                    </div>
                </div>
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/10 border-t border-border/20 flex gap-4">
            <Button variant="ghost" className="rounded-[1.2rem] h-12 px-6 font-black text-[10px] tracking-widest uppercase italic opacity-60 hover:opacity-100 flex-1" onClick={() => setIsPayoutDialogOpen(false)}>ABORT_DISBURSE</Button>
            <Button className="rounded-[1.2rem] h-12 px-10 font-black text-[10px] tracking-widest uppercase italic shadow-xl shadow-primary/20 bg-primary hover:scale-[1.02] transition-transform flex-1" onClick={handleConfirmPayout}>
                EXECUTE_PAYOUT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
              <Clock className="w-7 h-7 text-amber-500" />
            </div>
            <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase">Cycle_SYNC_CFG</DialogTitle>
            <DialogDescription className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">Configure automated disbursement frequency for network nodes.</DialogDescription>
          </DialogHeader>
          <div className="p-8 pt-0 space-y-8">
            <div className="grid grid-cols-2 gap-4">
                {[
                    { id: "weekly", label: "Protocol_WEEK", desc: "Mon_Cycle" },
                    { id: "biweekly", label: "Protocol_MID", desc: "1st_15th" },
                    { id: "monthly", label: "Protocol_FULL", desc: "Cycle_End" },
                    { id: "manual", label: "Protocol_MAN", desc: "On_Demand" },
                ].map((s) => (
                    <div 
                        key={s.id}
                        onClick={() => setScheduleType(s.id)}
                        className={cn(
                            "p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer group flex flex-col justify-between h-28",
                            scheduleType === s.id 
                              ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(var(--primary),0.05)]" 
                              : "bg-muted/10 border-transparent hover:bg-muted/20"
                        )}
                    >
                        <p className={cn("font-black italic text-xs uppercase tracking-tight", scheduleType === s.id ? "text-primary" : "text-muted-foreground opacity-60")}>{s.label}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40">{s.desc}</p>
                    </div>
                ))}
            </div>
            <div className="p-6 rounded-[1.2rem] bg-amber-500/5 border border-amber-500/20 text-[9px] font-black text-amber-500/70 uppercase tracking-widest leading-relaxed italic text-center">
                KYC_GATE: ALL AUTOMATED CYCLES REQUIRE VALIDATED SIGNAL NODES. 48H AUDIT WINDOW ENFORCED.
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/10 border-t border-border/20 flex gap-4">
            <Button variant="ghost" className="rounded-[1.2rem] h-12 px-6 font-black text-[10px] tracking-widest uppercase italic opacity-60 hover:opacity-100 flex-1" onClick={() => setIsScheduleDialogOpen(false)}>CANCEL_MOD</Button>
            <Button className="rounded-[1.2rem] h-12 px-10 font-black text-[10px] tracking-widest uppercase italic shadow-lg shadow-amber-500/20 bg-amber-500 text-white hover:scale-[1.02] transition-transform flex-1" onClick={handleSaveSchedule}>
                COMMIT_CYCLE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
