"use client";

import { useState, useEffect, useRef } from "react";
import {
    Plus,
    Trash2,
    Save,
    FileText,
    LayoutGrid,
    Users,
    TrendingUp,
    Sparkles,
    Eye,
    Clock,
    Globe,
    ArrowLeft,
    RefreshCcw,
    Monitor,
    Smartphone,
    Search,
    Smile,
    Award,
    FileCode,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useBlogContentStore } from "@/lib/store/blog-content";
import { useBlogContent, useUpdateBlogContent } from "@/lib/api/blog-content-queries";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { MediaUpload } from "@/components/dashboard/media-upload";

export default function BlogContentEditor() {
    const {
        content,
        setContent,
        updateHero,
        addPost,
        updatePost,
        deletePost,
        addCategory,
        updateCategory,
        deleteCategory,
        addAuthor,
        updateAuthor,
        deleteAuthor,
        reset,
    } = useBlogContentStore();

    const { data: apiContent } = useBlogContent();
    const updateMutation = useUpdateBlogContent();

    const [activeTab, setActiveTab] = useState<'posts' | 'categories' | 'authors' | 'page'>('posts');
    const [editingPostId, setEditingPostId] = useState<string | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
    const [editingAuthorId, setEditingAuthorId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewScale, setPreviewScale] = useState<'desktop' | 'mobile'>('desktop');
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

    const posts = content?.posts || [];
    const categories = content?.categories || [];
    const authors = content?.authors || [];

    const handleSave = async () => {
        if (!content) return;
        await updateMutation.mutateAsync(content);
    };

    const openConfirm = (title: string, description: string, onConfirm: () => void) => {
        setConfirmDialog({ open: true, title, description, onConfirm });
    };
    const closeConfirm = () => setConfirmDialog((prev) => ({ ...prev, open: false }));
    const handleConfirm = () => {
        confirmDialog.onConfirm();
        closeConfirm();
    };

    const handleCreatePost = () => {
        const id = `post-${Date.now()}`;
        addPost({
            id,
            title: "New Architectural Journal",
            slug: "new-journal-" + Date.now(),
            excerpt: "Exposing the inner workings of modern systems...",
            content: "<h2>Introduction</h2><p>The dawn of a new era in architecture is upon us.</p>",
            coverImage: "",
            category: categories[0]?.id || "web",
            authorId: authors[0]?.id || "auth-1",
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: "5 min",
            views: "0",
            featured: false,
            status: "draft"
        });
        setEditingPostId(id);
        toast.success("Post Draft Initialized");
    };

    const handleCreateCategory = () => {
        const id = `cat-${Date.now()}`;
        addCategory({
            id,
            label: "New Domain",
            slug: "new-domain",
            icon: "Grid"
        });
        setEditingCategoryId(id);
        toast.success("New Domain mapped to categories");
    };

    const handleCreateAuthor = () => {
        const id = `auth-${Date.now()}`;
        addAuthor({
            id,
            name: "Neural Contributor",
            role: "Systems Architect",
            avatar: "",
            initials: "NC",
            bio: "Analyzing the intersections of technology and design.",
            stats: [{ label: "Articles", value: "0" }],
            tags: ["New"],
            socials: { twitter: "" }
        });
        setEditingAuthorId(id);
        toast.success("New Author profile created");
    };

    if (!content) return <div className="p-20 text-center font-black animate-pulse">Initializing Neural Interface...</div>;

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
                                <CardTitle className="text-2xl font-black italic tracking-tight">Journal Editor</CardTitle>
                                <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter italic bg-primary/5 text-primary border-primary/20">
                                    CMS Alpha
                                </Badge>
                            </div>
                            <Label className="text-[10px] text-muted-foreground/60 mt-0.5 block uppercase tracking-widest font-bold">
                                Unified Blog Management Interface
                            </Label>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl font-bold border-border/50 hover:bg-muted/50"
                            onClick={() =>
                                openConfirm(
                                    "Reset to defaults",
                                    "Reset all blog content to defaults? This cannot be undone.",
                                    () => {
                                        reset();
                                        toast.success("Blog defaults restored");
                                    }
                                )
                            }
                        >
                            <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl font-bold bg-sky-500/5 border-sky-500/20 text-sky-500"
                            onClick={() => setPreviewOpen(true)}
                        >
                            <Eye className="w-4 h-4 mr-2" /> Live Preview
                        </Button>
                        <Button
                            size="sm"
                            className="rounded-xl font-black italic bg-sky-500 text-white shadow-lg px-6"
                            onClick={handleSave}
                            disabled={updateMutation.isPending || !content}
                        >
                            {updateMutation.isPending ? (
                                <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}{" "}
                            {updateMutation.isPending ? "Syncing…" : "Sync Repo"}
                        </Button>
                        <div className="flex bg-muted/50 p-1 rounded-2xl border border-border/50">
                            {[
                                { id: 'posts', label: 'Articles', icon: FileText },
                                { id: 'categories', label: 'Domains', icon: LayoutGrid },
                                { id: 'authors', label: 'Neural Web', icon: Users },
                                { id: 'page', label: 'Page', icon: FileCode },
                            ].map((tab) => (
                                <Button 
                                    key={tab.id}
                                    variant="ghost" 
                                    size="sm"
                                    className={cn(
                                        "rounded-xl gap-2 font-bold px-4 transition-all duration-300",
                                        activeTab === tab.id ? "bg-background text-primary shadow-sm" : "hover:bg-background/50"
                                    )}
                                    onClick={() => setActiveTab(tab.id as any)}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Sidebar / List */}
                    <div className="col-span-12 lg:col-span-4 space-y-4">
                        {activeTab === 'posts' && (
                            <Card className="rounded-[32px] overflow-hidden border-border/50 h-[800px] flex flex-col">
                                <CardHeader className="p-6 pb-2">
                                    <div className="flex items-center justify-between mb-4">
                                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Journal Entries</CardTitle>
                                        <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 bg-primary/10 text-primary hover:bg-primary/20" onClick={handleCreatePost}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                                        <Input 
                                            placeholder="Search entries..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 h-10 rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20" 
                                        />
                                    </div>
                                </CardHeader>
                                <ScrollArea className="flex-1">
                                    <div className="p-4 space-y-2">
                                        {posts.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((post) => (
                                            <Button
                                                key={post.id}
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-start h-auto p-4 rounded-2xl items-start flex-col gap-1 transition-all duration-300 text-left",
                                                    editingPostId === post.id ? "bg-primary/10 text-primary shadow-inner" : "hover:bg-muted/50"
                                                )}
                                                onClick={() => setEditingPostId(post.id)}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-[9px] h-4 uppercase tracking-tighter">
                                                        {post.status}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-[9px] h-4 border-none opacity-50">
                                                        {post.date}
                                                    </Badge>
                                                </div>
                                                <span className="font-bold text-sm line-clamp-1">{post.title}</span>
                                                <div className="flex items-center gap-2 opacity-60 text-[10px]">
                                                    <LayoutGrid className="w-3 h-3" />
                                                    {categories.find((c) => c.id === post.category)?.label || 'Uncategorized'}
                                                    <span className="w-1 h-1 rounded-full bg-current opacity-20" />
                                                    <Clock className="w-3 h-3" />
                                                    {post.readTime}
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </Card>
                        )}

                        {activeTab === 'categories' && (
                            <Card className="rounded-[32px] overflow-hidden border-border/50 h-[800px] flex flex-col">
                                <CardHeader className="p-6">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Content Domains</CardTitle>
                                        <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 bg-primary/10 text-primary" onClick={handleCreateCategory}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <ScrollArea className="flex-1">
                                    <div className="p-4 space-y-2">
                                        {categories.map(cat => {
                                            const Icon = (LucideIcons as any)[cat.icon || 'Grid'] || LayoutGrid;
                                            return (
                                                <Button
                                                    key={cat.id}
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full justify-start h-14 p-4 rounded-xl gap-3 transition-all",
                                                        editingCategoryId === cat.id ? "bg-primary/10 text-primary shadow-inner" : "hover:bg-muted/50"
                                                    )}
                                                    onClick={() => setEditingCategoryId(cat.id)}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-background/50 flex items-center justify-center border border-border/50 overflow-hidden">
                                                        {cat.iconImage ? <img src={cat.iconImage} className="w-full h-full object-cover" /> : <Icon className="w-4 h-4" />}
                                                    </div>
                                                    <span className="font-bold text-sm">{cat.label}</span>
                                                    <Badge variant="outline" className="ml-auto opacity-50 text-[10px] uppercase">
                                                        {cat.slug}
                                                    </Badge>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </Card>
                        )}

                        {activeTab === 'page' && (
                            <Card className="rounded-[32px] overflow-hidden border-border/50 h-fit">
                                <CardHeader className="p-6">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Page Content</CardTitle>
                                    <CardDescription className="text-xs">Edit blog page hero (title & subtitle) in the panel to the right.</CardDescription>
                                </CardHeader>
                            </Card>
                        )}

                        {activeTab === 'authors' && (
                            <Card className="rounded-[32px] overflow-hidden border-border/50 h-[800px] flex flex-col">
                                <CardHeader className="p-6">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Neural Web (Authors)</CardTitle>
                                        <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 bg-primary/10 text-primary" onClick={handleCreateAuthor}>
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <ScrollArea className="flex-1">
                                    <div className="p-4 space-y-2">
                                        {authors.map((author) => (
                                            <Button
                                                key={author.id}
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-start h-auto p-4 rounded-2xl items-start flex-col gap-1 transition-all duration-300 text-left",
                                                    editingAuthorId === author.id ? "bg-primary/10 text-primary shadow-inner" : "hover:bg-muted/50"
                                                )}
                                                onClick={() => setEditingAuthorId(author.id)}
                                            >
                                                <div className="flex items-center gap-3 w-full">
                                                    <div className="w-10 h-10 rounded-full bg-background border border-border/50 overflow-hidden flex items-center justify-center font-bold text-xs text-muted-foreground">
                                                        {author.avatar ? <img src={author.avatar} alt={author.initials} className="w-full h-full object-cover" /> : author.initials}
                                                    </div>
                                                    <div className="text-left flex-1 min-w-0">
                                                        <div className="font-black text-sm truncate">{author.name}</div>
                                                        <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest truncate">{author.role}</div>
                                                    </div>
                                                </div>
                                            </Button>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </Card>
                        )}
                    </div>

                    {/* Main Editor Panel */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                        {activeTab === 'posts' && editingPostId && (
                            <Card className="rounded-[40px] overflow-hidden border-border/50">
                                <CardHeader className="p-8 border-b bg-card/50 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="font-mono text-[10px] opacity-40">{editingPostId}</Badge>
                                        <CardTitle className="text-lg font-black italic">Edit Journal Entry</CardTitle>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="rounded-xl gap-2 font-bold bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary" onClick={() => setPreviewOpen(true)}>
                                            <Eye className="w-4 h-4" /> Live Preview
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 rounded-xl hover:bg-red-500/10"
                                            onClick={() =>
                                                openConfirm(
                                                    "Delete journal entry",
                                                    "Remove this post from the blog? This cannot be undone.",
                                                    () => {
                                                        deletePost(editingPostId);
                                                        setEditingPostId(null);
                                                        toast.success("Entry purged from records");
                                                    }
                                                )
                                            }
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <ScrollArea className="h-[700px]">
                                    <CardContent className="p-8 space-y-8">
                                        <div className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label className="text-xs font-black uppercase tracking-widest opacity-50">Journal Title</Label>
                                                <Input 
                                                    value={posts.find((p) => p.id === editingPostId)?.title || ''} 
                                                    onChange={(e) => updatePost(editingPostId, { title: e.target.value })}
                                                    className="h-14 rounded-2xl text-lg font-bold bg-muted/20 border-border/50"
                                                />
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest opacity-50">Global Slug (SEO)</Label>
                                                    <div className="flex items-center h-12 rounded-xl bg-muted/20 border border-border/50 px-4 gap-2">
                                                        <Globe className="w-3 h-3 opacity-30" />
                                                        <span className="text-[10px] opacity-30 font-mono">/blog/</span>
                                                        <input 
                                                            className="bg-transparent border-none outline-none flex-1 font-mono text-sm"
                                                            value={posts.find((p) => p.id === editingPostId)?.slug || ''} 
                                                            onChange={(e) => updatePost(editingPostId, { slug: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest opacity-50">Status</Label>
                                                    <Select 
                                                        value={posts.find((p) => p.id === editingPostId)?.status || 'draft'} 
                                                        onValueChange={(val) => updatePost(editingPostId, { status: val as 'published' | 'draft' })}
                                                    >
                                                        <SelectTrigger className="h-12 rounded-xl border-border/50">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl">
                                                            <SelectItem value="draft">Draft Protocol</SelectItem>
                                                            <SelectItem value="published">Production Live</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-xs font-black uppercase tracking-widest opacity-50">Article Abstract</Label>
                                                <Textarea 
                                                    value={posts.find((p) => p.id === editingPostId)?.excerpt || ''} 
                                                    onChange={(e) => updatePost(editingPostId, { excerpt: e.target.value })}
                                                    className="rounded-2xl min-h-[100px] bg-muted/10 border-border/50"
                                                />
                                            </div>
                                        </div>

                                        <Separator className="opacity-50" />

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest opacity-50">Domain Mapping</Label>
                                                <Select 
                                                    value={posts.find((p) => p.id === editingPostId)?.category || ''} 
                                                    onValueChange={(val) => updatePost(editingPostId, { category: val })}
                                                >
                                                    <SelectTrigger className="h-11 rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {categories.map(c => (
                                                            <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest opacity-50">Author ID</Label>
                                                <Select 
                                                    value={posts.find((p) => p.id === editingPostId)?.authorId || ''} 
                                                    onValueChange={(val) => updatePost(editingPostId, { authorId: val })}
                                                >
                                                    <SelectTrigger className="h-11 rounded-xl border-border/50"><SelectValue /></SelectTrigger>
                                                    <SelectContent className="rounded-xl">
                                                        {authors.map(a => (
                                                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="grid gap-2">
                                                <Label className="text-xs font-black uppercase tracking-widest opacity-50">Chronology (Date)</Label>
                                                <Input 
                                                    value={posts.find((p) => p.id === editingPostId)?.date || ''} 
                                                    onChange={(e) => updatePost(editingPostId, { date: e.target.value })}
                                                    className="h-11 rounded-xl border-border/50"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="text-xs font-black uppercase tracking-widest opacity-50">System Reading Complexity</Label>
                                                <Input 
                                                    value={posts.find((p) => p.id === editingPostId)?.readTime || ''} 
                                                    onChange={(e) => updatePost(editingPostId, { readTime: e.target.value })}
                                                    className="h-11 rounded-xl border-border/50"
                                                    placeholder="e.g., 5 min read"
                                                />
                                            </div>
                                        </div>

                                        <Separator className="opacity-50" />

                                        <div className="space-y-4">
                                            <Label className="text-xs font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
                                                <TrendingUp className="w-3 h-3" /> Algorithmic Priority
                                            </Label>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="flex items-center justify-between p-4 border rounded-2xl bg-muted/5 border-border/50 group transition-all hover:bg-primary/5">
                                                    <div className="space-y-0.5">
                                                        <Label className="font-black text-xs uppercase">Featured Node</Label>
                                                        <p className="text-[10px] text-muted-foreground font-bold">Primary hero positioning</p>
                                                    </div>
                                                    <Switch 
                                                        checked={posts.find((p) => p.id === editingPostId)?.featured || false}
                                                        onCheckedChange={(checked) => updatePost(editingPostId, { featured: checked })}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between p-4 border rounded-2xl bg-muted/5 border-border/50 group transition-all hover:bg-primary/5">
                                                    <div className="space-y-0.5">
                                                        <Label className="font-black text-xs uppercase">Popularity Index</Label>
                                                        <p className="text-[10px] text-muted-foreground font-bold">Propagate to trending list</p>
                                                    </div>
                                                    <Switch 
                                                        checked={posts.find((p) => p.id === editingPostId)?.popularResult || false}
                                                        onCheckedChange={(checked) => updatePost(editingPostId, { popularResult: checked })}
                                                    />
                                                </div>
                                            </div>
                                            {posts.find((p) => p.id === editingPostId)?.popularResult && (
                                                <div className="grid gap-2 animate-in slide-in-from-top-2 duration-300">
                                                    <Label className="text-[10px] font-black uppercase opacity-50">Trending Rank (01-99)</Label>
                                                    <Input 
                                                        value={posts.find((p) => p.id === editingPostId)?.popularRank || ''} 
                                                        onChange={(e) => updatePost(editingPostId, { popularRank: e.target.value })}
                                                        className="h-11 rounded-xl border-border/50 font-mono"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <MediaUpload 
                                                    label="Cover Image (Primary)" 
                                                    value={posts.find((p) => p.id === editingPostId)?.coverImage || ''} 
                                                    onChange={(url) => updatePost(editingPostId, { coverImage: url })} 
                                                    type="image"
                                                    aspectRatio="video"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <MediaUpload 
                                                    label="Cinematic Video (Optional)" 
                                                    value={posts.find((p) => p.id === editingPostId)?.videoUrl || ''} 
                                                    onChange={(url) => updatePost(editingPostId, { videoUrl: url })} 
                                                    type="video"
                                                    aspectRatio="video"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-xs font-black uppercase tracking-widest opacity-50">Journal Content (HTML Integration)</Label>
                                            <Textarea 
                                                value={posts.find((p) => p.id === editingPostId)?.content || ''} 
                                                onChange={(e) => updatePost(editingPostId, { content: e.target.value })}
                                                className="rounded-2xl min-h-[300px] bg-muted/5 font-mono text-sm border-border/50"
                                                placeholder="Use standard HTML markup here..."
                                            />
                                        </div>
                                    </CardContent>
                                </ScrollArea>
                            </Card>
                        )}

                        {activeTab === 'categories' && editingCategoryId && (
                            <Card className="rounded-[40px] overflow-hidden border-border/50">
                                <CardHeader className="p-8 border-b bg-card/50 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="font-mono text-[10px] opacity-40">{editingCategoryId}</Badge>
                                        <CardTitle className="text-lg font-black italic">Content Domain Configuration</CardTitle>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 rounded-xl hover:bg-red-500/10"
                                        onClick={() =>
                                            openConfirm(
                                                "Delete category",
                                                "Remove this domain from records?",
                                                () => {
                                                    deleteCategory(editingCategoryId);
                                                    setEditingCategoryId(null);
                                                    toast.success("Domain Purged");
                                                }
                                            )
                                        }
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] font-black uppercase opacity-50">Domain Label</Label>
                                        <Input 
                                            value={categories.find((c) => c.id === editingCategoryId)?.label || ''} 
                                            onChange={(e) => updateCategory(editingCategoryId, { label: e.target.value })}
                                            className="h-12 rounded-xl text-lg font-bold"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] font-black uppercase opacity-50">SEO Identifier (Slug)</Label>
                                            <Input 
                                                value={categories.find((c) => c.id === editingCategoryId)?.slug || ''} 
                                                onChange={(e) => updateCategory(editingCategoryId, { slug: e.target.value })}
                                                className="h-11 rounded-xl font-mono"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] font-black uppercase opacity-50">Lucide Glyphs (Icon Name)</Label>
                                            <div className="flex gap-3">
                                                <Input 
                                                    value={categories.find((c) => c.id === editingCategoryId)?.icon || ''} 
                                                    onChange={(e) => updateCategory(editingCategoryId, { icon: e.target.value })}
                                                    className="h-11 rounded-xl flex-1 font-mono"
                                                    placeholder="Grid, Code, Smartphone..."
                                                />
                                                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                                    {(() => {
                                                        const Icon = (LucideIcons as any)[categories.find((c) => c.id === editingCategoryId)?.icon || 'Grid'] || LayoutGrid;
                                                        return <Icon className="w-5 h-5" />;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className="opacity-50" />
                                    <div className="space-y-4">
                                        <MediaUpload 
                                            label="Domain Image Icon (Overrides Glyph)" 
                                            value={categories.find((c) => c.id === editingCategoryId)?.iconImage || ''} 
                                            onChange={(url) => updateCategory(editingCategoryId, { iconImage: url })} 
                                            type="image"
                                            aspectRatio="square"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'authors' && editingAuthorId && (
                            <Card className="rounded-[40px] overflow-hidden border-border/50">
                                <CardHeader className="p-8 border-b bg-card/50 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="font-mono text-[10px] opacity-40">{editingAuthorId}</Badge>
                                        <CardTitle className="text-lg font-black italic">Neural Web Profile</CardTitle>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 rounded-xl hover:bg-red-500/10"
                                        onClick={() =>
                                            openConfirm(
                                                "Delete author",
                                                "Remove this author profile?",
                                                () => {
                                                    deleteAuthor(editingAuthorId);
                                                    setEditingAuthorId(null);
                                                    toast.success("Profile Disconnected");
                                                }
                                            )
                                        }
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </CardHeader>
                                <ScrollArea className="h-[700px]">
                                    <CardContent className="p-8 space-y-8">
                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="grid gap-2">
                                                    <Label className="text-[10px] font-black uppercase opacity-50">Full Designation Name</Label>
                                                    <Input 
                                                        value={authors.find((a) => a.id === editingAuthorId)?.name || ''} 
                                                        onChange={(e) => updateAuthor(editingAuthorId, { name: e.target.value })}
                                                        className="h-12 rounded-xl text-lg font-bold"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-[10px] font-black uppercase opacity-50">Professional Role</Label>
                                                    <Input 
                                                        value={authors.find((a) => a.id === editingAuthorId)?.role || ''} 
                                                        onChange={(e) => updateAuthor(editingAuthorId, { role: e.target.value })}
                                                        className="h-11 rounded-xl"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-[10px] font-black uppercase opacity-50">Neural Initials</Label>
                                                    <Input 
                                                        value={authors.find((a) => a.id === editingAuthorId)?.initials || ''} 
                                                        onChange={(e) => updateAuthor(editingAuthorId, { initials: e.target.value })}
                                                        className="h-11 rounded-xl font-black uppercase tracking-widest text-center w-24"
                                                        maxLength={3}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                 <Label className="text-[10px] font-black uppercase opacity-50">Profile Analysis Bio</Label>
                                                 <Textarea 
                                                    value={authors.find((a) => a.id === editingAuthorId)?.bio || ''} 
                                                    onChange={(e) => updateAuthor(editingAuthorId, { bio: e.target.value })}
                                                    className="rounded-2xl min-h-[120px] bg-muted/10 border-border/50 text-sm"
                                                />
                                                <MediaUpload 
                                                    label="Neural Avatar Portrait" 
                                                    value={authors.find((a) => a.id === editingAuthorId)?.avatar || ''} 
                                                    onChange={(url) => updateAuthor(editingAuthorId, { avatar: url })} 
                                                    type="image"
                                                    aspectRatio="square"
                                                />
                                             </div>
                                        </div>

                                        <Separator className="opacity-50" />

                                        <div className="space-y-4">
                                            <Label className="text-xs font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
                                                <Award className="w-3 h-3" /> Growth Statistics
                                            </Label>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                {(authors.find((a) => a.id === editingAuthorId)?.stats || []).map((stat, idx) => (
                                                    <div key={idx} className="p-4 rounded-xl bg-muted/20 space-y-2">
                                                        <Input 
                                                            value={stat.label} 
                                                            onChange={(e) => {
                                                                const author = authors.find((a) => a.id === editingAuthorId);
                                                                if (!author) return;
                                                                const newStats = [...(author.stats || [])];
                                                                newStats[idx] = { ...newStats[idx], label: e.target.value };
                                                                updateAuthor(editingAuthorId, { stats: newStats });
                                                            }}
                                                            className="h-8 text-[10px] font-black uppercase border-none bg-transparent p-0"
                                                            placeholder="Label"
                                                        />
                                                        <Input 
                                                            value={stat.value} 
                                                            onChange={(e) => {
                                                                const author = authors.find((a) => a.id === editingAuthorId);
                                                                if (!author) return;
                                                                const newStats = [...(author.stats || [])];
                                                                newStats[idx] = { ...newStats[idx], value: e.target.value };
                                                                updateAuthor(editingAuthorId, { stats: newStats });
                                                            }}
                                                            className="h-10 text-xl font-black border-none bg-transparent p-0"
                                                            placeholder="Value"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Label className="text-xs font-black uppercase tracking-widest opacity-50 flex items-center gap-2">
                                                <Smile className="w-3 h-3" /> Neural Connect (Socials)
                                            </Label>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label className="text-[9px] uppercase font-bold opacity-30">Twitter Handle</Label>
                                                    <Input 
                                                        value={authors.find((a) => a.id === editingAuthorId)?.socials?.twitter || ''} 
                                                        onChange={(e) => {
                                                            const author = authors.find((a) => a.id === editingAuthorId);
                                                            updateAuthor(editingAuthorId, { socials: { ...author?.socials, twitter: e.target.value } });
                                                        }}
                                                        className="h-11 rounded-xl"
                                                        placeholder="@username"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label className="text-[9px] uppercase font-bold opacity-30">LinkedIn ID</Label>
                                                    <Input 
                                                        value={authors.find((a) => a.id === editingAuthorId)?.socials?.linkedin || ''} 
                                                        onChange={(e) => {
                                                            const author = authors.find((a) => a.id === editingAuthorId);
                                                            updateAuthor(editingAuthorId, { socials: { ...author?.socials, linkedin: e.target.value } });
                                                        }}
                                                        className="h-11 rounded-xl"
                                                        placeholder="linkedin-id"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </ScrollArea>
                            </Card>
                        )}

                        {activeTab === 'page' && content && (
                            <Card className="rounded-[40px] overflow-hidden border-border/50">
                                <CardHeader className="p-8 border-b bg-card/50">
                                    <CardTitle className="text-lg font-black italic">Page Header (Hero)</CardTitle>
                                    <CardDescription>Blog listing page title and subtitle.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-6">
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-black uppercase tracking-widest opacity-50">Hero Title</Label>
                                        <Input
                                            value={content.hero.title}
                                            onChange={(e) => updateHero({ title: e.target.value })}
                                            className="h-12 rounded-xl text-lg font-bold bg-muted/20 border-border/50"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-xs font-black uppercase tracking-widest opacity-50">Hero Subtitle</Label>
                                        <Textarea
                                            value={content.hero.subtitle}
                                            onChange={(e) => updateHero({ subtitle: e.target.value })}
                                            className="rounded-2xl min-h-[80px] bg-muted/10 border-border/50"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {!editingPostId && !editingCategoryId && !editingAuthorId && activeTab !== 'page' && (
                            <div className="flex flex-col items-center justify-center flex-1 min-h-[600px] text-muted-foreground/30 animate-pulse">
                                <Sparkles className="w-24 h-24 mb-6 stroke-[1]" />
                                <CardTitle className="text-xl font-black italic tracking-widest uppercase">System Standby</CardTitle>
                                <p className="text-xs font-bold mt-2">Select a node to begin architectural manipulation.</p>
                            </div>
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
                        <Button variant="outline" onClick={closeConfirm} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirm} className="rounded-xl">
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Live Preview Dialog */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 overflow-hidden border-none bg-background/50 backdrop-blur-3xl rounded-[40px]">
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-background/50">
                            <div className="flex items-center gap-4">
                                <Monitor className={cn("w-5 h-5 cursor-pointer transition-colors", previewScale === 'desktop' ? "text-primary" : "text-muted-foreground")} onClick={() => setPreviewScale('desktop')} />
                                <Smartphone className={cn("w-5 h-5 cursor-pointer transition-colors", previewScale === 'mobile' ? "text-primary" : "text-muted-foreground")} onClick={() => setPreviewScale('mobile')} />
                                <Separator orientation="vertical" className="h-4" />
                                <CardTitle className="text-lg font-black italic">Neural Web Preview</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setPreviewOpen(false)} className="rounded-full">
                                <Plus className="w-5 h-5 rotate-45" />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 bg-muted/20">
                            <div className={cn(
                                "mx-auto transition-all duration-700 bg-background shadow-2xl my-8 overflow-hidden border border-border/50",
                                previewScale === 'desktop' ? "w-[90%] rounded-[32px]" : "w-[375px] rounded-[3rem]"
                            )}>
                                {editingPostId && (() => {
                                    const post = posts.find((p) => p.id === editingPostId);
                                    if (!post) return null;
                                    const author = authors.find((a) => a.id === post.authorId);
                                    const category = categories.find((c) => c.id === post.category);
                                    
                                    return (
                                        <div className="p-0">
                                            {/* Hero Preview */}
                                            <div className="relative aspect-video w-full bg-black overflow-hidden">
                                                {post.videoUrl ? (
                                                    <video src={post.videoUrl} autoPlay loop muted className="w-full h-full object-cover opacity-60" />
                                                ) : (
                                                    <img src={post.coverImage || '/placeholder.jpg'} alt="Hero" className="w-full h-full object-cover opacity-60" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                                                <div className="absolute bottom-8 left-8 right-8">
                                                    <Badge variant="secondary" className="mb-4 bg-primary/20 backdrop-blur-md border-primary/20 text-primary">
                                                        {category?.label || 'Article'}
                                                    </Badge>
                                                    <h1 className="text-4xl md:text-6xl font-black text-white italic leading-tight">{post.title}</h1>
                                                </div>
                                            </div>
                                            
                                            {/* Content Preview */}
                                            <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-muted overflow-hidden border border-border/50">
                                                        {author?.avatar ? <img src={author.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold">{author?.initials}</div>}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold">{author?.name || 'Unknown Author'}</div>
                                                        <div className="text-xs text-muted-foreground">{post.date} • {post.readTime}</div>
                                                    </div>
                                                </div>
                                                <div className="prose prose-invert max-w-none text-muted-foreground/80 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </ScrollArea>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
