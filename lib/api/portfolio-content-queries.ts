/**
 * Portfolio Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getPortfolioContent,
    updatePortfolioContent,
    publishPortfolioContent,
} from '@/lib/api/portfolio-content';
import type { PortfolioPageContent } from '@/lib/store/portfolio-content';
import { toast } from 'sonner';

const QUERY_KEY = ['portfolio-content'] as const;

/**
 * Fetch portfolio content from API
 */
export function usePortfolioContent(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEY,
        queryFn: getPortfolioContent,
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: options?.enabled !== false,
        retry: (failureCount) => failureCount < 2,
    });
}

/**
 * Update (save) portfolio content
 */
export function useUpdatePortfolioContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: PortfolioPageContent) => updatePortfolioContent(content),
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Portfolio content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save portfolio content');
        },
    });
}

/**
 * Publish portfolio content
 */
export function usePublishPortfolioContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishPortfolioContent,
        onSuccess: (data) => {
            queryClient.setQueryData(QUERY_KEY, data);
            toast.success('Portfolio content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish portfolio content');
        },
    });
}
