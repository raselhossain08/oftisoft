import { api } from "@/lib/api";
export interface PortfolioItem {
    id: string;
    title: string;
    slug: string;
    category: string;
    client: string;
    description: string;
    longDescription?: string;
    image?: string;
    screenshots?: string[];
    tags?: string[];
    gradient?: string;
    stats?: string;
    featured: boolean;
    status: string;
    order: number;
    userId?: string;
    createdAt: string;
    updatedAt: string;
}

export const portfolioAPI = {
    getAll: async (status?: string): Promise<PortfolioItem[]> => {
        const params: any = {};
        if (status) params.status = status;
        const response = await api.get('/portfolio', { params });
        return response.data;
    },
    getPublished: async (): Promise<PortfolioItem[]> => {
        const response = await api.get('/portfolio/published');
        return response.data;
    },
    getOne: async (id: string): Promise<PortfolioItem> => {
        const response = await api.get(`/portfolio/${id}`);
        return response.data;
    },
    create: async (data: Partial<PortfolioItem>): Promise<PortfolioItem> => {
        const response = await api.post('/portfolio', data);
        return response.data;
    },
    update: async (id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem> => {
        const response = await api.patch(`/portfolio/${id}`, data);
        return response.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/portfolio/${id}`);
    },
};

