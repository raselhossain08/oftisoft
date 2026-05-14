import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { CartSheet } from "@/components/cart-sheet";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { ErrorBoundary } from "@/components/error-boundary";
import { defaultMetadata, defaultViewport } from "@/lib/metadata";
import { jsonLdSchemas } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

import SmoothScroller from "@/components/smooth-scroller";
import { QueryProvider } from "@/lib/api/queries";
import { AuthProvider } from "@/components/auth-provider";
import SeoScripts from "@/components/seo-scripts";

export const metadata: Metadata = defaultMetadata;
export const viewport: Viewport = defaultViewport;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      dir="ltr"
      className="dark" 
      suppressHydrationWarning
    >
      <head>
        <meta name="msapplication-TileColor" content="#030014" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchemas.organization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchemas.website),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchemas.localBusiness),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <AnalyticsTracker />
              <SmoothScroller>
                {children}
              </SmoothScroller>
              <CartSheet />
              <SeoScripts />
            </AuthProvider>
            <Toaster richColors position="top-right" />
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
