import { api } from "@/lib/api";
export interface PaymentMethod {
    id: string;
    brand: string;
    last4: string;
    expiry: string;
    isDefault: boolean;
    type: string;
    createdAt: string;
}

export interface Transaction {
    id: string;
    invoiceId: string;
    amount: string;
    type: string;
    status: string;
    createdAt: string;
    dueAt?: string;
}

export const billingAPI = {
    getPaymentMethods: async (): Promise<PaymentMethod[]> => {
        const response = await api.get('/billing/payment-methods');
        return response.data;
    },
    addPaymentMethod: async (data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
        const response = await api.post('/billing/payment-methods', data);
        return response.data;
    },
    setDefaultPaymentMethod: async (id: string): Promise<PaymentMethod> => {
        const response = await api.patch(`/billing/payment-methods/${id}/default`);
        return response.data;
    },
    deletePaymentMethod: async (id: string): Promise<void> => {
        await api.delete(`/billing/payment-methods/${id}`);
    },
    getTransactions: async (): Promise<Transaction[]> => {
        const response = await api.get('/billing/transactions');
        return response.data;
    },
    createTransaction: async (data: Partial<Transaction>): Promise<Transaction> => {
        const response = await api.post('/billing/transactions', data);
        return response.data;
    },
    getSubscription: async (): Promise<{ plan: string; status: string }> => {
        const response = await api.get('/billing/subscription');
        return response.data;
    },
    updateSubscription: async (plan: string): Promise<any> => {
        const response = await api.patch('/billing/subscription', { plan });
        return response.data;
    },
    getUsage: async (): Promise<any> => {
        const response = await api.get('/billing/usage');
        return response.data;
    },
    createPaymentIntent: async (amount: number, currency: string = 'usd'): Promise<{ clientSecret: string; id: string }> => {
        const response = await api.post('/billing/create-payment-intent', { amount, currency });
        return response.data;
    },
};

export const downloadsAPI = {
    getInventory: async (): Promise<any[]> => {
        const response = await api.get('/downloads/inventory');
        return response.data;
    },
    getHistory: async (): Promise<any[]> => {
        const response = await api.get('/downloads/history');
        return response.data;
    },
    getNotifications: async (): Promise<any[]> => {
        const response = await api.get('/downloads/notifications');
        return response.data;
    },
    recordDownload: async (id: string): Promise<any> => {
        const response = await api.post(`/downloads/${id}/record`);
        return response.data;
    },
    getVersions: async (productId: string): Promise<any[]> => {
        const response = await api.get(`/downloads/${productId}/versions`);
        return response.data;
    },
    getChangelog: async (productId: string): Promise<any> => {
        const response = await api.get(`/downloads/${productId}/changelog`);
        return response.data;
    },
};

export const favoritesAPI = {
    getFavorites: async (): Promise<any[]> => {
        const response = await api.get('/favorites');
        return response.data;
    },
    addFavorite: async (productId: string): Promise<any> => {
        const response = await api.post(`/favorites/${productId}`);
        return response.data;
    },
    removeFavorite: async (productId: string): Promise<any> => {
        const response = await api.delete(`/favorites/${productId}`);
        return response.data;
    },
    checkFavorite: async (productId: string): Promise<{ isFavorite: boolean }> => {
        const response = await api.get(`/favorites/${productId}/check`);
        return response.data;
    },
};

