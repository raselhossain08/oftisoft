import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service | Legal Agreement",
  description: "Read Oftisoft's Terms of Service. These terms govern your use of our website, products, and services. Last updated regularly.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "legal terms",
    "service agreement",
  ],
});
