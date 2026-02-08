"use client";

import { useState } from "react";
import { 
    Plus, 
    Trash2, 
    Save, 
    Globe,
    Scale,
    Clock,
    ShieldAlert,
    FileText,
    History,
    ShieldCheck,
    Lock,
    Eye,
    ChevronRight,
    SearchCode,
    Sparkles,
    RefreshCcw,
    Monitor,
    Smartphone,
    ArrowLeft
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
import { TermsPageContent, TermsSection } from "@/lib/store/terms-content";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MediaUpload } from "@/components/dashboard/media-upload";

const iconOptions = [
    { label: "Globe", value: "Globe" },
    { label: "Scale", value: "Scale" },
    { label: "Clock", value: "Clock" },
    { label: "Shield Alert", value: "ShieldAlert" },
    { label: "Lock", value: "Lock" },
    { label: "Eye", value: "Eye" },
    { label: "File Text", value: "FileText" },
    { label: "Shield Check", value: "ShieldCheck" },
];

export default function TermsContentEditor() {
    const { pageContent, isLoading, updateContent, publishContent, isUpdating, isPublishing } = usePageContent('terms');
    
    const [activeTab, setActiveTab] = useState("header");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewScale, setPreviewScale] = useState<'desktop' | 'mobile'>('desktop');
    const [localContent, setLocalContent] = useState<TermsPageContent | null>(null);

    // Initialize local content when page content loads
    useState(() => {
        if (pageContent?.content) {
            setLocalContent(pageContent.content as TermsPageContent);
        }
    });

    // Update local content when API data changes
    if (pageContent?.content && !localContent) {
        setLocalContent(pageContent.content as TermsPageContent);
    }

    if (isLoading || !localContent) {
        return <div className="p-20 text-center font-black animate-pulse">Initializing Governance Interface...</div>;
    }

    const handleSave = () => {
        updateContent(localContent, pageContent?.status);
    };

    const handlePublish = () => {
        // Save first, then publish
        updateContent(localContent, 'published');
        publishContent();
    };

    const updateHeader = (header: Partial<TermsPageContent['header']>) => {
        setLocalContent(prev => prev ? {
            ...prev,
            header: { ...prev.header, ...header },
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const updateNavigationRail = (rail: Partial<TermsPageContent['navigationRail']>) => {
        setLocalContent(prev => prev ? {
            ...prev,
            navigationRail: { ...prev.navigationRail, ...rail },
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const addSection = (section: TermsSection) => {
        setLocalContent(prev => prev ? {
            ...prev,
            sections: [...prev.sections, section],
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const updateSection = (id: string, section: Partial<TermsSection>) => {
        setLocalContent(prev => {
            if (!prev) return null;
            const sections = prev.sections.map(s => 
                s.id === id ? { ...s, ...section } : s
            );
            return {
                ...prev,
                sections,
                lastUpdated: new Date().toISOString()
            };
        });
    };

    const deleteSection = (id: string) => {
        setLocalContent(prev => prev ? {
            ...prev,
            sections: prev.sections.filter(s => s.id !== id),
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const updateRevision = (revision: Partial<TermsPageContent['revision']>) => {
        setLocalContent(prev => prev ? {
            ...prev,
            revision: { ...prev.revision, ...revision },
            lastUpdated: new Date().toISOString()
        } : null);
    };

    const resetToDefaults = () => {
        const defaultContent: TermsPageContent = {
            header: {
                badge: "Operational Governance",
                title: "Terms of Sync.",
                description: "Legal framework and architectural governance protocols for the Oftisoft ecosystem.",
                videoUrl: ""
            },
            navigationRail: {
                title: "Nexus Sections",
                items: ["Acceptable Use Node", "Sync Obligations", "Neural Artifact Licensing", "Governance & Jurisdiction", "Fiscal Protocol"]
            },
            sections: [
                {
                    id: "access",
                    title: "Platform Architecture Access",
                    iconName: "Globe",
                    content: "By initiating a sync with Oftisoft, you are granted a revocable, non-exclusive license to utilize our high-fidelity digital artifacts and development nodes."
                }
            ],
            revision: {
                prefix: "Last Governance Update:",
                updatedAt: new Date().toLocaleDateString()
            },
            lastUpdated: new Date().toISOString()
        };
        setLocalContent(defaultContent);
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Elegant Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" asChild className="h-12 w-12 rounded-2xl">
                            <Link href="/dashboard/admin/content"><ArrowLeft className="w-5 h-5" /></Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-2xl font-black italic tracking-tight">Terms CMS</CardTitle>
                                <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-primary/5 text-primary border-primary/20">
                                    Governance Node
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/60 mt-0.5 block uppercase tracking-widest font-bold">
                                Legal & Governance Interface
                            </Label>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <Button variant="outline" className="rounded-xl font-bold border-border/50" onClick={() => {
                            if(confirm("Structural reset to default artifacts?")) {
                                resetToDefaults();
                                toast.success("Governance defaults restored");
                            }
                        }}>
                             <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button variant="outline" className="rounded-xl font-bold bg-primary/5 border-primary/20 text-primary" onClick={() => setPreviewOpen(true)}>
                            <Eye className="w-4 h-4 mr-2" /> Preview
                        </Button>
                        <Button 
                            className="rounded-xl font-bold bg-muted text-foreground shadow-lg hover:bg-muted/80" 
                            onClick={handleSave}
                            disabled={isUpdating}
                        >
                            <Save className="w-4 h-4 mr-2" /> {isUpdating ? "Saving..." : "Save Draft"}
                        </Button>
                        <Button 
                            className="rounded-xl font-black italic bg-primary text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02]" 
                            onClick={handlePublish}
                            disabled={isPublishing || isUpdating}
                        >
                            <Sparkles className="w-4 h-4 mr-2 text-white" /> {isPublishing ? "Publishing..." : "Publish Live"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8 h-[calc(100vh-100px)]">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <TabsList className="bg-muted/20 backdrop-blur-xl p-1.5 rounded-[22px] h-16 w-fit border border-border/50 relative overflow-hidden shadow-2xl">
                            {[
                                { value: "header", label: "Page Header", icon: Sparkles },
                                { value: "sections", label: "Legal Artifacts", icon: Scale },
                                { value: "navigation", label: "Nexus Rail", icon: History },
                            ].map((tab) => (
                                <TabsTrigger 
                                    key={tab.value}
                                    value={tab.value} 
                                    className="relative z-10 rounded-[18px] h-13 gap-3 data-[state=active]:text-primary transition-all duration-500 font-black italic px-8 group data-[state=active]:bg-background/80 data-[state=active]:shadow-xl data-[state=active]:scale-[1.02] border border-transparent data-[state=active]:border-primary/10"
                                >
                                    <tab.icon className="w-4 h-4 transition-all duration-500 group-hover:scale-110 group-data-[state=active]:scale-110 group-data-[state=active]:animate-pulse" />
                                    <span className="relative">{tab.label}</span>
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-primary/20 opacity-0 group-data-[state=active]:opacity-100 transition-all duration-700 blur-[4px]" />
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="hidden lg:flex items-center gap-3 px-6 py-3 rounded-2xl bg-primary/5 border border-primary/10">
                            <Lock className="w-4 h-4 text-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase italic tracking-widest text-primary/70">Governance Sync Protocol ACTIVE</span>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 pr-4">
                        {/* HEADER TAB */}
                        <TabsContent value="header" className="m-0 focus-visible:outline-none">
                            <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/50">
                                    <CardTitle className="text-xl font-black italic">Hero Section Configuration</CardTitle>
                                    <p className="text-sm text-muted-foreground italic">Edit the primary landing metadata for the governance page.</p>
                                </CardHeader>
                                <CardContent className="p-10 space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest ml-1">Section Badge</Label>
                                            <Input 
                                                className="rounded-2xl h-14 border-border/50 bg-muted/20 font-bold italic"
                                                value={localContent.header.badge} 
                                                onChange={(e) => updateHeader({ badge: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest ml-1">Big Title Header</Label>
                                            <Input 
                                                className="rounded-2xl h-14 border-border/50 bg-muted/20 font-bold italic"
                                                value={localContent.header.title} 
                                                onChange={(e) => updateHeader({ title: e.target.value })} 
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest ml-1">Introductory Abstract</Label>
                                        <Textarea 
                                            className="rounded-3xl border-border/50 bg-muted/10 font-bold italic p-8 text-lg"
                                            rows={5}
                                            value={localContent.header.description} 
                                            onChange={(e) => updateHeader({ description: e.target.value })} 
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <MediaUpload 
                                            label="Cinematic Landing Video (Optional)" 
                                            value={localContent.header.videoUrl || ''} 
                                            onChange={(url) => updateHeader({ videoUrl: url })} 
                                            type="video"
                                            aspectRatio="video"
                                        />
                                    </div>
                                    <Separator className="opacity-50" />
                                    <div className="grid md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest ml-1">Revision Prefix Label</Label>
                                            <Input 
                                                className="rounded-2xl h-14 border-border/50 bg-muted/20 font-bold italic"
                                                value={localContent.revision.prefix} 
                                                onChange={(e) => updateRevision({ prefix: e.target.value })} 
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest ml-1">Last Updated ISO/String</Label>
                                            <div className="relative">
                                                <Input 
                                                    className="rounded-2xl h-14 border-border/50 bg-muted/20 font-bold italic pr-12"
                                                    value={localContent.revision.updatedAt} 
                                                    onChange={(e) => updateRevision({ updatedAt: e.target.value })} 
                                                />
                                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* SECTIONS TAB */}
                        <TabsContent value="sections" className="m-0 space-y-8 focus-visible:outline-none">
                            <div className="grid grid-cols-1 gap-8">
                                {localContent.sections.map((section, idx) => (
                                    <Card key={section.id} className="border-border/50 bg-card/40 backdrop-blur-md rounded-[40px] overflow-hidden group shadow-xl">
                                        <CardHeader className="p-10 border-b border-border/50 flex flex-row items-center justify-between bg-muted/5">
                                            <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner overflow-hidden">
                                                {section.iconImage ? (
                                                    <img src={section.iconImage} alt="Icon" className="w-full h-full object-cover" />
                                                ) : (() => {
                                                    const Icon = (LucideIcons as any)[section.iconName] || FileText;
                                                    return <Icon size={32} />;
                                                })()}
                                            </div>
                                            <div>
                                                <CardTitle className="text-2xl font-black italic tracking-tight">{section.title || "Untiled Artifact"}</CardTitle>
                                                <Badge variant="outline" className="text-[9px] font-black uppercase italic tracking-[0.2em] border-primary/20 text-primary/70 mt-1 px-3">NODE_{idx + 1}</Badge>
                                            </div>
                                            </div>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                className="h-12 w-12 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                onClick={() => {
                                                    if(confirm("Purge legal artifact from governance history?")) {
                                                        deleteSection(section.id);
                                                        toast.success("Governance node deconstructed");
                                                    }
                                                }}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="p-10 space-y-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest ml-1">Artifact Designation</Label>
                                                    <Input 
                                                        className="rounded-2xl h-14 border-border/50 bg-muted/20 font-bold italic text-lg"
                                                        value={section.title} 
                                                        onChange={(e) => updateSection(section.id, { title: e.target.value })} 
                                                    />
                                                </div>
                                                <div className="space-y-4">
                                                    <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest ml-1">Visual Protocol Icon</Label>
                                                    <Select 
                                                        value={section.iconName} 
                                                        onValueChange={(val) => updateSection(section.id, { iconName: val })}
                                                    >
                                                        <SelectTrigger className="rounded-2xl h-14 border-border/50 bg-muted/20 font-bold italic">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-2xl border-border/50 backdrop-blur-xl bg-background/95 p-2 shadow-3xl">
                                                            {iconOptions.map(opt => (
                                                                <SelectItem key={opt.value} value={opt.value} className="rounded-xl font-bold py-3 italic cursor-pointer">
                                                                    {opt.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-4">
                                                    <MediaUpload 
                                                        label="Artifact Visual Image (Overrides Icon)" 
                                                        value={section.iconImage || ''} 
                                                        onChange={(url) => updateSection(section.id, { iconImage: url })} 
                                                        type="image"
                                                        aspectRatio="square"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest ml-1">Legal Intelligence Corpus</Label>
                                                <Textarea 
                                                    className="rounded-[32px] border-border/50 bg-muted/10 font-bold italic p-8 leading-relaxed"
                                                    rows={8}
                                                    value={section.content} 
                                                    onChange={(e) => updateSection(section.id, { content: e.target.value })} 
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button 
                                    variant="outline" 
                                    className="border-dashed border-2 h-40 rounded-[50px] font-black italic text-2xl gap-4 hover:bg-primary/5 hover:border-primary/30 transition-all border-border/50 group"
                                    onClick={() => {
                                        const newId = `section-${Date.now()}`;
                                        addSection({
                                            id: newId,
                                            title: "Strategic Governance Node",
                                            iconName: "Lock",
                                            content: "Enter the legal intelligence for this specific governance artifact."
                                        });
                                        toast.success("New legal node forged");
                                    }}
                                >
                                    <Plus className="w-8 h-8 transition-transform group-hover:rotate-90 duration-500" /> Forge New Legal Artifact
                                </Button>
                            </div>
                        </TabsContent>

                        {/* NAVIGATION TAB */}
                        <TabsContent value="navigation" className="m-0 focus-visible:outline-none">
                            <Card className="border-border/50 bg-card/40 backdrop-blur-md rounded-[40px] overflow-hidden shadow-2xl">
                                <CardHeader className="p-10 border-b border-border/50 bg-muted/5">
                                    <div className="flex items-center gap-4">
                                        <History className="w-6 h-6 text-primary" />
                                        <div>
                                            <CardTitle className="text-xl font-black italic tracking-tight">Nexus Sidebar Rail</CardTitle>
                                            <p className="text-sm text-muted-foreground italic">Coordinate the navigation artifacts for the sticky sidebar.</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-10 space-y-10">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest ml-1">Rail Super-Header</Label>
                                        <Input 
                                            className="rounded-2xl h-14 border-border/50 bg-muted/20 font-bold italic"
                                            value={localContent.navigationRail.title} 
                                            onChange={(e) => updateNavigationRail({ title: e.target.value })} 
                                        />
                                    </div>
                                    <Separator className="opacity-50" />
                                    <div className="space-y-6">
                                        <Label className="text-[10px] font-black uppercase text-muted-foreground italic tracking-widest ml-1">Active Section Links (Comma Separated Engine)</Label>
                                        <Textarea 
                                            className="rounded-3xl border-border/50 bg-muted/10 font-bold italic p-8 min-h-[150px]"
                                            value={localContent.navigationRail.items.join(", ")} 
                                            onChange={(e) => updateNavigationRail({ 
                                                items: e.target.value.split(",").map(s => s.trim()).filter(Boolean) 
                                            })} 
                                            placeholder="Item 1, Item 2, Item 3..."
                                        />
                                        <div className="flex flex-wrap gap-3 p-6 rounded-3xl bg-background/50 border border-border/20">
                                            {localContent.navigationRail.items.length > 0 ? localContent.navigationRail.items.map((item, i) => (
                                                <Badge key={i} variant="secondary" className="px-5 py-2.5 rounded-2xl bg-primary/10 text-primary border-none font-bold italic flex items-center gap-2 group transition-all hover:bg-primary hover:text-white">
                                                    <ChevronRight className="w-3 h-3 opacity-50" />
                                                    {item}
                                                </Badge>
                                            )) : <span className="text-[10px] font-black uppercase italic text-muted-foreground/30">No active rail nodes.</span>}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-10 bg-muted/5 border-t border-border/50 flex justify-between items-center">
                                    <p className="text-[10px] font-black uppercase italic text-muted-foreground/50 tracking-widest">Nexus Rail Alpha V1.0</p>
                                    <ShieldCheck className="w-5 h-5 text-green-500/50" />
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </div>

            {/* Live Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <Monitor className={cn("w-5 h-5 cursor-pointer transition-colors", previewScale === 'desktop' ? "text-primary" : "text-muted-foreground")} onClick={() => setPreviewScale('desktop')} />
                                <Smartphone className={cn("w-5 h-5 cursor-pointer transition-colors", previewScale === 'mobile' ? "text-primary" : "text-muted-foreground")} onClick={() => setPreviewScale('mobile')} />
                                <Separator orientation="vertical" className="h-4" />
                                <CardTitle className="text-lg font-black italic">Governance Simulator</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} className="rounded-full">
                                <Plus className="w-5 h-5 rotate-45" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 bg-muted/20 p-10">
                            <div className={cn(
                                "mx-auto transition-all duration-700 bg-background shadow-2xl overflow-hidden border border-border/50",
                                previewScale === 'desktop' ? "w-[90%] rounded-[40px] min-h-[800px]" : "w-[375px] rounded-[3rem] min-h-[700px]"
                            )}>
                                {/* Simulated Terms Content */}
                                <div className="p-12 space-y-12">
                                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-black mb-8 border border-border/50">
                                        {localContent.header.videoUrl ? (
                                            <video src={localContent.header.videoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-purple-900/40 flex items-center justify-center">
                                                <Sparkles className="w-12 h-12 text-primary/30" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                                        <div className="absolute bottom-8 left-8 right-8 text-center space-y-4">
                                            <Badge className="bg-primary/20 text-primary border-none px-4 py-1.5 rounded-full font-black italic tracking-widest text-[10px]">{localContent.header.badge}</Badge>
                                            <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">{localContent.header.title}</h1>
                                        </div>
                                    </div>
                                    
                                    <div className="text-center space-y-6 pb-12 border-b border-border/30">
                                        <p className="text-lg text-muted-foreground italic max-w-2xl mx-auto">{localContent.header.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-12 max-w-3xl mx-auto">
                                        {localContent.sections.map(section => (
                                            <div key={section.id} className="space-y-4 group">
                                                <div className="flex items-center gap-4 text-primary">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center overflow-hidden">
                                                        {section.iconImage ? (
                                                            <img src={section.iconImage} alt="Icon" className="w-full h-full object-cover" />
                                                        ) : (() => {
                                                            const Icon = (LucideIcons as any)[section.iconName] || FileText;
                                                            return <Icon size={20} />;
                                                        })()}
                                                    </div>
                                                    <h3 className="text-2xl font-black italic">{section.title}</h3>
                                                </div>
                                                <p className="text-muted-foreground leading-relaxed text-lg italic">{section.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-center pt-12 border-t border-border/30 opacity-50 font-black italic text-xs uppercase tracking-[0.3em]">
                                        {localContent.revision.prefix} {localContent.revision.updatedAt}
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

