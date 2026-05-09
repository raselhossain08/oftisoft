"use client";

import { useRole, UserRole } from "@/hooks/useRole";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback,
  redirectTo = "/dashboard" 
}: RoleGuardProps) {
  const { hasRole, userRole } = useRole();
  const router = useRouter();
  const hasAccess = hasRole(allowedRoles);

  useEffect(() => {
    if (!hasAccess && redirectTo) {
      router.push(redirectTo);
    }
  }, [hasAccess, redirectTo, router]);

  if (!hasAccess) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You need {allowedRoles.join(" or ")} permissions to access this page.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Your current role: <span className="font-medium text-primary">{userRole}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

interface PermissionGuardProps {
  children: ReactNode;
  permission: string;
  fallback?: ReactNode;
}

export function PermissionGuard({ 
  children, 
  permission, 
  fallback = null 
}: PermissionGuardProps) {
  const { hasPermission } = useRole();
  
  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const roleColors: Record<UserRole, string> = {
    SuperAdmin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Admin: "bg-red-500/10 text-red-500 border-red-500/20",
    Editor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Support: "bg-green-500/10 text-green-500 border-green-500/20",
    Viewer: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[role]} ${className}`}
    >
      {role}
    </span>
  );
}

// HOC for role-based page protection
export function withRoleProtection(
  Component: React.ComponentType,
  allowedRoles: UserRole[]
) {
  return function ProtectedComponent(props: any) {
    return (
      <RoleGuard allowedRoles={allowedRoles}>
        <Component {...props} />
      </RoleGuard>
    );
  };
}
