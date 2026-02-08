import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const LOGIN_PATH = "/dashboard/login";

/**
 * Protects routes requiring auth. Redirects to login if not authenticated.
 */
export function useProtectedRoute() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const hasChecked = useRef(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    // 1. Skip if we are already on the login page or registering
    if (pathname === LOGIN_PATH || pathname?.includes("/register")) return;

    const verify = async () => {
      // 2. Only run checkAuth if we haven't checked yet
      if (!hasChecked.current) {
        hasChecked.current = true;
        await checkAuth();
      }

      // 3. Get the absolute latest state
      const state = useAuthStore.getState();

      // 4. If not loading, not authenticated, and not already on login -> Redirect
      if (!state.isLoading && !state.isAuthenticated && !hasRedirected.current) {
        hasRedirected.current = true;
        router.replace(LOGIN_PATH);
      }
    };

    verify();
  }, [pathname, router]); // Removed checkAuth from deps to avoid store-change loops


  return { isAuthenticated, isLoading };
}
