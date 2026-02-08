"use client";

import { useState } from "react";
import { 
    Plus, 
    Trash2, 
    Save, 
    Layout, 
    MessageSquare, 
    Terminal, 
    HelpCircle, 
    Headset, 
    Clock, 
    CheckCircle2, 
    Zap, 
    Mail, 
    Bot,
    Search,
    Cpu,
    Database,
    Cloud,
    Server,
    Smartphone,
    Globe,
    ShieldCheck,
    ArrowLeft,
    RefreshCcw,
    Eye,
    Sparkles,
    Monitor,
    ChevronRight,
    Lock
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { usePageContent } from "@/hooks/usePageContent";
import { SupportPageContent, SupportChannel, SupportFAQ, SupportMetric } from "@/lib/store/support-content";
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
    { label: "Bot", value: "Bot" },
    { label: "Chat", value: "MessageSquare" },
    { label: "Docs", value: "Terminal" },
    { label: "FAQ", value: "HelpCircle" },
    { label: "Clock", value: "Clock" },
    { label: "Shield", value: "ShieldCheck" },
    { label: "Globe", value: "Globe" },
    { label: "Support", value: "Headset" },
    { label: "Email", value: "Mail" },
    { label: "Zap", value: "Zap" },
    { label: "Check", value: "CheckCircle2" },
    { label: "Layout", value: "Layout" },
    { label: "CPU", value: "Cpu" },
    { label: "Database", value: "Database" },
    { label: "Cloud", value: "Cloud" },
    { label: "Server", value: "Server" },
    { label: "Mobile", value: "Smartphone" },
];

export default function SupportContentEditor() {
    const { pageContent, isLoading, updateContent, publishContent, isUpdating, isPublishing } = usePageContent('support');
    
    const [activeTab, setActiveTab] = useState("header");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewScale, setPreviewScale] = useState<'desktop' | 'mobile'>('desktop');
    const [localContent, setLocalContent] = useState<SupportPageContent | null>(null);

    // Initialize local content when page content loads
    if (pageContent?.content && !localContent) {
        setLocalContent(pageContent.content as SupportPageContent);
    }

    if (isLoading || !localContent) {
        return <div className="p-20 text-center font-black animate-pulse text-muted-foreground uppercase tracking-widest">Initializing Support Interface...</div>;
    }

    const handleSave = () => {
        updateContent(localContent, pageContent?.status);
    };

    const handlePublish = () => {
        updateContent(localContent, 'published');
        publishContent();
    };

    const updateHeader = (header: Partial<SupportPageContent['header']>) => {
        setLocalContent(prev => prev ? {
            ...prev,
            header: { ...prev.header, ...header },
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const addChannel = (channel: SupportChannel) => {
        setLocalContent(prev => prev ? {
            ...prev,
            channels: [...prev.channels, channel],
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const updateChannel = (id: string, channel: Partial<SupportChannel>) => {
        setLocalContent(prev => {
            if (!prev) return null;
            const channels = prev.channels.map(c => 
                c.id === id ? { ...c, ...channel } : c
            );
            return {
                ...prev,
                channels,
                lastUpdated: new Date().toISOString()
            };
        });
    };

    const deleteChannel = (id: string) => {
        setLocalContent(prev => prev ? {
            ...prev,
            channels: prev.channels.filter(c => c.id !== id),
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const updateFaqSection = (faq: Partial<SupportPageContent['faq']>) => {
        setLocalContent(prev => prev ? {
            ...prev,
            faq: { ...prev.faq, ...faq },
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const addFaqItem = (item: SupportFAQ) => {
        setLocalContent(prev => prev ? {
            ...prev,
            faq: {
                ...prev.faq,
                items: [...prev.faq.items, item]
            },
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const updateFaqItem = (id: string, item: Partial<SupportFAQ>) => {
        setLocalContent(prev => {
            if (!prev) return null;
            const items = prev.faq.items.map(f => 
                f.id === id ? { ...f, ...item } : f
            );
            return {
                ...prev,
                faq: {
                    ...prev.faq,
                    items
                },
                lastUpdated: new Date().toISOString()
            };
        });
    };

    const deleteFaqItem = (id: string) => {
        setLocalContent(prev => prev ? {
            ...prev,
            faq: {
                ...prev.faq,
                items: prev.faq.items.filter(f => f.id !== id)
            },
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const updatePriorityRelay = (relay: Partial<SupportPageContent['priorityRelay']>) => {
        setLocalContent(prev => prev ? {
            ...prev,
            priorityRelay: { ...prev.priorityRelay, ...relay },
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const updateMetric = (id: string, metric: Partial<SupportMetric>) => {
        setLocalContent(prev => {
            if (!prev) return null;
            const metrics = prev.priorityRelay.metrics.map(m => 
                m.id === id ? { ...m, ...metric } : m
            );
            return {
                ...prev,
                priorityRelay: {
                    ...prev.priorityRelay,
                    metrics
                },
                lastUpdated: new Date().toISOString()
            };
        });
    };

    const resetToDefaults = () => {
        const defaultContent: SupportPageContent = {
            header: {
                badge: "Architectural Assistance Hub",
                title: "Support Universe.",
                searchPlaceholder: "Find architectural support nodes...",
                videoUrl: ""
            },
            channels: [
                { id: "bot", title: "Neural Chat Bot", desc: "Immediate AI assistance for architectural queries and node status.", iconName: "Bot", color: "text-primary" },
            ],
            faq: {
                badge: "Protocol Intelligence",
                title: "Frequent Sync Questions",
                items: [
                    { id: "sync", q: "How do I initiate a neural sync?", a: "Navigate to the Visual Forge in your dashboard and commit your first node artifact." },
                ]
            },
            priorityRelay: {
                title: "Priority Relay",
                description: "Elite and Enterprise architects can initiate a high-fidelity direct sync with our core engineering operative.",
                buttons: [
                    { label: "Initiate Priority Sync", iconName: "Zap", variant: "default" },
                    { label: "Email Case Relay", iconName: "Mail", variant: "outline" }
                ],
                metrics: [
                    { id: "response", label: "Current Response Window", value: "~ 8 Minutes", iconName: "Clock" },
                ]
            },
            lastUpdated: new Date().toISOString()
        };
        setLocalContent(defaultContent);
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
                                <CardTitle className="text-2xl font-black italic tracking-tight underline decoration-primary/30 underline-offset-4">Support CMS</CardTitle>
                                <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-primary/10 text-primary border-none">
                                    Active HUB
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                                Support & Knowledge Management
                            </Label>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold border-border/50 hover:bg-muted/50 transition-colors" onClick={() => {
                            if(confirm("Confirm reset to architectural defaults?")) {
                                resetToDefaults();
                                toast.success("Support defaults restored");
                            }
                        }}>
                             <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-all" onClick={() => setPreviewOpen(true)}>
                            <Eye className="w-4 h-4 mr-2" /> Live Preview
                        </Button>
                        <Button 
                            className="rounded-xl font-bold bg-muted text-foreground shadow-lg hover:bg-muted/80" 
                            onClick={handleSave}
                            disabled={isUpdating}
                        >
                            <Save className="w-4 h-4 mr-2" /> {isUpdating ? "Saving..." : "Save Draft"}
                        </Button>
                        <Button 
                            className="rounded-xl font-black italic bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" 
                            onClick={handlePublish}
                            disabled={isPublishing || isUpdating}
                        >
                            <Sparkles className="w-4 h-4 mr-2 text-white" /> {isPublishing ? "Publishing..." : "Publish Live"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex items-center gap-4">
                        <TabsList className="bg-muted/30 backdrop-blur-2xl p-1.5 rounded-[22px] h-16 w-fit border border-border/40 relative overflow-hidden shadow-2xl">
                            {[
                                { value: "header", label: "Page Header", icon: Sparkles },
                                { value: "channels", label: "Touchpoints", icon: Headset },
                                { value: "faq", label: "Knowledge Base", icon: HelpCircle },
                                { value: "priority", label: "Priority Relay", icon: Zap },
                            ].map((tab) => (
                                <TabsTrigger 
                                    key={tab.value}
                                    value={tab.value} 
                                    className="relative z-10 rounded-[18px] h-13 gap-3 data-[state=active]:text-primary transition-all duration-500 font-black italic px-8 group data-[state=active]:bg-background/90 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] border border-transparent data-[state=active]:border-primary/10"
                                >
                                    <tab.icon className="w-4 h-4 transition-all duration-500 group-hover:scale-110 group-data-[state=active]:scale-110 group-data-[state=active]:animate-pulse" />
                                    <span className="relative">{tab.label}</span>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary/20 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-700 blur-[4px]" />
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="hidden lg:flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10">
                            <Lock className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase italic tracking-widest text-primary/70">Support Node Encryption: AES-256</span>
                        </div>
                    </div>

                    <div className="min-h-[600px]">
                        {/* HEADER TAB */}
                        <TabsContent value="header" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                    <CardTitle className="text-2xl font-black italic tracking-tight">Support Hero Configuration</CardTitle>
                                    <p className="text-sm text-muted-foreground italic font-medium">Define the core entry point for the Support Universe.</p>
                                </CardHeader>
                                <CardContent className="p-10 space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Hero Badge Text</Label>
                                            <Input 
                                                className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic focus:ring-primary/20"
                                                value={localContent.header.badge} 
                                                onChange={(e) => updateHeader({ badge: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Hero Primary Title</Label>
                                            <Input 
                                                className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic focus:ring-primary/20"
                                                value={localContent.header.title} 
                                                onChange={(e) => updateHeader({ title: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Search Bar Placeholder</Label>
                                            <Input 
                                                className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic focus:ring-primary/20"
                                                value={localContent.header.searchPlaceholder} 
                                                onChange={(e) => updateHeader({ searchPlaceholder: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <MediaUpload 
                                                label="Hero Cinematic Preview (Video/Image)" 
                                                value={localContent.header.videoUrl || ''} 
                                                onChange={(url) => updateHeader({ videoUrl: url })} 
                                                type="video"
                                                aspectRatio="video"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* CHANNELS TAB */}
                        <TabsContent value="channels" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {localContent.channels.map((channel: SupportChannel, idx: number) => (
                                    <Card key={channel.id} className="relative group border-border/40 bg-card/60 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="absolute top-6 right-6 h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"
                                            onClick={() => {
                                                if(confirm("Confirm channel deactivation?")) {
                                                    deleteChannel(channel.id);
                                                    toast.success("Support channel deconstructed");
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                        <CardHeader className="p-8 border-b border-border/40 bg-muted/5 min-h-[140px] flex flex-col justify-end">
                                            <div className="flex items-center gap-6">
                                                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden border border-border/40", channel.color.replace('text-', 'bg-') + "/10", channel.color)}>
                                                    {channel.iconImage ? (
                                                        <img src={channel.iconImage} alt="Icon" className="w-full h-full object-cover" />
                                                    ) : (() => {
                                                        const Icon = (LucideIcons as any)[channel.iconName] || MessageSquare;
                                                        return <Icon size={32} />;
                                                    })()}
                                                </div>
                                                <div className="flex-1">
                                                    <Input 
                                                        value={channel.title} 
                                                        onChange={(e) => updateChannel(channel.id, { title: e.target.value })}
                                                        className="font-black italic text-xl border-none bg-transparent h-auto p-0 focus-visible:ring-0 placeholder:opacity-30"
                                                        placeholder="Channel Title"
                                                    />
                                                    <Badge variant="outline" className="text-[10px] font-black uppercase italic tracking-widest text-muted-foreground/40 mt-1 border-none p-0">Node_ID: {idx + 1}</Badge>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-8">
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Channel Abstract</Label>
                                                <Textarea 
                                                    className="rounded-3xl border-border/40 bg-muted/20 font-bold italic min-h-[100px] leading-relaxed p-6"
                                                    value={channel.desc} 
                                                    onChange={(e) => updateChannel(channel.id, { desc: e.target.value })} 
                                                    placeholder="Enter channel description..."
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Lucide Symbol</Label>
                                                    <Select 
                                                        value={channel.iconName} 
                                                        onValueChange={(val) => updateChannel(channel.id, { iconName: val })}
                                                    >
                                                        <SelectTrigger className="rounded-2xl h-12 border-border/40 bg-muted/20 font-bold italic">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-background/95 p-2 shadow-3xl">
                                                            {iconOptions.map(opt => (
                                                                <SelectItem key={opt.value} value={opt.value} className="rounded-xl font-bold py-2.5 italic">{opt.label}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Visual Class</Label>
                                                    <Input 
                                                        className="rounded-2xl h-12 border-border/40 bg-muted/20 font-bold italic"
                                                        value={channel.color} 
                                                        onChange={(e) => updateChannel(channel.id, { color: e.target.value })} 
                                                        placeholder="text-primary"
                                                    />
                                                </div>
                                            </div>
                                            <div className="pt-2">
                                                <MediaUpload 
                                                    label="Custom Channel Icon (Image Override)" 
                                                    value={channel.iconImage || ''} 
                                                    onChange={(url) => updateChannel(channel.id, { iconImage: url })} 
                                                    type="image"
                                                    aspectRatio="square"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button 
                                    variant="outline" 
                                    className="h-full border-dashed border-2 min-h-[400px] flex flex-col gap-6 rounded-[40px] hover:bg-primary/[0.03] hover:border-primary/40 transition-all duration-700 bg-transparent group"
                                    onClick={() => {
                                        const newId = `channel-${Date.now()}`;
                                        addChannel({
                                            id: newId,
                                            title: "New High-Fidelity Channel",
                                            desc: "Direct-link communication with localized support operatives.",
                                            iconName: "Headset",
                                            color: "text-primary"
                                        });
                                        toast.success("New channel forged in the universe");
                                    }}
                                >
                                    <div className="w-20 h-20 rounded-[30px] bg-primary/5 flex items-center justify-center border border-primary/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                        <Plus className="w-8 h-8 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black italic tracking-tighter">Forge New Channel</span>
                                        <span className="text-xs text-muted-foreground/60 uppercase font-black tracking-widest mt-2 block">Increase Architectural Touchpoints</span>
                                    </div>
                                </Button>
                            </div>
                        </TabsContent>

                        {/* FAQ TAB - Due to length, I'll continue in the next part */}
                        <TabsContent value="faq" className="m-0 space-y-12 animate-in fade-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                    <CardTitle className="text-xl font-black italic">Knowledge Base Identity</CardTitle>
                                    <p className="text-sm text-muted-foreground italic">Global branding for the frequently asked protocol section.</p>
                                </CardHeader>
                                <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Section Header Badge</Label>
                                        <Input 
                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic"
                                            value={localContent.faq.badge} 
                                            onChange={(e) => updateFaqSection({ badge: e.target.value })} 
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Section Large Title</Label>
                                        <Input 
                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic"
                                            value={localContent.faq.title} 
                                            onChange={(e) => updateFaqSection({ title: e.target.value })} 
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-6">
                                <Label className="text-lg font-black italic tracking-tight flex items-center gap-3 ml-4">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                    Active Knowledge Nodes
                                </Label>
                                <div className="grid grid-cols-1 gap-6">
                                {localContent.faq.items.map((item: SupportFAQ, idx: number) => (
                                    <Card key={item.id} className="relative group border-border/40 bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden transition-all duration-300 hover:border-primary/20">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="absolute top-6 right-6 h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-20"
                                            onClick={() => {
                                                if(confirm("Confirm node deletion?")) {
                                                    deleteFaqItem(item.id);
                                                    toast.success("FAQ node deconstructed");
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                        <CardContent className="p-8 space-y-8 flex items-start gap-10">
                                            <div className="w-12 h-12 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-center shrink-0">
                                                <span className="text-xl font-black italic text-muted-foreground/20">{idx + 1}</span>
                                            </div>
                                            <div className="flex-1 space-y-6 pt-1">
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Inquiry/Question</Label>
                                                    <Input 
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/10 font-black italic text-lg focus:ring-primary/20"
                                                        value={item.q} 
                                                        onChange={(e) => updateFaqItem(item.id, { q: e.target.value })} 
                                                        placeholder="How do I...?"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Architectural Response/Answer</Label>
                                                    <Textarea 
                                                        className="rounded-3xl border-border/40 bg-muted/10 font-bold italic min-h-[120px] p-6 leading-relaxed focus:ring-primary/20"
                                                        value={item.a} 
                                                        onChange={(e) => updateFaqItem(item.id, { a: e.target.value })} 
                                                        placeholder="The architectural response is..."
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button 
                                    variant="outline" 
                                    className="border-dashed border-2 py-16 rounded-[35px] font-black italic text-xl gap-4 hover:bg-primary/[0.03] hover:border-primary/30 transition-all border-border/40 group bg-transparent"
                                    onClick={() => {
                                        const newId = `faq-${Date.now()}`;
                                        addFaqItem({
                                            id: newId,
                                            q: "New Support Query Node?",
                                            a: "Knowledge artifact intelligence goes here."
                                        });
                                        toast.success("Knowledge node added to matrix");
                                    }}
                                >
                                    <Plus className="w-6 h-6 transition-transform group-hover:rotate-90 duration-500" /> Forge New Intellectual Artifact
                                </Button>
                                </div>
                            </div>
                        </TabsContent>

                        {/* PRIORITY RELAY TAB - Continuing... */}
                        <TabsContent value="priority" className="m-0 space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/60 backdrop-blur-2xl rounded-[40px] overflow-hidden shadow-2xl relative">
                                <div className="absolute top-0 right-0 p-10 select-none">
                                    <Zap className="w-24 h-24 text-primary/10 -rotate-12 animate-pulse" />
                                </div>
                                <CardHeader className="p-10 border-b border-border/40 bg-primary/5">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                                            <Zap size={32} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black italic tracking-tight">Priority Relay Interface</CardTitle>
                                            <p className="text-sm text-muted-foreground italic font-medium">Bespoke support protocols for Enterprise & Elite architects.</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-10 space-y-12">
                                    <div className="space-y-10">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Relay Global Title</Label>
                                            <Input 
                                                className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl focus:ring-primary/20"
                                                value={localContent.priorityRelay.title} 
                                                onChange={(e) => updatePriorityRelay({ title: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Relay Proposition/Description</Label>
                                            <Textarea 
                                                className="rounded-[35px] border-border/40 bg-muted/20 font-black italic p-8 text-xl leading-relaxed min-h-[160px] focus:ring-primary/20"
                                                value={localContent.priorityRelay.description} 
                                                onChange={(e) => updatePriorityRelay({ description: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6 pt-8 border-t border-border/40">
                                        <Label className="text-sm font-black italic tracking-widest uppercase text-primary/70 ml-1 flex items-center gap-2">
                                            <Smartphone className="w-4 h-4" />
                                            Active Relay Triggers (Buttons)
                                        </Label>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {localContent.priorityRelay.buttons.map((btn, idx) => (
                                                <Card key={idx} className="bg-muted/10 border-border/40 rounded-[32px] overflow-hidden group hover:border-primary/20 transition-all">
                                                    <CardContent className="p-8 space-y-6">
                                                        <div className="space-y-4">
                                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Trigger Label</Label>
                                                            <Input 
                                                                className="rounded-2xl h-12 border-border/40 bg-background/50 font-bold italic"
                                                                value={btn.label} 
                                                                onChange={(e) => {
                                                                    const newButtons = [...localContent.priorityRelay.buttons];
                                                                    newButtons[idx] = { ...newButtons[idx], label: e.target.value };
                                                                    updatePriorityRelay({ buttons: newButtons });
                                                                }} 
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-4">
                                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Trigger Symbol</Label>
                                                                <Select 
                                                                    value={btn.iconName} 
                                                                    onValueChange={(val) => {
                                                                        const newButtons = [...localContent.priorityRelay.buttons];
                                                                        newButtons[idx] = { ...newButtons[idx], iconName: val };
                                                                        updatePriorityRelay({ buttons: newButtons });
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="rounded-2xl h-12 border-border/40 bg-background/50 font-bold italic">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-background/95 p-2 shadow-3xl">
                                                                        {iconOptions.map(opt => (
                                                                            <SelectItem key={opt.value} value={opt.value} className="rounded-xl font-bold py-2.5 italic">{opt.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Trigger Architecture</Label>
                                                                <Select 
                                                                    value={btn.variant} 
                                                                    onValueChange={(val: any) => {
                                                                        const newButtons = [...localContent.priorityRelay.buttons];
                                                                        newButtons[idx] = { ...newButtons[idx], variant: val };
                                                                        updatePriorityRelay({ buttons: newButtons });
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="rounded-2xl h-12 border-border/40 bg-background/50 font-bold italic">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-background/95 p-2 shadow-3xl">
                                                                        <SelectItem value="default" className="rounded-xl font-bold py-2.5 italic">Primary Node</SelectItem>
                                                                        <SelectItem value="outline" className="rounded-xl font-bold py-2.5 italic">Ghost Node</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6 pt-12 border-t border-border/40">
                                        <Label className="text-sm font-black italic tracking-widest uppercase text-primary/70 ml-1 flex items-center gap-2">
                                            <Cpu className="w-4 h-4" />
                                            Relay Performance Metrics
                                        </Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {localContent.priorityRelay.metrics.map((metric) => (
                                                <Card key={metric.id} className="bg-muted/10 border-border/40 rounded-[32px] overflow-hidden group hover:border-primary/20 transition-all">
                                                    <CardContent className="p-8 space-y-6">
                                                        <div className="space-y-4">
                                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Metric Designation</Label>
                                                            <Input 
                                                                className="rounded-2xl h-12 border-border/40 bg-background/50 font-bold italic"
                                                                value={metric.label} 
                                                                onChange={(e) => updateMetric(metric.id, { label: e.target.value })} 
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-6">
                                                            <div className="space-y-4">
                                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Live Telemetry Value</Label>
                                                                <Input 
                                                                    className="rounded-2xl h-12 border-border/40 bg-background/50 font-black italic text-primary"
                                                                    value={metric.value} 
                                                                    onChange={(e) => updateMetric(metric.id, { value: e.target.value })} 
                                                                />
                                                            </div>
                                                            <div className="space-y-4">
                                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Metric Symbol</Label>
                                                                <Select 
                                                                    value={metric.iconName} 
                                                                    onValueChange={(val) => updateMetric(metric.id, { iconName: val })}
                                                                >
                                                                    <SelectTrigger className="rounded-2xl h-12 border-border/40 bg-background/50 font-bold italic">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-background/95 p-2 shadow-3xl">
                                                                        {iconOptions.map(opt => (
                                                                            <SelectItem key={opt.value} value={opt.value} className="rounded-xl font-bold py-2.5 italic">{opt.label}</SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-10 bg-primary/[0.03] border-t border-border/40 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                        <span className="text-[10px] font-black uppercase italic text-primary tracking-[0.3em]">Direct Relay Sync Active</span>
                                    </div>
                                    <ShieldCheck className="w-5 h-5 text-primary opacity-30" />
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Support Universe Simulator */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5 bg-muted/30 p-1 rounded-xl border border-border/30 shadow-inner">
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'desktop' ? "bg-background text-primary shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('desktop')}>
                                        <Monitor size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'mobile' ? "bg-background text-primary shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('mobile')}>
                                        <Smartphone size={16} />
                                    </Button>
                                </div>
                                <Separator orientation="vertical" className="h-6" />
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg font-black italic tracking-tight">Support Universe Simulator</CardTitle>
                                    <span className="text-[9px] font-black uppercase text-primary/50 tracking-widest italic -mt-0.5">Architectural Node: PREVIEW_v1.02</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} className="rounded-full hover:bg-background/50 transition-colors">
                                <Plus className="w-6 h-6 rotate-45" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 bg-muted/10 p-12">
                            <div className={cn(
                                "mx-auto transition-all duration-1000 bg-background shadow-[0_0_80px_rgba(0,0,0,0.2)] overflow-hidden border border-border/40",
                                previewScale === 'desktop' ? "w-[90%] rounded-[45px] min-h-[900px]" : "w-[375px] rounded-[3.5rem] min-h-[750px]"
                            )}>
                                {/* Simulated Support Content */}
                                <div className="min-h-full pb-20">
                                    {/* Simulated Hero */}
                                    <div className="relative aspect-[21/9] overflow-hidden bg-black flex items-center justify-center">
                                        {localContent.header.videoUrl ? (
                                            <video src={localContent.header.videoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-indigo-950/20" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                        <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl pt-20">
                                            <Badge className="bg-primary/20 text-primary border-none px-4 py-1.5 rounded-full font-black italic tracking-[0.2em] text-[10px] uppercase shadow-xl animate-pulse">{(localContent.header.badge || 'PROTCOL_INIT').toUpperCase()}</Badge>
                                            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">{localContent.header.title || 'Support Universe.'}</h1>
                                            <div className="max-w-xl mx-auto relative group mt-10">
                                                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                                <div className="relative h-16 bg-white/10 backdrop-blur-3xl rounded-2xl border border-white/20 flex items-center px-6 gap-4 shadow-2xl overflow-hidden">
                                                    <Search className="w-5 h-5 text-white/50" />
                                                    <span className="text-white/30 italic font-black text-lg">{localContent.header.searchPlaceholder || 'Query intelligence...'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Simulated Channels */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 -mt-16 relative z-20">
                                        {localContent.channels.map((channel: SupportChannel) => (
                                            <div key={channel.id} className="bg-card/70 backdrop-blur-3xl border border-border/40 p-10 rounded-[40px] shadow-2xl hover:translate-y-[-10px] transition-transform duration-500">
                                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-inner overflow-hidden", channel.color.replace('text-', 'bg-') + "/10", channel.color)}>
                                                    {channel.iconImage ? (
                                                        <img src={channel.iconImage} alt="Icon" className="w-full h-full object-cover" />
                                                    ) : (() => {
                                                        const Icon = (LucideIcons as any)[channel.iconName] || Headset;
                                                        return <Icon size={28} />;
                                                    })()}
                                                </div>
                                                <h3 className="text-2xl font-black italic mb-4 tracking-tight">{channel.title}</h3>
                                                <p className="text-muted-foreground italic font-medium leading-relaxed">{channel.desc}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Simulated FAQ */}
                                    <div className="mt-32 px-12 max-w-5xl mx-auto space-y-16">
                                        <div className="text-center space-y-4">
                                            <Badge variant="outline" className="border-primary/20 text-primary font-black uppercase italic tracking-widest text-[9px] px-3">{localContent.faq.badge}</Badge>
                                            <h2 className="text-5xl font-black italic tracking-tighter">{localContent.faq.title}</h2>
                                        </div>
                                        <div className="grid gap-6">
                                            {localContent.faq.items.slice(0, 3).map((item: SupportFAQ) => (
                                                <div key={item.id} className="p-8 rounded-[30px] bg-muted/10 border border-border/20 flex items-center justify-between group cursor-pointer hover:bg-primary/[0.02] transition-colors">
                                                    <p className="text-xl font-black italic tracking-tight">{item.q}</p>
                                                    <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Simulated Relay */}
                                    <div className="mt-32 px-12">
                                        <div className="rounded-[50px] bg-primary/[0.03] border border-primary/10 p-16 flex flex-col items-center text-center space-y-8 relative overflow-hidden group">
                                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />
                                            <Badge className="bg-primary text-white border-none px-4 py-1.5 rounded-full font-black italic tracking-widest text-[10px] uppercase shadow-xl shadow-primary/20">PRIORITY_ACCESS</Badge>
                                            <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter max-w-3xl">{localContent.priorityRelay.title}</h2>
                                            <p className="text-xl text-muted-foreground/80 italic font-medium max-w-2xl">{localContent.priorityRelay.description}</p>
                                            <div className="flex gap-4 pt-4">
                                                {localContent.priorityRelay.buttons.map((btn, i) => (
                                                    <Button key={i} variant={btn.variant as any} className="h-16 px-10 rounded-2xl font-black italic text-lg shadow-2xl border-2">
                                                        {(() => {
                                                            const Icon = (LucideIcons as any)[btn.iconName] || Zap;
                                                            return <Icon className="mr-3 w-5 h-5" />;
                                                        })()}
                                                        {btn.label}
                                                    </Button>
                                                ))}
                                            </div>
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
