"use client";

import { usePathname } from "next/navigation";
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

    // 1. BreadcrumbList
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

    // 2. FAQPage (critical for AEO — answer engine optimization)
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

    // 3. Speakable spec (AEO — Google Assistant, Alexa, Siri)
    if (pageData.aeoDescription) {
      result.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: pageData.breadcrumbs[pageData.breadcrumbs.length - 1]?.name || siteConfig.name,
        description: pageData.aeoDescription,
        url: canonicalUrl,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["main p", "main h1", "main h2", ".faq-content"],
        },
        isPartOf: {
          "@type": "WebSite",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      });
    }

    // 4. Page-specific type schema (GEO — generative engine optimization)
    const pageType = getPageType(pathname);
    if (pageType) {
      result.push(pageType);
    }

    return result;
  }, [pathname]);

  if (schemas.length === 0) return null;

  return (
    <>
      {schemas.map((schema, i) => (
        <script key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

function getPageType(pathname: string): Record<string, unknown> | null {
  const canonicalUrl = `${siteConfig.url}${pathname}`;

  switch (pathname) {
    case "/contact":
      return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: `Contact Us | ${siteConfig.name}`,
        description: "Contact Oftisoft for a free software development consultation. Get expert advice on your web, mobile, or AI project.",
        url: canonicalUrl,
        mainEntity: {
          "@type": "Organization",
          name: siteConfig.name,
          email: siteConfig.email,
          telephone: siteConfig.phone,
        },
      };

    case "/about":
      return {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: `About Us | ${siteConfig.name}`,
        description: "Learn about Oftisoft's journey since 2019, our mission, and the team behind our software solutions.",
        url: canonicalUrl,
        mainEntity: {
          "@type": "Organization",
          name: siteConfig.name,
          founder: { "@type": "Person", name: "Rasel Hossain" },
          foundingDate: "2019",
        },
      };

    case "/services":
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `Services | ${siteConfig.name}`,
        description: "Web development, mobile apps, AI solutions, and SaaS platform services.",
        url: canonicalUrl,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: [
            { "@type": "Service", name: "Web Development", url: `${siteConfig.url}/services/web` },
            { "@type": "Service", name: "Mobile App Development", url: `${siteConfig.url}/services/mobile` },
            { "@type": "Service", name: "AI & Machine Learning", url: `${siteConfig.url}/services/ai` },
            { "@type": "Service", name: "SaaS Development", url: `${siteConfig.url}/services/saas` },
          ],
        },
      };

    case "/portfolio":
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `Portfolio | ${siteConfig.name}`,
        description: "Browse our portfolio of successful software projects and case studies.",
        url: canonicalUrl,
        mainEntity: { "@type": "ItemList", name: "Software Projects" },
      };

    case "/blog":
      return {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: `Blog | ${siteConfig.name}`,
        description: "Software development insights, tutorials, and industry perspectives.",
        url: canonicalUrl,
      };

    case "/faq":
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        name: `FAQ | ${siteConfig.name}`,
        url: canonicalUrl,
      };

    default:
      return null;
  }
}

export default function SeoScripts() {
  return (
    <Suspense fallback={null}>
      <SeoScriptsInner />
    </Suspense>
  );
}
