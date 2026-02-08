/**
 * Partners Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPartnersContent,
    updatePartnersContent,
    publishPartnersContent,
} from '@/lib/api/partners-content';
import type { PartnersPageContent } from '@/lib/store/partners-content';
import { toast } from 'sonner';

const QUERY_KEY = ['partners-content'] as const;

/**
 * Fetch partners content from API
 */
export function usePartnersContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getPartnersContent,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) partners content
 */
export function useUpdatePartnersContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: PartnersPageContent) => updatePartnersContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Partners content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save partners content');
        },
    });
}

/**
 * Publish partners content
 */
export function usePublishPartnersContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishPartnersContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Partners content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish partners content');
        },
    });
}
