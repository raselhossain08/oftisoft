
"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Bell, Check, Trash2, Archive, Clock, AlertTriangle,
    FileText, UserPlus, CreditCard, ChevronRight, Settings, Loader2, Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'alert': return <AlertTriangle className="w-5 h-5 text-red-500" />;
        case 'project': return <FileText className="w-5 h-5 text-blue-500" />;
        case 'team': return <UserPlus className="w-5 h-5 text-green-500" />;
        case 'billing': return <CreditCard className="w-5 h-5 text-purple-500" />;
        case 'system': return <Settings className="w-5 h-5 text-orange-500" />;
        default: return <Bell className="w-5 h-5 text-primary" />;
    }
};

const NotificationBg = ({ type }: { type: string }) => {
    switch (type) {
        case 'alert': return "bg-red-500/10 text-red-500";
        case 'project': return "bg-blue-500/10 text-blue-500";
        case 'team': return "bg-green-500/10 text-green-500";
        case 'billing': return "bg-purple-500/10 text-purple-500";
        case 'system': return "bg-orange-500/10 text-orange-500";
        default: return "bg-primary/10 text-primary";
    }
};

export default function NotificationsPage() {
    const { 
        notifications, 
        isLoading, 
        filter, 
        setFilter, 
        markAsRead, 
        markAllAsRead, 
        archive, 
        deleteNotification 
    } = useNotifications();

    return (
        <div className="mx-auto space-y-8 max-w-5xl pb-20">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight">Notifications</h1>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAllAsRead()}
                        className="text-muted-foreground hover:text-primary"
                    >
                        <Check className="w-4 h-4 mr-2" /> Mark all read
                    </Button>
                    <Link href="/dashboard/settings/notifications">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <Settings className="w-4 h-4 mr-2" /> Settings
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border/50">
                <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'unread', label: 'Unread' },
                        { id: 'high', label: 'High Priority' },
                        { id: 'archived', label: 'Archived' }
                    ].map((tab) => {
                        const isActive = filter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id as any)}
                                className={cn(
                                    "pb-4 text-sm font-bold transition-all relative whitespace-nowrap",
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab.label}
                                {isActive && (
                                    <motion.div 
                                        layoutId="notif-tab" 
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4 min-h-[400px]">
                {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                        <div key={i} className="flex items-start gap-4 p-6 rounded-[24px] border border-border/50 bg-card/50">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-1/3" />
                                <Skeleton className="h-3 w-2/3" />
                            </div>
                        </div>
                    ))
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                         <div className="w-24 h-24 bg-muted/20 rounded-full flex items-center justify-center mb-6">
                            <Inbox className="w-10 h-10 text-muted-foreground" />
                         </div>
                         <h3 className="text-xl font-bold">No notifications found</h3>
                         <p className="text-muted-foreground">You are all caught up!</p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {notifications.map((notif, i) => (
                            <motion.div
                                key={notif.id}
                                layout
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className={cn(
                                    "flex items-start gap-5 p-6 rounded-[24px] border transition-all hover:shadow-lg relative group bg-card",
                                    !notif.read && filter !== 'archived' ? "border-l-4 border-l-primary border-t border-r border-b border-border shadow-md bg-primary/[0.02]" : "border-border/50 hover:border-primary/20",
                                )}
                            >
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", NotificationBg({ type: notif.type }))}>
                                    <NotificationIcon type={notif.type} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                                        <h3 className={cn("font-bold text-base", !notif.read && "text-foreground")}>{notif.title}</h3>
                                        <span className="text-xs font-bold text-muted-foreground/60 whitespace-nowrap flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-none mb-3">{notif.description}</p>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-4 pt-1 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        {!notif.read && filter !== 'archived' && (
                                            <button 
                                                onClick={() => markAsRead(notif.id)}
                                                className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5"
                                            >
                                                <Check className="w-3.5 h-3.5" /> Mark as read
                                            </button>
                                        )}
                                        {filter !== 'archived' && (
                                            <button 
                                                onClick={() => archive(notif.id)}
                                                className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                                            >
                                                <Archive className="w-3.5 h-3.5" /> Archive
                                            </button>
                                        )}
                                        {filter === 'archived' && (
                                             <button 
                                                onClick={() => deleteNotification(notif.id)}
                                                className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Delete Forever
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {!notif.read && filter !== 'archived' && (
                                    <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-primary rounded-full animate-pulse md:block hidden shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            <div className="text-center py-8 border-t border-border/30">
                <button 
                    className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                    disabled={notifications.length === 0}
                >
                    View History <ChevronRight className="w-3 h-3" />
                </button>
            </div>

        </div>
    );
}
