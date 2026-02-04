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
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <nav className="bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl shadow-2xl shadow-black/20 p-2 flex justify-between items-center relative overflow-hidden ring-1 ring-white/10">
                
                {/* Dynamic Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50 blur-xl pointer-events-none" />

                {LINKS.map((link) => {
                    const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
                    
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="relative flex-1 flex flex-col items-center justify-center py-2"
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-primary/10 rounded-xl"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            
                            <div className={cn(
                                "relative z-10 flex flex-col items-center gap-1 transition-colors duration-300",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}>
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    className="relative"
                                >
                                    <link.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-glow"
                                            className="absolute inset-0 bg-primary/20 blur-lg rounded-full"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </motion.div>
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-wider transition-all duration-300",
                                    isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 hidden"
                                )}>
                                    {link.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
