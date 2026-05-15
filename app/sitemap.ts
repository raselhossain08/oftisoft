import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Fetch products for dynamic sitemap
async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((p: any) => ({
      url: `/shop/${p.slug || p.id}`,
      lastModified: new Date(p.updatedAt || Date.now()).toISOString(),
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

// Fetch blog posts for dynamic sitemap
async function fetchBlogPosts() {
  try {
    const res = await fetch(`${API_URL}/posts?status=published`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const posts = data.posts || data;
    return posts.map((b: any) => ({
      url: `/blog/${b.slug || b.id}`,
      lastModified: new Date(b.updatedAt || b.publishedAt || Date.now()).toISOString(),
      priority: 0.6,
    }));
  } catch {
    return [];
  }
}

// Fetch portfolio projects for dynamic sitemap
async function fetchProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((p: any) => ({
      url: `/portfolio/${p.slug || p.id}`,
      lastModified: new Date(p.updatedAt || Date.now()).toISOString(),
      priority: 0.8,
    }));
  } catch {
    return [];
  }
}

// Fetch events for dynamic sitemap
async function fetchEvents() {
  try {
    const res = await fetch(`${API_URL}/events?status=published`, {
      next: { revalidate: 3600 }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((e: any) => ({
      url: `/events/${e.slug || e.id}`,
      lastModified: new Date(e.updatedAt || Date.now()).toISOString(),
      priority: 0.7,
    }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    // Core pages
    { url: "", priority: 1, changeFrequency: "daily" as const },
    { url: "/about", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/portfolio", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/blog", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/events", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/pricing", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/shop", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/shop/cart", priority: 0.3, changeFrequency: "always" as const },
    { url: "/shop/compare", priority: 0.4, changeFrequency: "always" as const },
    { url: "/shop/checkout", priority: 0.3, changeFrequency: "always" as const },

    // Company pages
    { url: "/features", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/integrations", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/careers", priority: 0.6, changeFrequency: "weekly" as const },
    { url: "/partners", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/tools", priority: 0.6, changeFrequency: "monthly" as const },
    { url: "/community", priority: 0.6, changeFrequency: "weekly" as const },
    { url: "/changelog", priority: 0.5, changeFrequency: "weekly" as const },
    { url: "/docs", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/support", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/status", priority: 0.5, changeFrequency: "daily" as const },

    // Legal pages
    { url: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  // Fetch dynamic routes in parallel
  const [products, blogPosts, projects, events] = await Promise.all([
    fetchProducts(),
    fetchBlogPosts(),
    fetchProjects(),
    fetchEvents(),
  ]);

  // Combine all routes
  const allRoutes = [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route.url}`,
      lastModified: new Date().toISOString(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...products.map((p: any) => ({
      url: `${siteConfig.url}${p.url}`,
      lastModified: p.lastModified,
      changeFrequency: "weekly" as const,
      priority: p.priority,
    })),
    ...blogPosts.map((b: any) => ({
      url: `${siteConfig.url}${b.url}`,
      lastModified: b.lastModified,
      changeFrequency: "monthly" as const,
      priority: b.priority,
    })),
    ...projects.map((p: any) => ({
      url: `${siteConfig.url}${p.url}`,
      lastModified: p.lastModified,
      changeFrequency: "monthly" as const,
      priority: p.priority,
    })),
    ...events.map((e: any) => ({
      url: `${siteConfig.url}${e.url}`,
      lastModified: e.lastModified,
      changeFrequency: "weekly" as const,
      priority: e.priority,
    })),
  ];

  return allRoutes;
}
