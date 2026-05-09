import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Blog | Insights, Tutorials & Tech News",
  description: "Read the latest insights on software development, technology trends, programming tutorials, and industry news from the Oftisoft team.",
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
