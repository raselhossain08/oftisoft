/**
 * Footer Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getFooterContent,
    updateFooterContent,
    publishFooterContent,
} from '@/lib/api/footer-content';
import type { FooterContent } from '@/lib/store/footer-content';
import { toast } from 'sonner';

const QUERY_KEY = ['footer-content'] as const;

/**
 * Fetch footer content from API
 */
export function useFooterContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getFooterContent,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) footer content
 */
export function useUpdateFooterContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: FooterContent) => updateFooterContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Footer content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save footer content');
        },
    });
}

/**
 * Publish footer content
 */
export function usePublishFooterContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishFooterContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Footer content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish footer content');
        },
    });
}
