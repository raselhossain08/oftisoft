"use client";

import { useState, useEffect, useRef } from "react";
import { usePricingContentStore, type PricingPlan } from "@/lib/store/pricing-content";
import { usePricingContent, useUpdatePricingContent } from "@/lib/api/pricing-content-queries";
import { toast } from "sonner";
import { 
    Plus, 
    Save, 
    Trash2, 
    CreditCard,
    Check,
    Star,
    ArrowLeft,
    Monitor,
    Smartphone,
    RefreshCcw,
    Sparkles,
    FileText,
    DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

export default function PricingContentEditor() {
    const { 
        content, 
        setContent,
        updateHeader, 
        updateConsultation,
        addPlan, 
        updatePlan, 
        deletePlan,
        resetToDefaults
    } = usePricingContentStore();

    const { data: apiContent } = usePricingContent();
    const updateMutation = useUpdatePricingContent();

    const [activeTab, setActiveTab] = useState('header');
    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
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

    if (!content) return <div className="p-20 text-center font-black animate-pulse text-muted-foreground uppercase tracking-widest">Initializing Pricing Forge...</div>;

    const selectedPlan = content.plans.find(p => p.id === selectedPlanId);

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
                                <CardTitle className="text-2xl font-black italic tracking-tight underline decoration-emerald-500/30 underline-offset-4 text-white">Pricing CMS</CardTitle>
                                <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-emerald-500/10 text-emerald-500 border-none">
                                    MATRIX_ACTIVE
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                                Subscription Plans & Pricing
                            </Label>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold border-border/50 hover:bg-muted/50 transition-colors" onClick={() => openConfirm("Reset to defaults", "Reset all pricing content to defaults? This cannot be undone.", () => { resetToDefaults(); toast.success("Pricing defaults restored"); })}>
                             <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold bg-emerald-500/5 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 transition-all" onClick={() => setPreviewOpen(true)}>
                            <Monitor className="w-4 h-4 mr-2" /> Live Preview
                        </Button>
                        <Button className="rounded-xl font-black italic bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all px-8 h-11" onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} {updateMutation.isPending ? "Syncing…" : "Sync Matrix"}
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
                                { value: "plans", label: "Plans", icon: CreditCard },
                                { value: "consultation", label: "Consultation", icon: FileText },
                            ].map((tab) => (
                                <TabsTrigger 
                                    key={tab.value}
                                    value={tab.value} 
                                    className="relative z-10 rounded-[18px] h-13 gap-3 data-[state=active]:text-emerald-500 transition-all duration-500 font-black italic px-8 group data-[state=active]:bg-background/90 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] border border-transparent data-[state=active]:border-emerald-500/10"
                                >
                                    <tab.icon className="w-4 h-4 transition-all duration-500 group-hover:scale-110 group-data-[state=active]:scale-110 group-data-[state=active]:animate-pulse" />
                                    <span className="relative">{tab.label}</span>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-emerald-500/20 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-700 blur-[4px]" />
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="min-h-[600px]">
                        {/* HEADER TAB */}
                        <TabsContent value="header" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                    <CardTitle className="text-2xl font-black italic tracking-tight">Pricing Hero Configuration</CardTitle>
                                    <p className="text-sm text-muted-foreground italic font-medium">Main header content and cinematic visual for the pricing landing page.</p>
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
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl text-emerald-500"
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
                                                label="Pricing Hero Visual (Cinematic Video/Image)" 
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

                        {/* PLANS TAB */}
                        <TabsContent value="plans" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid lg:grid-cols-12 gap-8">
                                {/* Plan List Sidebar */}
                                <Card className="lg:col-span-4 border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl h-fit max-h-[800px] flex flex-col">
                                    <CardHeader className="p-8 border-b border-border/40 bg-muted/5 flex-shrink-0">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-black italic tracking-tight">Pricing Plans</CardTitle>
                                            <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl border-emerald-500/20 hover:bg-emerald-500/10" onClick={() => {
                                                const newId = `plan-${Date.now()}`;
                                                addPlan({
                                                    id: newId,
                                                    name: "New Plan",
                                                    description: "Description...",
                                                    price: "0",
                                                    period: "MoonCycle",
                                                    buttonText: "Subscribe",
                                                    popular: false,
                                                    features: ["Feature 1", "Feature 2"],
                                                    order: (content.plans.length || 0) + 1
                                                });
                                                setSelectedPlanId(newId);
                                                toast.success("Pricing plan forged");
                                            }}>
                                                <Plus className="w-5 h-5 text-emerald-500" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <ScrollArea className="flex-1">
                                        <CardContent className="p-6 space-y-3">
                                            {content.plans.map(item => (
                                                <div 
                                                    key={item.id}
                                                    onClick={() => setSelectedPlanId(item.id)}
                                                    className={cn(
                                                        "p-4 rounded-2xl border cursor-pointer hover:bg-muted/50 transition-all duration-300 flex items-center justify-between group",
                                                        selectedPlanId === item.id ? "bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/5" : "bg-card/50 border-border/40"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className={cn("w-3 h-3 rounded-full shrink-0", item.popular ? "bg-emerald-500" : "bg-muted-foreground")} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-sm truncate flex items-center gap-2">
                                                                {item.name}
                                                                {item.popular && <Star className="w-3 h-3 text-emerald-500 fill-emerald-500" />}
                                                            </div>
                                                            <div className="text-xs text-muted-foreground truncate">${item.price} / {item.period}</div>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 shrink-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openConfirm("Delete plan", `Remove "${item.name}"?`, () => { deletePlan(item.id); if(selectedPlanId === item.id) setSelectedPlanId(null); toast.success("Plan deconstructed"); });
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </ScrollArea>
                                </Card>

                                {/* Plan Editor */}
                                <div className="lg:col-span-8">
                                    {selectedPlan ? (
                                        <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                            <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                                <CardTitle className="text-2xl font-black italic tracking-tight">Edit Plan: {selectedPlan.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-10 space-y-10">
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Plan Name</Label>
                                                        <Input 
                                                            value={selectedPlan.name} 
                                                            onChange={(e) => updatePlan(selectedPlan.id, { name: e.target.value })}
                                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Price</Label>
                                                        <Input 
                                                            value={selectedPlan.price} 
                                                            onChange={(e) => updatePlan(selectedPlan.id, { price: e.target.value })}
                                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Description</Label>
                                                    <Textarea 
                                                        value={selectedPlan.description} 
                                                        onChange={(e) => updatePlan(selectedPlan.id, { description: e.target.value })}
                                                        className="rounded-3xl border-border/40 bg-muted/20 font-bold italic p-8 min-h-[100px]"
                                                    />
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Billing Period</Label>
                                                        <Input 
                                                            value={selectedPlan.period} 
                                                            onChange={(e) => updatePlan(selectedPlan.id, { period: e.target.value })}
                                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic"
                                                            placeholder="e.g. Month"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Button Text</Label>
                                                        <Input 
                                                            value={selectedPlan.buttonText} 
                                                            onChange={(e) => updatePlan(selectedPlan.id, { buttonText: e.target.value })}
                                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3 p-6 rounded-3xl bg-muted/10 border border-border/40">
                                                    <Switch 
                                                        id="popular" 
                                                        checked={selectedPlan.popular}
                                                        onCheckedChange={(checked) => updatePlan(selectedPlan.id, { popular: checked })}
                                                    />
                                                    <Label htmlFor="popular" className="font-bold italic cursor-pointer">Mark as Popular / Featured Plan</Label>
                                                </div>

                                                <div className="space-y-4">
                                                    <MediaUpload 
                                                        label="Custom Plan Icon (Image Override)" 
                                                        value={selectedPlan.iconImage || ''} 
                                                        onChange={(url) => updatePlan(selectedPlan.id, { iconImage: url })} 
                                                        type="image"
                                                        aspectRatio="square"
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="space-y-6">
                                                    <Label className="text-sm font-black italic tracking-tight">Plan Features</Label>
                                                    <div className="space-y-3">
                                                        {selectedPlan.features.map((feature, idx) => (
                                                            <div key={idx} className="flex gap-3">
                                                                <Input 
                                                                    value={feature} 
                                                                    onChange={(e) => {
                                                                        const newFeatures = [...selectedPlan.features];
                                                                        newFeatures[idx] = e.target.value;
                                                                        updatePlan(selectedPlan.id, { features: newFeatures });
                                                                    }}
                                                                    className="rounded-2xl h-12 border-border/40 bg-muted/10 font-bold italic"
                                                                />
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                    className="h-12 w-12 rounded-xl text-red-500 hover:bg-red-500/10"
                                                                    onClick={() => {
                                                                        const newFeatures = selectedPlan.features.filter((_, i) => i !== idx);
                                                                        updatePlan(selectedPlan.id, { features: newFeatures });
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button 
                                                            variant="outline" 
                                                            className="w-full rounded-2xl h-12 font-bold italic border-dashed border-2 hover:bg-emerald-500/5 hover:border-emerald-500/30"
                                                            onClick={() => updatePlan(selectedPlan.id, { features: [...selectedPlan.features, "New Feature"] })}
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" /> Add Feature
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl h-[600px] flex items-center justify-center">
                                            <div className="text-center space-y-4 p-12">
                                                <div className="w-20 h-20 rounded-[30px] bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20">
                                                    <CreditCard className="w-10 h-10 text-emerald-500/50" />
                                                </div>
                                                <h3 className="text-2xl font-black italic tracking-tight text-muted-foreground">Select a Plan</h3>
                                                <p className="text-sm text-muted-foreground/60 italic">Choose a pricing plan to edit its details.</p>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        {/* CONSULTATION TAB */}
                        <TabsContent value="consultation" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                    <CardTitle className="text-2xl font-black italic tracking-tight">Consultation CTA</CardTitle>
                                    <p className="text-sm text-muted-foreground italic font-medium">Bottom link for custom enterprise inquiries.</p>
                                </CardHeader>
                                <CardContent className="p-10 space-y-10">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Prompt Text</Label>
                                        <Input 
                                            value={content.consultation.text} 
                                            onChange={(e) => updateConsultation({ text: e.target.value })}
                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Link Text</Label>
                                        <Input 
                                            value={content.consultation.linkText} 
                                            onChange={(e) => updateConsultation({ linkText: e.target.value })}
                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic"
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

            {/* Pricing Universe Simulator */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(16,185,129,0.3)]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5 bg-muted/30 p-1 rounded-xl border border-border/30 shadow-inner">
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'desktop' ? "bg-background text-emerald-500 shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('desktop')}>
                                        <Monitor size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'mobile' ? "bg-background text-emerald-500 shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('mobile')}>
                                        <Smartphone size={16} />
                                    </Button>
                                </div>
                                <Separator orientation="vertical" className="h-6" />
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg font-black italic tracking-tight text-white">Pricing Simulator</CardTitle>
                                    <span className="text-[9px] font-black uppercase text-emerald-500/50 tracking-widest italic -mt-0.5">MATRIX_PREVIEW: v2.01</span>
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
                                {/* Simulated Pricing Content */}
                                <div className="min-h-full pb-32">
                                    {/* Simulated Hero */}
                                    <div className="relative aspect-[21/9] overflow-hidden bg-black flex items-center justify-center">
                                        {content.header.videoUrl ? (
                                            <video src={content.header.videoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-950/20" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                        <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl pt-20">
                                            <Badge className="bg-emerald-500/20 text-emerald-500 border-none px-4 py-1.5 rounded-full font-black italic tracking-[0.2em] text-[10px] uppercase shadow-xl animate-pulse">{content.header.badge.toUpperCase()}</Badge>
                                            <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">
                                                {content.header.titlePrefix} <span className="text-emerald-500">{content.header.titleHighlight}</span>.
                                            </h1>
                                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed italic font-medium">{content.header.description}</p>
                                        </div>
                                    </div>

                                    {/* Simulated Pricing Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 -mt-10 relative z-20">
                                        {content.plans.map(plan => (
                                            <div key={plan.id} className={cn(
                                                "bg-card/70 backdrop-blur-3xl border p-8 rounded-[40px] shadow-2xl hover:translate-y-[-10px] transition-all duration-500 group relative",
                                                plan.popular ? "border-emerald-500/40 shadow-emerald-500/20 scale-105" : "border-border/40"
                                            )}>
                                                {plan.popular && (
                                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                        <Badge className="bg-emerald-500 text-white border-none px-4 py-1 rounded-full font-black italic text-xs shadow-xl">
                                                            <Star className="w-3 h-3 mr-1 fill-white" /> POPULAR
                                                        </Badge>
                                                    </div>
                                                )}
                                                <div className="text-center space-y-6">
                                                    {plan.iconImage && (
                                                        <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto">
                                                            <img src={plan.iconImage} alt="Icon" className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    <h3 className="text-2xl font-black italic tracking-tight text-white">{plan.name}</h3>
                                                    <p className="text-sm text-muted-foreground italic">{plan.description}</p>
                                                    <div className="py-6">
                                                        <div className="text-5xl font-black italic tracking-tighter text-emerald-500">
                                                            ${plan.price}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground uppercase tracking-widest font-black italic mt-2">
                                                            / {plan.period}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-3 text-left">
                                                        {plan.features.map((feature, idx) => (
                                                            <div key={idx} className="flex items-start gap-3">
                                                                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                                                <span className="text-sm text-muted-foreground">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Button className={cn(
                                                        "w-full rounded-2xl h-12 font-black italic transition-all",
                                                        plan.popular ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-muted/50 text-white hover:bg-muted"
                                                    )}>
                                                        {plan.buttonText}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Simulated Consultation CTA */}
                                    <div className="mt-32 px-12 text-center">
                                        <p className="text-lg text-muted-foreground italic font-medium">
                                            {content.consultation.text}{" "}
                                            <span className="text-emerald-500 font-black underline decoration-emerald-500/30 underline-offset-4 cursor-pointer hover:decoration-emerald-500 transition-all">
                                                {content.consultation.linkText}
                                            </span>
                                        </p>
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
