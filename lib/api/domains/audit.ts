import { api } from "@/lib/api";
export interface AuditLog {
    id: string;
    userId: string;
    userEmail: string;
    userRole: string;
    action: string;
    entity: string;
    entityId: string;
    oldValues?: any;
    newValues?: any;
    description: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
    createdAt: string;
}

export const auditAPI = {
    getAll: async (params?: { entity?: string; action?: string; userId?: string; limit?: number; offset?: number }): Promise<AuditLog[]> => {
        const response = await api.get('/audit/logs', { params });
        return response.data;
    },
    getStats: async (days?: number): Promise<any> => {
        const params: any = {};
        if (days) params.days = days;
        const response = await api.get('/audit/stats', { params });
        return response.data;
    },
};
