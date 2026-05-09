import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contentAPI } from '@/lib/api';
import type { FooterContent } from '@/lib/store/footer-content';

export function useFooterContent() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['footer-content'],
        queryFn: () => contentAPI.getPageContent('footer'),
        staleTime: 1000 * 60 * 5,
    });

    // Extract content from the PageContent response
    const footerContent: FooterContent | null = data?.content || null;

    const updateMutation = useMutation({
        mutationFn: (content: FooterContent) =>
            contentAPI.updatePageContent('footer', { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['footer-content'] });
            toast.success('Footer content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save footer content');
        },
    });

    const publishMutation = useMutation({
        mutationFn: () => contentAPI.publishPageContent('footer'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['footer-content'] });
            toast.success('Footer content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish footer content');
        },
    });

    return {
        footerContent,
        isLoading,
        updateContent: (content: FooterContent) => updateMutation.mutate(content),
        publishContent: () => publishMutation.mutate(),
        isUpdating: updateMutation.isPending,
        isPublishing: publishMutation.isPending,
    };
}
