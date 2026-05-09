import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore, getAuthCheckComplete, setAuthCheckComplete } from "@/store/useAuthStore";

const LOGIN_PATH = "/dashboard/login";

/**
 * Protects routes requiring auth. Redirects to login if not authenticated.
 * Uses global authCheckComplete flag to prevent duplicate checks.
 */
export function useProtectedRoute() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Skip if we are already on the login page
    if (pathname === LOGIN_PATH) return;

    const verify = async () => {
      // Only check auth once globally per session
      if (!getAuthCheckComplete()) {
        await checkAuth();
        setAuthCheckComplete(true);
      }

      // Get the latest state after check
      const state = useAuthStore.getState();

      // Redirect to login if not authenticated
      if (!state.isLoading && !state.isAuthenticated && !hasRedirected.current) {
        hasRedirected.current = true;
        router.replace(LOGIN_PATH);
      }
    };

    verify();
  }, [pathname, router, checkAuth]);

  return { isAuthenticated, isLoading };
}
