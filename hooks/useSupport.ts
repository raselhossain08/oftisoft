import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supportAPI, Ticket } from '@/lib/api';
import { toast } from 'sonner';

export function useSupport() {
    const queryClient = useQueryClient();

    const { data: tickets = [], isLoading, error, refetch } = useQuery({
        queryKey: ['support-tickets'],
        queryFn: () => supportAPI.getTickets(),
    });

    const createTicket = useMutation({
        mutationFn: supportAPI.createTicket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
            toast.success("Support ticket created successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to create support ticket");
        }
    });

    const updateTicketStatus = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => supportAPI.updateTicketStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
            toast.success("Ticket status updated");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update ticket status");
        }
    });

    const addMessage = useMutation({
        mutationFn: ({ id, content }: { id: string; content: string }) => supportAPI.addMessage(id, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['support-tickets'] });
            queryClient.invalidateQueries({ queryKey: ['ticket'] });
            toast.success("Message sent");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to send message");
        }
    });

    return {
        tickets,
        isLoading,
        error,
        fetchTickets: refetch,
        getTicket: (id: string) => supportAPI.getTicket(id), // Standalone fetcher
        createTicket: createTicket.mutate,
        createTicketAsync: createTicket.mutateAsync,
        isCreating: createTicket.isPending,
        updateTicketStatus: updateTicketStatus.mutate,
        isUpdating: updateTicketStatus.isPending,
        addMessage: addMessage.mutate,
        addMessageAsync: addMessage.mutateAsync,
        isAddingMessage: addMessage.isPending,
    };
}
