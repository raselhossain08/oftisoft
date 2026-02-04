"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, FolderKanban, MessageSquare, PieChart, CreditCard,
    Settings, HelpCircle, ChevronLeft, ChevronRight, LogOut, Code2, Terminal, Users, BarChart3
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", roles: ["user", "admin"] },
    { icon: FolderKanban, label: "Projects", href: "/dashboard/projects", roles: ["user", "admin"] },

    { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badge: 3, roles: ["user", "admin"] },
    { icon: PieChart, label: "Analytics", href: "/dashboard/analytics", roles: ["user", "admin"] },
    // Admin Only Links
    { icon: Users, label: "User Management", href: "/dashboard/admin/users", roles: ["admin"] },
    { icon: BarChart3, label: "Admin Analytics", href: "/dashboard/admin/analytics", roles: ["admin"] },
    
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing", roles: ["user", "admin"] },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", roles: ["user", "admin"] },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();
    // In a real app, this would come from an AuthContext or Session
    // In a real app, this would come from an AuthContext or Session
    const [userRole, setUserRole] = useState<"admin" | "user">("admin"); // Mock RBAC Toggle

    return (
        <motion.aside
            initial={{ width: 256 }}
            animate={{ width: collapsed ? 80 : 256 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-screen sticky top-0 bg-card/50 backdrop-blur-xl border-r border-border flex flex-col z-40 hidden md:flex"
        >
            {/* Header */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-border/50">
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3 font-bold text-xl overflow-hidden"
                    >
                        <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/25">
                            <Code2 className="w-5 h-5" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500 whitespace-nowrap">
                            Ofitsoft
                        </span>
                    </motion.div>
                )}
                {collapsed && (
                    <div className="w-9 h-9 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-lg shadow-primary/25">
                        <Code2 className="w-5 h-5" />
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 hover:bg-muted rounded-full transition-colors absolute -right-3 top-7 bg-background border border-border shadow-sm z-50 text-muted-foreground hover:text-foreground"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-thin">
                {NAV_ITEMS.filter(item => item.roles.includes(userRole)).map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group",
                                isActive
                                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 shrink-0 transition-colors", 
                                isActive ? "text-primary" : "group-hover:text-foreground"
                            )} />

                            {!collapsed ? (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="whitespace-nowrap flex-1 truncate"
                                >
                                    {item.label}
                                </motion.span>
                            ) : null}

                            {/* Active Indicator Bar */}
                            {isActive && (
                                <motion.div 
                                    layoutId="activeNav"
                                    className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full" 
                                />
                            )}

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-semibold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 whitespace-nowrap border border-border translate-x-[-10px] group-hover:translate-x-0">
                                    {item.label}
                                    {/* Arrow */}
                                    <div className="absolute top-1/2 -left-1 w-2 h-2 bg-popover border-l border-b border-border -translate-y-1/2 rotate-45" />
                                </div>
                            )}

                            {/* Badge */}
                            {item.badge && !collapsed && (
                                <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full transition-all",
                                    isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                                )}>
                                    {item.badge}
                                </span>
                            )}
                            {item.badge && collapsed && (
                                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-card" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 bg-muted/10">
                {!collapsed && (
                    <div className="mb-4 bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/10 rounded-2xl p-4 relative overflow-hidden">
                         {/* Abstract Decoration */}
                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full blur-xl" />
                        
                        <p className="font-bold text-sm mb-1">Upgrade functionality</p>
                        <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
                            Unlock advanced features and AI tools.
                        </p>
                        <Link 
                            href="/dashboard/billing/subscription"
                            className="block w-full text-center py-2 bg-background border border-primary/20 text-primary text-xs font-bold rounded-lg hover:shadow-md transition-all"
                        >
                            View Plans
                        </Link>
                    </div>
                )}

                <div className="space-y-1">
                    <Link
                        href="/dashboard/help"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                            collapsed && "justify-center"
                        )}
                        title={collapsed ? "Help & Support" : undefined}
                    >
                        <HelpCircle className="w-4 h-4 shrink-0" />
                        {!collapsed && <span>Help & Support</span>}
                    </Link>
                    {/* RBAC Debug Toggle */}
                    <button 
                        onClick={() => setUserRole(prev => prev === "admin" ? "user" : "admin")}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                            collapsed && "justify-center"
                        )}
                        title={`Switch Role (Current: ${userRole})`}
                    >
                        <Users className="w-4 h-4 shrink-0 text-orange-500" />
                        {!collapsed && (
                            <div className="flex flex-col items-start leading-none text-xs">
                                <span>Switch Role</span>
                                <span className="text-[10px] text-orange-500 mt-0.5 font-bold uppercase">{userRole} View</span>
                            </div>
                        )}
                    </button>

                    <button className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-red-500 hover:bg-red-500/10",
                        collapsed && "justify-center"
                    )}
                    title={collapsed ? "Sign Out" : undefined}
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </div>

        </motion.aside>
    );
}
