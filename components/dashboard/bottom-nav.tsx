
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, MessageSquare, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const LINKS = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/dashboard/projects", icon: Folder, label: "Projects" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "Chat" },
    { href: "/dashboard/notifications", icon: Bell, label: "Alerts" },
    { href: "/dashboard/settings", icon: Settings, label: "Menu" },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-t border-border px-6 py-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center">
                {LINKS.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center gap-1.5 transition-all relative py-1",
                                isActive ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="bottom-nav-indicator"
                                    className="absolute -top-2 w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <link.icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
