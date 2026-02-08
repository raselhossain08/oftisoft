/**
 * API Client - No automatic redirect on failure
 * Errors propagate to callers; useProtectedRoute handles auth
 */

import ky from 'ky';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = ky.create({
    prefixUrl: API_BASE_URL,
    timeout: 30000,
    credentials: 'include',
    retry: {
        limit: 2,
        methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
        beforeRequest: [
            (request) => {
                request.headers.set('X-Client-Version', '1.0.0');
            },
        ],
        beforeError: [
            (error) => {
                const { response } = error;
                if (response?.body) {
                    error.name = 'APIError';
                    error.message = `${response.status}: ${response.statusText}`;
                }
                return error;
            },
        ],
    },
});

export const api = {
    get: async <T>(url: string, options?: any): Promise<T> => {
        return apiClient.get(url, options).json<T>();
    },
    post: async <T>(url: string, data?: any, options?: any): Promise<T> => {
        return apiClient.post(url, { json: data, ...options }).json<T>();
    },
    put: async <T>(url: string, data?: any, options?: any): Promise<T> => {
        return apiClient.put(url, { json: data, ...options }).json<T>();
    },
    patch: async <T>(url: string, data?: any, options?: any): Promise<T> => {
        return apiClient.patch(url, { json: data, ...options }).json<T>();
    },
    delete: async <T>(url: string, options?: any): Promise<T> => {
        return apiClient.delete(url, options).json<T>();
    },
};

export const endpoints = {
    auth: {
        login: 'auth/login',
        register: 'auth/register',
        logout: 'auth/logout',
        me: 'auth/me',
    },
    users: {
        list: 'users',
        detail: (id: string) => `users/${id}`,
        update: (id: string) => `users/${id}`,
        delete: (id: string) => `users/${id}`,
    },
    products: {
        list: 'products',
        detail: (id: string) => `products/${id}`,
        create: 'products',
        update: (id: string) => `products/${id}`,
        delete: (id: string) => `products/${id}`,
    },
    orders: {
        list: 'orders',
        detail: (id: string) => `orders/${id}`,
        create: 'orders',
        update: (id: string) => `orders/${id}`,
        stats: 'orders/stats',
    },
    content: {
        pages: 'content/pages',
        page: (id: string) => `content/pages/${id}`,
        update: (id: string) => `content/pages/${id}`,
    },
    analytics: {
        overview: 'analytics/overview',
        revenue: 'analytics/revenue',
        traffic: 'analytics/traffic',
    },
};
