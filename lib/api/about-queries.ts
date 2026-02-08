/**
 * About Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getAboutContent,
    updateAboutContent,
    publishAboutContent,
    getAboutContentHistory,
    restoreAboutContentVersion
} from '@/lib/api/about-content';
import { AboutPageContent } from '@/lib/store/about-content';
import { toast } from 'sonner';

export function useAboutContent() {
    return useQuery({
        queryKey: ['about-content'],
        queryFn: getAboutContent,
        staleTime: 1000 * 60 * 10,
    });
}

export function useUpdateAboutContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: Partial<AboutPageContent>) => updateAboutContent(content),
        onMutate: async (newContent) => {
            await queryClient.cancelQueries({ queryKey: ['about-content'] });
            const previousContent = queryClient.getQueryData<AboutPageContent>(['about-content']);
            queryClient.setQueryData<AboutPageContent>(['about-content'], (old) => ({
                ...old!,
                ...newContent,
            }));
            return { previousContent };
        },
        onError: (err, newContent, context) => {
            if (context?.previousContent) {
                queryClient.setQueryData(['about-content'], context.previousContent);
            }
            toast.error('Failed to save changes');
        },
        onSuccess: () => {
            toast.success('Changes saved successfully');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['about-content'] });
        },
    });
}

export function usePublishAboutContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishAboutContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['about-content'] });
            toast.success('About page published successfully!');
        },
        onError: () => {
            toast.error('Failed to publish About page');
        },
    });
}

export function useAboutContentHistory() {
    return useQuery({
        queryKey: ['about-content-history'],
        queryFn: getAboutContentHistory,
        staleTime: 1000 * 60 * 5,
    });
}

export function useRestoreAboutContentVersion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (versionId: string) => restoreAboutContentVersion(versionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['about-content'] });
            queryClient.invalidateQueries({ queryKey: ['about-content-history'] });
            toast.success('Version restored successfully');
        },
        onError: () => {
            toast.error('Failed to restore version');
        },
    });
}
