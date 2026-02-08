import { useState, useCallback, useEffect } from "react";
import { billingAPI, PaymentMethod } from "@/lib/api";
import { toast } from "sonner";

export function usePaymentMethods() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPaymentMethods = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await billingAPI.getPaymentMethods();
            setPaymentMethods(data);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to fetch payment methods";
            setError(message);
            // toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addPaymentMethod = async (data: Partial<PaymentMethod>) => {
        setIsLoading(true);
        try {
            const newMethod = await billingAPI.addPaymentMethod(data);
            setPaymentMethods(prev => [...prev, newMethod]);
            toast.success("Payment method added successfully");
            return newMethod;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to add payment method";
            toast.error(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const setDefaultMethod = async (id: string) => {
        setIsLoading(true);
        try {
            await billingAPI.setDefaultPaymentMethod(id);
            setPaymentMethods(prev => prev.map(m => ({
                ...m,
                isDefault: m.id === id
            })));
            toast.success("Default payment method updated");
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to set default payment method";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const deleteMethod = async (id: string) => {
        setIsLoading(true);
        try {
            await billingAPI.deletePaymentMethod(id);
            setPaymentMethods(prev => prev.filter(m => m.id !== id));
            toast.success("Payment method removed");
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to remove payment method";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    return {
        paymentMethods,
        isLoading,
        error,
        fetchPaymentMethods,
        addPaymentMethod,
        setDefaultMethod,
        deleteMethod,
    };
}
