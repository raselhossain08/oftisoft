import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsAPI, Tag } from '@/lib/api';
import { toast } from 'sonner';

export function useTags() {
    const queryClient = useQueryClient();

    const { data: tags = [], isLoading } = useQuery({
        queryKey: ['tags'],
        queryFn: tagsAPI.getTags,
    });

    const createMutation = useMutation({
        mutationFn: tagsAPI.createTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['post-tags'] });
            toast.success("Tag created");
        },
        onError: () => toast.error("Failed to create tag"),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Tag> }) => tagsAPI.updateTag(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['post-tags'] });
            toast.success("Tag updated");
        },
        onError: () => toast.error("Failed to update tag"),
    });

    const deleteMutation = useMutation({
        mutationFn: tagsAPI.deleteTag,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tags'] });
            queryClient.invalidateQueries({ queryKey: ['post-tags'] });
            toast.success("Tag deleted");
        },
        onError: () => toast.error("Failed to delete tag"),
    });

    return {
        tags: tags as Tag[],
        isLoading,
        createTag: (data: Parameters<typeof tagsAPI.createTag>[0]) => createMutation.mutate(data),
        updateTag: (id: string, data: Partial<Tag>) => updateMutation.mutate({ id, data }),
        deleteTag: (id: string) => deleteMutation.mutate(id),
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
}
