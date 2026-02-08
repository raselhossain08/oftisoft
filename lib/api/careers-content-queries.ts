/**
 * Careers Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getCareersContent,
    updateCareersContent,
    publishCareersContent,
} from '@/lib/api/careers-content';
import type { CareersPageContent } from '@/lib/store/careers-content';
import { toast } from 'sonner';

const QUERY_KEY = ['careers-content'] as const;

/**
 * Fetch careers content from API
 */
export function useCareersContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getCareersContent,
        staleTime: 1000 * 60 * 10,
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) careers content
 */
export function useUpdateCareersContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: CareersPageContent) => updateCareersContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Careers content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save careers content');
        },
    });
}

/**
 * Publish careers content
 */
export function usePublishCareersContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishCareersContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Careers content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish careers content');
        },
    });
}
