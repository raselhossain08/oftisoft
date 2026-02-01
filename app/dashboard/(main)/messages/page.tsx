"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Phone, Video, MoreVertical, Send, Paperclip,
    Smile, Mic, Image as ImageIcon, FileText, Check, CheckCheck,
    MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Mock Data ---

const CONVERSATIONS = [
    { id: 1, name: "Sarah Jenkins", avatar: "SJ", lastMsg: "Can we review the designs?", time: "10:30 AM", unread: 2, status: "online", color: "bg-pink-500" },
    { id: 2, name: "Project Alpha Team", avatar: "AT", lastMsg: "Mike: I pushed the latest code.", time: "9:15 AM", unread: 0, status: "", color: "bg-blue-500", isGroup: true },
    { id: 3, name: "Alex Morgan", avatar: "AM", lastMsg: "Meeting rescheduled to 3 PM.", time: "Yesterday", unread: 0, status: "offline", color: "bg-purple-500" },
    { id: 4, name: "Client Support", avatar: "CS", lastMsg: "Ticket #402 resolved.", time: "2 days ago", unread: 0, status: "online", color: "bg-green-500" },
];

const MESSAGES = [
    { id: 1, sender: "me", text: "Hey Sarah, how is the dashboard coming along?", time: "10:00 AM", status: "read" },
    { id: 2, sender: "Sarah Jenkins", text: "Hi Alex! It's going great. I've just finished the main layout.", time: "10:05 AM" },
    { id: 3, sender: "Sarah Jenkins", text: "I'll upload the mockups in a bit.", time: "10:06 AM" },
    { id: 4, sender: "me", text: "Awesome, looking forward to it!", time: "10:07 AM", status: "delivered" },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<number | null>(1);
    const [msgInput, setMsgInput] = useState("");

    const activeChat = CONVERSATIONS.find(c => c.id === selectedChat);

    return (
        <div className="h-[calc(100vh-8rem)] flex bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

            {/* Sidebar: Conversation List */}
            <div className="w-80 border-r border-border flex flex-col bg-muted/10">

                {/* Search */}
                <div className="p-4 border-b border-border">
                    <h2 className="font-bold text-xl mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search chats..."
                            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto">
                    {CONVERSATIONS.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={cn(
                                "flex items-center gap-3 p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors relative",
                                selectedChat === chat.id && "bg-muted/50 border-l-4 border-l-primary"
                            )}
                        >
                            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold relative shrink-0", chat.color)}>
                                {chat.avatar}
                                {chat.status === 'online' && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-sm truncate">{chat.name}</h4>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{chat.time}</span>
                                </div>
                                <p className={cn("text-xs truncate", chat.unread > 0 ? "font-bold text-foreground" : "text-muted-foreground")}>
                                    {chat.lastMsg}
                                </p>
                            </div>

                            {chat.unread > 0 && (
                                <div className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {chat.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            {activeChat ? (
                <div className="flex-1 flex flex-col bg-background relative">

                    {/* Chat Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm z-10">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold relative", activeChat.color)}>
                                {activeChat.avatar}
                                {activeChat.status === 'online' && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />}
                            </div>
                            <div>
                                <h3 className="font-bold">{activeChat.name}</h3>
                                <p className="text-xs text-green-500 flex items-center gap-1">
                                    {activeChat.status === 'online' ? 'Online' : 'Last seen recently'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                <Phone className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                <Video className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors">
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Feed */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {MESSAGES.map((msg) => {
                            const isMe = msg.sender === "me";
                            return (
                                <div key={msg.id} className={cn("flex flex-col max-w-[70%]", isMe ? "ml-auto items-end" : "mr-auto items-start")}>
                                    <div className={cn(
                                        "px-5 py-3 rounded-2xl text-sm relative group mb-1",
                                        isMe ? "bg-primary text-white rounded-br-none" : "bg-muted rounded-bl-none"
                                    )}>
                                        <p>{msg.text}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground px-1">
                                        <span>{msg.time}</span>
                                        {isMe && (
                                            <span>
                                                {msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-primary" /> : <Check className="w-3 h-3" />}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-border bg-card">
                        <div className="flex items-end gap-2 bg-muted/30 p-2 rounded-2xl border border-border focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <button className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <textarea
                                value={msgInput}
                                onChange={(e) => setMsgInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 py-2 text-sm"
                                rows={1}
                                style={{ minHeight: "2.5rem" }}
                            />
                            <button className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                                <Smile className="w-5 h-5" />
                            </button>

                            {msgInput.trim() ? (
                                <button className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                    <Send className="w-5 h-5" />
                                </button>
                            ) : (
                                <button className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                                    <Mic className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="w-10 h-10" />
                    </div>
                    <p>Select a chat to start messaging</p>
                </div>
            )}

        </div>
    );
}
