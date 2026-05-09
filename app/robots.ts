import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/services",
          "/portfolio",
          "/blog",
          "/events",
          "/contact",
          "/pricing",
          "/shop",
          "/features",
          "/integrations",
          "/careers",
          "/partners",
          "/community",
          "/changelog",
          "/docs",
          "/support",
          "/status",
          "/terms",
          "/privacy",
        ],
        disallow: [
          "/dashboard",
          "/api",
          "/_next",
          "/admin",
          "/private",
          "/internal",
          "/draft",
          "/*.json",
          "/*.xml",
          "/cgi-bin",
          "/wp-admin",
          "/wp-includes",
          "/wp-content",
          "/wordpress",
          "/wp",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/dashboard",
          "/api",
        ],
      },
      {
        userAgent: "Googlebot-Image",
        allow: [
          "/og-image.jpg",
          "/images",
          "/products",
        ],
      },
      {
        userAgent: "Googlebot-News",
        allow: [
          "/blog",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/dashboard",
          "/api",
        ],
      },
      {
        userAgent: "Slurp",
        allow: "/",
        disallow: [
          "/dashboard",
          "/api",
        ],
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: [
          "/dashboard",
          "/api",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
