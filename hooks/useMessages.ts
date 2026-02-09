
import { useState, useCallback, useEffect, useRef } from "react";
import { messagesAPI, adminUserAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    updateDoc,
    doc,
    limit,
    getDocs
} from "firebase/firestore";

export function useMessages() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [conversations, setConversations] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedChat, setSelectedChatState] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Audio ref for notifications
    const notificationAudio = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Use a reliable notification sound URL
        notificationAudio.current = new Audio("https://raw.githubusercontent.com/adrianhajdin/project_assets/main/sound/notification.mp3");
    }, []);

    const playNotificationSound = () => {
        try {
            notificationAudio.current?.play().catch(e => console.log('Audio play failed', e));
        } catch (e) {
            console.error("Error playing sound", e);
        }
    };

    // Wrapper to update URL when chat is selected
    const setSelectedChat = useCallback((chat: any) => {
        setSelectedChatState(chat);
        const params = new URLSearchParams(searchParams.toString());
        if (chat?.recipientId) {
            if (chat.id) params.set('chat', chat.id);
            else params.set('chat', chat.recipientId);
        } else {
            params.delete('chat');
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, [searchParams, pathname, router]);

    // Real-time listener for Conversations
    useEffect(() => {
        if (!user?.id) {
            setConversations([]);
            return;
        }

        setIsLoading(true);

        const q = query(
            collection(db, "conversations"),
            where("userIds", "array-contains", user.id),
            orderBy("updatedAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const formatted = snapshot.docs.map(doc => {
                const data = doc.data();
                // Find other participant
                const other = (data.participants || []).find((p: any) => p.id !== user.id) || (data.participants || [])[0];

                if (!other) {
                    return null;
                }

                const lastMsgObj = data.lastMessage;
                const isMe = lastMsgObj?.senderId === user.id;

                // Safely handle timestamp
                let timeStr = "";
                if (lastMsgObj?.createdAt) {
                    // It might be a Firestore Timestamp or a string (if optimistically set or from legacy)
                    const date = lastMsgObj.createdAt.toDate ? lastMsgObj.createdAt.toDate() : new Date(lastMsgObj.createdAt);
                    timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }

                return {
                    id: doc.id,
                    name: other.name || "Unknown",
                    role: other.role || "User",
                    email: other.email,
                    avatar: other.avatarOrInitials || other.name?.slice(0, 2).toUpperCase() || "??",
                    status: (other.isActive || other.status === 'active') ? "online" : "offline",
                    lastMsg: lastMsgObj ? (isMe ? `You: ${lastMsgObj.content}` : lastMsgObj.content) : "No messages yet",
                    lastMsgIds: lastMsgObj?.id || "init",
                    time: timeStr,
                    unread: (lastMsgObj && !lastMsgObj.read && !isMe) ? 1 : 0,
                    color: "bg-blue-500",
                    recipientId: other.id
                };
            }).filter(Boolean); // Filter out nulls

            setConversations(prev => {
                // Check if we have new last messages to play sound
                if (prev.length > 0 && formatted.length > 0) {
                    const prevTop = prev[0];
                    const newTop = formatted[0];
                    // Detect NEW message that is NOT from me
                    if (newTop && prevTop && newTop.id === prevTop.id && newTop.lastMsgIds !== prevTop.lastMsgIds && !newTop.lastMsg?.startsWith("You:")) {
                        playNotificationSound();
                    }
                }
                return formatted as any[];
            });
            setIsLoading(false);
        }, (error) => {
            console.error("Snapshot error:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [user?.id]);

    // Real-time listener for Messages of selected chat
    useEffect(() => {
        if (!selectedChat?.id) {
            setMessages([]);
            return;
        }

        console.log('Listening to messages for:', selectedChat.id);

        const q = query(
            collection(db, "conversations", selectedChat.id, "messages"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const formatted = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    sender: data.senderId === user?.id ? "Me" : data.senderName,
                    text: data.content,
                    time: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Sending...",
                    isMe: data.senderId === user?.id,
                    chatId: selectedChat.id
                };
            });
            setMessages(formatted);
        });

        return () => unsubscribe();
    }, [selectedChat?.id, user?.id]);

    const sendMessage = async (content: string) => {
        if (!selectedChat || !content.trim() || !user) return;
        try {
            // Add message to subcollection
            await addDoc(collection(db, "conversations", selectedChat.id, "messages"), {
                content: content,
                senderId: user.id,
                senderName: user.name,
                createdAt: serverTimestamp(),
                readBy: [user.id]
            });

            // Update conversation last message
            await updateDoc(doc(db, "conversations", selectedChat.id), {
                lastMessage: {
                    content: content,
                    senderId: user.id,
                    createdAt: new Date().toISOString(), // Saving string for easier generic handling, though serverTimestamp is better usually
                    read: false
                },
                updatedAt: serverTimestamp()
            });

            return true;
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message");
            return false;
        }
    };

    const startConversation = async (recipientId: string, recipientData?: any) => {
        if (!user) return null;

        try {
            // 1. Check if conversation already exists (client-side check from subscribed list)
            const existing = conversations.find(c => c.recipientId === recipientId);
            if (existing) {
                setSelectedChat(existing);
                return existing;
            }

            // 2. Need to verify if it exists on server but not loaded (edge case), or just create it.
            // We'll optimistically try to find user details and create.

            let recipientUser = recipientData;
            if (!recipientUser) {
                try {
                    recipientUser = await adminUserAPI.getUser(recipientId);
                } catch (e) {
                    console.error("Failed to fetch recipient details", e);
                    toast.error("User not found");
                    return null;
                }
            }

            // Chat ID: Sort IDs to ensure uniqueness between two users
            const chatId = [user.id, recipientId].sort().join('_');
            const chatDocRef = doc(db, "conversations", chatId);

            await updateDoc(chatDocRef, {
                updatedAt: serverTimestamp()
            }).catch(async () => {
                // If update failed (likely document doesn't exist), create it
                await import("firebase/firestore").then(({ setDoc }) =>
                    setDoc(chatDocRef, {
                        userIds: [user.id, recipientId],
                        participants: [
                            {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                avatarOrInitials: user.avatarUrl || user.name[0] || "Me",
                                status: 'active',
                                role: user.role
                            },
                            {
                                id: recipientUser.id,
                                name: recipientUser.name,
                                email: recipientUser.email,
                                avatarOrInitials: recipientUser.avatarUrl || recipientUser.name?.[0] || recipientUser.avatarOrInitials || "U",
                                status: recipientUser.isActive ? 'active' : 'inactive',
                                role: recipientUser.role
                            }
                        ],
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                        lastMessage: null
                    })
                );
            });

            // Construct formatted object purely for immediate UI feedback if needed, 
            // though the snapshot listener should trigger almost instantly.
            const newChatFormatted = {
                id: chatId,
                name: recipientUser.name,
                role: recipientUser.role,
                email: recipientUser.email,
                avatar: recipientUser.avatarUrl || recipientUser.avatarOrInitials || recipientUser.name?.slice(0, 2).toUpperCase() || "??",
                status: recipientUser.isActive ? "online" : "offline",
                lastMsg: "New Conversation",
                lastMsgIds: "init",
                time: "Just now",
                unread: 0,
                color: "bg-blue-500",
                recipientId: recipientUser.id
            };

            setSelectedChat(newChatFormatted);
            return newChatFormatted;

        } catch (error) {
            console.error("Failed to start conversation", error);
            toast.error("Failed to start conversation");
            return null;
        }
    };

    const startSupportChat = async () => {
        try {
            const bot = await messagesAPI.getSupportBot();
            // Reuse startConversation logic with bot ID
            return await startConversation(bot.id, bot);
        } catch (error) {
            console.error("Failed to start support chat", error);
            toast.error("Support system is currently synchronizing. Please try again.");
        }
        return null;
    };

    // Initial URL sync logic is handled in the effect that sets conversations
    // But we need to handle the case where we land on a URL with ?chat=ID and we need to load that specific chat 
    // even if it's not in the 'conversations' list (unlikely if we load all, but possible).

    // We'll rely on the main conversation list listener to populate state, and then finding it.

    useEffect(() => {
        const chatIdFromUrl = searchParams.get('chat');
        if (chatIdFromUrl && conversations.length > 0 && !selectedChat) {
            const found = conversations.find((c: any) => c.id === chatIdFromUrl || c.recipientId === chatIdFromUrl);
            if (found) {
                setSelectedChatState(found);
            }
        }
    }, [conversations, searchParams, selectedChat]);

    // Refresh function is now no-op as it's realtime
    const refreshConversations = useCallback(async () => {
        // No-op for realtime
    }, []);

    return {
        conversations,
        messages,
        selectedChat,
        setSelectedChat,
        isLoading,
        sendMessage,
        startConversation,
        startSupportChat,
        refreshConversations
    };
}
