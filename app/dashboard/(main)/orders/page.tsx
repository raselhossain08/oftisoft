
"use client";

import { useState } from "react";
import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    Eye, 
    Download, 
    Trash2, 
    Calendar,
    ArrowUpRight,
    ShoppingBag,
    CheckCircle2,
    Clock,
    XCircle,
    RotateCcw
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const { orders, isLoading, exportReport, isExportingReport, downloadInvoice } = useOrders();

    const filteredOrders = orders?.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.status.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1.5"><CheckCircle2 className="w-3 h-3" /> Completed</Badge>;
            case "processing":
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1.5"><Clock className="w-3 h-3" /> Processing</Badge>;
            case "pending":
                return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1.5"><Clock className="w-3 h-3" /> Pending</Badge>;
            case "cancelled":
                return <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1.5"><XCircle className="w-3 h-3" /> Cancelled</Badge>;
            case "refunded":
                return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 gap-1.5"><RotateCcw className="w-3 h-3" /> Refunded</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Calculate Stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders.filter(o => o.status !== 'cancelled' && o.status !== 'refunded').reduce((acc, curr) => acc + Number(curr.total), 0);
    const successRate = totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(1) : 0;
    const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground">Monitor customer transactions, track fulfillment, and manage refunds.</p>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        className="gap-2 rounded-xl"
                        onClick={() => exportReport()}
                        disabled={isExportingReport}
                    >
                        <Download className="w-4 h-4" />
                        {isExportingReport ? "Exporting..." : "Export Report"}
                    </Button>
                </div>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">All time orders</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pending Processing</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingOrders}</div>
                        <p className="text-xs text-orange-500 font-medium">Requires attention</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${avgOrderValue}</div>
                         <p className="text-xs text-muted-foreground">Per order revenue</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Successful Deliveries</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{successRate}%</div>
                        <p className="text-xs text-muted-foreground">Completion rate</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50">
                <CardHeader className="bg-muted/10 border-b border-border/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search order ID..." 
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
                                Status: All
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/5 hover:bg-transparent">
                                <TableHead className="w-[120px]">Order ID</TableHead>
                                <TableHead className="min-w-[200px]">Items</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((o) => (
                                    <TableRow key={o.id} className="group hover:bg-primary/5 transition-colors">
                                        <TableCell className="font-mono text-xs font-bold">
                                            <Link href={`/dashboard/orders/${o.id}`} className="hover:text-primary underline decoration-primary/30 underline-offset-4">
                                                {o.id.substring(0, 8)}...
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {o.items?.slice(0, 2).map((item, idx) => (
                                                     <span key={idx} className="text-sm font-medium truncate max-w-[200px]">{item.productName} (x{item.quantity})</span>
                                                ))}
                                                {o.items?.length > 2 && <span className="text-xs text-muted-foreground">+{o.items.length - 2} more</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="w-3 h-3" />
                                                {format(new Date(o.createdAt), 'MMM d, yyyy')}
                                            </div>
                                        </TableCell>
                                        <TableCell>{getStatusBadge(o.status)}</TableCell>
                                        <TableCell className="font-black text-primary">${Number(o.total).toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                    <DropdownMenuLabel>Manage Order</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/orders/${o.id}`} className="flex items-center gap-2 cursor-pointer text-primary">
                                                            <Eye className="w-4 h-4" /> View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        className="flex items-center gap-2 cursor-pointer"
                                                        onClick={() => downloadInvoice(o.id)}
                                                    >
                                                        <Download className="w-4 h-4" /> Download Invoice
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                                                        <Trash2 className="w-4 h-4" /> Archive Order
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
