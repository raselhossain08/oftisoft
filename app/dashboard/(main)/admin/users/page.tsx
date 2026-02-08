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
    ShieldAlert
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

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSegment, setActiveSegment] = useState("All Users");
    const { users, isLoading, fetchUsers, toggleUserStatus, deleteUser } = useUsers();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    
    // New Dialog States
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);

    useEffect(() => {
        const params: any = { search: searchQuery };
        if (activeSegment === "Active Users") params.isActive = true;
        if (activeSegment === "Deactivated") params.isActive = false;
        if (activeSegment === "Admins") params.role = "Admin";
        if (activeSegment === "Support Staff") params.role = "Support";
        if (activeSegment === "Managers") params.role = "Editor";
        
        fetchUsers(params);
    }, [fetchUsers, searchQuery, activeSegment]);

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "Admin":
                return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1"><Star className="w-3 h-3 fill-amber-500" /> Admin</Badge>;
            case "Editor":
                return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 gap-1"><ShieldCheck className="w-3 h-3" /> Editor</Badge>;
            case "Support":
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Support</Badge>;
            default:
                return <Badge variant="outline" className="border-border/50">{role}</Badge>;
        }
    };

    const handleExport = () => {
        toast.success("Preparing user data export...");
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter">User Management</h1>
                    <p className="text-muted-foreground">Manage your relationships, segment users, and track customer lifetime value.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2 rounded-xl h-11" onClick={handleExport}>
                        <Download className="w-4 h-4" />
                        Export Users
                    </Button>
                    <Button 
                        className="gap-2 rounded-xl h-11 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 px-6 font-bold"
                        onClick={() => setIsAddUserOpen(true)}
                    >
                        <UserPlus className="w-4 h-4" />
                        Add User
                    </Button>
                </div>
            </div>

            <AddUserDialog 
                open={isAddUserOpen} 
                onOpenChange={setIsAddUserOpen}
                onSuccess={() => fetchUsers({ search: searchQuery })}
            />

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{users.length}</div>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1 font-bold">Syncing live data</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Active Accounts</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{users.filter(u => u.isActive).length}</div>
                        <p className="text-[10px] text-green-500 uppercase mt-1 font-bold">Currently online/active</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Verified Rate</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">
                            {users.length > 0 ? ((users.filter(u => u.isEmailVerified).length / users.length) * 100).toFixed(0) : 0}%
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1 font-bold">Identity compliance</p>
                    </CardContent>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border-l-4 border-l-primary/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">New Growth</CardTitle>
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-primary">+12</div>
                        <p className="text-[10px] text-primary/60 uppercase mt-1 font-bold">Captured this week</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <div className="space-y-6">
                    <Card className="border-border/50 h-fit rounded-2xl overflow-hidden shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase">Quick Segments</CardTitle>
                            <CardDescription>Filter users by behavior.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="flex flex-col">
                                {[
                                    { name: "All Users" },
                                    { name: "Active Users" },
                                    { name: "Admins" },
                                    { name: "Support Staff" },
                                    { name: "Managers" },
                                    { name: "Deactivated" },
                                ].map((segment) => (
                                    <button 
                                        key={segment.name}
                                        onClick={() => setActiveSegment(segment.name)}
                                        className={`flex items-center justify-between px-6 py-3.5 text-sm transition-all hover:bg-muted/50 ${activeSegment === segment.name ? "bg-primary/10 text-primary font-black border-r-4 border-primary" : "text-muted-foreground font-medium"}`}
                                    >
                                        <span>{segment.name}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-primary/5 rounded-2xl border-dashed">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase">Sync Protocol</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase">Your segments are synced with downstream services every 6 hours.</p>
                            <Button variant="outline" className="w-full rounded-xl bg-background text-[10px] h-9 font-black" onClick={() => toast.success("Batch sync dispatched...")}>BATCH SYNC NOW</Button>
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
                                            <TableHead className="font-black uppercase text-[10px] tracking-widest h-auto">Connectivity</TableHead>
                                            <TableHead className="font-black uppercase text-[10px] tracking-widest h-auto">Network Status</TableHead>
                                            <TableHead className="text-right font-black uppercase text-[10px] tracking-widest px-6 h-auto">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((u) => (
                                            <TableRow key={u.id} className="group hover:bg-primary/5 transition-all border-b border-border/20">
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-11 w-11 border-2 border-background shadow-md">
                                                            <AvatarImage src={u.avatarUrl} />
                                                            <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                                                                {u.name.split(" ").map(n => n[0]).join("")}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-sm tracking-tight">{u.name}</span>
                                                            <span className="text-[10px] text-muted-foreground font-bold">{u.email}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{getRoleBadge(u.role)}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="text-[11px] font-black">{u.city || "EXTERNAL"}, {u.state || "GW"}</div>
                                                        <div className="text-[9px] font-mono text-muted-foreground">{u.phone || "---"}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${u.isActive ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-muted"}`} />
                                                        <span className="text-[9px] font-black uppercase tracking-tighter">{u.isActive ? "online_active" : "offline_locked"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right px-6">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-primary hover:bg-primary/10 transition-all">
                                                            <Link href={`/dashboard/admin/users/${u.id}`}>
                                                                <ChevronRight className="w-5 h-5" />
                                                            </Link>
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted/50">
                                                                    <MoreVertical className="h-5 h-5" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-border/50">
                                                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-muted-foreground px-2 py-1.5">Administrative Panel</DropdownMenuLabel>
                                                                <DropdownMenuItem 
                                                                    className="gap-2 cursor-pointer rounded-xl font-bold py-2.5" 
                                                                    onClick={() => {
                                                                        setSelectedUser(u);
                                                                        setIsEmailOpen(true);
                                                                    }}
                                                                >
                                                                    <Mail className="w-4 h-4 text-primary" /> Send Official Email
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    className="gap-2 cursor-pointer rounded-xl font-bold py-2.5" 
                                                                    onClick={() => {
                                                                        setSelectedUser(u);
                                                                        setIsMessageOpen(true);
                                                                    }}
                                                                >
                                                                    <MessageSquare className="w-4 h-4 text-purple-500" /> Dispatch Alert
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-2" />
                                                                <DropdownMenuItem 
                                                                    className="gap-2 cursor-pointer rounded-xl font-bold py-2.5"
                                                                    onClick={() => toggleUserStatus(u.id)}
                                                                >
                                                                    <ShieldAlert className="w-4 h-4 text-amber-500" /> 
                                                                    {u.isActive ? "Force Deactivate" : "Bypass Activation"}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    className="gap-2 text-destructive focus:bg-destructive/10 cursor-pointer rounded-xl font-bold py-2.5"
                                                                    onClick={() => setDeleteId(u.id)}
                                                                >
                                                                    <Trash2 className="w-4 h-4" /> Purge Records
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
                                <div className="py-24 flex flex-col items-center justify-center gap-4">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Intercepting Grid Data...</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 bg-muted/5">
                                    <SearchX className="h-16 w-16 text-muted-foreground/30 mb-4" />
                                    <h3 className="text-xl font-black">Zero matches found</h3>
                                    <p className="text-muted-foreground text-[10px] font-bold uppercase max-w-xs text-center mt-2 tracking-widest">The current query returned no active entities from the ledger.</p>
                                    <Button variant="outline" className="mt-6 rounded-xl font-black text-xs border-primary/20 text-primary px-8" onClick={() => setSearchQuery("")}>RESET SEARCH</Button>
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
