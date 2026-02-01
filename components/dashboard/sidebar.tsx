
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, FolderKanban, MessageSquare, PieChart, CreditCard,
    Settings, HelpCircle, ChevronLeft, ChevronRight, LogOut, Code2
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: FolderKanban, label: "Projects", href: "/dashboard/projects" },
    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: 3 },
    { icon: PieChart, label: "Analytics", href: "/dashboard/analytics" },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <motion.aside
            initial={{ width: 256 }}
            animate={{ width: collapsed ? 80 : 256 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-screen sticky top-0 bg-card border-r border-border flex flex-col z-40 hidden md:flex"
        >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 font-bold text-xl"
                    >
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Code2 className="w-5 h-5" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Ofitsoft</span>
                    </motion.div>
                )}
                {collapsed && (
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white mx-auto">
                        <Code2 className="w-5 h-5" />
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 hover:bg-muted rounded-lg transition-colors absolute -right-3 top-6 bg-card border border-border shadow-sm z-50 text-muted-foreground"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group",
                                isActive
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />

                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="whitespace-nowrap flex-1"
                                >
                                    {item.label}
                                </motion.span>
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-border">
                                    {item.label}
                                </div>
                            )}

                            {/* Badge */}
                            {item.badge && !collapsed && (
                                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {item.badge}
                                </span>
                            )}
                            {item.badge && collapsed && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
                <Link
                    href="/dashboard/help"
                    className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-muted-foreground hover:bg-muted hover:text-foreground mb-2",
                        collapsed && "justify-center"
                    )}
                >
                    <HelpCircle className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Help & Support</span>}
                </Link>
                <button className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-red-500 hover:bg-red-500/10",
                    collapsed && "justify-center"
                )}>
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span>Sign Out</span>}
                </button>
            </div>

        </motion.aside>
    );
}
