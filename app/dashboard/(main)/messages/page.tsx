"use client"
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Send,
  Phone,
  Video,
  Info,
  CheckCheck,
  User,
  Mic,
  MicOff,
  VideoOff,
  Upload,
  ArrowLeft,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMessages } from "@/hooks/useMessages";
import { useUsers } from "@/hooks/useUsers";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCalling } from "@/hooks/useCalling";

export default function MessagesPage() {
  const { conversations, messages, selectedChat, setSelectedChat, isLoading, sendMessage, startConversation, refreshConversations } = useMessages();
  const { users, fetchUsers, isLoading: isUsersLoading } = useUsers();
  const { user: currentUser } = useAuth();
  
  // Calling Hook
  const { 
      startCall, endCall, answerCall, rejectCall, 
      activeCall, incomingCall, localStream, remoteStream 
  } = useCalling();
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Effect to attach streams
  useEffect(() => {
      if (localVideoRef.current && localStream) {
          localVideoRef.current.srcObject = localStream;
      }
      if (remoteVideoRef.current && remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
      }
  }, [localStream, remoteStream, activeCall]);

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showChatView, setShowChatView] = useState(false);

  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [newChatSearch, setNewChatSearch] = useState("");

  const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isAttachOpen, setIsAttachOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  // Fetch users when new chat dialog opens
  useEffect(() => {
    if (isNewChatOpen) {
        fetchUsers();
    }
  }, [isNewChatOpen, fetchUsers]);

  const handleSelectChat = (chat: any) => {
    setSelectedChat(chat);
    setShowChatView(true);
  };

  const handleBackToList = () => {
    setShowChatView(false);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !selectedChat) return;
    
    const success = await sendMessage(input);
    if (success) {
        setInput("");
    }
  };

  const handleStartNewChat = async (recipientId: string) => {
    const existing = conversations.find(c => c.recipientId === recipientId);
    if (existing) {
        handleSelectChat(existing);
        setIsNewChatOpen(false);
        return;
    }
    
    // Start new conversation API call
    const newChat = await startConversation(recipientId);
    if (newChat) {
        // Optimistic refresh or wait for effect
        setIsNewChatOpen(false);
        // We might need to manually set selected chat if the hook logic doesn't cover this instantly
    }
  };

  const filteredUsers = users.filter(u => 
    u.id !== currentUser?.id && 
    (u.name.toLowerCase().includes(newChatSearch.toLowerCase()) || 
     u.email.toLowerCase().includes(newChatSearch.toLowerCase()))
  );

  const chatArea = (
    <Card className="flex-1 flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border min-h-0">
      {/* Chat Header */}
      <CardHeader className="p-4 border-b border-border flex flex-row items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden shrink-0 h-9 w-9"
            onClick={handleBackToList}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          {selectedChat && (
            <>
              <Avatar
                className={cn(
                  "h-10 w-10 rounded-full shrink-0",
                  selectedChat.color || "bg-primary"
                )}
              >
                <AvatarFallback
                  className={cn("rounded-full text-white font-bold", selectedChat.color || "bg-primary")}
                >
                  {selectedChat.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="font-bold leading-none truncate">
                  {selectedChat.name}
                </h3>
                <p
                  className={cn(
                    "text-xs font-medium flex items-center gap-1 mt-0.5",
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
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => {
                if(selectedChat?.recipientId) {
                    startCall(selectedChat.recipientId, 'audio');
                    setIsAudioCallOpen(true);
                }
            }}
            title="Start Audio Call"
          >
            <Phone className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => {
                if(selectedChat?.recipientId) {
                    startCall(selectedChat.recipientId, 'video');
                    setIsVideoCallOpen(true);
                }
            }}
            title="Start Video Call"
          >
            <Video className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsInfoOpen(true)}
            title="View Info"
          >
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>

      {/* Messages Feed */}
      <ScrollArea className="flex-1 p-4 sm:p-6 bg-muted/5">
        <div className="space-y-4 sm:space-y-6">
          {selectedChat &&
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[80%]",
                  msg.isMe ? "ml-auto flex-row-reverse" : ""
                )}
              >
                {!msg.isMe && (
                  <Avatar
                    className={cn(
                      "h-8 w-8 rounded-full shrink-0 mt-auto",
                      selectedChat.color || "bg-primary"
                    )}
                  >
                    <AvatarFallback
                      className={cn(
                        "rounded-full text-white text-xs font-bold",
                        selectedChat.color || "bg-primary"
                      )}
                    >
                      {selectedChat.avatar}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "space-y-1 p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-sm text-sm",
                    msg.isMe
                      ? "bg-primary text-primary-foreground rounded-br-md sm:rounded-br-none"
                      : "bg-card border border-border rounded-bl-md sm:rounded-bl-none"
                  )}
                >
                  <p className="break-words">{msg.text}</p>
                  <div
                    className={cn(
                      "text-[10px] flex items-center gap-1 opacity-80 justify-end",
                      msg.isMe ? "text-primary-foreground/90" : "text-muted-foreground"
                    )}
                  >
                    {msg.time}
                    {msg.isMe && <CheckCheck className="w-3 h-3 shrink-0" />}
                  </div>
                </div>
              </motion.div>
            ))}
            {messages.length === 0 && (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                    No messages yet. Say hello!
                </div>
            )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-background border-t border-border shrink-0">
        <form
          onSubmit={handleSendMessage}
          className="flex items-end gap-2 bg-muted/30 border border-border rounded-2xl sm:rounded-3xl p-2 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setIsAttachOpen(true)}
            title="Add Attachment"
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 min-h-[40px] max-h-32 border-0 focus-visible:ring-0 resize-none bg-transparent py-2 text-sm"
            rows={1}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setInput((prev) => prev + "😊")}
            title="Add Emoji"
          >
            <span className="text-lg">😊</span>
          </Button>
          <Button
            type="submit"
            disabled={!input.trim()}
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );

  const sidebar = (
    <Card className="w-full lg:w-80 flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border shrink-0 h-full min-h-0">
      <div className="p-3 sm:p-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold">Messages</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setIsNewChatOpen(true)}
          >
            <Plus className="w-5 h-5 text-primary" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="pl-9 h-9 sm:h-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-1">
          {conversations.length === 0 && !isLoading && (
             <div className="p-4 text-center text-sm text-muted-foreground">
               No conversations yet. Start one!
             </div>
          )}
          {filteredConversations.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              onClick={() => handleSelectChat(chat)}
              className={cn(
                "w-full justify-start h-auto p-3 rounded-xl sm:rounded-2xl gap-3 text-left font-normal",
                selectedChat?.id === chat.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-muted/50"
              )}
            >
              <div className="relative shrink-0">
                <Avatar
                  className={cn("h-12 w-12 rounded-full", chat.color || "bg-primary")}
                >
                  <AvatarFallback
                    className={cn("rounded-full text-white font-bold", chat.color || "bg-primary")}
                  >
                    {chat.avatar}
                  </AvatarFallback>
                </Avatar>
                {chat.status === "online" && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5 gap-2">
                  <span className="font-bold truncate text-sm">{chat.name}</span>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                    {chat.time}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs truncate",
                    chat.unread > 0 ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}
                >
                  {chat.lastMsg}
                </p>
              </div>
              {chat.unread > 0 && (
                <Badge className="h-5 min-w-5 px-1.5 text-[10px] shrink-0">
                  {chat.unread}
                </Badge>
              )}
            </Button>
          ))}
          {filteredConversations.length === 0 && search && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No chats found for "{search}".
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );

  return (
    <div className="h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 sm:gap-6">
      {/* Sidebar - hidden on mobile when chat is open */}
      <div
        className={cn(
          "flex flex-col h-full min-h-[250px] lg:min-h-0",
          showChatView ? "hidden lg:flex" : "flex",
          "lg:w-80"
        )}
      >
        {sidebar}
      </div>

      {/* Chat Area - hidden on mobile when list is shown */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-0",
          showChatView ? "flex" : "hidden lg:flex"
        )}
      >
        {selectedChat ? (
          chatArea
        ) : (
          <Card className="flex-1 flex items-center justify-center rounded-2xl sm:rounded-3xl border">
            <p className="text-muted-foreground text-sm px-4">
              Select a conversation to start messaging
            </p>
          </Card>
        )}
      </div>

      {/* New Chat Dialog */}
      <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
        <DialogContent className="sm:max-w-md h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle>Start New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={newChatSearch}
                  onChange={(e) => setNewChatSearch(e.target.value)}
                  placeholder="Search users..."
                  className="pl-9"
                />
            </div>
            <ScrollArea className="flex-1 border rounded-md">
                <div className="p-2 space-y-1">
                    {filteredUsers.length === 0 && (
                         <div className="p-4 text-center text-sm text-muted-foreground">
                            {newChatSearch ? "No users found." : "Type to search users."}
                         </div>
                    )}
                    {filteredUsers.map(u => (
                        <Button 
                            key={u.id} 
                            variant="ghost" 
                            className="w-full justify-start gap-3 h-14"
                            onClick={() => handleStartNewChat(u.id)}
                        >
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>{u.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                             </Avatar>
                             <div className="flex flex-col items-start">
                                 <span className="font-bold text-sm">{u.name}</span>
                                 <span className="text-xs text-muted-foreground">{u.email}</span>
                             </div>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audio Call Dialog */}
      <Dialog open={isAudioCallOpen} onOpenChange={setIsAudioCallOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Audio Call</DialogTitle>
          </DialogHeader>
          {selectedChat && (
            <div className="flex flex-col items-center justify-center space-y-6 py-6">
              <Avatar
                className={cn(
                  "h-24 w-24 rounded-full",
                  selectedChat.color || "bg-primary"
                )}
              >
                <AvatarFallback
                  className={cn(
                    "rounded-full text-white text-3xl font-bold",
                    selectedChat.color || "bg-primary"
                  )}
                >
                  {selectedChat.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold">
                  {selectedChat.name}
                </h3>
                <p className="text-primary font-medium animate-pulse">
                  Calling...
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-14 w-14 rounded-full">
                  <Mic className="w-6 h-6" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-14 w-14 rounded-full"
                  onClick={() => setIsAudioCallOpen(false)}
                >
                  <Phone className="w-6 h-6 rotate-[135deg]" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Video Call Dialog */}
      <Dialog open={isVideoCallOpen} onOpenChange={setIsVideoCallOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Video Call</DialogTitle>
          </DialogHeader>
            {activeCall && activeCall.status === 'connected' ? (
                <div className="flex flex-col items-center justify-center space-y-6 py-6 h-full w-full">
                     <div className="relative w-full h-[300px] bg-black rounded-xl overflow-hidden">
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        <div className="absolute bottom-4 right-4 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                           <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        </div>
                     </div>
                     <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                          <MicOff className="w-6 h-6" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-12 w-12 rounded-full"
                          onClick={() => {
                              endCall();
                              setIsVideoCallOpen(false);
                          }}
                        >
                          <Phone className="w-6 h-6 rotate-[135deg]" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                          <VideoOff className="w-6 h-6" />
                        </Button>
                     </div>
                </div>
            ) : (
            <div className="flex flex-col items-center justify-center space-y-6 py-6">
              <Avatar
                className={cn(
                  "h-28 w-28 sm:h-32 sm:w-32 rounded-2xl sm:rounded-3xl",
                  selectedChat?.color || "bg-primary"
                )}
              >
                <AvatarFallback
                  className={cn(
                    "rounded-2xl sm:rounded-3xl text-white text-3xl sm:text-4xl font-bold",
                    selectedChat?.color || "bg-primary"
                  )}
                >
                  {selectedChat?.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold">
                  {selectedChat?.name}
                </h3>
                <p className="text-primary font-medium animate-pulse">
                  {activeCall?.status === 'offering' ? 'Calling...' : 'Connecting...'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                  <MicOff className="w-6 h-6" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-12 w-12 rounded-full"
                  onClick={() => {
                      endCall();
                      setIsVideoCallOpen(false);
                  }}
                >
                  <Phone className="w-6 h-6 rotate-[135deg]" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                  <VideoOff className="w-6 h-6" />
                </Button>
              </div>
            </div>
            )}
        </DialogContent>
      </Dialog>

      {/* User Info Dialog */}
      <Dialog open={isInfoOpen} onOpenChange={setIsInfoOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Info</DialogTitle>
          </DialogHeader>
          {selectedChat && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border">
                <Avatar
                  className={cn("h-16 w-16 rounded-full shrink-0", selectedChat.color || "bg-primary")}
                >
                  <AvatarFallback
                    className={cn(
                      "rounded-full text-white text-xl font-bold",
                      selectedChat.color || "bg-primary"
                    )}
                  >
                    {selectedChat.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{selectedChat.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedChat.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        selectedChat.status === "online" ? "bg-green-500" : "bg-muted-foreground"
                      )}
                    />
                    <span className="text-xs uppercase font-bold text-muted-foreground">
                      {selectedChat.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl border border-transparent hover:bg-muted/50 hover:border-border transition-colors">
                  <span className="text-sm font-medium text-muted-foreground">
                    Email
                  </span>
                  <span className="text-sm font-bold truncate ml-2">
                    {selectedChat.email}
                  </span>
                </div>
                {/* <div className="flex justify-between items-center p-3 rounded-xl border border-transparent hover:bg-muted/50 hover:border-border transition-colors">
                  <span className="text-sm font-medium text-muted-foreground">
                    Shared Files
                  </span>
                  <span className="text-sm font-bold">12</span>
                </div> */}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="w-full">
                  Block User
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                >
                  Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Attach File Dialog */}
      <Dialog open={isAttachOpen} onOpenChange={setIsAttachOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Attachment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-2 hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">Click to upload</p>
                <p className="text-xs text-muted-foreground">
                  or drag and drop files here
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Supported: JPG, PNG, PDF, DOCX (Max 10MB)
            </p>
            <Button
              className="w-full"
              onClick={() => setIsAttachOpen(false)}
            >
              Upload & Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!incomingCall} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Incoming {incomingCall?.type === 'video' ? 'Video' : 'Audio'} Call</DialogTitle>
          </DialogHeader>
            <div className="flex flex-col items-center justify-center space-y-6 py-6">
              <Avatar
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full"
              >
                <AvatarFallback className="rounded-full text-white text-3xl font-bold bg-blue-500">
                  {incomingCall?.callerName?.slice(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold">
                  {incomingCall?.callerName || "Unknown Caller"}
                </h3>
                <p className="text-muted-foreground animate-pulse">
                  Incoming call...
                </p>
              </div>
              <div className="flex items-center gap-8">
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-14 w-14 rounded-full"
                  onClick={rejectCall}
                >
                  <Phone className="w-6 h-6 rotate-[135deg]" />
                </Button>
                <Button 
                   size="icon" 
                   className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 animate-bounce"
                   onClick={() => {
                       answerCall();
                       if(incomingCall?.type === 'video') setIsVideoCallOpen(true);
                       else setIsAudioCallOpen(true);
                   }}
                >
                  <Phone className="w-6 h-6" />
                </Button>
              </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
