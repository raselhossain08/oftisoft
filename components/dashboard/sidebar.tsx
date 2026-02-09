"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  PieChart,
  CreditCard,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Code2,
  Users,
  Package,
  Briefcase,
  Megaphone,
  Wallet,
  MessageCircle,
  ShieldCheck,
  ShoppingBag,
  Library,
  Heart,
  TrendingUp,
  Star,
  FileText,
  Layout,
  ShoppingCart,
  HomeIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/ui/logo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/hooks/useAuth";
import { useBadgeCounts } from "@/hooks/useBadgeCounts";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
    { icon: HomeIcon, label: "Home", href: "/", roles: ["Viewer", "Editor", "Support", "Admin"] },
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", roles: ["Viewer", "Editor", "Support", "Admin"] },
      { icon: PieChart, label: "Analytics", href: "/dashboard/analytics", roles: ["Editor", "Admin"] },
      { icon: MessageSquare, label: "Messages", href: "/dashboard/messages", badgeKey: "messages", roles: ["Viewer", "Editor", "Support", "Admin"] },
      { icon: FolderKanban, label: "Projects", href: "/dashboard/projects", roles: ["Editor", "Admin"] },
    ]
  },
  {
    label: "Commerce",
    items: [
      { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders", badgeKey: "orders", roles: ["Admin", "Support"] },
      { icon: Package, label: "Products", href: "/dashboard/products", roles: ["Admin", "Editor"] },
      { icon: Briefcase, label: "Services", href: "/dashboard/services", roles: ["Admin", "Support"] },
      { icon: FileText, label: "Quotes", href: "/dashboard/quotes", roles: ["Viewer", "Editor", "Admin"] },
      { icon: ShoppingBag, label: "Purchases", href: "/dashboard/purchases", roles: ["Viewer", "Editor", "Admin"] },
    ]

  },
  {
    label: "Marketing",
    items: [
      { icon: Megaphone, label: "Campaigns", href: "/dashboard/marketing/campaigns", roles: ["Admin", "Editor"] },
      { icon: Layout, label: "Ads", href: "/dashboard/marketing/ads", roles: ["Admin", "Editor"] },
      { icon: Users, label: "Leads", href: "/dashboard/marketing/leads", badgeKey: "leads", roles: ["Admin", "Editor", "Support"] },
    ]
  },
  {
    label: "Personal",

    items: [
      { icon: Library, label: "Downloads", href: "/dashboard/downloads", roles: ["Viewer", "Editor", "Admin"] },
      { icon: Heart, label: "Favorites", href: "/dashboard/favorites", roles: ["Viewer", "Editor", "Admin"] },
      { icon: Star, label: "Reviews", href: "/dashboard/reviews", roles: ["Viewer", "Editor", "Admin"] },
      { icon: TrendingUp, label: "Affiliate", href: "/dashboard/affiliate", roles: ["Viewer", "Editor", "Admin"] },
    ]
  },
  {
    label: "Management",
    items: [
      { icon: Users, label: "Users", href: "/dashboard/admin/users", roles: ["Admin"] },
      { icon: Wallet, label: "Finance", href: "/dashboard/admin/finance", roles: ["Admin"] },
      { icon: Layout, label: "Content", href: "/dashboard/admin/content", roles: ["Admin", "Editor"] },
      { icon: ShieldCheck, label: "System", href: "/dashboard/settings/system", roles: ["Admin"] },
      { icon: CreditCard, label: "Billing", href: "/dashboard/billing", roles: ["Admin", "Viewer", "Editor"] },
      { icon: Settings, label: "Settings", href: "/dashboard/settings", roles: ["Viewer", "Editor", "Admin"] },
      { icon: MessageCircle, label: "Support", href: "/dashboard/support", roles: ["Viewer", "Editor", "Admin", "Support"] },
    ]
  }
];

type SidebarContentProps = {
  collapsed?: boolean;
  onNavClick?: () => void;
};

function SidebarContent({ collapsed = false, onNavClick }: SidebarContentProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const badgeCounts = useBadgeCounts();

  const activeRole = user?.role || "Viewer";

  return (
    <>
      <ScrollArea className="flex-1 px-3 max-h-[100vh] overflow-y-auto">
        <div className="space-y-6 py-4 ">
          {NAV_GROUPS.map((group) => {
            const filteredItems = group.items.filter((item) => item.roles.includes(activeRole));
            if (filteredItems.length === 0) return null;

            return (
              <div key={group.label} className="space-y-2">
                {!collapsed && (
                  <h4 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">
                    {group.label}
                  </h4>
                )}
                <nav className="space-y-1">
                  {filteredItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    // Get badge count from badgeKey if it exists
                    const badgeCount = (item as any).badgeKey ? badgeCounts[(item as any).badgeKey as keyof typeof badgeCounts] : 0;
                    const hasBadge = badgeCount > 0;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavClick}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all relative group",
                          isActive
                            ? "bg-primary/10 text-primary font-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                            : "text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-5 h-5 shrink-0 transition-all duration-300",
                            isActive ? "text-primary scale-110" : "group-hover:text-foreground group-hover:scale-110"
                          )}
                        />

                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="whitespace-nowrap flex-1 truncate text-sm font-bold tracking-tight"
                          >
                            {item.label}
                          </motion.span>
                        )}

                        {hasBadge && !collapsed && (
                          <Badge
                            className={cn(
                              "text-[9px] font-black px-1.5 py-0 h-4 min-w-[16px] flex items-center justify-center rounded-full border-none",
                              isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {badgeCount}
                          </Badge>
                        )}
                        
                        {hasBadge && collapsed && (
                          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-card shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
                        <div className="p-4 border-t border-border/40 bg-muted/5 space-y-2">
        {!collapsed && !["Admin", "Super Admin"].includes(activeRole) && (
          <div className="mb-4 p-5 rounded-3xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent border border-primary/10 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 blur-[40px] rounded-full group-hover:bg-primary/20 transition-colors" />
            <p className="font-black text-xs mb-1 tracking-tight">Expansion Protocol</p>
            <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed font-medium">
              Upgrade to Multi-Matrix Node for unlimited asset distribution.
            </p>
            <Button asChild size="sm" className="w-full h-9 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Link href="/dashboard/billing/subscription">Upgrade Link</Link>
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => void logout()}
          className={cn(
            "w-full justify-start gap-4 h-12 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 hover:text-red-500",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          {!collapsed && <span className="text-xs">Logout</span>}
        </Button>
      </div>
        </div>

      </ScrollArea>


    </>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { mobileSidebarOpen, setMobileSidebarOpen } = useDashboard();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: collapsed ? 100 : 280 }}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className="h-screen sticky top-0 bg-[#050505]/60 backdrop-blur-2xl border-r border-white/5 flex flex-col z-40 hidden lg:flex"
      >
        <div className="h-24 flex items-center justify-between px-6 border-b border-white/5 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 font-black overflow-hidden"
            >
              <Logo variant="white" size="lg" />
            </motion.div>
          ) : (
            <Logo showText={false} size="lg" className="mx-auto" />
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full border border-white/10 bg-[#0A0A0A] shadow-xl text-muted-foreground hover:text-white transition-all z-50 invisible lg:visible"
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </Button>
        </div>

        <SidebarContent collapsed={collapsed} />
      </motion.aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[300px] p-0 border-none bg-[#050505]/95 backdrop-blur-3xl flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <SheetHeader className="p-8 border-b border-white/5 shrink-0 relative">
             <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex items-center gap-4">
              <Logo variant="white" size="lg" />
            </div>
          </SheetHeader>
          <div className="flex-1 flex flex-col min-h-0">
            <SidebarContent onNavClick={() => setMobileSidebarOpen(false)} />
          </div>
          <div className="p-6 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30">Protocol v2.0.26</p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
