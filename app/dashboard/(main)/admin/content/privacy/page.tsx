"use client";

import { useState, useEffect, useRef } from "react";
import { usePrivacyContentStore, type PrivacyFeature } from "@/lib/store/privacy-content";
import { usePrivacyContent, useUpdatePrivacyContent } from "@/lib/api/privacy-content-queries";
import { toast } from "sonner";
import { 
    Plus, 
    Save, 
    Trash2, 
    ShieldCheck,
    Lock,
    Eye,
    Database,
    Globe,
    UserCheck,
    Server,
    Fingerprint,
    ArrowLeft,
    Monitor,
    Smartphone,
    RefreshCcw,
    Sparkles,
    Grid,
    FileText
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MediaUpload } from "@/components/dashboard/media-upload";

// Icon options
const iconOptions = [
    { value: "Lock", label: "Lock", icon: Lock },
    { value: "Fingerprint", label: "Fingerprint", icon: Fingerprint },
    { value: "Database", label: "Database", icon: Database },
    { value: "Eye", label: "Eye", icon: Eye },
    { value: "Server", label: "Server", icon: Server },
    { value: "Globe", label: "Globe", icon: Globe },
    { value: "ShieldCheck", label: "ShieldCheck", icon: ShieldCheck },
    { value: "UserCheck", label: "UserCheck", icon: UserCheck }
];

export default function PrivacyContentEditor() {
    const { 
        content, 
        setContent,
        updateHeader, 
        updateGuarantee,
        updateFooter,
        addFeature, 
        updateFeature, 
        deleteFeature,
        updateStat,
        addStat,
        deleteStat,
        resetToDefaults
    } = usePrivacyContentStore();

    const { data: apiContent } = usePrivacyContent();
    const updateMutation = useUpdatePrivacyContent();

    const [activeTab, setActiveTab] = useState('header');
    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewScale, setPreviewScale] = useState<'desktop' | 'mobile'>('desktop');
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });
    const hasHydrated = useRef(false);

    useEffect(() => {
        if (apiContent && !hasHydrated.current) {
            setContent(apiContent);
            hasHydrated.current = true;
        }
    }, [apiContent, setContent]);

    if (!content) return <div className="p-20 text-center font-black animate-pulse text-muted-foreground uppercase tracking-widest">Initializing Privacy Forge...</div>;

    const selectedFeature = content.features.find(f => f.id === selectedFeatureId);

    const handleSave = async () => {
        if (!content) return;
        await updateMutation.mutateAsync(content);
    };

    const openConfirm = (title: string, description: string, onConfirm: () => void) => {
        setConfirmDialog({ open: true, title, description, onConfirm });
    };
    const closeConfirm = () => setConfirmDialog(prev => ({ ...prev, open: false }));
    const handleConfirm = () => {
        confirmDialog.onConfirm();
        closeConfirm();
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
                                <CardTitle className="text-2xl font-black italic tracking-tight underline decoration-blue-500/30 underline-offset-4 text-white">Privacy CMS</CardTitle>
                                <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-blue-500/10 text-blue-500 border-none">
                                    PROTOCOL_ACTIVE
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                                Data Governance & Protection
                            </Label>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold border-border/50 hover:bg-muted/50 transition-colors" onClick={() => openConfirm("Reset to defaults", "Reset all privacy content to defaults? This cannot be undone.", () => { resetToDefaults(); toast.success("Privacy defaults restored"); })}>
                             <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold bg-blue-500/5 border-blue-500/20 text-blue-500 hover:bg-blue-500/10 transition-all" onClick={() => setPreviewOpen(true)}>
                            <Eye className="w-4 h-4 mr-2" /> Live Preview
                        </Button>
                        <Button className="rounded-xl font-black italic bg-blue-500 text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all px-8 h-11" onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} {updateMutation.isPending ? "Syncing…" : "Sync Protocol"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex items-center gap-4">
                        <TabsList className="bg-muted/30 backdrop-blur-2xl p-1.5 rounded-[22px] h-16 w-fit border border-border/40 relative overflow-hidden shadow-2xl">
                            {[
                                { value: "header", label: "Hero Header", icon: Sparkles },
                                { value: "features", label: "Features", icon: Grid },
                                { value: "guarantee", label: "Guarantee", icon: ShieldCheck },
                                { value: "footer", label: "Footer", icon: FileText },
                            ].map((tab) => (
                                <TabsTrigger 
                                    key={tab.value}
                                    value={tab.value} 
                                    className="relative z-10 rounded-[18px] h-13 gap-3 data-[state=active]:text-blue-500 transition-all duration-500 font-black italic px-8 group data-[state=active]:bg-background/90 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] border border-transparent data-[state=active]:border-blue-500/10"
                                >
                                    <tab.icon className="w-4 h-4 transition-all duration-500 group-hover:scale-110 group-data-[state=active]:scale-110 group-data-[state=active]:animate-pulse" />
                                    <span className="relative">{tab.label}</span>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-blue-500/20 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-700 blur-[4px]" />
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="min-h-[600px]">
                        {/* HEADER TAB */}
                        <TabsContent value="header" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                    <CardTitle className="text-2xl font-black italic tracking-tight">Privacy Hero Configuration</CardTitle>
                                    <p className="text-sm text-muted-foreground italic font-medium">Main header content and cinematic visual for the privacy landing page.</p>
                                </CardHeader>
                                <CardContent className="p-10 space-y-10">
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Badge Text</Label>
                                                <Input 
                                                    value={content.header.badge} 
                                                    onChange={(e) => updateHeader({ badge: e.target.value })}
                                                    className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Title Prefix</Label>
                                                    <Input 
                                                        value={content.header.titlePrefix} 
                                                        onChange={(e) => updateHeader({ titlePrefix: e.target.value })}
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl"
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Highlight</Label>
                                                    <Input 
                                                        value={content.header.titleHighlight} 
                                                        onChange={(e) => updateHeader({ titleHighlight: e.target.value })}
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl text-blue-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Description</Label>
                                                <Textarea 
                                                    value={content.header.description} 
                                                    onChange={(e) => updateHeader({ description: e.target.value })}
                                                    className="rounded-3xl border-border/40 bg-muted/20 font-bold italic p-8 min-h-[140px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <MediaUpload 
                                                label="Privacy Hero Visual (Cinematic Video/Image)" 
                                                value={content.header.videoUrl || ''} 
                                                onChange={(url) => updateHeader({ videoUrl: url })} 
                                                type="video"
                                                aspectRatio="video"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* FEATURES TAB */}
                        <TabsContent value="features" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid lg:grid-cols-12 gap-8">
                                {/* Feature List Sidebar */}
                                <Card className="lg:col-span-4 border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl h-fit max-h-[800px] flex flex-col">
                                    <CardHeader className="p-8 border-b border-border/40 bg-muted/5 flex-shrink-0">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-black italic tracking-tight">Privacy Features</CardTitle>
                                            <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl border-blue-500/20 hover:bg-blue-500/10" onClick={() => {
                                                const newId = `feat-${Date.now()}`;
                                                addFeature({
                                                    id: newId,
                                                    title: "New Feature",
                                                    description: "Description...",
                                                    iconName: "Lock",
                                                    color: "text-blue-500"
                                                });
                                                setSelectedFeatureId(newId);
                                                toast.success("Privacy feature forged");
                                            }}>
                                                <Plus className="w-5 h-5 text-blue-500" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <ScrollArea className="flex-1">
                                        <CardContent className="p-6 space-y-3">
                                            {content.features.map(item => (
                                                <div 
                                                    key={item.id}
                                                    onClick={() => setSelectedFeatureId(item.id)}
                                                    className={cn(
                                                        "p-4 rounded-2xl border cursor-pointer hover:bg-muted/50 transition-all duration-300 flex items-center justify-between group",
                                                        selectedFeatureId === item.id ? "bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/5" : "bg-card/50 border-border/40"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className={cn("w-3 h-3 rounded-full shrink-0", item.color.replace('text-', 'bg-'))} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-sm truncate">{item.title}</div>
                                                            <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 shrink-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openConfirm("Delete feature", `Remove "${item.title}"?`, () => { deleteFeature(item.id); if(selectedFeatureId === item.id) setSelectedFeatureId(null); toast.success("Feature deconstructed"); });
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </ScrollArea>
                                </Card>

                                {/* Feature Editor */}
                                <div className="lg:col-span-8">
                                    {selectedFeature ? (
                                        <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                            <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                                <CardTitle className="text-2xl font-black italic tracking-tight">Edit Feature: {selectedFeature.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-10 space-y-10">
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Feature Title</Label>
                                                        <Input 
                                                            value={selectedFeature.title} 
                                                            onChange={(e) => updateFeature(selectedFeature.id, { title: e.target.value })}
                                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Icon</Label>
                                                        <Select 
                                                            value={selectedFeature.iconName} 
                                                            onValueChange={(val) => updateFeature(selectedFeature.id, { iconName: val })}
                                                        >
                                                            <SelectTrigger className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-background/95 p-2">
                                                                {iconOptions.map(opt => (
                                                                    <SelectItem key={opt.value} value={opt.value} className="rounded-xl font-bold py-2.5">
                                                                        {opt.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <MediaUpload 
                                                        label="Custom Feature Icon (Image Override)" 
                                                        value={selectedFeature.iconImage || ''} 
                                                        onChange={(url) => updateFeature(selectedFeature.id, { iconImage: url })} 
                                                        type="image"
                                                        aspectRatio="square"
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Color Class (Tailwind)</Label>
                                                    <Input 
                                                        value={selectedFeature.color} 
                                                        onChange={(e) => updateFeature(selectedFeature.id, { color: e.target.value })}
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/20 font-mono text-sm"
                                                        placeholder="text-blue-500"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Description</Label>
                                                    <Textarea 
                                                        value={selectedFeature.description} 
                                                        onChange={(e) => updateFeature(selectedFeature.id, { description: e.target.value })}
                                                        className="rounded-3xl border-border/40 bg-muted/20 font-bold italic p-8 min-h-[140px]"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl h-[600px] flex items-center justify-center">
                                            <div className="text-center space-y-4 p-12">
                                                <div className="w-20 h-20 rounded-[30px] bg-blue-500/10 flex items-center justify-center mx-auto border border-blue-500/20">
                                                    <ShieldCheck className="w-10 h-10 text-blue-500/50" />
                                                </div>
                                                <h3 className="text-2xl font-black italic tracking-tight text-muted-foreground">Select a Feature</h3>
                                                <p className="text-sm text-muted-foreground/60 italic">Choose a privacy feature to edit its details.</p>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* GUARANTEE TAB */}
                        <TabsContent value="guarantee" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                    <CardTitle className="text-2xl font-black italic tracking-tight">Trust Guarantee Section</CardTitle>
                                    <p className="text-sm text-muted-foreground italic font-medium">Bottom guarantee text and trust statistics.</p>
                                </CardHeader>
                                <CardContent className="p-10 space-y-10">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Section Title</Label>
                                        <Input 
                                            value={content.guarantee.title} 
                                            onChange={(e) => updateGuarantee({ title: e.target.value })}
                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Description</Label>
                                        <Textarea 
                                            value={content.guarantee.description} 
                                            onChange={(e) => updateGuarantee({ description: e.target.value })}
                                            className="rounded-3xl border-border/40 bg-muted/20 font-bold italic p-8 min-h-[140px]"
                                        />
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <Label className="text-sm font-black italic tracking-tight">Trust Statistics</Label>
                                            <Button type="button" size="sm" variant="outline" className="rounded-xl border-blue-500/20 hover:bg-blue-500/10 text-blue-500" onClick={() => { addStat({ value: "0", label: "New Stat" }); toast.success("Stat added"); }}>
                                                <Plus className="w-4 h-4 mr-2" /> Add Stat
                                            </Button>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8">
                                            {content.guarantee.stats.map((stat, idx) => (
                                                <Card key={idx} className="relative group border-border/40 bg-muted/10 rounded-3xl overflow-hidden">
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="absolute top-4 right-4 h-9 w-9 rounded-xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-10" 
                                                        onClick={() => openConfirm("Delete stat", `Remove "${stat.label}"?`, () => { deleteStat(idx); toast.success("Stat removed"); })}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <CardContent className="p-6 space-y-4">
                                                        <Label className="text-[9px] font-black uppercase text-muted-foreground/60 italic tracking-widest">Stat {idx + 1}</Label>
                                                        <Input 
                                                            value={stat.value} 
                                                            onChange={(e) => updateStat(idx, { ...stat, value: e.target.value })}
                                                            placeholder="Value"
                                                            className="rounded-2xl h-12 border-border/40 bg-background/50 font-black italic text-lg"
                                                        />
                                                        <Input 
                                                            value={stat.label} 
                                                            onChange={(e) => updateStat(idx, { ...stat, label: e.target.value })}
                                                            placeholder="Label"
                                                            className="rounded-2xl h-12 border-border/40 bg-background/50 font-bold italic"
                                                        />
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* FOOTER TAB */}
                        <TabsContent value="footer" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                    <CardTitle className="text-2xl font-black italic tracking-tight">Footer Meta</CardTitle>
                                    <p className="text-sm text-muted-foreground italic font-medium">Footer status text and metadata.</p>
                                </CardHeader>
                                <CardContent className="p-10">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Status Text</Label>
                                        <Input 
                                            value={content.footer.status} 
                                            onChange={(e) => updateFooter({ status: e.target.value })}
                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-mono text-sm"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>

            {/* Confirm dialog for destructive actions */}
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

            {/* Privacy Universe Simulator */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(59,130,246,0.3)]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5 bg-muted/30 p-1 rounded-xl border border-border/30 shadow-inner">
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'desktop' ? "bg-background text-blue-500 shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('desktop')}>
                                        <Monitor size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'mobile' ? "bg-background text-blue-500 shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('mobile')}>
                                        <Smartphone size={16} />
                                    </Button>
                                </div>
                                <Separator orientation="vertical" className="h-6" />
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg font-black italic tracking-tight text-white">Privacy Simulator</CardTitle>
                                    <span className="text-[9px] font-black uppercase text-blue-500/50 tracking-widest italic -mt-0.5">PROTOCOL_PREVIEW: v2.01</span>
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
                                {/* Simulated Privacy Content */}
                                <div className="min-h-full pb-32">
                                    {/* Simulated Hero */}
                                    <div className="relative aspect-[21/9] overflow-hidden bg-black flex items-center justify-center">
                                        {content.header.videoUrl ? (
                                            <video src={content.header.videoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-950/20" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                        <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl pt-20">
                                            <Badge className="bg-blue-500/20 text-blue-500 border-none px-4 py-1.5 rounded-full font-black italic tracking-[0.2em] text-[10px] uppercase shadow-xl animate-pulse">{content.header.badge.toUpperCase()}</Badge>
                                            <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">
                                                {content.header.titlePrefix} <span className="text-blue-500">{content.header.titleHighlight}</span>.
                                            </h1>
                                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed italic font-medium">{content.header.description}</p>
                                        </div>
                                    </div>

                                    {/* Simulated Feature Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12 -mt-10 relative z-20">
                                        {content.features.map(feature => (
                                            <div key={feature.id} className="bg-card/70 backdrop-blur-3xl border border-border/40 p-8 rounded-[40px] shadow-2xl hover:translate-y-[-10px] transition-transform duration-500 group">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner overflow-hidden", feature.color.replace('text-', 'bg-') + "/10", feature.color)}>
                                                        {feature.iconImage ? (
                                                            <img src={feature.iconImage} alt="Icon" className="w-full h-full object-cover" />
                                                        ) : (() => {
                                                            const Icon = (LucideIcons as any)[feature.iconName] || Lock;
                                                            return <Icon size={28} />;
                                                        })()}
                                                    </div>
                                                </div>
                                                <h3 className="text-2xl font-black italic tracking-tight text-white mb-4">{feature.title}</h3>
                                                <p className="text-sm text-muted-foreground leading-relaxed italic">{feature.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Simulated Guarantee */}
                                    <div className="mt-32 px-12 max-w-5xl mx-auto text-center space-y-12">
                                        <div className="space-y-6">
                                            <h2 className="text-5xl font-black italic tracking-tighter text-white">{content.guarantee.title}</h2>
                                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed italic font-medium">{content.guarantee.description}</p>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-8 mt-16">
                                            {content.guarantee.stats.map((stat, idx) => (
                                                <div key={idx} className="bg-card/50 backdrop-blur-3xl border border-border/40 p-10 rounded-[40px] shadow-xl">
                                                    <div className="text-5xl font-black italic tracking-tighter text-blue-500 mb-2">{stat.value}</div>
                                                    <div className="text-sm text-muted-foreground uppercase tracking-widest font-black italic">{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Simulated Footer */}
                                    <div className="mt-32 px-12 text-center opacity-50">
                                         <p className="text-xs font-mono">{content.footer.status}</p>
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
