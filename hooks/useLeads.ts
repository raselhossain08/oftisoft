import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { leadsAPI, LeadStatus } from "@/lib/api";
import { toast } from "sonner";

export function useLeads() {
    const queryClient = useQueryClient();

    const createLeadMutation = useMutation({
        mutationFn: leadsAPI.create,
        onSuccess: () => {
            toast.success("Request received! Our team will contact you shortly.");
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    });

    const subscribeMutation = useMutation({
        mutationFn: (email: string) => leadsAPI.create({ email, type: 'newsletter' as any }),
        onSuccess: () => {
            toast.success("Successfully subscribed to our newsletter!");
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to subscribe. Please try again.");
        }
    });

    const leadsQuery = useQuery({
        queryKey: ["leads"],
        queryFn: () => leadsAPI.findAll()
    });

    const statsQuery = useQuery({
        queryKey: ["leads-stats"],
        queryFn: () => leadsAPI.getStats()
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: LeadStatus }) =>
            leadsAPI.updateStatus(id, status),
        onSuccess: () => {
            toast.success("Lead status updated.");
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        }
    });

    const deleteLeadMutation = useMutation({
        mutationFn: leadsAPI.delete,
        onSuccess: () => {
            toast.success("Lead record deleted.");
            queryClient.invalidateQueries({ queryKey: ["leads"] });
        }
    });

    return {
        createLead: createLeadMutation.mutate,
        isCreating: createLeadMutation.isPending,
        subscribe: subscribeMutation.mutate,
        isSubscribing: subscribeMutation.isPending,
        leads: leadsQuery.data,
        isLoading: leadsQuery.isLoading,
        stats: statsQuery.data,
        updateStatus: updateStatusMutation.mutate,
        deleteLead: deleteLeadMutation.mutate
    };
}
