"use client";

import { useMemo, useState } from "react";
import { MessageSquare, ThumbsUp, Reply, Trash2, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useComments, useCreateComment, useLikeComment, useDeleteComment } from "@/hooks/useComments";
import { useAuthStore } from "@/store/useAuthStore";
import type { Comment } from "@/lib/api";
import { Separator } from "@/components/ui/separator";

interface CommentSectionProps {
    postId: string;
    allowComments: boolean;
}

function nestComments(comments: Comment[]): any[] {
    const map = new Map<string, any>();
    const roots: any[] = [];

    comments.forEach(c => {
        map.set(c.id, { ...c, replies: [] });
    });

    comments.forEach(c => {
        const nested = map.get(c.id);
        if (c.parentId && map.has(c.parentId)) {
            map.get(c.parentId).replies.push(nested);
        } else if (!c.parentId) {
            roots.push(nested);
        }
    });

    return roots;
}

export function CommentSection({ postId, allowComments }: CommentSectionProps) {
    const { data: comments = [], isLoading } = useComments(postId);
    const createComment = useCreateComment(postId);
    const likeComment = useLikeComment();
    const deleteComment = useDeleteComment();
    const user = useAuthStore((s) => s.user);

    const [replyTarget, setReplyTarget] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [newComment, setNewComment] = useState("");

    const nested = useMemo(() => nestComments(comments), [comments]);

    const totalComments = comments.length;

    const handlePostComment = () => {
        if (!newComment.trim()) return;
        createComment.mutate({ content: newComment.trim() });
        setNewComment("");
    };

    const handlePostReply = (parentId: string) => {
        if (!replyContent.trim()) return;
        createComment.mutate({ content: replyContent.trim(), parentId });
        setReplyContent("");
        setReplyTarget(null);
    };

    const handleLike = (id: string) => {
        likeComment.mutate(id);
    };

    const handleDelete = (id: string) => {
        deleteComment.mutate(id);
    };

    if (!allowComments) return null;

    return (
        <section className="mt-16 pt-10 border-t border-border" id="comments">
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comments
                {totalComments > 0 && (
                    <span className="text-muted-foreground text-lg font-normal">({totalComments})</span>
                )}
            </h2>

            {user ? (
                <div className="mt-8 space-y-3">
                    <Textarea value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end">
                        <Button onClick={handlePostComment} disabled={!newComment.trim() || createComment.isPending}>
                            <Send className="w-4 h-4 mr-2" />
                            Post Comment
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="mt-6 text-sm text-muted-foreground">
                    <a href="/login" className="text-primary hover:underline">Sign in</a> to leave a comment.
                </p>
            )}

            <Separator className="my-8" />

            {isLoading ? (
                <div className="text-center py-8 text-muted-foreground text-sm">Loading comments...</div>
            ) : nested.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No comments yet. Be the first to share your thoughts!
                </div>
            ) : (
                <div className="space-y-2">
                    {nested.map((comment) => (
                        <CommentThread key={comment.id}
                            comment={comment}
                            postId={postId}
                            replyTarget={replyTarget}
                            replyContent={replyContent}
                            onReplyClick={setReplyTarget}
                            onReplyContent={setReplyContent}
                            onReplySubmit={handlePostReply}
                            onLike={handleLike}
                            onDelete={handleDelete}
                            isSubmitting={createComment.isPending}
                            currentUserId={user?.id}
                            depth={0}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

interface CommentThreadProps {
    comment: any;
    postId: string;
    replyTarget: string | null;
    replyContent: string;
    onReplyClick: (id: string | null) => void;
    onReplyContent: (content: string) => void;
    onReplySubmit: (parentId: string) => void;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
    isSubmitting: boolean;
    currentUserId?: string;
    depth: number;
}

function CommentThread({ comment, postId, replyTarget, replyContent, onReplyClick, onReplyContent, onReplySubmit, onLike, onDelete, isSubmitting, currentUserId, depth }: CommentThreadProps) {
    const maxDepth = 3;
    const isReplying = replyTarget === comment.id;

    return (
        <div className={depth > 0 ? 'ml-6 pl-4 border-l border-border/50' : ''}>
            <div className="py-4">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        {comment.user?.avatarUrl ? (
                            <img src={comment.user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User className="w-4 h-4 text-muted-foreground" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold">{comment.user?.name || "Anonymous"}</span>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed">{comment.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                            <button onClick={() => onLike(comment.id)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                            >
                                <ThumbsUp className="w-3.5 h-3.5" />
                                {comment.likes > 0 && <span>{comment.likes}</span>}
                            </button>
                            {depth < maxDepth && (
                                <button onClick={() => onReplyClick(isReplying ? null : comment.id)}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Reply className="w-3.5 h-3.5" />
                                    Reply
                                </button>
                            )}
                            {currentUserId === comment.userId && (
                                <button onClick={() => onDelete(comment.id)}
                                    className="flex items-center gap-1 text-xs text-destructive hover:text-destructive/80 transition-colors ml-auto"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        {isReplying && (
                            <div className="mt-3 space-y-2">
                                <Textarea value={replyContent}
                                    onChange={(e) => onReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="min-h-[60px] resize-none text-sm"
                                />
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" size="sm" onClick={() => onReplyClick(null)}>Cancel</Button>
                                    <Button size="sm" onClick={() => onReplySubmit(comment.id)} disabled={!replyContent.trim() || isSubmitting}>
                                        <Send className="w-3 h-3 mr-1" /> Reply
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {comment.replies?.map((reply: any) => (
                <CommentThread key={reply.id}
                    comment={reply}
                    postId={postId}
                    replyTarget={replyTarget}
                    replyContent={replyContent}
                    onReplyClick={onReplyClick}
                    onReplyContent={onReplyContent}
                    onReplySubmit={onReplySubmit}
                    onLike={onLike}
                    onDelete={onDelete}
                    isSubmitting={isSubmitting}
                    currentUserId={currentUserId}
                    depth={depth + 1}
                />
            ))}
        </div>
    );
}
