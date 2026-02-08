"use client";

import { useState, useEffect } from "react";
import { 
    Settings, 
    Mail, 
    ShieldCheck, 
    Database, 
    Key, 
    Users, 
    Globe, 
    Plus, 
    Save, 
    RefreshCcw, 
    MoreVertical, 
    RefreshCw,
    CheckCircle2,
    Clock,
    AlertCircle,
    Layout,
    ArrowUpRight,
    Server,
    Shield,
    Trash2,
    Edit,
    Monitor,
    ChevronRight,
    Search,
    UserPlus,
    Lock
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
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { systemAPI, authAPI, User, SystemConfig as SystemConfigType } from "@/lib/api";
import { Loader2 } from "lucide-react";

/**
 * System Settings - Admin Restricted
 */
export default function SystemSettingsPage() {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch Global Config
    const { data: config, isLoading: configLoading } = useQuery({
        queryKey: ["system-config"],
        queryFn: () => systemAPI.getConfig(),
    });

    // Fetch Staff
    const { data: staff, isLoading: staffLoading } = useQuery({
        queryKey: ["staff"],
        queryFn: () => systemAPI.getAllStaff(),
    });

    // Fetch API Keys
    const { data: apiKeys, isLoading: apiKeysLoading } = useQuery({
        queryKey: ["api-keys"],
        queryFn: () => systemAPI.getApiKeys(),
    });

    // Fetch Email Templates
    const { data: emailTemplates, isLoading: templatesLoading } = useQuery({
        queryKey: ["email-templates"],
        queryFn: () => systemAPI.getEmailTemplates(),
    });

    // Local form state for config
    const [formState, setFormState] = useState<Partial<SystemConfigType>>({});

    // Staff actions
    const inviteStaffMutation = useMutation({
        mutationFn: (data: { email: string, name: string }) => authAPI.register({ ...data, password: "TemporaryPassword123!", phone: "0000000000" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast.success("Operative invited to the grid.");
        }
    });

    const removeStaffMutation = useMutation({
        mutationFn: (id: string) => systemAPI.removeStaff(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast.success("Staff member removed from roster.");
        }
    });

    const updateStaffRoleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string, role: string }) => systemAPI.updateStaffRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            toast.success("Staff role updated.");
        }
    });

    // API Key actions
    const createKeyMutation = useMutation({
        mutationFn: (name: string) => systemAPI.createApiKey(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["api-keys"] });
            toast.success("New API key generated.");
        }
    });

    const revokeKeyMutation = useMutation({
        mutationFn: (id: string) => systemAPI.revokeApiKey(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["api-keys"] });
            toast.success("API key revoked.");
        }
    });

    // Sync form state when data loads
    useEffect(() => {
        if (config) {
            setFormState({
                shopName: config.shopName,
                supportEmail: config.supportEmail,
                description: config.description,
                currency: config.currency,
                timezone: config.timezone,
                dateFormat: config.dateFormat,
                maintenanceMode: config.maintenanceMode,
                passwordPolicy: config.passwordPolicy,
                allowedIps: config.allowedIps,
            });
        }
    }, [config]);

    // Update Config Mutation
    const updateMutation = useMutation({
        mutationFn: (data: Partial<SystemConfigType>) => systemAPI.updateConfig(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["system-config"] });
            toast.success("Global Architecture Synchronized");
        },
        onError: (err: any) => {
            toast.error("Synchronization Failed", {
                description: err.response?.data?.message || "Internal protocol interference detected."
            });
        }
    });

    const handleSync = () => {
        updateMutation.mutate(formState);
    };

    if (configLoading || staffLoading || apiKeysLoading || templatesLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-12 h-auto animate-spin text-primary opacity-20" />
                <p className="text-muted-foreground font-black animate-pulse">Accessing Core Architecture...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-20 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border/50 pb-10">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-foreground via-foreground to-foreground/40 bg-clip-text text-transparent">
                        System Architecture
                    </h1>
                    <p className="text-muted-foreground font-medium mt-3 max-w-2xl leading-relaxed">Manage core platform configuration, staff permissions, and global architectural nodes with industrial precision.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" className="h-14 px-8 rounded-2xl gap-3 font-black underline decoration-primary/30 underline-offset-8 decoration-2 hover:bg-muted transition-all">
                        <RefreshCcw className="w-5 h-5 opacity-40" /> Reset Staging
                    </Button>
                    <Button 
                        onClick={handleSync} 
                        disabled={updateMutation.isPending} 
                        className="h-14 px-10 rounded-2xl gap-3 font-black bg-primary text-white shadow-2xl shadow-primary/25 hover:scale-[1.03] active:scale-[0.97] transition-all"
                    >
                        {updateMutation.isPending ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Sync Architecture
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="general" className="space-y-10">
                <TabsList className="bg-muted/30 p-2 rounded-[32px] h-20 w-fit border border-border/50 backdrop-blur-3xl shadow-2xl">
                    {[
                        { value: "general", label: "Shop Logic", icon: Globe },
                        { value: "staff", label: "Operative Roster", icon: Users },
                        { value: "email", label: "Signal Templates", icon: Mail },
                        { value: "api", label: "Neural Bridge", icon: Key },
                        { value: "security", label: "Core Hardening", icon: ShieldCheck },
                    ].map((tab) => (
                        <TabsTrigger 
                            key={tab.value}
                            value={tab.value} 
                            className="rounded-[24px] h-16 gap-3 data-[state=active]:bg-background data-[state=active]:shadow-2xl data-[state=active]:text-primary font-black px-8 transition-all duration-500"
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="md:inline hidden">{tab.label}</span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* General Shop Config */}
                <TabsContent value="general" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="grid lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-none rounded-[48px] bg-muted/10 backdrop-blur-xl border border-border/40 overflow-hidden shadow-sm">
                                <CardHeader className="p-10 border-b border-border/30 bg-muted/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                             <Globe className="w-5 h-5" />
                                        </div>
                                        <CardTitle className="text-2xl font-black tracking-tight">Global Identity</CardTitle>
                                    </div>
                                    <CardDescription className="font-medium text-muted-foreground mt-2">Public facing metadata for your marketplace nodes across the grid.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 space-y-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Marketplace Labeling</Label>
                                                <Input 
                                                    value={formState.shopName || config?.shopName || ""} 
                                                    onChange={(e) => setFormState({ ...formState, shopName: e.target.value })}
                                                    className="h-14 px-6 rounded-2xl border-none bg-muted/30 focus-visible:ring-primary/20 font-black text-base" 
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">System Support Vector</Label>
                                                <Input 
                                                    value={formState.supportEmail || config?.supportEmail || ""} 
                                                    onChange={(e) => setFormState({ ...formState, supportEmail: e.target.value })}
                                                    className="h-14 px-6 rounded-2xl border-none bg-muted/30 focus-visible:ring-primary/20 font-black text-base" 
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Platform Meta-Lexicon</Label>
                                            <Textarea 
                                                rows={4} 
                                                value={formState.description || config?.description || ""} 
                                                onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                                                className="rounded-3xl border-none bg-muted/30 p-6 text-base focus-visible:ring-primary/20 transition-all font-bold resize-none" 
                                            />
                                        </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none rounded-[48px] bg-muted/10 backdrop-blur-xl border border-border/40 overflow-hidden shadow-sm">
                                <CardHeader className="p-10 border-b border-border/30 bg-muted/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                             <Layout className="w-5 h-5" />
                                        </div>
                                        <CardTitle className="text-2xl font-black tracking-tight">Fiscal Standardization</CardTitle>
                                    </div>
                                    <CardDescription className="font-medium text-muted-foreground mt-2">Normalization protocols for global transactions and temporal logging.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 grid md:grid-cols-3 gap-8">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Base Settlement Node</Label>
                                        <Input 
                                            value={formState.currency || config?.currency || ""} 
                                            onChange={(e) => setFormState({ ...formState, currency: e.target.value })}
                                            className="h-14 px-6 rounded-2xl border-none bg-muted/30 font-black" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Temporal Node</Label>
                                        <Input 
                                            value={formState.timezone || config?.timezone || ""} 
                                            onChange={(e) => setFormState({ ...formState, timezone: e.target.value })}
                                            className="h-14 px-6 rounded-2xl border-none bg-muted/30 font-black" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-2">Chronological Mask</Label>
                                        <Input 
                                            value={formState.dateFormat || config?.dateFormat || ""} 
                                            onChange={(e) => setFormState({ ...formState, dateFormat: e.target.value })}
                                            className="h-14 px-6 rounded-2xl border-none bg-muted/30 font-black" 
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-8">
                            <Card className="border-none rounded-[48px] bg-primary/[0.03] border-2 border-primary/20 overflow-hidden relative shadow-2xl group">
                                <div className="absolute top-10 right-10 group-hover:rotate-12 transition-transform duration-700"><Server size={32} className="text-primary opacity-20" /></div>
                                <CardHeader className="p-10">
                                    <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                                        <Database className="w-7 h-7 text-primary" /> Staging Node
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-10 pt-0 space-y-8">
                                    <p className="text-xs text-muted-foreground leading-relaxed font-bold">Your platform is currently synchronized with the Oftisoft Edge Proxy Node. Changes will propagate globally after a manual deployment cycle.</p>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                            <span>Signal Latency</span>
                                            <span className="text-primary">24ms (Optimal)</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: "24%" }}
                                                className="h-full bg-primary shadow-[0_0_15px_rgba(99,102,241,0.8)]" 
                                            />
                                        </div>
                                    </div>
                                    <Button className="w-full h-16 rounded-3xl font-black text-lg bg-primary text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05] active:scale-[0.95]">
                                        Propagate to Edge Nodes
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-none rounded-[48px] bg-muted/5 border border-border/40 p-10 flex flex-col items-center text-center space-y-6 group">
                                <div className="w-20 h-20 rounded-[30px] bg-background border border-border/50 flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:rotate-12 group-hover:text-primary transition-all shadow-xl">
                                    <Lock size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-black text-lg tracking-tighter">System Lock Engaged</h4>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">High-level Administrative Integrity Active</p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* Staff & Roles */}
                <TabsContent value="staff" className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
                    <Card className="border-none rounded-[48px] bg-muted/10 backdrop-blur-xl border border-border/40 overflow-hidden shadow-sm">
                        <CardHeader className="p-10 md:p-12 border-b border-border/30 bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <CardTitle className="text-3xl font-black tracking-tighter">Operative Roster</CardTitle>
                                <CardDescription className="font-medium mt-2 text-muted-foreground">Grant high-level permissions to authorized staff and manage node access keys.</CardDescription>
                            </div>
                            <Button 
                                onClick={() => {
                                    const email = prompt("Operative Email:");
                                    const name = prompt("Operative Name:");
                                    if (email && name) inviteStaffMutation.mutate({ email, name });
                                }}
                                className="h-14 px-10 rounded-2xl gap-3 font-black bg-primary text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05]"
                            >
                                <UserPlus className="w-5 h-5" /> Invite Operative
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 h-20 border-border/20">
                                        <TableHead className="px-12 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Operative Identity</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Matrix Role</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Presence Status</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60">Last Sync</TableHead>
                                        <TableHead className="text-right px-12"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {staff?.map((staff) => (
                                        <TableRow key={staff.id} className="group hover:bg-primary/[0.04] transition-all border-border/20 h-24">
                                            <TableCell className="px-12">
                                                <div className="flex items-center gap-5">
                                                    <div className="w-12 h-auto rounded-2xl bg-muted border border-border/50 flex items-center justify-center font-black text-sm group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-primary/30 group-hover:-rotate-3">
                                                        {staff.name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-base tracking-tight group-hover:text-primary transition-colors">{staff.name}</span>
                                                        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60 mt-0.5">{staff.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-primary/30 text-primary bg-primary/5 px-4 h-8 rounded-full">
                                                    {staff.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-xl w-fit border border-border/30 shadow-inner">
                                                    <div className={cn("w-2 h-2 rounded-full", staff.isActive ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" : "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]")} />
                                                    <span className={cn("text-[9px] font-black uppercase tracking-widest", staff.isActive ? "text-green-500" : "text-orange-500")}>
                                                        {staff.isActive ? "active" : "inactive"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground font-black tracking-tight">{new Date(staff.updatedAt).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right px-12">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-auto w-12 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary active:scale-90">
                                                            <MoreVertical size={20} />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-2xl bg-card/90 backdrop-blur-xl border border-border/40 shadow-2xl p-2 min-w-[160px]">
                                                        <DropdownMenuItem 
                                                            onClick={() => updateStaffRoleMutation.mutate({ id: staff.id, role: "Admin" })}
                                                            className="rounded-xl font-black tracking-tight gap-3 p-3 cursor-pointer hover:bg-primary/10 transition-all"
                                                        >
                                                            <Shield size={16} /> Make Admin
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => updateStaffRoleMutation.mutate({ id: staff.id, role: "Editor" })}
                                                            className="rounded-xl font-black tracking-tight gap-3 p-3 cursor-pointer hover:bg-primary/10 transition-all"
                                                        >
                                                            <Edit size={16} /> Make Editor
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => removeStaffMutation.mutate(staff.id)}
                                                            className="rounded-xl font-black tracking-tight gap-3 p-3 cursor-pointer text-red-500 hover:bg-red-500/10 transition-all"
                                                        >
                                                            <Trash2 size={16} /> Revoke Access
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter className="p-10 md:p-12 border-t border-border/30 bg-muted/20 flex justify-center">
                            <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 hover:text-primary hover:bg-transparent transition-all group">
                                <span className="group-hover:scale-110 transition-transform">Download Cryptographic Roster</span>
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                {/* Email Templates Content */}
                <TabsContent value="email" className="animate-in fade-in zoom-in-95 duration-500">
                    <Card className="border-none rounded-[48px] bg-muted/10 backdrop-blur-xl border border-border/40 overflow-hidden shadow-sm">
                        <CardHeader className="p-10 border-b border-border/30 bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <CardTitle className="text-3xl font-black tracking-tighter">Signal Template Hub</CardTitle>
                                <CardDescription className="font-medium mt-2 text-muted-foreground">Manage high-fidelity transactional signal templates.</CardDescription>
                            </div>
                            <Button className="h-14 px-10 rounded-2xl gap-3 font-black bg-primary text-white shadow-2xl transition-all hover:scale-[1.05]">
                                <Plus className="w-5 h-5" /> New Template
                            </Button>
                        </CardHeader>
                        <CardContent className="p-10">
                            {emailTemplates?.length === 0 ? (
                                <div className="py-20 text-center text-muted-foreground font-bold">No signal templates found. Initializing node required.</div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {emailTemplates?.map(t => (
                                        <Card key={t.id} className="rounded-3xl border-border/30 bg-background/50 p-6 flex items-center justify-between group">
                                            <div>
                                                <h4 className="font-black tracking-tight">{t.name}</h4>
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1">{t.subject}</p>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <Button size="icon" variant="ghost" className="rounded-full h-10 w-10"><Edit size={16} /></Button>
                                                <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 text-red-500"><Trash2 size={16} /></Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* API Keys Content */}
                <TabsContent value="api" className="animate-in fade-in zoom-in-95 duration-500">
                    <Card className="border-none rounded-[48px] bg-muted/10 backdrop-blur-xl border border-border/40 overflow-hidden shadow-sm">
                        <CardHeader className="p-10 border-b border-border/30 bg-muted/20 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <CardTitle className="text-3xl font-black tracking-tighter">Neural Bridge Gateway</CardTitle>
                                <CardDescription className="font-medium mt-2 text-muted-foreground">Govern cryptographically signed API keys for integrations.</CardDescription>
                            </div>
                            <Button 
                                onClick={() => {
                                    const name = prompt("Key Alias:");
                                    if (name) createKeyMutation.mutate(name);
                                }}
                                className="h-14 px-10 rounded-2xl gap-3 font-black bg-primary text-white shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05]"
                            >
                                <Plus className="w-5 h-5" /> Generate Key
                            </Button>
                        </CardHeader>
                        <CardContent className="p-10">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 border-none">
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest">Key Alias</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest">Master Key</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                                        <TableHead className="text-right px-6"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {apiKeys?.map(key => (
                                        <TableRow key={key.id} className="border-border/10 h-20">
                                            <TableCell className="font-black">{key.name}</TableCell>
                                            <TableCell className="font-mono text-xs opacity-50 tracking-tighter">{key.key.slice(0, 10)}*****************</TableCell>
                                            <TableCell>
                                                <Badge variant={key.status === "active" ? "default" : "outline"} className="text-[10px] font-black uppercase">
                                                    {key.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                {key.status === "active" && (
                                                    <Button variant="ghost" className="text-red-500 font-black text-xs uppercase" onClick={() => revokeKeyMutation.mutate(key.id)}>Revoke</Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Core Hardening (Security) Content */}
                <TabsContent value="security" className="animate-in fade-in zoom-in-95 duration-500">
                    <div className="grid lg:grid-cols-2 gap-10">
                        <Card className="border-none rounded-[48px] bg-muted/10 border border-border/40 p-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><ShieldCheck size={24} /></div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">Access Control</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Harden the perimeter nodes.</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="p-6 rounded-3xl bg-background/50 border border-border/30 flex items-center justify-between">
                                    <div>
                                        <p className="font-black tracking-tight">Mainframe Maintenance Mode</p>
                                        <p className="text-xs text-muted-foreground font-medium">Suspend public access temporarily.</p>
                                    </div>
                                    <Button 
                                        variant={formState.maintenanceMode ? "default" : "outline"}
                                        onClick={() => setFormState({ ...formState, maintenanceMode: !formState.maintenanceMode })}
                                        className="rounded-xl font-black text-[10px] uppercase"
                                    >
                                        {formState.maintenanceMode ? "Deactivate" : "Activate"}
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Whitelisted Deployment IPs</Label>
                                    <Textarea 
                                        value={formState.allowedIps}
                                        onChange={(e) => setFormState({ ...formState, allowedIps: e.target.value })}
                                        className="rounded-3xl border-none bg-muted/30 p-6 font-bold"
                                        placeholder="127.0.0.1, 192.168.1.1..."
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none rounded-[48px] bg-muted/10 border border-border/40 p-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-auto rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Lock size={24} /></div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">Credential Hierarchy</h3>
                                    <p className="text-sm text-muted-foreground font-medium">Configure global security entropy.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {["low", "medium", "high"].map((level) => (
                                    <div 
                                        key={level}
                                        onClick={() => setFormState({ ...formState, passwordPolicy: level as any })}
                                        className={cn(
                                            "p-6 rounded-3xl border cursor-pointer transition-all",
                                            formState.passwordPolicy === level ? "bg-primary/10 border-primary shadow-xl" : "bg-background/50 border-border/30 opacity-50 grayscale"
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-black uppercase tracking-widest text-sm">{level} Security Protocol</span>
                                            {formState.passwordPolicy === level && <CheckCircle2 className="text-primary w-5 h-5" />}
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase tracking-tight">
                                            {level === "low" && "Minimum 6 characters, no complexity requirements."}
                                            {level === "medium" && "Minimum 8 characters + numeric integration."}
                                            {level === "high" && "12+ characters + numeric + symbolic + case sensitivity."}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
