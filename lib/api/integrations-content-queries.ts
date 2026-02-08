/**
 * Integrations Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getIntegrationsContent,
    updateIntegrationsContent,
    publishIntegrationsContent,
} from '@/lib/api/integrations-content';
import type { IntegrationsPageContent } from '@/lib/store/integrations-content';
import { toast } from 'sonner';

const QUERY_KEY = ['integrations-content'] as const;

/**
 * Fetch integrations content from API
 */
export function useIntegrationsContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getIntegrationsContent,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) integrations content
 */
export function useUpdateIntegrationsContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: IntegrationsPageContent) => updateIntegrationsContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Integrations content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save integrations content');
        },
    });
}

/**
 * Publish integrations content
 */
export function usePublishIntegrationsContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishIntegrationsContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Integrations content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish integrations content');
        },
    });
}
