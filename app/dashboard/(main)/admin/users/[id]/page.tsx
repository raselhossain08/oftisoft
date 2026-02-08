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

export default function UserDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { user, stats, isLoading, fetchUser, updateUser, toggleUserStatus, deleteUser } = useUsers();

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
        <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-auto w-12 border-b-2 border-primary" />
            <p className="font-bold text-muted-foreground">Loading user profile...</p>
        </div>
    );

    if (!user) return <div className="p-20 text-center font-bold">User profile not found.</div>;

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" size="icon" className="rounded-full">
                        <Link href="/dashboard/admin/users">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter">User Profile</h1>
                        <p className="text-muted-foreground text-sm">Managing account {user.id} since {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="gap-2 rounded-xl h-11" onClick={() => setIsMessageOpen(true)}>
                        <MessageSquare className="w-4 h-4" />
                        Message
                    </Button>
                    <Button className="gap-2 rounded-xl h-11 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 px-6" onClick={() => setIsEmailOpen(true)}>
                        <Mail className="w-4 h-4" />
                        Send Email
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="space-y-6">
                    <Card className="border-border/50 overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-primary/20 to-purple-500/20" />
                        <CardContent className="relative pt-0 px-6 pb-6">
                            <div className="flex flex-col items-center -mt-12 text-center">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                    <AvatarImage src={user.avatarUrl} />
                                    <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">
                                        {user.name.split(" ").map(n => n[0]).join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="mt-4">
                                    <h3 className="text-xl font-black">{user.name}</h3>
                                    <p className="text-sm text-primary font-medium">{user.email}</p>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1.5 h-6">
                                            <Star className="w-3 h-3 fill-amber-500" /> {user.role}
                                        </Badge>
                                        <Badge variant="outline" className={`h-6 ${user.isActive ? "border-green-500/30 text-green-500 bg-green-500/5" : "border-muted text-muted"}`}>
                                            {user.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6 opacity-30" />

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">{user.city || "No city"}, {user.state || "No state"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">GMT +8 Timezone (Mock)</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="font-medium">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-muted/5 p-4 flex gap-2">
                            <Button variant="ghost" className="flex-1 text-xs h-9 rounded-lg gap-2 text-primary hover:bg-primary/5" onClick={() => toggleUserStatus(user.id)}>
                                <ShieldAlert className="w-3.5 h-3.5" /> {user.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Button variant="ghost" className="flex-1 text-xs h-9 rounded-lg gap-2 text-destructive hover:bg-destructive/10" onClick={() => setIsDeleteOpen(true)}>
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">User Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
                                <div className="flex items-center gap-3">
                                    <Wallet className="w-5 h-5 text-primary" />
                                    <span className="text-sm font-bold">Lifetime Value</span>
                                </div>
                                <span className="text-xl font-black text-primary">${stats?.ltv || "0.00"}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm font-bold">Total Orders</span>
                                </div>
                                <span className="text-xl font-black">{stats?.orderCount || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border">
                                <div className="flex items-center gap-3">
                                    <MessageSquare className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm font-bold">Support Tickets</span>
                                </div>
                                <span className="text-xl font-black">{stats?.ticketCount || 0}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <div className="lg:col-span-2 space-y-8">
                    <Tabs defaultValue="activity" className="w-full">
                        <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-fit border border-border mb-6">
                            <TabsTrigger value="activity" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-6">
                                <History className="w-4 h-4" /> Activity Log
                            </TabsTrigger>
                            <TabsTrigger value="settings" className="rounded-xl h-auto gap-2 data-[state=active]:bg-background data-[state=active]:shadow-md font-bold px-6">
                                <ShieldAlert className="w-4 h-4" /> Security
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="activity" className="space-y-4">
                            <div className="p-12 text-center rounded-[2rem] border-2 border-dashed border-border bg-muted/10">
                                <History className="w-12 h-auto text-muted-foreground/30 mx-auto mb-4" />
                                <h4 className="font-bold text-lg">No activity recorded</h4>
                                <p className="text-sm text-muted-foreground max-w-[250px] mx-auto mt-2">The system hasn't captured any sessions or logs for this account yet.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card className="border-border/50 rounded-2xl overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="text-xl font-black">Security & Access</CardTitle>
                                    <CardDescription>Manage administrative privileges and security compliance.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-4">
                                            <div>
                                                <p className="text-xs font-black text-muted-foreground uppercase mb-3">System Role</p>
                                                <Select 
                                                    value={user.role} 
                                                    onValueChange={(value) => updateUser(user.id, { role: value })}
                                                >
                                                    <SelectTrigger className="rounded-xl h-11 font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        <SelectItem value="Admin">Administrator</SelectItem>
                                                        <SelectItem value="Editor">Content Editor</SelectItem>
                                                        <SelectItem value="Support">Support Agent</SelectItem>
                                                        <SelectItem value="Viewer">Regular Viewer</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-muted/30 border border-border flex flex-col justify-center gap-3">
                                            <p className="text-xs font-black text-muted-foreground uppercase">Multi-Factor Auth</p>
                                            <Badge variant={user.isTwoFactorEnabled ? "default" : "secondary"} className="w-fit rounded-lg h-7 font-black">
                                                {user.isTwoFactorEnabled ? "ACTIVE PROTECTION" : "MF_DISABLED"}
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 p-5 rounded-2xl bg-muted/30 border border-border flex flex-col justify-center gap-3">
                                            <p className="text-xs font-black text-muted-foreground uppercase">Verification Status</p>
                                            <Badge variant={user.isEmailVerified ? "default" : "secondary"} className="w-fit rounded-lg h-7 font-black">
                                                {user.isEmailVerified ? "EMAIL VERIFIED" : "PENDING_VERIFY"}
                                            </Badge>
                                        </div>
                                        <div className="flex-1 p-5 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-center gap-3">
                                            <p className="text-xs font-black text-muted-foreground uppercase text-primary">Credential Management</p>
                                            <Button variant="outline" className="h-10 rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/5" onClick={() => setIsResetPwdOpen(true)}>
                                                Reset Password
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
