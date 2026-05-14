import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Blog | Insights, Tutorials & Tech News",
  description: "Looking for expert software development insights? Read the Oftisoft blog for tutorials on React, Next.js, Node.js, and AI development, plus industry trends, best practices, and case studies from our engineering team.",
  keywords: [
    "software development blog",
    "tech blog",
    "programming tutorials",
    "web development tips",
    "mobile development",
    "AI insights",
    "technology trends",
    "coding best practices",
  ],
});
