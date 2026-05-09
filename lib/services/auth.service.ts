/**
 * Auth Service - API layer for authentication
 * Uses httpOnly cookies (tokens never touch JS)
 * All requests include credentials for cookie transmission
 */

import { getIsLoggingOut } from "@/store/useAuthStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  role: string;
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken?: string;
  requires2FA?: boolean;
  tempToken?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface AuthCheckResponse {
  authenticated: boolean;
  user: User | null;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}

function getErrorMessage(error: ApiError | unknown): string {
  if (!error || typeof error !== "object") return "Something went wrong";
  const err = error as ApiError;
  if (typeof err.message === "string") return err.message;
  if (Array.isArray(err.message)) return err.message[0] || "Validation failed";
  return "Something went wrong";
}

// Helper to check if auth cookies exist
// Note: This only checks non-httpOnly cookies. For httpOnly cookies,
// the browser will automatically send them with credentials: "include"
function hasAuthCookies(): boolean {
  // Check for access_token or refresh_token cookies
  return document.cookie.includes('access_token=') || document.cookie.includes('refresh_token=');
}

async function authFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  // Skip auth check/refresh calls only if no cookies exist at all
  // For httpOnly cookies, we can't detect them via JS, so we always try the request
  // and let the server respond with 401 if truly unauthenticated
  if ((endpoint === "/auth/refresh") && !hasAuthCookies()) {
    throw new Error("No auth cookies");
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Handle Token Expiration (401)
  // Don't retry if user is logging out
  if (res.status === 401 && !isRetry && endpoint !== "/auth/login" && endpoint !== "/auth/refresh" && !getIsLoggingOut()) {
    try {
      // Don't try to refresh if no cookies exist
      if (!hasAuthCookies()) {
        throw new Error("No auth cookies");
      }
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshRes.ok) {
        // Retry the original request
        return authFetch<T>(endpoint, options, true);
      } else if (refreshRes.status === 401) {
        // Refresh token expired or invalid - clear auth state
        // This will trigger a redirect to login via the protected route hook
        throw new Error("Session expired. Please log in again.");
      }
    } catch (error: any) {
      // Refresh failed - propagate specific error message
      if (error.message?.includes("Session expired") || error.message?.includes("invalidated")) {
        throw error;
      }
      // Other errors proceed to standard error handling
    }
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data as T;
}

export const authService = {
  async login(
    email: string,
    password: string,
    remember = false
  ): Promise<LoginResponse> {
    return authFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, remember }),
    });
  },

  async register(
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<RegisterResponse & { isAutoLogin?: boolean }> {
    return authFetch<RegisterResponse & { isAutoLogin?: boolean }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password }),
    });
  },

  async logout(): Promise<{ message: string }> {
    return authFetch<{ message: string }>("/auth/logout", {
      method: "POST",
    });
  },

  async checkAuth(): Promise<AuthCheckResponse> {
    try {
      return await authFetch<AuthCheckResponse>("/auth/check", { method: "GET" });
    } catch {
      return { authenticated: false, user: null };
    }
  },

  async verify2FALogin(tempToken: string, code: string, remember?: boolean): Promise<LoginResponse> {
    return authFetch<LoginResponse>("/auth/2fa/verify-login", {
      method: "POST",
      body: JSON.stringify({ tempToken, code, remember }),
    });
  },

  async refreshToken(): Promise<{ message: string; accessToken: string }> {
    return authFetch("/auth/refresh", { method: "POST" });
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return authFetch<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    return authFetch<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    });
  },

  async verifyResetToken(token: string): Promise<{ valid: boolean }> {
    const data = await authFetch<{ valid: boolean }>(
      `/auth/verify-reset-token?token=${encodeURIComponent(token)}`,
      { method: "GET" }
    );
    return data;
  },

  async setup2FA(): Promise<{ secret: string; qrCode: string }> {
    return authFetch("/auth/2fa/setup", { method: "POST" });
  },

  async verify2FA(code: string): Promise<{ message: string }> {
    return authFetch("/auth/2fa/verify", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },

  async disable2FA(code: string): Promise<{ message: string }> {
    return authFetch("/auth/2fa/disable", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },
};
