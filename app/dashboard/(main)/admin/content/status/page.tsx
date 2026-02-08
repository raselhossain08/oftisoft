"use client";

import { useState } from "react";
import { 
    Plus, 
    Trash2, 
    Save, 
    Globe,
    Cpu,
    Zap,
    Server,
    ShieldCheck,
    Database,
    Activity,
    Signal,
    History,
    RefreshCw,
    CheckCircle2,
    Clock,
    Eye,
    ChevronRight,
    SearchCode,
    Sparkles,
    AlertTriangle,
    CheckCircle,
    Info,
    ArrowLeft,
    Monitor,
    Smartphone,
    Lock,
    RefreshCcw,
    Layout
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useStatusContentStore } from "@/lib/store/status-content";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MediaUpload } from "@/components/dashboard/media-upload";
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const iconOptions = [
    { label: "Globe", value: "Globe" },
    { label: "CPU", value: "Cpu" },
    { label: "Zap", value: "Zap" },
    { label: "Server", value: "Server" },
    { label: "Shield Check", value: "ShieldCheck" },
    { label: "Database", value: "Database" },
    { label: "Activity", value: "Activity" },
    { label: "Signal", value: "Signal" },
];

export default function StatusContentEditor() {
    const { 
        content,
        updateHeader,
        updateMainStatus,
        addSystem,
        updateSystem,
        deleteSystem,
        updateIncidentHeader,
        addIncident,
        updateIncident,
        deleteIncident,
        updateMonitoring,
        resetToDefaults
    } = useStatusContentStore();

    const [activeTab, setActiveTab] = useState("header");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewScale, setPreviewScale] = useState<'desktop' | 'mobile'>('desktop');

    if (!content) return <div className="p-20 text-center font-black animate-pulse text-muted-foreground uppercase tracking-widest">Initializing Infrastructure Hub...</div>;

    const handleSave = () => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
                loading: 'Synchronizing infrastructure matrix...',
                success: 'System Status updated globally.',
                error: 'Failed to propagate status changes.',
            }
        );
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Pro Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/40">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" asChild className="h-12 w-12 rounded-2xl">
                            <Link href="/dashboard/admin/content"><ArrowLeft className="w-5 h-5" /></Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-2xl font-black italic tracking-tight underline decoration-green-500/30 underline-offset-4 text-white">Status CMS</CardTitle>
                                <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-green-500/10 text-green-500 border-none">
                                    PULSE_ACTIVE
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                                Global Infrastructure Monitoring
                            </Label>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold border-border/50 hover:bg-muted/50 transition-colors" onClick={() => {
                            if(confirm("Structural reset to default pulse nodes?")) {
                                resetToDefaults();
                                toast.success("Infrastructure defaults restored");
                            }
                        }}>
                             <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold bg-green-500/5 border-green-500/20 text-green-500 hover:bg-green-500/10 transition-all" onClick={() => setPreviewOpen(true)}>
                            <Eye className="w-4 h-4 mr-2" /> Live Preview
                        </Button>
                        <Button className="rounded-xl font-black italic bg-green-500 text-black shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all px-8 h-11" onClick={handleSave}>
                            <Save className="w-4 h-4 mr-2" /> Sync Pulse
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex items-center gap-4">
                        <TabsList className="bg-muted/30 backdrop-blur-2xl p-1.5 rounded-[22px] h-16 w-fit border border-border/40 relative overflow-hidden shadow-2xl">
                            {[
                                { value: "header", label: "Pulse Hero", icon: Sparkles },
                                { value: "systems", label: "Node Matrix", icon: Cpu },
                                { value: "incidents", label: "Incident Log", icon: History },
                            ].map((tab) => (
                                <TabsTrigger 
                                    key={tab.value}
                                    value={tab.value} 
                                    className="relative z-10 rounded-[18px] h-13 gap-3 data-[state=active]:text-green-500 transition-all duration-500 font-black italic px-8 group data-[state=active]:bg-background/90 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] border border-transparent data-[state=active]:border-green-500/10"
                                >
                                    <tab.icon className="w-4 h-4 transition-all duration-500 group-hover:scale-110 group-data-[state=active]:scale-110 group-data-[state=active]:animate-pulse" />
                                    <span className="relative">{tab.label}</span>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-green-500/20 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-700 blur-[4px]" />
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="hidden lg:flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500/5 border border-green-500/10">
                            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase italic tracking-widest text-green-500/70">Real-Time Telemetry: ONLINE</span>
                        </div>
                    </div>

                    <div className="min-h-[600px]">
                        {/* HEADER TAB */}
                        <TabsContent value="header" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                    <CardTitle className="text-2xl font-black italic tracking-tight">Main Status Identity</CardTitle>
                                    <p className="text-sm text-muted-foreground italic font-medium">Hero content and primary status indicator for the status page.</p>
                                </CardHeader>
                                <CardContent className="p-10 space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Hero Badge Text</Label>
                                            <Input 
                                                className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic focus:ring-green-500/20"
                                                value={content.header.badge} 
                                                onChange={(e) => updateHeader({ badge: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Big Hub Title</Label>
                                            <Input 
                                                className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic focus:ring-green-500/20"
                                                value={content.header.title} 
                                                onChange={(e) => updateHeader({ title: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-10 border-t border-border/40">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-10">
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1 text-green-500">Global Pulse Headline</Label>
                                                    <Input 
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl focus:ring-green-500/20 text-white"
                                                        value={content.header.mainStatus.title} 
                                                        onChange={(e) => updateMainStatus({ title: e.target.value })} 
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1 text-green-500">Global Pulse Signal</Label>
                                                    <Input 
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic focus:ring-green-500/20"
                                                        value={content.header.mainStatus.description} 
                                                        onChange={(e) => updateMainStatus({ description: e.target.value })} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <MediaUpload 
                                                    label="Status Hero Visual (Cinematic Video/Image)" 
                                                    value={content.header.videoUrl || ''} 
                                                    onChange={(url) => updateHeader({ videoUrl: url })} 
                                                    type="video"
                                                    aspectRatio="video"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* SYSTEMS TAB */}
                        <TabsContent value="systems" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {content.systems.map((system, idx) => (
                                    <Card key={system.id} className="relative group border-border/40 bg-card/60 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 hover:shadow-green-500/5 hover:border-green-500/20">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="absolute top-6 right-6 h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"
                                            onClick={() => {
                                                if(confirm("Confirm system node de-registration?")) {
                                                    deleteSystem(system.id);
                                                    toast.success("Infrastructure node deconstructed");
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                        <CardHeader className="p-8 border-b border-border/40 bg-muted/5 min-h-[140px] flex flex-col justify-end">
                                            <div className="flex items-center gap-6">
                                                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border border-border/40", system.color.replace('text-', 'bg-') + "/10", system.color)}>
                                                    {system.iconImage ? (
                                                        <img src={system.iconImage} alt="Icon" className="w-full h-full object-cover" />
                                                    ) : (() => {
                                                        const Icon = (LucideIcons as any)[system.iconName] || Cpu;
                                                        return <Icon size={32} />;
                                                    })()}
                                                </div>
                                                <div className="flex-1">
                                                    <Input 
                                                        value={system.name} 
                                                        onChange={(e) => updateSystem(system.id, { name: e.target.value })}
                                                        className="font-black italic text-xl border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:opacity-30 text-white"
                                                        placeholder="Node Designation"
                                                    />
                                                    <Badge variant="outline" className={cn("text-[9px] font-black uppercase italic tracking-widest mt-1 border-none p-0", system.color)}>
                                                        {system.status} Node
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-8">
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Current Pulse Level</Label>
                                                <Select 
                                                    value={system.status} 
                                                    onValueChange={(val: any) => {
                                                        const color = val === "Operational" ? "text-green-500" : (val === "Degraded" ? "text-orange-500" : "text-red-500");
                                                        updateSystem(system.id, { status: val, color });
                                                    }}
                                                >
                                                    <SelectTrigger className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic focus:ring-green-500/10">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-background/95 p-2 shadow-3xl">
                                                        <SelectItem value="Operational" className="rounded-xl font-black italic py-2.5 text-green-500">Operational Node</SelectItem>
                                                        <SelectItem value="Degraded" className="rounded-xl font-black italic py-2.5 text-orange-500">Degraded Pulse</SelectItem>
                                                        <SelectItem value="Outage" className="rounded-xl font-black italic py-2.5 text-red-500">Critical De-Sync</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Uptime TS</Label>
                                                    <Input 
                                                        className="rounded-2xl h-12 border-border/40 bg-muted/20 font-bold italic"
                                                        value={system.uptime} 
                                                        onChange={(e) => updateSystem(system.id, { uptime: e.target.value })} 
                                                        placeholder="99.99%"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Lat. Pulse</Label>
                                                    <Input 
                                                        className="rounded-2xl h-12 border-border/40 bg-muted/20 font-bold italic"
                                                        value={system.latency} 
                                                        onChange={(e) => updateSystem(system.id, { latency: e.target.value })} 
                                                        placeholder="12ms"
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <MediaUpload 
                                                    label="Custom Node Icon (Image Override)" 
                                                    value={system.iconImage || ''} 
                                                    onChange={(url) => updateSystem(system.id, { iconImage: url })} 
                                                    type="image"
                                                    aspectRatio="square"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button 
                                    variant="outline" 
                                    className="h-full border-dashed border-2 min-h-[400px] flex flex-col gap-6 rounded-[40px] hover:bg-green-500/[0.03] hover:border-green-500/40 transition-all duration-700 bg-transparent group"
                                    onClick={() => {
                                        const newId = `system-${Date.now()}`;
                                        addSystem({
                                            id: newId,
                                            name: "New Interface Node",
                                            status: "Operational",
                                            uptime: "100%",
                                            latency: "0ms",
                                            iconName: "Activity",
                                            color: "text-green-500"
                                        });
                                        toast.success("New infrastructure node forged");
                                    }}
                                >
                                    <div className="w-20 h-20 rounded-[30px] bg-green-500/5 flex items-center justify-center border border-green-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                        <Plus className="w-8 h-8 text-green-500" />
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black italic tracking-tighter text-white">Forge New Node</span>
                                        <span className="text-xs text-muted-foreground/60 uppercase font-black tracking-widest mt-2 block">Expand Edge Capacity</span>
                                    </div>
                                </Button>
                            </div>
                        </TabsContent>

                        {/* INCIDENTS TAB */}
                        <TabsContent value="incidents" className="m-0 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                             <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40">
                                    <CardTitle className="text-xl font-black italic tracking-tight">Incident Rail Configuration</CardTitle>
                                    <p className="text-sm text-muted-foreground italic font-medium">Historical logs and architectural anomaly tracking.</p>
                                </CardHeader>
                                <CardContent className="p-10">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Archive Heading</Label>
                                        <Input 
                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl focus:ring-green-500/20 text-white"
                                            value={content.incidents.title} 
                                            onChange={(e) => updateIncidentHeader({ title: e.target.value })} 
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-8">
                                <Label className="text-lg font-black italic tracking-tight flex items-center gap-3 ml-4 text-white">
                                    <History className="w-5 h-5 text-orange-500" />
                                    Active Incident Registry
                                </Label>
                                <div className="grid grid-cols-1 gap-8">
                                    {content.incidents.logs.map((incident) => (
                                        <Card key={incident.id} className="relative group border-border/40 bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden transition-all duration-300 hover:border-green-500/20">
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="absolute top-6 right-6 h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-20"
                                                onClick={() => {
                                                    if(confirm("Confirm record deletion?")) {
                                                        deleteIncident(incident.id);
                                                        toast.success("Incident record de-indexed");
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                            <CardContent className="p-10 space-y-10">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-border/20">
                                                    <div className="flex items-center gap-6">
                                                        <div className={cn("w-4 h-4 rounded-full shadow-[0_0_20px_white/20]", incident.color)} />
                                                        <div>
                                                            <Input 
                                                                value={incident.title} 
                                                                onChange={(e) => updateIncident(incident.id, { title: e.target.value })}
                                                                className="font-black italic text-2xl border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:opacity-30 text-white"
                                                                placeholder="Incident Title"
                                                            />
                                                            <p className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground/60 mt-2">UUID: {incident.id}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Anomally Timestamp</Label>
                                                        <Input 
                                                            className="rounded-2xl h-12 border-border/40 bg-muted/10 font-bold italic"
                                                            value={incident.date} 
                                                            onChange={(e) => updateIncident(incident.id, { date: e.target.value })} 
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Resolution Level</Label>
                                                        <Input 
                                                            className="rounded-2xl h-12 border-border/40 bg-muted/10 font-bold italic"
                                                            value={incident.status} 
                                                            onChange={(e) => updateIncident(incident.id, { status: e.target.value })} 
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Visual Signal</Label>
                                                        <Select 
                                                            value={incident.color} 
                                                            onValueChange={(val) => updateIncident(incident.id, { color: val })}
                                                        >
                                                            <SelectTrigger className="rounded-2xl h-12 border-border/40 bg-muted/10 font-bold italic">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-background/95 p-2 shadow-3xl">
                                                                <SelectItem value="bg-green-500" className="rounded-xl font-bold py-2.5 text-green-500">Green Signal (Resolved)</SelectItem>
                                                                <SelectItem value="bg-orange-500" className="rounded-xl font-bold py-2.5 text-orange-500">Orange Signal (Investigating)</SelectItem>
                                                                <SelectItem value="bg-red-500" className="rounded-xl font-bold py-2.5 text-red-500">Red Signal (Down)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Detailed Technical Report</Label>
                                                    <Textarea 
                                                        className="rounded-[35px] border-border/40 bg-muted/10 font-bold italic p-8 leading-relaxed min-h-[140px] focus:ring-green-500/20"
                                                        value={incident.desc} 
                                                        onChange={(e) => updateIncident(incident.id, { desc: e.target.value })} 
                                                        placeholder="Technical description of the architectural state..."
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Button 
                                        variant="outline" 
                                        className="border-dashed border-2 py-16 rounded-[40px] font-black italic text-xl gap-4 hover:bg-green-500/[0.02] hover:border-green-500/30 transition-all border-border/40 flex items-center justify-center group bg-transparent text-white"
                                        onClick={() => {
                                            const newId = `incident-${Date.now()}`;
                                            addIncident({
                                                id: newId,
                                                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                                                title: "New Incident Artifact",
                                                desc: "Describe the architectural anomaly or maintenance cycle.",
                                                status: "Ongoing",
                                                color: "bg-orange-500"
                                            });
                                            toast.success("New historical node initialized");
                                        }}
                                    >
                                        <Plus className="w-8 h-8 text-green-500 transition-transform group-hover:rotate-90 duration-500" /> Init Incident Report Node
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Monitoring Settings */}
            <div className="container mx-auto px-6">
                <Card className="border-border/40 bg-green-500/[0.02] rounded-[50px] p-12 mt-16 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12">
                         <Activity className="w-32 h-32 text-green-500/5 -rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                        <div className="w-24 h-24 rounded-[32px] bg-background border-2 border-green-500/20 flex items-center justify-center shadow-xl shadow-green-500/5">
                            <Monitor className="w-12 h-12 text-green-500" />
                        </div>
                        <div className="flex-1 space-y-10 text-center lg:text-left">
                            <h3 className="text-4xl font-black italic tracking-tighter text-white">Autonomous Telemetry Hub</h3>
                            <div className="grid md:grid-cols-2 gap-10">
                                 <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Footer Pulse Note</Label>
                                    <Input 
                                        className="rounded-2xl h-14 border-border/40 bg-background/50 font-bold italic focus:ring-green-500/20"
                                        value={content.monitoring.note} 
                                        onChange={(e) => updateMonitoring({ note: e.target.value })} 
                                    />
                                </div>
                                 <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Auto-Sync Label</Label>
                                    <Input 
                                        className="rounded-2xl h-14 border-border/40 bg-background/50 font-bold italic focus:ring-green-500/20"
                                        value={content.monitoring.nextSyncText} 
                                        onChange={(e) => updateMonitoring({ nextSyncText: e.target.value })} 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Status Universe Simulator */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(34,197,94,0.3)]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5 bg-muted/30 p-1 rounded-xl border border-border/30 shadow-inner">
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'desktop' ? "bg-background text-green-500 shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('desktop')}>
                                        <Monitor size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'mobile' ? "bg-background text-green-500 shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('mobile')}>
                                        <Smartphone size={16} />
                                    </Button>
                                </div>
                                <Separator orientation="vertical" className="h-6" />
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg font-black italic tracking-tight text-white">Infrastructure Simulator</CardTitle>
                                    <span className="text-[9px] font-black uppercase text-green-500/50 tracking-widest italic -mt-0.5">TELEMETRY_NODE: PREVIEW_v2.01</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} className="rounded-full hover:bg-background/50 transition-colors">
                                <Plus className="w-6 h-6 rotate-45" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 bg-muted/10 p-12">
                            <div className={cn(
                                "mx-auto transition-all duration-1000 bg-background shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden border border-border/40",
                                previewScale === 'desktop' ? "w-[90%] rounded-[45px] min-h-[900px]" : "w-[375px] rounded-[3.5rem] min-h-[750px]"
                            )}>
                                {/* Simulated Status Content */}
                                <div className="min-h-full pb-32">
                                    {/* Simulated Hero */}
                                    <div className="relative aspect-[21/9] overflow-hidden bg-black flex items-center justify-center">
                                        {content.header.videoUrl ? (
                                            <video src={content.header.videoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-950/20" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                        <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl pt-20">
                                            <Badge className="bg-green-500/20 text-green-500 border-none px-4 py-1.5 rounded-full font-black italic tracking-[0.2em] text-[10px] uppercase shadow-xl animate-pulse">{(content.header.badge || 'TELEMETRY_INIT').toUpperCase()}</Badge>
                                            <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">{content.header.title || 'System Status.'}</h1>
                                            
                                            {/* Main Pulse Card */}
                                            <div className="mt-16 mx-auto max-w-2xl bg-white/5 backdrop-blur-3xl rounded-[40px] p-10 border border-white/10 shadow-2xl relative group overflow-hidden">
                                                <div className="absolute top-0 left-0 w-2 h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                                                <div className="flex items-center justify-between">
                                                    <div className="text-left space-y-2">
                                                        <h3 className="text-3xl font-black italic tracking-tight text-white">{content.header.mainStatus.title}</h3>
                                                        <p className="text-green-500 font-bold italic tracking-wide text-sm">{content.header.mainStatus.description}</p>
                                                    </div>
                                                    <CheckCircle2 className="w-16 h-16 text-green-500 animate-pulse" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simulated System Nodes */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12 -mt-10 relative z-20">
                                        {content.systems.map(system => (
                                            <div key={system.id} className="bg-card/70 backdrop-blur-3xl border border-border/40 p-8 rounded-[40px] shadow-2xl hover:translate-y-[-10px] transition-transform duration-500 group">
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden", system.color.replace('text-', 'bg-') + "/10", system.color)}>
                                                        {system.iconImage ? (
                                                            <img src={system.iconImage} alt="Icon" className="w-full h-full object-cover" />
                                                        ) : (() => {
                                                            const Icon = (LucideIcons as any)[system.iconName] || Cpu;
                                                            return <Icon size={28} />;
                                                        })()}
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className={cn("text-xs font-black uppercase tracking-widest", system.color)}>{system.status}</span>
                                                        <span className="text-[10px] opacity-30 font-bold">{system.uptime} Uptime</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-black italic tracking-tight text-white mb-2">{system.name}</h3>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-1 flex-1 bg-muted/20 rounded-full overflow-hidden">
                                                        <div className={cn("h-full rounded-full", system.color.replace('text-', 'bg-'))} style={{ width: '100%' }} />
                                                    </div>
                                                    <span className="text-[10px] font-black text-muted-foreground">{system.latency}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Simulated Incident Log */}
                                    <div className="mt-32 px-12 max-w-5xl mx-auto space-y-16">
                                        <div className="text-left space-y-4">
                                            <h2 className="text-5xl font-black italic tracking-tighter text-white">{content.incidents.title}</h2>
                                            <div className="h-2 w-32 bg-green-500 rounded-full" />
                                        </div>
                                        <div className="space-y-12">
                                            {content.incidents.logs.map(log => (
                                                <div key={log.id} className="relative pl-12 border-l border-white/10 py-4">
                                                    <div className={cn("absolute left-[-6px] top-6 w-3 h-3 rounded-full shadow-[0_0_15px_white/20]", log.color)} />
                                                    <div className="space-y-4">
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-sm font-black text-muted-foreground italic uppercase tracking-widest">{log.date}</span>
                                                            <Badge variant="outline" className="text-[10px] border-white/10 text-white rounded-full bg-white/5 font-black">{log.status}</Badge>
                                                        </div>
                                                        <h3 className="text-3xl font-black italic tracking-tight text-white">{log.title}</h3>
                                                        <p className="text-lg text-muted-foreground leading-relaxed italic font-medium">{log.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Simulated Footer Monitoring */}
                                    <div className="mt-32 px-12 text-center space-y-4 opacity-50">
                                         <p className="text-sm font-black italic tracking-wide">{content.monitoring.note}</p>
                                         <div className="flex items-center justify-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">{content.monitoring.nextSyncText}</span>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
