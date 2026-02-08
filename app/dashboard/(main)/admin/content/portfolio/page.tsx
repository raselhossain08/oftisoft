"use client";

import { useState, useEffect, useRef } from "react";
import { usePortfolioContentStore, type ProjectItem } from "@/lib/store/portfolio-content";
import { usePortfolioContent, useUpdatePortfolioContent } from "@/lib/api/portfolio-content-queries";
import { toast } from "sonner";
import { 
    Plus, 
    Save, 
    Trash2, 
    Briefcase,
    Globe,
    Smartphone,
    Brain,
    ShoppingCart,
    Building,
    ArrowLeft,
    Monitor,
    Smartphone as SmartphoneIcon,
    RefreshCcw,
    Sparkles,
    FileText,
    Image as ImageIcon
} from "lucide-react";
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

// Category options
const categories = [
    { value: "Web", label: "Web", icon: Globe },
    { value: "Mobile", label: "Mobile", icon: Smartphone },
    { value: "AI", label: "AI & ML", icon: Brain },
    { value: "Ecommerce", label: "E-commerce", icon: ShoppingCart },
    { value: "Enterprise", label: "Enterprise", icon: Building },
];

export default function PortfolioContentEditor() {
    const { 
        content, 
        setContent,
        updateHeader, 
        addProject, 
        updateProject, 
        deleteProject,
        resetToDefaults
    } = usePortfolioContentStore();

    const { data: apiContent } = usePortfolioContent();
    const updateMutation = useUpdatePortfolioContent();

    const [activeTab, setActiveTab] = useState('header');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
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

    if (!content) return <div className="p-20 text-center font-black animate-pulse text-muted-foreground uppercase tracking-widest">Initializing Portfolio Forge...</div>;

    const selectedProject = content.projects.find(p => p.id === selectedProjectId);

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
                                <CardTitle className="text-2xl font-black italic tracking-tight underline decoration-orange-500/30 underline-offset-4 text-white">Portfolio CMS</CardTitle>
                                <Badge variant="secondary" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-orange-500/10 text-orange-500 border-none">
                                    SHOWCASE_ACTIVE
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/50 mt-1 block uppercase tracking-[0.2em] font-black italic">
                                Case Studies & Project Showcase
                            </Label>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold border-border/50 hover:bg-muted/50 transition-colors" onClick={() => openConfirm("Reset to defaults", "Reset all portfolio content to defaults? This cannot be undone.", () => { resetToDefaults(); toast.success("Portfolio defaults restored"); })}>
                             <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold bg-orange-500/5 border-orange-500/20 text-orange-500 hover:bg-orange-500/10 transition-all" onClick={() => setPreviewOpen(true)}>
                            <Monitor className="w-4 h-4 mr-2" /> Live Preview
                        </Button>
                        <Button className="rounded-xl font-black italic bg-orange-500 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all px-8 h-11" onClick={handleSave} disabled={updateMutation.isPending}>
                            {updateMutation.isPending ? <RefreshCcw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} {updateMutation.isPending ? "Syncing…" : "Sync Showcase"}
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
                                { value: "projects", label: "Projects", icon: Briefcase },
                            ].map((tab) => (
                                <TabsTrigger 
                                    key={tab.value}
                                    value={tab.value} 
                                    className="relative z-10 rounded-[18px] h-13 gap-3 data-[state=active]:text-orange-500 transition-all duration-500 font-black italic px-8 group data-[state=active]:bg-background/90 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02] border border-transparent data-[state=active]:border-orange-500/10"
                                >
                                    <tab.icon className="w-4 h-4 transition-all duration-500 group-hover:scale-110 group-data-[state=active]:scale-110 group-data-[state=active]:animate-pulse" />
                                    <span className="relative">{tab.label}</span>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-orange-500/20 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-700 blur-[4px]" />
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    <div className="min-h-[600px]">
                        {/* HEADER TAB */}
                        <TabsContent value="header" className="m-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                    <CardTitle className="text-2xl font-black italic tracking-tight">Portfolio Hero Configuration</CardTitle>
                                    <p className="text-sm text-muted-foreground italic font-medium">Main header content and cinematic visual for the portfolio landing page.</p>
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
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Title</Label>
                                                <Input 
                                                    value={content.header.title} 
                                                    onChange={(e) => updateHeader({ title: e.target.value })}
                                                    className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl"
                                                />
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
                                                label="Portfolio Hero Visual (Cinematic Video/Image)" 
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

                        {/* PROJECTS TAB */}
                        <TabsContent value="projects" className="m-0 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="grid lg:grid-cols-12 gap-8">
                                {/* Project List Sidebar */}
                                <Card className="lg:col-span-4 border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-xl h-fit max-h-[800px] flex flex-col">
                                    <CardHeader className="p-8 border-b border-border/40 bg-muted/5 flex-shrink-0">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-black italic tracking-tight">Project Catalog</CardTitle>
                                            <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl border-orange-500/20 hover:bg-orange-500/10" onClick={() => {
                                                const newId = `proj-${Date.now()}`;
                                                addProject({
                                                    id: newId,
                                                    title: "New Project",
                                                    category: "Web",
                                                    image: null,
                                                    tags: ["New"],
                                                    description: "Project overview...",
                                                    longDescription: "Detailed case study description goes here...",
                                                    client: "Client Name",
                                                    stats: [{ label: "ROI", value: "100%" }],
                                                    gradient: "from-blue-500/20 to-purple-500/20"
                                                });
                                                setSelectedProjectId(newId);
                                                toast.success("Project forged");
                                            }}>
                                                <Plus className="w-5 h-5 text-orange-500" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <ScrollArea className="flex-1">
                                        <CardContent className="p-6 space-y-3">
                                            {content.projects.map(proj => (
                                                <div 
                                                    key={proj.id}
                                                    onClick={() => setSelectedProjectId(proj.id)}
                                                    className={cn(
                                                        "p-4 rounded-2xl border cursor-pointer hover:bg-muted/50 transition-all duration-300 flex items-center justify-between group",
                                                        selectedProjectId === proj.id ? "bg-orange-500/10 border-orange-500/30 shadow-lg shadow-orange-500/5" : "bg-card/50 border-border/40"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className="w-3 h-3 rounded-full shrink-0 bg-orange-500" />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-sm truncate">{proj.title}</div>
                                                            <div className="text-xs text-muted-foreground truncate">{proj.category}</div>
                                                        </div>
                                                    </div>
                                                    <Button 
                                                        size="icon" 
                                                        variant="ghost" 
                                                        className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 shrink-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openConfirm("Delete project", `Remove "${proj.title}"?`, () => { deleteProject(proj.id); if(selectedProjectId === proj.id) setSelectedProjectId(null); toast.success("Project deconstructed"); });
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </ScrollArea>
                                </Card>

                                {/* Project Editor */}
                                <div className="lg:col-span-8">
                                    {selectedProject ? (
                                        <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl">
                                            <CardHeader className="p-10 border-b border-border/40 bg-muted/5">
                                                <CardTitle className="text-2xl font-black italic tracking-tight">Edit Project: {selectedProject.title}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-10 space-y-10">
                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Project Title</Label>
                                                        <Input 
                                                            value={selectedProject.title} 
                                                            onChange={(e) => updateProject(selectedProject.id, { title: e.target.value })}
                                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-black italic text-xl"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Category</Label>
                                                        <Select 
                                                            value={selectedProject.category} 
                                                            onValueChange={(val) => updateProject(selectedProject.id, { category: val })}
                                                        >
                                                            <SelectTrigger className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl bg-background/95 p-2">
                                                                {categories.map(cat => (
                                                                    <SelectItem key={cat.value} value={cat.value} className="rounded-xl font-bold py-2.5">
                                                                        {cat.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <MediaUpload 
                                                        label="Project Showcase Image" 
                                                        value={selectedProject.image || ''} 
                                                        onChange={(url) => updateProject(selectedProject.id, { image: url })} 
                                                        type="image"
                                                        aspectRatio="video"
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="grid md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Client Name</Label>
                                                        <Input 
                                                            value={selectedProject.client} 
                                                            onChange={(e) => updateProject(selectedProject.id, { client: e.target.value })}
                                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-bold italic"
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Gradient Class</Label>
                                                        <Input 
                                                            value={selectedProject.gradient} 
                                                            onChange={(e) => updateProject(selectedProject.id, { gradient: e.target.value })}
                                                            className="rounded-2xl h-14 border-border/40 bg-muted/20 font-mono text-sm"
                                                            placeholder="from-blue-500/20 to-purple-500/20"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Short Description</Label>
                                                    <Textarea 
                                                        value={selectedProject.description} 
                                                        onChange={(e) => updateProject(selectedProject.id, { description: e.target.value })}
                                                        className="rounded-3xl border-border/40 bg-muted/20 font-bold italic p-8 min-h-[100px]"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Long Description (Case Study)</Label>
                                                    <Textarea 
                                                        value={selectedProject.longDescription} 
                                                        onChange={(e) => updateProject(selectedProject.id, { longDescription: e.target.value })}
                                                        className="rounded-3xl border-border/40 bg-muted/20 font-bold italic p-8 min-h-[180px]"
                                                    />
                                                </div>

                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground/60 italic tracking-widest ml-1">Tags (comma-separated)</Label>
                                                    <Input 
                                                        value={selectedProject.tags.join(", ")} 
                                                        onChange={(e) => updateProject(selectedProject.id, { tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                                                        className="rounded-2xl h-14 border-border/40 bg-muted/20 font-mono text-sm"
                                                    />
                                                </div>

                                                <Separator />

                                                <div className="space-y-6">
                                                    <Label className="text-sm font-black italic tracking-tight">Key Statistics</Label>
                                                    <div className="space-y-3">
                                                        {selectedProject.stats.map((stat, idx) => (
                                                            <div key={idx} className="flex gap-3">
                                                                <Input 
                                                                    value={stat.label} 
                                                                    onChange={(e) => {
                                                                        const newStats = [...selectedProject.stats];
                                                                        newStats[idx].label = e.target.value;
                                                                        updateProject(selectedProject.id, { stats: newStats });
                                                                    }}
                                                                    placeholder="Label"
                                                                    className="rounded-2xl h-12 border-border/40 bg-muted/10 font-bold italic"
                                                                />
                                                                <Input 
                                                                    value={stat.value}
                                                                    onChange={(e) => {
                                                                        const newStats = [...selectedProject.stats];
                                                                        newStats[idx].value = e.target.value;
                                                                        updateProject(selectedProject.id, { stats: newStats });
                                                                    }}
                                                                    placeholder="Value"
                                                                    className="rounded-2xl h-12 border-border/40 bg-muted/10 font-bold italic"
                                                                />
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="icon"
                                                                    className="h-12 w-12 rounded-xl text-red-500 hover:bg-red-500/10"
                                                                    onClick={() => {
                                                                        const newStats = selectedProject.stats.filter((_, i) => i !== idx);
                                                                        updateProject(selectedProject.id, { stats: newStats });
                                                                    }}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        <Button 
                                                            variant="outline" 
                                                            className="w-full rounded-2xl h-12 font-bold italic border-dashed border-2 hover:bg-orange-500/5 hover:border-orange-500/30"
                                                            onClick={() => updateProject(selectedProject.id, { stats: [...selectedProject.stats, { label: "Metric", value: "0%" }] })}
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" /> Add Stat
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="border-border/40 bg-card/50 backdrop-blur-xl rounded-[40px] overflow-hidden shadow-2xl h-[600px] flex items-center justify-center">
                                            <div className="text-center space-y-4 p-12">
                                                <div className="w-20 h-20 rounded-[30px] bg-orange-500/10 flex items-center justify-center mx-auto border border-orange-500/20">
                                                    <Briefcase className="w-10 h-10 text-orange-500/50" />
                                                </div>
                                                <h3 className="text-2xl font-black italic tracking-tight text-muted-foreground">Select a Project</h3>
                                                <p className="text-sm text-muted-foreground/60 italic">Choose a project to edit its details.</p>
                                            </div>
                                        </Card>
                                    )}
                                </div>
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

            {/* Portfolio Universe Simulator */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(249,115,22,0.3)]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-1.5 bg-muted/30 p-1 rounded-xl border border-border/30 shadow-inner">
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'desktop' ? "bg-background text-orange-500 shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('desktop')}>
                                        <Monitor size={16} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className={cn("h-10 w-10 rounded-lg", previewScale === 'mobile' ? "bg-background text-orange-500 shadow-lg" : "text-muted-foreground/50")} onClick={() => setPreviewScale('mobile')}>
                                        <SmartphoneIcon size={16} />
                                    </Button>
                                </div>
                                <Separator orientation="vertical" className="h-6" />
                                <div className="flex flex-col">
                                    <CardTitle className="text-lg font-black italic tracking-tight text-white">Portfolio Simulator</CardTitle>
                                    <span className="text-[9px] font-black uppercase text-orange-500/50 tracking-widest italic -mt-0.5">SHOWCASE_PREVIEW: v2.01</span>
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
                                {/* Simulated Portfolio Content */}
                                <div className="min-h-full pb-32">
                                    {/* Simulated Hero */}
                                    <div className="relative aspect-[21/9] overflow-hidden bg-black flex items-center justify-center">
                                        {content.header.videoUrl ? (
                                            <video src={content.header.videoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-950/20" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                        <div className="relative z-10 text-center space-y-6 px-6 max-w-4xl pt-20">
                                            <Badge className="bg-orange-500/20 text-orange-500 border-none px-4 py-1.5 rounded-full font-black italic tracking-[0.2em] text-[10px] uppercase shadow-xl animate-pulse">{content.header.badge.toUpperCase()}</Badge>
                                            <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter text-white drop-shadow-2xl">
                                                {content.header.title}.
                                            </h1>
                                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed italic font-medium">{content.header.description}</p>
                                        </div>
                                    </div>

                                    {/* Simulated Project Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-12 -mt-10 relative z-20">
                                        {content.projects.slice(0, 6).map(project => (
                                            <div key={project.id} className={cn("bg-card/70 backdrop-blur-3xl border border-border/40 rounded-[40px] shadow-2xl hover:translate-y-[-10px] transition-all duration-500 group overflow-hidden", `bg-gradient-to-br ${project.gradient}`)}>
                                                {project.image && (
                                                    <div className="aspect-video overflow-hidden">
                                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    </div>
                                                )}
                                                <div className="p-8 space-y-4">
                                                    <Badge className="bg-orange-500/20 text-orange-500 border-none px-3 py-1 rounded-full font-black italic text-[10px] uppercase">{project.category}</Badge>
                                                    <h3 className="text-2xl font-black italic tracking-tight text-white">{project.title}</h3>
                                                    <p className="text-sm text-muted-foreground leading-relaxed italic">{project.description}</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {project.tags.slice(0, 3).map((tag, idx) => (
                                                            <Badge key={idx} variant="outline" className="rounded-full text-xs font-bold">{tag}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
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
