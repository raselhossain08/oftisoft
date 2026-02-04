
"use client";

import { cn } from "@/lib/utils";
import { Link } from "lucide-react"; // Import Link icon, but use next/link for component

// Update TABS array
const TABS = [
    { id: "profile", label: "Profile", href: "/dashboard/settings" },
    { id: "security", label: "Security", href: "/dashboard/settings/security" },
    { id: "notifications", label: "Notifications", href: "/dashboard/settings/notifications" },
    { id: "integrations", label: "Integrations", href: "/dashboard/settings/integrations" }, // Added
];

// ... (rest of the file content needs to be re-written to include the new tab properly)
// Wait, I should use `edit` or `replace` instead of overwriting the whole layout to be safe, 
// but since it's a layout file, overwriting with the full content is cleaner if I have it.
// I'll rewrite the whole file to include the icons properly.

import {
    User, Lock, Bell, LogOut, Blocks
} from "lucide-react";
import NextLink from "next/link"; // Renamed to avoid collision if any
import { usePathname } from "next/navigation";

const NEW_TABS = [
    { id: "profile", label: "Profile", icon: User, href: "/dashboard/settings" },
    { id: "security", label: "Security", icon: Lock, href: "/dashboard/settings/security" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/dashboard/settings/notifications" },
    { id: "integrations", label: "Integrations", icon: Blocks, href: "/dashboard/settings/integrations" },
];

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="mx-auto space-y-8">

            <div className="flex flex-col md:flex-row gap-8">

                {/* Sidebar Navigation */}
                <div className="md:w-64 space-y-2 shrink-0">
                    <h1 className="text-2xl font-bold mb-6 px-4">Settings</h1>

                    {NEW_TABS.map((tab) => {
                        // Check if active. Logic: Exact match OR default fallback for profile
                        const isActive = pathname === tab.href || (tab.href === "/dashboard/settings" && pathname === "/dashboard/settings/profile");

                        return (
                            <NextLink
                                key={tab.id}
                                href={tab.href === "/dashboard/settings" ? "/dashboard/settings/profile" : tab.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                                    isActive
                                        ? "bg-primary/10 text-primary font-bold"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </NextLink>
                        )
                    })}

                    <div className="pt-4 mt-4 border-t border-border">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 font-medium transition-colors">
                            <LogOut className="w-5 h-5" /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-card border border-border rounded-3xl p-8 shadow-sm min-h-[600px]">
                    {children}
                </div>

            </div>

        </div>
    );
}
