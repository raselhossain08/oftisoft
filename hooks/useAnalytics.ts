"use client";

import { useState, useEffect, useCallback } from 'react';
import { analyticsAPI } from '@/lib/api';

export function useAnalytics() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await analyticsAPI.getStats();
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

    return {
        stats,
        isLoading,
        error,
        refresh: fetchStats,
        trackVisit,
        trackEvent
    };
}
