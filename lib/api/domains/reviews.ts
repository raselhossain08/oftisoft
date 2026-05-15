import { api } from "@/lib/api";
export enum ReviewStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export interface Review {
    id: string;
    user: { id: string; name: string; avatar?: string };
    product: { id: string; name: string; image?: string };
    rating: number;
    comment: string;
    status: ReviewStatus;
    helpfulCount: number;
    createdAt: string;
    updatedAt: string;
}

export const reviewsAPI = {
    createReview: async (data: { productId: string; rating: number; comment: string }): Promise<Review> => {
        const response = await api.post('/reviews', data);
        return response.data;
    },
    getReviews: async (): Promise<Review[]> => {
        const response = await api.get('/reviews');
        return response.data;
    },
    getReviewsForModeration: async (): Promise<Review[]> => {
        const response = await api.get('/reviews/moderation');
        return response.data;
    },
    getByProduct: async (productId: string): Promise<Review[]> => {
        const response = await api.get(`/reviews/${productId}`);
        return response.data;
    },
    updateReview: async (id: string, data: Partial<Review>): Promise<Review> => {
        const response = await api.patch(`/reviews/${id}`, data);
        return response.data;
    },
    deleteReview: async (id: string): Promise<void> => {
        await api.delete(`/reviews/${id}`);
    },
};
