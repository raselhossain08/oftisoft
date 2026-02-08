/**
 * Services Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getServicesContent,
    updateServicesContent,
    publishServicesContent,
} from '@/lib/api/services-content';
import type { ServicesPageContent } from '@/lib/store/services-content';
import { toast } from 'sonner';

const QUERY_KEY = ['services-content'] as const;

/**
 * Fetch services content from API
 */
export function useServicesContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getServicesContent,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) services content
 */
export function useUpdateServicesContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: ServicesPageContent) => updateServicesContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Services content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save services content');
        },
    });
}

/**
 * Publish services content
 */
export function usePublishServicesContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishServicesContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Services content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish services content');
        },
    });
}
