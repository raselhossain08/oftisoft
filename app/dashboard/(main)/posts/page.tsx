"use client";

import { useState, useCallback } from "react";
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Globe,
    FileText,
    Clock,
    CheckCircle2,
    Archive,
    AlertCircle,
    ExternalLink,
    Copy,
    EyeOff,
    RefreshCcw,
    FileSymlink,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { toast } from "sonner";
import { usePosts } from "@/hooks/usePosts";
import { Post } from "@/lib/api";
import { format } from "date-fns";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    draft: "secondary",
    pending_review: "outline",
    published: "default",
    archived: "destructive",
    scheduled: "outline",
};

const statusIcons: Record<string, any> = {
    draft: FileText,
    pending_review: Clock,
    published: Globe,
    archived: Archive,
    scheduled: Clock,
};

const PER_PAGE = 10;

export default function PostsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

    const { posts, total, stats, isLoading, deletePost, publishPost, archivePost, duplicatePost, unpublishPost, restorePost, isDeleting } = usePosts({
        search: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        limit: PER_PAGE,
        offset: (currentPage - 1) * PER_PAGE,
    });

    const totalPages = Math.ceil((total || 0) / PER_PAGE);

    const copyPostLink = useCallback((slug: string) => {
        navigator.clipboard.writeText(`${window.location.origin}/blog/${slug}`);
        toast.success("Link copied to clipboard");
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Posts</h1>
                    <p className="text-muted-foreground">Manage your blog articles and content</p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/posts/new">
                        <Plus className="w-4 h-4 mr-2" />
                        New Post
                    </Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            Total Posts
                        </div>
                        <p className="text-2xl font-bold mt-1">{stats?.total || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <Globe className="w-4 h-4" />
                            Published
                        </div>
                        <p className="text-2xl font-bold mt-1">{stats?.published || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-amber-600">
                            <FileText className="w-4 h-4" />
                            Drafts
                        </div>
                        <p className="text-2xl font-bold mt-1">{stats?.draft || 0}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            Total Views
                        </div>
                        <p className="text-2xl font-bold mt-1">{stats?.totalViews?.toLocaleString() || 0}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">All Posts</CardTitle>
                        <CardDescription>{total} total</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="pending_review">Pending Review</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[400px]">Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Views</TableHead>
                                    <TableHead className="w-[70px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Loading posts...
                                        </TableCell>
                                    </TableRow>
                                ) : posts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p>No posts found</p>
                                            <Button variant="link" asChild className="mt-2">
                                                <Link href="/dashboard/posts/new">Create your first post</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    posts.map((post) => {
                                        const StatusIcon = statusIcons[post.status] || FileText;
                                        return (
                                            <TableRow key={post.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {post.featuredImage ? (
                                                            <img
                                                                src={post.featuredImage}
                                                                alt=""
                                                                className="w-10 h-10 rounded object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                                                <FileText className="w-5 h-5 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <Link
                                                                href={`/dashboard/posts/${post.id}/edit`}
                                                                className="font-medium hover:text-primary transition-colors line-clamp-1"
                                                            >
                                                                {post.title}
                                                            </Link>
                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                                <span>{post.readTime} min read</span>
                                                                {post.tags?.slice(0, 2).map((tag) => (
                                                                    <Badge key={tag.id} variant="outline" className="text-[10px] px-1.5">
                                                                        {tag.name}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm">{post.author?.name || "Unknown"}</TableCell>
                                                <TableCell>
                                                    {post.category ? (
                                                        <Badge variant="outline">{post.category.name}</Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={statusColors[post.status] || "secondary"}>
                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                        {post.status.replace("_", " ")}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {post.publishedAt
                                                        ? format(new Date(post.publishedAt), "MMM d, yyyy")
                                                        : format(new Date(post.createdAt), "MMM d, yyyy")}
                                                </TableCell>
                                                <TableCell className="text-right text-sm">{post.views}</TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/dashboard/posts/${post.id}/edit`}>
                                                                    <Edit className="w-4 h-4 mr-2" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {post.slug && (
                                                                <DropdownMenuItem onClick={() => copyPostLink(post.slug)}>
                                                                    <Copy className="w-4 h-4 mr-2" />
                                                                    Copy Link
                                                                </DropdownMenuItem>
                                                            )}
                                                            {post.status === "published" && post.slug && (
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/blog/${post.slug}`} target="_blank">
                                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                                        View
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                            )}
                                                            {post.status !== "published" && post.status !== "archived" && (
                                                                <DropdownMenuItem onClick={() => publishPost(post.id)}>
                                                                    <Globe className="w-4 h-4 mr-2" />
                                                                    Publish
                                                                </DropdownMenuItem>
                                                            )}
                                                            {post.status === "published" && (
                                                                <DropdownMenuItem onClick={() => unpublishPost(post.id)}>
                                                                    <EyeOff className="w-4 h-4 mr-2" />
                                                                    Unpublish
                                                                </DropdownMenuItem>
                                                            )}
                                                            {post.status !== "archived" && (
                                                                <DropdownMenuItem onClick={() => archivePost(post.id)}>
                                                                    <Archive className="w-4 h-4 mr-2" />
                                                                    Archive
                                                                </DropdownMenuItem>
                                                            )}
                                                            {post.status === "archived" && (
                                                                <DropdownMenuItem onClick={() => restorePost(post.id)}>
                                                                    <RefreshCcw className="w-4 h-4 mr-2" />
                                                                    Restore
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuItem onClick={() => duplicatePost(post.id)}>
                                                                <FileSymlink className="w-4 h-4 mr-2" />
                                                                Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive"
                                                                onClick={() => setDeleteTarget(post)}
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4">
                            <p className="text-sm text-muted-foreground">
                                Showing {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, total)} of {total}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage <= 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                                </Button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? "default" : "outline"}
                                        size="sm"
                                        className="w-9"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >
                                    Next <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Post</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{deleteTarget?.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deleteTarget) {
                                    deletePost(deleteTarget.id);
                                    setDeleteTarget(null);
                                }
                            }}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
