import { useState, useCallback, useEffect } from "react";
import { favoritesAPI } from "@/lib/api";
import { toast } from "sonner";

export function useFavorites() {
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchFavorites = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await favoritesAPI.getFavorites();
            setWishlist(data);
        } catch (err) {
            console.error("Failed to fetch favorites", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addToWishlist = async (productId: string) => {
        try {
            await favoritesAPI.addFavorite(productId);
            toast.success("Added to favorites");
            fetchFavorites();
        } catch (err) {
            console.error("Failed to add favorite", err);
            toast.error("Failed to add to favorites");
        }
    };

    const removeFromWishlist = async (productId: string) => {
        try {
            await favoritesAPI.removeFavorite(productId);
            // Optimistic update
            setWishlist(prev => prev.filter(p => p.id !== productId));
            toast.success("Removed from favorites");
        } catch (err) {
            console.error("Failed to remove favorite", err);
            toast.error("Failed to remove from favorites");
            fetchFavorites(); // Revert on error
        }
    };

    const checkIsFavorite = async (productId: string) => {
        try {
            const { isFavorite } = await favoritesAPI.checkFavorite(productId);
            return isFavorite;
        } catch (err) {
            return false;
        }
    }

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    return {
        wishlist,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        checkIsFavorite,
        refresh: fetchFavorites,
    };
}
