"use client";

import { useState } from "react";
import { 
    Plus, 
    Trash2, 
    MoreHorizontal,
    Megaphone,
    Search,
    Filter,
    Eye,
    MousePointer2,
    Calendar,
    Settings2,
    CheckCircle2,
    XCircle,
    Copy,
    ExternalLink,
    Image as ImageIcon,
    Code,
    Layout,
    Type
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAds } from "@/hooks/useAds";
import { AdType, AdPosition, AdSize } from "@/lib/api";
import { format } from "date-fns";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdDialog } from "@/components/ads/ad-dialog";

export default function AdsDashboardPage() {
    const { ads = [], isLoading, updateAd, deleteAd } = useAds();
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAd, setSelectedAd] = useState<any>(null);

    const filteredAds = ads.filter(ad => 
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getAdTypeIcon = (type: AdType) => {
        switch (type) {
            case AdType.IMAGE: return ImageIcon;
            case AdType.GOOGLE_ADS: return Megaphone;
            case AdType.CUSTOM_HTML: return Code;
            case AdType.SCRIPT: return Layout;
            default: return Type;
        }
    };

    const handleEdit = (ad: any) => {
        setSelectedAd(ad);
        setIsDialogOpen(true);
    };

    const handleCreate = () => {
        setSelectedAd(null);
        setIsDialogOpen(true);
    };

    const toggleStatus = (ad: any) => {
        updateAd(ad.id, { isActive: !ad.isActive });
        toast.success(`Ad ${ad.isActive ? 'deactivated' : 'activated'} successfully`);
    };

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent italic">Ad Engine</h1>
                    <p className="text-muted-foreground font-medium mt-1">Deploy and manage advertisements across your blog and platform.</p>
                </div>
                <Button onClick={handleCreate} className="gap-2 rounded-xl h-11 font-bold shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    Create New Ad
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Active Ads" 
                    value={ads.filter(a => a.isActive).length} 
                    icon={CheckCircle2} 
                    color="text-green-500" 
                />
                <StatCard 
                    title="Total Impressions" 
                    value={ads.reduce((acc, a) => acc + (a.views || 0), 0)} 
                    icon={Eye} 
                    color="text-blue-500" 
                />
                <StatCard 
                    title="Total Clicks" 
                    value={ads.reduce((acc, a) => acc + (a.clicks || 0), 0)} 
                    icon={MousePointer2} 
                    color="text-purple-500" 
                />
            </div>

            {/* Content Table */}
            <Card className="border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm rounded-[32px] shadow-sm">
                <CardHeader className="p-6 border-b border-border/50 bg-muted/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by title or position..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 h-12 rounded-2xl bg-background border-border/50 focus:ring-primary/20" 
                            />
                        </div>
                        <Button variant="outline" size="sm" className="h-10 px-4 gap-2 rounded-xl font-bold border-border/50">
                            <Filter className="w-4 h-4" /> Filters
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/5 hover:bg-muted/5 border-border/50">
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest pl-8">Ad Campaign</TableHead>
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest">Type / Size</TableHead>
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest">Position</TableHead>
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest text-center">Stats</TableHead>
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest italic">Status</TableHead>
                                <TableHead className="h-12 font-black text-xs uppercase tracking-widest text-right pr-8">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAds.map((ad) => {
                                const AdIcon = getAdTypeIcon(ad.type);
                                return (
                                    <TableRow key={ad.id} className="group hover:bg-primary/[0.02] transition-colors border-border/50">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground overflow-hidden border border-border/50 group-hover:border-primary/30 transition-colors">
                                                    {ad.type === AdType.IMAGE ? (
                                                        <img src={ad.content} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <AdIcon size={18} />
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground group-hover:text-primary transition-colors">{ad.title}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{format(new Date(ad.createdAt), 'MMM dd, yyyy')}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <AdIcon size={12} className="text-primary" />
                                                    <span className="text-xs font-black uppercase">{ad.type.replace('-', ' ')}</span>
                                                </div>
                                                <Badge variant="outline" className="w-fit text-[9px] font-bold h-5 px-1.5 opacity-60">
                                                    {ad.size}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-black uppercase tracking-widest">
                                                {ad.position.replace(/-/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-4">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xs font-black">{ad.views || 0}</span>
                                                    <span className="text-[9px] text-muted-foreground uppercase">Views</span>
                                                </div>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-xs font-black">{ad.clicks || 0}</span>
                                                    <span className="text-[9px] text-muted-foreground uppercase">Clicks</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <button 
                                                onClick={() => toggleStatus(ad)}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-1 rounded-full border transition-all",
                                                    ad.isActive 
                                                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                                                        : "bg-red-500/10 text-red-500 border-red-500/20"
                                                )}
                                            >
                                                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", ad.isActive ? "bg-green-500" : "bg-red-500")} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{ad.isActive ? 'Active' : 'Paused'}</span>
                                            </button>
                                        </TableCell>
                                        <TableCell className="text-right pr-8">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                                                        <MoreHorizontal size={16} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-border/50 bg-card/95 backdrop-blur-xl">
                                                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-2 py-1.5">Manage Ad</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEdit(ad)} className="rounded-xl gap-2 font-bold text-xs"><Settings2 size={14} /> Edit Campaign</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        navigator.clipboard.writeText(ad.content);
                                                        toast.success("Content copied to clipboard");
                                                    }} className="rounded-xl gap-2 font-bold text-xs"><Copy size={14} /> Copy Content</DropdownMenuItem>
                                                    {ad.link && (
                                                        <DropdownMenuItem onClick={() => window.open(ad.link, '_blank')} className="rounded-xl gap-2 font-bold text-xs"><ExternalLink size={14} /> Preview Link</DropdownMenuItem>
                                                    )}
                                                    <DropdownMenuSeparator className="bg-border/50" />
                                                    <DropdownMenuItem onClick={() => toggleStatus(ad)} className="rounded-xl gap-2 font-bold text-xs">
                                                        {ad.isActive ? <XCircle size={14} className="text-red-500" /> : <CheckCircle2 size={14} className="text-green-500" />}
                                                        {ad.isActive ? 'Pause Campaign' : 'Resume Campaign'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => deleteAd(ad.id)} className="rounded-xl gap-2 font-bold text-xs text-destructive"><Trash2 size={14} /> Purge record</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AdDialog 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
                ad={selectedAd} 
            />
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number | string, icon: any, color: string }) {
    return (
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-[32px] overflow-hidden group hover:border-primary/30 transition-all">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon size={20} className={cn("transition-colors", color)} />
                    </div>
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50 mb-1">{title}</p>
                    <h3 className="text-3xl font-black italic tracking-tighter italic">{value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}
