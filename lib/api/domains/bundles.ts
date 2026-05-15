import { api } from "@/lib/api";
export interface Bundle {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice?: number;
    image?: string;
    features?: string[];
    products?: string[];
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const bundlesAPI = {
    getAll: async (): Promise<Bundle[]> => {
        const response = await api.get('/bundles');
        return response.data;
    },
    getOne: async (id: string): Promise<Bundle> => {
        const response = await api.get(`/bundles/${id}`);
        return response.data;
    },
    create: async (data: Partial<Bundle>): Promise<Bundle> => {
        const response = await api.post('/bundles', data);
        return response.data;
    },
    update: async (id: string, data: Partial<Bundle>): Promise<Bundle> => {
        const response = await api.patch(`/bundles/${id}`, data);
        return response.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/bundles/${id}`);
    },
};

