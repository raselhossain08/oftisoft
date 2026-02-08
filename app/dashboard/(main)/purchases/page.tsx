"use client";

import { useState } from "react";
import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    Eye, 
    Download, 
    Repeat, 
    Calendar,
    ShoppingBag,
    CheckCircle2,
    Clock,
    XCircle,
    RotateCcw,
    Hash,
    ExternalLink,
    FileText,
    ChevronRight,
    X
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders } from "@/hooks/useOrders";

// Order Details Dialog
const OrderDetailsDialog = ({ isOpen, onClose, order }: any) => {
    if (!isOpen || !order) return null;
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-card w-full max-w-2xl rounded-3xl border border-border shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <div>
                        <h3 className="text-xl font-bold">Order Details</h3>
                        <p className="text-sm text-muted-foreground font-mono">#{order.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Status</p>
                            <p className="font-bold capitalize">{order.status}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Total</p>
                            <p className="font-bold text-lg">${order.total}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Payment Method</p>
                            <p className="font-bold">{order.paymentMethod}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Order Date</p>
                            <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {order.trackingNumber && (
                        <div className="bg-muted/30 p-4 rounded-xl">
                            <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Tracking Number</p>
                            <p className="font-mono text-sm font-bold">{order.trackingNumber}</p>
                        </div>
                    )}

                    {order.shippingAddress && (
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold mb-2">Shipping Address</p>
                            <div className="bg-muted/30 p-4 rounded-xl space-y-1">
                                <p className="font-bold">{order.shippingAddress.street}</p>
                                <p className="text-sm">{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                                <p className="text-sm">{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="text-xs text-muted-foreground uppercase font-bold mb-3">Items</p>
                        <div className="space-y-2">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-3 bg-muted/30 rounded-xl">
                                    <div>
                                        <p className="font-bold">{item.productName}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold">${item.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-border flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default function MyOrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    
    const { orders, isLoading, downloadInvoice, exportReport, isDownloadingInvoice, isExportingReport } = useOrders();

    const filteredOrders = orders?.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.items.some(item => item.productName.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    const activeOrders = orders?.filter(o => o.status === "processing") || [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1.5"><CheckCircle2 className="w-3 h-3" /> Delivered</Badge>;
            case "processing":
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1.5"><Clock className="w-3 h-3" /> On the Way</Badge>;
            case "pending":
                return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1.5"><Clock className="w-3 h-3" /> Preparing</Badge>;
            case "cancelled":
                return <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1.5"><XCircle className="w-3 h-3" /> Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const handleReorder = (orderId: string) => {
        toast.success(`Items from order ${orderId.substring(0, 8)} added to cart again!`);
    };

    const handleDownloadInvoice = (orderId: string) => {
        downloadInvoice(orderId);
    };

    const handleExportReport = () => {
        exportReport();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground/90">My Purchases</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-medium">Access your digital assets, track active orders, and manage invoices.</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="rounded-xl gap-2 font-bold h-11 border-border/50 bg-card/50 backdrop-blur-sm"
                        onClick={handleExportReport}
                        disabled={isExportingReport}
                    >
                        <FileText className="w-4 h-4" /> {isExportingReport ? "Exporting..." : "Export Report"}
                    </Button>
                </div>
            </div>

            {/* Tracking Quick Access */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeOrders.map(activeOrder => (
                    <Card key={activeOrder.id} className="border-primary/20 bg-primary/[0.03] shadow-lg shadow-primary/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4">
                            <Clock className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-[10px] uppercase font-black tracking-widest text-primary/60">Active Shipment</CardDescription>
                            <CardTitle className="text-lg font-black">Order #{activeOrder.id.substring(0, 8)}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold">Status: Processing</span>
                                <span className="text-muted-foreground">Estimated: 2 days</span>
                            </div>
                            <div className="h-1.5 bg-primary/10 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: "65%" }}
                                    className="h-full bg-primary"
                                />
                            </div>
                            {activeOrder.trackingNumber && (
                                <div className="flex items-center gap-2 text-[10px] font-mono bg-background/50 p-2 rounded-lg border border-border/50">
                                    <Hash className="w-3 h-3 text-primary" /> {activeOrder.trackingNumber}
                                    <ExternalLink className="w-3 h-3 ml-auto opacity-50 cursor-pointer hover:opacity-100" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}

                <Card className="border-border/50 bg-card/80 backdrop-blur-sm flex flex-col justify-center items-center p-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-sm font-bold">Need help with an order?</p>
                        <p className="text-[10px] text-muted-foreground px-4">Our support agents are available 24/7 to assist you.</p>
                    </div>
                    <Button variant="link" className="text-primary font-black text-xs p-0 h-auto">Contact Support <ChevronRight className="w-3 h-3" /></Button>
                </Card>
            </div>

            {/* Order History Table */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-md">
                <CardHeader className="bg-muted/5 border-b border-border/50 px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by order ID or product name..." 
                                className="pl-10 h-10 rounded-xl border-border/50 focus:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 font-bold border-border/50">
                                <Filter className="w-3 h-3" /> Filters
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/5 hover:bg-transparent border-border/50">
                                <TableHead className="px-6">Order</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right px-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length > 0 ? filteredOrders.map((o) => (
                                <TableRow key={o.id} className="group hover:bg-primary/[0.02] transition-colors border-border/50">
                                    <TableCell className="px-6">
                                        <span className="font-mono text-xs font-black text-primary/70">#{o.id.substring(0, 8)}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatDate(o.createdAt)}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(o.status)}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 py-2">
                                            {o.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <span className="text-sm font-bold">{item.productName}</span>
                                                    {item.downloadUrl && o.status === "completed" && (
                                                        <Badge variant="outline" className="text-[8px] h-4 px-1.5 border-green-500/30 text-green-500 bg-green-500/5 cursor-pointer hover:bg-green-500/10 transition-colors">
                                                            Download
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-black text-foreground/80">${o.total}</TableCell>
                                    <TableCell className="text-right px-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {o.status === "completed" && (
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    className="h-9 rounded-xl font-bold text-xs gap-2 bg-primary/5 text-primary hover:bg-primary/10 border-none"
                                                    onClick={() => handleReorder(o.id)}
                                                >
                                                    <Repeat className="w-3 h-3" /> Reorder
                                                </Button>
                                            )}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-border/50 backdrop-blur-xl bg-card/95">
                                                    <DropdownMenuLabel className="text-[10px] uppercase font-black tracking-widest text-muted-foreground p-3 pt-2">Order Options</DropdownMenuLabel>
                                                    <DropdownMenuItem 
                                                        className="rounded-xl flex items-center gap-3 p-3 cursor-pointer group"
                                                        onClick={() => setSelectedOrder(o)}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                            <Eye size={14} />
                                                        </div>
                                                        <span className="font-bold text-xs">View Details</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="rounded-xl flex items-center gap-3 p-3 cursor-pointer group"
                                                        onClick={() => handleDownloadInvoice(o.id)}
                                                        disabled={isDownloadingInvoice}
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-colors">
                                                            <Download size={14} />
                                                        </div>
                                                        <span className="font-bold text-xs">{isDownloadingInvoice ? "Downloading..." : "Tax Invoice (PDF)"}</span>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-border/50 my-2" />
                                                    <DropdownMenuItem className="rounded-xl flex items-center gap-3 p-3 cursor-pointer group hover:bg-destructive/10">
                                                        <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive transition-colors">
                                                            <RotateCcw size={14} />
                                                        </div>
                                                        <span className="font-bold text-xs text-destructive">Report Issue</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground text-sm font-bold">
                                        No purchase history found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="bg-muted/5 border-t border-border/50 px-6 py-4 justify-center">
                    <p className="text-[10px] text-muted-foreground font-medium italic">Showing all your purchase activities. {filteredOrders.length} order(s) found.</p>
                </CardFooter>
            </Card>

            {/* Order Details Dialog */}
            <AnimatePresence>
                {selectedOrder && (
                    <OrderDetailsDialog
                        isOpen={!!selectedOrder}
                        onClose={() => setSelectedOrder(null)}
                        order={selectedOrder}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
