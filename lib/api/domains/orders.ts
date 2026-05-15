import { api } from "@/lib/api";
import type { User } from "./auth";
export interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    downloadUrl?: string;
}

export interface Order {
    id: string;
    user: User;
    status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
    total: number;
    paymentMethod: string;
    items: OrderItem[];
    shippingAddress?: {
        street: string;
        city: string;
        country: string;
        zip: string;
    };
    trackingNumber?: string;
    internalNotes?: string | null;
    createdAt: string;
    updatedAt: string;
}

export const ordersAPI = {
    getOrders: async (): Promise<Order[]> => {
        const response = await api.get('/orders');
        return response.data;
    },
    getOrder: async (id: string): Promise<Order> => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
    createOrder: async (data: any): Promise<Order> => {
        const response = await api.post('/orders', data);
        return response.data;
    },
    updateStatus: async (id: string, status: string): Promise<Order> => {
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data;
    },
    updateOrder: async (id: string, data: { internalNotes?: string; trackingNumber?: string }): Promise<Order> => {
        const response = await api.patch(`/orders/${id}`, data);
        return response.data;
    },
    downloadInvoice: async (id: string): Promise<void> => {
        const response = await api.get(`/orders/${id}/invoice`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
    exportReport: async (): Promise<void> => {
        const response = await api.get('/orders/export', {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'orders_report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};
