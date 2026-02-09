
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { 
    ArrowLeft, 
    Download, 
    Printer, 
    Mail, 
    Package, 
    Truck, 
    Receipt,
    ExternalLink,
    MapPin,
    CreditCard,
    RotateCcw,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

import { StatusBadge } from "@/components/orders/status-badge";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { order, isLoading, updateStatus, downloadInvoice, isDownloadingInvoice } = useOrders(id);
    const [status, setStatus] = useState<string>('');
    const [isRefunding, setIsRefunding] = useState(false);

    useEffect(() => {
        if (order) {
            setStatus(order.status);
        }
    }, [order]);

    if (isLoading) {
        return (
            <div className="space-y-8 max-w-6xl mx-auto pb-20">
                <Skeleton className="h-12 w-1/3" />
                <div className="grid lg:grid-cols-3 gap-8">
                    <Skeleton className="h-[400px] w-full lg:col-span-2" />
                    <Skeleton className="h-[200px] w-full" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <h1 className="text-2xl font-bold">Order not found</h1>
                <Button onClick={() => router.push('/dashboard/orders')}>Go Back</Button>
            </div>
        );
    }

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
        updateStatus(id, newStatus);
    };

    const handleRefund = () => {
        setIsRefunding(true);
        updateStatus(id, 'refunded');
        setTimeout(() => {
            setIsRefunding(false);
            toast.success("Refund processed successfully.");
        }, 1000);
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="rounded-full">
                        <Link href="/dashboard/orders">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black tracking-tighter">Order {order.id.substring(0, 8)}...</h1>
                            <StatusBadge status={status} className="text-base px-3 py-1" />
                        </div>
                        <p className="text-muted-foreground text-sm">Placed on {format(new Date(order.createdAt), 'PPP')} • {order.items.length} items</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button 
                        variant="outline" 
                        className="gap-2 rounded-xl h-11"
                        onClick={() => window.print()}
                    >
                        <Printer className="w-4 h-4" />
                        Print
                    </Button>
                    <Button 
                        variant="outline" 
                        className="gap-2 rounded-xl h-11"
                        onClick={() => downloadInvoice(id)}
                        disabled={isDownloadingInvoice}
                    >
                        <Download className="w-4 h-4" />
                        {isDownloadingInvoice ? "Downloading..." : "Invoice"}
                    </Button>
                    <Button className="gap-2 rounded-xl h-11 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 px-6">
                        <Mail className="w-4 h-4" />
                        Email Receipt
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items */}
                    <Card className="border-border/50">
                        <CardHeader className="bg-muted/10">
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-border/50">
                                {order.items.map((item) => (
                                    <div key={item.id} className="p-6 flex items-center justify-between group hover:bg-muted/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {item.productName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold">{item.productName}</p>
                                                <p className="text-xs text-muted-foreground uppercase font-mono">ID: {item.productId}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">${Number(item.price).toFixed(2)}</p>
                                            <p className="text-xs text-muted-foreground font-medium">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/5 block p-8">
                            <div className="space-y-3 w-full max-w-[300px] ml-auto">
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>${Number(order.total).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <span>Tax (0%)</span>
                                    <span>$0.00</span>
                                </div>
                                <Separator className="bg-border/50 my-4" />
                                <div className="flex justify-between text-xl font-black">
                                    <span>Total</span>
                                    <span className="text-primary">${Number(order.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Shipping Tracking */}
                    {order.shippingAddress && (
                        <Card className="border-border/50 border-dashed bg-primary/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-primary" />
                                    Shipping Information & Tracking
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">Carrier</p>
                                        <p className="font-bold">FedEx Priority</p>
                                        <p className="text-xs text-muted-foreground mt-4">Tracking Number</p>
                                        <Link href="#" className="font-mono text-primary font-bold hover:underline flex items-center gap-2">
                                            {order.trackingNumber || 'Pending'} <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>
                                    <div className="space-y-4">
                                         {/* Mock tracking steps based on status */}
                                        <div className="flex gap-4">
                                            <div className="shrink-0 w-8 flex flex-col items-center">
                                                <div className={`w-2 h-2 rounded-full ring-4 ${status !== 'pending' ? 'bg-primary ring-primary/20' : 'bg-muted ring-muted/20'}`} />
                                                <div className="w-0.5 h-12 bg-border" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Order Processed</p>
                                                <p className="text-[10px] text-muted-foreground">{format(new Date(order.createdAt), 'MMM d, h:mm a')}</p>
                                            </div>
                                        </div>
                                        {order.status === 'completed' && (
                                            <div className="flex gap-4">
                                                <div className="shrink-0 w-8 flex flex-col items-center">
                                                    <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/20" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-primary">Delivered</p>
                                                    <p className="text-[10px] text-muted-foreground">{format(new Date(order.updatedAt), 'MMM d, h:mm a')}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Management Card */}
                    <Card className="border-border/50 shadow-xl shadow-primary/5">
                        <CardHeader>
                            <CardTitle className="text-lg">Order Management</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-muted-foreground">Status</label>
                                <Select value={status} onValueChange={handleStatusChange} disabled={status === 'cancelled' || status === 'refunded'}>
                                    <SelectTrigger className="rounded-xl h-11 font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                        <SelectItem value="refunded">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            {status !== 'refunded' && status !== 'cancelled' && (
                                <div className="pt-4 space-y-2">
                                    <Button 
                                        variant="outline" 
                                        className="w-full rounded-xl gap-2 font-bold h-11 text-destructive hover:bg-destructive/5 hover:text-destructive" 
                                        onClick={handleRefund}
                                        disabled={isRefunding}
                                    >
                                        <RotateCcw className={cn("w-4 h-4", isRefunding && "animate-spin")} />
                                        {isRefunding ? "Processing Refund..." : "Process Full Refund"}
                                    </Button>
                                    <p className="text-[10px] text-center text-muted-foreground uppercase font-black">Process takes 3-5 business days</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                Customer Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-xs font-black uppercase text-muted-foreground mb-1">Name</p>
                                <p className="font-bold">{order.user.name}</p>
                                <p className="text-sm text-primary">{order.user.email}</p>
                            </div>
                            
                            {order.shippingAddress && (
                                <div>
                                    <p className="text-xs font-black uppercase text-muted-foreground mb-1">Shipping Address</p>
                                    <p className="text-sm leading-relaxed font-medium">
                                        {order.shippingAddress.street}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.zip}<br />
                                        {order.shippingAddress.country}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-xs font-black uppercase text-muted-foreground mb-2">Payment</p>
                                <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm font-bold">{order.paymentMethod}</span>
                                    </div>
                                    <Badge variant="outline" className="text-[10px] bg-background">Paid</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Internal Notes */}
                    <Card className="border-border/50">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-primary" />
                                Internal Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-muted-foreground mb-4 italic">No internal notes added yet.</p>
                            <Button variant="ghost" className="w-full rounded-xl text-xs h-8 border border-dashed opacity-60">Add Internal Note</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
