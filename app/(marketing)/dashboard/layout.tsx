"use client";

import { cn } from "@/lib/utils";
import { 
    LayoutDashboard, 
    Download, 
    MessageSquare, 
    Settings, 
    CreditCard, 
    LogOut,
    ExternalLink,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "My Downloads", icon: Download, href: "/dashboard/downloads" },
    { label: "Shop Orders", icon: ShoppingBag, href: "/dashboard/orders" },
    { label: "Support Tickets", icon: MessageSquare, href: "/dashboard/support" },
    { label: "Billing", icon: CreditCard, href: "/dashboard/billing" },
    { label: "Account Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
            {/* Sidebar */}
            <aside className="w-full md:w-72 border-r border-border/50 bg-card/30 backdrop-blur-sm p-6 space-y-8">
                <div>
                    <h2 className="text-xl font-bold px-4 mb-6">Customer Portal</h2>
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                        active 
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="pt-8 border-t border-border/50">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/5 transition-all font-medium text-left">
                        <LogOut className="w-5 h-5" />
                        Log Out
                    </button>
                    
                    <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                        <p className="text-xs font-bold mb-2 flex items-center gap-2">
                            PRO MEMBER
                            <ExternalLink className="w-3 h-3" />
                        </p>
                        <p className="text-[10px] text-muted-foreground mb-3">Upgrade for priority support and exclusive monthly templates.</p>
                        <button className="w-full py-2 bg-background rounded-lg text-[10px] font-bold border border-primary/20 hover:border-primary transition-colors">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-muted/10 p-4 md:p-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
