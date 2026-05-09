import { useState, useCallback, useEffect } from "react";
import { marketingAPI } from "@/lib/api";
import { toast } from "sonner";

export function useMarketing() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [bundles, setBundles] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchCoupons = useCallback(async () => {
        try {
            const data = await marketingAPI.getCoupons();
            setCoupons(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch coupons", err);
            setError(err instanceof Error ? err : new Error(String(err)));
            toast.error("Failed to load coupons");
        }
    }, []);

    const fetchBundles = useCallback(async () => {
        try {
            const data = await marketingAPI.getBundles();
            setBundles(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch bundles", err);
        }
    }, []);

    const fetchSubscriptionPlans = useCallback(async () => {
        try {
            const data = await marketingAPI.getSubscriptionPlans();
            setSubscriptionPlans(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch subscription plans", err);
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            const data = await marketingAPI.getProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    }, []);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        await Promise.all([fetchCoupons(), fetchBundles(), fetchSubscriptionPlans(), fetchProducts()]);
        setIsLoading(false);
    }, [fetchCoupons, fetchBundles, fetchSubscriptionPlans, fetchProducts]);

    const createCoupon = async (data: any) => {
        setIsLoading(true);
        try {
            await marketingAPI.createCoupon(data);
            toast.success("Coupon created successfully");
            fetchCoupons();
            return true;
        } catch (err) {
            console.error("Failed to create coupon", err);
            toast.error("Failed to create coupon");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const createBundle = async (data: any) => {
        setIsLoading(true);
        try {
            await marketingAPI.createBundle(data);
            toast.success("Bundle created successfully");
            fetchBundles();
            return true;
        } catch (err) {
            console.error("Failed to create bundle", err);
            toast.error("Failed to create bundle");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const createSubscriptionPlan = async (data: any) => {
        setIsLoading(true);
        try {
            await marketingAPI.createSubscriptionPlan(data);
            toast.success("Subscription Plan created successfully");
            fetchSubscriptionPlans();
            return true;
        } catch (err) {
            console.error("Failed to create subscription plan", err);
            toast.error("Failed to create subscription plan");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCoupon = async (id: string) => {
        try {
            await marketingAPI.deleteCoupon(id);
            setCoupons(prev => prev.filter(c => c.id !== id));
            toast.success("Coupon deleted");
        } catch (err) {
            console.error("Failed to delete coupon", err);
            toast.error("Failed to delete coupon");
        }
    };

    const deleteBundle = async (id: string) => {
        try {
            await marketingAPI.deleteBundle(id);
            setBundles(prev => prev.filter(b => b.id !== id));
            toast.success("Bundle deleted");
        } catch (err) {
            console.error("Failed to delete bundle", err);
            toast.error("Failed to delete bundle");
        }
    };

    const deleteSubscriptionPlan = async (id: string) => {
        try {
            await marketingAPI.deleteSubscriptionPlan(id);
            setSubscriptionPlans(prev => prev.filter(p => p.id !== id));
            toast.success("Subscription Plan deleted");
        } catch (err) {
            console.error("Failed to delete subscription plan", err);
            toast.error("Failed to delete subscription plan");
        }
    };

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    const updateCoupon = async (id: string, data: any) => {
        try {
            const updated = await marketingAPI.updateCoupon(id, data);
            setCoupons(prev => prev.map(c => c.id === id ? updated : c));
            return updated;
        } catch (err) {
            console.error("Failed to update coupon", err);
            toast.error("Failed to update coupon");
            return null;
        }
    };

    const updateBundle = async (id: string, data: any) => {
        try {
            const updated = await marketingAPI.updateBundle(id, data);
            setBundles(prev => prev.map(b => b.id === id ? updated : b));
            return updated;
        } catch (err) {
            console.error("Failed to update bundle", err);
            toast.error("Failed to update bundle");
            return null;
        }
    };

    const updateSubscriptionPlan = async (id: string, data: any) => {
        try {
            const updated = await marketingAPI.updateSubscriptionPlan(id, data);
            setSubscriptionPlans(prev => prev.map(p => p.id === id ? updated : p));
            return updated;
        } catch (err) {
            console.error("Failed to update subscription plan", err);
            toast.error("Failed to update subscription plan");
            return null;
        }
    };

    const toggleCouponStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        try {
            await updateCoupon(id, { status: newStatus });
            toast.success(`Coupon ${newStatus === 'active' ? 'activated' : 'disabled'}`);
        } catch (err) {
            console.error("Failed to toggle coupon status", err);
        }
    };

    return {
        coupons,
        bundles,
        products,
        subscriptionPlans,
        isLoading,
        error,
        isError: !!error,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        createBundle,
        updateBundle,
        deleteBundle,
        createSubscriptionPlan,
        updateSubscriptionPlan,
        deleteSubscriptionPlan,
        refresh: fetchAll,
    };
}
