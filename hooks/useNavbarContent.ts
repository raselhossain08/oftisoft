import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contentAPI } from '@/lib/api';
import type { NavbarContent } from '@/lib/store/navbar-content';

export function useNavbarContent() {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['navbar-content'],
        queryFn: () => contentAPI.getPageContent('navbar'),
        staleTime: 1000 * 60 * 5,
    });

    // Extract content from the PageContent response
    const navbarContent: NavbarContent | null = data?.content || null;

    const updateMutation = useMutation({
        mutationFn: (content: NavbarContent) =>
            contentAPI.updatePageContent('navbar', { content }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['navbar-content'] });
            toast.success('Navbar content saved successfully');
        },
        onError: () => {
            toast.error('Failed to save navbar content');
        },
    });

    const publishMutation = useMutation({
        mutationFn: () => contentAPI.publishPageContent('navbar'),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['navbar-content'] });
            toast.success('Navbar content published successfully');
        },
        onError: () => {
            toast.error('Failed to publish navbar content');
        },
    });

    return {
        navbarContent,
        isLoading,
        updateContent: (content: NavbarContent) => updateMutation.mutate(content),
        publishContent: () => publishMutation.mutate(),
        isUpdating: updateMutation.isPending,
        isPublishing: publishMutation.isPending,
    };
}
