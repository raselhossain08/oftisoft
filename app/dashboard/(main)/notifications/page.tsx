
"use client";

import { motion } from "framer-motion";
import {
    Bell, Check, Trash2, Archive, Clock, AlertTriangle,
    FileText, UserPlus, CreditCard, ChevronRight, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// --- Mock Data ---

const NOTIFICATIONS = [
    {
        id: 1, type: "alert", priority: "high",
        title: "Critical Security Update",
        desc: "A new security patch is available for your server.",
        time: "10 mins ago",
        read: false,
        icon: AlertTriangle,
        color: "text-red-500",
        bg: "bg-red-500/10"
    },
    {
        id: 2, type: "project", priority: "normal",
        title: "Project Milestone Reached",
        desc: "The 'Design Phase' for E-commerce Redesign is marked complete.",
        time: "1 hour ago",
        read: false,
        icon: FileText,
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        id: 3, type: "team", priority: "normal",
        title: "New Team Member",
        desc: "Sarah Jenkins joined the 'Mobile App' team.",
        time: "2 hours ago",
        read: true,
        icon: UserPlus,
        color: "text-green-500",
        bg: "bg-green-500/10"
    },
    {
        id: 4, type: "billing", priority: "low",
        title: "Invoice Generated",
        desc: "Invoice #INV-2024-001 is ready for review.",
        time: "Yesterday",
        read: true,
        icon: CreditCard,
        color: "text-purple-500",
        bg: "bg-purple-500/10"
    },
];

export default function NotificationsPage() {
    const [filter, setFilter] = useState("all");

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Notifications</h1>
                    <p className="text-muted-foreground">Stay updated with your latest activity.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors flex items-center gap-2">
                        <Check className="w-4 h-4" /> Mark all read
                    </button>
                    <button className="px-3 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Settings
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <div className="flex items-center gap-6">
                    {["All", "Unread", "High Priority", "Archived"].map((tab) => {
                        const isActive = filter === tab.toLowerCase();
                        return (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab.toLowerCase())}
                                className={cn(
                                    "pb-3 text-sm font-medium transition-colors relative",
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {tab}
                                {isActive && <motion.div layoutId="notif-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {NOTIFICATIONS.map((notif, i) => (
                    <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "flex items-start gap-4 p-5 rounded-2xl border transition-all hover:shadow-md relative group",
                            notif.read ? "bg-card border-border" : "bg-card border-l-4 border-l-primary border-t border-r border-b border-border shadow-sm"
                        )}
                    >
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", notif.bg, notif.color)}>
                            <notif.icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className={cn("font-bold text-sm mb-1", !notif.read && "text-foreground")}>{notif.title}</h3>
                                <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{notif.desc}</p>

                            {/* Action Buttons (visible on hover) */}
                            <div className="flex items-center gap-2 mt-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <button className="text-xs font-medium text-primary hover:underline">View Details</button>
                                <div className="w-1 h-1 bg-border rounded-full" />
                                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                                    <Archive className="w-3 h-3" /> Archive
                                </button>
                            </div>
                        </div>

                        {!notif.read && (
                            <div className="absolute top-5 right-5 w-2 h-2 bg-primary rounded-full md:hidden" />
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="text-center py-6">
                <button className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto">
                    View older notifications <ChevronRight className="w-3 h-3" />
                </button>
            </div>

        </div>
    );
}
