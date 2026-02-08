import { useState, useCallback, useEffect } from "react";
import { marketingAPI } from "@/lib/api";
import { toast } from "sonner";

export function useMarketing() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [bundles, setBundles] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCoupons = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await marketingAPI.getCoupons();
            setCoupons(data);
        } catch (err) {
            console.error("Failed to fetch coupons", err);
            toast.error("Failed to load coupons");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchBundles = useCallback(async () => {
        try {
            const data = await marketingAPI.getBundles();
            setBundles(data);
        } catch (err) {
            console.error("Failed to fetch bundles", err);
        }
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            const data = await marketingAPI.getProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    }, []);

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

    useEffect(() => {
        fetchCoupons();
        fetchBundles();
        fetchProducts();
    }, [fetchCoupons, fetchBundles, fetchProducts]);

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
        isLoading,
        createCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCouponStatus,
        createBundle,
        updateBundle,
        deleteBundle,
        refresh: () => { fetchCoupons(); fetchBundles(); fetchProducts(); }
    };
}
