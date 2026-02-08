"use client";

import { useState } from "react";
import { 
    Plus, 
    Search, 
    Filter, 
    MoreHorizontal, 
    Edit, 
    Trash2, 
    ExternalLink, 
    Download, 
    Upload,
    Package,
    Tag,
    Layers,
    ArrowUpRight,
    SearchX,
    FileArchive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";

export default function ProductManagementPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [isUploading, setIsUploading] = useState(false);
    
    const { products, stats, isLoading, isStatsLoading, deleteProduct, isDeleting } = useProducts(
        undefined,
        searchQuery,
        categoryFilter === "all" ? undefined : categoryFilter
    );

    const handleBulkUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            toast.success("CSV processed: 12 products imported successfully");
        }, 2000);
    };

    const filteredProducts = products || [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
                    <p className="text-muted-foreground">Manage your marketplace inventory, categories, and digital assets.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2 rounded-xl">
                                <Upload className="w-4 h-4" />
                                Bulk Upload
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
                            <DialogHeader>
                                <DialogTitle>Bulk Product Import</DialogTitle>
                                <DialogDescription>
                                    Upload a CSV file containing your product catalog. Download our template to ensure correct formatting.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="p-8 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center bg-muted/20">
                                    <FileArchive className="w-8 h-8 text-primary mb-2" />
                                    <p className="text-sm font-bold">Drop CSV here</p>
                                    <p className="text-[10px] text-muted-foreground">Maximum file size: 10MB</p>
                                </div>
                                <Button variant="link" className="text-primary text-xs h-auto p-0 underline">Download CSV Template</Button>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleBulkUpload} disabled={isUploading} className="w-full rounded-xl">
                                    {isUploading ? "Processing..." : "Start Import"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button asChild className="gap-2 rounded-xl shadow-lg shadow-primary/20">
                        <Link href="/dashboard/products/new">
                            <Plus className="w-4 h-4" />
                            Add New Product
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isStatsLoading ? "..." : stats?.totalProducts || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">+2 since yesterday</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
                        <Layers className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isStatsLoading ? "..." : stats?.activeCategories || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Across 4 main niches</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Stock/License Warnings</CardTitle>
                        <Tag className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isStatsLoading ? "..." : stats?.stockWarnings || 0}
                        </div>
                        <p className="text-xs text-muted-foreground text-orange-500 font-medium leading-none">Items need attention</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales (MTD)</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${isStatsLoading ? "..." : stats?.totalSales?.toLocaleString() || "0"}
                        </div>
                        <p className="text-xs text-green-500 font-medium">+15.2% from last month</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 overflow-hidden">
                <CardHeader className="bg-muted/20 border-b border-border/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search products, categories..." 
                                className="pl-10 h-10 rounded-xl"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2 rounded-lg">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-lg">
                                Category: All
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/10 hover:bg-transparent">
                                        <TableHead className="w-[80px]">Image</TableHead>
                                        <TableHead className="min-w-[200px]">Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((p) => (
                                        <TableRow key={p.id} className="group hover:bg-primary/5 transition-colors">
                                            <TableCell>
                                                <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border">
                                                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm leading-none mb-1">{p.name}</span>
                                                    <span className="text-[10px] text-muted-foreground uppercase font-mono">{p.slug}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px] font-medium bg-muted/50">
                                                    {p.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="font-bold text-primary">${p.price}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-medium">{p.rating}</span>
                                                    <span className="text-xs text-muted-foreground">({p.reviews})</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">Active</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/dashboard/products/${p.id}/edit`} className="flex items-center gap-2 cursor-pointer">
                                                                <Edit className="w-4 h-4" /> Edit Product
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2">
                                                            <Download className="w-4 h-4" /> Manage Assets
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2">
                                                            <ExternalLink className="w-4 h-4" /> View Live
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem 
                                                            className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                                                            onClick={() => deleteProduct(p.id)}
                                                            disabled={isDeleting}
                                                        >
                                                            <Trash2 className="w-4 h-4" /> {isDeleting ? "Deleting..." : "Delete"}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-muted/5">
                            <SearchX className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-xl font-bold">No products found</h3>
                            <p className="text-muted-foreground text-sm max-w-xs text-center">We couldn't find any products matching your search. Try adjusting your filters.</p>
                            <Button variant="link" className="mt-2 text-primary font-bold" onClick={() => setSearchQuery("")}>Clear Search</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Inventory Overview */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-xl">Inventory Status</CardTitle>
                        <CardDescription>Quick overview of labels and download availability.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "NeonStore Kit", status: "In Stock", type: "Digital" },
                            { name: "SaaS Starter", status: "Updating", type: "Digital" },
                        ].map((item) => (
                            <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    <div>
                                        <p className="text-sm font-bold">{item.name}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{item.type}</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-[10px] bg-background">{item.status}</Badge>
                            </div>
                        ))}
                        <Button asChild variant="outline" className="w-full rounded-xl">
                            <Link href="/dashboard/products/inventory">Manage Detailed Inventory</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Category Management Shortcut */}
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="text-xl">Quick Category Management</CardTitle>
                        <CardDescription>Most active marketplace categories.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { name: "Mobile Apps", count: 24 },
                            { name: "Web Templates", count: 56 },
                            { name: "AI Solutions", count: 12 },
                        ].map((cat) => (
                            <div key={cat.name} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-sm">
                                <span className="text-sm font-bold">{cat.name}</span>
                                <Badge className="rounded-full h-5 min-w-[20px] justify-center px-2">{cat.count}</Badge>
                            </div>
                        ))}
                        <Button asChild variant="outline" className="w-full rounded-xl">
                            <Link href="/dashboard/products/categories">Manage All Categories</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
