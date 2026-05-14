"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { siteConfig } from "@/lib/site-config";
import { getPageSeoData } from "@/lib/seo-content";

function SeoScriptsInner() {
  const pathname = usePathname();

  const schemas = useMemo(() => {
    const result: Record<string, unknown>[] = [];
    const pageData = getPageSeoData(pathname);
    if (!pageData) return [];

    const canonicalUrl = `${siteConfig.url}${pathname}`;

    // BreadcrumbList
    if (pageData.breadcrumbs.length > 0) {
      result.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: pageData.breadcrumbs.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${siteConfig.url}${item.url}`,
        })),
      });
    }

    // FAQPage (critical for AEO)
    if (pageData.faqs.length > 0) {
      result.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: pageData.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    // WebPage schema
    const pageName = pageData.breadcrumbs[pageData.breadcrumbs.length - 1]?.name || siteConfig.name;
    result.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `${pageName} | ${siteConfig.name}`,
      description: pageData.aeoDescription,
      url: canonicalUrl,
      isPartOf: {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
      },
    });

    return result;
  }, [pathname]);

  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

export default function SeoScripts() {
  return (
    <Suspense fallback={null}>
      <SeoScriptsInner />
    </Suspense>
  );
}
