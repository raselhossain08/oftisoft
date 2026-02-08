import { create } from "zustand";
import {
  authService,
  type User,
} from "@/lib/services/auth.service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  login: (
    email: string,
    password: string,
    remember?: boolean
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;

  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyResetToken: (token: string) => Promise<boolean>;

  setup2FA: () => Promise<{ secret: string; qrCode: string }>;
  verify2FA: (code: string) => Promise<void>;
  disable2FA: (code: string) => Promise<void>;
}

export type { User };

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  login: async (email, password, remember = false) => {
    set({ isLoading: true, error: null });
    try {
      const { user } = await authService.login(email, password, remember);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      set({
        error: message,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      throw err;
    }
  },

  register: async (name, email, phone, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.register(name, email, phone, password);
      set({ isLoading: false, error: null });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  checkAuth: async () => {
    const { isLoading, isAuthenticated } = get();
    if (isLoading) return;

    // Only show loading spinner if we aren't already authenticated
    if (!isAuthenticated) {
      set({ isLoading: true });
    }
    try {
      const { authenticated, user } = await authService.checkAuth();
      if (authenticated && user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.forgotPassword(email);
      set({ isLoading: false, error: null });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset email";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(token, password);
      set({ isLoading: false, error: null });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Password reset failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  verifyResetToken: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const { valid } = await authService.verifyResetToken(token);
      set({ isLoading: false });
      return valid;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  setup2FA: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await authService.setup2FA();
      set({ isLoading: false, error: null });
      return result;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "2FA setup failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  verify2FA: async (code) => {
    set({ isLoading: true, error: null });
    try {
      await authService.verify2FA(code);
      const { user } = get();
      if (user) {
        set({
          user: { ...user, isTwoFactorEnabled: true },
          isLoading: false,
          error: null,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid 2FA code";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  disable2FA: async (code) => {
    set({ isLoading: true, error: null });
    try {
      await authService.disable2FA(code);
      const { user } = get();
      if (user) {
        set({
          user: { ...user, isTwoFactorEnabled: false },
          isLoading: false,
          error: null,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to disable 2FA";
      set({ error: message, isLoading: false });
      throw err;
    }
  },
}));
