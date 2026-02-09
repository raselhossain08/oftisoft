import { useState, useCallback } from "react";
import { adminFinanceAPI } from "@/lib/api";
import { toast } from "sonner";

export function useFinance() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [payouts, setPayouts] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [config, setConfig] = useState<any>(null);
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

    const fetchPayouts = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminFinanceAPI.getPayouts();
            setPayouts(data);
        } catch (err: any) {
            console.error("Failed to fetch payouts", err);
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

    const fetchConfig = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await adminFinanceAPI.getConfig();
            setConfig(data);
        } catch (err: any) {
            console.error("Failed to fetch config", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const processPayout = async (data: any) => {
        setIsLoading(true);
        try {
            const res = await adminFinanceAPI.processPayout(data);
            toast.success(res.message || "Payout processed");
            fetchStats();
            fetchPayouts();
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to process payout");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateConfig = async (newConfig: any) => {
        setIsLoading(true);
        try {
            await adminFinanceAPI.updateConfig(newConfig);
            toast.success("Configuration updated");
            fetchConfig();
            return true;
        } catch (err: any) {
            toast.error("Failed to update configuration");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        transactions,
        payouts,
        stats,
        config,
        isLoading,
        error,
        fetchTransactions,
        fetchPayouts,
        fetchStats,
        fetchConfig,
        processPayout,
        updateConfig,
    };
}
