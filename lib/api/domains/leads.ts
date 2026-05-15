import { api } from "@/lib/api";
export enum LeadType {
    CTA = 'cta',
    NEWSLETTER = 'newsletter',
    CONTACT = 'contact',
    PARTNER = 'partner',
}

export enum LeadStatus {
    NEW = 'new',
    IN_PROGRESS = 'in_progress',
    CONVERTED = 'converted',
    ARCHIVED = 'archived',
}

export interface Lead {
    id: string;
    name?: string;
    email: string;
    phone?: string;
    type: LeadType;
    message?: string;
    status: LeadStatus;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export const leadsAPI = {
    create: async (data: Partial<Lead>): Promise<Lead> => {
        const response = await api.post('/leads', data);
        return response.data;
    },
    subscribe: async (email: string): Promise<Lead> => {
        const response = await api.post('/leads/subscribe', { email });
        return response.data;
    },
    findAll: async (params?: { status?: LeadStatus; type?: string; page?: number; limit?: number }): Promise<Lead[]> => {
        const response = await api.get('/leads', { params });
        return response.data;
    },
    getStats: async (): Promise<any> => {
        const response = await api.get('/leads/stats');
        return response.data;
    },
    updateStatus: async (id: string, status: LeadStatus): Promise<Lead> => {
        const response = await api.patch(`/leads/${id}/status`, { status });
        return response.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/leads/${id}`);
    },
};
