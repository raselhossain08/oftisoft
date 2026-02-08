import { useState, useCallback } from "react";
import { adminFinanceAPI } from "@/lib/api";
import { toast } from "sonner";

export function useFinance() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adminFinanceAPI.getTransactions();
            setTransactions(data);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to fetch transactions";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminFinanceAPI.getStats();
            setStats(data);
        } catch (err: any) {
            console.error("Failed to fetch stats", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        transactions,
        stats,
        isLoading,
        error,
        fetchTransactions,
        fetchStats,
    };
}
