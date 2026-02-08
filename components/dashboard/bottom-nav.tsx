"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, MessageSquare, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const LINKS = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/dashboard/projects", icon: Folder, label: "Projects" },
  { href: "/dashboard/messages", icon: MessageSquare, label: "Chat" },
  { href: "/dashboard/notifications", icon: Bell, label: "Alerts" },
  { href: "/dashboard/settings", icon: Settings, label: "Menu" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-10 duration-1000">
      <Card className="border-white/5 bg-[#050505]/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 rounded-[32px] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <nav className="relative flex justify-around items-center h-14">
          {LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href));

            return (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "relative flex flex-col items-center justify-center p-0 h-12 w-12 rounded-2xl transition-all duration-500",
                  isActive
                    ? "text-primary basis-1/4"
                    : "text-muted-foreground/60 hover:text-white basis-1/5"
                )}
              >
                <Link href={link.href} className="flex flex-col items-center gap-1">
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/10 rounded-2xl border border-primary/20"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  <div
                    className={cn(
                      "relative z-10 flex flex-col items-center justify-center transition-all duration-500",
                      isActive ? "text-primary scale-110" : "text-muted-foreground/60"
                    )}
                  >
                    <motion.div
                      whileTap={{ scale: 0.8 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      <link.icon
                        className={cn(
                          "w-6 h-6 transition-all duration-500",
                          isActive ? "stroke-[2.5px] drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" : "stroke-2"
                        )}
                      />
                    </motion.div>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.span
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="text-[8px] font-black uppercase tracking-[0.2em] mt-1"
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </Link>
              </Button>
            );
          })}
        </nav>
      </Card>
    </div>
  );
}
