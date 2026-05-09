"use client"
import { useState, useRef, useEffect, Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Send,
  Phone,
  Video,
  Info,
  CheckCheck,
  Check,
  Upload,
  ArrowLeft,
  Bot,
  MessageSquare,
  ExternalLink,
  MoreVertical,
  Pin,
  BellOff,
  Trash2,
  Edit3,
  Reply,
  Smile,
  X,
  Paperclip,
  Image,
  FileText,
  Download,
  Shield,
  User,
  Crown,
  Users,
  Filter,
  Archive,
  Ban,
  Flag,
  Clock,
  ChevronDown,
  Loader2,
  SearchX
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useMessages, UserRole, Message as MessageType, Conversation } from "@/hooks/useMessages";
import { messagesAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const GOOGLE_MEET_URL = "https://meet.google.com/new";

const EMOJI_GRID = [
  "😀", "😃", "😄", "😁", "😅", "🤣", "😂", "🙂", "🙃", "😉",
  "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲",
  "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔",
  "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔",
  "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵",
  "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "🥸", "😎", "👍", "👎",
  "👏", "🙌", "🤝", "🙏", "💪", "❤️", "🧡", "💛", "💚", "💙",
  "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗",
  "🔥", "💯", "✨", "🎉", "🎊", "🎁", "💡", "⭐", "🌟", "⚡",
];

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  'SuperAdmin': <Crown className="w-3 h-3 text-purple-500" />,
  'Admin': <Shield className="w-3 h-3 text-red-500" />,
  'Support': <Bot className="w-3 h-3 text-green-500" />,
  'Editor': <Edit3 className="w-3 h-3 text-orange-500" />,
  'User': <User className="w-3 h-3 text-blue-500" />,
  'Viewer': <User className="w-3 h-3 text-gray-500" />,
};

const ROLE_COLORS: Record<UserRole, string> = {
  'SuperAdmin': 'bg-purple-600',
  'Admin': 'bg-red-500',
  'Support': 'bg-green-500',
  'Editor': 'bg-orange-500',
  'User': 'bg-blue-500',
  'Viewer': 'bg-gray-500',
};

interface FileAttachment {
  file: File;
  preview?: string;
  id: string;
}

function MessagesPageContent() {
  const { 
    conversations,
    messages,
    selectedChat, 
    setSelectedChat,
    isLoading, 
    isMessagesLoading, 
    typingUsers,
    permissions,
    userRole,
    sendMessage, 
    editMessage,
    deleteMessage,
    addReaction,
    removeReaction,
    sendTypingIndicator,
    startConversation, 
    startSupportChat,
    refreshConversations,
    pinConversation,
    muteConversation,
    blockUser,
    unblockUser,
    searchMessages,
    canMessageUser
  } = useMessages();
  const { user: currentUser } = useAuth();

  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showChatView, setShowChatView] = useState(false);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [replyingTo, setReplyingTo] = useState<MessageType | null>(null);
  const [editingMessage, setEditingMessage] = useState<MessageType | null>(null);
  const [editInput, setEditInput] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [messageSearch, setMessageSearch] = useState("");
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredConversations = conversations.filter((c) => {
    if (activeTab === "unread") return c.unread > 0;
    if (activeTab === "support") return c.isSupport;
    return c.name.toLowerCase().includes(search.toLowerCase()) ||
           c.lastMsg.toLowerCase().includes(search.toLowerCase());
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  // Fetch role-based available users
  useEffect(() => {
    if (isNewChatOpen) {
      setIsUsersLoading(true);
      messagesAPI.getAvailableUsers()
        .then(setAvailableUsers)
        .catch(() => setAvailableUsers([]))
        .finally(() => setIsUsersLoading(false));
    }
  }, [isNewChatOpen]);

  // Typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    sendTypingIndicator();
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleSelectChat = (chat: Conversation) => {
    setSelectedChat(chat);
    setShowChatView(true);
    setMessageSearch("");
    setIsSearchOpen(false);
  };

  const handleBackToList = () => {
    setShowChatView(false);
    setReplyingTo(null);
    setEditingMessage(null);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && attachments.length === 0) || !selectedChat || isSending) return;
    
    setIsSending(true);
    const files = attachments.map(a => a.file);
    const success = await sendMessage(input, files, replyingTo?.id);
    setIsSending(false);
    
    if (success) {
      setInput("");
      setAttachments([]);
      setReplyingTo(null);
    }
  };

  const handleStartNewChat = async (recipientId: string, recipientData?: any) => {
    const existing = conversations.find(c => c.recipientId === recipientId);
    if (existing) {
      handleSelectChat(existing);
      setIsNewChatOpen(false);
      return;
    }
    
    setIsNewChatOpen(false);
    toast.success("Starting chat...");
    const chat = await startConversation(recipientId, recipientData);
    if (chat) {
      setShowChatView(true);
    }
  };

  const handleSupportChat = async () => {
    const chat = await startSupportChat();
    if (chat) {
      handleSelectChat(chat);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file sizes
    const oversizedFiles = files.filter(f => f.size > (permissions?.maxFileSize || 10 * 1024 * 1024));
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed the maximum size limit`);
      return;
    }

    const newAttachments: FileAttachment[] = files.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    setIsAttachOpen(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => {
      const attachment = prev.find(a => a.id === id);
      if (attachment?.preview) {
        URL.revokeObjectURL(attachment.preview);
      }
      return prev.filter(a => a.id !== id);
    });
  };

  const handleMessageSearch = async () => {
    if (!messageSearch.trim() || !selectedChat) return;
    searchMessages(messageSearch);
  };

  const handleEditMessage = async () => {
    if (!editingMessage || !editInput.trim()) return;
    
    const success = await editMessage(editingMessage.id, editInput.trim());
    if (success) {
      setEditingMessage(null);
      setEditInput("");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const success = await deleteMessage(messageId);
    if (success) {
      setSelectedMessageId(null);
    }
  };

  const getTypingText = () => {
    const typing = Array.from(typingUsers);
    if (typing.length === 0) return null;
    if (typing.length === 1) return "typing...";
    return `${typing.length} people are typing...`;
  };

  const filteredUsers = availableUsers.filter(u => 
    u.id !== currentUser?.id && 
    (u.name?.toLowerCase().includes(newChatSearch.toLowerCase()) || 
     u.email?.toLowerCase().includes(newChatSearch.toLowerCase()))
  );

  const MessageBubble = ({ msg }: { msg: MessageType }) => {
    const isSelected = selectedMessageId === msg.id;
    const hasReactions = msg.reactions && msg.reactions.length > 0;
    
    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex gap-2 max-w-[85%] sm:max-w-[75%] group",
          msg.isMe ? "ml-auto flex-row-reverse" : ""
        )}
        onClick={() => setSelectedMessageId(isSelected ? null : msg.id)}
      >
        {!msg.isMe && (
          <Avatar className="h-8 w-8 rounded-full shrink-0 mt-auto">
            <AvatarFallback className={cn("rounded-full text-white text-xs font-medium", ROLE_COLORS[msg.senderRole])}>
              {selectedChat?.avatar}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className="flex flex-col gap-1">
          {/* Reply indicator */}
          {msg.replyTo && (
            <div className={cn(
              "px-3 py-1.5 rounded-t-xl text-xs border-l-2",
              msg.isMe 
                ? "bg-[#0084ff]/20 border-white/50 ml-auto" 
                : "bg-gray-100 border-gray-400 dark:bg-zinc-700/50 dark:border-zinc-400 mr-auto"
            )}>
              <span className="font-medium">{msg.replyTo.sender}</span>
              <p className="truncate max-w-[200px] opacity-75">{msg.replyTo.text}</p>
            </div>
          )}
          
          <div
            className={cn(
              "relative px-3 py-2 rounded-2xl text-sm shadow-sm cursor-pointer transition-all",
              msg.isMe
                ? "bg-[#0084ff] text-white rounded-br-md rounded-tr-md rounded-tl-xl rounded-bl-xl"
                : "bg-white dark:bg-zinc-800 text-foreground rounded-bl-md rounded-tl-md rounded-tr-xl rounded-br-xl border border-border/50"
            )}
          >
            {/* Message actions */}
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "absolute -top-8 flex items-center gap-1 bg-popover border border-border rounded-lg shadow-lg p-1 z-10",
                    msg.isMe ? "right-0" : "left-0"
                  )}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReplyingTo(msg);
                            setSelectedMessageId(null);
                          }}
                        >
                          <Reply className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Reply</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {msg.isMe && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingMessage(msg);
                              setEditInput(msg.text);
                              setSelectedMessageId(null);
                            }}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  
                  {(msg.isMe || permissions?.canDeleteMessages) && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMessage(msg.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            <p className="break-words leading-snug">{msg.text}</p>
            
            {msg.attachments && msg.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {msg.attachments.map((att) => (
                  <div key={att.id} className="flex items-center gap-2 p-2 bg-black/10 rounded-lg">
                    {att.type.startsWith('image/') ? (
                      <Image className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                    <span className="text-xs truncate flex-1">{att.name}</span>
                    <a href={att.url} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
            
            <div className={cn(
              "text-[11px] mt-0.5 flex items-center justify-end gap-1",
              msg.isMe ? "text-white/80" : "text-muted-foreground"
            )}>
              {msg.edited && <span className="italic">edited</span>}
              {msg.time}
              {msg.isMe && (
                <>
                  {msg.status === 'sent' && <Check className="w-3 h-3 shrink-0 opacity-60" />}
                  {msg.status === 'delivered' && <CheckCheck className="w-3 h-3 shrink-0 opacity-60" />}
                  {msg.status === 'read' && <CheckCheck className="w-3 h-3 shrink-0 text-blue-300" />}
                </>
              )}
            </div>
          </div>
          
          {/* Reactions */}
          {hasReactions && (
            <div className={cn(
              "flex gap-1 mt-1",
              msg.isMe ? "justify-end" : "justify-start"
            )}>
              {msg.reactions?.map((reaction) => (
                <button
                  key={reaction.emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (reaction.users.includes(currentUser?.id || '')) {
                      removeReaction(msg.id, reaction.emoji);
                    } else {
                      addReaction(msg.id, reaction.emoji);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs border transition-colors",
                    reaction.users.includes(currentUser?.id || '')
                      ? "bg-[#0084ff]/10 border-[#0084ff] text-[#0084ff]"
                      : "bg-popover border-border hover:bg-muted"
                  )}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.users.length}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {msg.isMe && <div className="w-8 shrink-0" />}
      </motion.div>
    );
  };

  const chatArea = (
    <Card className="flex-1 flex flex-col overflow-hidden rounded-xl border min-h-0 bg-[#f0f2f5] dark:bg-zinc-950/50">
      {/* Chat Header */}
      <CardHeader className="px-4 py-3 border-b border-border flex flex-row items-center justify-between gap-3 shrink-0 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0 h-9 w-9"
            onClick={handleBackToList}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {selectedChat && (
            <>
              <Avatar className={cn("h-10 w-10 rounded-full shrink-0", ROLE_COLORS[selectedChat.role])}>
                <AvatarFallback className="rounded-full text-white font-bold">
                  {selectedChat.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold leading-none truncate">
                    {selectedChat.name}
                  </h3>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {selectedChat.role}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <p
                    className={cn(
                      "text-xs font-medium flex items-center gap-1",
                      selectedChat.status === "online"
                        ? "text-green-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {selectedChat.status === "online" ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shrink-0" />
                        Active Now
                      </>
                    ) : (
                      "Offline"
                    )}
                  </p>
                  {getTypingText() && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-[#0084ff] animate-pulse">
                        {getTypingText()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => window.open(GOOGLE_MEET_URL, "_blank", "noopener,noreferrer")}
          >
            <Video className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsInfoOpen(true)}
          >
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages Feed */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1">
          {selectedChat && isMessagesLoading && messages.length === 0 && (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {selectedChat && !isMessagesLoading &&
            messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
          }
          {selectedChat && !isMessagesLoading && messages.length === 0 && (
            <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
              No messages yet. Say hello!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Reply Preview */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 bg-muted/50 border-t border-border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Reply className="w-4 h-4 text-[#0084ff]" />
                <span className="text-muted-foreground">Replying to</span>
                <span className="font-medium">{replyingTo.sender}</span>
                <span className="text-muted-foreground truncate max-w-[200px]">
                  "{replyingTo.text.substring(0, 50)}..."
                </span>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setReplyingTo(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 bg-muted/50 border-t border-border flex gap-2 overflow-x-auto">
          {attachments.map((att) => (
            <div key={att.id} className="relative shrink-0">
              {att.preview ? (
                <img src={att.preview} alt={att.file.name} className="w-16 h-16 object-cover rounded-lg" />
              ) : (
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <button
                onClick={() => removeAttachment(att.id)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 bg-background/95 backdrop-blur border-t border-border shrink-0">
        <form
          onSubmit={handleSendMessage}
          className="flex items-end gap-2 bg-muted/50 dark:bg-zinc-800/50 rounded-2xl px-3 py-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            multiple
            className="hidden"
            accept={permissions?.allowedFileTypes?.join(',')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full hover:bg-muted"
            onClick={() => fileInputRef.current?.click()}
            disabled={!permissions?.canUploadFiles}
          >
            <Paperclip className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Message"
            className="flex-1 min-h-[38px] max-h-28 border-0 focus-visible:ring-0 resize-none bg-transparent py-2.5 px-2 text-sm placeholder:text-muted-foreground"
            rows={1}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full hover:bg-muted"
              >
                <Smile className="w-5 h-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              side="top"
              sideOffset={8}
              className="w-[320px] p-2 rounded-2xl"
            >
              <div className="grid grid-cols-10 gap-0.5">
                {EMOJI_GRID.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="h-8 w-8 flex items-center justify-center text-lg rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setInput((prev) => prev + emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            type="submit"
            disabled={(!input.trim() && attachments.length === 0) || isSending}
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full bg-[#0084ff] hover:bg-[#0073e6] text-white"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
        {attachments.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1 ml-2">
            {attachments.length} file{attachments.length > 1 ? 's' : ''} attached
          </p>
        )}
      </div>
    </Card>
  );

  const sidebar = (
    <Card className="w-full lg:w-96 flex flex-col overflow-hidden rounded-xl border shrink-0 h-full min-h-0">
      <div className="p-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Messages</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full"
            onClick={() => setIsNewChatOpen(true)}
          >
            <Plus className="w-5 h-5 text-[#0084ff]" />
          </Button>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages"
            className="pl-9 h-9 rounded-full bg-muted/50 border-0"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-8">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread {conversations.some(c => c.unread > 0) && (
                <span className="ml-1 w-4 h-4 bg-[#0084ff] text-white rounded-full text-[10px] flex items-center justify-center">
                  {conversations.filter(c => c.unread > 0).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="support" className="text-xs">Support</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="py-1">
          {isLoading && (
            <div className="p-8 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
            </div>
          )}
          {!isLoading && conversations.length === 0 && (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-sm">No conversations yet</p>
                <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
                  Start a new conversation or contact support
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  size="sm" 
                  className="rounded-xl h-10 font-bold"
                  onClick={() => setIsNewChatOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" /> Start New Chat
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl h-10 font-bold"
                  onClick={handleSupportChat}
                >
                  <Bot className="w-4 h-4 mr-2 text-primary" /> Contact Support
                </Button>
              </div>
            </div>
          )}
          {!isLoading && filteredConversations.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors",
                selectedChat?.id === chat.id
                  ? "bg-muted"
                  : "hover:bg-muted/50"
              )}
              onClick={() => handleSelectChat(chat)}
            >
              {chat.isPinned && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#0084ff] rounded-r-full" />
              )}
              <div className="relative shrink-0">
                <Avatar className={cn("h-12 w-12 rounded-full", ROLE_COLORS[chat.role])}>
                  <AvatarFallback className="rounded-full text-white text-sm font-medium">
                    {chat.avatar}
                  </AvatarFallback>
                </Avatar>
                {chat.status === "online" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "truncate text-sm",
                      chat.unread > 0 ? "font-semibold" : "font-medium"
                    )}>
                      {chat.name}
                    </span>
                    {ROLE_ICONS[chat.role]}
                  </div>
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0">
                    {chat.time}
                  </span>
                </div>
                <p className={cn(
                  "text-xs truncate",
                  chat.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {chat.lastMsg}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {chat.unread > 0 && (
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#0084ff] text-white text-xs font-bold flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
                {chat.isMuted && <BellOff className="w-3 h-3 text-muted-foreground" />}
              </div>
              
              {/* Hover actions */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-7 w-7 bg-background shadow-sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => pinConversation(chat.id, !chat.isPinned)}>
                      <Pin className="w-4 h-4 mr-2" />
                      {chat.isPinned ? 'Unpin' : 'Pin'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => muteConversation(chat.id, !chat.isMuted)}>
                      <BellOff className="w-4 h-4 mr-2" />
                      {chat.isMuted ? 'Unmute' : 'Mute'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => selectedChat && blockUser(selectedChat.recipientId)}
                    >
                      <Ban className="w-4 h-4 mr-2" /> Block
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          {filteredConversations.length === 0 && search && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <SearchX className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No chats found
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );

  return (
    <>
      {/* Message Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Search Messages</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMessageSearch()}
                placeholder="Search in conversation..."
                className="pl-9"
              />
            </div>
            <Button onClick={handleMessageSearch} className="w-full">
              Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Message Dialog */}
      <Dialog open={!!editingMessage} onOpenChange={() => setEditingMessage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={editInput}
              onChange={(e) => setEditInput(e.target.value)}
              placeholder="Edit your message..."
              className="min-h-[100px]"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingMessage(null)}>Cancel</Button>
              <Button onClick={handleEditMessage}>Save Changes</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <MessagesPageContent />
    </Suspense>
  );
}
