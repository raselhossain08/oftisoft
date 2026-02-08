"use client";

import { useState } from "react";
import { 
    Tag, 
    Percent, 
    Plus, 
    Calendar, 
    Trash2, 
    Edit, 
    Copy, 
    Package, 
    TrendingUp, 
    Zap, 
    Search,
    Filter,
    Sparkles,
    ArrowUpRight,
    CheckIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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

import { useMarketing } from "@/hooks/useMarketing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface Coupon {
    id: string;
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    expiryDate: string;
    usageLimit?: number;
    usageCount: number;
    status: 'active' | 'expired' | 'disabled';
}

interface Bundle {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image?: string;
    products?: { id: string; name: string }[];
}

export default function PricingMarketingPage() {
    const { coupons, bundles, products, isLoading, createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus, createBundle, updateBundle, deleteBundle } = useMarketing();
    
    // Coupon Form State
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");
    const [discountType, setDiscountType] = useState("percentage");
    const [discountValue, setDiscountValue] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [usageLimit, setUsageLimit] = useState("");

    // Bundle Form State
    const [isCreateBundleOpen, setIsCreateBundleOpen] = useState(false);
    const [editingBundleId, setEditingBundleId] = useState<string | null>(null);
    const [bundleName, setBundleName] = useState("");
    const [bundleDescription, setBundleDescription] = useState("");
    const [bundlePrice, setBundlePrice] = useState("");
    const [bundleOriginalPrice, setBundleOriginalPrice] = useState("");
    const [bundleImage, setBundleImage] = useState("");
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success(`Coupon code ${code} copied!`);
    };

    const [editingId, setEditingId] = useState<string | null>(null);

    const resetCouponForm = () => {
        setEditingId(null);
        setCode("");
        setDescription("");
        setDiscountValue("");
        setExpiryDate("");
        setUsageLimit("");
        setDiscountType("percentage");
    };

    const handleCreateCoupon = async () => {
        if (!code || !description || !discountValue || !expiryDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        const data = {
            code,
            description,
            discountType,
            discountValue: Number(discountValue),
            expiryDate: new Date(expiryDate),
            usageLimit: usageLimit ? Number(usageLimit) : null,
        };

        let success;
        if (editingId) {
            success = await updateCoupon(editingId, data);
            if (success) toast.success("Coupon updated successfully");
        } else {
            success = await createCoupon(data);
        }

        if (success) {
            setIsCreateOpen(false);
            resetCouponForm();
        }
    };

    const handleEditCoupon = (coupon: Coupon) => {
        setEditingId(coupon.id);
        setCode(coupon.code);
        setDescription(coupon.description);
        setDiscountType(coupon.discountType);
        setDiscountValue(String(coupon.discountValue));
        try {
            const date = new Date(coupon.expiryDate);
            setExpiryDate(date.toISOString().split('T')[0]); 
        } catch (e) {
             setExpiryDate("");
        }
        setUsageLimit(coupon.usageLimit ? String(coupon.usageLimit) : "");
        setIsCreateOpen(true);
    };

    const handleDeployCampaign = async () => {
        const success = await createCoupon({
            code: "WEEKEND15",
            description: "Weekend Flash Sale - 15% OFF UI Kits",
            discountType: "percentage",
            discountValue: 15,
            expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
            usageLimit: 100
        });
        
        if (success) {
            toast.success("Campaign deployed successfully! 'WEEKEND15' coupon created.");
        }
    };
    
    const toggleProductSelection = (id: string) => {
        setSelectedProductIds(prev => 
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const resetBundleForm = () => {
        setEditingBundleId(null);
        setBundleName("");
        setBundleDescription("");
        setBundlePrice("");
        setBundleOriginalPrice("");
        setBundleImage("");
        setSelectedProductIds([]);
    };

    const handleCreateBundle = async () => {
        if (!bundleName || !bundleDescription || !bundlePrice || selectedProductIds.length === 0) {
            toast.error("Please fill in all required fields and select at least one product");
            return;
        }

        const data = {
            name: bundleName,
            description: bundleDescription,
            price: Number(bundlePrice),
            originalPrice: bundleOriginalPrice ? Number(bundleOriginalPrice) : null,
            image: bundleImage,
            productIds: selectedProductIds,
        };

        let success;
        if (editingBundleId) {
            success = await updateBundle(editingBundleId, data);
            if (success) toast.success("Bundle updated successfully");
        } else {
            success = await createBundle(data);
        }

        if (success) {
            setIsCreateBundleOpen(false);
            resetBundleForm();
        }
    };

    const handleEditBundle = (bundle: Bundle) => {
        setEditingBundleId(bundle.id);
        setBundleName(bundle.name);
        setBundleDescription(bundle.description);
        setBundlePrice(String(bundle.price));
        setBundleOriginalPrice(bundle.originalPrice ? String(bundle.originalPrice) : "");
        setBundleImage(bundle.image || "");
        setSelectedProductIds(bundle.products ? bundle.products.map((p: any) => p.id) : []);
        setIsCreateBundleOpen(true);
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Pricing & Marketing</h1>
                    <p className="text-muted-foreground font-medium mt-1">Boost sales with smart coupons, product bundles, and seasonal campaigns.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 rounded-xl h-11 border-border/50 bg-card/50 backdrop-blur-sm font-bold">
                        <TrendingUp className="w-4 h-4" />
                        Campaign Analytics
                    </Button>
                    <Dialog open={isCreateOpen} onOpenChange={(open) => {
                        setIsCreateOpen(open);
                        if (!open) resetCouponForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20 bg-primary h-11 font-bold text-white">
                                <Plus className="w-4 h-4" />
                                Create New Coupon
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] rounded-[32px] p-8 border-border/50 bg-card/95 backdrop-blur-xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic tracking-tight text-center">{editingId ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
                                <DialogDescription className="text-center font-medium">Define the parameters for your promotional campaign.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 mt-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Coupon Code</Label>
                                    <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SUMMER2026" className="h-12 rounded-xl font-bold uppercase" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</Label>
                                    <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Summer Sale Discount" className="h-12 rounded-xl font-medium" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Type</Label>
                                        <Select value={discountType} onValueChange={setDiscountType}>
                                            <SelectTrigger className="h-12 rounded-xl font-medium">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Value</Label>
                                        <div className="relative">
                                            <Input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="20" className="h-12 rounded-xl font-medium pl-8" />
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-xs">$</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Expiry Date</Label>
                                        <Input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="h-12 rounded-xl font-medium" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Limit (Optional)</Label>
                                        <Input type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="100" className="h-12 rounded-xl font-medium" />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter className="mt-8">
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="rounded-xl h-12 font-bold px-8">Cancel</Button>
                                <Button onClick={handleCreateCoupon} className="rounded-xl h-12 font-bold px-8 bg-primary text-white shadow-lg shadow-primary/20">Create Coupon</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Strategy Insight Bar */}
            <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8 flex flex-col lg:flex-row items-center justify-between gap-8 overflow-hidden relative group hover:border-primary/40 transition-all">
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-colors" />
                <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                    <div className="w-16 h-16 bg-primary rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-primary/30 shrink-0">
                        <Sparkles className="w-8 h-8 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="font-black text-xl italic tracking-tight">Predictive Strategy: "Weekend Flash Sale"</h3>
                        <p className="text-sm font-medium text-muted-foreground mt-1 max-w-xl leading-relaxed">Our AI suggests a 15% discount on UI Kits this weekend based on high browsing traffic patterns detected in the last 48 hours.</p>
                    </div>
                </div>
                <Button className="w-full md:w-auto rounded-2xl h-14 px-8 relative font-black italic bg-foreground text-background hover:bg-foreground/90 shadow-xl shrink-0">
                    Deploy Campaign <ArrowUpRight className="ml-2 w-4 h-4" />
                </Button>
            </div>

            <Tabs defaultValue="coupons" className="space-y-8">
                <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-fit border border-border/50">
                    <TabsTrigger value="coupons" className="rounded-xl h-12 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8 text-sm">
                        <Tag className="w-4 h-4" /> Coupons
                    </TabsTrigger>
                    <TabsTrigger value="bundles" className="rounded-xl h-12 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8 text-sm">
                        <Package className="w-4 h-4" /> Bundles
                    </TabsTrigger>
                    <TabsTrigger value="subscriptions" className="rounded-xl h-12 gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8 text-sm">
                        <Zap className="w-4 h-4" /> Subscriptions
                    </TabsTrigger>
                </TabsList>

                {/* Coupons Tab */}
                <TabsContent value="coupons" className="space-y-6">
                    <Card className="border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm rounded-[32px] shadow-sm">
                        <CardHeader className="p-6 border-b border-border/50 bg-muted/5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search coupons..." className="pl-11 h-12 rounded-2xl bg-background border-border/50 focus:ring-primary/20" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="h-10 px-4 gap-2 rounded-xl font-bold border-border/50"><Filter className="w-4 h-4" /> Filters</Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/5 hover:bg-muted/5 border-border/50">
                                        <TableHead className="w-[200px] h-12 font-black text-xs uppercase tracking-widest pl-6">Code</TableHead>
                                        <TableHead className="h-12 font-black text-xs uppercase tracking-widest">Description</TableHead>
                                        <TableHead className="h-12 font-black text-xs uppercase tracking-widest">Discount</TableHead>
                                        <TableHead className="h-12 font-black text-xs uppercase tracking-widest">Usage</TableHead>
                                        <TableHead className="h-12 font-black text-xs uppercase tracking-widest">Status</TableHead>
                                        <TableHead className="h-12 font-black text-xs uppercase tracking-widest text-right pr-6">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {coupons.map((coupon) => (
                                        <TableRow key={coupon.id} className="group hover:bg-primary/[0.02] transition-colors border-border/50">
                                            <TableCell className="pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <code className="font-mono font-black text-sm px-3 py-1.5 bg-primary/10 text-primary rounded-lg border border-primary/20 select-all tracking-wider">
                                                        {coupon.code}
                                                    </code>
                                                    <button onClick={() => handleCopyCode(coupon.code)} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-background rounded-lg transition-all border border-transparent hover:border-border/50 shadow-sm">
                                                        <Copy size={14} className="text-muted-foreground" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground/90">{coupon.description}</span>
                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5 mt-1">
                                                        <Calendar className="w-3 h-3" /> Expires {format(new Date(coupon.expiryDate), 'MMM dd, yyyy')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-2 font-black text-lg italic text-foreground/80">
                                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
                                                        <Percent className="w-4 h-4" />
                                                    </div>
                                                    {coupon.discountValue}{coupon.discountType === "percentage" ? "%" : "$"} OFF
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <div className="flex flex-col gap-2 w-32">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                                                        <span>{coupon.usageCount} Used</span>
                                                        <span className="text-muted-foreground opacity-50">{coupon.usageLimit ? `/ ${coupon.usageLimit}` : '∞'}</span>
                                                    </div>
                                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000" 
                                                            style={{ width: `${coupon.usageLimit ? (coupon.usageCount / coupon.usageLimit) * 100 : 5}%` }} 
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge 
                                                    onClick={() => toggleCouponStatus(coupon.id, coupon.status || 'active')}
                                                    className={`cursor-pointer transition-all hover:scale-105 ${
                                                    coupon.status === "active" ? "bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-600 border-none font-bold uppercase text-[10px] tracking-wider px-3 py-1" : 
                                                    "bg-muted text-muted-foreground font-bold uppercase text-[10px] tracking-wider px-3 py-1 hover:bg-muted/80"
                                                }`}>
                                                    {coupon.status || 'Active'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditCoupon(coupon)} className="h-9 w-9 rounded-xl hover:bg-background hover:shadow-sm border border-transparent hover:border-border/50"><Edit size={14} /></Button>
                                                    <Button variant="ghost" size="icon" onClick={() => deleteCoupon(coupon.id)} className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20"><Trash2 size={14} /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {coupons.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-64 text-center">
                                                <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                                                        <Tag className="w-8 h-8 opacity-20" />
                                                    </div>
                                                    <p className="font-medium">No coupons active. Create one to get started.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bundles Tab */}
                <TabsContent value="bundles">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bundles.map(bundle => (
                            <Card key={bundle.id} className="border-border/50 hover:border-primary/50 transition-all group overflow-hidden rounded-[32px] bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-lg hover:shadow-primary/5">
                                <div className="h-40 bg-muted relative overflow-hidden">
                                     {bundle.image && <img src={bundle.image} alt={bundle.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <Badge className="absolute top-4 right-4 bg-primary text-white shadow-lg shadow-primary/20 font-bold uppercase text-[10px] tracking-wider border-none">Active Bundle</Badge>
                                    <div className="absolute bottom-4 left-6 right-6">
                                        <CardTitle className="text-xl font-black italic text-white tracking-tight">{bundle.name}</CardTitle>
                                        <CardDescription className="text-xs mt-1 text-white/70 line-clamp-1 font-medium">{bundle.description}</CardDescription>
                                    </div>
                                </div>
                                <CardContent className="space-y-6 p-6">
                                    <div className="flex flex-wrap gap-2">
                                        {bundle.products && bundle.products.map((p: any) => (
                                            <Badge key={p.id} variant="secondary" className="text-[10px] h-6 px-3 bg-muted font-bold text-muted-foreground border border-border/50">{p.name}</Badge>
                                        ))}
                                    </div>
                                    <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Bundle Price</p>
                                            <div className="flex items-baseline gap-2">
                                                <p className="font-black text-2xl italic tracking-tight">${bundle.price}</p>
                                                {bundle.originalPrice && <span className="text-sm text-muted-foreground line-through decoration-destructive/50 italic font-bold">${bundle.originalPrice}</span>}
                                            </div>
                                        </div>
                                        {bundle.originalPrice && (
                                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20 font-black uppercase text-[10px] tracking-wider px-3 h-7 animate-pulse">
                                                Save ${Number(bundle.originalPrice) - Number(bundle.price)}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="p-6 pt-0 flex gap-3">
                                    <Button variant="outline" onClick={() => handleEditBundle(bundle)} className="flex-1 text-xs font-bold rounded-xl h-10 border-border/50 shadow-sm">Edit Bundle</Button>
                                    <Button variant="ghost" onClick={() => deleteBundle(bundle.id)} className="w-10 h-10 p-0 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"><Trash2 size={16} /></Button>
                                </CardFooter>
                            </Card>
                        ))}
                        
                        {/* New Bundle Dialog Trigger */}
                        <Dialog open={isCreateBundleOpen} onOpenChange={(open) => {
                            setIsCreateBundleOpen(open);
                            if (!open) resetBundleForm();
                        }}>
                            <DialogTrigger asChild>
                                <div className="border-2 border-dashed border-primary/20 rounded-[32px] flex flex-col items-center justify-center p-8 text-center bg-primary/[0.02] hover:bg-primary/[0.05] transition-all group cursor-pointer h-full min-h-[300px]">
                                    <div className="w-16 h-16 rounded-[24px] bg-background border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-primary/50 transition-all shadow-lg shadow-primary/5">
                                        <Plus className="w-8 h-8 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h4 className="font-black text-lg italic tracking-tight text-foreground/80 group-hover:text-primary transition-colors">Create New Bundle</h4>
                                    <p className="text-xs font-medium text-muted-foreground max-w-[200px] mt-2 leading-relaxed">Combine multiple assets into a high-value package to increase average order value.</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] rounded-[32px] p-8 border-border/50 bg-card/95 backdrop-blur-xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black italic tracking-tight text-center">{editingBundleId ? "Edit Bundle" : "Create Bundle"}</DialogTitle>
                                    <DialogDescription className="text-center font-medium">Combine products into a single offering.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 mt-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Bundle Name</Label>
                                        <Input value={bundleName} onChange={(e) => setBundleName(e.target.value)} placeholder="Ultimate Creator Pack" className="h-12 rounded-xl font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Description</Label>
                                        <Input value={bundleDescription} onChange={(e) => setBundleDescription(e.target.value)} placeholder="Includes all major kits + lifetime updates" className="h-12 rounded-xl font-medium" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                         <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Price ($)</Label>
                                            <Input type="number" value={bundlePrice} onChange={(e) => setBundlePrice(e.target.value)} placeholder="199" className="h-12 rounded-xl font-medium" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Original Price ($)</Label>
                                            <Input type="number" value={bundleOriginalPrice} onChange={(e) => setBundleOriginalPrice(e.target.value)} placeholder="299" className="h-12 rounded-xl font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Select Products</Label>
                                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-border/50 rounded-xl bg-background/50">
                                            {products.map(product => (
                                                <div 
                                                    key={product.id} 
                                                    onClick={() => toggleProductSelection(product.id)}
                                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${selectedProductIds.includes(product.id) ? 'bg-primary/10 border-primary/50' : 'bg-background border-border/50 hover:bg-muted/50'}`}
                                                >
                                                    <span className="text-xs font-bold truncate pr-2">{product.name}</span>
                                                    {selectedProductIds.includes(product.id) && <Badge className="h-4 w-4 p-0 rounded-full flex items-center justify-center bg-primary text-white ml-auto"><CheckIcon size={10} /></Badge>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Preview Image URL</Label>
                                        <Input value={bundleImage} onChange={(e) => setBundleImage(e.target.value)} placeholder="https://..." className="h-12 rounded-xl font-medium text-xs" />
                                    </div>
                                </div>
                                <DialogFooter className="mt-8">
                                    <Button variant="outline" onClick={() => setIsCreateBundleOpen(false)} className="rounded-xl h-12 font-bold px-8">Cancel</Button>
                                    <Button onClick={handleCreateBundle} className="rounded-xl h-12 font-bold px-8 bg-primary text-white shadow-lg shadow-primary/20">Create Bundle</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </TabsContent>

                {/* Subscriptions Tab */}
                <TabsContent value="subscriptions">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { name: "SaaS Maintenance", price: 299, interval: "mo", active: 142, icon: Zap, color: "text-blue-500", bg: "bg-blue-500/10" },
                            { name: "Enterprise Support", price: 999, interval: "mo", active: 28, icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
                            { name: "Technical Consulting", price: 1500, interval: "yr", active: 12, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
                        ].map(plan => (
                             <Card key={plan.name} className="border-border/50 group hover:border-primary/50 transition-all rounded-[32px] bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-lg overflow-hidden">
                                <div className={`h-2 w-full ${plan.bg.replace('/10', '/50')}`} />
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`p-3 rounded-2xl ${plan.bg} ${plan.color}`}>
                                            <plan.icon size={24} />
                                        </div>
                                        <Badge className="ml-auto bg-green-500/10 text-green-500 border-none text-[9px] font-black uppercase tracking-widest px-2 py-1">Growth Status</Badge>
                                    </div>
                                    <CardTitle className="text-xl font-black italic tracking-tight">{plan.name}</CardTitle>
                                    <CardDescription className="text-xs font-medium mt-1">Managed recurring service plan.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-4">
                                    <div className="flex items-baseline gap-1 mb-8">
                                        <span className="text-4xl font-black tracking-tighter">${plan.price}</span>
                                        <span className="text-sm font-bold text-muted-foreground">/{plan.interval}</span>
                                    </div>
                                    <div className="space-y-4 p-4 rounded-2xl bg-muted/50 border border-border/50">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-muted-foreground uppercase tracking-widest">Active Subs</span>
                                            <span className="font-black text-foreground">{plan.active}</span>
                                        </div>
                                        <div className="h-px bg-border/50" />
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="font-bold text-muted-foreground uppercase tracking-widest">MRR Impact</span>
                                            <span className="font-black text-primary">${(plan.price * plan.active).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-8 pt-0">
                                    <Button variant="ghost" className="w-full rounded-2xl h-12 text-xs font-bold gap-2 group border border-border/50 hover:bg-primary hover:text-white transition-all shadow-sm">
                                        Manage Plan <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Button>
                                </CardFooter>
                             </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
