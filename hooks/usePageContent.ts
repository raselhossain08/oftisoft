import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentAPI } from '@/lib/api';
import { toast } from 'sonner';

export function usePageContent(pageKey: string) {
    const queryClient = useQueryClient();

    const { data: pageContent, isLoading } = useQuery({
        queryKey: ['pageContent', pageKey],
        queryFn: () => contentAPI.getPageContent(pageKey),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const updateMutation = useMutation({
        mutationFn: ({ content, status }: { content: any; status?: string }) =>
            contentAPI.updatePageContent(pageKey, content, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pageContent', pageKey] });
            toast.success("Content saved successfully");
        },
        onError: () => {
            toast.error("Failed to save content");
        }
    });

    const publishMutation = useMutation({
        mutationFn: () => contentAPI.publishPageContent(pageKey),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pageContent', pageKey] });
            toast.success("Content published successfully");
        },
        onError: () => {
            toast.error("Failed to publish content");
        }
    });

    return {
        pageContent,
        isLoading,
        updateContent: (content: any, status?: string) => updateMutation.mutate({ content, status }),
        publishContent: () => publishMutation.mutate(),
        isUpdating: updateMutation.isPending,
        isPublishing: publishMutation.isPending,
    };
}
