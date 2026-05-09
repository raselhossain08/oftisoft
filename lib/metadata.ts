import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/lib/site-config";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Oftisoft",
    "software development",
    "web development",
    "mobile apps",
    "AI solutions",
    "SaaS development",
    "Bangladesh software company",
    "enterprise solutions",
    "digital transformation",
    "custom software",
    "React development",
    "Next.js development",
    "Node.js",
    "TypeScript",
    "full-stack development",
  ],
  authors: [
    {
      name: "Rasel Hossain",
      url: "https://github.com/rasel",
    },
  ],
  creator: "Rasel Hossain",
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "en": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.jpg`],
    creator: "@oftisoft",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon-16x16.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
  category: "technology",
  classification: "Business, Software Development, Technology",
  referrer: "origin-when-cross-origin",
};

export const defaultViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030014" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark",
};

export function constructMetadata({
  title,
  description,
  image,
  noIndex = false,
  keywords = [],
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
} = {}): Metadata {
  return {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description: description || siteConfig.description,
    keywords: [...defaultMetadata.keywords || [], ...keywords],
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: title || siteConfig.name,
            },
          ]
        : defaultMetadata.openGraph?.images,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: image ? [image] : defaultMetadata.twitter?.images,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export const jsonLdSchemas = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.twitter,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: siteConfig.email,
      telephone: siteConfig.phone,
      contactType: "customer service",
      availableLanguage: "English",
      areaServed: "Global",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sultanpur Sahapara",
      addressLocality: "Satkhira",
      addressRegion: "Khulna",
      postalCode: "9400",
      addressCountry: "Bangladesh",
    },
    founder: {
      "@type": "Person",
      name: "Rasel Hossain",
      jobTitle: "Founder & CEO",
    },
    foundingDate: "2019",
    description: siteConfig.description,
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },

  softwareApplication: (product: any) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    url: `${siteConfig.url}/shop/${product.slug}`,
    image: product.image || `${siteConfig.url}/og-image.jpg`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web, Mobile",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/shop/${product.slug}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating || 4.5,
      reviewCount: product.reviews || 0,
    },
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }),

  service: (service: any) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title || service.name,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: "Global",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title || service.name,
            description: service.description,
          },
        },
      ],
    },
  }),

  article: (post: any) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.description,
    image: post.coverImage || `${siteConfig.url}/og-image.jpg`,
    datePublished: post.date || post.createdAt,
    dateModified: post.updatedAt || post.date || post.createdAt,
    author: {
      "@type": "Person",
      name: post.author?.name || "Oftisoft Team",
      url: `${siteConfig.url}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/blog/${post.slug || post.id}`,
    },
  }),

  breadcrumb: (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  }),

  faqPage: (faqs: { question: string; answer: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }),

  localBusiness: {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    image: `${siteConfig.url}/og-image.jpg`,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sultanpur Sahapara",
      addressLocality: "Satkhira",
      addressRegion: "Khulna",
      postalCode: "9400",
      addressCountry: "Bangladesh",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 22.7183,
      longitude: 89.0707,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [
      siteConfig.links.github,
      siteConfig.links.linkedin,
      siteConfig.links.twitter,
    ],
  },
};
