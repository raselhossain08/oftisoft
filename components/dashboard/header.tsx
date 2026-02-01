
"use client";

import { Search, Bell, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">

            {/* Mobile Menu Trigger & Search */}
            <div className="flex items-center gap-4 flex-1">
                <button className="md:hidden p-2 hover:bg-muted rounded-lg">
                    <Menu className="w-5 h-5" />
                </button>

                <div className="relative w-full max-w-sm hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-muted rounded-full transition-colors">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card" />
                </button>

                {/* Profile */}
                <Link href="/dashboard/settings" className="flex items-center gap-3 pl-4 border-l border-border hover:opacity-80 transition-opacity">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold leading-none">Alex Morgan</p>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                    <div className="w-9 h-9 bg-primary/20 rounded-full border border-primary/30 flex items-center justify-center text-primary font-bold cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                        AM
                    </div>
                </Link>
            </div>

        </header>
    );
}
