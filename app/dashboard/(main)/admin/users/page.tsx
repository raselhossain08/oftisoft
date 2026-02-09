"use client";

import { useState, useEffect } from "react";
import { 
    Search, 
    Filter, 
    MoreHorizontal, 
    Mail, 
    MessageSquare, 
    UserPlus, 
    Download,
    Users,
    Star,
    TrendingUp,
    ShieldCheck,
    Clock,
    MoreVertical,
    ChevronRight,
    SearchX,
    Trash2,
    ShieldAlert,
    RefreshCw,
    Activity
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { toast } from "sonner";
import { useUsers } from "@/hooks/useUsers";
import { AddUserDialog } from "@/components/dashboard/add-user-dialog";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSegment, setActiveSegment] = useState("All Users");
    const { users, isLoading, fetchUsers, toggleUserStatus, deleteUser } = useUsers();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    
    // New Dialog States
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        const params: any = { search: searchQuery };
        if (activeSegment === "Active Users") params.isActive = true;
        if (activeSegment === "Deactivated") params.isActive = false;
        if (activeSegment === "Admins") params.role = "Admin";
        if (activeSegment === "Support Staff") params.role = "Support";
        if (activeSegment === "Managers") params.role = "Editor";
        
        await fetchUsers(params);
        setTimeout(() => setIsRefreshing(false), 500);
        toast.success("User matrix synchronized");
    };

    useEffect(() => {
        const params: any = { search: searchQuery };
        if (activeSegment === "Active Users") params.isActive = true;
        if (activeSegment === "Deactivated") params.isActive = false;
        if (activeSegment === "Admins") params.role = "Admin";
        if (activeSegment === "Support Staff") params.role = "Support";
        if (activeSegment === "Managers") params.role = "Editor";
        
        fetchUsers(params);
    }, [fetchUsers, searchQuery, activeSegment]);

    const newUsersLast7Days = users.filter(u => {
        const createdDate = new Date(u.createdAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return createdDate >= sevenDaysAgo;
    }).length;

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "Admin":
                return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1 rounded-lg"><Star className="w-3 h-3 fill-amber-500" /> Admin</Badge>;
            case "Editor":
                return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 gap-1 rounded-lg"><ShieldCheck className="w-3 h-3" /> Editor</Badge>;
            case "Support":
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 rounded-lg">Support</Badge>;
            default:
                return <Badge variant="outline" className="border-border/50 rounded-lg">{role}</Badge>;
        }
    };

    const handleExport = () => {
        toast.success("Preparing user data export...");
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter italic">Entity Management</h1>
                    <p className="text-muted-foreground font-medium">Manage your relationships, segment users, and track customer lifetime value.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2 rounded-xl h-11 border-border/50 bg-card/50 backdrop-blur-sm" onClick={handleRefresh}>
                        <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
                        Fast Sync
                    </Button>
                    <Button variant="outline" className="gap-2 rounded-xl h-11 border-border/50 bg-card/50 backdrop-blur-sm" onClick={handleExport}>
                        <Download className="w-4 h-4" />
                        Export
                    </Button>
                    <Button 
                        className="gap-2 rounded-xl h-11 shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 px-6 font-black italic"
                        onClick={() => setIsAddUserOpen(true)}
                    >
                        <UserPlus className="w-4 h-4" />
                        Inject Entity
                    </Button>
                </div>
            </div>

            <AddUserDialog 
                open={isAddUserOpen} 
                onOpenChange={setIsAddUserOpen}
                onSuccess={() => fetchUsers({ search: searchQuery })}
            />

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Global Population</CardTitle>
                        <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                            <Users className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-black italic">{users.length}</div>
                        <p className="text-[9px] text-muted-foreground uppercase mt-2 font-black tracking-widest opacity-60 italic">Total Registered Nodes</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden group hover:border-green-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Active Streams</CardTitle>
                        <div className="p-2 rounded-xl bg-green-500/10 text-green-500 group-hover:scale-110 transition-transform">
                            <Activity className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-black italic text-green-500">{users.filter(u => u.isActive).length}</div>
                        <p className="text-[9px] text-green-500/60 uppercase mt-2 font-black tracking-widest italic font-black">Online / Ready</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[2.5rem] overflow-hidden group hover:border-purple-500/30 transition-all">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Identity Verification</CardTitle>
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <div className="text-4xl font-black italic">
                            {users.length > 0 ? ((users.filter(u => u.isEmailVerified).length / users.length) * 100).toFixed(0) : 0}%
                        </div>
                        <p className="text-[9px] text-muted-foreground uppercase mt-2 font-black tracking-widest opacity-60 italic">Compliance Rating</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-primary shadow-xl shadow-primary/20 rounded-[2.5rem] overflow-hidden group border-none relative">
                    <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-foreground/70">7-Day Expansion</CardTitle>
                        <div className="p-2 rounded-xl bg-white/20 text-white">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 relative z-10">
                        <div className="text-4xl font-black italic text-white">+{newUsersLast7Days}</div>
                        <p className="text-[9px] text-white/60 uppercase mt-2 font-black tracking-widest italic">New Node Acquisitions</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="space-y-6">
                    <Card className="border-border/50 h-fit rounded-[2.5rem] overflow-hidden shadow-sm bg-card/40 backdrop-blur-md">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Entity Filters</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="flex flex-col gap-1">
                                {[
                                    { name: "All Users", count: users.length },
                                    { name: "Active Users", count: users.filter(u => u.isActive).length },
                                    { name: "Admins", count: users.filter(u => u.role === 'Admin').length },
                                    { name: "Support Staff", count: users.filter(u => u.role === 'Support').length },
                                    { name: "Managers", count: users.filter(u => u.role === 'Editor').length },
                                    { name: "Deactivated", count: users.filter(u => !u.isActive).length },
                                ].map((segment) => (
                                    <button 
                                        key={segment.name}
                                        onClick={() => setActiveSegment(segment.name)}
                                        className={cn(
                                            "flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] transition-all group",
                                            activeSegment === segment.name 
                                                ? "bg-primary text-white font-black shadow-lg shadow-primary/20 italic" 
                                                : "text-muted-foreground font-black hover:bg-primary/5 hover:text-primary"
                                        )}
                                    >
                                        <span className="tracking-widest uppercase">{segment.name}</span>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-lg text-[9px] font-black",
                                            activeSegment === segment.name ? "bg-white/20 text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                        )}>{segment.count}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-primary/5 rounded-[2.5rem] border-dashed p-4">
                        <CardHeader className="p-6">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" /> Sync Protocol
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-6 pt-0 space-y-4">
                            <p className="text-[10px] font-black text-muted-foreground leading-relaxed uppercase tracking-tighter opacity-70 italic">Segments are synced with downstream services every 6 hours.</p>
                            <Button variant="outline" className="w-full rounded-[1.2rem] bg-background text-[10px] h-10 font-black tracking-widest border-primary/20 text-primary hover:bg-primary hover:text-white transition-all" onClick={() => toast.success("Batch sync dispatched...")}>BATCH SYNC NOW</Button>
                        </CardContent>
                    </Card>
                </div>

                {/* User List */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="border-border/50 rounded-2xl overflow-hidden shadow-sm">
                        <CardHeader className="p-6 border-b border-border/50 bg-muted/5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        placeholder="Search by name, email, city..." 
                                        className="pl-10 h-11 rounded-xl bg-background font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="gap-2 rounded-xl h-10 font-bold px-4">
                                        <Filter className="h-4 w-4" />
                                        Advanced
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {users.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/10 hover:bg-transparent border-b border-border/50">
                                            <TableHead className="w-[300px] font-black uppercase text-[10px] tracking-widest px-6 h-auto">Identify</TableHead>
                                            <TableHead className="font-black uppercase text-[10px] tracking-widest h-auto">Security Role</TableHead>
                                            <TableHead className="font-black uppercase text-[10px] tracking-widest h-auto">Linked Since</TableHead>
                                            <TableHead className="font-black uppercase text-[10px] tracking-widest h-auto">Network Status</TableHead>
                                            <TableHead className="text-right font-black uppercase text-[10px] tracking-widest px-6 h-auto">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((u) => (
                                            <TableRow key={u.id} className="group hover:bg-primary/[0.02] transition-all border-b border-border/20">
                                                <TableCell className="px-6 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <Avatar className="h-12 w-12 border-2 border-background shadow-xl">
                                                                <AvatarImage src={u.avatarUrl} />
                                                                <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                                                                    {u.name.split(" ").map(n => n[0]).join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            {u.isActive && (
                                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background shadow-lg animate-pulse" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-sm tracking-tight">{u.name}</span>
                                                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60 italic">{u.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getRoleBadge(u.role)}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-[11px] font-black italic">{new Date(u.createdAt).toLocaleDateString()}</div>
                                                        <div className="text-[9px] font-black uppercase tracking-tighter text-muted-foreground">{new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${u.isActive ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" : "bg-muted"}`} />
                                                        <span className="text-[9px] font-black uppercase tracking-widest italic">{u.isActive ? "SIGNAL_ACTIVE" : "NODE_LOCKED"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right px-6">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button asChild variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-primary hover:bg-primary/10 transition-all">
                                                            <Link href={`/dashboard/admin/users/${u.id}`}>
                                                                <ChevronRight className="w-5 h-5" />
                                                            </Link>
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-muted/50">
                                                                    <MoreVertical className="h-5 h-5" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-64 rounded-[1.5rem] p-2 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] border-border/50 backdrop-blur-xl">
                                                                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">Administrative Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem 
                                                                    className="gap-3 cursor-pointer rounded-xl font-black italic py-3 text-xs" 
                                                                    onClick={() => {
                                                                        setSelectedUser(u);
                                                                        setIsEmailOpen(true);
                                                                    }}
                                                                >
                                                                    <Mail className="w-4 h-4 text-primary" /> DISPATCH COMMUNIQUE
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    className="gap-3 cursor-pointer rounded-xl font-black italic py-3 text-xs" 
                                                                    onClick={() => {
                                                                        setSelectedUser(u);
                                                                        setIsMessageOpen(true);
                                                                    }}
                                                                >
                                                                    <MessageSquare className="w-4 h-4 text-purple-500" /> EMIT WS_ALERT
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2 opacity-50" />
                                                                <DropdownMenuItem 
                                                                    className="gap-3 cursor-pointer rounded-xl font-black italic py-3 text-xs"
                                                                    onClick={() => toggleUserStatus(u.id)}
                                                                >
                                                                    <ShieldAlert className="w-4 h-4 text-amber-500" /> 
                                                                    {u.isActive ? "LOCK_SIGNAL" : "BYPASS_ENCRYPTION"}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    className="gap-3 text-destructive focus:bg-destructive/10 cursor-pointer rounded-xl font-black italic py-3 text-xs"
                                                                    onClick={() => setDeleteId(u.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" /> PURGE_ENTITY
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : isLoading ? (
                                <div className="py-32 flex flex-col items-center justify-center gap-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                                        <RefreshCw className="h-10 w-10 text-primary animate-spin relative z-10" />
                                    </div>
                                    <p className="text-[11px] text-primary font-black uppercase tracking-[0.3em] animate-pulse">Syncing Entity Stream...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-32 bg-muted/5">
                                    <div className="w-20 h-20 rounded-[2rem] bg-muted/20 flex items-center justify-center mb-6">
                                        <SearchX className="h-10 w-10 text-muted-foreground/30" />
                                    </div>
                                    <h3 className="text-2xl font-black italic">Zero Signals Found</h3>
                                    <p className="text-muted-foreground text-[10px] font-black uppercase max-w-xs text-center mt-3 tracking-[0.2em] opacity-60">The current query returned no active entities from the ledger.</p>
                                    <Button variant="outline" className="mt-8 rounded-[1.2rem] font-black text-[10px] border-primary/20 text-primary px-10 h-11 tracking-widest hover:bg-primary hover:text-white transition-all" onClick={() => setSearchQuery("")}>RESET SEARCH</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* DIALOGS */}

            {/* Email Dialog */}
            <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-border/50">
                    <DialogHeader>
                        <div className="w-12 h-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tighter">Send Official Email</DialogTitle>
                        <DialogDescription className="font-bold">
                            Direct contact to <span className="text-primary">{selectedUser?.email}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="font-black text-[11px] uppercase ml-1">Transmission Subject</Label>
                            <Input placeholder="Official Account Notice" className="rounded-xl h-auto font-medium" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-black text-[11px] uppercase ml-1">Message Header/Body</Label>
                            <textarea 
                                className="w-full h-32 rounded-[1.5rem] border border-input bg-background px-4 py-3 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                                placeholder="Enter message payload..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl h-11 font-bold" onClick={() => setIsEmailOpen(false)}>Cancel</Button>
                        <Button className="rounded-xl h-11 px-8 shadow-lg shadow-primary/30 font-black tracking-tight" onClick={() => {
                            toast.success("Message queued in CDN");
                            setIsEmailOpen(false);
                        }}>
                            DISPATCH EMAIL
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Message Dialog */}
            <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-border/50">
                    <DialogHeader>
                        <div className="w-12 h-auto rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                            <MessageSquare className="w-6 h-6 text-purple-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tighter">Dispatch Alert</DialogTitle>
                        <DialogDescription className="font-bold">
                            Send websocket notification to <span className="text-purple-500">{selectedUser?.name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <textarea 
                            className="w-full h-24 rounded-[1.5rem] border border-input bg-background px-4 py-3 text-sm font-medium placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none transition-all"
                            placeholder="Type alert payload..."
                        />
                    </div>
                    <DialogFooter>
                        <Button className="w-full rounded-xl h-auto shadow-lg shadow-purple-500/30 bg-purple-600 hover:bg-purple-700 font-black tracking-tight" onClick={() => {
                            toast.success("WebSocket pulse emitted");
                            setIsMessageOpen(false);
                        }}>
                           EMIT BROADCAST
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Delete Confirmation */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent className="rounded-[2rem] border-border/50 max-w-[400px]">
                    <DialogHeader className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-destructive/10 flex items-center justify-center mb-4">
                            <Trash2 className="w-8 h-8 text-destructive" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tighter">Purge Entity?</DialogTitle>
                        <DialogDescription className="font-bold uppercase text-[10px] tracking-widest text-destructive">
                           Critical Security Protocol Required
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 text-center">
                        <p className="text-sm font-medium text-muted-foreground">This will permanently remove the record and all associated metadata. This action cannot be reversed.</p>
                    </div>
                    <DialogFooter className="flex-col sm:flex-col gap-2 pt-4">
                        <Button 
                            className="w-full bg-destructive hover:bg-destructive/90 rounded-xl h-auto font-black shadow-lg shadow-destructive/20"
                            onClick={() => {
                                if (deleteId) deleteUser(deleteId);
                                setDeleteId(null);
                            }}
                        >
                            CONFIRM PURGE
                        </Button>
                        <Button variant="ghost" className="w-full rounded-xl h-11 font-bold" onClick={() => setDeleteId(null)}>ABORT MISSION</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
