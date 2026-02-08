"use client";

import { useState, useEffect, useRef } from "react";
import {
    ArrowLeft,
    Globe,
    Plus,
    Save,
    Trash2,
    RefreshCcw,
    Trophy,
    Zap,
    Layout,
    Rocket,
    Building2,
    Users,
    Clock,
    User,
    FileText,
    Eye,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { useAboutContentStore } from "@/lib/store/about-content";
import { MediaUpload } from "@/components/dashboard/media-upload";
import { useAboutContent, useUpdateAboutContent, usePublishAboutContent } from "@/lib/api/about-queries";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AboutContentEditor() {
    const {
        content,
        setContent,
        updateHero,
        updateStats,
        updateMission,
        updateCulture,
        updateTeam,
        updateValues,
        updateValuesInfo,
        updateAwards,
        updateAwardsInfo,
        updateTimeline,
        updateTimelineInfo,
        updateFounder,
        updateCTA,
        updateSEO,
        setStatus,
        isSaving,
        setSaving,
        resetToDefaults,
    } = useAboutContentStore();

    const { data: apiContent } = useAboutContent();
    const updateMutation = useUpdateAboutContent();
    const publishMutation = usePublishAboutContent();

    const [activeTab, setActiveTab] = useState('hero');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
    }>({ open: false, title: "", description: "", onConfirm: () => {} });
    const hasHydrated = useRef(false);

    useEffect(() => {
        if (apiContent && !hasHydrated.current) {
            setContent(apiContent);
            hasHydrated.current = true;
        }
    }, [apiContent, setContent]);

    useEffect(() => {
        if (!content) return;
        const needsSync = !content.mission || !content.culture || !content.team || !content.founder || !content.cta;
        if (needsSync) {
            if (!content.mission) updateMission({});
            if (!content.culture) updateCulture({ items: [] });
            if (!content.team) updateTeam({ members: [] });
            if (!content.founder) updateFounder({ stats: [], socials: { twitter: '', linkedin: '', github: '' } });
            if (!content.cta) updateCTA({});
            toast.info("Store synchronized with latest schema");
        }
    }, [content]);

    useEffect(() => {
        if (!content) return;
        const timer = setTimeout(() => handleAutoSave(), 10000);
        return () => clearTimeout(timer);
    }, [content]);

    const handleAutoSave = async () => {
        if (!content) return;
        setSaving(true);
        try {
            await updateMutation.mutateAsync(content);
        } catch (error) {
            console.error('Auto-save failed', error);
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        if (!content) return;
        await updateMutation.mutateAsync(content);
    };

    const handlePublish = async () => {
        try {
            await publishMutation.mutateAsync();
            setStatus('published');
        } catch (error) {
            console.error('Publish failed', error);
        }
    };

    const openConfirm = (title: string, description: string, onConfirm: () => void) => {
        setConfirmDialog({ open: true, title, description, onConfirm });
    };
    const closeConfirm = () => setConfirmDialog((prev) => ({ ...prev, open: false }));
    const handleConfirm = () => {
        confirmDialog.onConfirm();
        closeConfirm();
    };

    if (!content) return <div className="flex items-center justify-center min-h-screen"><RefreshCcw className="w-12 h-12 animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" asChild className="h-12 w-12 rounded-2xl">
                            <Link href="/dashboard/admin/content"><ArrowLeft className="w-5 h-5" /></Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-2xl font-black italic">About Page Editor</CardTitle>
                                <Badge variant="outline" className={cn(
                                    "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic",
                                    content.status === 'published' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                )}>
                                    {content.status}
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/60 mt-1 block uppercase tracking-wider font-bold">
                                Last updated: {new Date(content.lastUpdated || '').toLocaleString()}
                            </Label>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {(isSaving || updateMutation.isPending) && (
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 animate-pulse gap-2 px-3 py-1">
                                <RefreshCcw className="w-3 h-3 animate-spin" />
                                Saving...
                            </Badge>
                        )}
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold border-border/50 hover:bg-muted/50"
                            onClick={() =>
                                openConfirm(
                                    "Reset to defaults",
                                    "Reset all about content to defaults? This cannot be undone.",
                                    () => {
                                        resetToDefaults();
                                        toast.success("About defaults restored");
                                    }
                                )
                            }
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-xl font-bold bg-sky-500/5 border-sky-500/20 text-sky-500"
                            onClick={() => setPreviewOpen(true)}
                        >
                            <Eye className="w-4 h-4 mr-2" /> Live Preview
                        </Button>
                        <Button
                            className="rounded-xl font-black italic bg-sky-500 text-white shadow-lg px-6"
                            onClick={handleSave}
                            disabled={updateMutation.isPending || !content}
                        >
                            {updateMutation.isPending ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {updateMutation.isPending ? "Syncing…" : "Sync Repo"}
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="rounded-2xl gap-2 bg-primary text-white font-black">
                                    <Globe className="w-4 h-4" /> Publish Live
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2.5rem]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black italic">Deploy to Global Edge?</DialogTitle>
                                    <DialogDescription className="italic">
                                        This will propagate all architectural changes to the production environment.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" className="rounded-xl">Cancel</Button>
                                    <Button className="rounded-xl bg-primary text-white" onClick={handlePublish}>Initiate Deployment</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-3">
                        <Card className="rounded-[32px] overflow-hidden border-border/50">
                            <CardHeader className="p-6 pb-2"><CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Neural Sections</CardTitle></CardHeader>
                            <CardContent className="p-4 space-y-1">
                                {[
                                    { id: 'hero', label: 'Hero', icon: Layout },
                                    { id: 'stats', label: 'Stats', icon: Zap },
                                    { id: 'mission', label: 'Mission', icon: Rocket },
                                    { id: 'culture', label: 'Culture', icon: Building2 },
                                    { id: 'team', label: 'Team', icon: Users },
                                    { id: 'values', label: 'Values', icon: Trophy },
                                    { id: 'awards', label: 'Awards', icon: Trophy },
                                    { id: 'timeline', label: 'Timeline', icon: Clock },
                                    { id: 'founder', label: 'Founder', icon: User },
                                    { id: 'cta', label: 'CTA', icon: FileText },
                                    { id: 'seo', label: 'SEO', icon: Globe },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <Button 
                                            key={tab.id} 
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start h-11 rounded-xl font-bold capitalize gap-3 transition-all duration-300",
                                                activeTab === tab.id 
                                                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                                                    : "hover:bg-primary/5 text-muted-foreground hover:text-primary"
                                            )}
                                            onClick={() => {
                                                console.log('Switching to tab:', tab.id);
                                                setActiveTab(tab.id);
                                            }}
                                        >
                                            <Icon className={cn("w-4 h-4 transition-transform", activeTab === tab.id ? "scale-110" : "")} />
                                            {tab.label}
                                        </Button>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Editor */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Hero Section */}
                        {activeTab === 'hero' && content?.hero && (
                            <Card className="rounded-[40px]">
                                <CardHeader className="p-10"><CardTitle className="text-2xl font-black">Hero Section</CardTitle></CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    <div><Label>Badge Text</Label><Input value={content.hero.badge || ''} onChange={(e) => updateHero({ badge: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div><Label>Main Title</Label><Input value={content.hero.title || ''} onChange={(e) => updateHero({ title: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div><Label>Highlighted Word</Label><Input value={content.hero.highlightedWord || ''} onChange={(e) => updateHero({ highlightedWord: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div><Label>Description</Label><Textarea value={content.hero.description || ''} onChange={(e) => updateHero({ description: e.target.value })} className="rounded-2xl min-h-[120px]" /></div>
                                    <Separator />
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div><Label>CTA Button Text</Label><Input value={content.hero.ctaText || ''} onChange={(e) => updateHero({ ctaText: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>CTA Link</Label><Input value={content.hero.ctaLink || ''} onChange={(e) => updateHero({ ctaLink: e.target.value })} className="h-11 rounded-xl" /></div>
                                    </div>
                                    <Separator />
                                    <div><Label>Card Title</Label><Input value={content.hero.cardTitle || ''} onChange={(e) => updateHero({ cardTitle: e.target.value })} className="h-11 rounded-xl" /></div>
                                    <div><Label>Card Description</Label><Input value={content.hero.cardDescription || ''} onChange={(e) => updateHero({ cardDescription: e.target.value })} className="h-11 rounded-xl" /></div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Stats Section */}
                        {activeTab === 'stats' && (
                            <Card className="rounded-[40px]">
                                <CardHeader className="p-10 flex flex-row items-center justify-between">
                                    <CardTitle className="text-2xl font-black">Stats Section</CardTitle>
                                    <Button onClick={() => updateStats([...(content.stats || []), { id: Date.now().toString(), label: 'New Stat', value: '0', icon: 'Zap' }])} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" />Add Stat
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    {(content.stats || []).map((stat, idx) => (
                                        <Card key={stat.id} className="p-6 rounded-3xl border-border/50">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-4">
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <div><Label>Label</Label><Input value={stat.label || ''} onChange={(e) => {
                                                            const newStats = [...(content.stats || [])];
                                                            newStats[idx] = { ...newStats[idx], label: e.target.value };
                                                            updateStats(newStats);
                                                        }} className="h-11 rounded-xl" /></div>
                                                        <div><Label>Value</Label><Input value={stat.value || ''} onChange={(e) => {
                                                            const newStats = [...(content.stats || [])];
                                                            newStats[idx] = { ...newStats[idx], value: e.target.value };
                                                            updateStats(newStats);
                                                        }} className="h-11 rounded-xl" /></div>
                                                        <div className="flex gap-4 items-end">
                                                            <div className="flex-1">
                                                                <Label>Icon (Lucide)</Label>
                                                                <Input value={stat.icon || ''} onChange={(e) => {
                                                                    const newStats = [...(content.stats || [])];
                                                                    newStats[idx] = { ...newStats[idx], icon: e.target.value };
                                                                    updateStats(newStats);
                                                                }} className="h-11 rounded-xl" placeholder="Globe, Users, Zap" />
                                                            </div>
                                                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mb-0.5">
                                                                {(() => {
                                                                    const Icon = (LucideIcons as any)[stat.icon || 'Zap'] || Zap;
                                                                    return <Icon className="w-5 h-5" />;
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-500/10 rounded-xl"
                                                    onClick={() =>
                                                        openConfirm(
                                                            "Delete stat",
                                                            `Remove the "${stat.label}" stat?`,
                                                            () => {
                                                                updateStats((content.stats || []).filter((_, i) => i !== idx));
                                                                toast.success("Stat removed");
                                                            }
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Mission Section */}
                        {activeTab === 'mission' && (
                             <Card className="rounded-[40px]">
                                <CardHeader className="p-10"><CardTitle className="text-2xl font-black">Mission Statement</CardTitle></CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    <div><Label>Badge</Label><Input value={content.mission?.badge || ''} onChange={(e) => updateMission({ badge: e.target.value })} className="h-11 rounded-xl" /></div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div><Label>Title Line 1</Label><Input value={content.mission?.titleLine1 || ''} onChange={(e) => updateMission({ titleLine1: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Title Line 2</Label><Input value={content.mission?.titleLine2 || ''} onChange={(e) => updateMission({ titleLine2: e.target.value })} className="h-11 rounded-xl" /></div>
                                    </div>
                                    <Separator />
                                    <div><Label>Main Quote</Label><Textarea value={content.mission?.quote || ''} onChange={(e) => updateMission({ quote: e.target.value })} className="rounded-xl min-h-[100px]" /></div>
                                    <div><Label>Quote Highlight</Label><Input value={content.mission?.quoteHighlight || ''} onChange={(e) => updateMission({ quoteHighlight: e.target.value })} className="h-11 rounded-xl" /></div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Culture Section */}
                        {activeTab === 'culture' && (
                            <Card className="rounded-[40px]">
                                <CardHeader className="p-10 flex flex-row items-center justify-between">
                                    <CardTitle className="text-2xl font-black">Office Culture</CardTitle>
                                    <Button onClick={() => {
                                        const newItems = [...(content.culture.items || []), { id: Date.now().toString(), type: 'image' as const, title: 'New Item', location: 'Location', thumb: '', size: 'col-span-1' }];
                                        updateCulture({ items: newItems });
                                    }} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" />Add Item
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div><Label>Badge</Label><Input value={content.culture?.badge || ''} onChange={(e) => updateCulture({ badge: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Title Line 1</Label><Input value={content.culture?.titleLine1 || ''} onChange={(e) => updateCulture({ titleLine1: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Title Line 2</Label><Input value={content.culture?.titleLine2 || ''} onChange={(e) => updateCulture({ titleLine2: e.target.value })} className="h-11 rounded-xl" /></div>
                                    </div>
                                    <Separator />
                                    {content.culture.items?.map((item, idx) => (
                                        <Card key={item.id} className="p-6 rounded-3xl border-border/50">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-4">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div><Label>Title</Label><Input value={item.title || ''} onChange={(e) => {
                                                            const newItems = [...(content.culture.items || [])];
                                                            newItems[idx] = { ...newItems[idx], title: e.target.value };
                                                            updateCulture({ items: newItems });
                                                        }} className="h-11 rounded-xl" /></div>
                                                        <div><Label>Location</Label><Input value={item.location || ''} onChange={(e) => {
                                                            const newItems = [...(content.culture.items || [])];
                                                            newItems[idx] = { ...newItems[idx], location: e.target.value };
                                                            updateCulture({ items: newItems });
                                                        }} className="h-11 rounded-xl" /></div>
                                                    </div>
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <div><Label>Type</Label>
                                                            <Select 
                                                                value={item.type} 
                                                                onValueChange={(value) => {
                                                                    const newItems = [...(content.culture.items || [])];
                                                                    newItems[idx] = { ...newItems[idx], type: value as 'image' | 'video' };
                                                                    updateCulture({ items: newItems });
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-11 rounded-xl">
                                                                    <SelectValue placeholder="Select Type" />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl">
                                                                    <SelectItem value="image">Image</SelectItem>
                                                                    <SelectItem value="video">Video</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div><Label>Size (Grid Class)</Label><Input value={item.size || ''} onChange={(e) => {
                                                            const newItems = [...(content.culture.items || [])];
                                                            newItems[idx] = { ...newItems[idx], size: e.target.value };
                                                            updateCulture({ items: newItems });
                                                        }} className="h-11 rounded-xl" placeholder="col-span-1" /></div>
                                                        <div>
                                                            <MediaUpload 
                                                                label="Media Asset (Image/Video)" 
                                                                value={item.thumb} 
                                                                onChange={(url) => {
                                                                    const newItems = [...(content.culture.items || [])];
                                                                    newItems[idx] = { ...newItems[idx], thumb: url };
                                                                    updateCulture({ items: newItems });
                                                                }} 
                                                                type={item.type}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-500/10 rounded-xl"
                                                    onClick={() =>
                                                        openConfirm(
                                                            "Delete culture item",
                                                            `Remove "${item.title}"?`,
                                                            () => {
                                                                const newItems = (content.culture.items || []).filter((_, i) => i !== idx);
                                                                updateCulture({ items: newItems });
                                                                toast.success("Item deleted");
                                                            }
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Team Section */}
                        {activeTab === 'team' && (
                            <Card className="rounded-[40px]">
                                <CardHeader className="p-10 flex flex-row items-center justify-between">
                                    <CardTitle className="text-2xl font-black">Team Showcase</CardTitle>
                                    <Button onClick={() => {
                                        const newMembers = [...(content.team.members || []), { id: Date.now().toString(), name: 'New Member', role: 'Role', category: 'Leadership', image: '', gradient: 'from-blue-600 to-indigo-600', socials: { linkedin: '', twitter: '', github: '' } }];
                                        updateTeam({ members: newMembers });
                                    }} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" />Add Member
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div><Label>Badge</Label><Input value={content.team?.badge || ''} onChange={(e) => updateTeam({ badge: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Title Line 1</Label><Input value={content.team?.titleLine1 || ''} onChange={(e) => updateTeam({ titleLine1: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Title Line 2</Label><Input value={content.team?.titleLine2 || ''} onChange={(e) => updateTeam({ titleLine2: e.target.value })} className="h-11 rounded-xl" /></div>
                                    </div>
                                    <Separator />
                                    {content.team.members?.map((member, idx) => (
                                        <Card key={member.id} className="p-6 rounded-3xl border-border/50">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-4">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div><Label>Name</Label><Input value={member.name || ''} onChange={(e) => {
                                                            const newMembers = [...(content.team.members || [])];
                                                            newMembers[idx] = { ...newMembers[idx], name: e.target.value };
                                                            updateTeam({ members: newMembers });
                                                        }} className="h-11 rounded-xl" /></div>
                                                        <div><Label>Role</Label><Input value={member.role || ''} onChange={(e) => {
                                                            const newMembers = [...(content.team.members || [])];
                                                            newMembers[idx] = { ...newMembers[idx], role: e.target.value };
                                                            updateTeam({ members: newMembers });
                                                        }} className="h-11 rounded-xl" /></div>
                                                    </div>
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <div><Label>Category</Label>
                                                            <Select 
                                                                value={member.category} 
                                                                onValueChange={(value) => {
                                                                    const newMembers = [...(content.team.members || [])];
                                                                    newMembers[idx] = { ...newMembers[idx], category: value };
                                                                    updateTeam({ members: newMembers });
                                                                }}
                                                            >
                                                                <SelectTrigger className="h-11 rounded-xl">
                                                                    <SelectValue placeholder="Select Category" />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl">
                                                                    <SelectItem value="Leadership">Leadership</SelectItem>
                                                                    <SelectItem value="Development">Development</SelectItem>
                                                                    <SelectItem value="Design">Design</SelectItem>
                                                                    <SelectItem value="Product">Product</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div><Label>Gradient Class</Label><Input value={member.gradient || ''} onChange={(e) => {
                                                            const newMembers = [...(content.team.members || [])];
                                                            newMembers[idx] = { ...newMembers[idx], gradient: e.target.value };
                                                            updateTeam({ members: newMembers });
                                                        }} className="h-11 rounded-xl" /></div>
                                                        <div className="space-y-4">
                                                            <MediaUpload 
                                                                label="Profile Image" 
                                                                value={member.image} 
                                                                onChange={(url) => {
                                                                    const newMembers = [...(content.team.members || [])];
                                                                    newMembers[idx] = { ...newMembers[idx], image: url };
                                                                    updateTeam({ members: newMembers });
                                                                }} 
                                                                type="image"
                                                                aspectRatio="square"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="grid md:grid-cols-3 gap-4">
                                                        <div><Label>LinkedIn</Label><Input value={member.socials.linkedin || ''} onChange={(e) => {
                                                            const newMembers = [...(content.team.members || [])];
                                                            newMembers[idx] = { ...newMembers[idx], socials: { ...newMembers[idx].socials, linkedin: e.target.value } };
                                                            updateTeam({ members: newMembers });
                                                        }} className="h-11 rounded-xl" /></div>
                                                        <div><Label>Twitter</Label><Input value={member.socials.twitter || ''} onChange={(e) => {
                                                            const newMembers = [...(content.team.members || [])];
                                                            newMembers[idx] = { ...newMembers[idx], socials: { ...newMembers[idx].socials, twitter: e.target.value } };
                                                            updateTeam({ members: newMembers });
                                                        }} className="h-11 rounded-xl" /></div>
                                                        <div><Label>GitHub</Label><Input value={member.socials.github || ''} onChange={(e) => {
                                                            const newMembers = [...(content.team.members || [])];
                                                            newMembers[idx] = { ...newMembers[idx], socials: { ...newMembers[idx].socials, github: e.target.value } };
                                                            updateTeam({ members: newMembers });
                                                        }} className="h-11 rounded-xl" /></div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-500/10 rounded-xl"
                                                    onClick={() =>
                                                        openConfirm(
                                                            "Remove team member",
                                                            `Remove ${member.name}?`,
                                                            () => {
                                                                const newMembers = (content.team.members || []).filter((_, i) => i !== idx);
                                                                updateTeam({ members: newMembers });
                                                                toast.success("Member removed");
                                                            }
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Values Section */}
                        {activeTab === 'values' && (
                            <Card className="rounded-[40px]">
                                <CardHeader className="p-10 flex flex-row items-center justify-between">
                                    <CardTitle className="text-2xl font-black">Core Values</CardTitle>
                                    <Button onClick={() => updateValues([...(content.values || []), { id: Date.now().toString(), title: 'New Value', description: 'Description here' }])} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" />Add Value
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                                        <div><Label>Section Badge</Label><Input value={content.valuesBadge} onChange={(e) => updateValuesInfo({ valuesBadge: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Section Title</Label><Input value={content.valuesTitle} onChange={(e) => updateValuesInfo({ valuesTitle: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Highlighted Word</Label><Input value={content.valuesHighlight} onChange={(e) => updateValuesInfo({ valuesHighlight: e.target.value })} className="h-11 rounded-xl" /></div>
                                    </div>
                                    <Separator />
                                    {content.values?.map((value, idx) => (
                                        <Card key={value.id} className="p-6 rounded-3xl border-border/50">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-4">
                                                    <div><Label>Title</Label><Input value={value.title || ''} onChange={(e) => {
                                                        const newValues = [...(content.values || [])];
                                                        newValues[idx] = { ...newValues[idx], title: e.target.value };
                                                        updateValues(newValues);
                                                    }} className="h-11 rounded-xl" /></div>
                                                    <div><Label>Description</Label><Textarea value={value.description || ''} onChange={(e) => {
                                                        const newValues = [...(content.values || [])];
                                                        newValues[idx] = { ...newValues[idx], description: e.target.value };
                                                        updateValues(newValues);
                                                    }} className="rounded-xl min-h-[80px]" /></div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-500/10 rounded-xl"
                                                    onClick={() =>
                                                        openConfirm(
                                                            "Delete value",
                                                            `Remove "${value.title}"?`,
                                                            () => {
                                                                updateValues((content.values || []).filter((_, i) => i !== idx));
                                                                toast.success("Value deleted");
                                                            }
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Awards Section */}
                        {activeTab === 'awards' && (
                            <Card className="rounded-[40px]">
                                <CardHeader className="p-10 flex flex-row items-center justify-between">
                                    <CardTitle className="text-2xl font-black">Awards & Recognition</CardTitle>
                                    <Button onClick={() => updateAwards([...(content.awards || []), { id: Date.now().toString(), title: 'New Award', org: 'Organization', year: new Date().getFullYear().toString(), description: 'Description', gradient: 'from-blue-500 to-cyan-500' }])} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" />Add Award
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div><Label>Badge</Label><Input value={content.awardsBadge || ''} onChange={(e) => updateAwardsInfo({ awardsBadge: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Title</Label><Input value={content.awardsTitle || ''} onChange={(e) => updateAwardsInfo({ awardsTitle: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Highlight</Label><Input value={content.awardsTitleHighlight || ''} onChange={(e) => updateAwardsInfo({ awardsTitleHighlight: e.target.value })} className="h-11 rounded-xl" /></div>
                                    </div>
                                    <div><Label>Description</Label><Textarea value={content.awardsDescription || ''} onChange={(e) => updateAwardsInfo({ awardsDescription: e.target.value })} className="rounded-xl min-h-[80px]" /></div>
                                    <Separator />
                                    {(content.awards || []).map((award, idx) => (
                                        <Card key={award.id} className="p-6 rounded-3xl border-border/50">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-4">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div><Label>Award Title</Label><Input value={award.title || ''} onChange={(e) => {
                                                            const newAwards = [...(content.awards || [])];
                                                            newAwards[idx] = { ...newAwards[idx], title: e.target.value };
                                                            updateAwards(newAwards);
                                                        }} className="h-11 rounded-xl" /></div>
                                                        <div><Label>Organization</Label><Input value={award.org || ''} onChange={(e) => {
                                                            const newAwards = [...(content.awards || [])];
                                                            newAwards[idx] = { ...newAwards[idx], org: e.target.value };
                                                            updateAwards(newAwards);
                                                        }} className="h-11 rounded-xl" /></div>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div><Label>Year</Label><Input value={award.year || ''} onChange={(e) => {
                                                            const newAwards = [...(content.awards || [])];
                                                            newAwards[idx] = { ...newAwards[idx], year: e.target.value };
                                                            updateAwards(newAwards);
                                                        }} className="h-11 rounded-xl" /></div>
                                                        <div><Label>Gradient Class (Tailwind)</Label><Input value={award.gradient || ''} onChange={(e) => {
                                                            const newAwards = [...(content.awards || [])];
                                                            newAwards[idx] = { ...newAwards[idx], gradient: e.target.value };
                                                            updateAwards(newAwards);
                                                        }} className="h-11 rounded-xl" /></div>
                                                    </div>
                                                    <div><Label>Description</Label><Textarea value={award.description || ''} onChange={(e) => {
                                                        const newAwards = [...(content.awards || [])];
                                                        newAwards[idx] = { ...newAwards[idx], description: e.target.value };
                                                        updateAwards(newAwards);
                                                    }} className="rounded-xl min-h-[80px]" /></div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-500/10 rounded-xl"
                                                    onClick={() =>
                                                        openConfirm(
                                                            "Delete award",
                                                            `Remove the award "${award.title}"?`,
                                                            () => {
                                                                updateAwards((content.awards || []).filter((_, i) => i !== idx));
                                                                toast.success("Award deleted");
                                                            }
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Timeline Section */}
                        {activeTab === 'timeline' && (
                            <Card className="rounded-[40px]">
                                <CardHeader className="p-10 flex flex-row items-center justify-between">
                                    <CardTitle className="text-2xl font-black">Company Timeline</CardTitle>
                                    <Button onClick={() => updateTimeline([...(content.timeline || []), { id: Date.now().toString(), year: new Date().getFullYear().toString(), title: 'New Milestone', desc: 'Description', icon: 'Rocket', gradient: 'from-blue-500 to-indigo-500' }])} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" />Add Milestone
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div><Label>Badge</Label><Input value={content.timelineBadge || ''} onChange={(e) => updateTimelineInfo({ timelineBadge: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Title</Label><Input value={content.timelineTitle || ''} onChange={(e) => updateTimelineInfo({ timelineTitle: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Highlight</Label><Input value={content.timelineTitleHighlight || ''} onChange={(e) => updateTimelineInfo({ timelineTitleHighlight: e.target.value })} className="h-11 rounded-xl" /></div>
                                    </div>
                                    <Separator />
                                    {(content.timeline || []).map((item, idx) => (
                                        <Card key={item.id} className="p-6 rounded-3xl border-border/50">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-4">
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div><Label>Year</Label><Input value={item.year || ''} onChange={(e) => {
                                                            const newTimeline = [...(content.timeline || [])];
                                                            newTimeline[idx] = { ...newTimeline[idx], year: e.target.value };
                                                            updateTimeline(newTimeline);
                                                        }} className="h-11 rounded-xl" /></div>
                                                        <div><Label>Title</Label><Input value={item.title || ''} onChange={(e) => {
                                                            const newTimeline = [...(content.timeline || [])];
                                                            newTimeline[idx] = { ...newTimeline[idx], title: e.target.value };
                                                            updateTimeline(newTimeline);
                                                        }} className="h-11 rounded-xl" /></div>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-4">
                                                        <div className="flex gap-4 items-end">
                                                            <div className="flex-1">
                                                                <Label>Icon (Lucide Color)</Label>
                                                                <Input value={item.icon || ''} onChange={(e) => {
                                                                    const newTimeline = [...(content.timeline || [])];
                                                                    newTimeline[idx] = { ...newTimeline[idx], icon: e.target.value };
                                                                    updateTimeline(newTimeline);
                                                                }} className="h-11 rounded-xl" />
                                                            </div>
                                                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 mb-0.5">
                                                                {(() => {
                                                                    const Icon = (LucideIcons as any)[item.icon || 'Rocket'] || Rocket;
                                                                    return <Icon className="w-5 h-5" />;
                                                                })()}
                                                            </div>
                                                        </div>
                                                        <div><Label>Gradient Class</Label><Input value={item.gradient || ''} onChange={(e) => {
                                                            const newTimeline = [...(content.timeline || [])];
                                                            newTimeline[idx] = { ...newTimeline[idx], gradient: e.target.value };
                                                            updateTimeline(newTimeline);
                                                        }} className="h-11 rounded-xl" /></div>
                                                    </div>
                                                    <div><Label>Description</Label><Textarea value={item.desc || ''} onChange={(e) => {
                                                        const newTimeline = [...(content.timeline || [])];
                                                        newTimeline[idx] = { ...newTimeline[idx], desc: e.target.value };
                                                        updateTimeline(newTimeline);
                                                    }} className="rounded-xl min-h-[80px]" /></div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:bg-red-500/10 rounded-xl"
                                                    onClick={() =>
                                                        openConfirm(
                                                            "Delete milestone",
                                                            `Remove the ${item.year} milestone?`,
                                                            () => {
                                                                updateTimeline((content.timeline || []).filter((_, i) => i !== idx));
                                                                toast.success("Milestone removed");
                                                            }
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {/* Founder Section */}
                        {activeTab === 'founder' && (
                            <Card className="rounded-[40px]">
                                <CardHeader className="p-10"><CardTitle className="text-2xl font-black">Founder Intro</CardTitle></CardHeader>
                                <CardContent className="p-10 space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8 items-start">
                                        <div className="space-y-6">
                                            <div><Label>Name</Label><Input value={content.founder?.name || ''} onChange={(e) => updateFounder({ name: e.target.value })} className="h-11 rounded-xl" /></div>
                                            <div><Label>Role</Label><Input value={content.founder?.role || ''} onChange={(e) => updateFounder({ role: e.target.value })} className="h-11 rounded-xl" /></div>
                                            <div><Label>Tagline</Label><Input value={content.founder?.tagline || ''} onChange={(e) => updateFounder({ tagline: e.target.value })} className="h-11 rounded-xl" /></div>
                                        </div>
                                        <div className="space-y-4">
                                            <MediaUpload 
                                                label="Founder Portrait" 
                                                value={content.founder?.image || ''} 
                                                onChange={(url) => updateFounder({ image: url })} 
                                                type="image"
                                                aspectRatio="portrait"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div><Label>Badge Title</Label><Input value={content.founder?.badgeTitle || ''} onChange={(e) => updateFounder({ badgeTitle: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Heading Line 1</Label><Input value={content.founder?.titleLine1 || ''} onChange={(e) => updateFounder({ titleLine1: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Heading Line 2</Label><Input value={content.founder?.titleLine2 || ''} onChange={(e) => updateFounder({ titleLine2: e.target.value })} className="h-11 rounded-xl" /></div>
                                    </div>
                                    <Separator />
                                    <div><Label>Bio Paragraph 1</Label><Textarea value={content.founder?.bioPar1 || ''} onChange={(e) => updateFounder({ bioPar1: e.target.value })} className="rounded-xl min-h-[100px]" /></div>
                                    <div><Label>Bio Paragraph 2</Label><Textarea value={content.founder?.bioPar2 || ''} onChange={(e) => updateFounder({ bioPar2: e.target.value })} className="rounded-xl min-h-[100px]" /></div>
                                    <Separator />
                                    <Label className="text-lg">Stats</Label>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {(content.founder?.stats || []).map((stat, idx) => (
                                            <Card key={idx} className="p-4 bg-secondary/10 border-0">
                                                <div className="space-y-3">
                                                    <div><Label>Number</Label><Input type="number" value={stat.num} onChange={(e) => {
                                                        const newStats = [...(content.founder?.stats || [])];
                                                        newStats[idx] = { ...newStats[idx], num: parseInt(e.target.value) || 0 };
                                                        updateFounder({ stats: newStats });
                                                    }} className="h-9" /></div>
                                                    <div><Label>Suffix</Label><Input value={stat.suffix || ''} onChange={(e) => {
                                                        const newStats = [...(content.founder?.stats || [])];
                                                        newStats[idx] = { ...newStats[idx], suffix: e.target.value };
                                                        updateFounder({ stats: newStats });
                                                    }} className="h-9" /></div>
                                                    <div><Label>Label</Label><Input value={stat.label || ''} onChange={(e) => {
                                                        const newStats = [...(content.founder?.stats || [])];
                                                        newStats[idx] = { ...newStats[idx], label: e.target.value };
                                                        updateFounder({ stats: newStats });
                                                    }} className="h-9" /></div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                    <Separator />
                                    <Label className="text-lg">Social Links</Label>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div><Label>Twitter URL</Label><Input value={content.founder?.socials?.twitter || ''} onChange={(e) => updateFounder({ socials: { ...content.founder?.socials, twitter: e.target.value } })} className="h-11 rounded-xl" /></div>
                                        <div><Label>LinkedIn URL</Label><Input value={content.founder?.socials?.linkedin || ''} onChange={(e) => updateFounder({ socials: { ...content.founder?.socials, linkedin: e.target.value } })} className="h-11 rounded-xl" /></div>
                                        <div><Label>GitHub URL</Label><Input value={content.founder?.socials?.github || ''} onChange={(e) => updateFounder({ socials: { ...content.founder?.socials, github: e.target.value } })} className="h-11 rounded-xl" /></div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* CTA Section */}
                        {activeTab === 'cta' && content?.cta && (
                            <Card className="rounded-[40px]">
                                <CardHeader className="p-10"><CardTitle className="text-2xl font-black">Call to Action</CardTitle></CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    <div><Label>Title</Label><Input value={content.cta.title || ''} onChange={(e) => updateCTA({ title: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div><Label>Description</Label><Textarea value={content.cta.description || ''} onChange={(e) => updateCTA({ description: e.target.value })} className="rounded-2xl min-h-[100px]" /></div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div><Label>Button Text</Label><Input value={content.cta.buttonText || ''} onChange={(e) => updateCTA({ buttonText: e.target.value })} className="h-11 rounded-xl" /></div>
                                        <div><Label>Button Link</Label><Input value={content.cta.buttonLink || ''} onChange={(e) => updateCTA({ buttonLink: e.target.value })} className="h-11 rounded-xl" /></div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* SEO Section */}
                        {activeTab === 'seo' && (
                            <Card className="rounded-[40px]">
                                <CardHeader className="p-10"><CardTitle className="text-2xl font-black">SEO Settings</CardTitle></CardHeader>
                                <CardContent className="p-10 space-y-6">
                                    <div><Label>Meta Title</Label><Input value={content.seo?.title || ''} onChange={(e) => updateSEO({ title: e.target.value })} className="h-12 rounded-2xl" maxLength={60} /><p className="text-xs text-muted-foreground">{(content.seo?.title || '').length}/60</p></div>
                                    <div><Label>Meta Description</Label><Textarea value={content.seo?.description || ''} onChange={(e) => updateSEO({ description: e.target.value })} className="rounded-2xl" maxLength={160} /><p className="text-xs text-muted-foreground">{(content.seo?.description || '').length}/160</p></div>
                                    <div><Label>Keywords</Label><Input value={(content.seo?.keywords || []).join(', ')} onChange={(e) => updateSEO({ keywords: e.target.value.split(',').map(k => k.trim()) })} className="h-12 rounded-2xl" /></div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={confirmDialog.open} onOpenChange={(open) => !open && closeConfirm()}>
                <DialogContent className="rounded-2xl border-border/50 bg-card/80 backdrop-blur-xl sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-black italic">{confirmDialog.title}</DialogTitle>
                        <DialogDescription>{confirmDialog.description}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={closeConfirm} className="rounded-xl">Cancel</Button>
                        <Button variant="destructive" onClick={handleConfirm} className="rounded-xl">Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(14,165,233,0.2)]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50">
                            <CardTitle className="text-lg font-black italic">About Page Preview</CardTitle>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} className="rounded-full">
                                <Plus className="w-6 h-6 rotate-45" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 p-12">
                            <div className="mx-auto max-w-2xl space-y-10">
                                <div className="text-center space-y-4">
                                    <Badge className="bg-sky-500/20 text-sky-500 border-none">{content.hero.badge}</Badge>
                                    <h1 className="text-4xl font-black italic tracking-tight">
                                        {content.hero.title} <span className="text-sky-500">{content.hero.highlightedWord}</span>
                                    </h1>
                                    <p className="text-muted-foreground">{content.hero.description}</p>
                                    <Button className="rounded-xl">{content.hero.ctaText}</Button>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {(content.stats || []).slice(0, 3).map((stat) => {
                                        const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[stat.icon || "Zap"] ?? Zap;
                                        return (
                                            <div key={stat.id} className="p-4 rounded-xl border border-border/40 text-center">
                                                <Icon className="w-8 h-8 mx-auto mb-2 text-sky-500" />
                                                <div className="text-2xl font-black">{stat.value}</div>
                                                <div className="text-xs text-muted-foreground">{stat.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="p-6 rounded-2xl border border-border/40 bg-muted/20">
                                    <h2 className="text-xl font-bold">{content.cta.title}</h2>
                                    <p className="text-sm text-muted-foreground mt-2">{content.cta.description}</p>
                                    <Button className="rounded-xl mt-4">{content.cta.buttonText}</Button>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
