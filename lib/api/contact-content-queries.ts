/**
 * Contact Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getContactContent,
    updateContactContent,
    publishContactContent,
} from '@/lib/api/contact-content';
import type { ContactPageContent } from '@/lib/store/contact-content';
import { toast } from 'sonner';

const QUERY_KEY = ['contact-content'] as const;

/**
 * Fetch contact content from API
 */
export function useContactContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getContactContent,
        staleTime: 1000 * 60 * 10,
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) contact content
 */
export function useUpdateContactContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: ContactPageContent) => updateContactContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Contact content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save contact content');
        },
    });
}

/**
 * Publish contact content
 */
export function usePublishContactContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishContactContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Contact content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish contact content');
        },
    });
}
