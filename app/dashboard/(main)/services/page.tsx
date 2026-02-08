"use client";

import { useState } from "react";
import { 
    Search, 
    Filter, 
    Plus, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    MessageSquare, 
    ChevronRight,
    Users,
    Briefcase,
    TrendingUp,
    FileText,
    UserPlus,
    LayoutGrid,
    List
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockQuotes, mockServiceOrders } from "@/lib/shop-data";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ServicesManagementPage() {
    const [view, setView] = useState<"list" | "grid">("list");

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "development":
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1.5"><Clock className="w-3 h-3" /> In Dev</Badge>;
            case "completed":
                return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1.5"><CheckCircle2 className="w-3 h-3" /> Completed</Badge>;
            case "planning":
                return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1.5"><AlertCircle className="w-3 h-3" /> Planning</Badge>;
            case "review":
                return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 gap-1.5"><MessageSquare className="w-3 h-3" /> Review</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Service Requests</h1>
                    <p className="text-muted-foreground">Manage custom development orders, project milestones, and resource allocation.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 rounded-xl">
                        <FileText className="w-4 h-4" />
                        Generate Quote
                    </Button>
                    <Button className="gap-2 rounded-xl shadow-lg shadow-primary/20 bg-primary">
                        <Plus className="w-4 h-4" />
                        New Service Order
                    </Button>
                </div>
            </div>

            {/* Service Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <Briefcase className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">4 starting this week</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$24,500</div>
                        <p className="text-xs text-green-500 font-medium">+18% vs last month</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18 Days</div>
                        <p className="text-xs text-muted-foreground">Maintained efficiency</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Staff Load</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">82%</div>
                        <p className="text-xs text-orange-500 font-medium font-mono">High capacity</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="orders" className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-fit border border-border">
                    <TabsTrigger value="orders" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8">
                        Service Orders
                    </TabsTrigger>
                    <TabsTrigger value="quotes" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-8">
                        Quote Requests <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary border-none">2</Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="orders" className="space-y-4">
                    <Card className="border-border/50">
                        <CardHeader className="p-4 border-b border-border/50 flex flex-row items-center justify-between">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search orders..." className="pl-10 h-10 rounded-xl" />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => setView("list")} className={view === "list" ? "bg-muted" : ""}><List className="w-4 h-4" /></Button>
                                <Button variant="outline" size="icon" onClick={() => setView("grid")} className={view === "grid" ? "bg-muted" : ""}><LayoutGrid className="w-4 h-4" /></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/5">
                                        <TableHead>Service Order</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Assigned To</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockServiceOrders.map((order) => (
                                        <TableRow key={order.id} className="group hover:bg-primary/5 transition-colors">
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{order.title}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{order.id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium">{order.customerName}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                        {order.assignedTo?.[0]}
                                                    </div>
                                                    <span className="text-xs">{order.assignedTo || "Unassigned"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-muted rounded-full h-1.5 overflow-hidden">
                                                        <div className="h-full bg-primary" style={{ width: `${order.progress}%` }} />
                                                    </div>
                                                    <span className="text-[10px] font-bold">{order.progress}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button asChild variant="ghost" size="sm" className="h-8 rounded-lg gap-1 text-primary">
                                                    <Link href={`/dashboard/services/${order.id}`}>
                                                        Track <ChevronRight className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="quotes">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockQuotes.map((quote) => (
                            <Card key={quote.id} className="border-border/50 hover:border-primary/50 transition-all group">
                                <CardHeader className="flex flex-row items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary tracking-wider">{quote.serviceType}</Badge>
                                            <span className="text-[10px] text-muted-foreground">{quote.date}</span>
                                        </div>
                                        <CardTitle className="text-xl font-bold">{quote.customerName}</CardTitle>
                                        <CardDescription>{quote.email}</CardDescription>
                                    </div>
                                    <Badge className={quote.status === "requested" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}>
                                        {quote.status.toUpperCase()}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4 py-1">
                                        "{quote.description}"
                                    </p>
                                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black">Budget Preference</p>
                                            <p className="font-bold text-lg text-primary">{quote.budget}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" className="rounded-xl h-9">Dismiss</Button>
                                            <Button className="rounded-xl h-9 bg-primary">Respond</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
