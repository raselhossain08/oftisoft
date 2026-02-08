import { useState, useCallback, useEffect } from "react";
import { downloadsAPI } from "@/lib/api";
import { toast } from "sonner";

export function useDownloads() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const [inv, hist, notes] = await Promise.all([
                downloadsAPI.getInventory(),
                downloadsAPI.getHistory(),
                downloadsAPI.getNotifications(),
            ]);
            setInventory(inv);
            setHistory(hist);
            setNotifications(notes);
        } catch (err: any) {
            console.error("Failed to fetch downloads data", err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const recordDownload = async (id: string) => {
        try {
            await downloadsAPI.recordDownload(id);
            await fetchAll(); // Refresh history
        } catch (err: any) {
            console.error("Failed to record download", err);
        }
    };

    const getVersions = async (productId: string) => {
        try {
            return await downloadsAPI.getVersions(productId);
        } catch (err) {
            console.error("Failed to fetch versions", err);
            return [];
        }
    };

    const getChangelog = async (productId: string) => {
        try {
            return await downloadsAPI.getChangelog(productId);
        } catch (err) {
            console.error("Failed to fetch changelog", err);
            return null;
        }
    };

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return {
        inventory,
        history,
        notifications,
        isLoading,
        recordDownload,
        getVersions,
        getChangelog,
        refresh: fetchAll,
    };
}
