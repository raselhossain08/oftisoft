"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/useAuthStore";

interface UseSocketOptions {
  autoConnect?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { autoConnect = true, onConnect, onDisconnect, onError } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!autoConnect || !isAuthenticated) return;

    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    
    socketRef.current = io(socketUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      
      // Authenticate with user ID
      if (user?.id) {
        socket.emit("authenticate", { userId: user.id });
      }
      
      onConnect?.();
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      onDisconnect?.();
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      onError?.(error);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [autoConnect, isAuthenticated, user?.id, onConnect, onDisconnect, onError]);

  const emit = useCallback((event: string, data: any) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    socketRef.current?.on(event, callback);
    
    // Return unsubscribe function
    return () => {
      socketRef.current?.off(event, callback);
    };
  }, []);

  const joinConversation = useCallback((conversationId: string) => {
    if (user?.id) {
      socketRef.current?.emit("joinConversation", { conversationId, userId: user.id });
    }
  }, [user?.id]);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit("leaveConversation", { conversationId });
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    if (user?.id) {
      socketRef.current?.emit("sendMessage", { conversationId, senderId: user.id, content });
    }
  }, [user?.id]);

  const sendTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (user?.id) {
      socketRef.current?.emit("typing", { conversationId, userId: user.id, isTyping });
    }
  }, [user?.id]);

  return {
    socket: socketRef.current,
    isConnected,
    emit,
    on,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
  };
}