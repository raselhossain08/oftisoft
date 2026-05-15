import { api } from "@/lib/api";

export enum AdType {
    IMAGE = 'image',
    GOOGLE_ADS = 'google-ads',
    CUSTOM_HTML = 'custom-html',
    SCRIPT = 'script',
}

export enum AdPosition {
    BLOG_LIST_TOP = 'blog-list-top',
    BLOG_LIST_MIDDLE = 'blog-list-middle',
    BLOG_SIDEBAR = 'blog-sidebar',
    POST_CONTENT_TOP = 'post-content-top',
    POST_CONTENT_BOTTOM = 'post-content-bottom',
    FOOTER_ABOVE = 'footer-above',
}

export enum AdSize {
    LEADERBOARD = '728x90',
    BANNER = '468x60',
    SQUARE = '250x250',
    RECTANGLE = '300x250',
    SKY_SCRAPER = '120x600',
    AUTO = 'responsive',
}

export interface Ad {
    id: string;
    title: string;
    type: AdType;
    content: string;
    link?: string;
    position: AdPosition;
    size: AdSize;
    isActive: boolean;
    views: number;
    clicks: number;
    createdAt: string;
    updatedAt: string;
}

export const adsAPI = {
    getAll: async (): Promise<Ad[]> => {
        const response = await api.get('/ads');
        return response.data;
    },
    getOne: async (id: string): Promise<Ad> => {
        const response = await api.get(`/ads/${id}`);
        return response.data;
    },
    getActiveByPosition: async (position: AdPosition | string): Promise<Ad[]> => {
        const response = await api.get(`/ads/public/${position}`);
        return response.data;
    },
    create: async (data: Partial<Ad>): Promise<Ad> => {
        const response = await api.post('/ads', data);
        return response.data;
    },
    update: async (id: string, data: Partial<Ad>): Promise<Ad> => {
        const response = await api.patch(`/ads/${id}`, data);
        return response.data;
    },
    remove: async (id: string): Promise<void> => {
        await api.delete(`/ads/${id}`);
    },
    trackView: async (id: string): Promise<void> => {
        await api.post(`/ads/track-view/${id}`);
    },
    trackClick: async (id: string): Promise<void> => {
        await api.post(`/ads/track-click/${id}`);
    },
};
