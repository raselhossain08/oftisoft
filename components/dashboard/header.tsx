"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  ChevronRight,
  Settings,
  LogOut,
  User,
  Zap,
  LifeBuoy,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/hooks/useAuth";

const NOTIFICATIONS = [
  { id: 1, text: "New project assignment", time: "2m ago", unread: true },
  { id: 2, text: "Server backup completed", time: "1h ago", unread: false },
  { id: 3, text: "Alex commented on your task", time: "3h ago", unread: true },
];

export default function Header() {
  const pathname = usePathname();
  const { setMobileSidebarOpen } = useDashboard();
  const { user, logout } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1));

  const avatarSrc = user?.avatarUrl 
    ? (user.avatarUrl.startsWith('http') 
        ? user.avatarUrl 
        : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.avatarUrl}`)
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Alex'}`;

  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AM';

  return (
    <header className="h-16 sm:h-20 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0 h-9 w-9"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div
          className={cn(
            "relative transition-all duration-500 ease-out flex items-center gap-2 sm:gap-4 flex-1 min-w-0",
            isSearchFocused ? "max-w-2xl" : "max-w-md"
          )}
        >
          <div className="relative w-full max-w-md group">
            <motion.div
              layout
              className={cn(
                "absolute inset-0 bg-primary/5 rounded-xl sm:rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity",
                isSearchFocused && "opacity-100 bg-primary/10 ring-2 ring-primary/20"
              )}
            />
            <Search
              className={cn(
                "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors shrink-0",
                isSearchFocused ? "text-primary" : "text-muted-foreground"
              )}
            />
            <Input
              type="text"
              placeholder="Search... (Ctrl+K)"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                if (!searchQuery) setIsSearchFocused(false);
              }}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-11 pr-10 sm:pr-12 h-9 sm:h-10 bg-muted/30 border-border rounded-xl sm:rounded-2xl text-sm focus:bg-background"
            />
            <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {isSearchFocused && searchQuery ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-3 h-3" />
                </Button>
              ) : (
                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              )}
            </div>
          </div>

          <AnimatePresence>
            {!isSearchFocused && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="hidden xl:flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap shrink-0"
              >
                <Separator orientation="vertical" className="h-5" />
                {breadcrumbs.map((item, index) => (
                  <div key={item} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight className="w-3 h-3" />}
                    <span
                      className={cn(
                        index === breadcrumbs.length - 1
                          ? "font-bold text-foreground"
                          : "hover:text-foreground transition-colors"
                      )}
                    >
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
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 pl-2 shrink-0">
        <Badge
          variant="outline"
          className="hidden lg:flex items-center gap-2 px-2.5 py-1 border-green-500/20 bg-green-500/10 text-green-600 text-[10px] font-bold uppercase"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Systems Normal
        </Badge>

        <Separator orientation="vertical" className="h-6 sm:h-8 hidden lg:block" />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative h-9 w-9 sm:h-10 sm:w-10 rounded-xl",
                "text-muted-foreground hover:text-foreground"
              )}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background animate-pulse" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-2xl p-0">
            <div className="p-4 border-b border-border bg-muted/30">
              <DropdownMenuLabel className="text-base font-bold p-0">
                Notifications
              </DropdownMenuLabel>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {NOTIFICATIONS.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className="flex gap-3 p-4 cursor-pointer rounded-none focus:bg-muted/50"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium leading-tight mb-1">
                      {notif.text}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{notif.time}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="justify-center py-3 font-bold text-primary focus:bg-primary/5">
              <Link href="/dashboard/notifications">View All Activity</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 h-auto py-2"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{user?.name || "Anonymous"}</p>
                <p className="text-xs text-muted-foreground">{user?.isActive ? "Verified Resident" : "Standby Identity"}</p>
              </div>
              <div className="relative">
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border-2 border-background">
                  <AvatarImage src={avatarSrc} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white font-bold rounded-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2">
            <div className="p-3 mb-2 bg-muted/30 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">
                  Current Plan
                </p>
                <p className="font-bold text-sm">Pro Enterprise</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings/profile" className="flex items-center gap-3 cursor-pointer">
                <User className="w-4 h-4" /> Profile Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-3 cursor-pointer">
                <Settings className="w-4 h-4" /> Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/support" className="flex items-center gap-3 cursor-pointer">
                <LifeBuoy className="w-4 h-4" /> Help & Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => void logout()}
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
