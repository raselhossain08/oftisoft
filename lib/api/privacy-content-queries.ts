/**
 * Privacy Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPrivacyContent,
    updatePrivacyContent,
    publishPrivacyContent,
} from '@/lib/api/privacy-content';
import type { PrivacyPageContent } from '@/lib/store/privacy-content';
import { toast } from 'sonner';

const QUERY_KEY = ['privacy-content'] as const;

/**
 * Fetch privacy content from API
 */
export function usePrivacyContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getPrivacyContent,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) privacy content
 */
export function useUpdatePrivacyContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: PrivacyPageContent) => updatePrivacyContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Privacy content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save privacy content');
        },
    });
}

/**
 * Publish privacy content
 */
export function usePublishPrivacyContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishPrivacyContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Privacy content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish privacy content');
        },
    });
}
