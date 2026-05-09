"use client";

import { useState, useEffect, useCallback } from 'react';
import { analyticsAPI } from '@/lib/api';

export function useAnalytics() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async (timeRange?: 'day' | 'week' | 'month') => {
        try {
            setIsLoading(true);
            const data = await analyticsAPI.getStats(timeRange);
            setStats(data);
            setError(null);
        } catch (err) {
            setError('Failed to load analytics intelligence.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const trackVisit = useCallback(async (page: string, referrer?: string) => {
        try {
            await analyticsAPI.trackVisit({ page, referrer });
        } catch (err) {
            console.error('Analytics tracking failed:', err);
        }
    }, []);

    const trackEvent = useCallback(async (eventType: string, eventLabel?: string, page?: string, metadata?: any) => {
        try {
            await analyticsAPI.trackEvent({ eventType, eventLabel, page, metadata });
        } catch (err) {
            console.error('Event tracking failed:', err);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const refresh = useCallback((timeRange?: 'day' | 'week' | 'month') => fetchStats(timeRange), [fetchStats]);

    return {
        stats,
        isLoading,
        error,
        refresh: (tr?: 'day' | 'week' | 'month') => fetchStats(tr),
        trackVisit,
        trackEvent
    };
}
