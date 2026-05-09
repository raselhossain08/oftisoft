import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = constructMetadata({
  title: "Premium Software Development | Web, Mobile & AI Solutions",
  description: `Leading software development company based in ${siteConfig.address.country}. We specialize in web applications, mobile apps, AI solutions, and enterprise software. Transform your digital vision into reality with Oftisoft.`,
  keywords: [
    "software development company",
    "web development services",
    "mobile app development",
    "AI development",
    "enterprise software",
    "SaaS development",
    "custom software development",
    "React development",
    "Next.js development",
    "full-stack development",
    "digital transformation",
    "Bangladesh software company",
  ],
});
