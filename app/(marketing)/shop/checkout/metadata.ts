import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Checkout | Complete Your Purchase",
  description: "Complete your purchase securely. We accept all major credit cards, PayPal, and other payment methods.",
  keywords: [
    "checkout",
    "secure payment",
    "payment",
    "purchase",
    "credit card",
    "paypal",
  ],
});
