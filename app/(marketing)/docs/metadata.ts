import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Documentation | Developer Docs",
  description: "Comprehensive documentation for Oftisoft products, APIs, and development resources.",
  keywords: [
    "documentation",
    "developer docs",
    "API documentation",
    "software documentation",
    "technical docs",
  ],
});
