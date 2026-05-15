/**
 * API Client - Relies on httpOnly cookies for auth.
 * Unified client using axios (delegates to the shared instance in lib/api.ts).
 */

import { axiosClient } from "../api";

export const apiClient = axiosClient;

export const api = {
    get: async <T>(url: string, options?: any): Promise<T> => {
        const params = options?.searchParams || options?.params;
        const res = await axiosClient.get(url, { params, ...options });
        return res.data;
    },
    post: async <T>(url: string, data?: any, options?: any): Promise<T> => {
        const res = await axiosClient.post(url, data, options);
        return res.data;
    },
    put: async <T>(url: string, data?: any, options?: any): Promise<T> => {
        const res = await axiosClient.put(url, data, options);
        return res.data;
    },
    patch: async <T>(url: string, data?: any, options?: any): Promise<T> => {
        const res = await axiosClient.patch(url, data, options);
        return res.data;
    },
    delete: async <T>(url: string, options?: any): Promise<T> => {
        const res = await axiosClient.delete(url, options);
        return res.data;
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
    analytics: {
        overview: 'analytics/overview',
        revenue: 'analytics/revenue',
        traffic: 'analytics/traffic',
    },
};
