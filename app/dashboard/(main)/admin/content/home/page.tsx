"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
    ArrowLeft, 
    Save, 
    Globe, 
    Settings, 
    Zap, 
    Layout, 
    Sparkles, 
    Type, 
    MessageSquare, 
    Code, 
    Phone, 
    RefreshCcw, 
    Eye, 
    History,
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    User,
    Image as ImageIcon,
    Video as VideoIcon,
    FileIcon,
    Loader2,
    X,
    Upload,
    Smartphone,
    Cpu,
    Cloud,
    Rocket,
    Search,
    PenTool,
    CheckCircle2,
    BarChart3,
    Box,
    Terminal,
    Database,
    Layers,
    Shield
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useHomeContentStore } from "@/lib/store/home-content";
import { useHomeContent, useUpdateHomeContent, usePublishHomeContent, useUploadImage, useUploadVideo } from "@/lib/api/home-queries";

/**
 * Media Upload Component with Progress Preview Dialog
 */
function MediaUpload({ 
    value, 
    onChange, 
    type = 'image', 
    label 
}: { 
    value: string; 
    onChange: (url: string) => void; 
    type?: 'image' | 'video';
    label: string;
}) {
    const uploadImage = useUploadImage();
    const uploadVideo = useUploadVideo();
    const [progress, setProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setShowProgress(true);
        try {
            if (type === 'image') {
                const res = await uploadImage.mutateAsync(file);
                onChange(res.url);
            } else {
                const res = await uploadVideo.mutateAsync({ 
                    file, 
                    onProgress: (p) => setProgress(p) 
                });
                onChange(res.url);
            }
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setTimeout(() => {
                setShowProgress(false);
                setProgress(0);
            }, 500);
        }
    };

    const isUploading = type === 'image' ? uploadImage.isPending : uploadVideo.isPending;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{label}</Label>
                {value && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onChange('')}
                        className="h-6 px-2 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                    >
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                    </Button>
                )}
            </div>
            
            <div className="grid gap-4">
                {value ? (
                    <div className="relative group rounded-3xl overflow-hidden border border-border/50 aspect-video bg-muted/20">
                        {type === 'image' ? (
                            <img src={value} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <video src={value} className="w-full h-full object-cover" controls />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm">
                            <Button size="sm" variant="secondary" onClick={() => document.getElementById(`file-upload-${label}`)?.click()} className="rounded-2xl font-bold bg-white text-black hover:bg-white/90">
                                <RefreshCcw className="w-4 h-4 mr-2" /> Replace
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Button 
                        variant="outline" 
                        className="h-32 border-dashed border-2 rounded-[32px] flex flex-col gap-3 hover:bg-primary/5 hover:border-primary/50 transition-all duration-500 bg-muted/10 group"
                        onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
                        disabled={isUploading}
                    >
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            {type === 'image' ? <ImageIcon className="w-6 h-6 text-primary" /> : <VideoIcon className="w-6 h-6 text-primary" />}
                        </div>
                        <div className="text-center">
                            <span className="text-xs font-bold block">Upload {type === 'image' ? 'Image' : 'Video'}</span>
                            <span className="text-[10px] text-muted-foreground">Click to browse or drag & drop</span>
                        </div>
                    </Button>
                )}
            </div>

            <input 
                id={`file-upload-${label}`}
                type="file" 
                className="hidden" 
                accept={type === 'image' ? "image/*" : "video/*"}
                onChange={handleFileChange}
            />

            <Dialog open={showProgress} onOpenChange={setShowProgress}>
                <DialogContent className="sm:max-w-md rounded-[32px] border-none bg-background/80 backdrop-blur-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black italic">Uploading {type}...</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Processing your premium content. Almost there.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-8 space-y-6">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                {progress < 100 ? 'Transferring Data' : 'Finalizing'}
                            </span>
                            <span className="text-primary">{Math.round(progress)}%</span>
                        </div>
                        <div className="relative">
                            <Progress value={progress} className="h-3 rounded-full bg-primary/10" />
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 animate-pulse" />
                        </div>
                        
                        {/* Instant Preview in Dialog if available */}
                        {value && (
                             <div className="rounded-2xl overflow-hidden border border-border/50 aspect-video opacity-50">
                                {type === 'image' ? <img src={value} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-muted flex items-center justify-center"><VideoIcon className="w-8 h-8" /></div>}
                             </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function HomeContentEditor() {
    const router = useRouter();
    const { content, setContent, updateSection, toggleSection, updateSEO, setStatus, isSaving, reset } = useHomeContentStore();
    const { data: apiContent } = useHomeContent();
    const updateMutation = useUpdateHomeContent();
    const publishMutation = usePublishHomeContent();
    const [activeSection, setActiveSection] = useState('hero');
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });
    const hasHydrated = useRef(false);

    useEffect(() => {
        if (apiContent && !hasHydrated.current) {
            setContent(apiContent);
            hasHydrated.current = true;
        }
    }, [apiContent, setContent]);

    const handleSave = async () => {
        if (!content) return;
        await updateMutation.mutateAsync(content);
    };

    const handlePublish = async () => {
        await publishMutation.mutateAsync();
        setStatus('published');
    };

    const openConfirm = (title: string, description: string, onConfirm: () => void) => {
        setConfirmDialog({ open: true, title, description, onConfirm });
    };
    const closeConfirm = () => setConfirmDialog(prev => ({ ...prev, open: false }));
    const handleConfirm = () => {
        confirmDialog.onConfirm();
        closeConfirm();
    };

    if (!content) return <div className="flex items-center justify-center min-h-screen"><RefreshCcw className="w-12 h-12 animate-spin" /></div>;

    const sections = [
        { id: 'hero', label: 'Hero', icon: Zap, enabled: content.hero.enabled },
        { id: 'services', label: 'Services', icon: Layout, enabled: content.services.enabled },
        { id: 'projects', label: 'Projects', icon: Sparkles, enabled: content.projects.enabled },
        { id: 'whyus', label: 'Why Us', icon: Type, enabled: content.whyUs.enabled },
        { id: 'process', label: 'Process', icon: Code, enabled: content.process.enabled },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, enabled: content.testimonials.enabled },
        { id: 'techstack', label: 'Tech Stack', icon: Code, enabled: content.techStack.enabled },
        { id: 'blog', label: 'Blog', icon: Type, enabled: content.blog.enabled },
        { id: 'cta', label: 'CTA', icon: Phone, enabled: content.cta.enabled },
        { id: 'seo', label: 'SEO', icon: Settings, enabled: true },
    ];

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
                            <h1 className="text-2xl font-black italic">Home Page Editor</h1>
                            <p className="text-xs text-muted-foreground mt-1">Last updated: {new Date(content.lastUpdated).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => openConfirm("Reset to defaults", "Reset all home page content to defaults? This cannot be undone.", () => { reset(); toast.success("Home content reset to defaults"); })} className="rounded-2xl gap-2 h-10 px-4 border-border/50 hover:bg-muted/50">
                            <RefreshCcw className="w-4 h-4" /> Reset
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="rounded-2xl gap-2 h-10 px-4 hover:bg-primary/5 hover:text-primary transition-all">
                                    <Eye className="w-4 h-4" /> Preview
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] p-0 overflow-hidden border-none rounded-[40px] bg-background/50 backdrop-blur-3xl shadow-2xl">
                                <div className="w-full h-full flex flex-col">
                                    <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/80 backdrop-blur-xl">
                                        <div className="flex items-center gap-6">
                                            <div className="flex gap-2">
                                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                                <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                                                <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                                            </div>
                                            <div className="flex items-center gap-3 px-4 py-2 bg-muted/30 rounded-full border border-border/50">
                                                <Globe className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-[10px] font-mono text-muted-foreground tracking-tight">oftisoft.ai/home/draft-preview</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" asChild className="rounded-xl gap-2 h-9 px-4 border-primary/20 hover:bg-primary/5">
                                                <Link href="/" target="_blank"><Globe className="w-4 h-4 text-primary" /> Open Live Tab </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={() => (document.getElementById('preview-iframe') as HTMLIFrameElement)?.contentWindow?.location.reload()}>
                                                <RefreshCcw className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex-1 bg-background relative overflow-hidden">
                                        <iframe 
                                            id="preview-iframe"
                                            src="/" 
                                            className="w-full h-full border-none"
                                            title="Home Preview"
                                        />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        {(isSaving || updateMutation.isPending) && <span className="text-xs text-muted-foreground mr-2 font-medium animate-pulse">Saving...</span>}
                        <Button variant="outline" onClick={handleSave} disabled={updateMutation.isPending} className="rounded-2xl gap-2 h-10 px-6 border-primary/20 hover:bg-primary/5 transition-all">
                            {updateMutation.isPending ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
                        </Button>
                        <Button onClick={handlePublish} disabled={publishMutation.isPending} className="rounded-2xl gap-2 h-10 px-8 bg-primary text-white hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all font-bold">
                            {publishMutation.isPending ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />} Publish
                        </Button>
                    </div>
                </div>
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

            <div className="container mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-3">
                    <Card className="sticky top-24 rounded-[32px]">
                        <CardHeader className="p-6"><CardTitle className="text-sm font-black uppercase">Sections</CardTitle></CardHeader>
                        <ScrollArea className="h-[calc(100vh-200px)]">
                            <CardContent className="p-4 space-y-2">
                                {sections.map((section) => (
                                    <Button key={section.id} variant={activeSection === section.id ? 'secondary' : 'ghost'} 
                                        className={cn("w-full justify-start gap-3 h-12 rounded-2xl", activeSection === section.id && "bg-primary/10 text-primary")}
                                        onClick={() => setActiveSection(section.id)}>
                                        <section.icon className="w-4 h-4" />{section.label}
                                        {section.id !== 'seo' && <Switch checked={section.enabled} onClick={(e) => { e.stopPropagation(); toggleSection(section.id as any); }} className="ml-auto" />}
                                    </Button>
                                ))}
                            </CardContent>
                        </ScrollArea>
                    </Card>
                </div>

                {/* Editor */}
                <div className="lg:col-span-9 space-y-6">
                    {activeSection === 'hero' && (
                        <Card className="rounded-[40px]">
                            <CardHeader className="p-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black">Hero Section</CardTitle>
                                        <CardDescription>Hero content and main call to action</CardDescription>
                                    </div>
                                    <Button variant="outline" onClick={() => {
                                        const newStat = { value: 99, suffix: "+", label: "Happy Clients" };
                                        updateSection('hero', { stats: [...(content.hero.stats || []), newStat] });
                                    }} className="rounded-2xl gap-2 font-bold">
                                        <Plus className="w-4 h-4" /> Add Hero Stat
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2"><Label>Badge</Label><Input value={content.hero.badge} onChange={(e) => updateSection('hero', { badge: e.target.value })} className="h-12 rounded-2xl" placeholder="Innovation First" /></div>
                                    <div className="space-y-2"><Label>Title</Label><Input value={content.hero.title} onChange={(e) => updateSection('hero', { title: e.target.value })} className="h-12 rounded-2xl" placeholder="We Build Software" /></div>
                                    <div className="col-span-2 space-y-2"><Label>Subtitle</Label><Input value={content.hero.subtitle} onChange={(e) => updateSection('hero', { subtitle: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea value={content.hero.description} onChange={(e) => updateSection('hero', { description: e.target.value })} className="rounded-2xl min-h-[100px]" /></div>
                                </div>

                                <Separator />

                                <div className="grid md:grid-cols-2 gap-8">
                                    <MediaUpload 
                                        label="Background Image" 
                                        value={content.hero.backgroundImage || ''} 
                                        onChange={(url) => updateSection('hero', { backgroundImage: url })} 
                                        type="image"
                                    />
                                    <MediaUpload 
                                        label="Background Video" 
                                        value={content.hero.backgroundVideo || ''} 
                                        onChange={(url) => updateSection('hero', { backgroundVideo: url })} 
                                        type="video"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4 p-6 bg-muted/20 rounded-3xl border border-border/50">
                                        <Label className="text-lg font-bold">Primary Action</Label>
                                        <div className="space-y-4">
                                            <div className="space-y-2"><Label>Text</Label><Input value={content.hero.primaryCTA.text} onChange={(e) => updateSection('hero', { primaryCTA: { ...content.hero.primaryCTA, text: e.target.value } })} className="h-11 rounded-xl" /></div>
                                            <div className="space-y-2"><Label>Link</Label><Input value={content.hero.primaryCTA.link} onChange={(e) => updateSection('hero', { primaryCTA: { ...content.hero.primaryCTA, link: e.target.value } })} className="h-11 rounded-xl" /></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 p-6 bg-muted/20 rounded-3xl border border-border/50">
                                        <Label className="text-lg font-bold">Secondary Action</Label>
                                        <div className="space-y-4">
                                            <div className="space-y-2"><Label>Text</Label><Input value={content.hero.secondaryCTA.text} onChange={(e) => updateSection('hero', { secondaryCTA: { ...content.hero.secondaryCTA, text: e.target.value } })} className="h-11 rounded-xl" /></div>
                                            <div className="space-y-2"><Label>Link</Label><Input value={content.hero.secondaryCTA.link} onChange={(e) => updateSection('hero', { secondaryCTA: { ...content.hero.secondaryCTA, link: e.target.value } })} className="h-11 rounded-xl" /></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <Label className="text-lg font-bold">Hero Statistics</Label>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {content.hero.stats?.map((stat: any, index: number) => (
                                            <div key={index} className="flex gap-3 bg-muted/30 p-4 rounded-2xl border border-border/50 items-end">
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Value</Label>
                                                    <Input type="number" value={stat.value} onChange={(e) => {
                                                        const newStats = [...(content.hero.stats || [])];
                                                        newStats[index] = { ...newStats[index], value: parseInt(e.target.value) || 0 };
                                                        updateSection('hero', { stats: newStats });
                                                    }} className="bg-background border-none h-9 rounded-xl font-bold" />
                                                </div>
                                                <div className="w-16 space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Suffix</Label>
                                                    <Input value={stat.suffix} onChange={(e) => {
                                                        const newStats = [...(content.hero.stats || [])];
                                                        newStats[index] = { ...newStats[index], suffix: e.target.value };
                                                        updateSection('hero', { stats: newStats });
                                                    }} className="bg-background border-none h-9 rounded-xl" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label</Label>
                                                    <Input value={stat.label} onChange={(e) => {
                                                        const newStats = [...(content.hero.stats || [])];
                                                        newStats[index] = { ...newStats[index], label: e.target.value };
                                                        updateSection('hero', { stats: newStats });
                                                    }} className="bg-background border-none h-9 rounded-xl text-xs" />
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => {
                                                    const newStats = content.hero.stats?.filter((_: any, i: number) => i !== index);
                                                    updateSection('hero', { stats: newStats });
                                                }} className="h-9 w-9 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'services' && (
                        <Card className="rounded-[40px]">
                            <CardHeader className="p-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black">Services Section</CardTitle>
                                        <CardDescription>Manage your service offerings</CardDescription>
                                    </div>
                                    <Button onClick={() => {
                                        const newService = {
                                            id: `svc-${Date.now()}`,
                                            title: "New Service",
                                            description: "Service description",
                                            icon: "Globe",
                                            tags: ["Web"],
                                            gradient: "from-blue-500 to-cyan-500"
                                        };
                                        updateSection('services', { services: [...(content.services.services || []), newService] });
                                    }} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" /> Add Service
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2"><Label>Badge</Label><Input value={content.services.badge} onChange={(e) => updateSection('services', { badge: e.target.value })} className="h-12 rounded-2xl" placeholder="Capabilities" /></div>
                                    <div className="space-y-2"><Label>Title</Label><Input value={content.services.title} onChange={(e) => updateSection('services', { title: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div className="space-y-2"><Label>Subtitle</Label><Input value={content.services.subtitle} onChange={(e) => updateSection('services', { subtitle: e.target.value })} className="h-12 rounded-2xl" /></div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-lg font-bold">Services List</Label>
                                    <div className="grid gap-4">
                                        {content.services.services?.map((service, index) => (
                                            <div key={service.id} className="group relative bg-muted/30 p-6 rounded-[24px] border border-border/50 hover:border-primary/50 transition-all">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex flex-1 gap-6">
                                                        <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-lg p-3", service.gradient)}>
                                                            {service.icon.startsWith('http') ? (
                                                                <img src={service.icon} alt={service.title} className="w-full h-full object-contain filter invert brightness-0" />
                                                            ) : (() => {
                                                                const Icon = service.icon === 'Globe' ? Globe : service.icon === 'Smartphone' ? Smartphone : service.icon === 'Cpu' ? Cpu : service.icon === 'Cloud' ? Cloud : Layout;
                                                                return <Icon className="w-7 h-7" />;
                                                            })()}
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Service Name</Label>
                                                                    <Input value={service.title} onChange={(e) => {
                                                                        const newServices = [...content.services.services];
                                                                        newServices[index] = { ...newServices[index], title: e.target.value };
                                                                        updateSection('services', { services: newServices });
                                                                    }} className="bg-background border-none h-11 rounded-xl font-bold" />
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Select Icon</Label>
                                                                        <Select value={service.icon} onValueChange={(val) => {
                                                                            const newServices = [...content.services.services];
                                                                            newServices[index] = { ...newServices[index], icon: val };
                                                                            updateSection('services', { services: newServices });
                                                                        }}>
                                                                            <SelectTrigger className="bg-background border-none h-11 rounded-xl">
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="Globe">Globe</SelectItem>
                                                                                <SelectItem value="Smartphone">Mobile</SelectItem>
                                                                                <SelectItem value="Cpu">AI/CPU</SelectItem>
                                                                                <SelectItem value="Cloud">Cloud</SelectItem>
                                                                                <SelectItem value="Layout">Frontend</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <MediaUpload 
                                                                        label="OR Upload Custom Icon" 
                                                                        value={service.icon.startsWith('http') ? service.icon : ''} 
                                                                        onChange={(url) => {
                                                                            const newServices = [...content.services.services];
                                                                            newServices[index] = { ...newServices[index], icon: url || 'Globe' };
                                                                            updateSection('services', { services: newServices });
                                                                        }} 
                                                                        type="image"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Description</Label>
                                                                <Textarea value={service.description} onChange={(e) => {
                                                                    const newServices = [...content.services.services];
                                                                    newServices[index] = { ...newServices[index], description: e.target.value };
                                                                    updateSection('services', { services: newServices });
                                                                }} className="bg-background border-none rounded-xl min-h-[80px]" />
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-1 space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tags (Comma separated)</Label>
                                                                    <Input value={service.tags.join(', ')} onChange={(e) => {
                                                                        const newServices = [...content.services.services];
                                                                        newServices[index] = { ...newServices[index], tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) };
                                                                        updateSection('services', { services: newServices });
                                                                    }} className="bg-background border-none h-9 rounded-lg text-sm" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Gradient</Label>
                                                                    <Input value={service.gradient} onChange={(e) => {
                                                                        const newServices = [...content.services.services];
                                                                        newServices[index] = { ...newServices[index], gradient: e.target.value };
                                                                        updateSection('services', { services: newServices });
                                                                    }} className="bg-background border-none h-9 rounded-lg text-sm w-40" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            const newServices = [...content.services.services];
                                                            newServices.splice(index, 1);
                                                            updateSection('services', { services: newServices });
                                                        }} className="text-destructive hover:bg-destructive/10 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === 0} onClick={() => {
                                                            const newServices = [...content.services.services];
                                                            [newServices[index-1], newServices[index]] = [newServices[index], newServices[index-1]];
                                                            updateSection('services', { services: newServices });
                                                        }}><ChevronUp className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === (content.services.services?.length ?? 0) - 1} onClick={() => {
                                                            const newServices = [...content.services.services];
                                                            [newServices[index], newServices[index+1]] = [newServices[index+1], newServices[index]];
                                                            updateSection('services', { services: newServices });
                                                        }}><ChevronDown className="w-4 h-4" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'projects' && (
                        <Card className="rounded-[40px]">
                            <CardHeader className="p-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black">Featured Projects</CardTitle>
                                        <CardDescription>Showcase your best work</CardDescription>
                                    </div>
                                    <Button onClick={() => {
                                        const newProject = {
                                            id: `proj-${Date.now()}`,
                                            title: "New Project",
                                            description: "Short project description",
                                            category: "Development",
                                            imageGradient: "from-blue-600 to-indigo-600",
                                            tech: ["Next.js"],
                                            stats: [{ label: "Impact", value: "100%" }],
                                            year: new Date().getFullYear().toString()
                                        };
                                        updateSection('projects', { projects: [...(content.projects.projects || []), newProject] });
                                    }} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" /> Add Project
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2"><Label>Badge</Label><Input value={content.projects.badge} onChange={(e) => updateSection('projects', { badge: e.target.value })} className="h-12 rounded-2xl" placeholder="Selected Work" /></div>
                                    <div className="space-y-2"><Label>Title</Label><Input value={content.projects.title} onChange={(e) => updateSection('projects', { title: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div className="space-y-2"><Label>Subtitle</Label><Input value={content.projects.subtitle} onChange={(e) => updateSection('projects', { subtitle: e.target.value })} className="h-12 rounded-2xl" /></div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-lg font-bold">Projects List</Label>
                                    <div className="grid gap-4">
                                        {content.projects.projects?.map((project, index) => (
                                            <div key={project.id} className="group relative bg-muted/30 p-6 rounded-[24px] border border-border/50 hover:border-primary/50 transition-all">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex flex-1 gap-6">
                                                        <div className={cn("w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-lg", project.imageGradient)}>
                                                            <Sparkles className="w-10 h-10 opacity-50" />
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="grid md:grid-cols-3 gap-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Title</Label>
                                                                    <Input value={project.title} onChange={(e) => {
                                                                        const newProjects = [...content.projects.projects];
                                                                        newProjects[index] = { ...newProjects[index], title: e.target.value };
                                                                        updateSection('projects', { projects: newProjects });
                                                                    }} className="bg-background border-none h-10 rounded-xl font-bold" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Category</Label>
                                                                    <Input value={project.category} onChange={(e) => {
                                                                        const newProjects = [...content.projects.projects];
                                                                        newProjects[index] = { ...newProjects[index], category: e.target.value };
                                                                        updateSection('projects', { projects: newProjects });
                                                                    }} className="bg-background border-none h-10 rounded-xl" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Year</Label>
                                                                    <Input value={project.year} onChange={(e) => {
                                                                        const newProjects = [...content.projects.projects];
                                                                        newProjects[index] = { ...newProjects[index], year: e.target.value };
                                                                        updateSection('projects', { projects: newProjects });
                                                                    }} className="bg-background border-none h-10 rounded-xl" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Description</Label>
                                                                <Input value={project.description} onChange={(e) => {
                                                                    const newProjects = [...content.projects.projects];
                                                                    newProjects[index] = { ...newProjects[index], description: e.target.value };
                                                                    updateSection('projects', { projects: newProjects });
                                                                }} className="bg-background border-none h-10 rounded-xl" />
                                                            </div>
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Tech Stack (Comma list)</Label>
                                                                    <Input value={project.tech.join(', ')} onChange={(e) => {
                                                                        const newProjects = [...content.projects.projects];
                                                                        newProjects[index] = { ...newProjects[index], tech: e.target.value.split(',').map(t => t.trim()).filter(Boolean) };
                                                                        updateSection('projects', { projects: newProjects });
                                                                    }} className="bg-background border-none h-10 rounded-xl text-sm" />
                                                                </div>
                                                                <div className="space-y-4">
                                                                    <div className="space-y-1">
                                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Gradient / Theme</Label>
                                                                        <Input value={project.imageGradient} onChange={(e) => {
                                                                            const newProjects = [...content.projects.projects];
                                                                            newProjects[index] = { ...newProjects[index], imageGradient: e.target.value };
                                                                            updateSection('projects', { projects: newProjects });
                                                                        }} className="bg-background border-none h-11 rounded-xl text-sm" placeholder="from-blue-600 to-indigo-600" />
                                                                    </div>
                                                                    <MediaUpload 
                                                                        label="OR Project Banner Image" 
                                                                        value={project.imageGradient.startsWith('http') ? project.imageGradient : ''} 
                                                                        onChange={(url) => {
                                                                            const newProjects = [...content.projects.projects];
                                                                            newProjects[index] = { ...newProjects[index], imageGradient: url || 'from-primary to-secondary' };
                                                                            updateSection('projects', { projects: newProjects });
                                                                        }} 
                                                                        type="image"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {project.stats?.map((stat, sIndex) => (
                                                                <div key={sIndex} className="flex gap-4 items-end">
                                                                    <div className="space-y-1 flex-1">
                                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Stat Label</Label>
                                                                        <Input value={stat.label} onChange={(e) => {
                                                                            const newProjects = [...content.projects.projects];
                                                                            const newStats = [...newProjects[index].stats];
                                                                            newStats[sIndex] = { ...newStats[sIndex], label: e.target.value };
                                                                            newProjects[index] = { ...newProjects[index], stats: newStats };
                                                                            updateSection('projects', { projects: newProjects });
                                                                        }} className="bg-background border-none h-9 rounded-lg text-sm" />
                                                                    </div>
                                                                    <div className="space-y-1 flex-1">
                                                                        <Label className="text-[10px] uppercase font-bold text-muted-foreground">Stat Value</Label>
                                                                        <Input value={stat.value} onChange={(e) => {
                                                                            const newProjects = [...content.projects.projects];
                                                                            const newStats = [...newProjects[index].stats];
                                                                            newStats[sIndex] = { ...newStats[sIndex], value: e.target.value };
                                                                            newProjects[index] = { ...newProjects[index], stats: newStats };
                                                                            updateSection('projects', { projects: newProjects });
                                                                        }} className="bg-background border-none h-9 rounded-lg text-sm font-bold" />
                                                                    </div>
                                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                                        const newProjects = [...content.projects.projects];
                                                                        const newStats = newProjects[index].stats.filter((_, si) => si !== sIndex);
                                                                        newProjects[index] = { ...newProjects[index], stats: newStats };
                                                                        updateSection('projects', { projects: newProjects });
                                                                    }} className="h-9 w-9 text-destructive"><X className="w-3 h-3" /></Button>
                                                                </div>
                                                            ))}
                                                            <Button variant="outline" size="sm" onClick={() => {
                                                                const newProjects = [...content.projects.projects];
                                                                const newStats = [...newProjects[index].stats, { label: "New Stat", value: "0" }];
                                                                newProjects[index] = { ...newProjects[index], stats: newStats };
                                                                updateSection('projects', { projects: newProjects });
                                                            }} className="rounded-xl h-8 text-xs gap-1"><Plus className="w-3 h-3" /> Add Stat</Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            const newProjects = [...content.projects.projects];
                                                            newProjects.splice(index, 1);
                                                            updateSection('projects', { projects: newProjects });
                                                        }} className="text-destructive hover:bg-destructive/10 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === 0} onClick={() => {
                                                            const newProjects = [...content.projects.projects];
                                                            [newProjects[index-1], newProjects[index]] = [newProjects[index], newProjects[index-1]];
                                                            updateSection('projects', { projects: newProjects });
                                                        }}><ChevronUp className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === (content.projects.projects?.length ?? 0) - 1} onClick={() => {
                                                            const newProjects = [...content.projects.projects];
                                                            [newProjects[index], newProjects[index+1]] = [newProjects[index+1], newProjects[index]];
                                                            updateSection('projects', { projects: newProjects });
                                                        }}><ChevronDown className="w-4 h-4" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'whyus' && (
                        <Card className="rounded-[40px]">
                            <CardHeader className="p-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black">Why Choose Us</CardTitle>
                                        <CardDescription>Highlight your competitive advantages</CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={() => {
                                            const newStat = { value: "100%", label: "Success" };
                                            updateSection('whyUs', { stats: [...(content.whyUs.stats || []), newStat] });
                                        }} className="rounded-2xl gap-2 font-bold">
                                            <Plus className="w-4 h-4" /> Add Stat
                                        </Button>
                                        <Button onClick={() => {
                                            const newFeature = {
                                                title: "New Highlight",
                                                description: "Describe why you are great",
                                                icon: "Zap",
                                                color: "text-blue-500",
                                                gradient: "from-blue-500/20 to-blue-600/5",
                                                stat: "100%",
                                                statLabel: "Value"
                                            };
                                            updateSection('whyUs', { features: [...(content.whyUs.features || []), newFeature] });
                                        }} className="rounded-2xl gap-2">
                                            <Plus className="w-4 h-4" /> Add Feature
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2"><Label>Badge</Label><Input value={content.whyUs.badge} onChange={(e) => updateSection('whyUs', { badge: e.target.value })} className="h-12 rounded-2xl" placeholder="The Ofitsoft Edge" /></div>
                                    <div className="space-y-2"><Label>Title</Label><Input value={content.whyUs.title} onChange={(e) => updateSection('whyUs', { title: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div className="col-span-2 space-y-2"><Label>Subtitle</Label><Input value={content.whyUs.subtitle} onChange={(e) => updateSection('whyUs', { subtitle: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div className="col-span-2 space-y-2"><Label>Description</Label><Textarea value={content.whyUs.description} onChange={(e) => updateSection('whyUs', { description: e.target.value })} className="rounded-2xl" /></div>
                                </div>

                                <div className="space-y-6">
                                    <Label className="text-lg font-bold">Key Stats</Label>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        {content.whyUs.stats?.map((stat, index) => (
                                            <div key={index} className="flex gap-3 bg-muted/20 p-4 rounded-2xl border border-border/50 items-end">
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Value</Label>
                                                    <Input value={stat.value} onChange={(e) => {
                                                        const newStats = [...content.whyUs.stats];
                                                        newStats[index] = { ...newStats[index], value: e.target.value };
                                                        updateSection('whyUs', { stats: newStats });
                                                    }} className="bg-background border-none h-9 rounded-xl font-black italic text-lg" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Label</Label>
                                                    <Input value={stat.label} onChange={(e) => {
                                                        const newStats = [...content.whyUs.stats];
                                                        newStats[index] = { ...newStats[index], label: e.target.value };
                                                        updateSection('whyUs', { stats: newStats });
                                                    }} className="bg-background border-none h-9 rounded-xl text-xs" />
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => {
                                                    const newStats = content.whyUs.stats.filter((_, i) => i !== index);
                                                    updateSection('whyUs', { stats: newStats });
                                                }} className="h-9 w-9 text-destructive"><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-lg font-bold">Features List</Label>
                                    <div className="grid gap-4">
                                        {content.whyUs.features?.map((feature, index) => (
                                            <div key={index} className="group relative bg-muted/30 p-6 rounded-[24px] border border-border/50 hover:border-primary/50 transition-all">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex flex-1 gap-6">
                                                        <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-lg", feature.gradient || "from-blue-500 to-indigo-500")}>
                                                            {(() => {
                                                                const Icon = feature.icon === 'Zap' ? Zap : feature.icon === 'Users' ? User : feature.icon === 'Cpu' ? Cpu : feature.icon === 'Shield' ? Shield : Layout;
                                                                return <Icon className="w-7 h-7" />;
                                                            })()}
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="grid md:grid-cols-3 gap-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Title</Label>
                                                                    <Input value={feature.title} onChange={(e) => {
                                                                        const newFeatures = [...content.whyUs.features];
                                                                        newFeatures[index] = { ...newFeatures[index], title: e.target.value };
                                                                        updateSection('whyUs', { features: newFeatures });
                                                                    }} className="bg-background border-none h-10 rounded-xl font-bold" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Icon</Label>
                                                                    <Select value={feature.icon} onValueChange={(val) => {
                                                                        const newFeatures = [...content.whyUs.features];
                                                                        newFeatures[index] = { ...newFeatures[index], icon: val };
                                                                        updateSection('whyUs', { features: newFeatures });
                                                                    }}>
                                                                        <SelectTrigger className="bg-background border-none h-10 rounded-xl">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Zap">Zap</SelectItem>
                                                                            <SelectItem value="Users">Users</SelectItem>
                                                                            <SelectItem value="Cpu">CPU</SelectItem>
                                                                            <SelectItem value="Shield">Shield</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Color Class</Label>
                                                                    <Input value={feature.color} onChange={(e) => {
                                                                        const newFeatures = [...content.whyUs.features];
                                                                        newFeatures[index] = { ...newFeatures[index], color: e.target.value };
                                                                        updateSection('whyUs', { features: newFeatures });
                                                                    }} className="bg-background border-none h-10 rounded-xl" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Description</Label>
                                                                <Textarea value={feature.description} onChange={(e) => {
                                                                    const newFeatures = [...content.whyUs.features];
                                                                    newFeatures[index] = { ...newFeatures[index], description: e.target.value };
                                                                    updateSection('whyUs', { features: newFeatures });
                                                                }} className="bg-background border-none rounded-xl min-h-[60px]" />
                                                            </div>
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Stat Value</Label>
                                                                    <Input value={feature.stat} onChange={(e) => {
                                                                        const newFeatures = [...content.whyUs.features];
                                                                        newFeatures[index] = { ...newFeatures[index], stat: e.target.value };
                                                                        updateSection('whyUs', { features: newFeatures });
                                                                    }} className="bg-background border-none h-10 rounded-xl font-bold" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Stat Label</Label>
                                                                    <Input value={feature.statLabel} onChange={(e) => {
                                                                        const newFeatures = [...content.whyUs.features];
                                                                        newFeatures[index] = { ...newFeatures[index], statLabel: e.target.value };
                                                                        updateSection('whyUs', { features: newFeatures });
                                                                    }} className="bg-background border-none h-10 rounded-xl" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            const newFeatures = [...content.whyUs.features];
                                                            newFeatures.splice(index, 1);
                                                            updateSection('whyUs', { features: newFeatures });
                                                        }} className="text-destructive hover:bg-destructive/10 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === 0} onClick={() => {
                                                            const newFeatures = [...content.whyUs.features];
                                                            [newFeatures[index-1], newFeatures[index]] = [newFeatures[index], newFeatures[index-1]];
                                                            updateSection('whyUs', { features: newFeatures });
                                                        }}><ChevronUp className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === (content.whyUs.features?.length ?? 0) - 1} onClick={() => {
                                                            const newFeatures = [...content.whyUs.features];
                                                            [newFeatures[index], newFeatures[index+1]] = [newFeatures[index+1], newFeatures[index]];
                                                            updateSection('whyUs', { features: newFeatures });
                                                        }}><ChevronDown className="w-4 h-4" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'process' && (
                        <Card className="rounded-[40px]">
                            <CardHeader className="p-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black">Process Timeline</CardTitle>
                                        <CardDescription>Explain your workflow</CardDescription>
                                    </div>
                                    <Button onClick={() => {
                                        const newStep = {
                                            id: `step-${Date.now()}`,
                                            number: (content.process.steps?.length ?? 0) + 1,
                                            title: "New Step",
                                            description: "Step details",
                                            icon: "Rocket",
                                            gradient: "from-blue-500 to-cyan-500"
                                        };
                                        updateSection('process', { steps: [...(content.process.steps || []), newStep] });
                                    }} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" /> Add Step
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2"><Label>Badge</Label><Input value={content.process.badge} onChange={(e) => updateSection('process', { badge: e.target.value })} className="h-12 rounded-2xl" placeholder="How We Work" /></div>
                                    <div className="space-y-2"><Label>Title</Label><Input value={content.process.title} onChange={(e) => updateSection('process', { title: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div className="space-y-2"><Label>Subtitle</Label><Input value={content.process.subtitle} onChange={(e) => updateSection('process', { subtitle: e.target.value })} className="h-12 rounded-2xl" /></div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-lg font-bold">Process Steps</Label>
                                    <div className="grid gap-4">
                                        {content.process.steps?.map((step, index) => (
                                            <div key={step.id} className="group relative bg-muted/30 p-6 rounded-[24px] border border-border/50 hover:border-primary/50 transition-all">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex flex-1 gap-6">
                                                        <div className={cn("w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-lg font-black text-xl", step.gradient)}>
                                                            {index + 1}
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Title</Label>
                                                                    <Input value={step.title} onChange={(e) => {
                                                                        const newSteps = [...content.process.steps];
                                                                        newSteps[index] = { ...newSteps[index], title: e.target.value };
                                                                        updateSection('process', { steps: newSteps });
                                                                    }} className="bg-background border-none h-10 rounded-xl font-bold" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Icon Identifier</Label>
                                                                    <Select value={step.icon} onValueChange={(val) => {
                                                                        const newSteps = [...content.process.steps];
                                                                        newSteps[index] = { ...newSteps[index], icon: val };
                                                                        updateSection('process', { steps: newSteps });
                                                                    }}>
                                                                        <SelectTrigger className="bg-background border-none h-10 rounded-xl">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Search">Discovery/Search</SelectItem>
                                                                            <SelectItem value="PenTool">Design/Pen</SelectItem>
                                                                            <SelectItem value="Code2">Dev/Code</SelectItem>
                                                                            <SelectItem value="CheckCircle2">QA/Check</SelectItem>
                                                                            <SelectItem value="Rocket">Launch/Rocket</SelectItem>
                                                                            <SelectItem value="BarChart3">Growth/Chart</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Description</Label>
                                                                <Textarea value={step.description} onChange={(e) => {
                                                                    const newSteps = [...content.process.steps];
                                                                    newSteps[index] = { ...newSteps[index], description: e.target.value };
                                                                    updateSection('process', { steps: newSteps });
                                                                }} className="bg-background border-none rounded-xl min-h-[80px]" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Gradient</Label>
                                                                <Input value={step.gradient} onChange={(e) => {
                                                                    const newSteps = [...content.process.steps];
                                                                    newSteps[index] = { ...newSteps[index], gradient: e.target.value };
                                                                    updateSection('process', { steps: newSteps });
                                                                }} className="bg-background border-none h-9 rounded-lg text-sm" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            const newSteps = [...content.process.steps];
                                                            newSteps.splice(index, 1);
                                                            updateSection('process', { steps: newSteps });
                                                        }} className="text-destructive hover:bg-destructive/10 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === 0} onClick={() => {
                                                            const newSteps = [...content.process.steps];
                                                            [newSteps[index-1], newSteps[index]] = [newSteps[index], newSteps[index-1]];
                                                            updateSection('process', { steps: newSteps });
                                                        }}><ChevronUp className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === (content.process.steps?.length ?? 0) - 1} onClick={() => {
                                                            const newSteps = [...content.process.steps];
                                                            [newSteps[index], newSteps[index+1]] = [newSteps[index+1], newSteps[index]];
                                                            updateSection('process', { steps: newSteps });
                                                        }}><ChevronDown className="w-4 h-4" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'testimonials' && (
                        <Card className="rounded-[40px]">
                            <CardHeader className="p-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black">Testimonials</CardTitle>
                                        <CardDescription>Client feedback and reviews</CardDescription>
                                    </div>
                                    <Button onClick={() => {
                                        const newTestimonial = {
                                            id: `test-${Date.now()}`,
                                            name: "New Client",
                                            role: "CEO",
                                            avatar: "https://i.pravatar.cc/150",
                                            quote: "Amazing work!",
                                            gradient: "from-blue-500 to-indigo-500"
                                        };
                                        updateSection('testimonials', { testimonials: [...(content.testimonials.testimonials || []), newTestimonial] });
                                    }} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" /> Add Testimonial
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2"><Label>Badge</Label><Input value={content.testimonials.badge} onChange={(e) => updateSection('testimonials', { badge: e.target.value })} className="h-12 rounded-2xl" placeholder="Trusted by Market Leaders" /></div>
                                    <div className="space-y-2"><Label>Title</Label><Input value={content.testimonials.title} onChange={(e) => updateSection('testimonials', { title: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div className="space-y-2"><Label>Subtitle</Label><Input value={content.testimonials.subtitle} onChange={(e) => updateSection('testimonials', { subtitle: e.target.value })} className="h-12 rounded-2xl" /></div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-lg font-bold">Client Testimonials</Label>
                                    <div className="grid gap-4">
                                        {content.testimonials.testimonials?.map((testimonial, index) => (
                                            <div key={index} className="group relative bg-muted/30 p-6 rounded-[24px] border border-border/50 hover:border-primary/50 transition-all">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex flex-1 gap-6">
                                                        <div className="shrink-0 space-y-2">
                                                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/20 bg-background flex items-center justify-center">
                                                                {testimonial.avatar ? <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-muted-foreground" />}
                                                            </div>
                                                            <div className={cn("h-2 w-16 rounded-full bg-gradient-to-r", testimonial.gradient)} />
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Name</Label>
                                                                    <Input value={testimonial.name} onChange={(e) => {
                                                                        const newTests = [...content.testimonials.testimonials];
                                                                        newTests[index] = { ...newTests[index], name: e.target.value };
                                                                        updateSection('testimonials', { testimonials: newTests });
                                                                    }} className="bg-background border-none h-10 rounded-xl font-bold" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Role</Label>
                                                                    <Input value={testimonial.role} onChange={(e) => {
                                                                        const newTests = [...content.testimonials.testimonials];
                                                                        newTests[index] = { ...newTests[index], role: e.target.value };
                                                                        updateSection('testimonials', { testimonials: newTests });
                                                                    }} className="bg-background border-none h-10 rounded-xl" />
                                                                </div>
                                                            </div>
                                                            <div className="grid md:grid-cols-2 gap-6 items-end">
                                                                <MediaUpload 
                                                                    label="Avatar Image" 
                                                                    value={testimonial.avatar || ''} 
                                                                    onChange={(url) => {
                                                                        const newTests = [...content.testimonials.testimonials];
                                                                        newTests[index] = { ...newTests[index], avatar: url };
                                                                        updateSection('testimonials', { testimonials: newTests });
                                                                    }} 
                                                                    type="image"
                                                                />
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Gradient Accent</Label>
                                                                    <Input value={testimonial.gradient} onChange={(e) => {
                                                                        const newTests = [...content.testimonials.testimonials];
                                                                        newTests[index] = { ...newTests[index], gradient: e.target.value };
                                                                        updateSection('testimonials', { testimonials: newTests });
                                                                    }} className="bg-background border-none h-11 rounded-xl text-sm w-full" placeholder="from-blue-500 to-indigo-500" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Client Quote</Label>
                                                                <Textarea value={testimonial.quote} onChange={(e) => {
                                                                    const newTests = [...content.testimonials.testimonials];
                                                                    newTests[index] = { ...newTests[index], quote: e.target.value };
                                                                    updateSection('testimonials', { testimonials: newTests });
                                                                }} className="bg-background border-none rounded-[20px] min-h-[100px] italic text-lg leading-relaxed px-6 py-4" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            const newTests = [...content.testimonials.testimonials];
                                                            newTests.splice(index, 1);
                                                            updateSection('testimonials', { testimonials: newTests });
                                                        }} className="text-destructive hover:bg-destructive/10 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === 0} onClick={() => {
                                                            const newTests = [...content.testimonials.testimonials];
                                                            [newTests[index-1], newTests[index]] = [newTests[index], newTests[index-1]];
                                                            updateSection('testimonials', { testimonials: newTests });
                                                        }}><ChevronUp className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === (content.testimonials.testimonials?.length ?? 0) - 1} onClick={() => {
                                                            const newTests = [...content.testimonials.testimonials];
                                                            [newTests[index], newTests[index+1]] = [newTests[index+1], newTests[index]];
                                                            updateSection('testimonials', { testimonials: newTests });
                                                        }}><ChevronDown className="w-4 h-4" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'techstack' && (
                        <Card className="rounded-[40px]">
                            <CardHeader className="p-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black">Tech Stack</CardTitle>
                                        <CardDescription>Curate your technology ecosystem</CardDescription>
                                    </div>
                                    <Button onClick={() => {
                                        const newTech = {
                                            id: `tech-${Date.now()}`,
                                            name: "New Tech",
                                            icon: "Code",
                                            category: "Frontend",
                                            color: "text-blue-500"
                                        };
                                        updateSection('techStack', { technologies: [...(content.techStack.technologies || []), newTech] });
                                    }} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" /> Add Tech
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2"><Label>Badge</Label><Input value={content.techStack.badge} onChange={(e) => updateSection('techStack', { badge: e.target.value })} className="h-12 rounded-2xl" placeholder="Our Tech Ecosystem" /></div>
                                    <div className="space-y-2"><Label>Title</Label><Input value={content.techStack.title} onChange={(e) => updateSection('techStack', { title: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div className="space-y-2"><Label>Subtitle</Label><Input value={content.techStack.subtitle} onChange={(e) => updateSection('techStack', { subtitle: e.target.value })} className="h-12 rounded-2xl" /></div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-lg font-bold">Technologies</Label>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {content.techStack.technologies?.map((tech, index) => (
                                            <div key={tech.id} className="group relative bg-muted/30 p-5 rounded-[20px] border border-border/50 hover:border-primary/50 transition-all flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className={cn("w-12 h-12 rounded-xl bg-background border flex items-center justify-center shrink-0 shadow-sm p-2", tech.color)}>
                                                        {tech.icon.startsWith('http') ? (
                                                            <img src={tech.icon} alt={tech.name} className="w-full h-full object-contain" />
                                                        ) : (() => {
                                                            const Icon = tech.icon === 'Terminal' ? Terminal : tech.icon === 'Database' ? Database : tech.icon === 'Layers' ? Layers : tech.icon === 'Smartphone' ? Smartphone : Code;
                                                            return <Icon className="w-6 h-6" />;
                                                        })()}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-6 flex-1 items-end">
                                                        <div className="space-y-4">
                                                            <MediaUpload 
                                                                label="Tech Icon / Image" 
                                                                value={tech.icon.startsWith('http') ? tech.icon : ''} 
                                                                onChange={(url) => {
                                                                    const newTechs = [...content.techStack.technologies];
                                                                    newTechs[index] = { ...newTechs[index], icon: url || 'Code' };
                                                                    updateSection('techStack', { technologies: newTechs });
                                                                }} 
                                                                type="image"
                                                            />
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Category</Label>
                                                                <Select value={tech.category} onValueChange={(val) => {
                                                                    const newTechs = [...content.techStack.technologies];
                                                                    newTechs[index] = { ...newTechs[index], category: val };
                                                                    updateSection('techStack', { technologies: newTechs });
                                                                }}>
                                                                    <SelectTrigger className="h-10 bg-background border-none rounded-xl">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Frontend">Frontend</SelectItem>
                                                                        <SelectItem value="Backend">Backend</SelectItem>
                                                                        <SelectItem value="Mobile">Mobile</SelectItem>
                                                                        <SelectItem value="AI/Data">AI/Data</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Name</Label>
                                                                <Input value={tech.name} onChange={(e) => {
                                                                    const newTechs = [...content.techStack.technologies];
                                                                    newTechs[index] = { ...newTechs[index], name: e.target.value };
                                                                    updateSection('techStack', { technologies: newTechs });
                                                                }} className="bg-background border-none h-11 rounded-xl font-bold" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Color Class</Label>
                                                                <Input value={tech.color} onChange={(e) => {
                                                                    const newTechs = [...content.techStack.technologies];
                                                                    newTechs[index] = { ...newTechs[index], color: e.target.value };
                                                                    updateSection('techStack', { technologies: newTechs });
                                                                }} className="h-11 bg-background border-none rounded-xl text-xs" placeholder="text-blue-500 bg-blue-500/10" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                        const newTechs = content.techStack.technologies.filter((_, i) => i !== index);
                                                        updateSection('techStack', { technologies: newTechs });
                                                    }} className="h-8 w-8 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'blog' && (
                        <Card className="rounded-[40px]">
                            <CardHeader className="p-10">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-2xl font-black">Latest Blog Posts</CardTitle>
                                        <CardDescription>Featured insights and updates</CardDescription>
                                    </div>
                                    <Button onClick={() => {
                                        const newPost = {
                                            id: `post-${Date.now()}`,
                                            title: "New Blog Post",
                                            excerpt: "Post summary...",
                                            date: new Date().toLocaleDateString(),
                                            category: "Insights",
                                            slug: "new-post",
                                            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
                                            readTime: "5 min",
                                            gradient: "from-blue-500 to-indigo-500"
                                        };
                                        updateSection('blog', { posts: [...(content.blog.posts || []), newPost] });
                                    }} className="rounded-2xl gap-2">
                                        <Plus className="w-4 h-4" /> Add Post Preview
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2"><Label>Badge</Label><Input value={content.blog.badge} onChange={(e) => updateSection('blog', { badge: e.target.value })} className="h-12 rounded-2xl" placeholder="Thought Leadership" /></div>
                                    <div className="space-y-2"><Label>Title</Label><Input value={content.blog.title} onChange={(e) => updateSection('blog', { title: e.target.value })} className="h-12 rounded-2xl" /></div>
                                    <div className="space-y-2"><Label>Subtitle</Label><Input value={content.blog.subtitle} onChange={(e) => updateSection('blog', { subtitle: e.target.value })} className="h-12 rounded-2xl" /></div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-lg font-bold">Blog Post Previews</Label>
                                    <div className="grid gap-4">
                                        {content.blog.posts?.map((post, index) => (
                                            <div key={post.id} className="group relative bg-muted/30 p-6 rounded-[24px] border border-border/50 hover:border-primary/50 transition-all">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex flex-1 gap-6">
                                                        <div className="w-32 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border/50 shadow-sm">
                                                            {post.image ? <img src={post.image} alt={post.title} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-6 text-muted-foreground opacity-20" />}
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Title</Label>
                                                                    <Input value={post.title} onChange={(e) => {
                                                                        const newPosts = [...content.blog.posts];
                                                                        newPosts[index] = { ...newPosts[index], title: e.target.value };
                                                                        updateSection('blog', { posts: newPosts });
                                                                    }} className="bg-background border-none h-10 rounded-xl font-bold" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <Label className="text-[10px] uppercase font-bold text-muted-foreground">Category</Label>
                                                                    <Input value={post.category} onChange={(e) => {
                                                                        const newPosts = [...content.blog.posts];
                                                                        newPosts[index] = { ...newPosts[index], category: e.target.value };
                                                                        updateSection('blog', { posts: newPosts });
                                                                    }} className="bg-background border-none h-10 rounded-xl" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Excerpt</Label>
                                                                <Input value={post.excerpt} onChange={(e) => {
                                                                    const newPosts = [...content.blog.posts];
                                                                    newPosts[index] = { ...newPosts[index], excerpt: e.target.value };
                                                                    updateSection('blog', { posts: newPosts });
                                                                }} className="bg-background border-none h-10 rounded-xl" />
                                                            </div>
                                                                <div className="space-y-4">
                                                                    <MediaUpload 
                                                                        label="Featured Image" 
                                                                        value={post.image || ''} 
                                                                        onChange={(url) => {
                                                                            const newPosts = [...content.blog.posts];
                                                                            newPosts[index] = { ...newPosts[index], image: url };
                                                                            updateSection('blog', { posts: newPosts });
                                                                        }} 
                                                                        type="image"
                                                                    />
                                                                    <div className="grid md:grid-cols-2 gap-4">
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Date</Label>
                                                                            <Input value={post.date} onChange={(e) => {
                                                                                const newPosts = [...content.blog.posts];
                                                                                newPosts[index] = { ...newPosts[index], date: e.target.value };
                                                                                updateSection('blog', { posts: newPosts });
                                                                            }} className="bg-background border-none h-11 rounded-xl text-xs" />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Slug</Label>
                                                                            <Input value={post.slug} onChange={(e) => {
                                                                                const newPosts = [...content.blog.posts];
                                                                                newPosts[index] = { ...newPosts[index], slug: e.target.value };
                                                                                updateSection('blog', { posts: newPosts });
                                                                            }} className="bg-background border-none h-11 rounded-xl text-xs" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            const newPosts = [...content.blog.posts];
                                                            newPosts.splice(index, 1);
                                                            updateSection('blog', { posts: newPosts });
                                                        }} className="text-destructive hover:bg-destructive/10 rounded-xl"><Trash2 className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === 0} onClick={() => {
                                                            const newPosts = [...content.blog.posts];
                                                            [newPosts[index-1], newPosts[index]] = [newPosts[index], newPosts[index-1]];
                                                            updateSection('blog', { posts: newPosts });
                                                        }}><ChevronUp className="w-4 h-4" /></Button>
                                                        <Button variant="ghost" size="icon" className="rounded-xl" disabled={index === (content.blog.posts?.length ?? 0) - 1} onClick={() => {
                                                            const newPosts = [...content.blog.posts];
                                                            [newPosts[index], newPosts[index+1]] = [newPosts[index+1], newPosts[index]];
                                                            updateSection('blog', { posts: newPosts });
                                                        }}><ChevronDown className="w-4 h-4" /></Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'cta' && (
                        <Card className="rounded-[40px]">
                            <CardHeader className="p-10"><CardTitle className="text-2xl font-black">Call to Action Section</CardTitle></CardHeader>
                            <CardContent className="p-10 space-y-6">
                                <div><Label>Title</Label><Input value={content.cta.title} onChange={(e) => updateSection('cta', { title: e.target.value })} className="h-12 rounded-2xl" placeholder="Let's Build the Next Big Thing." /></div>
                                <div><Label>Description</Label><Textarea value={content.cta.description} onChange={(e) => updateSection('cta', { description: e.target.value })} className="rounded-2xl min-h-[100px]" placeholder="Have a project in mind?" /></div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div><Label>Button Text</Label><Input value={content.cta.buttonText} onChange={(e) => updateSection('cta', { buttonText: e.target.value })} className="h-11 rounded-xl" placeholder="Start Conversation" /></div>
                                    <div><Label>Button Link</Label><Input value={content.cta.buttonLink} onChange={(e) => updateSection('cta', { buttonLink: e.target.value })} className="h-11 rounded-xl" placeholder="/contact" /></div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeSection === 'seo' && (
                        <Card className="rounded-[40px]">
                            <CardHeader className="p-10"><CardTitle className="text-2xl font-black">SEO Settings</CardTitle></CardHeader>
                            <CardContent className="p-10 space-y-6">
                                <div><Label>Meta Title</Label><Input value={content.seo.title} onChange={(e) => updateSEO({ title: e.target.value })} className="h-12 rounded-2xl" maxLength={60} /><p className="text-xs text-muted-foreground">{content.seo.title.length}/60</p></div>
                                <div><Label>Meta Description</Label><Textarea value={content.seo.description} onChange={(e) => updateSEO({ description: e.target.value })} className="rounded-2xl" maxLength={160} /><p className="text-xs text-muted-foreground">{content.seo.description.length}/160</p></div>
                                <div><Label>Keywords</Label><Input value={content.seo.keywords.join(', ')} onChange={(e) => updateSEO({ keywords: e.target.value.split(',').map(k => k.trim()) })} className="h-12 rounded-2xl" /></div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
