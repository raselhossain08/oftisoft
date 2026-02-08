"use client";

import { useState, useEffect, useRef } from "react";
import { useServicesContentStore, type FAQItem, type ServiceItem, type ComparisonFeature, type ComparisonTier } from "@/lib/store/services-content";
import { useServicesContent, useUpdateServicesContent } from "@/lib/api/services-content-queries";
import { toast } from "sonner";
import { 
    Plus, 
    Save, 
    Trash2, 
    LayoutTemplate, 
    Grid,
    HelpCircle,
    Server,
    Database,
    Cloud,
    Brain,
    Smartphone,
    Layout,
    Video,
    FileText,
    Code2,
    ClipboardCheck,
    Rocket,
    HeartPulse,
    Globe,
    Zap,
    Code,
    ShieldCheck,
    Sparkles,
    Layers,
    Crown,
    ArrowLeft,
    Eye,
    Monitor,
    Smartphone as SmartphoneIcon,
    RefreshCcw,
    Package,
    ListOrdered,
    Boxes
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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MediaUpload } from "@/components/dashboard/media-upload";

// Icon options map for UI
const iconOptions = [
    { value: "Layout", label: "Layout", icon: Layout },
    { value: "Server", label: "Server", icon: Server },
    { value: "Database", label: "Database", icon: Database },
    { value: "Cloud", label: "Cloud", icon: Cloud },
    { value: "Brain", label: "Brain", icon: Brain },
    { value: "Smartphone", label: "Smartphone", icon: Smartphone },
    { value: "Globe", label: "Globe", icon: Globe },
    { value: "Code", label: "Code", icon: Code },
    { value: "Zap", label: "Zap", icon: Zap },
    { value: "ShieldCheck", label: "ShieldCheck", icon: ShieldCheck },
    { value: "Video", label: "Video", icon: Video },
    { value: "FileText", label: "FileText", icon: FileText },
    { value: "Code2", label: "Code2", icon: Code2 },
    { value: "ClipboardCheck", label: "ClipboardCheck", icon: ClipboardCheck },
    { value: "Rocket", label: "Rocket", icon: Rocket },
    { value: "HeartPulse", label: "HeartPulse", icon: HeartPulse },
    { value: "Sparkles", label: "Sparkles", icon: Sparkles },
    { value: "Layers", label: "Layers", icon: Layers },
    { value: "Crown", label: "Crown", icon: Crown }
];

export default function ServicesContentEditor() {
    const { 
        content,
        setContent,
        updateHeroVideo,
        addServiceItem,
        updateServiceItem,
        deleteServiceItem,
        addComparisonFeature,
        updateComparisonFeature,
        deleteComparisonFeature,
        addComparisonTier,
        updateComparisonTier,
        deleteComparisonTier,
        addPackage,
        updatePackage,
        deletePackage,
        addProcessStep,
        updateProcessStep,
        deleteProcessStep,
        addFAQ,
        updateFAQ,
        deleteFAQ,
        addTechCategory,
        updateTechCategory,
        deleteTechCategory,
        resetToDefaults
    } = useServicesContentStore();

    const { data: apiContent, isLoading: isLoadingContent } = useServicesContent();
    const updateMutation = useUpdateServicesContent();

    const [activeTab, setActiveTab] = useState('overview');
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
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

    if (!content) return <div className="p-20 text-center font-black animate-pulse text-muted-foreground uppercase tracking-widest">Initializing Services Forge...</div>;

    const selectedService = content.overview.find(s => s.id === selectedServiceId);

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

    const nextProcessId = () => Math.max(0, ...content.process.map(s => s.id), 0) + 1;

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
                                <CardTitle className="text-2xl font-black italic tracking-tight underline decoration-purple-500/30 underline-offset-4 text-white">Services CMS</CardTitle>
                                <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-purple-500/10 text-purple-500 border-none">
                                    FORGE_ACTIVE
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                                Service Portfolio Management
                            </Label>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold border-border/50 hover:bg-muted/50 transition-colors" onClick={() => openConfirm("Reset to defaults", "Reset all services content to architectural defaults? This cannot be undone.", () => { resetToDefaults(); toast.success("Services defaults restored"); })}>
                             <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold bg-purple-500/5 border-purple-500/20 text-purple-500 hover:bg-purple-500/10 transition-all" onClick={() => setPreviewOpen(true)}>
                            <Eye className="w-4 h-4 mr-2" /> Live Preview
                        </Button>
                        <Button className="rounded-xl font-black italic bg-purple-500 text-white shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all px-8 h-11" onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} {updateMutation.isPending ? "Syncing…" : "Sync Services"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                    <div className="flex items-center gap-4">
                        <TabsList className="bg-muted/30 backdrop-blur-2xl p-1.5 rounded-[22px] h-16 w-fit border border-border/40 relative overflow-hidden shadow-2xl">
                            {[
                                { value: "hero", label: "Hero Visual", icon: Sparkles },
                                { value: "overview", label: "Services", icon: Grid },
                                { value: "packages", label: "Packages", icon: Package },
                                { value: "process", label: "Process", icon: ListOrdered },
                                { value: "comparison", label: "Comparison", icon: LayoutTemplate },
                                { value: "techStack", label: "Tech Stack", icon: Boxes },
                                { value: "faq", label: "FAQ", icon: HelpCircle },
                            ].map((tab) => (
                                <TabsTrigger 
                                    key={tab.value}
                                    value={tab.value} 
                                    className="relative z-10 rounded-[18px] h-13 gap-3 data-[state=active]:text-purple-500 transition-all duration-500 font-black italic px-6 group data-[state=active]:bg-background/90 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] border border-transparent data-[state=active]:border-purple-500/10"
                                >
                                    <tab.icon className="w-4 h-4 transition-all duration-500 group-hover:scale-110 group-data-[state=active]:scale-110 group-data-[state=active]:animate-pulse" />
                                    <span className="relative hidden lg:inline">{tab.label}</span>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-purple-500/20 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-700 blur-[4px]" />
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="min-h-[600px]">
                        {/* HERO TAB */}
                        <TabsContent value="hero" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                    <CardTitle className="text-2xl font-black italic tracking-tight">Cinematic Hero Visual</CardTitle>
                                    <p className="text-sm text-muted-foreground italic font-medium">Upload a background video or image for the services landing hero section.</p>
                                </CardHeader>
                                <CardContent className="p-10">
                                    <MediaUpload 
                                        label="Services Hero Background (Video/Image)" 
                                        value={content.heroVideoUrl || ''} 
                                        onChange={(url) => updateHeroVideo(url)} 
                                        type="video"
                                        aspectRatio="video"
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* OVERVIEW TAB */}
                        <TabsContent value="overview" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid lg:grid-cols-12 gap-8">
                                {/* Service List Sidebar */}
                                <Card className="lg:col-span-4 border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl h-fit max-h-[800px] flex flex-col">
                                    <CardHeader className="p-8 border-b border-border/40 bg-muted/5 flex-shrink-0">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-black italic tracking-tight">Service Catalog</CardTitle>
                                            <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl border-purple-500/20 hover:bg-purple-500/10" onClick={() => {
                                                const newId = `service-${Date.now()}`;
                                                addServiceItem({
                                                    id: newId,
                                                    label: "New Service",
                                                    iconName: "Globe",
                                                    gradient: "from-blue-600 to-cyan-500",
                                                    title: "New Service Title",
                                                    subtitle: "Service Subtitle",
                                                    description: "Description of the new service.",
                                                    features: [
                                                        { iconName: "Zap", title: "Feature 1", desc: "Feature description" }
                                                    ],
                                                    techs: ["React", "Next.js"]
                                                });
                                                setSelectedServiceId(newId);
                                                toast.success("Service artifact forged");
                                            }}>
                                                <Plus className="w-5 h-5 text-purple-500" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <ScrollArea className="flex-1">
                                        <CardContent className="p-6 space-y-3">
                                            {content.overview.map(item => (
                                                <div 
                                                    key={item.id}
                                                    onClick={() => setSelectedServiceId(item.id)}
                                                    className={cn(
                                                        "p-4 rounded-2xl border cursor-pointer hover:bg-muted/50 transition-all duration-300 flex items-center justify-between group",
                                                        selectedServiceId === item.id ? "bg-purple-500/10 border-purple-500/30 shadow-lg shadow-purple-500/5" : "bg-card/50 border-border/40"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br shrink-0", item.gradient)}>
                                                            {(() => {
                                                                const Icon = (LucideIcons as any)[item.iconName] || Globe;
                                                                return <Icon className="w-5 h-5 text-white" />;
                                                            })()}
                                                        </div>
                                                        <div className="font-bold truncate text-sm">{item.label}</div>
                                                    </div>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 shrink-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openConfirm("Delete service", `Remove "${item.label}" from the catalog?`, () => { deleteServiceItem(item.id); if(selectedServiceId === item.id) setSelectedServiceId(null); toast.success("Service deconstructed"); });
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </ScrollArea>
                                </Card>

                                {/* Service Editor */}
                                <div className="lg:col-span-8">
                                    {selectedService ? (
                                        <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                            <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                                <CardTitle className="text-2xl font-black italic tracking-tight">Edit Service: {selectedService.label}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-10 space-y-10">
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Service Label</Label>
                                                        <Input 
                                                            value={selectedService.label} 
                                                            onChange={(e) => updateServiceItem(selectedService.id, { label: e.target.value })}
                                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Icon</Label>
                                                        <Select 
                                                            value={selectedService.iconName} 
                                                            onValueChange={(val) => updateServiceItem(selectedService.id, { iconName: val })}
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
                                                        label="Custom Service Icon (Image Override)" 
                                                        value={selectedService.iconImage || ''} 
                                                        onChange={(url) => updateServiceItem(selectedService.id, { iconImage: url })} 
                                                        type="image"
                                                        aspectRatio="square"
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Service Title</Label>
                                                    <Input 
                                                        value={selectedService.title} 
                                                        onChange={(e) => updateServiceItem(selectedService.id, { title: e.target.value })}
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Subtitle (Optional)</Label>
                                                    <Input 
                                                        value={selectedService.subtitle || ''} 
                                                        onChange={(e) => updateServiceItem(selectedService.id, { subtitle: e.target.value })}
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Description</Label>
                                                    <Textarea 
                                                        value={selectedService.description} 
                                                        onChange={(e) => updateServiceItem(selectedService.id, { description: e.target.value })}
                                                        className="rounded-3xl border-border/40 bg-muted/20 font-bold italic p-8 min-h-[140px]"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Gradient Class</Label>
                                                    <Input 
                                                        value={selectedService.gradient} 
                                                        onChange={(e) => updateServiceItem(selectedService.id, { gradient: e.target.value })}
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/20 font-mono text-sm"
                                                        placeholder="from-blue-600 to-cyan-500"
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Features</Label>
                                                        <Button type="button" size="sm" variant="outline" className="rounded-xl h-8 text-xs" onClick={() => updateServiceItem(selectedService.id, { features: [...(selectedService.features || []), { iconName: "Zap", title: "New Feature", desc: "" }] })}>
                                                            <Plus className="w-3 h-3 mr-1" /> Add
                                                        </Button>
                                                    </div>
                                                    <div className="space-y-3">
                                                        {(selectedService.features || []).map((f, fIdx) => (
                                                            <div key={fIdx} className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-border/40 bg-muted/10">
                                                                <Select value={f.iconName} onValueChange={(v) => { const next = [...(selectedService.features || [])]; next[fIdx] = { ...next[fIdx], iconName: v }; updateServiceItem(selectedService.id, { features: next }); }}>
                                                                    <SelectTrigger className="w-[120px] h-9 rounded-lg"><SelectValue /></SelectTrigger>
                                                                    <SelectContent>{iconOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                                                </Select>
                                                                <Input placeholder="Title" value={f.title} onChange={(e) => { const next = [...(selectedService.features || [])]; next[fIdx] = { ...next[fIdx], title: e.target.value }; updateServiceItem(selectedService.id, { features: next }); }} className="flex-1 min-w-[100px] h-9 rounded-lg" />
                                                                <Input placeholder="Description" value={f.desc} onChange={(e) => { const next = [...(selectedService.features || [])]; next[fIdx] = { ...next[fIdx], desc: e.target.value }; updateServiceItem(selectedService.id, { features: next }); }} className="flex-1 min-w-[120px] h-9 rounded-lg" />
                                                                <Button type="button" size="icon" variant="ghost" className="h-9 w-9 text-red-500 hover:bg-red-500/10 rounded-lg" onClick={() => updateServiceItem(selectedService.id, { features: selectedService.features.filter((_, i) => i !== fIdx) })}>
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Techs (comma-separated)</Label>
                                                    <Input 
                                                        value={(selectedService.techs || []).join(", ")} 
                                                        onChange={(e) => updateServiceItem(selectedService.id, { techs: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                                                        className="rounded-2xl h-12 border-border/40 bg-muted/20 font-mono text-sm"
                                                        placeholder="React, Next.js, TypeScript"
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl h-[600px] flex items-center justify-center">
                                            <div className="text-center space-y-4 p-12">
                                                <div className="w-20 h-20 rounded-[30px] bg-purple-500/10 flex items-center justify-center mx-auto border border-purple-500/20">
                                                    <Grid className="w-10 h-10 text-purple-500/50" />
                                                </div>
                                                <h3 className="text-2xl font-black italic tracking-tight text-muted-foreground">Select a Service</h3>
                                                <p className="text-sm text-muted-foreground/60 italic">Choose a service from the catalog to edit its details.</p>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* PACKAGES TAB */}
                        <TabsContent value="packages" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {content.packages.map((pkg) => (
                                    <Card key={pkg.id} className="relative group border-border/40 bg-card/60 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 hover:shadow-purple-500/5 hover:border-purple-500/20">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="absolute top-6 right-6 h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"
                                            onClick={() => openConfirm("Delete package", `Remove "${pkg.name}"?`, () => { deletePackage(pkg.id); toast.success("Package deconstructed"); })}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                        <CardHeader className="p-8 border-b border-border/40 bg-muted/5">
                                            <Input 
                                                value={pkg.name} 
                                                onChange={(e) => updatePackage(pkg.id, { name: e.target.value })}
                                                className="font-black italic text-2xl border-none bg-transparent h-auto p-0 focus-visible:ring-0 text-white mb-4"
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[9px] font-black uppercase text-muted-foreground/60 italic tracking-widest">Price</Label>
                                                    <Input 
                                                        value={pkg.price} 
                                                        onChange={(e) => updatePackage(pkg.id, { price: e.target.value })}
                                                        className="rounded-xl h-10 border-border/40 bg-muted/20 font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[9px] font-black uppercase text-muted-foreground/60 italic tracking-widest">Monthly</Label>
                                                    <Input 
                                                        value={pkg.monthlyPrice} 
                                                        onChange={(e) => updatePackage(pkg.id, { monthlyPrice: e.target.value })}
                                                        className="rounded-xl h-10 border-border/40 bg-muted/20 font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-6">
                                            <div className="space-y-3">
                                                <Label className="text-[9px] font-black uppercase text-muted-foreground/60 italic tracking-widest">Description</Label>
                                                <Textarea 
                                                    value={pkg.description} 
                                                    onChange={(e) => updatePackage(pkg.id, { description: e.target.value })}
                                                    className="rounded-2xl border-border/40 bg-muted/20 font-bold italic p-4 min-h-[100px]"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[9px] font-black uppercase text-muted-foreground/60 italic tracking-widest">Features (one per line)</Label>
                                                <Textarea 
                                                    value={(pkg.features || []).join("\n")} 
                                                    onChange={(e) => updatePackage(pkg.id, { features: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
                                                    className="rounded-2xl border-border/40 bg-muted/20 font-bold p-4 min-h-[80px] text-sm"
                                                    placeholder={"Feature one\nFeature two"}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between gap-4">
                                                <Label className="text-[9px] font-black uppercase text-muted-foreground/60 italic tracking-widest">Highlight (e.g. popular)</Label>
                                                <Switch checked={pkg.highlight} onCheckedChange={(v) => updatePackage(pkg.id, { highlight: v })} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[9px] font-black uppercase text-muted-foreground/60 italic tracking-widest">Icon</Label>
                                                    <Select value={pkg.iconName} onValueChange={(v) => updatePackage(pkg.id, { iconName: v })}>
                                                        <SelectTrigger className="rounded-xl h-10"><SelectValue /></SelectTrigger>
                                                        <SelectContent className="rounded-xl">{iconOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[9px] font-black uppercase text-muted-foreground/60 italic tracking-widest">Gradient</Label>
                                                    <Input value={pkg.gradient} onChange={(e) => updatePackage(pkg.id, { gradient: e.target.value })} className="rounded-xl h-10 font-mono text-sm" placeholder="from-blue-500/20 to-cyan-500/20" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button 
                                    variant="outline" 
                                    className="h-full border-dashed border-2 min-h-[400px] flex flex-col gap-6 rounded-[40px] hover:bg-purple-500/[0.03] hover:border-purple-500/40 transition-all duration-700 bg-transparent group"
                                    onClick={() => {
                                        const newId = `package-${Date.now()}`;
                                        addPackage({
                                            id: newId,
                                            name: "New Package",
                                            price: "Custom",
                                            monthlyPrice: "Custom",
                                            description: "Package description",
                                            features: ["Feature 1", "Feature 2"],
                                            highlight: false,
                                            iconName: "Package",
                                            gradient: "from-blue-500/20 to-cyan-500/20"
                                        });
                                        toast.success("Package forged");
                                    }}
                                >
                                    <div className="w-20 h-20 rounded-[30px] bg-purple-500/5 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                        <Plus className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black italic tracking-tighter text-white">Forge Package</span>
                                        <span className="text-xs text-muted-foreground/60 uppercase font-black tracking-widest mt-2 block">New Pricing Tier</span>
                                    </div>
                                </Button>
                            </div>
                        </TabsContent>

                        {/* PROCESS TAB */}
                        <TabsContent value="process" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-8">
                                {content.process.map((step, idx) => (
                                    <Card key={step.id} className="relative group border-border/40 bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden transition-all duration-300 hover:border-purple-500/20">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="absolute top-6 right-6 h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-20"
                                            onClick={() => openConfirm("Delete process step", `Remove "${step.title}"?`, () => { deleteProcessStep(step.id); toast.success("Process step removed"); })}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                        <CardContent className="p-10 space-y-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 font-black text-2xl text-purple-500">
                                                    {idx + 1}
                                                </div>
                                                <Input 
                                                    value={step.title} 
                                                    onChange={(e) => updateProcessStep(step.id, { title: e.target.value })}
                                                    className="font-black italic text-2xl border-none bg-transparent h-auto p-0 focus-visible:ring-0 text-white flex-1"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Step Description</Label>
                                                <Textarea 
                                                    value={step.desc} 
                                                    onChange={(e) => updateProcessStep(step.id, { desc: e.target.value })}
                                                    className="rounded-3xl border-border/40 bg-muted/10 font-bold italic p-8 min-h-[120px]"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button 
                                    variant="outline" 
                                    className="border-dashed border-2 py-16 rounded-[40px] w-full font-black italic text-xl gap-4 hover:bg-purple-500/[0.02] hover:border-purple-500/30 transition-all border-border/40 flex items-center justify-center group bg-transparent text-white"
                                    onClick={() => {
                                        addProcessStep({
                                            id: nextProcessId(),
                                            title: "New Process Step",
                                            desc: "Describe this phase of the workflow.",
                                            iconName: "Zap",
                                            color: "text-purple-500"
                                        });
                                        toast.success("Process step added");
                                    }}
                                >
                                    <Plus className="w-8 h-8 text-purple-500 transition-transform group-hover:rotate-90 duration-500" /> Add Process Step
                                </Button>
                            </div>
                        </TabsContent>

                        {/* COMPARISON TAB */}
                        <TabsContent value="comparison" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-10">
                                <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                    <CardHeader className="p-10 border-b border-border/40 bg-muted/5 flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl font-black italic tracking-tight">Comparison Features</CardTitle>
                                            <p className="text-sm text-muted-foreground italic font-medium mt-1">Row labels for the comparison table (name + tooltip).</p>
                                        </div>
                                        <Button size="sm" className="rounded-xl bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 border-0" onClick={() => { addComparisonFeature({ name: "New Feature", tooltip: "Tooltip" }); toast.success("Feature added"); }}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Feature
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-10">
                                        <div className="space-y-4">
                                            {content.comparison.features.map((feat, idx) => (
                                                <div key={idx} className="flex flex-wrap items-center gap-4 p-4 rounded-2xl border border-border/40 bg-muted/10">
                                                    <Input placeholder="Feature name" value={feat.name} onChange={(e) => updateComparisonFeature(idx, { ...feat, name: e.target.value })} className="flex-1 min-w-[140px] rounded-xl h-10" />
                                                    <Input placeholder="Tooltip" value={feat.tooltip} onChange={(e) => updateComparisonFeature(idx, { ...feat, tooltip: e.target.value })} className="flex-1 min-w-[180px] rounded-xl h-10" />
                                                    <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-500/10 h-10 w-10 rounded-xl shrink-0" onClick={() => { deleteComparisonFeature(idx); toast.success("Feature removed"); }}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                    <CardHeader className="p-10 border-b border-border/40 bg-muted/5 flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle className="text-2xl font-black italic tracking-tight">Comparison Tiers</CardTitle>
                                            <p className="text-sm text-muted-foreground italic font-medium mt-1">Pricing tiers and their feature values (true / false / custom text).</p>
                                        </div>
                                        <Button size="sm" className="rounded-xl bg-purple-500/20 text-purple-500 hover:bg-purple-500/30 border-0" onClick={() => {
                                            const newId = `tier-${Date.now()}`;
                                            addComparisonTier({
                                                id: newId, name: "New Tier", price: "Custom", description: "", iconName: "Zap", color: "text-purple-500", highlight: false,
                                                features: content.comparison.features.map(() => false)
                                            });
                                            toast.success("Tier added");
                                        }}>
                                            <Plus className="w-4 h-4 mr-2" /> Add Tier
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-10 space-y-8">
                                        {content.comparison.tiers.map((tier) => (
                                            <Card key={tier.id} className="border border-border/40 rounded-2xl overflow-hidden bg-muted/5">
                                                <CardHeader className="p-6 border-b border-border/40 flex flex-row items-start justify-between gap-4">
                                                    <div className="grid gap-4 flex-1 grid-cols-1 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60">Tier name</Label>
                                                            <Input value={tier.name} onChange={(e) => updateComparisonTier(tier.id, { name: e.target.value })} className="rounded-xl h-10 font-bold" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60">Price</Label>
                                                            <Input value={tier.price} onChange={(e) => updateComparisonTier(tier.id, { price: e.target.value })} className="rounded-xl h-10 font-bold" placeholder="$X,XXX or Custom" />
                                                        </div>
                                                        <div className="space-y-2 md:col-span-2">
                                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60">Description</Label>
                                                            <Input value={tier.description} onChange={(e) => updateComparisonTier(tier.id, { description: e.target.value })} className="rounded-xl h-10 font-bold" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60">Icon</Label>
                                                            <Select value={tier.iconName} onValueChange={(v) => updateComparisonTier(tier.id, { iconName: v })}>
                                                                <SelectTrigger className="rounded-xl h-10"><SelectValue /></SelectTrigger>
                                                                <SelectContent className="rounded-xl">{iconOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-[10px] font-black uppercase text-muted-foreground/60">Color class</Label>
                                                            <Input value={tier.color} onChange={(e) => updateComparisonTier(tier.id, { color: e.target.value })} className="rounded-xl h-10 font-mono text-sm" placeholder="text-purple-500" />
                                                        </div>
                                                        <div className="flex items-center gap-2 md:col-span-2">
                                                            <input type="checkbox" id={`highlight-${tier.id}`} checked={tier.highlight} onChange={(e) => updateComparisonTier(tier.id, { highlight: e.target.checked })} className="rounded border-border" />
                                                            <Label htmlFor={`highlight-${tier.id}`} className="text-sm font-bold">Highlight (e.g. Most Popular)</Label>
                                                        </div>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="text-red-500 hover:bg-red-500/10 h-10 w-10 rounded-xl shrink-0" onClick={() => openConfirm("Delete tier", `Remove "${tier.name}"?`, () => { deleteComparisonTier(tier.id); toast.success("Tier removed"); })}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </CardHeader>
                                                <CardContent className="p-6">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 mb-3 block">Feature values (true, false, or custom e.g. &quot;3 Months&quot;)</Label>
                                                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                        {content.comparison.features.map((_, featIdx) => (
                                                            <div key={featIdx} className="space-y-1">
                                                                <Label className="text-[9px] text-muted-foreground/80">{content.comparison.features[featIdx]?.name || `Feature ${featIdx + 1}`}</Label>
                                                                <Input
                                                                    value={tier.features[featIdx] === true ? "true" : tier.features[featIdx] === false ? "false" : String(tier.features[featIdx] ?? "")}
                                                                    onChange={(e) => {
                                                                        const raw = e.target.value.trim().toLowerCase();
                                                                        const next = [...(tier.features || [])];
                                                                        while (next.length < content.comparison.features.length) next.push(false);
                                                                        if (raw === "true") next[featIdx] = true;
                                                                        else if (raw === "false" || raw === "") next[featIdx] = false;
                                                                        else next[featIdx] = e.target.value.trim();
                                                                        updateComparisonTier(tier.id, { features: next });
                                                                    }}
                                                                    placeholder="true / false / text"
                                                                    className="rounded-xl h-9 text-sm font-mono"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* TECH STACK TAB */}
                        <TabsContent value="techStack" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                                {content.techStack.map((cat) => (
                                    <Card key={cat.id} className="relative group border-border/40 bg-card/60 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl transition-all duration-500 hover:shadow-purple-500/5 hover:border-purple-500/20">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="absolute top-6 right-6 h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500 z-20"
                                            onClick={() => openConfirm("Delete tech category", `Remove "${cat.label}"?`, () => { deleteTechCategory(cat.id); toast.success("Tech category removed"); })}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                        <CardHeader className="p-8 border-b border-border/40 bg-muted/5">
                                            <Input 
                                                value={cat.label} 
                                                onChange={(e) => updateTechCategory(cat.id, { label: e.target.value })}
                                                className="font-black italic text-xl border-none bg-transparent h-auto p-0 focus-visible:ring-0 text-white mb-2"
                                            />
                                            <Input 
                                                value={cat.description} 
                                                onChange={(e) => updateTechCategory(cat.id, { description: e.target.value })}
                                                className="text-sm border-none bg-transparent h-auto p-0 focus-visible:ring-0 text-muted-foreground italic"
                                            />
                                        </CardHeader>
                                        <CardContent className="p-8">
                                            <Label className="text-[9px] font-black uppercase text-muted-foreground/60 italic tracking-widest mb-4 block">Technologies (comma-separated)</Label>
                                            <Textarea 
                                                value={cat.techs.join(', ')} 
                                                onChange={(e) => updateTechCategory(cat.id, { techs: e.target.value.split(',').map(t => t.trim()) })}
                                                className="rounded-2xl border-border/40 bg-muted/20 font-mono text-sm p-4 min-h-[120px]"
                                            />
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button 
                                    variant="outline" 
                                    className="h-full border-dashed border-2 min-h-[300px] flex flex-col gap-6 rounded-[40px] hover:bg-purple-500/[0.03] hover:border-purple-500/40 transition-all duration-700 bg-transparent group"
                                    onClick={() => {
                                        const newId = `tech-${Date.now()}`;
                                        addTechCategory({
                                            id: newId,
                                            label: "New Category",
                                            iconName: "Code",
                                            description: "Tech description",
                                            techs: ["Tech 1", "Tech 2"]
                                        });
                                        toast.success("Tech category added");
                                    }}
                                >
                                    <div className="w-20 h-20 rounded-[30px] bg-purple-500/5 flex items-center justify-center border border-purple-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                                        <Plus className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-2xl font-black italic tracking-tighter text-white">Add Category</span>
                                    </div>
                                </Button>
                            </div>
                        </TabsContent>

                        {/* FAQ TAB */}
                        <TabsContent value="faq" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-8">
                                {content.faqs.map((faq) => (
                                    <Card key={faq.id} className="relative group border-border/40 bg-card/40 backdrop-blur-xl rounded-[32px] overflow-hidden transition-all duration-300 hover:border-purple-500/20">
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="absolute top-6 right-6 h-10 w-10 rounded-xl text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-20"
                                            onClick={() => openConfirm("Delete FAQ", "Remove this FAQ item?", () => { deleteFAQ(faq.id); toast.success("FAQ removed"); })}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                        <CardContent className="p-10 space-y-8">
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Question</Label>
                                                <Input 
                                                    value={faq.question} 
                                                    onChange={(e) => updateFAQ(faq.id, { question: e.target.value })}
                                                    className="rounded-2xl h-14 border-border/40 bg-muted/10 font-black italic text-lg"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Answer</Label>
                                                <Textarea 
                                                    value={faq.answer} 
                                                    onChange={(e) => updateFAQ(faq.id, { answer: e.target.value })}
                                                    className="rounded-3xl border-border/40 bg-muted/10 font-bold italic p-8 min-h-[140px]"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Category</Label>
                                                <Input 
                                                    value={faq.category} 
                                                    onChange={(e) => updateFAQ(faq.id, { category: e.target.value })}
                                                    className="rounded-2xl h-12 border-border/40 bg-muted/10 font-bold italic"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button 
                                    variant="outline" 
                                    className="border-dashed border-2 py-16 rounded-[40px] w-full font-black italic text-xl gap-4 hover:bg-purple-500/[0.02] hover:border-purple-500/30 transition-all border-border/40 flex items-center justify-center group bg-transparent text-white"
                                    onClick={() => {
                                        const newId = `faq-${Date.now()}`;
                                        addFAQ({
                                            id: newId,
                                            question: "New Question?",
                                            answer: "Answer here.",
                                            category: "General"
                                        });
                                        toast.success("FAQ added");
                                    }}
                                >
                                    <Plus className="w-8 h-8 text-purple-500 transition-transform group-hover:rotate-90 duration-500" /> Add FAQ
                                </Button>
                            </div>
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

            {/* Services Universe Simulator */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(168,85,247,0.3)]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5 bg-muted/30 p-1 rounded-xl border border-border/30 shadow-inner">
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'desktop' ? "bg-background text-purple-500 shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('desktop')}>
                                        <Monitor size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'mobile' ? "bg-background text-purple-500 shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('mobile')}>
                                        <SmartphoneIcon size={16} />
                                    </Button>
                                </div>
                                <Separator orientation="vertical" className="h-6" />
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg font-black italic tracking-tight text-white">Services Simulator</CardTitle>
                                    <span className="text-[9px] font-black uppercase text-purple-500/50 tracking-widest italic -mt-0.5">PREVIEW_MATRIX: v2.01</span>
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
                                {/* Simulated Services Content */}
                                <div className="min-h-full pb-32">
                                    {/* Simulated Hero */}
                                    <div className="relative aspect-[21/9] overflow-hidden bg-black flex items-center justify-center">
                                        {content.heroVideoUrl ? (
                                            <video src={content.heroVideoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-950/20" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                        <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl pt-20">
                                            <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">Our Services.</h1>
                                        </div>
                                    </div>

                                    {/* Simulated Service Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12 -mt-10 relative z-20">
                                        {content.overview.slice(0, 3).map(service => (
                                            <div key={service.id} className="bg-card/70 backdrop-blur-3xl border border-border/40 p-8 rounded-[40px] shadow-2xl hover:translate-y-[-10px] transition-transform duration-500 group">
                                                <div className="flex items-center gap-4 mb-6">
                                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br overflow-hidden", service.gradient)}>
                                                        {service.iconImage ? (
                                                            <img src={service.iconImage} alt="Icon" className="w-full h-full object-cover" />
                                                        ) : (() => {
                                                            const Icon = (LucideIcons as any)[service.iconName] || Globe;
                                                            return <Icon size={28} className="text-white" />;
                                                        })()}
                                                    </div>
                                                    <h3 className="text-xl font-black italic tracking-tight text-white">{service.label}</h3>
                                                </div>
                                                <h4 className="text-2xl font-black italic tracking-tight text-white mb-2">{service.title}</h4>
                                                {service.subtitle && <p className="text-sm text-purple-500 font-bold italic mb-4">{service.subtitle}</p>}
                                                <p className="text-sm text-muted-foreground leading-relaxed italic">{service.description}</p>
                                            </div>
                                        ))}
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
