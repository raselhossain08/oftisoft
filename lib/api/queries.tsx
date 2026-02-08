/**
 * React Query Configuration & Hooks
 * Provides caching, background refetching, and optimistic updates
 */

'use client';

import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { api, endpoints } from './client';

/**
 * Query Client Configuration
 * Optimized for performance with smart caching
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh
            gcTime: 1000 * 60 * 30, // 30 minutes - cache retention (formerly cacheTime)
            refetchOnWindowFocus: false, // Disable refetch on window focus for better UX
            refetchOnReconnect: true, // Refetch when internet reconnects
            retry: 1, // Retry failed requests once
        },
        mutations: {
            retry: 0, // Don't retry mutations
        },
    },
});

/**
 * Query Provider Component
 */
export function QueryProvider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

/**
 * Custom Hooks for Data Fetching
 */

// ============= PRODUCTS =============

export function useProducts(filters?: any) {
    return useQuery({
        queryKey: ['products', filters],
        queryFn: () => api.get(endpoints.products.list, { searchParams: filters }),
        staleTime: 1000 * 60 * 10, // 10 minutes for product list
    });
}

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => api.get(endpoints.products.detail(id)),
        enabled: !!id, // Only fetch if ID exists
    });
}

export function useCreateProduct() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => api.post(endpoints.products.create, data),
        onSuccess: () => {
            // Invalidate and refetch products list
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => 
            api.put(endpoints.products.update(id), data),
        onSuccess: (_, variables) => {
            // Invalidate specific product and list
            queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => api.delete(endpoints.products.delete(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

// ============= ORDERS =============

export function useOrders(filters?: any) {
    return useQuery({
        queryKey: ['orders', filters],
        queryFn: () => api.get(endpoints.orders.list, { searchParams: filters }),
    });
}

export function useOrder(id: string) {
    return useQuery({
        queryKey: ['order', id],
        queryFn: () => api.get(endpoints.orders.detail(id)),
        enabled: !!id,
    });
}

export function useCreateOrder() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => api.post(endpoints.orders.create, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
}

export function useOrderStats() {
    return useQuery({
        queryKey: ['order-stats'],
        queryFn: () => api.get(endpoints.orders.stats),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

// ============= USERS =============

export function useUsers(filters?: any) {
    return useQuery({
        queryKey: ['users', filters],
        queryFn: () => api.get(endpoints.users.list, { searchParams: filters }),
    });
}

export function useUser(id: string) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => api.get(endpoints.users.detail(id)),
        enabled: !!id,
    });
}

export function useUpdateUser() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => 
            api.put(endpoints.users.update(id), data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

// ============= CONTENT =============

export function useContentPages() {
    return useQuery({
        queryKey: ['content-pages'],
        queryFn: () => api.get(endpoints.content.pages),
        staleTime: 1000 * 60 * 15, // 15 minutes - content changes less frequently
    });
}

export function useContentPage(id: string) {
    return useQuery({
        queryKey: ['content-page', id],
        queryFn: () => api.get(endpoints.content.page(id)),
        enabled: !!id,
    });
}

export function useUpdateContentPage() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => 
            api.put(endpoints.content.update(id), data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['content-page', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['content-pages'] });
        },
    });
}

// ============= ANALYTICS =============

export function useAnalyticsOverview() {
    return useQuery({
        queryKey: ['analytics-overview'],
        queryFn: () => api.get(endpoints.analytics.overview),
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 5, // Auto-refetch every 5 minutes
    });
}

export function useRevenueAnalytics(period?: string) {
    return useQuery({
        queryKey: ['analytics-revenue', period],
        queryFn: () => api.get(endpoints.analytics.revenue, { searchParams: { period } }),
        staleTime: 1000 * 60 * 10,
    });
}

// ============= AUTH =============

export function useCurrentUser() {
    return useQuery({
        queryKey: ['current-user'],
        queryFn: () => api.get(endpoints.auth.me),
        staleTime: Infinity, // User data rarely changes during session
        retry: false, // Don't retry if unauthorized
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (credentials: { email: string; password: string }) => 
            api.post(endpoints.auth.login, credentials),
        onSuccess: (data: any) => {
            // Store token
            if (typeof window !== 'undefined' && data.token) {
                localStorage.setItem('auth_token', data.token);
            }
            // Invalidate current user to refetch
            queryClient.invalidateQueries({ queryKey: ['current-user'] });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: () => api.post(endpoints.auth.logout),
        onSuccess: () => {
            // Clear all cached data
            queryClient.clear();
            // Clear token
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
            }
        },
    });
}

/**
 * Prefetch Utilities
 * Use these for faster page transitions
 */
export const prefetch = {
    products: () => queryClient.prefetchQuery({
        queryKey: ['products'],
        queryFn: () => api.get(endpoints.products.list),
    }),
    
    orders: () => queryClient.prefetchQuery({
        queryKey: ['orders'],
        queryFn: () => api.get(endpoints.orders.list),
    }),
    
    analytics: () => queryClient.prefetchQuery({
        queryKey: ['analytics-overview'],
        queryFn: () => api.get(endpoints.analytics.overview),
    }),
};
