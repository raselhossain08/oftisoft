import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Support | Help Center",
  description: "Need help with Oftisoft products or services? Browse our FAQ section, search the knowledge base, submit a support ticket, or contact our team for personalized assistance. We respond within 24 hours.",
  keywords: [
    "support",
    "help center",
    "technical support",
    "customer support",
    "FAQs",
    "troubleshooting",
  ],
});
