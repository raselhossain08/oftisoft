import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Shopping Cart | Review Your Items",
  description: "Review the items in your cart and proceed to checkout. Secure payment processing with Stripe and PayPal.",
  keywords: [
    "shopping cart",
    "checkout",
    "review cart",
    "purchase",
    "digital assets",
  ],
  noIndex: false,
});
