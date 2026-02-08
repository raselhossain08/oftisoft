"use client";

import { useState, useEffect, useRef } from "react";
import { useIntegrationsContentStore, type IntegrationItem } from "@/lib/store/integrations-content";
import { useIntegrationsContent, useUpdateIntegrationsContent } from "@/lib/api/integrations-content-queries";
import { toast } from "sonner";
import { 
    Plus, 
    Save, 
    Trash2, 
    LayoutTemplate, 
    Globe, 
    Share2, 
    Code2, 
    Zap, 
    Github,
    Slack,
    Terminal,
    Bot,
    Smartphone,
    Database,
    Cloud,
    Server,
    ArrowLeft,
    Monitor,
    Smartphone as SmartphoneIcon,
    RefreshCcw
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
import { cn } from "@/lib/utils";
import Link from "next/link";

const iconOptions = [
  { value: "Github", label: "Github", icon: Github },
  { value: "Slack", label: "Slack", icon: Slack },
  { value: "Bot", label: "Bot", icon: Bot },
  { value: "Smartphone", label: "Mobile", icon: Smartphone },
  { value: "Globe", label: "Globe", icon: Globe },
  { value: "Share2", label: "Share", icon: Share2 },
  { value: "Code2", label: "Code", icon: Code2 },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Terminal", label: "Terminal", icon: Terminal },
  { value: "Database", label: "Database", icon: Database },
  { value: "Cloud", label: "Cloud", icon: Cloud },
  { value: "Server", label: "Server", icon: Server },
];

const statusOptions = ["Active", "Beta", "Live", "Planned"] as const;

export default function IntegrationsContentEditor() {
    const { 
        content, 
        setContent,
        updateHeader, 
        updateCTA,
        addIntegration, 
        updateIntegration, 
        deleteIntegration,
        resetToDefaults
    } = useIntegrationsContentStore();

    const { data: apiContent } = useIntegrationsContent();
    const updateMutation = useUpdateIntegrationsContent();

    const [activeTab, setActiveTab] = useState<'items' | 'page'>('items');
    const [editingIntId, setEditingIntId] = useState<string | null>(null);
    const [isCreateIntOpen, setIsCreateIntOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewScale, setPreviewScale] = useState<'desktop' | 'mobile'>('desktop');
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });
    const hasHydrated = useRef(false);

    const [intForm, setIntForm] = useState<Partial<IntegrationItem>>({
        name: "",
        description: "",
        iconName: "Zap",
        status: "Active",
        order: 1
    });

    useEffect(() => {
        if (apiContent && !hasHydrated.current) {
            setContent(apiContent);
            hasHydrated.current = true;
        }
    }, [apiContent, setContent]);

    if (!content) return <div className="p-20 text-center font-black animate-pulse text-muted-foreground uppercase tracking-widest">Initializing Integrations Forge...</div>;

    const integrations = content.integrations || [];

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

    const handleCreateIntegration = () => {
        const newId = `int-${Date.now()}`;
        addIntegration({
            id: newId,
            name: intForm.name || "New Integration",
            description: intForm.description || "Description...",
            iconName: intForm.iconName || "Zap",
            status: intForm.status || "Active",
            order: integrations.length + 1
        });
        toast.success("Integration added");
        setIsCreateIntOpen(false);
        setEditingIntId(newId);
        setIntForm({ name: "", description: "", iconName: "Zap", status: "Active", order: 1 });
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
                                <CardTitle className="text-2xl font-black italic tracking-tight underline decoration-violet-500/30 underline-offset-4 text-white">Integrations CMS</CardTitle>
                                <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-violet-500/10 text-violet-500 border-none">
                                    HUB_ACTIVE
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                                Integration Partners & Page Text
                            </Label>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold border-border/50 hover:bg-muted/50 transition-colors" onClick={() => openConfirm("Reset to defaults", "Reset all integrations content to defaults? This cannot be undone.", () => { resetToDefaults(); toast.success("Integrations defaults restored"); })}>
                            <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold bg-violet-500/5 border-violet-500/20 text-violet-500 hover:bg-violet-500/10 transition-all" onClick={() => setPreviewOpen(true)}>
                            <Monitor className="w-4 h-4 mr-2" /> Live Preview
                        </Button>
                        <Button className="rounded-xl font-black italic bg-violet-500 text-white shadow-xl shadow-violet-500/20 hover:scale-[1.02] active:scale-95 transition-all px-8 h-11" onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} {updateMutation.isPending ? "Syncing…" : "Sync Hub"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 space-y-6">
                <div className="flex gap-2">
                    <Button variant={activeTab === 'items' ? "default" : "outline"} onClick={() => setActiveTab('items')} className="rounded-xl">
                        <Share2 className="w-4 h-4 mr-2" /> Integrations
                    </Button>
                    <Button variant={activeTab === 'page' ? "default" : "outline"} onClick={() => setActiveTab('page')} className="rounded-xl">
                        <LayoutTemplate className="w-4 h-4 mr-2" /> Page Content
                    </Button>
                </div>

                {activeTab === 'items' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Card className="lg:col-span-1 h-fit border-border/40 rounded-[24px] overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/5">
                                <CardTitle className="font-black italic">Integration List</CardTitle>
                                <Dialog open={isCreateIntOpen} onOpenChange={setIsCreateIntOpen}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" className="rounded-xl bg-violet-500/20 text-violet-500 hover:bg-violet-500/30 border-0"><Plus className="w-4 h-4 mr-2" /> Add Integration</Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-2xl">
                                        <DialogHeader>
                                            <DialogTitle>New Integration</DialogTitle>
                                            <DialogDescription>Add an integration partner to the list.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input value={intForm.name} onChange={(e) => setIntForm({...intForm, name: e.target.value})} placeholder="e.g. Stripe" className="rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Description</Label>
                                                <Input value={intForm.description} onChange={(e) => setIntForm({...intForm, description: e.target.value})} placeholder="Brief description..." className="rounded-xl" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Icon</Label>
                                                <Select value={intForm.iconName} onValueChange={(val) => setIntForm({...intForm, iconName: val})}>
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
                                            <div className="space-y-2">
                                                <Label>Status</Label>
                                                <Select value={intForm.status} onValueChange={(val) => setIntForm({...intForm, status: val})}>
                                                    <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select status" /></SelectTrigger>
                                                    <SelectContent>
                                                        {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button onClick={handleCreateIntegration} className="rounded-xl">Add Integration</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-4 space-y-2">
                                {integrations.map((item) => (
                                    <div 
                                        key={item.id} 
                                        className={cn(
                                            "p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group",
                                            editingIntId === item.id ? "bg-violet-500/10 border-violet-500/30" : "bg-card/50 border-border/40"
                                        )}
                                        onClick={() => setEditingIntId(item.id)}
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-2 h-2 rounded-full shrink-0 bg-violet-500" />
                                            <div className="min-w-0">
                                                <div className="font-bold text-sm truncate">{item.name}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{item.description}</div>
                                            </div>
                                        </div>
                                        <Button 
                                            size="icon" 
                                            variant="ghost" 
                                            className="opacity-0 group-hover:opacity-100 h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
                                            onClick={(e) => { e.stopPropagation(); openConfirm("Delete integration", `Remove "${item.name}"?`, () => { deleteIntegration(item.id); if (editingIntId === item.id) setEditingIntId(null); toast.success("Integration deleted"); }); }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2 border-border/40 rounded-[24px] overflow-hidden">
                            {editingIntId ? (
                                (() => {
                                    const item = integrations.find(i => i.id === editingIntId);
                                    if (!item) return null;
                                    return (
                                        <div className="p-6 space-y-6">
                                            <div className="pb-4 border-b border-border/40">
                                                <h2 className="text-xl font-bold">Edit Integration</h2>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label>Name</Label>
                                                    <Input value={item.name} onChange={(e) => updateIntegration(item.id, { name: e.target.value })} className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Status</Label>
                                                    <Select value={item.status} onValueChange={(val) => updateIntegration(item.id, { status: val })}>
                                                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="col-span-2 space-y-2">
                                                    <Label>Description</Label>
                                                    <Textarea value={item.description} onChange={(e) => updateIntegration(item.id, { description: e.target.value })} rows={3} className="rounded-xl" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Icon</Label>
                                                    <Select value={item.iconName} onValueChange={(val) => updateIntegration(item.id, { iconName: val })}>
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
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px]">
                                    <Share2 className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="font-medium">Select an integration to edit details</p>
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
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(139,92,246,0.2)]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5 bg-muted/30 p-1 rounded-xl">
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'desktop' ? "bg-background text-violet-500" : "text-muted-foreground/50")} onClick={() => setPreviewScale('desktop')}><Monitor size={16} /></Button>
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'mobile' ? "bg-background text-violet-500" : "text-muted-foreground/50")} onClick={() => setPreviewScale('mobile')}><SmartphoneIcon size={16} /></Button>
                                </div>
                                <CardTitle className="text-lg font-black italic">Integrations Preview</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} className="rounded-full"><Plus className="w-6 h-6 rotate-45" /></Button>
                        </div>
                        <ScrollArea className="flex-1 p-12">
                            <div className={cn("mx-auto bg-background border border-border/40 overflow-hidden rounded-3xl", previewScale === 'desktop' ? "w-[90%] min-h-[800px]" : "w-[375px] min-h-[700px]")}>
                                <div className="p-8 md:p-12 space-y-12">
                                    <div className="text-center space-y-4">
                                        <Badge className="bg-violet-500/20 text-violet-500 border-none">{content.header.badge}</Badge>
                                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tight">
                                            {content.header.titlePrefix} <span className="text-violet-500">{content.header.titleHighlight}</span>
                                        </h1>
                                        <p className="text-muted-foreground max-w-2xl mx-auto">{content.header.description}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {content.integrations.slice(0, 4).map(int => {
                                            const Icon = (LucideIcons as any)[int.iconName] || Zap;
                                            return (
                                                <div key={int.id} className="p-6 rounded-2xl border border-border/40 bg-card/50 flex gap-4">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-violet-500/20 text-violet-500">
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-lg flex items-center gap-2">
                                                            {int.name}
                                                            <Badge variant="secondary" className="text-[10px] rounded-full">{int.status}</Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">{int.description}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="text-center p-8 rounded-2xl bg-muted/30 border border-border/40">
                                        <h2 className="text-2xl font-bold mb-2">{content.cta.title}</h2>
                                        <p className="text-muted-foreground mb-4">{content.cta.description}</p>
                                        <Button className="rounded-xl bg-violet-500 hover:bg-violet-600">{content.cta.buttonText}</Button>
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
