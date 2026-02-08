/**
 * Pricing Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPricingContent,
    updatePricingContent,
    publishPricingContent,
} from '@/lib/api/pricing-content';
import type { PricingPageContent } from '@/lib/store/pricing-content';
import { toast } from 'sonner';

const QUERY_KEY = ['pricing-content'] as const;

/**
 * Fetch pricing content from API
 */
export function usePricingContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getPricingContent,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) pricing content
 */
export function useUpdatePricingContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: PricingPageContent) => updatePricingContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Pricing content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save pricing content');
        },
    });
}

/**
 * Publish pricing content
 */
export function usePublishPricingContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishPricingContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Pricing content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish pricing content');
        },
    });
}
