/**
 * Docs Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getDocsContent,
    updateDocsContent,
    publishDocsContent,
} from '@/lib/api/docs-content';
import type { DocsPageContent } from '@/lib/store/docs-content';
import { toast } from 'sonner';

const QUERY_KEY = ['docs-content'] as const;

/**
 * Fetch docs content from API
 */
export function useDocsContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getDocsContent,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) docs content
 */
export function useUpdateDocsContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: DocsPageContent) => updateDocsContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Documentation content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save documentation content');
        },
    });
}

/**
 * Publish docs content
 */
export function usePublishDocsContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishDocsContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Documentation content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish documentation content');
        },
    });
}
