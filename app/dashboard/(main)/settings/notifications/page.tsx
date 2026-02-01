
"use client";

import { useState } from "react";
import { Mail, Bell, Smartphone, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const NOTIFICATION_CHANNELS = [
    { id: "email", label: "Email Notifications", icon: Mail, desc: "Receive updates directly to your inbox." },
    { id: "push", label: "Push Notifications", icon: Bell, desc: "Get alerts on your desktop or mobile device." },
    { id: "sms", label: "SMS Alerts", icon: Smartphone, desc: "Receive critical alerts via text message." },
];

const NOTIFICATION_TYPES = [
    { category: "Projects", items: ["New Project Created", "Task Assigned", "Project Milestone Reached", "Comments & Mentions"] },
    { category: "Billing", items: ["Invoice Generated", "Payment Successful", "Subscription Renewal"] },
    { category: "System", items: ["Security Alerts", "Maintenance Updates", "New Features"] },
];

export default function NotificationsSettings() {
    const [activeChannels, setActiveChannels] = useState(["email", "push"]);

    const toggleChannel = (id: string) => {
        if (activeChannels.includes(id)) setActiveChannels(activeChannels.filter(c => c !== id));
        else setActiveChannels([...activeChannels, id]);
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Notifications</h2>
                <p className="text-muted-foreground">Control how and when you receive updates.</p>
            </div>

            {/* Channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {NOTIFICATION_CHANNELS.map((channel) => (
                    <div
                        key={channel.id}
                        className={cn(
                            "p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                            activeChannels.includes(channel.id) ? "bg-primary/5 border-primary" : "bg-card border-border hover:border-primary/50"
                        )}
                        onClick={() => toggleChannel(channel.id)}
                    >
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors",
                            activeChannels.includes(channel.id) ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                        )}>
                            <channel.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold mb-1">{channel.label}</h3>
                        <p className="text-xs text-muted-foreground">{channel.desc}</p>

                        {activeChannels.includes(channel.id) && (
                            <div className="absolute top-4 right-4 text-primary">
                                <div className="w-3 h-3 bg-primary rounded-full" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Preferences */}
            <div className="space-y-8">
                {NOTIFICATION_TYPES.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border">{section.category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {section.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                                    <span className="text-sm font-medium">{item}</span>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
