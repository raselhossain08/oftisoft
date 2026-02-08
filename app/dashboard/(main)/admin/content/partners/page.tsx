"use client";

import { useState, useEffect, useRef } from "react";
import { usePartnersContentStore, type PartnerItem, type EcosystemBrand } from "@/lib/store/partners-content";
import { usePartnersContent, useUpdatePartnersContent } from "@/lib/api/partners-content-queries";
import { toast } from "sonner";
import { 
    Plus, 
    Save, 
    Trash2, 
    LayoutTemplate, 
    Users, 
    Handshake, 
    Globe, 
    Zap, 
    Briefcase,
    ShieldCheck,
    Box,
    Sparkles,
    Gem,
    Workflow,
    Cpu,
    Target,
    ArrowLeft,
    Monitor,
    Smartphone,
    RefreshCcw,
    Pencil,
    Check,
    X
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { MediaUpload } from "@/components/dashboard/media-upload";

// Icon Map
const iconOptions = [
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Sparkles", label: "Sparkles", icon: Sparkles },
  { value: "ShieldCheck", label: "Shield", icon: ShieldCheck },
  { value: "Handshake", label: "Handshake", icon: Handshake },
  { value: "Users", label: "Users", icon: Users },
  { value: "Cpu", label: "CPU", icon: Cpu },
  { value: "Workflow", label: "Workflow", icon: Workflow },
  { value: "Gem", label: "Gem", icon: Gem },
  { value: "Target", label: "Target", icon: Target },
];

export default function PartnersContentEditor() {
    const { 
        content, 
        setContent,
        updateHeader, 
        updateCTA,
        updateEcosystemTitle,
        addPartner, 
        updatePartner, 
        deletePartner,
        addBrand,
        updateBrand,
        deleteBrand,
        resetToDefaults
    } = usePartnersContentStore();

    const { data: apiContent } = usePartnersContent();
    const updateMutation = useUpdatePartnersContent();

    const [activeTab, setActiveTab] = useState<'partners' | 'page'>('partners');
    const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
    const [isCreatePartnerOpen, setIsCreatePartnerOpen] = useState(false);
    const [newBrandName, setNewBrandName] = useState("");
    const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
    const [editingBrandName, setEditingBrandName] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewScale, setPreviewScale] = useState<'desktop' | 'mobile'>('desktop');
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });
    const hasHydrated = useRef(false);

    const [partnerForm, setPartnerForm] = useState<Partial<PartnerItem>>({
        name: "",
        role: "",
        desc: "",
        iconName: "Zap",
        color: "text-primary",
        order: 1
    });

    useEffect(() => {
        if (apiContent && !hasHydrated.current) {
            setContent(apiContent);
            hasHydrated.current = true;
        }
    }, [apiContent, setContent]);

    if (!content) return <div className="p-20 text-center font-black animate-pulse text-muted-foreground uppercase tracking-widest">Initializing Partners Forge...</div>;

    const partners = content.partners || [];

    const handleSave = async () => {
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

    const handleCreatePartner = () => {
        const newId = `part-${Date.now()}`;
        addPartner({
            id: newId,
            name: partnerForm.name || "New Partner",
            role: partnerForm.role || "Role",
            desc: partnerForm.desc || "Description...",
            iconName: partnerForm.iconName || "Zap",
            color: partnerForm.color || "text-primary",
            order: partners.length + 1
        });
        toast.success("Partner added");
        setIsCreatePartnerOpen(false);
        setEditingPartnerId(newId);
        setPartnerForm({ name: "", role: "", desc: "", iconName: "Zap", color: "text-primary", order: 1 });
    };

    const handleAddBrand = () => {
        if (!newBrandName.trim()) return;
        addBrand({ id: `brand-${Date.now()}`, name: newBrandName.trim() });
        setNewBrandName("");
        toast.success("Brand added");
    };

    const startEditBrand = (brand: EcosystemBrand) => {
        setEditingBrandId(brand.id);
        setEditingBrandName(brand.name);
    };
    const saveEditBrand = () => {
        if (editingBrandId && editingBrandName.trim()) {
            updateBrand(editingBrandId, { name: editingBrandName.trim() });
            toast.success("Brand updated");
        }
        setEditingBrandId(null);
        setEditingBrandName("");
    };
    const cancelEditBrand = () => {
        setEditingBrandId(null);
        setEditingBrandName("");
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
                                <CardTitle className="text-2xl font-black italic tracking-tight underline decoration-amber-500/30 underline-offset-4 text-white">Partners CMS</CardTitle>
                                <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-amber-500/10 text-amber-500 border-none">
                                    ALLIANCE_ACTIVE
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                                Strategic Partners & Ecosystem
                            </Label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold border-border/50 hover:bg-muted/50 transition-colors" onClick={() => openConfirm("Reset to defaults", "Reset all partners content to defaults? This cannot be undone.", () => { resetToDefaults(); toast.success("Partners defaults restored"); })}>
                            <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold bg-amber-500/5 border-amber-500/20 text-amber-500 hover:bg-amber-500/10 transition-all" onClick={() => setPreviewOpen(true)}>
                            <Monitor className="w-4 h-4 mr-2" /> Live Preview
                        </Button>
                        <Button className="rounded-xl font-black italic bg-amber-500 text-white shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all px-8 h-11" onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} {updateMutation.isPending ? "Syncing…" : "Sync Alliance"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 space-y-6">
                <div className="flex gap-2">
                    <Button variant={activeTab === 'partners' ? "default" : "outline"} onClick={() => setActiveTab('partners')} className="rounded-xl">
                        <Handshake className="w-4 h-4 mr-2" /> Partners
                    </Button>
                    <Button variant={activeTab === 'page' ? "default" : "outline"} onClick={() => setActiveTab('page')} className="rounded-xl">
                        <LayoutTemplate className="w-4 h-4 mr-2" /> Page Content
                    </Button>
                </div>

                {activeTab === 'partners' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-1 h-fit border-border/40 rounded-[24px] overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/5">
                                <CardTitle className="font-black italic">Partner List</CardTitle>
                                <Dialog open={isCreatePartnerOpen} onOpenChange={setIsCreatePartnerOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="rounded-xl bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border-0"><Plus className="w-4 h-4 mr-2" /> Add Partner</Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-2xl">
                                        <DialogHeader>
                                            <DialogTitle>New Partner</DialogTitle>
                                            <DialogDescription>Add a strategic partner to the list.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} placeholder="e.g. Acme Corp" className="rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Role</Label>
                                                <Input value={partnerForm.role} onChange={(e) => setPartnerForm({...partnerForm, role: e.target.value})} placeholder="e.g. Infrastructure" className="rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Input value={partnerForm.desc} onChange={(e) => setPartnerForm({...partnerForm, desc: e.target.value})} placeholder="Brief description..." className="rounded-xl" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleCreatePartner} className="rounded-xl">Add Partner</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-4 space-y-2">
                                {partners.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className={cn(
                                            "p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group",
                                            editingPartnerId === item.id ? "bg-amber-500/10 border-amber-500/30" : "bg-card/50 border-border/40"
                                        )}
                                        onClick={() => setEditingPartnerId(item.id)}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className={cn("w-2 h-2 rounded-full shrink-0", item.color?.replace?.("text-", "bg-") || "bg-primary")} />
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm truncate">{item.name}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{item.role}</div>
                                            </div>
                                        </div>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                                            onClick={(e) => { e.stopPropagation(); openConfirm("Delete partner", `Remove "${item.name}"?`, () => { deletePartner(item.id); if (editingPartnerId === item.id) setEditingPartnerId(null); toast.success("Partner deleted"); }); }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2 border-border/40 rounded-[24px] overflow-hidden">
                            {editingPartnerId ? (
                                (() => {
                                    const item = partners.find(p => p.id === editingPartnerId);
                                    if (!item) return null;
                                    return (
                                        <div className="p-6 space-y-6">
                                            <div className="flex items-center justify-between pb-4 border-b border-border/40">
                                                <h2 className="text-xl font-bold">Edit Partner</h2>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label>Name</Label>
                                                    <Input value={item.name} onChange={(e) => updatePartner(item.id, { name: e.target.value })} className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Role</Label>
                                                    <Input value={item.role} onChange={(e) => updatePartner(item.id, { role: e.target.value })} className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Color Class</Label>
                                                    <Input value={item.color} onChange={(e) => updatePartner(item.id, { color: e.target.value })} placeholder="text-blue-500" className="rounded-xl font-mono text-sm" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Icon</Label>
                                                    <Select value={item.iconName} onValueChange={(val) => updatePartner(item.id, { iconName: val })}>
                                                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {iconOptions.map(opt => (
                                                                <SelectItem key={opt.value} value={opt.value}>
                                                                    <div className="flex items-center gap-2">
                                                                        <opt.icon className="w-4 h-4" />
                                                                        <span>{opt.label}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <Label>Description</Label>
                                                    <Textarea value={item.desc} onChange={(e) => updatePartner(item.id, { desc: e.target.value })} rows={3} className="rounded-xl" />
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <Label>Partner Logo (optional)</Label>
                                                    <MediaUpload label="Logo image" value={item.logoImage || ""} onChange={(url) => updatePartner(item.id, { logoImage: url })} type="image" aspectRatio="square" />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                                    <Handshake className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="font-medium">Select a partner to edit details</p>
                                </div>
                            )}
                        </Card>
                    </div>
                )}

                {activeTab === 'page' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-border/40 rounded-[24px] overflow-hidden">
                            <CardHeader className="border-b border-border/40 bg-muted/5">
                                <CardTitle className="font-black italic">Page Header</CardTitle>
                                <CardDescription>Main title and description.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Badge Text</Label>
                                    <Input value={content.header.badge} onChange={(e) => updateHeader({ badge: e.target.value })} className="rounded-xl" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title Prefix</Label>
                                        <Input value={content.header.titlePrefix} onChange={(e) => updateHeader({ titlePrefix: e.target.value })} className="rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Highlight</Label>
                                        <Input value={content.header.titleHighlight} onChange={(e) => updateHeader({ titleHighlight: e.target.value })} className="rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea value={content.header.description} onChange={(e) => updateHeader({ description: e.target.value })} rows={3} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Hero Video/Image (optional)</Label>
                                    <MediaUpload label="Header visual" value={content.header.videoUrl || ""} onChange={(url) => updateHeader({ videoUrl: url })} type="video" aspectRatio="video" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/40 rounded-[24px] overflow-hidden">
                            <CardHeader className="border-b border-border/40 bg-muted/5">
                                <CardTitle className="font-black italic">Bottom CTA</CardTitle>
                                <CardDescription>Call-to-action section.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={content.cta.title} onChange={(e) => updateCTA({ title: e.target.value })} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input value={content.cta.description} onChange={(e) => updateCTA({ description: e.target.value })} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Button Text</Label>
                                    <Input value={content.cta.buttonText} onChange={(e) => updateCTA({ buttonText: e.target.value })} className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Sub-Text</Label>
                                    <Input value={content.cta.subText} onChange={(e) => updateCTA({ subText: e.target.value })} className="rounded-xl" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-2 border-border/40 rounded-[24px] overflow-hidden">
                            <CardHeader className="border-b border-border/40 bg-muted/5">
                                <CardTitle className="font-black italic">Ecosystem Brands</CardTitle>
                                <CardDescription>Logotype names displayed in the ecosystem section.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <Label>Section Title</Label>
                                    <Input value={content.ecosystem.title} onChange={(e) => updateEcosystemTitle(e.target.value)} className="rounded-xl" />
                                </div>
                                <div className="space-y-4">
                                    <Label>Brands</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {content.ecosystem.brands.map(brand => (
                                            <div key={brand.id} className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-xl text-sm font-medium">
                                                {editingBrandId === brand.id ? (
                                                    <>
                                                        <Input 
                                                            value={editingBrandName} 
                                                            onChange={(e) => setEditingBrandName(e.target.value)} 
                                                            className="h-8 w-28 rounded-lg text-sm"
                                                            onKeyDown={(e) => { if (e.key === "Enter") saveEditBrand(); if (e.key === "Escape") cancelEditBrand(); }}
                                                        />
                                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-green-500 hover:bg-green-500/10" onClick={saveEditBrand}><Check className="w-3.5 h-3.5" /></Button>
                                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:bg-muted" onClick={cancelEditBrand}><X className="w-3.5 h-3.5" /></Button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>{brand.name}</span>
                                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => startEditBrand(brand)}><Pencil className="w-3 h-3" /></Button>
                                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => openConfirm("Delete brand", `Remove "${brand.name}"?`, () => { deleteBrand(brand.id); toast.success("Brand removed"); })}><Trash2 className="w-3 h-3" /></Button>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 max-w-sm">
                                        <Input placeholder="New Brand Name" value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddBrand()} className="rounded-xl" />
                                        <Button onClick={handleAddBrand} variant="secondary" className="rounded-xl" disabled={!newBrandName.trim()}>Add</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {/* Confirm dialog */}
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

            {/* Preview dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(245,158,11,0.2)]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5 bg-muted/30 p-1 rounded-xl">
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'desktop' ? "bg-background text-amber-500" : "text-muted-foreground/50")} onClick={() => setPreviewScale('desktop')}><Monitor size={16} /></Button>
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'mobile' ? "bg-background text-amber-500" : "text-muted-foreground/50")} onClick={() => setPreviewScale('mobile')}><Smartphone size={16} /></Button>
                                </div>
                                <CardTitle className="text-lg font-black italic">Partners Preview</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} className="rounded-full"><Plus className="w-6 h-6 rotate-45" /></Button>
                        </div>
                        <ScrollArea className="flex-1 p-12">
                            <div className={cn("mx-auto bg-background border border-border/40 overflow-hidden rounded-3xl", previewScale === 'desktop' ? "w-[90%] min-h-[800px]" : "w-[375px] min-h-[700px]")}>
                                <div className="p-8 md:p-12 space-y-12">
                                    <div className="text-center space-y-4">
                                        <Badge className="bg-amber-500/20 text-amber-500 border-none">{content.header.badge}</Badge>
                                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tight">
                                            {content.header.titlePrefix} <span className="text-amber-500">{content.header.titleHighlight}</span>
                                        </h1>
                                        <p className="text-muted-foreground max-w-2xl mx-auto">{content.header.description}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {content.partners.slice(0, 4).map(p => {
                                            const Icon = (LucideIcons as any)[p.iconName] || Handshake;
                                            return (
                                                <div key={p.id} className="p-6 rounded-2xl border border-border/40 bg-card/50 flex gap-4">
                                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", p.color?.replace?.("text-", "bg-") + "/20", p.color)}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-lg">{p.name}</div>
                                                        <div className="text-sm text-muted-foreground">{p.role}</div>
                                                        <p className="text-sm text-muted-foreground mt-2">{p.desc}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="text-center p-8 rounded-2xl bg-muted/30 border border-border/40">
                                        <h2 className="text-2xl font-bold mb-2">{content.cta.title}</h2>
                                        <p className="text-muted-foreground mb-4">{content.cta.description}</p>
                                        <Button className="rounded-xl">{content.cta.buttonText}</Button>
                                        <p className="text-xs text-muted-foreground mt-3">{content.cta.subText}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-muted-foreground mb-4">{content.ecosystem.title}</p>
                                        <div className="flex flex-wrap justify-center gap-3">
                                            {content.ecosystem.brands.map(b => (
                                                <Badge key={b.id} variant="outline" className="rounded-full px-4 py-1.5">{b.name}</Badge>
                                            ))}
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
