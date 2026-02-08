/**
 * Dashboard ↔ Marketing page mapping
 * Use for: "Edit in Dashboard" links, breadcrumbs, admin content navigation
 */

export const MARKETING_TO_DASHBOARD_CONTENT: Record<string, string> = {
  "/": "/dashboard/admin/content/home",
  "/about": "/dashboard/admin/content/about",
  "/blog": "/dashboard/admin/content/blog",
  "/services": "/dashboard/admin/content/services",
  "/portfolio": "/dashboard/admin/content/portfolio",
  "/pricing": "/dashboard/admin/content/pricing",
  "/careers": "/dashboard/admin/content/careers",
  "/contact": "/dashboard/admin/content/contact",
  "/integrations": "/dashboard/admin/content/integrations",
  "/partners": "/dashboard/admin/content/partners",
  "/features": "/dashboard/admin/content/features",
  "/docs": "/dashboard/admin/content/docs",
  "/community": "/dashboard/admin/content/community",
  "/changelog": "/dashboard/admin/content/changelog",
  "/support": "/dashboard/admin/content/support",
  "/status": "/dashboard/admin/content/status",
  "/privacy": "/dashboard/admin/content/privacy",
  "/terms": "/dashboard/admin/content/terms",
};

/** Content store name by marketing path (for use with lib/store/*-content) */
export const MARKETING_PATH_TO_STORE: Record<string, string> = {
  "/": "home-content",
  "/about": "about-content",
  "/blog": "blog-content",
  "/services": "services-content",
  "/portfolio": "portfolio-content",
  "/pricing": "pricing-content",
  "/careers": "careers-content",
  "/contact": "contact-content",
  "/integrations": "integrations-content",
  "/partners": "partners-content",
  "/features": "features-content",
  "/docs": "docs-content",
  "/community": "community-content",
  "/changelog": "changelog-content",
  "/support": "support-content",
  "/status": "status-content",
  "/privacy": "privacy-content",
  "/terms": "terms-content",
};

/** Get dashboard content editor URL for a marketing path */
export function getDashboardContentUrl(marketingPath: string): string {
  const normalized = marketingPath.replace(/\/$/, "") || "/";
  return MARKETING_TO_DASHBOARD_CONTENT[normalized] ?? "/dashboard/admin/content";
}
