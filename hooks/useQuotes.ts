import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quotesAPI, Quote } from '@/lib/api';
import { toast } from 'sonner';

export function useQuotes(quoteId?: string) {
    const queryClient = useQueryClient();

    const { data: quotes = [], isLoading: quotesLoading } = useQuery({
        queryKey: ['quotes'],
        queryFn: quotesAPI.getQuotes,
        enabled: !quoteId
    });

    const { data: quote, isLoading: quoteLoading } = useQuery({
        queryKey: ['quotes', quoteId],
        queryFn: () => quotesAPI.getQuote(quoteId!),
        enabled: !!quoteId
    });

    const createQuoteMutation = useMutation({
        mutationFn: quotesAPI.createQuote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotes'] });
            toast.success("Quote request submitted successfully");
        },
        onError: () => {
            toast.error("Failed to submit quote request");
        }
    });

    const updateQuoteMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Quote> }) => quotesAPI.updateQuote(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['quotes'] });
            queryClient.invalidateQueries({ queryKey: ['quotes', variables.id] });
            toast.success("Quote updated successfully");
        },
        onError: () => {
            toast.error("Failed to update quote");
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => quotesAPI.updateStatus(id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['quotes'] });
            queryClient.invalidateQueries({ queryKey: ['quotes', variables.id] });
            const statusText = variables.status === 'accepted' ? 'accepted' : 'declined';
            toast.success(`Proposal ${statusText} successfully`);
        },
        onError: () => {
            toast.error("Failed to update quote status");
        }
    });

    const deleteQuoteMutation = useMutation({
        mutationFn: quotesAPI.deleteQuote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quotes'] });
            toast.success("Quote deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete quote");
        }
    });

    return {
        quotes: quotes as Quote[],
        quote: quote as Quote,
        isLoading: quoteId ? quoteLoading : quotesLoading,
        createQuote: createQuoteMutation.mutate,
        updateQuote: (id: string, data: Partial<Quote>) => updateQuoteMutation.mutate({ id, data }),
        updateStatus: (id: string, status: string) => updateStatusMutation.mutate({ id, status }),
        deleteQuote: deleteQuoteMutation.mutate,
        isCreating: createQuoteMutation.isPending,
        isUpdating: updateQuoteMutation.isPending,
        isDeleting: deleteQuoteMutation.isPending,
    };
}
