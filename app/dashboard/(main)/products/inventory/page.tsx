"use client";

import { useState } from "react";
import { 
    Package, 
    AlertTriangle, 
    CheckCircle2, 
    History, 
    RefreshCw,
    Search,
    Filter,
    ArrowLeft,
    TrendingUp,
    FileCode,
    Activity,
    Download,
    Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSyncing, setIsSyncing] = useState(false);
    const { products, isLoading, stats } = useProducts();

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            toast.success("Assets synced successfully");
        }, 2000);
    };

    const handleUpdateLog = () => {
        toast.info("Update log feature coming soon");
    };

    const handleManageVersion = (productName: string) => {
        toast.info(`Version management for ${productName} coming soon`);
    };

    const handleBackupSettings = () => {
        toast.info("Backup settings coming soon");
    };

    // Calculate inventory stats
    const totalProducts = products?.length || 0;
    const digitalProducts = products?.length || 0;
    const physicalProducts = 0;
    
    // Mock data for stats that would come from backend
    const downloadHealth = 99.8;
    const totalStorage = "12.4 GB";
    const outdatedAssets = 2;
    
    // Calculate total downloads (mock calculation)
    const totalDownloads = products?.reduce((acc, p) => acc + (p.reviews * 12), 0) || 0;

    const filteredProducts = products?.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="space-y-8">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="rounded-full">
                        <Link href="/dashboard/products">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Inventory & Assets</h1>
                        <p className="text-muted-foreground">Monitor stock levels, download health, and digital asset versioning.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="gap-2 rounded-xl"
                        onClick={handleUpdateLog}
                    >
                        <History className="w-4 h-4" />
                        Update Log
                    </Button>
                    <Button 
                        className="gap-2 rounded-xl shadow-lg shadow-primary/20"
                        onClick={handleSync}
                        disabled={isSyncing}
                    >
                        <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? "Syncing..." : "Sync Assets"}
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                 <Card className="border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Download Health</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{downloadHealth}%</div>
                        <p className="text-[10px] text-green-500 font-bold mt-1">Uptime across CDN nodes</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Total Storage</CardTitle>
                        <FileCode className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{totalStorage}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Total digital asset volume</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 border-orange-500/20 bg-orange-500/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-wider text-orange-500">Alerts</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{outdatedAssets} Assets</div>
                        <p className="text-[10px] text-orange-500 font-bold mt-1">Outdated versions detected</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 overflow-hidden">
                <CardHeader className="border-b border-border/50 bg-muted/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <CardTitle>Inventory Tracking</CardTitle>
                            <div className="flex gap-1">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px]">
                                    Digital: {digitalProducts}
                                </Badge>
                                <Badge variant="secondary" className="bg-muted text-muted-foreground border-none text-[10px]">
                                    Physical: {physicalProducts}
                                </Badge>
                            </div>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search inventory..." 
                                className="pl-9 h-9 rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/10 hover:bg-transparent">
                                    <TableHead>Product Asset</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Current Version</TableHead>
                                    <TableHead>Downloads</TableHead>
                                    <TableHead>Stock/Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredProducts.map((p) => (
                                    <TableRow key={p.id} className="hover:bg-primary/5">
                                        <TableCell className="font-bold text-sm">{p.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-tighter">
                                                BUNDLE
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{p.version}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 font-bold">
                                                {p.reviews * 12}
                                                <TrendingUp className="w-3 h-3 text-green-500" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                <span className="text-xs font-medium">Available</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 rounded-lg gap-2 text-primary font-bold"
                                                onClick={() => handleManageVersion(p.name)}
                                            >
                                                Manage Vers.
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-bold">No products found</h3>
                            <p className="text-muted-foreground text-sm">Try adjusting your search query</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-lg">Storage Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { name: "Source Code (ZIP)", size: "8.2 GB", percent: 65, color: "bg-primary" },
                            { name: "Documentation & Assets", size: "3.1 GB", percent: 25, color: "bg-purple-500" },
                            { name: "Previews & Screenshots", size: "1.1 GB", percent: 10, color: "bg-blue-500" },
                        ].map((item) => (
                            <div key={item.name} className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="font-bold">{item.name}</span>
                                    <span className="text-muted-foreground">{item.size}</span>
                                </div>
                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-border/50 border-dashed bg-muted/20">
                    <CardContent className="flex flex-col items-center justify-center text-center p-12 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <RefreshCw className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">Automated Backups</h3>
                        <p className="text-sm text-muted-foreground">Your digital assets are automatically versioned and backed up to multiple S3 regions every 24 hours.</p>
                        <Button 
                            variant="outline" 
                            className="rounded-full"
                            onClick={handleBackupSettings}
                        >
                            Manage Backup Settings
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
