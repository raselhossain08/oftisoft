"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
    ArrowLeft,
    Save,
    Globe,
    Eye,
    Calendar,
    Image,
    Bold,
    Italic,
    List,
    ListOrdered,
    Link,
    Heading1,
    Heading2,
    Quote,
    Code,
    AlignLeft,
    X,
    Plus,
    Upload,
    FileText,
    Tag as TagIcon,
    Folder,
    ChevronDown,
    Clock,
    EyeOff,
    Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LinkNext from "next/link";
import { useRouter } from "next/navigation";
import { usePosts, usePostTags, usePostCategories } from "@/hooks/usePosts";
import { Post, Category } from "@/lib/api";
import { MediaPickerModal } from "@/components/dashboard/media-picker-modal";

interface PostFormProps {
    isEdit?: boolean;
    initialData?: Post;
}

type Visibility = "public" | "private" | "password";

export function PostForm({ isEdit, initialData }: PostFormProps) {
    const router = useRouter();
    const { createPost, updatePost, isCreating, isUpdating } = usePosts();
    const { data: tags = [] } = usePostTags();
    const { data: categories = [] } = usePostCategories();

    const editorRef = useRef<HTMLDivElement>(null);

    const [title, setTitle] = useState(initialData?.title || "");
    const [slug, setSlug] = useState(initialData?.slug || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
    const [tagInput, setTagInput] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>(
        initialData?.tags?.map(t => t.name) || []
    );
    const [status, setStatus] = useState(initialData?.status || "draft");
    const [postType, setPostType] = useState(initialData?.type || "article");
    const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage || "");
    const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
    const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");
    const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || "");
    const [keywords, setKeywords] = useState<string[]>(initialData?.keywords || []);
    const [keywordInput, setKeywordInput] = useState("");
    const [featuredImageAlt, setFeaturedImageAlt] = useState(initialData?.featuredImageAlt || "");
    const [allowComments, setAllowComments] = useState(initialData?.allowComments ?? true);
    const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
    const [isPinned, setIsPinned] = useState(initialData?.isPinned || false);
    const [isIndexed, setIsIndexed] = useState(initialData?.isIndexed ?? true);
    const [visibility, setVisibility] = useState<Visibility>("public");
    const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
        initialData?.scheduledAt ? new Date(initialData.scheduledAt) : undefined
    );
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState<"featured" | "content">("content");
    const [previewModalOpen, setPreviewModalOpen] = useState(false);

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    // Auto-generate slug
    useEffect(() => {
        if (!isEdit && title) {
            setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    }, [title, isEdit]);

    const addTag = useCallback((name: string) => {
        const trimmed = name.trim();
        if (trimmed && !selectedTags.includes(trimmed)) {
            setSelectedTags(prev => [...prev, trimmed]);
        }
        setTagInput("");
    }, [selectedTags]);

    const removeTag = useCallback((name: string) => {
        setSelectedTags(prev => prev.filter(t => t !== name));
    }, []);

    const handleEditorCommand = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
    }, []);

    const handleEditorInput = useCallback(() => {
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
    }, []);

    const insertLink = useCallback(() => {
        const url = prompt("Enter URL:");
        if (url) handleEditorCommand("createLink", url);
    }, [handleEditorCommand]);

    const insertImage = useCallback(() => {
        setMediaPickerTarget("content");
        setMediaPickerOpen(true);
    }, []);

    const handleMediaSelect = useCallback((url: string) => {
        if (mediaPickerTarget === "content") {
            handleEditorCommand("insertImage", url);
        } else {
            setFeaturedImage(url);
        }
    }, [mediaPickerTarget, handleEditorCommand]);

    const addKeyword = useCallback((kw: string) => {
        const trimmed = kw.trim().toLowerCase();
        if (trimmed && !keywords.includes(trimmed)) {
            setKeywords(prev => [...prev, trimmed]);
        }
        setKeywordInput("");
    }, [keywords]);

    const removeKeyword = useCallback((kw: string) => {
        setKeywords(prev => prev.filter(k => k !== kw));
    }, []);

    const handleSubmit = () => {
        if (!title.trim()) return;

        const postData = {
            title: title.trim(),
            slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            content,
            excerpt: excerpt.trim(),
            type: postType,
            status: scheduledDate && status === "published" ? "scheduled" : status,
            categoryId: categoryId || undefined,
            tags: selectedTags,
            featuredImage: featuredImage || undefined,
            featuredImageAlt: featuredImageAlt || undefined,
            seoTitle: seoTitle || undefined,
            seoDescription: seoDescription || undefined,
            canonicalUrl: canonicalUrl || undefined,
            keywords: keywords.length > 0 ? keywords : undefined,
            isFeatured,
            isPinned,
            isIndexed,
            allowComments,
            scheduledAt: scheduledDate?.toISOString(),
        };

        if (isEdit && initialData?.id) {
            updatePost(initialData.id, postData, {
                onSuccess: () => router.push("/dashboard/posts"),
            });
        } else {
            createPost(postData, {
                onSuccess: () => router.push("/dashboard/posts"),
            });
        }
    };

    const handlePublish = () => {
        setStatus("published");
        if (isEdit && initialData?.id) {
            updatePost(initialData.id, {
                ...getCurrentPostData(),
                status: scheduledDate ? "scheduled" : "published",
            }, {
                onSuccess: () => router.push("/dashboard/posts"),
            });
        } else {
            createPost({
                ...getCurrentPostData(),
                status: scheduledDate ? "scheduled" : "published",
            }, {
                onSuccess: () => router.push("/dashboard/posts"),
            });
        }
    };

    const getCurrentPostData = () => ({
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        content,
        excerpt: excerpt.trim(),
        type: postType,
        status,
        categoryId: categoryId || undefined,
        tags: selectedTags,
        featuredImage: featuredImage || undefined,
        featuredImageAlt: featuredImageAlt || undefined,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
        canonicalUrl: canonicalUrl || undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
        isFeatured,
        isPinned,
        isIndexed,
        allowComments,
    });

    const existingTags = tags.map((t: any) => t.name);
    const filteredTagSuggestions = existingTags.filter(
        (t: string) => !selectedTags.includes(t) && t.toLowerCase().includes(tagInput.toLowerCase())
    );

    const selectedCategory = categories.find((c: Category) => c.id === categoryId);

    if (!mounted) return null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <LinkNext href="/dashboard/posts">
                            <ArrowLeft className="w-5 h-5" />
                        </LinkNext>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{isEdit ? "Edit Post" : "New Post"}</h1>
                        <p className="text-sm text-muted-foreground">
                            {isEdit ? "Update your article content" : "Create a new article for your blog"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setPreviewModalOpen(true)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Button variant="outline" onClick={handleSubmit} disabled={isCreating || isUpdating}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                    </Button>
                    <Button onClick={handlePublish} disabled={isCreating || isUpdating}>
                        <Globe className="w-4 h-4 mr-2" />
                        {scheduledDate ? "Schedule" : "Publish"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Input placeholder="Add title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-3xl font-bold border-0 px-0 focus-visible:ring-0 h-auto py-2 placeholder:text-muted-foreground/50"
                        />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Globe className="w-3 h-3" />
                            <span>/</span>
                            <input value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs text-muted-foreground focus:text-foreground"
                                placeholder="post-url-slug"
                            />
                        </div>
                    </div>

                    {/* Rich Text Editor */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-medium">Content</CardTitle>
                                <div className="flex items-center gap-1 flex-wrap">
                                    <ToolbarButton onClick={() => handleEditorCommand("bold")} title="Bold">
                                        <Bold className="w-4 h-4" />
                                    </ToolbarButton>
                                    <ToolbarButton onClick={() => handleEditorCommand("italic")} title="Italic">
                                        <Italic className="w-4 h-4" />
                                    </ToolbarButton>
                                    <Separator orientation="vertical" className="h-5" />
                                    <ToolbarButton onClick={() => handleEditorCommand("formatBlock", "<h1>")} title="Heading 1">
                                        <Heading1 className="w-4 h-4" />
                                    </ToolbarButton>
                                    <ToolbarButton onClick={() => handleEditorCommand("formatBlock", "<h2>")} title="Heading 2">
                                        <Heading2 className="w-4 h-4" />
                                    </ToolbarButton>
                                    <ToolbarButton onClick={() => handleEditorCommand("formatBlock", "<p>")} title="Paragraph">
                                        <FileText className="w-4 h-4" />
                                    </ToolbarButton>
                                    <Separator orientation="vertical" className="h-5" />
                                    <ToolbarButton onClick={() => handleEditorCommand("insertUnorderedList")} title="Bullet List">
                                        <List className="w-4 h-4" />
                                    </ToolbarButton>
                                    <ToolbarButton onClick={() => handleEditorCommand("insertOrderedList")} title="Numbered List">
                                        <ListOrdered className="w-4 h-4" />
                                    </ToolbarButton>
                                    <Separator orientation="vertical" className="h-5" />
                                    <ToolbarButton onClick={insertLink} title="Insert Link">
                                        <Link className="w-4 h-4" />
                                    </ToolbarButton>
                                    <ToolbarButton onClick={() => handleEditorCommand("formatBlock", "<blockquote>")} title="Blockquote">
                                        <Quote className="w-4 h-4" />
                                    </ToolbarButton>
                                    <ToolbarButton onClick={() => handleEditorCommand("formatBlock", "<pre>")} title="Code">
                                        <Code className="w-4 h-4" />
                                    </ToolbarButton>
                                    <ToolbarButton onClick={insertImage} title="Insert Image">
                                        <Image className="w-4 h-4" />
                                    </ToolbarButton>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div ref={editorRef}
                                contentEditable onInput={handleEditorInput}
                                dangerouslySetInnerHTML={{ __html: content }}
                                className="min-h-[400px] p-4 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 prose prose-sm dark:prose-invert max-w-none"
                                data-placeholder="Start writing..."
                            />
                            <div className="flex items-center justify-end gap-4 mt-2 text-xs text-muted-foreground">
                                <span>{content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words</span>
                                <span>{content.replace(/<[^>]*>/g, '').length} characters</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Excerpt */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Excerpt</CardTitle>
                            <CardDescription>Write a short summary for listings and SEO</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="Brief summary of your article..."
                                className="min-h-[80px]"
                            />
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">SEO Settings</CardTitle>
                            <CardDescription>Customize how this post appears in search results</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>SEO Title</Label>
                                <Input value={seoTitle}
                                    onChange={(e) => setSeoTitle(e.target.value)}
                                    placeholder={title || "SEO title..."}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Meta Description</Label>
                                <Textarea value={seoDescription}
                                    onChange={(e) => setSeoDescription(e.target.value)}
                                    placeholder="Brief description for search engines..."
                                    className="min-h-[60px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Canonical URL</Label>
                                <Input value={canonicalUrl}
                                    onChange={(e) => setCanonicalUrl(e.target.value)}
                                    placeholder="https://oftisoft.com/blog/post-slug"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Keywords</Label>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {keywords.map((kw) => (
                                        <Badge key={kw} variant="secondary" className="gap-1">
                                            {kw}
                                            <button onClick={() => removeKeyword(kw)} className="hover:text-destructive">
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        placeholder="Add keyword..."
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addKeyword(keywordInput);
                                            }
                                        }}
                                    />
                                    <Button variant="outline" size="icon" onClick={() => addKeyword(keywordInput)}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Publish Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                Publish
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="pending_review">Pending Review</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Visibility</Label>
                                <Select value={visibility} onValueChange={(v: Visibility) => setVisibility(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="public">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4" /> Public
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="private">
                                            <div className="flex items-center gap-2">
                                                <EyeOff className="w-4 h-4" /> Private
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="password">
                                            <div className="flex items-center gap-2">
                                                <Lock className="w-4 h-4" /> Password Protected
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {status === "published" && (
                                <div className="space-y-2">
                                    <Label>Schedule Publish</Label>
                                    <Input type="datetime-local"
                                        value={scheduledDate ? scheduledDate.toISOString().slice(0, 16) : ""}
                                        onChange={(e) => setScheduledDate(e.target.value ? new Date(e.target.value) : undefined)}
                                    />
                                </div>
                            )}

                            <Separator />

                            <div className="flex items-center justify-between">
                                <Label htmlFor="featured" className="cursor-pointer">Featured Post</Label>
                                <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="pinned" className="cursor-pointer">Pinned Post</Label>
                                <Switch id="pinned" checked={isPinned} onCheckedChange={setIsPinned} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="indexed" className="cursor-pointer">Search Engine Indexed</Label>
                                <Switch id="indexed" checked={isIndexed} onCheckedChange={setIsIndexed} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="comments" className="cursor-pointer">Allow Comments</Label>
                                <Switch id="comments" checked={allowComments} onCheckedChange={setAllowComments} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Post Type */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Post Type
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={postType} onValueChange={(v) => setPostType(v as typeof postType)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="article">Article</SelectItem>
                                    <SelectItem value="tutorial">Tutorial</SelectItem>
                                    <SelectItem value="case_study">Case Study</SelectItem>
                                    <SelectItem value="news">News</SelectItem>
                                    <SelectItem value="announcement">Announcement</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Folder className="w-4 h-4" />
                                Category
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={categoryId} onValueChange={setCategoryId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Uncategorized</SelectItem>
                                    {categories.map((cat: Category) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {selectedCategory && (
                                <div className="mt-2">
                                    <Badge variant="secondary">{selectedCategory.name}</Badge>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tags */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <TagIcon className="w-4 h-4" />
                                Tags
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex flex-wrap gap-1.5">
                                {selectedTags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="gap-1">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Add tag..."
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addTag(tagInput);
                                        }
                                    }}
                                />
                                <Button variant="outline" size="icon" onClick={() => addTag(tagInput)}>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            {tagInput && filteredTagSuggestions.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {filteredTagSuggestions.slice(0, 5).map((tag: string) => (
                                        <button key={tag}
                                            onClick={() => addTag(tag)}
                                            className="text-xs text-muted-foreground hover:text-foreground bg-muted px-2 py-1 rounded-md"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Featured Image */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Image className="w-4 h-4" />
                                Featured Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {featuredImage ? (
                                <div className="relative rounded-lg overflow-hidden">
                                    <img src={featuredImage}
                                        alt={featuredImageAlt || "Featured"}
                                        className="w-full h-32 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button variant="secondary"
                                            size="sm"
                                            onClick={() => { setMediaPickerTarget("featured"); setMediaPickerOpen(true); }}
                                        >
                                            Replace
                                        </Button>
                                        <Button variant="destructive"
                                            size="sm"
                                            onClick={() => setFeaturedImage("")}
                                        >
                                            <X className="w-3 h-3 mr-1" /> Remove
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div onClick={() => { setMediaPickerTarget("featured"); setMediaPickerOpen(true); }}
                                    className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                >
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Click to choose image</p>
                                </div>
                            )}
                            {featuredImage && (
                                <Input value={featuredImageAlt}
                                    onChange={(e) => setFeaturedImageAlt(e.target.value)}
                                    placeholder="Alt text for featured image..."
                                    className="text-xs"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Media Picker Modal */}
            <MediaPickerModal open={mediaPickerOpen}
                onOpenChange={setMediaPickerOpen}
                onSelect={handleMediaSelect}
                title={mediaPickerTarget === "featured" ? "Select Featured Image" : "Insert Image"}
            />

            {/* Preview Modal */}
            <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            Preview: {title || "Untitled"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        {featuredImage && (
                            <img src={featuredImage} alt="Featured" className="w-full rounded-lg mb-6 max-h-[300px] object-cover" />
                        )}
                        <h1>{title || "Untitled"}</h1>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                            <span>{excerpt ? `${excerpt.slice(0, 100)}...` : "No excerpt"}</span>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: content || "<p>No content yet</p>" }} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ToolbarButton({
    children,
    onClick,
    title,
}: {
    children: React.ReactNode;
    onClick: () => void;
    title: string;
}) {
    return (
        <button type="button"
            onClick={onClick}
            title={title}
            className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
            {children}
        </button>
    );
}
