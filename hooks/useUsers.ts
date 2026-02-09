import { useState, useCallback } from "react";
import { toast } from "sonner";
import { adminUserAPI, User } from "@/lib/api";

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<{ ltv: string; orderCount: number; ticketCount: number } | null>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async (params?: { search?: string; role?: string; isActive?: boolean }) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await adminUserAPI.getUsers(params);
            setUsers(data);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to fetch users";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchUser = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const [userData, statsData, activityData] = await Promise.all([
                adminUserAPI.getUser(id),
                adminUserAPI.getUserStats(id),
                adminUserAPI.getActivity(id)
            ]);
            setUser(userData);
            setStats(statsData);
            setActivities(activityData);
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to fetch user";
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchActivity = useCallback(async (id: string) => {
        try {
            const data = await adminUserAPI.getActivity(id);
            setActivities(data);
        } catch (err) {
            // Error handled visually
        }
    }, []);

    const updateUser = async (id: string, data: Partial<User>) => {
        try {
            const updatedUser = await adminUserAPI.updateUser(id, data);
            setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
            if (user?.id === id) setUser(updatedUser);
            toast.success("User updated successfully");
            return updatedUser;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to update user";
            toast.error(message);
            throw err;
        }
    };

    const toggleUserStatus = async (id: string) => {
        try {
            const updatedUser = await adminUserAPI.toggleUserStatus(id);
            setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
            if (user?.id === id) setUser(updatedUser);
            toast.success(`User ${updatedUser.isActive ? "activated" : "deactivated"} successfully`);
            return updatedUser;
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to update user status";
            toast.error(message);
            throw err;
        }
    };

    const deleteUser = async (id: string) => {
        try {
            await adminUserAPI.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            toast.success("User deleted successfully");
        } catch (err: any) {
            const message = err.response?.data?.message || err.message || "Failed to delete user";
            toast.error(message);
            throw err;
        }
    };

    return {
        users,
        user,
        stats,
        activities,
        isLoading,
        error,
        fetchUsers,
        fetchUser,
        updateUser,
        toggleUserStatus,
        deleteUser,
        fetchActivity,
    };
}
