"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    ArrowLeft, Save, Eye, Globe, Settings, Layers, 
    Image as ImageIcon, Video, Type, Layout, Zap,
    Upload, X, Check, Clock, History, RefreshCcw,
    Sparkles, Monitor, Smartphone, Tablet, ChevronDown,
    Plus, Trash2, Edit, GripVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import Link from "next/link";
import { useHomeContentStore } from "@/lib/store/home-content";
import { 
    useHomeContent, 
    useUpdateHomeContent, 
    usePublishHomeContent,
    useUploadImage,
    useUploadVideo,
    useContentHistory,
    useRestoreContentVersion
} from "@/lib/api/home-queries";

export default function HomeContentEditor() {
    const params = useParams();
    const router = useRouter();
    const pageId = params.id as string;
    
    // Zustand store
    const {
        content,
        isSaving,
        updateSection,
        toggleSection,
        updateSEO,
        setStatus,
        setSaving,
    } = useHomeContentStore();
    
    // React Query hooks
    const { data: serverContent, isLoading } = useHomeContent();
    const updateMutation = useUpdateHomeContent();
    const publishMutation = usePublishHomeContent();
    const uploadImageMutation = useUploadImage();
    const uploadVideoMutation = useUploadVideo();
    const { data: history } = useContentHistory();
    
    // Local state
    const [activeSection, setActiveSection] = useState<string>('hero');
    const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    
    // Auto-save functionality
    useEffect(() => {
        if (!content) return;
        
        const timer = setTimeout(() => {
            handleAutoSave();
        }, 3000); // Auto-save after 3 seconds of inactivity
        
        return () => clearTimeout(timer);
    }, [content]);
    
    const handleAutoSave = async () => {
        if (!content) return;
        
        setSaving(true);
        try {
            await updateMutation.mutateAsync(content);
        } catch (error) {
            console.error('Auto-save failed:', error);
        } finally {
            setSaving(false);
        }
    };
    
    const handlePublish = async () => {
        try {
            await publishMutation.mutateAsync();
            setStatus('published');
        } catch (error) {
            console.error('Publish failed:', error);
        }
    };
    
    const handleImageUpload = async (file: File, callback: (url: string) => void) => {
        setIsUploading(true);
        try {
            const result = await uploadImageMutation.mutateAsync(file);
            callback(result.url);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleVideoUpload = async (file: File, callback: (url: string) => void) => {
        setIsUploading(true);
        setUploadProgress(0);
        
        try {
            const result = await uploadVideoMutation.mutateAsync({
                file,
                onProgress: (progress) => setUploadProgress(progress),
            });
            callback(result.url);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };
    
    if (isLoading || !content) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center space-y-4">
                    <RefreshCcw className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground font-medium">Loading content editor...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Button variant="ghost" asChild className="h-12 w-12 rounded-2xl">
                                <Link href="/dashboard/admin/content">
                                    <ArrowLeft className="w-5 h-5" />
                                </Link>
                            </Button>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-black italic tracking-tight">
                                        Home Page Editor
                                    </h1>
                                    <Badge 
                                        variant={content.status === 'published' ? 'default' : 'secondary'}
                                        className="h-6 font-black uppercase text-[9px] tracking-widest"
                                    >
                                        {content.status === 'published' ? (
                                            <><Check className="w-3 h-3 mr-1" /> Published</>
                                        ) : (
                                            <><Clock className="w-3 h-3 mr-1" /> Draft</>
                                        )}
                                    </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Last updated: {new Date(content.lastUpdated).toLocaleString()}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            {isSaving && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <RefreshCcw className="w-3 h-3 animate-spin" />
                                    Saving...
                                </div>
                            )}
                            
                            <Button
                                variant="outline"
                                onClick={() => setShowHistory(true)}
                                className="rounded-2xl gap-2 h-11"
                            >
                                <History className="w-4 h-4" />
                                History
                            </Button>
                            
                            <Button
                                variant="outline"
                                className="rounded-2xl gap-2 h-11"
                                asChild
                            >
                                <Link href="/" target="_blank">
                                    <Eye className="w-4 h-4" />
                                    Preview
                                </Link>
                            </Button>
                            
                            <Button
                                onClick={handlePublish}
                                disabled={publishMutation.isPending}
                                className="rounded-2xl gap-2 h-11 bg-primary text-white shadow-xl shadow-primary/20 font-black"
                            >
                                {publishMutation.isPending ? (
                                    <RefreshCcw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Globe className="w-4 h-4" />
                                )}
                                Publish Live
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="container mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar - Section Navigator */}
                    <div className="lg:col-span-3">
                        <Card className="sticky top-24 border-border/50 bg-card/80 backdrop-blur-md rounded-[32px] overflow-hidden">
                            <CardHeader className="p-6 border-b border-border/50">
                                <CardTitle className="text-sm font-black uppercase italic tracking-widest">
                                    Page Sections
                                </CardTitle>
                            </CardHeader>
                            <ScrollArea className="h-[calc(100vh-200px)]">
                                <CardContent className="p-4 space-y-2">
                                    {[
                                        { id: 'hero', label: 'Hero Section', icon: Zap, enabled: content.hero.enabled },
                                        { id: 'services', label: 'Services', icon: Layout, enabled: content.services.enabled },
                                        { id: 'projects', label: 'Projects', icon: Layers, enabled: content.projects.enabled },
                                        { id: 'whyus', label: 'Why Us', icon: Sparkles, enabled: content.whyUs.enabled },
                                        { id: 'process', label: 'Process', icon: Type, enabled: content.process.enabled },
                                        { id: 'testimonials', label: 'Testimonials', icon: Type, enabled: content.testimonials.enabled },
                                        { id: 'techstack', label: 'Tech Stack', icon: Type, enabled: content.techStack.enabled },
                                        { id: 'blog', label: 'Blog', icon: Type, enabled: content.blog.enabled },
                                        { id: 'cta', label: 'CTA', icon: Type, enabled: content.cta.enabled },
                                        { id: 'seo', label: 'SEO Settings', icon: Settings, enabled: true },
                                    ].map((section) => (
                                        <Button
                                            key={section.id}
                                            variant={activeSection === section.id ? 'secondary' : 'ghost'}
                                            className={cn(
                                                "w-full justify-start gap-3 h-12 rounded-2xl font-bold",
                                                activeSection === section.id && "bg-primary/10 text-primary"
                                            )}
                                            onClick={() => setActiveSection(section.id)}
                                        >
                                            <section.icon className="w-4 h-4" />
                                            {section.label}
                                            {section.id !== 'seo' && (
                                                <Switch
                                                    checked={section.enabled}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleSection(section.id as any);
                                                    }}
                                                    className="ml-auto"
                                                />
                                            )}
                                        </Button>
                                    ))}
                                </CardContent>
                            </ScrollArea>
                        </Card>
                    </div>
                    
                    {/* Editor Area */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Hero Section Editor */}
                        {activeSection === 'hero' && (
                            <HeroEditor 
                                content={content.hero}
                                onUpdate={(data: any) => updateSection('hero', data)}
                                onImageUpload={handleImageUpload}
                                onVideoUpload={handleVideoUpload}
                                isUploading={isUploading}
                                uploadProgress={uploadProgress}
                            />
                        )}
                        
                        {/* Services Section Editor */}
                        {activeSection === 'services' && (
                            <ServicesEditor
                                content={content.services}
                                onUpdate={(data: any) => updateSection('services', data)}
                            />
                        )}
                        
                        {/* SEO Editor */}
                        {activeSection === 'seo' && (
                            <SEOEditor
                                content={content.seo}
                                onUpdate={updateSEO}
                                onImageUpload={handleImageUpload}
                            />
                        )}
                        
                        {/* Add more section editors as needed */}
                    </div>
                </div>
            </div>
            
            {/* History Dialog */}
            <HistoryDialog
                open={showHistory}
                onOpenChange={setShowHistory}
                history={history || []}
            />
        </div>
    );
}

// Hero Section Editor Component
function HeroEditor({ 
    content, 
    onUpdate, 
    onImageUpload, 
    onVideoUpload,
    isUploading,
    uploadProgress 
}: any) {
    return (
        <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[40px] overflow-hidden">
            <CardHeader className="p-10 border-b border-border/50">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-black italic">Hero Section</CardTitle>
                        <CardDescription className="mt-2">Main landing section of your homepage</CardDescription>
                    </div>
                    <Zap className="w-8 h-8 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
                {/* Title */}
                <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Main Title</Label>
                    <Input
                        value={content.title}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        className="h-14 text-lg font-bold rounded-2xl"
                        placeholder="Transform Your Digital Vision"
                    />
                </div>
                
                {/* Subtitle */}
                <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Subtitle</Label>
                    <Input
                        value={content.subtitle}
                        onChange={(e) => onUpdate({ subtitle: e.target.value })}
                        className="h-12 rounded-2xl"
                        placeholder="Premium Software Solutions"
                    />
                </div>
                
                {/* Description */}
                <div className="space-y-3">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Description</Label>
                    <Textarea
                        value={content.description}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        className="min-h-[120px] rounded-2xl"
                        placeholder="Describe your services..."
                    />
                </div>
                
                {/* CTAs */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase text-muted-foreground">Primary CTA</Label>
                        <Input
                            value={content.primaryCTA.text}
                            onChange={(e) => onUpdate({ 
                                primaryCTA: { ...content.primaryCTA, text: e.target.value }
                            })}
                            className="h-11 rounded-xl"
                            placeholder="Button text"
                        />
                        <Input
                            value={content.primaryCTA.link}
                            onChange={(e) => onUpdate({ 
                                primaryCTA: { ...content.primaryCTA, link: e.target.value }
                            })}
                            className="h-11 rounded-xl"
                            placeholder="/contact"
                        />
                    </div>
                    
                    <div className="space-y-3">
                        <Label className="text-xs font-black uppercase text-muted-foreground">Secondary CTA</Label>
                        <Input
                            value={content.secondaryCTA.text}
                            onChange={(e) => onUpdate({ 
                                secondaryCTA: { ...content.secondaryCTA, text: e.target.value }
                            })}
                            className="h-11 rounded-xl"
                            placeholder="Button text"
                        />
                        <Input
                            value={content.secondaryCTA.link}
                            onChange={(e) => onUpdate({ 
                                secondaryCTA: { ...content.secondaryCTA, link: e.target.value }
                            })}
                            className="h-11 rounded-xl"
                            placeholder="/portfolio"
                        />
                    </div>
                </div>
                
                {/* Media Upload */}
                <Separator />
                
                <div className="space-y-6">
                    <Label className="text-xs font-black uppercase text-muted-foreground">Background Media</Label>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Image Upload */}
                        <MediaUploadCard
                            type="image"
                            currentUrl={content.backgroundImage}
                            onUpload={(file: File) => onImageUpload(file, (url: string) => onUpdate({ backgroundImage: url }))}
                            isUploading={isUploading}
                            progress={uploadProgress}
                        />
                        
                        {/* Video Upload */}
                        <MediaUploadCard
                            type="video"
                            currentUrl={content.backgroundVideo}
                            onUpload={(file: File) => onVideoUpload(file, (url: string) => onUpdate({ backgroundVideo: url }))}
                            isUploading={isUploading}
                            progress={uploadProgress}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Services Section Editor
function ServicesEditor({ content, onUpdate }: any) {
    return (
        <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[40px] overflow-hidden">
            <CardHeader className="p-10 border-b border-border/50">
                <CardTitle className="text-2xl font-black italic">Services Section</CardTitle>
                <CardDescription className="mt-2">Manage your service offerings</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
                <div className="space-y-3">
                    <Label>Section Title</Label>
                    <Input
                        value={content.title}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        className="h-12 rounded-2xl"
                    />
                </div>
                
                <div className="space-y-3">
                    <Label>Subtitle</Label>
                    <Input
                        value={content.subtitle}
                        onChange={(e) => onUpdate({ subtitle: e.target.value })}
                        className="h-12 rounded-2xl"
                    />
                </div>
                
                {/* Service cards management would go here */}
                <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-3xl">
                    <Layout className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">Service cards editor coming soon</p>
                </div>
            </CardContent>
        </Card>
    );
}

// SEO Editor
function SEOEditor({ content, onUpdate, onImageUpload }: any) {
    return (
        <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[40px] overflow-hidden">
            <CardHeader className="p-10 border-b border-border/50">
                <CardTitle className="text-2xl font-black italic">SEO Settings</CardTitle>
                <CardDescription className="mt-2">Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
                <div className="space-y-3">
                    <Label>Meta Title</Label>
                    <Input
                        value={content.title}
                        onChange={(e) => onUpdate({ title: e.target.value })}
                        className="h-12 rounded-2xl"
                        maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground">{content.title.length}/60 characters</p>
                </div>
                
                <div className="space-y-3">
                    <Label>Meta Description</Label>
                    <Textarea
                        value={content.description}
                        onChange={(e) => onUpdate({ description: e.target.value })}
                        className="min-h-[100px] rounded-2xl"
                        maxLength={160}
                    />
                    <p className="text-xs text-muted-foreground">{content.description.length}/160 characters</p>
                </div>
                
                <div className="space-y-3">
                    <Label>Keywords (comma-separated)</Label>
                    <Input
                        value={content.keywords.join(', ')}
                        onChange={(e) => onUpdate({ keywords: e.target.value.split(',').map((k: string) => k.trim()) })}
                        className="h-12 rounded-2xl"
                    />
                </div>
                
                <div className="space-y-3">
                    <Label>Canonical URL</Label>
                    <Input
                        value={content.canonicalUrl}
                        onChange={(e) => onUpdate({ canonicalUrl: e.target.value })}
                        className="h-12 rounded-2xl"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

// Media Upload Card Component
function MediaUploadCard({ type, currentUrl, onUpload, isUploading, progress }: any) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };
    
    return (
        <div
            className={cn(
                "relative border-2 border-dashed rounded-3xl p-8 text-center transition-all",
                dragActive ? "border-primary bg-primary/5" : "border-border/50",
                currentUrl && "border-solid border-primary/20"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={type === 'image' ? 'image/*' : 'video/*'}
                onChange={handleChange}
            />
            
            {currentUrl ? (
                <div className="space-y-4">
                    {type === 'image' ? (
                        <img src={currentUrl} alt="Preview" className="w-full h-40 object-cover rounded-2xl" />
                    ) : (
                        <video src={currentUrl} className="w-full h-40 object-cover rounded-2xl" controls />
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => inputRef.current?.click()}
                        className="rounded-xl"
                    >
                        Change {type}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {type === 'image' ? (
                        <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto" />
                    ) : (
                        <Video className="w-12 h-12 text-muted-foreground mx-auto" />
                    )}
                    
                    {isUploading ? (
                        <div className="space-y-2">
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">{Math.round(progress)}% uploaded</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm font-medium">
                                Drop {type} here or click to upload
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => inputRef.current?.click()}
                                className="rounded-xl"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Choose {type}
                            </Button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

// History Dialog
function HistoryDialog({ open, onOpenChange, history }: any) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic">Content History</DialogTitle>
                    <DialogDescription>View and restore previous versions</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                        {history.map((version: any) => (
                            <Card key={version.id} className="border-border/50 rounded-2xl">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="font-bold">{new Date(version.createdAt).toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">By {version.createdBy}</p>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-xl">
                                        <RefreshCcw className="w-4 h-4 mr-2" />
                                        Restore
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
