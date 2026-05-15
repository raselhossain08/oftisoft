import { api } from "@/lib/api";
export interface Testimonial {
    id: string;
    name: string;
    role?: string;
    company?: string;
    quote: string;
    avatar?: string;
    rating: number;
    gradient?: string;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export const testimonialsAPI = {
    getAll: async (): Promise<Testimonial[]> => {
        const response = await api.get('/testimonials');
        return response.data;
    },
    getActive: async (): Promise<Testimonial[]> => {
        const response = await api.get('/testimonials/active');
        return response.data;
    },
    getOne: async (id: string): Promise<Testimonial> => {
        const response = await api.get(`/testimonials/${id}`);
        return response.data;
    },
    create: async (data: Partial<Testimonial>): Promise<Testimonial> => {
        const response = await api.post('/testimonials', data);
        return response.data;
    },
    update: async (id: string, data: Partial<Testimonial>): Promise<Testimonial> => {
        const response = await api.patch(`/testimonials/${id}`, data);
        return response.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/testimonials/${id}`);
    },
};

