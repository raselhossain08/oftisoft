"use client";

import { useState, useEffect } from "react";
import { 
    Search, Bell, Menu, Command, ChevronRight, 
    Settings, LogOut, User, Zap, LifeBuoy, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
    { id: 1, text: "New project assignment", time: "2m ago", unread: true },
    { id: 2, text: "Server backup completed", time: "1h ago", unread: false },
    { id: 3, text: "Alex commented on your task", time: "3h ago", unread: true },
];

export default function Header() {
    const pathname = usePathname();
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Generate breadcrumbs from path
    const breadcrumbs = pathname
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));

    // Close dropdowns on click outside (simplified for this demo)
    useEffect(() => {
        const handleClick = () => {
            // handle click outside logic if needed, for now manual toggle is fine
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    return (
        <header className="h-20 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40 px-6 flex items-center justify-between transition-all duration-300">
            
            {/* Left: Mobile Menu & Breadcrumbs/Search */}
            <div className="flex items-center gap-6 flex-1">
                <button className="lg:hidden p-2 hover:bg-muted rounded-xl transition-colors">
                    <Menu className="w-5 h-5" />
                </button>

                {/* Animated Search Bar */}
                <div className={cn(
                    "relative transition-all duration-500 ease-out flex items-center gap-4",
                    isSearchFocused ? "w-full max-w-2xl" : "w-full max-w-md"
                )}>
                    <div className="relative w-full group">
                        <motion.div 
                            layout
                            className={cn(
                                "absolute inset-0 bg-primary/5 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity",
                                isSearchFocused && "opacity-100 bg-primary/10 ring-2 ring-primary/20"
                            )} 
                        />
                        <Search className={cn(
                            "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                            isSearchFocused ? "text-primary" : "text-muted-foreground"
                        )} />
                        <input 
                            type="text"
                            placeholder="Search anything... (Ctrl+K)"
                            value={searchQuery}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => {
                                if (!searchQuery) setIsSearchFocused(false);
                            }}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-12 py-3 bg-muted/30 border border-border rounded-2xl text-sm focus:outline-none focus:bg-background transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                            {isSearchFocused && searchQuery ? (
                                <button onClick={() => setSearchQuery("")} className="pointer-events-auto p-1 hover:bg-muted rounded-full">
                                    <X className="w-3 h-3" />
                                </button>
                            ) : (
                                <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <span className="text-xs">⌘</span>K
                                </kbd>
                            )}
                        </div>
                    </div>

                    {/* Quick Breadcrumbs (Hidden when search focused) */}
                    <AnimatePresence>
                        {!isSearchFocused && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="hidden xl:flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap"
                            >
                                <div className="w-px h-6 bg-border mx-2" />
                                {breadcrumbs.map((item, index) => (
                                    <div key={item} className="flex items-center gap-2">
                                        {index > 0 && <ChevronRight className="w-3 h-3" />}
                                        <span className={cn(
                                            index === breadcrumbs.length - 1 ? "font-bold text-foreground" : "hover:text-foreground transition-colors"
                                        )}>
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-3 md:gap-6 pl-4">
                
                {/* System Status Ticker (Mini Carousel) */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Systems Normal</span>
                </div>

                <div className="w-px h-8 bg-border hidden lg:block" />

                {/* Notifications */}
                <div className="relative">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={cn(
                            "relative p-3 rounded-xl transition-all",
                            showNotifications ? "bg-primary/10 text-primary ring-2 ring-primary/20" : "hover:bg-muted text-muted-foreground"
                        )}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                    </motion.button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-4 w-80 bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden origin-top-right z-50"
                            >
                                <div className="p-4 border-b border-border bg-muted/30">
                                    <h4 className="font-bold">Notifications</h4>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    {NOTIFICATIONS.map((notif) => (
                                        <div key={notif.id} className="p-4 border-b border-border/50 hover:bg-muted/50 transition-colors flex gap-3 cursor-pointer">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium leading-tight mb-1">{notif.text}</p>
                                                <p className="text-[10px] text-muted-foreground">{notif.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/dashboard/notifications" className="block p-3 text-center text-xs font-bold text-primary hover:bg-primary/5 transition-colors">
                                    View All Activity
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Profile User Menu */}
                <div className="relative">
                    <motion.button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 pl-2 sm:pl-4 transition-opacity group"
                    >
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold leading-none group-hover:text-primary transition-colors">Alex Morgan</p>
                            <p className="text-xs text-muted-foreground">Premium Plan</p>
                        </div>
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                                AM
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-card p-0.5 rounded-full">
                                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                            </div>
                        </div>
                    </motion.button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-4 w-64 bg-card/95 backdrop-blur-xl border border-border rounded-3xl shadow-2xl overflow-hidden origin-top-right z-50 p-2"
                            >
                                <div className="p-3 mb-2 bg-muted/30 rounded-2xl flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Current Plan</p>
                                        <p className="font-bold text-sm">Pro Enterprise</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Link href="/dashboard/settings/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm font-medium transition-colors">
                                        <User className="w-4 h-4" /> Profile Details
                                    </Link>
                                    <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm font-medium transition-colors">
                                        <Settings className="w-4 h-4" /> Account Settings
                                    </Link>
                                    <Link href="/dashboard/support" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-sm font-medium transition-colors">
                                        <LifeBuoy className="w-4 h-4" /> Help & Support
                                    </Link>
                                </div>
                                <div className="h-px bg-border my-2" />
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-sm font-medium transition-colors text-left">
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
