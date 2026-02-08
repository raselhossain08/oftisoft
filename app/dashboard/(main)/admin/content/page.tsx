"use client";

import { useState } from "react";
import { 
    Layout, 
    FileText, 
    Image as ImageIcon, 
    Search, 
    Plus, 
    MoreVertical, 
    Edit, 
    Trash2, 
    Eye, 
    Globe, 
    Zap, 
    ArrowUpRight,
    RefreshCcw,
    CheckCircle2,
    Clock,
    Monitor,
    Smartphone,
    Tablet,
    Settings,
    Layers,
    Type,
    Component,
    Save,
    ExternalLink,
    SearchCode,
    Sparkles,
    UploadCloud,
    History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger,
    DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const marketingPages = [
    { id: "home", name: "Home Landing", slug: "/", status: "published", lastEdit: "2026-02-08", views: "24.5k" },
    { id: "services", name: "Services", slug: "/services", status: "published", lastEdit: "2026-02-08", views: "18.2k" },
    { id: "features", name: "Features", slug: "/features", status: "published", lastEdit: "2026-02-07", views: "12.4k" },
    { id: "portfolio", name: "Portfolio", slug: "/portfolio", status: "published", lastEdit: "2026-02-07", views: "9.8k" },
    { id: "about", name: "About", slug: "/about", status: "published", lastEdit: "2026-02-08", views: "15.1k" },
    { id: "blog", name: "Blog", slug: "/blog", status: "published", lastEdit: "2026-02-08", views: "32.7k" },
    { id: "pricing", name: "Pricing", slug: "/pricing", status: "published", lastEdit: "2026-02-06", views: "8.4k" },
    { id: "careers", name: "Careers", slug: "/careers", status: "published", lastEdit: "2026-02-05", views: "4.2k" },
    { id: "integrations", name: "Integrations", slug: "/integrations", status: "published", lastEdit: "2026-02-07", views: "6.1k" },
    { id: "partners", name: "Partners", slug: "/partners", status: "published", lastEdit: "2026-02-04", views: "3.2k" },
    { id: "changelog", name: "Changelog", slug: "/changelog", status: "published", lastEdit: "2026-02-08", views: "2.8k" },
    { id: "contact", name: "Contact", slug: "/contact", status: "published", lastEdit: "2026-02-08", views: "5.4k" },
    { id: "support", name: "Support", slug: "/support", status: "published", lastEdit: "2026-02-08", views: "3.9k" },
    { id: "status", name: "Status", slug: "/status", status: "published", lastEdit: "2026-02-08", views: "1.2k" },
    { id: "privacy", name: "Privacy Policy", slug: "/privacy", status: "published", lastEdit: "2026-02-08", views: "1.2k" },
    { id: "terms", name: "Terms of Service", slug: "/terms", status: "published", lastEdit: "2026-02-08", views: "0.9k" },
    { id: "footer", name: "Footer (Global)", slug: "—", status: "published", lastEdit: "2026-02-08", views: "—" },
];

export default function ContentManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
    const [isSyncing, setIsSyncing] = useState(false);

    const filteredPages = marketingPages.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await toast.promise(
                new Promise(resolve => setTimeout(resolve, 2000)),
                {
                    loading: 'Synchronizing global edge nodes...',
                    success: 'All architectural sections are now live.',
                    error: 'Node propagation failed.',
                }
            );
        } finally {
            setIsSyncing(false);
        }
    };

    const handleCreatePage = () => {
        toast.info("Initializing new content node creation...", {
            description: "Opening the Dynamic Forge interface."
        });
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Oftisoft Content Forge
                    </h1>
                    <p className="text-muted-foreground font-medium mt-1">Manage all production pages, media assets, and marketing sections for the Oftisoft platform.</p>
                </div>
                <div className="flex gap-3">
                    <Button 
                        variant="outline" 
                        onClick={handleSync}
                        disabled={isSyncing}
                        className="rounded-2xl gap-2 font-black italic h-11 border-border/50 bg-card/50 backdrop-blur-sm group"
                    >
                        <RefreshCcw className={cn("w-4 h-4 text-primary transition-transform duration-500", isSyncing && "animate-spin")} />
                        {isSyncing ? "Syncing Nodes..." : "Sync All Sections"}
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="rounded-2xl gap-2 font-black italic h-11 bg-primary text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                                <Plus className="w-4 h-4" /> Create New Node
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2.5rem] p-10">
                            <DialogHeader>
                                <DialogTitle className="text-3xl font-black italic">Initialize New Page Node</DialogTitle>
                                <DialogDescription className="italic">Specify the architectural parameters for the new content node.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase italic tracking-widest text-muted-foreground">Node Name</label>
                                    <Input placeholder="e.g. Enterprise Solutions" className="h-12 rounded-2xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase italic tracking-widest text-muted-foreground">Path Segment</label>
                                    <Input placeholder="e.g. enterprise" className="h-12 rounded-2xl" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button className="w-full rounded-2xl h-14 bg-primary text-white font-black italic shadow-xl" onClick={() => {
                                    toast.success("New node initialized in the architectural matrix.");
                                }}>Construct Node</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="pages" className="space-y-8">
                <div className="flex items-center gap-4">
                    <TabsList className="bg-muted/20 backdrop-blur-xl p-1.5 rounded-[22px] h-16 w-fit border border-border/50 relative overflow-hidden shadow-2xl">
                        {[
                            { value: "pages", label: "Page Nodes", icon: FileText },
                            { value: "media", label: "Media Vault", icon: ImageIcon },
                            { value: "sections", label: "Library", icon: Layers },
                            { value: "editor", label: "Visual Forge", icon: Zap },
                        ].map((tab) => (
                            <TabsTrigger 
                                key={tab.value}
                                value={tab.value} 
                                className="relative z-10 rounded-[18px] h-13 gap-3 data-[state=active]:text-primary transition-all duration-500 font-black italic px-8 group data-[state=active]:bg-background/80 data-[state=active]:shadow-xl data-[state=active]:scale-[1.02] border border-transparent data-[state=active]:border-primary/10"
                            >
                                <tab.icon className="w-4 h-4 transition-all duration-500 group-hover:scale-110 group-data-[state=active]:scale-110 group-data-[state=active]:animate-pulse" />
                                <span className="relative">{tab.label}</span>
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary/20 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-700 blur-[4px]" />
                                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary opacity-0 group-data-[state=active]:opacity-100 transition-all duration-1000 animate-pulse delay-500 shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    
                    <div className="hidden lg:flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase italic tracking-widest text-primary/70">Visual Engine V4.2 ACTIVE</span>
                    </div>
                </div>

                {/* Pages Index */}
                <TabsContent value="pages" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative max-w-md w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Locate architectural page node..." 
                                className="pl-11 h-12 rounded-2xl bg-card/40 border-border/50 focus:ring-primary/20 backdrop-blur-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="ghost" size="sm" className="h-10 rounded-xl gap-2 font-bold text-muted-foreground italic">
                                <History size={14} /> Global History
                             </Button>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {filteredPages.map((page, idx) => (
                            <motion.div
                                key={page.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="border-border/50 bg-card/40 backdrop-blur-md hover:border-primary/30 transition-all rounded-[32px] overflow-hidden group">
                                    <CardContent className="p-8 flex items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                <Globe className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h3 className="font-black italic text-2xl group-hover:tracking-wider transition-all duration-500">{page.name}</h3>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <Badge variant="secondary" className="text-[10px] font-mono font-bold bg-muted/50 px-3 py-1 rounded-lg">
                                                        {page.slug}
                                                    </Badge>
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase px-3 py-1 border-l border-border/50 italic tracking-widest">
                                                        Cycle: {page.lastEdit}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-12">
                                            <div className="hidden lg:flex flex-col text-right">
                                                <span className="text-[10px] font-black text-muted-foreground uppercase italic tracking-widest">Engagement Matrix</span>
                                                <span className="font-black text-xl italic text-primary">{page.views}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className={cn("text-[9px] h-7 px-3 font-black uppercase tracking-[0.2em] border-none", 
                                                    page.status === "published" ? "bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : "bg-orange-500/10 text-orange-500"
                                                )}>
                                                    {page.status === "published" ? <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> : <Clock className="w-3.5 h-3.5 mr-2" />}
                                                    {page.status}
                                                </Badge>
                                                <div className="flex gap-2">
                                                    <Link href={
                                                        page.id === 'home' ? '/dashboard/admin/content/home' : 
                                                        page.id === 'about' ? '/dashboard/admin/content/about' :
                                                        `/dashboard/admin/content/${page.id}`
                                                    }>
                                                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl bg-background/50 border-border/50 hover:bg-primary hover:text-white transition-all shadow-sm">
                                                            <Edit size={18} />
                                                        </Button>
                                                    </Link>
                                                    <Button 
                                                        variant="outline" 
                                                        size="icon" 
                                                        onClick={() => toast.success(`Viewing live deployment of ${page.name}`)}
                                                        className="h-12 w-12 rounded-2xl bg-background/50 border-border/50 hover:bg-primary/10 text-primary transition-all"
                                                    >
                                                        <Eye size={18} />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl">
                                                                <MoreVertical size={18} />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/50 backdrop-blur-xl bg-background/95">
                                                            <DropdownMenuItem className="rounded-xl gap-3 font-bold italic py-3 cursor-pointer">
                                                                <SearchCode className="w-4 h-4 text-primary" /> Inspect Nodes
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-xl gap-3 font-bold italic py-3 cursor-pointer">
                                                                <Zap className="w-4 h-4 text-orange-500" /> Optimize Cache
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <DropdownMenuItem className="rounded-xl gap-3 font-bold italic py-3 cursor-pointer text-red-500 hover:bg-red-500/10" onSelect={(e) => e.preventDefault()}>
                                                                        <Trash2 className="w-4 h-4" /> Archive Node
                                                                    </DropdownMenuItem>
                                                                </DialogTrigger>
                                                                <DialogContent className="rounded-[2rem]">
                                                                    <DialogHeader>
                                                                        <DialogTitle>Deconstruct Architectural Node?</DialogTitle>
                                                                        <DialogDescription>
                                                                            This will move the "{page.name}" node to the archive. All active edge deployments will be preserved but the node will no longer be editable.
                                                                        </DialogDescription>
                                                                    </DialogHeader>
                                                                    <DialogFooter>
                                                                        <Button variant="destructive" className="rounded-xl w-full h-12" onClick={() => toast.success("Node archived.")}>Confirm Deconstruction</Button>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* Media Vault */}
                <TabsContent value="media" className="space-y-8 animate-in fade-in duration-500">
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="md:col-span-1 border-border/50 bg-card/40 backdrop-blur-md rounded-[32px] overflow-hidden">
                            <CardHeader className="p-8 border-b border-border/50">
                                <CardTitle className="text-sm font-black uppercase italic tracking-widest">Storage Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-4">
                                     <div className="flex justify-between items-end">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase italic underline decoration-primary/20">Storage Utilization</p>
                                        <p className="text-xl font-black italic">62%</p>
                                     </div>
                                     <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[62%] shadow-[0_0_10px_rgba(var(--primary),0.3)]" />
                                     </div>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: "Page Assets (PNG/JPG)", count: "124" },
                                        { label: "Vector Graphics", count: "48" },
                                        { label: "Video Assets", count: "12" },
                                    ].map((stat, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-border/50 group hover:bg-primary/5 transition-colors">
                                            <span className="text-[11px] font-bold italic">{stat.label}</span>
                                            <span className="text-xs font-black italic text-primary">{stat.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-3 border-border/50 bg-card/40 backdrop-blur-md rounded-[32px] overflow-hidden border-2 border-dashed flex flex-col items-center justify-center p-12 text-center group transition-colors hover:bg-primary/[0.02]">
                             <div className="w-full max-w-md">
                                 <ImageUpload 
                                    onChange={(url) => toast.success("Asset added to Vault Librarian.")} 
                                    className="scale-110"
                                 />
                             </div>
                             <p className="text-muted-foreground font-medium italic max-w-sm mt-8">Drag high-fidelity media artifacts here or select from global local storage nodes.</p>
                        </Card>
                     </div>
                </TabsContent>

                {/* Section Librarian */}
                <TabsContent value="sections" className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { name: "Hero Sections", count: 4, icon: Zap, color: "text-orange-500", desc: "Main entry sections for pages." },
                            { name: "Feature Grids", count: 8, icon: Layers, color: "text-blue-500", desc: "Modular grids for displaying features." },
                            { name: "Content Blocks", count: 12, icon: Type, color: "text-purple-500", desc: "Structured typographic layouts." },
                            { name: "Visual Galleries", count: 6, icon: ImageIcon, color: "text-green-500", desc: "Image and video gallery templates." },
                            { name: "Interaction Forms", count: 3, icon: Component, color: "text-indigo-500", desc: "Lead generation and contact forms." },
                            { name: "Navigation Menus", count: 2, icon: Monitor, color: "text-red-500", desc: "Header and footer navigation schemas." },
                        ].map((category, idx) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="border-border/50 bg-card/60 rounded-[40px] hover:border-primary/40 transition-all cursor-pointer group shadow-lg overflow-hidden relative">
                                    <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[40px] rounded-full opacity-10 transition-opacity group-hover:opacity-20", category.color.replace('text', 'bg'))} />
                                    <CardContent className="p-10 space-y-6">
                                        <div className={cn("w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 group-hover:shadow-2xl", category.color)}>
                                            <category.icon size={32} />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-black italic text-2xl tracking-tight">{category.name}</h4>
                                            <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">{category.desc}</p>
                                        </div>
                                        <div className="flex justify-between items-end pt-4 border-t border-border/50">
                                            <span className="text-[10px] font-black uppercase text-primary italic tracking-[0.2em]">{category.count} Templates</span>
                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </TabsContent>

                {/* Visual Forge */}
                <TabsContent value="editor" className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex flex-col xl:grid xl:grid-cols-12 gap-8">
                        {/* Editor Controls */}
                        <div className="xl:col-span-4 space-y-6">
                            <Card className="border-border/50 bg-card/80 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/50 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-black uppercase italic tracking-tighter">Forge settings</CardTitle>
                                        <CardDescription className="italic">Global visual style parameters.</CardDescription>
                                    </div>
                                    <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                </CardHeader>
                                <CardContent className="p-10 space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground italic ml-1 tracking-widest">Primary Hero Node</label>
                                        <Input defaultValue="Oftisoft - Hyper-Scale Growth" className="rounded-2xl bg-background/50 h-14 font-black italic text-lg px-6 border-border/50" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground italic ml-1 tracking-widest">Global Path Node</label>
                                        <div className="flex items-center gap-4 bg-muted/30 p-2 pl-6 rounded-2xl border border-border/50">
                                            <span className="text-lg font-black italic text-muted-foreground">/</span>
                                            <Input defaultValue="home" className="rounded-xl bg-transparent border-none h-10 font-black italic text-lg focus-visible:ring-0 px-0" />
                                        </div>
                                    </div>
                                    <div className="space-y-6 pt-6 border-t border-border/50">
                                        <div className="flex items-center justify-between p-5 rounded-[24px] bg-primary/[0.03] border border-primary/10 group hover:border-primary/30 transition-all">
                                            <div className="space-y-1">
                                                <span className="text-xs font-black italic block">Glassmorphism Mode</span>
                                                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Visual Layer Protocol</span>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-5 rounded-[24px] bg-primary/[0.03] border border-primary/10 group hover:border-primary/30 transition-all">
                                            <div className="space-y-1">
                                                <span className="text-xs font-black italic block">Motion Graphics</span>
                                                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Oftisoft Animation Engine</span>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-10 pt-0">
                                     <Button 
                                        onClick={() => toast.success("Committing visual changes to global edge nodes...")}
                                        className="w-full rounded-[24px] h-16 bg-primary text-white font-black italic shadow-2xl shadow-primary/30 text-lg gap-4 group transition-all hover:scale-[1.02]"
                                    >
                                        <Save className="w-6 h-6 transition-transform group-hover:scale-110" /> Commit Architectural Sync
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card className="border-border/50 bg-muted/10 rounded-[40px] p-8 relative overflow-hidden">
                                <div className="flex items-center gap-6">
                                    <div className="h-16 w-3 h-full bg-primary/20 rounded-full" />
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-2 italic">System Sync Status</p>
                                        <p className="text-2xl font-black italic tracking-tighter">100.0% Optimized</p>
                                        <p className="text-xs text-muted-foreground italic font-medium mt-1">Live production synchronization active.</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Preview Area */}
                        <div className="xl:col-span-8 space-y-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card/40 backdrop-blur-md p-6 rounded-[32px] border border-border/50 shadow-xl">
                                <div className="flex gap-2 bg-muted/20 backdrop-blur-md p-1.5 rounded-2xl border border-border/50 shadow-inner">
                                    {[
                                        { id: "desktop", icon: Monitor, label: "Standard" },
                                        { id: "tablet", icon: Tablet, label: "Tablet" },
                                        { id: "mobile", icon: Smartphone, label: "Neural" },
                                    ].map((mode) => (
                                        <Button 
                                            key={mode.id}
                                            variant="ghost" 
                                            className={cn(
                                                "h-11 px-4 gap-2 rounded-xl transition-all duration-500 font-black italic group",
                                                previewMode === mode.id ? "bg-background text-primary shadow-xl ring-1 ring-primary/10" : "text-muted-foreground/60 hover:bg-background/40"
                                            )}
                                            onClick={() => setPreviewMode(mode.id as any)}
                                        >
                                            <mode.icon size={16} className={cn("transition-all duration-500", previewMode === mode.id ? "scale-110 rotate-0" : "-rotate-12 group-hover:rotate-0")} />
                                            <span className="text-[10px] uppercase tracking-wider">{mode.label}</span>
                                        </Button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden md:flex flex-col text-right">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase italic tracking-widest">Latest Production Sync</span>
                                        <span className="text-[10px] font-black italic text-primary">SYNC_PROD_OK - 2M AGO</span>
                                    </div>
                                    <Button variant="ghost" className="h-12 px-6 rounded-2xl gap-3 text-xs font-black italic text-primary hover:bg-primary/5 group">
                                        Launch Full Simulator <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Button>
                                </div>
                            </div>

                            <Card className={cn(
                                "border-border/50 bg-black/[0.02] rounded-[60px] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]",
                                previewMode === "desktop" ? "w-full min-h-[700px]" : 
                                previewMode === "tablet" ? "max-w-[768px] min-h-[900px] mx-auto" : "max-w-[400px] min-h-[850px] mx-auto border-[12px] border-card shadow-2xl"
                            )}>
                                <div className="p-6 bg-card/30 backdrop-blur-md border-b border-border/30 flex items-center justify-center gap-2 relative">
                                    <div className="absolute left-8 flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-orange-500/20" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                    </div>
                                    <div className="bg-background/80 backdrop-blur-md rounded-2xl h-10 w-full max-w-md flex items-center px-6 border border-border/50 shadow-inner">
                                        <span className="text-[11px] text-muted-foreground font-mono font-bold tracking-tight">https://oftisoft.com/marketing/forge-sim</span>
                                    </div>
                                </div>
                                <div className="p-20 flex flex-col items-center justify-center min-h-[600px] text-center space-y-12">
                                     <motion.div 
                                        animate={{ rotate: [12, -12, 12] }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-primary to-purple-600 shadow-3xl shadow-primary/40 flex items-center justify-center"
                                    >
                                        <Sparkles className="w-16 h-16 text-white" />
                                    </motion.div>
                                    <div className="space-y-6 max-w-2xl px-6">
                                        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
                                            OFTISOFT FORGE
                                        </h1>
                                        <p className="text-muted-foreground text-xl md:text-2xl font-medium leading-relaxed italic">
                                            Real-time page layout simulation. Adjust stylistic parameters to preview how sections will render across different device architectures.
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-6 pt-8">
                                        <div className="h-16 w-56 rounded-[24px] bg-primary shadow-2xl shadow-primary/20 flex items-center justify-center text-white font-black italic text-lg">Primary Action</div>
                                        <div className="h-16 w-56 rounded-[24px] bg-card/50 border border-border/50 backdrop-blur-lg flex items-center justify-center font-black italic text-lg">Secondary node</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Infrastructure Insight */}
            <div className="mt-16 p-16 rounded-[70px] bg-primary/[0.03] border-2 border-primary/10 relative overflow-hidden group shadow-2xl">
                <div className="absolute -right-20 -bottom-20 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
                <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                    <div className="w-40 h-40 rounded-[50px] bg-background flex items-center justify-center border border-primary/20 shadow-3xl group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000">
                        <Monitor className="w-20 h-20 text-primary shadow-2xl shadow-primary/10" />
                    </div>
                    <div className="flex-1 text-center lg:text-left space-y-6">
                        <h3 className="text-4xl font-black tracking-tighter italic">Global Content Infrastructure</h3>
                        <p className="text-muted-foreground max-w-4xl font-black text-xl leading-relaxed italic opacity-80">
                            Enterprise-grade page management powered by the Oftisoft Edge Network. 
                            Our Headless Forge technology ensures rapid deployment cycles and optimal performance across all global regions.
                        </p>
                    </div>
                    <Button variant="outline" className="rounded-[32px] px-12 h-20 font-black italic border-2 border-primary/20 shadow-2xl bg-background hover:bg-primary hover:text-white transition-all text-xl">
                        Production Status: ACTIVE
                    </Button>
                </div>
            </div>
        </div>
    );
}
