"use client";

import { cn } from "@/lib/utils";
import { 
    User, Lock, Bell, LogOut, Blocks, CreditCard, Settings, ChevronRight, Menu, Globe, Zap
} from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { authAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const SETTINGS_TABS = [
    { id: "profile", label: "Profile", icon: User, href: "/dashboard/settings/profile", description: "Identity & Metadata" },
    { id: "billing", label: "Billing", icon: CreditCard, href: "/dashboard/settings/billing", description: "Financial Settlement" },
    { id: "security", label: "Security", icon: Lock, href: "/dashboard/settings/security", description: "Logic & Encryption" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/dashboard/settings/notifications", description: "Signal Protocols" },
    { id: "payments", label: "Payments", icon: Globe, href: "/dashboard/settings/payments", description: "Gateway Configuration" },
    { id: "integrations", label: "Integrations", icon: Blocks, href: "/dashboard/settings/integrations", description: "Neural Connections" },
    { id: "system", label: "System", icon: Settings, href: "/dashboard/settings/system", description: "Core Topology" },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await authAPI.logout();
            toast.success("Identity De-synchronized", {
                description: "Your session has been securely terminated."
            });
            router.push("/auth/login");
        } catch (error) {
            toast.error("Termination Failed", {
                description: "The neural link remains active. Please retry."
            });
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="flex flex-col space-y-8 pb-20 px-3 md:px-0">
            {/* Mobile Header */}
            <div className="flex items-center justify-between md:hidden bg-muted/30 p-4 rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <Settings className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">Settings</h1>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Core Configuration</p>
                    </div>
                </div>
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl border border-border/50">
                            <Menu className="w-5 h-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-6">
                        <SheetHeader className="pb-8 border-b border-border/50">
                            <SheetTitle className="text-2xl font-black tracking-tighter">Oftisoft Node</SheetTitle>
                        </SheetHeader>
                        <div className="space-y-2 mt-8">
                            {SETTINGS_TABS.map((tab) => {
                                const isActive = pathname.startsWith(tab.href);
                                return (
                                    <NextLink
                                        key={tab.id}
                                        href={tab.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-4 rounded-xl transition-all group",
                                            isActive
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        <tab.icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-primary")} />
                                        <div className="flex flex-col items-start text-left">
                                            <span className="font-black text-sm">{tab.label}</span>
                                            <span className={cn("text-[9px] font-bold uppercase tracking-tighter", isActive ? "text-white/70" : "text-muted-foreground/60")}>
                                                {tab.description}
                                            </span>
                                        </div>
                                    </NextLink>
                                )
                            })}
                        </div>
                        <div className="pt-8 mt-8 border-t border-border/50">
                            <button 
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-red-500 hover:bg-red-500/10 font-black transition-all group disabled:opacity-50"
                            >
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                                    {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                                </div>
                                <span>{isLoggingOut ? "Purging Link..." : "Sign Out Instance"}</span>
                            </button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-72 shrink-0 space-y-2">
                    <div className="flex items-center gap-3 mb-10 px-4">
                        <div className="w-12 h-auto rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-xl shadow-primary/20 group hover:scale-110 transition-transform duration-500">
                            <Settings className="w-6 h-6 animate-spin-slow group-hover:rotate-180 transition-transform duration-700" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Settings</h1>
                            <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Control Matrix</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {SETTINGS_TABS.map((tab) => {
                            const isActive = pathname.startsWith(tab.href);
                            return (
                                <NextLink
                                    key={tab.id}
                                    href={tab.href}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-4 rounded-2xl transition-all group",
                                        isActive
                                            ? "bg-primary text-white shadow-xl shadow-primary/30"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                            isActive ? "bg-white/20 text-white" : "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                                        )}>
                                            <tab.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-black text-sm">{tab.label}</span>
                                            <span className={cn("text-[9px] font-bold uppercase tracking-tighter opacity-60", isActive ? "text-white" : "text-muted-foreground")}>
                                                {tab.description}
                                            </span>
                                        </div>
                                    </div>
                                    {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
                                </NextLink>
                            )
                        })}
                    </nav>

                    <div className="pt-8 mt-8 border-t border-border/50 px-4">
                        <button 
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 font-black transition-all group disabled:opacity-50"
                        >
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                                {isLoggingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
                            </div>
                            <span>{isLoggingOut ? "Purging Link..." : "Sign Out Instance"}</span>
                        </button>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-1 bg-card/10 backdrop-blur-3xl border border-border/50 rounded-[40px] p-6 md:p-12 shadow-sm min-h-[700px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-1000" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
