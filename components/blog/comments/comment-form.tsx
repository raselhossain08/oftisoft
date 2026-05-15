"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Reply, X } from "lucide-react";

interface CommentFormProps {
    postId: string;
    parentId?: string;
    onSubmit: (data: { content: string; parentId?: string }) => void;
    isSubmitting?: boolean;
    onCancel?: () => void;
}

export function CommentForm({ postId, parentId, onSubmit, isSubmitting, onCancel }: CommentFormProps) {
    const [content, setContent] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit({ content: content.trim(), parentId });
        setContent("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            {parentId && (
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground tracking-wide">
                        Replying to comment
                    </p>
                    {onCancel && (
                        <button type="button" onClick={onCancel} className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}
            <Textarea value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={parentId ? "Write a reply..." : "Share your thoughts..."}
                className="min-h-[80px] resize-none"
            />
            <div className="flex justify-end">
                <Button type="submit" size="sm" disabled={!content.trim() || isSubmitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {parentId ? "Reply" : "Post Comment"}
                </Button>
            </div>
        </form>
    );
}
