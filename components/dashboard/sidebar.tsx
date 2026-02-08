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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useDashboard } from "@/lib/dashboard-context";
import { useAuth } from "@/hooks/useAuth";

const NAV_GROUPS = [
  {
    label: "Matrix Core",
    items: [
      { icon: LayoutDashboard, label: "Mainframe", href: "/dashboard", roles: ["Viewer", "Editor", "Support", "Admin"] },
      { icon: PieChart, label: "Neural Analytics", href: "/dashboard/analytics", roles: ["Editor", "Admin"] },
      { icon: MessageSquare, label: "Signal Center", href: "/dashboard/messages", badge: 3, roles: ["Viewer", "Editor", "Support", "Admin"] },
      { icon: FolderKanban, label: "Active Nodes", href: "/dashboard/projects", roles: ["Editor", "Admin"] },
    ]
  },
  {
    label: "Commerce Control",
    items: [
      { icon: ShoppingCart, label: "Grid Orders", href: "/dashboard/orders", badge: 42, roles: ["Admin", "Support"] },
      { icon: Package, label: "Asset Library", href: "/dashboard/products", roles: ["Admin", "Editor"] },
      { icon: Briefcase, label: "Service Flux", href: "/dashboard/services", roles: ["Admin", "Support"] },
      { icon: ShoppingBag, label: "Acquisitions", href: "/dashboard/purchases", roles: ["Viewer", "Editor", "Admin"] },
    ]
  },
  {
    label: "Personal Ledger",
    items: [
      { icon: Library, label: "Local Cache", href: "/dashboard/downloads", roles: ["Viewer", "Editor", "Admin"] },
      { icon: Heart, label: "Watchlist", href: "/dashboard/favorites", roles: ["Viewer", "Editor", "Admin"] },
      { icon: Star, label: "Reputation", href: "/dashboard/reviews", roles: ["Viewer", "Editor", "Admin"] },
      { icon: TrendingUp, label: "Growth Link", href: "/dashboard/affiliate", roles: ["Viewer", "Editor", "Admin"] },
    ]
  },
  {
    label: "Infrastructure",
    items: [
      { icon: Users, label: "Personnel", href: "/dashboard/admin/users", roles: ["Admin"] },
      { icon: Wallet, label: "Financial Engine", href: "/dashboard/admin/finance", roles: ["Admin"] },
      { icon: Layout, label: "Content Forge", href: "/dashboard/admin/content", roles: ["Admin", "Editor"] },
      { icon: ShieldCheck, label: "Core Settings", href: "/dashboard/settings/system", roles: ["Admin"] },
      { icon: CreditCard, label: "Billing Logic", href: "/dashboard/billing", roles: ["Admin", "Viewer", "Editor"] },
      { icon: Settings, label: "Configuration", href: "/dashboard/settings", roles: ["Viewer", "Editor", "Admin"] },
      { icon: MessageCircle, label: "Direct Link", href: "/dashboard/support", roles: ["Viewer", "Editor", "Admin", "Support"] },
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
  const [simulatedRole, setSimulatedRole] = useState<string | null>(null);

  const activeRole = simulatedRole || user?.role || "Viewer";

  return (
    <>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-6 py-4">
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

                        {item.badge && !collapsed && (
                          <Badge
                            className={cn(
                              "text-[9px] font-black px-1.5 py-0 h-4 min-w-[16px] flex items-center justify-center rounded-full border-none",
                              isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        
                        {item.badge && collapsed && (
                          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border border-card shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/40 bg-muted/5 space-y-2">
        {!collapsed && (
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
          onClick={() => {
            const roles = ["Admin", "Editor", "Support", "Viewer"];
            const currentIndex = roles.indexOf(activeRole);
            const nextIndex = (currentIndex + 1) % roles.length;
            setSimulatedRole(roles[nextIndex]);
            toast.info(`Simulation Role: ${roles[nextIndex]}`, {
              description: "Dashboard view updated for specific clearance level."
            });
          }}
          className={cn(
            "w-full justify-start gap-4 h-12 rounded-2xl font-bold text-muted-foreground hover:text-foreground hover:bg-white/5",
            collapsed && "justify-center px-0"
          )}
        >
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
            <Users className="w-4 h-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="text-xs">Simulate Clearance</span>
              <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">{activeRole}</span>
            </div>
          )}
        </Button>

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
          {!collapsed && <span className="text-xs">Terminated Node</span>}
        </Button>
      </div>
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
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <span className="text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                OFTISOFT
              </span>
            </motion.div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
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
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0">
                <Code2 className="w-5 h-5" />
              </div>
              <SheetTitle className="text-2xl font-black tracking-tighter text-white !mt-0">OFTISOFT</SheetTitle>
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
