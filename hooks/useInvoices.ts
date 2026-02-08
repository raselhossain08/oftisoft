import { useState, useCallback, useEffect } from "react";
import { billingAPI, Transaction } from "@/lib/api";
import { toast } from "sonner";

export function useInvoices() {
    const [invoices, setInvoices] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInvoices = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await billingAPI.getTransactions();
            setInvoices(data);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to fetch invoices";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    return {
        invoices,
        isLoading,
        error,
        fetchInvoices,
    };
}
