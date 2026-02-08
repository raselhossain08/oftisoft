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

  const { transactions, stats, isLoading, fetchTransactions, fetchStats } = useFinance();

  useEffect(() => {
    fetchStats();
    fetchTransactions();
  }, [fetchStats, fetchTransactions]);

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "success":
      case "paid":
      case "completed":
        return (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 uppercase text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </Badge>
        );
      case "pending":
      case "processing":
      case "scheduled":
        return (
          <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1 uppercase text-[10px]">
            <Clock className="w-3 h-3" /> {s}
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/10 text-red-500 border-red-500/20 gap-1 uppercase text-[10px]">
            <AlertCircle className="w-3 h-3" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="outline" className="uppercase text-[10px]">{s}</Badge>;
    }
  };

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.user?.name?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.description?.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      txn.invoiceId?.toLowerCase().includes(transactionSearch.toLowerCase())
  );

  const handleDownloadStatement = () => {
    toast.success("Statement download started", {
      description: "Your financial statement for " + new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) + " is being generated.",
    });
  };

  const handleProcessPayout = () => {
    setIsPayoutDialogOpen(true);
  };

  const handleConfirmPayout = () => {
    if (!payoutAmount || !payoutRecipient) {
      toast.error("Please fill in all payout details");
      return;
    }
    setIsPayoutDialogOpen(false);
    toast.success("Payout initiated", {
      description: `$${payoutAmount} has been queued for ${payoutRecipient}.`,
    });
    setPayoutAmount("");
    setPayoutRecipient("");
  };

  const handleConfigureGateway = () => {
    toast.info("Gateway configuration", {
      description: "Forwarding to provider setup wizard...",
    });
  };

  const handleGatewaySettings = (name: string) => {
    toast.info(`${name} settings`, {
      description: "Opening secure configuration tunnel...",
    });
  };

  const handleCustomizeInvoice = () => {
    toast.info("Invoice customizer", {
      description: "Loading design assets and brand tokens...",
    });
  };

  const handleEditSchedule = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleSaveSchedule = () => {
    setIsScheduleDialogOpen(false);
    toast.success("Payout schedule updated", {
      description: `New schedule: ${scheduleType.toUpperCase()} payouts configured.`
    });
  };

  const handleSaveConfig = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Syncing financial configurations...',
        success: 'All settings verified and saved.',
        error: 'Failed to sync settings.',
      }
    );
  };

  const handleResetDefaults = () => {
    toast.warning("Confirm Reset", {
      description: "This will revert tax policies and gateway settings.",
      action: {
        label: "Confirm",
        onClick: () => toast.success("Settings restored to factory defaults")
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 sm:pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Financial Operations
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage payment gateways, track transactions, and handle partner
            payouts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl h-10 sm:h-11 gap-2 font-bold"
            onClick={handleDownloadStatement}
          >
            <Download className="w-4 h-4" /> Download Statement
          </Button>
          <Button
            size="sm"
            className="rounded-xl h-10 sm:h-11 gap-2 font-bold"
            onClick={handleProcessPayout}
          >
            <Plus className="w-4 h-4" /> Process Payout
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Available Balance",
            value: stats ? `$${stats.availableBalance}` : "$0.00",
            icon: Wallet,
            color: "text-primary",
          },
          {
            label: "Pending Sales",
            value: stats ? `$${stats.pendingSales}` : "$0.00",
            icon: Clock,
            color: "text-orange-500",
          },
          {
            label: "Partner Payouts",
            value: stats ? `$${stats.partnerPayouts}` : "$0.00",
            icon: ArrowDownRight,
            color: "text-red-500",
          },
          {
            label: "Gateway Status",
            value: stats?.gatewayStatus || "Verified",
            icon: ShieldCheck,
            color: "text-green-500",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border-border/50 bg-card/50 backdrop-blur-sm"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground uppercase">
                {stat.label}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4 shrink-0", stat.color)} />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-lg sm:text-2xl font-black truncate">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs
        defaultValue="overview"
        className="space-y-4 sm:space-y-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-muted/50 p-1.5 rounded-xl sm:rounded-2xl h-auto sm:h-14 w-full sm:w-fit border border-border flex flex-wrap gap-1">
          <TabsTrigger
            value="overview"
            className="rounded-lg sm:rounded-xl h-10 sm:h-auto gap-2 font-bold px-4 sm:px-6 flex-1 sm:flex-initial data-[state=active]:bg-background data-[state=active]:shadow-md"
          >
            <Layout className="w-4 h-4 shrink-0" /> Overview
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="rounded-lg sm:rounded-xl h-10 sm:h-auto gap-2 font-bold px-4 sm:px-6 flex-1 sm:flex-initial data-[state=active]:bg-background data-[state=active]:shadow-md"
          >
            <History className="w-4 h-4 shrink-0" /> Transactions
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="rounded-lg sm:rounded-xl h-10 sm:h-auto gap-2 font-bold px-4 sm:px-6 flex-1 sm:flex-initial data-[state=active]:bg-background data-[state=active]:shadow-md"
          >
            <Zap className="w-4 h-4 shrink-0" /> Payouts
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="rounded-lg sm:rounded-xl h-10 sm:h-auto gap-2 font-bold px-4 sm:px-6 flex-1 sm:flex-initial data-[state=active]:bg-background data-[state=active]:shadow-md"
          >
            <Settings className="w-4 h-4 shrink-0" /> Config
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-0">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card className="border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Connected Gateways</CardTitle>
                      <CardDescription>
                        Primary payment providers for your marketplace.
                      </CardDescription>
                    </div>
                    <Badge className="bg-green-500/10 text-green-500 border-none font-bold text-[10px] w-fit">
                      LIVE
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
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
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl sm:rounded-2xl border border-border/50 bg-muted/5 hover:bg-muted/10 transition-colors"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center font-bold text-primary shrink-0">
                          {gateway.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold truncate">{gateway.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {gateway.account}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <Badge
                          variant={
                            gateway.status === "Inactive" ? "outline" : "secondary"
                          }
                          className={cn(
                            "w-fit shrink-0",
                            gateway.status === "Inactive"
                              ? "opacity-50"
                              : "bg-primary/20 text-primary border-none"
                          )}
                        >
                          {gateway.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => handleGatewaySettings(gateway.name)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="bg-muted/5 border-t border-border/50 px-4 sm:px-6 py-4">
                  <Button
                    variant="link"
                    className="text-primary font-bold text-xs gap-1 p-0 h-auto"
                    onClick={handleConfigureGateway}
                  >
                    Configure New Gateway <Plus className="w-3 h-3" />
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle>Tax & VAT Configuration</CardTitle>
                  <CardDescription>
                    Global tax rates and nexus settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4 p-4 sm:p-6 pt-0">
                  <div className="p-4 rounded-xl sm:rounded-2xl border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                      Standard VAT
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg sm:text-xl font-bold">
                        20.00%
                      </span>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        EU/UK Default
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl sm:rounded-2xl border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                      US Sales Tax
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg sm:text-xl font-bold">
                        Variable
                      </span>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        Stripe Tax Sync
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Card className="border-border/50 overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-border/50 p-4 sm:p-6">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary shrink-0" />{" "}
                    Invoice Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div
                    className="aspect-[3/4] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center p-6 sm:p-8 text-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={handleCustomizeInvoice}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-auto rounded-full bg-background flex items-center justify-center border border-border mb-3 sm:mb-4">
                      <Pencil className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold">Standard Branding</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Last updated: 2026-01-15
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 rounded-xl text-xs h-10"
                    onClick={handleCustomizeInvoice}
                  >
                    Customize Design
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500 shrink-0" />{" "}
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Payout Delay</span>
                    <span className="font-bold font-mono">3-5 Days</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Currency Sync</span>
                    <div className="flex items-center gap-1 text-green-500 font-bold">
                      <Globe className="w-3 h-3" /> Live
                    </div>
                  </div>
                  <Separator className="opacity-50" />
                  <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                    PCI-DSS Level 1 Compliant. Financial data is encrypted and
                    managed by Tier-1 providers.
                  </p>
                </CardContent>
              </Card>

              {/* Related pages – data linked with Finance */}
              <Card className="border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-primary shrink-0" /> Related
                    Pages
                  </CardTitle>
                  <CardDescription>
                    Pages that share or depend on this financial data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors group"
                  >
                    <ShoppingBag className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium">Orders</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      Transactions ↔ Orders
                    </span>
                  </Link>
                  <Link
                    href="/dashboard/analytics"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors group"
                  >
                    <BarChart3 className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium">Analytics</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      Revenue & metrics
                    </span>
                  </Link>
                  <Link
                    href="/dashboard/affiliate"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors group"
                  >
                    <Link2 className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium">Affiliate</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      Payouts ↔ Commissions
                    </span>
                  </Link>
                  <Link
                    href="/dashboard/admin/users"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors group"
                  >
                    <Users className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium">Users / Customers</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      Customers in transactions
                    </span>
                  </Link>
                  <Link
                    href="/dashboard/settings/billing"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors group"
                  >
                    <CreditCard className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium">Billing (Settings)</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      Payment methods
                    </span>
                  </Link>
                  <Link
                    href="/dashboard/billing/invoices"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:bg-muted/20 transition-colors group"
                  >
                    <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    <span className="text-sm font-medium">Invoices</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      Invoice history
                    </span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4 mt-0">
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search hash, customer..."
                  className="pl-10 h-10 rounded-xl"
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-10 gap-2 font-bold shrink-0"
                  >
                    <Filter className="w-4 h-4" /> Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => toast.info("Filter: Status")}
                  >
                    Filter by Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toast.info("Filter: Date")}
                  >
                    Filter by Date
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => toast.info("Filter: Amount")}
                  >
                    Filter by Amount
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/5">
                      <TableHead className="whitespace-nowrap">Reference</TableHead>
                      <TableHead className="whitespace-nowrap">Customer</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="whitespace-nowrap">Method</TableHead>
                      <TableHead className="whitespace-nowrap">Amount</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((txn) => (
                      <TableRow
                        key={txn.id}
                        className="group hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="font-mono text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                          {txn.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="text-sm font-bold whitespace-nowrap">
                          <Link
                            href={`/dashboard/admin/users/${txn.user?.id}`}
                            className="text-primary hover:underline"
                          >
                            {txn.user?.name || "System"}
                          </Link>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden md:table-cell max-w-[150px] truncate">
                          {txn.type || txn.description}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-[9px] font-bold uppercase h-5 px-1.5 whitespace-nowrap"
                          >
                            {txn.invoiceId ? "Invoice" : "External"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-sm text-primary whitespace-nowrap">
                          {txn.amount}
                        </TableCell>
                        <TableCell>{getStatusBadge(txn.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity lg:opacity-100 lg:group-hover:opacity-100"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href="/dashboard/orders">
                                  <Eye className="w-4 h-4" /> View related orders
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  navigator.clipboard.writeText(txn.id);
                                  toast.success("Copied to clipboard");
                                }}
                              >
                                <Copy className="w-4 h-4" /> Copy ID
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
        <TabsContent value="payouts" className="space-y-4 mt-0">
          <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="border-border/50">
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Partner Payout Records</CardTitle>
                      <CardDescription>
                        History of financial disbursements to affiliates and
                        partners.
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold shrink-0" asChild>
                      <Link href="/dashboard/affiliate">
                        <Zap className="w-4 h-4" /> Affiliate dashboard
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/5">
                          <TableHead className="whitespace-nowrap">ID</TableHead>
                          <TableHead className="whitespace-nowrap">Recipient</TableHead>
                          <TableHead className="whitespace-nowrap">Type</TableHead>
                          <TableHead className="hidden sm:table-cell">Date</TableHead>
                          <TableHead className="whitespace-nowrap">Amount</TableHead>
                          <TableHead className="whitespace-nowrap">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPayouts.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-mono text-[10px] font-bold text-muted-foreground whitespace-nowrap">
                              {p.id}
                            </TableCell>
                            <TableCell className="text-sm font-bold whitespace-nowrap">
                              <Link
                                href="/dashboard/affiliate"
                                className="text-primary hover:underline"
                              >
                                {p.recipient}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-[9px] border-primary/20 text-primary whitespace-nowrap"
                              >
                                {p.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                              {p.date}
                            </TableCell>
                            <TableCell className="font-bold text-sm text-primary whitespace-nowrap">
                              ${p.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>{getStatusBadge(p.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Card className="border-border/50 bg-primary/5">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base">Payout Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      Minimum Threshold
                    </Label>
                    <p className="text-xl font-bold text-primary">$100.00</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">
                      Payout Schedule
                    </Label>
                    <p className="text-sm font-bold">
                      1st and 15th of every month
                    </p>
                  </div>
                  <Button
                    className="w-full rounded-xl h-11 font-bold"
                    onClick={handleEditSchedule}
                  >
                    Edit Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Config Tab */}
        <TabsContent value="settings" className="space-y-6 mt-0">
          <Card className="border-border/50 max-w-2xl">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle>Global Financial Config</CardTitle>
              <CardDescription>
                Core settings for payment processing and currency.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Base Currency</Label>
                  <Input
                    id="currency"
                    value="USD - United States Dollar"
                    readOnly
                    className="rounded-xl bg-muted/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax">Default Tax Policy</Label>
                  <Input
                    id="tax"
                    value="Destination Based Taxing"
                    readOnly
                    className="rounded-xl bg-muted/20"
                  />
                </div>
              </div>
              <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">Sandbox Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Toggle test mode for payment gateways.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={sandboxMode}
                    onCheckedChange={setSandboxMode}
                  />
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-bold shrink-0",
                      sandboxMode
                        ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        : "bg-red-500/10 text-destructive border-destructive/20"
                    )}
                  >
                    {sandboxMode ? "ENABLED" : "DISABLED"}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/5 p-4 sm:p-6 flex flex-col-reverse sm:flex-row gap-2">
              <Button
                variant="outline"
                className="rounded-xl font-bold"
                onClick={handleResetDefaults}
              >
                Reset Defaults
              </Button>
              <Button
                className="rounded-xl px-8 font-bold"
                onClick={handleSaveConfig}
              >
                Save All Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Process Payout Dialog */}
      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/50">
          <DialogHeader>
            <div className="w-12 h-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">Process Payout</DialogTitle>
            <DialogDescription>
              Disburse funds to your partners or affiliates.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                AVAILABLE BALANCE
              </p>
              <p className="text-3xl font-black text-primary">{stats ? `$${stats.availableBalance}` : "$0.00"}</p>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="font-bold">Recipient Entity</Label>
                    <Input 
                        placeholder="Affiliate Name or Partner ID" 
                        className="rounded-xl h-auto"
                        value={payoutRecipient}
                        onChange={(e) => setPayoutRecipient(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-bold">Payout Amount</Label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">$</span>
                        <Input 
                            type="number" 
                            placeholder="0.00" 
                            className="rounded-xl h-auto pl-8"
                            value={payoutAmount}
                            onChange={(e) => setPayoutAmount(e.target.value)}
                        />
                    </div>
                </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" className="rounded-xl h-auto font-bold" onClick={() => setIsPayoutDialogOpen(false)}>Cancel</Button>
            <Button className="rounded-xl h-auto px-8 font-bold shadow-lg shadow-primary/20" onClick={handleConfirmPayout}>
                Confirm Disbursement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border/50">
          <DialogHeader>
            <div className="w-12 h-auto rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight">Payout Schedule</DialogTitle>
            <DialogDescription>
              Configure the automated disbursement frequency.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
                {[
                    { id: "weekly", label: "Weekly", desc: "Every Monday" },
                    { id: "biweekly", label: "Bi-Weekly", desc: "1st & 15th" },
                    { id: "monthly", label: "Monthly", desc: "Last day of month" },
                    { id: "manual", label: "Manual", desc: "On demand only" },
                ].map((s) => (
                    <div 
                        key={s.id}
                        onClick={() => setScheduleType(s.id)}
                        className={cn(
                            "p-4 rounded-2xl border-2 transition-all cursor-pointer group hover:border-primary/50",
                            scheduleType === s.id ? "bg-primary/5 border-primary shadow-sm" : "bg-muted/5 border-transparent"
                        )}
                    >
                        <p className={cn("font-bold text-sm", scheduleType === s.id && "text-primary")}>{s.label}</p>
                        <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                    </div>
                ))}
            </div>
            <div className="p-4 rounded-xl bg-muted/20 border border-border text-xs text-muted-foreground leading-relaxed italic">
                Note: Standard KYC requirements and 48h auditing window still apply to all automated schedules.
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-xl h-auto font-bold w-full sm:w-auto" onClick={() => setIsScheduleDialogOpen(false)}>Cancel</Button>
            <Button className="rounded-xl h-auto px-8 font-bold w-full sm:w-auto shadow-lg shadow-primary/20" onClick={handleSaveSchedule}>
                Update Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
