/**
 * Changelog Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getChangelogContent,
    updateChangelogContent,
    publishChangelogContent,
} from '@/lib/api/changelog-content';
import type { ChangelogPageContent } from '@/lib/store/changelog-content';
import { toast } from 'sonner';

const QUERY_KEY = ['changelog-content'] as const;

/**
 * Fetch changelog content from API
 */
export function useChangelogContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getChangelogContent,
        staleTime: 1000 * 60 * 10,
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) changelog content
 */
export function useUpdateChangelogContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: ChangelogPageContent) => updateChangelogContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Changelog content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save changelog content');
        },
    });
}

/**
 * Publish changelog content
 */
export function usePublishChangelogContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishChangelogContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Changelog content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish changelog content');
        },
    });
}
