import type { Metadata } from "next";
import { constructMetadata } from "@/lib/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Verify Email | Confirm Your Account",
  description: "Verify your email address to complete your account registration with Oftisoft.",
  keywords: [
    "verify email",
    "email verification",
    "confirm account",
    "activate account",
  ],
  noIndex: true,
});
