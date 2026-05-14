"use client";

import { use } from "react";
import { PostForm } from "@/components/dashboard/posts/post-form";
import { usePost } from "@/hooks/usePosts";
import { Loader2 } from "lucide-react";

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { post, isLoading } = usePost(id);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-muted-foreground">Post not found</p>
            </div>
        );
    }

    return <PostForm isEdit initialData={post} />;
}
