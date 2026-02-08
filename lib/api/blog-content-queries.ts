/**
 * Blog Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getBlogContent,
    updateBlogContent,
    publishBlogContent,
} from '@/lib/api/blog-content';
import type { BlogPageContent } from '@/lib/store/blog-content';
import { toast } from 'sonner';

const QUERY_KEY = ['blog-content'] as const;

/**
 * Fetch blog content from API
 */
export function useBlogContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getBlogContent,
        staleTime: 1000 * 60 * 10,
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) blog content
 */
export function useUpdateBlogContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: BlogPageContent) => updateBlogContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Blog content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save blog content');
        },
    });
}

/**
 * Publish blog content
 */
export function usePublishBlogContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishBlogContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Blog content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish blog content');
        },
    });
}
