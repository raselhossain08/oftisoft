
import { useState, useCallback, useEffect } from "react";
import { messagesAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export function useMessages() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchConversations = useCallback(async () => {
        try {
            const data = await messagesAPI.getConversations();
            // Transform data to match UI expectations if necessary
            const formatted = data.map((c: any) => ({
                id: c.id,
                name: (c.participants || []).find((p: any) => p.id !== user?.id)?.name || "Unknown",
                role: (c.participants || []).find((p: any) => p.id !== user?.id)?.role || "User",
                email: (c.participants || []).find((p: any) => p.id !== user?.id)?.email,
                avatar: (c.participants || []).find((p: any) => p.id !== user?.id)?.avatarOrInitials || (c.participants || []).find((p: any) => p.id !== user?.id)?.name?.slice(0, 2).toUpperCase() || "??",
                status: (c.participants || []).find((p: any) => p.id !== user?.id)?.isActive ? "online" : "offline",
                lastMsg: c.lastMessage?.content || "No messages yet",
                time: c.lastMessage?.createdAt ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
                unread: 0,
                color: "bg-blue-500",
                recipientId: (c.participants || []).find((p: any) => p.id !== user?.id)?.id
            }));
            setConversations(formatted);
        } catch (error) {
            console.error("Failed to fetch conversations", error);
            // Don't show toast on initial load to avoid spam
        }
    }, [user?.id]);

    const fetchMessages = useCallback(async (chatId: string) => {
        if (!chatId) return;
        try {
            const data = await messagesAPI.getMessages(chatId);
            const formatted = data.map((m: any) => ({
                id: m.id,
                sender: m.sender.id === user?.id ? "Me" : m.sender.name,
                text: m.content,
                time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: m.sender.id === user?.id,
                chatId: m.conversation.id
            }));
            setMessages(formatted);
        } catch (error) {
            console.error("Failed to fetch messages", error);
            toast.error("Failed to load messages");
        }
    }, [user?.id]);

    const sendMessage = async (content: string) => {
        if (!selectedChat || !content.trim()) return;
        try {
            await messagesAPI.sendMessage(selectedChat.id, content);
            await fetchMessages(selectedChat.id); // Refresh messages
            fetchConversations(); // Refresh last message in list
            return true;
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message");
            return false;
        }
    };

    const startConversation = async (recipientId: string) => {
        try {
            const newConv = await messagesAPI.startConversation(recipientId);
            await fetchConversations();
            const foundNode = conversations.find(c => c.id === newConv.id);
            // If strictly new and not in list yet, we might need to manually construct it or wait for fetch
            // Ideally backend returns full conversation object.
            // For now, let's just trigger refresh and select it if we can
            return newConv;
        } catch (error) {
            console.error("Failed to start conversation", error);
            toast.error("Failed to start conversation");
            return null;
        }
    };

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user, fetchConversations]);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.id);
            // Set up polling interval for real-time-ish updates
            const interval = setInterval(() => fetchMessages(selectedChat.id), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedChat, fetchMessages]);

    const startSupportChat = async () => {
        try {
            const bot = await messagesAPI.getSupportBot();
            const newConv = await startConversation(bot.id);
            if (newConv) {
                // Formatting for UI selection
                const formatted = {
                    id: newConv.id,
                    name: bot.name,
                    role: bot.role,
                    email: bot.email,
                    avatar: bot.name.slice(0, 2).toUpperCase(),
                    status: "online",
                    lastMsg: "Connected to Support",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    unread: 0,
                    color: "bg-primary",
                    recipientId: bot.id
                };
                setSelectedChat(formatted);
                return formatted;
            }
        } catch (error) {
            console.error("Failed to start support chat", error);
            toast.error("Support system is currently synchronizing. Please try again.");
        }
        return null;
    };

    return {
        conversations,
        messages,
        selectedChat,
        setSelectedChat,
        isLoading,
        sendMessage,
        startConversation,
        startSupportChat,
        refreshConversations: fetchConversations
    };
}
