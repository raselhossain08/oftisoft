"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useHomeContentStore } from "@/lib/store/home-content";

const AUTH_PATHS = [
  "/dashboard/login",
  "/dashboard/register",
  "/dashboard/forgot-password",
  "/dashboard/reset-password",
  "/dashboard/2fa",
];

function isAuthPath(path: string | null) {
  return path && AUTH_PATHS.some((p) => path.startsWith(p));
}

/**
 * Syncs auth state from httpOnly cookies on app load.
 * Skips rehydrate on auth pages to avoid reload/hydration issues.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    // Skip checking auth on login/register pages to avoid loops
    if (isAuthPath(pathname)) return;
    
    const id = setTimeout(() => checkAuth(), 100);
    return () => clearTimeout(id);
  }, [checkAuth, pathname]);


  useEffect(() => {
    if (!pathname || isAuthPath(pathname)) return;
    try {
      const p = useHomeContentStore.persist?.rehydrate?.();
      if (typeof p?.catch === "function") p.catch(() => {});
    } catch {
      /* ignore sync errors */
    }
  }, [pathname]);

  return <>{children}</>;
}
