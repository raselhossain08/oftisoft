
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Settings, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { NotificationItem } from "@/components/notifications/notification-item";

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
        <div className="mx-auto space-y-8  pb-20">

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
                            <NotificationItem
                                key={notif.id}
                                notification={notif}
                                filter={filter}
                                onMarkAsRead={markAsRead}
                                onArchive={archive}
                                onDelete={deleteNotification}
                                index={i}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
