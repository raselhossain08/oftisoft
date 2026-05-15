"use client";

import { useState } from "react";
import { ThumbsUp, Reply, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CommentForm } from "./comment-form";
import type { Comment } from "@/lib/api";

interface CommentItemProps {
    comment: Comment;
    postId: string;
    onReply: (data: { content: string; parentId?: string }) => void;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
    isSubmitting?: boolean;
    currentUserId?: string;
    depth?: number;
}

export function CommentItem({ comment, postId, onReply, onLike, onDelete, isSubmitting, currentUserId, depth = 0 }: CommentItemProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const maxDepth = 3;

    return (
        <div className={`${depth > 0 ? 'ml-6 pl-4 border-l border-border' : ''}`}>
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
                                <button onClick={() => setShowReplyForm(!showReplyForm)}
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
                        {showReplyForm && (
                            <div className="mt-3">
                                <CommentForm postId={postId}
                                    parentId={comment.id}
                                    onSubmit={(data) => {
                                        onReply(data);
                                        setShowReplyForm(false);
                                    }}
                                    isSubmitting={isSubmitting}
                                    onCancel={() => setShowReplyForm(false)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {comment.parentId === null && (comment as any).replies?.map((reply: Comment) => (
                <CommentItem key={reply.id}
                    comment={reply}
                    postId={postId}
                    onReply={onReply}
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
