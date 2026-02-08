import { useState, useCallback, useEffect } from "react";
import { billingAPI } from "@/lib/api";
import { toast } from "sonner";

export function useSubscription() {
    const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSubscription = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await billingAPI.getSubscription();
            setSubscription(data);
        } catch (err: any) {
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
        updateSubscription,
        fetchSubscription,
    };
}
