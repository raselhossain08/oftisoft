/**
 * Features Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getFeaturesContent,
    updateFeaturesContent,
    publishFeaturesContent,
} from '@/lib/api/features-content';
import type { FeaturesPageContent } from '@/lib/store/features-content';
import { toast } from 'sonner';

const QUERY_KEY = ['features-content'] as const;

/**
 * Fetch features content from API
 */
export function useFeaturesContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getFeaturesContent,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) features content
 */
export function useUpdateFeaturesContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: FeaturesPageContent) => updateFeaturesContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Features content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save features content');
        },
    });
}

/**
 * Publish features content
 */
export function usePublishFeaturesContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishFeaturesContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Features content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish features content');
        },
    });
}
