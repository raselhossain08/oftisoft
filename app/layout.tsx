import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { CartSheet } from "@/components/cart-sheet"; // Import added correctly
import { AnalyticsTracker } from "@/components/analytics-tracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import SmoothScroller from "@/components/smooth-scroller";
import { QueryProvider } from "@/lib/api/queries";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "Ofitsoft - Premium Software Solutions",
  description: "Transforming digital visions into reality with modern high-performance software.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>
            <AnalyticsTracker />
            <SmoothScroller>{children}</SmoothScroller>
            <CartSheet />
          </AuthProvider>
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
