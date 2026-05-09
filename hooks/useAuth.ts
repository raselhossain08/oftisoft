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
  ): Promise<{ success: boolean; requires2FA?: boolean; tempToken?: string; error?: string }> => {
    try {
      const result = await store.login(email, password, remember);
      // Check if 2FA is required
      if (result && 'requires2FA' in result && result.requires2FA) {
        return { 
          success: false, 
          requires2FA: true, 
          tempToken: result.tempToken,
          error: "2FA verification required" 
        };
      }
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      return { success: false, error: message };
    }
  };

  const handleRegister = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await store.register(name, email, phone, password);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      return { success: false, error: message };
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

  const handleVerify2FALogin = async (tempToken: string, code: string, remember?: boolean): Promise<{ success: boolean; error?: string }> => {
    try {
      await store.verify2FALogin(tempToken, code, remember);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "2FA verification failed";
      return { success: false, error: message };
    }
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    authCheckComplete: store.authCheckComplete,
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
    verify2FALogin: handleVerify2FALogin,
  };
}
