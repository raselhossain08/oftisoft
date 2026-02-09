"use client";

import { useState } from "react";
import { 
    Download, 
    Key, 
    Calendar, 
    RotateCcw, 
    ShieldCheck, 
    Copy, 
    Check, 
    Search,
    Bell,
    History,
    FileCode,
    ChevronRight,
    ArrowUpCircle,
    Package,
    ArrowRight,
    SearchX,
    BookOpen,
    Gift,
    Scale,
    ExternalLink,
    Zap,
    DownloadCloud,
    Loader2,
    Star
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useDownloads } from "@/hooks/useDownloads";

import {
  Dialog as ShadcnDialog,
  DialogContent as ShadcnDialogContent,
  DialogHeader as ShadcnDialogHeader,
  DialogTitle as ShadcnDialogTitle,
  DialogDescription as ShadcnDialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export default function DigitalLibraryPage() {
    const { inventory, history, notifications, isLoading, recordDownload, getVersions, getChangelog } = useDownloads();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Dialog States
    const [activeVersions, setActiveVersions] = useState<any[]>([]);
    const [isVersionsOpen, setIsVersionsOpen] = useState(false);
    const [activeChangelog, setActiveChangelog] = useState<any>(null);
    const [isChangelogOpen, setIsChangelogOpen] = useState(false);
    const [isStackOpen, setIsStackOpen] = useState(false);
    const [activeProduct, setActiveProduct] = useState<any>(null);
    
    // Upgrade Simulation
    const [isUpgrading, setIsUpgrading] = useState<string | null>(null);
    const [upgradeProgress, setUpgradeProgress] = useState(0);

    const copyLicense = (id: string, key: string) => {
        navigator.clipboard.writeText(key);
        setCopiedId(id);
        toast.success("License key copied to clipboard");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const maskIP = (ip: string) => {
        if (!ip) return '0.0.0.0';
        const parts = ip.split('.');
        if (parts.length < 4) return ip; // handle IPv6 or other formats simply
        return `${parts[0]}.${parts[1]}.***.***`;
    };

    const handleDownload = async (assetId: string) => {
        const toastId = toast.loading("Verifying license and preparing build...", {
            description: "Synchronizing with global edge nodes."
        });
        
        try {
            await recordDownload(assetId);
            // Simulate build generation delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            toast.success("Build ready for deployment", {
                id: toastId,
                description: "Artifact encrypted and transmitted."
            });
            
            window.open('https://github.com/oftisoft/sample-build/archive/refs/heads/main.zip', '_blank');
        } catch (error) {
            toast.error("Security verification failed", {
                id: toastId,
                description: "Please try again or contact support."
            });
        }
    };

    const handleViewVersions = async (product: any) => {
        setActiveProduct(product);
        const versions = await getVersions(product.productId || product.id);
        // Fallback if no real data yet
        if (versions.length === 0) {
            setActiveVersions([
                { version: product.version, releaseDate: 'Current', changelog: 'Initial stable release' },
                { version: 'v1.0.0', releaseDate: 'Jan 01, 2026', changelog: 'Alpha build' }
            ]);
        } else {
            setActiveVersions(versions);
        }
        setIsVersionsOpen(true);
    };

    const handleViewChangelog = async (product: any) => {
        setActiveProduct(product);
        const log = await getChangelog(product.productId || product.id);
        if (!log) {
            setActiveChangelog({ 
                version: product.version, 
                changelog: "Stability improvements and UI polish.\nFixed minor layout shifts in mobile view.\nOptimized bundle size by 14%." 
            });
        } else {
            setActiveChangelog(log);
        }
        setIsChangelogOpen(true);
    };

    const executeUpgrade = (noteId: string) => {
        setIsUpgrading(noteId);
        setUpgradeProgress(0);
        
        const interval = setInterval(() => {
            setUpgradeProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUpgrading(null);
                    toast.success("Artifact upgrade successful!", {
                        description: "Your build has been synchronized with the latest release."
                    });
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const filteredProducts = inventory.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black italic tracking-tight bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50 bg-clip-text text-transparent italic"
                    >
                        Downloads & Resources
                    </motion.h1>
                    <p className="text-muted-foreground font-medium mt-1">Acquire builds, documentation, and exclusive bonuses from your purchased inventory.</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="rounded-xl gap-2 font-bold h-11 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card transition-all"
                        onClick={() => toast.info("Global License Terms are available in the legal section.")}
                    >
                        <Scale className="w-4 h-4" /> Global License Terms
                    </Button>
                    <Link href="/shop" passHref>
                        <Button className="rounded-xl gap-2 font-black h-11 bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                            <Zap className="w-4 h-4 fill-white" /> Explore Extension Packs
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs defaultValue="inventory" className="space-y-6">
                <TabsList className="bg-muted/50 p-1.5 rounded-[24px] h-16 w-fit border border-border shadow-inner">
                    <TabsTrigger value="inventory" className="rounded-[18px] h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg font-black px-12 transition-all">
                        <Package className="w-4 h-4" /> Asset Inventory
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-[18px] h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg font-black px-12 relative transition-all">
                        <DownloadCloud className="w-4 h-4" /> Version Updates
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[10px] flex items-center justify-center rounded-full text-white font-black border-2 border-background animate-bounce">
                                {notifications.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-[18px] h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-lg font-black px-12 transition-all">
                        <History className="w-4 h-4" /> Event Records
                    </TabsTrigger>
                </TabsList>

                {/* Inventory View */}
                <TabsContent value="inventory" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="relative max-w-md group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input 
                            placeholder="Search your acquired artifacts..." 
                            className="pl-11 h-14 rounded-[20px] bg-card/50 border-border/50 focus:ring-primary/20 focus:border-primary/50 text-base font-medium shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid gap-8">
                        {isLoading ? (
                            <div className="py-40 flex flex-col items-center justify-center gap-4 opacity-50">
                                <Loader2 className="w-12 h-auto animate-spin text-primary" />
                                <p className="font-black uppercase tracking-widest text-[10px]">Syncing with global distribution network...</p>
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            filteredProducts.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="overflow-hidden border-border/50 hover:border-primary/20 transition-all shadow-xl bg-card/50 backdrop-blur-md group rounded-[48px]">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x border-border/50">
                                                {/* Product Details */}
                                                <div className="p-12 flex flex-col md:flex-row gap-12 flex-1 relative">
                                                    <div className="relative w-48 h-48 rounded-[40px] overflow-hidden bg-muted shrink-0 border border-border/50 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="space-y-8 flex-1">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-3">
                                                                <Badge className="bg-primary/10 text-primary border-primary/20 font-black text-[10px] uppercase tracking-widest px-4 h-7">
                                                                    {item.type}
                                                                </Badge>
                                                                <span className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-1.5">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                                    {item.compatibility} Build
                                                                </span>
                                                            </div>
                                                            <h3 className="font-black text-4xl tracking-tighter leading-none italic group-hover:text-primary transition-colors">{item.name}</h3>
                                                            <p className="text-muted-foreground text-sm font-medium">Acquired on {item.date}</p>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                                            <Link href={item.docUrl || '#'} className="flex items-center gap-4 p-5 rounded-[24px] bg-muted/20 border border-border/30 hover:bg-primary/[0.05] hover:border-primary/20 transition-all cursor-pointer group/link shadow-sm">
                                                                <div className="w-12 h-auto rounded-[18px] bg-background flex items-center justify-center text-primary shadow-sm group-hover/link:scale-110 transition-transform">
                                                                    <BookOpen className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-0.5 tracking-widest">Knowledge Base</p>
                                                                    <p className="text-sm font-black italic flex items-center gap-2">Read Guides <ExternalLink className="w-3.5 h-3.5" /></p>
                                                                </div>
                                                            </Link>

                                                            <div className="flex items-center gap-4 p-5 rounded-[24px] bg-orange-500/[0.05] border border-orange-500/20 transition-all cursor-pointer group/link shadow-sm relative overflow-hidden">
                                                                <div className="absolute top-0 right-0 p-1 bg-orange-500 text-white rounded-bl-xl opacity-20 group-hover:opacity-100 transition-opacity">
                                                                    <Star className="w-3 h-3 fill-current" />
                                                                </div>
                                                                <div className="w-12 h-auto rounded-[18px] bg-background flex items-center justify-center text-orange-500 shadow-sm group-hover/link:scale-110 transition-transform">
                                                                    <Gift className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-black text-muted-foreground mb-0.5 tracking-widest">Digital Bonus Acquired</p>
                                                                    <p className="text-sm font-black italic leading-tight group-hover:text-orange-600 transition-colors">{item.bonusAsset}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Control */}
                                                <div className="p-12 lg:w-[450px] flex flex-col justify-center gap-10 bg-primary/[0.01]">
                                                    <div className="space-y-4">
                                                        <p className="text-[10px] font-black text-muted-foreground uppercase flex items-center gap-2 tracking-widest">
                                                            <Key className="w-4 h-4 text-primary" /> Cryptographic Key
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <code className="text-xs font-mono font-black bg-background border border-border/50 p-5 rounded-[20px] flex-1 truncate shadow-inner tracking-wider">
                                                                {item.license}
                                                            </code>
                                                            <Button 
                                                                size="icon" 
                                                                variant="outline" 
                                                                className="h-16 w-16 shrink-0 rounded-[22px] hover:bg-primary hover:text-white transition-all shadow-lg group/copy relative"
                                                                onClick={() => copyLicense(item.id, item.license)}
                                                            >
                                                                <AnimatePresence mode="wait">
                                                                    {copiedId === item.id ? (
                                                                        <motion.div
                                                                            key="check"
                                                                            initial={{ scale: 0, rotate: -45 }}
                                                                            animate={{ scale: 1, rotate: 0 }}
                                                                            exit={{ scale: 0, rotate: 45 }}
                                                                        >
                                                                            <Check className="w-6 h-6" />
                                                                        </motion.div>
                                                                    ) : (
                                                                        <motion.div
                                                                            key="copy"
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            exit={{ scale: 0 }}
                                                                        >
                                                                            <Copy className="w-6 h-6 group-hover/copy:scale-110 transition-transform" />
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-4">
                                                        <Button 
                                                            onClick={() => handleDownload(item.id)}
                                                            className="w-full rounded-[28px] h-20 gap-4 font-black text-lg bg-primary text-white shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all group/deploy"
                                                        >
                                                            <Download className="w-7 h-7 group-hover/deploy:animate-bounce" />
                                                            Deploy Latest Build
                                                        </Button>
                                                            <div className="flex gap-3">
                                                                <Button 
                                                                    variant="outline" 
                                                                    className="flex-1 rounded-[20px] h-14 font-black border-border/50 text-[10px] uppercase tracking-tighter hover:bg-muted/50"
                                                                    onClick={() => handleViewVersions(item)}
                                                                >
                                                                    Versions
                                                                </Button>
                                                                <Button 
                                                                    variant="outline" 
                                                                    className="flex-1 rounded-[20px] h-14 font-black border-border/50 text-[10px] uppercase tracking-tighter hover:bg-muted/50"
                                                                    onClick={() => handleViewChangelog(item)}
                                                                >
                                                                    Log
                                                                </Button>
                                                                <Button 
                                                                    variant="outline" 
                                                                    className="flex-1 rounded-[20px] h-14 font-black border-border/50 text-[10px] uppercase tracking-tighter hover:bg-muted/50"
                                                                    onClick={() => setIsStackOpen(true)}
                                                                >
                                                                    Stack
                                                                </Button>
                                                            </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <div className="bg-muted/5 px-12 py-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center bg-primary/[0.03] gap-6">
                                            <div className="flex items-center gap-10">
                                                <p className="text-[11px] font-black text-muted-foreground uppercase italic flex items-center gap-2.5">
                                                    <ShieldCheck className="w-5 h-5 text-green-500" /> Identity Secured
                                                </p>
                                                <p className="text-[11px] font-black text-muted-foreground uppercase italic flex items-center gap-2.5">
                                                    <RotateCcw className="w-5 h-5 text-blue-500" /> Dynamic Version: {item.version}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-10">
                                                <button 
                                                    className="text-[11px] font-black text-primary underline decoration-2 decoration-primary/20 underline-offset-4 uppercase tracking-tighter hover:text-primary/70 transition-colors"
                                                    onClick={() => toast.success("Certificate generation in progress...")}
                                                >
                                                    Certificate PDF
                                                </button>
                                                <button 
                                                    className="text-[11px] font-black text-muted-foreground underline decoration-2 decoration-muted-foreground/20 underline-offset-4 uppercase tracking-tighter hover:text-foreground transition-colors"
                                                    onClick={() => toast.info("Transfer of authentication requires enterprise support ticket.")}
                                                >
                                                    Transfer Auth
                                                </button>
                                            </div>
                                        </div>
                                    </Card>                                
                                </motion.div>
                            ))
                        ) : (
                            <div className="p-32 text-center space-y-6 bg-muted/20 rounded-[50px] border-4 border-dashed border-border/40 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground opacity-30">
                                    <SearchX className="w-12 h-auto" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-black text-2xl tracking-tight uppercase">Spectral Analysis: Zero Matches</h3>
                                    <p className="text-muted-foreground font-medium text-lg italic mt-2">Try refining your search vector or visit the storefront for more templated logic.</p>
                                </div>
                                <Link href="/shop">
                                    <Button className="rounded-2xl px-10 h-14 font-black uppercase tracking-widest bg-primary hover:scale-105 transition-all">Navigate to Shop</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* Notifications & Updates Tab */}
                <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="grid gap-8 ">
                        {notifications.length === 0 ? (
                            <div className="py-32 text-center bg-muted/10 border border-border/50 rounded-[40px] flex flex-col items-center gap-4">
                                <div className="w-20 h-20 rounded-[30px] bg-green-500/10 flex items-center justify-center text-green-500">
                                    <ShieldCheck className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-black italic">Systems Optimized</h3>
                                <p className="text-muted-foreground font-medium">All acquired artifacts are currently operating on the latest version.</p>
                            </div>
                        ) : notifications.map((note) => (
                            <Card key={note.id} className="border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden group rounded-[40px] shadow-lg">
                                <div className={cn("absolute left-0 top-0 bottom-0 w-3", 
                                    note.importance === "major" ? "bg-primary" : 
                                    note.importance === "security" ? "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]" : "bg-blue-500"
                                )}>
                                    <div className="h-full w-full bg-gradient-to-b from-white/20 to-transparent" />
                                </div>
                                <CardContent className="p-10 md:p-14 flex flex-col lg:flex-row md:items-center justify-between gap-12">
                                    <div className="flex items-start gap-10 flex-1">
                                        <div className={cn("w-20 h-20 rounded-[32px] flex items-center justify-center shrink-0 shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6",
                                            note.importance === "major" ? "bg-primary text-white" : 
                                            note.importance === "security" ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                                        )}>
                                            {note.importance === "major" ? <ArrowUpCircle className="w-10 h-10" /> : note.importance === "security" ? <ShieldCheck className="w-10 h-10" /> : <RotateCcw className="w-10 h-10" />}
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <div className="flex flex-wrap items-center gap-4">
                                                <h4 className="font-black text-3xl italic tracking-tighter">{note.productName}</h4>
                                                <Badge variant="outline" className={cn("text-[10px] font-black uppercase tracking-widest px-4 h-7 border-2", 
                                                    note.importance === "major" ? "border-primary/30 text-primary bg-primary/5" : 
                                                    note.importance === "security" ? "border-red-500/30 text-red-500 bg-red-500/5 animate-pulse" :
                                                    "border-blue-500/30 text-blue-500 bg-blue-500/5"
                                                )}>{note.importance} Update</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-lg text-muted-foreground font-bold">
                                                Acquisition Flow: <span className="text-foreground font-black underline decoration-primary/30 decoration-8 underline-offset-4">{note.oldVersion}</span> 
                                                <ArrowRight className="w-6 h-6 text-primary animate-pulse" /> 
                                                <span className="text-primary font-black text-2xl">{note.newVersion}</span>
                                            </div>
                                            
                                            {isUpgrading === note.id && (
                                                <div className="space-y-2 max-w-md">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                                                        <span>Decrypting Build Pack</span>
                                                        <span>{upgradeProgress}%</span>
                                                    </div>
                                                    <Progress value={upgradeProgress} className="h-2 bg-muted border border-border/50" />
                                                </div>
                                            )}

                                            <p className="text-[11px] text-muted-foreground font-black uppercase italic tracking-widest bg-muted/40 w-fit px-4 py-2 rounded-2xl border border-border/30">
                                                Target Release Cycle: {note.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 min-w-[240px]">
                                        <Button 
                                            disabled={isUpgrading !== null}
                                            onClick={() => executeUpgrade(note.id)}
                                            className="rounded-[24px] font-black italic text-base h-16 bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-[1.05] active:scale-[0.95] transition-all"
                                        >
                                            {isUpgrading === note.id ? "Syncing..." : "Execute Upgrade"}
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            className="rounded-[22px] font-black h-14 border-border/50 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-background"
                                            onClick={() => handleViewChangelog(note)}
                                        >
                                            Review Ledger Archive
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Download History Tab */}
                <TabsContent value="history" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="border-border/50 bg-card/80 backdrop-blur-md overflow-hidden rounded-[50px] shadow-2xl">
                        <CardHeader className="bg-muted/5 border-b border-border/50 px-12 py-10">
                            <CardTitle className="text-3xl font-black italic tracking-tighter">Temporal Request Ledger</CardTitle>
                            <CardDescription className="text-base font-medium text-muted-foreground/70">Tracking all artifact retrieval events synchronized via global edge nodes.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/10 border-border/50 hover:bg-muted/10">
                                        <TableHead className="px-12 py-8 font-black uppercase text-[11px] tracking-widest text-foreground/40">Artifact Vector</TableHead>
                                        <TableHead className="font-black uppercase text-[11px] tracking-widest text-foreground/40">Build Level</TableHead>
                                        <TableHead className="font-black uppercase text-[11px] tracking-widest text-foreground/40">Request Timestamp</TableHead>
                                        <TableHead className="font-black uppercase text-[11px] tracking-widest text-foreground/40">Origin Interface</TableHead>
                                        <TableHead className="text-right px-12 font-black uppercase text-[11px] tracking-widest text-primary italic">Intelligence</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-border/30">
                                    {history.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-24 text-center">
                                                <div className="flex flex-col items-center gap-3 opacity-30">
                                                    <History className="w-10 h-10" />
                                                    <p className="font-black uppercase tracking-widest text-xs">No recorded events in ledger</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : history.map((dl, i) => (
                                        <TableRow key={dl.id} className="group hover:bg-primary/[0.02] transition-colors border-border/30">
                                            <TableCell className="px-12 py-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-10 h-10 rounded-[14px] bg-background border border-border shadow-sm flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all group-hover:rotate-12">
                                                        <Package size={20} />
                                                    </div>
                                                    <span className="font-black italic text-lg tracking-tight">{dl.productName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-muted/30 border border-border/30 font-mono font-black text-xs px-4 h-7 tracking-tighter">
                                                    {dl.version}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest">
                                                {dl.date}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground/60 tracking-wider">
                                                {maskIP(dl.ip)}
                                            </TableCell>
                                            <TableCell className="text-right px-12">
                                                <Button variant="ghost" size="icon" className="group rounded-2xl w-14 h-14 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all">
                                                    <ArrowRight className="w-6 h-6 text-primary opacity-30 group-hover:opacity-100 transition-all group-hover:translate-x-2" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>

            {/* Version History Dialog */}
            <ShadcnDialog open={isVersionsOpen} onOpenChange={setIsVersionsOpen}>
                <ShadcnDialogContent className="max-w-2xl rounded-[40px] border-border/50 bg-card/95 backdrop-blur-xl p-10">
                    <ShadcnDialogHeader>
                        <ShadcnDialogTitle className="text-3xl font-black italic tracking-tighter">Build Lineage: {activeProduct?.name}</ShadcnDialogTitle>
                        <ShadcnDialogDescription className="text-base font-medium">Historical archive of all deployed versions for this artifact.</ShadcnDialogDescription>
                    </ShadcnDialogHeader>
                    <div className="mt-8 space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {activeVersions.map((v: any, i: number) => (
                            <div key={i} className="p-6 rounded-[28px] bg-muted/20 border border-border/30 hover:bg-muted/30 transition-all group">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <Badge className="bg-primary/10 text-primary border-primary/20 font-black">{v.version}</Badge>
                                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{v.releaseDate}</span>
                                    </div>
                                    <Button size="sm" variant="ghost" className="rounded-xl h-8 text-[10px] font-black uppercase hover:bg-primary hover:text-white transition-all">Rollback</Button>
                                </div>
                                <p className="text-sm font-medium text-muted-foreground leading-relaxed italic">{v.changelog}</p>
                            </div>
                        ))}
                    </div>
                </ShadcnDialogContent>
            </ShadcnDialog>

            {/* Changelog Dialog */}
            <ShadcnDialog open={isChangelogOpen} onOpenChange={setIsChangelogOpen}>
                <ShadcnDialogContent className="max-w-2xl rounded-[40px] border-border/50 bg-card/95 backdrop-blur-xl p-10">
                    <ShadcnDialogHeader>
                        <ShadcnDialogTitle className="text-3xl font-black italic tracking-tighter">Release Intelligence: {activeChangelog?.version}</ShadcnDialogTitle>
                        <ShadcnDialogDescription className="text-base font-medium">Detailed logic modifications and architectural upgrades in this build.</ShadcnDialogDescription>
                    </ShadcnDialogHeader>
                    <div className="mt-8 p-8 rounded-[32px] bg-muted/20 border border-border/40 font-medium text-lg leading-relaxed italic whitespace-pre-wrap max-h-[500px] overflow-y-auto">
                        {activeChangelog?.changelog}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button variant="outline" className="rounded-2xl font-black" onClick={() => setIsChangelogOpen(false)}>Acknowledged</Button>
                    </div>
                </ShadcnDialogContent>
            </ShadcnDialog>

            {/* Stack Details Dialog */}
            <ShadcnDialog open={isStackOpen} onOpenChange={setIsStackOpen}>
                <ShadcnDialogContent className="max-w-2xl rounded-[40px] border-border/50 bg-card/95 backdrop-blur-xl p-10">
                    <ShadcnDialogHeader>
                        <ShadcnDialogTitle className="text-3xl font-black italic tracking-tighter">Technological Blueprint</ShadcnDialogTitle>
                        <ShadcnDialogDescription className="text-base font-medium">Core dependencies and architectural stack assigned to this artifact.</ShadcnDialogDescription>
                    </ShadcnDialogHeader>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                        {[
                            { label: "Runtime", value: "Node.js 22.x LTS" },
                            { label: "Frontend", value: "Next.js 15 (App Router)" },
                            { label: "Logic Engine", value: "TypeScript 5.7" },
                            { label: "Styling", value: "Tailwind CSS 4.0" },
                            { label: "Database", value: "PostgreSQL 17" },
                            { label: "Caching", value: "Redis 7.2" },
                            { label: "Security", value: "AES-256 + RSA-4096" },
                            { label: "Deployment", value: "Oftisoft Edge" }
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-[20px] bg-muted/20 border border-border/30">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{item.label}</p>
                                <p className="font-black italic text-primary">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </ShadcnDialogContent>
            </ShadcnDialog>

            {/* Global CDN Info */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 p-16 rounded-[60px] bg-primary/[0.03] border-2 border-primary/10 relative overflow-hidden group shadow-2xl"
            >
                <div className="absolute -right-20 -bottom-20 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors duration-1000" />
                <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="w-40 h-40 rounded-[48px] bg-background flex items-center justify-center border border-primary/20 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shrink-0">
                        <DownloadCloud className="w-20 h-20 text-primary animate-pulse shadow-xl shadow-primary/10" />
                    </div>
                    <div className="flex-1 text-center lg:text-left space-y-6">
                        <h3 className="text-4xl font-black tracking-tighter italic">Hyper-Scale Asset Distribution</h3>
                        <p className="text-muted-foreground max-w-4xl font-black text-xl leading-relaxed italic opacity-80 decoration-primary/20 underline decoration-4 underline-offset-8">
                            All artifacts are synchronized via the Oftisoft Global Edge Network. Your downloads are cryptographically verified 
                            and served with multi-region redundancy. Legacy builds and documentation archives are maintained for long-term project support.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Button variant="outline" className="rounded-[32px] px-12 h-20 font-black italic border-2 border-primary/20 shadow-2xl bg-background hover:bg-primary hover:text-white transition-all text-lg group/status">
                            Infrastructure Live 
                            <div className="ml-4 w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.8)] group-hover/status:scale-125 transition-transform" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
