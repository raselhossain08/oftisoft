/**
 * Home Content React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getHomeContent,
    updateHomeContent,
    publishHomeContent,
    uploadImage,
    uploadVideo,
    getContentHistory,
    restoreContentVersion
} from '@/lib/api/home-content';
import { HomePageContent } from '@/lib/store/home-content';
import { toast } from 'sonner';

/**
 * Fetch home content
 */
export function useHomeContent() {
    return useQuery({
        queryKey: ['home-content'],
        queryFn: getHomeContent,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

/**
 * Update home content
 */
export function useUpdateHomeContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (content: Partial<HomePageContent>) => updateHomeContent(content),
        onMutate: async (newContent) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['home-content'] });

            // Snapshot previous value
            const previousContent = queryClient.getQueryData<HomePageContent>(['home-content']);

            // Optimistically update
            queryClient.setQueryData<HomePageContent>(['home-content'], (old) => ({
                ...old!,
                ...newContent,
            }));

            return { previousContent };
        },
        onError: (err, newContent, context) => {
            // Rollback on error
            if (context?.previousContent) {
                queryClient.setQueryData(['home-content'], context.previousContent);
            }
            toast.error('Failed to save changes');
        },
        onSuccess: () => {
            toast.success('Changes saved successfully');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['home-content'] });
        },
    });
}

/**
 * Publish home content
 */
export function usePublishHomeContent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: publishHomeContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['home-content'] });
            toast.success('Content published successfully!');
        },
        onError: () => {
            toast.error('Failed to publish content');
        },
    });
}

/**
 * Upload image
 */
export function useUploadImage() {
    return useMutation({
        mutationFn: (file: File) => uploadImage(file),
        onSuccess: () => {
            toast.success('Image uploaded successfully');
        },
        onError: () => {
            toast.error('Failed to upload image');
        },
    });
}

/**
 * Upload video with progress
 */
export function useUploadVideo() {
    return useMutation({
        mutationFn: ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) =>
            uploadVideo(file, onProgress),
        onSuccess: () => {
            toast.success('Video uploaded successfully');
        },
        onError: () => {
            toast.error('Failed to upload video');
        },
    });
}

/**
 * Get content history
 */
export function useContentHistory() {
    return useQuery({
        queryKey: ['home-content-history'],
        queryFn: getContentHistory,
        staleTime: 1000 * 60 * 5,
    });
}

/**
 * Restore content version
 */
export function useRestoreContentVersion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (versionId: string) => restoreContentVersion(versionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['home-content'] });
            queryClient.invalidateQueries({ queryKey: ['home-content-history'] });
            toast.success('Content restored successfully');
        },
        onError: () => {
            toast.error('Failed to restore content');
        },
    });
}
