/**
 * Community Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getCommunityContent,
    updateCommunityContent,
    publishCommunityContent,
} from '@/lib/api/community-content';
import type { CommunityPageContent } from '@/lib/store/community-content';
import { toast } from 'sonner';

const QUERY_KEY = ['community-content'] as const;

/**
 * Fetch community content from API
 */
export function useCommunityContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getCommunityContent,
        staleTime: 1000 * 60 * 10,
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) community content
 */
export function useUpdateCommunityContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: CommunityPageContent) => updateCommunityContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Community content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save community content');
        },
    });
}

/**
 * Publish community content
 */
export function usePublishCommunityContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishCommunityContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Community content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish community content');
        },
    });
}
