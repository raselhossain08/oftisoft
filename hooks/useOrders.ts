
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI, Order } from '@/lib/api';
import { toast } from 'sonner';

export function useOrders(orderId?: string) {
    const queryClient = useQueryClient();

    const { data: orders = [], isLoading: ordersLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: ordersAPI.getOrders,
        enabled: !orderId
    });

    const { data: order, isLoading: orderLoading } = useQuery({
        queryKey: ['orders', orderId],
        queryFn: () => ordersAPI.getOrder(orderId!),
        enabled: !!orderId
    });

    const createOrderMutation = useMutation({
        mutationFn: ordersAPI.createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success("Order created successfully");
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => ordersAPI.updateStatus(id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['orders', variables.id] });
            toast.success(`Order status updated to ${variables.status}`);
        },
    });

    const downloadInvoiceMutation = useMutation({
        mutationFn: ordersAPI.downloadInvoice,
        onSuccess: () => {
            toast.success("Invoice downloaded successfully");
        },
        onError: () => {
            toast.error("Failed to download invoice");
        }
    });

    const exportReportMutation = useMutation({
        mutationFn: ordersAPI.exportReport,
        onSuccess: () => {
            toast.success("Report exported successfully");
        },
        onError: () => {
            toast.error("Failed to export report");
        }
    });

    return {
        orders: orders as Order[],
        order: order as Order,
        isLoading: orderId ? orderLoading : ordersLoading,
        createOrder: createOrderMutation.mutate,
        updateStatus: (id: string, status: string) => updateStatusMutation.mutate({ id, status }),
        downloadInvoice: (id: string) => downloadInvoiceMutation.mutate(id),
        exportReport: () => exportReportMutation.mutate(),
        isDownloadingInvoice: downloadInvoiceMutation.isPending,
        isExportingReport: exportReportMutation.isPending,
    };
}
