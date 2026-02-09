import { useQuery } from '@tanstack/react-query';
import { messagesAPI, ordersAPI, leadsAPI } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface BadgeCounts {
    messages: number;
    orders: number;
    leads: number;
}

export function useBadgeCounts() {
    const { user } = useAuth();

    // Check if user has permission to view leads stats
    const canViewLeads = Boolean(user?.role && ['Admin', 'Editor', 'Support'].includes(user.role));

    const { data: conversations = [] } = useQuery({
        queryKey: ['conversations'],
        queryFn: messagesAPI.getConversations,
        refetchInterval: 30000, // Refetch every 30 seconds
    });

    const { data: orders = [] } = useQuery({
        queryKey: ['orders'],
        queryFn: ordersAPI.getOrders,
        refetchInterval: 60000, // Refetch every minute
    });

    const { data: leadsStats } = useQuery({
        queryKey: ['leads-stats'],
        queryFn: leadsAPI.getStats,
        refetchInterval: 60000, // Refetch every minute
        enabled: canViewLeads, // Only fetch if user has permission
        retry: false, // Don't retry on 403 errors
    });

    // Calculate unread messages count
    // Since backend doesn't track unread per conversation, we'll count conversations with recent messages
    // You can enhance this by adding unreadCount to the backend Conversation entity
    const unreadMessages = conversations.filter((conv: any) => {
        // Check if there's a lastMessage and it was created recently (within last 24 hours)
        if (conv.lastMessage) {
            const lastMessageTime = new Date(conv.lastMessage.createdAt).getTime();
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            return lastMessageTime > oneDayAgo;
        }
        return false;
    }).length;

    // Calculate pending orders count
    const pendingOrders = orders.filter((order: any) =>
        order.status === 'pending' || order.status === 'processing'
    ).length;

    // Get new leads count from stats (backend returns 'newLeads' not 'newCount')
    const newLeads = leadsStats?.newLeads || 0;

    const badgeCounts: BadgeCounts = {
        messages: unreadMessages,
        orders: pendingOrders,
        leads: newLeads,
    };

    return badgeCounts;
}
