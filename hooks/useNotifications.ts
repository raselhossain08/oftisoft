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
    link?: string | null;
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

    const { data: counts } = useQuery({
        queryKey: ['notifications', 'counts'],
        queryFn: () => notificationsAPI.getCounts(),
    });

    const markAsReadMutation = useMutation({
        mutationFn: notificationsAPI.markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
        onError: () => {
            toast.error("Failed to mark as read");
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: notificationsAPI.markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success("All caught up!", { description: "All notifications marked as read." });
        },
        onError: () => {
            toast.error("Failed to mark all as read");
        },
    });

    const archiveMutation = useMutation({
        mutationFn: notificationsAPI.archive,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.info("Notification archived");
        },
        onError: () => {
            toast.error("Failed to archive notification");
        },
    });

    const unarchiveMutation = useMutation({
        mutationFn: notificationsAPI.unarchive,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success("Notification restored to inbox");
        },
        onError: () => {
            toast.error("Failed to unarchive notification");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: notificationsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toast.success("Notification deleted permanently");
        },
        onError: () => {
            toast.error("Failed to delete notification");
        },
    });

    const filteredNotifications = notifications.filter((n: Notification) => {
        if (filter === 'all') return !n.archived;
        if (filter === 'unread') return !n.read && !n.archived;
        if (filter === 'high') return n.priority === 'high' && !n.archived;
        if (filter === 'archived') return n.archived;
        return true;
    });

    const activeList = filter === 'archived' ? [] : notifications;
    const unreadCount = counts?.unread ?? activeList.filter((n: Notification) => !n.read).length;
    const highPriorityCount = counts?.highPriority ?? activeList.filter((n: Notification) => n.priority === 'high').length;
    const archivedCount = counts?.archived ?? (filter === 'archived' ? notifications.length : 0);

    return {
        notifications: filteredNotifications,
        isLoading,
        filter,
        setFilter,
        unreadCount,
        highPriorityCount,
        archivedCount,
        refetch: () => queryClient.refetchQueries({ queryKey: ['notifications'] }),
        isMarkingAllRead: markAllReadMutation.isPending,
        markAsRead: (id: string) => markAsReadMutation.mutate(id),
        markAllAsRead: () => markAllReadMutation.mutate(),
        archive: (id: string) => archiveMutation.mutate(id),
        unarchive: (id: string) => unarchiveMutation.mutate(id),
        deleteNotification: (id: string) => deleteMutation.mutate(id),
    };
}
