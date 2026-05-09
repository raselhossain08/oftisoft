/**
 * Campaigns API - Frontend hooks for marketing campaigns
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import { toast } from 'sonner';

export interface Campaign {
    id: string;
    name: string;
    slug: string;
    description: string;
    type: 'email' | 'social' | 'ppc' | 'content' | 'affiliate' | 'referral';
    status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
    startDate?: string;
    endDate?: string;
    budget: number;
    spent: number;
    targetAudience?: {
        demographics?: string[];
        locations?: string[];
        interests?: string[];
        ageRange?: { min: number; max: number };
    };
    channels?: Array<{
        type: string;
        config: Record<string, any>;
    }>;
    content?: {
        subject?: string;
        headline?: string;
        body?: string;
        cta?: string;
        ctaUrl?: string;
        images?: string[];
    };
    metrics?: {
        impressions: number;
        clicks: number;
        conversions: number;
        revenue: number;
        costPerClick: number;
        costPerAcquisition: number;
        returnOnAdSpend: number;
    };
    isRecurring: boolean;
    tags?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CampaignStats {
    total: number;
    active: number;
    completed: number;
    totalBudget: number;
    totalSpent: number;
    avgROAS: number;
}

const endpoints = {
    list: 'campaigns',
    public: 'campaigns/public',
    get: (id: string) => `campaigns/${id}`,
    stats: 'campaigns/stats',
    start: (id: string) => `campaigns/${id}/start`,
    pause: (id: string) => `campaigns/${id}/pause`,
    complete: (id: string) => `campaigns/${id}/complete`,
    metrics: (id: string) => `campaigns/${id}/metrics`,
};

// Fetch all campaigns (admin)
export function useCampaigns(options?: { status?: string; type?: string }) {
    return useQuery({
        queryKey: ['campaigns', options],
        queryFn: () => api.get<Campaign[]>(endpoints.list, { params: options }),
    });
}

// Fetch public campaigns
export function usePublicCampaigns() {
    return useQuery({
        queryKey: ['campaigns', 'public'],
        queryFn: () => api.get<Campaign[]>(endpoints.public),
    });
}

// Fetch single campaign
export function useCampaign(id: string) {
    return useQuery({
        queryKey: ['campaign', id],
        queryFn: () => api.get<Campaign>(endpoints.get(id)),
        enabled: !!id,
    });
}

// Fetch campaign stats
export function useCampaignStats() {
    return useQuery({
        queryKey: ['campaigns', 'stats'],
        queryFn: () => api.get<CampaignStats>(endpoints.stats),
    });
}

// Create campaign
export function useCreateCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Campaign>) => api.post<Campaign>(endpoints.list, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            toast.success('Campaign created successfully');
        },
        onError: () => {
            toast.error('Failed to create campaign');
        },
    });
}

// Update campaign
export function useUpdateCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Campaign> }) =>
            api.put<Campaign>(endpoints.get(id), data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['campaign', id] });
            toast.success('Campaign updated successfully');
        },
        onError: () => {
            toast.error('Failed to update campaign');
        },
    });
}

// Delete campaign
export function useDeleteCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.delete(endpoints.get(id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            toast.success('Campaign deleted');
        },
        onError: () => {
            toast.error('Failed to delete campaign');
        },
    });
}

// Start campaign
export function useStartCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.put<Campaign>(endpoints.start(id)),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['campaign', id] });
            toast.success('Campaign started');
        },
        onError: () => {
            toast.error('Failed to start campaign');
        },
    });
}

// Pause campaign
export function usePauseCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.put<Campaign>(endpoints.pause(id)),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['campaign', id] });
            toast.success('Campaign paused');
        },
        onError: () => {
            toast.error('Failed to pause campaign');
        },
    });
}

// Complete campaign
export function useCompleteCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => api.put<Campaign>(endpoints.complete(id)),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['campaign', id] });
            toast.success('Campaign completed');
        },
        onError: () => {
            toast.error('Failed to complete campaign');
        },
    });
}

// Update campaign metrics
export function useUpdateCampaignMetrics() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, metrics }: { id: string; metrics: Partial<Campaign['metrics']> }) =>
            api.put<Campaign>(endpoints.metrics(id), metrics),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['campaigns'] });
            queryClient.invalidateQueries({ queryKey: ['campaign', id] });
        },
    });
}