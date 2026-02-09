"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ArrowLeft, 
    Mail, 
    MessageSquare, 
    ShieldAlert, 
    Wallet, 
    Calendar, 
    MapPin, 
    Globe, 
    ExternalLink,
    Clock,
    ShoppingBag,
    Star,
    History,
    MoreHorizontal,
    Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { toast } from "sonner";
import { useUsers } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";

export default function UserDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { user, stats, activities, isLoading, fetchUser, updateUser, toggleUserStatus, deleteUser } = useUsers();

    // Dialog States
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isResetPwdOpen, setIsResetPwdOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (id) fetchUser(id);
    }, [id, fetchUser]);

    if (isLoading) return (
        <div className="p-40 text-center flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin relative z-10" />
            </div>
            <p className="font-black text-primary uppercase tracking-[0.3em] animate-pulse">Reconstructing Identity...</p>
        </div>
    );

    if (!user) return (
        <div className="p-40 text-center">
            <h2 className="text-4xl font-black italic opacity-20">Entity Not Found</h2>
            <Button asChild className="mt-8 rounded-xl font-black tracking-widest px-10 h-12 italic">
                <Link href="/dashboard/admin/users">Return to Grid</Link>
            </Button>
        </div>
    );

    const handleDelete = async () => {
        try {
            await deleteUser(user.id);
            router.push("/dashboard/admin/users");
        } catch (error) {
            // Error already handled
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        try {
            await updateUser(user.id, { password: newPassword });
            setIsResetPwdOpen(false);
            setNewPassword("");
        } catch (error) {
            // Error handled
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Button asChild variant="ghost" size="icon" className="h-14 w-14 rounded-[1.5rem] bg-muted/20 hover:bg-primary/10 hover:text-primary transition-all">
                        <Link href="/dashboard/admin/users">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-4xl font-black tracking-[ -0.05em] italic uppercase">Entity Profile</h1>
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1 opacity-70">Secured Record ID: {user.id.slice(0, 8)}... Linked {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Button variant="outline" className="gap-3 rounded-[1.2rem] h-12 px-6 font-black text-[10px] tracking-widest border-border/50 hover:bg-muted" onClick={() => setIsMessageOpen(true)}>
                        <MessageSquare className="w-4 h-4" />
                        WS_BROADCAST
                    </Button>
                    <Button className="gap-3 rounded-[1.2rem] h-12 px-8 font-black text-[10px] tracking-widest shadow-xl shadow-primary/20 bg-primary hover:scale-[1.02] transition-transform" onClick={() => setIsEmailOpen(true)}>
                        <Mail className="w-4 h-4" />
                        COMMUNIQUE_DISPATCH
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="space-y-6">
                    <Card className="border-border/40 overflow-hidden rounded-[2.5rem] bg-card/40 backdrop-blur-md shadow-sm">
                        <div className="h-28 bg-gradient-to-br from-primary/30 to-purple-600/30 relative">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                        </div>
                        <CardContent className="relative pt-0 px-8 pb-8">
                            <div className="flex flex-col items-center -mt-14 text-center">
                                <div className="relative">
                                    <Avatar className="h-28 w-28 border-[6px] border-background shadow-2xl">
                                        <AvatarImage src={user.avatarUrl} />
                                        <AvatarFallback className="text-3xl font-black bg-primary/10 text-primary italic">
                                            {user.name.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    {user.isActive && (
                                        <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-green-500 border-4 border-background shadow-lg animate-pulse" />
                                    )}
                                </div>
                                <div className="mt-6 uppercase">
                                    <h3 className="text-2xl font-black italic tracking-tighter leading-tight">{user.name}</h3>
                                    <p className="text-[10px] text-primary font-black tracking-widest opacity-80 mt-1">{user.email}</p>
                                    <div className="flex items-center justify-center gap-2 mt-4">
                                        <Badge className="bg-primary/10 text-primary border-primary/20 gap-2 h-7 px-3 font-black text-[9px] tracking-widest rounded-lg uppercase italic">
                                            <Star className="w-3 h-3 fill-primary" /> {user.role}
                                        </Badge>
                                        <Badge variant="outline" className={cn(
                                            "h-7 px-3 font-black text-[9px] tracking-widest rounded-lg uppercase italic border-2 transition-all",
                                            user.isActive ? "border-green-500/20 text-green-500 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]" : "border-muted text-muted italic opacity-50"
                                        )}>
                                            {user.isActive ? "NODE_ACTIVE" : "NODE_LOCKED"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-8 opacity-20" />

                            <div className="space-y-5">
                                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest group">
                                    <div className="w-8 h-8 rounded-xl bg-muted/30 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                                        <MapPin className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <span className="opacity-70 italic">{user.city || "EXTERNAL"}, {user.state || "GW"}</span>
                                </div>
                                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest group">
                                    <div className="w-8 h-8 rounded-xl bg-muted/30 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                                        <Globe className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <span className="opacity-70 italic">NET_PROTOCOL_TCPv4</span>
                                </div>
                                <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest group">
                                    <div className="w-8 h-8 rounded-xl bg-muted/30 flex items-center justify-center transition-colors group-hover:bg-primary/10">
                                        <Calendar className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                    </div>
                                    <span className="opacity-70 italic">STREAMS_ESTABLISHED {new Date(user.createdAt).getFullYear()}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/10 p-4 flex gap-3">
                            <Button variant="ghost" className="flex-1 text-[10px] h-11 rounded-xl gap-3 font-black tracking-widest uppercase italic hover:bg-primary/10 hover:text-primary transition-all" onClick={() => toggleUserStatus(user.id)}>
                                <ShieldAlert className="w-4 h-4" /> {user.isActive ? "LOCK_SIGNAL" : "BYPASS_ENCR"}
                            </Button>
                            <Button variant="ghost" className="flex-1 text-[10px] h-11 rounded-xl gap-3 font-black tracking-widest uppercase italic text-destructive hover:bg-destructive/10 transition-all" onClick={() => setIsDeleteOpen(true)}>
                                <Trash2 className="w-4 h-4" /> PURGE_ENTITY
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-border/40 bg-card/40 backdrop-blur-md rounded-[2.5rem] shadow-sm overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Entity Ledger Status</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3">
                            <div className="flex items-center justify-between p-6 rounded-[2rem] bg-primary/[0.03] border border-primary/10 group hover:bg-primary/[0.06] transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                        <Wallet className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Lifetime Value</span>
                                </div>
                                <span className="text-2xl font-black text-primary italic leading-none">${stats?.ltv || "0.00"}</span>
                            </div>
                            <div className="flex items-center justify-between p-6 rounded-[2rem] bg-muted/10 border border-border group hover:bg-muted/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center">
                                        <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Total Orders</span>
                                </div>
                                <span className="text-2xl font-black italic leading-none">{stats?.orderCount || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-6 rounded-[2rem] bg-muted/10 border border-border group hover:bg-muted/20 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-muted/20 flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest opacity-60">Requests</span>
                                </div>
                                <span className="text-2xl font-black italic leading-none">{stats?.ticketCount || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <div className="lg:col-span-2 space-y-8">
                    <Tabs defaultValue="activity" className="w-full">
                        <TabsList className="bg-muted/30 p-1.5 rounded-[1.5rem] h-16 w-fit border border-border/50 backdrop-blur-md mb-8">
                            <TabsTrigger value="activity" className="rounded-xl h-full gap-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-black text-[10px] tracking-widest uppercase px-8 transition-all">
                                <History className="w-4 h-4" /> Activity Log
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="rounded-xl h-full gap-3 data-[state=active]:bg-background data-[state=active]:shadow-lg font-black text-[10px] tracking-widest uppercase px-8 transition-all">
                                <ShieldAlert className="w-4 h-4" /> Security Ledger
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="activity">
                            {activities.length > 0 ? (
                                <div className="space-y-4">
                                    {activities.map((activity, idx) => (
                                        <div key={idx} className="p-6 rounded-[2rem] border border-border/40 bg-card/40 backdrop-blur-md flex items-center justify-between group hover:border-primary/20 transition-all">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                                                    <Globe className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <div className="text-[11px] font-black uppercase tracking-widest text-foreground">VISITED_NODE: {activity.page}</div>
                                                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-tighter text-muted-foreground opacity-60">
                                                        <Clock className="w-3 h-3" /> {new Date(activity.timestamp).toLocaleString()} UTC
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] italic">SIGNAL_STABLE</div>
                                                <div className="text-[8px] font-mono text-muted-foreground opacity-40 uppercase mt-1">{activity.ip}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-32 text-center rounded-[3rem] border-2 border-dashed border-border/40 bg-muted/5 flex flex-col items-center justify-center gap-6">
                                    <div className="w-20 h-20 rounded-[2rem] bg-muted/20 flex items-center justify-center">
                                        <History className="w-10 h-10 text-muted-foreground/30" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-2xl italic tracking-tighter">Zero Signals Recorded</h4>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground max-w-[300px] mx-auto mt-3 opacity-60">The entity has not established any recorded sessions within the current terminal cycle.</p>
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card className="border-border/40 rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md shadow-sm">
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl font-black italic uppercase">Security Keys & Role</CardTitle>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-60">ADMINISTRATIVE_ENCRYPTION_PROTOCOL_v4</p>
                                        </div>
                                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                                            <ShieldAlert className="w-6 h-6 text-amber-500" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 space-y-4">
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Authority Level</p>
                                                <Select 
                                                    value={user.role} 
                                                    onValueChange={(value) => updateUser(user.id, { role: value })}
                                                >
                                                    <SelectTrigger className="rounded-xl h-12 font-black text-xs uppercase tracking-widest border-border/50 bg-background/50">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl p-1">
                                                        <SelectItem value="Admin" className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3">Administrator</SelectItem>
                                                        <SelectItem value="Editor" className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3">Content Editor</SelectItem>
                                                        <SelectItem value="Support" className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3">Support Agent</SelectItem>
                                                        <SelectItem value="Viewer" className="rounded-xl font-black text-[10px] uppercase tracking-widest py-3">Regular Viewer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 flex flex-col justify-center gap-4">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Multi-Factor Auth</p>
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px]", user.isTwoFactorEnabled ? "bg-green-500 shadow-green-500/50" : "bg-muted shadow-muted-foreground/20")} />
                                                <Badge variant={user.isTwoFactorEnabled ? "default" : "secondary"} className="rounded-lg h-8 px-4 font-black text-[9px] tracking-widest uppercase italic">
                                                    {user.isTwoFactorEnabled ? "BIOMETRIC_ACTIVE" : "PROTECTION_DISABLED"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 p-6 rounded-3xl bg-muted/20 border border-border/50 flex flex-col justify-center gap-4">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Identity Verification</p>
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px]", user.isEmailVerified ? "bg-primary shadow-primary/50" : "bg-muted shadow-muted-foreground/20")} />
                                                <Badge variant={user.isEmailVerified ? "default" : "secondary"} className="rounded-lg h-8 px-4 font-black text-[9px] tracking-widest uppercase italic">
                                                    {user.isEmailVerified ? "EMAIL_VERIFIED" : "VERIFY_PENDING"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 rounded-3xl bg-primary/5 border border-primary/20 flex flex-col justify-center gap-4">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Security Bypass</p>
                                            <Button variant="outline" className="h-12 rounded-xl font-black text-[10px] tracking-widest uppercase border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5" onClick={() => setIsResetPwdOpen(true)}>
                                                RESET_CREDENTIALS
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* DIALOGS */}
            
            {/* Email Dialog */}
            <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl border-border/50">
                    <DialogHeader>
                        <div className="w-12 h-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-primary" />
                        </div>
                        <DialogTitle className="text-2xl font-black">Send Email</DialogTitle>
                        <DialogDescription>
                            Directly contact <span className="font-bold text-foreground">{user.email}</span> via the internal mail engine.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="font-bold">Subject</Label>
                            <Input placeholder="Re: Account Update" className="rounded-xl h-11" />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold">Message Content</Label>
                            <Textarea placeholder="Type your message here..." className="rounded-2xl min-h-[150px] resize-none" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl h-11 px-6" onClick={() => setIsEmailOpen(false)}>Cancel</Button>
                        <Button className="rounded-xl h-11 px-8 shadow-lg shadow-primary/20" onClick={() => {
                            toast.success("Email queued for delivery");
                            setIsEmailOpen(false);
                        }}>
                            Send Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Message Dialog (Mock Chat) */}
            <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-border/50">
                    <DialogHeader>
                        <div className="w-12 h-auto rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                            <MessageSquare className="w-6 h-6 text-purple-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black">Direct Message</DialogTitle>
                        <DialogDescription>
                            Send a real-time notification to {user.name}'s dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea placeholder="What's on your mind?" className="rounded-2xl min-h-[100px] resize-none" />
                    </div>
                    <DialogFooter>
                        <Button className="w-full rounded-xl h-11 shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-700" onClick={() => {
                            toast.success("Notification dispatched");
                            setIsMessageOpen(false);
                        }}>
                           Broadcast Message
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reset Password Dialog */}
            <Dialog open={isResetPwdOpen} onOpenChange={setIsResetPwdOpen}>
                <DialogContent className="sm:max-w-[400px] rounded-3xl border-border/50">
                    <DialogHeader>
                        <div className="w-12 h-auto rounded-2xl bg-amber-500/10 flex items-center justify-center mb-4">
                            <ShieldAlert className="w-6 h-6 text-amber-500" />
                        </div>
                        <DialogTitle className="text-2xl font-black">Reset Password</DialogTitle>
                        <DialogDescription>
                            This will bypass original security and set a new credential for the user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label className="font-bold">New Secure Password</Label>
                            <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="rounded-xl h-11"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" className="rounded-xl h-11" onClick={() => setIsResetPwdOpen(false)}>Cancel</Button>
                        <Button className="rounded-xl h-11 bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-500/20" onClick={handleResetPassword}>
                            Update Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-border/50">
                    <DialogHeader>
                        <div className="w-12 h-auto rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
                            <Trash2 className="w-6 h-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-2xl font-black">Terminate Account</DialogTitle>
                        <DialogDescription>
                            Are you absolutely sure? This will purge all data for <span className="font-bold text-foreground">{user.name}</span>. This action is irreversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:gap-2 pt-4">
                        <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setIsDeleteOpen(false)}>Abort</Button>
                        <Button className="flex-1 rounded-xl h-11 bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20" onClick={handleDelete}>
                            Delete Permanently
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
