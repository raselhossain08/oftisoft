"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Search, Plus, Paperclip, Smile, Send, MoreVertical, 
    Phone, Video, Info, CheckCheck, X, User, Mic, MicOff, VideoOff, Upload
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data
const INITIAL_CONVERSATIONS = [
    { id: 1, name: "Sarah Jenkins", role: "Design Lead", email: "sarah@design.co", avatar: "SJ", status: "online", lastMsg: "The new mockups are ready!", time: "10:30 AM", unread: 2, color: "bg-pink-500" },
    { id: 2, name: "Mike Thompson", role: "DevOps", email: "mike@devops.io", avatar: "MT", status: "offline", lastMsg: "Server migration complete.", time: "Yesterday", unread: 0, color: "bg-purple-500" },
    { id: 3, name: "Proj: E-commerce", role: "Team Channel", email: "team@ecommerce.prj", avatar: "#", status: "online", lastMsg: "Alex: I'll check the API docs.", time: "2 days ago", unread: 5, color: "bg-blue-500" },
];

const INITIAL_MESSAGES = [
    { id: 1, sender: "Sarah Jenkins", text: "Hey! Did you get a chance to review the new dashboard designs?", time: "10:25 AM", isMe: false, chatId: 1 },
    { id: 2, sender: "Me", text: "Yes! They look amazing. The dark mode contrast is perfect.", time: "10:28 AM", isMe: true, chatId: 1 },
    { id: 3, sender: "Sarah Jenkins", text: "Great! I've uploaded the final assets to the drive. Let me know if you need anything else.", time: "10:30 AM", isMe: false, chatId: 1 },
    { id: 4, sender: "Mike Thompson", text: "Migration started.", time: "Yesterday", isMe: false, chatId: 2 },
    { id: 5, sender: "Me", text: "Thanks Mike.", time: "Yesterday", isMe: true, chatId: 2 },
];

// --- Components ---

const CustomDialog = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-card border border-border w-full max-w-md rounded-xl shadow-2xl pointer-events-auto overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-border">
                                <h3 className="font-bold text-lg">{title}</h3>
                                <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default function MessagesPage() {
    const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [selectedChat, setSelectedChat] = useState(INITIAL_CONVERSATIONS[0]);
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");

    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [newChatName, setNewChatName] = useState("");

    // Feature Dialog States
    const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);
    const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isAttachOpen, setIsAttachOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const activeMessages = messages.filter(m => m.chatId === selectedChat.id);
    const filteredConversations = conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeMessages, selectedChat]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const newMsg = {
            id: Date.now(),
            sender: "Me",
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true,
            chatId: selectedChat.id
        };

        setMessages([...messages, newMsg]);
        
        // Update last message in conversation
        setConversations(conversations.map(c => 
            c.id === selectedChat.id ? { ...c, lastMsg: "You: " + input, time: "Just now", unread: 0 } : c
        ));
        
        setInput("");
    };

    const handleNewChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChatName.trim()) return;

        const newChat = {
            id: Date.now(),
            name: newChatName,
            role: "New Contact",
            email: "new@contact.com",
            avatar: newChatName.substring(0, 2).toUpperCase(),
            status: "offline",
            lastMsg: "Start a conversation",
            time: "New",
            unread: 0,
            color: "bg-green-500"
        };

        setConversations([newChat, ...conversations]);
        setSelectedChat(newChat);
        setNewChatName("");
        setIsNewChatOpen(false);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            
            {/* Sidebar List */}
            <div className="w-80 flex flex-col bg-card border border-border rounded-3xl overflow-hidden shadow-sm shrink-0">
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Messages</h2>
                        <button 
                            onClick={() => setIsNewChatOpen(true)}
                            className="p-2 hover:bg-muted rounded-full transition-colors text-primary"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search chats..." 
                            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredConversations.map((chat) => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={cn(
                                "w-full p-3 rounded-2xl flex items-center gap-3 transition-all hover:bg-muted/50 text-left relative group",
                                selectedChat.id === chat.id ? "bg-primary/5 border border-primary/10" : "bg-transparent border border-transparent"
                            )}
                        >
                            <div className="relative">
                                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md", chat.color)}>
                                    {chat.avatar}
                                </div>
                                {chat.status === "online" && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="font-bold truncate">{chat.name}</span>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{chat.time}</span>
                                </div>
                                <p className={cn("text-xs truncate", chat.unread > 0 ? "text-foreground font-bold" : "text-muted-foreground")}>
                                    {chat.lastMsg}
                                </p>
                            </div>
                            {chat.unread > 0 && (
                                <span className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {chat.unread}
                                </span>
                            )}
                        </button>
                    ))}
                    {filteredConversations.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No chats found.
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-card border border-border rounded-3xl overflow-hidden shadow-sm flex flex-col">
                
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm", selectedChat.color)}>
                            {selectedChat.avatar}
                        </div>
                        <div>
                            <h3 className="font-bold leading-none">{selectedChat.name}</h3>
                            <p className="text-xs text-green-500 font-medium flex items-center gap-1 mt-1">
                                {selectedChat.status === 'online' ? (
                                    <><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Active Now</>
                                ) : (
                                    <span className="text-muted-foreground">Offline</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => setIsAudioCallOpen(true)}
                            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-primary transition-colors"
                            title="Start Audio Call"
                        >
                            <Phone className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setIsVideoCallOpen(true)}
                            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-primary transition-colors"
                            title="Start Video Call"
                        >
                            <Video className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setIsInfoOpen(true)}
                            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-primary transition-colors"
                            title="View Info"
                        >
                            <Info className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-muted/5">
                    {activeMessages.map((msg) => (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn("flex gap-3 max-w-[80%]", msg.isMe ? "ml-auto flex-row-reverse" : "")}
                        >
                            {!msg.isMe && (
                                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-auto", selectedChat.color)}>
                                    {selectedChat.avatar}
                                </div>
                            )}
                            <div className={cn(
                                "space-y-1 p-4 rounded-3xl shadow-sm text-sm",
                                msg.isMe 
                                    ? "bg-primary text-white rounded-br-none" 
                                    : "bg-background border border-border rounded-bl-none"
                            )}>
                                <p>{msg.text}</p>
                                <div className={cn("text-[10px] flex items-center gap-1 opacity-70 justify-end", msg.isMe ? "text-primary-foreground" : "text-muted-foreground")}>
                                    {msg.time}
                                    {msg.isMe && <CheckCheck className="w-3 h-3" />}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-background border-t border-border">
                    <div className="flex items-end gap-2 bg-muted/30 border border-border rounded-3xl p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                        <button 
                            onClick={() => setIsAttachOpen(true)}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            title="Add Attachment"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Type a message..." 
                            className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 py-2 text-sm"
                            rows={1}
                        />
                        <button 
                            onClick={() => setInput(prev => prev + "😊")}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                            title="Add Emoji"
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => handleSendMessage()}
                            disabled={!input.trim()}
                            className="p-2 bg-primary text-white rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>

            </div>

             {/* New Chat Dialog */}
             <CustomDialog 
                isOpen={isNewChatOpen} 
                onClose={() => setIsNewChatOpen(false)} 
                title="Start New Conversation"
            >
                <form onSubmit={handleNewChat} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-muted-foreground">Recipient Name</label>
                        <div className="relative">
                            <input 
                                required
                                value={newChatName}
                                onChange={(e) => setNewChatName(e.target.value)}
                                placeholder="e.g. David Wilson"
                                className="w-full bg-card border border-border rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        </div>
                    </div>
               
                    <button type="submit" className="w-full py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors mt-2">
                         Start Chat
                    </button>
                </form>
            </CustomDialog>

            {/* Audio Call Dialog */}
            <CustomDialog
                isOpen={isAudioCallOpen}
                onClose={() => setIsAudioCallOpen(false)}
                title="Audio Call"
            >
                <div className="flex flex-col items-center justify-center space-y-6 py-6">
                    <div className={cn("w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl", selectedChat.color)}>
                        {selectedChat.avatar}
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-2xl font-bold">{selectedChat.name}</h3>
                        <p className="text-primary font-medium animate-pulse">Calling...</p>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                        <button className="p-4 bg-muted hover:bg-muted/80 rounded-full transition-colors"><Mic className="w-6 h-6" /></button>
                        <button 
                            onClick={() => setIsAudioCallOpen(false)}
                            className="p-4 bg-red-500 text-white hover:bg-red-600 rounded-full transition-colors shadow-lg shadow-red-500/20"
                        >
                            <Phone className="w-6 h-6 rotate-[135deg]" />
                        </button>
                    </div>
                </div>
            </CustomDialog>

             {/* Video Call Dialog */}
             <CustomDialog
                isOpen={isVideoCallOpen}
                onClose={() => setIsVideoCallOpen(false)}
                title="Video Call"
            >
                <div className="flex flex-col items-center justify-center space-y-6 py-6">
                    <div className={cn("w-32 h-32 rounded-3xl flex items-center justify-center text-white text-4xl font-bold shadow-xl aspect-square", selectedChat.color)}>
                        {selectedChat.avatar}
                    </div>
                    <div className="text-center space-y-1">
                        <h3 className="text-2xl font-bold">{selectedChat.name}</h3>
                        <p className="text-primary font-medium animate-pulse">Connecting video...</p>
                    </div>
                     <div className="flex items-center gap-4 mt-4">
                        <button className="p-4 bg-muted hover:bg-muted/80 rounded-full transition-colors"><MicOff className="w-6 h-6" /></button>
                        <button 
                            onClick={() => setIsVideoCallOpen(false)}
                            className="p-4 bg-red-500 text-white hover:bg-red-600 rounded-full transition-colors shadow-lg shadow-red-500/20"
                        >
                            <Phone className="w-6 h-6 rotate-[135deg]" />
                        </button>
                         <button className="p-4 bg-muted hover:bg-muted/80 rounded-full transition-colors"><VideoOff className="w-6 h-6" /></button>
                    </div>
                </div>
            </CustomDialog>

             {/* User Info Dialog */}
             <CustomDialog
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                title="Contact Info"
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border">
                         <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md", selectedChat.color)}>
                            {selectedChat.avatar}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">{selectedChat.name}</h3>
                            <p className="text-sm text-muted-foreground">{selectedChat.role}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <div className={cn("w-2 h-2 rounded-full", selectedChat.status === 'online' ? "bg-green-500" : "bg-gray-400")} />
                                <span className="text-xs uppercase font-bold text-muted-foreground">{selectedChat.status}</span>
                            </div>
                        </div>
                    </div>
                   
                   <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-border">
                            <span className="text-sm font-medium text-muted-foreground">Email</span>
                            <span className="text-sm font-bold">{(selectedChat as any).email || "user@oftisoft.com"}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-border">
                            <span className="text-sm font-medium text-muted-foreground">Shared Files</span>
                            <span className="text-sm font-bold">12</span>
                        </div>
                   </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        <button className="py-2.5 border border-border rounded-xl font-bold hover:bg-muted transition-colors text-sm">
                            Block User
                        </button>
                         <button className="py-2.5 bg-red-500/10 text-red-600 border border-red-500/20 rounded-xl font-bold hover:bg-red-500/20 transition-colors text-sm">
                            Report
                        </button>
                    </div>
                </div>
            </CustomDialog>

            {/* Attach File Dialog */}
            <CustomDialog
                isOpen={isAttachOpen}
                onClose={() => setIsAttachOpen(false)}
                title="Send Attachment"
            >
                <div className="space-y-4">
                     <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2 hover:bg-muted/30 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Click to upload</p>
                            <p className="text-xs text-muted-foreground">or drag and drop files here</p>
                        </div>
                     </div>
                     <div className="text-xs text-muted-foreground text-center">
                        Supported: JPG, PNG, PDF, DOCX (Max 10MB)
                     </div>
                     <button 
                        onClick={() => setIsAttachOpen(false)}
                        className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                     >
                        Upload & Send
                     </button>
                </div>
            </CustomDialog>

        </div>
    );
}
