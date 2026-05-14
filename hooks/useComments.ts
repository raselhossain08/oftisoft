import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsAPI } from '@/lib/api';
import { toast } from 'sonner';

export function useComments(postId?: string) {
    return useQuery({
        queryKey: ['comments', postId],
        queryFn: () => commentsAPI.getByPost(postId!),
        enabled: !!postId,
    });
}

export function useCreateComment(postId?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { content: string; parentId?: string }) =>
            commentsAPI.create(postId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
            toast.success('Comment posted');
        },
        onError: () => {
            toast.error('Failed to post comment');
        },
    });
}

export function useLikeComment() {
    return useMutation({
        mutationFn: (id: string) => commentsAPI.like(id),
    });
}

export function useDeleteComment() {
    return useMutation({
        mutationFn: (id: string) => commentsAPI.delete(id),
        onSuccess: () => {
            toast.success('Comment deleted');
        },
    });
}
