"use client";

import { useState, useEffect, useCallback } from 'react';
import { affiliateAPI } from '@/lib/api';
import { toast } from 'sonner';

export function useAffiliate() {
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await affiliateAPI.getStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError('Failed to load affiliate intelligence.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const withdraw = async (amount: number, method: string) => {
        try {
            await affiliateAPI.withdraw({ amount, method });
            toast.success('Withdrawal request initialized successfully.');
            fetchStats(); // Refresh stats
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Withdrawal failed.');
            return false;
        }
    };

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return {
        stats,
        isLoading,
        error,
        refresh: fetchStats,
        withdraw
    };
}
