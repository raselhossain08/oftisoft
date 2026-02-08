
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsAPI } from '@/lib/api';
import { toast } from 'sonner';

export interface Notification {
    id: string;
    type: string;
    title: string;
    description: string;
    read: boolean;
    archived: boolean;
    priority: 'high' | 'normal' | 'low';
    createdAt: string;
}

export function useNotifications() {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<'all' | 'unread' | 'high' | 'archived'>('all');

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications', filter === 'archived' ? 'archived' : 'active'],
        queryFn: () => filter === 'archived'
            ? notificationsAPI.getArchivedNotifications()
            : notificationsAPI.getNotifications(),
    });

    const markAsReadMutation = useMutation({
        mutationFn: notificationsAPI.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: notificationsAPI.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success("All caught up!", { description: "All notifications marked as read." });
        },
    });

    const archiveMutation = useMutation({
        mutationFn: notificationsAPI.archive,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.info("Notification archived");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: notificationsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success("Notification deleted permanently");
        },
    });

    const filteredNotifications = notifications.filter((n: Notification) => {
        if (filter === 'all') return !n.archived;
        if (filter === 'unread') return !n.read && !n.archived;
        if (filter === 'high') return n.priority === 'high' && !n.archived;
        if (filter === 'archived') return n.archived;
        return true;
    });

    // Stats
    const unreadCount = notifications.filter((n: Notification) => !n.read && !n.archived).length;

    return {
        notifications: filteredNotifications,
        isLoading,
        filter,
        setFilter,
        unreadCount,
        markAsRead: (id: string) => markAsReadMutation.mutate(id),
        markAllAsRead: () => markAllReadMutation.mutate(),
        archive: (id: string) => archiveMutation.mutate(id),
        deleteNotification: (id: string) => deleteMutation.mutate(id),
    };
}
