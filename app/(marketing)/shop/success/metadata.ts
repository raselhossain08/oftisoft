import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Order Successful | Thank You for Your Purchase",
  description: "Thank you for your purchase! Your order has been confirmed and you will receive an email with download instructions.",
  keywords: [
    "order success",
    "thank you",
    "purchase complete",
    "download",
    "confirmation",
  ],
});
