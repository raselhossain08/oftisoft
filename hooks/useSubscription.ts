import { useState, useCallback, useEffect } from "react";
import { billingAPI } from "@/lib/api";
import { toast } from "sonner";

export function useSubscription() {
    const [subscription, setSubscription] = useState<{ plan: string; status: string; nextBillingDate?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSubscription = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await billingAPI.getSubscription();
            setSubscription(data);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to load subscription");
            console.error("Failed to fetch subscription", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateSubscription = async (plan: string) => {
        setIsLoading(true);
        try {
            await billingAPI.updateSubscription(plan);
            toast.success(`Upgraded to ${plan} Plan!`, {
                description: "Your new features are now unlocked."
            });
            await fetchSubscription();
        } catch (err: any) {
            const message = err.response?.data?.message || "Failed to upgrade subscription";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    return {
        subscription,
        isLoading,
        error,
        isError: !!error,
        updateSubscription,
        refetch: fetchSubscription,
    };
}
