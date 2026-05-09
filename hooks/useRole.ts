"use client";

import { useAuth } from "./useAuth";

export type UserRole = "SuperAdmin" | "Admin" | "Editor" | "Support" | "Viewer";

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  SuperAdmin: 5,
  Admin: 4,
  Editor: 3,
  Support: 2,
  Viewer: 1,
};

export const ROLE_PERMISSIONS = {
  SuperAdmin: ["*"], // All permissions
  Admin: [
    "dashboard.view",
    "analytics.view",
    "users.manage",
    "users.ban",
    "products.manage",
    "products.approve",
    "orders.manage",
    "finance.view",
    "system.settings",
    "content.manage",
    "marketing.manage",
    "support.manage",
    // Affiliate permissions
    "affiliate.view",
    "affiliate.manage",
    "affiliate.admin",
    "affiliate.approve",
    "affiliate.commissions.manage",
    "affiliate.withdrawals.manage",
    "affiliate.settings",
  ],
  Editor: [
    "dashboard.view",
    "analytics.view",
    "products.manage",
    "orders.view",
    "content.manage",
    "marketing.manage",
    "support.view",
    // Affiliate permissions
    "affiliate.view",
    "affiliate.reports.view",
  ],
  Support: [
    "dashboard.view",
    "orders.view",
    "support.manage",
    "messages.view",
    // Affiliate permissions
    "affiliate.view",
    "affiliate.support.view",
  ],
  Viewer: [
    "dashboard.view",
    "orders.view.own",
    "downloads.view",
    "favorites.view",
    "billing.view",
    // Affiliate permissions - only their own
    "affiliate.view",
    "affiliate.earn",
    "affiliate.withdraw",
  ],
};

// Affiliate-specific permissions
export const AFFILIATE_PERMISSIONS = {
  VIEW_DASHBOARD: "affiliate.view",
  EARN_COMMISSIONS: "affiliate.earn",
  REQUEST_WITHDRAWAL: "affiliate.withdraw",
  VIEW_REPORTS: "affiliate.reports.view",
  VIEW_SUPPORT: "affiliate.support.view",
  MANAGE_AFFILIATES: "affiliate.manage",
  MANAGE_COMMISSIONS: "affiliate.commissions.manage",
  MANAGE_WITHDRAWALS: "affiliate.withdrawals.manage",
  ACCESS_ADMIN: "affiliate.admin",
  APPROVE_AFFILIATES: "affiliate.approve",
  ACCESS_SETTINGS: "affiliate.settings",
} as const;

export function useRole() {
  const { user } = useAuth();
  const userRole = (user?.role as UserRole) || "Viewer";

  const hasRole = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRoleLevel = ROLE_HIERARCHY[userRole];
    
    return roles.some(role => ROLE_HIERARCHY[role] <= userRoleLevel);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    return permissions.includes("*") || permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p));
  };

  const isSuperAdmin = userRole === "SuperAdmin";
  const isAdmin = hasRole(["SuperAdmin", "Admin"]);
  const isEditor = hasRole(["SuperAdmin", "Admin", "Editor"]);
  const isSupport = hasRole(["SuperAdmin", "Admin", "Support"]);
  const isStaff = hasRole(["SuperAdmin", "Admin", "Editor", "Support"]);

  return {
    userRole,
    hasRole,
    hasPermission,
    hasAnyPermission,
    isSuperAdmin,
    isAdmin,
    isEditor,
    isSupport,
    isStaff,
    roleLevel: ROLE_HIERARCHY[userRole],
  };
}

export function useCan(permission: string) {
  const { hasPermission } = useRole();
  return hasPermission(permission);
}
