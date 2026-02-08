import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export function useAuth() {
  const router = useRouter();
  const store = useAuthStore();

  const handleLogin = async (
    email: string,
    password: string,
    remember?: boolean
  ) => {
    try {
      await store.login(email, password, remember);
      return { success: true as const };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      return { success: false as const, error: message };
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => {
    try {
      await store.register(name, email, phone, password);
      return { success: true as const };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      return { success: false as const, error: message };
    }
  };

  const handleLogout = async () => {
    try {
      await store.logout();
      toast.success("Signed out successfully");
      router.push("/dashboard/login");
    } catch {
      toast.error("Sign out failed");
      router.push("/dashboard/login");
    }
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkAuth: store.checkAuth,
    clearError: store.clearError,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
    verifyResetToken: store.verifyResetToken,
    setup2FA: store.setup2FA,
    verify2FA: store.verify2FA,
    disable2FA: store.disable2FA,
  };
}
