"use client";

import { useState, useEffect, useCallback } from 'react';
import { affiliateAPI } from '@/lib/api';
import { toast } from 'sonner';

export function useAffiliate() {
    const [stats, setStats] = useState<any>(null);
    const [withdrawalMethods, setWithdrawalMethods] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMethods, setIsLoadingMethods] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await affiliateAPI.getStats();
            setStats(data);
            setError(null);
        } catch (err) {
            setError('Failed to load affiliate data.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchWithdrawalMethods = useCallback(async () => {
        try {
            setIsLoadingMethods(true);
            const data = await affiliateAPI.getWithdrawalMethods();
            setWithdrawalMethods(data);
        } catch (err) {
            console.error('Failed to load withdrawal methods:', err);
        } finally {
            setIsLoadingMethods(false);
        }
    }, []);

    const withdraw = useCallback(async (amount: number, method: string, paymentDetails?: any) => {
        try {
            setIsWithdrawing(true);
            await affiliateAPI.withdraw({ amount, method, paymentDetails });
            toast.success('Withdrawal request submitted successfully.');
            await fetchStats();
            return true;
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Withdrawal failed.');
            return false;
        } finally {
            setIsWithdrawing(false);
        }
    }, [fetchStats]);

    const cancelWithdrawal = useCallback(async (id: string) => {
        try {
            await affiliateAPI.cancelWithdrawal(id);
            toast.success('Withdrawal cancelled successfully.');
            await fetchStats();
            return true;
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to cancel withdrawal.');
            return false;
        }
    }, [fetchStats]);

    useEffect(() => {
        fetchStats();
        fetchWithdrawalMethods();
    }, [fetchStats, fetchWithdrawalMethods]);

    return {
        stats,
        withdrawalMethods,
        isLoading,
        isLoadingMethods,
        isWithdrawing,
        error,
        refresh: fetchStats,
        withdraw,
        cancelWithdrawal,
    };
}
